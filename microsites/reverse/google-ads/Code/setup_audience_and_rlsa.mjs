/**
 * setup_audience_and_rlsa.mjs
 * Step 5 + 7 of the conversion-tracking SOP:
 *   1. Creates "Reverse LP Visitors — Warm Pixel" remarketing list
 *      (all visitors to reverse.cliffcomortgage.com, 540-day membership)
 *   2. Attaches it to ad group 197659213877 as RLSA observation at +50%
 *
 * Run: node Code/setup_audience_and_rlsa.mjs
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

async function getToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error("Token fetch failed: " + JSON.stringify(j));
  return j.access_token;
}

const AD_GROUP_ID = "197659213877";
const USER_LIST_NAME = "Reverse LP Visitors — Warm Pixel";
const DOMAIN = "reverse.cliffcomortgage.com";

const token = await getToken();
const headers = {
  Authorization: "Bearer " + token,
  "developer-token": DEV_TOKEN,
  "login-customer-id": LOGIN_CID,
  "Content-Type": "application/json",
};

// ── Step 5: Create warm-pixel audience ──────────────────────────────────────
console.log("── Step 5: Creating warm-pixel remarketing audience ────────────");

// Check if audience already exists
const checkResp = await fetch(
  `https://googleads.googleapis.com/v24/customers/${CID}/googleAds:search`,
  { method: "POST", headers,
    body: JSON.stringify({ query: `SELECT user_list.id, user_list.name, user_list.resource_name FROM user_list WHERE user_list.name = '${USER_LIST_NAME}'` }) }
);
const checkData = await checkResp.json();
if (checkData.error) throw new Error("Check failed: " + JSON.stringify(checkData.error));

let userListResourceName;

if (checkData.results?.length) {
  const existing = checkData.results[0].userList;
  userListResourceName = existing.resourceName;
  console.log(`⚠  User list already exists: "${existing.name}" (ID ${existing.id}) — skipping creation.`);
} else {
  const createBody = {
    operations: [{
      create: {
        name: USER_LIST_NAME,
        description: `All visitors to ${DOMAIN} — 540-day membership`,
        membershipLifeSpan: 540,
        ruleBasedUserList: {
          prepopulationStatus: "REQUESTED",
          flexibleRuleUserList: {
            inclusiveRuleOperator: "OR",
            inclusiveOperands: [{
              rule: {
                ruleItemGroups: [{
                  ruleItems: [{
                    name: "url__",
                    stringRuleItem: {
                      operator: "CONTAINS",
                      value: DOMAIN,
                    },
                  }],
                }],
              },
            }],
          },
        },
      },
    }],
  };

  const createResp = await fetch(
    `https://googleads.googleapis.com/v24/customers/${CID}/userLists:mutate`,
    { method: "POST", headers, body: JSON.stringify(createBody) }
  );
  const createData = await createResp.json();
  if (createData.error) throw new Error("Create user list failed: " + JSON.stringify(createData.error));

  userListResourceName = createData.results[0].resourceName;
  const userListId = userListResourceName.split("/").pop();
  console.log(`✓ User list created: ${userListResourceName}`);
  console.log(`  ID: ${userListId}`);
  console.log(`  Domain: ${DOMAIN}`);
  console.log(`  Membership: 540 days`);
}

// ── Step 7: Attach RLSA to ad group ─────────────────────────────────────────
console.log("\n── Step 7: Attaching RLSA to ad group ──────────────────────────");

// Check if criterion already exists on this ad group for this user list
const criterionCheckResp = await fetch(
  `https://googleads.googleapis.com/v24/customers/${CID}/googleAds:search`,
  { method: "POST", headers,
    body: JSON.stringify({ query: `SELECT ad_group_criterion.criterion_id, ad_group_criterion.user_list.user_list, ad_group_criterion.bid_modifier FROM ad_group_criterion WHERE ad_group_criterion.ad_group = 'customers/${CID}/adGroups/${AD_GROUP_ID}' AND ad_group_criterion.type = 'USER_LIST'` }) }
);
const criterionCheckData = await criterionCheckResp.json();
if (criterionCheckData.error) throw new Error("Criterion check failed: " + JSON.stringify(criterionCheckData.error));

const existingCriterion = criterionCheckData.results?.find(
  r => r.adGroupCriterion?.userList?.userList === userListResourceName
);

if (existingCriterion) {
  console.log(`⚠  RLSA criterion already exists on ad group ${AD_GROUP_ID} — skipping.`);
  console.log(`   Criterion ID: ${existingCriterion.adGroupCriterion.criterionId}`);
  console.log(`   Bid modifier: ×${existingCriterion.adGroupCriterion.bidModifier}`);
} else {
  const rlsaBody = {
    operations: [{
      create: {
        adGroup: `customers/${CID}/adGroups/${AD_GROUP_ID}`,
        status: "ENABLED",
        bidModifier: 1.5,
        userList: {
          userList: userListResourceName,
        },
      },
    }],
  };

  const rlsaResp = await fetch(
    `https://googleads.googleapis.com/v24/customers/${CID}/adGroupCriteria:mutate`,
    { method: "POST", headers, body: JSON.stringify(rlsaBody) }
  );
  const rlsaData = await rlsaResp.json();
  if (rlsaData.error) throw new Error("RLSA attach failed: " + JSON.stringify(rlsaData.error));

  const criterionResourceName = rlsaData.results[0].resourceName;
  console.log(`✓ RLSA criterion attached: ${criterionResourceName}`);
  console.log(`  Ad group: customers/${CID}/adGroups/${AD_GROUP_ID}`);
  console.log(`  Audience: ${userListResourceName}`);
  console.log(`  Bid modifier: ×1.5 (+50%)`);
  console.log(`  Mode: OBSERVATION (existing keyword targeting preserved)`);
}

console.log("\n── Done ─────────────────────────────────────────────────────────");
console.log("Next: verify the audience populates in Google Ads UI within 24–48h");
console.log("      and confirm bid modifier appears on the ad group's Audiences tab.");
