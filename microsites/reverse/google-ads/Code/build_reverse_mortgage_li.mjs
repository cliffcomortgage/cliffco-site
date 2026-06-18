/**
 * build_reverse_mortgage_li.mjs
 * Creates a PAUSED Search SKAG for "Reverse Mortgage — Long Island"
 *
 * Run: node Code/build_reverse_mortgage_li.mjs
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

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

// ── Campaign config ───────────────────────────────────────────────────────────
const CAMPAIGN_NAME = "Reverse Mortgage — Long Island";
const KEYWORD       = "reverse mortgage long island";
const FINAL_URL     = "https://reverse.cliffcomortgage.com/en-us/reverse-mortgage-specialist-julian-giaquinto";
const BUDGET_MICROS = "50000000"; // $50/day

const NEGATIVES = [
  "jobs","salary","salaries","career","careers","school","schools",
  "course","courses","training","apprentice","apprenticeship",
  "certification","diy","how to",
];

const PINNED = [
  { text: "Reverse Mortgage Long Island", pinnedField: "HEADLINE_1" },
  { text: "Long Island Reverse Mortgage",  pinnedField: "HEADLINE_1" },
  { text: "Reverse Mortgage Specialist",   pinnedField: "HEADLINE_1" },
];

const RSA_HEADLINES = [
  [ ...PINNED,
    { text: "Free Reverse Mortgage Quote" },  { text: "See If You Qualify Today" },
    { text: "No Monthly Payments Required" }, { text: "Stay In Your Home Longer" },
    { text: "Access Your Home Equity Now" },  { text: "HUD-Approved HECM Loans" },
    { text: "Trusted Mortgage Expert" },      { text: "Speak With Julian Today" },
    { text: "FHA-Insured Reverse Loan" },     { text: "For Homeowners 62 and Up" },
    { text: "Free Consultation Today" },      { text: "Local Long Island Expert" },
  ],
  [ ...PINNED,
    { text: "Turn Home Equity Into Cash" },   { text: "100% Free Consultation" },
    { text: "Licensed HECM Lender" },         { text: "No Monthly Bills" },
    { text: "Government-Backed Program" },    { text: "Seniors 62+ May Qualify" },
    { text: "Keep Your Home Always" },        { text: "Flexible Payment Options" },
    { text: "Understand Your Options" },      { text: "Quick Online Application" },
    { text: "Expert Guidance For Seniors" },  { text: "Call For Free Advice" },
  ],
  [ ...PINNED,
    { text: "Your Equity, Your Future" },     { text: "Live Comfortably At Home" },
    { text: "Supplement Your Retirement" },   { text: "Cliffco Mortgage Bank" },
    { text: "Trusted By LI Homeowners" },     { text: "No Prepayment Penalty" },
    { text: "FHA Insured Loan Program" },     { text: "Talk To An Expert Today" },
    { text: "HECM Specialist On LI" },        { text: "Straightforward Process" },
    { text: "Get Your Free Guide Now" },      { text: "Apply Online In Minutes" },
  ],
];

const DESCRIPTIONS = [
  { text: "Stay home & access your equity. Julian Giaquinto — Long Island HECM specialist." },
  { text: "No monthly payments required. HUD-approved for homeowners 62+. Free consultation." },
  { text: "Convert your home equity into cash. Keep the title. Stay in your home forever." },
  { text: "Cliffco Mortgage Bank — licensed Long Island lender. Get your free quote today." },
];

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

// ── Build ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\nBuilding: Reverse Mortgage — Long Island\n");
  const token = await getToken();

  // 1. Find Nassau + Suffolk county geo constants (two separate queries — GAQL doesn't support OR+parentheses)
  console.log("· Querying Nassau + Suffolk county IDs...");
  const nassauRows = await search(token, `
    SELECT geo_target_constant.id, geo_target_constant.name, geo_target_constant.canonical_name, geo_target_constant.resource_name
    FROM geo_target_constant
    WHERE geo_target_constant.target_type = 'County'
      AND geo_target_constant.country_code = 'US'
      AND geo_target_constant.name LIKE 'Nassau%'
  `);
  const suffolkRows = await search(token, `
    SELECT geo_target_constant.id, geo_target_constant.name, geo_target_constant.canonical_name, geo_target_constant.resource_name
    FROM geo_target_constant
    WHERE geo_target_constant.target_type = 'County'
      AND geo_target_constant.country_code = 'US'
      AND geo_target_constant.name LIKE 'Suffolk%'
  `);
  const nassau = nassauRows.find(r => r.geoTargetConstant.canonicalName?.includes("New York"));
  const suffolk = suffolkRows.find(r => r.geoTargetConstant.canonicalName?.includes("New York"));
  if (!nassau || !suffolk) {
    console.log("  Nassau rows:", JSON.stringify(nassauRows.map(r => r.geoTargetConstant)));
    console.log("  Suffolk rows:", JSON.stringify(suffolkRows.map(r => r.geoTargetConstant)));
    throw new Error("Could not find Nassau or Suffolk County (New York)");
  }
  const nassauRes = nassau.geoTargetConstant.resourceName;
  const suffolkRes = suffolk.geoTargetConstant.resourceName;
  console.log(`  ✓ Nassau County: ${nassauRes}`);
  console.log(`  ✓ Suffolk County: ${suffolkRes}`);

  // 2. Get all country IDs for exclusions
  console.log("· Querying country IDs for exclusions...");
  const countryRows = await search(token, `
    SELECT geo_target_constant.resource_name, geo_target_constant.id
    FROM geo_target_constant
    WHERE geo_target_constant.target_type = 'Country'
      AND geo_target_constant.status = 'ENABLED'
  `);
  const USA_ID = 2840;
  const excludedCountries = countryRows
    .filter(r => Number(r.geoTargetConstant.id) !== USA_ID)
    .map(r => r.geoTargetConstant.resourceName);
  console.log(`  ✓ ${countryRows.length} countries found — excluding ${excludedCountries.length}`);

  // 3. Budget
  console.log("· Creating budget...");
  const budgetRes = await mutate(token, "campaignBudgets", [{
    create: { name: `${CAMPAIGN_NAME} Budget`, amountMicros: BUDGET_MICROS, deliveryMethod: "STANDARD", explicitlyShared: false }
  }]);
  const budgetRN = budgetRes.results[0].resourceName;
  console.log(`  ✓ ${budgetRN}`);

  // 4. Campaign
  console.log("· Creating campaign...");
  const campaignRes = await mutate(token, "campaigns", [{
    create: {
      name: CAMPAIGN_NAME,
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

  // 5. Geo: Nassau + Suffolk (positive, presence only)
  console.log("· Adding geo targets...");
  await mutate(token, "campaignCriteria", [nassauRes, suffolkRes].map(rn => ({
    create: { campaign: campaignRN, location: { geoTargetConstant: rn } }
  })));
  console.log("  ✓ Nassau + Suffolk (Presence only)");

  // 6. Exclude all non-USA countries (batch in 999s)
  console.log(`· Excluding ${excludedCountries.length} non-USA countries...`);
  for (let i = 0; i < excludedCountries.length; i += 999) {
    const chunk = excludedCountries.slice(i, i + 999);
    await mutate(token, "campaignCriteria", chunk.map(rn => ({
      create: { campaign: campaignRN, negative: true, location: { geoTargetConstant: rn } }
    })));
  }
  console.log("  ✓ All non-USA countries excluded");

  // 7. Language: English
  console.log("· Adding language...");
  await mutate(token, "campaignCriteria", [{
    create: { campaign: campaignRN, language: { languageConstant: "languageConstants/1000" } }
  }]);
  console.log("  ✓ English");

  // 8. Ad schedule: Mon–Sun 8am–8pm
  console.log("· Adding ad schedule...");
  const DAYS = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
  await mutate(token, "campaignCriteria", DAYS.map(day => ({
    create: { campaign: campaignRN,
              adSchedule: { dayOfWeek: day, startHour: 8, startMinute: "ZERO", endHour: 20, endMinute: "ZERO" } }
  })));
  console.log("  ✓ Mon–Sun 8am–8pm");

  // 9. Negative keywords (campaign level, broad match)
  console.log("· Adding 15 universal negative keywords...");
  await mutate(token, "campaignCriteria", NEGATIVES.map(kw => ({
    create: { campaign: campaignRN, negative: true, keyword: { text: kw, matchType: "BROAD" } }
  })));
  console.log(`  ✓ ${NEGATIVES.length} negatives added`);

  // 10. Ad group
  console.log("· Creating ad group...");
  const adGroupRes = await mutate(token, "adGroups", [{
    create: { campaign: campaignRN, name: KEYWORD, status: "PAUSED" }
  }]);
  const adGroupRN = adGroupRes.results[0].resourceName;
  console.log(`  ✓ ${adGroupRN}`);

  // 11. Keyword (phrase match)
  console.log("· Adding keyword...");
  await mutate(token, "adGroupCriteria", [{
    create: { adGroup: adGroupRN, status: "ENABLED",
              keyword: { text: KEYWORD, matchType: "PHRASE" } }
  }]);
  console.log(`  ✓ "${KEYWORD}" (phrase match)`);

  // 12. 3 RSAs
  console.log("· Adding 3 RSAs...");
  for (let i = 0; i < 3; i++) {
    await mutate(token, "adGroupAds", [{
      create: {
        adGroup: adGroupRN,
        status: "PAUSED",
        ad: {
          finalUrls: [FINAL_URL],
          responsiveSearchAd: {
            headlines: RSA_HEADLINES[i].map(h =>
              h.pinnedField ? { text: h.text, pinnedField: h.pinnedField } : { text: h.text }
            ),
            descriptions: DESCRIPTIONS,
            path1: "reverse",
            path2: "mortgage",
          }
        }
      }
    }]);
    console.log(`  ✓ RSA ${i + 1}`);
  }

  const campaignId = campaignRN.split("/").pop();
  console.log(`
✓ ALL CREATED · PAUSED · Campaign ID ${campaignId}
Review at: https://ads.google.com/aw/campaigns?campaignId=${campaignId}

Verify in UI before unpausing:
  □ Campaign type: Search only (no Display, no Search Partners)
  □ Locations: Nassau + Suffolk (Presence only)
  □ Budget: $50/day · Bidding: Maximize Conversions
  □ Schedule: Mon–Sun 8am–8pm
  □ Negatives: 15 at campaign level
  □ Keyword: "${KEYWORD}" (phrase match)
  □ 3 RSAs present and PAUSED
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
