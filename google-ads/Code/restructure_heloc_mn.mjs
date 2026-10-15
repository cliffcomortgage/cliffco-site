/**
 * restructure_heloc_mn.mjs
 *
 * Collapses Minnesota — HELOC & Cash-Out Refinance from 25 single-keyword ad groups into 3
 * themed ones, and gives each a fresh responsive search ad.
 *
 * Why: the campaign ran 25 ad groups holding one phrase keyword each - the old SKAG layout.
 * Across 30 days those 25 shared 1,178 impressions; eight took none at all and one took 60%
 * of the spend. An ad group needs traffic before Google will trust it, so fragmenting a
 * small campaign this way keeps every group permanently unproven. It shows up as a 4.2% CTR
 * against the NJ campaign's 12.2%, 51.5% of impressions lost to rank against NJ's 34%, and
 * a $15-23 cost per click against NJ's $1.73. NJ runs one ad group.
 *
 * Approach: keep the three ad groups that already carry the most history and rename them,
 * move every surviving keyword into the matching one, write one new RSA per group, then
 * pause the rest. Nothing is deleted, so this is reversible.
 *
 * Ad copy follows anatomy-of-a-good-ad.md: 15 headlines with 3 pinned to slot 1, 4
 * descriptions, and the character limits are asserted before anything is sent.
 *
 * Run:  node Code/restructure_heloc_mn.mjs            (dry run - prints the whole plan)
 *       node Code/restructure_heloc_mn.mjs --apply
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
const CAMPAIGN_ID = "24280317553";
const FINAL_URL = "https://cliffcomn.com/heloc-minnesota/";

/* ── the three groups ────────────────────────────────────────────────────────
   `keep` is the existing ad group whose name and history we reuse. Picked by
   impressions so the most-proven group in each theme survives.               */
const GROUPS = [
  {
    keep: "home equity line of credit",          // 142 impressions, most in its theme
    rename: "HELOC — Minnesota",
    keywords: [
      "heloc", "heloc loan", "heloc lender", "heloc rates",
      "home equity line of credit", "home equity line of credit lenders",
      "home equity line of credit rates",
    ],
    path1: "heloc", path2: "minnesota",
    pinned: ["Minnesota HELOC", "HELOC in Minnesota", "Minnesota Home Equity Line"],
    headlines: [
      "Draw What You Need", "Keep Your First Mortgage", "Licensed MN Lender",
      "Lending Since 1989", "Talk To A Real Person", "Check Your Options Free",
      "No Obligation Quote", "Apply Online In Minutes", "Not A Call Center",
      "Use It, Repay, Use Again", "A Line, Not A Lump Sum", "NMLS #65328",
    ],
    descriptions: [
      "A home equity line of credit from a Minnesota lender, not a call center.",
      "Draw what you need, when you need it, and keep your first mortgage as it is.",
      "Cliffco Mortgage Bankers, lending since 1989. NMLS #65328.",
      "See what you qualify for. No cost, no obligation, no pressure.",
    ],
  },
  {
    keep: "home equity loan",                    // 460 impressions, the campaign's biggest
    rename: "Home Equity Loan — Minnesota",
    keywords: ["home equity loan", "home equity loan rates"],
    path1: "home-equity", path2: "minnesota",
    pinned: ["Minnesota Home Equity Loan", "Home Equity Loan In MN", "MN Fixed-Rate Equity Loan"],
    headlines: [
      "One Lump Sum, Fixed Rate", "Keep Your First Mortgage", "Predictable Payment",
      "Licensed MN Lender", "Lending Since 1989", "Talk To A Real Person",
      "Check Your Options Free", "No Obligation Quote", "Apply Online In Minutes",
      "Not A Call Center", "Fixed Rate, No Surprises", "NMLS #65328",
    ],
    descriptions: [
      "A fixed-rate home equity loan from a Minnesota lender, not a call center.",
      "One lump sum, one fixed payment, and your first mortgage stays where it is.",
      "Cliffco Mortgage Bankers, lending since 1989. NMLS #65328.",
      "See what you qualify for. No cost, no obligation, no pressure.",
    ],
  },
  {
    keep: "cash out refinance",
    rename: "Cash-Out Refinance — Minnesota",
    keywords: [
      "cash out refinance", "cash out refi", "cash out home refinance",
      "cash out mortgage refinance", "cash out refinance loan",
      "cash out refinance rates", "cash out refinance lender",
      "best cash out refinance rates", "refinance and cash out",
      "home equity cash out refinance",
    ],
    path1: "cash-out", path2: "minnesota",
    pinned: ["Minnesota Cash-Out Refi", "Cash-Out Refinance In MN", "MN Cash-Out Refinance"],
    headlines: [
      "Replace Your Mortgage", "One Loan, One Payment", "Turn Equity Into Cash",
      "Licensed MN Lender", "Lending Since 1989", "Talk To A Real Person",
      "Check Your Options Free", "No Obligation Quote", "Apply Online In Minutes",
      "Not A Call Center", "See If It Makes Sense", "NMLS #65328",
    ],
    descriptions: [
      "Refinance your mortgage and take cash out, with a Minnesota lender you can call.",
      "One new loan replaces your current mortgage. One payment, one rate.",
      "Cliffco Mortgage Bankers, lending since 1989. NMLS #65328.",
      "We will tell you honestly if a cash-out refinance is not your best move.",
    ],
  },
];

/* Ad groups to pause outright. The first four already have a paused keyword; the last two
   are comparison-shopping terms the negative list blocks anyway, so they cannot serve. */
const PAUSE_OUTRIGHT = [
  "cash out refinance requirements", "home equity loan vs heloc",
  "home improvement loan", "how does a heloc work",
  "heloc vs cash out refinance", "heloc vs home equity loan",
];

