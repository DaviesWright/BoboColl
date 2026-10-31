import {useMemo, useState} from 'react';
import {products as initial, type Category, type Product} from '../content';

const CATEGORIES: Category[] = ['Shoes', 'Bags', 'Accessories'];

const field = 'w-full rounded-pill border border-line bg-white px-4 py-2 text-sm text-ink outline-none focus:border-gold';
const area = 'w-full rounded-tile border border-line bg-white px-4 py-2 text-sm text-ink outline-none focus:border-gold';

/** Quotes a value as a TypeScript string literal. */
const q = (s: string) => JSON.stringify(s);

/**
 * Private editor for names, descriptions, prices and photos. It changes only
 * this browser's view. To publish, copy the generated code into src/content.ts,
 * add the photos to public/media/products, and commit.
 */
export function Admin() {
  const [items, setItems] = useState<Product[]>(initial);
  const [search, setSearch] = useState('');
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const update = (id: string, patch: Partial<Product>) =>
    setItems((list) => list.map((p) => (p.id === id ? {...p, ...patch} : p)));

  const remove = (id: string) => setItems((list) => list.filter((p) => p.id !== id));

  const add = () => {
    const id = `new-${Date.now().toString(36)}`;
    setItems((list) => [{id, name: 'New piece', category: 'Shoes', description: '', price: 'On request'}, ...list]);
  };

  const choosePhoto = (id: string, file?: File) => {
    if (!file) return;
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `/media/products/${id}.${ext}`;
    setPreviews((m) => ({...m, [id]: URL.createObjectURL(file)}));
    setNotes((m) => ({...m, [id]: `Save the photo as public/media/products/${id}.${ext}`}));
    update(id, {image: path});
  };

  const visible = useMemo(() => {
    const t = search.trim().toLowerCase();
    return t ? items.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(t)) : items;
  }, [items, search]);

  const code = useMemo(() => {
    const lines = items.map((p) => {
      const img = p.image ? `, image: ${q(p.image)}` : '';
      return `  {id: ${q(p.id)}, name: ${q(p.name)}, category: ${q(p.category)}, description: ${q(p.description)}, price: ${q(p.price)}${img}},`;
    });
    return `export const products: Product[] = [\n${lines.join('\n')}\n];`;
  }, [items]);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="admin-title" className="bg-canvas px-4 pt-32 pb-20 sm:px-8 md:px-[4vw]">
      <div className="mx-auto max-w-[1200px]">
        <p className="label text-gold">Private editor</p>
        <h1 id="admin-title" className="mt-3 font-sans text-3xl font-semibold tracking-[-0.03em] text-ink md:text-4xl">
          Update the shop
        </h1>
        <p className="mt-4 max-w-[46rem] text-sm text-ink-soft">
          Edit a piece, set its price, and choose a photo. Changes here do not appear on the live site until you publish them. Follow the
          steps at the bottom of this page.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pieces"
            aria-label="Search pieces"
            className={`${field} max-w-xs`}
          />
          <button type="button" onClick={add} className="rounded-pill bg-gold px-5 py-2 text-sm font-semibold text-white hover:bg-ink">
            Add a piece
          </button>
          <span className="text-sm text-ink-soft">{items.length} pieces</span>
        </div>

        <ul className="mt-8 grid gap-4">
          {visible.map((p) => (
            <li key={p.id} className="grid gap-4 rounded-card bg-white p-4 shadow-card md:grid-cols-[140px_1fr]">
              <div>
                <div className="aspect-square overflow-hidden rounded-tile bg-canvas">
                  {previews[p.id] || p.image ? (
                    <img src={previews[p.id] || p.image} alt="" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-ink-soft">No photo</div>
                  )}
                </div>
                <label className="mt-2 block cursor-pointer text-center text-xs font-medium text-gold">
                  Choose photo
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => choosePhoto(p.id, e.target.files?.[0])} />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <input className={field} value={p.name} onChange={(e) => update(p.id, {name: e.target.value})} aria-label="Name" />
                <select className={field} value={p.category} onChange={(e) => update(p.id, {category: e.target.value as Category})} aria-label="Category">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input className={field} value={p.price} onChange={(e) => update(p.id, {price: e.target.value})} aria-label="Price" placeholder="e.g. GHS 450" />
                <input className={field} value={p.image ?? ''} onChange={(e) => update(p.id, {image: e.target.value || undefined})} aria-label="Photo path" placeholder="/media/products/…" />
                <textarea className={`${area} md:col-span-2`} rows={2} value={p.description} onChange={(e) => update(p.id, {description: e.target.value})} aria-label="Description" />
                <div className="flex items-center justify-between gap-4 md:col-span-2">
                  <p className="text-xs text-ink-soft">{notes[p.id] ?? `ID: ${p.id}`}</p>
                  <button type="button" onClick={() => remove(p.id)} className="text-xs font-medium text-red-600 hover:underline">
                    Remove piece
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-card bg-white p-6 shadow-card md:p-10">
          <h2 className="font-sans text-xl font-semibold text-ink">How to publish your changes</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
            <li>Upload each new photo to the GitHub repository in <code>public/media/products</code>, using the file name shown under the piece.</li>
            <li>Click <strong>Copy code</strong> below.</li>
            <li>In <code>src/content.ts</code>, replace the whole <code>products</code> list with the copied code, and save.</li>
            <li>Commit the change on GitHub. Cloudflare rebuilds the site within a few minutes.</li>
          </ol>
          <button type="button" onClick={copy} className="mt-6 rounded-pill bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-gold">
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <textarea readOnly value={code} rows={10} aria-label="Generated code" className={`${area} mt-6 font-mono text-xs`} />
        </div>
      </div>
    </section>
  );
}