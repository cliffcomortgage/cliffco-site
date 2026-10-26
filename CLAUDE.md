# Cliffco Site — Instructions for Claude

This repo is the brand-assets + website-rebuild workspace for **Cliffco Mortgage Bankers**. The `README.md` covers the human-facing layout; this file is the operational brief for any Claude Code session running here.

## Workflow (two collaborators, serial editing)

Two people work in this repo: Rafe and his Cliffco co-worker. They do **not** edit at the same time. The git discipline:

- **At the start of every session:** run `git pull` before making any edits.
- **At the end of every session:** commit and push to `main` so the other person picks up your work next time.
- If `git pull` shows incoming changes you weren't expecting, stop and read them before editing — the other person may have just pushed something.

Both push to `main` directly. No branches/PRs needed for now.

## Brand pillars (drive every copy decision)

- **Vision:** We believe the mortgage industry can do better. Our vision is to lead as the nation’s most innovative and talent-nurturing firm, setting the benchmark for simplicity and collaboration in every partnership.
- **Mission:** We exist to transform the dream of home ownership into reality while elevating the net worth and self worth of the families and team members we serve. (Vision + mission updated 2026-10-07.)
- **Values:** Intentionality · Innovation · Accountability · Empowerment · Teamwork · Personalization · Growth · Security · Integrity · Achievement. These are the official company values (confirmed 2026-10-07); the website reads them from `website/src/data/company-values.ts`, and `brand/mission-vision-values.md` + the cliffcoinc About page match. The older "Family · Integrity · Care · Possibility" set is superseded. Don't publish it.

**Voice:** warm, human, clear. Explicitly anti-call-center. Avoid corporate/banky/cold language. When writing or reviewing any user-facing copy (site, marketing, taglines, error states, forms), check it against these pillars. Canonical text: `brand/mission-vision-values.md`.

**Positioning (decided 2026-10-07):** lead with first-time homebuyers, move-up/purchase buyers, and W-2 borrowers: conventional, FHA, VA, USDA, down payment assistance, and refinancing. Non-QM, bank statement, DSCR, and reverse expertise stays on the site but comes second everywhere order matters: page sections, lists, nav/footer, titles and meta descriptions, schema, and `llms.txt`. Don't frame Cliffco as a Non-QM shop or lead with "the loans other banks turn away." Second-chance borrowers are still welcome; that's a supporting message, not the headline. SEO/AEO targets the straightforward deals first. Pages about a specialty topic (a DSCR guide, a team page) keep their focus.

## Hard exclusion rule

**Never reference Ace Watanasuparp** in any Cliffco-related output — site copy, code comments, schema, documentation, content templates, summaries, anywhere. He has been disassociated from the brand and must be omitted entirely.

- The brand-guide PDF still references him; treat it as historical on this point. Extract color/type facts only, never quote leadership copy.
- Cliffco's leadership for site content is **Christopher Clifford (President, NMLS #65234)**. The founder/leadership story is built around him and the 36-year history.

## Compliance — read from disk, not memory

The `compliance/` directory holds source-of-truth disclosure data (state licenses, branches, LO roster, disclosures). The current public site is **outdated** — always read from `compliance/` when generating any user-facing copy, schema, or disclosure text.

Critical facts that must show up in the right places:

1. **Florida DBA: "Clout Mortgage, Inc."** — every FL-targeted page, FL LO bio, Orlando GBP, and FL marketing piece must include this DBA disclosure.
2. **37 licensed states** (36 states + DC, confirmed 2026-10-22; Arkansas added 2026-10-22, New Hampshire 2026-10-07, Iowa 2026-09-02). Full list + license numbers in `compliance/state-licenses.md`. **MN is fully licensed** — treat it as a normal priority territory, not gated. Site copy must use `STATE_LICENSES.length` (from `website/src/data/state-licenses.ts`), never a typed-out number — hardcoded counts are how "32" went stale.
3. **6 physical branches** (as of 2026-07-15): Uniondale NY (HQ), Bay Shore NY, Branchburg NJ, Ft. Lauderdale FL, Buckeye AZ, Excelsior MN. The Jamaica NY, Wantagh NY, and Orlando FL branches closed in July 2026 — do not reference them as current offices.
4. **80+ active LOs.** Each gets a bio page at `/loan-officers/{name-nmlsid}/` with Person schema + sameAs to NMLS Consumer Access. Roster: `compliance/loan-officers.md`.
5. **Bilingual LO clusters** (basis for the Spanish-language site): Buckeye AZ, Branchburg, Uniondale. Detail in `compliance/loan-officers.md` (the Orlando cluster dissolved when that branch closed, July 2026).
6. **AZ license number is #1045708.** (A past discrepancy traced to Julian Giaquinto's disclosure; he was offboarded July 2026, resolving it.)

## Personnel corrections (override the static docs)

The NMLS roster and `Leadership Bios.docx` are point-in-time snapshots. These corrections supersede them — do **not** publish the legacy versions:

- **Fabian Roman** is no longer Head of Capital Markets. He is part of **Team Broder** (works with Adam Broder, VP). Don't publish the old title. Confirm his current title before publishing any bio.
- **Christopher Clifford** is licensed in every Cliffco state except **New Hampshire** (as of 2026-10-07). `loan-officers.ts` filters NH out of his list (`PRESIDENT_STATES`); remove the filter once he's licensed there.
- **Cynthia Cardona** is no longer with Cliffco. The current **Director of HR is Amanda Miller** — feature Amanda on the team page, not Cynthia.

Always confirm leadership titles with Rafe before publishing.

## Brand (2026 guide)

Source of truth: `brand/Cliffco_Brand_Guidelines_2026.pdf`, applied to the site on 2026-10-26.
The pre-2026 guide (purple/blue palette, the power-button mark, Outfit/Montserrat) is retired —
don't reintroduce any of it.

