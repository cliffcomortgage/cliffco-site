# Pre-launch checklist: cliffcomortgage.com rebuild

Open items to clear before the new site replaces the live cliffcomortgage.com. Check items off here as they're done. Started 2026-10-07.

## Confirm product facts and credit minimums

- [ ] **FHA credit minimum.** Does Cliffco lend at 500–579 with 10% down? The FHA page describes FHA's 500 program floor, and its FAQ says Cliffco requires 580 for 3.5% down. (`website/src/pages/loans/fha/index.astro`)
- [x] **Conventional and FHA page figures.** (Closed 2026-10-09 — see GUIDELINE-AUDIT.md rounds 1-3.) These are standard agency rules, not yet checked against Cliffco's guidelines. Pages: `loans/conventional/`, `loans/fha/`, and the shared comparison table in `website/src/components/asym/LoanCompare.astro`.
  - PMI estimate (Freddie Mac's $30–$70 a month per $100K borrowed) and the $400K / 3% down example
  - FHA annual MIP of 0.50–0.55%, and the $350K / 3.5% down example ($5,911 upfront, about $155 a month)
  - Seller credits: conventional 3–9%, FHA up to 6%
  - Debt-to-income: conventional up to 50% with automated approval, FHA up to about 57%
  - Down payments: second home 10%, investment property 15–25%; best conventional pricing at 780+
  - 2026 loan limits: $832,750 conforming, $1,249,125 high-cost ceiling, $541,287 FHA floor
- [x] **Renovation page figures** (Closed 2026-10-08 against the Plaza guidelines.) (`/loans/renovation/`, added 2026-10-08):
  - FHA 203(k) Standard: $5,000 minimum repairs, HUD consultant required
  - FHA 203(k) Limited: up to $75,000, no consultant, no structural work
  - HomeStyle and CHOICERenovation: renovation costs up to 75% of the after-renovation value; 3% down for eligible first-time buyers; second homes and 1-unit investment properties eligible
  - Do-it-yourself work: generally not allowed on FHA 203(k); limited, with lender approval, on HomeStyle
  - VA Renovation: 0% down, no monthly mortgage insurance (funding fee applies), loan based on the VA after-renovation appraisal, primary residence only, no luxury items. Confirm Cliffco's cap on VA renovation costs if the page should state one.
- [x] **Mortgage Rates page ranges:** (Closed — every rate figure removed site-wide.) Non-QM 0.5–2% over conventional, bank statement 0.75–1.5%, VA "at or below conventional." (`/mortgage-rates/`)
- [x] **Non-QM rate table** (Closed — table removed.) on `/loans/non-qm-self-employed/` is labeled "as of mid-2026." Refresh or remove it so it isn't stale at launch.
- [x] **Glossary ARM entry** (Closed 2026-10-09 — now 5/6, matching our matrices.) describes a 5/1 ARM that adjusts annually. Current conventional ARMs adjust every six months (5/6).
- [x] **Leadership titles** (Confirmed by the leadership team.) on the About and team pages confirmed with Rafe (standing rule in `CLAUDE.md`).

## Accessibility (WCAG 2.2 AA)

Audit on 2026-10-07: axe-core on all 197 pages, plus keyboard, phone-menu, and 320px-width checks. Every page passes, including the get-started qualifier and the new-site NJ grant lander (both fixed 2026-10-07). What automated checks can't cover:

- [ ] **Manual screen-reader pass** with NVDA on Windows and VoiceOver on iPhone: the get-started qualifier, contact form submit and error, one calculator, and the phone menu.
- [ ] **Third-party widgets.** Get accessibility reports (VPAT/ACR) for the Elfsight reviews widget and HubSpot. The Encompass report is already requested, per the accessibility statement.
- [ ] **Accessibility inbox.** Confirm accessibility@cliffcomortgage.com exists and someone monitors it. It's the contact listed on `/legal/accessibility/`.
- [ ] **Custom cursor decision.** The brand arrow cursor doesn't follow visitors' enlarged-pointer settings in Windows or macOS. That isn't a WCAG failure, but some low-vision users rely on large pointers.

## Launch steps

- [ ] **Analytics and conversion tracking.** Done in code on 2026-10-07: `website/src/components/Analytics.astro` loads GA4 (G-WV6SFC5W7P) and Google Ads (AW-17848823591) on the production domain only, and fires the same events as the WordPress tracker: leads from the contact form, qualifier, and Team STR form; phone clicks; and Apply Now clicks. Meta events fire through the pixel HubSpot loads. Still to do at launch: (1) decide whether the Tag Manager container (GTM-T9P3MP96) has anything else worth keeping, since it isn't on the new site; (2) after launch, use Google Tag Assistant to submit a test lead and click a phone number, then confirm GA4 and Google Ads record them; (3) confirm "enhanced conversions" is turned on in Google Ads, or the hashed email and phone the site now sends are ignored.
- [ ] **NJ grant lander.** The new site serves it at `/nj-grant-program/`, the same URL the Google Ads campaign and sitelinks use, so nothing needs re-pointing. Copy matches the live WordPress page as of 2026-10-07. After launch, submit a test lead and click a phone number, then confirm both register as conversions in Google Ads. Also decide whether it should be indexed: the live WordPress version is, but the new copy is noindexed as an ads-only page.
- [ ] **IndexNow.** Set `INDEXNOW_SUBMIT=true` for the production build once the site is live on cliffcomortgage.com (see `website/astro.config.mjs`).
- [ ] **Redirects.** Spot-check that the legacy WordPress redirects in `website/astro.config.mjs` resolve on the live domain.
- [ ] **Elfsight widget.** Set the widget's Accent and Read More colors to black, and delete its Custom CSS. That CSS targets old class names, so it does nothing.
- [ ] **Research checklists.** Work through the trust-signal checklist (`seo-aeo-dtc-research/03-ymyl-eeat-trust.md`, section 12) and the technical SEO final pass (`seo-aeo-dtc-research/01-technical-seo.md`, Days 61–90).

## Not launch-blocking

- [ ] **Christopher Clifford's NH license.** Once he's licensed, remove the NH filter (`PRESIDENT_STATES` in `website/src/data/loan-officers.ts`).
- [ ] **OneDrive values doc.** `Mission, Vision, Values.docx` in OneDrive still has the old vision, mission, and values.

---

## Full launch audit — 2026-10-09

Ran against a fresh production build (199 pages). Tooling kept in the session scratchpad:
a static crawler (`crawl.cjs`), a visible-text pass (`text.cjs`), a runtime console check
(`console.cjs`), and the existing axe-core harness (`a11y/audit.cjs`).

### Clean

| Check | Result |
|---|---|
| Broken internal links | **0** of ~4,800 `<a href="/...">` |
| Broken images | **0** |
| Invalid JSON-LD | **0** (872 blocks across 199 pages; `validate-schema.mjs` passes) |
| Structured data coverage | every page has schema — Organization/FinancialService + WebSite on all 198 indexable, 255 BreadcrumbList, 86 Article, 53 Person, 52 FAQPage, 16 MortgageLoan, 14 MortgageContractor |
| Redirects | 142 legacy WordPress 301s; every target resolves, no source shadows a real page, present in the built Vercel config, plus 308 trailing-slash normalization |
| Sitemap | 196 URLs, correct host and protocol throughout; the 3 omissions (`/404`, `/thank-you/`, `/nj-grant-program/`) match exactly the 3 `noindex` pages |
| axe-core WCAG 2.2 AA | **0 violations** across 49 pages × desktop + phone, plus the mobile menu and LO attribution bar (100 checks) |
| Reflow at 320px | no horizontal scroll on any page |
| `lang`, single `<h1>`, skip-link with visible focus | present everywhere |
| Duplicate titles / meta descriptions | **0** |
| Mixed content, `target=_blank` without `rel=noopener`, insecure links | **0** |
| Encoding artifacts, `undefined`/`NaN`/`[object Object]`, TODO, Lorem ipsum, unresolved `${}` | **0** |
| Misspellings (70-word mortgage watchlist) | **0** |
| Leaked secrets, API keys, `localhost`/staging URLs in client output | **0** |
| Hard exclusions | Ace Watanasuparp **0**, Cynthia Cardona **0**, "Head of Capital Markets" **0**. Closed branches: Jamaica **0**, Wantagh **0**; Orlando appears only as a lending market (Disney-area STR, Central Florida), never as an office |
| Compliance consistency | FL DBA "Clout Mortgage, Inc." on all 199 pages and 4× on each FL page; NMLS #65328 company-wide; all 6 branch addresses present; company age (37 years) and state count both computed, never hardcoded |
| Contact details | one toll-free, one main line, all `tel:` hrefs well-formed E.164 |
| External links | 127 distinct, all resolve (BBB/Yelp/Facebook/ftc.gov return 403/400/404 to non-browser clients — bot protection, fine in a browser) |
| Runtime console errors | none on 23 representative pages |
| Analytics | GA4 + Google Ads tags on all 199 pages; 107 pages carry a form and all 107 call `cliffcoTrack.lead()` |

### Fixed in this pass

- **Qualifier form had two controls with no accessible name.** The state `<select>` and the
  loan-officer search input relied on a preceding `<h2>` and a placeholder, neither of which
  gives a programmatic name (WCAG 4.1.2). Both now take `aria-label={s.title}`. Affected
  `/get-started/buy/`, `/refinance/`, `/cash-out/`.
- **`astro check` had 6 type errors, which fail CI.** Four branch pages passed
  `branch.street` (typed `string | null` in `branches.ts`) into a `BranchPage` prop typed
  `string`; the component now accepts the nullable type and omits the line rather than
  rendering `null`. Two were in the dashboard's inline script (`Element` has no `.dataset`;
  a `setTimeout` closure re-read a variable outside its null guard). Now **0 errors**.
