/**
 * Fetches Google News RSS for Cliffco Mortgage Bankers and appends
 * any new articles to website/src/data/press.json.
 *
 * Run manually:  node scripts/update-press.mjs
 * Runs daily via: .github/workflows/press-updater.yml
 *
 * Requires Node.js 18+ (built-in fetch).
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRESS_FILE = join(__dirname, "../website/src/data/press.json");

const RSS_URL =
  "https://news.google.com/rss/search?q=%22Cliffco+Mortgage%22+OR+%22Cliffco+Mortgage+Bankers%22&hl=en-US&gl=US&ceid=US:en";

// ── RSS parsing ────────────────────────────────────────────────────────────

function extractTag(xml, tag) {
  const cdataMatch = new RegExp(`<${tag}><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`).exec(xml);
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`).exec(xml);
  return plainMatch ? plainMatch[1].trim() : "";
}

function parseItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    items.push({
      title: extractTag(block, "title"),
      link: extractTag(block, "link"),
      pubDate: extractTag(block, "pubDate"),
      description: extractTag(block, "description"),
    });
  }
  return items;
}

// Google News title format: "Article Headline - Publication Name"
function splitTitle(raw) {
  const parts = raw.split(" - ");
  if (parts.length >= 2) {
    const publication = parts.at(-1).trim();
    const title = parts.slice(0, -1).join(" - ").trim();
    return { title, publication };
  }
  return { title: raw.trim(), publication: "Unknown" };
}

function isoMonth(pubDate) {
  try {
    return new Date(pubDate).toISOString().slice(0, 7);
  } catch {
    return new Date().toISOString().slice(0, 7);
  }
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const existing = JSON.parse(readFileSync(PRESS_FILE, "utf8"));
  const existingUrls = new Set(existing.map((p) => p.url));

  console.log(`Fetching: ${RSS_URL}`);
  const res = await fetch(RSS_URL, {
    headers: { "User-Agent": "CliffcoSiteBot/1.0 (press page updater)" },
  });

  if (!res.ok) {
    console.error(`RSS fetch failed: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const xml = await res.text();
  const items = parseItems(xml);
  console.log(`Parsed ${items.length} RSS items`);

  // Keep only items that explicitly mention Cliffco
  const relevant = items.filter((item) => {
    const text = `${item.title} ${item.description}`.toLowerCase();
    return text.includes("cliffco");
  });
  console.log(`${relevant.length} mention Cliffco`);

  const newItems = [];
  for (const item of relevant) {
    if (!item.link || existingUrls.has(item.link)) continue;

    const { title, publication } = splitTitle(item.title);
    const summary = stripHtml(item.description).slice(0, 400);

    newItems.push({
      title,
      publication,
      date: isoMonth(item.pubDate),
      url: item.link,
      summary,
    });
  }

  if (newItems.length === 0) {
    console.log("No new articles — press.json unchanged.");
    return;
  }

  console.log(`Adding ${newItems.length} new article(s):`);
  newItems.forEach((a) => console.log(`  - ${a.title} (${a.publication})`));

  const updated = [...newItems, ...existing];
  writeFileSync(PRESS_FILE, JSON.stringify(updated, null, 2) + "\n", "utf8");
  console.log("press.json updated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
