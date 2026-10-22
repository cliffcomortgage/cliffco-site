/**
 * Recruiting facts for /careers/.
 *
 * Source: Recruiting Documents/Cliffco_Recruiting_Guide_2026.pdf, the 2026 guide.
 * Figures in it are stated as of October 2026. Anything with a year attached is a closed
 * annual number; anything else is a point-in-time figure and will go stale, so check it
 * against a newer guide before quoting it in a new place.
 *
 * The licensed-state count is deliberately absent here. Site copy reads it from
 * STATE_LICENSES.length (see CLAUDE.md) because a hardcoded count is how "32" went stale.
 */

/** Closed production, from the guide's growth page. */
export const PRODUCTION = [
  { year: "2023", volume: "$421M", units: 876 },
  { year: "2024", volume: "$708M", units: 1278 },
  { year: "2025", volume: "$753M", units: 1348 },
] as const;

/** Headline growth figures. */
export const GROWTH = {
  /** Closed volume 2023 -> 2025. */
  volumeGrowth: "+79%",
  /** Average year-over-year growth for individual loan officers, 2025 to 2026.
   *  The guide compares 1 Jan - 15 Oct 2026 against the same period in 2025. */
  loGrowth: "+13–17%",
  /** Team members at year end, 2022 -> 2025. */
  team: [
    { year: "2022", count: 121 },
    { year: "2023", count: 149 },
    { year: "2024", count: 175 },
    { year: "2025", count: 183 },
  ],
  /** Licensed states at year end. The current figure comes from STATE_LICENSES, not here. */
  statesByYear: [
    { year: "2022", count: 8 },
    { year: "2023", count: 23 },
    { year: "2024", count: 28 },
    { year: "2025", count: 32 },
  ],
} as const;

/** Review standing, as of October 2026. */
export const REPUTATION = {
  average: "4.9",
  totalReviews: "4,636+",
  platforms: [
    { name: "Experience.com", detail: "3,617+ reviews" },
    { name: "Zillow", detail: "1,000+ reviews" },
    { name: "Google", detail: "Business Profile" },
    { name: "BBB", detail: "A+ rated" },
  ],
} as const;

/** Share of closed volume by product. Useful to a recruit judging whether the Non-QM
 *  pitch is real or decorative - a third of the book says it is. */
export const PRODUCT_MIX = [
  { name: "Conventional", share: "51.1%" },
  { name: "Non-QM", share: "34.4%" },
  { name: "FHA & VA", share: "11.3%" },
  { name: "HELOC / 2nd lien", share: "2.1%" },
  { name: "Reverse", share: "1.0%" },
] as const;

/** The guide's "support that protects your time" page. These are the operational
 *  differentiators a producing LO actually asks about. */
export const SUPPORT = [
  {
    title: "Underwriting in-house",
    desc: "Your files stay with a team that knows our programs and processes, rather than being passed to an outside party.",
  },
  {
    title: "Operations on call",
    desc: "Our operations team will jump on a call when you're working a tricky condition or want a second set of eyes on a file.",
  },
  {
    title: "Onboarding you can return to",
    desc: "The Cliffco Circle is a self-paced onboarding course covering our tools, products, and process. It stays available long after your first few weeks, so you can revisit the harder topics whenever you need to.",
  },
  {
    title: "An open door through ownership",
    desc: "Our open-door policy runs through senior leadership and ownership. Ideas from the team shape how we operate, and what works gets shared across the company rather than kept in one branch.",
  },
] as const;

/** Benefits, grouped rather than itemised. The guide lists each plan; a careers page only
 *  needs to show the package is real and say where the detail lives. */
export const BENEFITS = [
  { title: "Health", desc: "Medical with FSA and HSA options, dental, and vision coverage for you and your family." },
  { title: "Income protection", desc: "Short-term and long-term disability, plus $10,000 of basic life insurance at no cost to you, with the option to add more." },
  { title: "Extra protection", desc: "Accident insurance, critical illness, hospital indemnity, identity theft protection, and a legal plan." },
  { title: "Everyday support", desc: "Through our partnership with PrestigePEO: financial coaching through FinFit, pet insurance, auto and home savings, pre-tax commuter benefits, and caregiving support." },
] as const;

/** Names that have spoken at Cliffco mentorship and mindset sessions. */
export const SPEAKERS = [
  "Grant Cardone", "Tim Grover", "Brandon Steiner", "Brad Lea",
  "Rene Rodriguez", "Michael Burt", "Jason Mitchell", "Tyler Norton", "Dan Clark",
] as const;
