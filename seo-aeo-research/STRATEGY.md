# Cliffco SEO + AEO Master Strategy

**Mission:** Make Cliffco Mortgage Bankers the lender that ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews cite first when a borrower asks for non-QM, reverse, DSCR, or fix-and-flip help in NY/NJ/AZ/FL — and make Google's organic search results match.

**Date:** 2026-04-27

---

## How to read this folder

- **`STRATEGY.md`** (this doc) — the synthesized roadmap; start here, then drill into the supporting docs.
- **`01-technical-seo.md`** — site rebuild stack, schema, Core Web Vitals, IA, accessibility, security, crawl hygiene.
- **`02-aeo-llm-optimization.md`** — how to be cited by ChatGPT/Claude/Perplexity/Gemini/AIO; AI crawlers; entity SEO; off-site authority for LLMs.
- **`03-ymyl-eeat-trust.md`** — E-E-A-T, NMLS-LO bios, reviews, PR, compliance disclosures, reputation defense.
- **`04-local-seo-territories.md`** — per-territory deep dive across NY/Long Island/NJ/AZ/MN/FL/Orlando.
- **`05-product-content-strategy.md`** — keyword + content cluster + competitor analysis for Non-QM, Reverse, DSCR, Fix-and-Flip + 90-day calendar.

---

## The strategic insight

Cliffco's owner is right that LLMs are now the primary discovery surface for many high-intent mortgage borrowers — but the implication isn't to abandon SEO. **The trust signals that win Google E-E-A-T are the same signals LLMs use to decide who to cite.** Optimizing for one largely optimizes for the other. This strategy treats SEO and AEO as one system.

**The four flywheels that compound, in order of importance:**

1. **Author authority.** Real, named, NMLS-licensed loan officers with deep bios, schema markup, and external trust anchors (NMLS Consumer Access, LinkedIn, podcasts, press quotes). This is the single highest-leverage move and must be done first.

2. **Information gain content.** Original Cliffco data (closed-loan scenarios, approval rates, market commentary), inverted-pyramid structure, plain-language definitions, FAQ schema. Beats every competitor's paraphrased content.

3. **Local depth.** Real local pages (not doorway thin pages) for each priority market — Long Island first, then Orlando — with local data, licensed local LOs, local scenarios, local PR mentions, in-market GBPs.

4. **Off-site authority.** Listicle inclusion (Bankrate / NerdWallet / Money / Investopedia / HousingWire), Reddit + YouTube presence, podcasts, expert quotes. LLMs cite third-party sources more than your own site — so off-site is on-strategy.

---

## What's broken on the current cliffcomortgage.com (audit summary)

From the external audit captured in `01-technical-seo.md`:

- **WordPress + Elementor / ElementsKit stack** — historically tanks Core Web Vitals (especially INP). With INP now equally weighted to LCP and CLS, this is the biggest single drag.
- **Page title misses priority territories** — current title says NY/NJ/FL/CT/PA/TX; Cliffco's stated priorities are NY/Long Island/NJ/AZ/MN/FL/Orlando.
- **Minnesota mismatch** — current footer doesn't list MN among 27+ licensed states. **Cliffco's MN licensing must be confirmed before any MN content ships.**
- **No visible localized landing pages** in the IA — losing local authority opportunities.
- **Author sitemap exposed** — needs review for thin author pages (HCU risk).
- **Schema inventory unverified** externally — needs a full audit during rebuild scoping.
- **No visible territory-specific content** for the priority markets.

---

## The stack and IA Cliffco should adopt

**Stack:** Astro (static + islands of React for forms/calculators) + headless CMS (Sanity recommended) + Vercel/Netlify hosting. WordPress + Elementor must die. See `01-technical-seo.md` §3 for full rationale.

**Information architecture:**

```
/                                                 home
/loans/[product-hubs]/[product-spokes]/           4 priority products + supporting
/locations/[state]/[metro]/[sub-metro]/           NY-LI / NJ / AZ / FL-Orlando / MN (gated)
/loan-officers/[firstname-lastname-nmlsid]/       E-E-A-T anchor
/learn/[topic-cluster]/[article-slug]/            educational content
/calculators/                                     DSCR, reverse, affordability — lead magnets
/about/  /press/  /reviews/  /licensing/          trust anchors
/legal/  /es/                                     compliance + Spanish
```

