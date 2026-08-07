/**
 * add_negative_keyword_list.mjs
 * Creates shared negative keyword list "Reverse Mortgage — Universal Negatives v1"
 * and attaches it to campaign 23946171105.
 *
 * Single-word terms → BROAD. Multi-word terms → PHRASE.
 * Skipped: free, video, videos, what is, what is a, what does, phone number, help,
 *          how to, how do, how do you, guide, guides, certified, how to become,
 *          what are, review, reviews, ratings, problem, problems, contact, yourself
 *
 * Run: node Code/add_negative_keyword_list.mjs
 */

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
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const CAMPAIGN_ID   = "23946171105";
const LIST_NAME     = "Reverse Mortgage — Universal Negatives v1";

// ── Negative keyword list ────────────────────────────────────────────────────
// BROAD = single word, PHRASE = multi-word
const NEGATIVES = [
  // A.1 Job seekers
  ["jobs", "BROAD"], ["job", "BROAD"], ["hiring", "BROAD"], ["recruit", "BROAD"],
  ["recruiting", "BROAD"], ["recruitment", "BROAD"], ["recruiter", "BROAD"],
  ["career", "BROAD"], ["careers", "BROAD"], ["employment", "BROAD"],
  ["employer", "BROAD"], ["employee", "BROAD"], ["salary", "BROAD"],
  ["salaries", "BROAD"], ["wage", "BROAD"], ["wages", "BROAD"],
  ["hourly pay", "PHRASE"], ["resume", "BROAD"], ["cv", "BROAD"],
  ["intern", "BROAD"], ["interns", "BROAD"], ["internship", "BROAD"],
  ["internships", "BROAD"], ["apprentice", "BROAD"], ["apprentices", "BROAD"],
  ["apprenticeship", "BROAD"], ["apprenticeships", "BROAD"], ["volunteer", "BROAD"],
  ["vacancy", "BROAD"], ["vacancies", "BROAD"], ["position open", "PHRASE"],
  ["hiring near me", "PHRASE"], ["work from home", "PHRASE"],
  ["indeed", "BROAD"], ["glassdoor", "BROAD"], ["ziprecruiter", "BROAD"],

  // A.2 DIY / How-to (skipping: how to, how do, how do you, guide, guides, video, videos, yourself)
  ["diy", "BROAD"], ["do it yourself", "PHRASE"], ["howto", "BROAD"],
  ["tutorial", "BROAD"], ["tutorials", "BROAD"], ["step by step", "PHRASE"],
  ["instructions", "BROAD"], ["youtube", "BROAD"], ["template", "BROAD"],
  ["templates", "BROAD"], ["example", "BROAD"], ["examples", "BROAD"],
  ["how to fix", "PHRASE"], ["how to repair", "PHRASE"], ["how to install", "PHRASE"],
  ["how to remove", "PHRASE"], ["how to clean", "PHRASE"], ["how to replace", "PHRASE"],
  ["how to build", "PHRASE"], ["homemade", "BROAD"],

  // A.3 Education / Training (skipping: certified, how to become)
  ["school", "BROAD"], ["schools", "BROAD"], ["schooling", "BROAD"],
  ["college", "BROAD"], ["university", "BROAD"], ["class", "BROAD"],
  ["classes", "BROAD"], ["course", "BROAD"], ["courses", "BROAD"],
  ["training", "BROAD"], ["trainee", "BROAD"], ["trained", "BROAD"],
  ["certification", "BROAD"], ["certificate", "BROAD"],
  ["license cost", "PHRASE"], ["licensing", "BROAD"],
  ["license requirement", "PHRASE"], ["license requirements", "PHRASE"],
  ["become a", "PHRASE"], ["exam", "BROAD"],

  // A.4 Free / Discount (skipping: free)
  ["freebie", "BROAD"], ["giveaway", "BROAD"], ["giveaways", "BROAD"],
  ["sample", "BROAD"], ["samples", "BROAD"], ["trial", "BROAD"],
  ["discount", "BROAD"], ["discounted", "BROAD"], ["voucher", "BROAD"],
  ["coupon", "BROAD"], ["coupons", "BROAD"], ["promo code", "PHRASE"],
  ["clearance", "BROAD"], ["secondhand", "BROAD"],

  // A.5 Informational (skipping: what is, what is a, what does, what are, review, reviews, ratings)
  ["meaning", "BROAD"], ["definition", "BROAD"], ["wikipedia", "BROAD"],
  ["wiki", "BROAD"], ["reddit", "BROAD"], ["quora", "BROAD"],
  ["forum", "BROAD"], ["forums", "BROAD"], ["blog", "BROAD"],

  // A.6 Customer support (skipping: problem, problems, contact, phone number, help)
  ["complaint", "BROAD"], ["complaints", "BROAD"], ["refund", "BROAD"],
  ["refunds", "BROAD"], ["return policy", "PHRASE"], ["cancel", "BROAD"],
  ["cancellation", "BROAD"], ["warranty claim", "PHRASE"],
  ["not working", "PHRASE"], ["broken", "BROAD"], ["customer service", "PHRASE"],
  ["login", "BROAD"], ["sign in", "PHRASE"],

  // A.7 Restricted / unsafe
  ["porn", "BROAD"], ["adult", "BROAD"], ["nude", "BROAD"], ["sex", "BROAD"],
  ["gambling", "BROAD"], ["casino", "BROAD"], ["weed", "BROAD"],
  ["marijuana", "BROAD"], ["cbd", "BROAD"], ["crypto", "BROAD"],
  ["bitcoin", "BROAD"], ["nft", "BROAD"], ["mlm", "BROAD"], ["ponzi", "BROAD"],
];

