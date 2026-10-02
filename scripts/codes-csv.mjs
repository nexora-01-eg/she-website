import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const c = JSON.parse(readFileSync(join(root, 'data', 'zip-catalog.json'), 'utf8'));
const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const rows = ['realCode,files,photographedColors,kinds,suggestedSubsection,ownerSubsection,notes'];
for (const r of c.coverage) {
  rows.push([q(r.realCode), r.files, q((r.colors || []).join('/') || '-'), q((r.kinds || []).join('/')), q(''), q(''), q('')].join(','));
}
writeFileSync(join(root, 'data', 'code-subsection-mapping.csv'), '﻿' + rows.join('\n'), 'utf8');
console.log('codes CSV rows: ' + (rows.length - 1));
