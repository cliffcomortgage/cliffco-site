import { defineMiddleware } from 'astro:middleware';

const SESSION_TOKEN = 'cliffco-dash-v1';

export const onRequest = defineMiddleware(async ({ url, cookies, request }, next) => {
  if (!url.pathname.startsWith('/dashboard')) {
    return next();
  }

  const password = import.meta.env.DASHBOARD_PASSWORD;

  // No password set — allow through (local dev fallback)
  if (!password) return next();

  // Already authenticated
  if (cookies.get('dash-auth')?.value === SESSION_TOKEN) {
    return next();
  }

  // Password submitted
  if (request.method === 'POST') {
    const form = await request.formData();
    if ((form.get('password') as string) === password) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/dashboard/',
          'Set-Cookie': `dash-auth=${SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`,
        },
      });
    }
    return new Response(loginPage(true), { status: 401, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new Response(loginPage(false), { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
});

function loginPage(error: boolean): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Dashboard · Cliffco Reverse</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0d0d0d; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .card { background: #fff; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .eyebrow { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #6633cc; margin-bottom: 1.25rem; }
    h1 { font-size: 1.375rem; font-weight: 800; color: #0d0d0d; margin-bottom: 0.35rem; }
    .sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 1.75rem; }
    label { display: block; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #374151; margin-bottom: 0.4rem; }
    input[type=password] { width: 100%; padding: 0.65rem 0.875rem; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; color: #0d0d0d; outline: none; }
    input[type=password]:focus { border-color: #6633cc; box-shadow: 0 0 0 3px rgba(102,51,204,0.12); }
    button { margin-top: 1rem; width: 100%; padding: 0.75rem; background: #6633cc; color: #fff; font-size: 0.9rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #5522bb; }
    .error { margin-top: 0.875rem; font-size: 0.8rem; color: #dc2626; text-align: center; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="eyebrow">Cliffco Reverse · Internal</div>
    <h1>Performance Dashboard</h1>
    <p class="sub">Enter the password to access campaign data.</p>
    <form method="POST">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autofocus autocomplete="current-password" placeholder="••••••••" />
      <button type="submit">Access Dashboard →</button>
      ${error ? '<p class="error">Incorrect password — please try again.</p>' : ''}
    </form>
  </div>
</body>
</html>`;
}