URLs and the hub-and-spoke discipline are in `01-technical-seo.md` §4.

---

## The 30/60/90/180 day plan

### Days 1–30 — Foundation

**Stack & infrastructure:**
- Lock stack decision (Astro + Sanity + Vercel).
- Stand up staging environment with WCAG 2.2 AA component library.
- Implement schema spec (Organization, MortgageLender, MortgageLoan, Person, FAQPage, BreadcrumbList, Article) with CI validation.
- Configure CSP / HSTS / cookie consent that doesn't tank CWV.
- Procure licensed Graphik web kit from Commercial Type.

**Content & trust:**
- Write `/about/` (founder story, 36-year history, mission/vision/values verbatim, leadership, awards, community).
- Build 4 product pillars (Non-QM, Reverse, DSCR, Fix-and-Flip) with inverted-pyramid + FAQ schema + Reviewed-by stamps.
- Publish 6-10 LO bios with full Person schema, NMLS Consumer Access sameAs links, real photos, real numbers.
- Publish `/licensing/` page with full state license list and decision on MN status.

**AEO foundations:**
- Deploy AI-friendly robots.txt (allow all priority crawlers, see `02-aeo-llm-optimization.md` §3).
- Ship `/llms.txt` and `/llms-full.txt`.
- Create Wikidata entry with full property set + 3-5 reliable sources.
- Stand up measurement stack: Profound Growth ($399/mo) + Brand24 + custom prompt panel.
- Run baseline AEO audit: priority prompts across ChatGPT/Perplexity/Claude/Gemini/AIO; log cite-and-mention rates.

**Local + reviews:**
- Audit all existing GBPs; consolidate / re-claim.
- Implement Experience.com (or Birdeye) for automated post-close review flow.
- Begin systematic NAP-consistency citation cleanup via Whitespark.

### Days 31–60 — Build out

**Content:**
- Non-QM cluster expansion: 5-7 spokes (bank statement, P&L, 1099, ITIN, asset utilization, self-employed-less-than-2-years).
- DSCR cluster launch + Calculator tool live.
- Long Island metro hub + Nassau + Suffolk pages.
- Florida state hub + Orlando metro hub + Kissimmee/Lake Nona/Winter Park.
- Disney-area STR DSCR pillar (THE growth-territory page).
- 4-6 more LO bios.

**AEO + off-site:**
- Launch YouTube channel with first 6 videos (2 per priority product) — human-edited transcripts.
- Begin Reddit LO presence in r/Mortgages, r/RealEstate, r/RealEstateInvesting (3 LOs, NMLS-disclosed, real names).
- First 3 Featured/Connectively pitches for Bankrate/NerdWallet/Investopedia inclusion.
- Build "Cliffco Mortgage Advisor" Custom GPT in ChatGPT Store.
- Attempt Knowledge Panel claim via GBP + sameAs cluster.

**Local:**
- New Jersey state hub + 3 metro pages (Bergen, Hudson, Monmouth).
- 50+ citations built per priority market (Whitespark / BrightLocal).
- GBP Posts cadence (2-3/week per profile) live.

**Trust:**
- Editorial process page + AI usage policy page published.
- All product/educational pages get "Reviewed by" + last-updated stamps.
- BBB + Trustpilot + Zillow lender profiles cleaned and optimized.

### Days 61–90 — Off-site authority + breadth

**Content:**
- Reverse mortgage cluster (pillar + 5-7 spokes + retiree-market localized pages: Long Island North Shore, Sun City AZ, The Villages FL).
- Fix-and-Flip cluster (pillar + 4-6 spokes + LI/Orlando/NJ/AZ localized pages).
- Spanish-language launch: `/es/` versions of Non-QM / Reverse / DSCR pillars + Florida + Orlando hubs.
- Arizona state hub + Phoenix metro + Sun City sub-pages.

