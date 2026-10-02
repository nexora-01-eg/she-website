/**
 * Recreate the public/products junction (images stay OUT of git).
 * Originals: D:\BAGS SBS\products-staging\she\... (extracted from BAGS SBS.zip, 132 files).
 * Run: npm run link-images
 * Phase E will move these to a CDN with AVIF/WebP conversion.
 */
import { existsSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const link = join(root, 'public', 'products');
const target = process.env.PRODUCTS_SRC ?? 'D:\\BAGS SBS\\products-staging';

if (!existsSync(target)) {
  console.error(`[link-images] MISSING source: ${target}`);
  console.error(`[link-images] Extract BAGS SBS.zip there (keep inner folder "she"), then re-run.`);
  process.exit(1);
}
try { rmSync(link, { recursive: true, force: true }); } catch { /* ignore */ }
try {
  execSync(`cmd /c mklink /J "${link}" "${target}"`, { stdio: 'inherit' });
  console.log('[link-images] OK: public/products -> ' + target);
} catch {
  console.error('[link-images] mklink failed (needs same-volume or admin?). Copy the folder manually instead.');
  process.exit(1);
}
