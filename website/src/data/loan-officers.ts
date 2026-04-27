/**
 * Cliffco loan officer roster.
 * Source: /compliance/loan-officers.md + /compliance/loan-officer-disclosures.csv (audit 2025-07-23).
 *
 * Each LO drives a /loan-officers/{slug}/ bio page and a Person JSON-LD with
 * sameAs to NMLS Consumer Access — the core E-E-A-T anchor.
 *
 * For initial launch we ship full bios for the leadership wave (Wave 1) and
 * scaffolds for branch managers (Wave 2). Remaining LOs follow per the
 * publish order in /compliance/loan-officers.md.
 */

import { COMPANY } from "./company";

export type LoanOfficer = {
  /** URL slug = firstname-lastname-nmlsid */
  slug: string;
  firstName: string;
  lastName: string;
  /** Full display name (preserves middle initials, suffixes, etc.) */
  displayName: string;
  nmls: string;
  title: string;
  /** ISO state codes the LO is licensed in */
  states: readonly string[];
  /** Primary office (branch slug) */
  branchSlug: string;
  /** Languages spoken (LO to confirm) */
  languages?: readonly string[];
  /** External anchors (sameAs) for Person schema */
  links?: {
    linkedin?: string;
    email?: string;
    directPhone?: string;
    calendar?: string;
  };
  /** Specialties — align to the four priority products */
  specialties?: readonly string[];
  /** Long-form bio narrative; only populated for Wave 1 LOs at launch */
  bio?: string;
  /** Anonymized closing scenarios — only populated when LO confirms */
  scenarios?: readonly { title: string; body: string }[];
  /** Years originating; null if not yet provided */
  yearsExperience?: number;
  yearsAtCliffco?: number;
};

export const nmlsConsumerAccessUrl = (nmls: string): string =>
  `https://nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/${nmls}`;

