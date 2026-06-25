export type LeaderRole = {
  slug: string;
  name: string;
  title: string;
  bio?: string;
  hasPhoto?: boolean;
  linkedin?: string;
};

export const LEADERSHIP_TEAM: readonly LeaderRole[] = [
  {
    slug: "dan-humphrey",
    name: "Dan Humphrey",
    title: "Chief Financial Officer",
    hasPhoto: true,
  },
  {
    slug: "atrion-faiola",
    name: "Atrion Faiola",
    title: "Chief Technology Officer",
    hasPhoto: true,
  },
  {
    slug: "sivon-collinge",
    name: "Sivon Collinge",
    title: "Chief Marketing Officer",
    hasPhoto: true,
  },
  {
    slug: "rafe-tangorra",
    name: "Rafe Tangorra",
    title: "Chief of Media",
    hasPhoto: true,
  },
  {
    slug: "phil-mcgoldrick",
    name: "Phil McGoldrick",
    title: "VP of Capital Markets",
    hasPhoto: true,
  },
  {
    slug: "amanda-miller",
    name: "Amanda Miller",
    title: "Director of Human Resources",
    hasPhoto: true,
  },
  {
    slug: "kathleen-lovece",
    name: "Kathleen Lovece",
    title: "Director of Compliance",
    hasPhoto: true,
  },
  {
    slug: "antonio-baines",
    name: "Antonio Baines",
    title: "Operations Manager",
    hasPhoto: true,
  },
  {
    slug: "samantha-cardinal",
    name: "Samantha Cardinal",
    title: "Operations Manager",
    hasPhoto: true,
  },
  {
    slug: "michele-sclafani",
    name: "Michele Sclafani",
    title: "Assistant VP Closing",
  },
  {
    slug: "paul-jacobs",
    name: "Paul Jacobs",
    title: "VP of Quality Control",
  },
];
