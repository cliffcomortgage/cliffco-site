/**
 * Operations leadership (non-LO roles).
 * Rendered on /about/ alongside the senior LO leadership.
 *
 * Source: brand/Leadership Bios.docx (filtered for currency — outdated titles
 * are omitted until the user reconfirms; see memory/project_cliffco_personnel_updates.md).
 */

export type LeaderRole = {
  /** URL slug; matches /public/team/{slug}.{avif,webp,jpg} when hasPhoto */
  slug: string;
  name: string;
  title: string;
  bio: string;
  hasPhoto?: boolean;
  /** Optional outbound LinkedIn for sameAs */
  linkedin?: string;
};

export const LEADERSHIP_TEAM: readonly LeaderRole[] = [
  {
    slug: "samantha-cardinal",
    name: "Samantha Cardinal",
    title: "Mortgage Operations Leader",
    bio:
      "Samantha brings over two decades in the mortgage industry, having worked across origination, " +
      "underwriting, processing, funding, and management. She combines deep operational expertise with " +
      "strong technology fluency — a fit for the way Cliffco's underwriting and tech stack actually run.",
    hasPhoto: true,
  },
  {
    slug: "kathleen-lovece",
    name: "Kathleen (Kathy) Lovece",
    title: "Director of Compliance",
    bio:
      "Kathy has been in the mortgage industry for over 35 years, with the last 20 focused on state and " +
      "federal compliance. She is past President of the Empire State Mortgage Bankers Association (2018–2023) " +
      "and an active volunteer with Bethany House of Nassau County.",
    hasPhoto: true,
  },
  {
    slug: "sivon-collinge",
    name: "Sivon Collinge",
    title: "Brand & Marketing",
    bio:
      "Sivon brings 10+ years in marketing and branding, including 3+ years scaling creative teams within " +
      "the mortgage industry. She specializes in brand strategy, design, and the kind of content production " +
      "that supports Cliffco's print, digital, social, and video presence.",
    hasPhoto: true,
  },
];
