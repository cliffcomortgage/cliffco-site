# Guideline audit: website copy vs. `Guidelines/` (2026-10-08)

Every Who We Help page and loan product page was checked against the 22 files in `Guidelines/`
(21 PDFs + `Overlays.xlsx`). Each finding below quotes the guideline verbatim so it can be
checked without reopening the PDFs.

**How to read this.** "Contradicted" means the guidelines say something different, not that the
website is necessarily wrong about Cliffco — some products may run through an investor whose
guidelines aren't in this folder. Those cases are marked **NEEDS A DECISION**. Items marked
**FIXED** are already corrected in the repo.

## What the guideline set covers

| Product area | Source |
|---|---|
| Agency (conventional, FHA, VA, USDA) | Correspondent Seller Guide 10-01-26 |
| Renovation | Plaza 203k / HomeStyle / VA Reno + Planet comparison matrix |
| Non-QM full doc / alt doc | Cliffco 1-6 First Lien, Cliffco 7 1-4 Unit |
| DSCR | Cliffco 1-6 DSCR, Cliffco 7 DSCR 5-9 units |
| HELOC / closed-end seconds | Cliffco 2, 3, 4, 7 |
| Cliffco overlays per investor | `Overlays.xlsx`, sheets Cliffco2–Cliffco6 |

**Not covered at all: reverse mortgages.** Reverse appears in these files only as an ineligible
*senior lien* behind a second mortgage. Nothing on `/reverse-mortgage/` or `/loans/reverse-mortgage/`
could be verified, including the 2% upfront MIP, the 0.5% annual premium, and the 2026 HECM limit
of $1,249,125. **Please send the reverse guidelines if they exist elsewhere.**

**An important caveat on investor variation.** `Overlays.xlsx` shows Cliffco applies different
overlays per investor (Cliffco2–Cliffco6), and they frequently disagree. A single sitewide number
is often not defensible. Examples: short-term-rental DSCR is 1.0 base but 1.25x under Cliffco6;
condotels are ineligible under Cliffco2/Cliffco4 but eligible under Cliffco3's DSCR; ITIN is
unavailable entirely under Cliffco6.

---

## FIXED

### `/loans/renovation/` — rebuilt against Plaza's three program guidelines

| Was | Now | Guideline |
|---|---|---|
| "FHA 203(k) loans generally require licensed contractors. HomeStyle allows limited do-it-yourself work with lender approval." | Reversed. Self-help exists **only** on Limited 203(k), max $35,000 project; HomeStyle prohibits it. | Plaza HomeStyle: "Self Help Requirements / **Not allowed.**" Plaza 203k: "Limited 203(k) only and maximum project size of **$35,000**" |
| "3.5% (580+ FICO)" on both FHA cards | 3.5% down; **620** minimum credit score | Plaza 203k eligibility matrix: "Purchase 96.5% 96.5% **620**" |
| HomeStyle "Up to 75% of the after-renovation value" | "Lesser of **$200,000** or 75%" | Plaza HomeStyle: "limited to the **lesser of $200,000 or 75%**… of the 'as completed' value" |
| VA "Renovation costs: Based on the VA after-renovation appraisal" | "Up to **$50,000**, including fees and contingency" | Plaza VA Reno: "Maximum amount of improvements is **$50,000** including fees, contingency" |
| VA "as little as 0% down" (buy or refinance) | 0% on **purchase**; refinances capped at **90% LTV** | Plaza VA Reno: "**LTV must not be greater than 90%**" |
| "All four programs cover…" | "All five…" (leftover from before VA was added) | — |
| CHOICERenovation "protects a home against natural disasters" (3 places) | Removed | "disaster", "resilien", "wildfire", "hardening" appear nowhere in the four renovation files |
| Limited 203(k) "$75,000 in repairs" | "$75,000, **including fees and contingency**" | Plaza 203k: "$75,000 **including fees and contingency**" |
| — | **Added** a "What to plan for" section: 30-day start deadline (15 on VA), completion windows, 10–20% contingency reserve, 10% per-draw holdback, two-party checks, no cash back | Plaza 203k/HomeStyle: "work must begin **within 30 days of closing**… Plaza may consider the loan to be **in default**"; "a **10% holdback** is required on each draw release" |

### `/denied-mortgage/` — two claims that could pull in borrowers who cannot qualify

