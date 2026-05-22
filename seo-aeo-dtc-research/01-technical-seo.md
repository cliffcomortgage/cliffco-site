# Technical SEO Strategy — Cliffco Mortgage Bankers Rebuild

**Scope:** Technical SEO foundations for the cliffcomortgage.com rebuild. Pairs with `02-aeo-llm-optimization.md` (LLM/answer-engine work), `03-ymyl-eeat-trust.md` (trust signals), `04-local-seo-territories.md` (per-territory work), and `05-product-content-strategy.md` (keyword & content).

**Date:** 2026-04-27 · **Author:** Cliffco brand/site working group

---

## 1. Audit of the current cliffcomortgage.com (external observations)

What I could verify externally without backend access:

| Signal | Observed | Notes |
|---|---|---|
| **CMS / stack** | WordPress + Elementor / ElementsKit (sitemap names `e-landing-page-sitemap.xml`, `elementskit_content-sitemap.xml`; `wp-content` URLs) | Heavy plugin stack; classic Core Web Vitals risk |
| **Title tag (homepage)** | "Cliffco Mortgage Bankers \| Home Loans in NY, NJ, FL, CT, PA, TX" | Misses AZ, MN, Long Island specificity, Orlando |
| **Licensing footer** | 27+ states (current published list: AK, AL, AZ, CA, CO, CT, DE, DC, FL, GA, IN, IL, KS, KY, LA, MD, MI, NJ, NY, NM, NC, OH, OR, PA, SC, TN, TX, VA, WA) | **The current published footer list is INCOMPLETE** — Cliffco is also licensed in MN (MN-MO-65328), MA (MC65328), MI, VT, WA, and more. See `compliance/state-licenses.md` for the canonical 32-state list. The rebuild must show the complete list. |
| **NMLS** | Corporate NMLS #65328, Uniondale NY HQ | Display NMLS prominently per CFPB / SAFE Act |
| **robots.txt** | `User-agent: * / Disallow:` (allow all) + sitemap pointer | Not blocking AI crawlers (good or bad — see AEO doc) |
| **Sitemap** | `sitemap_index.xml` with 7 child sitemaps (posts, pages, e-landing-page, elementskit-content, category, post_tag, author) | WordPress/Yoast-style; `author-sitemap.xml` exposes author pages — review for noindex if author pages are thin |
| **Schema** | Visible blocks for products, FAQs, calculators, glossary; presence of structured data not verified externally | Schema audit needed in rebuild scoping |
| **Sister brands** | cloutwmb.com (wholesale), cliffcoinc.com (Alaska entity) | Cross-link strategy needs decision (separate brand, not domain canonicalization) |
| **Tech integrations** | Ellie Mae / Encompass borrower portal, Willow Servicing payment portal | Plan for CSP / iframe handling and tracking continuity |
| **Content depth** | Blog, glossary, calculators, product pages, FAQ | Already has the bones of topical authority — rebuild can preserve URLs |

