/**
 * md2pdf.cjs — render one of the launch handoff markdown files to PDF via headless Chrome.
 *
 * No markdown library is installed anywhere in this repo and there is no Python on this
 * machine, so this handles the subset of markdown the handoff actually uses: ATX headings,
 * pipe tables, fenced code, bullet and numbered lists, horizontal rules, bold, inline code.
 * Anything outside that subset would need a real parser.
 *
 *   node md2pdf.cjs <input.md> <output.pdf> "<doc title>" <scratchpadDir>
 */
const fs = require("fs");
const path = require("path");

const [, , IN, OUT, TITLE, SP] = process.argv;
const puppeteer = require(SP + "/a11y/node_modules/puppeteer-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Inline: code first so bold inside backticks is left alone.
function inline(t) {
  const code = [];
  t = t.replace(/`([^`]+)`/g, (_, c) => `\u0000${code.push(c) - 1}\u0000`);
  t = esc(t);
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  return t.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(code[+i])}</code>`);
}

function render(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const L = lines[i];

    // fenced code
    if (/^```/.test(L)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
      continue;
    }
    // table: a header row followed by a |---| separator
    if (/^\|/.test(L) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const cells = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(L);
      i += 2;
      const body = [];
      while (i < lines.length && /^\|/.test(lines[i])) body.push(cells(lines[i++]));
      out.push(
        `<table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>` +
        body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
        `</tbody></table>`
      );
      continue;
    }
    // headings
    const h = L.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }
    // horizontal rule
    if (/^---+\s*$/.test(L)) { out.push("<hr/>"); i++; continue; }
    // numbered list
    if (/^\s*\d+\.\s/.test(L)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
        let t = lines[i++].replace(/^\s*\d+\.\s/, "");
        // continuation lines belong to the item
        while (i < lines.length && /^\s{3,}\S/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i])) t += " " + lines[i++].trim();
        items.push(`<li>${inline(t)}</li>`);
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    // bullets
    if (/^\s*[-*]\s/.test(L)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s/.test(lines[i])) {
        let t = lines[i++].replace(/^\s*[-*]\s/, "");
        while (i < lines.length && /^\s{3,}\S/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i])) t += " " + lines[i++].trim();
        items.push(`<li>${inline(t)}</li>`);
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    // paragraph
    if (L.trim() === "") { i++; continue; }
    const buf = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,4}\s|\||```|---+\s*$|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

const md = fs.readFileSync(IN, "utf8");

/*
 * Fonts are inlined as data URIs rather than pulled from Google Fonts. Loading them over the
 * network passed document.fonts.check() but Chrome still embedded Segoe UI in the printed
 * PDF, so the first two attempts came out in a fallback face. Inlining removes the race.
 * Archivo and IBM Plex Mono are both OFL, so embedding them in a PDF is permitted. These
 * files are read from brand/fonts, which is gitignored - the PDF carries its own subset, and
 * nothing from that folder is committed or referenced by the website build.
 */
// This file lives in launch/, so the repo root is one level up. The old relative chain
// climbed out of the repo and back in by absolute-ish path, which broke the moment it was
// run from a different working directory.
const FONT_DIR = path.resolve(__dirname, "../brand/fonts");
// Archivo shipped nested inside the IBM_Plex_Mono folder in the 2026 font drop; that is
// how it is on disk, so that is the path used here.
const FACES = [
  ["Archivo", 400, "IBM_Plex_Mono/Archivo/Archivo-Regular.ttf"],
  ["Archivo", 500, "IBM_Plex_Mono/Archivo/Archivo-Medium.ttf"],
  ["Archivo", 700, "IBM_Plex_Mono/Archivo/Archivo-Bold.ttf"],
  ["IBM Plex Mono", 400, "IBM_Plex_Mono/IBMPlexMono-Regular.ttf"],
  ["IBM Plex Mono", 600, "IBM_Plex_Mono/IBMPlexMono-SemiBold.ttf"],
];
const fontCss = FACES.map(([family, weight, rel]) => {
  const file = path.join(process.env.FONT_ROOT || FONT_DIR, rel);
  const b64 = fs.readFileSync(file).toString("base64");
  return `@font-face{font-family:"${family}";font-weight:${weight};font-style:normal;font-display:block;` +
         `src:url(data:font/ttf;base64,${b64}) format("truetype");}`;
}).join("\n");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"/>
<title>${esc(TITLE)}</title>
<style>
${fontCss}
</style>
<style>
  @page { size: Letter; margin: 16mm 14mm 18mm; }
  * { box-sizing: border-box; }
  body { font-family: "Archivo", system-ui, sans-serif; color: #0d0d0d; font-size: 10.5pt; line-height: 1.55; margin: 0; }
  h1 { font-size: 21pt; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 4pt; }
  h2 { font-size: 13.5pt; font-weight: 700; letter-spacing: -0.01em; margin: 20pt 0 6pt; padding-bottom: 4pt;
       border-bottom: 1.5pt solid #0d0d0d; break-after: avoid; }
  h3 { font-size: 11.5pt; font-weight: 700; margin: 14pt 0 4pt; break-after: avoid; }
  h4 { font-size: 10.5pt; font-weight: 700; margin: 12pt 0 3pt; break-after: avoid; }
  p { margin: 0 0 7pt; }
  ul, ol { margin: 0 0 8pt; padding-left: 16pt; }
  li { margin-bottom: 3pt; }
  li::marker { color: #5a5d5d; }
  code { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 8.8pt;
         background: #f2f2f2; padding: 1pt 3pt; border-radius: 2pt; word-break: break-word; }
  pre { background: #f7f7f7; border: 0.75pt solid #d8d8d8; border-radius: 3pt; padding: 8pt 10pt;
        margin: 0 0 10pt; overflow-wrap: anywhere; break-inside: avoid; }
  pre code { background: none; padding: 0; font-size: 8.4pt; line-height: 1.5; white-space: pre-wrap; }
  table { width: 100%; border-collapse: collapse; margin: 0 0 10pt; font-size: 9.4pt; break-inside: avoid; }
  th { text-align: left; font-family: "IBM Plex Mono", monospace; font-size: 8pt; font-weight: 600;
       text-transform: uppercase; letter-spacing: 0.08em; color: #3d4040;
       border-bottom: 1.25pt solid #0d0d0d; padding: 5pt 7pt 4pt 0; }
  td { padding: 5pt 7pt 5pt 0; border-bottom: 0.5pt solid #e2e2e2; vertical-align: top; }
  td:last-child, th:last-child { padding-right: 0; }
  hr { border: 0; border-top: 0.75pt solid #d8d8d8; margin: 14pt 0; }
  strong { font-weight: 600; }
  /* The handoff leans on a few warning callouts; make them read as such in print. */
  p:has(> strong:first-child) { break-inside: avoid; }
</style></head>
<body>
${render(md)}
</body></html>`;

const tmp = path.join(SP, "doc_" + path.basename(OUT) + ".html");
fs.writeFileSync(tmp, html);

(async () => {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-gpu"] });
  const p = await b.newPage();
  await p.goto("file:///" + tmp.replace(/\\/g, "/"), { waitUntil: "networkidle0", timeout: 60000 });
  // networkidle0 alone is not enough: the first run printed before the webfonts were applied
  // and Chrome embedded Segoe UI in place of Archivo. Wait for the font set, then confirm.
  await p.evaluate(() => document.fonts.ready);
  const fontsOk = await p.evaluate(() =>
    document.fonts.check('700 21pt "Archivo"') && document.fonts.check('600 8pt "IBM Plex Mono"'));
  if (!fontsOk) throw new Error("brand fonts did not load - refusing to print a fallback-font PDF");
  await new Promise((r) => setTimeout(r, 600));
  await p.pdf({
    path: OUT, format: "Letter", printBackground: true,
    margin: { top: "16mm", right: "14mm", bottom: "18mm", left: "14mm" },
    displayHeaderFooter: true,
    headerTemplate: "<div></div>",
    footerTemplate:
      `<div style="width:100%;font-family:'IBM Plex Mono',monospace;font-size:7pt;color:#8a8d8d;padding:0 14mm;display:flex;justify-content:space-between;">
         <span>${esc(TITLE)}</span><span class="pageNumber"></span>
       </div>`,
  });
  await b.close();
  const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`  ${path.basename(OUT)}  ${kb} KB`);
})();
