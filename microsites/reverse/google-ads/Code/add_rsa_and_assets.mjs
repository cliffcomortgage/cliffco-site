/**
 * add_rsa_and_assets.mjs
 *
 * Replaces existing RSAs on the Reverse Mortgage — Long Island campaign
 * with 3 improved RSAs (per anatomy-of-a-good-ad.md spec), then adds
 * sitelinks, callouts, and structured snippets (per ad-assets-best-practices.md).
 *
 * Run: node Code/add_rsa_and_assets.mjs
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const l of env.split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV_TOKEN, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH_TOKEN,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const BASE   = `https://googleads.googleapis.com/v21/customers/${CID}`;
const AD_GROUP_RN = `customers/${CID}/adGroups/197659213877`;
const CAMPAIGN_RN = `customers/${CID}/campaigns/23946171105`;
const FINAL_URL   = "https://reverse.cliffcomortgage.com/en-us/reverse-mortgage-specialist-julian-giaquinto";

// ── RSA copy ─────────────────────────────────────────────────────────────────

const PINNED = [
  { text: "Reverse Mortgage Long Island", pinnedField: "HEADLINE_1" },
  { text: "Long Island Reverse Mortgage",  pinnedField: "HEADLINE_1" },
  { text: "Reverse Mortgage Specialist",   pinnedField: "HEADLINE_1" },
];

// RSA 1 — Benefits-focused (offer + guarantee + CTA)
const RSA1 = {
  headlines: [
    ...PINNED,
    { text: "No Monthly Payments Required" },  // offer
    { text: "Access Your Home Equity Now" },   // offer
    { text: "Turn Home Equity Into Cash" },    // offer
    { text: "Stay In Your Home Forever" },     // guarantee
    { text: "HUD-Approved HECM Loans" },       // trust
    { text: "FHA-Insured Loan Program" },      // trust
    { text: "Licensed Mortgage Banker" },      // trust
    { text: "Free Consultation Today" },       // CTA
    { text: "Get Your Free Quote Now" },       // CTA
    { text: "Apply In Minutes Online" },       // CTA
    { text: "For Homeowners 62 and Up" },      // qualifier
    { text: "No Repayment While You Live" },   // guarantee
  ],
  descriptions: [
    { text: "Access your home equity tax-free. Stay in your home with no monthly mortgage payments." },
    { text: "Julian Giaquinto — Long Island HECM specialist. HUD-approved. Free consultation." },
    { text: "FHA-insured reverse mortgage for homeowners 62+. Keep your title. No monthly bills." },
    { text: "Free quote in minutes. Cliffco Mortgage Bank — licensed Long Island lender." },
  ],
};

// RSA 2 — Trust-focused (credentials + social proof + qualification)
const RSA2 = {
  headlines: [
    ...PINNED,
    { text: "Cliffco Mortgage Bank" },         // brand
    { text: "Licensed NY Mortgage Banker" },   // trust
    { text: "Speak With Julian Directly" },    // personal trust
    { text: "Trusted By LI Homeowners" },      // social proof
    { text: "Government-Backed Program" },     // trust
    { text: "No Hidden Fees" },                // guarantee
    { text: "Transparent Loan Process" },      // trust
    { text: "See If You Qualify Today" },      // CTA
    { text: "Check Your Eligibility Now" },    // CTA
    { text: "Free No-Obligation Quote" },      // CTA
    { text: "Fixed & Adjustable Rates" },      // offer
    { text: "For Homeowners 62 and Up" },      // qualifier
  ],
  descriptions: [
    { text: "Cliffco Mortgage — licensed LI lender. Speak with specialist Julian Giaquinto." },
    { text: "Government-backed HECM loans. No hidden fees. Transparent from start to finish." },
    { text: "Check if you qualify in minutes. No obligation. Homeowners 62+ on Long Island." },
    { text: "Fixed and adjustable rate options. Cliffco Mortgage — your local reverse mortgage expert." },
  ],
};

// RSA 3 — Lifestyle-focused (emotional + retirement + urgency)
const RSA3 = {
  headlines: [
    ...PINNED,
    { text: "Live Comfortably At Home" },      // lifestyle
    { text: "Supplement Your Retirement" },    // lifestyle
    { text: "Your Equity, Your Future" },      // emotional
    { text: "Stay In The Home You Love" },     // emotional
    { text: "Retire On Your Terms" },          // lifestyle
    { text: "No More Mortgage Payments" },     // offer
    { text: "Cash Out Without Moving" },       // offer
    { text: "HECM Specialist On LI" },         // trust
    { text: "Call For Free Advice" },          // CTA
    { text: "Get Started Today" },             // CTA
    { text: "Local Expert You Can Trust" },    // trust
    { text: "Flexible Retirement Income" },    // lifestyle
  ],
  descriptions: [
    { text: "Stay in the home you love and access your equity. No monthly mortgage payments required." },
    { text: "Supplement your retirement income with a reverse mortgage. Free consult with Julian." },
    { text: "Your home equity worked for you for years. Now let it fund your retirement. Call today." },
    { text: "Flexible HECM options for Long Island seniors 62+. Cliffco Mortgage — local expert." },
  ],
};

// ── Assets ────────────────────────────────────────────────────────────────────

const SITELINKS = [
  { linkText: "Free Quote",     d1: "Takes under 2 minutes",         d2: "No obligation, no pressure",       url: "https://cliffcomortgage.com/get-started" },
  { linkText: "How HECM Works", d1: "Plain English overview",        d2: "No jargon, no sales pitch",        url: "https://cliffcomortgage.com/reverse-mortgage" },
  { linkText: "Meet Julian",    d1: "LI reverse mortgage specialist", d2: "Licensed mortgage banker",         url: "https://cliffcomortgage.com/team-giaquinto" },
  { linkText: "Client Reviews", d1: "Real clients, real results",    d2: "See why LI homeowners choose us",  url: "https://cliffcomortgage.com/reviews" },
  { linkText: "Do I Qualify?",  d1: "Homeowners 62+ may qualify",    d2: "Free eligibility check, 2 min",    url: "https://cliffcomortgage.com/get-started" },
  { linkText: "Our Process",    d1: "From application to closing",   d2: "We guide you every step",          url: "https://cliffcomortgage.com/process" },
];

const CALLOUTS = [
  "HUD-Approved Lender",
  "No Monthly Payments",
  "Keep Your Home Title",
  "FHA-Insured HECM Loan",
  "Licensed in New York",
  "Free Consultation",
  "Serving Long Island",
  "Seniors 62+ Welcome",
  "No Prepayment Penalty",
  "Fixed & Adjustable Rates",
];

const SNIPPETS = [
  { header: "Services", values: ["HECM Loans", "Jumbo Reverse Mortgage", "HECM for Purchase", "Reverse Refinance", "Free Counseling"] },
  { header: "Types",    values: ["Fixed Rate", "Adjustable Rate", "Government-Backed", "No Monthly Payment", "Keep Your Title"] },
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

function makeRsa(rsa) {
  return {
    adGroup: AD_GROUP_RN,
    status: "PAUSED",
    ad: {
      finalUrls: [FINAL_URL],
      responsiveSearchAd: {
        headlines: rsa.headlines.map(h =>
          h.pinnedField ? { text: h.text, pinnedField: h.pinnedField } : { text: h.text }
        ),
        descriptions: rsa.descriptions,
        path1: "reverse",
        path2: "mortgage",
      },
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\nUpdating RSAs + adding assets to Reverse Mortgage — Long Island\n");
  const token = await getToken();

  // 1. Remove existing RSAs
  console.log("· Querying existing RSAs...");
  const existing = await search(token, `
    SELECT ad_group_ad.resource_name
    FROM ad_group_ad
    WHERE ad_group.resource_name = '${AD_GROUP_RN}'
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

  // 2. Add 3 new RSAs
  console.log("· Adding 3 improved RSAs...");
  for (const [i, rsa] of [RSA1, RSA2, RSA3].entries()) {
    await mutate(token, "adGroupAds", [{ create: makeRsa(rsa) }]);
    const angles = ["benefits-focused", "trust-focused", "lifestyle-focused"];
    console.log(`  ✓ RSA ${i + 1} (${angles[i]})`);
  }

  // 3. Create sitelink assets
  console.log("· Creating sitelink assets...");
  const sitelinkRes = await mutate(token, "assets", SITELINKS.map(s => ({
    create: {
      finalUrls: [s.url],
      sitelinkAsset: {
        linkText: s.linkText,
        description1: s.d1,
        description2: s.d2,
      }
    }
  })));
  const sitelinkRNs = sitelinkRes.results.map(r => r.resourceName);
  console.log(`  ✓ ${sitelinkRNs.length} sitelinks created`);

  // 4. Create callout assets
  console.log("· Creating callout assets...");
  const calloutRes = await mutate(token, "assets", CALLOUTS.map(c => ({
    create: { calloutAsset: { calloutText: c } }
  })));
  const calloutRNs = calloutRes.results.map(r => r.resourceName);
  console.log(`  ✓ ${calloutRNs.length} callouts created`);

  // 5. Create structured snippet assets
  console.log("· Creating structured snippet assets...");
  const snippetRes = await mutate(token, "assets", SNIPPETS.map(s => ({
    create: { structuredSnippetAsset: { header: s.header, values: s.values } }
  })));
  const snippetRNs = snippetRes.results.map(r => r.resourceName);
  console.log(`  ✓ ${snippetRNs.length} structured snippets created`);

  // 6. Link all assets to campaign
  console.log("· Linking assets to campaign...");
  const linkOps = [
    ...sitelinkRNs.map(rn => ({ create: { campaign: CAMPAIGN_RN, asset: rn, fieldType: "SITELINK" } })),
    ...calloutRNs.map(rn => ({ create: { campaign: CAMPAIGN_RN, asset: rn, fieldType: "CALLOUT" } })),
    ...snippetRNs.map(rn => ({ create: { campaign: CAMPAIGN_RN, asset: rn, fieldType: "STRUCTURED_SNIPPET" } })),
  ];
  await mutate(token, "campaignAssets", linkOps);
  console.log(`  ✓ ${linkOps.length} assets linked to campaign`);

  console.log(`
✓ DONE

RSAs (3, PAUSED):
  · RSA 1 — benefits-focused  (offer + guarantee + CTA angles)
  · RSA 2 — trust-focused     (credentials + social proof + qualification)
  · RSA 3 — lifestyle-focused (emotional + retirement + urgency)

Assets added at campaign level:
  · ${SITELINKS.length} sitelinks
  · ${CALLOUTS.length} callouts
  · ${SNIPPETS.length} structured snippets (Services + Types)

Review at: https://ads.google.com/aw/campaigns?campaignId=23946171105
`);
}

main().catch(err => { console.error("\n✗", err.message); process.exit(1); });
