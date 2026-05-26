#!/usr/bin/env node
/**
 * Process headshots from /headshots/ in the repo root into website/public/team/.
 * Reads each source file, crops to 800x800 square, and emits AVIF + WebP + JPEG.
 *
 * Usage: node scripts/process-repo-headshots.mjs
 */

import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const SRC_DIR = join(REPO_ROOT, "headshots");
const OUT_DIR = join(REPO_ROOT, "website/public/team");

// Maps source filename → LO slug
const FILE_TO_SLUG = {
  "Chris Clifford.jpg":                          "christopher-clifford-65234",
  "Wenceslao Romero.jpg":                        "wromero",
  "johana_amaya_headshot_USE THIS.jpg":          "jamaya",
  "Emmanuel_Estinvil.jpg":                       "eestinvil",
  "Mario Argenzio_Web.jpg":                      "margenzio",
  "Lauren Zambelli.jpg":                         "lauren-zambelli",
  "Moses Youssef_Web.jpg":                       "myoussef",
  "Francisco Veras.jpg":                         "fveras",
  "Nadia Geyer_Web.jpg":                         "ngeyer",
  "Queeny_Web.jpg":                              "qduong",
  "Christian Nguyen_web.jpg":                    "cnguyen",
  "Steven Rivera.jpeg":                          "srivera",
  "Joshua Borrero_Web.jpg":                      "jborrero",
  "Adam Broder_Web.png":                         "abroder",
  "Daphne Feliciano_Web.jpg":                    "dfeliciano",
  "Emily Cordeira_Web.jpg":                      "ecordeira",
  "Julia Jorge_Web.jpg":                         "jjorge",
  "Ed Morais.JPG":                               "emorais",
  "Jeannette Zucker_Web.jpg":                    "jzucker",
  "Lee Horen_Web.jpg":                           "lhoren",
  "Michael Bisbee_web.jpg":                      "mbisbee",
  "Kevan Scott_Web.jpg":                         "kscott",
  "Yaisha Romero_Web.jpg":                       "yromero",
  "Anastazios Zervas_Web.jpg":                   "azervas",
  "Lisa Zambelli_Web.jpg":                       "lisa-zambelli",
  "Larisa Zambelli_Web.jpg":                     "larisa-zambelli",
  "Samantha Roach_Web.jpg":                      "sroach",
  "Kathie Adler_Web.jpg":                        "kadler",
  "Joe Cordeira_Web.jpg":                        "jcordeira",
  "James Chen_Web.jpg":                          "jchen",
  "Kendra Daniel_Web.jpg":                       "kdaniel",
  "Paul Montesano_Web.jpg":                      "pmontesano",
  "Ryan Riddle_Web.jpg":                         "rriddle",
  "Justin Hu.jpg":                               "jhu",
  "Daniel Ebbecke.jpg":                          "debbecke",
  "Breandan McClaron New Headshot.jpg":          "bmcclarnon",
  "Shahraj Khan - New Headshot.jpg":             "skhan",
  "Angelique Street - New Headshot.JPG":         "astreet",
  "Brandon Kenney - New Headshot.jpg":           "bkenney",
  "Lisa Hartman - New Headshot.jpg":             "lhartman",
  "George Diamantakis_Web.jpg":                  "gdiamantakis",
  "Richard Alvarez - New Headshot.jpg":          "ralvarez",
  "AdamTurkewitz_Web.jpg":                       "aturkewitz",
  "Keyla Cruz - Gray Background.jpg":            "kcruz",
  "Gary Lai 1080.jpg":                           "glai",
  "Logan Levy_Web.jpg":                          "llevy",
  "Leah Silvestri.jpg":                          "lsilvestri",
  "Katherine Chiang Square Web.jpg":             "kchiang",
  "Derek Liu Square Web Gray.png":               "dliu",
  "Steve Wei Square Web.jpg":                    "swei",
  "Steve Lazo Web.jpg":                          "slazo",
  "Gary Johansen.jpg":                           "gjohansen",
  "Christian Soto.jpg":                          "csoto",
  "David Illouz Square Web.JPG":                 "dillouz",
  "Jose Marrero Cruz Square Web.png":            "jcruz",
  "David Fallarino.jpg":                         "dfallarino",
  "Syed Hasib headshot web.jpg":                 "shasib",
  "Julian headshot web square.jpg":              "jgiaquinto",
  "Andrea Carver.jpg":                           "acarver",
  "Raymond Garcia1080x1080.jpg":                 "rgarcia",
  "Tamara Williamson.jpg":                       "twilliamson",
  "James Perrone square web.png":                "jperrone",
  "Headshot Resize_Donna Hemberger.png":         "dhemberger",
  "Josh Brenner.png":                            "jbrenner",
  "Eric Mueller_Headshot Resize (1).png":        "emueller",
  "Thomas Whalen.png":                           "twhalen",
  "Renald Appo.png":                             "rappo",
  "Mitchell Patterson.JPG":                      "mpatterson",
  "Michael Aziz_Web.png":                        "maziz",
  "Rafael Rojas.png":                            "rrojas",
  "Headshot_Kyle Arabian.png":                   "karabian",
  "Fabrizio Alosa.jpg":                          "falosa",
  "David Mizrahi.jpg":                           "dmizrahi",
  "Mayra Hernandez.png":                         "mhernandez",
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const entries = Object.entries(FILE_TO_SLUG);
  console.log(`Processing ${entries.length} headshots → ${OUT_DIR}\n`);

  let ok = 0, miss = 0;
  for (const [filename, slug] of entries) {
    const src = join(SRC_DIR, filename);
    if (!existsSync(src)) {
      console.warn(`  ✗ MISSING: ${filename}`);
      miss++;
      continue;
    }

    const base = join(OUT_DIR, slug);
    try {
      const pipeline = sharp(src)
        .rotate()
        .resize(800, 800, { fit: "cover", position: sharp.strategy.attention });

      await pipeline.clone().avif({ quality: 60 }).toFile(`${base}.avif`);
      await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
      await pipeline.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${base}.jpg`);

      console.log(`  ✓ ${slug}  ←  ${filename}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ERROR processing ${filename}: ${err.message}`);
      miss++;
    }
  }

  console.log(`\nDone. ${ok} processed, ${miss} failed/missing.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
