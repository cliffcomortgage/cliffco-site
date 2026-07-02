import type { APIRoute } from 'astro';

export const prerender = process.env.DEPLOY_TARGET === 'pages';

const ALLOWED_DOMAIN = 'cliffcomortgage.com';

function validateRecipients(raw: string): string[] {
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.endsWith(`@${ALLOWED_DOMAIN}`));
}

function row(label: string, value: string, shade = false): string {
  const bg = shade ? 'background:#f9f8fa;' : '';
  return `<tr style="${bg}"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;width:160px;">${label}</td><td style="padding:8px 4px;font-weight:500;">${value}</td></tr>`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name        = (data.get('name')         as string | null)?.trim() ?? '';
    const email       = (data.get('email')        as string | null)?.trim() ?? '';
    const phone       = (data.get('phone')        as string | null)?.trim() ?? '';
    const formTo      = (data.get('form_to')      as string | null)?.trim() ?? '';
    const formSource  = (data.get('form_source')  as string | null)?.trim() ?? 'website';

    // Optional fields
    const state       = (data.get('state')        as string | null)?.trim() ?? '';
    const program     = (data.get('program')      as string | null)?.trim() ?? '';
    const message     = (data.get('message')      as string | null)?.trim() ?? '';
    const notes       = (data.get('notes')        as string | null)?.trim() ?? '';
    const situation   = (data.get('situation')    as string | null)?.trim() ?? '';
    const incomeType  = (data.get('income_type')  as string | null)?.trim() ?? '';
    const purpose     = (data.get('purpose')      as string | null)?.trim() ?? '';
    const creditRange = (data.get('credit_range') as string | null)?.trim() ?? '';
    const priceRange  = (data.get('price_range')  as string | null)?.trim() ?? '';
    const tcpa        = (data.get('tcpa_consent') as string | null)?.trim() ?? '';
    const smsConsent  = (data.get('sms_consent')  as string | null)?.trim() ?? '';

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const recipients = validateRecipients(formTo);
    if (!recipients.length) {
      return new Response(
        JSON.stringify({ error: 'Invalid form configuration.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey    = import.meta.env.SENDGRID_API_KEY;
    const fromEmail = import.meta.env.SENDGRID_FROM_EMAIL ?? 'website@cliffcomortgage.com';

    if (!apiKey) {
      console.error('SENDGRID_API_KEY not set');
      return new Response(
        JSON.stringify({ error: 'Email service not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sgMail = (await import('@sendgrid/mail')).default;
    sgMail.setApiKey(apiKey);

    const subject = `New Lead from cliffcomortgage.com — ${name}`;

    const rows = [
      row('Name',        name),
      row('Email',       `<a href="mailto:${email}">${email}</a>`, true),
      row('Phone',       phone ? `<a href="tel:${phone.replace(/\D/g,'')}">${phone}</a>` : '—'),
      ...(state       ? [row('State',         state,       true)] : []),
      ...(situation   ? [row('Situation',     situation       )] : []),
      ...(incomeType  ? [row('Income type',   incomeType,  true)] : []),
      ...(purpose     ? [row('Purpose',       purpose         )] : []),
      ...(creditRange ? [row('Credit range',  creditRange, true)] : []),
      ...(priceRange  ? [row('Price range',   priceRange      )] : []),
      ...(program     ? [row('Interested in', program,     true)] : []),
      ...((message || notes) ? [row('Message', message || notes, true)] : []),
      row('Form source',   formSource),
      row('TCPA consent',  tcpa    ? '✓ Agreed' : '—',    true),
      row('SMS consent',   smsConsent ? '✓ Agreed' : '—'      ),
    ].join('');

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <h2 style="color:#0d0d0d;border-bottom:2px solid #6633cc;padding-bottom:12px;">
          New Mortgage Inquiry
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-top:16px;">
          ${rows}
        </table>
        <p style="margin-top:24px;font-size:11px;color:#aaa;">
          Sent from cliffcomortgage.com · ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </p>
      </div>
    `;

    await sgMail.send({
      to: recipients,
      from: { email: fromEmail, name: 'Cliffco Website' },
      replyTo: email,
      subject,
      html,
    });

    // Confirmation to the borrower
    const confirmHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
        <div style="border-top:4px solid #6633cc;padding-top:20px;">
          <h2 style="color:#0d0d0d;margin-top:0;">We received your message.</h2>
          <p style="color:#444;line-height:1.6;">
            Hi ${name}, thanks for reaching out to Cliffco. A loan officer will review your
            inquiry and follow up within <strong>1 business day</strong>.
          </p>
          <p style="color:#444;line-height:1.6;">
            If you'd like to speak with someone sooner, call us at
            <a href="tel:+18008344040" style="color:#6633cc;font-weight:600;">(800) 834-4040</a>
            Mon–Fri 9am–6pm ET.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#aaa;margin:0;">
            Cliffco Mortgage Bankers · NMLS #1434752 ·
            <a href="https://cliffcomortgage.com" style="color:#aaa;">cliffcomortgage.com</a>
          </p>
        </div>
      </div>
    `;

    await sgMail.send({
      to: email,
      from: { email: fromEmail, name: 'Cliffco Mortgage' },
      subject: 'We received your message — a Cliffco loan officer will be in touch',
      html: confirmHtml,
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Lead form error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again or call us directly.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
