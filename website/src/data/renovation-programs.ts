/**
 * Renovation program facts — single source for /loans/renovation/ and the three ad landers.
 *
 * Source of truth: Guidelines/Renovation-Program-Comparison-Matrix-02-05-26.
 * Where Renovation Documents/Renovation-Lending-Product-Comparison-Matrix-10.2026.xlsx
 * disagrees, the guidelines win. The two exceptions, both confirmed with Rafe:
 *   - VA credit score uses the 10.2026 figures (640 / 660). The guidelines' VA credit
 *     entries are cash-out LTV and manufactured-home tiers, so they answer a different
 *     question.
 *   - "Time to finish the work" is the guidelines' "Draw Period from Closing" row, which
 *     gives one figure per program where 10.2026 gives ranges.
 *
 * These figures were wrong on the site until 2026-10-14 (a flat 620 credit score, a
 * $200,000 HomeStyle cap, a $50,000 VA cap, and a self-help allowance that does not exist
 * on any program). They now live here so a correction lands in one place.
 */

export type RenovationProgram = {
  slug: string;
  name: string;
  shortName: string;
  backer: string;
  bestFor: string;
  /** Spec rows, in the order they should render. */
  rows: [string, string][];
  /** One-line summary for a comparison table. */
  summary: string;
};

const FHA_MI = "FHA MIP (typically for life of loan)";
const CONV_DOWN = "From 3% first-time buyers; 5% primary; 10% second home; 15% investment";
const CONV_CONSULTANT = "Required above $75,000 of repairs, or for any structural work";
const CONV_CAP = "Up to 75% of the as-improved appraised value";

export const RENOVATION_PROGRAMS: RenovationProgram[] = [
  {
    slug: "fha-203k-standard",
    name: "FHA 203(k) Standard",
    shortName: "203(k) Standard",
    backer: "Government-insured",
    bestFor: "Major remodels, structural repairs, and additions.",
    summary: "No cap on the repair budget, structural work allowed, HUD consultant required.",
    rows: [
      ["Repair costs", "$5,000 minimum"],
      ["Down payment", "3.5%"],
      ["Min credit score", "No fixed minimum; set by the automated underwriting decision"],
      ["HUD consultant", "Required"],
      ["Time to finish", "12 months from closing"],
      ["Property types", "Primary residence, 1–4 units"],
      ["Luxury items", "Not eligible"],
      ["Mortgage insurance", FHA_MI],
    ],
  },
  {
    slug: "fha-203k-limited",
    name: "FHA 203(k) Limited",
    shortName: "203(k) Limited",
    backer: "Government-insured",
    bestFor: "Lighter, non-structural updates like kitchens, baths, flooring, a roof, or HVAC.",
    summary: "Capped at $75,000 including fees, no structural work, no consultant required.",
    rows: [
      ["Repair costs", "Up to $75,000, including fees and contingency"],
      ["Down payment", "3.5%"],
      ["Min credit score", "No fixed minimum; set by the automated underwriting decision"],
      ["HUD consultant", "Not required"],
      ["Time to finish", "9 months from closing"],
      ["Property types", "Primary residence, 1–4 units"],
      ["Structural work", "Not eligible"],
      ["Mortgage insurance", FHA_MI],
    ],
  },
  {
    slug: "homestyle",
    name: "Fannie Mae HomeStyle",
    shortName: "HomeStyle",
    backer: "Conventional",
    bestFor: "Any permanent improvement, including luxury upgrades, on a primary home, second home, or rental.",
    summary: "Covers second homes and rentals, allows pools, 15 months to finish.",
    rows: [
      ["Renovation costs", CONV_CAP],
      ["Down payment", CONV_DOWN],
      ["Min credit score", "Per DU Approve/Eligible; manual underwriting not allowed"],
      ["Loan limit", "Conforming / high-balance"],
      ["Property types", "Primary, second home, 1-unit investment"],
      ["Luxury items", "Eligible, including pools"],
      ["HUD consultant", CONV_CONSULTANT],
      ["Time to finish", "15 months from closing"],
      ["Mortgage insurance", "PMI"],
    ],
  },
  {
    slug: "choicerenovation",
    name: "Freddie Mac CHOICERenovation",
    shortName: "CHOICERenovation",
    backer: "Conventional",
    bestFor: "Structural and non-structural remodels on a primary home, second home, or rental.",
    summary: "Same reach as HomeStyle, with the longest completion window of the five.",
    rows: [
      ["Renovation costs", CONV_CAP],
      ["Down payment", CONV_DOWN],
      ["Min credit score", "Per LP Accept; manual underwriting not allowed"],
      ["Loan limit", "Conforming / high-balance"],
      ["Property types", "Primary, second home, 1-unit investment"],
      ["Luxury items", "Eligible, including pools"],
      ["HUD consultant", CONV_CONSULTANT],
      ["Time to finish", "450 days from closing; 180 days on ChoiceReno eXPress"],
      ["Mortgage insurance", "PMI"],
    ],
  },
  {
    slug: "va-renovation",
    name: "VA Renovation",
    shortName: "VA Renovation",
    backer: "VA-guaranteed",
    bestFor: "Eligible veterans, service members, and surviving spouses buying or refinancing a home that needs work.",
    summary: "0% down with full entitlement and no monthly MI, but the tightest scope and schedule.",
    rows: [
      ["Down payment", "0% on a purchase with full entitlement"],
      ["Renovation costs", "$75,000 or 35% of the after-renovation value, whichever is less, plus fees"],
      ["Min credit score", "640 (1–2 units); 660 (3–4 units)"],
      ["Refinance LTV", "Capped at 90%"],
      ["Structural work", "Non-structural, except ADA and accessibility work"],
      ["Time to finish", "120 days from closing"],
      ["Property types", "Primary residence, 1–4 units"],
      ["Mortgage insurance", "None (VA funding fee applies)"],
    ],
  },
];

export const renovationProgram = (slug: string): RenovationProgram | undefined =>
  RENOVATION_PROGRAMS.find((p) => p.slug === slug);

/** Facts true of every renovation program, so a lander can state them without repeating. */
export const RENOVATION_UNIVERSAL = {
  selfHelp:
    "Self-help — acting as your own general contractor — isn't eligible on any renovation program. The work has to be done by a licensed contractor.",
  contractors:
    "One general contractor, with specialty trades added as the job needs them. 203(k) Limited is the exception and allows up to three.",
  escrow:
    "The renovation money is held in escrow at closing and released in draws as an inspector confirms each stage of the work.",
  appraisal:
    "The appraiser values the home as if the renovation were already finished. That after-renovation value is the ceiling: it's how the lender checks the purchase price plus the renovation budget isn't too high for what the home will be worth.",
};
