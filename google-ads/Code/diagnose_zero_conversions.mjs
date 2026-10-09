/**
 * diagnose_zero_conversions.mjs
 *
 * Why a campaign can spend with zero recorded conversions. Read-only: it changes nothing.
 *
 * Two of the three actions on the "investigate zero conversions" recommendation are not Ads
 * API work at all - whether gtag fires on a HubSpot submit is a browser question, and Tag
 * Assistant is a manual tool. What the API *can* settle, and what is the most common cause
 * when the page code looks right, is the conversion-action setup:
 *
 *   1. Does the conversion label hard-coded in the landing page map to a real, ENABLED
 *      conversion action in this account?
 *   2. Is that action PRIMARY for its goal? A SECONDARY action records conversions but they
 *      do NOT appear in the campaign's "Conversions" column - which looks exactly like
 *      broken tracking.
 *   3. Has the action ever recorded a conversion from anywhere, or is it dead on arrival?
 *   4. What are people actually searching to trigger these clicks?
 *
 * Usage:
 *   node Code/diagnose_zero_conversions.mjs                      # all campaigns, 30 days
 *   node Code/diagnose_zero_conversions.mjs "Minnesota — HELOC"   # filter by name substring
 *   node Code/diagnose_zero_conversions.mjs "Minnesota — HELOC" 60
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const NAME_FILTER = process.argv[2] ?? "";
const DAYS = Number(process.argv[3] ?? 30);
const RANGE = DAYS === 30 ? "LAST_30_DAYS" : DAYS === 7 ? "LAST_7_DAYS" : "LAST_30_DAYS";

// Conversion labels compiled into the Minnesota landing pages. Keep in step with
// microsites/cliffcomn/src/pages/*/index.astro.
const PAGE_LABELS = [
  { page: "cliffcomn.com/heloc-minnesota/", label: "8n2gCInJqIAdEKfe_b5C" },
  { page: "cliffcomn.com/dscr-loans-minnesota/", label: "jWcrCIr7yvwcEKfe_b5C" },
];

// ---------- auth ----------
const vars = {};
for (const line of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
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
const tokenJson = await tr.json();
if (!tr.ok || !tokenJson.access_token) {
  console.error(`✗ OAuth refresh failed (${tr.status}): ${tokenJson.error ?? "?"} - ${tokenJson.error_description ?? ""}`);
  process.exit(1);
}

async function query(gaql) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CUID}/googleAds:search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenJson.access_token}`, "developer-token": DEV,
      "login-customer-id": LCID, "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: gaql }),
  });
  const d = await r.json();
  if (!r.ok) {
    const detail = d?.error?.details?.[0]?.errors?.[0];
    throw new Error(`${r.status} ${d?.error?.message ?? ""}${detail ? " :: " + JSON.stringify(detail.errorCode) : ""}`);
  }
  return d.results ?? [];
}

const usd = (micros) => "$" + (Number(micros ?? 0) / 1e6).toFixed(2);
const pad = (s, n) => String(s).padEnd(n);
const hr = (t) => console.log("\n" + "=".repeat(78) + "\n" + t + "\n" + "=".repeat(78));

// ---------- 1. campaign performance ----------
hr(`1. CAMPAIGN PERFORMANCE (${RANGE})`);
const camps = await query(`
  SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
         metrics.cost_micros, metrics.clicks, metrics.impressions,
         metrics.conversions, metrics.all_conversions, metrics.conversions_value
  FROM campaign
  WHERE segments.date DURING ${RANGE} AND campaign.status != 'REMOVED'
  ORDER BY metrics.cost_micros DESC
`);
const matched = camps.filter((c) => !NAME_FILTER || c.campaign.name.toLowerCase().includes(NAME_FILTER.toLowerCase()));
if (!matched.length) {
  console.log(`No campaigns matched "${NAME_FILTER}". Available:`);
  camps.forEach((c) => console.log("   - " + c.campaign.name));
  process.exit(0);
}
console.log(pad("CAMPAIGN", 44) + pad("SPEND", 11) + pad("CLICKS", 8) + pad("CONV", 7) + "ALL_CONV");
for (const c of matched) {
  const m = c.metrics ?? {};
  console.log(
    pad(c.campaign.name.slice(0, 43), 44) + pad(usd(m.costMicros), 11) +
    pad(m.clicks ?? 0, 8) + pad(Number(m.conversions ?? 0).toFixed(1), 7) +
    Number(m.allConversions ?? 0).toFixed(1)
  );
}
console.log(`
  Reading it: "CONV" is the column the recommendation calls zero. "ALL_CONV" counts every
  conversion action including the SECONDARY ones. ALL_CONV > CONV means the tag IS firing
  and the action simply is not primary - a settings fix, not a tracking fix.`);

// ---------- 2. conversion actions ----------
hr("2. CONVERSION ACTIONS IN THIS ACCOUNT");
const actions = await query(`
  SELECT conversion_action.id, conversion_action.name, conversion_action.status,
         conversion_action.type, conversion_action.category,
         conversion_action.primary_for_goal, conversion_action.counting_type,
         conversion_action.tag_snippets
  FROM conversion_action
  ORDER BY conversion_action.name ASC
