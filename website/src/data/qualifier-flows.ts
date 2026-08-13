/**
 * Intent-specific qualifier flows for the Better.com-style guided pre-approval.
 * Each flow is a linear list of question steps; the Qualifier component appends
 * the contact-intake step and submits everything to /api/lead.
 *
 * Add/edit/reorder questions here - no component changes needed.
 */
import { STATE_LICENSES } from "./state-licenses";

export type QOption = { value: string; label: string };
export type QStep =
  | { id: string; type: "cards"; title: string; subtitle?: string; cols?: 2 | 3; options: QOption[] }
  | { id: string; type: "select"; title: string; subtitle?: string; placeholder: string; options: QOption[] };

export type Flow = {
  key: string;
  /** short label used in the intent picker + form_source */
  label: string;
  /** headline shown above the wizard */
  heading: string;
  steps: QStep[];
};

const STATE_OPTIONS: QOption[] = [...STATE_LICENSES]
  .map((s) => ({ value: s.name, label: s.name }))
  .sort((a, b) => a.label.localeCompare(b.label));

// ── Shared option sets ──────────────────────────────────────────────
const PROPERTY_TYPE: QOption[] = [
  { value: "Single-family", label: "Single-family home" },
  { value: "Condo/Co-op", label: "Condo or co-op" },
  { value: "Townhouse", label: "Townhouse" },
  { value: "Multi-family", label: "Multi-family (2-4 units)" },
];
const PROPERTY_USE: QOption[] = [
  { value: "Primary residence", label: "Primary residence" },
  { value: "Second home", label: "Second home" },
  { value: "Investment", label: "Investment property" },
];
const CREDIT: QOption[] = [
  { value: "Excellent (740+)", label: "Excellent (740+)" },
  { value: "Good (680-739)", label: "Good (680-739)" },
  { value: "Fair (620-679)", label: "Fair (620-679)" },
  { value: "Below 620", label: "Below 620" },
  { value: "Not sure", label: "Not sure" },
];
const INCOME: QOption[] = [
  { value: "W-2 employee", label: "W-2 employee" },
  { value: "Self-employed", label: "Self-employed" },
  { value: "1099 contractor", label: "1099 contractor" },
  { value: "Retired", label: "Retired" },
  { value: "Other", label: "Other" },
];
const HOME_VALUE: QOption[] = [
  { value: "Under $300k", label: "Under $300,000" },
  { value: "$300k-$600k", label: "$300,000 - $600,000" },
  { value: "$600k-$900k", label: "$600,000 - $900,000" },
  { value: "$900k-$1.2M", label: "$900,000 - $1.2M" },
  { value: "Over $1.2M", label: "Over $1.2M" },
];
const MORTGAGE_BALANCE: QOption[] = [
  { value: "Under $150k", label: "Under $150,000" },
  { value: "$150k-$350k", label: "$150,000 - $350,000" },
  { value: "$350k-$600k", label: "$350,000 - $600,000" },
  { value: "Over $600k", label: "Over $600,000" },
  { value: "Not sure", label: "Not sure" },
];

const stateStep = (title: string): QStep => ({
  id: "state", type: "select", title, placeholder: "Select a state", options: STATE_OPTIONS,
});
const creditStep: QStep = { id: "credit_range", type: "cards", title: "What's your estimated credit score?", options: CREDIT };
const incomeStep: QStep = { id: "income_type", type: "cards", title: "How do you earn your income?", subtitle: "This helps us match you to the right loan. Non-traditional income is our specialty.", options: INCOME };
const useStep: QStep = { id: "property_use", type: "cards", title: "How will the property be used?", options: PROPERTY_USE };

