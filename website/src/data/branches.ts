/**
 * Cliffco branch offices.
 * Source of truth: /compliance/branches.md + NMLS Consumer Access branch lookup.
 * Last verified: 2026-05-20.
 *
 * Each branch is a Google Business Profile claim opportunity and a candidate
 * for a /locations/.../{branch-slug}/ landing page with LocalBusiness schema.
 */

export type Branch = {
  slug: string;
  /** Display name for headers and breadcrumbs */
  name: string;
  /** Street address */
  street: string | null;
  city: string;
  region: string;
  postalCode: string | null;
  country: "US";
  phone: string | null;
  /** Branch NMLS ID (distinct from corporate NMLS #65328) */
  nmls?: string;
  /** Optional latitude/longitude */
  geo?: { latitude: number; longitude: number };
  /** Sub-region label (e.g., "Long Island", "Twin Cities") */
  metro?: string;
  isHeadquarters?: true;
  /** True for FL branches — must show Swish Capital DBA */
  isFloridaDba?: true;
  /** Slugs of LOs primarily working out of this branch */
  loanOfficerSlugs: string[];
  /** Branch manager LO slug (if known) */
  branchManagerSlug?: string;
};

export const BRANCHES: readonly Branch[] = [
  {
    slug: "uniondale-headquarters",
    name: "Uniondale, NY (Headquarters)",
    street: "70 Charles Lindbergh Blvd, Suite 200",
    city: "Uniondale",
    region: "NY",
    postalCode: "11553",
    country: "US",
    phone: "(516) 408-7300",
    geo: { latitude: 40.7186, longitude: -73.5959 },
    metro: "Long Island",
    isHeadquarters: true,
    branchManagerSlug: "christopher-clifford-65234",
    loanOfficerSlugs: ["christopher-clifford-65234"],
  },
  {
    slug: "branchburg-nj",
    name: "Branchburg, NJ",
    street: "3121 Route 22 East, 3rd Floor, Office 313",
    city: "Branchburg",
    region: "NJ",
    postalCode: "08876",
    country: "US",
    phone: null,
    nmls: "2671359",
    metro: "Central New Jersey",
    branchManagerSlug: "daphne-feliciano-1227421",
    loanOfficerSlugs: [
      "christian-soto-1173591",
      "daphne-feliciano-1227421",
      "edward-morais-243926",
      "gary-johansen-339278",
    ],
  },
  {
    slug: "jamaica-ny",
    name: "Jamaica, NY (Queens)",
    street: "142-62 Rockaway Boulevard",
    city: "Jamaica",
    region: "NY",
    postalCode: "11436",
    country: "US",
    phone: null,
    nmls: "2565193",
    metro: "New York City",
    branchManagerSlug: "angelique-street-1146282",
    loanOfficerSlugs: ["angelique-street-1146282", "shahraj-kabir-khan-1209249"],
  },
  {
    slug: "wantagh-ny",
    name: "Wantagh, NY",
    street: "3265 Merrick Road",
    city: "Wantagh",
    region: "NY",
    postalCode: "11793",
    country: "US",
    phone: null,
    nmls: "988006",
    metro: "Long Island",
    branchManagerSlug: "julian-giaquinto-56473",
    loanOfficerSlugs: ["julian-giaquinto-56473", "syed-hasib-1594778"],
  },
  {
    slug: "bay-shore-ny",
    name: "Bay Shore, NY",
    street: "50 Park Avenue, 2nd Floor, Suite 1",
    city: "Bay Shore",
    region: "NY",
    postalCode: "11706",
    country: "US",
    phone: null,
    nmls: "2733073",
    metro: "Long Island",
    loanOfficerSlugs: [
      "larisa-zambelli-1828224",
      "lauren-zambelli-970450",
      "lisa-zambelli-martorana-13055",
    ],
  },
  {
    slug: "orlando-fl",
    name: "Orlando, FL",
    street: "3801 Avalon Park East Blvd, 2nd Floor, Office 229",
    city: "Orlando",
    region: "FL",
    postalCode: "32828",
    country: "US",
    phone: null,
    nmls: "2526419",
    metro: "Orlando",
    isFloridaDba: true,
    branchManagerSlug: "francisco-veras-170512",
    loanOfficerSlugs: [
      "francisco-veras-170512",
      "julia-jorge-delcarmen-1555712",
      "keyla-cruz-486181",
      "nadia-geyer-castro-2498365",
      "samantha-roach-1956150",
      "wenceslao-hernandez-romero-1842661",
      "yaisha-romero-1559680",
    ],
  },
  {
    slug: "fort-lauderdale-fl",
    name: "Ft. Lauderdale, FL",
    street: "300 SE 2nd Street, Suite 600, Office 50",
    city: "Fort Lauderdale",
    region: "FL",
    postalCode: "33301",
    country: "US",
    phone: null,
    nmls: "2829876",
    metro: "South Florida",
    isFloridaDba: true,
    loanOfficerSlugs: [],
  },
  {
    slug: "scottsdale-az",
    name: "Scottsdale, AZ",
    street: "15955 Dial Boulevard, Suite 5",
    city: "Scottsdale",
    region: "AZ",
    postalCode: "85260",
    country: "US",
    phone: null,
    nmls: "2476150",
    metro: "Phoenix metro",
    branchManagerSlug: "steve-wei-1231095",
    loanOfficerSlugs: ["steve-wei-1231095", "mayra-hernandez-625376", "derek-liu-2578555"],
  },
  {
    slug: "excelsior-mn",
    name: "Excelsior, MN",
    street: "276 Water Street",
    city: "Excelsior",
    region: "MN",
    postalCode: "55331",
    country: "US",
    phone: null,
    nmls: "2763960",
    metro: "Twin Cities",
    loanOfficerSlugs: ["mitchell-patterson-2560483"],
  },
];

export const branchesByState = (state: string): Branch[] =>
  BRANCHES.filter((b) => b.region === state);

export const branchesByMetro = (metro: string): Branch[] =>
  BRANCHES.filter((b) => b.metro === metro);

export const headquarters = (): Branch =>
  BRANCHES.find((b) => b.isHeadquarters)!;
