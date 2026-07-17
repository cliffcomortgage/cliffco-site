import type { APIRoute } from 'astro';

// Prerender behavior is set per-target in astro.config.mjs (astro:route:setup hook).

// Catch-all inboxes that already receive the form's built-in notification.
const CATCH_ALL_RECIPIENTS = new Set(['websiteleads@cliffcomortgage.com', 'cliffcorpteam@cliffcomortgage.com']);
const ALLOWED_DOMAIN = 'cliffcomortgage.com';

// HubSpot is the primary lead destination; SendGrid is the routed
// notification channel (and the fallback record if HubSpot fails).
const HUBSPOT_PORTAL_ID = import.meta.env.HUBSPOT_PORTAL_ID ?? '21616430';
const HUBSPOT_FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? '3cf23f62-cce8-4c0f-acd4-fb27d09cc627';

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

type Lead = {
  name: string; email: string; phone: string;
  state: string; program: string; message: string; notes: string;
  situation: string; incomeType: string; purpose: string;
  creditRange: string; priceRange: string;
  tcpa: string; smsConsent: string;
  formSource: string; recipients: string[];
  pageUri: string;
};

async function submitToHubSpot(lead: Lead): Promise<void> {
  const detailLines = [
    lead.message || lead.notes,
    lead.state       ? `State: ${lead.state}`             : '',
    lead.situation   ? `Situation: ${lead.situation}`     : '',
    lead.incomeType  ? `Income type: ${lead.incomeType}`  : '',
    lead.purpose     ? `Purpose: ${lead.purpose}`         : '',
    lead.creditRange ? `Credit range: ${lead.creditRange}`: '',
    lead.priceRange  ? `Price range: ${lead.priceRange}`  : '',
    lead.program     ? `Interested in: ${lead.program}`   : '',
  ].filter(Boolean).join('\n');

  const nameParts = lead.name.split(/\s+/);
  const firstName = nameParts.slice(0, 1).join(' ');
  const lastName  = nameParts.slice(1).join(' ');

  const payload = {
    fields: [
      { name: 'email', value: lead.email },
      { name: 'firstname', value: firstName },
      { name: 'lastname', value: lastName },
      { name: 'phone', value: lead.phone },
      { name: 'message', value: detailLines },
      { name: 'sms_consent', value: (lead.smsConsent || lead.tcpa) ? 'true' : 'false' },
      { name: 'product_interest', value: lead.program || lead.purpose || 'Pre-Qualification' },
      { name: 'form_source', value: `Website 2.0 - ${lead.formSource}` },
      { name: 'website_page', value: lead.pageUri ? new URL(lead.pageUri).pathname : '' },
      { name: 'corporate_initiatives_name', value: 'corporate_lead_front_deskwebsite' },
      { name: 'notification_route', value: lead.recipients.join(',') },
      // Primary routed recipient (LO/team) for the HubSpot notification
      // workflow - empty when only the catch-all inboxes are on the form,
      // so the workflow can skip leads websiteleads@ already covers.
      { name: 'lead_notification_email', value: lead.recipients.find((r) => !CATCH_ALL_RECIPIENTS.has(r)) ?? '' },
    ],
    context: {
      pageUri: lead.pageUri || undefined,
    },
  };

  const res = await fetch(
    `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HubSpot submission failed: ${res.status} ${text}`);
  }
}

