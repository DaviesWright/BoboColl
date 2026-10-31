// GET /admin/products: returns the saved product list.
// PUT /admin/products: replaces the saved product list. Body: { "products": [...] }
// Protected by _middleware.js, because it lives under /admin/.

const KEY = "data/products.json";
const CATEGORIES = ["Shoes", "Bags", "Accessories"];

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.IMAGES) return json({ error: "R2 bucket 'IMAGES' is not bound." }, 500);

  const obj = await env.IMAGES.get(KEY);
  if (!obj) return json({ products: [] });
  return json({ products: await obj.json() });
}

export async function onRequestPut(context) {
  const { request, env } = context;
  if (!env.IMAGES) return json({ error: "R2 bucket 'IMAGES' is not bound." }, 500);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON." }, 400);
  }

  const result = validate(body.products);
  if (result.error) return json({ error: result.error }, 400);

  await env.IMAGES.put(KEY, JSON.stringify(result.products), {
    httpMetadata: { contentType: "application/json" },
  });
  return json({ ok: true, count: result.products.length });
}

function validate(list) {
  if (!Array.isArray(list)) return { error: "products must be a list." };
  if (list.length > 500) return { error: "Too many products (500 maximum)." };

  const seen = new Set();
  const clean = [];

  for (const raw of list) {
    const id = String(raw.id || "").trim();
    if (!/^[a-z0-9-]{1,60}$/.test(id)) {
      return { error: `Invalid id "${id}". Use lowercase letters, numbers and hyphens.` };
    }
    if (seen.has(id)) return { error: `Duplicate id "${id}".` };
    seen.add(id);

    const name = String(raw.name || "").trim().slice(0, 120);
    if (!name) return { error: `Name is missing for ${id}.` };

    if (!CATEGORIES.includes(raw.category)) {
      return { error: `Category for ${id} must be Shoes, Bags or Accessories.` };
    }

    const image = raw.image ? String(raw.image).trim() : "";
    if (image && !image.startsWith("/images/uploads/")) {
      return { error: `Photo for ${id} must come from the uploader.` };
    }

    const position = Number(raw.position);

    clean.push({
      id,
      name,
      category: raw.category,
      description: String(raw.description || "").trim().slice(0, 600),
      price: String(raw.price || "").trim().slice(0, 40) || "On request",
      image: image || undefined,
      position: Number.isFinite(position) ? position : 999,
      featured: raw.featured === true,
      visible: raw.visible !== false,
    });
  }

  clean.sort((a, b) => a.position - b.position);
  return { products: clean };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}