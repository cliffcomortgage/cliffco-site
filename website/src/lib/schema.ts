/**
 * JSON-LD generators — one helper per schema.org type Cliffco uses.
 *
 * Spec basis: schema.org primary docs + the strategy in
 * /seo-aeo-research/01-technical-seo.md §5.
 *
 * Every generator returns a plain object — wrap in <JsonLd data={...}/>.
 */

import { COMPANY, SITE_URL } from "../data/company";
import { STATE_LICENSES } from "../data/state-licenses";
import {
  loanOfficer,
  type LoanOfficer,
  nmlsConsumerAccessUrl,
} from "../data/loan-officers";
import type { Branch } from "../data/branches";
import type { Product } from "../data/products";

const orgId = `${SITE_URL}/#organization`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "FinancialService"],
  "@id": orgId,
  name: COMPANY.brandName,
  legalName: COMPANY.legalName,
  alternateName: ["Cliffco", "Cliffco Mortgage"],
  url: SITE_URL,
  logo: `${SITE_URL}/brand/full-logo.svg`,
  foundingDate: String(COMPANY.founded),
  telephone: COMPANY.hq.phoneE164,
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.hq.street,
    addressLocality: COMPANY.hq.city,
    addressRegion: COMPANY.hq.region,
    postalCode: COMPANY.hq.postalCode,
    addressCountry: COMPANY.hq.country,
  },
  areaServed: STATE_LICENSES.map((s) => ({
    "@type": "State",
    name: s.name,
  })),
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NMLS",
    value: COMPANY.nmls,
  },
  sameAs: [
    COMPANY.nmlsConsumerAccessUrl,
    COMPANY.socials.linkedin,
    COMPANY.socials.facebook,
    COMPANY.socials.instagram,
  ],
});

export const localBusinessSchema = (branch: Branch) => ({
  "@context": "https://schema.org",
  "@type": "MortgageContractor",
  "@id": `${SITE_URL}/locations/${branch.slug}#localbusiness`,
  name: `${COMPANY.brandName} — ${branch.name}`,
  parentOrganization: { "@id": orgId },
  telephone: branch.phone ?? COMPANY.hq.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: branch.street ?? undefined,
    addressLocality: branch.city,
    addressRegion: branch.region,
    postalCode: branch.postalCode ?? undefined,
    addressCountry: branch.country,
  },
  geo: branch.geo
    ? { "@type": "GeoCoordinates", ...branch.geo }
    : undefined,
  areaServed: branch.metro ?? branch.region,
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NMLS",
    value: COMPANY.nmls,
  },
});

export const personSchema = (lo: LoanOfficer) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/loan-officers/${lo.slug}#person`,
  name: lo.displayName,
  jobTitle: lo.title,
  worksFor: { "@id": orgId },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "NMLS",
    value: lo.nmls,
  },
  sameAs: [nmlsConsumerAccessUrl(lo.nmls), lo.links?.linkedin].filter(Boolean),
  knowsLanguage: lo.languages,
  knowsAbout: lo.specialties,
  areaServed: lo.states.map((code) => ({ "@type": "State", name: code })),
});

export const mortgageLoanSchema = (
  product: Product,
  opts?: {
    state?: string;
    rateRange?: { min: number; max: number };
    amountRange?: { min: number; max: number };
  },
) => ({
  "@context": "https://schema.org",
  "@type": "MortgageLoan",
  name: product.name,
  description: product.directAnswer,
  provider: { "@id": orgId },
  loanType: product.loanType,
  ...(opts?.amountRange && {
    amount: {
      "@type": "MonetaryAmount",
      currency: "USD",
      minValue: opts.amountRange.min,
      maxValue: opts.amountRange.max,
    },
  }),
  ...(opts?.rateRange && {
    interestRate: {
      "@type": "QuantitativeValue",
      minValue: opts.rateRange.min,
      maxValue: opts.rateRange.max,
      unitText: "PERCENT",
    },
  }),
  ...(opts?.state && { areaServed: { "@type": "State", name: opts.state } }),
});

export const breadcrumbSchema = (
  items: { name: string; url: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
  })),
});

export const faqPageSchema = (
  qa: { question: string; answer: string }[],
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: qa.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export const articleSchema = (opts: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorSlug: string;
  image?: string;
}) => {
  const author = loanOfficer(opts.authorSlug);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: opts.url,
    image: opts.image ?? `${SITE_URL}/brand/og-default.png`,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    publisher: { "@id": orgId },
    ...(author && { author: personSchema(author) }),
  };
};

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: COMPANY.brandName,
  publisher: { "@id": orgId },
  inLanguage: "en-US",
});
