/**
 * Trigger-term disclaimers.
 *
 * Stating a down payment in advertising is a trigger term, so the page carrying it has to
 * show the worked example behind it. The eight scenarios and their wording come from
 * `compliance/Trigger Terms Disclaimers (2).xlsx` and are reproduced here VERBATIM - the
 * figures inside them are fixed examples, not live rates, and must not be edited or
 * recalculated. This file is generated from that spreadsheet; if compliance reissues it,
 * regenerate rather than hand-edit.
 *
 * `TRIGGER_ROUTES` maps each page that states one of these figures to the scenarios it
 * states. It is derived by scanning the BUILT html, because figures reach pages through
 * shared data modules and components, so the source does not tell you which pages display
 * them. `scripts/verify-trigger-disclaimers.cjs` rederives it and fails if this file has
 * drifted, so adding a down payment figure to a page cannot silently go undisclosed.
 *
 * Generated 2026-11-05 from the spreadsheet. Do not hand-edit.
 */

export type TriggerScenario =
  | "VA_0"
  | "USDA_0"
  | "FHA_3_5"
  | "FHA_10"
  | "CONV_3"
  | "CONV_5"
  | "CONV_10"
  | "CONV_20";

export const TRIGGER_DISCLAIMERS: Record<TriggerScenario, { label: string; text: string }> = {
  VA_0: {
    label: "VA, 0% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 0% downpayment ($0) = base mortgage loan amount of $400,000 plus financed VA Funding Fee of $8,600 = fully financed loan amount of $408,600.00 VA 30 year fixed interest rate of 6.50% / 6.99% APR has monthly principal and interest payment of $2,583.00 . Taxes and Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  USDA_0: {
    label: "USDA, 0% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 0% downpayment ($0) = base mortgage loan amount of $400,000 plus financed USDA Guarantee Fee of $4,040 = fully financed loan amount of $404,040. USDA 30 year fixed interest rate of 6.50% / 7.18% APR has monthly principal and interest payment of $2,553.81 (based on fully financed loan amount ) plus monthly USDA monthly fee of $117.25 , making total principal, interest, and mortgage insurance monthly payment = $2,671.06. Taxes and Homeowner’s Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  FHA_3_5: {
    label: "FHA, 3.5% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 3.50% downpayment ($14,000) = base mortgage loan amount of $386,000 plus financed FHA Upfront Mortgage Insurance Premium of $6,755 = fully financed loan amount of $392,755.00. FHA 30 year fixed interest rate of 6.50% / 7.51% APR has monthly principal and interest payment of $2,440.00 (based on fully financed loan amount ) plus monthly FHA mortgage insurance premium of $176.00 , making total principal, interest, and mortgage insurance monthly payment = $2,616.00. Taxes and Homeowner’s Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  FHA_10: {
    label: "FHA, 10% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 10.00% downpayment ($40,000) = base mortgage loan amount of $360,000 plus financed FHA Upfront Mortgage Insurance Premium of $6,300 = fully financed loan amount of $366,300.00. FHA 30 year fixed interest rate of 6.50% / 7.33% APR has monthly principal and interest payment of $2,315.00 (based on fully financed loan amount ) plus monthly FHA mortgage insurance premium of $149.00 ,making total principal, interest, and mortgage insurance monthly payment = $2,465.00. Taxes and Homeowner’s Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  CONV_3: {
    label: "Conventional, 3% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 3% downpayment ($12,000) = mortgage loan amount of $388,000. Conventional 30 year fixed interest rate of 6.50% / 7.38% APR has monthly principal and interest payment of $2,452.00 . Monthly Private Mortgage Insurance payment based on 700 FICO credit score is an estimated $223.00; making total principal, interest, and mortgage insurance monthly payment of $2,676.00. Taxes and Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  CONV_5: {
    label: "Conventional, 5% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 5% downpayment ($20,000) = mortgage loan amount of $380,000. Conventional 30 year fixed interest rate of 6.50% / 7.15% APR has monthly principal and interest payment of $2,402.00 . Monthly Private Mortgage Insurance payment based on 700 FICO credit score is an estimated $162.00; making total principal, interest, and mortgage insurance monthly payment of $2,563.00. Taxes and Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  CONV_10: {
    label: "Conventional, 10% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 10% downpayment ($40,000) = mortgage loan amount of $360,000. Conventional 30 year fixed interest rate of 6.50% / 7.04% APR has monthly principal and interest payment of $2,275.00 . Monthly Private Mortgage Insurance payment based on 700 FICO credit score is an estimated $108.00; making total principal, interest, and mortgage insurance monthly payment of $2,383.00. Taxes and Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
  CONV_20: {
    label: "Conventional, 20% down",
    text:
      "This example is for illustrative purposes only. Purchase transaction with $400,000 sales price and 20% downpayment ($80,000) = mortgage loan amount of $320,000. Conventional 30 year fixed interest rate of 6.50% / 6.783% APR has monthly principal and interest payment of $2023.00 . Taxes and Insurance are not included: adding them will increase the actual payment. Certain state and county loan amount limits may apply. Interest rates shown are subject to change without notice.",
  },
};

/** Display order, so a page listing several reads consistently. */
export const TRIGGER_ORDER: readonly TriggerScenario[] = [
  "VA_0",
  "USDA_0",
  "FHA_3_5",
  "FHA_10",
  "CONV_3",
  "CONV_5",
  "CONV_10",
  "CONV_20",
];

/** Route (with trailing slash) -> the scenarios that route states. */
export const TRIGGER_ROUTES: Record<string, readonly TriggerScenario[]> = {
  "/down-payment-assistance/": ["VA_0"],
  "/fha-203k-loan/": ["FHA_3_5"],
  "/first-time-homebuyer/": ["CONV_3", "FHA_10", "FHA_3_5", "VA_0"],
  "/homestyle-choicerenovation-loan/": ["CONV_10", "FHA_10"],
  "/loans/": ["CONV_3", "FHA_3_5", "USDA_0", "VA_0"],
  "/loans/conventional-government/": ["CONV_10", "CONV_20", "FHA_10", "FHA_3_5", "USDA_0", "VA_0"],
  "/loans/conventional/": ["CONV_10", "CONV_20", "CONV_3", "CONV_5", "FHA_10"],
  "/loans/fha/": ["CONV_10", "CONV_20", "FHA_10", "FHA_3_5"],
  "/loans/non-qm-self-employed/": ["CONV_10", "FHA_10"],
  "/loans/renovation/": ["FHA_3_5", "VA_0"],
  "/loans/usda/": ["USDA_0"],
  "/loans/va/": ["CONV_10", "CONV_5", "VA_0"],
  "/locations/arizona/": ["VA_0"],
  "/locations/florida/": ["VA_0"],
  "/locations/florida/fort-lauderdale/": ["VA_0"],
  "/locations/minnesota/": ["VA_0"],
  "/locations/new-jersey/": ["VA_0"],
  "/locations/new-york/": ["VA_0"],
  "/locations/new-york/long-island/": ["VA_0"],
  "/mortgage-guides/blog/down-payment-assistance-programs-first-time-homebuyers/": ["CONV_20"],
  "/mortgage-guides/blog/how-does-a-va-loan-work/": ["CONV_20", "VA_0"],
  "/mortgage-guides/blog/surviving-spouse-va-loan-eligibility/": ["VA_0"],
  "/mortgage-guides/blog/va-disability-income-mortgage-qualification/": ["VA_0"],
  "/mortgage-guides/blog/va-loan-active-duty-pcs-occupancy-requirement/": ["VA_0"],
  "/mortgage-guides/blog/va-loan-entitlement-explained/": ["VA_0"],
  "/mortgage-guides/calculators/affordability/": ["CONV_20"],
  "/mortgage-guides/calculators/budget-builder/": ["CONV_20"],
  "/mortgage-guides/calculators/mortgage-readiness/": ["CONV_5", "FHA_3_5"],
  "/mortgage-guides/calculators/payment-estimator/": ["CONV_20"],
  "/mortgage-guides/calculators/rent-vs-buy/": ["CONV_10"],
  "/mortgage-guides/calculators/va-loan/": ["CONV_20", "CONV_5", "VA_0"],
  "/mortgage-guides/down-payment-assistance-programs/": ["CONV_20", "CONV_3"],
  "/mortgage-guides/glossary/": ["CONV_3", "FHA_3_5", "VA_0"],
  "/mortgage-guides/non-qm-loans-guide/": ["CONV_20"],
  "/mortgage-guides/what-is-an-investment-mortgage/": ["CONV_20", "FHA_3_5"],
  "/mortgage-rates/": ["CONV_20", "FHA_3_5"],
  "/purchasing-refinancing/": ["CONV_20", "CONV_5", "FHA_3_5", "VA_0"],
  "/self-employed-mortgage/": ["CONV_20"],
  "/team-zambelli/": ["CONV_3", "CONV_5", "FHA_3_5", "VA_0"],
  "/va-renovation-loan/": ["VA_0"],
  "/why-cliffco/": ["CONV_3"],
};

/** The scenarios a given path must disclose, in display order. */
export function triggerScenariosFor(pathname: string): TriggerScenario[] {
  const key = pathname.endsWith("/") ? pathname : pathname + "/";
  const found = TRIGGER_ROUTES[key];
  if (!found) return [];
  return TRIGGER_ORDER.filter((s) => found.includes(s));
}
