#!/usr/bin/env node
/**
 * Import staff headshots from OneDrive into website/public/team/.
 *
 * Source: ~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/Staff Headshots/
 * Each LO has a folder; we pick the best-named candidate, resize to 800px square,
 * and emit AVIF + WebP + JPEG.
 *
 * The resulting filenames match each LO's slug:
 *   website/public/team/{firstname-lastname-nmlsid}.{avif,webp,jpg}
 *
 * Usage: node scripts/import-headshots.mjs
 */

import { readdir, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SRC_DIR = "/Users/rtangorra/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/Staff Headshots";
const OUT_DIR = join(REPO_ROOT, "website/public/team");

// Map from LO slug → array of folder-name candidates.
// First match wins. Add aliases here when a folder name differs from the LO display name.
const SLUG_TO_FOLDER = {
  // Wave 1 — leadership
  "christopher-clifford-65234": ["Christopher Clifford", "Chris Clifford"],
  "adam-turkewitz-32900": ["Adam Turkewitz"],
  "james-chen-17991": ["James Chen"],
  "david-fallarino-673167": ["David Fallarino"],
  "david-mizrahi-40925": ["David Mizrahi"],

  // Wave 2 — branch managers
  "angelique-street-1146282": ["Angelique Street"],
  "daphne-feliciano-1227421": ["Daphne Feliciano"],
  "edward-morais-243926": ["Ed Morais", "Edward Morais", "Edward (Eddie) Morais"],
  "francisco-veras-170512": ["Francisco Veras"],
  "julian-giaquinto-56473": ["Julian Giaquinto"],

  // Wave 3 — Orlando bilingual cluster
  "julia-jorge-delcarmen-1555712": ["Julia Jorge", "Julia Jorge Delcarmen", "Julia Jorge-Delcarmen"],
  "keyla-cruz-486181": ["Keyla Cruz"],
  "nadia-geyer-castro-2498365": ["Nadia Geyer", "Nadia Geyer Castro"],
  "samantha-roach-1956150": ["Samantha Roach"],
  "wenceslao-hernandez-romero-1842661": ["Wenceslao Romero", "Wenceslao Hernandez Romero"],
  "yaisha-romero-1559680": ["Yaisha Romero"],

  // Scottsdale, AZ
  "derek-liu-2578555": ["Derek Liu"],
  // mayra-hernandez-625376: no folder in active staff — skip

  // Excelsior, MN
  "mitchell-patterson-2560483": ["Mitchell Patterson"],

  // Newark, NJ
  "christian-soto-1173591": ["Christian Soto"],
  "gary-johansen-339278": ["Gary Johansen"],

  // Jamaica, NY (Queens)
  "shahraj-kabir-khan-1209249": ["Shahraj Khan", "Shahraj Kabir Khan"],

  // Wantagh, NY
  "syed-hasib-1594778": ["Syed Hasib"],

  // Bay Shore, NY — Zambelli cluster
  "larisa-zambelli-1828224": ["Larisa Zambelli"],
  "lauren-zambelli-970450": ["Lauren Zambelli"],
  "lisa-zambelli-martorana-13055": ["Lisa Zambelli", "Lisa Zambelli-Martorana"],

  // Operations leadership (non-LO; rendered on About page leadership-team section)
  "samantha-cardinal": ["Samantha Cardinal"],
  "kathleen-lovece": ["Kathleen Lovece", "Kathy Lovece"],
  "sivon-collinge": ["Sivon Collinge"],
  "amanda-miller": ["Amanda Miller"],
};

/**
 * Within a folder, score image candidates and pick the best.
 *  - Prefer files with "_Web" or "Web" in the name (brand-approved web crops)
 *  - Then largest by file size
 */
async function pickBestImage(folder) {
  const entries = await readdir(folder);
  const images = [];
  for (const name of entries) {
    const ext = extname(name).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".heic"].includes(ext)) continue;
    const full = join(folder, name);
    const s = await stat(full);
    let score = s.size;
    if (/web/i.test(name)) score += 5_000_000; // strong preference
    if (/headshot/i.test(name)) score += 2_000_000;
    if (/old/i.test(name) || name.startsWith("OLD")) score -= 1_000_000;
    images.push({ name, full, score, size: s.size });
  }
  if (!images.length) return null;
  images.sort((a, b) => b.score - a.score);
  return images[0];
}

async function processOne(slug, folderCandidates) {
  for (const folderName of folderCandidates) {
    const folder = join(SRC_DIR, folderName);
    if (!existsSync(folder)) continue;

    const stats = await stat(folder);
    if (!stats.isDirectory()) continue;

    const pick = await pickBestImage(folder);
    if (!pick) {
      console.warn(`  ⚠ ${slug}: folder "${folderName}" exists but has no usable image`);
      continue;
    }

    const base = join(OUT_DIR, slug);

    // Square crop, attention-based (focus on the face); 800px output.
    const pipeline = sharp(pick.full)
      .rotate() // honor EXIF orientation
      .resize(800, 800, { fit: "cover", position: sharp.strategy.attention });

    await pipeline.clone().avif({ quality: 60 }).toFile(`${base}.avif`);
    await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
    await pipeline.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${base}.jpg`);

    console.log(`  ✓ ${slug}  ←  ${folderName}/${pick.name}`);
    return true;
  }
  console.warn(`  ✗ ${slug}: no matching folder found`);
  return false;
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const slugs = Object.keys(SLUG_TO_FOLDER);
  console.log(`Importing ${slugs.length} headshots → ${OUT_DIR}\n`);

  let ok = 0, miss = 0;
  for (const slug of slugs) {
    const success = await processOne(slug, SLUG_TO_FOLDER[slug]);
    if (success) ok++; else miss++;
  }

  console.log(`\nDone. ${ok} imported, ${miss} missing.`);
  if (miss > 0) {
    console.log("Missing images will fall back to the placeholder block in the LO bio template.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
