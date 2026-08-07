/**
 * add_shared_negatives.mjs
 *
 * Creates a Shared Negative Keyword List "Universal Service Business Negatives v1"
 * with all 150 terms from universal-negative-keywords.md (sections A.1–A.7),
 * then attaches it to the Reverse Mortgage — Long Island campaign.
 *
 * Match type: BROAD unless the term uses "quotes" (phrase) or [brackets] (exact).
 * All A.1–A.7 terms are unquoted, so all get BROAD.
 *
 * Run: node Code/add_shared_negatives.mjs
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const l of env.split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE        = `https://googleads.googleapis.com/v24/customers/${CID}`;
const CAMPAIGN_RN = `customers/${CID}/campaigns/23946171105`;
const LIST_NAME   = "Universal Service Business Negatives v1";

// ── Sections A.1–A.7 (universal-negative-keywords.md) ────────────────────────

const RAW_NEGATIVES = [
  // A.1  Job seekers (37 — deduped vacancy appears once)
  "jobs", "job", "hiring", "recruit", "recruiting", "recruitment", "recruiter",
  "career", "careers", "employment", "employer", "employee", "salary", "salaries",
  "wage", "wages", "hourly pay", "resume", "cv", "intern", "interns", "internship",
  "internships", "apprentice", "apprentices", "apprenticeship", "apprenticeships",
  "volunteer", "vacancy", "vacancies", "position open", "hiring near me",
  "work from home", "indeed", "glassdoor", "ziprecruiter",

  // A.2  DIY / how-to (28)
  "diy", "do it yourself", "how to", "howto", "how do", "how do you", "tutorial",
  "tutorials", "guide", "guides", "step by step", "instructions", "youtube", "video",
  "videos", "template", "templates", "example", "examples", "how to fix",
  "how to repair", "how to install", "how to remove", "how to clean",
  "how to replace", "how to build", "homemade", "yourself",

  // A.3  Education (22)
  "school", "schools", "schooling", "college", "university", "class", "classes",
  "course", "courses", "training", "trainee", "trained", "certification",
  "certificate", "certified", "license cost", "licensing", "license requirement",
  "license requirements", "become a", "how to become", "exam",

  // A.4  Free / discount (15)
  "free", "freebie", "giveaway", "giveaways", "sample", "samples", "trial",
  "discount", "discounted", "voucher", "coupon", "coupons", "promo code",
  "clearance", "secondhand",

  // A.5  Informational research (16)
  "what is", "what is a", "what does", "what are", "meaning", "definition",
  "wikipedia", "wiki", "reddit", "quora", "forum", "forums", "blog",
  "review", "reviews", "ratings",

  // A.6  Customer support (18)
  "complaint", "complaints", "refund", "refunds", "return policy", "cancel",
  "cancellation", "warranty claim", "problem", "problems", "not working",
  "broken", "contact", "phone number", "customer service", "help", "login",
  "sign in",

  // A.7  Restricted / unsafe (14)
  "porn", "adult", "nude", "sex", "gambling", "casino", "weed", "marijuana",
  "cbd", "crypto", "bitcoin", "nft", "mlm", "ponzi",
];

// Deduplicate (vacancy was listed twice in source)
const NEGATIVES = [...new Set(RAW_NEGATIVES)];

function matchType(term) {
  if (term.startsWith('"') && term.endsWith('"')) return { text: term.slice(1, -1), matchType: "PHRASE" };
  if (term.startsWith("[") && term.endsWith("]")) return { text: term.slice(1, -1), matchType: "EXACT" };
  return { text: term, matchType: "BROAD" };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
                                 refresh_token: REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  const { access_token, error } = await r.json();
  if (error) throw new Error(`Token: ${error}`);
  return access_token;
}

function hdrs(token) {
  return { Authorization: `Bearer ${token}`, "developer-token": DEV_TOKEN,
           "login-customer-id": LOGIN_CID, "Content-Type": "application/json" };
}

async function mutate(token, service, operations) {
  const r = await fetch(`${BASE}/${service}:mutate`, {
    method: "POST", headers: hdrs(token), body: JSON.stringify({ operations }),
  });
  const data = await r.json();
  if (data.error) {
    const msg = data.error?.details?.[0]?.errors?.[0]?.message || data.error.message;
    throw new Error(`[${service}] ${msg}`);
  }
  return data;
}

async function search(token, query) {
  const r = await fetch(`${BASE}/googleAds:search`, {
    method: "POST", headers: hdrs(token), body: JSON.stringify({ query }),
  });
  const data = await r.json();
  if (data.error) {
    const msg = data.error?.details?.[0]?.errors?.[0]?.message || data.error.message;
    throw new Error(`[search] ${msg}`);
  }
  return data.results || [];
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nCreating shared negative list: "${LIST_NAME}"\n`);
  const token = await getToken();

  // 1. Check if list already exists to avoid duplicates
  console.log("· Checking for existing list...");
  const existing = await search(token, `
    SELECT shared_set.id, shared_set.name, shared_set.resource_name
    FROM shared_set
    WHERE shared_set.type = 'NEGATIVE_KEYWORDS'
      AND shared_set.status = 'ENABLED'
  `);
  const found = existing.find(r => r.sharedSet.name === LIST_NAME);
  if (found) {
    console.log(`  ⚠ List already exists (ID ${found.sharedSet.id}). Skipping creation.`);
    const sharedSetRN = found.sharedSet.resourceName;

    // Still try to attach in case it wasn't linked yet
    console.log("· Attaching to campaign (if not already)...");
    try {
      await mutate(token, "campaignSharedSets", [{
        create: { campaign: CAMPAIGN_RN, sharedSet: sharedSetRN }
      }]);
      console.log("  ✓ Attached");
    } catch (e) {
      if (e.message.includes("already exists") || e.message.includes("duplicate")) {
        console.log("  ✓ Already attached");
      } else {
        throw e;
      }
    }
    console.log(`\n✓ DONE — list was already created. Terms inside: ${NEGATIVES.length}`);
    return;
  }

  // 2. Create shared set
  console.log("· Creating shared set...");
  const setRes = await mutate(token, "sharedSets", [{
    create: { name: LIST_NAME, type: "NEGATIVE_KEYWORDS" }
  }]);
  const sharedSetRN = setRes.results[0].resourceName;
  console.log(`  ✓ ${sharedSetRN}`);

  // 3. Add all keywords (batch in 500s to stay well under API limits)
  console.log(`· Adding ${NEGATIVES.length} negative keywords...`);
  const kwOps = NEGATIVES.map(term => {
    const kw = matchType(term);
    return { create: { sharedSet: sharedSetRN, keyword: kw } };
  });

  let added = 0;
  const CHUNK = 500;
  for (let i = 0; i < kwOps.length; i += CHUNK) {
    await mutate(token, "sharedCriteria", kwOps.slice(i, i + CHUNK));
    added += Math.min(CHUNK, kwOps.length - i);
    console.log(`  · ${added}/${NEGATIVES.length} added`);
  }
  console.log(`  ✓ All ${NEGATIVES.length} keywords added`);

  // 4. Attach to campaign
  console.log("· Attaching to Reverse Mortgage — Long Island campaign...");
  await mutate(token, "campaignSharedSets", [{
    create: { campaign: CAMPAIGN_RN, sharedSet: sharedSetRN }
  }]);
  console.log("  ✓ Attached");

  console.log(`
✓ DONE

Shared list: "${LIST_NAME}"
Resource:    ${sharedSetRN}
Keywords:    ${NEGATIVES.length} terms (BROAD match — sections A.1–A.7)
Attached to: Reverse Mortgage — Long Island (Campaign 23946171105)

Match type breakdown:
  · ${NEGATIVES.filter(t => !t.startsWith('"') && !t.startsWith('[')).length} BROAD
  · ${NEGATIVES.filter(t => t.startsWith('"')).length} PHRASE
  · ${NEGATIVES.filter(t => t.startsWith('[')).length} EXACT

Review at: https://ads.google.com/aw/negkwlists
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
