/**
 * SHE — catalog extracted product shots + 32 WEB files. No renames, ever.
 * - Walks public/products (extracted BAGS SBS.zip, 132 files)
 * - Parses realCode / color / kind from filenames (content-based, parent-dir agnostic)
 * - Writes data/zip-catalog.json (coverage per real code)
 * - Writes data/image-mapping.csv (32 WEB files: filename,suggestedModelCode,color,angle,confidence)
 *   for the owner to fill/confirm. suggestedModelCode references REAL zip codes, not seed codes.
 * - Writes data/missing-images.json (seed variants with no confirmed front image = all 64, honest)
 * Run: node scripts/catalog-zip.mjs
 */
import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productsDir = join(root, 'public', 'products');
const webDir = process.env.WEB_ASSETS_DIR ?? 'D:\\BAGS SBS\\WEB';

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

const COLOR_NORM = [
  [/champagne.gold|gold/i, 'gold'],
  [/silver/i, 'silver'],
  [/black/i, 'black'],
  [/burgundy/i, 'burgundy'],
  [/brown/i, 'brown'],
  [/beige|nude|sand|desert/i, 'beige'],
  [/denim/i, 'denim'],
  [/white/i, 'white'],
];
function normColor(s) {
  if (!s) return null;
  for (const [re, c] of COLOR_NORM) if (re.test(s)) return c;
  return null;
}

function parseProductFile(abs) {
  const rel = abs.slice(productsDir.length + 1).replace(/\\/g, '/');
  const base = rel.split('/').pop() ?? '';
  const lower = base.toLowerCase();
  let realCode = null;
  const norm = (c) => c.toUpperCase().replace('SBS-', 'SBS');
  // 0) parent directory often holds the code (bags-SBJ/SBJ752/01_lifestyle.png)
  const parts = rel.split('/');
  for (let i = parts.length - 2; i >= 0 && !realCode; i--) {
    let m0 = parts[i].match(/^(SE-\d+|SX-\d+|SSS-\d+|SXS-\d+|SBJ\d+|SBS-?\d+)$/i);
    if (m0) realCode = norm(m0[1]);
  }
  // SE-249 / SX-245 / SSS-5002 / SXS-223 / SE-484
  let m = base.match(/(SE-\d+|SX-\d+|SSS-\d+|SXS-\d+)/i);
  if (m) realCode = realCode ?? m[1].toUpperCase();
  // SBJ752 / SBS612 anywhere in filename (01_SBS685_black_product.png)
  if (!realCode) { m = base.match(/(SBJ\d+|SBS-?\d+)/i); if (m) realCode = norm(m[1]); }
  // e500_* / set15_* / 612_hero / 612_campaign
  if (!realCode) {
    if (/^e500/i.test(base)) realCode = 'SE-500';
    else if (/^set15/i.test(base)) realCode = 'SE-501';
    else if (/^hero_se500/i.test(base)) realCode = 'SE-500';
    else if (/^she_se500/i.test(base)) realCode = 'SE-500';
    else { m = base.match(/^(\d{3})_(hero|campaign)/); if (m) realCode = 'SBS' + m[1]; }
  }
  // HERO/612_hero inside evening-SBS/HERO
  if (!realCode) { m = rel.match(/HERO\/(\d{3})_hero/i); if (m) realCode = 'SBS' + m[1]; }
  if (!realCode) { m = rel.match(/campaign\/(\d{3})_campaign/i); if (m) realCode = 'SBS' + m[1]; }

  let kind = 'other';
  if (/hero/i.test(base)) kind = 'front';
  else if (/lifestyle|fashion|model|campaign/i.test(base)) kind = 'lifestyle';
  else if (/4_angles|four_angles/i.test(base)) kind = 'angles4';
  else if (/detail/i.test(base)) kind = 'detail';
  else if (/interior/i.test(base)) kind = 'interior';
  else if (/product/i.test(base)) kind = 'front';
  else if (/^(SBJ\d+)\.png/i.test(base)) kind = 'front';

  const color = normColor(base);
  const url = '/products/' + rel.split('/').map(encodeURIComponent).join('/');
  return { file: rel, url, realCode, color, kind };
}

const files = walk(productsDir).filter((f) => /\.(png|jpe?g|webp|avif)$/i.test(f));
const catalog = files.map(parseProductFile);

