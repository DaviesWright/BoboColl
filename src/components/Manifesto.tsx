import {useEffect, useRef} from 'react';
import {manifesto} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {useReveals} from '../hooks/useReveals';
import {clamp, pinProgress} from '../lib/math';
import {onFrame} from '../lib/scroll';

/**
 * The statement. The lead paragraph is pinned while each word lights from
 * dim taupe to bone in reading order, scrubbed by scroll position. The body
 * and closing line follow in a plain block below.
 */

const SECTION_VH = 260;

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);
  const revealRef = useReveals<HTMLElement>();
  const reduced = useReducedMotion();
  const words = manifesto.lead.split(' ');

  useEffect(() => {
    if (reduced) {
      wordRefs.current.forEach((el) => (el.style.opacity = '1'));
      return;
    }

    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect, vh} = pinProgress(root);
      if (rect.bottom < 0 || rect.top > vh) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const n = wordRefs.current.length;
      wordRefs.current.forEach((el, i) => {
        const start = (i / n) * 0.75;
        el.style.opacity = String(0.18 + 0.82 * clamp((p - start) / 0.12));
      });
    });
  }, [reduced]);

  return (
    <>
      <section ref={rootRef} aria-labelledby="manifesto-eyebrow" className="relative bg-ink" style={{height: `${SECTION_VH}svh`}}>
        <div className="sticky top-0 flex h-screen-s flex-col justify-center overflow-hidden px-6 sm:px-8 md:px-[10vw]">
          <p id="manifesto-eyebrow" className="label mb-8 text-gold">{manifesto.eyebrow}</p>
          <p className="max-w-[34ch] font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.25] font-light text-bone">
            {words.map((w, i) => (
              <span
                key={`${w}-${i}`}
                ref={(el) => {
                  if (el) wordRefs.current[i] = el;
                }}
                className="inline-block"
                style={{opacity: 0.18}}
              >
                {w}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </section>

      <section ref={revealRef} className="bg-ink px-6 pb-24 sm:px-8 md:px-[10vw]">
        <p data-reveal className="max-w-[60ch] text-body text-bone/70">
          {manifesto.body}
        </p>
        <p data-reveal className="label mt-10 text-gold">
          {manifesto.closing}
        </p>
      </section>
    </>
  );
}