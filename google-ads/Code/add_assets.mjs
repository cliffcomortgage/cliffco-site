/**
 * add_assets.mjs
 * Adds campaign-level extensions (sitelinks, callouts, structured snippets) to an
 * EXISTING campaign WITHOUT touching its ads or keywords. Safe to run against a
 * live campaign: it only creates new assets and links them to the campaign.
 *
 * Reads a JSON config: { campaignId | campaignName, sitelinks[], callouts[],
 * structuredSnippets[] }. Any of the three asset arrays may be omitted.
 *
 * Run: node Code/add_assets.mjs path/to/config.json
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const configPath = process.argv[2];
if (!configPath) {
  console.error("Usage: node Code/add_assets.mjs path/to/config.json");
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));

const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const l of env.split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;

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

async function resolveCampaign(token, { campaignId, campaignName }) {
  if (campaignId) return `customers/${CID}/campaigns/${campaignId}`;
  const rows = await search(token, `SELECT campaign.resource_name FROM campaign WHERE campaign.name = '${campaignName}'`);
  if (!rows.length) throw new Error(`No campaign found named "${campaignName}"`);
  return rows[0].campaign.resourceName;
}

async function main() {
  const { sitelinks = [], callouts = [], structuredSnippets = [] } = config;
  if (!config.campaignId && !config.campaignName) throw new Error("Config needs campaignId or campaignName");
  if (!sitelinks.length && !callouts.length && !structuredSnippets.length) {
    throw new Error("Config has no sitelinks, callouts, or structuredSnippets to add");
  }

  console.log("\nAdding campaign extensions (no ads/keywords touched)\n");
  const token = await getToken();
  const campaignRN = await resolveCampaign(token, config);
  console.log(`  Campaign: ${campaignRN}`);

  const linkOps = [];

  if (sitelinks.length) {
    console.log("· Creating sitelink assets...");
    const res = await mutate(token, "assets", sitelinks.map(s => ({
      create: { finalUrls: [s.url], sitelinkAsset: { linkText: s.linkText, description1: s.d1, description2: s.d2 } }
    })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "SITELINK" } }));
    console.log(`  ✓ ${sitelinks.length} sitelinks created`);
  }

  if (callouts.length) {
    console.log("· Creating callout assets...");
    const res = await mutate(token, "assets", callouts.map(c => ({ create: { calloutAsset: { calloutText: c } } })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "CALLOUT" } }));
    console.log(`  ✓ ${callouts.length} callouts created`);
  }

  if (structuredSnippets.length) {
    console.log("· Creating structured snippet assets...");
    const res = await mutate(token, "assets", structuredSnippets.map(s => ({
      create: { structuredSnippetAsset: { header: s.header, values: s.values } }
    })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "STRUCTURED_SNIPPET" } }));
    console.log(`  ✓ ${structuredSnippets.length} structured snippets created`);
  }

  console.log("· Linking assets to campaign...");
  await mutate(token, "campaignAssets", linkOps);
  console.log(`  ✓ ${linkOps.length} assets linked`);

  const campaignId = campaignRN.split("/").pop();
  console.log(`
✓ DONE — extensions added to the campaign
${sitelinks.length ? `  · ${sitelinks.length} sitelinks\n` : ""}${callouts.length ? `  · ${callouts.length} callouts\n` : ""}${structuredSnippets.length ? `  · ${structuredSnippets.length} structured snippets\n` : ""}
Review at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
