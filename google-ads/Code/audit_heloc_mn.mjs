/**
 * audit_heloc_mn.mjs
 *
 * Post-restructure sanity check on Minnesota — HELOC & Cash-Out Refinance. Read-only.
 *
 * Checks the things that fail silently:
 *   1. Negatives blocking your own keywords. A negative that matches an enabled keyword
 *      means that keyword can never serve, and nothing in the UI shouts about it.
 *   2. Ad approval and review status, so a disapproved ad is not sitting there doing nothing.
 *   3. Whether the ads inherited from the old single-keyword groups still make sense now
 *      that each group covers a theme - an ad pinned to one old keyword will read oddly
 *      against the other keywords in its new group.
 *   4. Duplicate keywords across the enabled groups, which make them bid against each other.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CAMPAIGN_ID = "24280317553";

const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();

async function q(gaql) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CID}/googleAds:search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "developer-token": DEV, "login-customer-id": LOGIN_CID, "Content-Type": "application/json" },
    body: JSON.stringify({ query: gaql }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hr = (t) => console.log("\n" + "=".repeat(78) + "\n" + t + "\n" + "=".repeat(78));
let problems = 0;

/* ── 1. negatives vs own keywords ─────────────────────────────────────────── */
hr("1. DO ANY NEGATIVES BLOCK OUR OWN KEYWORDS?");
const kwRows = await q(`SELECT ad_group.name, ad_group_criterion.keyword.text
  FROM ad_group_criterion WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_criterion.type = KEYWORD
  AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED'
  AND ad_group.status = 'ENABLED'`);
const keywords = kwRows.map((r) => ({ text: r.adGroupCriterion.keyword.text, ag: r.adGroup.name }));

const setRows = await q(`SELECT shared_set.id, shared_set.name FROM campaign_shared_set WHERE campaign.id = ${CAMPAIGN_ID}`);
const negatives = [];
for (const s of setRows) {
  const n = await q(`SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion WHERE shared_set.id = ${s.sharedSet.id}`);
  n.forEach((x) => negatives.push({ ...x.sharedCriterion.keyword, list: s.sharedSet.name }));
}
// Campaign-level negatives too.
const campNeg = await q(`SELECT campaign_criterion.keyword.text, campaign_criterion.keyword.match_type
  FROM campaign_criterion WHERE campaign.id = ${CAMPAIGN_ID} AND campaign_criterion.negative = TRUE AND campaign_criterion.type = KEYWORD`);
campNeg.forEach((x) => negatives.push({ ...x.campaignCriterion.keyword, list: "campaign level" }));

console.log(`  enabled keywords: ${keywords.length}   negatives in force: ${negatives.length}`);
let conflicts = 0;
for (const k of keywords) {
  const kl = k.text.toLowerCase();
  for (const n of negatives) {
    const nt = (n.text ?? "").toLowerCase();
    if (!nt) continue;
    let blocked;
    if (n.matchType === "BROAD") blocked = nt.split(/\s+/).every((w) => new RegExp(`\\b${esc(w)}\\b`).test(kl));
    else if (n.matchType === "PHRASE") blocked = kl.includes(nt);
    else blocked = kl === nt;
    if (blocked) {
      conflicts++; problems++;
      console.log(`  !! "${k.text}" (${k.ag}) blocked by [${n.matchType}] "${n.text}" from ${n.list}`);
    }
  }
}
if (!conflicts) console.log("  OK - no negative blocks any enabled keyword");

/* ── 2. ad approval ───────────────────────────────────────────────────────── */
hr("2. AD APPROVAL AND REVIEW STATUS");
const ads = await q(`SELECT ad_group.name, ad_group_ad.ad.id, ad_group_ad.policy_summary.approval_status,
  ad_group_ad.policy_summary.review_status, ad_group_ad.ad.responsive_search_ad.headlines
  FROM ad_group_ad WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_ad.status = 'ENABLED'
  AND ad_group.status = 'ENABLED' ORDER BY ad_group.name`);
for (const a of ads) {
  const ap = a.adGroupAd.policySummary?.approvalStatus ?? "?";
  const rv = a.adGroupAd.policySummary?.reviewStatus ?? "?";
  const bad = ap === "DISAPPROVED";
  if (bad) problems++;
  const h1 = (a.adGroupAd.ad.responsiveSearchAd?.headlines ?? []).find((x) => x.pinnedField)?.text ?? "(unpinned)";
  console.log(`  ${bad ? "!!" : "  "} ${a.adGroup.name.padEnd(32)} ${ap.padEnd(14)} ${rv.padEnd(16)} "${h1}"`);
}

/* ── 3. inherited ads: does the pinned headline still fit the group? ─────── */
hr("3. INHERITED ADS - DOES THE PINNED HEADLINE STILL MATCH THE GROUP?");
const groups = {};
ads.forEach((a) => { (groups[a.adGroup.name] ??= []).push(a); });
for (const [ag, list] of Object.entries(groups)) {
  const kwsHere = keywords.filter((k) => k.ag === ag).map((k) => k.text.toLowerCase());
  console.log(`\n  ${ag}  (${kwsHere.length} keywords, ${list.length} ads)`);
  for (const a of list) {
    const pins = (a.adGroupAd.ad.responsiveSearchAd?.headlines ?? []).filter((h) => h.pinnedField).map((h) => h.text);
    if (!pins.length) { console.log(`     ad ${a.adGroupAd.ad.id}: no pinned headline`); continue; }
    // A pinned headline is "narrow" if it names a keyword that is only one of several here.
    const narrow = pins.every((p) => {
      const pl = p.toLowerCase();
      const named = kwsHere.filter((k) => pl.includes(k));
      return named.length > 0 && named.length < kwsHere.length;
    });
    if (narrow && kwsHere.length > 2) { problems++; console.log(`     !! ad ${a.adGroupAd.ad.id} pins: ${pins.map((p) => `"${p}"`).join(", ")}  - written for one old keyword, now covers ${kwsHere.length}`); }
    else console.log(`     ok ad ${a.adGroupAd.ad.id} pins: ${pins.map((p) => `"${p}"`).join(", ")}`);
  }
}

/* ── 4. duplicate keywords across enabled groups ─────────────────────────── */
hr("4. DUPLICATE KEYWORDS ACROSS ENABLED AD GROUPS");
const seen = new Map();
keywords.forEach((k) => { const key = k.text.toLowerCase(); seen.set(key, [...(seen.get(key) ?? []), k.ag]); });
const dupes = [...seen.entries()].filter(([, ags]) => ags.length > 1);
if (!dupes.length) console.log("  OK - every keyword appears in exactly one enabled ad group");
dupes.forEach(([t, ags]) => { problems++; console.log(`  !! "${t}" in ${ags.length} groups: ${ags.join(", ")}`); });

console.log("\n" + "=".repeat(78));
console.log(problems === 0 ? "ALL CLEAR" : `${problems} thing(s) to look at`);
console.log("=".repeat(78) + "\n");
