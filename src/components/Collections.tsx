import type {MouseEvent, ReactElement} from 'react';
import {collections} from '../content';
import {useReveals} from '../hooks/useReveals';
import {scrollToHash} from '../lib/scroll';

/** Line-art drawings of each piece, drawn in the same stitched hand as the hero. */
const ART: Record<string, ReactElement> = {
  Shoes: (
    <g>
      <path d="M28 128 Q40 112 78 110 L118 96 Q140 92 150 106 L172 146 L172 152 L28 152 Z" />
      <path d="M172 152 L180 186 L168 186 L160 152" />
      <path d="M40 140 H150" strokeDasharray="3 5" opacity="0.5" />
    </g>
  ),
  Bags: (
    <g>
      <path d="M62 90 V70 Q62 50 100 50 Q138 50 138 70 V90" />
      <path d="M44 90 H156 L162 160 H38 Z" />
      <path d="M92 118 H108 V130 H92 Z" />
      <path d="M50 104 H150" strokeDasharray="3 5" opacity="0.5" />
    </g>
  ),
  Belts: (
    <g>
      <path d="M20 100 H150 V122 H20 Z" />
      <rect x="150" y="90" width="26" height="42" />
      <path d="M160 100 V122" opacity="0.5" />
      <path d="M26 111 H144" strokeDasharray="3 5" opacity="0.5" />
    </g>
  ),
};

const toBespoke = (e: MouseEvent<HTMLAnchorElement>, value: string) => {
  e.preventDefault();
  const select = document.querySelector<HTMLSelectElement>('#bespoke select[name="piece"]');
  if (select) select.value = value;
  scrollToHash('#bespoke');
};

export function Collections() {
  const ref = useReveals<HTMLElement>();
  return (
    <section ref={ref} id="collections" aria-labelledby="collections-title" className="relative bg-ink px-6 py-28 sm:px-8 md:px-[6vw] md:py-40">
      <div data-reveal className="max-w-[40rem]">
        <p className="label text-gold">{collections.eyebrow}</p>
        <h2 id="collections-title" className="mt-4 font-display text-display font-light text-bone">
          {collections.heading}
        </h2>
      </div>

      <ol className="mt-16 grid gap-px bg-bone/10 md:mt-20 md:grid-cols-3">
        {collections.items.map((item, i) => (
          <li key={item.name} data-reveal style={{transitionDelay: `${i * 120}ms`}} className="flex flex-col bg-ink p-8 md:p-10">
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="h-44 w-full text-gold"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ART[item.name]}
            </svg>

            <h3 className="mt-8 font-display text-[2rem] font-light text-bone">{item.name}</h3>
            <p className="mt-3 max-w-[32ch] text-body text-bone/65">{item.line}</p>
            <a
              href="#bespoke"
              onClick={(e) => toBespoke(e, item.value)}
              className="label mt-10 self-start border-b border-gold/50 pb-1.5 text-gold transition-colors hover:border-gold hover:text-bone"
            >
              {item.enquire}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}