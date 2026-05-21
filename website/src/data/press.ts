/**
 * Cliffco press mentions. Add new items at the top (newest first).
 * Verify title, date, and URL before publishing.
 */

export type PressItem = {
  title: string;
  publication: string;
  /** ISO date string: YYYY-MM-DD or YYYY-MM */
  date: string;
  url: string;
  summary: string;
};

export const PRESS: readonly PressItem[] = [
  {
    title: "Cliffco Mortgage Bankers Appoints Rohit Suri To Lead Wholesale Division",
    publication: "National Mortgage Professional",
    date: "2025-10",
    url: "https://nationalmortgageprofessional.com/news/cliffco-mortgage-bankers-appoints-rohit-suri-lead-wholesale-division",
    summary: "Cliffco appointed Rohit Suri as Wholesale Sales Director to lead expansion of its third-party origination division, Clout WMB. Suri brings over three decades of mortgage and financial services experience.",
  },
  {
    title: "This growing IMB aims to capture leads through its proprietary tech, not agent referrals",
    publication: "HousingWire",
    date: "2023-09",
    url: "https://www.housingwire.com/articles/growing-imb-cliffco-mortgage-aims-to-capture-leads-through-its-proprietary-tech-not-agents/",
    summary: "HousingWire profiled Cliffco's strategy of investing in proprietary CRM technology to generate leads directly rather than relying on real estate agent referrals. The piece covered Cliffco's non-QM growth and plans to expand from 18 to 40 states.",
  },
];

export const formatPressDate = (dateStr: string): string => {
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const d = new Date(`${year}-${month}-01`);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
