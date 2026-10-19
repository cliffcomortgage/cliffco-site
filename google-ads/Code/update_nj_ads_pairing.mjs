/**
 * update_nj_ads_pairing.mjs
 *
 * Makes the mortgage pairing visible in the NJ grant ads before the click.
 *
 * The problem: leads keep arriving from people who already have a mortgage in progress
 * elsewhere and think the $22,000 can be bolted on. The landing page now says it can't, but
 * the ads never did. Ad 1 had fifteen headlines and four descriptions and not one mentioned
 * a mortgage at all; Ad 2 mentioned it only in description 3, which rotates and often does
 * not show.
 *
 * What this does NOT do: remove "grant". That word is what wins the auction - "first time
 * home buyer grant nj" is the campaign's top keyword at 115 clicks and $1.83, well under
 * the account average. It is also accurate: the program is a grant, structured as a
 * forgivable loan. The problem was never the word, it was the missing half of the sentence.
 *
 * Approach: keep the three existing slot-1 pins, and pin a pairing headline to slot 2. With
 * slot 1 and slot 2 both pinned, every impression reads
 *
 *     NJ First-Time Buyer Grant | With Your NJHMFA Mortgage
 *
 * so the qualifier is there on every single view rather than whenever rotation happens to
 * surface it. Descriptions are reordered so the pairing sentence is description 1, which
 * shows essentially always, instead of 3, which often does not.
 *
 * Google rebuilds an RSA rather than editing one in place, so each ad is recreated and the
 * old version paused. Ad IDs change; performance history for the ad group does not.
 *
 * Run:  node Code/update_nj_ads_pairing.mjs            (dry run, prints the new copy)
 *       node Code/update_nj_ads_pairing.mjs --apply
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
/** --only=1 applies to the first ad only, leaving the others untouched for comparison. */
const ONLY = (() => {
  const f = process.argv.find((x) => x.startsWith("--only="));
  return f ? Number(f.split("=")[1]) : null;
})();
const FINAL_URL = "https://cliffcomortgage.com/nj-grant-program/";
const PATH1 = "NJ-Grant", PATH2 = "Plus-Mortgage";

/** Pinned to slot 1 — unchanged. These match the queries that win the auction. */
const PIN1 = ["NJ Down Payment Assistance", "NJ First-Time Buyer Grant", "First-Gen NJ Homebuyers"];
/** Pinned to slot 2 — new. Guarantees the pairing appears beside the hook, every time. */
const PIN2 = ["With Your NJHMFA Mortgage", "Grant + Mortgage Together", "Comes With Your Mortgage"];

const ADS = [
  {
    // Eligibility angle. Previously had no mention of a mortgage anywhere.
    match: "First Home in New Jersey?",
    headlines: [
      "First Home in New Jersey?", "You May Be Eligible", "Parents Don't Own a Home?",
      "See If You Qualify in 2 Min", "Financed Through Cliffco", "One Application, Both Parts",
      "New NJ Mortgage Required", "All 21 NJ Counties", "Cliffco · Lending Since 1989",
    ],
    descriptions: [
      "The grant comes with an NJHMFA mortgage through Cliffco, applied for together.",
      "First home in New Jersey? First-generation and first-time buyers may qualify.",
      "If your parents don't currently own a home, you may be eligible to apply.",
      "Check your eligibility online in minutes. No cost, no impact to your credit.",
    ],
  },
  {
    // Benefit angle. The pairing moves from description 3 to description 1.
    match: "Up to $22,000 Toward a Home",
    headlines: [
      "Up to $22,000 Toward a Home", "Help With Your Down Payment", "0% Interest, No Monthly Bill",
      "Forgiven After 5 Years", "Financed Through Cliffco", "One Application, Both Parts",
      "Keep More Cash at Closing", "See What You Qualify For", "Cliffco Mortgage Bankers",
    ],
    descriptions: [
      "Paired with an NJHMFA first mortgage through Cliffco, a participating NJ lender.",
      "Get up to $22,000 toward your down payment or closing costs on your first NJ home.",
      "The assistance is 0% interest with no monthly payment, forgiven after 5 years.",
      "See what you qualify for in about 2 minutes. No cost, no obligation.",
    ],
  },
  {
    // Trust angle. Already named the mortgage; tightened so it leads with it.
    match: "Talk to a Real Loan Officer",
    headlines: [
      "Talk to a Real Loan Officer", "Licensed NJ Loan Officers", "Not a Call Center",
      "Lending in NJ Since 1989", "NJHMFA Participating Lender", "One Application, Both Parts",
      "No Cost, No Obligation", "Check Your Eligibility", "Cliffco Mortgage Bankers",
    ],
    descriptions: [
      "Your NJHMFA mortgage and the grant are handled as one simple application.",
      "Work directly with a licensed New Jersey loan officer, not a call center.",
      "Cliffco has helped New Jersey families get home since 1989. NMLS #65328.",
      "Talk to Eddie or Gary about the First Generation Homebuyer Program today.",
    ],
  },
];

