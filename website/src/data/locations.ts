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
      "Two offices (Uniondale HQ and Bay Shore) helping Nassau and Suffolk families buy their " +
      "first home, move up, or refinance, with SONYMA and down payment assistance programs, " +
      "jumbo loans, and specialty options when you need them.",
    branchSlugs: ["uniondale-headquarters", "bay-shore-ny"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "non-qm-self-employed", "reverse-mortgage"],
  },
  {
    path: "new-york",
    name: "New York",
    state: "NY",
    blurb:
      "Cliffco has been headquartered on Long Island since 1989, with offices in " +
      "Uniondale and Bay Shore. We help New Yorkers buy their first home, move up, or " +
      "refinance, from conventional, FHA, and SONYMA programs to jumbo loans and CEMA " +
      "refinances, plus specialty programs when your situation calls for one.",
    branchSlugs: ["uniondale-headquarters", "bay-shore-ny"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "non-qm-self-employed", "reverse-mortgage"],
  },
  {
    path: "new-jersey",
    name: "New Jersey",
    state: "NJ",
    blurb:
      "Our Branchburg branch covers Central Jersey, the Shore, and the North Jersey commuter " +
      "belt, helping first-time buyers, move-up buyers, and homeowners refinancing, with " +
      "specialty programs for self-employed borrowers and investors too. Our team includes " +
      "bilingual English/Spanish loan officers.",
    branchSlugs: ["branchburg-nj"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "non-qm-self-employed", "dscr"],
  },
  {
    path: "arizona",
    name: "Arizona",
    state: "AZ",
    blurb:
      "Our Buckeye branch serves homebuyers across the Phoenix metro, Tucson, and statewide, " +
      "from first-time buyers and growing families to veterans using their VA benefit. We " +
      "also offer reverse mortgages for Arizona's retirement communities and DSCR loans for " +
      "investors.",
    branchSlugs: ["buckeye-az"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "reverse-mortgage", "dscr"],
  },
  {
    path: "minnesota",
    name: "Minnesota",
    state: "MN",
    blurb:
      "Our Excelsior office sits on Lake Minnetonka in the Twin Cities metro and serves " +
      "borrowers across Minnesota. Buying your first home, moving up, or refinancing, we " +
      "have the full product lineup available, including specialty programs for the " +
      "self-employed, investors, and homeowners nearing retirement.",
    branchSlugs: ["excelsior-mn"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "non-qm-self-employed", "dscr"],
  },
  {
    path: "florida",
    name: "Florida",
    state: "FL",
    isFlorida: true,
    blurb:
      "Our Ft. Lauderdale office anchors Cliffco's Florida presence, serving South Florida, " +
      "the greater Miami area, and borrowers statewide: first-time and move-up buyers, " +
      "homeowners refinancing, and investors and second-home buyers purchasing Florida property.",
    branchSlugs: ["fort-lauderdale-fl"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "dscr", "reverse-mortgage"],
  },
  {
    path: "florida/fort-lauderdale",
    name: "Ft. Lauderdale, FL",
    state: "FL",
    isFlorida: true,
    blurb:
      "Cliffco's Ft. Lauderdale office serves Broward, Miami-Dade, and Palm Beach counties, " +
      "helping buyers purchase their first home or next one and homeowners refinance. For " +
      "South Florida's condo and investor market, we also offer DSCR, non-warrantable condo, " +
      "foreign national, and jumbo financing. Operating as Clout Mortgage, Inc.",
    branchSlugs: ["fort-lauderdale-fl"],
    featuredProducts: ["conventional", "fha", "va", "refinancing", "dscr", "non-qm-self-employed"],
  },
];

export const location = (path: string): Location | undefined =>
  LOCATIONS.find((l) => l.path === path);

export const locationsByState = (state: string): Location[] =>
  LOCATIONS.filter((l) => l.state === state);