- **24MB of unreferenced full-resolution staff headshots were being published.**
  `website/public/images/headshots/` (83 committed files) is the *source* material that
  `scripts/import-headshots.mjs` turns into the `/team/{slug}.{avif,webp,jpg}` files pages
  actually use. Everything under `public/` ships verbatim, so every deploy pushed the
  originals to the public internet. Added to `.vercelignore` — still in git for the team,
  no longer in the deploy.
- **Doubled word** on `/loans/dscr/` ("and and accept ratios"), from the DSCR guideline edit.
- **Glossary described a 5/1 ARM adjusting annually.** Our matrices list `5/6 ARM` and
  `5/6 ARM-IO`; corrected to five years fixed, then adjusting every six months.

### Open, needs a decision

1. **`/dashboard/` has no access control.** It's `noindex, nofollow`, disallowed in
   `robots.txt` and excluded from the sitemap, but those only deter crawlers. The page is
   server-rendered and fetches live Google Ads data with the account's OAuth refresh token,
   so anyone with the URL can read Cliffco's campaign spend and performance. Obscurity is
   not access control. Vercel password protection or an allowlist would close it.
2. **Title and meta-description lengths.** No duplicates, but 122 titles exceed 65
   characters (median 70, longest 148) and 79 descriptions exceed 170 (longest 608). Google
   truncates both. The single biggest lever is the blog suffix — `" | 500:1 Blog | Cliffco
   Mortgage Bankers"` is 38 characters of overhead on every post. The long descriptions come
   from product pages reusing `directAnswer`, which is deliberately long-form for AEO; worth
   deciding whether SERP display or answer-engine extraction wins there. Not launch-blocking.
