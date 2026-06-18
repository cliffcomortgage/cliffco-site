/**
 * setup_keywords_and_sitelinks.mjs
 * 1. Remove PAUSED RSAs with wrong URL, recreate with correct Vercel URL
 * 2. Add keyword list to the ad group
 * 3. Create 3 sitelink assets (Meet Julian, How a HECM Works, Client Reviews)
 * 4. Attach sitelinks to campaign
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
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CID,
        GOOGLE_ADS_CLIENT_SECRET: CS, GOOGLE_ADS_REFRESH_TOKEN: RT,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LCID, GOOGLE_ADS_CUSTOMER_ID: CUID } = vars;

const CAMPAIGN_ID  = "23946171105";
const AD_GROUP_ID  = "197659213877";
const LANDING_URL  = "https://cliffco-reverse-microsite.vercel.app/long-island/";
const BASE_URL     = "https://cliffco-reverse-microsite.vercel.app";

// ── Auth ──────────────────────────────────────────────────────────────────────
const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CID, client_secret: CS, refresh_token: RT, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();
const h = { Authorization: "Bearer " + access_token, "developer-token": DEV, "login-customer-id": LCID, "Content-Type": "application/json" };

async function gads(path, body) {
  const r = await fetch(`https://googleads.googleapis.com/v21/customers/${CUID}/${path}`, { method: "POST", headers: h, body: JSON.stringify(body) });
  const d = await r.json();
  if (d.error) throw new Error(path + ": " + (d.error.message ?? JSON.stringify(d.error)));
  return d;
}

// ── RSA copy (3 variants) ─────────────────────────────────────────────────────
const PINNED = [
  { text: "Reverse Mortgage Long Island", pinnedField: "HEADLINE_1" },
  { text: "Long Island Reverse Mortgage",  pinnedField: "HEADLINE_1" },
  { text: "Reverse Mortgage Specialist",   pinnedField: "HEADLINE_1" },
];

const RSA1 = {
  headlines: [
    ...PINNED,
    { text: "No Monthly Payments Required" },
    { text: "Access Your Home Equity Now" },
    { text: "Turn Home Equity Into Cash" },
    { text: "Stay In Your Home Forever" },
    { text: "HUD-Approved HECM Loans" },
    { text: "FHA-Insured Loan Program" },
    { text: "Licensed Mortgage Banker" },
    { text: "Free Consultation Today" },
    { text: "Get Your Free Quote Now" },
    { text: "Apply In Minutes Online" },
    { text: "For Homeowners 62 and Up" },
    { text: "No Repayment While You Live" },
  ],
  descriptions: [
    { text: "Access your home equity tax-free. Stay in your home with no monthly mortgage payments." },
    { text: "Julian Giaquinto — Long Island HECM specialist. HUD-approved. Free consultation." },
    { text: "FHA-insured reverse mortgage for homeowners 62+. Keep your title. No monthly bills." },
    { text: "Free quote in minutes. Cliffco Mortgage Bank — licensed Long Island lender." },
  ],
};

const RSA2 = {
  headlines: [
    ...PINNED,
    { text: "Cliffco Mortgage Bank" },
    { text: "Licensed NY Mortgage Banker" },
    { text: "Speak With Julian Directly" },
    { text: "Trusted By LI Homeowners" },
    { text: "Government-Backed Program" },
    { text: "No Hidden Fees" },
    { text: "Transparent Loan Process" },
    { text: "See If You Qualify Today" },
    { text: "Check Your Eligibility Now" },
    { text: "Free No-Obligation Quote" },
    { text: "Fixed & Adjustable Rates" },
    { text: "For Homeowners 62 and Up" },
  ],
  descriptions: [
    { text: "Cliffco Mortgage — licensed LI lender. Speak with specialist Julian Giaquinto." },
    { text: "Government-backed HECM loans. No hidden fees. Transparent from start to finish." },
    { text: "Check if you qualify in minutes. No obligation. Homeowners 62+ on Long Island." },
    { text: "Fixed and adjustable rate options. Cliffco Mortgage — your local reverse mortgage expert." },
  ],
};

const RSA3 = {
  headlines: [
    ...PINNED,
    { text: "Live Comfortably At Home" },
    { text: "Supplement Your Retirement" },
    { text: "Your Equity, Your Future" },
    { text: "Stay In The Home You Love" },
    { text: "Retire On Your Terms" },
    { text: "No More Mortgage Payments" },
    { text: "Cash Out Without Moving" },
    { text: "HECM Specialist On LI" },
    { text: "Call For Free Advice" },
    { text: "Get Started Today" },
    { text: "Local Expert You Can Trust" },
    { text: "Flexible Retirement Income" },
  ],
  descriptions: [
    { text: "Stay in the home you love and access your equity. No monthly mortgage payments required." },
    { text: "Supplement your retirement income with a reverse mortgage. Free consult with Julian." },
    { text: "Your home equity worked for you for years. Now let it fund your retirement. Call today." },
    { text: "Flexible HECM options for Long Island seniors 62+. Cliffco Mortgage — local expert." },
  ],
};

// ── Step 1: Remove PAUSED ads, recreate with correct URL ─────────────────────
console.log("\n── Step 1: Remove old ads & recreate with correct URL ───────────");
const adsResp = await gads("googleAds:search", {
  query: `SELECT ad_group_ad.ad.id, ad_group_ad.status FROM ad_group_ad WHERE campaign.id = ${CAMPAIGN_ID} AND ad_group_ad.status = 'PAUSED'`,
});
const pausedAds = adsResp.results ?? [];
console.log(`  Found ${pausedAds.length} PAUSED ad(s) to remove`);

if (pausedAds.length > 0) {
  const removeOps = pausedAds.map(r => ({
    remove: `customers/${CUID}/adGroupAds/${AD_GROUP_ID}~${r.adGroupAd.ad.id}`,
  }));
  await gads("adGroupAds:mutate", { operations: removeOps });
  console.log(`  ✓ Removed ${pausedAds.length} old ad(s)`);
}

// Create 3 fresh RSAs with the correct Vercel URL
const createOps = [RSA1, RSA2, RSA3].map(rsa => ({
  create: {
    adGroup: `customers/${CUID}/adGroups/${AD_GROUP_ID}`,
    status: "PAUSED",
    ad: {
      finalUrls: [LANDING_URL],
      responsiveSearchAd: {
        headlines: rsa.headlines,
        descriptions: rsa.descriptions,
      },
    },
  },
}));
const created = await gads("adGroupAds:mutate", { operations: createOps });
console.log(`  ✓ Created ${created.results?.length ?? 0} new RSA(s) → ${LANDING_URL}`);

// ── Step 2: Add keywords ──────────────────────────────────────────────────────
console.log("\n── Step 2: Add keywords ─────────────────────────────────────────");

// Curated from Keyword Ideas.csv — skips competitor brands (AAG, Mutual of Omaha,
// Longbridge, Wells Fargo, PHH, Rocket, BofA, Tom Selleck, AARP) and zero-volume terms.
// All PHRASE match. Long Island/NY geo variants added at the end.
const KEYWORDS_TO_ADD = [
  // Core product — high volume
  "reverse mortgage",
  "hecm reverse mortgage",
  "reverse home mortgage",
  "reverse mtg",
  // Intent: find a lender
  "reverse mortgage lenders",
  "reverse mortgage lenders near me",
  "reverse mortgage companies",
  "reverse mortgage companies near me",
  "reverse mortgage company",
  "best reverse mortgage",
  "best reverse mortgage company",
  "best reverse mortgage lenders",
  "best reverse mortgage company near me",
  "best reverse mortgage rates",
  "best reverse mortgage for seniors",
  "best rated reverse mortgage companies",
  "top rated reverse mortgage companies",
  "reverse mortgage brokers near me",
  "reverse mortgage providers",
  // Intent: understand product / compare
  "reverse mortgage loan",
  "reverse mortgage rates",
  "reverse mortgage interest rates",
  "hecm loan",
  "hecm",
  "hecm mortgage",
  "fha reverse mortgage",
  "hud reverse mortgage",
  "jumbo reverse mortgage",
  "home equity conversion mortgage",
  "reverse mortgage line of credit",
  "reverse equity mortgage",
  "reverse mortgages near me",
  "reverse mortgages for seniors",
  "reverse mortgage loans for seniors",
  // Long Island / NY geo
  "reverse mortgage new york",
  "reverse mortgage ny",
  "reverse mortgage new york city",
  "reverse mortgage nassau county",
  "reverse mortgage suffolk county",
  "reverse mortgage specialist long island",
  "reverse mortgage specialist new york",
];

// Fetch existing keywords to avoid duplicates
const existingResp = await gads("googleAds:search", {
  query: `SELECT ad_group_criterion.keyword.text FROM ad_group_criterion WHERE ad_group.id = ${AD_GROUP_ID} AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'`,
});
const existing = new Set((existingResp.results ?? []).map(r => r.adGroupCriterion.keyword.text.toLowerCase()));
console.log(`  Existing keywords: ${existing.size}`);

const toAdd = KEYWORDS_TO_ADD.filter(kw => !existing.has(kw.toLowerCase()));
console.log(`  Adding: ${toAdd.length} new keywords`);

if (toAdd.length > 0) {
  const ops = toAdd.map(text => ({
    create: {
      adGroup: `customers/${CUID}/adGroups/${AD_GROUP_ID}`,
      type: "KEYWORD",
      status: "ENABLED",
      keyword: { text, matchType: "PHRASE" },
    },
  }));
  const result = await gads("adGroupCriteria:mutate", { operations: ops });
  console.log(`  ✓ Added ${result.results?.length ?? 0} keywords`);
}

// ── Step 3: Create sitelink assets ────────────────────────────────────────────
console.log("\n── Step 3: Create sitelink assets ───────────────────────────────");

const SITELINKS = [
  {
    linkText: "Meet Julian",
    description1: "Your Local HECM Specialist",
    description2: "25+ Years Helping Long Island Seniors",
    url: BASE_URL + "/meet-julian/",
  },
  {
    linkText: "How a HECM Works",
    description1: "Understand Your Reverse Mortgage",
    description2: "Simple Step-by-Step Explanation",
    url: BASE_URL + "/how-hecm-works/",
  },
  {
    linkText: "Client Reviews",
    description1: "Real Stories From Local Seniors",
    description2: "See What Our Clients Are Saying",
    url: BASE_URL + "/client-reviews/",
  },
];

// Check for existing campaign sitelinks to avoid duplication
const existingSitelinksResp = await gads("googleAds:search", {
  query: `SELECT asset.id, asset.sitelink_asset.link_text FROM asset WHERE asset.type = 'SITELINK' AND asset.sitelink_asset.link_text IN ('Meet Julian','How a HECM Works','Client Reviews')`,
});
const existingSitelinkTexts = new Set(
  (existingSitelinksResp.results ?? []).map(r => r.asset.sitelinkAsset?.linkText)
);

const sitelinksToCreate = SITELINKS.filter(s => !existingSitelinkTexts.has(s.linkText));

if (sitelinksToCreate.length === 0) {
  console.log("  All sitelinks already exist — skipping asset creation");
} else {
  const assetOps = sitelinksToCreate.map(s => ({
    create: {
      finalUrls: [s.url],
      sitelinkAsset: {
        linkText: s.linkText,
        description1: s.description1,
        description2: s.description2,
      },
    },
  }));
  const assetResult = await gads("assets:mutate", { operations: assetOps });
  console.log(`  ✓ Created ${assetResult.results?.length ?? 0} sitelink asset(s)`);

  // ── Step 4: Attach sitelinks to campaign ──────────────────────────────────
  console.log("\n── Step 4: Attach sitelinks to campaign ─────────────────────────");
  const campaignAssetOps = assetResult.results.map(r => ({
    create: {
      campaign: `customers/${CUID}/campaigns/${CAMPAIGN_ID}`,
      asset: r.resourceName,
      fieldType: "SITELINK",
    },
  }));
  const attachResult = await gads("campaignAssets:mutate", { operations: campaignAssetOps });
  console.log(`  ✓ Attached ${attachResult.results?.length ?? 0} sitelink(s) to campaign`);
}

console.log("\n── Done ─────────────────────────────────────────────────────────");
console.log(`  Landing URL : ${LANDING_URL}`);
console.log(`  Keywords    : ${existing.size + toAdd.length} total in ad group`);
console.log(`  Sitelinks   : Meet Julian | How a HECM Works | Client Reviews`);
console.log("\n  Next: enable campaign + ad group when ready to go live");
