/**
 * get_refresh_token.mjs
 * Node-only replacement for get_refresh_token.py / auth_and_save.py — no Python
 * needed. Runs the Google OAuth "installed app" flow: opens your browser to
 * Google's consent screen, catches the redirect on a local port, exchanges the
 * code for tokens, and writes the fresh refresh token into ../.env.
 *
 * Run: node Code/get_refresh_token.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { createServer } from "http";
import { exec } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CREDS_FILE = join(ROOT, "credentials.json");
const ENV_FILE = join(ROOT, ".env");

const creds = JSON.parse(readFileSync(CREDS_FILE, "utf8")).installed;
const { client_id: CLIENT_ID, client_secret: CLIENT_SECRET } = creds;

const SCOPE = "https://www.googleapis.com/auth/adwords";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://127.0.0.1");
  if (url.pathname !== "/") { res.writeHead(404).end(); return; }

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" }).end(`<h2>Cancelled: ${error}</h2><p>You can close this tab.</p>`);
    console.error(`\n✗ Google returned an error: ${error}`);
    server.close(() => process.exit(1));
    return;
  }
  if (!code) {
    res.writeHead(400).end("Missing authorization code.");
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html" })
     .end("<h2>✓ Success</h2><p>You can close this tab and return to your terminal.</p>");

  const { port } = server.address();
  const redirectUri = `http://127.0.0.1:${port}`;

  try {
    const tr = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri, grant_type: "authorization_code",
      }),
    });
    const tokenJson = await tr.json();
    if (tokenJson.error) throw new Error(`${tokenJson.error}: ${tokenJson.error_description || ""}`);
    if (!tokenJson.refresh_token) {
      throw new Error("No refresh_token in response — Google only issues one on first consent. " +
        "If you've authorized this app before, revoke access at https://myaccount.google.com/permissions and try again.");
    }

    let envText = "";
    try { envText = readFileSync(ENV_FILE, "utf8"); } catch { /* no .env yet */ }
    if (/^GOOGLE_ADS_REFRESH_TOKEN=/m.test(envText)) {
      envText = envText.replace(/^GOOGLE_ADS_REFRESH_TOKEN=.*$/m, `GOOGLE_ADS_REFRESH_TOKEN=${tokenJson.refresh_token}`);
    } else {
      envText += (envText.endsWith("\n") || !envText ? "" : "\n") + `GOOGLE_ADS_REFRESH_TOKEN=${tokenJson.refresh_token}\n`;
    }
    writeFileSync(ENV_FILE, envText);

    console.log(`\n✓ New refresh token saved to ${ENV_FILE}`);
    console.log("✓ Done — you can close this terminal or continue with your next command.\n");
  } catch (err) {
    console.error("\n✗", err.message);
  } finally {
    server.close();
  }
});

server.listen(0, "127.0.0.1", () => {
  const { port } = server.address();
  const redirectUri = `http://127.0.0.1:${port}`;
  const authUrl = "https://accounts.google.com/o/oauth2/auth?" + new URLSearchParams({
    client_id: CLIENT_ID, redirect_uri: redirectUri, response_type: "code",
    scope: SCOPE, access_type: "offline", prompt: "consent",
  });

  console.log("\nOpening your browser to sign in to Google...");
  console.log("If it doesn't open automatically, copy/paste this URL into your browser:\n");
  console.log(authUrl.toString() + "\n");

  exec(`start "" "${authUrl.toString()}"`, () => {});
});
