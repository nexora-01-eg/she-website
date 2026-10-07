/**
 * SHE — Swappable config (Phase A)
 * Every customer-facing value comes from here, never hardcoded in components.
 * Values marked 'TODO' trip the production guard (scripts/guard.mjs).
 */

export const SHE_CONFIG = {
  brand: {
    tagline: 'BE YOU .. ALWAYS',
    instagram: 'https://instagram.com/she.shoes.27',
    facebook: 'TODO',
    tiktok: 'TODO',
    /** E.164 without '+', e.g. '2010...'. TODO blocks launch. */
    whatsapp: 'TODO',
  },
  hero: {
    // Real branch video replaces demo with zero component changes (Concept A postponed).
    media: {
      desktopVideo: null as string | null,
      mobileVideo: null as string | null,
      poster: '/brand/hero-poster.jpg',
      fallbackSequence: 'typographic-butterfly',
    },
    statements: ['BE YOU.', 'OWN YOUR STYLE.', 'BE RARE.', 'MADE TO BE SEEN.'],
    // Config picks 7 featured models (real model codes, Phase B wires to imagery)
    featured: ['BGS01', 'FML01', 'SNK01', 'SRH01', 'BAL01', 'SUE01', 'EXC01'],
    // Editorial hero rails: real SHE campaign shots (brand ambience, not product claims).
    // Replaced by branch-video posters when hero.media arrives (Concept A).
    posters: [
      '/p/SBS685/black_front_0_960.webp',
      '/p/SE-500/black_lifestyle_0_960.webp',
      '/p/SBS613/nocolor_front_0_960.webp',
      '/p/SE-501/black_front_0_960.webp',
      '/p/SBJ787/nocolor_lifestyle_0_960.webp',
      '/p/SE-500/beige_lifestyle_0_960.webp',
      '/p/SBJ752/nocolor_front_0_960.webp',
    ],
  },
  marquee: [
    // Only messages that are currently true. Speed reacts slightly to scroll; direction respects RTL.
    { ar: 'التوصيل لحد باب البيت', en: 'Delivery to your doorstep', active: true },
    { ar: 'اختاري لونك المفضل', en: 'Shop by your color', active: true },
    { ar: 'موديلات جديدة قريب', en: 'New arrivals soon', active: true },
    { ar: 'اطلبي على واتساب في دقيقة', en: 'Order on WhatsApp in a minute', active: true },
    { ar: 'الدفع كاش عند الاستلام', en: 'Cash on delivery', active: true },
    { ar: 'شحن مجاني فوق حد معين', en: 'Free delivery over threshold', active: false },
    { ar: 'عروض حصرية للدايرة القريبة', en: 'Private drops for Inner Circle', active: true },
  ],
  shop: {
    // Phase A: sizes NOT tracked in export → chips with no per-size stock.
    trackSizes: false,
    shoeSizes: ['37', '38', '39', '40', '41', '42'],
  },
  delivery: {
    zones: ['cairo-giza', 'alex', 'delta-canal', 'upper', 'remote'],
    // TODO blocks launch:
    fees: { 'cairo-giza': 'TODO', alex: 'TODO', 'delta-canal': 'TODO', upper: 'TODO', remote: 'TODO' },
    freeDeliveryThreshold: 'TODO',
    cashOnDelivery: true,
  },
  policies: {
    deliveryTimes: 'TODO',
    returns: 'TODO',
    branches: 'TODO',
    hours: 'TODO',
  },
  pixels: { meta: 'TODO', tiktok: 'TODO', ga4: 'TODO' },
  offers: [] as Array<{ slug: string; title: { ar: string; en: string } }>,
  reviews: [] as Array<{ name: string; quote: { ar: string; en: string } }>,
  collections: [] as Array<{ slug: string }>,
  social: [] as Array<{ url: string }>,
} as const;

export type SheConfig = typeof SHE_CONFIG;
