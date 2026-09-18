import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const line of env.split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CID,
        GOOGLE_ADS_CLIENT_SECRET: CS, GOOGLE_ADS_REFRESH_TOKEN: RT,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LCID, GOOGLE_ADS_CUSTOMER_ID: CUID } = vars;

const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CID, client_secret: CS, refresh_token: RT, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();
const h = { Authorization: "Bearer " + access_token, "developer-token": DEV, "login-customer-id": LCID, "Content-Type": "application/json" };
const CAMP = "23946171105";

async function q(query) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CUID}/googleAds:search`, { method: "POST", headers: h, body: JSON.stringify({ query }) });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.results ?? [];
}

// Campaign budget + status
const camp = await q(`SELECT campaign.name, campaign.status, campaign_budget.amount_micros, campaign.bidding_strategy_type FROM campaign WHERE campaign.id = ${CAMP}`);
console.log("\n── Campaign ─────────────────────────────────────");
camp.forEach(r => {
  const budget = r.campaignBudget ? "$" + (r.campaignBudget.amountMicros / 1e6).toFixed(2) + "/day" : "NO BUDGET SET";
  console.log(`  Status  : ${r.campaign.status}`);
  console.log(`  Budget  : ${budget}`);
  console.log(`  Bidding : ${r.campaign.biddingStrategyType}`);
});

// Ad groups
const adGroups = await q(`SELECT ad_group.id, ad_group.name, ad_group.status, ad_group.cpc_bid_micros FROM ad_group WHERE campaign.id = ${CAMP}`);
console.log("\n── Ad Groups ────────────────────────────────────");
if (!adGroups.length) console.log("  NONE");
adGroups.forEach(r => console.log(`  [${r.adGroup.id}] ${r.adGroup.name} — ${r.adGroup.status} — bid $${(r.adGroup.cpcBidMicros/1e6).toFixed(2)}`));

// Ads
const ads = await q(`SELECT ad_group_ad.ad.id, ad_group_ad.ad.type, ad_group_ad.status, ad_group_ad.ad.final_urls, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad WHERE campaign.id = ${CAMP}`);
console.log("\n── Ads ──────────────────────────────────────────");
if (!ads.length) console.log("  NONE — no ads created yet");
ads.forEach(r => {
  const a = r.adGroupAd.ad;
  console.log(`  [${a.id}] ${a.type} — ${r.adGroupAd.status}`);
  console.log(`  Final URL: ${(a.finalUrls ?? []).join(", ") || "NONE"}`);
});

// Keywords
const kws = await q(`SELECT ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status FROM ad_group_criterion WHERE campaign.id = ${CAMP} AND ad_group_criterion.type = 'KEYWORD'`);
console.log("\n── Keywords ─────────────────────────────────────");
console.log(`  Count: ${kws.length}`);
kws.slice(0, 5).forEach(r => console.log(`  "${r.adGroupCriterion.keyword.text}" [${r.adGroupCriterion.keyword.matchType}]`));
if (kws.length > 5) console.log(`  ... and ${kws.length - 5} more`);

// Conversion actions
const convs = await q(`SELECT conversion_action.name, conversion_action.status, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'`);
console.log("\n── Conversion Actions ───────────────────────────");
convs.forEach(r => console.log(`  ${r.conversionAction.name} [${r.conversionAction.type}]`));

console.log("\n─────────────────────────────────────────────────\n");
