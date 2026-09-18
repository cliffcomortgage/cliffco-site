/**
 * add_ad_groups.mjs
 * General-purpose ad-group adder for an EXISTING Cliffco Search campaign.
 * Reads a JSON config (see Code/example-add-ad-groups-config.json) and creates
 * one or more new ad groups — each PAUSED, with its keyword(s) and RSA(s) — in
 * an already-live campaign. Nothing here unpauses anything that already exists,
 * and every new ad group/RSA is created PAUSED, ready for human review.
 *
 * Run: node Code/add_ad_groups.mjs path/to/config.json
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const configPath = process.argv[2];
if (!configPath) {
  console.error("Usage: node Code/add_ad_groups.mjs path/to/config.json");
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
  if (error) throw new Error(`Token error: ${error}`);
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

async function resolveCampaign({ campaignId, campaignName }, token) {
  if (campaignId) return `customers/${CID}/campaigns/${campaignId}`;
  const rows = await search(token, `SELECT campaign.resource_name FROM campaign WHERE campaign.name = '${campaignName}'`);
  if (!rows.length) throw new Error(`No campaign found named "${campaignName}"`);
  return rows[0].campaign.resourceName;
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

async function main() {
  const { adGroups } = config;
  if (!Array.isArray(adGroups) || !adGroups.length) throw new Error("Config needs a non-empty `adGroups` array");
  if (!config.campaignId && !config.campaignName) throw new Error("Config needs campaignId or campaignName");

  const token = await getToken();
  const campaignRN = await resolveCampaign(config, token);
  const campaignId = campaignRN.split("/").pop();
  console.log(`\nAdding ${adGroups.length} ad group(s) to campaign ${campaignRN}\n`);

  for (const ag of adGroups) {
    for (const required of ["name", "keywords", "finalUrl", "rsas"]) {
      if (!ag[required]) throw new Error(`Ad group config missing required field: ${required}`);
    }

    console.log(`· Creating ad group "${ag.name}"...`);
    const agRes = await mutate(token, "adGroups", [{
      create: { campaign: campaignRN, name: ag.name, status: "PAUSED" }
    }]);
    const adGroupRN = agRes.results[0].resourceName;
    console.log(`  ✓ ${adGroupRN}`);

    console.log(`  · Adding ${ag.keywords.length} keyword(s)...`);
    await mutate(token, "adGroupCriteria", ag.keywords.map(k => ({
      create: { adGroup: adGroupRN, status: "ENABLED",
                keyword: { text: k.text, matchType: k.matchType || "PHRASE" } }
    })));
    ag.keywords.forEach(k => console.log(`    ✓ "${k.text}" (${k.matchType || "PHRASE"})`));

    console.log(`  · Adding ${ag.rsas.length} RSA(s)...`);
    for (let i = 0; i < ag.rsas.length; i++) {
      await mutate(token, "adGroupAds", [{ create: makeRsa(ag.rsas[i], adGroupRN, ag.finalUrl, ag.path1, ag.path2) }]);
      console.log(`    ✓ RSA ${i + 1}`);
    }
  }

  console.log(`
✓ ALL CREATED · PAUSED · ${adGroups.length} new ad group(s) in campaign ${campaignId}
Review at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}

Nothing above is live yet. Verify in the UI, then unpause each ad group + its RSA(s) when ready:
  □ Keyword text/match type is correct for each ad group
  □ RSAs read well and the pinned "Minnesota"/"Fast Approval" headlines still lead
  □ Final URL is correct
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
