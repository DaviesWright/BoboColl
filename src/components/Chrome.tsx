import {useState, type MouseEvent} from 'react';
import {brand, nav, waLink} from '../content';
import {navigate} from '../lib/router';
import {scrollToHash} from '../lib/scroll';
import {openWhatsApp, track} from '../lib/track';

const GENERAL_MESSAGE = 'Hello Bobo Collections, I have a question about your pieces.';

/** Handles in-site links: page links (starting with /) and section links (starting with #). */
function go(e: MouseEvent<HTMLAnchorElement>, then?: () => void) {
  const href = e.currentTarget.getAttribute('href') ?? '';
  if (!href.startsWith('/') && !href.startsWith('#')) return;
  e.preventDefault();
  then?.();
  if (href.startsWith('/')) {
    navigate(href);
  } else if (window.location.pathname === '/') {
    scrollToHash(href);
  } else {
    navigate('/', href);
  }
}

/** `light` is used on the shop pages, which sit on the bone canvas. */
export function Header({light = false}: {light?: boolean}) {
  const [open, setOpen] = useState(false);
  const fg = light ? 'text-ink' : 'text-bone';
  const linkFg = light ? 'text-ink/70' : 'text-bone/75';
  const logo = light ? 'h-11 w-auto mix-blend-multiply' : 'h-11 w-auto brightness-0 invert';
  const askOnWhatsApp = () => openWhatsApp(waLink(GENERAL_MESSAGE), 'header');

  return (
    <header className={`fixed inset-x-0 top-0 z-50 ${fg}`}>
      <div className="flex items-center justify-between px-5 pt-4 sm:px-8 md:px-[4vw]">
        <a href="/" onClick={(e) => go(e)} className="flex items-center" aria-label={`${brand.name}, home`}>
          <img src="/media/logo.png" alt="" className={logo} />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e)} className={`label ${linkFg} transition-colors hover:text-gold`}>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={askOnWhatsApp}
            className="label rounded-pill bg-gold px-5 py-2.5 text-white transition-colors hover:bg-ink"
          >
            WhatsApp us
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={askOnWhatsApp} className="label rounded-pill bg-gold px-4 py-2 text-white">
            WhatsApp
          </button>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="menu" className={`label ${fg}`}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id="menu"
        inert={!open}
        className={`fixed inset-0 -z-10 flex flex-col justify-center gap-7 bg-ink/95 px-8 text-bone backdrop-blur-xl transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={(e) => go(e, () => setOpen(false))} className="font-display text-[2rem] italic">
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-bone/10 bg-ink px-5 py-10 sm:px-8 md:px-[4vw]">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <img src="/media/logo.png" alt="Bobo Collections" className="h-14 w-auto brightness-0 invert" />
        <span className="label text-taupe">{brand.tagline}</span>
        <span className="label flex flex-wrap gap-6 text-taupe">
          <a href="/" onClick={(e) => go(e)} className="hover:text-gold">Shop</a>
          <a href="/gallery" onClick={(e) => go(e)} className="hover:text-gold">Gallery</a>
          <a href="/atelier" onClick={(e) => go(e)} className="hover:text-gold">Made to measure</a>
          <a
            href={brand.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('whatsapp_click', {source: 'footer'})}
            className="hover:text-gold"
          >
            WhatsApp {brand.phoneDisplay}
          </a>
          <a href={brand.instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('instagram_click')} className="hover:text-gold">
            Instagram {brand.handle}
          </a>
        </span>
      </div>
      <p className="label mt-8 text-taupe/70">
        © {new Date().getFullYear()} Bobo Collections · {brand.address}
      </p>
    </footer>
  );
}