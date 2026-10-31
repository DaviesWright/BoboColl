// GET /api/products: public. Returns only visible products, in position order.

const KEY = "data/products.json";

export async function onRequestGet(context) {
  const { env } = context;
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=60",
  };

  if (!env.IMAGES) return new Response(JSON.stringify({ products: [] }), { headers });

  const obj = await env.IMAGES.get(KEY);
  if (!obj) return new Response(JSON.stringify({ products: [] }), { headers });

  const list = await obj.json();
  const visible = list.filter((p) => p.visible !== false);
  return new Response(JSON.stringify({ products: visible }), { headers });
}