// DELETE /admin/delete: removes an image from R2. Body: { "key": "uploads/..." }

export async function onRequestDelete(context) {
  const { request, env } = context;

  if (!env.IMAGES) {
    return json({ error: "R2 bucket 'IMAGES' is not bound." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  const key = body.key;
  if (!key || typeof key !== "string" || !key.startsWith("uploads/")) {
    return json({ error: "Invalid or missing key." }, 400);
  }

  await env.IMAGES.delete(key);
  return json({ ok: true, key });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}