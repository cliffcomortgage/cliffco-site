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
2. **38 licensed states** (37 states + DC, confirmed 2026-11-04; Idaho added 2026-11-04, Arkansas 2026-10-22, New Hampshire 2026-10-07, Iowa 2026-09-02). Full list + license numbers in `compliance/state-licenses.md`. **MN is fully licensed** — treat it as a normal priority territory, not gated. Site copy must use `STATE_LICENSES.length` (from `website/src/data/state-licenses.ts`), never a typed-out number — hardcoded counts are how "32" went stale.
   **The microsites cannot import that array** — they are separate Astro projects — so their
   counts are typed and go stale silently. On 2026-11-06 cliffcomn was carrying three
   different wrong numbers at once ("36" on the homepage stat bar, "32" on two others, and
   "37" in DSCR body copy and an FAQ answer). All six now read 38. **Whenever a state is
   added, grep the microsites too:** `grep -rnE "licensed in [0-9]+ states|Licensed states" microsites/*/src`.
3. **6 physical branches** (as of 2026-07-15): Uniondale NY (HQ), Bay Shore NY, Branchburg NJ, Ft. Lauderdale FL, Buckeye AZ, Excelsior MN. The Jamaica NY, Wantagh NY, and Orlando FL branches closed in July 2026 — do not reference them as current offices.
4. **80+ active LOs.** Each gets a bio page at `/loan-officers/{name-nmlsid}/` with Person schema + sameAs to NMLS Consumer Access. Roster: `compliance/loan-officers.md`.
5. **Bilingual LO clusters** (basis for the Spanish-language site): Buckeye AZ, Branchburg, Uniondale. Detail in `compliance/loan-officers.md` (the Orlando cluster dissolved when that branch closed, July 2026).
6. **Arizona has three licence layers, all of which must show.** Company: `Arizona Mortgage Banker License License/Registration #: BK-1045708` (footer + `/licensing/`, from `state-licenses.ts`). Buckeye branch: `Arizona Mortgage Banker Branch License License/Registration #: BK-BR-1045709`, at the bottom of `/buckeye-az/`. And each AZ-licensed originator shows their own `LO-` number, held in `stateLicenses` on their `loan-officers.ts` record and rendered on their bio. **Timothy Alan King II (NMLS #1458438, AZ #LO-0950923) has no Cliffco LO record and no bio page** - he appears only in the Arizona licensing block on the Buckeye page, with the note that he does not originate for Cliffco, Inc. (A past number discrepancy traced to Julian Giaquinto's disclosure; he was offboarded July 2026, resolving it.)

## Product facts — Guidelines/ is the source, investor matrices included

Every product figure on the site — LTV, down payment, loan ceilings, credit minimums,
reserves, qualifying basis — comes from `Guidelines/`. Never publish one that isn't in there,
and never carry one over from memory or from the live WordPress site.

**Cliffco does not write a matrix for every product.** Where there is no Cliffco matrix, the
programme runs on an investor's and the investor matrix is the source. Foreign National is the
worked example (confirmed by Rafe 2026-11-02): there is no Cliffco Foreign National matrix,
and `Cliffco 1-6 - DSCR MATRIX.pdf` just says "Please see Foreign national Matrix", so the
two investor documents govern:

| Investor | File | Covers |
|---|---|---|
| **Verus** (VMC) | `VMC Correspondent Non-Agency Loan LTV Matrix 10.19.2026 Final.pdf`, pp17–18 | Foreign National DSCR, **investment only**, $150k–$2.5M, 6 mo PITIA. LTV by loan size: 25% down to $1.5M, 30% to $2M, 35% to $2.5M |
| **Onslow Bay** | `Onslow Bay Guidelines V9.0.pdf`, p73 §16.5 | Foreign National Plus. **2nd home and investment**, and the only **foreign-income** path (DTI to 45%). 35% down, $150k–$1.0mm, 12 mo PITIA |

Two habits that came out of getting this wrong:

- **A figure can be true in isolation and misleading in a row.** "25% down" and "up to $2.5M"
  are both in the Verus matrix but never together — LTV is priced by loan size. When a matrix
  tiers a number, publish the tiers.
- **Check which lane a figure belongs to before putting it in a shared table.** Down payment,
  reserves, loan amount and qualifying basis all differ between the two Foreign National
  investors; one spec table covering both has to say which is which.

Eligibility can also turn on **country and state together**, not country alone — e.g. the
Cliffco DSCR matrix makes Foreign Nationals from the Republic of China ineligible in FL, and
HI ineligible outright. Don't list restrictions in page copy, but don't write copy that
implies citizenship is the only test either.

## Trigger terms — a down payment on a page means a disclaimer on that page

Stating a down payment in advertising is a **trigger term**: the page has to show the worked
example behind the figure. The eight examples and their exact wording come from
`compliance/Trigger Terms Disclaimers (2).xlsx` and are reproduced **verbatim** in
`website/src/data/trigger-disclaimers.ts`. **The figures inside them are fixed examples, not
live rates — never edit or recalculate them.** If compliance reissues the sheet, regenerate
that file from it rather than hand-editing.

The eight: VA 0%, USDA 0%, FHA 3.5%, FHA 10%, Conventional 3%, 5%, 10% and 20%.

Rendering is automatic. `TriggerDisclaimers.astro` sits above the footer in both
`Layout.astro` and `LandingLayout.astro` and looks the current path up in `TRIGGER_ROUTES`.
It is keyed on the route rather than a prop each page sets, because figures reach pages
through shared data modules (`products.ts`) and components (`LoanCompare.astro`) — so no
page author knows they triggered it — and because some affected routes are dynamic
(`locations/[state].astro`), where there is no per-page file to edit.

**After changing page copy, run the check:**

```bash
cd website && npm run build
node ../scripts/verify-trigger-disclaimers.cjs           # fails on drift
node ../scripts/verify-trigger-disclaimers.cjs --write   # absorb a legitimate change
```

It rederives the map from the **built** HTML and fails if a page gained or lost a figure, or
owes a disclaimer it does not show. Two things it handles that are easy to get wrong: it
strips the disclosure block before scanning, or every disclosed page re-triggers on its own
disclosure; and a figure only counts when its **percentage and loan type both** match a
scenario, so the VA page quoting funding-fee tiers at "5% or 10% down" does not pull in a
Conventional example. Where no loan type sits beside the figure, every scenario at that
percentage is attached — one disclosure too many is safe, one too few is not.

## Calculators — there are 61, and they are tested

**Before auditing or changing a calculator, read `scripts/calculator-tests/README.md` and run
the suite. Do not start a fresh search.** The calculators were audited five times between
2026-11-03 and 2026-11-05, and every pass found more, because every pass drew its own
boundary and none started from what was already known.

```bash
cd website && npm run build
cd ../scripts/calculator-tests && node run-all.cjs
```

Two facts that caused most of the rework:

- **There are 61 calculators, not 11.** Eleven live under `/mortgage-guides/calculators/`.
  The other **50 are embedded in blog posts**, and they are *copies* — 10 archetypes keyed by
  an `art-<prefix>-` input id. A figure corrected in a main calculator does **not** reach
  them. That is how the invented reverse mortgage factor and the pre-2023 VA funding fee
  schedule stayed live after both were fixed. **When a product figure changes, grep the
  `art-` prefix for it.**
- **Styling drifts the same way, and no test catches it.** The copies carry no `.calc-readout`
  wrapper, so the global rule that puts a readout in IBM Plex Mono 600 never reached them and
  all 50 printed their figures in Outfit bold until 2026-11-06. `global.css` now styles them
  by id instead: `p[id^="art-"].font-bold`, which deliberately skips the verdict and note
  paragraphs because those are sentences and mono never sets a sentence. **A brand rule keyed
  on a wrapper class will miss the copies — key it on the `art-` id.**
- **A green test can be green because it tested nothing.** One sweep reported "61 calculators,
  NO DEFECTS FOUND" over zero combinations — Windows backslashes had broken a path, so every
  page 404'd. Check the combination count, not just the verdict.

  **It came back, and it is subtle.** On 2026-11-06 the edge sweep was again passing over
  **0 combinations**. The earlier fix normalised the page path to forward slashes but left
  `SRC` as `path.join` built it — with backslashes — so `.replace(SRC, "")` matched nothing,
  every slug stayed an absolute path and every URL 404'd. `01-edge-sweep.cjs` now strips
  `SRC_URL` (`SRC.split(path.sep).join("/")`) instead. **`run-all.cjs` hides this: it only
  regex-matches a sub-suite's output, so a vacuous sweep still prints PASS.** A healthy edge
  sweep reports roughly **1370 combinations** over the 61 calculators — if that number is 0,
  or far below it, the suite is not testing anything no matter what the summary says:

  ```bash
  cd scripts/calculator-tests && node 01-edge-sweep.cjs | tail -3
  ```

## Calculators — no invisible figures

Rule set by Rafe on 2026-11-03, after a compliance review: **a calculator may not use a
figure the visitor cannot see.** Any constant in the maths — a rate, a term, a down payment,
a DTI ceiling, an expense factor, a scoring deduction — goes in the `CalcAssumptions` panel
(`website/src/components/ui/CalcAssumptions.astro`), in plain words, next to the result
rather than buried in fine print. The panel's second column lists what the result *leaves
out*, which is the half people misread.

- Rate figures interpolate `RATE_ASSUMPTIONS` (`website/src/data/rate-assumptions.ts`), never
  typed into the panel, so one edit still moves every number on the site. Those are
  illustrative and dated, **not a live feed** — Cliffco has no licensed rate source wired in.
- **No calculator uses the whole savings balance and a reserve holdback at once.** Affordability
  puts every dollar of savings into the down payment; the reserves test lives in the Readiness
  checkup, where it is scored and shown. Readiness takes the down payment out of savings before
  counting reserve months.
- **A rate of zero is not a 0% loan.** Every amortisation here used to fall through to
  `loan / n` on an empty rate box and print a real-looking payment. Guard the input and show
  nothing instead.
- Two habits for comparison calculators: say when the two sides aren't the same transaction
  (the VA page's conventional column is forced to 20% down), and charge the costs that decide
  the answer (Rent vs Buy broke even in Year 1 until maintenance and selling costs went in).

**Where a figure comes from when `Guidelines/` has nothing.** Two calculators needed numbers
that aren't Cliffco product specs, so `Guidelines/` was never going to hold them. The rule
that replaces it: find the **primary publisher** and store the real data, never a formula
someone derived from it.

| Figure | Source | Lives in |
|---|---|---|
| HECM principal limit factors | HUD's own workbook, from the PLF set listed on [hud.gov](https://www.hud.gov/stat/sfh/hecm) | `website/src/data/hecm-plf.ts` |
| HECM maximum claim amount | FHA Mortgagee Letter (ML 2025-22 for 2026) | the reverse calculator |
| DSCR ratio tiers | `Cliffco 1-6 - DSCR MATRIX.pdf` | the DSCR calculator |

The reverse calculator is the cautionary tale: its factor was a made-up rule of thumb ("40%
at 62, +1% a year") that ran about a third high. A principal limit factor depends on age
**and** the expected interest rate — a figure keyed to two things cannot be approximated
from one. Where a published table exists, ship the table.

## Personnel corrections (override the static docs)

The NMLS roster and `Leadership Bios.docx` are point-in-time snapshots. These corrections supersede them — do **not** publish the legacy versions:

- **Fabian Roman** is no longer Head of Capital Markets. He is part of **Team Broder** (works with Adam Broder, VP). Don't publish the old title. Confirm his current title before publishing any bio.
- **Christopher Clifford** is licensed in **every** Cliffco state as of 2026-11-04, when his NH licence came through. The `PRESIDENT_STATES` filter in `loan-officers.ts` that used to drop NH has been removed; the list is now the full set.
- **Cynthia Cardona** is no longer with Cliffco. The current **Director of HR is Amanda Miller** — feature Amanda on the team page, not Cynthia.

Always confirm leadership titles with Rafe before publishing.

## Brand (2026 guide)

Source of truth: `brand/Cliffco_Brand_Guidelines.pdf`. Colour, logo and layout applied
2026-10-26; the typography was reissued and applied 2026-11-06 (see Fonts). The pre-2026
guide is retired, and so is the `..._2026.pdf` that preceded this file.
**Both microsites are on this brand as of 2026-11-06.** `cliffcomn` was the last holdout:
it had skipped the October rollout entirely and was still on the retired palette (#6633cc
plum as its accent), the power-button logo and rounded corners. The pre-2026 guide
(purple/blue palette, the power-button mark, Montserrat) is retired —
don't reintroduce any of it.

**Colour — black, white and one blue.** Roughly 80% white / 12% black / 4% airy gray / 2% Sky
by area. Tokens live in `website/src/styles/global.css`.

| Name | Hex | Token | Used for |
|---|---|---|---|
| Black | `#000000` | `--color-ink` | Headlines, subheaders, panels, borders, emphasis |
| Body black | `#0D0D0D` | `--color-text` | Body copy |
| White | `#FFFFFF` | `--color-surface` | Every page background |
| Sky | `#BDE8F1` | `--color-sky` | **The caption box only** |
| Graphite | `#3D4040` | `--color-graphite` | Caption panels, cards on black |
| Soft Gray | `#B3B2B4` | `--color-soft-gray` | Body and labels **on black only** |
| Airy Gray | `#F0EEF1` | `--color-airy-gray` | Document panels, light surfaces |

- **Sky is reserved for the Sky box.** Never a text colour on white, and never on buttons,
  icons, charts, borders or the logo. Buttons are black and white only. The site carries
  exactly one Sky box, on the homepage hero (`.caption` + `.sky-box`); the guide allows one
  per surface.
- **Pure black, not the guide's #0D0D0D** (Rafe, 2026-10-26). Headlines, subheaders and every
  structural black are `#000000`; body copy sits one shade back at `#0D0D0D`. The guide sets
  Black at `#0D0D0D` and body-on-white at Graphite, so both are deliberate departures. Keep
  the two in step: a hardcoded panel black has to move with `--color-ink` or it will sit a
  shade off the panel beside it.
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

**Square corners throughout**, to match the plate and the Sky box. The `--radius-*` tokens are
all `0` on all three sites; keep it that way. The one exception is the Qualifier's 20px selection
indicator, which stays circular so a single-choice control still reads as one.

Zeroing the tokens is **not** sufficient on its own, and a grep for `rounded-` will not find
the two ways a corner got back in (both were live until 2026-11-06):

- **A bare `rounded` has no dash.** It is a static Tailwind utility that compiles to
  `border-radius:.25rem` and ignores the `--radius-*` tokens entirely. Four checkboxes carried
  it. Grep for the whole word `rounded`, not the prefix `rounded-`.
- **Raw CSS in a page's `<style>` block never sees the tokens.** Every one of the 61
  calculators set its own `border-radius` on `.calc-input` / `.art-calc-input` and so had
  rounded inputs through the whole October rollout.

Check the **built** output, where both show up and dead utilities do not:

```bash
cd website && npm run build
grep -rhoE "border-radius:[^;}]+" dist/client --include=*.html --include=*.css | sort | uniq -c
```

## Fonts

**Reissued 2026-11-06.** The typography changed and two rules from the previous guide were
reversed. Colour, proportions and the logo rules did not move.

| Role | Face · weight | Case · tracking | Notes |
|---|---|---|---|
| Headline | **Outfit 700** | sentence · −0.015em | Leading 1.1–1.2 |
| Caption (Sky box) | **Outfit 700** | sentence · −0.02em | 2–6 words |
| Body | **Outfit 400**, Light 300 at large sizes | sentence · 0 | Leading 1.5–1.7, max 66 characters a line |
| Button | **Outfit 600–700** | title case · 0 | |
| Label · eyebrow | **IBM Plex Mono 500** | CAPS · +0.2em | |
| Figure · tag | **IBM Plex Mono 600–700** | as written or CAPS | Rates, payments, name tags, the tagline |
| Display | **Instrument Serif 400** | CAPS or italic | The brand's only italic |
| Wordmark | Archivo 700 · 112.5% | CAPS · +0.2em | **Artwork only, never typed** |

What changed, and what it reverses:

- **Outfit is the primary face again**, setting everything you read. It **stops at Bold (700)**
  — there is no 800 anywhere — and is **never set in all caps**. The previous guide retired
  Outfit in favour of Archivo; that is undone.
- **Labels and eyebrows are IBM Plex Mono**, not Archivo. The previous guide said the
  opposite in as many words ("mono is the data voice and does not set labels"). Mono is now
  the label voice *and* the data voice.
- **Archivo is not loaded at all.** It sets only the wordmark, and the guide places that as
  supplied artwork that is "never typed", so the site ships the SVGs from `brand/logos/` and
  no Archivo webfont. The `--font-logo` token was removed with it.
- Headline tracking relaxed from −0.02em to **−0.015em**, caption from −0.025em to **−0.02em**.

Because Outfit is never set in all caps, **any element carrying `uppercase` must be mono**
(or Instrument Serif, for display capitals). That is the rule when adding a label — 356
ad-hoc labels were converted on 2026-11-06 and none should drift back.

Three faces, all OFL, loaded from Google Fonts in `website/src/layouts/Layout.astro` and
again in `LandingLayout.astro`, `dashboard.astro` and the login gate in `middleware.ts`,
which render their own `<head>`. Tokens live in `website/src/styles/global.css`:
`--font-sans` / `--font-display` (Outfit), `--font-mono` (IBM Plex Mono),
`--font-accent` / `--font-serif` (Instrument Serif).

- **Montserrat and Helvetica stay retired.** Helvetica must never be self-hosted: it is
  commercial with no web licence on file.
- **Font files:** the `.ttf`s are in `brand/fonts/`, which is **gitignored** — they live only
  on the machine they were copied to, so the other collaborator needs their own copy. All
  three are on Google Fonts. Never commit anything from there, and never reference those
  files via `@font-face` in `website/` (Vite bundles them into public build output).
- **Stat strips are not mono, and that is correct.** The spec rows on loan pages pass
  label/value pairs where the values are mostly phrases — "As little as 3%", "Set by
  underwriting" — not figures. Mono would break the guide's own rule that it "never sets a
  sentence". Real figures already follow the Figure role: a calculator readout computes to
  IBM Plex Mono 600.
## Where things live

- `brand/` — mission-vision-values, brand guide, logos. Originals in OneDrive at `~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/`. If you update an asset, update both places.
- `compliance/` — disclosure/licensing source of truth. Last NMLS audit: 2025-07-23. Refresh quarterly.
- `website/` — Astro site skeleton for the rebuild.
- `microsites/` — standalone single-purpose Astro projects (own `package.json`/`astro.config.mjs`/`vercel.json`/`.env` each), separate from `website/`. E.g. `microsites/cliffcomn/` (cliffcomn.com, the MN homepage + landing pages) and `microsites/cliffcoinc/` (cliffcoinc.com, the Alaska site). The reverse-mortgage Long Island microsite was deleted on 2026-10-13 - its Vercel project was already gone and its Google Ads campaign removed.
- `google-ads/` — the one shared Google Ads API tooling folder for **all** Cliffco paid-search campaigns (single ads account, CID 7324255239): `.env` with OAuth credentials, reusable scripts (`Code/create_campaign.mjs`, `add_ad_groups.mjs`, etc.), and one config JSON per campaign (NJ grant, MN, DSCR-MN, ...). Despite living alongside the microsites, it's account-wide, not per-microsite — new campaigns' configs go here regardless of which microsite/page they promote. (Moved out of the since-deleted reverse microsite on 2026-09-18; the old path was a naming leftover from when this tooling was reverse-mortgage-only. The `Code/*reverse*` scripts stay as a historical record of that campaign - don't run them, they point at a dead URL.)
- `website/src/components/Analytics.astro` — GA4 + Google Ads tag and conversion events (production domain only). Any new lead form must call `window.cliffcoTrack?.lead({ source, product, email, phone })` on success, or its leads won't count as conversions.
- **HubSpot form embeds: record the conversion on `hs-form-event:on-submission:success`, nothing else.** HubSpot's current embed (the `hs-form-frame` iframe that `hbspt.forms.create` now renders) announces a submission only as that DOM event, bubbling to `window` with the form GUID in `event.detail.formId`. It **never runs `onFormSubmitted` and sends no `postMessage`**. Pages wired to those two recorded **zero** form conversions in all of 2026 while HubSpot logged the leads: 11 on the MN homepage, 3 on HELOC/DSCR, and 120+ on the NJ grant page (found 2026-11-06). The 2026-10-09 "fix" listened for `postMessage` and missed too. The working pattern (a guarded `recordConversion()`, a capture-phase `window` listener filtered by form ID, `onFormSubmitted` kept only as a classic-embed fallback) is on all three cliffcomn pages and `nj-grant-program`. **Until the new site launches, the live NJ page is WordPress.** Its copy is `nj-22k-grant-wordpress.html`, so any change to that form's tracking has to be pasted into WordPress as well.
- `PRE-LAUNCH-CHECKLIST.md` — open items to clear before the new site goes live: product facts to confirm, accessibility follow-ups, launch steps. Add new launch-blocking items here.
- `seo-aeo-research/` — SEO/AEO research notes.
- `scripts/` — utility scripts.
