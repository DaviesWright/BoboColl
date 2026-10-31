import {useEffect, useRef, type MouseEvent} from 'react';
import {hero} from '../content';
import {useReducedMotion} from '../hooks/useReducedMotion';
import {easeOutCubic, pinProgress, range} from '../lib/math';
import {onFrame, scrollToHash} from '../lib/scroll';

/**
 * The opening. A red stitch line sews across the page as the visitor
 * scrolls, and the headline lifts away once the stitch is through.
 */

const SECTION_VH = 220;
/** One continuous hand-drawn stitch across the full width. */
const STITCH = 'M-20 330 C 220 190, 420 470, 640 330 S 1040 190, 1220 330';

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const stitchRef = useRef<SVGPathElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const stitch = stitchRef.current!;
    const title = titleRef.current!;
    const hint = hintRef.current!;

    if (reduced) {
      stitch.style.strokeDashoffset = '0';
      title.style.opacity = '1';
      hint.style.opacity = '0';
      return;
    }

    let lastP = -1;
    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const {p, rect} = pinProgress(root);
      if (rect.bottom < 0) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      // The stitch is drawn over the first 60% of the pin.
      stitch.style.strokeDashoffset = String(1 - easeOutCubic(range(p, 0, 0.6)));

      // The headline holds, then lifts and fades as the page moves on.
      const out = range(p, 0.55, 0.9);
      title.style.opacity = String(1 - out);
      title.style.transform = `translate3d(0, ${-p * 14}vh, 0)`;

      hint.style.opacity = String(1 - range(p, 0, 0.08));
    });
  }, [reduced]);

  const toBespoke = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToHash('#bespoke');
  };

  return (
    <section ref={rootRef} aria-labelledby="hero-title" className="relative bg-ink" style={{height: `${SECTION_VH}svh`}}>
      <div className="sticky top-0 flex h-screen-s flex-col items-center justify-center overflow-hidden px-6 text-center">
        <svg
          viewBox="0 0 1200 520"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[60vh] w-full -translate-y-1/2 text-gold"
        >
          <path
            ref={stitchRef}
            d={STITCH}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="1 1"
            strokeDashoffset="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        </svg>

        <div ref={titleRef} className="relative">
          <p className="label text-gold">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-7 font-display text-hero font-light text-bone">
            {hero.title[0]}
            <br />
            <em className="text-gold">{hero.title[1]}</em>
          </h1>
          <a
            href="#bespoke"
            onClick={toBespoke}
            className="label mt-10 inline-block rounded-[2px] border border-bone/40 px-6 py-3.5 text-bone transition-colors hover:border-gold hover:bg-gold hover:text-ink"
          >
            {hero.cta}
          </a>
        </div>

        <p ref={hintRef} aria-hidden="true" className="label absolute bottom-8 text-taupe">
          {hero.hint} ↓
        </p>
      </div>
    </section>
  );
}