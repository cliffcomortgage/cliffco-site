# Cliffco Site — Instructions for Claude

This repo is the brand-assets + website-rebuild workspace for **Cliffco Mortgage Bankers**. The `README.md` covers the human-facing layout; this file is the operational brief for any Claude Code session running here.

## Workflow (two collaborators, serial editing)

Two people work in this repo: Rafe and his Cliffco co-worker. They do **not** edit at the same time. The git discipline:

- **At the start of every session:** run `git pull` before making any edits.
- **At the end of every session:** commit and push to `main` so the other person picks up your work next time.
- If `git pull` shows incoming changes you weren't expecting, stop and read them before editing — the other person may have just pushed something.

Both push to `main` directly. No branches/PRs needed for now.

## Brand pillars (drive every copy decision)

- **Vision:** To be the lender every family wishes they'd called first.
- **Mission:** We get families home. Especially the ones other banks turned away. And we grow their net worth and self-worth along the way.
- **Values:** Family · Integrity · Care · Possibility.

**Voice:** warm, human, scrappy. Explicitly anti-call-center, pro-second-chance-borrower — "yes when other banks say no." Avoid corporate/banky/cold language. When writing or reviewing any user-facing copy (site, marketing, taglines, error states, forms), check it against these pillars. Canonical text: `brand/mission-vision-values.md`.

## Hard exclusion rule

**Never reference Ace Watanasuparp** in any Cliffco-related output — site copy, code comments, schema, documentation, content templates, summaries, anywhere. He has been disassociated from the brand and must be omitted entirely.

- The brand-guide PDF still references him; treat it as historical on this point. Extract color/type facts only, never quote leadership copy.
- Cliffco's leadership for site content is **Christopher Clifford (President, NMLS #65234)**. The founder/leadership story is built around him and the 36-year history.

## Compliance — read from disk, not memory

The `compliance/` directory holds source-of-truth disclosure data (state licenses, branches, LO roster, disclosures). The current public site is **outdated** — always read from `compliance/` when generating any user-facing copy, schema, or disclosure text.

Critical facts that must show up in the right places:

1. **Florida DBA: "Clout Mortgage, Inc."** — every FL-targeted page, FL LO bio, Orlando GBP, and FL marketing piece must include this DBA disclosure.
2. **32 licensed states** (not the 27 the current public footer shows). Full list + NMLS numbers in `compliance/state-licenses.md`. **MN is fully licensed** — treat it as a normal priority territory, not gated.
3. **6 physical branches** (as of 2026-07-15): Uniondale NY (HQ), Bay Shore NY, Branchburg NJ, Ft. Lauderdale FL, Buckeye AZ, Excelsior MN. The Jamaica NY, Wantagh NY, and Orlando FL branches closed in July 2026 — do not reference them as current offices.
4. **80+ active LOs.** Each gets a bio page at `/loan-officers/{name-nmlsid}/` with Person schema + sameAs to NMLS Consumer Access. Roster: `compliance/loan-officers.md`.
5. **Bilingual LO clusters** (basis for the Spanish-language site): Buckeye AZ, Branchburg, Uniondale. Detail in `compliance/loan-officers.md` (the Orlando cluster dissolved when that branch closed, July 2026).
6. **AZ license number is #1045708.** (A past discrepancy traced to Julian Giaquinto's disclosure; he was offboarded July 2026, resolving it.)

## Personnel corrections (override the static docs)

The NMLS roster and `Leadership Bios.docx` are point-in-time snapshots. These corrections supersede them — do **not** publish the legacy versions:

- **Fabian Roman** is no longer Head of Capital Markets. He is part of **Team Broder** (works with Adam Broder, VP). Don't publish the old title. Confirm his current title before publishing any bio.
- **Cynthia Cardona** is no longer with Cliffco. The current **Director of HR is Amanda Miller** — feature Amanda on the team page, not Cynthia.

Always confirm leadership titles with Rafe before publishing.

## Fonts

**Three typefaces, three jobs** (decided 2026-10-05; Outfit + Plex Mono chosen 2026-10-02 to match `cliffco-pos`):

| Role | Font | Token in `website/src/styles/global.css` |
|---|---|---|
| Body text | **Helvetica** | `--font-sans` |
| Headings (h1–h6) | **Outfit** | `--font-display` |
| Eyebrows + small uppercase labels (e.g. "Who qualifies") | **IBM Plex Mono** | `--font-mono` (the `.eyebrow` class uses it) |

- **Font files:** Helvetica, Outfit, and IBM Plex Mono `.ttf` files were added to `brand/fonts/` on 2026-10-05. That folder is **gitignored** — the files live only on the machine they were copied to, not in git, so the other collaborator needs their own copy (or grab Outfit/Plex Mono from Google Fonts).
- **Never self-host Helvetica on the site.** It's a commercial font with no web license on file (the files in `brand/fonts/` look like a free-font-site download, not a licensed web kit). The site uses `"Helvetica Neue", Helvetica, Arial, sans-serif` — Helvetica from the visitor's device, Arial as the near-identical fallback. If a Monotype web license is ever bought, that's when to add `@font-face`.
- Outfit + IBM Plex Mono are free (OFL) and load from Google Fonts in `website/src/layouts/Layout.astro`, not from `brand/fonts/`.
- Page headlines must use `var(--font-display)`, not `var(--font-sans)` — `--font-sans` is now Helvetica body text.
- Never commit anything from `brand/fonts/` to git, and never reference those files via `@font-face` in `website/` (Vite bundles them into public build output). The brand guide's Graphik trial OTFs remain unlicensed for web use.
- `--font-logo` (Montserrat, for the wordmark) is unchanged — confirm with Rafe before touching it.

## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `microsites/` — standalone single-purpose Astro projects (own `package.json`/`astro.config.mjs`/`vercel.json`/`.env` each), separate from `website/`. E.g. `microsites/cliffcomn/` (cliffcomn.com, the MN homepage + landing pages) and `microsites/reverse/` (the reverse-mortgage Long Island microsite).
- `google-ads/` — the one shared Google Ads API tooling folder for **all** Cliffco paid-search campaigns (single ads account, CID 7324255239): `.env` with OAuth credentials, reusable scripts (`Code/create_campaign.mjs`, `add_ad_groups.mjs`, etc.), and one config JSON per campaign (NJ grant, MN, DSCR-MN, reverse-mortgage-LI, ...). Despite living alongside the microsites, it's account-wide, not per-microsite — new campaigns' configs go here regardless of which microsite/page they promote. (Moved from `microsites/reverse/google-ads/` on 2026-09-18; the old path was a naming leftover from when this tooling was reverse-mortgage-only.)
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
