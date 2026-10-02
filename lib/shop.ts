/**
 * SHE — shop catalog (Phase B). Client-side filtering over a prebuilt index.
 * Everything sellable comes from INVENTORY_ROWS; counts computed, never invented.
 */
import { INVENTORY_ROWS, MODEL_CONTENT } from '@/data/seed';
import { COLORS, SUBSECTIONS, stockStatus, type ColorKey, type SubsectionKey } from '@/data/schema';
import { imagesForVariant, frontForVariant, type ResolvedImage } from './images';
import { isSellableOnline } from './inventory';

export interface ShopVariant {
  modelCode: string;
  slug: string;
  name: { ar: string; en: string };
  section: 'bags' | 'shoes';
  subsection: SubsectionKey;
  subName: { ar: string; en: string };
  color: ColorKey;
  colorHex: string;
  colorName: { ar: string; en: string };
  price: number;
  qty: number;
  status: 'out' | 'low' | 'available';
  sellableOnline: boolean;
  occasion: string[];
  front: ResolvedImage | null;
  gallery: ResolvedImage[];
  /** search haystack, normalized */
  hay: string;
}

export function normalizeAr(s: string): string {
  return s
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u0652\u0670]/g, '')
    .toLowerCase()
    .trim();
}

const contentByCode = new Map(MODEL_CONTENT.map((c) => [c.modelCode, c]));
const colorByKey = new Map(COLORS.map((c) => [c.key, c]));
const subByKey = new Map(SUBSECTIONS.map((s) => [s.key, s]));

function buildIndex(): ShopVariant[] {
  return INVENTORY_ROWS.map((row) => {
    const content = contentByCode.get(row.modelCode);
    const color = colorByKey.get(row.colorKey);
    const sub = content ? subByKey.get(content.subsection) : undefined;
    const gallery = imagesForVariant(row.modelCode, row.colorKey, { max: 6 });
    const hay = normalizeAr(
      [content?.name.ar ?? '', content?.name.en ?? '', row.modelCode, color?.name.ar ?? '', color?.name.en ?? '', sub?.name.ar ?? '', sub?.name.en ?? ''].join(' '),
    );
    return {
      modelCode: row.modelCode,
      slug: content?.slug ?? row.modelCode.toLowerCase(),
      name: content?.name ?? { ar: row.modelCode, en: row.modelCode },
      section: content?.section ?? 'shoes',
      subsection: content?.subsection ?? 'sneakers',
      subName: sub?.name ?? { ar: '', en: '' },
      color: row.colorKey,
      colorHex: color?.hex ?? '#999',
      colorName: color?.name ?? { ar: row.colorKey, en: row.colorKey },
      price: row.price,
      qty: row.qty,
      status: stockStatus(row.qty),
      sellableOnline: isSellableOnline(row.modelCode),
      occasion: content?.occasion ?? [],
      front: frontForVariant(row.modelCode, row.colorKey),
      gallery,
      hay,
    };
  });
}

export const SHOP_INDEX: ShopVariant[] = buildIndex();

/** Models grouped: one card per model×color (variant-level cards, 64 total). */
export function modelsIndex(): ShopVariant[] {
  return SHOP_INDEX;
}

export interface Filters {
  section?: 'bags' | 'shoes';
  sub?: SubsectionKey;
  color?: ColorKey;
  maxPrice?: number;
  inStockOnly?: boolean;
  occasion?: string;
  q?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'available';
}

export function applyFilters(list: ShopVariant[], f: Filters): ShopVariant[] {
  let out = list;
  if (f.section) out = out.filter((v) => v.section === f.section);
  if (f.sub) out = out.filter((v) => v.subsection === f.sub);
  if (f.color) out = out.filter((v) => v.color === f.color);
  if (f.maxPrice) out = out.filter((v) => v.price <= (f.maxPrice as number));
  if (f.inStockOnly) out = out.filter((v) => v.qty > 0);
  if (f.occasion) out = out.filter((v) => v.occasion.includes(f.occasion as string));
  if (f.q) {
    const nq = normalizeAr(f.q);
    out = out.filter((v) => nq.split(/\s+/).every((t) => v.hay.includes(t)));
  }
  const rank = { available: 0, low: 1, out: 2 };
  switch (f.sort) {
    case 'price-asc': out = [...out].sort((a, b) => a.price - b.price); break;
    case 'price-desc': out = [...out].sort((a, b) => b.price - a.price); break;
    case 'available': out = [...out].sort((a, b) => rank[a.status] - rank[b.status] || b.qty - a.qty); break;
    default: break; // newest = seed order
  }
  return out;
}

/** Price bounds for the range filter (computed). */
export const PRICE_BOUNDS = {
  min: Math.min(...SHOP_INDEX.map((v) => v.price)),
  max: Math.max(...SHOP_INDEX.map((v) => v.price)),
};

export function formatEGP(n: number, lang: 'ar' | 'en' = 'ar'): string {
  const digits = String(n);
  return lang === 'ar' ? `${digits} ج.م` : `${digits} EGP`;
}
