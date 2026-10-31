/**
 * Every word on the page. Contact details come from the Bobo Collections logo.
 * Items marked REPLACE are placeholders for you to fill in.
 */

export const brand = {
  name: 'Bobo Collections',
  wordmark: 'BOBO COLLECTIONS',
  tagline: 'Shoes, bags, clothing & more',
  phoneDisplay: '+233 55 316 1011',
  whatsappNumber: '233553161011',
  whatsappUrl: 'https://wa.me/233553161011',
  handle: '@BoboCollections_',
  instagramUrl: 'https://instagram.com/bobocollections_',
  address: 'Adenta, Accra, Ghana', // REPLACE: Adenta Lotto Kiosk Junction
};

export const nav = [
  {label: 'Shop', href: '/'},
  {label: 'Gallery', href: '/gallery'},
  {label: 'Made to measure', href: '/atelier'},
];

export const hero = {
  eyebrow: 'A bespoke atelier for fine leather goods',
  title: ['Where every step', 'is a statement.'],
  cta: 'Discover the art of bespoke',
  hint: 'Scroll to stitch',
};

export const manifesto = {
  eyebrow: 'The house',
  /** Scrubbed word by word as the section scrolls. */
  lead:
    "True luxury isn't just about what you wear; it's about how it's made for you. At Bobo Collections, we believe that a lady of class deserves more than off-the-rack accessories. We are a bespoke atelier dedicated to the art of fine leather goods. From handcrafted shoes that fit like a second skin to signature handbags and belts designed to cinch your unique silhouette, we curate a world where your style is exclusively yours. Step into sophistication—because you are one of a kind. Welcome to the one-stop destination for the discerning woman.",
  body:
    "Bobo Collections is more than a shop; it is a curated experience in bespoke luxury. We specialize in creating custom ladies' shoes and bags that reflect your inner grace and outer style. Whether you need a statement clutch for a gala or a bespoke belt to complete a tailored look, our collection is designed for the woman who accepts nothing less than perfection.",
  closing: 'Discover the art of bespoke. Discover Bobo Collections.',
};

/** REPLACE: drafted process steps. Edit to match how the atelier works. */
export const atelier = {
  eyebrow: 'The atelier',
  heading: 'Four steps, one piece made for you.',
  steps: [
    {no: '01', title: 'Consultation', body: 'We begin with a conversation about the occasion, the silhouette you love and the way you move.'},
    {no: '02', title: 'Measure', body: 'Your foot, hand or waist is measured, not estimated, so the fit is decided before anything is cut.'},
    {no: '03', title: 'Craft', body: 'Leather is selected and cut, then shaped by hand to your specification.'},
    {no: '04', title: 'Deliver', body: 'The piece is fitted, adjusted and handed over with notes on how to care for it.'},
  ],
};

export const collections = {
  eyebrow: 'Collections',
  heading: 'Shoes, bags and belts, cut to your silhouette.',
  items: [
    {name: 'Shoes', line: 'Handcrafted shoes that fit like a second skin.', enquire: 'Enquire about shoes', value: 'Shoes'},
    {name: 'Bags', line: 'Signature handbags and statement clutches, for the gala or the everyday.', enquire: 'Enquire about bags', value: 'Bags'},
    {name: 'Belts', line: 'Bespoke belts designed to cinch your unique silhouette.', enquire: 'Enquire about belts', value: 'Belts'},
  ],
};

export const bespoke = {
  eyebrow: 'Bespoke enquiry',
  heading: 'Begin your piece.',
  body: 'Tell us what you have in mind. We reply on WhatsApp to arrange a consultation. Nothing is charged at this stage.',
  pieces: ['Shoes', 'Bags', 'Belts', 'Clothing', 'Not sure yet'],
};

/* ------------------------------------------------------------------
   Gallery, shop and ordering
   Every product and address below is a placeholder. Replace them.
   ------------------------------------------------------------------ */

