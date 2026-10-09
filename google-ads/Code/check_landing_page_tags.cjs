// Load the live Minnesota HELOC lander and check the conversion plumbing end to end:
// does gtag exist, did the Ads tag load, did HubSpot load, and did the form actually render.
// Read-only - it never submits the form.
// Requires puppeteer-core and a local Chrome. Install with: npm i -D puppeteer-core
const puppeteer = require("puppeteer-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = process.argv[2] || "https://cliffcomn.com/heloc-minnesota/";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--no-first-run"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text().slice(0, 160)); });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  // HubSpot renders asynchronously; give it room.
  await new Promise((r) => setTimeout(r, 6000));

  const state = await page.evaluate(() => {
    const target = document.querySelector("#heloc-lead-form") || document.querySelector("[id$='-lead-form']");
    const iframe = target ? target.querySelector("iframe") : null;
    return {
      hasGtag: typeof window.gtag === "function",
      hasDataLayer: Array.isArray(window.dataLayer),
      dataLayerLen: Array.isArray(window.dataLayer) ? window.dataLayer.length : 0,
      hasHbspt: !!(window.hbspt && window.hbspt.forms),
      targetFound: !!target,
      targetId: target ? target.id : null,
      targetHtmlLen: target ? target.innerHTML.trim().length : 0,
      iframeRendered: !!iframe,
      iframeSrc: iframe ? String(iframe.src).slice(0, 110) : null,
      formEls: document.querySelectorAll("form").length,
    };
  });

  const hit = (frag) => requests.filter((u) => u.includes(frag)).length;

  console.log("URL:", URL);
  console.log("\n=== TAGS ===");
  console.log("  gtag() defined          :", state.hasGtag ? "YES" : "NO  <-- conversion can never fire");
  console.log("  dataLayer present       :", state.hasDataLayer ? `YES (${state.dataLayerLen} entries)` : "NO");
  console.log("  gtag/js script requested:", hit("googletagmanager.com/gtag/js") ? "YES" : "NO");
  console.log("  Google Ads (AW-) config :", hit("AW-17848823591") ? "YES" : "NO  (may be inside the gtag payload)");

  console.log("\n=== HUBSPOT FORM ===");
  console.log("  hbspt.forms available   :", state.hasHbspt ? "YES" : "NO  <-- forms.create() is skipped silently");
  console.log("  embed/v2.js requested   :", hit("hsforms.net/forms/embed/v2.js") ? "YES" : "NO");
  console.log("  target container found  :", state.targetFound ? `YES (#${state.targetId})` : "NO");
  console.log("  container filled        :", state.targetHtmlLen > 0 ? `YES (${state.targetHtmlLen} chars)` : "NO  <-- NOTHING RENDERED");
  console.log("  HubSpot iframe rendered :", state.iframeRendered ? "YES" : "NO");
  if (state.iframeSrc) console.log("  iframe src              :", state.iframeSrc);
  console.log("  <form> elements on page :", state.formEls);

  if (errors.length) {
    console.log("\n=== JS ERRORS ===");
    [...new Set(errors)].slice(0, 8).forEach((e) => console.log("  " + e));
  }

  console.log("\n=== VERDICT ===");
  if (!state.hasGtag) {
    console.log("  gtag is not defined. Even a perfect form submit records nothing.");
  } else if (!state.hasHbspt) {
    console.log("  HubSpot's embed script did not expose hbspt.forms in time. The page guards");
    console.log("  forms.create() behind `if (window.hbspt && window.hbspt.forms)`, so when the");
    console.log("  script is slow or blocked the form never renders AND no error is raised.");
  } else if (!state.iframeRendered || state.targetHtmlLen === 0) {
    console.log("  Tags are fine but no form rendered, so there is nothing to submit.");
  } else {
    console.log("  Tags present and the form rendered. The plumbing looks correct on load;");
    console.log("  the remaining unknown is whether onFormSubmitted actually fires on submit,");
    console.log("  which only a real submission can prove.");
  }
  await browser.close();
})();
