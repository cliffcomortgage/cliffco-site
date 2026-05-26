/**
 * Cliffco corporate facts — single source of truth.
 * Derived from /compliance/state-licenses.md + /compliance/branches.md.
 * Update when the source compliance docs change.
 */

export const COMPANY = {
  legalName: "Cliffco, Inc.",
  brandName: "Cliffco Mortgage Bankers",
  shortName: "Cliffco",
  nmls: "65328",
  nmlsConsumerAccessUrl: "https://nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/65328",
  founded: 1989,
  yearsInBusiness: () => new Date().getFullYear() - 1989,
  tagline: "Power Up Your Mortgage Experience",
  noBsTagline: "No-BS Banking",
  hq: {
    street: "70 Charles Lindbergh Blvd, Suite 200",
    city: "Uniondale",
    region: "NY",
    postalCode: "11553",
    country: "US",
    phone: "(516) 408-7300",
    phoneE164: "+15164087300",
    geo: { latitude: 40.7186, longitude: -73.5959 },
  },
  tollFree: "(800) 834-4040",
  tollFreeE164: "+18008344040",
  socials: {
    linkedin: "https://www.linkedin.com/company/cliffco-mortgage-bankers",
    facebook: "https://www.facebook.com/cliffcomortgage",
    instagram: "https://www.instagram.com/cliffcomortgage",
  },
  // Florida is the only DBA
  floridaDba: {
    name: "Swish Capital, Inc.",
    disclosure:
      "Cliffco, Inc. doing business in Florida as Swish Capital, Inc., is a New York corporation authorized to transact business in the State of Florida.",
  },
  // Last NMLS audit confirming the data in /compliance/
  lastAudit: "2025-07-23",
} as const;

export const SITE_URL = "https://cliffcomortgage.com";
