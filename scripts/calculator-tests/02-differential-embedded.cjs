/*
 * Final differential verification, 2026-11-05: EVERY calculator on the site.
 *
 * 61 pages, 21 distinct implementations. The maths for each is reimplemented here from the
 * page's stated inputs and outputs, then compared against what the shipped page prints over
 * a grid of inputs. Every page is driven, not one representative per group, so a copy that
 * has quietly drifted from its siblings shows up as a mismatch rather than hiding behind a
 * matching hash.
 *
 * The eleven calculators under /calculators/ are covered by calc_diff.cjs, which does the
 * same thing for them. This file covers the 50 embedded in blog posts.
 */
const SP = __dirname;
const fs = require("fs");
const path = require("path");
const http = require("http");
const PUP = path.join(__dirname, "../../website/node_modules/puppeteer-core");
const puppeteer = require(PUP);

const SRC = path.join(__dirname, "../../website/src/pages/mortgage-guides/blog");
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

/* ── independent maths ─────────────────────────────────────────────────── */
const HECM_LIMIT = 1249125, HECM_RATE = 7.0;
const plfTable = (() => {
  const src = fs.readFileSync(path.join(__dirname, "../../website/src/data/hecm-plf.ts"), "utf8");
  const m = {};
  for (const r of src.matchAll(/^\s*(\d+): "(\d+)",/gm)) m[+r[1]] = r[2];
  return m;
})();
function plf(age, rate) {
  const a = Math.min(99, Math.round(age));
  if (a < 62) return null;
  const stepped = Math.round(rate / 0.125) * 0.125;
  const r = Math.min(18.875, Math.max(3, stepped));
  const i = Math.round((r - 3) / 0.125);
  const row = plfTable[a];
  if (!row) return null;
  return Number(row.slice(i * 3, i * 3 + 3)) / 1000;
}
function amort(p, annualPct, months) {
  if (p <= 0 || months <= 0) return 0;
  const r = annualPct / 100 / 12;
  if (r <= 0) return 0;              // every page now guards a zero rate
  return p * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
const dollarsAbs = (v) => "$" + Math.abs(Math.round(v)).toLocaleString("en-US");
const dollarsSigned = (v) => (v < 0 ? "-$" : "$") + Math.abs(Math.round(v)).toLocaleString("en-US");

/* ── one model per archetype ───────────────────────────────────────────── */
const MODELS = {
  "art-se": {
    inputs: { "art-se-y1": 80000, "art-se-y2": 85000, "art-se-dep": 5000, "art-se-add": 0, "art-se-dep2": 180000, "art-se-ratio": 40 },
    grid: [{}, { "art-se-y2": 40000 }, { "art-se-ratio": 90 }, { "art-se-dep2": 0 }],
    run: (i) => {
      const conv = ((i["art-se-y2"] < i["art-se-y1"] ? i["art-se-y2"] : (i["art-se-y1"] + i["art-se-y2"]) / 2) + i["art-se-dep"] + i["art-se-add"]) / 12;
      const bank = i["art-se-dep2"] * (1 - i["art-se-ratio"] / 100) / 12;
      return { "art-se-conv": dollarsSigned(conv), "art-se-bank": dollarsSigned(bank) };
    },
  },
  "art-pe": {
    inputs: { "art-pe-price": 500000, "art-pe-down": 20, "art-pe-rate": 7, "art-pe-taxes": 6000, "art-pe-ins": 1800 },
    grid: [{}, { "art-pe-down": 3 }, { "art-pe-rate": 0 }, { "art-pe-price": 1200000, "art-pe-rate": 9.5 }],
    run: (i, sel) => {
      const term = Number(sel["art-pe-term"] || 30);
      const loan = i["art-pe-price"] * (1 - i["art-pe-down"] / 100);
      const pi = amort(loan, i["art-pe-rate"], term * 12);
      const ti = (i["art-pe-taxes"] + i["art-pe-ins"]) / 12;
      return { "art-pe-pi": dollarsSigned(pi), "art-pe-ti": dollarsSigned(ti), "art-pe-total": dollarsSigned(pi + ti) };
    },
  },
  "art-mr": {
    inputs: { "art-mr-income": 8000, "art-mr-debt": 500, "art-mr-savings": 40000 },
    grid: [{}, { "art-mr-debt": 9000 }, { "art-mr-savings": 0 }, { "art-mr-income": 20000 }],
    run: (i, sel) => {
      const credit = Number(sel["art-mr-credit"]);
      const maxDTI = credit >= 720 ? 0.45 : credit >= 660 ? 0.43 : 0.41;
      return { "art-mr-budget": dollarsSigned(Math.max(0, i["art-mr-income"] * maxDTI - i["art-mr-debt"])) };
    },
  },
  "art-rc": {
    inputs: { "art-rc-bal": 400000, "art-rc-cur": 7.5, "art-rc-new": 6.25, "art-rc-costs": 6000 },
    grid: [{}, { "art-rc-new": 9 }, { "art-rc-costs": 25000 }, { "art-rc-bal": 150000 }],
    run: (i) => {
      const cur = amort(i["art-rc-bal"], i["art-rc-cur"], 360);
      const nw = amort(i["art-rc-bal"], i["art-rc-new"], 360);
      const sav = cur - nw;
      const be = sav > 0 ? Math.ceil(i["art-rc-costs"] / sav) : Infinity;
      const n2 = sav * 24 - i["art-rc-costs"], n5 = sav * 60 - i["art-rc-costs"];
      return {
        "art-rc-savings": dollarsAbs(sav),
        "art-rc-be": sav > 0 ? `${be} months` : "No savings",
        "art-rc-2yr": (n2 >= 0 ? "+" : "-") + dollarsAbs(n2),
        "art-rc-5yr": (n5 >= 0 ? "+" : "-") + dollarsAbs(n5),
      };
    },
  },
  "art-rm": {
    inputs: { "art-rm-age": 68, "art-rm-value": 600000, "art-rm-bal": 0 },
    grid: [{}, { "art-rm-age": 62 }, { "art-rm-age": 90 }, { "art-rm-value": 3000000 }, { "art-rm-bal": 200000 }],
    run: (i) => {
      const claim = Math.min(i["art-rm-value"], HECM_LIMIT);
      const f = plf(i["art-rm-age"], HECM_RATE);
      const gross = f === null ? 0 : claim * f;
      return { "art-rm-gross": dollarsAbs(gross), "art-rm-net": dollarsAbs(Math.max(0, gross - i["art-rm-bal"])) };
    },
  },
  "art-va": {
    inputs: { "art-va-price": 500000, "art-va-rate": 6.75 },
    grid: [{}, { "art-va-price": 300000 }, { "art-va-rate": 5.25 }],
    run: (i, sel) => {
      const downPct = Number(sel["art-va-down"] || 0);
      const use = sel["art-va-use"];
      const feeRate = use === "exempt" ? 0 : downPct >= 10 ? 0.0125 : downPct >= 5 ? 0.015 : (use === "first" ? 0.0215 : 0.033);
      const base = i["art-va-price"] * (1 - downPct / 100);
      const fee = base * feeRate;
      return { "art-va-fee": dollarsAbs(fee), "art-va-loan": dollarsAbs(base + fee), "art-va-pi": dollarsAbs(amort(base + fee, i["art-va-rate"], 360)) };
    },
  },
  "art-dscr": {
    inputs: { "art-dscr-rent": 2500, "art-dscr-pi": 1500, "art-dscr-taxes": 300, "art-dscr-ins": 150, "art-dscr-hoa": 0 },
    grid: [{}, { "art-dscr-rent": 1200 }, { "art-dscr-hoa": 400 }, { "art-dscr-rent": 5000 }],
    run: (i) => {
      const ob = i["art-dscr-pi"] + i["art-dscr-taxes"] + i["art-dscr-ins"] + i["art-dscr-hoa"];
      return { "art-dscr-obligation": dollarsAbs(ob), "art-dscr-ratio": (ob > 0 ? i["art-dscr-rent"] / ob : 0).toFixed(2) };
    },
  },
  "art-af": {
    inputs: { "art-af-income": 90000, "art-af-debt": 400, "art-af-savings": 40000, "art-af-rate": 7 },
    grid: [{}, { "art-af-rate": 0 }, { "art-af-savings": 200000 }, { "art-af-debt": 4000 }],
    run: (i) => {
      const avail = (i["art-af-income"] / 12) * 0.43 - i["art-af-debt"];
      const pi = avail * 0.85;
      const loan = i["art-af-rate"] > 0 ? pi / (amort(1, i["art-af-rate"], 360)) : 0;
      const byIncome = loan / 0.8;
      const bySav = i["art-af-savings"] / 0.23;
      return { "art-af-inc": dollarsSigned(byIncome), "art-af-sav": dollarsSigned(bySav), "art-af-spot": dollarsSigned(Math.min(byIncome, bySav)) };
    },
  },
  "art-rvb": {
    inputs: { "art-rvb-rent": 2800, "art-rvb-price": 500000, "art-rvb-down": 20, "art-rvb-rate": 7, "art-rvb-appr": 3, "art-rvb-growth": 3 },
    grid: [{}, { "art-rvb-appr": 8 }, { "art-rvb-rent": 5000 }, { "art-rvb-rate": 0 }],
    run: (i) => {
      const down = i["art-rvb-price"] * i["art-rvb-down"] / 100;
      const loan = i["art-rvb-price"] - down;
      const closing = i["art-rvb-price"] * 0.03;
      const pi = amort(loan, i["art-rvb-rate"], 360);
      const appr = i["art-rvb-appr"] / 100, growth = i["art-rvb-growth"] / 100;
      const buy = (yr) => {
        let maint = 0;
        for (let y = 1; y <= yr; y++) maint += i["art-rvb-price"] * Math.pow(1 + appr, y) * 0.01;
        const hv = i["art-rvb-price"] * Math.pow(1 + appr, yr);
        const eq = Math.max(0, down + (hv - i["art-rvb-price"]) - hv * 0.06);
        return down + closing + pi * yr * 12 + maint - eq;
      };
      const rent = (yr) => { let t = 0, rv = i["art-rvb-rent"]; for (let y = 0; y < yr; y++) { t += rv * 12; rv *= 1 + growth; } return t; };
      let be = 0;
      for (let y = 1; y <= 30; y++) if (buy(y) <= rent(y)) { be = y; break; }
      return { "art-rvb-be": be ? `Year ${be}` : "Never" };
    },
  },
};

(async () => {
  // Which pages carry which archetype.
  const pages = [];
  for (const d of fs.readdirSync(SRC)) {
    const p = path.join(SRC, d, "index.astro");
    if (!fs.existsSync(p)) continue;
    const t = fs.readFileSync(p, "utf8");
    for (const key of Object.keys(MODELS)) {
      if (t.includes(`"${key}-`)) { pages.push({ slug: d, key }); break; }
    }
  }
  console.log(`${pages.length} embedded calculators across ${new Set(pages.map((p) => p.key)).size} archetypes\n`);

  await new Promise((x) => server.listen(0, "127.0.0.1", x));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new", args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log("   JS ERROR " + e.message));

  let cases = 0, fields = 0, bad = 0;
  const byKey = {};

  for (const { slug, key } of pages) {
    const M = MODELS[key];
    for (const over of M.grid) {
      const ins = { ...M.inputs, ...over };
      await page.goto(`${base}/mortgage-guides/blog/${slug}/`, { waitUntil: "networkidle0", timeout: 45000 });
      const sel = await page.evaluate((o) => {
        for (const [k, v] of Object.entries(o)) {
          const e = document.getElementById(k);
          if (e) { e.value = String(v); e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); }
        }
        const s = {};
        for (const e of document.querySelectorAll("select")) if (e.id) s[e.id] = e.value;
        const btn = [...document.querySelectorAll("button")].find((b) => /calculate|compare|check|estimate|see |run /i.test(b.textContent || ""));
        if (btn) btn.click();
        return s;
      }, ins);

      const expect = M.run(ins, sel);
      const actual = await page.evaluate((ids) => Object.fromEntries(
        ids.map((i) => [i, (document.getElementById(i) || {}).textContent?.trim() ?? "(missing)"])), Object.keys(expect));

      cases++;
      byKey[key] = byKey[key] || { ok: 0, bad: 0 };
      for (const k of Object.keys(expect)) {
        fields++;
        if (actual[k] !== expect[k]) {
          bad++; byKey[key].bad++;
          console.log(`   MISMATCH ${slug} [${key}] ${JSON.stringify(over)}`);
          console.log(`      ${k}: page=${actual[k]}  independent=${expect[k]}`);
        } else byKey[key].ok++;
      }
    }
  }

  console.log("\n" + "=".repeat(78));
  for (const [k, v] of Object.entries(byKey)) console.log(`  ${k.padEnd(10)} ${String(v.ok).padStart(4)} fields matched${v.bad ? `, ${v.bad} MISMATCHED` : ""}`);
  console.log(`\n${cases} cases, ${fields} fields across ${pages.length} pages`);
  console.log(bad === 0 ? "NO DISAGREEMENTS" : `${bad} DISAGREEMENT(S)`);

  await browser.close();
  server.close();
})();
