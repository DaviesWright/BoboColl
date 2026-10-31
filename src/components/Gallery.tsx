import {useState, type FormEvent} from 'react';
import {brand, gallery, waLink, type Category} from '../content';
import {useReveals} from '../hooks/useReveals';
import {useCatalog} from '../lib/catalog';
import {scrollToHash} from '../lib/scroll';
import {openWhatsApp} from '../lib/track';
import {trust} from '../trust';

type Filter = 'All' | Category;
type Status = 'idle' | 'invalid' | 'opened';

const FILTERS: Filter[] = ['All', 'Shoes', 'Bags', 'Accessories'];
/** How many pieces are shown before "Load more" is pressed. */
const PAGE_SIZE = 12;

const base =
  'w-full border border-line bg-white px-5 py-3 text-[15px] text-ink outline-none placeholder:text-ink-soft focus:border-gold user-invalid:border-red-500';
const input = `${base} rounded-pill`;
const area = `${base} rounded-tile resize-none`;

/** Browse the pieces, filter by category, and place an order on WhatsApp. */
export function Gallery() {
  const ref = useReveals<HTMLElement>();
  const {items} = useCatalog();
  const [filter, setFilter] = useState<Filter>('All');
  const [shown, setShown] = useState(PAGE_SIZE);
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [status, setStatus] = useState<Status>('idle');

  const matching = filter === 'All' ? items : items.filter((p) => p.category === filter);
  const visible = matching.slice(0, shown);
  const hasMore = shown < matching.length;

  const chooseFilter = (f: Filter) => {
    setFilter(f);
    setShown(PAGE_SIZE);
  };

  const orderThis = (id: string) => {
    setSelectedId(id);
    setStatus('idle');
    scrollToHash('#order');
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus('invalid');
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const item = items.find((p) => p.id === String(data.get('product')));
    const text = [
      'Order enquiry',
      `Item: ${item ? `${item.name} (${item.price})` : 'Not specified'}`,
      `Size: ${String(data.get('size') || '—')}`,
      `Colour: ${String(data.get('colour') || '—')}`,
      `Quantity: ${String(data.get('quantity'))}`,
      `Delivery: ${String(data.get('delivery'))}`,
      `Name: ${String(data.get('name'))}`,
      `Notes: ${String(data.get('notes') || '—')}`,
    ].join('\n');
    openWhatsApp(waLink(text), 'gallery_order', item?.name ?? 'unspecified');
    setStatus('opened');
  };

  return (
    <>
      <section ref={ref} aria-labelledby="gallery-title" className="bg-canvas px-4 pt-32 pb-16 sm:px-8 md:px-[4vw]">
        <div className="mx-auto max-w-[1200px]">
          <div data-reveal className="max-w-[44rem]">
            <p className="label text-gold">{gallery.eyebrow}</p>
            <h1 id="gallery-title" className="mt-3 font-sans text-3xl font-semibold tracking-[-0.03em] text-ink md:text-4xl">
              {gallery.heading}
            </h1>
            <p className="mt-4 text-base text-ink-soft">{gallery.intro}</p>
          </div>

          <div role="group" aria-label="Filter by category" className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => chooseFilter(f)}
                className={`rounded-pill border px-4 py-2 text-sm transition-colors ${
                  filter === f ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm text-ink-soft" aria-live="polite">
            Showing {visible.length} of {matching.length} pieces
          </p>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.id} className="flex flex-col rounded-card bg-white p-2 shadow-card">
                <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-canvas">
                  {p.image ? (
                    <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="size-full object-cover" />
                  ) : (
                    <div className="flex size-full items-center justify-center font-sans text-xl text-ink-soft">{p.category}</div>
                  )}
                  <span className="absolute top-3 left-3 rounded-pill bg-white px-3 py-1 text-[11px] font-medium tracking-[0.04em] text-ink">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
                  <h2 className="text-base font-medium tracking-[-0.02em] text-ink">{p.name}</h2>
                  {p.description && <p className="mt-1 text-sm text-ink-soft">{p.description}</p>}
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="text-sm font-medium text-ink">{p.price}</span>
                    <button
                      type="button"
                      onClick={() => orderThis(p.id)}
                      className="rounded-pill bg-gold px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ink"
                    >
                      Order this
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setShown((n) => n + PAGE_SIZE)}
                className="rounded-pill border border-ink bg-white px-8 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="order" aria-labelledby="order-title" className="scroll-mt-28 bg-canvas px-4 pb-20 sm:px-8 md:px-[4vw]">
        <div className="mx-auto grid max-w-[1200px] gap-10 rounded-card bg-white p-6 shadow-card md:grid-cols-2 md:gap-16 md:p-12">
          <div data-reveal>
            <p className="label text-gold">Place an order</p>
            <h2 id="order-title" className="mt-3 font-sans text-3xl font-semibold tracking-[-0.03em] text-ink">
              Tell us what you want.
            </h2>
            <p className="mt-4 max-w-[30rem] text-base text-ink-soft">
              Your order opens in WhatsApp with the details filled in. Send it to confirm. We reply with availability, price and delivery
              before you pay.
            </p>
            <p className="mt-4 max-w-[30rem] text-sm text-ink-soft">{trust.payment}</p>
          </div>

          <form noValidate onSubmit={onSubmit} aria-describedby="order-status" className="space-y-4" data-reveal>
            <label className="block">
              <span className="mb-1.5 block px-1 text-xs text-ink-soft">Item</span>
              <select name="product" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={`${input} appearance-none`}>
                {items.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.price}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block px-1 text-xs text-ink-soft">Size</span>
                <input name="size" placeholder="e.g. EU 38" className={input} onInput={() => setStatus('idle')} />
              </label>
              <label className="block">
                <span className="mb-1.5 block px-1 text-xs text-ink-soft">Colour</span>
                <input name="colour" placeholder="e.g. black" className={input} onInput={() => setStatus('idle')} />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="mb-1.5 block px-1 text-xs text-ink-soft">Quantity</span>
                <input name="quantity" type="number" min={1} defaultValue={1} required className={input} onInput={() => setStatus('idle')} />
              </label>
              <label className="block">
                <span className="mb-1.5 block px-1 text-xs text-ink-soft">Delivery</span>
                <select name="delivery" defaultValue="Collect from the shop" className={`${input} appearance-none`}>
                  <option value="Collect from the shop">Collect from the shop</option>
                  <option value="Delivery">Delivery</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block px-1 text-xs text-ink-soft">Name</span>
              <input name="name" required autoComplete="name" placeholder="Your name" className={input} onInput={() => setStatus('idle')} />
            </label>

            <label className="block">
              <span className="mb-1.5 block px-1 text-xs text-ink-soft">Notes</span>
              <textarea name="notes" rows={3} placeholder="Anything else we should know" className={area} />
            </label>

            <button
              type="submit"
              className="w-full rounded-pill bg-gold px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-ink"
            >
              Send order on WhatsApp
            </button>

            <p id="order-status" role="status" className="min-h-[1.25rem] px-1 text-[13px] text-ink-soft">
              {status === 'invalid' && 'Please add your name and a quantity of at least 1.'}
              {status === 'opened' && `WhatsApp should have opened with your order. If not, message us on ${brand.phoneDisplay}.`}
            </p>
          </form>
        </div>
      </section>
    </>
  );
}