/**
 * Manual authorization-code exchange for the Google Ads refresh token.
 * Use when the loopback sign-in can't complete on this PC (e.g. passkey-only
 * account): sign in on the device that holds the passkey, copy the `code` from
 * the failed 127.0.0.1 redirect URL, and run:
 *
 *   node Code/exchange_code.mjs "<authorization_code>"
 *
 * The redirect_uri here MUST match the one in the auth URL you opened.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_FILE = join(__dirname, "..", ".env");
const REDIRECT_URI = "http://127.0.0.1:60207";

let code = process.argv[2];
if (!code) {
  console.error('Usage: node Code/exchange_code.mjs "<authorization_code_or_full_redirect_url>"');
  process.exit(1);
}
// Accept either the raw code or the full redirect URL pasted from the browser.
if (code.includes("code=")) {
  code = decodeURIComponent(code.split("code=")[1].split("&")[0]);
}

const env = readFileSync(ENV_FILE, "utf8");
const vars = {};
for (const l of env.split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}

const res = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: vars.GOOGLE_ADS_CLIENT_ID,
    client_secret: vars.GOOGLE_ADS_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  }),
});
const data = await res.json();

if (data.error) {
  console.error("EXCHANGE FAILED:", data.error, data.error_description || "");
  process.exit(1);
}
if (!data.refresh_token) {
  console.error("No refresh_token in response:", JSON.stringify(data));
  process.exit(1);
}

const newEnv = env.match(/^GOOGLE_ADS_REFRESH_TOKEN=.*$/m)
  ? env.replace(/^GOOGLE_ADS_REFRESH_TOKEN=.*$/m, `GOOGLE_ADS_REFRESH_TOKEN=${data.refresh_token}`)
  : env.trimEnd() + `\nGOOGLE_ADS_REFRESH_TOKEN=${data.refresh_token}\n`;
writeFileSync(ENV_FILE, newEnv, "utf8");

console.log("\n✓ New refresh token written to .env\n");
console.log("GOOGLE_ADS_REFRESH_TOKEN=" + data.refresh_token + "\n");
