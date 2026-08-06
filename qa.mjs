/* =============================================================================
 * QA-gate — faalt (exit 1) bij placeholders, dummyprijzen, dubbele H1/title etc.
 * Draai: node qa.mjs
 * =========================================================================== */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');

function walk(dir, acc = []) {
  for (const n of readdirSync(dir)) {
    if (['preview','node_modules','.git','assets','docs'].includes(n)) continue;
    const f = join(dir, n);
    if (statSync(f).isDirectory()) walk(f, acc);
    else if (n.endsWith('.html')) acc.push(f);
  }
  return acc;
}

const BANNED = [
  /voorbeeld producttitel/i,
  /lorem ipsum/i,
  /€\s?0[,.]00/,
  /dummy/i,
  /placeholder(?!=)(?:product|afbeelding|tekst)?/i,   // negeer HTML placeholder="" attribuut
  /\bTODO\b/,
  /bestel op factuur/i,   // op verzoek overal verwijderd
];
const CLICHES = [
  /schitteren op de green/i,
  /onvergetelijke indruk/i,
  /naar een hoger niveau/i,
];

const files = walk(root);
let errors = 0, warnings = 0;
const titles = new Map(), h1s = new Map();

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const rel = f.replace(root, '');
  // banned tokens
  for (const re of BANNED) if (re.test(html)) { console.error(`✗ ${rel}: verboden term ${re}`); errors++; }
  for (const re of CLICHES) if (re.test(html)) { console.warn(`⚠ ${rel}: AI-cliché ${re}`); warnings++; }
  // exact one H1
  const h1 = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gis)];
  if (h1.length === 0) { console.error(`✗ ${rel}: geen H1`); errors++; }
  if (h1.length > 1) { console.error(`✗ ${rel}: ${h1.length} H1's (moet 1)`); errors++; }
  if (h1[0]) { const t = h1[0][1].replace(/<[^>]+>/g,'').trim(); if (h1s.has(t)) { console.error(`✗ dubbele H1 "${t}" in ${rel} en ${h1s.get(t)}`); errors++; } else h1s.set(t, rel); }
  // unique title
  const tt = (html.match(/<title>(.*?)<\/title>/is) || [])[1]?.trim();
  if (!tt) { console.error(`✗ ${rel}: geen <title>`); errors++; }
  else if (titles.has(tt)) { console.error(`✗ dubbele title "${tt}" in ${rel} en ${titles.get(tt)}`); errors++; }
  else titles.set(tt, rel);
  // canonical + description
  if (!/rel="canonical"/.test(html)) { console.error(`✗ ${rel}: geen canonical`); errors++; }
  if (!/name="description"/.test(html)) { console.error(`✗ ${rel}: geen meta description`); errors++; }
}

console.log(`\nGecontroleerd: ${files.length} pagina's · ${errors} fouten · ${warnings} waarschuwingen`);
if (errors) { console.error('QA FAILED'); process.exit(1); }
console.log('QA OK ✓');
