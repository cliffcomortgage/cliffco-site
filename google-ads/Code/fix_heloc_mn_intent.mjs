/**
 * fix_heloc_mn_intent.mjs
 *
 * Minnesota — HELOC & Cash-Out Refinance (campaign 24280317553) spent $540.57 over 41 clicks
 * in 30 days with no form submissions at all. The search-term report says why: almost every
 * click was someone learning what a HELOC is, not someone wanting one.
 *
 *   "what is a heloc loan"                       3 clicks  $16.09
 *   "how does home equity loans work for dummies"  1 click  $10.43
 *   "home equity line of credit pros cons"         1 click  $10.77
 *   "hecm loan requirements"                       1 click  $10.19   (reverse mortgage)
 *   "home equity loans for manufactured homes"     1 click  $24.36
 *   "loan with house as collateral"                1 click  $68.25
 *
 * The campaign also had ZERO negative keywords, and four of its ad groups target research
 * intent on purpose ("how does a heloc work", "home equity loan vs heloc",
 * "cash out refinance requirements", "home improvement loan").
 *
 * This script:
 *   1. Creates a shared negative list and attaches it to the campaign.
 *   2. Pauses the four research-intent keywords.
 *
 * It does NOT touch bids, budget or the bidding strategy - see the note at the end.
 *
 * Run:  node Code/fix_heloc_mn_intent.mjs            (dry run, prints the plan)
 *       node Code/fix_heloc_mn_intent.mjs --apply    (makes the changes)
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPLY = process.argv.includes("--apply");

const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;
const CAMPAIGN_ID = "24280317553";
const CAMPAIGN_RN = `customers/${CID}/campaigns/${CAMPAIGN_ID}`;
const LIST_NAME = "HELOC & Cash-Out — Research and Wrong-Product Negatives v1";

// Keywords whose entire purpose is to attract researchers. Paused, not deleted, so the
// history stays visible in the UI.
const PAUSE_KEYWORDS = [
  "how does a heloc work",
  "home equity loan vs heloc",
  "cash out refinance requirements",
  "home improvement loan",
];

/**
 * BROAD negative = every word must appear somewhere in the query, in any order. That makes
 * two-word broad negatives like "what is" precise enough to catch a whole family of queries
 * without touching buying intent. "quoted" = phrase, [bracketed] = exact.
 *
 * Deliberately NOT negated:
 *   rates / rate  - four of their ad groups bid on rate terms on purpose
 *   how to        - "how to get a heloc" is real intent, unlike "how does"
 *   first lien    - Cliffco does offer first-lien HELOCs (see the HELOC guidelines)
 *   requirements  - "cash out refinance requirements" is being paused instead
 */
const RAW_NEGATIVES = [
  // --- pure education: someone finding out what the product is ---
  "what is", "what are", "whats", "what's", "what can", "what does", "what happens",
  "how does", "how do", "how is", "how are", "does a", "do you need",
  "define", "definition", "meaning", "means", "explain", "explained", "explaining",
  "dummies", "beginners", "beginner", "basics", "101", "tutorial", "learn",
  "example", "examples", "sample", "template",
  "wiki", "wikipedia", "reddit", "quora", "youtube", "video", "videos",
  "pdf", "worksheet", "infographic", "blog", "article",

  // --- comparison and deliberation, not application ---
  "vs", "versus", "compare", "comparison", "difference", "differences",
  "pros", "cons", "advantage", "advantages", "disadvantage", "disadvantages",
  "bad idea", "good idea", "worth it", "should i", "risk", "risks", "danger", "dangers",
  "downside", "downsides", "problem", "problems", "complaints", "scam", "horror",

  // --- calculators and payment maths: research, not a lead ---
  "calculator", "calculators", "calculate", "calculation", "formula",
  "amortization", "schedule", "chart", "table",

  // --- rate browsing rather than rate shopping with intent ---
  "today", "right now", "current", "average", "historical", "history", "forecast",
  "prediction", "predictions", "trend", "trends", "prime rate", "index",

  // --- wrong product entirely ---
  "hecm", "reverse mortgage", "reverse",
  "manufactured", "mobile home", "modular", "trailer",
  "fix up", "fixup", "rehab", "construction", "bridge loan",
  "personal loan", "credit card", "auto loan", "car loan", "student loan",
  "payday", "title loan", "pawn", "business loan", "sba",
  "land loan", "lot loan", "5x5",

  // --- not our market or not a customer ---
  "free", "grant", "grants", "government program", "assistance program",
  "jobs", "job", "career", "careers", "hiring", "salary",
  "class action", "lawsuit", "attorney", "lawyer",
  "login", "log in", "sign in", "customer service", "phone number", "payoff",

  // --- other states, so Minnesota budget is not spent on them ---
  "wisconsin", "iowa", "north dakota", "south dakota", "illinois", "michigan",
  "texas", "florida", "california", "arizona", "new york", "new jersey",
];

const matchType = (t) => {
  if (t.startsWith("[") && t.endsWith("]")) return { text: t.slice(1, -1), matchType: "EXACT" };
  if (t.startsWith('"') && t.endsWith('"')) return { text: t.slice(1, -1), matchType: "PHRASE" };
  return { text: t, matchType: "BROAD" };
};
const NEGATIVES = [...new Set(RAW_NEGATIVES)];

