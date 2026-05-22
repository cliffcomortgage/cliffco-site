/**
 * Locations / metros that get a dedicated landing page. Pulls together
 * the priority territories from the SEO/AEO research with the actual
 * branch presence per /compliance/branches.md.
 */

export type Location = {
  /** URL path (relative to /locations/) */
  path: string;
  name: string;
  state: string;
  /** Used in hero and schema description */
  blurb: string;
  /** Whether the location requires the FL DBA disclosure */
  isFlorida?: true;
  /** Local branch slugs serving this location */
  branchSlugs?: readonly string[];
  /** Highlighted product slugs for this market */
  featuredProducts: readonly string[];
};

export const LOCATIONS: readonly Location[] = [
  {
    path: "new-york/long-island",
    name: "Long Island, NY",
    state: "NY",
    blurb:
      "Cliffco was founded on Long Island in 1989 and is still headquartered here. " +
      "Three offices (Uniondale HQ, Wantagh, and Bay Shore) and decades of hands-on " +
      "experience with the jumbo, non-QM, and reverse mortgage scenarios that Long Island " +
      "borrowers actually face.",
    branchSlugs: ["uniondale-headquarters", "wantagh-ny", "bay-shore-ny"],
    featuredProducts: ["non-qm-self-employed", "reverse-mortgage", "dscr", "business-bank-statement"],
  },
  {
    path: "new-york",
    name: "New York",
    state: "NY",
    blurb:
      "Cliffco has been headquartered on Long Island since 1989, with four New York offices " +
      "across Uniondale, Wantagh, Bay Shore, and Queens. From jumbo loans and CEMA " +
      "refinances to non-QM, reverse mortgages, and DSCR financing, we handle the loan types " +
      "New York borrowers actually need.",
    branchSlugs: ["uniondale-headquarters", "wantagh-ny", "bay-shore-ny", "jamaica-ny"],
    featuredProducts: ["non-qm-self-employed", "reverse-mortgage", "dscr", "business-bank-statement"],
  },
  {
    path: "new-york/queens",
    name: "Queens, NY",
    state: "NY",
    blurb:
      "Cliffco's Queens office is located in Jamaica and serves buyers and investors across all " +
      "five boroughs. From co-op and condo financing to non-QM and DSCR loans, our Queens team " +
      "handles the loan types New York City borrowers actually need.",
    branchSlugs: ["jamaica-ny"],
    featuredProducts: ["non-qm-self-employed", "dscr", "business-bank-statement", "reverse-mortgage"],
  },
  {
    path: "new-jersey",
    name: "New Jersey",
    state: "NJ",
    blurb:
      "Our Branchburg branch covers Central Jersey, the Shore, and the North Jersey commuter " +
      "belt — markets where self-employed borrowers, real estate investors, and buyers with " +
      "complex financials often hit walls at conventional lenders. Our team includes bilingual " +
      "English/Spanish loan officers.",
    branchSlugs: ["branchburg-nj"],
    featuredProducts: ["non-qm-self-employed", "fha", "dscr", "reverse-mortgage"],
  },
  {
    path: "arizona",
    name: "Arizona",
    state: "AZ",
    blurb:
      "Our Scottsdale branch serves Phoenix metro homebuyers and investors, Tucson, and " +
      "Arizona's retirement communities. Strong fit for reverse mortgages in Sun Belt " +
      "retirement areas, DSCR loans for the state's active investor market, and non-QM " +
      "bank statement loans for the self-employed.",
    branchSlugs: ["scottsdale-az"],
    featuredProducts: ["reverse-mortgage", "dscr", "non-qm-self-employed", "business-bank-statement"],
  },
  {
    path: "minnesota",
    name: "Minnesota",
    state: "MN",
    blurb:
      "Our Excelsior office sits on Lake Minnetonka in the Twin Cities metro and serves " +
      "borrowers across Minnesota. Whether you're self-employed, investing in rental property, " +
      "or approaching retirement, we have the full product lineup available.",
    branchSlugs: ["excelsior-mn"],
    featuredProducts: ["conventional", "non-qm-self-employed", "dscr", "reverse-mortgage"],
  },
  {
    path: "florida",
    name: "Florida",
    state: "FL",
    isFlorida: true,
    blurb:
      "Two Florida offices cover the state: Orlando anchors a bilingual team working with " +
      "Disney-area short-term-rental investors, Central Florida buyers, and out-of-state " +
      "investors purchasing Florida property. Ft. Lauderdale serves South Florida and the " +
      "greater Miami area.",
    branchSlugs: ["orlando-fl", "fort-lauderdale-fl"],
    featuredProducts: ["dscr", "reverse-mortgage", "non-qm-self-employed", "business-bank-statement"],
  },
  {
    path: "florida/orlando",
    name: "Orlando, FL",
    state: "FL",
    isFlorida: true,
    blurb:
      "Orlando is one of the country's top short-term-rental markets. Our bilingual team " +
      "here specializes in DSCR loans for investors near Disney, Universal, and the I-Drive " +
      "corridor, plus non-QM and bank statement loans for self-employed Florida small-business " +
      "owners and ITIN borrowers.",
    branchSlugs: ["orlando-fl"],
    featuredProducts: ["dscr", "business-bank-statement", "non-qm-self-employed", "renovation"],
  },
  {
    path: "florida/fort-lauderdale",
    name: "Ft. Lauderdale, FL",
    state: "FL",
    isFlorida: true,
    blurb:
      "Cliffco's Ft. Lauderdale office serves Broward, Miami-Dade, and Palm Beach counties. " +
      "South Florida's investor-dense market is a strong fit for DSCR, foreign national, ITIN, " +
      "non-warrantable condo, and jumbo financing — loan types conventional lenders routinely " +
      "decline. Operating as Swish Capital, Inc.",
    branchSlugs: ["fort-lauderdale-fl"],
    featuredProducts: ["dscr", "non-qm-self-employed", "business-bank-statement", "reverse-mortgage"],
  },
];

export const location = (path: string): Location | undefined =>
  LOCATIONS.find((l) => l.path === path);

export const locationsByState = (state: string): Location[] =>
  LOCATIONS.filter((l) => l.state === state);