/* ── validation: refuse to send anything Google would reject ─────────────── */
function validate() {
  const errs = [];
  for (const g of GROUPS) {
    const all = [...g.pinned, ...g.headlines];
    if (all.length !== 15) errs.push(`${g.rename}: ${all.length} headlines, need 15`);
    if (g.descriptions.length !== 4) errs.push(`${g.rename}: ${g.descriptions.length} descriptions, need 4`);
    all.forEach((h) => {
      if (h.length > 30) errs.push(`${g.rename}: headline ${h.length} chars "${h}"`);
      if (h.includes("!")) errs.push(`${g.rename}: exclamation in headline "${h}"`);
      if (/\b[A-Z]{4,}\b/.test(h.replace("NMLS", "").replace("HELOC", "").replace("MN", ""))) errs.push(`${g.rename}: shouting in "${h}"`);
    });
    g.descriptions.forEach((d) => {
      if (d.length > 90) errs.push(`${g.rename}: description ${d.length} chars "${d}"`);
    });
    if (g.path1.length > 15 || g.path2.length > 15) errs.push(`${g.rename}: display path too long`);
    const excl = g.descriptions.join("").split("!").length - 1;
    if (excl > 1) errs.push(`${g.rename}: ${excl} exclamation marks across descriptions, max 1`);
  }
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
  const r = await fetch(`${BASE}/${service}:mutate`, { method: "POST", headers: hdrs(t), body: JSON.stringify({ operations, partialFailure: false }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`${service} ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d;
}

const main = async () => {
  const errs = validate();
  if (errs.length) { console.error("✗ copy failed validation:\n" + errs.map((e) => "  " + e).join("\n")); process.exit(1); }
  console.log("✓ ad copy passes the character and format checks\n");

  const token = await auth();
  const ags = await q(token, `SELECT ad_group.id, ad_group.name, ad_group.status FROM ad_group WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group.status != 'REMOVED'`);
  const byName = new Map(ags.map((a) => [a.adGroup.name.toLowerCase(), a.adGroup]));
  const kws = await q(token, `SELECT ad_group.id, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.status FROM ad_group_criterion WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_criterion.type = KEYWORD AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status != 'REMOVED'`);

  const keepIds = new Set();
  console.log("PLAN\n" + "=".repeat(70));
  for (const g of GROUPS) {
    const ag = byName.get(g.keep.toLowerCase());
    if (!ag) throw new Error(`ad group not found: ${g.keep}`);
    keepIds.add(ag.id);
    const present = new Set(kws.filter((k) => k.adGroup.id === ag.id).map((k) => k.adGroupCriterion.keyword.text.toLowerCase()));
    const toAdd = g.keywords.filter((k) => !present.has(k.toLowerCase()));
    console.log(`\n"${g.keep}"  ->  "${g.rename}"   (id ${ag.id})`);
    console.log(`  keywords: ${g.keywords.length} total, ${toAdd.length} to add`);
    toAdd.forEach((k) => console.log(`     + ${k}`));
    console.log(`  new RSA: 15 headlines (3 pinned), 4 descriptions, ${g.path1}/${g.path2}`);
  }
  const toPause = ags.filter((a) => !keepIds.has(a.adGroup.id) && a.adGroup.status === "ENABLED");
  console.log(`\nPAUSE ${toPause.length} ad groups:`);
  toPause.forEach((a) => console.log(`  - ${a.adGroup.name}`));
  console.log("\n  (nothing is deleted - pausing is reversible)");

  if (!APPLY) { console.log("\nDRY RUN. Nothing changed. Re-run with --apply.\n"); return; }

  console.log("\nAPPLYING\n" + "=".repeat(70));
  for (const g of GROUPS) {
    const ag = byName.get(g.keep.toLowerCase());
    const rn = `customers/${CID}/adGroups/${ag.id}`;

    await mutate(token, "adGroups", [{ update: { resourceName: rn, name: g.rename }, updateMask: "name" }]);
    console.log(`· renamed -> ${g.rename}`);

    const present = new Set(kws.filter((k) => k.adGroup.id === ag.id).map((k) => k.adGroupCriterion.keyword.text.toLowerCase()));
    const toAdd = g.keywords.filter((k) => !present.has(k.toLowerCase()));
    if (toAdd.length) {
      await mutate(token, "adGroupCriteria", toAdd.map((text) => ({
        create: { adGroup: rn, status: "ENABLED", keyword: { text, matchType: "PHRASE" } },
      })));
      console.log(`  + ${toAdd.length} keywords`);
    }

    const headlines = [
      ...g.pinned.map((text) => ({ text, pinnedField: "HEADLINE_1" })),
      ...g.headlines.map((text) => ({ text })),
    ];
    await mutate(token, "adGroupAds", [{
      create: {
        adGroup: rn, status: "ENABLED",
        ad: {
          finalUrls: [FINAL_URL],
          responsiveSearchAd: { headlines, descriptions: g.descriptions.map((text) => ({ text })), path1: g.path1, path2: g.path2 },
        },
      },
    }]);
    console.log(`  + new RSA`);
  }

  if (toPause.length) {
    await mutate(token, "adGroups", toPause.map((a) => ({
      update: { resourceName: `customers/${CID}/adGroups/${a.adGroup.id}`, status: "PAUSED" },
      updateMask: "status",
    })));
    console.log(`· paused ${toPause.length} ad groups`);
  }

  const after = await q(token, `SELECT ad_group.name, ad_group.status FROM ad_group WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group.status = 'ENABLED'`);
  console.log(`\n✓ Done. Enabled ad groups now: ${after.length}`);
  after.forEach((a) => console.log(`   ${a.adGroup.name}`));
};

main().catch((e) => { console.error("\n✗", e.message); process.exit(1); });
