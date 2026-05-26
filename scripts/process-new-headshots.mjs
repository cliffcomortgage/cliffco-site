import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "../website/public/images/headshots");
const OUT = join(__dirname, "../website/public/team");

const MAP = [
  { file: "Sivon Collinge.jpg", slug: "sivon-collinge" },
  { file: "Amanda Miller.jpg",  slug: "amanda-miller" },
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
