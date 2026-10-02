/**
 * SHE — Seed data (Phase A, flagged source:'seed')
 * Matches observed report-004 totals from screenshot (UNVERIFIED against real export):
 *  934 pieces · 26 models · 64 variants · 7 sub-sections · 8 colors
 * Sub totals: SB54 ONLY36 FH250 SH99 BAL99 SNK297 SUE99
 * Color totals: black266 beige215 white248 burgundy50 brown50 denim36 gold51 silver18
 * The production guard fails strict builds while source==='seed'.
 * Real /admin/import replaces this file entirely.
 */
import type { ColorKey, InventoryRow, ModelContent, SubsectionKey } from './schema';

const REPORT_NO = '004';

type Matrix = Record<SubsectionKey, Record<ColorKey, number>>;

// Row sums + column sums verified in STEP 0 (see comment). Do not edit without re-verifying.
const MATRIX: Matrix = {
  'soiree-bags':   { black: 15, beige: 12, white: 14, burgundy: 3, brown: 3, denim: 2, gold: 4, silver: 1 },
  'in-she-only':   { black: 10, beige: 8,  white: 10, burgundy: 2, brown: 2, denim: 1, gold: 2, silver: 1 },
  'formal-heels':  { black: 71, beige: 58, white: 66, burgundy: 13, brown: 13, denim: 10, gold: 14, silver: 5 },
  'soiree-heels':  { black: 28, beige: 23, white: 26, burgundy: 5, brown: 5, denim: 4, gold: 6, silver: 2 },
  ballerina:       { black: 28, beige: 23, white: 26, burgundy: 5, brown: 5, denim: 4, gold: 6, silver: 2 },
  sneakers:        { black: 86, beige: 68, white: 80, burgundy: 17, brown: 17, denim: 11, gold: 13, silver: 5 },
  'suede-sneakers':{ black: 28, beige: 23, white: 26, burgundy: 5, brown: 5, denim: 4, gold: 6, silver: 2 },
};

// 8 cells split into 2 variants to reach 64 variants (56 cells + 8 splits).
const SPLITS: Array<{ sub: SubsectionKey; color: ColorKey; parts: [number, number] }> = [
  { sub: 'soiree-bags', color: 'black', parts: [8, 7] },
  { sub: 'formal-heels', color: 'black', parts: [36, 35] },
  { sub: 'formal-heels', color: 'beige', parts: [29, 29] },
  { sub: 'formal-heels', color: 'white', parts: [33, 33] },
  { sub: 'formal-heels', color: 'gold', parts: [7, 7] },
  { sub: 'sneakers', color: 'black', parts: [44, 42] },
  { sub: 'sneakers', color: 'beige', parts: [34, 34] },
  { sub: 'sneakers', color: 'white', parts: [40, 40] },
];

const MODELS: Record<SubsectionKey, string[]> = {
  'soiree-bags': ['BGS01', 'BGS02', 'BGS03', 'BGS04'],
  'in-she-only': ['EXC01', 'EXC02', 'EXC03'],
  'formal-heels': ['FML01', 'FML02', 'FML03', 'FML04', 'FML05'],
  'soiree-heels': ['SRH01', 'SRH02', 'SRH03'],
  ballerina: ['BAL01', 'BAL02', 'BAL03'],
  sneakers: ['SNK01', 'SNK02', 'SNK03', 'SNK04', 'SNK05'],
  'suede-sneakers': ['SUE01', 'SUE02', 'SUE03'],
};

const PRICES: Record<string, number> = {
  BGS01: 3200, BGS02: 2850, BGS03: 3500, BGS04: 2400,
  EXC01: 3900, EXC02: 3100, EXC03: 2700,
  FML01: 2200, FML02: 1950, FML03: 2400, FML04: 1800, FML05: 2100,
  SRH01: 2300, SRH02: 2050, SRH03: 2500,
  BAL01: 1500, BAL02: 1350, BAL03: 1650,
  SNK01: 1800, SNK02: 1600, SNK03: 1950, SNK04: 1450, SNK05: 1700,
  SUE01: 1900, SUE02: 1750, SUE03: 2100,
};

