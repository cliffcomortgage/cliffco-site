/*
 * Run every calculator verification suite and summarise. See README.md.
 *
 *   cd website && npm run build
 *   cd ../scripts/calculator-tests && node run-all.cjs
 *
 * Exits non-zero if anything fails, so it can gate a release.
 */
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const SUITES = [
  ["01-edge-sweep.cjs", "Edge sweep, all 61", /NO DEFECTS FOUND/],
  ["02-differential-embedded.cjs", "Differential, 50 embedded", /NO DISAGREEMENTS/],
  ["03-differential-main.cjs", "Differential, 11 main", /NO DISAGREEMENTS/],
  ["04-regression-main.cjs", "Regression, 11 main", /ALL CHECKS PASSED/],
  ["05-known-values.cjs", "Known values (HUD, VA)", /ALL BLOG MATHS CHECKS PASSED/],
];

const dist = path.join(__dirname, "../../website/dist/client");
if (!fs.existsSync(dist)) {
  console.error("No build found at website/dist/client. Run `npm run build` in website/ first.");
  process.exit(2);
}

let failed = 0;
for (const [file, label, pass] of SUITES) {
  process.stdout.write(`${label.padEnd(32)} `);
  let out = "";
  try {
    out = execFileSync("node", [path.join(__dirname, file)], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch (e) {
    out = String(e.stdout || "") + String(e.stderr || "");
  }
  if (pass.test(out)) {
    console.log("PASS");
  } else {
    failed++;
    console.log("FAIL");
    console.log(out.split("\n").slice(-25).map((l) => "    " + l).join("\n"));
  }
}

console.log("\n" + "=".repeat(60));
console.log(failed === 0 ? "All calculator suites passed." : `${failed} suite(s) failed.`);
process.exit(failed === 0 ? 0 : 1);
