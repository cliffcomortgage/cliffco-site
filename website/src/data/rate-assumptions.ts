/**
 * Illustrative rate assumptions for the calculators.
 *
 * Every calculator used to hardcode its own starting rate, and they disagreed: 6.5, 6.75,
 * 7.0, 7.25 and 7.5 all appeared on the site at once. Compliance review flagged it
 * (2026-11-03). They now all read from here, so the site quotes one set of numbers and a
 * single edit moves them everywhere.
 *
 * These are NOT live rates. Cliffco has no licensed rate feed wired into the site, and a
 * number that drifts out of date is worse than one that is plainly labelled, so every
 * calculator that uses these also prints `asOfLabel` next to its result.
 *
 * To update: change the numbers and `asOf` together, and nothing else. Compliance should
 * sign off on the values the same way they would on any published rate illustration.
 */

export const RATE_ASSUMPTIONS = {
  /** The date these illustrative rates were last reviewed. Shown to the user. */
  asOf: "2026-11-03",
  asOfLabel: "November 3, 2026",

  /** 30-year fixed, conventional, owner-occupied, strong credit. */
  conventional30: 7.0,

  /** 30-year fixed VA. Typically prices below conventional. */
  va30: 6.75,

  /** 30-year fixed DSCR / investor. Prices above owner-occupied paper. */
  dscr30: 7.5,

  /**
   * HECM "expected average mortgage interest rate" - the figure HUD's principal limit factor
   * table is keyed to, alongside the borrower's age. On an adjustable HECM it is the 10-year
   * CMT plus the lender's margin; on a fixed HECM it is the note rate. With the 10-year CMT
   * near 5% and margins commonly 1.5-2.75 points, 7% sits mid-range. Needs the same sign-off
   * as every other figure here, and it moves proceeds a lot: a point costs an age-68 borrower
   * about four points of principal limit factor.
   */
  hecmExpected: 7.0,
} as const;

/** The sentence every calculator appends to its fine print. */
export const RATE_DISCLOSURE =
  `Rates shown are illustrative assumptions as of ${RATE_ASSUMPTIONS.asOfLabel}, not a quote ` +
  `and not a rate lock. Your rate depends on credit, down payment, loan type, property, and ` +
  `lock period, and changes daily.`;
