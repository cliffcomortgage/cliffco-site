/*
 * Build a favicon set from brand/logos/icon/Favicon.svg.
 *
 *   node scripts/build-favicons.cjs                          # website/public
 *   node scripts/build-favicons.cjs microsites/cliffcoinc/public
 *
 * Outputs into the target directory:
 *   favicon.svg            the vector, with a dark-mode rule added
 *   favicon.ico            32x32, PNG payload in an ICO container
 *   favicon.png            180x180, transparent
 *   apple-touch-icon.png   180x180, flattened onto white
 *
 * The rasters are rendered from the SVG at high density rather than downscaled from a PNG,
 * so the 32px tab icon stays crisp. Re-run this whenever the mark changes.
 *
 * Deliberately not run for microsites/cliffcomn: that site is being left as it is for now.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "brand/logos/icon/Favicon.svg");
const OUT = path.resolve(ROOT, process.argv[2] || "website/public");
// sharp lives in website/node_modules; the microsites do not all carry it.
const sharp = require(require.resolve("sharp", { paths: [path.join(ROOT, "website")] }));

/** Minimal ICO container around a PNG. Supported by every current browser. */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // reserved
  header.writeUInt16LE(1, 2);   // type: icon
  header.writeUInt16LE(1, 4);   // one image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);       // palette colours
  entry.writeUInt8(0, 3);       // reserved
  entry.writeUInt16LE(1, 4);    // colour planes
  entry.writeUInt16LE(32, 6);   // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);
  return Buffer.concat([header, entry, png]);
}

/*
 * The mark is #010101. A browser showing an SVG favicon against dark chrome - Safari's dark
 * tab strip, Firefox's - would render it as black on near-black. Adding a prefers-color-scheme
 * rule lets the same file invert itself. Only the published copy is touched; the brand asset
 * stays exactly as supplied.
 */
function withDarkMode(svg) {
  const anchor = "    </style>";
  if (!svg.includes(anchor)) throw new Error("could not find the end of the <style> block");
  return svg.replace(anchor,
`
      /* Added for the published favicon: the mark is near-black, which disappears against
         dark browser chrome. Safari and Firefox honour this in SVG favicons. */
      @media (prefers-color-scheme: dark) {
        .cls-1 { stroke: #ffffff; }
        .cls-2 { fill: #ffffff; }
      }
    </style>`);
}

(async () => {
  const svg = fs.readFileSync(SRC, "utf8");
  const vb = svg.match(/viewBox="([^"]+)"/);
  console.log(`source: ${path.relative(ROOT, SRC)}  viewBox ${vb ? vb[1] : "?"}`);

  fs.writeFileSync(path.join(OUT, "favicon.svg"), withDarkMode(svg));

  // density drives the rasteriser; 1200 gives plenty of detail to downsample from.
  const render = (size, background) =>
    sharp(SRC, { density: 1200 })
      .resize(size, size, { fit: "contain", background: background || { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 });

  await render(180).toFile(path.join(OUT, "favicon.png"));
  fs.writeFileSync(path.join(OUT, "favicon.ico"), icoFromPng(await render(32).toBuffer(), 32));

  // iOS composites alpha onto black and masks the corners, so flatten onto white and inset.
  await sharp(SRC, { density: 1200 })
    .resize(152, 152, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .extend({ top: 14, bottom: 14, left: 14, right: 14, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "apple-touch-icon.png"));

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
