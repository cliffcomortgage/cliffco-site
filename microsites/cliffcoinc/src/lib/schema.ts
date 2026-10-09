/**
 * Structured data for the Alaska site.
 *
 * BRANDING RULE (same as Layout.astro): this site must never present itself as
 * "Cliffco Mortgage Bankers". Alaska licensing requires the Cliffco, Inc. name, so the
 * schema uses that name and omits the brandName alternates the main site carries.
 *
 * Mirrors website/src/lib/schema.ts in shape so the two sites describe the same entity
 * consistently, with areaServed narrowed to Alaska and the AK license numbers included.
 */

export const SITE_URL = "https://cliffcoinc.com";
const orgId = `${SITE_URL}/#organization`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "FinancialService"],
  "@id": orgId,
  name: "Cliffco, Inc.",
  legalName: "Cliffco, Inc.",
  url: SITE_URL,
  logo: `${SITE_URL}/cliffco-logo.png`,
  image: `${SITE_URL}/hero-anchorage.webp`,
  description:
    "Cliffco, Inc. is a licensed Alaska mortgage lender (AK65328) making home loans across " +
    "the state since 1989. VA, conventional, FHA, self-employed and investor programs, with a " +
    "licensed loan officer on the phone rather than a call center.",
  knowsAbout: [
    "VA loans",
    "Conventional loans",
    "FHA loans",
    "Home purchase loans",
    "Mortgage refinancing",
    "Bank statement loans",
    "Self-employed mortgages",
    "DSCR loans",
  ],
  foundingDate: "1989",
  telephone: "+15164087300",
  address: {
    "@type": "PostalAddress",
    streetAddress: "70 Charles Lindbergh Blvd, Suite 200",
    addressLocality: "Uniondale",
    addressRegion: "NY",
    postalCode: "11553",
    addressCountry: "US",
  },
  areaServed: {
    "@type": "State",
    name: "Alaska",
  },
  // The company record and the Alaska licence, both independently verifiable.
  identifier: [
    { "@type": "PropertyValue", name: "NMLS ID", value: "65328" },
    { "@type": "PropertyValue", name: "Alaska Lender License", value: "AK65328" },
  ],
  sameAs: ["https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/65328"],
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Cliffco, Inc. — Alaska Mortgage Lending",
  publisher: { "@id": orgId },
  inLanguage: "en-US",
});

/** Breadcrumbs for the inner pages. `trail` is ordered root-first. */
export const breadcrumbSchema = (trail: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: new URL(t.href, SITE_URL).toString(),
  })),
});
