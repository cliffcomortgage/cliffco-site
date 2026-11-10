/**
 * Cliffco Homebuyer Advantage Program - data for the three program pages:
 *   /homebuyer-advantage/            splash: "I'm an employee" or "I'm a company"
 *   /homebuyer-advantage/employees/  employee page + Financial Discovery Call form
 *   /homebuyer-advantage/companies/  partnership page + employer inquiry form
 *
 * Source: Homebuyer_Advantage_Landing_Page_Spec (1).md (repo root), restructured into the
 * splash + two audience pages at Sivon's request (2026-11-10). Generic for every partner: no
 * partner names or logos anywhere, and leads are attributed to a company through UTM tags on
 * the links Cliffco sends out (e.g. /homebuyer-advantage/employees/?utm_campaign=homebuyer-
 * advantage&utm_content=<company>), which the forms carry through to HubSpot. Flyers and QR
 * codes should link to /employees/ directly, so employees skip the splash.
 *
 * Terminology: always "credit" or "lender credit toward closing costs". The program must
 * never be described with the other word for free money, anywhere that renders.
 */
import { COMPANY } from "./company";

export const ADVANTAGE_PROGRAM_NAME = "Homebuyer Advantage Program";

/**
 * The program's dedicated phone line. Not assigned yet (spec open question 4), so the page
 * falls back to Cliffco's main toll-free number. When the line exists, fill this in and every
 * call button, the sticky bar and the success messages move with it.
 */
const PROGRAM_PHONE: { display: string; e164: string } | null = null;

export const ADVANTAGE_PHONE = PROGRAM_PHONE ?? {
  display: COMPANY.tollFree,
  e164: COMPANY.tollFreeE164,
};

/** The office in the landing-layout footer: HQ, not the Branchburg branch the layout defaults to. */
export const ADVANTAGE_OFFICE = {
  label: "Cliffco Mortgage Bankers · Uniondale, NY (Headquarters)",
  street: COMPANY.hq.street,
  cityLine: `${COMPANY.hq.city}, ${COMPANY.hq.region} ${COMPANY.hq.postalCode} · NMLS #${COMPANY.nmls}`,
  phone: COMPANY.hq.phone,
  phoneE164: COMPANY.hq.phoneE164,
};

/**
 * Upcoming quarterly webinars. Leave empty until dates are set: the page then hides the dates
 * block and shows the "shared through your employer" line instead. Dates are ISO (YYYY-MM-DD);
 * past sessions are dropped at build time and again in the browser, so a stale build never
 * advertises a session that already happened.
 */
export type AdvantageWebinar = {
  date: string;
  /** Display time, e.g. "12:00 PM ET" */
  time?: string;
  topic: string;
  /** Registration link, if there is one */
  registerUrl?: string;
};

export const ADVANTAGE_WEBINARS: readonly AdvantageWebinar[] = [];

export const ADVANTAGE_WEBINAR_TOPICS: readonly string[] = [
  "Getting mortgage-ready",
  "Loan programs explained",
  "Finding the right deals",
  "How to get your offer accepted",
  "The hottest towns right now",
  "Building your homebuying team",
  "Contract to closing",
  "Your first year as a homeowner",
];

/**
 * COMPLIANCE REVIEW: the approved lender credit disclaimer was written for a named partner.
 * This generic version (spec 6.1) replaces the partner-specific opening and must be approved
 * before launch. Render verbatim.
 */
export const ADVANTAGE_CREDIT_DISCLAIMER =
  "Lender credit towards closing costs is available to employees and members of participating partner organizations. May not be available in all states. No cash value. Not valid in combination with any other offers. Offer available for loan applications taken by Cliffco Mortgage Bankers; the lender credit towards closing costs will be applied at closing and the loan must close through Cliffco Mortgage Bankers. Certain restrictions apply. For qualified borrowers. All borrowers subject to credit and underwriting approval. Rates, term, and loan program may be subject to change without notice.";

/** Spec 6.2 - shown verbatim directly under the Homebuyer Certified section. */
export const ADVANTAGE_COMMITMENT_DISCLAIMER =
  "This is not a commitment to lend or extend credit. Restrictions may apply. All loans are subject to credit and underwriting approval. Not all loan products are available in all states. Rates may not be available at time of application. Information and/or data are subject to change without notice.";

/**
 * COMPLIANCE REVIEW: placeholder until compliance supplies the consent text (spec 4.3).
 * Both forms render it beside the required consent checkbox.
 */
export const ADVANTAGE_CONSENT_PLACEHOLDER = "[CONSENT LANGUAGE — needs compliance review]";

/** form_source values - the "form-type property" that separates the two lead types in HubSpot. */
export const ADVANTAGE_FORM_SOURCE = {
  employee: "homebuyer-advantage",
  employer: "homebuyer-advantage-employer",
} as const;
