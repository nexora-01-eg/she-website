/**
 * SHE write-guard — makes external overwrites visible immediately.
 * Checks staged files against the OWNED areas below. Anything outside is
 * logged loudly and BLOCKS the commit (bypass consciously: SHE_ALLOW_EXTRA=1).
 * Install: node scripts/guard-writes.mjs --install (writes .git/hooks/pre-commit)
 * Run: npm run guard:writes
 */
import { execSync } from 'node:child_process';
import { writeFileSync, chmodSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Areas this project owns. Everything else staged = unexpected (possible external overwrite).
const OWNED = [
  'app/', 'components/', 'lib/', 'data/', 'scripts/', 'supabase/',
  'public/p/', 'public/brand/', 'public/favicon.svg',
  'middleware.ts', 'vercel.json', 'next.config.mjs', 'tsconfig.json',
  'package.json', 'package-lock.json', '.env.example', '.gitignore',
  'DEPLOY.md', 'HANDOFF.md', 'README.md', 'next-env.d.ts',
];

function staged() {
  try {
    const out = execSync('git diff --cached --name-only', { cwd: root, encoding: 'utf8' });
    return out.split('\n').map((s) => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isIgnored(f) {
  try {
    execSync(`git check-ignore -q "${f.replace(/"/g, '')}"`, { cwd: root, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function check(files) {
  // Ignored-path cleanup (e.g. removing a committed build artifact) is always fine.
  const relevant = files.filter((f) => !isIgnored(f));
  const bad = relevant.filter((f) => !OWNED.some((o) => (o.endsWith('/') ? f.startsWith(o) : f === o)));
  return { bad, skipped: files.length - relevant.length };
}

if (process.argv.includes('--install')) {
  const hook = `#!/bin/sh\n# SHE write-guard (see scripts/guard-writes.mjs)\nnode scripts/guard-writes.mjs\n`;
  const p = join(root, '.git', 'hooks', 'pre-commit');
  writeFileSync(p, hook, 'utf8');
  try { chmodSync(p, 0o755); } catch { /* windows */ }
  console.log('[write-guard] pre-commit hook installed.');
  process.exit(0);
}

const files = staged();
const { bad, skipped } = check(files);
if (bad.length) {
  console.error('\n[write-guard] BLOCKED — staged files outside owned areas (possible external overwrite):');
  for (const f of bad) console.error('  ! ' + f);
  console.error('Owned areas: ' + OWNED.join(' '));
  console.error('If intentional, commit with SHE_ALLOW_EXTRA=1 (Windows: $env:SHE_ALLOW_EXTRA=1).\n');
  if (process.env.SHE_ALLOW_EXTRA !== '1') process.exit(1);
  console.error('[write-guard] bypassed via SHE_ALLOW_EXTRA=1 — logged.');
} else if (files.length) {
  console.log(`[write-guard] OK — ${files.length} staged file(s) inside owned areas.`);
} else {
  console.log('[write-guard] nothing staged.');
}
