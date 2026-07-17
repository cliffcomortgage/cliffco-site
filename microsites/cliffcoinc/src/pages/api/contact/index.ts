import type { APIRoute } from 'astro';

export const prerender = false;

// Serverless on Vercel. Must stay a literal boolean - Astro cannot statically
// analyze expressions here and silently falls back to prerendering.

// All recipients must be @cliffcomortgage.com for security
// Catch-all inboxes that already receive the form's built-in notification.
const CATCH_ALL_RECIPIENTS = new Set(['websiteleads@cliffcomortgage.com', 'cliffcorpteam@cliffcomortgage.com']);
const ALLOWED_DOMAIN = 'cliffcomortgage.com';

// HubSpot is the primary lead destination; SendGrid is the fallback if the
// HubSpot submission fails (and the only path that emails the borrower a
// confirmation until a follow-up email is configured on the HubSpot form).
const HUBSPOT_PORTAL_ID = import.meta.env.HUBSPOT_PORTAL_ID ?? '21616430';
const HUBSPOT_FORM_GUID = import.meta.env.HUBSPOT_FORM_GUID ?? '3cf23f62-cce8-4c0f-acd4-fb27d09cc627';

function validateRecipients(raw: string): string[] {
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.endsWith(`@${ALLOWED_DOMAIN}`));
}

async function submitToHubSpot(lead: {
  firstName: string; lastName: string; email: string; phone: string;
  purpose: string; state: string; notes: string; tcpa: string;
  formSource: string; recipients: string[];
  hutk: string; pageUri: string; pageName: string;
}): Promise<void> {
  const message = [
    lead.notes,
    lead.state ? `State: ${lead.state}` : '',
    lead.purpose ? `Looking to: ${lead.purpose}` : '',
  ].filter(Boolean).join('\n');

  const payload = {
    fields: [
      { name: 'email', value: lead.email },
      { name: 'firstname', value: lead.firstName },
      { name: 'lastname', value: lead.lastName },
      { name: 'phone', value: lead.phone },
      { name: 'message', value: message },
      { name: 'sms_consent', value: lead.tcpa ? 'true' : 'false' },
      { name: 'product_interest', value: lead.purpose || 'General Inquiry' },
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
      pageName: lead.pageName || undefined,
      hutk: lead.hutk || undefined,
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

async function sendViaSendGrid(lead: {
  firstName: string; lastName: string; email: string; phone: string;
  purpose: string; state: string; notes: string;
  formSource: string; recipients: string[];
}, isFallback: boolean): Promise<void> {
  const apiKey   = import.meta.env.SENDGRID_API_KEY;
  const fromEmail = import.meta.env.SENDGRID_FROM_EMAIL ?? 'website@cliffcomortgage.com';
  if (!apiKey) throw new Error('SENDGRID_API_KEY not set');

  const sgMail = (await import('@sendgrid/mail')).default;
  sgMail.setApiKey(apiKey);

  const subject = `New Lead from cliffcomortgage.com: ${lead.firstName} ${lead.lastName}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
      <h2 style="color:#0d0d0d;border-bottom:2px solid #6633cc;padding-bottom:12px;">
        New Mortgage Inquiry
      </h2>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;width:160px;">Name</td>
            <td style="padding:8px 0;font-weight:600;">${lead.firstName} ${lead.lastName}</td></tr>
        <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">Email</td>
            <td style="padding:8px 4px;"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">Phone</td>
            <td style="padding:8px 0;"><a href="tel:${lead.phone.replace(/\D/g,'')}">${lead.phone}</a></td></tr>
        <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">Looking to</td>
            <td style="padding:8px 4px;">${lead.purpose}</td></tr>
        <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">State</td>
            <td style="padding:8px 0;">${lead.state}</td></tr>
        ${lead.notes ? `<tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;vertical-align:top;">Notes</td>
            <td style="padding:8px 4px;">${lead.notes}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#5a5d5d;font-size:13px;">Form source</td>
            <td style="padding:8px 0;font-size:12px;color:#888;">${lead.formSource}</td></tr>
        <tr style="background:#f9f8fa;"><td style="padding:8px 4px;color:#5a5d5d;font-size:13px;">TCPA consent</td>
            <td style="padding:8px 4px;color:#22c55e;font-weight:600;">✓ Agreed</td></tr>
        ${isFallback ? `<tr><td style="padding:8px 0;color:#c00;font-size:12px;" colspan="2">
            The HubSpot submission failed for this lead. This email is the only record. Check HubSpot before assuming it was recorded.</td></tr>` : ''}
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
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    const firstName   = (data.get('first_name')   as string | null)?.trim() ?? '';
    const lastName    = (data.get('last_name')    as string | null)?.trim() ?? '';
    const email       = (data.get('email')        as string | null)?.trim() ?? '';
    const phone       = (data.get('phone')        as string | null)?.trim() ?? '';
    const purpose     = (data.get('purpose')      as string | null)?.trim() ?? '';
    const state       = (data.get('state')        as string | null)?.trim() ?? '';
    const notes       = (data.get('notes')        as string | null)?.trim() ?? '';
    const formTo      = (data.get('form_to')      as string | null)?.trim() ?? '';
    const tcpa        = (data.get('tcpa_consent') as string | null)?.trim() ?? '';
    const formSource  = (data.get('form_source')  as string | null)?.trim() ?? 'website';
    const honeypot    = (data.get('website')      as string | null)?.trim() ?? '';
    const hutk        = (data.get('hutk')         as string | null)?.trim() ?? '';
    const pageUri     = (data.get('page_uri')     as string | null)?.trim() ?? '';
    const pageName    = (data.get('page_name')    as string | null)?.trim() ?? '';

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

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !purpose || !state || !tcpa) {
      return new Response(
        JSON.stringify({ error: 'Please fill in all required fields.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate recipients
    const recipients = validateRecipients(formTo);
    if (!recipients.length) {
      return new Response(
        JSON.stringify({ error: 'Invalid form configuration.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = {
      firstName, lastName, email, phone, purpose, state, notes, tcpa,
      formSource, recipients, hutk, pageUri, pageName,
    };

    // Dual delivery:
    //  - HubSpot: CRM record + corporate catch-all notification (form settings)
    //  - SendGrid: routed notification email directly to the page's recipients
    //    (the LO/team in formTo), plus fallback record if HubSpot fails.
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
      endpoint: 'contact',
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
    console.error('Contact form error:', detail);
    return new Response(
      JSON.stringify({ error: 'We couldn\'t send your message right now. Please try again or call us at (800) 834-4040, Mon–Fri 9am–6pm ET.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
