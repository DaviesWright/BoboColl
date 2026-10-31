// GET /images/uploads/...: serves uploaded images publicly.
// Outside /admin, so no login is needed. Only files under uploads/ are served.

export async function onRequestGet(context) {
  const { env, params } = context;

  if (!env.IMAGES) {
    return new Response("R2 bucket 'IMAGES' is not bound.", { status: 500 });
  }

  const path = Array.isArray(params.path) ? params.path.join("/") : params.path;
  const key = decodeURIComponent(path || "");

  if (!key.startsWith("uploads/")) {
    return new Response("Not found.", { status: 404 });
  }

  const object = await env.IMAGES.get(key);
  if (!object) {
    return new Response("Image not found.", { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);

  return new Response(object.body, { headers });
}