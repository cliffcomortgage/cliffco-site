/**
 * Press data is stored in press.json and auto-updated by the
 * press-updater GitHub Actions workflow (scripts/update-press.mjs).
 * To add a curated article manually, edit press.json directly.
 */

import pressRaw from "./press.json";

export type PressItem = {
  title: string;
  publication: string;
  /** ISO date string: YYYY-MM-DD or YYYY-MM */
  date: string;
  url: string;
  summary: string;
};

export const PRESS: readonly PressItem[] = pressRaw as PressItem[];

export const formatPressDate = (dateStr: string): string => {
  const [year, month] = dateStr.split("-");
  if (!month) return year;
  const d = new Date(`${year}-${month}-01`);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
