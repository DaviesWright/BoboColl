import {useCatalog} from '../lib/catalog';

const POSITIONS = [
  'left-[2%] top-[10%] w-[30vw] md:w-[190px]',
  'left-[20%] top-[52%] w-[30vw] md:w-[170px]',
  'left-[34%] top-[0%] w-[28vw] md:w-[160px] hidden md:block',
  'right-[30%] top-[6%] w-[28vw] md:w-[160px] hidden md:block',
  'right-[3%] top-[12%] w-[30vw] md:w-[200px]',
  'right-[14%] bottom-[0%] w-[28vw] md:w-[170px] hidden md:block',
  'left-[8%] bottom-[2%] w-[28vw] md:w-[170px] hidden md:block',
];

/** Floating cards around the logo. Shows pieces flagged "featured"; falls back to a spread of the catalogue. */
export function ShopCarousel() {
  const {items} = useCatalog();
  const featured = items.filter((p) => p.featured);
  const tiles = (featured.length ? featured : items.filter((_, i) => i % 3 === 0)).slice(0, 7);

  return (
    <div role="img" aria-label="A selection of pieces from the shop" className="relative mb-12 h-[340px] w-full overflow-hidden md:h-[480px]">
      {tiles.map((p, i) => (
        <div key={p.id} className={`absolute rounded-card bg-white p-2 shadow-card ${POSITIONS[i]}`}>
          <div className="relative aspect-square overflow-hidden rounded-tile bg-canvas">
            {p.image ? (
              <img src={p.image} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center font-sans text-sm text-ink-soft">{p.category}</div>
            )}
            <span className="absolute right-2 bottom-2 rounded-pill bg-gold px-3 py-1 text-xs font-semibold text-white shadow-accent">
              {p.price}
            </span>
          </div>
          <p className="px-1 pt-2 pb-1 text-xs font-medium text-ink">{p.name}</p>
        </div>
      ))}

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <img src="/media/logo.png" alt="" className="w-[min(46vw,300px)] mix-blend-multiply" />
      </div>
    </div>
  );
}