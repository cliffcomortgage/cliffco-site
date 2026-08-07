/**
 * add_sitelinks.mjs
 * Adds sitelink assets to an existing campaign WITHOUT touching its RSAs or
 * other assets (unlike update_ads_and_assets.mjs, which clears + re-adds RSAs).
 * Reads a JSON config: { campaignId | campaignName, sitelinks: [{linkText, url, d1, d2}] }
 *
 * Run: node Code/add_sitelinks.mjs path/to/config.json
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const configPath = process.argv[2];
if (!configPath) { console.error("Usage: node Code/add_sitelinks.mjs path/to/config.json"); process.exit(1); }
const config = JSON.parse(readFileSync(configPath, "utf8"));

const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const l of env.split("\n")) { const m = l.match(/^([^#=]+)=(.*)$/); if (m) vars[m[1].trim()] = m[2].trim(); }
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;

async function getToken() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH_TOKEN, grant_type: "refresh_token" }),
  });
  const { access_token, error } = await r.json();
  if (error) throw new Error(`Token: ${error}`);
  return access_token;
}
function hdrs(t) { return { Authorization: `Bearer ${t}`, "developer-token": DEV_TOKEN, "login-customer-id": LOGIN_CID, "Content-Type": "application/json" }; }
async function mutate(t, service, operations) {
  const r = await fetch(`${BASE}/${service}:mutate`, { method: "POST", headers: hdrs(t), body: JSON.stringify({ operations }) });
  const d = await r.json();
  if (d.error) throw new Error(`[${service}] ${d.error?.details?.[0]?.errors?.[0]?.message || d.error.message}`);
  return d;
}
async function search(t, query) {
  const r = await fetch(`${BASE}/googleAds:search`, { method: "POST", headers: hdrs(t), body: JSON.stringify({ query }) });
  const d = await r.json();
  if (d.error) throw new Error(`[search] ${d.error?.details?.[0]?.errors?.[0]?.message || d.error.message}`);
  return d.results || [];
}

async function main() {
  const { sitelinks = [] } = config;
  if (!sitelinks.length) throw new Error("Config has no sitelinks");
  if (!config.campaignId && !config.campaignName) throw new Error("Config needs campaignId or campaignName");

  // Validate lengths (linkText <=25, descriptions <=35)
  const problems = [];
  sitelinks.forEach((s) => {
    if (!s.linkText || s.linkText.length > 25) problems.push(`linkText bad (${s.linkText?.length}): "${s.linkText}"`);
    if (s.d1 && s.d1.length > 35) problems.push(`d1 >35 (${s.d1.length}): "${s.d1}"`);
    if (s.d2 && s.d2.length > 35) problems.push(`d2 >35 (${s.d2.length}): "${s.d2}"`);
    if (!s.url) problems.push(`missing url for "${s.linkText}"`);
  });
  if (problems.length) throw new Error("Validation:\n" + problems.join("\n"));

  const token = await getToken();
  const campaignRN = config.campaignId
    ? `customers/${CID}/campaigns/${config.campaignId}`
    : (await search(token, `SELECT campaign.resource_name FROM campaign WHERE campaign.name = '${config.campaignName}'`))[0]?.campaign.resourceName;
  if (!campaignRN) throw new Error("Campaign not found");

  console.log(`\nAdding ${sitelinks.length} sitelinks to ${campaignRN}\n`);
  const res = await mutate(token, "assets", sitelinks.map(s => ({
    create: { finalUrls: [s.url], sitelinkAsset: { linkText: s.linkText, ...(s.d1 ? { description1: s.d1 } : {}), ...(s.d2 ? { description2: s.d2 } : {}) } }
  })));
  console.log(`  ✓ ${res.results.length} sitelink assets created`);

  await mutate(token, "campaignAssets", res.results.map(r => ({
    create: { campaign: campaignRN, asset: r.resourceName, fieldType: "SITELINK" }
  })));
  const campaignId = campaignRN.split("/").pop();
  console.log(`  ✓ linked to campaign\n\n✓ DONE — sitelinks added (campaign stays PAUSED)\nReview at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}\n`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