**AEO + off-site:**
- 5 listicle placements pursued (NerdWallet/Bankrate/Investopedia/Money/Forbes Advisor).
- 3 podcast appearances booked (Lender Lounge, BiggerPockets, Loan Officer Podcast).
- 2 industry-pub op-eds submitted (HousingWire, NMP).
- Reddit/Quora cadence: 10 substantive answers/week.
- First Cliffco-original data piece: "Cliffco 2026 Self-Employed Borrower Approval Index" (quarterly anonymized data) — primary information-gain artifact.
- Wikipedia draft prep if notability cleared (3-5 reliable independent sources).

**Local:**
- Orlando + secondary FL metros: Miami-Dade, Tampa Bay, Jacksonville, Naples.
- Spanish-language Phoenix + Miami-Dade content.

### Days 91–180 — Compounding + measurement

- Full content cluster maturity: 8-15 spokes per product hub.
- All licensed states have a state + metro + (where warranted) sub-metro page network.
- LO YouTube series cadence: 1-2 videos/week per active LO.
- Quarterly Cliffco Borrower Index cadence locked.
- Quarterly market data refresh on every state/metro page.
- Wikipedia attempt (if notability sources accumulated).
- AEO citation share-of-voice review monthly; reweight content investment toward winning prompts.
- **Re-audit robots.txt + llms.txt** — new bots emerge constantly; set a quarterly review reminder.
- Post-licensing: Minnesota content build (Twin Cities, Rochester).
- First quarterly review against KPI baseline:
  - AI citation share-of-voice (Profound) per priority prompt set
  - Brand mention volume (Brand24)
  - GSC organic clicks + AI Overview presence
  - GBP profile views + leads
  - Funnel: organic + AI-cited traffic → leads → applications → funded loans (the only metric that matters)

---

## The single highest-leverage moves (top 10 across all docs)

1. **Loan officer bios with NMLS-linked Person schema** (every active LO). E-E-A-T's #1 lever; #1 LLM-citation enabler. (`03` §3)
2. **Inverted-pyramid rewrite + question-led H2s + 40-60 word direct answers** on the 12 highest-traffic pages. Cheapest, fastest, biggest LLM-citation lift. (`02` §5)
3. **Disciplined hub-and-spoke IA** for products and locations with bidirectional internal linking. Lifts AI citation rates ~3.5×. (`01` §4, `02` §6)
4. **Wikidata entity + Organization schema sameAs cluster** — gives LLMs a verifiable, machine-readable Cliffco identity. (`02` §8)
5. **AI-friendly robots.txt allowing all priority crawlers + ship `/llms.txt`.** Cliffco wants maximum LLM visibility. (`02` §3, §4)
6. **Reddit LO presence** in r/Mortgages, r/RealEstate, r/RealEstateInvesting. Reddit "outranked finance experts in 176% of ChatGPT finance queries" — mandatory. (`02` §9)
7. **YouTube channel with human-edited transcripts.** YouTube has overtaken Reddit as #1 social citation source in LLMs. (`02` §9)
8. **Listicle placements** on NerdWallet/Bankrate/Investopedia/Money. When LLMs answer "best non-QM lender," they cite these. (`02` §9, `03` §6)
9. **Reviewed-by stamps + last-updated dates** on every product/educational page. 5-minute change with outsized E-E-A-T payoff. (`03` §8)
10. **Real Cliffco-original data piece** (the quarterly Borrower Index). Information-gain content that LLMs preferentially cite. (`02` §5, `05` calendar)

---

## Budget realities

