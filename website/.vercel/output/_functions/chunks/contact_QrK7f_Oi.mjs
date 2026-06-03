const prerender = false;
const ALLOWED_DOMAIN = "cliffcomortgage.com";
function validateRecipients(raw) {
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.endsWith(`@${ALLOWED_DOMAIN}`));
}
const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    const firstName = data.get("first_name")?.trim() ?? "";
    const lastName = data.get("last_name")?.trim() ?? "";
    const email = data.get("email")?.trim() ?? "";
    const phone = data.get("phone")?.trim() ?? "";
    const purpose = data.get("purpose")?.trim() ?? "";
    const state = data.get("state")?.trim() ?? "";
    const notes = data.get("notes")?.trim() ?? "";
    const formTo = data.get("form_to")?.trim() ?? "";
    const tcpa = data.get("tcpa_consent")?.trim() ?? "";
    const formSource = data.get("form_source")?.trim() ?? "website";
    if (!firstName || !lastName || !email || !phone || !purpose || !state || !tcpa) {
      return new Response(
        JSON.stringify({ error: "Please fill in all required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const recipients = validateRecipients(formTo);
    if (!recipients.length) {
      return new Response(
        JSON.stringify({ error: "Invalid form configuration." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const apiKey = undefined                                ;
    const fromEmail = undefined                                    ?? "website@cliffcomortgage.com";
    if (!apiKey) {
      console.error("SENDGRID_API_KEY not set");
      return new Response(
        JSON.stringify({ error: "Email service not configured." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(apiKey);
    const subject = `New Lead from cliffcomortgage.com — ${firstName} ${lastName}`;
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#0d0d0d;border-bottom:2px solid #6633cc;padding-bottom:12px;">
          New Mortgage Inquiry
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;width:160px;">Name</td>
              <td style="padding:8px 0;font-weight:600;">${firstName} ${lastName}</td></tr>
          <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">Email</td>
              <td style="padding:8px 4px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">Phone</td>
              <td style="padding:8px 0;"><a href="tel:${phone.replace(/\D/g, "")}">${phone}</a></td></tr>
          <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">Looking to</td>
              <td style="padding:8px 4px;">${purpose}</td></tr>
          <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">Property state</td>
              <td style="padding:8px 0;">${state}</td></tr>
          ${notes ? `<tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;vertical-align:top;">Notes</td>
              <td style="padding:8px 4px;">${notes}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">Form source</td>
              <td style="padding:8px 0;font-size:12px;color:#888;">${formSource}</td></tr>
          <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">TCPA consent</td>
              <td style="padding:8px 4px;color:#22c55e;font-weight:600;">✓ Agreed</td></tr>
        </table>
        <p style="margin-top:24px;font-size:11px;color:#aaa;">
          Sent from cliffcomortgage.com · ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "America/New_York" })} ET
        </p>
      </div>
    `;
    await sgMail.send({
      to: recipients,
      from: { email: fromEmail, name: "Cliffco Website" },
      replyTo: email,
      subject,
      html
    });
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again or call us directly." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