| Was | Now | Guideline |
|---|---|---|
| "credit scores as low as **500**… there is no hard floor" and "scores in the 500s can qualify" (3 places) | "Non-QM programs start at a **580** credit score" | Cliffco 1-6: "**Minimum Credit score for all borrowers is 580**" |
| "as soon as **1 day after discharge** (Chapter 7) or 1 day after a short sale" (2 places) and "no waiting period after bankruptcy or foreclosure" | "generally **24 months**… and some programs require 36" | Cliffco 7 matrix: "Chapter 13 Seasoning **24 Months**"; "Discharged/Dismissed **24 Months**"; "BK / FC / SS / DIL Seasoning **36 Months**" |

---

## NEEDS A DECISION

These are the items I did not change, because the right answer is a business question.

### 1. `/loans/heloc/` — is the site describing a different product?

The page promises approval "in as little as 5 minutes", funding "in as few as 5 business days",
a "fully online, remote notary closing", and lines of "$50,000 to $1,000,000".

The HELOC guidelines in the folder describe something quite different:

- "**Manual underwriting only**" (Cliffco 4)
- Note, Mortgage, Deed of Trust and Closing Disclosure "require a **wet signature**" (Cliffco 4 + Cliffco4 overlay), which rules out a fully online closing
- Maximum line **$500,000** (Cliffco 4) or **$750,000** (Cliffco 7). **No file permits $1,000,000.**
- A mandatory draw at closing of 75% (Cliffco 4) or 80% (Cliffco 7), so "only pay for what you use" isn't achievable
- Ineligible in **NY, MA, WV** for all occupancies (Cliffco 7 matrix) — Cliffco is headquartered in NY
- 90-day blackout on additional draws after closing

**My read:** the speed and online-closing promises look like a fintech HELOC partner, not the
manually-underwritten "Cliffco Equity Advantage HELOC" in these PDFs. **Which program does the
website's HELOC describe?** If it's a separate vendor, send those guidelines. If it's the one in
this folder, the page needs substantial correction and the $1M figure has to come down.

### 2. `/loans/condos-co-ops-condotels/` — two of the three products are listed as ineligible

- "**Co-operative Units — No**" and "**Condotels or Condo Hotels — No**" each appear **three times** in the Cliffco 7 guidelines
- "**True Condotels with onsite reservation desks are prohibited**"
- Ineligible: "Projects with **mandatory rental pooling agreements**" — which the page names as a defining condotel feature
- Co-ops ineligible per the Cliffco3 and Cliffco5 overlays; "owner occupied" only per Cliffco4; Enterprise Co-Op Desk review under Cliffco 1-6
- One exception: the Cliffco3 overlay lists condotels as eligible on DSCR

**Does Cliffco finance condotels and co-ops through an investor not in this folder?** If yes, send
those guidelines. If no, this page is selling products we don't offer and should be cut back to
non-warrantable condos.

### 3. ITIN and foreign national — down payments understated, programs may be exception-only

| Page claim | Guideline |
|---|---|
| ITIN "From 15% down (primary)" | Cliffco 7 ITIN matrix caps primary purchase at **80% LTV = 20% down**; 75% at 680 FICO |
| ITIN "20–25% (investment)" | Second home/investment caps at **70% LTV = 30% down**; unavailable below 700 FICO |
| ITIN "660+ FICO or alternative credit" | Matrix floor is **680**; "**Insufficient tradelines and non-traditional credit is not allowed**" and "**ITIN borrowers are not allowed**" on the limited-tradeline path |
| ITIN "$150K–$2.5M+" | "Maximum Loan Amount **$1,500,000**" |
| ITIN co-ops "all eligible property types" | ITIN ineligible list: "Rural Properties, Condotels, **Co-ops**…" |
| Foreign national "down payments typically start at 25%" | Only FN grid reads "Foreign National **70%** / **60%**" = **30% down**, 40% on cash-out |
| Foreign national "$150K–$3M+" | "Foreign National Maximum Loan Amount **$1,500,000**" |
| Both pages present the products as routinely available | Cliffco 1-6: "**Foreign National (Exception Only)**", "Foreign National [ITIN] (**Exception Only**)"; Cliffco6 overlay: "**No ITIN**" |
| FN "regardless of immigration status" / "most countries are eligible" | "**Citizens of Venezuela are ineligible for Cliffco Mortgage Bankers programs**"; "Borrowers from OFAC sanctioned countries are ineligible" |

