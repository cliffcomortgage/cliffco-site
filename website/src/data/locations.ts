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
      "Cliffco was founded on Long Island in 1989. We're licensed across New York " +
      "with three Long Island offices — Uniondale (HQ), Wantagh, and Bay Shore — and " +
      "decades of experience with the jumbo, non-QM, and reverse mortgage scenarios " +
      "that Long Island borrowers actually face.",
    branchSlugs: ["uniondale-headquarters", "wantagh-ny", "bay-shore-ny"],
    featuredProducts: ["non-qm-self-employed", "reverse-mortgage", "dscr", "business-bank-statement"],
  },
  {
    path: "new-york",
    name: "New York",
    state: "NY",
    blurb:
      "Cliffco is licensed in New York as a Mortgage Banker (NMLS #65328 · NYS DFS LMBC109800) " +
      "and is headquartered in Uniondale on Long Island. We serve borrowers across the five " +
      "boroughs, Long Island, the Hudson Valley, and Upstate New York.",
    branchSlugs: ["uniondale-headquarters", "wantagh-ny", "bay-shore-ny", "jamaica-ny"],
    featuredProducts: ["non-qm-self-employed", "reverse-mortgage", "dscr", "business-bank-statement"],
  },
  {
    path: "new-jersey",
    name: "New Jersey",
    state: "NJ",
    blurb:
      "Cliffco is licensed in New Jersey by the Department of Banking & Insurance, with our " +
      "Branchburg branch serving Central Jersey, the Shore, and the North Jersey commuter belt.",
    branchSlugs: ["branchburg-nj"],
    featuredProducts: ["non-qm-self-employed", "dscr", "business-bank-statement", "reverse-mortgage"],
  },
  {
    path: "arizona",
    name: "Arizona",
    state: "AZ",
    blurb:
      "Cliffco is licensed in Arizona (Mortgage Banker License 1045708) with our Scottsdale " +
      "branch serving the Phoenix metro, Tucson, and the state's growing investor and retiree markets.",
    branchSlugs: ["scottsdale-az"],
    featuredProducts: ["reverse-mortgage", "dscr", "non-qm-self-employed", "business-bank-statement"],
  },
  {
    path: "minnesota",
    name: "Minnesota",
    state: "MN",
    blurb:
      "Cliffco is licensed in Minnesota by the Department of Commerce (#MN-MO-65328), with " +
      "our Excelsior office serving the Twin Cities metro and beyond.",
    branchSlugs: ["excelsior-mn"],
    featuredProducts: ["non-qm-self-employed", "dscr", "reverse-mortgage", "business-bank-statement"],
  },
  {
    path: "florida",
    name: "Florida",
    state: "FL",
    isFlorida: true,
    blurb:
      "Cliffco serves Florida borrowers and investors statewide, operating in Florida as " +
      "Swish Capital, Inc. — a New York corporation authorized to transact business in Florida. " +
      "We have two Florida branches: Orlando, anchoring a bilingual team covering Central Florida, " +
      "and Ft. Lauderdale, serving South Florida.",
    branchSlugs: ["orlando-fl", "fort-lauderdale-fl"],
    featuredProducts: ["dscr", "business-bank-statement", "non-qm-self-employed", "reverse-mortgage"],
  },
  {
    path: "florida/orlando",
    name: "Orlando, FL",
    state: "FL",
    isFlorida: true,
    blurb:
      "Cliffco's Orlando branch is the heart of our Florida operation, with bilingual loan " +
      "officers serving the Orlando metro, Disney-area short-term-rental investors, and " +
      "borrowers across Central Florida. Cliffco operates in Florida as Swish Capital, Inc.",
    branchSlugs: ["orlando-fl"],
    featuredProducts: ["dscr", "business-bank-statement", "non-qm-self-employed", "reverse-mortgage"],
  },
];

export const location = (path: string): Location | undefined =>
  LOCATIONS.find((l) => l.path === path);

export const locationsByState = (state: string): Location[] =>
  LOCATIONS.filter((l) => l.state === state);