// ── Flows ───────────────────────────────────────────────────────────
export const FLOWS: Record<string, Flow> = {
  buy: {
    key: "buy",
    label: "Buy a Home",
    heading: "Let's find your path to buying a home.",
    steps: [
      stateStep("What state are you buying in?"),
      { id: "stage", type: "cards", title: "Where are you in the process?", options: [
        { value: "Just exploring", label: "Just exploring" },
        { value: "Actively shopping", label: "Actively shopping" },
        { value: "Making offers", label: "Making offers" },
        { value: "Under contract", label: "Under contract" },
      ]},
      { id: "property_type", type: "cards", title: "What type of home?", options: PROPERTY_TYPE },
      useStep,
      { id: "price_range", type: "cards", title: "Estimated purchase price?", options: [
        { value: "Under $250k", label: "Under $250,000" },
        { value: "$250k-$500k", label: "$250,000 - $500,000" },
        { value: "$500k-$750k", label: "$500,000 - $750,000" },
        { value: "$750k-$1M", label: "$750,000 - $1M" },
        { value: "Over $1M", label: "Over $1M" },
        { value: "Not sure", label: "Not sure yet" },
      ]},
      { id: "down_payment", type: "cards", title: "How much are you planning to put down?", options: [
        { value: "Under 5%", label: "Under 5%" },
        { value: "5-10%", label: "5 - 10%" },
        { value: "10-20%", label: "10 - 20%" },
        { value: "20%+", label: "20% or more" },
        { value: "Not sure", label: "Not sure" },
      ]},
      { id: "first_time", type: "cards", cols: 2, title: "Are you a first-time homebuyer?", options: [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" },
      ]},
      creditStep,
      incomeStep,
    ],
  },

  refinance: {
    key: "refinance",
    label: "Refinance My Mortgage",
    heading: "Let's see what refinancing could do for you.",
    steps: [
      stateStep("What state is the property in?"),
      { id: "purpose", type: "cards", title: "What's your main goal?", options: [
        { value: "Lower my rate or payment", label: "Lower my rate or payment" },
        { value: "Take cash out", label: "Take cash out" },
        { value: "Remove mortgage insurance", label: "Remove mortgage insurance" },
        { value: "Shorten my term", label: "Shorten my term" },
        { value: "Consolidate debt", label: "Consolidate debt" },
      ]},
      { id: "property_type", type: "cards", title: "What type of property?", options: PROPERTY_TYPE },
      useStep,
      { id: "home_value", type: "cards", title: "Estimated home value?", options: HOME_VALUE },
      { id: "mortgage_balance", type: "cards", title: "How much do you owe on your mortgage?", options: MORTGAGE_BALANCE },
      creditStep,
      incomeStep,
    ],
  },

  "cash-out": {
    key: "cash-out",
    label: "Get Cash from My Home",
    heading: "Let's turn your home equity into cash.",
    steps: [
      stateStep("What state is the property in?"),
      { id: "home_value", type: "cards", title: "Estimated home value?", options: HOME_VALUE },
      { id: "mortgage_balance", type: "cards", title: "How much do you owe on your mortgage?", options: MORTGAGE_BALANCE },
      { id: "cash_amount", type: "cards", title: "How much cash are you looking for?", options: [
        { value: "Under $25k", label: "Under $25,000" },
        { value: "$25k-$50k", label: "$25,000 - $50,000" },
        { value: "$50k-$100k", label: "$50,000 - $100,000" },
        { value: "$100k+", label: "$100,000 or more" },
        { value: "Not sure", label: "Not sure" },
      ]},
      { id: "cash_purpose", type: "cards", title: "What's the cash for?", options: [
        { value: "Home improvement", label: "Home improvement" },
        { value: "Debt consolidation", label: "Debt consolidation" },
        { value: "Investment", label: "Investment" },
        { value: "Major expense", label: "Major expense" },
        { value: "Other", label: "Other" },
      ]},
      useStep,
      creditStep,
      incomeStep,
    ],
  },
};

export const INTENT_OPTIONS = [
  { key: "buy", label: "Buy a home", description: "Purchase a new primary home, second home, or investment property." },
  { key: "refinance", label: "Refinance my mortgage", description: "Lower your rate or payment, or change your loan terms." },
  { key: "cash-out", label: "Get cash from my home", description: "Tap your home equity for cash you can use." },
];
