#!/usr/bin/env node
/**
 * Walks the built /dist tree, extracts every <script type="application/ld+json"> block,
 * parses it, and asserts:
 *  - The JSON parses cleanly.
 *  - Every block has @context: https://schema.org and an @type.
 *  - Person blocks have a name and an identifier (NMLS).
 *  - MortgageLoan blocks have a name, description, and provider.
 *
 * Catches the common breakages — typos in template literals, missing fields after a
 * data refactor — at CI time rather than in production.
 */

import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import process from "node:process";

const root = process.argv[2] ?? "./dist";

let scanned = 0;
let blocks = 0;
const errors = [];

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (extname(entry.name) === ".html") {
      await scanFile(full);
    }
  }
};

const scanFile = async (file) => {
  scanned += 1;
  const html = await readFile(file, "utf8");
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    blocks += 1;
    const raw = match[1].trim();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      errors.push(`${file}: invalid JSON — ${err.message}`);
      continue;
    }

    const items = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of items) {
      if (!item["@context"] || !String(item["@context"]).includes("schema.org")) {
        errors.push(`${file}: missing @context or non-schema.org context`);
      }
      if (!item["@type"]) {
        errors.push(`${file}: missing @type`);
      }
      if (item["@type"] === "Person") {
        if (!item.name) errors.push(`${file}: Person without name`);
        if (!item.identifier) errors.push(`${file}: Person ${item.name ?? "?"} missing NMLS identifier`);
      }
      if (item["@type"] === "MortgageLoan") {
        if (!item.name) errors.push(`${file}: MortgageLoan without name`);
        if (!item.description) errors.push(`${file}: MortgageLoan ${item.name ?? "?"} missing description`);
        if (!item.provider) errors.push(`${file}: MortgageLoan ${item.name ?? "?"} missing provider`);
      }
    }
  }
};

await walk(root);

console.log(`Scanned ${scanned} HTML file(s); ${blocks} JSON-LD block(s) total.`);
if (errors.length) {
  console.error(`\n${errors.length} schema validation error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("Schema validation passed.");