**Top external risks observed:**
- **Title/meta misalignment with stated territories** (no AZ, MN, no Long Island/Orlando specificity, missing FL "Swish Capital" DBA).
- **Florida DBA not surfaced.** Cliffco operates in Florida as **Swish Capital, Inc.** Every FL-targeted page, the Orlando branch GBP, and any FL marketing material must show this DBA disclosure (per `compliance/disclosures.md` Block 2).
- **8 physical branches available, only 1 visible.** Per `compliance/branches.md`: Uniondale NY HQ + Newark NJ + Jamaica NY + Wantagh NY + Bay Shore NY + Orlando FL + Scottsdale AZ + Excelsior MN. Each is a Google Business Profile claim opportunity and a branch landing page.
- **WordPress + Elementor stack** is notorious for INP failures from page-builder JS. Real-user data check via [PageSpeed Insights](https://pagespeed.web.dev/) and the [Chrome UX Report](https://developer.chrome.com/docs/crux) is the first audit step.
- **Author sitemap** — WordPress default exposes author archives; if these are bot-thin, [HCU](https://developers.google.com/search/blog/2024/03/core-update-spam-policies) considers this a quality signal.
- **No visible state-specific landing pages** in the homepage IA.

---

## 2. Core Web Vitals — 2026 thresholds & ranking weight

The three CWV signals and their "Good" thresholds in 2026:

| Metric | Good | Needs Improvement | Poor |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 |

INP replaced FID in March 2024 and remains the most commonly failed metric — [~43% of sites still fail it as of early 2026](https://logoswebdesigns.com/blog/core-web-vitals-2026-march-update/). Two important 2026-specific shifts to plan for:

1. **Site-level aggregation.** Per the [March 2026 Core Update analysis](https://logoswebdesigns.com/blog/core-web-vitals-2026-march-update/), CWV is now evaluated across the full domain (not strictly URL-by-URL), so a fast homepage cannot rescue a slow product page funnel.
2. **Equalized weighting.** LCP, INP, and CLS now carry equal weight as ranking signals — INP failures cost you the same as LCP failures. Treat each as a hard budget, not a tradeoff.

**Measurement stack to build into the rebuild:**
- [PageSpeed Insights](https://pagespeed.web.dev/) — manual sanity checks (lab + field via CrUX).
- [Chrome UX Report (CrUX)](https://developer.chrome.com/docs/crux) for real-user data; query via BigQuery for monthly trend dashboards.
- [`web-vitals` JS library](https://github.com/GoogleChrome/web-vitals) wired into GA4 custom events; alert on regressions.
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) on every PR — fail the build if LCP/INP/CLS budgets break.
- Real-user RUM service (Vercel Analytics, Cloudflare Web Analytics, or SpeedCurve) — budget $1–3K/yr.

---

## 3. Rendering strategy for the rebuild

**Recommendation: Astro for the marketing site, with React islands where interactivity is needed.**

Why Astro over Next.js for Cliffco's primary public site:
- The site is content + lead-gen, not a SaaS app. [Astro ships zero JS by default](https://pagepro.co/blog/astro-nextjs/), giving easier perfect Core Web Vitals scores.
- [Independent benchmarks place Astro 2–3× faster than Next.js for content-focused sites](https://www.virtualoutcomes.io/blog/nextjs-vs-astro), with measurably lower hosting costs.
- React Server Components in Next.js [do reduce client JS, but the React runtime is still always present](https://www.contentful.com/blog/astro-next-js-compared/) — Astro's HTML-first model wins on pure content SEO.
- Astro supports React, Vue, Svelte islands — so calculators, lead forms, and chatbots can still be reactive without polluting marketing pages.

When to override and use Next.js instead:
- If Cliffco wants the borrower-application portal (vs. embed Ellie Mae) and the LO microsites unified under one codebase.
- If Cliffco builds a logged-in "loan dashboard" experience.

**Implementation guardrails:**
- All product, location, and blog pages: Astro static (SSG) with on-demand rebuilds via webhooks from the CMS.
- Forms and calculators: React (or Preact) islands, lazy-hydrated via `client:visible`.
- CMS: Sanity, Contentful, or Payload CMS (self-hosted) — not WordPress. WordPress is workable but the Elementor/ElementsKit stack is what the audit shows is tanking the current site.
- Hosting: Vercel, Netlify, or Cloudflare Pages — all give CDN edge delivery, image optimization, and Core Web Vitals dashboards out of the box.

---

## 4. Information architecture & URL structure

Cliffco's site has to scale across 4 priority products × 7 territories + branded sub-brands. Without discipline, this becomes a doorway-page minefield (and Google will treat it that way under [HCU](https://www.hobo-web.co.uk/the-google-helpful-content-update-and-its-relevance-in-2026/)).

**Proposed URL structure:**

```
/                                                ← homepage
/loans/                                          ← all-loans hub
/loans/non-qm-self-employed/                     ← product hub
/loans/non-qm-self-employed/bank-statement/      ← product spoke
/loans/non-qm-self-employed/1099/                ← product spoke
/loans/reverse-mortgage/                         ← product hub
/loans/reverse-mortgage/hecm/                    ← product spoke
/loans/dscr/                                     ← product hub
/loans/fix-and-flip/                             ← product hub
/conventional/                                   ← supporting (existing audience)
/fha/  /va/  /usda/  /renovation/                ← supporting

/locations/                                      ← all-locations hub
/locations/new-york/                             ← state hub
/locations/new-york/long-island/                 ← metro hub (Cliffco home turf)
/locations/new-york/long-island/nassau-county/   ← sub-metro
/locations/new-york/long-island/suffolk-county/  ← sub-metro
/locations/new-jersey/
/locations/new-jersey/newark/                    ← branch (Newark NJ office)
/locations/arizona/
/locations/arizona/phoenix-metro/scottsdale/     ← branch (Scottsdale AZ office)
/locations/minnesota/                            ← LICENSED (MN-MO-65328)
/locations/minnesota/twin-cities/excelsior/      ← branch (Excelsior MN office)
/locations/florida/
/locations/florida/orlando/                      ← metro hub + branch (Orlando FL)

/loan-officers/                                  ← team hub
/loan-officers/[firstname-lastname-nmlsid]/      ← LO bio (E-E-A-T critical)

/learn/                                          ← education hub (blog)
/learn/[topic-cluster]/[article-slug]/

/calculators/
/calculators/dscr/  /calculators/affordability/  /calculators/reverse/

/about/  /careers/  /contact/  /press/  /reviews/

/legal/privacy/  /legal/ccpa/  /legal/accessibility/  /legal/sms-consent/
/licensing/                                      ← state-by-state license display

/es/                                             ← Spanish-language root (FL/AZ/NJ markets)
```

**Key IA principles:**
- **Hub-and-spoke for both products and locations.** Each hub links to all spokes; each spoke links back to its hub and laterally to siblings. [Sites with disciplined hub-and-spoke see AI citation rates jump from ~12% to ~41% for pillar topics](https://rankeo.io/blog/internal-linking-strategy).
- **Cross-grain linking: products × locations.** A non-QM product hub should link to the top 3-5 location pages that are highest-intent for that product (e.g., DSCR hub → Orlando, Long Island, Phoenix). Each location page should surface the products most relevant to that market.
- **Avoid combinatorial explosion.** Do NOT ship `/loans/dscr/orlando/` and `/orlando/dscr/` as separate URLs — pick one canonical spot (location hub gets the local-intent content; product hub stays national/canonical) and use rel=canonical and internal links to keep crawl tidy.
- **Breadcrumbs everywhere** with `BreadcrumbList` schema.
- **No `/page/2/` author archives or thin tag archives indexed.** WordPress's defaults must die in the rebuild.

---

## 5. Schema.org structured data — priority list

Schema is the single largest free SEO lever Cliffco isn't fully using today. JSON-LD only — never microdata or RDFa for a new build.

**Required schemas, ranked by impact:**

### A. Organization + LocalBusiness (corporate + each office)

```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "MortgageLender"],
  "name": "Cliffco Mortgage Bankers",
  "alternateName": "Cliffco, Inc.",
  "url": "https://cliffcomortgage.com",
  "logo": "https://cliffcomortgage.com/assets/logo.svg",
  "foundingDate": "1989",
  "telephone": "+1-516-408-7300",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "70 Charles Lindbergh Blvd, Suite 200",
    "addressLocality": "Uniondale",
    "addressRegion": "NY",
    "postalCode": "11553",
    "addressCountry": "US"
  },
  "areaServed": [
    {"@type": "State", "name": "New York"},
    {"@type": "State", "name": "New Jersey"},
    {"@type": "State", "name": "Arizona"},
    {"@type": "State", "name": "Florida"}
  ],
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "NMLS",
    "value": "65328"
  },
  "sameAs": [
    "https://www.linkedin.com/company/cliffco-mortgage-bankers",
    "https://www.facebook.com/cliffcomortgage",
    "https://www.instagram.com/cliffcomortgage",
    "https://nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/65328"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1247"
  }
}
```

`MortgageLender` is not a native schema.org type but Google reads `Organization` + `LocalBusiness` + `FinancialService` arrays. Use `["LocalBusiness", "FinancialService"]` (or `["Organization", "FinancialService"]` for the corporate page) — see [the schema.org financial docs](https://schema.org/docs/financial.html).

### B. MortgageLoan / FinancialProduct (one per product)

Per [schema.org/MortgageLoan](https://schema.org/MortgageLoan), the type extends `LoanOrCredit > FinancialProduct`. Apply on each product spoke page:

```json
{
  "@context": "https://schema.org",
  "@type": "MortgageLoan",
  "name": "DSCR Loan for Real Estate Investors",
  "description": "Cliffco's DSCR (Debt-Service Coverage Ratio) loan qualifies investors based on rental income — no personal income docs required. Ideal for short-term rental and long-term hold portfolios.",
  "provider": {"@type": "MortgageLender", "name": "Cliffco Mortgage Bankers", "@id": "https://cliffcomortgage.com#organization"},
  "loanType": "DSCR",
  "amount": {"@type": "MonetaryAmount", "currency": "USD", "minValue": 100000, "maxValue": 3500000},
  "interestRate": {"@type": "QuantitativeValue", "minValue": 6.5, "maxValue": 9.5, "unitText": "PERCENT"},
  "loanTerm": {"@type": "QuantitativeValue", "minValue": 5, "maxValue": 30, "unitText": "YEAR"},
  "areaServed": ["NY", "NJ", "AZ", "FL"]
}
```

### C. Person (for each licensed LO bio)

This is the highest-leverage schema for E-E-A-T per [Lily Ray's research](https://www.amsivedigital.com/insights/seo/lily-ray-eeat-deep-dive/). The `sameAs` link to NMLS Consumer Access is the credibility hook.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jane Doe",
  "jobTitle": "Senior Loan Officer",
  "worksFor": {"@id": "https://cliffcomortgage.com#organization"},
  "image": "https://cliffcomortgage.com/team/jane-doe.jpg",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "NMLS",
    "value": "1234567"
  },
  "sameAs": [
    "https://nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/1234567",
    "https://www.linkedin.com/in/janedoemortgage"
  ],
  "knowsAbout": ["DSCR loans", "Non-QM mortgages", "Self-employed borrowers"],
  "areaServed": [{"@type": "State", "name": "New York"}, {"@type": "State", "name": "Florida"}]
}
```

### D. FAQPage (still worth deploying despite reduced rich-result eligibility)

[Google now restricts FAQ rich results to government/health sites](https://developers.google.com/search/blog/2023/08/howto-faq-changes), so Cliffco won't get the Q&A SERP enhancement. **Deploy FAQ schema anyway** because:
- LLMs (ChatGPT, Perplexity, Claude) parse `FAQPage` and `Question`/`Answer` markup — this is one of the strongest AEO signals.
- Google still uses it for topical relevance and "Information Gain" scoring (per the [HCU evolution](https://www.hobo-web.co.uk/the-google-helpful-content-update-and-its-relevance-in-2026/)).
- Voice / Speakable answers and Google Assistant pull from FAQPage.

### E. BreadcrumbList, WebPage (with `about`/`mainEntity`), Article (for blog)

Standard. `Article` requires `author` (linked to a `Person` schema), `datePublished`, `dateModified`, `publisher` (linked to Organization).

### F. Review + AggregateRating

Required for review markup to render. Note Google's [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) — self-serving reviews are penalized; pull from third-party sources (Experience.com, Zillow, Google Business Profile) and aggregate.

### G. Speakable

Pair with FAQPage for voice-search and AI-assistant answers. Mark the answer paragraph as `speakable`.

### H. Service / Offer (for specific loan products on location pages)

Use `Service` with `provider`, `areaServed`, and link to the parent `MortgageLoan` for each location/product combo.

**What NOT to ship:**
- HowTo schema (deprecated in [Google's 2023 update](https://www.searchenginejournal.com/google-downgrades-visibility-of-howto-and-faq-rich-results/493522/)).
- Course / Book / Recipe — irrelevant.
- ClaimReview unless Cliffco actually fact-checks press claims.

Validate every block at build time using the [Schema Markup Validator](https://validator.schema.org/) and Google's [Rich Results Test](https://search.google.com/test/rich-results), and assert in CI.

---

## 6. XML sitemaps & robots.txt

**Sitemap structure:**

```
/sitemap-index.xml
  ├── /sitemap-pages.xml         (about, contact, legal — low frequency)
  ├── /sitemap-products.xml      (product hubs and spokes — daily lastmod check)
  ├── /sitemap-locations.xml     (state, metro, sub-metro pages)
  ├── /sitemap-loan-officers.xml (LO bios)
  ├── /sitemap-articles.xml      (blog/learn — most active)
  ├── /sitemap-news.xml          (Google News if Cliffco gets accepted; rate-update-cadence content)
  └── /sitemap-images.xml        (LO photos, branch photos, infographics)
```

Each sitemap segment must use `<lastmod>` accurately — Google [now penalizes sitemaps with always-current `lastmod`](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping). Lastmod should reflect actual content edits.

**robots.txt template (full version with AI crawler handling — see `02-aeo-llm-optimization.md`):**

```
User-agent: *
Allow: /
Disallow: /wp-admin/        # legacy guard if any WP holdovers
Disallow: /search?
Disallow: /borrower-portal/
Disallow: /admin/
Disallow: /*?utm_*           # block tracked URLs from indexing
Disallow: /*?gclid=

Sitemap: https://cliffcomortgage.com/sitemap-index.xml
```

Per the [March 2024 Site Reputation Abuse policy](https://developers.google.com/search/blog/2024/11/site-reputation-abuse) — extended in November 2024 — any third-party content (e.g., a syndicated content partner taking over a `/coupons/` directory) must have first-party editorial oversight or risk de-indexing of that subfolder. Cliffco doesn't have third-party content today, but flag this if any "monetize the domain" pitches arrive.

---

## 7. Image, video, and font optimization

**Image format cascade:** AVIF → WebP → JPEG. AVIF cuts a 500KB JPEG to ~250KB at equal visual quality and a 2MB PNG to ~400KB ([benchmark](https://ide.com/avif-in-2026-the-complete-guide-to-the-image-format-that-beat-jpeg-png-and-webp/)). Use `<picture>` element so browsers fall back gracefully:

```html
<picture>
  <source srcset="/img/hero.avif" type="image/avif">
  <source srcset="/img/hero.webp" type="image/webp">
  <img src="/img/hero.jpg" width="1280" height="720" alt="..." loading="lazy" decoding="async">
</picture>
```

LCP image specifically must NOT be `loading="lazy"` — instead, `fetchpriority="high"` and `<link rel="preload">` in the `<head>`. See [MDN's LCP image guide](https://developer.mozilla.org/en-US/blog/fix-image-lcp/).

Astro and Next.js both have `<Image>` components that handle this automatically — use them.

**Fonts (Graphik):** Once the licensed Commercial Type web kit is in hand:
- `font-display: swap` is the default; use `font-display: optional` for body to avoid CLS.
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the LCP-impacting weights only (Regular + Medium). Don't preload every weight.
- Subset the WOFF2 to Latin + Latin Extended (Spanish-language pages need extended). Drop unused glyphs.
- Self-host on the same origin (Vercel/Netlify edge) — third-party font CDNs add a DNS lookup that costs LCP ~50-150ms.

**Video:** Use lazy-loaded `<iframe loading="lazy">` for embedded YouTube. For hero-video, prefer a poster image and `preload="metadata"`. Never autoplay video as the LCP element.

---

## 8. Accessibility — WCAG 2.2 AA is the floor

Mortgage lender websites have been a frequent ADA litigation target since 2015 — settlements run $20–75K plus remediation cost. WCAG 2.2 AA is the de facto US standard ([ISO/IEC 40500:2025](https://www.vervali.com/blog/accessibility-testing-services-in-2026-the-complete-guide-to-wcag-2-2-ada-section-508-and-eaa-compliance/)) and is what plaintiffs cite.

**WCAG 2.2 added 9 criteria over 2.1:**
- Focus Not Obscured (Minimum + Enhanced) — sticky headers must not cover focused elements.
- Dragging Movements — every drag interaction needs a click/tap alternative.
- **Target Size (Minimum) 24×24 CSS pixels** — small touch targets are out.
- Consistent Help — help link must be in the same place across pages.
- Redundant Entry — don't make users re-type info already given.
- **Accessible Authentication** — no cognitive-test CAPTCHAs (math, image-pick); allow password managers.
- Focus Appearance (Enhanced).

**Mortgage-specific accessibility risk areas:**
- **Loan application forms** (Ellie Mae portal embed). The portal must be tested separately; if Ellie Mae's iframe fails WCAG, Cliffco still inherits the liability under [DOJ guidance](https://www.ada.gov/resources/2024-03-08-web-rule/).
- **Calculators** — ARIA-labeled inputs, keyboard-navigable, results announced to screen readers.
- **PDF disclosures** (TILA, RESPA documents) — must be tagged PDFs, not scanned images.
- **Color contrast** — Cliffco's brand palette (per the brand guide) must hit 4.5:1 for body text, 3:1 for large/UI; audit each combination during the rebuild.
- **Live chat** — third-party widgets often fail WCAG; pick a vendor with a public VPAT/ACR (Drift, Intercom, Tidio all have one; verify the version).

Add an `/legal/accessibility/` page citing WCAG 2.2 AA conformance, listing assistive-tech compatibility, providing a feedback email, and committing to a remediation timeline. This is a [recognized litigation defense](https://accessibe.com/blog/knowledgebase/ada-compliance-for-banks).

---

## 9. Security, privacy, and trust (technical layer)

Mortgage = PII + financial data + state regulatory exposure. Technical baseline:

- **HTTPS-only with HSTS** (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`); submit to the [HSTS preload list](https://hstspreload.org/).
- **Content Security Policy (CSP)** with nonce-based script-src — blocks XSS in lead forms.
- **Strict referrer policy**: `strict-origin-when-cross-origin`.
- **Cookie banner that doesn't tank CWV.** [Cookiebot, Osano, OneTrust, Termly](https://web.dev/articles/optimize-cls) — pick one that supports script-blocking before consent (otherwise GA / FB Pixel may cause CLS jumps). Implement the banner so it does not push content (use a fixed/sticky overlay).
- **Form security on lead/loan-app forms**: reCAPTCHA Enterprise or Cloudflare Turnstile (v3 invisible to keep CWV clean), server-side rate limiting, honeypot fields.
- **PII handling**: never log SSN, DOB, full income on the marketing site. Hand off to Encompass via secure API. Don't accept SSN on a marketing-site form — push to the formal application.
- **CCPA / state privacy**: California, Virginia, Colorado, Connecticut, Utah, Florida (FL came online July 2024), Texas, Oregon all have active comprehensive privacy laws as of 2026. Build the privacy notice + DSAR flow at launch — don't bolt it on.
- **TCPA / SMS consent**: post-FCC [March 2024 1-to-1 consent rule](https://www.fcc.gov/document/fcc-closes-tcpa-lead-generator-loophole-protect-consumers), every lead form that requests phone must have an explicit, separate consent checkbox naming Cliffco specifically. Pre-checked or bundled consent is now actionable.

---

## 10. Crawl budget, canonicalization & index hygiene

Cliffco's rebuilt site will probably ship 200–800 indexable URLs across products, locations, blog, LOs. That's small enough that crawl budget isn't a top concern — but quality bar is. [Google's Helpful Content System](https://www.gsqi.com/marketing-blog/june-2025-google-core-update/) now scores "Information Gain" — pages that don't add unique value drag the whole domain.

**Canonical & noindex strategy:**
- Each indexable page declares `<link rel="canonical" href="...">` to itself. No protocol/host variants left dangling.
- **Filter pages, search results, paginated archives, tag clouds**: `noindex, follow`.
- **Author archives**: noindex unless the author has 5+ original published pieces with substantive content.
- **Thin location pages**: until a location page has 800+ words of unique, locally-specific content + a licensed LO bio, leave it `noindex` and link to a state-level fallback.
- **`?utm_*`, `?gclid`, `?fbclid` URLs**: canonical to the clean URL; robots.txt-block the parameter forms.
- **Trailing slash policy**: pick one (recommend trailing slashes for consistency with WordPress legacy URLs to preserve link equity), 301 the alternate.

**XML sitemap = whitelist.** Only include URLs you actually want indexed. If a URL is `noindex`, it should NOT be in the sitemap. Google's [Search Console](https://search.google.com/search-console) will flag the contradiction.

---

## 11. The 2026 Google algorithm landscape — what mortgage operators must know

**1. Helpful Content System** is now part of the core ranking algorithm — not a separate update ([Hobo](https://www.hobo-web.co.uk/the-google-helpful-content-update-and-its-relevance-in-2026/)). It scores "Information Gain" mathematically — a page that paraphrases competitors loses; a page with original data, scenarios, lender-specific commitments wins. **For mortgage:** this is why anonymous AI-paraphrased mortgage blogs are getting shredded after each core update.

**2. The March 2026 Core Update** (rolled out March 27 → April 8, 2026) [doubled down on E-E-A-T for YMYL](https://logoswebdesigns.com/blog/core-web-vitals-2026-march-update/), specifically rewarding first-hand experience signals and suppressing financial content lacking regulatory disclosures. Cliffco's 36-year history is an asset to feature loudly.

**3. Site Reputation Abuse Policy** — [moved from manual action to fully algorithmic in the August 2025 spam update](https://www.digitalhitmen.com.au/blog/googles-site-reputation-abuse-policy-explained/). The November 2024 expansion clarified that even *first-party oversight* of third-party content doesn't exempt a site. Any future plan to "rent" subfolders to a content partner (e.g., a "coupons" or "deals" syndication) is dead on arrival.

**4. Spam Update June 2025** further punished low-quality scaled content. Implication: Cliffco cannot "AI-write 500 city pages and ship." Each location page needs original signals (LO licensed there, real local data, real customer scenarios).

**5. AI Overviews** — now showing on a majority of US informational mortgage queries. Optimization is covered in `02-aeo-llm-optimization.md`.

**6. Search Console policy enforcement** is faster — manual actions for thin/unoriginal content arrive within weeks of detection. Audit `Coverage` and `Manual Actions` reports weekly.

---

## 12. Tooling stack (recommended)

| Layer | Tool | Why / Cost |
|---|---|---|
| **Search Console** | Google Search Console + Bing Webmaster Tools | Free; non-negotiable. Set up domain property (not URL prefix). |
| **Crawler** | Screaming Frog SEO Spider | $209/yr. Full-site crawls, schema audits, redirect chains. |
| **Rank tracking** | Ahrefs *or* Semrush *or* SE Ranking | $200–500/mo. Pick one. |
| **AEO/LLM monitoring** | Profound, Athena HQ, or Peec.ai | $300–1,500/mo. See AEO doc. |
| **CWV monitoring** | Vercel Analytics or Cloudflare Web Analytics + `web-vitals` lib + Lighthouse CI | $0–100/mo. |
| **Schema validation** | [Schema.org Validator](https://validator.schema.org/) + [Rich Results Test](https://search.google.com/test/rich-results) + CI assertions | Free. |
| **Logs analytics** | Cloudflare Logpush → BigQuery or Splunk | $50–300/mo. Real bot traffic visibility (Googlebot, GPTBot, etc.). |
| **Reviews / GBP** | Birdeye, Podium, or Experience.com | $300–800/mo. Mortgage-tuned vendors. |
| **Heatmaps / UX** | Microsoft Clarity (free) for lead-form rage clicks; Hotjar for sampled sessions | Free–$80/mo. |
| **Analytics** | GA4 + Looker Studio dashboards + GA4-to-BigQuery export | Free for the volumes Cliffco will hit. |
| **Lead capture** | Native form → CRM webhook (Salesforce / HubSpot / Velocify / TotalExpert) | Already in stack. |

---

## 13. 30 / 60 / 90 day technical SEO checklist for the rebuild

### Days 1–30 (Discovery + foundation)

- [ ] Run baseline Core Web Vitals audit on current cliffcomortgage.com (PSI for top 25 pages by traffic; CrUX trend over 90 days).
- [ ] Crawl current site with Screaming Frog; export indexable URL inventory + redirect map.
- [ ] Use `compliance/state-licenses.md` as canonical state-license list (32 states confirmed; MN active as MN-MO-65328).
- [ ] Collect physical addresses for 7 non-HQ branches (Newark NJ, Jamaica NY, Wantagh NY, Bay Shore NY, Orlando FL, Scottsdale AZ, Excelsior MN) — required for GBP claims and branch landing pages.
- [ ] Choose stack: Astro + headless CMS (Sanity recommended) + Vercel/Netlify hosting.
- [ ] Set up Search Console domain property; verify Bing Webmaster.
- [ ] Lock URL structure (proposed in §4); document in a one-page spec the dev team must follow.
- [ ] Schema spec: write JSON-LD templates for Organization, MortgageLender, MortgageLoan, Person, FAQPage, BreadcrumbList, Review, Article. Commit to repo.
- [ ] Start collecting LO consent + photos + NMLS IDs for each licensed officer (E-E-A-T inputs).
- [ ] Procure licensed Graphik web kit from Commercial Type.

### Days 31–60 (Build)

- [ ] Build component library with WCAG 2.2 AA from day one (focus rings, target sizes, contrast).
- [ ] Implement schema templates + CI validation (build fails on schema error).
- [ ] Build 1 product hub + 2 spokes + 1 location hub + 2 sub-locations as the test pattern. Run PSI; iterate to all-green CWV before scaling.
- [ ] Implement image pipeline (AVIF → WebP → JPEG) via Astro `<Image>`.
- [ ] Configure CSP, HSTS preload, security headers via hosting platform.
- [ ] Cookie-consent vendor selection + integration that doesn't tank CWV.
- [ ] Set up redirect map (every old WordPress URL → new URL, 301).
- [ ] Wire `web-vitals` JS → GA4 events → Looker Studio dashboard.
- [ ] Set up Lighthouse CI in the deployment pipeline with INP/LCP/CLS budgets.

### Days 61–90 (Content build + pre-launch)

- [ ] Migrate / write all priority product pages (4 hubs, ~12 spokes).
- [ ] Build all priority location pages (NY, Long Island + 5 Suffolk/Nassau sub-pages, NJ, AZ, FL, Orlando + 4 Orlando metro sub-pages).
- [ ] Publish 8–12 LO bios with full schema, NMLS link, real photo, knowsAbout entries.
- [ ] Audit Encompass / Ellie Mae portal for accessibility; remediate or escalate to vendor.
- [ ] Final pre-launch: Screaming Frog crawl on staging, schema validation pass, accessibility scan (axe DevTools + manual keyboard test), CWV pass on top 50 URLs.
- [ ] Build sitemap-index + per-segment sitemaps; submit on launch day to GSC + Bing.
- [ ] Launch monitoring: GSC Coverage, manual actions, INP regression alerts, broken-link checker.
- [ ] Post-launch (week 1–2): force re-crawl, monitor 404s from old URL traffic, fix any orphaned high-traffic pages.

---

## Summary — 5 highest-impact technical moves

1. **Switch off WordPress + Elementor.** Astro static + headless CMS will deliver the CWV improvements no plugin stack ever will, and the HCU's "Information Gain" model rewards lean, original pages.
2. **Disciplined hub-and-spoke IA + JSON-LD schema on every page.** Hub-and-spoke lifts AI citation rates ~3.5× and Google now equally weights the three CWV signals — INP cannot be a tradeoff.
3. **LO bio pages with NMLS-linked Person schema** are the single biggest E-E-A-T move available. Mortgage YMYL post-March 2026 demands verifiable expertise.
4. **State-licensing accuracy + Florida DBA.** The current homepage promises only "NY, NJ, FL, CT, PA, TX" while Cliffco is actually licensed in 32 states (see `compliance/state-licenses.md`) including all five priority territories (NY, NJ, AZ, MN, FL). All FL pages must display the **"Swish Capital, Inc." DBA** disclosure (`compliance/disclosures.md` Block 2). Rewrite titles/meta to match the real footprint + ambition.
5. **Site Reputation Abuse-proof the architecture.** No third-party content rentals on the domain. Every page is first-party, original, and tied to an identifiable Cliffco author.

---

### Sources

- [Google Search Central — Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Logos Web Designs — Core Web Vitals 2026: What Google's March Update Changed](https://logoswebdesigns.com/blog/core-web-vitals-2026-march-update/)
- [Digital Applied — Core Web Vitals 2026: INP, LCP & CLS Optimization](https://www.digitalapplied.com/blog/core-web-vitals-2026-inp-lcp-cls-optimization-guide)
- [Schema.org — MortgageLoan](https://schema.org/MortgageLoan)
- [Schema.org — LoanOrCredit](https://schema.org/LoanOrCredit)
- [Schema.org — Banks and Financial Institutions docs](https://schema.org/docs/financial.html)
- [Google Search Central Blog — Site reputation abuse policy update (Nov 2024)](https://developers.google.com/search/blog/2024/11/site-reputation-abuse)
- [Search Engine Roundtable — Site reputation abuse expanded](https://www.seroundtable.com/google-site-reputation-abuse-policy-expanded-38438.html)
- [Hobo — Google's Helpful Content Update & relevance in 2026](https://www.hobo-web.co.uk/the-google-helpful-content-update-and-its-relevance-in-2026/)
- [GSQI — June 2025 Google Core Update analysis](https://www.gsqi.com/marketing-blog/june-2025-google-core-update/)
- [Pagepro — Astro vs Next.js 2026](https://pagepro.co/blog/astro-nextjs/)
- [Contentful — Astro vs Next.js features compared](https://www.contentful.com/blog/astro-next-js-compared/)
- [Virtual Outcomes — Next.js vs Astro 2026 for AI Development](https://www.virtualoutcomes.io/blog/nextjs-vs-astro)
- [IDE.com — AVIF in 2026 complete guide](https://ide.com/avif-in-2026-the-complete-guide-to-the-image-format-that-beat-jpeg-png-and-webp/)
- [MDN — Fix LCP by optimizing image loading](https://developer.mozilla.org/en-US/blog/fix-image-lcp/)
- [Vervali — Accessibility testing 2026 (WCAG 2.2 / ISO 40500)](https://www.vervali.com/blog/accessibility-testing-services-in-2026-the-complete-guide-to-wcag-2-2-ada-section-508-and-eaa-compliance/)
- [ADA.gov — 2024-03-08 Web Rule (Title II)](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [accessiBe — ADA compliance for banks 2026](https://accessibe.com/blog/knowledgebase/ada-compliance-for-banks)
- [Google Search Central Blog — HowTo and FAQ rich-result changes (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Google Search Central — FAQPage structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage)
- [Rankeo — Internal Linking Strategy for SEO & AI Visibility 2026](https://rankeo.io/blog/internal-linking-strategy)
- [SEO Kreativ — Hub-and-Spoke SEO Model](https://www.seo-kreativ.de/en/blog/hub-and-spoke-model/)
- [FCC — Closing the TCPA Lead Generator Loophole (March 2024)](https://www.fcc.gov/document/fcc-closes-tcpa-lead-generator-loophole-protect-consumers)
