/**
 * update_ads_and_assets.mjs
 * General-purpose RSA + asset refresher for any existing Cliffco campaign/ad group.
 * Reads a JSON config (see Code/example-update-campaign-config.json), removes any
 * existing RSAs on the target ad group, adds the new ones (PAUSED), and creates
 * any given sitelinks/callouts/structured snippets at the campaign level.
 *
 * Run: node Code/update_ads_and_assets.mjs path/to/config.json
 *
 * Supersedes add_rsa_and_assets.mjs (kept only as a historical record of the
 * live "Reverse Mortgage — Long Island" campaign's last refresh — do not reuse
 * it, it hardcodes a retired loan officer's copy and one specific ad group ID).
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const configPath = process.argv[2];
if (!configPath) {
  console.error("Usage: node Code/update_ads_and_assets.mjs path/to/config.json");
  console.error("See Code/example-update-campaign-config.json for the shape.");
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

const BASE = `https://googleads.googleapis.com/v21/customers/${CID}`;

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

async function resolveCampaign(token, { campaignId, campaignName }) {
  if (campaignId) return `customers/${CID}/campaigns/${campaignId}`;
  const rows = await search(token, `SELECT campaign.resource_name FROM campaign WHERE campaign.name = '${campaignName}'`);
  if (!rows.length) throw new Error(`No campaign found named "${campaignName}"`);
  return rows[0].campaign.resourceName;
}

async function resolveAdGroup(token, campaignRN, { adGroupId, adGroupName }) {
  if (adGroupId) return `customers/${CID}/adGroups/${adGroupId}`;
  const rows = await search(token, `SELECT ad_group.resource_name FROM ad_group WHERE campaign.resource_name = '${campaignRN}' AND ad_group.name = '${adGroupName}'`);
  if (!rows.length) throw new Error(`No ad group found named "${adGroupName}" in that campaign`);
  return rows[0].adGroup.resourceName;
}

function makeRsa(rsa, adGroupRN, finalUrl, path1, path2) {
  return {
    adGroup: adGroupRN,
    status: "PAUSED",
    ad: {
      finalUrls: [finalUrl],
      responsiveSearchAd: {
        headlines: rsa.headlines.map(h =>
          h.pinnedField ? { text: h.text, pinnedField: h.pinnedField } : { text: h.text }
        ),
        descriptions: rsa.descriptions.map(d => (typeof d === "string" ? { text: d } : d)),
        ...(path1 ? { path1 } : {}),
        ...(path2 ? { path2 } : {}),
      },
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const { finalUrl, path1, path2, rsas, sitelinks = [], callouts = [], structuredSnippets = [] } = config;
  for (const required of ["finalUrl", "rsas"]) {
    if (!config[required]) throw new Error(`Config is missing required field: ${required}`);
  }
  if (!config.campaignId && !config.campaignName) throw new Error("Config needs campaignId or campaignName");
  if (!config.adGroupId && !config.adGroupName) throw new Error("Config needs adGroupId or adGroupName");

  console.log("\nUpdating RSAs + assets\n");
  const token = await getToken();

  const campaignRN = await resolveCampaign(token, config);
  const adGroupRN = await resolveAdGroup(token, campaignRN, config);
  console.log(`  Campaign: ${campaignRN}`);
  console.log(`  Ad group: ${adGroupRN}`);

  // 1. Remove existing RSAs on this ad group
  console.log("· Querying existing RSAs...");
  const existing = await search(token, `
    SELECT ad_group_ad.resource_name
    FROM ad_group_ad
    WHERE ad_group.resource_name = '${adGroupRN}'
      AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
      AND ad_group_ad.status != 'REMOVED'
  `);
  if (existing.length) {
    console.log(`  Found ${existing.length} existing RSA(s) — removing...`);
    await mutate(token, "adGroupAds", existing.map(r => ({ remove: r.adGroupAd.resourceName })));
    console.log("  ✓ Removed");
  } else {
    console.log("  None found");
  }

  // 2. Add new RSAs (PAUSED)
  console.log(`· Adding ${rsas.length} RSA(s)...`);
  for (let i = 0; i < rsas.length; i++) {
    await mutate(token, "adGroupAds", [{ create: makeRsa(rsas[i], adGroupRN, finalUrl, path1, path2) }]);
    console.log(`  ✓ RSA ${i + 1}`);
  }

  const linkOps = [];

  // 3. Sitelinks
  if (sitelinks.length) {
    console.log("· Creating sitelink assets...");
    const res = await mutate(token, "assets", sitelinks.map(s => ({
      create: { finalUrls: [s.url], sitelinkAsset: { linkText: s.linkText, description1: s.d1, description2: s.d2 } }
    })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "SITELINK" } }));
    console.log(`  ✓ ${sitelinks.length} sitelinks created`);
  }

  // 4. Callouts
  if (callouts.length) {
    console.log("· Creating callout assets...");
    const res = await mutate(token, "assets", callouts.map(c => ({ create: { calloutAsset: { calloutText: c } } })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "CALLOUT" } }));
    console.log(`  ✓ ${callouts.length} callouts created`);
  }

  // 5. Structured snippets
  if (structuredSnippets.length) {
    console.log("· Creating structured snippet assets...");
    const res = await mutate(token, "assets", structuredSnippets.map(s => ({
      create: { structuredSnippetAsset: { header: s.header, values: s.values } }
    })));
    res.results.forEach(r => linkOps.push({ create: { campaign: campaignRN, asset: r.resourceName, fieldType: "STRUCTURED_SNIPPET" } }));
    console.log(`  ✓ ${structuredSnippets.length} structured snippets created`);
  }

  // 6. Link all assets to the campaign
  if (linkOps.length) {
    console.log("· Linking assets to campaign...");
    await mutate(token, "campaignAssets", linkOps);
    console.log(`  ✓ ${linkOps.length} assets linked`);
  }

  const campaignId = campaignRN.split("/").pop();
  console.log(`
✓ DONE — ${rsas.length} RSA(s) added, PAUSED for review
${sitelinks.length ? `  · ${sitelinks.length} sitelinks\n` : ""}${callouts.length ? `  · ${callouts.length} callouts\n` : ""}${structuredSnippets.length ? `  · ${structuredSnippets.length} structured snippets\n` : ""}
Review at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