async function sendViaSendGrid(lead: Lead, isFallback: boolean): Promise<void> {
  const apiKey    = import.meta.env.SENDGRID_API_KEY;
  const fromEmail = import.meta.env.SENDGRID_FROM_EMAIL ?? 'website@cliffcomortgage.com';
  if (!apiKey) throw new Error('SENDGRID_API_KEY not set');

  const sgMail = (await import('@sendgrid/mail')).default;
  sgMail.setApiKey(apiKey);

  const subject = `New Lead from cliffcomortgage.com: ${lead.name}`;

  const rows = [
    row('Name',        lead.name),
    row('Email',       `<a href="mailto:${lead.email}">${lead.email}</a>`, true),
    row('Phone',       lead.phone ? `<a href="tel:${lead.phone.replace(/\D/g,'')}">${lead.phone}</a>` : '—'),
    ...(lead.state       ? [row('State',         lead.state,       true)] : []),
    ...(lead.situation   ? [row('Situation',     lead.situation       )] : []),
    ...(lead.incomeType  ? [row('Income type',   lead.incomeType,  true)] : []),
    ...(lead.purpose     ? [row('Purpose',       lead.purpose         )] : []),
    ...(lead.creditRange ? [row('Credit range',  lead.creditRange, true)] : []),
    ...(lead.priceRange  ? [row('Price range',   lead.priceRange      )] : []),
    ...(lead.program     ? [row('Interested in', lead.program,     true)] : []),
    ...((lead.message || lead.notes) ? [row('Message', lead.message || lead.notes, true)] : []),
    row('Form source',   lead.formSource),
    row('TCPA consent',  lead.tcpa    ? '✓ Agreed' : '—',    true),
    row('SMS consent',   lead.smsConsent ? '✓ Agreed' : '—'      ),
    ...(isFallback ? [row('⚠ HubSpot', 'Submission failed. This email is the only record of this lead.', true)] : []),
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
    to: lead.recipients,
    from: { email: fromEmail, name: 'Cliffco Website' },
    replyTo: lead.email,
    subject,
    html,
  });

  // Confirmation to the borrower
  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <div style="border-top:4px solid #6633cc;padding-top:20px;">
        <h2 style="color:#0d0d0d;margin-top:0;">We received your message.</h2>
        <p style="color:#444;line-height:1.6;">
          Hi ${lead.name}, thanks for reaching out to Cliffco. A loan officer will review your
          inquiry and follow up within <strong>1 business day</strong>.
        </p>
        <p style="color:#444;line-height:1.6;">
          If you'd like to speak with someone sooner, call us at
          <a href="tel:+18008344040" style="color:#6633cc;font-weight:600;">(800) 834-4040</a>
          Mon–Fri 9am–6pm ET.
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="font-size:12px;color:#aaa;margin:0;">
          Cliffco Mortgage Bankers · NMLS #65328 ·
          <a href="https://cliffcomortgage.com" style="color:#aaa;">cliffcomortgage.com</a>
        </p>
      </div>
    </div>
  `;

  await sgMail.send({
    to: lead.email,
    from: { email: fromEmail, name: 'Cliffco Mortgage' },
    subject: 'We received your message: a Cliffco loan officer will be in touch',
    html: confirmHtml,
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const name        = (data.get('name')         as string | null)?.trim() ?? '';
    const email       = (data.get('email')        as string | null)?.trim() ?? '';
    const phone       = (data.get('phone')        as string | null)?.trim() ?? '';
    const formTo      = (data.get('form_to')      as string | null)?.trim() ?? '';
    const formSource  = (data.get('form_source')  as string | null)?.trim() ?? 'website';
    const honeypot    = (data.get('website')      as string | null)?.trim() ?? '';

    // Silently discard bot submissions
    if (honeypot) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Reject submissions faster than a human can fill the form (bots submit in ms)
    const loadedStr = (data.get('_loaded') as string | null)?.trim() ?? '';
    const elapsed   = loadedStr ? Date.now() - parseInt(loadedStr, 10) : 0;
    if (!loadedStr || elapsed < 3000) {
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

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

    const lead: Lead = {
      name, email, phone, state, program, message, notes, situation,
      incomeType, purpose, creditRange, priceRange, tcpa, smsConsent,
      formSource, recipients,
      pageUri: request.headers.get('referer') ?? '',
    };

    // Dual delivery: HubSpot for the CRM record + corporate notification,
    // SendGrid for the routed recipients + borrower confirmation.
    // Success requires at least one channel to deliver.
    let hubspotOk = false;
    try {
      await submitToHubSpot(lead);
      hubspotOk = true;
    } catch (hsErr) {
      console.error('HubSpot submission failed:', String(hsErr));
    }

    let sendgridOk = false;
    try {
      await sendViaSendGrid(lead, !hubspotOk);
      sendgridOk = true;
    } catch (sgErr) {
      console.error('SendGrid send failed:', String(sgErr));
    }

    // Independent ledger of every attempted delivery (searchable in Vercel
    // function logs) - HubSpot has returned 200 and silently discarded
    // submissions before, so success responses alone can't be trusted.
    console.log(JSON.stringify({
      evt: 'lead_submission',
      endpoint: 'lead',
      formSource,
      email,
      recipients,
      hubspotOk,
      sendgridOk,
    }));

    if (!hubspotOk && !sendgridOk) {
      return new Response(
        JSON.stringify({ error: 'We couldn\'t send your message right now. Please try again or call us at (800) 834-4040, Mon–Fri 9am–6pm ET.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    const detail = err?.response?.body ? JSON.stringify(err.response.body) : String(err);
    console.error('Lead form error:', detail);
    return new Response(
      JSON.stringify({ error: 'We couldn\'t send your message right now. Please try again or call us at (800) 834-4040, Mon–Fri 9am–6pm ET.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
