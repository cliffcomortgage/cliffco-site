/**
 * Reusable compliance disclosure blocks.
 * Source: /compliance/disclosures.md.
 *
 * Use these helpers to build the footer / page disclosure sections so every
 * page is consistent and any compliance update propagates automatically.
 */

import { COMPANY } from "./company";
import { STATE_LICENSES, type StateLicense } from "./state-licenses";

/** Block 1 — corporate / FHA / Equal Housing. Always include. */
export const corporateDisclosure = (): string =>
  `${COMPANY.legalName} is not affiliated with or acting on behalf of the FHA or any government entity. ` +
  `Equal Housing Lender. ${COMPANY.legalName} Corporate NMLS #${COMPANY.nmls} ` +
  `(www.nmlsconsumeraccess.org) ${COMPANY.hq.street}, ${COMPANY.hq.city}, ` +
  `${COMPANY.hq.region} ${COMPANY.hq.postalCode} · ${COMPANY.hq.phone}.`;

/** Block 2 — Florida DBA. Include on any FL-targeted material. */
export const floridaDbaDisclosure = (): string =>
  COMPANY.floridaDba.disclosure;

/** Block 3 — standard restrictions language. Always include after license list. */
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
 * Full disclosure block as one string — the standard footer disclosure.
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
