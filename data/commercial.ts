/**
 * SHE — Commercial demo content layer (MASTER BUILD).
 * Swappable: every section reads from here, never hardcoded in UI.
 * Replace demo entries with real SHE assets/data without rebuilding components.
 * Demo visuals are procedural (CSS/SVG gradients) — zero external requests,
 * zero broken images. Real imagery plugs into `image` / `video` fields later.
 *
 * Structure mirrors spec §41-42:
 *  /assets/brand, /hero, /collections/<slug>, /products/bags|shoes, ...
 * Here represented as data + art tokens.
 */

export type CollectionSlug =
  | 'noir-09' | 'bloom-12' | 'scarlet-21' | 'elan-07'
  | 'muse-18' | 'afterglow-24' | 'form-31';

export interface CollectionDef {
  slug: CollectionSlug;
  number: string;
  name: { ar: string; en: string };
  theme: { ar: string; en: string };
  tagline: { ar: string; en: string };
  story: { ar: string; en: string };
  // Visual identity tokens (replace with real campaign image later)
  art: { bg: string; bg2: string; accent: string; ink: string; image?: string | null };
  graphic: string; // graphic treatment label
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'noir-09', number: '01',
    name: { ar: 'نوار ٠٩', en: 'NOIR 09' },
    theme: { ar: 'غامض · درامي · سينمائي', en: 'Dark · Dramatic · Cinematic' },
    tagline: { ar: 'ادخلي عالم نوار — قوة وأناقة', en: 'Enter NOIR — power & elegance' },
    story: { ar: 'نوار ٠٩ مستوحاة من ليالي المدينة: جلد أسود، ظلال عميقة، ولمسة بينك محسوبة. للحضور اللي ما يتنسيش.', en: 'NOIR 09 is inspired by city nights: black leather, deep shadows, a controlled pink accent. For unforgettable presence.' },
    art: { bg: '#0d0d10', bg2: '#2a0f1e', accent: '#F7008A', ink: '#FFF8F2', image: null },
    graphic: 'glass · shadows · reflections',
  },
  {
    slug: 'bloom-12', number: '02',
    name: { ar: 'بلوم ١٢', en: 'BLOOM 12' },
    theme: { ar: 'أنثوي · مشرق · عضوي', en: 'Feminine · Bright · Organic' },
    tagline: { ar: 'تفتّحي على طريقتك', en: 'Bloom your way' },
    story: { ar: 'بلوم ١٢ احتفال بالأنوثة: كريمي ناعم، بينك دافئ، أخضر متحكم فيه، ولمسات أورانج. خفيف، مبهج، SHE جداً.', en: 'BLOOM 12 celebrates femininity: soft cream, warm pink, controlled green, orange touches. Light, joyful, very SHE.' },
    art: { bg: '#FFF8F2', bg2: '#FBD9E8', accent: '#F7008A', ink: '#111111', image: null },
    graphic: 'organic forms · soft light',
  },
  {
    slug: 'scarlet-21', number: '03',
    name: { ar: 'سكارلت ٢١', en: 'SCARLET 21' },
    theme: { ar: 'جريئة · واثقة · درامية', en: 'Bold · Confident · Dramatic' },
    tagline: { ar: 'للّي ما بتخافش تبان', en: 'For her who dares to be seen' },
    story: { ar: 'سكارلت ٢١: أحمر مستوحى، حضور قوي، قصّات حادة. للمناسبات اللي عايزة statement.', en: 'SCARLET 21: red-inspired, strong presence, sharp cuts. For statement occasions.' },
    art: { bg: '#1a0505', bg2: '#7a0f1f', accent: '#FF5A00', ink: '#FFF8F2', image: null },
    graphic: 'red light · sharp type',
  },
  {
    slug: 'elan-07', number: '04',
    name: { ar: 'إيلان ٠٧', en: 'ÉLAN 07' },
    theme: { ar: 'راقية · مينيمال · متطورة', en: 'Elegant · Minimal · Refined' },
    tagline: { ar: 'الرقي في التفاصيل', en: 'Elegance in details' },
    story: { ar: 'إيلان ٠٧: مينيمال راقي، خامات هادئة، ألوان محايدة بلمسة SHE. للشغل والمناسبات الراقية.', en: 'ÉLAN 07: refined minimal, calm materials, neutrals with a SHE touch. For work & refined occasions.' },
    art: { bg: '#F4F1EA', bg2: '#E4DCCB', accent: '#111111', ink: '#111111', image: null },
    graphic: 'minimal · whitespace',
  },
  {
    slug: 'muse-18', number: '05',
    name: { ar: 'ميوز ١٨', en: 'MUSE 18' },
    theme: { ar: 'فنية · تجريبية · تحريرية', en: 'Artistic · Experimental · Editorial' },
    tagline: { ar: 'فن يتلبس', en: 'Art you wear' },
    story: { ar: 'ميوز ١٨: تجريبية وفنية — أشكال حرة، طبقات تحريرية، ألوان SHE بجرأة محسوبة.', en: 'MUSE 18: experimental & artistic — free forms, editorial layers, bold-but-controlled SHE color.' },
    art: { bg: '#FFF8F2', bg2: '#D8E6A0', accent: '#A8C833', ink: '#111111', image: null },
    graphic: 'editorial collage',
  },
  {
    slug: 'afterglow-24', number: '06',
    name: { ar: 'أفترجلو ٢٤', en: 'AFTERGLOW 24' },
    theme: { ar: 'ليلية · عصرية · حضرية', en: 'Night · Urban · Contemporary' },
    tagline: { ar: 'المدينة بعد منتصف الليل', en: 'The city after midnight' },
    story: { ar: 'أفترجلو ٢٤: ليل المدينة — أسود مع نيون محسوب، بينك وأصفر كإضاءة. للخروجات والسهرات.', en: 'AFTERGLOW 24: city night — black with controlled neon, pink & yellow as light. For nights out.' },
    art: { bg: '#0B0B14', bg2: '#1E1B3A', accent: '#FFC107', ink: '#FFF8F2', image: null },
    graphic: 'neon accents · night grain',
  },
  {
    slug: 'form-31', number: '07',
    name: { ar: 'فورم ٣١', en: 'FORM 31' },
    theme: { ar: 'معمارية · منظمة · حديثة', en: 'Architectural · Structured · Modern' },
    tagline: { ar: 'هندسة الأناقة', en: 'The architecture of elegance' },
    story: { ar: 'فورم ٣١: خطوط معمارية، هياكل واضحة، مينيمال حديث. للّي بتحب النظام والشكل النظيف.', en: 'FORM 31: architectural lines, clear structures, modern minimal. For lovers of order & clean form.' },
    art: { bg: '#EDEDED', bg2: '#CFCFCF', accent: '#FF5A00', ink: '#111111', image: null },
    graphic: 'grid · structure lines',
  },
];

