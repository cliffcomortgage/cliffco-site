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
  <title>Dashboard · Cliffco</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Outfit", system-ui, -apple-system, sans-serif; background: #0d0d0d; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .card { background: #fff; border: 2px solid #0d0d0d; border-radius: 16px; padding: 2.5rem; width: 100%; max-width: 380px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .eyebrow { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #5a5d5d; margin-bottom: 1.25rem; }
    h1 { font-size: 1.375rem; font-weight: 700; letter-spacing: -0.02em; color: #0d0d0d; margin-bottom: 0.35rem; }
    .sub { font-size: 0.85rem; color: #6b7280; margin-bottom: 1.75rem; }
    label { display: block; font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #3d4040; margin-bottom: 0.4rem; }
    input[type=password] { width: 100%; padding: 0.65rem 0.875rem; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 0.95rem; color: #0d0d0d; outline: none; }
    input[type=password]:focus { border-color: #0d0d0d; box-shadow: 0 0 0 3px rgba(13,13,13,0.12); }
    button { margin-top: 1rem; width: 100%; padding: 0.75rem; background: #0d0d0d; color: #fff; font-family: inherit; font-size: 0.9rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #262626; }
    .error { margin-top: 0.875rem; font-size: 0.8rem; color: #dc2626; text-align: center; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <img src="/images/cliffco-logo.png" alt="Cliffco Mortgage Bankers" width="1730" height="409" style="height:26px;width:auto;display:block;margin-bottom:1.5rem;" />
    <div class="eyebrow">Internal</div>
    <h1>Performance Dashboard</h1>
    <p class="sub">Enter the password to access campaign data.</p>
    <form method="POST">
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autofocus autocomplete="current-password" placeholder="••••••••" />
      <button type="submit">Access Dashboard →</button>
      ${error ? '<p class="error">Incorrect password. Please try again.</p>' : ''}
    </form>
  </div>
</body>
</html>`;
}
