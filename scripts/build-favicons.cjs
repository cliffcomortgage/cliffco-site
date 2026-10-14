/*
 * Build the favicon set for website/ from brand/logos/icon/Favicon.png.
 *
 * The source is a 234x234 transparent PNG of the arrow-in-square mark, so everything here is
 * raster. No SVG is produced: the only SVG in brand/logos/favicon is a power-button icon,
 * nothing to do with Cliffco, and a PNG cannot be faithfully vectorised. The site's existing
 * favicon.svg is that wrong mark, and browsers prefer SVG when offered, so it is removed
 * rather than left to win over the correct PNG.
 *
 * Outputs:
 *   favicon.ico            32x32, PNG payload inside an ICO container
 *   favicon.png            180x180, transparent
 *   apple-touch-icon.png   180x180, flattened onto white - iOS composites alpha onto black
 */
const fs = require("fs");
const path = require("path");
// This script lives in the scratchpad, so sharp resolves from website/node_modules, not here.
const sharp = require(require.resolve("sharp", { paths: [process.argv[4] || process.cwd()] }));

const SRC = process.argv[2];
const OUT = process.argv[3];

/** Minimal ICO container around a PNG. Supported by every current browser. */
function icoFromPng(pngBuffer, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: icon
  header.writeUInt16LE(1, 4);      // one image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2);          // palette colours
  entry.writeUInt8(0, 3);          // reserved
  entry.writeUInt16LE(1, 4);       // colour planes
  entry.writeUInt16LE(32, 6);      // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12); // offset to the payload
  return Buffer.concat([header, entry, pngBuffer]);
}

(async () => {
  const meta = await sharp(SRC).metadata();
  console.log(`source: ${meta.width}x${meta.height} ${meta.format}, alpha ${!!meta.hasAlpha}`);

  // Trim surrounding transparency first so the mark fills the tile instead of floating in
  // padding - at 32px a few px of dead margin is the difference between legible and mush.
  const trimmed = await sharp(SRC).trim({ threshold: 10 }).toBuffer();
  const tMeta = await sharp(trimmed).metadata();
  console.log(`trimmed to ink: ${tMeta.width}x${tMeta.height}`);

  const square = (size, background) =>
    sharp(trimmed)
      .resize(size, size, { fit: "contain", background: background || { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 });

  // favicon.png - transparent, used by the <link rel="icon">
  await square(180).toFile(path.join(OUT, "favicon.png"));

  // favicon.ico - 32px, the tab icon and the one older clients ask for by convention
  const ico32 = await square(32).toBuffer();
  fs.writeFileSync(path.join(OUT, "favicon.ico"), icoFromPng(ico32, 32));

  // apple-touch-icon - flattened; iOS puts alpha on black, which would hide a black mark.
  // A little padding keeps it off the rounded-corner mask.
  await sharp(trimmed)
    .resize(152, 152, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 14, bottom: 14, left: 14, right: 14, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "apple-touch-icon.png"));

  // The old SVG is the wrong mark entirely; serving it would beat the PNG.
  const svg = path.join(OUT, "favicon.svg");
  if (fs.existsSync(svg)) { fs.unlinkSync(svg); console.log("removed stale favicon.svg (power-button icon, not Cliffco)"); }

  console.log("\nwritten:");
  for (const f of ["favicon.ico", "favicon.png", "apple-touch-icon.png"]) {
    const p = path.join(OUT, f);
    const st = fs.statSync(p);
    let dim = "";
    try { const m = await sharp(p).metadata(); dim = `${m.width}x${m.height}`; } catch { dim = "ico"; }
    console.log(`  ${String(st.size).padStart(6)} bytes  ${dim.padEnd(9)} ${f}`);
  }
})();
