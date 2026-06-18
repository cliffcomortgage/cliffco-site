/**
 * setup_conversion_action.mjs
 * Creates a "Lead · Form Submit" conversion action in Google Ads
 * then prints the AW tag ID and conversion label.
 *
 * Run: node Code/setup_conversion_action.mjs
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

const CONVERSION_NAME = "Lead · Form Submit";
const LEAD_VALUE      = 16452;
const CURRENCY        = "USD";

const token = await getToken();
const headers = {
  Authorization: "Bearer " + token,
  "developer-token": DEV_TOKEN,
  "login-customer-id": LOGIN_CID,
  "Content-Type": "application/json",
};

// ── Check for existing conversion action with the same name ──────────────────
const checkResp = await fetch(
  `https://googleads.googleapis.com/v21/customers/${CID}/googleAds:search`,
  { method: "POST", headers,
    body: JSON.stringify({ query: `SELECT conversion_action.id, conversion_action.name FROM conversion_action WHERE conversion_action.name = '${CONVERSION_NAME}'` }) }
);
const checkData = await checkResp.json();
if (checkData.error) throw new Error("Check failed: " + JSON.stringify(checkData.error));

if (checkData.results?.length) {
  const existing = checkData.results[0].conversionAction;
  console.log(`⚠  Conversion action already exists: "${existing.name}" (ID ${existing.id}) — skipping creation.`);
  console.log("   Re-fetching tag snippets...");

  const snippetResp = await fetch(
    `https://googleads.googleapis.com/v21/customers/${CID}/googleAds:search`,
    { method: "POST", headers,
      body: JSON.stringify({ query: `SELECT conversion_action.id, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.id = ${existing.id}` }) }
  );
  const snippetData = await snippetResp.json();
  if (snippetData.error) throw new Error(JSON.stringify(snippetData.error));
  const tags = snippetData.results?.[0]?.conversionAction?.tagSnippets;
  if (tags) {
    for (const t of tags) {
      if (t.type === "WEBPAGE") {
        console.log("\nGlobal site tag:\n" + t.globalSiteTag);
        console.log("\nEvent snippet:\n" + t.eventSnippet);
      }
    }
  }
  process.exit(0);
}

// ── Create the conversion action ─────────────────────────────────────────────
const body = {
  operations: [{
    create: {
      name: CONVERSION_NAME,
      category: "SUBMIT_LEAD_FORM",
      type: "WEBPAGE",
      status: "ENABLED",
      valueSettings: {
        defaultValue: LEAD_VALUE,
        defaultCurrencyCode: CURRENCY,
        alwaysUseDefaultValue: false,
      },
      countingType: "ONE_PER_CLICK",
      clickThroughLookbackWindowDays: 90,
      viewThroughLookbackWindowDays: 1,
      primaryForGoal: true,
    },
  }],
};

const createResp = await fetch(
  `https://googleads.googleapis.com/v21/customers/${CID}/conversionActions:mutate`,
  { method: "POST", headers, body: JSON.stringify(body) }
);
const createData = await createResp.json();
if (createData.error) throw new Error("Create failed: " + JSON.stringify(createData.error));

const resourceName = createData.results[0].resourceName;
const conversionId = resourceName.split("/").pop();
console.log(`✓ Conversion action created: ${resourceName}`);

// ── Fetch tag snippets ───────────────────────────────────────────────────────
const snippetResp = await fetch(
  `https://googleads.googleapis.com/v21/customers/${CID}/googleAds:search`,
  { method: "POST", headers,
    body: JSON.stringify({ query: `SELECT conversion_action.id, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.id = ${conversionId}` }) }
);
const snippetData = await snippetResp.json();
if (snippetData.error) throw new Error(JSON.stringify(snippetData.error));

const tags = snippetData.results?.[0]?.conversionAction?.tagSnippets;
if (!tags || tags.length === 0) {
  console.log("⚠  No tag snippets returned — the conversion action may still be provisioning. Check the Google Ads UI.");
  process.exit(0);
}

let awId = null;
let conversionLabel = null;

for (const t of tags) {
  if (t.type === "WEBPAGE") {
    const globalMatch = t.globalSiteTag?.match(/AW-(\d+)/);
    const labelMatch  = t.eventSnippet?.match(/send_to['":\s]+['"]([^'"]+)['"]/);
    if (globalMatch) awId = "AW-" + globalMatch[1];
    if (labelMatch)  conversionLabel = labelMatch[1];
    console.log("\n── Global site tag ──────────────────────────────────────");
    console.log(t.globalSiteTag);
    console.log("\n── Event snippet ────────────────────────────────────────");
    console.log(t.eventSnippet);
  }
}

console.log("\n── Extracted IDs ────────────────────────────────────────");
console.log("GTAG_ID          :", awId);
console.log("CONVERSION_LABEL :", conversionLabel);
