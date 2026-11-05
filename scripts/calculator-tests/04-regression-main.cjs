/*
 * Drive all eleven calculators in a real browser against the shipped bundle: the fixes, the
 * edge cases that produced fake numbers, and the presence of the assumptions panel.
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

let FAIL = 0;
function check(label, got, want) {
  const ok = typeof want === "function" ? want(got) : got === want;
  if (!ok) FAIL++;
  console.log(`   ${ok ? "PASS" : "FAIL"}  ${label}: ${got}`);
}

async function run(page, base, slug, inputs, outputs) {
  await page.goto(`${base}/mortgage-guides/calculators/${slug}/`, { waitUntil: "networkidle0", timeout: 60000 });
  if (inputs) {
    await page.evaluate((ins) => {
      for (const [id, v] of Object.entries(ins)) {
        const el = document.getElementById(id);
        if (!el) throw new Error("no such input: " + id);
        el.value = String(v);
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }, inputs);
  }
  return page.evaluate((outs) => {
    const r = Object.fromEntries(
      outs.map((id) => [id, (document.getElementById(id) || {}).textContent?.trim() ?? "(missing)"])
    );
    r.__panel = document.body.textContent.includes("What this calculator assumes");
    return r;
  }, outputs);
}

(async () => {
  await new Promise((x) => server.listen(0, "127.0.0.1", x));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: "new", args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => { FAIL++; console.log("   JS ERROR: " + e.message); });

  let r;

  console.log("\n── AFFORDABILITY ──────────────────────────────────────────────");
  r = await run(page, base, "affordability",
    { "af-income": 8000, "af-debts": 400, "af-savings": 20000, "af-taxes": 6000, "af-ins": 1800 },
    ["af-maxprice", "af-downscen", "af-payment", "af-verdict"]);
  console.log("   compliance inputs: 8000 / 400 / 20000 / 6000 / 1800");
  // Whole savings now goes in: 20,000 down + ~359,232 income-bound loan.
  check("max price (was $69,600, then $373,155 with the holdback)", r["af-maxprice"], "$379,235");
  check("down payment = the full savings figure", r["af-downscen"], "$20,000");
  check("payment lands on the 43% DTI ceiling", r["af-payment"], "$3,040");
  check("binding constraint named", r["af-verdict"], (v) => v.includes("income"));
  check("assumptions panel on page", r.__panel, true);

  r = await run(page, base, "affordability",
    { "af-income": 8000, "af-debts": 400, "af-savings": 12000, "af-taxes": 6000, "af-ins": 1800 },
    ["af-maxprice", "af-verdict"]);
  check("low savings still binds on savings", r["af-verdict"], (v) => v.includes("savings"));
  check("  and prices at savings/3.5%", r["af-maxprice"], "$342,857");

  console.log("\n── MORTGAGE READINESS ─────────────────────────────────────────");
  r = await run(page, base, "mortgage-readiness",
    { "mr-income": 8000, "mr-debts": 400, "mr-savings": 20000, "mr-price": 400000 },
    ["mr-score", "mr-label", "mr-dti", "mr-reserves"]);
  console.log("   8000 / 400 / 20000 savings / 400000 target (5% down = 20,000)");
  check("reserves after the down payment (was 6.6 mo)", r["mr-reserves"], "0.0 mo");
  check("score drops accordingly (was 90)", r["mr-score"], "70");
  check("label", r["mr-label"], "On Track");
  check("DTI unchanged", r["mr-dti"], "42.9%");
  check("assumptions panel on page", r.__panel, true);

  r = await run(page, base, "mortgage-readiness",
    { "mr-income": 8000, "mr-debts": 400, "mr-savings": 100000, "mr-price": 400000 },
    ["mr-score", "mr-reserves"]);
  check("ample savings still scores reserves", r["mr-reserves"], (v) => parseFloat(v) > 20);
  check("  and scores high", r["mr-score"], "90");

  console.log("\n── VA LOAN ────────────────────────────────────────────────────");
  r = await run(page, base, "va-loan", { "va-convrate": 0 }, ["va-monthly", "va-conv"]);
  check("0% conventional rate shows nothing (was $1,761)", r["va-conv"], "-");
  check("  and suppresses the VA side too", r["va-monthly"], "-");
  check("assumptions panel on page", r.__panel, true);

  // The funding fee tier now follows the down payment, so the two cannot contradict. The
  // fee is quoted in the verdict; on $500,000 the base loan is price x (1 - down).
  const fee = async (down, use) => {
    const got = await run(page, base, "va-loan",
      { "va-price": 500000, "va-down": down, "va-use": use }, ["va-fee"]);
    if (/No VA funding fee/.test(got["va-fee"])) return 0;
    const m = got["va-fee"].match(/funding fee of \$([\d,]+)/);
    return m ? Number(m[1].replace(/,/g, "")) : null;
  };
  check("first use, 0% down -> 2.15% of 500,000", await fee(0, "first"), 10750);
  check("first use, 5% down -> 1.5% of 475,000", await fee(5, "first"), 7125);
  check("first use, 10% down -> 1.25% of 450,000", await fee(10, "first"), 5625);
  check("subsequent, 0% down -> 3.3% of 500,000", await fee(0, "subsequent"), 16500);
  // This is the band the old dropdown got wrong: it charged 1.25% where 1.5% is correct.
  check("subsequent, 7% down -> 1.5% of 465,000 (was 1.25%)", await fee(7, "subsequent"), 6975);
  check("subsequent, 10% down -> 1.25% of 450,000", await fee(10, "subsequent"), 5625);
  check("exempt -> no fee", await fee(0, "exempt"), 0);

  // Out-of-range entries used to reach the maths. A rate of 1e9 overflowed to NaN.
  r = await run(page, base, "va-loan", { "va-rate": 999999999 }, ["va-monthly"]);
  check("an absurd rate no longer prints $NaN", r["va-monthly"], (v) => !v.includes("NaN"));
  r = await run(page, base, "va-loan", { "va-down": 999999999 }, ["va-monthly"]);
  check("a down payment over 100% no longer goes negative", r["va-monthly"], (v) => !v.includes("-"));

  console.log("\n── EDGE GUARDS ────────────────────────────────────────────────");
  r = await run(page, base, "self-employed-income", { "se-expratio": 999999999 }, ["se-bankstmt"]);
  check("expense ratio over 100% cannot go negative", r["se-bankstmt"], "$0/mo");
  r = await run(page, base, "affordability",
    { "af-income": 8000, "af-debts": 400, "af-savings": 0, "af-taxes": 6000, "af-ins": 1800 },
    ["af-maxprice", "af-payment", "af-verdict"]);
  check("no savings -> no price", r["af-maxprice"], "$0");
  check("  and no payment printed beside it", r["af-payment"], "-");
  check("  with an explanation", r["af-verdict"], (v) => v.includes("3.5%"));
  r = await run(page, base, "mortgage-readiness",
    { "mr-income": 200, "mr-debts": 0, "mr-savings": 0, "mr-price": 400000 }, ["mr-dti", "mr-score"]);
  check("an extreme DTI is shown, not hidden behind a dash", r["mr-dti"], (v) => v.endsWith("%"));
  r = await run(page, base, "mortgage-readiness",
    { "mr-income": 20000, "mr-debts": 0, "mr-savings": 20000, "mr-price": 400000 },
    ["mr-score", "mr-reserves", "mr-verdict"]);
  check("score 80 with thin reserves no longer says reserves check out",
    r["mr-verdict"], (v) => !v.includes("reserves all check out"));

  console.log("\n── PAYMENT ESTIMATOR ──────────────────────────────────────────");
  r = await run(page, base, "payment-estimator", null, ["pe-total", "pe-pi", "pe-ti"]);
  check("default payment computes", r["pe-total"], (v) => v.startsWith("$"));
  check("assumptions panel on page", r.__panel, true);
  r = await run(page, base, "payment-estimator", { "pe-rate": 0 }, ["pe-total", "pe-pi"]);
  check("cleared rate shows nothing", r["pe-total"], "-");

  console.log("\n── BUDGET BUILDER ─────────────────────────────────────────────");
  r = await run(page, base, "budget-builder", null, ["bb-ceiling", "bb-price"]);
  check("default ceiling", r["bb-ceiling"], "$4,500");
  check("default price computes", r["bb-price"], (v) => v.startsWith("$"));
  check("assumptions panel on page", r.__panel, true);
  r = await run(page, base, "budget-builder", { "bb-rate": 0 }, ["bb-price"]);
  check("cleared rate shows no price", r["bb-price"], "-");

  console.log("\n── BUYDOWN ────────────────────────────────────────────────────");
  r = await run(page, base, "buydown", null, ["bd-321-total", "bd-21-total", "bd-10-total"]);
  check("3-2-1 subsidy computes", r["bd-321-total"], (v) => v.startsWith("$"));
  check("assumptions panel on page", r.__panel, true);
  r = await run(page, base, "buydown", { "bd-rate": 0 }, ["bd-321-total", "bd-21-total"]);
  check("cleared rate clears the totals (was stale)", r["bd-321-total"], "-");
  const rows = await page.evaluate(() => document.getElementById("bd-321-body").children.length);
  check("  and clears the table rows", rows, 0);

  console.log("\n── DSCR ───────────────────────────────────────────────────────");
  r = await run(page, base, "dscr", null, ["dc-dscr", "dc-obligation", "dc-cashflow"]);
  check("ratio computes", r["dc-dscr"], (v) => /^\d\.\d\d$/.test(v));
  check("assumptions panel on page", r.__panel, true);
  r = await run(page, base, "dscr", { "dc-rate": 0 }, ["dc-dscr"]);
  check("cleared rate shows nothing", r["dc-dscr"], "-");

  console.log("\n── REFI CHECKUP ───────────────────────────────────────────────");
  r = await run(page, base, "refi-checkup", null, ["rc-breakeven", "rc-savings", "rc-net5"]);
  check("default case computes", r["rc-breakeven"], (v) => v !== "-");
  check("assumptions panel on page", r.__panel, true);
  // A worse rate: payment goes up, so five years should show the loss AND the closing costs.
  r = await run(page, base, "refi-checkup",
    { "rc-current": 2000, "rc-balance": 380000, "rc-newrate": 9, "rc-closing": 6000 },
    ["rc-breakeven", "rc-savings", "rc-net5"]);
  check("a worse rate never breaks even", r["rc-breakeven"], "Never");
  // newPI at 9% on 380k = ~3,057.7 -> loss 1,057.7/mo -> 60mo = 63,464 + 6,000 closing
  check("five-year net counts the loss, not just closing costs (was -$6,000)",
    r["rc-net5"], (v) => { const n = parseFloat(v.replace(/[^0-9.]/g, "")); return n > 60000; });
  r = await run(page, base, "refi-checkup", { "rc-balance": 0 }, ["rc-breakeven"]);
  check("zero balance produces no break-even", r["rc-breakeven"], "-");

  console.log("\n── RENT VS BUY ────────────────────────────────────────────────");
  r = await run(page, base, "rent-vs-buy", null, ["rvb-breakeven", "rvb-equity5", "rvb-netbuy5"]);
  console.log("   defaults: 500k / 10% down / 7% / rent 2800 / appr 3% / maint 1% / sell 6%");
  check("no longer breaks even in Year 1", r["rvb-breakeven"], (v) => v !== "Year 1");
  check("  break-even is a plausible year", r["rvb-breakeven"],
    (v) => v === "Never" || (parseInt(v.replace(/\D/g, ""), 10) >= 3));
  check("equity at year 5 is net of selling costs", r["rvb-equity5"], (v) => v.startsWith("$"));
  check("no mangled negative currency (was \"$-96,000\")", r["rvb-netbuy5"], (v) => !v.includes("$-"));
  check("assumptions panel on page", r.__panel, true);
  // Zeroing both new costs must reproduce the old, too-generous model exactly.
  r = await run(page, base, "rent-vs-buy", { "rvb-maint": 0, "rvb-sell": 0 }, ["rvb-breakeven"]);
  check("zeroing maintenance and selling costs returns the old Year 1", r["rvb-breakeven"], "Year 1");
  r = await run(page, base, "rent-vs-buy", { "rvb-rate": 0 }, ["rvb-breakeven"]);
  check("cleared rate shows nothing", r["rvb-breakeven"], "-");

  console.log("\n── SELF-EMPLOYED INCOME ───────────────────────────────────────");
  r = await run(page, base, "self-employed-income", null, ["se-better", "se-taxreturn", "se-bankstmt"]);
  // (60000+55000)/2 + 8000 = 65,500/yr = 5,458/mo ; 120000 * 50% / 12 = 5,000/mo
  check("tax-return method", r["se-taxreturn"], "$5,458/mo");
  check("bank-statement method", r["se-bankstmt"], "$5,000/mo");
  check("better of the two", r["se-better"], "$5,458/mo");
  check("assumptions panel on page", r.__panel, true);

  console.log("\n── REVERSE MORTGAGE ───────────────────────────────────────────");
  r = await run(page, base, "reverse-mortgage", null, ["rm-net", "rm-gross", "rm-payoff", "rm-breakdown"]);
  // HUD's table: age 68 at a 7% expected rate is 0.357. 600,000 x 0.357 = 214,200, shown
  // rounded to $215,000. The invented formula gave 0.46 and so $276,000 - about a third high.
  check("principal limit from HUD's table (was $276,000 invented)", r["rm-gross"], "$215,000");
  check("the factor used is shown", r["rm-breakdown"], (v) => v.includes("35.7%"));
  // A range, not a figure: the limit half a point either side of the rate, less the 2% MIP,
  // with the capped origination fee on the low end only, rounded outward to $5,000.
  check("output is a rounded range, not a precise figure", r["rm-net"], "$180,000 – $220,000");
  check("  and nothing is published finer than $5,000", r["rm-net"],
    (v) => v.match(/[\d,]+/g).every((n) => Number(n.replace(/,/g, "")) % 5000 === 0));
  check("assumptions panel on page", r.__panel, true);

  r = await run(page, base, "reverse-mortgage", { "rm-age": 62, "rm-rate": 3 }, ["rm-gross", "rm-breakdown"]);
  // Table floor: age 62 at 3.000% is 0.524, the highest factor a 62-year-old can reach.
  check("table floor rate at 62 uses 0.524", r["rm-breakdown"], (v) => v.includes("52.4%"));
  check("  giving a $314,400 limit, shown as $315,000", r["rm-gross"], "$315,000");
  r = await run(page, base, "reverse-mortgage", { "rm-value": 3000000 }, ["rm-breakdown"]);
  check("a home over the cap counts at the exact 2026 max claim", r["rm-breakdown"], (v) => v.includes("$1,249,125"));
  r = await run(page, base, "reverse-mortgage", { "rm-balance": 250000 }, ["rm-net", "rm-verdict"]);
  check("a mortgage bigger than the limit says cash at closing", r["rm-verdict"], (v) => v.includes("cash at closing"));
  check("  and shows no proceeds", r["rm-net"], "$0");
  r = await run(page, base, "reverse-mortgage", { "rm-age": 60 }, ["rm-gross"]);
  check("under 62 is ineligible", r["rm-gross"], "-");
  r = await run(page, base, "reverse-mortgage", { "rm-rate": 0 }, ["rm-gross"]);
  check("no expected rate, no result", r["rm-gross"], "-");

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(FAIL === 0 ? "ALL CHECKS PASSED" : FAIL + " CHECK(S) FAILED");

  await browser.close();
  server.close();
})();
