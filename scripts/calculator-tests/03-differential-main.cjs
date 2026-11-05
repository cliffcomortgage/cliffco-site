/*
 * Differential test. Every calculator's maths is reimplemented here from scratch, from the
 * assumptions each page states, and then checked against what the shipped page actually
 * prints across a grid of inputs. Where the two disagree, one of them is wrong.
 *
 * This is deliberately NOT a copy of the page code - it is written from the documented
 * behaviour, so a bug that reads plausibly in the source still shows up as a mismatch.
 */
const SP = __dirname;
const fs = require("fs");
const path = require("path");
const http = require("http");
const puppeteer = require(path.join(__dirname, "../../website/node_modules/puppeteer-core"));

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

/* ── independent maths ──────────────────────────────────────────────────── */
const RATE = { conventional30: 7.0, va30: 6.75, dscr30: 7.5, hecmExpected: 7.0 };

/** Monthly payment on a fully amortising loan. Zero rate is principal over the term. */
function pmt(principal, annualPct, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualPct / 100 / 12;
  if (r <= 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
function amortFactor(annualPct, months) { return pmt(1, annualPct, months); }
const money = (n) => "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
const signed = (n) => (n < 0 ? "-" : "") + money(n);

const MODELS = {
  "payment-estimator": (i) => {
    const loan = i.price * (1 - i.down / 100);
    const pi = pmt(loan, i.rate, i.term * 12);
    const ti = (i.taxes + i.ins) / 12;
    return { "pe-total": money(pi + ti), "pe-pi": money(pi), "pe-ti": money(ti) };
  },

  affordability: (i) => {
    const maxHousing = Math.max(0, 0.43 * i.income - i.debts);
    const ti = (i.taxes + i.ins) / 12;
    const maxPI = Math.max(0, maxHousing - ti);
    const f = amortFactor(RATE.conventional30, 360);
    const maxLoan = maxPI / f;
    const avail = Math.max(0, i.savings);
    const byIncome = avail + maxLoan;
    const bySavings = avail / 0.035;
    const price = Math.min(byIncome, bySavings);
    if (price <= 0) return { "af-maxprice": "$0", "af-downscen": "-", "af-payment": "-" };
    const down = Math.min(avail, price);
    return {
      "af-maxprice": money(price),
      "af-downscen": money(down),
      "af-payment": money((price - down) * f + ti),
    };
  },

  "mortgage-readiness": (i) => {
    const down = i.price * 0.05;
    const housing = pmt(i.price - down, RATE.conventional30, 360) + i.price * 0.015 / 12;
    const dti = (housing + i.debts) / i.income * 100;
    const reserves = Math.max(0, i.savings - down) / housing;
    let s = 100;
    const cs = { below580: 550, "580-619": 599, "620-659": 639, "660-699": 679, "700-739": 719, "740+": 760 }[i.credit];
    if (cs < 580) s -= 40; else if (cs < 620) s -= 25; else if (cs < 660) s -= 15; else if (cs < 700) s -= 5;
    if (dti > 50) s -= 30; else if (dti > 43) s -= 20; else if (dti > 36) s -= 10;
    if (reserves < 2) s -= 20; else if (reserves < 3) s -= 10; else if (reserves < 6) s -= 5;
    return {
      "mr-score": String(Math.max(0, s)),
      "mr-dti": dti.toFixed(1) + "%",
      "mr-reserves": reserves.toFixed(1) + " mo",
    };
  },

  "va-loan": (i) => {
    const feeRate = i.use === "exempt" ? 0
      : i.down >= 10 ? 0.0125 : i.down >= 5 ? 0.015 : (i.use === "subsequent" ? 0.033 : 0.0215);
    const base = i.price * (1 - i.down / 100);
    const vaLoan = base + base * feeRate;
    const ti = (i.taxes + i.ins) / 12;
    const va = pmt(vaLoan, i.rate, 360) + ti;
    const convLoan = i.price - Math.max(i.price * i.down / 100, i.price * 0.20);
    const conv = pmt(convLoan, i.convrate, 360) + ti;
    return { "va-monthly": money(va), "va-conv": money(conv), "va-savings": signed(conv - va) };
  },

  dscr: (i) => {
    const pi = pmt(i.price * (1 - i.down / 100), i.rate, 360);
    const ob = pi + i.taxes + i.ins + i.hoa;
    return {
      "dc-dscr": (i.rent / ob).toFixed(2),
      "dc-obligation": money(ob),
      "dc-cashflow": (i.rent - ob >= 0 ? "+" : "-") + money(i.rent - ob),
    };
  },

  "refi-checkup": (i) => {
    const newPI = pmt(i.balance, i.newrate, i.term * 12);
    const sav = i.current - newPI;
    const be = sav > 0 ? Math.ceil(i.closing / sav) : 9999;
    const net5 = sav * 60 - i.closing;
    return {
      "rc-breakeven": sav <= 0 || be > 360 ? "Never" : "Month " + be,
      "rc-savings": sav > 0 ? money(sav) : "-" + money(sav),
      "rc-net5": net5 >= 0 ? money(net5) : "-" + money(net5),
    };
  },

  "budget-builder": (i) => {
    const ceiling = i.income - i.expenses - i.savings;
    if (ceiling <= 0) return { "bb-ceiling": "$0", "bb-price": "-" };
    const loan = (ceiling * 0.85) / amortFactor(i.rate, 360);
    return { "bb-ceiling": money(ceiling), "bb-price": loan > 0 ? money(loan / 0.8) : "-" };
  },

  "self-employed-income": (i) => {
    const tax = ((i.y1net + i.y2net) / 2 + i.addbacks) / 12;
    const bank = i.deposits12 * (1 - Math.min(i.expratio, 100) / 100) / 12;
    return {
      "se-taxreturn": money(tax) + "/mo",
      "se-bankstmt": money(bank) + "/mo",
      "se-better": money(Math.max(tax, bank)) + "/mo",
    };
  },

  buydown: (i) => {
    const full = pmt(i.loan, i.rate, 360);
    const total = (reds) => reds.reduce((acc, red) =>
      acc + (full - pmt(i.loan, Math.max(0, i.rate - red), 360)) * 12, 0);
    return {
      "bd-321-total": money(total([3, 2, 1])),
      "bd-21-total": money(total([2, 1])),
      "bd-10-total": money(total([1])),
    };
  },

  "rent-vs-buy": (i) => {
    const loan = i.price * (1 - i.down / 100);
    const pi = pmt(loan, i.rate, 360);
    const ti = (i.taxes + i.ins) / 12;
    let cumBuy = i.price * i.down / 100, cumRent = 0, bal = loan, hv = i.price, rent = i.rent;
    let be = -1, eq5 = 0, net5 = 0, rent5 = 0;
    for (let y = 1; y <= 30; y++) {
      const maint = hv * (i.maint / 100) / 12;
      for (let m = 0; m < 12; m++) { bal -= pi - bal * (i.rate / 100 / 12); cumBuy += pi + ti + maint; }
      hv *= 1 + i.appr / 100;
      for (let m = 0; m < 12; m++) cumRent += rent;
      rent *= 1 + i.rentgrowth / 100;
      const eq = Math.max(0, hv - bal - hv * (i.sell / 100));
      if (y === 5) { eq5 = eq; net5 = cumBuy - eq; rent5 = cumRent; }
      if (be === -1 && cumBuy - eq <= cumRent) be = y;
    }
    const d = net5 - rent5;
    return {
      "rvb-breakeven": be === -1 ? "Never" : "Year " + be,
      "rvb-equity5": money(eq5),
      "rvb-netbuy5": (d > 0 ? "+" : d < 0 ? "\u2212" : "") + money(d) + " vs. rent",
    };
  },
};

/* ── input grids ────────────────────────────────────────────────────────── */
const GRIDS = {
  "payment-estimator": [
    { price: 500000, down: 20, rate: 7, term: 30, taxes: 6000, ins: 1800 },
    { price: 275000, down: 3, rate: 6.125, term: 15, taxes: 4200, ins: 1100 },
    { price: 1250000, down: 35, rate: 8.875, term: 20, taxes: 22000, ins: 5400 },
  ],
  affordability: [
    { income: 8000, debts: 400, savings: 20000, taxes: 6000, ins: 1800 },
    { income: 4200, debts: 1500, savings: 9000, taxes: 3000, ins: 900 },
    { income: 25000, debts: 0, savings: 400000, taxes: 18000, ins: 4000 },
    { income: 6000, debts: 2400, savings: 150000, taxes: 9000, ins: 2200 },
  ],
  "mortgage-readiness": [
    { credit: "700-739", income: 8000, debts: 400, savings: 20000, price: 400000 },
    { credit: "below580", income: 5000, debts: 900, savings: 5000, price: 300000 },
    { credit: "740+", income: 30000, debts: 200, savings: 250000, price: 650000 },
    { credit: "620-659", income: 7000, debts: 1800, savings: 45000, price: 500000 },
  ],
  "va-loan": [
    { price: 500000, down: 0, rate: 6.75, convrate: 7, use: "first", taxes: 6000, ins: 1800 },
    { price: 420000, down: 7, rate: 6.25, convrate: 7.5, use: "subsequent", taxes: 5200, ins: 1400 },
    { price: 900000, down: 15, rate: 5.875, convrate: 6.5, use: "exempt", taxes: 14000, ins: 3100 },
  ],
  dscr: [
    { rent: 3000, price: 400000, down: 25, rate: 7.5, taxes: 400, ins: 150, hoa: 0 },
    { rent: 1900, price: 350000, down: 20, rate: 8.25, taxes: 520, ins: 190, hoa: 250 },
    { rent: 9000, price: 1100000, down: 35, rate: 7.125, taxes: 1400, ins: 400, hoa: 0 },
  ],
  "refi-checkup": [
    { current: 2200, balance: 380000, newrate: 7, term: 30, closing: 6000 },
    { current: 3100, balance: 420000, newrate: 5.5, term: 20, closing: 9500 },
    { current: 1800, balance: 380000, newrate: 9, term: 30, closing: 6000 },
  ],
  "budget-builder": [
    { income: 8000, expenses: 3000, savings: 500, rate: 7 },
    { income: 4000, expenses: 3800, savings: 100, rate: 6.5 },
    { income: 15000, expenses: 4000, savings: 2000, rate: 8.5 },
  ],
  "self-employed-income": [
    { y1net: 60000, y2net: 55000, addbacks: 8000, deposits12: 120000, expratio: 50 },
    { y1net: 20000, y2net: 95000, addbacks: 0, deposits12: 400000, expratio: 35 },
    { y1net: 150000, y2net: 140000, addbacks: 25000, deposits12: 90000, expratio: 90 },
  ],
  buydown: [
    { loan: 450000, rate: 7 },
    { loan: 180000, rate: 9.5 },
    { loan: 1000000, rate: 5.25 },
  ],
  "rent-vs-buy": [
    { price: 500000, down: 10, rate: 7, rent: 2800, appr: 3, rentgrowth: 3, taxes: 6000, ins: 1800, maint: 1, sell: 6 },
    { price: 350000, down: 20, rate: 6, rent: 3400, appr: 5, rentgrowth: 2, taxes: 4000, ins: 1200, maint: 0.5, sell: 4 },
    { price: 800000, down: 5, rate: 8.5, rent: 2200, appr: 1, rentgrowth: 1, taxes: 15000, ins: 3000, maint: 2, sell: 8 },
  ],
};

const IDS = {
  "payment-estimator": "pe", affordability: "af", "mortgage-readiness": "mr", "va-loan": "va",
  dscr: "dc", "refi-checkup": "rc", "budget-builder": "bb", "self-employed-income": "se",
  buydown: "bd", "rent-vs-buy": "rvb",
};

(async () => {
  await new Promise((x) => server.listen(0, "127.0.0.1", x));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new", args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log("   JS ERROR " + e.message));

  let cases = 0, fields = 0, mismatches = 0;

  for (const [slug, grid] of Object.entries(GRIDS)) {
    const prefix = IDS[slug];
    console.log(`\n── ${slug}`);
    for (const inputs of grid) {
      await page.goto(`${base}/mortgage-guides/calculators/${slug}/`, { waitUntil: "networkidle0", timeout: 60000 });
      await page.evaluate((ins, pre) => {
        for (const [k, v] of Object.entries(ins)) {
          const el = document.getElementById(pre + "-" + k);
          if (!el) throw new Error("no input " + pre + "-" + k);
          el.value = String(v);
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }, inputs, prefix);

      const expected = MODELS[slug](inputs);
      const actual = await page.evaluate((ids) => Object.fromEntries(
        ids.map((id) => [id, (document.getElementById(id) || {}).textContent?.trim() ?? "(missing)"])
      ), Object.keys(expected));

      cases++;
      const bad = [];
      for (const k of Object.keys(expected)) {
        fields++;
        if (actual[k] !== expected[k]) { bad.push(`${k}: page=${actual[k]}  independent=${expected[k]}`); mismatches++; }
      }
      const sig = Object.values(inputs).join("/");
      if (bad.length) { console.log(`   MISMATCH  ${sig}`); bad.forEach((b) => console.log(`      ${b}`)); }
      else console.log(`   ok  ${sig}`);
    }
  }

  console.log("\n" + "=".repeat(76));
  console.log(`${cases} cases, ${fields} fields compared against an independent implementation`);
  console.log(mismatches === 0 ? "NO DISAGREEMENTS" : `${mismatches} DISAGREEMENT(S)`);

  await browser.close();
  server.close();
})();
