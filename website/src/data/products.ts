/**
 * Cliffco's loan products. Drives /loans/* navigation, schema, and content.
 */

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  /** One-line answer (used in nav, hero, schema description) */
  oneLiner: string;
  /** 40-60 word direct-answer paragraph for the inverted-pyramid intro */
  directAnswer: string;
  /** Loan type label for MortgageLoan schema */
  loanType: string;
  /** Whether this is one of the 4 priority products that get full pillars */
  isPriority: boolean;
  /** Product category - drives card grouping */
  category: "Non-QM" | "Reverse" | "Investor" | "Conventional / Government";
};

export const PRODUCTS: readonly Product[] = [
  {
    slug: "non-qm-self-employed",
    name: "Non-QM & Self-Employed Loans",
    shortName: "Non-QM",
    oneLiner: "Mortgages for self-employed borrowers, 1099 contractors, and anyone whose tax returns don't tell the whole story.",
    directAnswer:
      "Cliffco's Non-QM mortgages qualify self-employed borrowers, 1099 contractors, " +
      "freelancers, and small-business owners using bank statements, 1099s, profit-and-loss " +
      "statements, or asset utilization, instead of two years of tax returns. Programs include " +
      "12 / 24-month bank statement, P&L only, 1099 only, asset depletion, ITIN, and foreign " +
      "national, with rates typically 1–2 points above conventional.",
    loanType: "Non-QM Bank Statement",
    isPriority: true,
    category: "Non-QM",
  },
  {
    slug: "reverse-mortgage",
    name: "Reverse Mortgages",
    shortName: "Reverse",
    oneLiner: "HECM and proprietary reverse mortgages for homeowners 62+.",
    directAnswer:
      "A reverse mortgage (HECM) lets homeowners 62 and older convert home equity into cash, " +
      "a line of credit, or monthly income, with no required monthly payment as long as the home " +
      "remains the primary residence and property taxes, insurance, and maintenance are kept current. " +
      "HECM is FHA-insured and non-recourse: heirs are never responsible for more than the home's value.",
    loanType: "HECM Reverse",
    isPriority: true,
    category: "Reverse",
  },
  {
    slug: "dscr",
    name: "DSCR Loans",
    shortName: "DSCR",
    oneLiner: "Investor mortgages qualified on rental income - no personal income docs.",
    directAnswer:
      "A DSCR (Debt-Service Coverage Ratio) loan qualifies real estate investors based on the " +
      "rental income of the subject property - not personal income. Cliffco's DSCR programs cover " +
      "long-term rentals and short-term rentals (Airbnb / Vrbo/1007 Market Rent Schedule), allow LLC vesting, fund out-of-state " +
      "borrowers, and accept from no ratio to 0.75 (with strong reserves) up to 1.25+. Competitive pricing available for higher ratios.",
    loanType: "DSCR",
    isPriority: true,
    category: "Investor",
  },
  {
    slug: "business-bank-statement",
    name: "Business Bank Statement Loans",
    shortName: "Business Bank Statement",
    oneLiner: "Business owners qualify using 12–24 months of business bank statements - no tax returns required.",
    directAnswer:
      "Business bank statement loans qualify self-employed business owners using 12 or 24 months of " +
      "business bank statements instead of tax returns or W-2s. Cliffco applies a business expense ratio " +
      "(typically 50%) to gross deposits to calculate qualifying income - making this the right fit for " +
      "profitable businesses whose tax returns understate actual cash flow. Ideal for LLCs, S-Corps, " +
      "sole proprietors, and any owner whose books are cleaner than their 1040.",
    loanType: "Non-QM Business Bank Statement",
    isPriority: true,
    category: "Non-QM",
  },
  // Non-QM sub-programs
  { slug: "itin-mortgage", name: "ITIN Mortgage", shortName: "ITIN Mortgage", oneLiner: "Home loans for borrowers with an Individual Taxpayer Identification Number and no Social Security number.", directAnswer: "An ITIN mortgage lets borrowers who have an Individual Taxpayer Identification Number but no Social Security number qualify for a home loan. Cliffco uses bank statements, 1099s, or other Non-QM income documentation to qualify ITIN borrowers for primary residences, second homes, and investment properties.", loanType: "Non-QM ITIN", isPriority: false, category: "Non-QM" },
  { slug: "foreign-national-mortgage", name: "Foreign National Mortgage", shortName: "Foreign National", oneLiner: "US property financing for non-resident foreign nationals — no US credit history, Social Security number, or tax returns required.", directAnswer: "A foreign national mortgage is a Non-QM home loan for buyers who reside outside the United States and lack US credit history, a Social Security number, or US tax returns. Cliffco qualifies foreign nationals using foreign income documentation, bank reference letters, and asset verification. Investment properties and second homes are eligible; down payments typically start at 25%.", loanType: "Non-QM Foreign National", isPriority: false, category: "Non-QM" },
  { slug: "1099-mortgage", name: "1099 Mortgage", shortName: "1099 Mortgage", oneLiner: "Independent contractors and freelancers qualify using 1099 income — no tax returns required.", directAnswer: "A 1099 mortgage qualifies independent contractors, gig workers, and freelancers using their 1099 forms rather than personal tax returns. Cliffco applies an expense factor to gross 1099 income to calculate monthly qualifying income — making this the right fit for contractors whose deductions on their 1040 make taxable income look much lower than what they actually earn.", loanType: "Non-QM 1099", isPriority: false, category: "Non-QM" },
  { slug: "asset-utilization-mortgage", name: "Asset Utilization Mortgage", shortName: "Asset Utilization", oneLiner: "Qualify using liquid assets as income — or use them to supplement what you already earn. No W-2 or pay stub required.", directAnswer: "An asset utilization mortgage (also called asset depletion) calculates qualifying income by dividing verified assets across a set term. Asset-derived income can stand alone or be layered on top of any other documented income, giving borrowers of all kinds a path to qualify — or qualify for more — based on what they have saved and invested. Cliffco's asset utilization programs accept a wide range of asset types, including checking, savings, money market accounts, cash value of life insurance, stocks, bonds, mutual funds, retirement accounts, and in some cases cryptocurrency and real estate sale proceeds.", loanType: "Non-QM Asset Utilization", isPriority: false, category: "Non-QM" },
  // Supporting products
  { slug: "conventional", name: "Conventional Loans", shortName: "Conventional", oneLiner: "Fannie Mae / Freddie Mac conforming and high-balance loans.", directAnswer: "Conventional mortgages following Fannie Mae and Freddie Mac guidelines - fixed and adjustable terms, conforming and high-balance limits, with as little as 3% down for first-time buyers.", loanType: "Conventional", isPriority: false, category: "Conventional / Government" },
  { slug: "fha", name: "FHA Loans", shortName: "FHA", oneLiner: "Government-insured loans with low down-payment requirements.", directAnswer: "FHA-insured mortgages allow as little as 3.5% down, accept credit scores starting in the 580s, and are designed for first-time and credit-challenged buyers. Cliffco is not affiliated with or acting on behalf of the FHA or any government entity.", loanType: "FHA", isPriority: false, category: "Conventional / Government" },
  { slug: "va", name: "VA Loans", shortName: "VA", oneLiner: "Zero-down financing for eligible veterans, service members, and surviving spouses.", directAnswer: "VA-guaranteed mortgages offer 0% down, no monthly mortgage insurance, and competitive rates for eligible service members, veterans, and surviving spouses.", loanType: "VA", isPriority: false, category: "Conventional / Government" },
  { slug: "usda", name: "USDA Loans", shortName: "USDA", oneLiner: "Zero-down financing for eligible rural and suburban properties.", directAnswer: "USDA Rural Development loans offer 0% down for properties in eligible rural and many suburban areas, subject to income limits.", loanType: "USDA", isPriority: false, category: "Conventional / Government" },
  { slug: "renovation", name: "Renovation Loans", shortName: "Renovation", oneLiner: "Finance a home plus its renovation in a single loan.", directAnswer: "Renovation mortgages (FHA 203(k) and Fannie Mae HomeStyle) roll the purchase or refinance and the cost of renovations into a single mortgage based on the home's after-renovation value.", loanType: "Renovation", isPriority: false, category: "Conventional / Government" },
  { slug: "refinancing", name: "Refinancing", shortName: "Refinancing", oneLiner: "Rate-and-term, cash-out, CEMA, and Non-QM refinances for all borrower types.", directAnswer: "Cliffco refinances mortgages across all loan types: conventional rate-and-term, cash-out up to 80-85% LTV, Non-QM refinances for self-employed borrowers who can't qualify conventionally, CEMA refinances that eliminate New York mortgage recording tax on the existing principal balance, and HECM-to-HECM reverse mortgage refinances for better terms.", loanType: "Refinance", isPriority: false, category: "Conventional / Government" },
  { slug: "condos-co-ops-condotels", name: "Condos, Co-Ops & Condotels", shortName: "Condos & Co-Ops", oneLiner: "Financing for warrantable and non-warrantable condos, co-op apartments, and condotel units.", directAnswer: "Many condos, co-ops, and condotel units can't qualify for standard Fannie Mae or FHA financing because of litigation, investor concentration, commercial space, or hotel-style management. Cliffco's Non-QM and portfolio programs cover non-warrantable condos, co-op buildings requiring board approval, and condotel units that conventional lenders decline.", loanType: "Non-QM Condo", isPriority: false, category: "Non-QM" },
];

export const priorityProducts = (): Product[] =>
  PRODUCTS.filter((p) => p.isPriority);

export const product = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);
