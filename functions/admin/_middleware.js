// Pages Functions middleware: protects all /admin/* routes with HTTP Basic Auth.
// Username: admin. Password: the ADMIN_PASSWORD secret set in Cloudflare.

export async function onRequest(context) {
  const { request, env } = context;

  const expectedPassword = env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return new Response(
      "ADMIN_PASSWORD is not set. Add it in Pages → Settings → Environment variables.",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  const url = new URL(request.url);

  // Logout: a 401 with a different realm makes most browsers discard cached credentials.
  if (url.pathname === "/admin/logout") {
    return new Response(logoutPage(), {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Area: logged out", charset="UTF-8"',
        "Content-Type": "text/html; charset=UTF-8",
      },
    });
  }

  const auth = request.headers.get("Authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const i = decoded.indexOf(":");
      const username = decoded.slice(0, i);
      const password = decoded.slice(i + 1);
      if (username === "admin" && timingSafeEqual(password, expectedPassword)) {
        return context.next();
      }
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
      "Content-Type": "text/plain",
    },
  });
}

function logoutPage() {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Logged out</title></head>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:3rem">
<h1>Logged out</h1>
<p>You have been signed out of the admin area.</p>
<a href="/admin">Log back in</a>
</body></html>`;
}

function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}