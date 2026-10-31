/**
 * Trust copy: how ordering works, the About block, and reviews.
 */

export const trust = {
  about: {
    eyebrow: 'About Bobo Collections',
    heading: 'Imported with care, chosen by hand.',
    body: 'Bobo Collections has been dressing the lady of class for years — sourcing bespoke shoes, bags and accessories from Italy, China, Turkey and the UK. Every piece is hand-selected and checked in person — stitching, hardware, lining and fit — before it earns a place on our shelves. If it would not pass our own standards, it does not reach yours.',
  },

  steps: [
    {
      title: 'Choose a piece',
      body: 'Browse the shop or the gallery. Pick your item, size and colour.',
    },
    {
      title: 'Confirm on WhatsApp',
      body: 'Send your order. We confirm stock, price and delivery with you before you pay.',
    },
    {
      title: 'Pay, then collect or receive',
      body: 'Pay by Mobile Money or bank transfer. Collect from the shop, or arrange delivery.',
    },
  ],

  /** Shown under the steps. Only state a policy you actually keep. */
  returns: 'Unworn items in their original packaging can be exchanged within 3 days of collection or delivery, with your receipt. Bespoke and made-to-measure pieces are made for you alone and cannot be exchanged — we confirm every detail with you before the order is placed.',

  /** Shown in the order form. */
  payment: 'We send our Mobile Money number or bank account details on WhatsApp once your order is confirmed — never pay before you hear from us.',

  /**
   * Real customer reviews only. Leave empty until you have them; the section
   * stays hidden while this list is empty. Never invent a quote.
   */
  reviews: [] as { quote: string; name: string }[],
};