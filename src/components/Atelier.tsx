import {useEffect, useRef} from 'react';
import {atelier} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {pinProgress, range} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * The four steps of a bespoke piece, on a pinned horizontal track. The
 * track slides sideways as the visitor scrolls down; a hairline fills in
 * step with it. On reduced motion the steps stack vertically instead.
 */

const SECTION_VH = 340;

export function Atelier() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      trackRef.current!.style.transform = 'none';
      barRef.current!.style.transform = 'scaleX(1)';
      return;
    }

    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const k = range(p, 0.03, 0.97);
      const travel = Math.max(0, track.scrollWidth - window.innerWidth);
      track.style.transform = `translate3d(${-k * travel}px, 0, 0)`;
      barRef.current!.style.transform = `scaleX(${k})`;
    });
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="atelier"
      aria-labelledby="atelier-title"
      className="relative bg-atelier"
      style={reduced ? undefined : {height: `${SECTION_VH}svh`}}
    >
      <div
        className={`${
          reduced ? 'py-28' : 'sticky top-0 h-screen-s overflow-hidden pt-28 pb-10 md:pt-32'
        } flex flex-col justify-start`}
      >
        <div className="px-6 sm:px-8 md:px-[6vw]">
          <p className="label text-gold">{atelier.eyebrow}</p>
          <h2 id="atelier-title" className="mt-4 max-w-[22ch] font-display text-display font-light text-bone">
            {atelier.heading}
          </h2>
          <div className="mt-10 h-px w-full bg-bone/10" aria-hidden="true">
            <span ref={barRef} className="block h-px origin-left bg-gold" style={{transform: 'scaleX(0)'}} />
          </div>
        </div>

        <ol
          ref={trackRef}
          className={`mt-12 flex gap-6 px-6 will-change-transform sm:px-8 md:gap-10 md:px-[6vw] ${
            reduced ? 'flex-wrap' : 'flex-nowrap'
          }`}
        >
          {atelier.steps.map((s) => (
            <li
              key={s.no}
              className={`flex shrink-0 flex-col justify-between border-t border-gold/40 pt-8 ${
                reduced ? 'w-full md:w-[calc(50%-1.25rem)]' : 'w-[78vw] md:w-[30vw]'
              }`}
              style={{minHeight: reduced ? undefined : '34vh'}}
            >
              <div>
                <span className="font-display text-[3.5rem] leading-none font-light text-gold">{s.no}</span>
                <h3 className="label mt-8 text-bone">{s.title}</h3>
              </div>
              <p className="mt-10 max-w-[30ch] text-body text-bone/65">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}