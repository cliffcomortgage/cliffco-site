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
    quote: "Josh was absolutely amazing throughout my entire mortgage process. From start to finish, he made everything easy to understand and was always there to answer my questions. Buying a home can be stressful, but Josh stayed on top of everything.",
    author: "Christian J.",
    platform: "Experience.com",
  },
  {
    quote: "Christian was both competent and incredibly affable. He made the complicated journey through loan approval both fun and seamless. He is the perfect representative!",
    author: "Emanuel E.",
    platform: "Experience.com",
  },
  {
    quote: "Adam and Leah were highly responsive and helpful through the process.",
    author: "Samuel P.",
    platform: "Experience.com",
  },
];
