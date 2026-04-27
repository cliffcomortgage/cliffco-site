# Cliffco Marketing Disclosures — Reusable Templates

Canonical disclosure blocks pulled from `loan-officer-disclosures.csv`. Use these as the source of truth; do not paraphrase.

## Block 1 — Corporate / FHA / Equal Housing (always include)

> Cliffco, Inc. is not affiliated with or acting on behalf of the FHA or any government entity. Equal Housing Lender. Cliffco, Inc. Corporate NMLS #65328 (www.nmlsconsumeraccess.org) 70 Charles Lindbergh Blvd, Suite 200, Uniondale, NY 11553 · (516) 408-7300.

## Block 2 — Florida DBA (REQUIRED on any FL-targeted material)

> Cliffco, Inc. doing business in Florida as **Swish Capital, Inc.**, is a New York corporation authorized to transact business in the State of Florida.

## Block 3 — Standard restrictions language (always include after license list)

> This is not a commitment to lend or extend credit. Restrictions may apply. All loans are subject to credit and underwriting approval. Not all loan products are available in all states. Rates may not be available at time of application. Information and/or data are subject to change without notice.

## Block 4 — Per-state license language

State-by-state license citations, drawn from the most-comprehensive disclosures in the CSV (Christopher Clifford line + Adam Turkewitz line). Use whichever subset matches the LO's licensed footprint.

```
AK Division of Banking and Securities Mortgage Broker/Lender License AK65328
AL Mortgage Broker/Lender License #23581
AZ Mortgage Banker License 1045708
CA DFPI Financing Law License 60DBO-181882
CO Dept. of Regulatory Agencies Division of Banking
CT Department of Banking MCL-65328
DC Department of Insurance, Securities, & Banking MLB65328
DE Office of the State Bank Commissioner 040096
[FL — see Block 2 above]
GA Department of Banking & Finance 65328
IL Department of Financial & Professional Regulation MB.6761824
IN Licensed by the Indiana Department of Financial Institutions #70581
KS State Bank Commissioner of Kansas MC.0026625
KY Department of Financial Institutions MC838985
LA Office of Financial Institutions 65328
MA Mortgage Broker and Mortgage Lender License MC65328 MA Division of Banks
MD Office of Financial Regulation
MI Department of Insurance and Financial Services 1st Mortgage Broker/Lender Registrant License #FR0026300
MN Department of Commerce #MN-MO-65328
NC Commissioner of Banks L-211081
NJ Department of Banking & Insurance
NM New Mexico Regulation & Licensing Dept.
NY Licensed Mortgage Banker by the NYS Department of Financial Services LMBC109800
OH Department of Commerce Residential Mortgage Lending Act RM.805200.000
OR Oregon Department of Consumer and Business Services 65328
PA Department of Banking & Securities 45275
SC State Board of Financial Institutions MLS-65328
TN Department of Financial Institutions Mortgage License 65328
TX Department of Savings & Mortgage Lending
VA Bureau of Financial Institutions MC-7742
VT Department of Financial Regulation LL-65328
WA State Department of Financial Institutions CL-65328
```

## Assembly pattern

A complete LO disclosure block follows this template (constructed by joining Blocks 1 → relevant per-state lines from Block 4 → Block 2 if FL is in the state list → Block 3):

> [Block 1 — corporate/FHA/Equal Housing]
> [Per-state license citations from Block 4 in alphabetical order; insert Block 2 inline when FL appears alphabetically]
> [Block 3 — restrictions]

This matches the existing CSV's compiled disclosures and should be the rule for any new bio, marketing piece, or footer assembled by the rebuilt site.

## Site-wide footer disclosure (recommended)

The corporate site footer should display the most comprehensive disclosure (all 32 states), since the site itself markets to all licensed states. Use Christopher Clifford's full disclosure (line 21 of CSV) as the template.

## LO bio page disclosure

Each LO bio page footer should display only that LO's licensed-state subset. The page should also display a hyperlinked "Verify on NMLS Consumer Access" link for the LO's individual NMLS ID (per the technical-SEO + YMYL strategy docs).

## Florida pages — emphasis required

Per FL DOFR convention, the Swish Capital, Inc. DBA notice should appear:
1. In the disclosure block (Block 2) at the bottom of every FL-targeted page
2. On the GBP description for the Orlando branch
3. In meta descriptions and structured-data `description` fields for FL service-area pages
4. On any printed marketing distributed in FL

## TCPA / SMS consent (operational, not a disclosure block)

Independent of the licensing disclosures above: every lead form requesting a phone number must include explicit, unbundled TCPA consent language naming Cliffco, Inc. specifically, with documented consent records retained for ≥5 years. See `seo-aeo-research/03-ymyl-eeat-trust.md` §7 for the current legal status (post-FCC 1-to-1 rule vacatur in January 2025).
