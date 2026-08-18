import type { APIRoute } from "astro";
import { COMPANY, SITE_URL } from "../data/company";
import { BRANCHES } from "../data/branches";
import { STATE_LICENSES } from "../data/state-licenses";
import { LOCATIONS } from "../data/locations";
import { PRODUCTS } from "../data/products";
import { BLOG_ARTICLES } from "../data/blog-articles";
import { LOAN_OFFICERS } from "../data/loan-officers";

// Prerender to a static /llms.txt file on both build targets. Regenerated every
// build from the data files, so new loan officers, articles, and branches are
// always reflected without hand-editing.
export const prerender = true;

const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

export const GET: APIRoute = () => {
  const years = COMPANY.yearsInBusiness();
  const stateCount = STATE_LICENSES.length;
  const branchCount = BRANCHES.length;

  // Corporate guides/blog + loan-officer articles (e.g. The Fallarino Group).
  const loArticles = LOAN_OFFICERS.flatMap((lo) =>
    (lo.blog ?? []).map((post) => ({
      title: post.title,
      href: `/${post.slug}/`,
      description: post.description ?? "",
    }))
  );
  const seen = new Set<string>();
  const articles = [
    ...BLOG_ARTICLES.map((a) => ({ title: a.title, href: a.href, description: a.description })),
    ...loArticles,
  ].filter((a) => (seen.has(a.href) ? false : seen.add(a.href)));

  const lines: string[] = [];
  lines.push(`# ${COMPANY.legalName}`);
  lines.push("");
  lines.push(
    `> ${COMPANY.legalName} is a ${years}-year independent mortgage banker ` +
      `(NMLS #${COMPANY.nmls}) headquartered in Uniondale, NY. Cliffco specializes in ` +
      `Non-QM and self-employed loans, reverse mortgages, DSCR loans for real estate ` +
      `investors, and business bank statement loans. Cliffco is licensed in ${stateCount} ` +
      `states and operates ${branchCount} branches across New York, New Jersey, Arizona, ` +
      `Minnesota, and Florida. In Florida, Cliffco operates as Swish Capital, Inc.`
  );
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(`- [About Cliffco](${abs("/about/")}): history, mission, vision, values, leadership`);
  lines.push(`- [Loan Officers](${abs("/loan-officers/")}): NMLS-licensed loan officer directory`);
  lines.push(`- [State Licensing](${abs("/licensing/")}): full ${stateCount}-state license details`);
  lines.push(`- [Get Started / Pre-Approval](${abs("/get-started/")}): guided pre-approval`);
  lines.push(`- [Contact](${abs("/contact/")})`);
  lines.push(`- [NMLS Consumer Access](https://nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/${COMPANY.nmls})`);
  lines.push("");

  lines.push("## Loan Products");
  lines.push("");
  for (const p of PRODUCTS) {
    lines.push(`- [${p.name}](${abs(`/loans/${p.slug}/`)}): ${p.oneLiner}`);
  }
  lines.push(`- [All loan programs](${abs("/loans/")})`);
  lines.push("");

  lines.push("## Service Areas");
  lines.push("");
  for (const l of LOCATIONS) {
    const dba = l.isFlorida ? " — operates as Swish Capital, Inc." : "";
    lines.push(`- [${l.name}](${abs(`/locations/${l.path}/`)})${dba}`);
  }
  lines.push("");

  lines.push("## Branches (physical offices)");
  lines.push("");
  for (const b of BRANCHES) {
    const dba = b.isFloridaDba ? " — operates as Swish Capital, Inc." : "";
    const addr = b.street ? ` — ${b.street}` : "";
    lines.push(`- ${b.name}${addr}${dba}`);
  }
  lines.push("");

  lines.push("## Guides & Articles");
  lines.push("");
  lines.push(`- [Mortgage guides & blog hub](${abs("/mortgage-guides/blog/")})`);
  for (const a of articles) {
    lines.push(`- [${a.title}](${abs(a.href)})${a.description ? `: ${a.description}` : ""}`);
  }
  lines.push("");

  lines.push("## Legal");
  lines.push("");
  lines.push(`- [Privacy Policy](${abs("/legal/privacy/")})`);
  lines.push(`- [SMS Consent](${abs("/legal/sms-consent/")})`);
  lines.push(`- [Accessibility Statement](${abs("/legal/accessibility/")})`);
  lines.push(`- [Texas Consumer Complaint Procedure](${abs("/legal/texas-complaints/")})`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
