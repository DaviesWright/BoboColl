import {ShopCarousel} from './ShopCarousel';
import {useMemo, useState} from 'react';
import {brand, products, visit, waLink, type Category, type Product} from '../content';
import {home} from '../home';
import {useReveals} from '../hooks/useReveals';
import {navigate} from '../lib/router';

type Filter = 'All' | Category;

const FILTERS: Filter[] = ['All', 'Shoes', 'Bags', 'Accessories'];
/** How many pieces appear on the home page. The full range is in the Gallery. */
const SHOWN = 8;

/** Opens WhatsApp with one item pre-filled, so a customer can order in one tap. */
const orderItem = (p: Product) => {
  const text = ['Order enquiry', `Item: ${p.name} (${p.price})`, 'Quantity: 1'].join('\n');
  window.open(waLink(text), '_blank', 'noopener,noreferrer');
};

/** The shop front: search, filter, featured pieces, visit details, and a link to the atelier. */
export function ShopHome() {
  const ref = useReveals<HTMLElement>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (filter === 'All' || p.category === filter) &&
        (q === '' || `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q)),
    );
  }, [query, filter]);

  const featured = matches.slice(0, SHOWN);

  return (
    <>
      <section ref={ref} aria-labelledby="home-title" className="bg-canvas px-4 pt-32 pb-12 sm:px-8 md:px-[4vw]">
        <div className="mx-auto max-w-[1200px]">
                    <ShopCarousel />
          <div data-reveal className="max-w-[46rem]">
            <p className="label text-gold">{home.eyebrow}</p>
            <h1 id="home-title" className="mt-3 font-sans text-4xl font-semibold tracking-[-0.03em] text-ink md:text-6xl">
              {home.heading}
            </h1>
            <p className="mt-4 max-w-[36rem] text-base text-ink-soft">{home.intro}</p>
          </div>

          <div data-reveal className="mt-8 flex items-center rounded-pill bg-white pr-2 pl-6 shadow-card">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={home.searchPlaceholder}
              aria-label="Search the shop"
              className="w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-ink-soft"
            />
            <span aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-gold text-white shadow-accent">
              →
            </span>
          </div>

          <div role="group" aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`rounded-pill border px-4 py-2 text-sm transition-colors ${
                  filter === f ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Featured pieces" className="bg-canvas px-4 pb-20 sm:px-8 md:px-[4vw]">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-soft" aria-live="polite">
              {matches.length} pieces found
            </p>
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="text-sm font-medium text-ink underline underline-offset-4 hover:text-gold"
            >
              See all in the gallery
            </button>
          </div>

          {featured.length === 0 ? (
            <p className="mt-10 text-ink-soft">No pieces match that search. Try another word or category.</p>
          ) : (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <li key={p.id} className="flex flex-col rounded-card bg-white p-2 shadow-card">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-tile bg-canvas">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="size-full object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center font-sans text-xl text-ink-soft">{p.category}</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-3 pt-4 pb-3">
                    <h2 className="text-base font-medium tracking-[-0.02em] text-ink">{p.name}</h2>
                    <p className="mt-1 text-sm text-ink-soft">{p.price}</p>
                    <button
                      type="button"
                      onClick={() => orderItem(p)}
                      className="mt-4 rounded-pill bg-gold px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink"
                    >
                      Order on WhatsApp
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-labelledby="visit-title" className="bg-canvas px-4 pb-20 sm:px-8 md:px-[4vw]">
        <div className="mx-auto grid max-w-[1200px] gap-8 rounded-card bg-white p-6 shadow-card md:grid-cols-2 md:p-12" data-reveal>
          <div>
            <p className="label text-gold">{visit.eyebrow}</p>
            <h2 id="visit-title" className="mt-3 font-sans text-3xl font-semibold tracking-[-0.03em] text-ink">
              {visit.heading}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="label text-ink-soft">{visit.online.label}</p>
              <p className="mt-2 text-sm text-ink">{visit.online.body}</p>
              <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-gold">
                Instagram {brand.handle}
              </a>
            </div>
            <div>
              <p className="label text-ink-soft">{visit.physical.label}</p>
              <address className="mt-2 text-sm not-italic text-ink">
                {visit.physical.street}
                <br />
                {visit.physical.area}
                <br />
                {visit.physical.hours}
              </address>
              <a href={visit.physical.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-gold">
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="made-title" className="bg-atelier px-6 py-24 sm:px-8 md:px-[6vw]">
        <div data-reveal className="mx-auto max-w-[1200px] md:flex md:items-end md:justify-between md:gap-12">
          <div>
            <p className="label text-gold">{home.madeEyebrow}</p>
            <h2 id="made-title" className="mt-3 font-display text-display font-light text-bone">
              {home.madeHeading}
            </h2>
            <p className="mt-4 max-w-[34rem] text-body text-bone/70">{home.madeBody}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/atelier')}
            className="label mt-8 rounded-[2px] border border-gold px-6 py-3.5 text-gold transition-colors hover:bg-gold hover:text-ink md:mt-0"
          >
            {home.madeCta}
          </button>
        </div>
      </section>
    </>
  );
}