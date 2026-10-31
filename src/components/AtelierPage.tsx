import {atelier, manifesto} from '../content';
import {useReveals} from '../hooks/useReveals';
import {navigate} from '../lib/router';
import {Bespoke} from './Bespoke';

/** The secondary page: the atelier process and the bespoke enquiry form. */
export function AtelierPage() {
  const ref = useReveals<HTMLElement>();

  return (
    <>
      <section ref={ref} aria-labelledby="atelier-title" className="bg-atelier px-6 pt-36 pb-24 sm:px-8 md:px-[6vw]">
        <div data-reveal className="max-w-[46rem]">
          <p className="label text-gold">{atelier.eyebrow}</p>
          <h1 id="atelier-title" className="mt-4 font-display text-display font-light text-bone">
            {atelier.heading}
          </h1>
          <p className="mt-6 max-w-[40rem] text-body text-bone/70">{manifesto.body}</p>
        </div>

        <ol className="mt-16 grid gap-px bg-bone/10 md:grid-cols-2 lg:grid-cols-4">
          {atelier.steps.map((s) => (
            <li key={s.no} data-reveal className="bg-atelier p-8">
              <span className="font-display text-[3rem] leading-none font-light text-gold">{s.no}</span>
              <h2 className="label mt-6 text-bone">{s.title}</h2>
              <p className="mt-4 text-body text-bone/65">{s.body}</p>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="label mt-12 rounded-[2px] border border-bone/40 px-6 py-3.5 text-bone transition-colors hover:border-gold hover:text-gold"
        >
          Back to the shop
        </button>
      </section>

      <Bespoke />
    </>
  );
}