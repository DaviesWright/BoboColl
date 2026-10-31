import {useEffect, useState} from 'react';
import {scrollToHash} from './scroll';

/** The current page path. Updates when the back and forward buttons are used. */
export function usePathname(): string {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

/**
 * Changes page without a reload. Scrolls to `hash` on the new page, or to
 * the top when no hash is given.
 */
export function navigate(to: string, hash = '#top') {
  if (window.location.pathname !== to) {
    history.pushState(null, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  // Give the new page a moment to mount before scrolling to it.
  window.setTimeout(() => scrollToHash(hash), 80);
}