console.log(`Preparing ${NEGATIVES.length} negative keywords...`);

// ── Auth ─────────────────────────────────────────────────────────────────────
async function getToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Token failed: " + JSON.stringify(j));
  return j.access_token;
}

async function gads(token, path, body) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CID}/${path}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "developer-token": DEV_TOKEN,
      "login-customer-id": LOGIN_CID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const j = await r.json();
  if (j.error) throw new Error(path + " failed: " + (j.error.message ?? JSON.stringify(j.error)));
  return j;
}

const token = await getToken();

// ── Check for existing list with same name ───────────────────────────────────
const check = await gads(token, "googleAds:search", {
  query: `SELECT shared_set.id, shared_set.name, shared_set.status FROM shared_set WHERE shared_set.name = '${LIST_NAME}' AND shared_set.type = 'NEGATIVE_KEYWORDS'`,
});

let sharedSetId;

if (check.results?.length) {
  sharedSetId = check.results[0].sharedSet.id;
  console.log(`⚠  List already exists (ID ${sharedSetId}) — will add any missing keywords.`);
} else {
  // ── Step 1: Create shared set ──────────────────────────────────────────────
  const created = await gads(token, "sharedSets:mutate", {
    operations: [{ create: { name: LIST_NAME, type: "NEGATIVE_KEYWORDS" } }],
  });
  sharedSetId = created.results[0].resourceName.split("/").pop();
  console.log(`✓ Shared set created — ID: ${sharedSetId}`);
}

const sharedSetResource = `customers/${CID}/sharedSets/${sharedSetId}`;

// ── Step 2: Batch-add keywords (500 per request max) ────────────────────────
const BATCH = 500;
let added = 0;
for (let i = 0; i < NEGATIVES.length; i += BATCH) {
  const slice = NEGATIVES.slice(i, i + BATCH);
  const ops = slice.map(([text, matchType]) => ({
    create: {
      sharedSet: sharedSetResource,
      keyword: { text, matchType },
      type: "KEYWORD",
    },
  }));
  const result = await gads(token, "sharedCriteria:mutate", { operations: ops });
  added += result.results?.length ?? 0;
  console.log(`  Added batch ${Math.floor(i / BATCH) + 1}: ${result.results?.length ?? 0} keywords`);
}
console.log(`✓ ${added} keywords added to list`);

// ── Step 3: Attach list to campaign (idempotent check first) ─────────────────
const attachCheck = await gads(token, "googleAds:search", {
  query: `SELECT campaign_shared_set.campaign, campaign_shared_set.shared_set FROM campaign_shared_set WHERE campaign_shared_set.campaign = 'customers/${CID}/campaigns/${CAMPAIGN_ID}' AND campaign_shared_set.shared_set = '${sharedSetResource}'`,
});

if (attachCheck.results?.length) {
  console.log(`⚠  List already attached to campaign ${CAMPAIGN_ID} — skipping.`);
} else {
  await gads(token, "campaignSharedSets:mutate", {
    operations: [{
      create: {
        campaign: `customers/${CID}/campaigns/${CAMPAIGN_ID}`,
        sharedSet: sharedSetResource,
      },
    }],
  });
  console.log(`✓ List attached to campaign ${CAMPAIGN_ID}`);
}

console.log(`\n── Done ──────────────────────────────────────────────────────────`);
console.log(`  List name : ${LIST_NAME}`);
console.log(`  List ID   : ${sharedSetId}`);
console.log(`  Keywords  : ${NEGATIVES.length}`);
console.log(`  Campaign  : ${CAMPAIGN_ID}`);
console.log(`\n  Verify in Google Ads → Tools → Shared Library → Negative keyword lists`);
