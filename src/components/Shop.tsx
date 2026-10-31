import {brand, visit} from '../content';
import {useReveals} from '../hooks/useReveals';
import {navigate} from '../lib/router';

/** Where to buy: online through the gallery and WhatsApp, and the physical shop. */
export function Shop() {
  const ref = useReveals<HTMLElement>();
  const {online, physical} = visit;

  return (
    <section ref={ref} id="visit" aria-labelledby="visit-title" className="relative bg-ink px-6 py-28 sm:px-8 md:px-[6vw] md:py-40">
      <div className="grid gap-16 border-t border-bone/10 pt-20 md:grid-cols-2 md:gap-24 md:pt-28">
        <div data-reveal>
          <p className="label text-gold">{visit.eyebrow}</p>
          <h2 id="visit-title" className="mt-4 font-display text-display font-light text-bone">
            {visit.heading}
          </h2>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="label rounded-[2px] bg-gold px-6 py-3.5 text-ink transition-colors hover:bg-bone"
            >
              Browse the gallery
            </button>
            <a
              href={brand.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label rounded-[2px] border border-bone/40 px-6 py-3.5 text-bone transition-colors hover:border-gold hover:text-gold"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div data-reveal className="space-y-12">
          <div>
            <p className="label text-taupe">{online.label}</p>
            <p className="mt-3 max-w-[32rem] text-body text-bone/75">{online.body}</p>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-6 inline-block border-b border-gold/50 pb-1.5 text-gold transition-colors hover:border-gold hover:text-bone"
            >
              Instagram {brand.handle}
            </a>
          </div>

          <div>
            <p className="label text-taupe">{physical.label}</p>
            <address className="mt-3 not-italic text-body leading-relaxed text-bone/75">
              {physical.street}
              <br />
              {physical.area}
              <br />
              {physical.hours}
            </address>
            <a
              href={physical.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label mt-6 inline-block border-b border-gold/50 pb-1.5 text-gold transition-colors hover:border-gold hover:text-bone"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}