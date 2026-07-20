/**
 * create_campaign.mjs
 * General-purpose Search campaign creator for any Cliffco Google Ads campaign.
 * Reads a JSON config (see Code/example-new-campaign-config.json) and creates a
 * PAUSED campaign + ad group + keyword(s) + RSA(s), ready for human review before
 * unpausing. Nothing here is specific to one product, geography, or loan officer.
 *
 * Run: node Code/create_campaign.mjs path/to/config.json
 *
 * Supersedes build_reverse_mortgage_li.mjs (kept only as a historical record of
 * how the live "Reverse Mortgage — Long Island" campaign was created — do not
 * reuse it, it hardcodes a retired loan officer and a stale landing URL).
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const configPath = process.argv[2];
if (!configPath) {
  console.error("Usage: node Code/create_campaign.mjs path/to/config.json");
  console.error("See Code/example-new-campaign-config.json for the shape.");
  process.exit(1);
}
const config = JSON.parse(readFileSync(configPath, "utf8"));

const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const line of env.split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE = `https://googleads.googleapis.com/v21/customers/${CID}`;
const USA_COUNTRY_ID = 2840;

// ── Helpers ───────────────────────────────────────────────────────────────────
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
    method: "POST", headers: hdrs(token),
    body: JSON.stringify({ operations }),
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
    method: "POST", headers: hdrs(token),
    body: JSON.stringify({ query }),
  });
  const data = await r.json();
  if (data.error) {
    const msg = data.error?.details?.[0]?.errors?.[0]?.message || data.error.message;
    throw new Error(`[search] ${msg}`);
  }
  return data.results || [];
}

// Look up a geo target (state, county, or city) by name. Logs a warning if more
// than one US match is found, so the operator can double-check the pick.
async function findGeoTarget(token, name) {
  const rows = await search(token, `
    SELECT geo_target_constant.id, geo_target_constant.name, geo_target_constant.canonical_name, geo_target_constant.resource_name
    FROM geo_target_constant
    WHERE geo_target_constant.country_code = 'US'
      AND geo_target_constant.name LIKE '${name}%'
  `);
  const usMatches = rows.filter(r => r.geoTargetConstant.canonicalName?.includes("United States"));
  if (!usMatches.length) throw new Error(`No US geo target found matching "${name}"`);
  if (usMatches.length > 1) {
    console.log(`  ⚠ multiple geo matches for "${name}" — using the first:`);
    usMatches.forEach(r => console.log(`     ${r.geoTargetConstant.canonicalName}`));
  }
  return usMatches[0].geoTargetConstant.resourceName;
}

function makeRsa(rsa, finalUrl, path1, path2) {
  return {
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
    status: "PAUSED",
  };
}

// ── Build ─────────────────────────────────────────────────────────────────────
async function main() {
  const {
    campaignName, budgetMicrosPerDay, geoTargets = [], language = "English",
    adSchedule = null, adGroupName, keywords, negativeKeywords = [],
    finalUrl, path1, path2, rsas,
  } = config;

  for (const required of ["campaignName", "budgetMicrosPerDay", "adGroupName", "keywords", "finalUrl", "rsas"]) {
    if (!config[required]) throw new Error(`Config is missing required field: ${required}`);
  }

  console.log(`\nBuilding: ${campaignName}\n`);
  const token = await getToken();

  // 1. Budget
  console.log("· Creating budget...");
  const budgetRes = await mutate(token, "campaignBudgets", [{
    create: { name: `${campaignName} Budget`, amountMicros: String(budgetMicrosPerDay), deliveryMethod: "STANDARD", explicitlyShared: false }
  }]);
  const budgetRN = budgetRes.results[0].resourceName;
  console.log(`  ✓ ${budgetRN}`);

  // 2. Campaign (always PAUSED — never auto-launch)
  console.log("· Creating campaign...");
  const campaignRes = await mutate(token, "campaigns", [{
    create: {
      name: campaignName,
      status: "PAUSED",
      advertisingChannelType: "SEARCH",
      campaignBudget: budgetRN,
      networkSettings: { targetGoogleSearch: true, targetSearchNetwork: false,
                         targetContentNetwork: false, targetPartnerSearchNetwork: false },
      maximizeConversions: {},
      geoTargetTypeSetting: { positiveGeoTargetType: "PRESENCE", negativeGeoTargetType: "PRESENCE" },
      containsEuPoliticalAdvertising: "DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING",
    }
  }]);
  const campaignRN = campaignRes.results[0].resourceName;
  console.log(`  ✓ ${campaignRN}`);

  // 3. Geo targeting
  if (geoTargets.length) {
    console.log(`· Looking up ${geoTargets.length} geo target(s)...`);
    const geoRNs = [];
    for (const name of geoTargets) {
      const rn = await findGeoTarget(token, name);
      geoRNs.push(rn);
      console.log(`  ✓ ${name} → ${rn}`);
    }
    await mutate(token, "campaignCriteria", geoRNs.map(rn => ({
      create: { campaign: campaignRN, location: { geoTargetConstant: rn } }
    })));

    // Sub-national targeting needs the country-exclusion trick, or Google can
    // still show ads to people outside the US who searched about the location.
    console.log("· Excluding non-USA countries (required for sub-national targeting)...");
    const countryRows = await search(token, `
      SELECT geo_target_constant.resource_name, geo_target_constant.id
      FROM geo_target_constant
      WHERE geo_target_constant.target_type = 'Country'
        AND geo_target_constant.status = 'ENABLED'
    `);
    const excludedCountries = countryRows
      .filter(r => Number(r.geoTargetConstant.id) !== USA_COUNTRY_ID)
      .map(r => r.geoTargetConstant.resourceName);
    for (let i = 0; i < excludedCountries.length; i += 999) {
      const chunk = excludedCountries.slice(i, i + 999);
      await mutate(token, "campaignCriteria", chunk.map(rn => ({
        create: { campaign: campaignRN, negative: true, location: { geoTargetConstant: rn } }
      })));
    }
    console.log(`  ✓ ${excludedCountries.length} non-USA countries excluded`);
  } else {
    console.log("· No geo targets given — targeting United States nationally...");
    await mutate(token, "campaignCriteria", [{
      create: { campaign: campaignRN, location: { geoTargetConstant: `geoTargetConstants/${USA_COUNTRY_ID}` } }
    }]);
    console.log("  ✓ United States");
  }

  // 4. Language
  console.log(`· Adding language (${language})...`);
  const langRows = await search(token, `
    SELECT language_constant.resource_name, language_constant.name
    FROM language_constant WHERE language_constant.name = '${language}'
  `);
  if (!langRows.length) throw new Error(`Unknown language: ${language}`);
  await mutate(token, "campaignCriteria", [{
    create: { campaign: campaignRN, language: { languageConstant: langRows[0].languageConstant.resourceName } }
  }]);
  console.log(`  ✓ ${language}`);

  // 5. Ad schedule (optional — omit for always-on)
  if (adSchedule) {
    console.log("· Adding ad schedule...");
    await mutate(token, "campaignCriteria", adSchedule.days.map(day => ({
      create: { campaign: campaignRN,
                adSchedule: { dayOfWeek: day, startHour: adSchedule.startHour, startMinute: "ZERO",
                              endHour: adSchedule.endHour, endMinute: "ZERO" } }
    })));
    console.log(`  ✓ ${adSchedule.days.join(", ")} ${adSchedule.startHour}:00–${adSchedule.endHour}:00`);
  }

  // 6. Negative keywords (campaign level, broad match)
  if (negativeKeywords.length) {
    console.log(`· Adding ${negativeKeywords.length} negative keyword(s)...`);
    await mutate(token, "campaignCriteria", negativeKeywords.map(kw => ({
      create: { campaign: campaignRN, negative: true, keyword: { text: kw, matchType: "BROAD" } }
    })));
    console.log(`  ✓ ${negativeKeywords.length} negatives added`);
  }

  // 7. Ad group
  console.log("· Creating ad group...");
  const adGroupRes = await mutate(token, "adGroups", [{
    create: { campaign: campaignRN, name: adGroupName, status: "PAUSED" }
  }]);
  const adGroupRN = adGroupRes.results[0].resourceName;
  console.log(`  ✓ ${adGroupRN}`);

  // 8. Keyword(s)
  console.log(`· Adding ${keywords.length} keyword(s)...`);
  await mutate(token, "adGroupCriteria", keywords.map(k => ({
    create: { adGroup: adGroupRN, status: "ENABLED",
              keyword: { text: k.text, matchType: k.matchType || "PHRASE" } }
  })));
  keywords.forEach(k => console.log(`  ✓ "${k.text}" (${k.matchType || "PHRASE"})`));

  // 9. RSAs
  console.log(`· Adding ${rsas.length} RSA(s)...`);
  for (let i = 0; i < rsas.length; i++) {
    await mutate(token, "adGroupAds", [{
      create: { adGroup: adGroupRN, ...makeRsa(rsas[i], finalUrl, path1, path2) }
    }]);
    console.log(`  ✓ RSA ${i + 1}`);
  }

  const campaignId = campaignRN.split("/").pop();
  console.log(`
✓ ALL CREATED · PAUSED · Campaign ID ${campaignId}
Review at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}

Verify in the UI before unpausing — nothing above went live:
  □ Campaign type, locations, budget, and bidding strategy match what you intended
  □ Ad schedule (if any) is correct
  □ Negatives are present
  □ Keyword(s) and match types are correct
  □ All RSAs present and PAUSED, landing URL is correct
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