/** Opens a WhatsApp chat with the atelier and fills in the message. */
export const waLink = (text: string) =>
  `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const gallery = {
  eyebrow: 'Gallery',
  heading: 'Imported quality, ready to order.',
  intro:
    'Shoes, bags and accessories we bring in and select ourselves. Choose a piece, then send your order to us on WhatsApp. We confirm size, stock and price before you pay.',
};

export type Category = 'Shoes' | 'Bags' | 'Accessories';

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: string;
  /** Optional photo, e.g. '/media/products/shoe-01.jpg'. Without it, a plain card is shown. */
  image?: string;
};

/** REPLACE: 20 shoes, 18 bags and 12 accessories. Each name starts with "Placeholder". */
export const products: Product[] = [
  {id: 'shoe-01', name: 'Placeholder: Shoe 01', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-02', name: 'Placeholder: Shoe 02', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-03', name: 'Placeholder: Shoe 03', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-04', name: 'Placeholder: Shoe 04', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-05', name: 'Placeholder: Shoe 05', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-06', name: 'Placeholder: Shoe 06', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-07', name: 'Placeholder: Shoe 07', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-08', name: 'Placeholder: Shoe 08', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-09', name: 'Placeholder: Shoe 09', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-10', name: 'Placeholder: Shoe 10', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-11', name: 'Placeholder: Shoe 11', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-12', name: 'Placeholder: Shoe 12', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-13', name: 'Placeholder: Shoe 13', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-14', name: 'Placeholder: Shoe 14', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-15', name: 'Placeholder: Shoe 15', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-16', name: 'Placeholder: Shoe 16', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-17', name: 'Placeholder: Shoe 17', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-18', name: 'Placeholder: Shoe 18', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-19', name: 'Placeholder: Shoe 19', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'shoe-20', name: 'Placeholder: Shoe 20', category: 'Shoes', description: 'REPLACE: description of this shoe.', price: 'On request'},
  {id: 'bag-01', name: 'Placeholder: Bag 01', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-02', name: 'Placeholder: Bag 02', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-03', name: 'Placeholder: Bag 03', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-04', name: 'Placeholder: Bag 04', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-05', name: 'Placeholder: Bag 05', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-06', name: 'Placeholder: Bag 06', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-07', name: 'Placeholder: Bag 07', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-08', name: 'Placeholder: Bag 08', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-09', name: 'Placeholder: Bag 09', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-10', name: 'Placeholder: Bag 10', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-11', name: 'Placeholder: Bag 11', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-12', name: 'Placeholder: Bag 12', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-13', name: 'Placeholder: Bag 13', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-14', name: 'Placeholder: Bag 14', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-15', name: 'Placeholder: Bag 15', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-16', name: 'Placeholder: Bag 16', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-17', name: 'Placeholder: Bag 17', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'bag-18', name: 'Placeholder: Bag 18', category: 'Bags', description: 'REPLACE: description of this bag.', price: 'On request'},
  {id: 'acc-01', name: 'Placeholder: Accessory 01', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-02', name: 'Placeholder: Accessory 02', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-03', name: 'Placeholder: Accessory 03', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-04', name: 'Placeholder: Accessory 04', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-05', name: 'Placeholder: Accessory 05', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-06', name: 'Placeholder: Accessory 06', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-07', name: 'Placeholder: Accessory 07', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-08', name: 'Placeholder: Accessory 08', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-09', name: 'Placeholder: Accessory 09', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-10', name: 'Placeholder: Accessory 10', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-11', name: 'Placeholder: Accessory 11', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
  {id: 'acc-12', name: 'Placeholder: Accessory 12', category: 'Accessories', description: 'REPLACE: description of this accessory.', price: 'On request'},
];

export const visit = {
  eyebrow: 'Shop with us',
  heading: 'Order online, or visit the shop.',
  online: {
    label: 'Online',
    body: 'Browse the gallery and send your order to us on WhatsApp. We confirm size, stock, price and delivery with you before you pay.',
  },
  physical: {
    label: 'Physical shop',
    street: 'Adenta Lotto Kiosk Junction', // REPLACE: confirm the building name
    area: 'Adenta, Accra',
    hours: 'Mon to Sat 07:00 to 19:00',
    mapsUrl: 'REPLACE: Google Maps link',
  },
};