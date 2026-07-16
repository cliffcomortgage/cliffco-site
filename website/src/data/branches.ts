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
  /** Override city label for UI bubbles (e.g., "Queens" instead of postal city "Jamaica") */
  displayCity?: string;
  isHeadquarters?: true;
  /** True for FL branches - must show Swish Capital DBA */
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
    branchManagerSlug: "christopher-clifford",
    loanOfficerSlugs: [
      "christopher-clifford",
      "ryan-riddle-1730872",
      "adam-broder-167538",
      "james-chen-17991",
      "david-fallarino-673167",
      "david-mizrahi-40925",
      "david-illouz-1584179",
      "donna-hemberger-90881",
      "james-perrone-56096",
      "michael-aziz-2801284",
      "anastasios-zervas-2145945",
      "rafael-rojas-2082989",
      "brendan-mcclarnon-17865",
      "raymond-garcia-2559091",
      "emmanuel-estinvil-66287",
      "andrea-carver-2074055",
      "kendra-daniel-1313375",
      "daniel-ebbecke-1578785",
      "joshua-brenner-2030405",
      "michael-bisbee-64809",
      "johana-amaya-1838913",
      "logan-levy-2502088",
      "lisa-hartman-1730543",
      "moses-youssef-949405",
      "mario-argenzio-1869384",
      "queeny-duong-826674",
      "gary-lai-599658",
      "renald-appo-53967",
      "steven-rivera-1876188",
      "george-diamantakis-1367963",
      "tamara-williamson-1933434",
      "justin-hu-2553712",
      "thomas-whalen-9167",
      "christian-soto-1173591",
      "eric-mueller-1712181",
      "paul-montesano-4388",
      "joshua-borrero-2380321",
      "jose-marrero-1962198",
      "steve-lazo-2636320",
      "emily-cordeira-1262960",
      "joseph-cordeira-1492298",
      "lee-horen-673181",
      "fabrizio-alosa-2631382",
      "brandon-kenney-2144392",
      "kevan-scott-1959714",
      "christian-nguyen-958635",
      "jeannette-zucker-2572449",
      "angelique-street-1146282",
      "shahraj-kabir-khan-1209249",
    ],
  },
  {
    slug: "branchburg-nj",
    name: "Branchburg, NJ",
    street: "3121 Route 22 East, 3rd Floor, Office 313",
    city: "Branchburg",
    region: "NJ",
    postalCode: "08876",
    country: "US",
    phone: "(516) 408-7300",
    nmls: "2671359",
    metro: "Central New Jersey",
    branchManagerSlug: "daphne-feliciano-1227421",
    loanOfficerSlugs: [
      "daphne-feliciano-1227421",
      "edward-morais-243926",
      "gary-johansen-339278",
    ],
  },
  {
    slug: "bay-shore-ny",
    name: "Bay Shore, NY",
    street: "50 Park Avenue, 2nd Floor, Suite 1",
    city: "Bay Shore",
    region: "NY",
    postalCode: "11706",
    country: "US",
    phone: "(516) 408-7300",
    nmls: "2733073",
    metro: "Long Island",
    loanOfficerSlugs: [
      "larisa-zambelli-1828224",
      "lauren-zambelli-970450",
      "lisa-zambelli-martorana-13055",
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
    phone: "(516) 408-7300",
    nmls: "2829876",
    metro: "South Florida",
    isFloridaDba: true,
    branchManagerSlug: "kyle-arabian-1671709",
    loanOfficerSlugs: ["kyle-arabian-1671709"],
  },
  {
    slug: "buckeye-az",
    name: "Buckeye, AZ",
    street: "21610 W Hillcrest Road",
    city: "Buckeye",
    region: "AZ",
    postalCode: "85396",
    country: "US",
    phone: "(516) 408-7300",
    nmls: "2476150",
    metro: "Phoenix metro",
    loanOfficerSlugs: [],
  },
  {
    slug: "excelsior-mn",
    name: "Excelsior, MN",
    street: "276 Water Street",
    city: "Excelsior",
    region: "MN",
    postalCode: "55331",
    country: "US",
    phone: "(516) 408-7300",
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
