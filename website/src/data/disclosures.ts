/**
 * Reusable compliance disclosure blocks.
 * Source: /compliance/disclosures.md.
 *
 * FOOTER_MAIN_DISCLOSURE and FOOTER_TEXAS_DISCLOSURE are the verbatim
 * compliance-approved strings for the site footer. Do not auto-generate
 * these - update them only when Cliffco's compliance team provides new text.
 *
 * The dynamic helpers below are still used for LO bio pages.
 */

import { COMPANY } from "./company";
import { STATE_LICENSES, type StateLicense } from "./state-licenses";

export const FOOTER_MAIN_DISCLOSURE =
  "Cliffco, Inc. is not affiliated with or acting on behalf of the FHA or any government entity. Equal Housing Lender. Cliffco, Inc. Corporate NMLS#65328 (www.nmlsconsumeraccess.org) 70 Charles Lindbergh Blvd, Suite 200, Uniondale, NY 11553 (516) 408-7300. Licensed Mortgage Lender by AK Division of Banking and Securities AK65328, AK65328-1; AL Mortgage Broker/Lender License #23581; AZ Mortgage Banker License 1045708; CA DFPI Financing Law License 60DBO-181882; CO Dept. of Regulatory Agencies Division of Banking; CT Department of Banking MCL-65328; DC Department of Insurance, Securities, & Banking MLB65328; DE Office of the State Bank Commissioner 040096; FL Office of Financial Regulation MLD1245; GA Department of Banking & Finance 65328; IL Department of Financial & Professional Regulation MB.6761824; IN Indiana Department of Financial Institutions 70581; KS State Bank Commissioner of Kansas MC.0026625; KY Department of Financial Institutions MC838985; LA Office of Financial Institutions 65328; MA Mortgage Broker and Mortgage Lender License MC65328 MA Division of Banks; MD Office of Financial Regulation; MN Department of Commerce #MN-MO-65328; NC Commissioner of Banks L-211081; NJ Department of Banking & Insurance; NM New Mexico Regulation & Licensing Dept.; Licensed Mortgage Banker by the NYS Department of Financial Services LMBC109800; OH Department of Commerce Residential Mortgage Lending Act RM.805200.000; OR Oregon Department of Consumer and Business Services 65328; PA Department of Banking & Securities 45275; SC State Board of Financial Institutions MLS-65328; TN Department of Financial Institutions Mortgage License 65328; TX Department of Savings & Mortgage Lending; VA Bureau of Financial Institutions MC-7742; VT Department of Financial Regulation LL-65328; WA State Department of Financial Institutions CL-65328. This is not a commitment to lend or extend credit. Restrictions may apply. All loans are subject to credit and underwriting approval. Not all loan products are available in all states. Rates may not be available at time of application. Information and/or data are subject to change without notice.";

export const FOOTER_TEXAS_DISCLOSURE =
  "CONSUMERS WISHING TO FILE A COMPLAINT AGAINST A COMPANY OR A RESIDENTIAL MORTGAGE LOAN ORIGINATOR SHOULD COMPLETE AND SEND A COMPLAINT FORM TO THE TEXAS DEPARTMENT OF SAVINGS AND MORTGAGE LENDING, 2601 NORTH LAMAR, SUITE 201, AUSTIN, TEXAS 78705. COMPLAINT FORMS AND INSTRUCTIONS MAY BE OBTAINED FROM THE DEPARTMENT'S WEBSITE AT WWW.SML.TEXAS.GOV. A TOLL-FREE CONSUMER HOTLINE IS AVAILABLE AT 1-877-276-5550. THE DEPARTMENT MAINTAINS A RECOVERY FUND TO MAKE PAYMENTS OF CERTAIN ACTUAL OUT OF POCKET DAMAGES SUSTAINED BY BORROWERS CAUSED BY ACTS OF LICENSED RESIDENTIAL MORTGAGE LOAN ORIGINATORS. A WRITTEN APPLICATION FOR REIMBURSEMENT FROM THE RECOVERY FUND MUST BE FILED WITH AND INVESTIGATED BY THE DEPARTMENT PRIOR TO THE PAYMENT OF A CLAIM. FOR MORE INFORMATION ABOUT THE RECOVERY FUND, PLEASE CONSULT THE DEPARTMENT'S WEBSITE AT WWW.SML.TEXAS.GOV";

/** Block 1 - corporate / FHA / Equal Housing. Always include. */
export const corporateDisclosure = (): string =>
  `${COMPANY.legalName} is not affiliated with or acting on behalf of the FHA or any government entity. ` +
  `Equal Housing Lender. ${COMPANY.legalName} Corporate NMLS #${COMPANY.nmls} ` +
  `(www.nmlsconsumeraccess.org) ${COMPANY.hq.street}, ${COMPANY.hq.city}, ` +
  `${COMPANY.hq.region} ${COMPANY.hq.postalCode} · ${COMPANY.hq.phone}.`;

/** Block 2 - Florida DBA. Include on any FL-targeted material. */
export const floridaDbaDisclosure = (): string =>
  COMPANY.floridaDba.disclosure;

/** Block 3 - standard restrictions language. Always include after license list. */
export const restrictionsDisclosure = (): string =>
  "This is not a commitment to lend or extend credit. Restrictions may apply. " +
  "All loans are subject to credit and underwriting approval. Not all loan products " +
  "are available in all states. Rates may not be available at time of application. " +
  "Information and/or data are subject to change without notice.";

/** Compose a license citation for a single state. */
const formatLicense = (s: StateLicense): string => {
  if (s.code === "FL") return floridaDbaDisclosure();
  const num = s.licenseNumber ? ` ${s.licenseNumber}` : "";
  return `${s.regulator}${num}`;
};

/**
 * Per-state license list for a given subset of state codes (or all).
 * Returns array of citations in alphabetical order by state code.
 */
export const stateLicenseCitations = (
  stateCodes?: readonly string[],
): string[] => {
  const filter = stateCodes
    ? STATE_LICENSES.filter((s) => stateCodes.includes(s.code))
    : STATE_LICENSES;
  return [...filter]
    .sort((a, b) => a.code.localeCompare(b.code))
    .map(formatLicense);
};

/**
 * Full disclosure block as one string - the standard footer disclosure.
 * Pass an LO's licensed states to get an LO-specific subset, or omit
 * for the corporate-wide disclosure.
 */
export const fullDisclosureBlock = (stateCodes?: readonly string[]): string => {
  const lines = [
    corporateDisclosure(),
    stateLicenseCitations(stateCodes).join("; ") + ".",
    restrictionsDisclosure(),
  ];
  return lines.join(" ");
};