3. **The NJ lander still loads Open Sans** (`LandingLayout.astro`), a font the brand dropped
   in favour of Outfit + IBM Plex Mono. It also links to `/privacy-policy/`, the old
   WordPress path, which 301s correctly but costs a hop. Both are lander design, which I
   don't change without asking — say the word and they're one-line fixes. The internal
   dashboard loads Open Sans too; harmless, not customer-facing.
4. **Image weight.** 110MB in `public/images`, of which ~85MB is the gitignored Adobe Stock
   originals — those never reach production because they aren't in git, but it does mean a
   local build and a Vercel build produce different output. Among images pages *do* serve,
   `/team/atrion-faiola.jpg` is 873KB, roughly ten times its peers, and six content JPEGs run
   470–645KB. Worth a compression pass.
5. **No Lighthouse performance budget.** CI asserts accessibility ≥0.95 and SEO ≥0.95 on 11
   pages but nothing on performance, so image-weight regressions pass silently. Adding
   `categories:performance` would catch the next one.
6. **160 `<img>` without `width`/`height`.** Layout-shift risk (CLS). Many are inside
   aspect-ratio containers and fine; the rest would benefit from explicit dimensions.
7. **Sitemap has no `lastmod`.** Deliberately left alone: a build-time timestamp on every
   page trains Google to ignore the signal. Worth adding only if wired to the real
   `dateModified` already in the Article schema.
8. **Route conflict warning at build:** `/locations/florida` is generated by both a dedicated
   page and the `[state]` dynamic route. The dedicated page wins, which looks intended, but
   the warning will persist until the state list excludes Florida.

### Verified as false positives

- `closing-costs` radio inputs and the `team-str` honeypot field flagged by the static
  crawler are correct as written — the radios use implicit `<label>` wrapping and the
  honeypot is `aria-hidden` and off-screen. axe-core passes both pages.
- 249 "doubled word" hits are eyebrow-label + heading pairs (`Reverse` / `Reverse Mortgages`)
  that only collide once tags are stripped; 13 "space before punctuation" hits are inline
  elements followed by a period. One real defect among them, fixed above.
- axe's 63 "needs review" contrast nodes are decorative glyphs (✓, →, ★) it cannot measure,
  most already `aria-hidden`, plus the glossary's inactive alphabet letters, which WCAG 1.4.3
  exempts as inactive UI components.