const AR_NAMES: Record<SubsectionKey, string> = {
  'soiree-bags': 'شنطة سواريه',
  'in-she-only': 'قطعة IN SHE ONLY',
  'formal-heels': 'هيلز فورمال',
  'soiree-heels': 'هيلز سواريه',
  ballerina: 'باليرينا',
  sneakers: 'سنيكرز',
  'suede-sneakers': 'سنيكرز شمواه',
};

const EN_NAMES: Record<SubsectionKey, string> = {
  'soiree-bags': 'Soirée Bag',
  'in-she-only': 'IN SHE ONLY Piece',
  'formal-heels': 'Formal Heel',
  'soiree-heels': 'Soirée Heel',
  ballerina: 'Ballerina',
  sneakers: 'Sneaker',
  'suede-sneakers': 'Suede Sneaker',
};

interface SeedCell { sub: SubsectionKey; color: ColorKey; qty: number; }

function expandCells(): SeedCell[] {
  const cells: SeedCell[] = [];
  const splitKey = new Set(SPLITS.map((s) => `${s.sub}__${s.color}`));
  (Object.keys(MATRIX) as SubsectionKey[]).forEach((sub) => {
    (Object.keys(MATRIX[sub]) as ColorKey[]).forEach((color) => {
      const qty = MATRIX[sub][color];
      const split = SPLITS.find((s) => s.sub === sub && s.color === color);
      if (split) {
        cells.push({ sub, color, qty: split.parts[0] });
        cells.push({ sub, color, qty: split.parts[1] });
      } else if (!splitKey.has(`${sub}__${color}`)) {
        cells.push({ sub, color, qty });
      }
    });
  });
  return cells;
}

function buildInventory(): InventoryRow[] {
  const cells = expandCells();
  // Round-robin models within each sub so every model gets ≥2 variants.
  const counters: Record<string, number> = {};
  return cells.map((cell, i) => {
    const models = MODELS[cell.sub];
    const n = counters[cell.sub] ?? 0;
    counters[cell.sub] = n + 1;
    const modelCode = models[n % models.length];
    return {
      modelCode,
      colorKey: cell.color,
      qty: cell.qty,
      price: PRICES[modelCode],
      source: 'seed' as const,
      reportNo: REPORT_NO,
      // size omitted: trackSizes=false (Phase A)
    };
  }).sort((a, b) => a.modelCode.localeCompare(b.modelCode) || a.colorKey.localeCompare(b.colorKey));
}

export const INVENTORY_ROWS: InventoryRow[] = buildInventory();

function sectionFor(sub: SubsectionKey): 'bags' | 'shoes' {
  return sub === 'soiree-bags' || sub === 'in-she-only' ? 'bags' : 'shoes';
}

export const MODEL_CONTENT: ModelContent[] = (Object.keys(MODELS) as SubsectionKey[]).flatMap(
  (sub) =>
    MODELS[sub].map((code, idx): ModelContent => ({
      modelCode: code,
      slug: code.toLowerCase(),
      name: { ar: `${AR_NAMES[sub]} ${code}`, en: `${EN_NAMES[sub]} ${code}` },
      section: sectionFor(sub),
      subsection: sub,
      story: `Seed story for ${code} — replaced by owner content on real import.`,
      materials: 'Seed materials — TODO owner content.',
      tags: [sub],
      occasion: sub.includes('soiree') ? ['evening'] : ['everyday'],
      imageKeys: {},
    })),
);

export const SEED_META = {
  reportNo: REPORT_NO,
  models: 26,
  variants: INVENTORY_ROWS.length,
  pieces: INVENTORY_ROWS.reduce((s, r) => s + r.qty, 0),
  verified: 'screenshot-only — MUST verify against real export',
};
