// GET /admin/images: lists uploaded images in R2 as JSON, newest first.

export async function onRequestGet(context) {
  const { env } = context;

  if (!env.IMAGES) {
    return json({ error: "R2 bucket 'IMAGES' is not bound to this Pages project." }, 500);
  }

  const listed = await env.IMAGES.list({ prefix: "uploads/" });
  const images = listed.objects
    .map((obj) => ({
      key: obj.key,
      name: obj.key.split("/").pop(),
      url: `/images/${obj.key}`,
      size: obj.size,
      uploaded: obj.uploaded,
    }))
    .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded));

  return json(images);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}