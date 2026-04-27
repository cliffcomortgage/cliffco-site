# Cliffco Website

Production-grade scaffold for the rebuilt **cliffcomortgage.com**, executing the strategy in
`/seo-aeo-research/` and the compliance facts in `/compliance/`.

## Stack

- **[Astro](https://astro.build/) 6** — static-first, zero-JS-by-default for marketing pages
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-first config in `src/styles/global.css`
- **TypeScript (strict)** — compliance data lives in typed constants (`src/data/`)
- **Sitemap auto-generated** by `@astrojs/sitemap`
- **Lighthouse CI** + **schema-validation script** for CI quality gates

## Run

```bash
npm install
npm run dev      # local dev at http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # preview the built site locally
```

## Project layout

```
website/
├── astro.config.mjs           # site URL, sitemap, Tailwind, trailing slash policy
├── lighthouserc.json          # Lighthouse CI budgets (LCP < 2.5s, INP < 200ms, CLS < 0.1)
├── package.json
├── public/                    # static — robots.txt, llms.txt, _headers (security)
│   ├── robots.txt             # all priority AI crawlers explicitly allowed
│   ├── llms.txt               # llms.txt standard for AI engines
│   └── _headers               # HSTS, CSP-friendly, cache rules (Netlify/Cloudflare)
└── src/
    ├── components/
    │   ├── layout/            # Header, Footer, Breadcrumbs
    │   └── seo/               # Meta, JsonLd
    ├── data/                  # TYPED COMPLIANCE / CONTENT DATA — single source of truth
    │   ├── company.ts         # corporate facts, NMLS, address, FL DBA
    │   ├── state-licenses.ts  # 32-state license table (mirrors /compliance/state-licenses.md)
    │   ├── branches.ts        # 8 branches with LO assignments
    │   ├── loan-officers.ts   # LO roster with NMLS, states, branches
    │   ├── products.ts        # 9 products (4 priority + 5 supporting)
    │   ├── locations.ts       # priority territory metadata
    │   └── disclosures.ts     # composable disclosure blocks
    ├── layouts/Layout.astro   # base layout w/ Meta + JsonLd + Header + Footer
    ├── lib/schema.ts          # JSON-LD generators (Org, Person, MortgageLoan, etc.)
    ├── pages/
    │   ├── index.astro                      # homepage
    │   ├── about.astro                      # founder story / mission / leadership / branches
    │   ├── licensing.astro                  # full 32-state license table
    │   ├── get-started.astro                # lead form (TCPA-compliant)
    │   ├── es/                              # Spanish stub (more pages coming)
    │   ├── legal/                           # privacy, ccpa, sms-consent, accessibility, texas
    │   ├── loans/
    │   │   ├── index.astro                  # loans hub
    │   │   ├── non-qm-self-employed/        # FULL pillar prototype (gold standard)
    │   │   ├── reverse-mortgage/            # pillar with FAQ + HUD counseling section
    │   │   ├── dscr/                        # pillar with calculator CTA + market matrix
    │   │   └── fix-and-flip/                # pillar with rates + draw + BRRRR pairing
    │   ├── locations/
    │   │   ├── index.astro                  # all locations
    │   │   ├── [state].astro                # NJ, AZ, MN, FL state pages (dynamic)
    │   │   ├── new-york/index.astro
    │   │   ├── new-york/long-island/        # FULL location prototype with Nassau/Suffolk data
    │   │   ├── florida/index.astro          # Swish Capital DBA prominent
    │   │   └── florida/orlando/             # FULL location prototype with STR + DSCR + bilingual
    │   └── loan-officers/
    │       ├── index.astro                  # roster grouped by branch
    │       └── [slug].astro                 # dynamic bio with full Person schema + NMLS verify
    └── styles/global.css                    # design tokens, components, base styles
```

## What's already wired

- ✅ **50 indexable pages** building cleanly from `src/data/*` constants
- ✅ **239 JSON-LD blocks** validated by `scripts/validate-schema.mjs`
- ✅ **Organization** + **WebSite** schema injected on every page via Layout
- ✅ **Person** schema for every LO bio with `sameAs` to NMLS Consumer Access (the #1 mortgage E-E-A-T lever)
- ✅ **MortgageLoan** + **FAQPage** + **Article** schema on every product pillar
- ✅ **LocalBusiness** schema on every location page (one per branch)
- ✅ **BreadcrumbList** schema on every interior page
- ✅ **Sitemap index** auto-generated at `/sitemap-index.xml`
- ✅ **robots.txt** explicitly allowing GPTBot / ClaudeBot / PerplexityBot / Google-Extended / Meta-ExternalAgent / etc.
- ✅ **llms.txt** for AI-engine discovery
- ✅ **Inverted-pyramid pattern** (40-60 word direct answer + question-led H2s) on all priority pages
- ✅ **"Reviewed by [LO Name, NMLS #]"** stamps on all product pillars
- ✅ **WCAG 2.2 AA** baselines: skip link, focus rings, 24×24 target sizes, color-contrast tokens, reduced-motion handling
- ✅ **Florida DBA disclosure** on every FL-targeted page
- ✅ **TCPA-compliant lead form** with explicit, named-Cliffco SMS consent
- ✅ **Spanish-language stub** at `/es/` with hreflang setup

## What still needs human input

Things scaffolded but not completable autonomously:

1. **Real LO photos** — every bio currently has a `[ photo placeholder ]` block. Need professional headshots for at least the leadership wave + branch managers to launch.
2. **Branch street addresses** — only the Uniondale HQ has a full address. Newark, Jamaica, Wantagh, Bay Shore, Orlando, Scottsdale, Excelsior need street + ZIP + direct branch phone before the location-page LocalBusiness schema is fully accurate.
3. **LO long-form bios** — Wave 1 (Christopher Clifford) has a sample bio drafted; the others need LO-confirmed narratives, years of experience, scenarios, languages, LinkedIn URLs.
4. **Licensed Graphik web font kit** from Commercial Type — the design tokens currently fall back to Open Sans (the brand-guide-published web fallback). Replace `--font-sans` declaration in `src/styles/global.css` with the licensed @font-face once the kit is procured.
5. **Real customer testimonials** — both for individual LO bios and any review widget on product/location pages.
6. **Encompass borrower portal integration** — `/get-started/` form posts to a `/api/lead` placeholder. Wire it to the actual CRM/Encompass endpoint and add reCAPTCHA Enterprise or Cloudflare Turnstile.
7. **Logo SVGs** — currently referenced as `/brand/full-logo.svg` etc.; copy from `../brand/logos/` into `public/brand/` and verify schema `logo` paths.
8. **Press / awards / reviews pages** — scaffolded as nav links; need actual content.
9. **Compliance counsel review** of all `/legal/` pages (privacy, CCPA, SMS, accessibility, Texas).
10. **Blog / `/learn/` content cluster** — outlined in `seo-aeo-research/05-product-content-strategy.md`; not yet scaffolded.

## Single source of truth: `/compliance/`

Anything compliance-relevant (state licenses, NMLS numbers, branch list, disclosure language)
**MUST** be edited in `src/data/*.ts` — never inline in a page. The compliance Markdown files
in `../compliance/` are the authoritative reference; whenever those change after an NMLS audit,
update the matching `.ts` file and rebuild.

## CI

GitHub Actions config at `../.github/workflows/website-ci.yml` runs on every push to
`website/**`:
1. `npx astro check` — TypeScript + Astro template type errors
2. `npx astro build` — production build
3. `node ../scripts/validate-schema.mjs ./dist` — JSON-LD schema validation
4. `npx lhci autorun` — Lighthouse CI against budgets in `lighthouserc.json`

Lighthouse budgets:
- Performance ≥ 0.9
- Accessibility ≥ 0.95
- Best Practices ≥ 0.9
- SEO ≥ 0.95
- LCP ≤ 2.5s, CLS ≤ 0.1

## Deploy

Recommended: **Vercel** or **Netlify** or **Cloudflare Pages**. Static output, no Node runtime
needed in production. The `public/_headers` file provides Netlify/Cloudflare-style security
headers; on Vercel, replicate via `vercel.json`.
