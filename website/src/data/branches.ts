/**
 * Cliffco branch offices.
 * Source: /compliance/branches.md.
 *
 * Each branch is a Google Business Profile claim opportunity and a candidate
 * for a /locations/.../{branch-slug}/ landing page with LocalBusiness schema.
 *
 * Street addresses for non-HQ branches are TBD — they need to be collected
 * from facilities/HR before GBP claims and full branch landing pages can ship.
 */

export type Branch = {
  slug: string;
  /** Display name for headers and breadcrumbs */
  name: string;
  /** Street address — null until collected for non-HQ branches */
  street: string | null;
  city: string;
  region: string;
  postalCode: string | null;
  country: "US";
  phone: string | null;
  /** Optional latitude/longitude (HQ only for now) */
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
    slug: "newark-nj",
    name: "Newark, NJ",
    street: null,
    city: "Newark",
    region: "NJ",
    postalCode: null,
    country: "US",
    phone: null,
    metro: "Northern New Jersey",
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
    street: null,
    city: "Jamaica",
    region: "NY",
    postalCode: null,
    country: "US",
    phone: null,
    metro: "New York City",
    branchManagerSlug: "angelique-street-1146282",
    loanOfficerSlugs: ["angelique-street-1146282", "shahraj-kabir-khan-1209249"],
  },
  {
    slug: "wantagh-ny",
    name: "Wantagh, NY",
    street: null,
    city: "Wantagh",
    region: "NY",
    postalCode: null,
    country: "US",
    phone: null,
    metro: "Long Island",
    branchManagerSlug: "julian-giaquinto-56473",
    loanOfficerSlugs: ["julian-giaquinto-56473", "syed-hasib-1594778"],
  },
  {
    slug: "bay-shore-ny",
    name: "Bay Shore, NY",
    street: null,
    city: "Bay Shore",
    region: "NY",
    postalCode: null,
    country: "US",
    phone: null,
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
    street: null,
    city: "Orlando",
    region: "FL",
    postalCode: null,
    country: "US",
    phone: null,
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
    slug: "scottsdale-az",
    name: "Scottsdale, AZ",
    street: null,
    city: "Scottsdale",
    region: "AZ",
    postalCode: null,
    country: "US",
    phone: null,
    metro: "Phoenix metro",
    loanOfficerSlugs: ["mayra-hernandez-625376", "derek-liu-2578555"],
  },
  {
    slug: "excelsior-mn",
    name: "Excelsior, MN",
    street: null,
    city: "Excelsior",
    region: "MN",
    postalCode: null,
    country: "US",
    phone: null,
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
