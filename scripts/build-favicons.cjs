/*
 * Build a favicon set from the 2026 CMB icon, brand/logos/Cliffco_Favicon.svg.
 *
 *   node scripts/build-favicons.cjs                          # website/public
 *   node scripts/build-favicons.cjs microsites/cliffcoinc/public
 *
 * Outputs into the target directory:
 *   favicon.svg            the vector, metadata stripped
 *   favicon.ico            32x32, PNG payload in an ICO container
 *   favicon.png            512x512
 *   apple-touch-icon.png   180x180, opaque
 *
 * The mark is CMB in a square black plate - the guide replaces the full logo with the icon
 * anywhere it would sit under 96px wide. It carries its own background, so there is no alpha
 * to composite and no dark-mode inversion to add: the white letters hold against light and
 * dark browser chrome alike. (The pre-2026 mark was a near-black outline on transparency and
 * needed a prefers-color-scheme rule injected here; that is gone with it.)
 *
 * Rasters are rendered from the SVG at high density rather than downscaled from a PNG, so the
 * 32px tab icon stays crisp. Re-run this whenever the mark changes.
 *
 * Deliberately not run for microsites/cliffcomn: that site is being left as it is for now.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "brand/logos/Cliffco_Favicon.svg");
const OUT = path.resolve(ROOT, process.argv[2] || "website/public");
// sharp lives in website/node_modules; the microsites do not all carry it.
const sharp = require(require.resolve("sharp", { paths: [path.join(ROOT, "website")] }));

const BLACK = { r: 13, g: 13, b: 13, alpha: 1 };

/** Minimal ICO container around a PNG. Supported by every current browser. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // reserved
  header.writeUInt16LE(1, 2);   // type: icon
  header.writeUInt16LE(1, 4);   // one image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size === 256 ? 0 : size, 0);
  entry.writeUInt8(size === 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);       // palette
  entry.writeUInt8(0, 3);       // reserved
  entry.writeUInt16LE(1, 4);    // colour planes
  entry.writeUInt16LE(32, 6);   // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);
  return Buffer.concat([header, entry, png]);
}

/* The supplied SVGs carry a C2PA provenance blob that is never rendered. Only the published
 * copy is touched; the brand asset stays exactly as supplied. */
const stripMetadata = (svg) =>
  svg.replace(/<metadata>[\s\S]*?<\/metadata>/g, "").replace(/\sxmlns:c2pa="[^"]*"/g, "");

(async () => {
  const svg = fs.readFileSync(SRC, "utf8");
  const vb = svg.match(/viewBox="([^"]+)"/);
  console.log(`source: ${path.relative(ROOT, SRC).replace(/\\/g, "/")}  viewBox ${vb ? vb[1] : "?"}`);

  fs.writeFileSync(path.join(OUT, "favicon.svg"), stripMetadata(svg));

  // density drives the rasteriser; 1200 gives plenty of detail to downsample from.
  const render = (size) =>
    sharp(SRC, { density: 1200 }).resize(size, size, { fit: "contain", background: BLACK })
      .flatten({ background: BLACK }).png({ compressionLevel: 9 });

  await render(512).toFile(path.join(OUT, "favicon.png"));
  fs.writeFileSync(path.join(OUT, "favicon.ico"), icoFromPng(await render(32).toBuffer(), 32));
  // iOS masks the corners itself and never wants alpha, so this one is flat and full-bleed.
  await render(180).toFile(path.join(OUT, "apple-touch-icon.png"));

  console.log(`\nwritten to ${path.relative(ROOT, OUT).replace(/\\/g, "/")}:`);
  for (const f of ["favicon.svg", "favicon.ico", "favicon.png", "apple-touch-icon.png"]) {
    const p = path.join(OUT, f);
    const st = fs.statSync(p);
    let dim = "vector";
    if (f.endsWith(".png")) { const m = await sharp(p).metadata(); dim = `${m.width}x${m.height}`; }
    if (f.endsWith(".ico")) dim = "32x32";
    console.log(`  ${String(st.size).padStart(6)} bytes  ${dim.padEnd(9)} ${f}`);
  }
})();
