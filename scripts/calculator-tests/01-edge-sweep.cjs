/*
 * Edge sweep across EVERY calculator on the site, 2026-11-05.
 *
 * The previous sweep covered 14 - the eleven on /calculators/ plus three embedded in blog
 * posts that I happened to know about. An inventory of every page carrying number inputs
 * and a compute script found 61. The other 47 had never been tested.
 *
 * Same method as before: for each numeric input in turn, push an edge value through while
 * the rest stay at their defaults, click any compute button, then read the whole results
 * region and flag anything that should never reach a visitor.
 */
const SP = __dirname;
const fs = require("fs");
const path = require("path");
const http = require("http");
const PUP = path.join(__dirname, "../../website/node_modules/puppeteer-core");
const puppeteer = require(PUP);

const SRC = path.join(__dirname, "../../website/src/pages/");
// Compare against a forward-slash copy: path.join returns BACKSLASHES on Windows, so
// stripping SRC itself never matched and every slug stayed absolute. See the note below.
const SRC_URL = SRC.split(path.sep).join("/");
const ROOT = path.join(__dirname, "../../website/dist/client");
const T = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon" };

const server = http.createServer((q, r) => {
  let f = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, "index.html");
  if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { "Content-Type": T[path.extname(f).toLowerCase()] || "application/octet-stream" });
  fs.createReadStream(f).pipe(r);
});

/** Walk the source tree for every page that has number inputs AND a compute script. */
function inventory() {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.astro") {
        const t = fs.readFileSync(p, "utf8");
        if (/type="number"/.test(t) && /addEventListener|\.click\(/.test(t)) {
          // Normalise separators BEFORE stripping the prefix: on Windows path.join returns
          // backslashes, so stripping a forward-slash SRC silently left the absolute path
          // and every URL 404'd - which looked like a clean pass over zero combinations.
          out.push(path.dirname(p).replace(/\\/g, "/").replace(SRC_URL, ""));
        }
      }
    }
  })(SRC);
  return out.sort();
}

const EDGES = ["", "0", "-1", "1", "999999999"];
const BAD = [
  [/NaN/, "NaN"], [/Infinity/, "Infinity"], [/undefined/, "undefined"],
  [/\$-/, "$- (minus on the wrong side)"], [/\$\d{1,3}(,\d{3}){5,}/, "absurd magnitude"],
];

(async () => {
  const pages = inventory();
  await new Promise((x) => server.listen(0, "127.0.0.1", x));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new", args: ["--no-sandbox", "--disable-gpu"],
  });

  console.log(`${pages.length} calculators found\n`);
  const findings = [];
  let combos = 0, jsErrors = 0;

  for (const slug of pages) {
    const page = await browser.newPage();
    const errs = [];
    page.on("pageerror", (e) => errs.push(e.message));
    const url = `${base}/${slug}/`;
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout: 45000 });
    } catch { console.log(`  SKIP (load) ${slug}`); await page.close(); continue; }

    const ids = await page.evaluate(() =>
      [...document.querySelectorAll("input[type=number]")].map((e) => e.id).filter(Boolean));
    // Loud, not silent: a page that yields no inputs is a broken test, not a clean one.
    if (!ids.length) { console.log(`  !! NO INPUTS FOUND: ${slug}`); await page.close(); continue; }

    for (const id of ids) {
      for (const v of EDGES) {
        await page.evaluate((i, val) => {
          const el = document.getElementById(i);
          if (!el) return;
          el.value = val;
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
          // Button-driven calculators need the click; find any plausible compute button.
          const btn = [...document.querySelectorAll("button")]
            .find((b) => /calculate|compare|check|estimate|see |run /i.test(b.textContent || ""));
          if (btn) btn.click();
        }, id, v).catch(() => {});
        combos++;

        const text = await page.evaluate(() => {
          const r = document.querySelector(".calc-readout")
            || document.querySelector("[id$='-result']")
            || document.querySelector("main");
          return r ? r.textContent.replace(/\s+/g, " ").trim() : "";
        }).catch(() => "");

        for (const [re, label] of BAD) {
          if (re.test(text)) {
            const m = text.match(new RegExp(".{0,50}" + re.source + ".{0,35}"));
            findings.push({ slug, id, v: v === "" ? "(blank)" : v, label, ctx: (m ? m[0] : "").slice(0, 95) });
          }
        }
      }
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
    }
    if (errs.length) {
      jsErrors += errs.length;
      for (const e of [...new Set(errs)].slice(0, 2)) findings.push({ slug, id: "-", v: "-", label: "JS error", ctx: e.slice(0, 95) });
    }
    await page.close();
  }

  console.log("=".repeat(78));
  console.log(`${pages.length} calculators, ${combos} combinations, ${jsErrors} JS errors`);
  const seen = new Set();
  const uniq = findings.filter((f) => { const k = f.slug + f.id + f.label; if (seen.has(k)) return false; seen.add(k); return true; });
  if (!uniq.length) console.log("NO DEFECTS FOUND");
  else {
    console.log(`\n${uniq.length} distinct finding(s):\n`);
    for (const f of uniq) console.log(`  ${f.slug}\n    input=${f.id} value=${f.v}  ${f.label}\n    ${f.ctx}\n`);
  }

  await browser.close();
  server.close();
})();