export const LOAN_OFFICERS: readonly LoanOfficer[] = [
  // ============================================================
  // WAVE 1 — LEADERSHIP (full bios at launch)
  // ============================================================
  {
    slug: "christopher-clifford-65234",
    firstName: "Christopher",
    lastName: "Clifford",
    displayName: "Christopher Clifford",
    nmls: "65234",
    title: "President",
    states: ["AK", "AL", "AZ", "CA", "CT", "DC", "DE", "FL", "GA", "IL", "IN", "KS", "KY", "LA", "MD", "MI", "MN", "NC", "NJ", "NM", "NY", "OH", "PA", "SC", "TN", "TX", "VA", "VT", "WA"],
    branchSlug: "uniondale-headquarters",
    specialties: ["Non-QM & Self-Employed", "Reverse Mortgage (HECM)", "DSCR for Investors", "Fix-and-Flip", "Jumbo"],
    bio:
      "Christopher Clifford leads Cliffco Mortgage Bankers as President, carrying forward a 36-year " +
      "family-built mortgage operation that's licensed in 32 states. He's licensed in 29 of them personally, " +
      "which means he can pick up the file directly when a complex scenario lands — non-QM, reverse, DSCR, " +
      "fix-and-flip — and underwrite it with the same hands-on approach Cliffco was founded on.",
    yearsExperience: undefined, // LO to confirm
    yearsAtCliffco: undefined,
  },
  {
    slug: "adam-turkewitz-32900",
    firstName: "Adam",
    lastName: "Turkewitz",
    displayName: "Adam Turkewitz",
    nmls: "32900",
    title: "Senior VP of Sales",
    states: ["AL", "AZ", "CA", "CT", "DC", "FL", "GA", "IL", "IN", "KS", "KY", "LA", "MD", "MN", "NC", "NJ", "NY", "OH", "PA", "SC", "TX", "VA", "VT", "WA"],
    branchSlug: "uniondale-headquarters",
    specialties: ["Non-QM & Self-Employed", "DSCR", "Jumbo"],
  },
  {
    slug: "james-chen-17991",
    firstName: "James",
    lastName: "Chen",
    displayName: "James Chen",
    nmls: "17991",
    title: "Senior Vice President of Sales",
    states: ["AZ", "CT", "FL", "GA", "MD", "NC", "NJ", "NY", "OR", "PA", "SC", "TX", "VA"],
    branchSlug: "uniondale-headquarters",
  },
  {
    slug: "david-fallarino-673167",
    firstName: "David",
    lastName: "Fallarino",
    displayName: "David Fallarino",
    nmls: "673167",
    title: "Senior Vice President",
    states: ["AZ", "CA", "CT", "FL", "MD", "NC", "NJ", "NY", "PA", "SC", "TX", "VA", "WA"],
    branchSlug: "uniondale-headquarters",
  },
  {
    slug: "david-mizrahi-40925",
    firstName: "David",
    lastName: "Mizrahi",
    displayName: "David Mizrahi",
    nmls: "40925",
    title: "Vice President of Sales",
    states: ["CT", "FL", "NJ", "NY", "PA"],
    branchSlug: "uniondale-headquarters",
  },

  // ============================================================
  // WAVE 2 — BRANCH MANAGERS (scaffolded bios)
  // ============================================================
  {
    slug: "angelique-street-1146282",
    firstName: "Angelique",
    lastName: "Street",
    displayName: "Angelique Street",
    nmls: "1146282",
    title: "Branch Manager / Loan Officer",
    states: ["NY"],
    branchSlug: "jamaica-ny",
  },
  {
    slug: "daphne-feliciano-1227421",
    firstName: "Daphne",
    lastName: "Feliciano",
    displayName: "Daphne Feliciano",
    nmls: "1227421",
    title: "Producing Branch Manager",
    states: ["FL", "MD", "NJ", "PA"],
    branchSlug: "newark-nj",
  },
  {
    slug: "edward-morais-243926",
    firstName: "Edward",
    lastName: "Morais",
    displayName: "Edward (Eddie) Morais",
    nmls: "243926",
    title: "Branch Manager",
    states: ["FL", "NC", "NJ", "NY", "PA"],
    branchSlug: "newark-nj",
  },
  {
    slug: "francisco-veras-170512",
    firstName: "Francisco",
    lastName: "Veras",
    displayName: "Francisco Veras",
    nmls: "170512",
    title: "Branch Manager",
    states: ["FL", "NY"],
    branchSlug: "orlando-fl",
    languages: ["English", "Spanish"],
  },
  {
    slug: "julian-giaquinto-56473",
    firstName: "Julian",
    lastName: "Giaquinto",
    displayName: "Julian Giaquinto",
    nmls: "56473",
    title: "Branch Manager",
    states: ["AZ", "CA", "CT", "FL", "NC", "NY", "PA", "SC", "TX", "VA"],
    branchSlug: "wantagh-ny",
  },

  // ============================================================
  // WAVE 3+ — Active LOs in priority territories (scaffolded;
  // full bios populated as LOs provide photos + narratives)
  // ============================================================
  // Orlando (FL) — bilingual cluster
  { slug: "julia-jorge-delcarmen-1555712", firstName: "Julia", lastName: "Jorge-Delcarmen", displayName: "Julia Jorge-Delcarmen", nmls: "1555712", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl", languages: ["English", "Spanish"] },
  { slug: "keyla-cruz-486181", firstName: "Keyla", lastName: "Cruz", displayName: "Keyla Cruz", nmls: "486181", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl", languages: ["English", "Spanish"] },
  { slug: "nadia-geyer-castro-2498365", firstName: "Nadia", lastName: "Geyer Castro", displayName: "Nadia Geyer Castro", nmls: "2498365", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl", languages: ["English", "Spanish"] },
  { slug: "samantha-roach-1956150", firstName: "Samantha", lastName: "Roach", displayName: "Samantha Roach", nmls: "1956150", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl" },
  { slug: "wenceslao-hernandez-romero-1842661", firstName: "Wenceslao", lastName: "Hernandez Romero", displayName: "Wenceslao Hernandez Romero", nmls: "1842661", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl", languages: ["English", "Spanish"] },
  { slug: "yaisha-romero-1559680", firstName: "Yaisha", lastName: "Romero", displayName: "Yaisha Romero", nmls: "1559680", title: "Loan Officer", states: ["FL"], branchSlug: "orlando-fl", languages: ["English", "Spanish"] },

  // Scottsdale (AZ)
  { slug: "mayra-hernandez-625376", firstName: "Mayra", lastName: "Hernandez", displayName: "Mayra Hernandez", nmls: "625376", title: "Senior Loan Officer", states: ["AZ"], branchSlug: "scottsdale-az", languages: ["English", "Spanish"] },
  { slug: "derek-liu-2578555", firstName: "Derek", lastName: "Liu", displayName: "Derek Liu", nmls: "2578555", title: "Loan Officer", states: ["AZ", "CA", "WA"], branchSlug: "scottsdale-az" },

  // Excelsior (MN)
  { slug: "mitchell-patterson-2560483", firstName: "Mitchell", lastName: "Patterson", displayName: "Mitchell Patterson", nmls: "2560483", title: "Loan Officer", states: ["MN", "TX"], branchSlug: "excelsior-mn" },

  // Newark (NJ)
  { slug: "christian-soto-1173591", firstName: "Christian", lastName: "Soto", displayName: "Christian Soto", nmls: "1173591", title: "Loan Officer", states: ["NJ"], branchSlug: "newark-nj", languages: ["English", "Spanish"] },
  { slug: "gary-johansen-339278", firstName: "Gary", lastName: "Johansen", displayName: "Gary Johansen", nmls: "339278", title: "Regional Sales Manager", states: ["NJ", "NY"], branchSlug: "newark-nj" },

  // Jamaica (NY) Queens
  { slug: "shahraj-kabir-khan-1209249", firstName: "Shahraj", lastName: "Kabir Khan", displayName: "Shahraj Kabir Khan", nmls: "1209249", title: "Loan Officer", states: ["NY"], branchSlug: "jamaica-ny" },

  // Wantagh (NY) Nassau
  { slug: "syed-hasib-1594778", firstName: "Syed", lastName: "Hasib", displayName: "Syed Hasib", nmls: "1594778", title: "Loan Officer", states: ["NY"], branchSlug: "wantagh-ny" },

  // Bay Shore (NY) Suffolk — Zambelli cluster
  { slug: "larisa-zambelli-1828224", firstName: "Larisa", lastName: "Zambelli", displayName: "Larisa Ann Zambelli", nmls: "1828224", title: "Loan Officer", states: ["CT", "FL", "NJ", "NY", "PA", "TX"], branchSlug: "bay-shore-ny" },
  { slug: "lauren-zambelli-970450", firstName: "Lauren", lastName: "Zambelli", displayName: "Lauren Zambelli", nmls: "970450", title: "Loan Officer", states: ["NY"], branchSlug: "bay-shore-ny" },
  { slug: "lisa-zambelli-martorana-13055", firstName: "Lisa", lastName: "Zambelli-Martorana", displayName: "Lisa Zambelli-Martorana", nmls: "13055", title: "Loan Officer", states: ["NY"], branchSlug: "bay-shore-ny" },
];

export const loanOfficersByBranch = (branchSlug: string): LoanOfficer[] =>
  LOAN_OFFICERS.filter((lo) => lo.branchSlug === branchSlug);

export const loanOfficersByState = (state: string): LoanOfficer[] =>
  LOAN_OFFICERS.filter((lo) => lo.states.includes(state));

export const loanOfficer = (slug: string): LoanOfficer | undefined =>
  LOAN_OFFICERS.find((lo) => lo.slug === slug);

export const loanOfficerSchemaPerson = (lo: LoanOfficer) => ({
  "@type": "Person",
  name: lo.displayName,
  jobTitle: lo.title,
  worksFor: { "@id": `${COMPANY.legalName}#organization` },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NMLS",
    value: lo.nmls,
  },
  sameAs: [nmlsConsumerAccessUrl(lo.nmls), lo.links?.linkedin].filter(Boolean),
  knowsLanguage: lo.languages,
  knowsAbout: lo.specialties,
});
