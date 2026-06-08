/**
 * Fetches a Pexels stock photo for each blog article and saves the results
 * to website/src/data/article-images.json.
 *
 * Usage:
 *   $env:PEXELS_API_KEY = "your_key_here"; node scripts/fetch-article-images.mjs
 *   # or on bash:
 *   PEXELS_API_KEY=your_key_here node scripts/fetch-article-images.mjs
 */

import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Error: PEXELS_API_KEY environment variable is required.");
  process.exit(1);
}

// One search query per category. Varied page numbers give different photos
// for articles in the same category.
const CATEGORY_QUERY = {
  "Investors":        "real estate investment property",
  "First-Time Buyers":"family buying first home",
  "Reverse Mortgage": "senior couple home retirement",
  "Self-Employed":    "small business owner entrepreneur",
  "Freelancers":      "freelancer remote work laptop",
  "Non-Citizens":     "diverse family american neighborhood",
  "Veterans":         "military veteran family home",
  "Move-Up Buyers":   "family moving new house",
  "Refinancing":      "home equity financial planning",
};

// Articles in the same order as BLOG_ARTICLES in blog-articles.ts
const articles = [
  // Investors
  { href: "/mortgage-guides/dscr-loans-real-estate-investors-guide/",              category: "Investors" },
  { href: "/mortgage-guides/what-is-an-investment-mortgage/",                       category: "Investors" },
  { href: "/mortgage-guides/blog/dscr-loans-real-estate-investors/",               category: "Investors" },
  { href: "/mortgage-guides/blog/house-hacking-fha-loan-multi-family-property/",   category: "Investors" },
  { href: "/mortgage-guides/blog/cash-reserves-investment-property-loan/",         category: "Investors" },
  { href: "/mortgage-guides/blog/investment-property-loan-self-employed/",         category: "Investors" },
  { href: "/mortgage-guides/blog/conventional-loan-vs-dscr-loan-investment-property/", category: "Investors" },
  // First-Time Buyers
  { href: "/mortgage-guides/down-payment-assistance-programs/",                    category: "First-Time Buyers" },
  { href: "/mortgage-guides/blog/mortgage-pre-approval-vs-actual-budget-first-time-homebuyer/", category: "First-Time Buyers" },
  { href: "/mortgage-guides/blog/credit-score-mortgage-application-first-time-homebuyer/",      category: "First-Time Buyers" },
  { href: "/mortgage-guides/blog/waiting-to-buy-home-first-time-homebuyer/",       category: "First-Time Buyers" },
  { href: "/mortgage-guides/blog/how-first-time-homebuyers-compete-sellers-market/", category: "First-Time Buyers" },
  { href: "/mortgage-guides/blog/down-payment-assistance-programs-first-time-homebuyers/", category: "First-Time Buyers" },
  // Reverse Mortgage
  { href: "/mortgage-guides/reverse-mortgage-guide/",                              category: "Reverse Mortgage" },
  { href: "/mortgage-guides/blog/how-does-a-reverse-mortgage-work/",              category: "Reverse Mortgage" },
  { href: "/mortgage-guides/blog/reverse-mortgage-what-happens-to-heirs-and-home/", category: "Reverse Mortgage" },
  { href: "/mortgage-guides/blog/reverse-mortgage-vs-selling-and-downsizing/",    category: "Reverse Mortgage" },
  { href: "/mortgage-guides/blog/reverse-mortgage-retirement-planning-strategy/", category: "Reverse Mortgage" },
  { href: "/mortgage-guides/blog/reverse-mortgage-costs-and-fees/",               category: "Reverse Mortgage" },
  // Self-Employed
  { href: "/mortgage-guides/non-qm-loans-guide/",                                 category: "Self-Employed" },
  { href: "/mortgage-guides/non-qm-mortgage-self-employed/",                      category: "Self-Employed" },
  { href: "/mortgage-guides/blog/why-small-business-owners-get-denied-mortgages/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/business-bank-statement-loan-mortgage-small-business-owner/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/1099-loan-vs-w2-mortgage-independent-contractor/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/pl-loan-vs-wvoe-loan-small-business-owner-mortgage/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/dscr-loan-vs-bank-statement-loan-business-owner-investment-property/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/how-mortgage-lenders-define-self-employment-independent-contractor/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/contract-gaps-inconsistent-income-mortgage-independent-contractor/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/multiple-clients-1099-income-mortgage-consultant/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/w2-to-independent-contractor-mortgage-qualification/", category: "Self-Employed" },
  { href: "/mortgage-guides/blog/mortgage-ready-financial-profile-independent-contractor/", category: "Self-Employed" },
  // Freelancers
  { href: "/mortgage-guides/blog/why-freelancers-struggle-to-buy-home/",          category: "Freelancers" },
  { href: "/mortgage-guides/blog/mortgage-qualify-multiple-income-sources-freelancer/", category: "Freelancers" },
  { href: "/mortgage-guides/blog/bank-statement-loan-freelancers/",               category: "Freelancers" },
  { href: "/mortgage-guides/blog/credit-score-tips-freelancers-mortgage/",        category: "Freelancers" },
  { href: "/mortgage-guides/blog/1099-loan-vs-bank-statement-loan-freelancer/",  category: "Freelancers" },
  // Non-Citizens
  { href: "/mortgage-guides/blog/what-is-an-itin-loan/",                          category: "Non-Citizens" },
  { href: "/mortgage-guides/blog/how-itin-holders-qualify-mortgage/",             category: "Non-Citizens" },
  { href: "/mortgage-guides/blog/building-credit-us-non-citizen-mortgage/",       category: "Non-Citizens" },
  { href: "/mortgage-guides/blog/foreign-national-loan-buy-property-us/",         category: "Non-Citizens" },
  { href: "/mortgage-guides/blog/dscr-loan-foreign-national-investor/",           category: "Non-Citizens" },
  // Veterans
  { href: "/mortgage-guides/blog/how-does-a-va-loan-work/",                       category: "Veterans" },
  { href: "/mortgage-guides/blog/va-loan-active-duty-pcs-occupancy-requirement/", category: "Veterans" },
  { href: "/mortgage-guides/blog/surviving-spouse-va-loan-eligibility/",          category: "Veterans" },
  { href: "/mortgage-guides/blog/va-loan-entitlement-explained/",                 category: "Veterans" },
  { href: "/mortgage-guides/blog/va-disability-income-mortgage-qualification/",   category: "Veterans" },
  // Move-Up Buyers
  { href: "/mortgage-guides/blog/how-to-buy-home-before-selling-current-one/",    category: "Move-Up Buyers" },
  { href: "/mortgage-guides/blog/existing-mortgage-qualify-new-home-purchase/",   category: "Move-Up Buyers" },
  { href: "/mortgage-guides/blog/why-move-up-buyers-overpay-competitive-market/", category: "Move-Up Buyers" },
  { href: "/mortgage-guides/blog/how-to-use-home-equity-buying-next-home/",       category: "Move-Up Buyers" },
  { href: "/mortgage-guides/blog/what-changes-mortgage-process-second-time-buying-home/", category: "Move-Up Buyers" },
  // Refinancing
  { href: "/mortgage-guides/blog/should-i-refinance-my-mortgage/",                category: "Refinancing" },
  { href: "/mortgage-guides/blog/cash-out-refinance-vs-heloc/",                   category: "Refinancing" },
  { href: "/mortgage-guides/blog/what-to-expect-refinance-process-application-to-closing/", category: "Refinancing" },
  { href: "/mortgage-guides/blog/va-fha-streamline-refinance/",                   category: "Refinancing" },
  { href: "/mortgage-guides/blog/how-to-refinance-after-financial-situation-changed/", category: "Refinancing" },
];

