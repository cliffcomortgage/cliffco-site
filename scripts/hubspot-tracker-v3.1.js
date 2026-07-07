(function () {
  console.log("HS: CliffCo site-wide tracker v3.1 running");
  var HUBSPOT_PORTAL_ID = "21616430";

  // ===================================================================
  // FORM MAPPING - All confirmed Elementor form IDs
  // v3.1 CHANGES (each marked with [FIX n] below):
  //   [FIX 1] LO-page regex now allows hyphenated slugs (/john-smith/)
  //   [FIX 2] Tracks which form the visitor actually submitted instead
  //           of guessing by form_id / falling back to forms[0]
  //   [FIX 3] Failed captures fire a GA event (hs_capture_failed) so
  //           drops are visible in analytics, not just the console
  //   [FIX 4] Unmapped pages get source_label "Unmapped: /path/" so a
  //           catch-all notification branch in HubSpot can route them
  //           and you can see exactly which pages still need mapping
  // ===================================================================
  var FORM_CONFIGS = {
    "/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "1c31fce",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Homepage Contact",
      product_type: "General Inquiry",
      channel: "dtc"
    },
    "/contact-us/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "06a9555",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Contact Us Page",
      product_type: "General Inquiry",
      channel: "dtc"
    },
    "/conventional-loans/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "956a1b3",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Conventional Loans",
      product_type: "Conventional",
      channel: "dtc"
    },
    "/fha-loans/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "41db705",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "FHA Loans",
      product_type: "FHA",
      channel: "dtc"
    },
    "/va-loans/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "2a44061",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "VA Loans",
      product_type: "VA",
      channel: "dtc"
    },
    "/usda-loans/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "c239542",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "USDA Loans",
      product_type: "USDA",
      channel: "dtc"
    },
    "/refinancing/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "2678564",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Refinancing",
      product_type: "Refinance",
      channel: "dtc"
    },
    "/down-payment-assistance/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "d0a9bfa",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Down Payment Assistance",
      product_type: "Down Payment Assistance",
      channel: "dtc"
    },
    "/condos-co-ops-condotels/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "b1f3103",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Condos/Co-Ops",
      product_type: "Condo/Co-Op",
      channel: "dtc"
    },
    "/reverse-mortgages/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "cd05196",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Reverse Mortgage",
      product_type: "Reverse Mortgage",
      channel: "dtc"
    },
    "/renovation-loan/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "0e8848e",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Renovation Loan",
      product_type: "Renovation",
      channel: "dtc"
    },
    "/non-qm-loans/": {
      hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
      elementor_form_id: "37c0928",
      initiative: "corporate_lead_front_deskwebsite",
      source_label: "Non-QM Loans",
      product_type: "Non-QM",
      channel: "dtc"
    }
  };

  var DEFAULT_CONFIG = {
    hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
    elementor_form_id: null,
    initiative: "Other",
    source_label: "Unknown Page",
    product_type: "General",
    channel: "dtc"
  };

  // [FIX 2] Remember which Elementor form the visitor actually submitted.
  // Elementor fires submit_success on the document, not the form, so
  // without this the script has to guess which form on the page fired.
  var lastSubmittedForm = null;
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (f && f.classList && f.classList.contains("elementor-form")) {
      lastSubmittedForm = f;
      console.log("[HS] Recorded submitted form:", f.querySelector("input[name='form_id']") ? f.querySelector("input[name='form_id']").value : "(no form_id)");
    }
  }, true);

  function detectLoanOfficerPage(path) {
    // [FIX 1] Old pattern /^\/([a-z]+[a-z0-9]*)\/?$/i rejected hyphens,
    // so /john-smith/ never matched. Now allows hyphens and digits.
    var loPagePattern = /^\/([a-z][a-z0-9-]*)\/?$/i;
    var nonLOPages = [
      'contact-us', 'about', 'about-us', 'services', 'blog', 'news', 'careers',
      'privacy', 'privacy-policy', 'terms', 'sitemap', 'investors',
      'foodbazaar', 'foodbazaaremployee',
      'conventional-loans', 'fha-loans', 'va-loans', 'usda-loans',
      'refinancing', 'down-payment-assistance', 'condos-co-ops-condotels',
      'reverse-mortgages', 'renovation-loan', 'non-qm-loans',
      'category', 'tag', 'wp-admin', 'wp-content', 'wp-login',
      'get-started', 'home', 'products', 'faqs', 'licensing', 'ccpa',
      'mortgage-glossary', 'affordability-calculator', 'buydown-calculator',
      'find-a-loan-officer', 'find-a-branch', 'all-open-positions'
    ];
    var match = path.match(loPagePattern);
    if (match && match[1]) {
      var pageName = match[1].toLowerCase();
      if (nonLOPages.indexOf(pageName) === -1) {
        var displayName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        return {
          hubspot_form_id: "d0b95443-21ba-4d37-a381-788bf1c8c268",
          elementor_form_id: null,
          initiative: "loan_officer_lead",
          source_label: displayName + " - LO Page",
          product_type: "LO Direct Lead",
          channel: "retail",
          loan_officer_slug: pageName
        };
      }
    }
    return null;
  }

  function getLOSlug() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    var loConfig = detectLoanOfficerPage(path);
    return loConfig ? loConfig.loan_officer_slug : null;
  }

  function getCurrentFormConfig() {
    var path = window.location.pathname.replace(/\/$/, '') || '/';
    console.log("[HS] Current path:", path);
    if (FORM_CONFIGS[path]) {
      console.log("[HS] Exact config for:", path);
      return FORM_CONFIGS[path];
    }
    if (FORM_CONFIGS[path + '/']) {
      console.log("[HS] Exact config for:", path + '/');
      return FORM_CONFIGS[path + '/'];
    }
    var loConfig = detectLoanOfficerPage(path);
    if (loConfig) {
      console.log("[HS] Detected LO page:", loConfig.source_label);
      return loConfig;
    }
    for (var route in FORM_CONFIGS) {
      if (route !== "/" && path.indexOf(route.replace(/\/$/, '')) === 0) {
        console.log("[HS] Partial config match for:", route);
        return FORM_CONFIGS[route];
      }
    }
    // [FIX 4] Label unmapped pages with their path so (a) a catch-all
    // branch in the HubSpot notification workflow can still route them
    // and (b) the submissions report shows which pages need mapping.
    console.warn("[HS] No config found for:", path, "- using default");
    var fallback = {};
    for (var k in DEFAULT_CONFIG) fallback[k] = DEFAULT_CONFIG[k];
    fallback.source_label = "Unmapped: " + (path || "/");
    return fallback;
  }

  function pickValue(form, selectors) {
    if (typeof selectors === "string") selectors = [selectors];
    for (var i = 0; i < selectors.length; i++) {
      var el = form.querySelector(selectors[i]);
      if (el && el.value && el.value.trim()) return el.value.trim();
    }
    return "";
  }

  function pickChecked(form, selectors) {
    if (typeof selectors === "string") selectors = [selectors];
    for (var i = 0; i < selectors.length; i++) {
      var el = form.querySelector(selectors[i]);
      if (el && el.checked) return true;
    }
    return false;
  }

  function getCk(name) {
    var m = document.cookie.match(new RegExp("(^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[2]) : "";
  }

  function captureUTMs() {
    function getParam(name) {
      var match = window.location.search.match(new RegExp('[?&]' + name + '=([^&]*)'));
      return match ? decodeURIComponent(match[1]) : '';
    }
    function setCk(name, value, days) {
      var d = new Date();
      d.setTime(d.getTime() + (days * 86400000));
      document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
    }
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmParams.forEach(function(param) {
      var val = getParam(param);
      if (val) setCk('cc_' + param, val, 30);
    });
    var gclid = getParam('gclid');
    var fbclid = getParam('fbclid');
    if (gclid) setCk('cc_gclid', gclid, 90);
    if (fbclid) setCk('cc_fbclid', fbclid, 90);
  }

  // [FIX 3] Make silent drops visible: fire a GA event when a capture
  // fails so gaps show up in reporting instead of dying in the console.
  function reportCaptureFailure(reason, config) {
    console.error("[HS] CAPTURE FAILED:", reason, "| page:", window.location.pathname);
    if (typeof gtag !== 'undefined') {
      gtag('event', 'hs_capture_failed', {
        event_category: 'lead_capture',
        event_label: reason,
        page_path: window.location.pathname,
        source_label: config ? config.source_label : 'unknown'
      });
    }
  }

  function fireConversionEvents(config, email, name, phone) {
    var loSlug = getLOSlug();
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        event_category: 'mortgage_lead',
        event_label: config.product_type,
        value: 50.0,
        currency: 'USD',
        lead_source: config.source_label,
        product_interest: config.product_type,
        initiative: config.initiative,
        channel: config.channel || 'dtc',
        loan_officer: loSlug || 'corporate'
      });
      gtag('event', 'conversion', {
        send_to: 'AW-17848823591/PI_xCMX574scEKfe_b5C',
        value: 50.0,
        currency: 'USD'
      });
      gtag('set', 'user_data', {
        email: email || undefined,
        phone_number: phone || undefined
      });
      console.log("[HS] GA4 + Google Ads conversions fired");
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', {
        content_name: config.product_type,
        content_category: config.initiative,
        value: 50.0,
        currency: 'USD'
      });
      console.log("[HS] Meta Lead event fired");
    }
  }

  async function submitToHubSpot(form, config) {
    console.log("[HS] Processing", config.product_type, "lead | Initiative:", config.initiative);
    var name = pickValue(form, [
      "#form-field-name",
      "input[placeholder*='Name' i]",
      "input[name*='name' i]"
    ]);
    // Some forms use separate first/last fields instead of one name field
    var firstField = pickValue(form, ["input[name*='first' i]", "#form-field-first_name"]);
    var lastField  = pickValue(form, ["input[name*='last' i]", "#form-field-last_name"]);
    var email = pickValue(form, [
      "#form-field-email",
      "input[type='email']",
      "input[name*='email' i]",
      "input[placeholder*='email' i]"
    ]);
    var phone = pickValue(form, [
      "#form-field-field_652dc89",
      "#form-field-phone",
      "input[type='tel']",
      "input[type='number']",
      "input[placeholder*='Phone' i]",
      "input[name*='phone' i]"
    ]);
    var message = pickValue(form, [
      "#form-field-message",
      "textarea[placeholder*='Message' i]",
      "textarea[name*='message' i]",
      "textarea"
    ]);
    var branch = pickValue(form, [
      "#form-field-closest_branch",
      "select[name*='branch']"
    ]);
    var smsConsent = pickChecked(form, [
      "#form-field-field_bfdc531",
      "input[name*='sms']",
      "input[name*='consent']"
    ]);
    if (!email) {
      reportCaptureFailure("no_email_found", config);
      return;
    }
    var firstName = firstField || (name ? name.split(/\s+/).slice(0, 1).join(" ") : "");
    var lastName  = lastField  || (name ? name.split(/\s+/).slice(1).join(" ") : "");
    var endpoint =
      "https://api.hsforms.com/submissions/v3/integration/submit/" +
      encodeURIComponent(HUBSPOT_PORTAL_ID) + "/" +
      encodeURIComponent(config.hubspot_form_id);
    var payload = {
      fields: [
        { name: "email", value: email },
        { name: "phone", value: phone },
        { name: "firstname", value: firstName },
        { name: "lastname", value: lastName },
        { name: "message", value: message },
        { name: "sms_consent", value: smsConsent ? "true" : "false" },
        { name: "corporate_initiatives_name", value: config.initiative },
        { name: "lead_source", value: config.source_label },
        { name: "product_interest", value: config.product_type },
        { name: "website_page", value: window.location.pathname },
        { name: "form_source", value: "Website Form - " + config.source_label }
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title + " - " + config.product_type,
        hutk: getCk("hubspotutk") || undefined
      }
    };
    var utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    utmFields.forEach(function(field) {
      var val = getCk('cc_' + field);
      if (val) payload.fields.push({ name: field, value: val });
    });
    if (branch) {
      payload.fields.push({ name: "preferred_branch", value: branch });
    }
    console.log("[HS] Submitting to HubSpot:", config.initiative, "|", config.product_type);
    try {
      var res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        var text = await res.text().catch(function(){ return ""; });
        throw new Error("HubSpot submission failed: " + res.status + " " + text);
      }
      console.log("[HS] SUCCESS! Lead submitted:", config.initiative, "|", email);
      fireConversionEvents(config, email, name || (firstName + " " + lastName), phone);
    } catch (err) {
      reportCaptureFailure("hubspot_api_error", config);
      console.error("[HS] SUBMISSION ERROR:", err);
      throw err;
    }
  }

  function findOurElementorForm(config) {
    var forms = document.querySelectorAll("form.elementor-form");
    if (config.elementor_form_id) {
      for (var i = 0; i < forms.length; i++) {
        var hiddenInput = forms[i].querySelector("input[name='form_id']");
        if (hiddenInput && hiddenInput.value === config.elementor_form_id) {
          return forms[i];
        }
      }
    }
    if (forms.length > 0) return forms[0];
    console.error("[HS] No Elementor forms found on page");
    return null;
  }

  function trackApplyNowClicks() {
    document.addEventListener('click', function(e) {
      if (!e.target || !e.target.closest) return;
      var link = e.target.closest('a[href*="mymortgage-online.com"]');
      if (!link) return;
      var loSlug = getLOSlug();
      console.log("[HS] Apply Now click | LO:", loSlug || "corporate");
      if (typeof gtag !== 'undefined') {
        gtag('event', 'apply_now_click', {
          event_category: 'mortgage_application',
          event_label: loSlug || 'corporate',
          loan_officer: loSlug || 'corporate',
          page_path: window.location.pathname,
          value: 50.0,
          currency: 'USD'
        });
        gtag('event', 'conversion', {
          send_to: 'AW-17848823591/PI_xCMX574scEKfe_b5C',
          value: 50.0,
          currency: 'USD'
        });
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
          content_name: 'Apply Now - ' + (loSlug || 'Corporate'),
          content_category: 'mortgage_application',
          value: 50.0,
          currency: 'USD'
        });
      }
    }, true);
  }

  function trackPhoneClicks() {
    document.addEventListener('click', function(e) {
      if (!e.target || !e.target.closest) return;
      var link = e.target.closest('a[href^="tel:"]');
      if (!link) return;
      var loSlug = getLOSlug();
      console.log("[HS] Phone click | LO:", loSlug || "corporate");
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
          event_category: 'contact',
          event_label: link.href,
          loan_officer: loSlug || 'corporate'
        });
        gtag('event', 'conversion', {
          send_to: 'AW-17848823591/O9SzCMj574scEKfe_b5C',
          value: 25.0,
          currency: 'USD'
        });
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact', {
          content_name: 'Phone Click' + (loSlug ? ' - ' + loSlug : '')
        });
      }
    }, true);
  }

  function bindElementorHook() {
    if (!window.jQuery) {
      setTimeout(bindElementorHook, 500);
      return;
    }
    var config = getCurrentFormConfig();
    console.log("[HS] TRACKER READY:", config.product_type, "|", config.initiative);
    jQuery(document).on("submit_success", function (event, response) {
      console.log("[HS] Elementor form submitted");
      // [FIX 2] Prefer the form the visitor actually submitted; only
      // fall back to the config/form_id guess if we didn't catch it.
      var form = lastSubmittedForm || findOurElementorForm(config);
      if (!form) {
        reportCaptureFailure("no_form_found", config);
        return;
      }
      if (form.dataset.hsSubmitting === "true") return;
      form.dataset.hsSubmitting = "true";
      submitToHubSpot(form, config)
        .then(function() {
          console.log("[HS] HubSpot submission completed");
        })
        .catch(function(err) {
          console.error("[HS] HubSpot submission failed:", err);
        })
        .finally(function() {
          form.dataset.hsSubmitting = "false";
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    captureUTMs();
    trackApplyNowClicks();
    trackPhoneClicks();
    setTimeout(bindElementorHook, 500);
  });
})();
