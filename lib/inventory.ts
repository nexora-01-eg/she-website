import { INVENTORY_ROWS } from '@/data/seed';
import { SUBSECTIONS, stockStatus, type ColorKey, type SubsectionKey } from '@/data/schema';

/** All counts are computed from data — never hardcoded in UI. */
export function totalPieces(): number {
  return INVENTORY_ROWS.reduce((s, r) => s + r.qty, 0);
}

export function piecesBySubsection(): Record<SubsectionKey, number> {
  const out = {} as Record<SubsectionKey, number>;
  for (const s of SUBSECTIONS) out[s.key] = 0;
  // Map modelCode -> subsection via seed content is overkill here; derive from code prefix.
  const modelSub = modelToSub();
  for (const row of INVENTORY_ROWS) {
    const sub = modelSub[row.modelCode];
    if (sub) out[sub] += row.qty;
  }
  return out;
}

export function piecesByColor(): Record<ColorKey, number> {
  const out = {} as Record<ColorKey, number>;
  for (const row of INVENTORY_ROWS) out[row.colorKey] = (out[row.colorKey] ?? 0) + row.qty;
  return out;
}

export function modelsCount(): number {
  return new Set(INVENTORY_ROWS.map((r) => r.modelCode)).size;
}

export function variantsCount(): number {
  return INVENTORY_ROWS.length;
}

export function statusForQty(qty: number) {
  return stockStatus(qty);
}

function modelToSub(): Record<string, SubsectionKey> {
  return {
    BGS01: 'soiree-bags', BGS02: 'soiree-bags', BGS03: 'soiree-bags', BGS04: 'soiree-bags',
    EXC01: 'in-she-only', EXC02: 'in-she-only', EXC03: 'in-she-only',
    FML01: 'formal-heels', FML02: 'formal-heels', FML03: 'formal-heels', FML04: 'formal-heels', FML05: 'formal-heels',
    SRH01: 'soiree-heels', SRH02: 'soiree-heels', SRH03: 'soiree-heels',
    BAL01: 'ballerina', BAL02: 'ballerina', BAL03: 'ballerina',
    SNK01: 'sneakers', SNK02: 'sneakers', SNK03: 'sneakers', SNK04: 'sneakers', SNK05: 'sneakers',
    SUE01: 'suede-sneakers', SUE02: 'suede-sneakers', SUE03: 'suede-sneakers',
  };
}

export function isSellableOnline(modelCode: string): boolean {
  const sub = modelToSub()[modelCode];
  return SUBSECTIONS.find((s) => s.key === sub)?.sellableOnline ?? true;
}