export interface CategoryDef {
  key: string;
  name: { ar: string; en: string };
  blurb: { ar: string; en: string };
  art: { bg: string; bg2: string; accent: string };
}

export const BAG_CATEGORIES: CategoryDef[] = [
  { key: 'tote', name: { ar: 'توتي', en: 'Tote' }, blurb: { ar: 'عملية وأنيقة لليوم كله', en: 'Polished everyday carry' }, art: { bg: '#111111', bg2: '#3a2330', accent: '#F7008A' } },
  { key: 'mini', name: { ar: 'ميني', en: 'Mini' }, blurb: { ar: 'صغيرة بحضور كبير', en: 'Small with big presence' }, art: { bg: '#F7008A', bg2: '#7a0f4a', accent: '#FFC107' } },
  { key: 'clutch', name: { ar: 'كلاتش', en: 'Clutch' }, blurb: { ar: 'رفيقة السهرات', en: 'Evening companion' }, art: { bg: '#0d0d10', bg2: '#2a0f1e', accent: '#FFF8F2' } },
  { key: 'shoulder', name: { ar: 'كتف', en: 'Shoulder' }, blurb: { ar: 'كلاسيكية بلمسة SHE', en: 'Classic with a SHE twist' }, art: { bg: '#FFF8F2', bg2: '#E9D9C8', accent: '#F7008A' } },
  { key: 'crossbody', name: { ar: 'كروس', en: 'Crossbody' }, blurb: { ar: 'حرية الحركة', en: 'Hands-free freedom' }, art: { bg: '#A8C833', bg2: '#4a5a12', accent: '#111111' } },
  { key: 'top-handle', name: { ar: 'يد علوية', en: 'Top-Handle' }, blurb: { ar: 'فخامة هادئة', en: 'Quiet luxury' }, art: { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' } },
  { key: 'bucket', name: { ar: 'باكت', en: 'Bucket' }, blurb: { ar: 'كاجوال شيك', en: 'Casual chic' }, art: { bg: '#FF5A00', bg2: '#7a2a00', accent: '#FFF8F2' } },
  { key: 'statement', name: { ar: 'ستيتمنت', en: 'Statement' }, blurb: { ar: 'قطعة تحكي عنك', en: 'A piece that speaks' }, art: { bg: '#1E1B3A', bg2: '#F7008A', accent: '#FFC107' } },
];

export const SHOE_CATEGORIES: CategoryDef[] = [
  { key: 'heels', name: { ar: 'كعب عالي', en: 'Heels' }, blurb: { ar: 'طول وحضور', en: 'Height & presence' }, art: { bg: '#111111', bg2: '#3a2330', accent: '#F7008A' } },
  { key: 'sneakers', name: { ar: 'سنيكرز', en: 'Sneakers' }, blurb: { ar: 'راحة بستايل', en: 'Comfort with style' }, art: { bg: '#FFF8F2', bg2: '#D8E6A0', accent: '#A8C833' } },
  { key: 'loafers', name: { ar: 'لوفر', en: 'Loafers' }, blurb: { ar: 'كلاسيك يومي', en: 'Everyday classic' }, art: { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' } },
  { key: 'sandals', name: { ar: 'صنادل', en: 'Sandals' }, blurb: { ar: 'صيف وخفة', en: 'Summer lightness' }, art: { bg: '#FFC107', bg2: '#7a5a00', accent: '#111111' } },
  { key: 'boots', name: { ar: 'بوت', en: 'Boots' }, blurb: { ar: 'قوة الشتاء', en: 'Winter power' }, art: { bg: '#0d0d10', bg2: '#33333a', accent: '#FFF8F2' } },
  { key: 'flats', name: { ar: 'فلات', en: 'Flats' }, blurb: { ar: 'نعومة كل يوم', en: 'Everyday softness' }, art: { bg: '#FBD9E8', bg2: '#F7008A', accent: '#111111' } },
  { key: 'mules', name: { ar: 'ميول', en: 'Mules' }, blurb: { ar: 'سهلة وأنيقة', en: 'Easy & chic' }, art: { bg: '#EDEDED', bg2: '#9a9a9a', accent: '#FF5A00' } },
  { key: 'statement-shoes', name: { ar: 'ستيتمنت', en: 'Statement' }, blurb: { ar: 'للمناسبات الكبيرة', en: 'For big moments' }, art: { bg: '#7a0f1f', bg2: '#111111', accent: '#FFC107' } },
];

/* ---------- Products ---------- */

export type ProductKind = 'bag' | 'shoe';

export interface DemoProduct {
  slug: string;
  code: string;
  name: { ar: string; en: string };
  kind: ProductKind;
  category: string; // key into BAG/SHOE_CATEGORIES
  collection: CollectionSlug;
  price: number;
  comparePrice?: number;
  colors: { key: string; ar: string; en: string; hex: string }[];
  angles: ('front' | 'back' | 'left' | 'right' | 'detail' | 'lifestyle')[];
  interior?: boolean;
  story: { ar: string; en: string };
  materials: { ar: string; en: string };
  dimensions?: { ar: string; en: string };
  tags: string[];
  limited?: boolean;
  rating?: number;
  art: { bg: string; bg2: string; accent: string };
  image?: string | null; // real asset slot
}

const BAG_NAMES = [
  ['توتي النهار', 'Jour Tote'], ['ميني بلوم', 'Bloom Mini'], ['كلاتش نوار', 'Noir Clutch'],
  ['شنطة كتف إيلان', 'Élan Shoulder'], ['كروس المدينة', 'City Crossbody'], ['هاندل الملكة', 'Reine Top-Handle'],
  ['باكت الصيف', 'Soleil Bucket'], ['ستيتمنت سكارلت', 'Scarlet Statement'], ['توتي الشغل', 'Bureau Tote'],
  ['ميني الليل', 'Minuit Mini'], ['كلاتش اللؤلؤ', 'Perle Clutch'], ['كتف الفراشة', 'Papillon Shoulder'],
];
const SHOE_NAMES = [
  ['هيلز نوار', 'Noir Heel'], ['سنيكرز بلوم', 'Bloom Sneaker'], ['لوفر إيلان', 'Élan Loafer'],
  ['صندل الشمس', 'Soleil Sandal'], ['بوت الليل', 'Minuit Boot'], ['فلات الفراشة', 'Papillon Flat'],
  ['ميول المدينة', 'City Mule'], ['ستيتمنت السهرة', 'Soirée Statement'], ['هيلز الملكة', 'Reine Heel'],
  ['سنيكرز الغروب', 'Afterglow Runner'], ['صندل البحر', 'Riviera Sandal'], ['بوت الخريف', 'Automne Boot'],
];
const COLOR_SETS = [
  [{ key: 'noir', ar: 'أسود', en: 'Black', hex: '#111111' }, { key: 'rose', ar: 'بينك', en: 'Pink', hex: '#F7008A' }, { key: 'creme', ar: 'كريمي', en: 'Cream', hex: '#FFF8F2' }],
  [{ key: 'beige', ar: 'بيج', en: 'Beige', hex: '#D9C3A5' }, { key: 'bordeaux', ar: 'برغندي', en: 'Burgundy', hex: '#6B1A2A' }, { key: 'gold', ar: 'دهبي', en: 'Gold', hex: '#C9A227' }],
  [{ key: 'white', ar: 'أبيض', en: 'White', hex: '#F5F2EC' }, { key: 'vert', ar: 'أخضر', en: 'Green', hex: '#A8C833' }, { key: 'noir', ar: 'أسود', en: 'Black', hex: '#111111' }],
];

const COLL_ORDER: CollectionSlug[] = ['noir-09', 'bloom-12', 'scarlet-21', 'elan-07', 'muse-18', 'afterglow-24', 'form-31'];
const BAG_CAT_KEYS = ['tote', 'mini', 'clutch', 'shoulder', 'crossbody', 'top-handle', 'bucket', 'statement'];
const SHOE_CAT_KEYS = ['heels', 'sneakers', 'loafers', 'sandals', 'boots', 'flats', 'mules', 'statement-shoes'];

function artFor(i: number) {
  const palettes = [
    { bg: '#111111', bg2: '#3a2330', accent: '#F7008A' },
    { bg: '#FFF8F2', bg2: '#FBD9E8', accent: '#F7008A' },
    { bg: '#7a0f1f', bg2: '#1a0505', accent: '#FF5A00' },
    { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' },
    { bg: '#D8E6A0', bg2: '#FFF8F2', accent: '#A8C833' },
    { bg: '#1E1B3A', bg2: '#0B0B14', accent: '#FFC107' },
    { bg: '#EDEDED', bg2: '#9a9a9a', accent: '#FF5A00' },
  ];
  return palettes[i % palettes.length];
}

function buildBags(): DemoProduct[] {
  const out: DemoProduct[] = [];
  // Hero demo product first: NOIR BAG 01
  out.push({
    slug: 'noir-bag-01', code: 'NOIR BAG 01', name: { ar: 'شنطة نوار ٠١', en: 'NOIR BAG 01' },
    kind: 'bag', category: 'clutch', collection: 'noir-09',
    price: 3450, comparePrice: 3950,
    colors: COLOR_SETS[0], angles: ['front', 'back', 'left', 'right', 'detail', 'lifestyle'], interior: true,
    story: { ar: 'شنطة السهرة الأساسية من نوار ٠٩ — جلد أسود بلمعة محسوبة وقفل أنيق. تتشال كروس أو كلاتش.', en: 'The signature evening bag of NOIR 09 — black leather with controlled shine, convertible strap.' },
    materials: { ar: 'جلد صناعي فاخر، بطانة ساتان، إكسسوار ذهبي', en: 'Premium vegan leather, satin lining, gold hardware' },
    dimensions: { ar: '٢٤ × ١٦ × ٩ سم', en: '24 × 16 × 9 cm' },
    tags: ['evening', 'best-seller'], rating: 4.9,
    art: { bg: '#0d0d10', bg2: '#2a0f1e', accent: '#F7008A' }, image: null,
  });
  for (let i = 1; i < 40; i++) {
    const [ar, en] = BAG_NAMES[i % BAG_NAMES.length];
    const coll = COLL_ORDER[i % COLL_ORDER.length];
    const cat = BAG_CAT_KEYS[i % BAG_CAT_KEYS.length];
    const price = 1450 + ((i * 173) % 2600);
    const hasOffer = i % 4 === 0;
    out.push({
      slug: `bag-${String(i + 1).padStart(2, '0')}-${cat}`,
      code: `SHE-B${String(i + 1).padStart(3, '0')}`,
      name: { ar: `${ar} ${Math.floor(i / BAG_NAMES.length) + 1}`, en: `${en} ${Math.floor(i / BAG_NAMES.length) + 1}` },
      kind: 'bag', category: cat, collection: coll,
      price, comparePrice: hasOffer ? Math.round(price * 1.18) : undefined,
      colors: COLOR_SETS[i % COLOR_SETS.length],
      angles: ['front', 'back', 'left', 'right', 'detail', 'lifestyle'], interior: true,
      story: { ar: `قطعة ${ar} من مجموعة ${coll} — تصميم عملي بلمسة SHE الأنثوية.`, en: `${en} from ${coll} — practical design with a feminine SHE touch.` },
      materials: { ar: 'خامة فاخرة، بطانة قطنية، إكسسوار معدني', en: 'Premium material, cotton lining, metal hardware' },
      dimensions: { ar: '٢٦ × ١٨ × ١٠ سم', en: '26 × 18 × 10 cm' },
      tags: i % 5 === 0 ? ['new'] : i % 3 === 0 ? ['best-seller'] : ['everyday'],
      limited: i % 11 === 0,
      rating: 4.3 + ((i * 7) % 7) / 10,
      art: artFor(i), image: null,
    });
  }
  return out;
}

function buildShoes(): DemoProduct[] {
  const out: DemoProduct[] = [];
  for (let i = 0; i < 40; i++) {
    const [ar, en] = SHOE_NAMES[i % SHOE_NAMES.length];
    const coll = COLL_ORDER[(i + 2) % COLL_ORDER.length];
    const cat = SHOE_CAT_KEYS[i % SHOE_CAT_KEYS.length];
    const price = 1250 + ((i * 149) % 2200);
    const hasOffer = i % 3 === 0;
    out.push({
      slug: `shoe-${String(i + 1).padStart(2, '0')}-${cat}`,
      code: `SHE-S${String(i + 1).padStart(3, '0')}`,
      name: { ar: `${ar} ${Math.floor(i / SHOE_NAMES.length) + 1}`, en: `${en} ${Math.floor(i / SHOE_NAMES.length) + 1}` },
      kind: 'shoe', category: cat, collection: coll,
      price, comparePrice: hasOffer ? Math.round(price * 1.22) : undefined,
      colors: COLOR_SETS[(i + 1) % COLOR_SETS.length],
      angles: ['front', 'back', 'left', 'right', 'detail', 'lifestyle'],
      story: { ar: `شوز ${ar} من مجموعة ${coll} — راحة وثبات مع كعب مصمم للحركة.`, en: `${en} from ${coll} — comfort & stability with a movement-first heel.` },
      materials: { ar: 'خامة علوية فاخرة، نعل مريح ضد الانزلاق', en: 'Premium upper, cushioned anti-slip sole' },
      dimensions: { ar: 'مقاسات EU ٣٧ – ٤٢', en: 'EU sizes 37–42' },
      tags: i % 4 === 0 ? ['new'] : i % 3 === 0 ? ['best-seller'] : ['everyday'],
      limited: i % 13 === 0,
      rating: 4.2 + ((i * 5) % 8) / 10,
      art: artFor(i + 3), image: null,
    });
  }
  return out;
}

export const DEMO_BAGS: DemoProduct[] = buildBags();
export const DEMO_SHOES: DemoProduct[] = buildShoes();
export const ALL_DEMO_PRODUCTS: DemoProduct[] = [...DEMO_BAGS, ...DEMO_SHOES];

export function demoProductBySlug(slug: string): DemoProduct | undefined {
  return ALL_DEMO_PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCollection(slug: CollectionSlug): DemoProduct[] {
  return ALL_DEMO_PRODUCTS.filter((p) => p.collection === slug);
}

/* Collection page cards: ≥20 mixing products + editorial/campaign fragments */
export interface CollectionCard {
  key: string;
  kind: 'product' | 'editorial' | 'detail' | 'campaign';
  title: { ar: string; en: string };
  productSlug?: string;
  art: { bg: string; bg2: string; accent: string };
}

const FRAGMENT_TITLES = [
  ['تفصيلة القفل', 'Hardware Detail'], ['خامة الجلد', 'Leather Story'], ['من الكواليس', 'Backstage'],
  ['لوك الحملة', 'Campaign Look'], ['قريبة على الخياطة', 'Stitching Close-up'], ['لحظة الغروب', 'Golden Hour'],
  ['البطانة', 'Inside Story'], ['على الطبيعة', 'Street Moment'],
];

export function collectionCards(slug: CollectionSlug): CollectionCard[] {
  const products = productsByCollection(slug);
  const coll = COLLECTIONS.find((c) => c.slug === slug)!;
  const cards: CollectionCard[] = [];
  // interleave ~14 products + 8 fragments = 22 cards
  const fragCount = 8;
  const prodSlice = products.slice(0, 14);
  // pad with cross-collection products if a collection is thin
  while (prodSlice.length < 14) prodSlice.push(ALL_DEMO_PRODUCTS[(prodSlice.length * 7 + 3) % ALL_DEMO_PRODUCTS.length]);
  let fi = 0;
  prodSlice.forEach((p, i) => {
    cards.push({ key: `${slug}-p-${i}`, kind: 'product', title: p.name, productSlug: p.slug, art: p.art });
    if ((i === 2 || i === 5 || i === 8 || i === 11) && fi < fragCount) {
      const kinds: CollectionCard['kind'][] = ['editorial', 'detail', 'campaign'];
      for (let k = 0; k < 2 && fi < fragCount; k++, fi++) {
        const [ar, en] = FRAGMENT_TITLES[(fi + prodSlice.length) % FRAGMENT_TITLES.length];
        cards.push({ key: `${slug}-f-${fi}`, kind: kinds[fi % kinds.length], title: { ar, en }, art: { bg: coll.art.bg, bg2: coll.art.bg2, accent: coll.art.accent } });
      }
    }
  });
  return cards.slice(0, 22);
}

/* ---------- Offers (100) ---------- */
export interface DemoOffer {
  slug: string;
  productSlug: string;
  mechanic: { ar: string; en: string };
  discountPct: number;
  code?: string;
  conditions: { ar: string; en: string };
  limited?: boolean;
}

const MECHANICS: { ar: string; en: string }[] = [
  { ar: 'خصم نسبة', en: 'Percentage off' },
  { ar: 'عرض الفئة', en: 'Category offer' },
  { ar: 'عرض المجموعة', en: 'Collection offer' },
  { ar: 'باندل — قطعتين', en: 'Bundle — 2 pieces' },
  { ar: 'عرض موسمي', en: 'Seasonal offer' },
  { ar: 'كود خاص', en: 'Special code' },
  { ar: 'عرض تجريبي محدود', en: 'Limited demo drop' },
];

const OFFER_CODES = ['SHE10', 'BLOOM15', 'NOIR20', 'GLOW12', 'MUSE5', 'ELAN8', 'FORM7'];

export const DEMO_OFFERS: DemoOffer[] = Array.from({ length: 100 }, (_, i) => {
  const p = ALL_DEMO_PRODUCTS[i % ALL_DEMO_PRODUCTS.length];
  const mech = MECHANICS[i % MECHANICS.length];
  const pct = 5 + ((i * 13) % 30); // 5..34
  const needsCode = mech.en === 'Special code' || i % 9 === 4;
  return {
    slug: `offer-${String(i + 1).padStart(3, '0')}`,
    productSlug: p.slug,
    mechanic: mech,
    discountPct: pct,
    code: needsCode ? OFFER_CODES[i % OFFER_CODES.length] : undefined,
    conditions: {
      ar: needsCode ? `استخدمي الكود عند الطلب على واتساب. ساري على ${p.name.ar}.` : `ساري على ${p.name.ar} حتى نفاد الكمية المعروضة.`,
      en: needsCode ? `Use the code on WhatsApp checkout. Valid on ${p.name.en}.` : `Valid on ${p.name.en} while featured stock lasts.`,
    },
    limited: i % 17 === 5, // only some are LIMITED, per spec
  };
});

export function offerPrice(p: DemoProduct, pct: number): { price: number; compare: number } {
  return { price: Math.round(p.price * (1 - pct / 100)), compare: p.price };
}

/* ---------- Reviews / Social / Hero / Story ---------- */

export interface DemoReview {
  name: string; city: string;
  quote: { ar: string; en: string };
  piece: string;
  art: { bg: string; bg2: string; accent: string };
}

export const DEMO_REVIEWS: DemoReview[] = [
  { name: 'مريم', city: 'القاهرة', quote: { ar: 'الشنطة شكلها أغلى بكتير من سعرها، والتغليف حسسني إني بفتح هدية لنفسي.', en: 'The bag looks far more expensive than it was, and the packaging felt like a gift to myself.' }, piece: 'NOIR BAG 01', art: { bg: '#0d0d10', bg2: '#2a0f1e', accent: '#F7008A' } },
  { name: 'سلمى', city: 'الإسكندرية', quote: { ar: 'الهيلز مريح بشكل غريب — لبسته طول الفرح وما حسيتش بوجع.', en: 'The heels are strangely comfortable — wore them the whole wedding, no pain.' }, piece: 'Reine Heel', art: { bg: '#FFF8F2', bg2: '#FBD9E8', accent: '#F7008A' } },
  { name: 'نور', city: 'الجيزة', quote: { ar: 'طلبت على واتساب في دقيقتين، والمقاس طلع مظبوط من أول مرة.', en: 'Ordered on WhatsApp in two minutes, and the size was right the first time.' }, piece: 'City Mule', art: { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' } },
  { name: 'فريدة', city: 'المنصورة', quote: { ar: 'السنيكرز بقى أساسي كل يوم — شيك ومريح وبيليق على كل حاجة.', en: 'The sneakers became my everyday essential — chic, comfy, goes with everything.' }, piece: 'Bloom Sneaker', art: { bg: '#D8E6A0', bg2: '#FFF8F2', accent: '#A8C833' } },
  { name: 'جنى', city: 'أسيوط', quote: { ar: 'أول مرة أحس إن براند فاهمني — أنثوي وقوي في نفس الوقت.', en: 'First time a brand felt like it gets me — feminine and strong at once.' }, piece: 'Scarlet Statement', art: { bg: '#7a0f1f', bg2: '#1a0505', accent: '#FF5A00' } },
];

export interface SocialPost {
  id: string;
  kind: 'campaign' | 'bts' | 'product' | 'video';
  caption: { ar: string; en: string };
  art: { bg: string; bg2: string; accent: string };
}

export const DEMO_SOCIAL: SocialPost[] = Array.from({ length: 12 }, (_, i) => {
  const kinds: SocialPost['kind'][] = ['campaign', 'bts', 'product', 'video'];
  const caps = [
    ['كواليس تصوير بلوم', 'BLOOM shoot BTS'], ['لوك اليوم بالنوار', 'NOIR look of the day'],
    ['تفصيلة تفرق', 'The detail that matters'], ['المدينة بعد منتصف الليل', 'City after midnight'],
    ['تغليف SHE', 'SHE unboxing'], ['جربي المقاس', 'Find your fit'],
  ];
  const [ar, en] = caps[i % caps.length];
  return { id: `post-${i + 1}`, kind: kinds[i % kinds.length], caption: { ar, en }, art: artFor(i + 1) };
});

export const HERO_STATEMENTS = [
  { ar: 'كوني أنتِ.', en: 'BE YOU.' },
  { ar: 'املكي ستايلك.', en: 'OWN YOUR STYLE.' },
  { ar: 'كوني نادرة.', en: 'BE RARE.' },
  { ar: 'ستايلك. الـ SHE بتاعتك.', en: 'YOUR STYLE. YOUR SHE.' },
  { ar: 'اتصنعت عشان تتشاف.', en: 'MADE TO BE SEEN.' },
];

export interface HeroLayer {
  id: string;
  label: { ar: string; en: string };
  kind: 'model' | 'bag' | 'shoe' | 'editorial';
  art: { bg: string; bg2: string; accent: string };
}

export const HERO_LAYERS: HeroLayer[] = [
  { id: 'layer-1', label: { ar: 'موديل بالنوار', en: 'NOIR muse' }, kind: 'model', art: { bg: '#0d0d10', bg2: '#2a0f1e', accent: '#F7008A' } },
  { id: 'layer-2', label: { ar: 'شنطة بلوم', en: 'BLOOM bag' }, kind: 'bag', art: { bg: '#FFF8F2', bg2: '#FBD9E8', accent: '#F7008A' } },
  { id: 'layer-3', label: { ar: 'هيلز سكارلت', en: 'SCARLET heel' }, kind: 'shoe', art: { bg: '#7a0f1f', bg2: '#1a0505', accent: '#FF5A00' } },
  { id: 'layer-4', label: { ar: 'افتتاحية إيلان', en: 'ÉLAN editorial' }, kind: 'editorial', art: { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' } },
  { id: 'layer-5', label: { ar: 'ميوز الفنية', en: 'MUSE art look' }, kind: 'model', art: { bg: '#D8E6A0', bg2: '#FFF8F2', accent: '#A8C833' } },
  { id: 'layer-6', label: { ar: 'لمعة أفترجلو', en: 'AFTERGLOW shine' }, kind: 'bag', art: { bg: '#1E1B3A', bg2: '#0B0B14', accent: '#FFC107' } },
  { id: 'layer-7', label: { ar: 'خطوط فورم', en: 'FORM lines' }, kind: 'shoe', art: { bg: '#EDEDED', bg2: '#9a9a9a', accent: '#FF5A00' } },
];

/** 7 promo messages — controlled here, rendered by Marquee. */
export const PROMO_MESSAGES = [
  { ar: 'خصم ١٠٪ على شنط مختارة', en: '10% OFF selected bags' },
  { ar: 'تشكيلة الشوز الجديدة وصلت', en: 'New shoe drop live' },
  { ar: 'المجموعة الجديدة — بلوم ١٢', en: 'New collection — BLOOM 12' },
  { ar: 'توصيل لحد باب البيت', en: 'Delivery to your doorstep' },
  { ar: 'إصدار تجريبي محدود — نوار ٠٩', en: 'Limited demo drop — NOIR 09' },
  { ar: 'كود SHE10 لخصم إضافي', en: 'Extra off with code SHE10' },
  { ar: 'اطلبي على واتساب في دقيقة', en: 'Order on WhatsApp in a minute' },
];

export const BRAND_STORY_BEATS = [
  { ar: 'SHE مش مجرد ستور.', en: 'SHE IS NOT JUST A STORE.', art: { bg: '#111111', bg2: '#3a2330', accent: '#F7008A' } },
  { ar: 'هي هوية أزياء.', en: 'It is a fashion identity.', art: { bg: '#FFF8F2', bg2: '#FBD9E8', accent: '#F7008A' } },
  { ar: 'فضول ← اكتشاف ← رغبة', en: 'Curiosity → discovery → desire.', art: { bg: '#F4F1EA', bg2: '#C9BFA9', accent: '#111111' } },
  { ar: 'اختاري ← اطلبي ← تألقي', en: 'Choose → order → shine.', art: { bg: '#1E1B3A', bg2: '#0B0B14', accent: '#FFC107' } },
];
