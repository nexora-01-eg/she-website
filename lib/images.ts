/**
 * SHE — image resolver (Phase B).
 * Angles are OPTIONAL: only existing angles are returned; never empty/broken slots.
 * Launch minimum = one front image per variant; anything less is listed in
 * data/missing-images.json and rendered as a monogram placeholder (no broken <img>).
 *
 * Seed model codes (BGS01…) differ from real zip codes (SBJ752…). Until the owner
 * confirms data/image-mapping.csv + the inventory export arrives, matching is by
 * SECTION FAMILY + COLOR with confidence flags — always badged as illustrative.
 */
import catalog from '@/data/zip-catalog.json';

export type ImageKind = 'front' | 'lifestyle' | 'detail' | 'interior' | 'angles4' | 'other';

export interface ResolvedImage {
  url: string;
  kind: ImageKind;
  /** real zip code the file belongs to */
  realCode: string;
  confidence: 'exact' | 'family-color' | 'family-generic';
  /** true when the image is illustrative, not this variant's own shot */
  illustrative: boolean;
}

interface CatalogEntry {
  file: string;
  url: string;
  realCode: string | null;
  color: string | null;
  kind: string;
}

const FILES = (catalog as { files?: CatalogEntry[] }).files
  ?? (catalog as unknown as CatalogEntry[]);

const ALL: CatalogEntry[] = Array.isArray(FILES) ? FILES : [];

// Family mapping: seed section → real-code prefixes
const BAGS_PREFIX = ['SBJ', 'SBS', 'SE-500'];
const SHOES_PREFIX = ['SE-', 'SX-', 'SSS-', 'SE-501'];

function familyOf(modelCode: string): 'bags' | 'shoes' {
  if (/^(BGS|EXC)/.test(modelCode)) return 'bags';
  return 'shoes';
}

function inFamily(realCode: string, family: 'bags' | 'shoes'): boolean {
  const list = family === 'bags' ? BAGS_PREFIX : SHOES_PREFIX;
  return list.some((p) => realCode.startsWith(p));
}

const KIND_RANK: Record<string, number> = {
  front: 0, angles4: 1, lifestyle: 2, detail: 3, interior: 4, other: 5,
};

/**
 * Resolve images for a seed variant. Never returns broken entries.
 * Order: exact realCode+color (after owner CSV confirm) → family+color front →
 * family generic front → [] (caller renders monogram placeholder).
 */
export function imagesForVariant(
  modelCode: string,
  colorKey: string,
  opts: { max?: number } = {},
): ResolvedImage[] {
  const family = familyOf(modelCode);
  const pool = ALL.filter((f) => f.realCode && inFamily(f.realCode, family));
  const byKind = (a: CatalogEntry, b: CatalogEntry) =>
    (KIND_RANK[a.kind] ?? 9) - (KIND_RANK[b.kind] ?? 9);

  // 1) same color + front-ish, same family
  const colorHit = pool
    .filter((f) => f.color === colorKey && (f.kind === 'front' || f.kind === 'angles4'))
    .sort(byKind);
  // 2) same color, any kind
  const colorAny = pool.filter((f) => f.color === colorKey).sort(byKind);
  // 3) family generic fronts (color-unknown shoots: SE/SX/SSS hero & 4-angles)
  const generic = pool
    .filter((f) => f.kind === 'front' || f.kind === 'angles4')
    .sort(byKind);

  const seen = new Set<string>();
  const out: ResolvedImage[] = [];
  const push = (f: CatalogEntry, confidence: ResolvedImage['confidence']) => {
    if (seen.has(f.url)) return;
    seen.add(f.url);
    out.push({
      url: f.url, kind: f.kind as ImageKind, realCode: f.realCode ?? '',
      confidence, illustrative: true,
    });
  };
  colorHit.forEach((f) => push(f, 'family-color'));
  colorAny.forEach((f) => { if (out.length < 6) push(f, 'family-color'); });
  generic.forEach((f) => { if (out.length < 6) push(f, 'family-generic'); });
  return out.slice(0, opts.max ?? 6);
}

/** Front image (launch minimum) or null → caller renders placeholder. */
export function frontForVariant(modelCode: string, colorKey: string): ResolvedImage | null {
  const imgs = imagesForVariant(modelCode, colorKey, { max: 6 });
  return imgs.find((i) => i.kind === 'front' || i.kind === 'angles4') ?? imgs[0] ?? null;
}
