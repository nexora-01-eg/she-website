/**
 * SHE — strict image resolver (Launch-Ready v1).
 * A variant is shown ONLY with a real front image for its OWN code+color.
 * No family+color guessing on customer pages — unlinked variants render the
 * monogram placeholder and are listed in data/missing-images.json.
 *
 * MODEL_TO_REAL is filled by the import pipeline (owner-confirmed mapping +
 * inventory export). Until then it is empty and every variant is imageless —
 * the honest interim state, guard-blocked from production by seed/TODO.
 */
import derivatives from '@/data/derivatives.json';

export type ImageKind = 'front' | 'lifestyle' | 'detail' | 'interior' | 'angles4' | 'other';

export interface DerivativeEntry {
  realCode: string;
  color: string | null;
  kind: string;
  avif: Record<string, string>;
  webp: Record<string, string>;
  w: number;
  h: number;
}

export interface ResolvedImage {
  /** default src (webp 960, fallback 480) */
  url: string;
  srcSet: string;
  kind: ImageKind;
  realCode: string;
  confidence: 'exact';
  illustrative: false;
  w: number;
  h: number;
}

/** Seed/placeholder code → real zip code. Empty until the inventory export locks it. */
export const MODEL_TO_REAL: Record<string, string> = {
  // Filled by /admin/import from the owner-confirmed mapping. Example:
  // 'BGS01': 'SBS685',
};

const FILES = (derivatives as { files?: DerivativeEntry[] }).files ?? [];

const KIND_RANK: Record<string, number> = {
  front: 0, angles4: 1, lifestyle: 2, detail: 3, interior: 4, other: 5,
};

function toResolved(f: DerivativeEntry): ResolvedImage {
  const pick = (set: Record<string, string>) => set['960'] ?? set['480'] ?? '';
  const srcSet = (set: Record<string, string>) =>
    [480, 960].filter((w) => set[String(w)]).map((w) => `${set[String(w)]} ${w}w`).join(', ');
  return {
    url: pick(f.webp) || pick(f.avif),
    srcSet: srcSet(f.webp) || srcSet(f.avif),
    kind: f.kind as ImageKind,
    realCode: f.realCode,
    confidence: 'exact',
    illustrative: false,
    w: f.w,
    h: f.h,
  };
}

/** Own code+color images only, front-first. Empty = placeholder + missing report. */
export function imagesForVariant(modelCode: string, colorKey: string, opts: { max?: number } = {}): ResolvedImage[] {
  const real = MODEL_TO_REAL[modelCode];
  if (!real) return [];
  return FILES.filter((f) => f.realCode === real && f.color === colorKey)
    .sort((a, b) => (KIND_RANK[a.kind] ?? 9) - (KIND_RANK[b.kind] ?? 9))
    .slice(0, opts.max ?? 6)
    .map(toResolved)
    .filter((r) => r.url);
}

/** Front image (launch minimum) or null → caller renders placeholder. */
export function frontForVariant(modelCode: string, colorKey: string): ResolvedImage | null {
  const imgs = imagesForVariant(modelCode, colorKey, { max: 6 });
  return imgs.find((i) => i.kind === 'front' || i.kind === 'angles4') ?? imgs[0] ?? null;
}

/** Strict coverage check for reports: does this variant have its own front? */
export function hasOwnFront(modelCode: string, colorKey: string): boolean {
  return frontForVariant(modelCode, colorKey) !== null;
}
