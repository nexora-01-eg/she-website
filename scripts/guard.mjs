/**
 * SHE production guard — fails the deploy if seed/TODO/placeholder remains.
 * Runs as part of `npm run build` (dev) and strictly with SHE_PRODUCTION_GUARD=strict.
 * - Dev (no env): warns, exits 0 — seed is expected in Phase A.
 * - Strict: exits 1 if any source:'seed' in data/seed.ts, 'TODO' in data/config.ts or schema DELIVERY_ZONES,
 *   or TODO WhatsApp/pixels/policies/fees.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const strict = process.env.SHE_PRODUCTION_GUARD === 'strict';
const problems = [];

function checkFile(rel, patterns) {
  const p = join(root, rel);
  if (!existsSync(p)) { problems.push(`${rel}: MISSING`); return; }
  const text = readFileSync(p, 'utf8');
  for (const pat of patterns) {
    if (text.includes(pat)) problems.push(`${rel}: contains "${pat}"`);
  }
}

// Seed records and TODO values must not ship to production.
checkFile('data/seed.ts', ["source: 'seed'", 'source:"seed"']);
checkFile('data/config.ts', ['TODO']);
checkFile('data/schema.ts', ["fee: 'TODO'"]);

if (problems.length) {
  console.log('\n[SHE guard] findings:');
  for (const p of problems) console.log('  - ' + p);
  if (strict) {
    console.error('\n[SHE guard] FAIL: seed/TODO data present. Replace seed with real export + fill config before launch.\n');
    process.exit(1);
  } else {
    console.log('\n[SHE guard] WARN (dev): seed/TODO expected in Phase A. Strict build (`build:strict`) will fail until replaced.\n');
  }
} else {
  console.log('[SHE guard] OK: no seed/TODO markers.');
}