async function fetchImage(query, page) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&page=${page}&orientation=landscape&size=large`;
  const res = await fetch(url, { headers: { Authorization: API_KEY } });
  if (!res.ok) throw new Error(`Pexels API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.photos?.length) return null;
  const p = data.photos[0];
  return {
    url: p.src.large2x || p.src.large,
    alt: p.alt || query,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    pexelsUrl: p.url,
  };
}

async function main() {
  const results = {};
  const categoryPage = {};
  let count = 0;

  for (const article of articles) {
    const query = CATEGORY_QUERY[article.category] ?? "mortgage home family";
    categoryPage[article.category] = (categoryPage[article.category] ?? 0) + 1;
    const page = categoryPage[article.category];

    process.stdout.write(`[${String(++count).padStart(2)}/${articles.length}] ${article.category} p${page}: ${article.href.split("/").at(-2)} ... `);

    try {
      const img = await fetchImage(query, page);
      if (img) {
        results[article.href] = img;
        console.log(`✓ ${img.photographer}`);
      } else {
        console.log("no results");
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }

    // polite delay between requests
    await new Promise((r) => setTimeout(r, 250));
  }

  const outPath = join(__dirname, "../website/src/data/article-images.json");
  writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n");
  console.log(`\n✓ Saved ${Object.keys(results).length}/${articles.length} images to article-images.json`);
}

main();