Order-of-magnitude estimates for the rebuild + first-year AEO/SEO program (subject to vendor selection and Cliffco's existing in-house capacity):

| Category | One-time | Annual recurring |
|---|---|---|
| Stack rebuild (Astro + Sanity + Vercel) — design + engineering | $80K-$180K | — |
| Hosting (Vercel/Netlify Pro tier) | — | $2-6K |
| Headless CMS (Sanity Growth tier) | — | $2-12K |
| Graphik commercial web font license | $3-8K initial | — |
| Schema implementation + CI validation | included in build | — |
| Content writing (4 product clusters + locations + spokes; 100-150 pieces year 1) | — | $50-120K (in-house or agency) |
| Licensed Graphik subset / WOFF2 generation | $1K | — |
| Photography (LO portraits, office, founder) | $5-12K | $1-3K |
| YouTube production (light: 2 videos/week) | — | $25-60K |
| Profound Growth (AEO measurement) | — | $4.8K |
| Brand24 / Mention.com | — | $1-2.4K |
| Whitespark or BrightLocal (citations) | — | $1-2K |
| Experience.com / Birdeye (reviews) | — | $4-10K |
| Ahrefs / Semrush | — | $2.5-5K |
| Lighthouse CI / monitoring | — | $0-2K |
| Press/PR retainer (small mortgage-specialty firm) | — | $30-90K |
| HARO-replacement (Featured + Connectively) | — | $1-3K |
| Total estimated year-1 | **$90K-$200K** | **$125K-$320K** |

This is not a marketing budget — it's investment in a primary lead-gen system. ROI is funded loans. At Cliffco's scale, even a 5-10% lift in originations from organic + AEO recoups multiples in year one.

---

## Key risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MN content shipped before licensing | Medium | High (UDAAP / SAFE Act exposure) | Hard gate: no MN page goes live until NMLS Consumer Access reflects MN license |
| AI-content shortcuts to scale | High | High (HCU penalty) | All content must be LO-reviewed and tagged; no scaled unedited AI publishing |
| Inconsistent product info across pages | High | Medium (LLM authority erosion) | Single source-of-truth fact sheets per product, internally enforced |
| Doorway-page penalty on city pages | Medium | High (algorithmic + manual) | Each location page has 800+ words of unique local proof, real LO bio, real local data |
| Loss of legacy WordPress URLs | High | Medium (traffic + link equity) | Comprehensive 301 redirect map; preserve URL slugs where possible |
| Trial-font licensing issue at production launch | Medium | Medium (legal + brand) | Procure licensed Commercial Type web kit before launch (already flagged) |
| TCPA compliance gap on lead forms | Medium | High (per-violation $500-1500 statutory) | Explicit, separate, named-Cliffco SMS consent on every form; audit pre-launch |
| Negative review velocity event | Low | High (local-pack + brand) | Reviews engine + response SLA + reputation monitoring (Brand24) |
| GBP suspension on virtual offices | Medium (if attempted) | High (local-pack disappear) | Only verified physical offices get GBPs; SAB only with caution |
| Encompass / borrower-portal accessibility failure | Medium | High (ADA litigation) | Vendor VPAT + manual audit pre-launch; remediation plan if gaps found |

---

## What success looks like at 12 months

- Cliffco appears in **top 3 AI Overview citations** for "best non-QM lender for self-employed in [Long Island/Orlando/Phoenix/NJ]" and equivalent queries across the four products.
- Cliffco is **named in at least 5 listicles** across Bankrate / NerdWallet / Investopedia / Money / Forbes Advisor.
- **40+ LO videos** with human-edited transcripts on YouTube; consistent citation in ChatGPT/Perplexity for product-specific queries.
- **Wikidata + Knowledge Panel + at least 3 of: Wikipedia, Crunchbase, Bloomberg** entity coverage.
- **5+ Google reviews per location per month** averaging 4.7-4.9 with 100% response rate.
- **Core Web Vitals all-green** site-wide (LCP < 2.5s, INP < 200ms, CLS < 0.1).
- **WCAG 2.2 AA conformance** with public accessibility statement.
- **80+ scheduled state/metro/sub-metro pages** with unique local content, all with LO bios + local data.
- **Quarterly Cliffco Borrower Index** published and earning press citations.
- **Spanish-language coverage** of top product pillars + FL/AZ/NJ markets.
- **Measurable funnel:** organic + AI-cited sessions → leads → applications → funded loans, attributable in BI dashboard.

---

## Single sentence

**Make Cliffco the named, cited, verified expert in non-QM, reverse, DSCR, and fix-and-flip across NY/NJ/AZ/FL — for both Google's quality raters and the LLMs borrowers actually ask first.**