const hdrs = (token) => ({
  Authorization: `Bearer ${token}`, "developer-token": DEV,
  "login-customer-id": LOGIN_CID, "Content-Type": "application/json",
});

async function auth() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`OAuth ${r.status}: ${j.error ?? ""} ${j.error_description ?? ""}`);
  return j.access_token;
}
async function mutate(token, service, operations) {
  const r = await fetch(`${BASE}/${service}:mutate`, {
    method: "POST", headers: hdrs(token), body: JSON.stringify({ operations }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`${service} ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d;
}
async function search(token, query) {
  const r = await fetch(`${BASE}/googleAds:search`, {
    method: "POST", headers: hdrs(token), body: JSON.stringify({ query }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`search ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}

const main = async () => {
  const token = await auth();

  const counts = NEGATIVES.reduce((a, t) => {
    const k = matchType(t).matchType; a[k] = (a[k] ?? 0) + 1; return a;
  }, {});
  console.log(`Campaign : Minnesota — HELOC & Cash-Out Refinance (${CAMPAIGN_ID})`);
  console.log(`Negatives: ${NEGATIVES.length} terms  ${JSON.stringify(counts)}`);
  console.log(`Pausing  : ${PAUSE_KEYWORDS.length} research keywords`);

  // Resolve the keywords to pause before changing anything.
  const kws = await search(token, `
    SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text,
           ad_group_criterion.status, ad_group.name
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = KEYWORD AND ad_group_criterion.negative = FALSE
      AND campaign.id = ${CAMPAIGN_ID}
  `);
  const toPause = kws.filter((k) =>
    PAUSE_KEYWORDS.includes(k.adGroupCriterion.keyword.text.toLowerCase()) &&
    k.adGroupCriterion.status !== "PAUSED");

  console.log("\nWill pause:");
  if (!toPause.length) console.log("  (nothing - already paused or not found)");
  toPause.forEach((k) => console.log(`  "${k.adGroupCriterion.keyword.text}"  (ad group: ${k.adGroup.name})`));

  if (!APPLY) {
    console.log("\nDRY RUN. Nothing changed. Re-run with --apply to make these changes.");
    console.log("\nFirst 30 negatives:");
    NEGATIVES.slice(0, 30).forEach((t) => console.log("  " + t));
    return;
  }

  // 1. shared negative list (reuse if a run already created it)
  console.log("\n· Creating the shared negative list...");
  let sharedSetRN;
  const existing = await search(token, `SELECT shared_set.resource_name, shared_set.name FROM shared_set WHERE shared_set.name = "${LIST_NAME}"`);
  if (existing.length) {
    sharedSetRN = existing[0].sharedSet.resourceName;
    console.log(`  · already exists, reusing ${sharedSetRN}`);
  } else {
    const res = await mutate(token, "sharedSets", [{
      create: { name: LIST_NAME, type: "NEGATIVE_KEYWORDS" },
    }]);
    sharedSetRN = res.results[0].resourceName;
    console.log(`  ✓ created ${sharedSetRN}`);
  }

  // 2. the keywords
  console.log(`· Adding ${NEGATIVES.length} negative keywords...`);
  const ops = NEGATIVES.map((t) => ({ create: { sharedSet: sharedSetRN, keyword: matchType(t) } }));
  const CHUNK = 500;
  for (let i = 0; i < ops.length; i += CHUNK) {
    await mutate(token, "sharedCriteria", ops.slice(i, i + CHUNK));
    console.log(`  · ${Math.min(i + CHUNK, ops.length)}/${ops.length}`);
  }

  // 3. attach
  console.log("· Attaching the list to the campaign...");
  try {
    await mutate(token, "campaignSharedSets", [{ create: { campaign: CAMPAIGN_RN, sharedSet: sharedSetRN } }]);
    console.log("  ✓ attached");
  } catch (e) {
    if (/DUPLICATE|already/i.test(e.message)) console.log("  · already attached");
    else throw e;
  }

  // 4. pause the research keywords
  if (toPause.length) {
    console.log(`· Pausing ${toPause.length} research keywords...`);
    await mutate(token, "adGroupCriteria", toPause.map((k) => ({
      update: { resourceName: k.adGroupCriterion.resourceName, status: "PAUSED" },
      updateMask: "status",
    })));
    console.log("  ✓ paused");
  }

  console.log(`
✓ DONE

  Negative list : "${LIST_NAME}" (${NEGATIVES.length} terms)
  Attached to   : Minnesota — HELOC & Cash-Out Refinance
  Paused        : ${toPause.length} research keywords

  Review: https://ads.google.com/aw/negkwlists

STILL NEEDS A HUMAN DECISION

  Bidding. The campaign runs MAXIMIZE_CONVERSIONS on an account where no form
  conversion has ever been recorded. Smart bidding with no conversion signal has
  nothing to optimise toward, which is how a single vague click cost $68.25. Until
  conversions are actually flowing, Maximize Clicks with a CPC cap, or manual CPC,
  will spend the $35/day far more predictably. That is a judgement call about live
  spend, so it is left alone here.

  The form. 8 visible fields, starting 1205px down an 8536px page on mobile. That
  is a lot of friction for cold paid traffic even once the targeting is right.
`);
};

main().catch((e) => { console.error("\n✗", e.message); process.exit(1); });
