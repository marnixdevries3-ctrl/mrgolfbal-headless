/* Site-audit: interne links, ontbrekende afbeeldingen, horizontale overflow,
   JS-fouten en dubbele afbeeldingen op één pagina. Draait tegen een lokale server. */
import { chromium } from 'playwright-core';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const BASE = 'http://127.0.0.1:8199';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/,'');
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const pages = [];
(function walk(d, rel=''){
  for (const e of readdirSync(d)) {
    if (['node_modules','.git','assets','docs','netlify','_toe-raw','_trip-raw','_blog-raw'].includes(e)) continue;
    const f = join(d,e);
    if (statSync(f).isDirectory()) walk(f, rel+'/'+e);
    else if (e === 'index.html') pages.push((rel||'')+'/');
  }
})(root);
pages.sort();

const b = await chromium.launch({ executablePath: exe, args:['--no-sandbox'] });
const errs = [], missImg = [], overflow = [], dupImg = [], badLink = new Map();
const pageImgs = new Map();   // pagina -> alle afbeeldingsbronnen erop
const seenLinks = new Set();

for (const w of [390, 768, 1440]) {
  const page = await b.newPage({ viewport:{width:w, height:900} });
  for (const p of pages) {
    const jsErr = [];
    page.on('pageerror', e => jsErr.push(String(e)));
    await page.goto(BASE+p, { waitUntil:'load' });
    const r = await page.evaluate((W) => {
      const imgs = [...document.images];
      const srcs = imgs.map(i=>i.getAttribute('src')).filter(Boolean);
      const dups = srcs.filter((s,i)=>srcs.indexOf(s)!==i);
      return {
        broken: imgs.filter(i=>i.complete && i.naturalWidth===0).map(i=>i.getAttribute('src')),
        srcs: [...new Set(srcs)],
        dups: [...new Set(dups)],
        ow: document.documentElement.scrollWidth > window.innerWidth + 1
              ? document.documentElement.scrollWidth : 0,
        links: W === 1440 ? [...document.querySelectorAll('a[href^="/"]')].map(a=>a.getAttribute('href')) : [],
      };
    }, w);
    if (r.broken.length) missImg.push([p, w, r.broken]);
    if (r.ow) overflow.push([p, w, r.ow]);
    if (w === 1440 && r.dups.length) dupImg.push([p, r.dups]);
    if (w === 1440) pageImgs.set(p, r.srcs.filter(x=>x.startsWith('/assets/')));
    if (jsErr.length) errs.push([p, w, jsErr]);
    if (w === 1440) for (const l of r.links) { const c = l.split('#')[0].split('?')[0]; if (c) seenLinks.add(c+'|'+p); }
  }
  await page.close();
}
await b.close();

for (const entry of seenLinks) {
  const [l, from] = entry.split('|');
  if (/\.(pdf|xml|txt|jpg|png|webp|ico|css|js)$/i.test(l)) { if (!existsSync(join(root, l))) badLink.set(l, from); continue; }
  const f = join(root, l, 'index.html');
  if (!existsSync(f) && !existsSync(join(root, l))) badLink.set(l, from);
}

/* Twee bestandsnamen kunnen dezelfde foto zijn. Daarom vergelijken we ook de
   beeldinhoud: een kleine grijswaarde-vingerafdruk per afbeelding. */
const sigOf = (rel) => {
  const f = join(root, rel.split('?')[0]);
  if (!existsSync(f)) return null;
  try {
    const txt = execFileSync('convert', [f, '-colorspace','Gray','-resize','12x12!','-depth','4','txt:-'], {encoding:'utf8'});
    return txt.split('\n').slice(1).map(l=>{ const m = l.match(/gray\((\d+)/); return m ? +m[1] : -1; })
              .filter(v=>v>=0).join(',');
  } catch { return null; }
};
const sigCache = new Map();
const sameImg = [];
for (const [p, srcs] of pageImgs) {
  const bySig = new Map();
  for (const src of srcs) {
    if (!sigCache.has(src)) sigCache.set(src, sigOf(src));
    const sig = sigCache.get(src);
    if (!sig) continue;
    if (!bySig.has(sig)) bySig.set(sig, []);
    bySig.get(sig).push(src);
  }
  for (const [, list] of bySig) {
    const uniq = [...new Set(list)];
    if (uniq.length > 1) sameImg.push([p, uniq]);
  }
}

const out = (t, a) => { console.log(`\n${t}: ${a.length}`); a.slice(0,25).forEach(x=>console.log('  ', JSON.stringify(x))); };
console.log('pagina\'s gecontroleerd:', pages.length);
out('JS-fouten', errs);
out('ontbrekende afbeeldingen', missImg);
out('horizontale overflow', overflow);
out('dubbele afbeelding op één pagina (zelfde bestand)', dupImg);
out('dezelfde foto onder twee namen op één pagina', sameImg);
out('gebroken interne links', [...badLink.entries()]);
process.exit(errs.length + missImg.length + overflow.length + badLink.size + dupImg.length + sameImg.length ? 1 : 0);