**Colour — black, white and one blue.** Roughly 80% white / 12% black / 4% airy gray / 2% Sky
by area. Tokens live in `website/src/styles/global.css`.

| Name | Hex | Token | Used for |
|---|---|---|---|
| Black | `#0D0D0D` | `--color-ink` | Headlines, body, the plate |
| White | `#FFFFFF` | `--color-surface` | Every page background |
| Sky | `#BDE8F1` | `--color-sky` | **The caption box only** |
| Graphite | `#3D4040` | `--color-graphite`, `--color-text` | Body on white, caption panels |
| Soft Gray | `#B3B2B4` | `--color-soft-gray` | Body and labels **on black only** |
| Airy Gray | `#F0EEF1` | `--color-airy-gray` | Document panels, light surfaces |

- **Sky is reserved for the Sky box.** Never a text colour on white, and never on buttons,
  icons, charts, borders or the logo. Buttons are black and white only. The site carries
  exactly one Sky box, on the homepage hero (`.caption` + `.sky-box`); the guide allows one
  per surface.
- Soft Gray only reaches 2.1:1 on white, so it is a dark-surface colour. Secondary text on
  white uses `--color-text-muted` (`#5a5d5d`, a graphite tint at 7.1:1). The guide names no
  on-white secondary colour; this is the documented stand-in.

**Logo — the name, in a plate. Cliffco has no symbol.** Artwork lives in `brand/logos/`; place
the supplied files, never re-set the type. In those filenames `_Black` means a black plate
(so it goes on white) and `_White` means a white plate (so it goes on black).

- Site header → `Click. Funded.` lockup (`/images/cliffco-logo.svg`).
- Footer, and anything formal or regulatory → `Mortgage Bankers` lockup
  (`/images/cliffco-logo-white.svg`).
- Favicon, avatars, anything under 96px → the **CMB** icon (`/favicon.svg`).
- Minimum widths: wordmark/plate 96px, lockups 160px, icon 32px, favicon 16px. Clear space of
  one cap height on every side. Never stretch, re-track, re-weight, outline, rotate, shadow,
  tint it Sky, or set it inside the Sky box.

**Square corners throughout**, to match the plate and the Sky box. There are no `rounded-*`
classes in `website/src` and the `--radius-*` tokens are all `0`; keep it that way. The one
exception is the Qualifier's 20px selection indicator, which stays circular so a single-choice
control still reads as one.

## Fonts

**Three typefaces**, all OFL, all loaded from Google Fonts in `website/src/layouts/Layout.astro`
(and again in `LandingLayout.astro`, `dashboard.astro` and the login gate in `middleware.ts`,
which render their own `<head>`):

| Role | Font | Token in `website/src/styles/global.css` |
|---|---|---|
| Everything you read — headlines, captions, body, labels, buttons, the wordmark | **Archivo** (400–800) | `--font-sans`, `--font-display`, `--font-logo` |
| The data voice — rates, payments, figures, name tags, footers | **IBM Plex Mono** (400–700) | `--font-mono` |
| The display accent, and the brand's only italic | **Instrument Serif** (400 + italic) | `--font-accent`, `--font-serif` |

- **Labels and eyebrows are Archivo 500 CAPS at +0.2em, not mono.** Mono sets numbers, not
  words. The `.eyebrow` class already does this; don't reach for `font-mono` on a label.
- Headlines are Archivo 700–800, sentence case, −0.02em. `h1`–`h4` default to 700.
- **No Archivo italics.** The brand's only italic is Instrument Serif.
- **Outfit, Montserrat and Helvetica are retired.** Helvetica must never be self-hosted either:
  it's commercial with no web licence on file.
- **Font files:** Archivo, IBM Plex Mono and Instrument Serif `.ttf` files are in
  `brand/fonts/`. That folder is **gitignored** — the files live only on the machine they were
  copied to, so the other collaborator needs their own copy (all three are on Google Fonts).
- Never commit anything from `brand/fonts/`, and never reference those files via `@font-face`
  in `website/` (Vite bundles them into public build output).

## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `microsites/` — standalone single-purpose Astro projects (own `package.json`/`astro.config.mjs`/`vercel.json`/`.env` each), separate from `website/`. E.g. `microsites/cliffcomn/` (cliffcomn.com, the MN homepage + landing pages) and `microsites/cliffcoinc/` (cliffcoinc.com, the Alaska site). The reverse-mortgage Long Island microsite was deleted on 2026-10-13 - its Vercel project was already gone and its Google Ads campaign removed.
- `google-ads/` — the one shared Google Ads API tooling folder for **all** Cliffco paid-search campaigns (single ads account, CID 7324255239): `.env` with OAuth credentials, reusable scripts (`Code/create_campaign.mjs`, `add_ad_groups.mjs`, etc.), and one config JSON per campaign (NJ grant, MN, DSCR-MN, ...). Despite living alongside the microsites, it's account-wide, not per-microsite — new campaigns' configs go here regardless of which microsite/page they promote. (Moved out of the since-deleted reverse microsite on 2026-09-18; the old path was a naming leftover from when this tooling was reverse-mortgage-only. The `Code/*reverse*` scripts stay as a historical record of that campaign - don't run them, they point at a dead URL.)
- `website/src/components/Analytics.astro` — GA4 + Google Ads tag and conversion events (production domain only). Any new lead form must call `window.cliffcoTrack?.lead({ source, product, email, phone })` on success, or its leads won't count as conversions.
- `PRE-LAUNCH-CHECKLIST.md` — open items to clear before the new site goes live: product facts to confirm, accessibility follow-ups, launch steps. Add new launch-blocking items here.
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
