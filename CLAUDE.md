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
2. **36 licensed states** (35 states + DC, confirmed 2026-10-07; New Hampshire added 2026-10-07, Iowa 2026-09-02). Full list + license numbers in `compliance/state-licenses.md`. **MN is fully licensed** — treat it as a normal priority territory, not gated. Site copy must use `STATE_LICENSES.length` (from `website/src/data/state-licenses.ts`), never a typed-out number — hardcoded counts are how "32" went stale.
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

## Fonts

**Two typefaces** (decided 2026-10-05; both chosen 2026-10-02 to match `cliffco-pos`):

| Role | Font | Token in `website/src/styles/global.css` |
|---|---|---|
| Body text + headings | **Outfit** | `--font-sans` (body), `--font-display` (h1–h6) |
| Eyebrows + small uppercase labels (e.g. "Who qualifies") | **IBM Plex Mono** | `--font-mono` (the `.eyebrow` class uses it) |

- **Helvetica is not used.** It was tried for body text on 2026-10-05 and dropped the same day. Don't reintroduce it — and never self-host it: it's a commercial font with no web license on file.
- **Font files:** Helvetica, Outfit, and IBM Plex Mono `.ttf` files were added to `brand/fonts/` on 2026-10-05. That folder is **gitignored** — the files live only on the machine they were copied to, not in git, so the other collaborator needs their own copy (or grab Outfit/Plex Mono from Google Fonts).
- Outfit + IBM Plex Mono are free (OFL) and load from Google Fonts in `website/src/layouts/Layout.astro`, not from `brand/fonts/`.
- Never commit anything from `brand/fonts/` to git, and never reference those files via `@font-face` in `website/` (Vite bundles them into public build output). The brand guide's Graphik trial OTFs remain unlicensed for web use.
- `--font-logo` (Montserrat, for the wordmark) is unchanged — confirm with Rafe before touching it.

## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `microsites/` — standalone single-purpose Astro projects (own `package.json`/`astro.config.mjs`/`vercel.json`/`.env` each), separate from `website/`. E.g. `microsites/cliffcomn/` (cliffcomn.com, the MN homepage + landing pages) and `microsites/reverse/` (the reverse-mortgage Long Island microsite).
- `google-ads/` — the one shared Google Ads API tooling folder for **all** Cliffco paid-search campaigns (single ads account, CID 7324255239): `.env` with OAuth credentials, reusable scripts (`Code/create_campaign.mjs`, `add_ad_groups.mjs`, etc.), and one config JSON per campaign (NJ grant, MN, DSCR-MN, reverse-mortgage-LI, ...). Despite living alongside the microsites, it's account-wide, not per-microsite — new campaigns' configs go here regardless of which microsite/page they promote. (Moved from `microsites/reverse/google-ads/` on 2026-09-18; the old path was a naming leftover from when this tooling was reverse-mortgage-only.)
- `PRE-LAUNCH-CHECKLIST.md` — open items to clear before the new site goes live: product facts to confirm, accessibility follow-ups, launch steps. Add new launch-blocking items here.
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
