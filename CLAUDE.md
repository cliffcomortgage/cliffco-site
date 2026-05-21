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
3. **9 physical branches:** Uniondale NY (HQ), Jamaica NY, Wantagh NY, Bay Shore NY, Branchburg NJ, Orlando FL, Ft. Lauderdale FL, Scottsdale AZ, Excelsior MN. Branch street addresses (other than HQ) need to be collected before any branch landing page or GBP claim ships.
4. **80+ active LOs.** Each gets a bio page at `/loan-officers/{name-nmlsid}/` with Person schema + sameAs to NMLS Consumer Access. Roster: `compliance/loan-officers.md`.
5. **Bilingual LO clusters** (basis for the Spanish-language site): Orlando, Scottsdale, Branchburg, Uniondale. Detail in `compliance/loan-officers.md`.
6. **AZ license discrepancy** — most disclosures show AZ #1045708; Julian Giaquinto's shows AZ #0949291. Verify with Rafe before publishing AZ-licensed-state lists.

## Personnel corrections (override the static docs)

The NMLS roster and `Leadership Bios.docx` are point-in-time snapshots. These corrections supersede them — do **not** publish the legacy versions:

- **Fabian Roman** is no longer Head of Capital Markets. He is part of **Team Broder** (works with Adam Broder, VP). Don't publish the old title. Confirm his current title before publishing any bio.
- **Cynthia Cardona** is no longer with Cliffco. The current **Director of HR is Amanda Miller** — feature Amanda on the team page, not Cynthia.

Always confirm leadership titles with Rafe before publishing.

## Fonts (Graphik)

Primary typeface is **Graphik** (Regular + Medium minimum). The trial OTFs from the brand guide sit at `brand/fonts/` locally but are **gitignored** — they're not licensed for web redistribution.

- Never re-add `brand/fonts/*.otf` to git.
- Before the website ships, source a licensed web font kit from [Commercial Type](https://commercialtype.com/catalog/graphik). Production code must use the licensed WOFF2 kit.
- For local dev/prototyping, the trial OTFs can be referenced via `@font-face` from a path outside the repo.

## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
