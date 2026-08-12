import type { APIRoute } from 'astro';

// TEMPORARY diagnostic endpoint. Reports whether SMTP2GO_API_KEY is loaded on
// the running function and returns SMTP2GO's raw response for one test send.
// Hardcoded to only ever send to websiteleads@ so it can't be abused as an
// open relay. DELETE this file once SMTP2GO delivery is confirmed working.

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.SMTP2GO_API_KEY;
  const fromEmail = import.meta.env.EMAIL_FROM ?? 'websiteleads@cliffcomortgage.com';

  const report: Record<string, unknown> = {
    keyPresent: Boolean(apiKey),
    keyLength: apiKey ? String(apiKey).length : 0,
    keyStartsWith: apiKey ? String(apiKey).slice(0, 4) : null,
    fromEmail,
  };

  if (!apiKey) {
    report.result = 'SMTP2GO_API_KEY is NOT set on this deployment.';
    return new Response(JSON.stringify(report, null, 2), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Smtp2go-Api-Key': String(apiKey) },
      body: JSON.stringify({
        sender: `Cliffco Website <${fromEmail}>`,
        to: ['websiteleads@cliffcomortgage.com'],
        subject: 'SMTP2Go diagnostic test',
        html_body: '<p>This is a diagnostic test send from /api/smtp-test.</p>',
      }),
    });
    const body = await res.json().catch(() => null);
    report.httpStatus = res.status;
    report.smtp2goResponse = body;
  } catch (err) {
    report.fetchError = String(err);
  }

  return new Response(JSON.stringify(report, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