/* ── validation ──────────────────────────────────────────────────────────── */
function validate() {
  const errs = [];
  [...PIN1, ...PIN2].forEach((h) => { if (h.length > 30) errs.push(`pin ${h.length} chars: "${h}"`); });
  ADS.forEach((a, i) => {
    const all = [...PIN1, ...PIN2, ...a.headlines];
    if (all.length > 15) errs.push(`ad ${i + 1}: ${all.length} headlines; an RSA takes at most 15`);
    if (all.length < 15) errs.push(`ad ${i + 1}: only ${all.length} headlines; fill all 15 slots`);
    a.headlines.forEach((h) => { if (h.length > 30) errs.push(`ad ${i + 1}: headline ${h.length} chars "${h}"`); if (h.includes("!")) errs.push(`ad ${i + 1}: "!" in "${h}"`); });
    if (a.descriptions.length !== 4) errs.push(`ad ${i + 1}: ${a.descriptions.length} descriptions, need 4`);
    a.descriptions.forEach((d) => { if (d.length > 90) errs.push(`ad ${i + 1}: description ${d.length} chars "${d}"`); });
  });
  if (PATH1.length > 15 || PATH2.length > 15) errs.push("display path over 15 chars");
  return errs;
}

/* ── api ─────────────────────────────────────────────────────────────────── */
const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;
const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;
const hdrs = (t) => ({ Authorization: `Bearer ${t}`, "developer-token": DEV, "login-customer-id": LOGIN_CID, "Content-Type": "application/json" });

async function auth() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`OAuth ${r.status}`);
  return j.access_token;
}
async function q(t, gaql) {
  const r = await fetch(`${BASE}/googleAds:search`, { method: "POST", headers: hdrs(t), body: JSON.stringify({ query: gaql }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`search ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}
async function mutate(t, service, operations) {
  const r = await fetch(`${BASE}/${service}:mutate`, { method: "POST", headers: hdrs(t), body: JSON.stringify({ operations }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`${service} ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d;
}

const main = async () => {
  const errs = validate();
  if (errs.length) { console.error("✗ copy failed validation:\n" + errs.map((e) => "  " + e).join("\n")); process.exit(1); }
  console.log("✓ copy passes the character and format checks\n");

  const token = await auth();
  const live = await q(token, `SELECT ad_group.id, ad_group.resource_name, ad_group_ad.resource_name,
    ad_group_ad.ad.id, ad_group_ad.ad.responsive_search_ad.headlines
    FROM ad_group_ad WHERE campaign.name LIKE "%NJ%" AND ad_group_ad.status = 'ENABLED'`);

  console.log(`found ${live.length} live ad(s)\n` + "=".repeat(74));
  const plan = [];
  const selected = ONLY ? [ADS[ONLY - 1]].filter(Boolean) : ADS;
  if (ONLY) console.log(`only ad ${ONLY} of ${ADS.length} will change; the others stay as they are
`);
  for (const spec of selected) {
    const existing = live.find((a) => (a.adGroupAd.ad.responsiveSearchAd?.headlines ?? []).some((h) => h.text === spec.match));
    if (!existing) { console.log(`\n! no live ad matching "${spec.match}" - skipping`); continue; }
    plan.push({ spec, existing });
    console.log(`\nreplacing ad ${existing.adGroupAd.ad.id}  (matched on "${spec.match}")`);
    console.log(`  slot 1 pins : ${PIN1.join(" / ")}`);
    console.log(`  slot 2 pins : ${PIN2.join(" / ")}   <- new`);
    console.log(`  shows as    : "${PIN1[1]} | ${PIN2[0]}"`);
    console.log(`  description1: "${spec.descriptions[0]}"`);
    console.log(`  path        : /${PATH1}/${PATH2}`);
  }

  if (!APPLY) {
    console.log("\nDRY RUN. Nothing changed. Re-run with --apply.");
    console.log("Note: Google cannot edit an RSA in place, so each ad is recreated and the old one paused.");
    return;
  }

  console.log("\nAPPLYING\n" + "=".repeat(74));
  for (const { spec, existing } of plan) {
    const headlines = [
      ...PIN1.map((text) => ({ text, pinnedField: "HEADLINE_1" })),
      ...PIN2.map((text) => ({ text, pinnedField: "HEADLINE_2" })),
      ...spec.headlines.map((text) => ({ text })),
    ];
    await mutate(token, "adGroupAds", [{ update: { resourceName: existing.adGroupAd.resourceName, status: "PAUSED" }, updateMask: "status" }]);
    try {
      await mutate(token, "adGroupAds", [{
        create: {
          adGroup: existing.adGroup.resourceName, status: "ENABLED",
          ad: { finalUrls: [FINAL_URL], responsiveSearchAd: { headlines, descriptions: spec.descriptions.map((text) => ({ text })), path1: PATH1, path2: PATH2 } },
        },
      }]);
    } catch (e) {
      await mutate(token, "adGroupAds", [{ update: { resourceName: existing.adGroupAd.resourceName, status: "ENABLED" }, updateMask: "status" }]);
      throw new Error(`create failed, original ad ${existing.adGroupAd.ad.id} re-enabled: ${e.message}`);
    }
    console.log(`· replaced ad ${existing.adGroupAd.ad.id} (old one paused, not deleted)`);
  }

  const after = await q(token, `SELECT ad_group_ad.ad.id, ad_group_ad.ad.responsive_search_ad.headlines
    FROM ad_group_ad WHERE campaign.name LIKE "%NJ%" AND ad_group_ad.status = 'ENABLED'`);
  console.log(`\n✓ ${after.length} live ad(s). Slot-2 pin present on:`);
  after.forEach((a) => {
    const p2 = (a.adGroupAd.ad.responsiveSearchAd?.headlines ?? []).filter((h) => h.pinnedField === "HEADLINE_2").map((h) => h.text);
    console.log(`   ad ${a.adGroupAd.ad.id}: ${p2.length ? p2.join(" / ") : "NONE"}`);
  });
};

main().catch((e) => { console.error("\n✗", e.message); process.exit(1); });
