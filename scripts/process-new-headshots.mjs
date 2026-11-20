import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../website/public/images/headshots");
const OUT = join(__dirname, "../website/public/team");

const MAP = [
  { file: "Sivon Collinge.jpg", slug: "sivon-collinge" },
  { file: "Amanda Miller.jpg",  slug: "amanda-miller" },
  { file: "1080x1080_MarcoM.png", slug: "marco-montano" },
  { file: "Matthew Garland.jpg", slug: "matthew-garland" },
  { file: "Jessenya Delaney_Headshot.jpg", slug: "jessenya-delaney" },
];

for (const { file, slug } of MAP) {
  const src = join(SRC, file);
  // Older sources are removed once processed, so a missing file is skipped, not fatal.
  if (!existsSync(src)) { console.log("- skipped (source not in repo)", slug); continue; }
  const base = join(OUT, slug);
  // withoutEnlargement: a source under 800px (Jessenya Delaney's is 400px) stays at its own size
  // instead of being upscaled into a blurry 800px file.
  const pipeline = sharp(src).rotate().resize(800, 800, { fit: "cover", position: sharp.strategy.attention, withoutEnlargement: true });
  await pipeline.clone().avif({ quality: 60 }).toFile(`${base}.avif`);
  await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
  await pipeline.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${base}.jpg`);
  console.log("✓", slug);
}
console.log("Done.");
