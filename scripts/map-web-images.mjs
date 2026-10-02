/**
 * SHE — map D:\BAGS SBS\WEB images to model/color WITHOUT renaming anything.
 * Run: npm run map-images  (or WEB_ASSETS_DIR="D:\BAGS SBS\WEB" node scripts/map-web-images.mjs)
 * Output: data/image-mapping.json { generatedAt, sourceDir, mapped[], unmapped[], notes }
 *
 * Heuristic only: filenames in WEB are campaign/post renders (SHE_post_01..20), NOT
 * {modelCode}-{colorKey}-{angle}.jpg product shots. So nothing auto-maps to a SKU.
 * We keyword-match to the closest color family for use as lifestyle/campaign imagery,
 * and quarantine everything else for manual owner review. No file is renamed or moved.
 */
import { readdirSync, writeFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = process.env.WEB_ASSETS_DIR ?? 'D:\\BAGS SBS\\WEB';

// keyword → { color, type, note }
const RULES = [
  { re: /chrome|mirror|silver/i, color: 'silver', type: 'shoes', note: 'chrome/mirror → silver family' },
  { re: /red/i, color: 'burgundy', type: 'shoes', note: 'red pump → closest SHE burgundy (confirm)' },
  { re: /shadow|black/i, color: 'black', type: 'shoes', note: 'shadow/black → black family' },
  { re: /winter|snow|white/i, color: 'white', type: 'bags', note: 'winter/white → white family' },
  { re: /desert|beige|nude|sand/i, color: 'beige', type: 'bags', note: 'desert tones → beige family' },
  { re: /citrus|orange|neon/i, color: null, type: 'bags', note: 'citrus/neon — no SHE color match; campaign only' },
  { re: /ballet|pump|slingback|sandal|boot|sneaker|shoe/i, color: null, type: 'shoes', note: 'footwear render — needs model/color assignment' },
  { re: /aqua|water|sky/i, color: null, type: 'bags', note: 'aqua/water — no SHE color match; campaign only' },
  { re: /newspaper|pop.?art|glitch/i, color: null, type: 'bags', note: 'graphic print — needs owner model mapping' },
  { re: /red/i, color: 'burgundy', type: 'shoes', note: 'red pump → closest SHE burgundy (confirm)' },
  { re: /winter|snow|white/i, color: 'white', type: 'bags', note: 'winter/white → white family' },
  { re: /terrarium|spring|flower|leaf|autumn|summer|shell/i, color: null, type: 'bags', note: 'seasonal concept — campaign/social, not product angle' },
  { re: /shadow|black/i, color: 'black', type: 'shoes', note: 'shadow/black → black family' },
  { re: /gold|desert.?tote/i, color: 'gold', type: 'bags', note: 'desert tote → check gold/brown (confirm)' },
  { re: /banner|16x9|juno|promo|kling|pinsnap|photo_2026|whatsapp|sleekshot|596e51/i, color: null, type: null, note: 'banner/video/screenshot — not product imagery' },
];

function classify(file) {
  for (const r of RULES) {
    if (r.re.test(file)) return { color: r.color, type: r.type, note: r.note, rule: String(r.re) };
  }
  return { color: null, type: null, note: 'no rule matched — manual review', rule: null };
}

const out = { generatedAt: new Date().toISOString(), sourceDir, spec: '{modelCode}-{colorKey}-{angle}.jpg 4:5 ≥2000px', mapped: [], unmapped: [], notes: [] };

if (!existsSync(sourceDir)) {
  out.notes.push(`sourceDir not found: ${sourceDir}. Set WEB_ASSETS_DIR.`);
} else {
  const files = readdirSync(sourceDir).filter((f) => {
    try { return statSync(join(sourceDir, f)).isFile(); } catch { return false; }
  });
  for (const f of files) {
    if (/\.zip$/i.test(f)) { out.unmapped.push({ file: f, reason: 'archive — inspect manually (may hold real shots)', suggestion: 'unzip to staging, do not rename originals' }); continue; }
    if (!/\.(png|jpe?g|webp|avif|mp4|mov)$/i.test(f)) { out.unmapped.push({ file: f, reason: 'non-media', suggestion: 'ignore' }); continue; }
    const c = classify(f);
    const isProductName = /^[A-Z0-9]+-[a-z]+-(front|back|left|right|detail|lifestyle|interior)\.(jpg|jpeg)$/.test(f);
    if (isProductName) {
      out.mapped.push({ file: f, ...c, confidence: 'high', action: 'link as product angle' });
    } else if (c.color && c.type) {
      out.mapped.push({ file: f, ...c, confidence: 'low', action: 'use as campaign/lifestyle only until real angles exist — confirm color with owner' });
    } else {
      out.unmapped.push({ file: f, reason: c.note, suggestion: 'keep for Social World / Collections covers; needs owner model/color tag' });
    }
  }
  out.notes.push('RESULT: 0 files match the product spec naming — all WEB assets are campaign/post renders. Nothing qualifies as a product angle yet.');
  out.notes.push('Policy: script never renames/moves. Owner delivers real shots as {modelCode}-{colorKey}-{angle}.jpg; this mapping only tags campaign use.');
}

writeFileSync(join(root, 'data', 'image-mapping.json'), JSON.stringify(out, null, 2), 'utf8');
const m = out.mapped.length, u = out.unmapped.length;
console.log(`[map-images] source: ${sourceDir}`);
console.log(`[map-images] mapped(campaign-level): ${m}, unmapped/quarantine: ${u} → data/image-mapping.json`);
for (const x of out.mapped) console.log(`  MAP? ${x.file} → color=${x.color} type=${x.type} (${x.confidence}) — ${x.note}`);
