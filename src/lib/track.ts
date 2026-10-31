declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends an event to Google Analytics, if it is loaded. Does nothing otherwise. */
export function track(name: string, params: Record<string, string | number> = {}) {
  window.gtag?.('event', name, params);
}

/** Records the click, then opens WhatsApp in a new tab. */
export function openWhatsApp(url: string, source: string, detail = '') {
  track('whatsapp_click', {source, detail});
  window.open(url, '_blank', 'noopener,noreferrer');
}