// Coverage per real code
const byCode = {};
for (const c of catalog) {
  const k = c.realCode ?? 'UNCLASSIFIED';
  byCode[k] = byCode[k] ?? { files: 0, colors: new Set(), kinds: new Set(), hasFront: false };
  byCode[k].files++;
  if (c.color) byCode[k].colors.add(c.color);
  byCode[k].kinds.add(c.kind);
  if (c.kind === 'front' || c.kind === 'angles4') byCode[k].hasFront = true;
}
const coverage = Object.entries(byCode).map(([code, v]) => ({
  realCode: code, files: v.files, colors: [...v.colors], kinds: [...v.kinds], hasFront: v.hasFront,
})).sort((a, b) => a.realCode.localeCompare(b.realCode));

writeFileSync(join(root, 'data', 'zip-catalog.json'), JSON.stringify({ generatedAt: new Date().toISOString(), totalFiles: files.length, coverage, files: catalog }, null, 2), 'utf8');

// ---- 32 WEB files CSV (owner confirms) ----
function webSuggest(file) {
  const s = file.toLowerCase();
  const color =
    /chrome|mirror|silver/.test(s) ? 'silver' :
    /desert|nude|sand/.test(s) && !/tote/.test(s) ? 'beige' :
    /red/.test(s) ? 'burgundy?' :
    /winter|snow|white|water|aqua|sky/.test(s) ? 'white?' :
    /shadow|black/.test(s) ? 'black' :
    /desert.tote/.test(s) ? 'beige?' :
    /gold/.test(s) ? 'gold?' : '';
  const angle =
    /hero|post_0[1-9]|post_1/.test(s) ? 'lifestyle?' :
    /banner/.test(s) ? 'banner' : 'lifestyle?';
  const conf = color && !color.endsWith('?') ? 'low' : 'guess';
  return { color, angle, conf };
}

const webFiles = existsSync(webDir) ? readdirSync(webDir).filter((f) => { try { return statSync(join(webDir, f)).isFile(); } catch { return false; } }) : [];
const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csvRows = ['filename,suggestedModelCode,color,angle,confidence,ownerConfirmed,notes'];
for (const f of webFiles) {
  const g = webSuggest(f);
  const isZip = /\.zip$/i.test(f);
  const isMedia = /\.(png|jpe?g|webp|avif|mp4|mov)$/i.test(f);
  const row = isZip
    ? [q(f), '', '', '', '', '', q('archive — extracted to public/products already')].join(',')
    : [q(f), '', g.color, isMedia ? g.angle : '', isMedia ? g.conf : '', '', q(isMedia ? 'campaign/post render — confirm model+color or keep for Social' : 'non-media')].join(',');
  csvRows.push(row);
}
writeFileSync(join(root, 'data', 'image-mapping.csv'), '\uFEFF' + csvRows.join('\n'), 'utf8');

// ---- missing-images report (STRICT: own code+color only) ----
// MODEL_TO_REAL is empty until the inventory export locks it, so no seed
// variant has its own front. Customer pages show monogram placeholders only.
const seedText = readFileSync(join(root, 'data', 'seed.ts'), 'utf8');
const rowRe3 = /['"]?(soiree-bags|in-she-only|formal-heels|soiree-heels|ballerina|sneakers|suede-sneakers)['"]?\s*:\s*\{([^}]+)\}/g;
const cellRe3 = /(black|beige|white|burgundy|brown|denim|gold|silver):\s*(\d+)/g;
const cellsAll = [];
{
  let rm;
  while ((rm = rowRe3.exec(seedText))) {
    let cm;
    while ((cm = cellRe3.exec(rm[2]))) {
      cellsAll.push({ subsection: rm[1], color: cm[1], pieces: Number(cm[2]) });
    }
  }
}
const missing = {
  generatedAt: new Date().toISOString(),
  mode: 'strict-own-code-color',
  rule: 'Launch minimum = one front image per variant (own code+color). Angles optional; never render empty/broken slots.',
  linkedModels: 0,
  note: 'MODEL_TO_REAL empty until inventory export. All 64 seed variants render monogram placeholders.',
  variantsWithoutOwnFront: 64,
  cells: cellsAll,
  realCodesWithDerivatives: coverage.filter((c) => c.hasFront && c.realCode !== 'UNCLASSIFIED').map((c) => c.realCode),
};
writeFileSync(join(root, 'data', 'missing-images.json'), JSON.stringify(missing, null, 2), 'utf8');

console.log(`[catalog] product files: ${files.length}, real codes: ${coverage.length - (byCode.UNCLASSIFIED ? 1 : 0)}, unclassified: ${byCode.UNCLASSIFIED?.files ?? 0}`);
console.log(`[catalog] web files in CSV: ${webFiles.length} → data/image-mapping.csv`);
console.log(`[catalog] codes with front/angles4: ${missing.realCodesWithDerivatives.length}`);
