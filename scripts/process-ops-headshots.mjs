import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../website/public/images/headshots");
const OUT = join(__dirname, "../website/public/team");

const MAP = [
  { file: "Antonio Baines.jpg",  slug: "antonio-baines" },
  { file: "Dan Humphrey.JPG",    slug: "dan-humphrey" },
  { file: "Jason Levy.png",      slug: "jason-levy" },
  { file: "Phil McGoldrick.jpg", slug: "phil-mcgoldrick" },
  { file: "Rafe Tangorra.jpg",   slug: "rafe-tangorra" },
];

for (const { file, slug } of MAP) {
  const src = join(SRC, file);
  const base = join(OUT, slug);
  const pipeline = sharp(src).rotate().resize(800, 800, { fit: "cover", position: sharp.strategy.attention });
  await pipeline.clone().avif({ quality: 60 }).toFile(`${base}.avif`);
  await pipeline.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
  await pipeline.clone().jpeg({ quality: 82, progressive: true, mozjpeg: true }).toFile(`${base}.jpg`);
  console.log("✓", slug);
}
console.log("Done.");
