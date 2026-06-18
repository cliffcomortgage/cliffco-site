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
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CID,
        GOOGLE_ADS_CLIENT_SECRET: CS, GOOGLE_ADS_REFRESH_TOKEN: RT,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LCID, GOOGLE_ADS_CUSTOMER_ID: CUID } = vars;
const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CID, client_secret: CS, refresh_token: RT, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();
const r = await fetch("https://googleads.googleapis.com/v21/customers/" + CUID + "/googleAds:search", {
  method: "POST",
  headers: { Authorization: "Bearer " + access_token, "developer-token": DEV, "login-customer-id": LCID, "Content-Type": "application/json" },
  body: JSON.stringify({ query: "SELECT campaign.id, campaign.name, campaign.status FROM campaign ORDER BY campaign.name ASC" }),
});
const d = await r.json();
console.log(JSON.stringify((d.results ?? []).map(x => ({ id: x.campaign.id, name: x.campaign.name, status: x.campaign.status })), null, 2));
