// POST /admin/upload: stores an image in R2 and returns its public path.

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.IMAGES) {
    return json({ error: "R2 bucket 'IMAGES' is not bound." }, 500);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return json({ error: "No file provided." }, 400);
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return json({ error: `File type ${file.type} is not allowed.` }, 400);
  }

  if (file.size > 50 * 1024 * 1024) {
    return json({ error: "File too large (50 MB max)." }, 400);
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ts = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
  const key = `uploads/${ts}-${safeName}`;

  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  return json({ key, name: file.name, url: `/images/${key}` });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}