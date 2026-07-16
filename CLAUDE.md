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

1. **Florida DBA: "Swish Capital, Inc."** — every FL-targeted page, FL LO bio, Orlando GBP, and FL marketing piece must include this DBA disclosure.
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

**The website ships Open Sans** — decided by Rafe on 2026-07-16. The brand guide's primary typeface is Graphik, but the trial OTFs at `brand/fonts/` (gitignored) are not licensed for web use, so the site uses the brand guide's published web fallback instead. Do not reference the trial OTFs from any web code.

- Never re-add `brand/fonts/*.otf` to git, and never reference them via `@font-face` in `website/` (Vite bundles them into build output).
- If a licensed Graphik web kit is ever purchased from [Commercial Type](https://commercialtype.com/catalog/graphik), add the WOFF2 kit and update `--font-sans` in `website/src/styles/global.css` — the swap point is documented there.

## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