`);
if (!actions.length) {
  console.log("  ✗ No conversion actions exist. Nothing can ever be recorded.");
} else {
  console.log(pad("NAME", 36) + pad("STATUS", 10) + pad("PRIMARY", 9) + pad("TYPE", 22) + "ID");
  for (const a of actions) {
    const ca = a.conversionAction;
    console.log(
      pad((ca.name ?? "").slice(0, 35), 36) + pad(ca.status ?? "?", 10) +
      pad(ca.primaryForGoal === false ? "SECONDARY" : "primary", 9) +
      pad(ca.type ?? "?", 22) + (ca.id ?? "?")
    );
  }
}

// ---------- 3. do the page labels resolve? ----------
hr("3. DO THE LANDING-PAGE CONVERSION LABELS RESOLVE?");
for (const { page, label } of PAGE_LABELS) {
  const hit = actions.find((a) =>
    JSON.stringify(a.conversionAction.tagSnippets ?? []).includes(label));
  if (!hit) {
    console.log(`  ✗ ${page}
      label ${label} matches NO conversion action in this account.
      The page is firing into the void. This alone explains zero conversions.`);
  } else {
    const ca = hit.conversionAction;
    const flags = [];
    if (ca.status !== "ENABLED") flags.push(`status is ${ca.status}, not ENABLED`);
    if (ca.primaryForGoal === false) flags.push(`SECONDARY - excluded from the "Conversions" column`);
    console.log(`  ${flags.length ? "✗" : "✓"} ${page}
      label ${label} -> "${ca.name}" (id ${ca.id}, ${ca.status}, ${ca.primaryForGoal === false ? "SECONDARY" : "primary"})`);
    flags.forEach((f) => console.log(`      ! ${f}`));
  }
}

// ---------- 4. has each action ever recorded anything? ----------
hr(`4. CONVERSIONS BY ACTION, ACCOUNT-WIDE (${RANGE})`);
const byAction = await query(`
  SELECT conversion_action.name, conversion_action.id, metrics.all_conversions
  FROM conversion_action
  WHERE segments.date DURING ${RANGE}
`);
const totals = new Map();
for (const r of byAction) {
  const k = r.conversionAction?.name ?? "?";
  totals.set(k, (totals.get(k) ?? 0) + Number(r.metrics?.allConversions ?? 0));
}
if (!totals.size) console.log("  (no conversion rows returned for this period)");
for (const [name, n] of [...totals.entries()].sort((a, b) => b[1] - a[1])) {
  console.log("  " + pad(name.slice(0, 44), 46) + n.toFixed(1) + (n === 0 ? "   <-- never fired" : ""));
}

// ---------- 5. search terms ----------
hr(`5. SEARCH TERMS FOR THE MATCHED CAMPAIGN(S) (${RANGE})`);
const ids = matched.map((c) => c.campaign.id);
const terms = await query(`
  SELECT search_term_view.search_term, campaign.name,
         metrics.clicks, metrics.cost_micros, metrics.conversions
  FROM search_term_view
  WHERE segments.date DURING ${RANGE} AND campaign.id IN (${ids.join(",")})
  ORDER BY metrics.cost_micros DESC
`);
if (!terms.length) {
  console.log("  (no search-term data - normal for a very new or low-volume campaign)");
} else {
  console.log(pad("SEARCH TERM", 50) + pad("CLICKS", 8) + pad("COST", 11) + "CONV");
  let spend = 0;
  for (const t of terms.slice(0, 40)) {
    const m = t.metrics ?? {};
    spend += Number(m.costMicros ?? 0);
    console.log(
      pad((t.searchTermView?.searchTerm ?? "?").slice(0, 49), 50) +
      pad(m.clicks ?? 0, 8) + pad(usd(m.costMicros), 11) + Number(m.conversions ?? 0).toFixed(1)
    );
  }
  console.log(`\n  ${terms.length} distinct terms, ${usd(spend)} across the ones shown.`);
  console.log("  Anything here that is not a Minnesota homeowner looking for a HELOC or");
  console.log("  cash-out refinance is a negative keyword you have not added yet.");
}

hr("WHAT THIS CANNOT TELL YOU");
console.log(`  Whether gtag actually fires when someone submits the HubSpot form. The API only
  sees conversions that arrived. If section 3 is clean and section 4 shows the action has
  never fired, the gap is in the browser, and the checks are:

    - Open the landing page, submit the form with a real email, and watch the Network tab
      for a request to googleads.g.doubleclick.net or google.com/pagead. No request means
      the HubSpot onFormSubmitted callback never ran.
    - HubSpot renders its form in an iframe. onFormSubmitted fires on the parent, but only
      if the embed is the standard v2 script - confirm it is not a redirect-after-submit
      form, which navigates away before the callback can run.
    - Check the Ads UI conversion action for "Tag inactive" or "No recent conversions".
    - Confirm the click actually carried a gclid: the dashboard's lead table has a gclid
      column, and a lead without one never gets attributed.`);
console.log();
