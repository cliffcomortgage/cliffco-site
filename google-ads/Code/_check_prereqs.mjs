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

const token = await getToken();
console.log("✓ OAuth token obtained");

const headers = {
  Authorization: "Bearer " + token,
  "developer-token": DEV_TOKEN,
  "login-customer-id": LOGIN_CID,
  "Content-Type": "application/json",
};

const query = `SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group.status
               FROM ad_group WHERE campaign.name = 'Reverse Mortgage — Long Island'`;

const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CID}/googleAds:search`, {
  method: "POST", headers,
  body: JSON.stringify({ query }),
});
const data = await r.json();
if (data.error) throw new Error("API error: " + JSON.stringify(data.error));

console.log("✓ API connection OK");
for (const row of (data.results || [])) {
  console.log(`  Campaign ID : ${row.campaign.id}  |  ${row.campaign.name}`);
  console.log(`  Ad Group ID : ${row.adGroup.id}  |  ${row.adGroup.name}  |  ${row.adGroup.status}`);
}
if (!data.results?.length) console.log("  (no ad groups found for that campaign name)");
