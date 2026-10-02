/**
 * SHE — Data contract (Phase A, locked per approval)
 * Two sources merged by model code:
 *  (a) inventory import (code, color, size, qty, price)
 *  (b) owner-editable content file (names, story, materials, care, tags, image keys)
 * Inventory never contains marketing copy; content never contains stock.
 */

export type Section = 'bags' | 'shoes';

export type SubsectionKey =
  | 'soiree-bags'
  | 'in-she-only'
  | 'formal-heels'
  | 'soiree-heels'
  | 'ballerina'
  | 'sneakers'
  | 'suede-sneakers';

export interface SubsectionDef {
  key: SubsectionKey;
  section: Section;
  name: { ar: string; en: string };
  /** per-sub-section flag. IN SHE ONLY = false until owner confirms meaning. WhatsApp-inquiry only. */
  sellableOnline: boolean;
}

export const SUBSECTIONS: SubsectionDef[] = [
  { key: 'soiree-bags', section: 'bags', name: { ar: 'سواريه', en: 'Soirée bags' }, sellableOnline: true },
  { key: 'in-she-only', section: 'bags', name: { ar: 'IN SHE ONLY', en: 'IN SHE ONLY' }, sellableOnline: false },
  { key: 'formal-heels', section: 'shoes', name: { ar: 'فورمال', en: 'Formal heels' }, sellableOnline: true },
  { key: 'soiree-heels', section: 'shoes', name: { ar: 'سواريه هيلز', en: 'Soirée heels' }, sellableOnline: true },
  { key: 'ballerina', section: 'shoes', name: { ar: 'باليرينا', en: 'Ballerina heels' }, sellableOnline: true },
  { key: 'sneakers', section: 'shoes', name: { ar: 'سنيكرز', en: 'Sneakers' }, sellableOnline: true },
  { key: 'suede-sneakers', section: 'shoes', name: { ar: 'سنيكرز شمواه', en: 'Suede sneakers' }, sellableOnline: true },
];

export type ColorKey =
  | 'black' | 'white' | 'beige' | 'burgundy'
  | 'gold' | 'silver' | 'brown' | 'denim';

export interface ColorDef {
  key: ColorKey;
  hex: string;
  name: { ar: string; en: string };
}

export const COLORS: ColorDef[] = [
  { key: 'black', hex: '#111111', name: { ar: 'أسود', en: 'Black' } },
  { key: 'white', hex: '#F5F2EC', name: { ar: 'أبيض', en: 'White' } },
  { key: 'beige', hex: '#D9C3A5', name: { ar: 'بيج', en: 'Beige' } },
  { key: 'burgundy', hex: '#6B1A2A', name: { ar: 'برغندي', en: 'Burgundy' } },
  { key: 'brown', hex: '#6F4A2F', name: { ar: 'بني', en: 'Brown' } },
  { key: 'denim', hex: '#3B5B7A', name: { ar: 'جينز', en: 'Denim' } },
  { key: 'gold', hex: '#C9A227', name: { ar: 'دهبي', en: 'Gold' } },
  { key: 'silver', hex: '#C0C0C0', name: { ar: 'فضي', en: 'Silver' } },
];

/** Inventory layer — mirrors the real export. Adapt header names on real CSV. */
export interface InventoryRow {
  modelCode: string;
  colorKey: ColorKey;
  /** size present only if report tracks sizes. Phase A: trackSizes=false. */
  size?: string;
  qty: number;
  /** one price per model code (approved). No comparePrice from inventory. */
  price: number;
  source: 'seed' | 'import';
  reportNo: string;
}

/** Content layer — owner-editable, no stock. */
export interface ModelContent {
  modelCode: string;
  slug: string;
  name: { ar: string; en: string };
  section: Section;
  subsection: SubsectionKey;
  story?: string;
  materials?: string;
  dimensions?: string;
  care?: string;
  tags: string[];
  occasion: string[];
  /** 6 angles + interior for bags. Keys map to files via image-mapping.json */
  imageKeys: {
    front?: string; back?: string; left?: string; right?: string;
    detail?: string; lifestyle?: string; interior?: string;
  };
}

export type StockStatus = 'out' | 'low' | 'available';

/** Stock status rule from the system: 0=sold out, 1=last piece, >=2=available */
export function stockStatus(qty: number): StockStatus {
  if (qty <= 0) return 'out';
  if (qty === 1) return 'low';
  return 'available';
}

/** Columns still needed from the REAL export (verify — screenshot counts are unverified): */
export const NEEDED_EXPORT_COLUMNS = [
  'report_no (current = 004)',
  'report_date',
  'model_code (product code, 26 models)',
  'color_key or color_ar/color_en (8 colors)',
  'size (if tracked — else absent; Phase A assumes absent)',
  'qty (per model×color×size, or per model×color)',
  'price (per model code — confirm)',
  'subsection (or mappable category)',
] as const;

/** 5 delivery zones (approved — replaces 27 governorates) */
export type DeliveryZoneKey = 'cairo-giza' | 'alex' | 'delta-canal' | 'upper' | 'remote';

export interface DeliveryZone {
  key: DeliveryZoneKey;
  name: { ar: string; en: string };
  /** TODO until owner provides real fees */
  fee: number | 'TODO';
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { key: 'cairo-giza', name: { ar: 'القاهرة والجيزة', en: 'Cairo + Giza' }, fee: 'TODO' },
  { key: 'alex', name: { ar: 'الإسكندرية', en: 'Alexandria' }, fee: 'TODO' },
  { key: 'delta-canal', name: { ar: 'الدلتا والقناة', en: 'Delta & Canal' }, fee: 'TODO' },
  { key: 'upper', name: { ar: 'الصعيد', en: 'Upper Egypt' }, fee: 'TODO' },
  { key: 'remote', name: { ar: 'النائية / سيناء / البحر الأحمر', en: 'Remote / Sinai / Red Sea' }, fee: 'TODO' },
];
