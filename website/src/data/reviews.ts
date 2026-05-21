/**
 * Review platform data for /reviews/.
 * Update counts quarterly — they grow fast on Experience.com and Zillow.
 * Last verified: May 2026.
 */

export type ReviewPlatform = {
  name: string;
  /** Numeric rating out of 5, or null for non-numeric (BBB) */
  rating: number | null;
  /** Human-readable rating display */
  ratingDisplay: string;
  /** Approximate review count; 0 = not shown */
  reviewCount: number;
  /** Link to the reviews listing page */
  url: string;
  /** Direct link to leave a review, if available */
  writeUrl?: string;
  /** Short note shown under the card */
  note?: string;
};

export const REVIEW_PLATFORMS: readonly ReviewPlatform[] = [
  {
    name: "Experience.com",
    rating: 4.9,
    ratingDisplay: "4.9 / 5",
    reviewCount: 3617,
    url: "https://www.experience.com/reviews/company/cliffco-mortgage-bankers-93043",
    writeUrl: "https://www.experience.com/reviews/company/cliffco-mortgage-bankers-93043",
    note: "Verified mortgage borrower reviews",
  },
  {
    name: "WalletHub",
    rating: 4.9,
    ratingDisplay: "4.9 / 5",
    reviewCount: 1010,
    url: "https://wallethub.com/profile/cliffco-mortgage-bankers-75825327i",
    writeUrl: "https://wallethub.com/profile/cliffco-mortgage-bankers-75825327i",
    note: "Independent financial services reviews",
  },
  {
    name: "Zillow",
    rating: 5.0,
    ratingDisplay: "5.0 / 5",
    reviewCount: 1000,
    url: "https://www.zillow.com/lender-profile/cliffcomortgagebankers/",
    writeUrl: "https://www.zillow.com/lender-profile/cliffcomortgagebankers/",
    note: "Real estate platform lender ratings",
  },
  {
    name: "Google",
    rating: 4.9,
    ratingDisplay: "4.9 / 5",
    reviewCount: 0,
    url: "https://www.google.com/maps/search/Cliffco+Mortgage+Bankers+Uniondale+NY/",
    writeUrl: "https://www.google.com/maps/search/Cliffco+Mortgage+Bankers+Uniondale+NY/",
    note: "Google Business Profile rating",
  },
  {
    name: "Facebook",
    rating: 5.0,
    ratingDisplay: "5.0 / 5",
    reviewCount: 0,
    url: "https://www.facebook.com/cliffcomortgage/reviews",
    writeUrl: "https://www.facebook.com/cliffcomortgage/reviews",
    note: "Facebook page recommendations",
  },
  {
    name: "BBB",
    rating: null,
    ratingDisplay: "A+",
    reviewCount: 0,
    url: "https://www.bbb.org/us/ny/uniondale/profile/mortgage-banker/cliffco-mortgage-bankers-0121-18521",
    note: "Better Business Bureau rating",
  },
  {
    name: "Yelp",
    rating: null,
    ratingDisplay: "",
    reviewCount: 19,
    url: "https://www.yelp.com/biz/cliffco-mortgage-bankers-uniondale",
    writeUrl: "https://www.yelp.com/writeareview/biz/cliffco-mortgage-bankers-uniondale",
    note: "",
  },
];

export type FeaturedReview = {
  quote: string;
  author: string;
  platform: string;
};

export const FEATURED_REVIEWS: readonly FeaturedReview[] = [
  {
    quote: "Lisa and her team were an absolute pleasure to work with! As first-time homeowners, they made the entire process feel seamless and took away so much of the stress and uncertainty.",
    author: "First-time homeowner",
    platform: "Experience.com",
  },
  {
    quote: "David was incredible. He helped us with our home purchase from start to finish and was available to speak with us around the clock answering any and all questions!",
    author: "Verified borrower",
    platform: "Experience.com",
  },
  {
    quote: "They were the people who supported me throughout this significant life experience, and they were always on top of every step of the process.",
    author: "Verified borrower",
    platform: "Experience.com",
  },
];
