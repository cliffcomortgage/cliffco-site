/**
 * Browser behavior shared by the three Homebuyer Advantage pages:
 *   /homebuyer-advantage/            the splash (employee or company?)
 *   /homebuyer-advantage/employees/  the employee page and form
 *   /homebuyer-advantage/companies/  the partnership page and form
 *
 * UTM capture, the advantage_* events, the lead forms and the webinar date filter. Events go
 * to GA4 (window.cliffcoTrack.event, production domain only) and PostHog, each carrying the
 * visit's UTM values so traffic can be reported by partner company (spec section 7).
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
type Attr = Record<(typeof UTM_KEYS)[number] | "landing_url" | "referrer", string>;

/**
 * Attribution for this tab. A partner link's UTMs win; a page reached without UTMs (the
 * employee page after the splash, a reload) keeps the ones the partner link brought in.
 * landing_url and referrer are first-touch: the first Advantage page this tab opened.
 */
function readAttribution(): Attr {
  let stored: Partial<Attr> = {};
  try { stored = JSON.parse(sessionStorage.getItem("adv_attr") || "{}"); } catch {}
  const qs = new URLSearchParams(location.search);
  const fromUrl = UTM_KEYS.some((k) => qs.get(k));
  const attr = {} as Attr;
  for (const k of UTM_KEYS) attr[k] = (fromUrl ? qs.get(k) : stored[k]) || "";
  attr.landing_url = stored.landing_url || location.href;
  attr.referrer = stored.referrer !== undefined ? stored.referrer : document.referrer;
  try { sessionStorage.setItem("adv_attr", JSON.stringify(attr)); } catch {}
  return attr;
}

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function labelText(form: HTMLFormElement, el: Field): string {
  const l = form.querySelector<HTMLLabelElement>(`label[for="${el.id}"]`);
  return (l?.textContent ?? "").replace(/\(optional\)/i, "").trim().toLowerCase();
}

