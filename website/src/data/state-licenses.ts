/**
 * State licenses for Cliffco, Inc. (NMLS #65328).
 * Source: /compliance/state-licenses.md (NMLS audit 2025-07-23).
 *
 * Every state Cliffco can lend in. The site footer state list, /licensing/
 * page, GBP service areas, schema areaServed all derive from this array.
 *
 * Florida is a DBA ("Swish Capital, Inc.") - see COMPANY.floridaDba.
 */

export type StateLicense = {
  /** ISO 3166-2 state code (without "US-" prefix) */
  code: string;
  /** Full state name */
  name: string;
  /** Issuing regulator */
  regulator: string;
  /** License number; some states are issued without a stand-alone number on the disclosure */
  licenseNumber: string | null;
  /** Optional: stub the regulator's verification page when easily linkable */
  regulatorUrl?: string;
  /** Optional: notes (e.g., FL DBA caveat) */
  notes?: string;
};

export const STATE_LICENSES: readonly StateLicense[] = [
  { code: "AK", name: "Alaska",       regulator: "Alaska Division of Banking and Securities - Mortgage Broker/Lender", licenseNumber: "AK65328" },
  { code: "AL", name: "Alabama",      regulator: "Alabama Mortgage Broker/Lender License",                              licenseNumber: "23581" },
  { code: "AZ", name: "Arizona",      regulator: "Arizona Mortgage Banker License",                                     licenseNumber: "1045708" },
  { code: "CA", name: "California",   regulator: "California DFPI Financing Law License",                               licenseNumber: "60DBO-181882" },
  { code: "CO", name: "Colorado",     regulator: "Colorado Department of Regulatory Agencies, Division of Banking",     licenseNumber: null },
  { code: "CT", name: "Connecticut",  regulator: "Connecticut Department of Banking",                                   licenseNumber: "MCL-65328" },
  { code: "DC", name: "District of Columbia", regulator: "DC Department of Insurance, Securities, & Banking",           licenseNumber: "MLB65328" },
  { code: "DE", name: "Delaware",     regulator: "Delaware Office of the State Bank Commissioner",                      licenseNumber: "040096" },
  { code: "FL", name: "Florida",      regulator: "Florida Office of Financial Regulation", licenseNumber: "MLD1245", notes: "DBA: Swish Capital, Inc." },
  { code: "GA", name: "Georgia",      regulator: "Georgia Department of Banking & Finance",                             licenseNumber: "65328" },
  { code: "IL", name: "Illinois",     regulator: "Illinois Department of Financial & Professional Regulation",          licenseNumber: "MB.6761824" },
  { code: "IN", name: "Indiana",      regulator: "Indiana Department of Financial Institutions",                        licenseNumber: "70581" },
  { code: "KS", name: "Kansas",       regulator: "Kansas State Bank Commissioner",                                      licenseNumber: "MC.0026625" },
  { code: "KY", name: "Kentucky",     regulator: "Kentucky Department of Financial Institutions",                       licenseNumber: "MC838985" },
  { code: "LA", name: "Louisiana",    regulator: "Louisiana Office of Financial Institutions",                          licenseNumber: "65328" },
  { code: "MA", name: "Massachusetts",regulator: "Massachusetts Division of Banks - Mortgage Broker and Mortgage Lender", licenseNumber: "MC65328" },
  { code: "MD", name: "Maryland",     regulator: "Maryland Office of Financial Regulation",                             licenseNumber: null },
  { code: "MI", name: "Michigan",     regulator: "Michigan Department of Insurance and Financial Services - 1st Mortgage Broker/Lender Registrant", licenseNumber: "FR0026300" },
  { code: "MN", name: "Minnesota",    regulator: "Minnesota Department of Commerce",                                    licenseNumber: "MN-MO-65328" },
  { code: "NC", name: "North Carolina", regulator: "North Carolina Commissioner of Banks",                              licenseNumber: "L-211081" },
  { code: "NJ", name: "New Jersey",   regulator: "New Jersey Department of Banking & Insurance",                        licenseNumber: null },
  { code: "NM", name: "New Mexico",   regulator: "New Mexico Regulation & Licensing Department",                        licenseNumber: null },
  { code: "NY", name: "New York",     regulator: "New York Department of Financial Services - Licensed Mortgage Banker", licenseNumber: "LMBC109800" },
  { code: "OH", name: "Ohio",         regulator: "Ohio Department of Commerce - Residential Mortgage Lending Act",      licenseNumber: "RM.805200.000" },
  { code: "OR", name: "Oregon",       regulator: "Oregon Department of Consumer and Business Services",                 licenseNumber: "65328" },
  { code: "PA", name: "Pennsylvania", regulator: "Pennsylvania Department of Banking & Securities",                     licenseNumber: "45275" },
  { code: "SC", name: "South Carolina", regulator: "South Carolina State Board of Financial Institutions",              licenseNumber: "MLS-65328" },
  { code: "TN", name: "Tennessee",    regulator: "Tennessee Department of Financial Institutions Mortgage License",     licenseNumber: "65328" },
  { code: "TX", name: "Texas",        regulator: "Texas Department of Savings & Mortgage Lending",                      licenseNumber: null, notes: "Texas requires the standard TX consumer complaint disclosure procedure." },
  { code: "VA", name: "Virginia",     regulator: "Virginia Bureau of Financial Institutions",                           licenseNumber: "MC-7742" },
  { code: "VT", name: "Vermont",      regulator: "Vermont Department of Financial Regulation",                          licenseNumber: "LL-65328" },
  { code: "WA", name: "Washington",   regulator: "Washington State Department of Financial Institutions",               licenseNumber: "CL-65328" },
];

/** Cliffco's stated priority growth/marketing territories. */
export const PRIORITY_STATES = ["NY", "NJ", "AZ", "MN", "FL"] as const;
export type PriorityState = (typeof PRIORITY_STATES)[number];

export const isLicensedIn = (code: string): boolean =>
  STATE_LICENSES.some((s) => s.code === code);

export const licensedStateCodes = (): string[] =>
  STATE_LICENSES.map((s) => s.code);

export const licensedStateNames = (): string[] =>
  STATE_LICENSES.map((s) => s.name);
