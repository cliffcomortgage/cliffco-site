/**
 * set_heloc_mn_bidding.mjs
 *
 * Switches Minnesota — HELOC & Cash-Out Refinance from Maximize Conversions to
 * Maximize Clicks with a $10.00 cost-per-click ceiling.
 *
 * Why: the campaign has never recorded a conversion, so Maximize Conversions has no
 * signal to optimise against and bids blind - $33 to $38 on single clicks. At a $23
 * average cost per click and a $35 daily budget, that is about 1.5 clicks a day, which
 * cannot produce conversions at any conversion rate. For comparison, the NJ campaign runs
 * Maximize Clicks at $1.84 a click and gets 179 clicks a week.
 *
 * Maximize Clicks needs no conversion history. The ceiling is the safety rail: no single
 * click above $10.
 *
 * Switch back to Maximize Conversions once 15-30 conversions are on record - smart bidding
 * beats this once it has something to learn from, and not before.
 *
 * In the API, Maximize Clicks is `target_spend`. Setting it replaces maximize_conversions.
 *
 * Run:  node Code/set_heloc_mn_bidding.mjs            (dry run, prints current + proposed)
 *       node Code/set_heloc_mn_bidding.mjs --apply
 *       node Code/set_heloc_mn_bidding.mjs --revert   (back to Maximize Conversions)
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
const REVERT = process.argv.includes("--revert");

const CAMPAIGN_ID = "24280317553";
const CPC_CEILING_USD = 10.0;

const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;
const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;

const hdrs = (t) => ({
  Authorization: `Bearer ${t}`, "developer-token": DEV,
  "login-customer-id": LOGIN_CID, "Content-Type": "application/json",
});

async function auth() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`OAuth ${r.status}: ${j.error ?? ""}`);
  return j.access_token;
}
async function search(token, query) {
  const r = await fetch(`${BASE}/googleAds:search`, { method: "POST", headers: hdrs(token), body: JSON.stringify({ query }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`search ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}
async function mutate(token, operations) {
  const r = await fetch(`${BASE}/campaigns:mutate`, { method: "POST", headers: hdrs(token), body: JSON.stringify({ operations }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`campaigns ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d;
}

const state = async (token) => {
  const [row] = await search(token, `
    SELECT campaign.id, campaign.name, campaign.status, campaign.bidding_strategy_type,
           campaign.target_spend.cpc_bid_ceiling_micros, campaign_budget.amount_micros
    FROM campaign WHERE campaign.id = ${CAMPAIGN_ID}`);
  if (!row) throw new Error("campaign not found");
  return row;
};

const show = (label, row) => {
  const ceil = row.campaign.targetSpend?.cpcBidCeilingMicros;
  console.log(`${label}`);
  console.log(`  name    : ${row.campaign.name}`);
  console.log(`  status  : ${row.campaign.status}`);
  console.log(`  bidding : ${row.campaign.biddingStrategyType}`);
  console.log(`  cpc cap : ${ceil ? "$" + (Number(ceil) / 1e6).toFixed(2) : "none"}`);
  console.log(`  budget  : $${(Number(row.campaignBudget?.amountMicros ?? 0) / 1e6).toFixed(2)}/day`);
};

const main = async () => {
  const token = await auth();
  const before = await state(token);
  show("CURRENT", before);

  if (REVERT) {
    if (!APPLY) { console.log("\nWould revert to MAXIMIZE_CONVERSIONS. Add --apply."); return; }
    await mutate(token, [{
      update: { resourceName: `customers/${CID}/campaigns/${CAMPAIGN_ID}`, maximizeConversions: {} },
      updateMask: "maximize_conversions",
    }]);
    show("\nAFTER REVERT", await state(token));
    return;
  }

  console.log(`\nPROPOSED`);
  console.log(`  bidding : MAXIMIZE_CONVERSIONS -> TARGET_SPEND (Maximize Clicks)`);
  console.log(`  cpc cap : $${CPC_CEILING_USD.toFixed(2)} per click`);
  console.log(`  budget  : unchanged`);

  if (!APPLY) {
    console.log("\nDRY RUN. Nothing changed. Re-run with --apply.");
    console.log("To undo later: node Code/set_heloc_mn_bidding.mjs --revert --apply");
    return;
  }

  await mutate(token, [{
    update: {
      resourceName: `customers/${CID}/campaigns/${CAMPAIGN_ID}`,
      targetSpend: { cpcBidCeilingMicros: String(Math.round(CPC_CEILING_USD * 1e6)) },
    },
    updateMask: "target_spend.cpc_bid_ceiling_micros",
  }]);

  const after = await state(token);
  show("\nAFTER", after);
  const ok = after.campaign.biddingStrategyType === "TARGET_SPEND";
  console.log(`\n${ok ? "✓ Applied." : "✗ Bidding strategy did not change - check the campaign in the UI."}`);
  if (ok) console.log("To undo: node Code/set_heloc_mn_bidding.mjs --revert --apply");
};

main().catch((e) => { console.error("\n✗", e.message); process.exit(1); });