function problem(form: HTMLFormElement, el: Field): string {
  const value = el.value.trim();
  if (el instanceof HTMLInputElement && el.type === "checkbox") {
    return el.required && !el.checked ? "Please check this box so we can contact you." : "";
  }
  if (el.required && !value) {
    if (el instanceof HTMLSelectElement) return "Please choose an option.";
    if (el.type === "email") return "Please enter your email address.";
    if (el.hasAttribute("data-phone")) return "Please enter your phone number.";
    return `Please enter your ${labelText(form, el)}.`;
  }
  if (value && el.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
  if (value && el.hasAttribute("data-phone") && value.replace(/\D/g, "").length < 10) return "Please enter a 10-digit phone number.";
  return "";
}

function showError(el: Field, msg: string) {
  const errEl = document.getElementById(`${el.id}-err`);
  if (!errEl) return;
  errEl.textContent = msg;
  errEl.classList.toggle("hidden", !msg);
  if (msg) el.setAttribute("aria-invalid", "true");
  else el.removeAttribute("aria-invalid");
}

export function initAdvantage() {
  const attr = readAttribution();
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, attr[k]]));
  const utmQuery = new URLSearchParams(Object.entries(utm).filter(([, v]) => v)).toString();

  const track = (name: string, params: Record<string, unknown> = {}) => {
    const payload = { ...utm, ...params };
    const w = window as any;
    w.cliffcoTrack?.event?.(name, payload);
    w.posthog?.capture?.(name, payload);
  };

  // Splash choices carry the partner UTMs onward, so attribution survives the extra click
  // even where sessionStorage is unavailable.
  document.querySelectorAll<HTMLAnchorElement>("a[data-audience]").forEach((a) => {
    if (utmQuery && !a.href.includes("?")) a.href = `${a.href}?${utmQuery}`;
  });

  // CTA, call and audience clicks, anywhere on the page
  document.addEventListener("click", (e) => {
    const t = e.target as HTMLElement | null;
    const cta = t?.closest<HTMLElement>("[data-cta]");
    if (cta) track("advantage_cta_click", { location: cta.dataset.cta });
    const call = t?.closest<HTMLElement>("[data-call]");
    if (call) track("advantage_call_click", { location: call.dataset.call });
    const aud = t?.closest<HTMLElement>("[data-audience]");
    if (aud) track("advantage_audience_select", { audience: aud.dataset.audience });
  });

  // Webinars: drop sessions that have passed since the last build
  const list = document.getElementById("adv-webinars");
  if (list) {
    const now = new Date();
    const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    list.querySelectorAll<HTMLElement>("li[data-date]").forEach((li) => { if ((li.dataset.date ?? "") < todayIso) li.remove(); });
    if (!list.querySelector("li")) {
      list.remove();
      document.getElementById("adv-webinars-empty")?.classList.remove("hidden");
    }
  }

  document.querySelectorAll<HTMLFormElement>(".adv-form").forEach((form) => {
    const variant = form.dataset.variant as "employee" | "employer";
    const set = (name: string, value: string) => {
      const el = form.querySelector<HTMLInputElement>(`[name="${name}"]`);
      if (el) el.value = value;
    };
    set("_loaded", String(Date.now()));
    for (const [k, v] of Object.entries(attr)) set(k, v);

    form.addEventListener("input", () => track("advantage_form_start", { form: variant }), { once: true });

    const fields = () =>
      [...form.querySelectorAll<Field>(".adv-fields input:not([type=hidden]), .adv-fields select, .adv-fields textarea")]
        .filter((el) => !el.closest('[aria-hidden="true"]'));

    // Clear a field's error as soon as it's fixed
    const recheck = (e: Event) => {
      const el = e.target as Field;
      if (el.getAttribute("aria-invalid") === "true" && !problem(form, el)) showError(el, "");
    };
    form.addEventListener("input", recheck);
    form.addEventListener("change", recheck);

    const btn = form.querySelector<HTMLButtonElement>(".adv-submit")!;
    const formErr = form.querySelector<HTMLParagraphElement>(".adv-error")!;
    const live = form.querySelector<HTMLParagraphElement>(".adv-live")!;
    const announce = (msg: string) => { live.textContent = ""; setTimeout(() => { live.textContent = msg; }, 50); };
    const failMsg = `Something went wrong. Please try again or call the program team at ${form.dataset.phone}.`;

    const submit = async () => {
      let first: Field | null = null;
      for (const el of fields()) {
        const msg = problem(form, el);
        showError(el, msg);
        if (msg && !first) first = el;
      }
      if (first) {
        first.focus();
        announce("Please fix the highlighted fields.");
        return;
      }

      formErr.classList.add("hidden");
      const label = btn.textContent ?? "";
      btn.disabled = true;
      btn.textContent = "Sending…";

      const fd = new FormData(form);
      fd.set("form_source", form.dataset.formSource ?? "homebuyer-advantage");
      fd.set("page_uri", location.href);
      fd.set("page_name", document.title);
      const hutk = document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);
      if (hutk) fd.set("hutk", hutk[1]);

      try {
        const res = await fetch("/api/contact/", { method: "POST", body: fd });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) throw new Error(json.error || "server");

        form.querySelector(".adv-fields")?.classList.add("hidden");
        const ok = form.querySelector<HTMLElement>(".adv-success")!;
        ok.classList.remove("hidden");
        ok.focus();
        announce(ok.textContent?.replace(/\s+/g, " ").trim() ?? "Sent.");

        if (variant === "employee") {
          track("advantage_form_submit", { form: variant, purpose: String(fd.get("purpose") ?? ""), timeline: String(fd.get("timeline") ?? "") });
          // Site-wide lead conversion (GA4 generate_lead + Ads "Lead · Form Submit"), per CLAUDE.md
          (window as any).cliffcoTrack?.lead({
            source: form.dataset.formSource,
            product: String(fd.get("purpose") ?? "") || undefined,
            email: String(fd.get("email") ?? ""),
            phone: String(fd.get("phone") ?? ""),
          });
        } else {
          // A partnership inquiry, not a mortgage lead: no Ads lead conversion
          track("advantage_employer_inquiry_submit", { form: variant, headcount: String(fd.get("headcount") ?? "") });
        }
      } catch (err) {
        const msg = err instanceof Error && err.message !== "server" && !/fetch/i.test(err.message) ? err.message : failMsg;
        formErr.textContent = msg;
        formErr.classList.remove("hidden");
        announce(msg);
        btn.disabled = false;
        btn.textContent = label;
      }
    };

    btn.addEventListener("click", submit);
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") { e.preventDefault(); submit(); }
    });
  });
}
