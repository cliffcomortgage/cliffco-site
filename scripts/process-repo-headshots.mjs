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
  "Wenceslao Romero.jpg":                        "wenceslao-hernandez-romero-1842661",
  "johana_amaya_headshot_USE THIS.jpg":          "johana-amaya-1838913",
  "Emmanuel_Estinvil.jpg":                       "emmanuel-estinvil-66287",
  "Mario Argenzio_Web.jpg":                      "mario-argenzio-1869384",
  "Lauren Zambelli.jpg":                         "lauren-zambelli-970450",
  "Moses Youssef_Web.jpg":                       "moses-youssef-949405",
  "Francisco Veras.jpg":                         "francisco-veras-170512",
  "Nadia Geyer_Web.jpg":                         "nadia-geyer-castro-2498365",
  "Queeny_Web.jpg":                              "queeny-duong-826674",
  "Christian Nguyen_web.jpg":                    "christian-nguyen-958635",
  "Steven Rivera.jpeg":                          "steven-rivera-1876188",
  "Joshua Borrero_Web.jpg":                      "joshua-borrero-2380321",
  "Adam Broder_Web.png":                         "adam-broder-167538",
  "Daphne Feliciano_Web.jpg":                    "daphne-feliciano-1227421",
  "Emily Cordeira_Web.jpg":                      "emily-cordeira-1262960",
  "Julia Jorge_Web.jpg":                         "julia-jorge-delcarmen-1555712",
  "Ed Morais.JPG":                               "edward-morais-243926",
  "Jeannette Zucker_Web.jpg":                    "jeannette-zucker-2572449",
  "Lee Horen_Web.jpg":                           "lee-horen-673181",
  "Michael Bisbee_web.jpg":                      "michael-bisbee-64809",
  "Kevan Scott_Web.jpg":                         "kevan-scott-1959714",
  "Yaisha Romero_Web.jpg":                       "yaisha-romero-1559680",
  "Anastazios Zervas_Web.jpg":                   "anastasios-zervas-2145945",
  "Lisa Zambelli_Web.jpg":                       "lisa-zambelli-martorana-13055",
  "Larisa Zambelli_Web.jpg":                     "larisa-zambelli-1828224",
  "Samantha Roach_Web.jpg":                      "samantha-roach-1956150",
  "Kathie Adler_Web.jpg":                        "kathie-adler-65780",
  "Joe Cordeira_Web.jpg":                        "joseph-cordeira-1492298",
  "James Chen_Web.jpg":                          "james-chen-17991",
  "Kendra Daniel_Web.jpg":                       "kendra-daniel-1313375",
  "Paul Montesano_Web.jpg":                      "paul-montesano-4388",
  "Ryan Riddle_Web.jpg":                         "ryan-riddle-1730872",
  "Justin Hu.jpg":                               "justin-hu-2553712",
  "Daniel Ebbecke.jpg":                          "daniel-ebbecke-1578785",
  "Breandan McClaron New Headshot.jpg":          "brendan-mcclarnon-17865",
  "Shahraj Khan - New Headshot.jpg":             "shahraj-kabir-khan-1209249",
  "Angelique Street - New Headshot.JPG":         "angelique-street-1146282",
  "Brandon Kenney - New Headshot.jpg":           "brandon-kenney-2144392",
  "Lisa Hartman - New Headshot.jpg":             "lisa-hartman-1730543",
  "George Diamantakis_Web.jpg":                  "george-diamantakis-1367963",
  "Richard Alvarez - New Headshot.jpg":          "richard-alvarez-1838273",
  "AdamTurkewitz_Web.jpg":                       "adam-turkewitz-32900",
  "Keyla Cruz - Gray Background.jpg":            "keyla-cruz-486181",
  "Gary Lai 1080.jpg":                           "gary-lai-599658",
  "Logan Levy_Web.jpg":                          "logan-levy-2502088",
  "Leah Silvestri.jpg":                          "leah-silvestri-420488",
  "Katherine Chiang Square Web.jpg":             "katherine-chiang-1600568",
  "Derek Liu Square Web Gray.png":               "derek-liu-2578555",
  "Steve Wei Square Web.jpg":                    "steve-wei-1231095",
  "Steve Lazo Web.jpg":                          "steve-lazo-2636320",
  "Gary Johansen.jpg":                           "gary-johansen-339278",
  "Christian Soto.jpg":                          "christian-soto-1173591",
  "David Illouz Square Web.JPG":                 "david-illouz-1584179",
  "Jose Marrero Cruz Square Web.png":            "jose-marrero-1962198",
  "David Fallarino.jpg":                         "david-fallarino-673167",
  "Syed Hasib headshot web.jpg":                 "syed-hasib-1594778",
  "Julian headshot web square.jpg":              "julian-giaquinto-56473",
  "Andrea Carver.jpg":                           "andrea-carver-2074055",
  "Raymond Garcia1080x1080.jpg":                 "raymond-garcia-2559091",
  "Tamara Williamson.jpg":                       "tamara-williamson-1933434",
  "James Perrone square web.png":                "james-perrone-56096",
  "Headshot Resize_Donna Hemberger.png":         "donna-hemberger-90881",
  "Josh Brenner.png":                            "joshua-brenner-2030405",
  "Eric Mueller_Headshot Resize (1).png":        "eric-mueller-1712181",
  "Thomas Whalen.png":                           "thomas-whalen-9167",
  "Renald Appo.png":                             "renald-appo-53967",
  "Mitchell Patterson.JPG":                      "mitchell-patterson-2560483",
  "Michael Aziz_Web.png":                        "michael-aziz-2801284",
  "Rafael Rojas.png":                            "rafael-rojas-2082989",
  "Headshot_Kyle Arabian.png":                   "kyle-arabian-1671709",
  "Fabrizio Alosa.jpg":                          "fabrizio-alosa-2631382",
  "David Mizrahi.jpg":                           "david-mizrahi-40925",
  "Mayra Hernandez.png":                         "mayra-hernandez-625376",
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
