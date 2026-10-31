/**
 * Trust copy: how ordering works, the About block, and reviews.
 * Check every line before publishing. Delete anything that is not true.
 */

export const trust = {
  about: {
    eyebrow: 'About us',
    heading: 'Who we are',
    body: 'Bobo Collections is a shop in Adenta, Accra, selling imported shoes, bags and accessories. We select each piece ourselves and confirm stock and price with you on WhatsApp before you pay.',
  },

  steps: [
    {
      title: 'Choose',
      body: 'Browse the shop or the gallery. Pick your item, size and colour.',
    },
    {
      title: 'Send your order',
      body: 'Your order opens in WhatsApp with the details filled in. We reply to confirm stock and price.',
    },
    {
      title: 'Pay and collect',
      body: 'Pay once your order is confirmed. Collect at the shop in Adenta, or ask us about delivery.',
    },
  ],

  /** One plain sentence. Keep it only if it is your real policy. */
  returns: 'Ask us about exchanges before you buy. We will tell you our policy for your piece.',

  /** Shown in the order form. Fill in your real payment details, or delete this line. */
  payment: 'Payment details are sent on WhatsApp once your order is confirmed.',

  /** Real customer reviews only. Leave empty until you have them. Never invent a quote. */
  reviews: [] as {quote: string; name: string}[],
};