**Are ITIN and foreign national real product lines, or exception-only?** That determines whether
these stay as full pages or become a paragraph elsewhere.

### 4. `/loans/dscr/` and `/real-estate-investor-mortgage/`

The single highest-impact item: **short-term rental income must be reduced by a 20% expense
factor** ("Gross rents to be reduced by 20% expense factor", Cliffco3 overlay; echoed in
Cliffco2). The DSCR page hands borrowers the formula "Gross Monthly Rent ÷ PITIA" with no
deduction, so an STR borrower following our own math **overstates their DSCR by 25%**. A projected
1.25 is really a 1.00. Combined with Cliffco6's 1.25x STR minimum, that borrower fails.

Other items on these two pages:

| Page claim | Guideline |
|---|---|
| "0.75 (with strong reserves)" | 0.75 is the long-term-rent floor on 1-4 unit only. Reserves are set by loan amount; the sub-1.00 mechanism is a **lower LTV**, not reserves. 5-9 unit requires **1.15**; $100K–$150K loans require **1.25 and 720 FICO**; rent-control states **1.35** |
| Hero: "No ratio to 1.25+" | "**No No Ratio DSCR Product**" (Cliffco6, three times); "No Ratio Loans" is a Cliffco2 overlay |
| "$100K to $3M+" | $3.0mm is the top tier; above it every column reads "n/a". The $100K floor needs **1.25 DSCR + 720 FICO** |
| "we can lend in any of them" (states) | "**HI: ineligible**"; "Cook County in[eligible]" |
| STR "need at least a 1.0" | Base 1.0 + **680 FICO**, but Cliffco6: "**STR minimum requirement of 1.25x DSCR**" |
| First-time investors welcome "at all stages" | "<1.0 DSCR not permitted", "**Min 700 Fico**"; Cliffco3: "First Time Homebuyer (FTHB): **Ineligible**"; 5-9 unit: "First-Time Investors Not Allowed" |
| Max LTV purchase "Up to 80%" | Grid shows **85%** at 720–740 FICO (we're understating), while cash-out "Up to 75%" is **70%** at 660–680 |
| Not mentioned anywhere | **Prepayment penalties** (1–5 year stepdowns up to 5%), the 5% declining-market LTV reduction, rent-loss insurance, and the mandatory personal guaranty that undercuts the "liability protection" framing of entity borrowing |

### 5. Non-QM income calculations — the expense ratio is not a flat 50%

`/loans/business-bank-statement/` and the worked example on `/loans/non-qm-self-employed/` use a
flat 50% expense ratio. The guidelines use a schedule: **15% / 30% / 50%** for service businesses
by employee count, and **25% / 50% / 85%** for product businesses. A no-employee consultant is at
15%, so we understate their income roughly threefold; a product business with 5+ employees is at
85%, so we overstate it.

Also on those pages:

- The non-QM worked example features a **1099 contractor qualifying via bank statements**, but "Borrowers paid 1099 from a single company are **not eligible for Bank Statement qualification** and must qualify as Full Doc"
- Asset utilization divisor "60–84 months" — guidelines say **84 months only**, and require excluding down payment, closing costs **and** reserves (we only deduct reserves)
- Asset utilization "up to 85% primary / 80% investment" — actual "Max **80% LTV**… Purchase & Rate/Term Only", "may not be used on cash-out", "Not permitted for ITIN borrowers"
- 1099 "standard expense factor of 10%" — in the guidelines that 10% is a **penalty** when the borrower can't confirm they have no job-related expenses
- 1099 "multiple clients are fine and common" — guidelines expect "same 1099 provider for the past 2 years", "generally limited to single employer"
- "VOE" is marketed as one of seven Non-QM programs — no VOE-only program exists; WVOE (Form 1005) is a verification method inside Full Doc
- PTIN-prepared P&Ls: base guidelines allow a PTIN, but **every overlay bars it** ("PTINs ineligible for all products")

### 6. Rate ranges published as structured data, with no source

These are emitted as `MortgageLoan` schema and are eligible to appear in search results and AI
answers. No guideline file sets rates:

- DSCR 7.0%–9.5%
- ITIN 7.5%–9.5%
- Foreign national 7.75%–9.75%
- The seven-row rate table on `/loans/non-qm-self-employed/` (6.50%–9.75%)
- Non-QM "1–2 points above conventional" / "0.5% to 2% higher"

**Recommend** either sourcing these from the pricing desk with a date stamp, or removing them.
The existing "illustrative purposes" disclaimer covers presentation, not accuracy.

### 7. Confidentiality of the source documents

Both Non-QM matrices carry: "This material is intended solely for the use of licensed mortgage
bankers. **Distribution to consumers is strictly prohibited.**" The Planet renovation matrix says
the same. Specific FICO/LTV grid cells probably shouldn't be reproduced verbatim on public pages.
Worth a compliance read on how much matrix detail may appear at all.

---

### 8. Agency pages (conventional, FHA, VA, USDA) vs. the Correspondent Seller Guide

The overlays file covers non-agency products only, so there are no overlay conflicts here.
Confirmed correct: the **$832,750** conforming limit and the **$1,249,125** high-cost ceiling
(CSG: "Unit General … 1 $832,750").

**FIXED** (three figures I had added on 2026-10-07 from general agency knowledge, now checked
and unsupported):

| Was | Now | Guideline |
|---|---|---|
| FHA "Max DTI: up to 57%" (3 surfaces) | "Set by automated underwriting, with room for compensating factors" | The string "**57%**" appears **zero times** in the 712-page guide. It defers to the AUS decision plus a compensating-factor table |
| FHA floor "$541,287" (4 surfaces) | "Set by HUD, county by county" | "**541,287**" appears **zero times**. The guide says "Eligible conforming and high balance loan amounts can be found at: **FHA Mortgage Limits**" and "**Refer to FHA Mortgage Limits by county**" |

**NEEDS A DECISION:**

| Page claim | Guideline | Question |
|---|---|---|
| Conventional "620 minimum" credit score (5 surfaces) | "**A minimum credit score is not required for DU loan casefiles.**" Every agency grid reads "Per DU" | Is 620 a Cliffco overlay? If not, we're turning away 600-score buyers on five pages and steering them to FHA's life-of-loan MIP. If it is an overlay, it needs a source |
| VA "no cap on how much you can borrow" (3 pages) | Audit cites a **$1,500,000** VA High Balance ceiling and a $40,000 minimum. My own search found $1.5M only as seller net-worth language, so **this one needs confirming in the PDF** before changing | Does Cliffco cap VA? A veteran writing above $1.5M in the NY metro is the exposure |
| VA funding fee "2.15%–3.3% for first use" | 3.3% is the **subsequent-use** figure; first use at zero down is 2.15%. The next FAQ on the same page states it correctly, so the page contradicts itself | Fix to first-use vs. subsequent-use |
| VA funding fee exempt at "10% disability rating" (3 pages) | Not in the guide, which names "active-duty, Purple Heart recipients" and otherwise defers to the COE | Source it or soften it |
| PMI "cancel at 80%, automatic at 78%" (4 surfaces + worked example) | Guide's only MI text is "greater than 80% LTV to have mortgage insurance" and a statute-list entry for the Homeowners Protection Act | The statutory framework is real; cite HPA rather than implying it's investor policy |
| Conventional 3% down (several pages) | Conditions omitted: **1-unit primary only, fixed rate, conforming amounts, 35% MI coverage**, plus mandatory homeownership education above 95% LTV for first-time buyers | Add the conditions |
| USDA "115% of area median income" and "640 FICO" | No percentage in the guide (requires the RD website lookup + screenshot); grid reads "Per GUS". The FAQ's "lower scores may be eligible through manual underwriting" is backwards — manual requires **680+** | Correct the manual-underwriting claim; source or soften the rest |
| VA cash-out "up to 90%" (3 pages) | Audit cites **100%** at 600+ FICO | Understates the benefit |
| FHA "500–579 with 10% down" (3 pages) | The guide permits it at 90% LTV, but neither the guide nor the overlays show Cliffco originates it | Confirm with the lock desk (this was my open question from 2026-10-07) |
| FHA 2-4 unit "let a gift cover it" | 3-4 units require **3 months PITI reserves that cannot come from a gift** | Add the reserve condition |
| Down payment assistance page: "620/580 DPA credit floors", "80–120% AMI" | Almost nothing on this page is in the seller guide, which is appropriate since DPA is state and county level | Source these two figures to the actual program sheets, or soften |

---

## Round 2 — decisions made 2026-10-08, and what they changed

| Question | Decision | Done |
|---|---|---|
| HELOC: which program? | The 5-minute/5-day product is **brokered**; the one in the guidelines is **ours**. Advertise ours | `/loans/heloc/` rewritten: removed 5-minute approval, 5-day funding, fully-online/remote-notary closing, and the $1M maximum. Now describes the revolving line, WSJ Prime variable rate, draw-then-repayment structure, the large required initial draw, no prepayment penalty, no reserves. Same claims removed from the HELOC bands on `/loans/` and `/loans/refinancing/`, and from `products.ts` |
| Condotels and co-ops: do we offer them? | **Yes** | Kept both, but stopped presenting them as routine. Co-ops now say they go through the Enterprise Co-Op Desk and are generally owner-occupied; condotels say select investor programs with the building reviewed case by case, and that hotel-operated or mandatory-rental-pool projects generally won't qualify |
| Conventional minimum credit score | — | **Answered: it isn't in the guide.** The seller guide says "A minimum credit score is not required for DU loan casefiles" and every agency grid reads "Per DU". The only 620 in the guide is an FHA rule for first-time buyers using positive rental history. **Still open: is 620 a Cliffco overlay?** If not, five surfaces are turning away sub-620 conventional buyers |
| Reverse mortgage pages | Keep high level, no specific figures | Removed the 2026 HECM maximum claim amount and the 2% upfront / 0.5% annual MIP percentages. Program mechanics, borrower protections, counseling requirement and benefits all stay |
| Rates | Don't advertise rates or ranges | Removed **every** rate figure site-wide: 7 `rateRange` values from `MortgageLoan` structured data (0 pages now emit rate data), the 5 "Rate range" rows on product pages, the 7-row Non-QM rate table (replaced with what actually moves pricing), and the "0.5% to 2% above conventional" style spreads on the Non-QM, denied, condo and mortgage-rates pages |
| FICO/LTV grid cells on the site | Don't publish them | Applied as part of the above; no grid cells were added back in any fix |

### Also fixed this round

- **DSCR short-term rental, the highest-harm item in the whole audit.** The page gave borrowers "Gross Monthly Rent ÷ PITIA" with no deduction, while the overlays require "Gross rents to be reduced by 20% expense factor". Following our own math, an STR borrower overstated their DSCR by 25%. The 20% deduction is now stated on both DSCR pages, along with the 1.00 minimum, the 1.25 minimum on one program, the municipal-ordinance evidence requirement, and NYC's five boroughs being ineligible.
- DSCR "0.75 with strong reserves" corrected: below 1.00 the mechanism is a **lower loan-to-value**, i.e. more money down, not reserves.
- DSCR "$100K to $3M+" → "$100K to $3M" ($3.0mm is the top tier; above it the grid reads n/a).
- DSCR "we can lend in any of them" softened; DSCR is not available in every licensed state.

### Still open

1. **Is conventional 620 a Cliffco overlay?** (above)
2. **ITIN and foreign national** — are these real product lines or exception-only? Cliffco 1-6 marks both "Exception Only" and one investor says "No ITIN". Separately, both pages understate the down payment: ITIN primary caps at 80% LTV (20% down, not the 15% advertised) and second home/investment at 70% (30% down); foreign national caps at 70% (30% down, not 25%). Loan maximums are $1.5M on both, not the $2.5M/$3M advertised.
3. **Non-QM income calculations** — the bank statement expense ratio is a schedule (15%/30%/50% service by employee count, 25%/50%/85% product), not the flat 50% used on two pages and in the worked example. Asset utilization uses an 84-month divisor, not "60–84", and must exclude down payment and closing costs as well as reserves. The 1099 page's "10% standard expense factor" is a penalty in the guidelines, not a standard.
4. **Agency items** from the table above: VA loan ceiling, VA funding fee first-use vs subsequent-use, the 10% disability exemption, PMI cancellation sourcing, conventional 3% down conditions, USDA manual-underwriting claim.
5. **Blog and guide pages were out of scope** for this audit (it covered Who We Help + product pages). Several carry the same DSCR, HELOC and reverse figures and will need the same treatment.
