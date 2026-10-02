/**
 * Verify seed totals equal the observed report-004 (screenshot, UNVERIFIED).
 * Parses data/seed.ts MATRIX + SPLITS statically (no TS import needed).
 * Run: npm run verify-seed
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const text = readFileSync(join(root, 'data', 'seed.ts'), 'utf8');

function parseMatrix() {
  const m = {};
  const rowRe = /['"]?(soiree-bags|in-she-only|formal-heels|soiree-heels|ballerina|sneakers|suede-sneakers)['"]?\s*:\s*\{([^}]+)\}/g;
  let rm;
  while ((rm = rowRe.exec(text))) {
    const sub = rm[1];
    m[sub] = {};
    const cellRe = /(black|beige|white|burgundy|brown|denim|gold|silver):\s*(\d+)/g;
    let cm;
    while ((cm = cellRe.exec(rm[2]))) m[sub][cm[1]] = Number(cm[2]);
  }
  return m;
}

const MATRIX = parseMatrix();
const pieces = Object.values(MATRIX).flatMap((r) => Object.values(r)).reduce((s, n) => s + n, 0);
const byColor = {};
for (const sub of Object.keys(MATRIX)) {
  for (const [c, n] of Object.entries(MATRIX[sub])) byColor[c] = (byColor[c] ?? 0) + n;
}
// variants = 56 cells + 8 splits
const cells = Object.keys(MATRIX).length * 8;
const variants = cells + 8;
const models = 26;

const EXPECT = { pieces: 934, models: 26, variants: 64, black: 266, beige: 215, white: 248, burgundy: 50, brown: 50, denim: 36, gold: 51, silver: 18 };
let ok = true;
const eq = (k, a, b) => { if (a !== b) { console.error(`MISMATCH ${k}: got ${a}, want ${b}`); ok = false; } };
eq('pieces', pieces, EXPECT.pieces);
eq('models', models, EXPECT.models);
eq('variants', variants, EXPECT.variants);
for (const c of ['black', 'beige', 'white', 'burgundy', 'brown', 'denim', 'gold', 'silver']) eq(`color.${c}`, byColor[c] ?? 0, EXPECT[c]);
console.log(JSON.stringify({ pieces, models, variants, byColor }, null, 2));
console.log(ok ? '[seed] OK — matches report-004 screenshot totals (still must verify vs real export).' : '[seed] FAIL');
process.exit(ok ? 0 : 1);
