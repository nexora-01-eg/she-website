/**
 * SHE — build optimized derivatives. Originals are NEVER served.
 * Reads: PRODUCTS_SRC (or public/products junction) — 132 originals.
 * Writes: public/p/<realCode>/<color>_<kind>_<i>_<w>.{avif,webp} + data/derivatives.json
 * Only customer-visible kinds (front/angles4/lifestyle); detail/interior/other later.
 * Incremental: skips outputs newer than the source file.
 * Run: node scripts/build-images.mjs
 */
import { readdirSync, statSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = process.env.PRODUCTS_SRC ?? join(root, 'public', 'products');
const outDir = join(root, 'public', 'p');
const catalog = JSON.parse(readFileSync(join(root, 'data', 'zip-catalog.json'), 'utf8'));

const WIDTHS = [480, 960];
const KINDS = new Set(['front', 'angles4', 'lifestyle']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    try {
      if (statSync(p).isDirectory()) walk(p, out);
      else out.push(p);
    } catch { /* skip */ }
  }
  return out;
}

const byRel = new Map((catalog.files ?? []).map((f) => [f.file, f]));
const originals = walk(srcDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const manifest = [];
let made = 0, skipped = 0;

for (const abs of originals) {
  const rel = abs.slice(srcDir.length + 1).replace(/\\/g, '/');
  // rel looks like "she/bags-SBJ/..." (via junction) vs catalog "BAGS SBS/..." — match by basename.
  const meta = byRel.get(rel) ?? [...byRel.values()].find((v) => v.file.endsWith('/' + basename(rel)));
  if (!meta || !KINDS.has(meta.kind) || !meta.realCode) continue;
  const color = meta.color ?? 'nocolor';
  const base = `${color}_${meta.kind}`;
  const dir = join(outDir, meta.realCode);
  mkdirSync(dir, { recursive: true });
  // dedupe per (code,color,kind): index by existing manifest count
  const idx = manifest.filter((m) => m.realCode === meta.realCode && m.color === meta.color && m.kind === meta.kind).length;
  const name = `${base}_${idx}`;
  const srcStat = statSync(abs);
  const entry = { realCode: meta.realCode, color: meta.color, kind: meta.kind, avif: {}, webp: {}, w: 0, h: 0 };
  let dirty = false;
  const img = sharp(abs);
  const info = await img.metadata();
  entry.w = info.width ?? 0;
  entry.h = info.height ?? 0;
  for (const w of WIDTHS) {
    for (const [ext, opts] of [['avif', { quality: 50 }], ['webp', { quality: 70 }]]) {
      const out = join(dir, `${name}_${w}.${ext}`);
      let fresh = true;
      try {
        if (existsSync(out) && statSync(out).mtimeMs > srcStat.mtimeMs) { fresh = false; skipped++; }
      } catch { /* write */ }
      if (fresh) {
        await sharp(abs).resize({ width: w, withoutEnlargement: true }).toFormat(ext, opts).toFile(out);
        made++;
        dirty = true;
      }
      entry[ext][w] = `/p/${meta.realCode}/${name}_${w}.${ext}`;
    }
  }
  if (dirty || true) manifest.push(entry);
}

writeFileSync(join(root, 'data', 'derivatives.json'), JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, files: manifest }, null, 2), 'utf8');
console.log(`[build-images] derivatives: ${manifest.length} sources → public/p (+${made} written, ${skipped} cached)`);
