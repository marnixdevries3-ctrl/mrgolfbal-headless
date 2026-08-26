/* Contentaudit: dubbele en bijna-dubbele teksten, placeholders, dunne pagina's
   en de SEO-basis. Werkt op de gebouwde HTML, dus op wat bezoekers echt zien. */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const SKIP = new Set(['node_modules', '.git', 'assets', 'docs', 'netlify', '_toe-raw', '_trip-raw', '_blog-raw']);

const pages = [];
(function walk(d, rel = '') {
  for (const e of readdirSync(d)) {
    if (SKIP.has(e)) continue;
    const f = join(d, e);
    if (statSync(f).isDirectory()) walk(f, rel + '/' + e);
    else if (e === 'index.html') pages.push([(rel || '') + '/', f]);
  }
})(root);
if (existsSync(join(root, '404.html'))) pages.push(['/404.html', join(root, '404.html')]);
pages.sort();

const ents = (t) => t.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
  .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&mdash;/g,'\u2014').replace(/&ndash;/g,'\u2013');
const tag = (h, re) => { const m = h.match(re); return m ? ents(m[1].trim()) : ''; };
const strip = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();

// alleen het eigen deel van de pagina: header, footer en gedeelde blokken eruit
const SHARED = [
  /<section class="section markstrip-sec">[\s\S]*?<\/section>/g,
  /<section[^>]*data-gallery-pending[\s\S]*?<\/section>/g,
  /<section class="section partners">[\s\S]*?<\/section>/g,
  /<section class="section amam">[\s\S]*?<\/section>/g,
  /<div class="sticky-cta"[\s\S]*?<\/div><\/div><\/div>/g,
];
// Blokken die op veel pagina's staan zijn sjabloon, geen eigen content. We
// bepalen dat niet met een handmatige lijst maar door te tellen: elke sectie
// die op vier of meer pagina's voorkomt, telt niet mee als eigen tekst.
const bodyOf = (h) => {
  let s = h;
  const a = s.indexOf('</header></div>'); if (a > -1) s = s.slice(a + 15);
  const b = s.indexOf('<footer class="site-footer"'); if (b > -1) s = s.slice(0, b);
  return s.replace(/<div class="sticky-cta"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, ' ');
};
const sectionsOf = (h) => (bodyOf(h).match(/<section\b[\s\S]*?<\/section>/g) || []);
const keyOf = (sec) => strip(sec).slice(0, 200);

const shingles = (t, n = 8) => {
  const w = t.toLowerCase().replace(/[^a-z0-9à-ÿ ]+/g, ' ').split(/\s+/).filter(Boolean);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' '));
  return out;
};
const jac = (a, b) => {
  if (!a.size || !b.size) return 0;
  let inter = 0; const [s, l] = a.size < b.size ? [a, b] : [b, a];
  for (const x of s) if (l.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

// eerste ronde: tellen op hoeveel pagina's elke sectie voorkomt
const secCount = new Map();
const rawHtml = new Map();
for (const [route, file] of pages) {
  const h = readFileSync(file, 'utf8');
  rawHtml.set(route, h);
  for (const k of new Set(sectionsOf(h).map(keyOf))) secCount.set(k, (secCount.get(k) || 0) + 1);
}
const BOILER = 4;   // vanaf vier pagina's is het sjabloon
const mainOf = (h) => {
  let s = bodyOf(h);
  s = s.replace(/<section\b[\s\S]*?<\/section>/g, (sec) => (secCount.get(keyOf(sec)) || 0) >= BOILER ? ' ' : sec);
  return strip(s);
};

const docs = [];
for (const [route, file] of pages) {
  const h = rawHtml.get(route);
  const main = mainOf(h);
  docs.push({
    route, file, html: h, main,
    words: main.split(/\s+/).filter(Boolean).length,
    title: tag(h, /<title>([\s\S]*?)<\/title>/i),
    desc: tag(h, /<meta name="description" content="([^"]*)"/i),
    h1: strip(tag(h, /<h1[^>]*>([\s\S]*?)<\/h1>/i)),
    canon: tag(h, /<link rel="canonical" href="([^"]*)"/i),
    lang: (/^\/en\//.test(route) || route === '/en/') ? 'en' : 'nl',
    noindex: /name="robots"[^>]*noindex/i.test(h),
  });
}
docs.forEach(d => { d.sh = shingles(d.main); });

const P = { dupText: [], dupTitle: [], dupDesc: [], dupH1: [], placeholder: [], thin: [], noAlt: [], longTitle: [], badDesc: [], noCanon: [], headings: [] };

for (let i = 0; i < docs.length; i++) for (let j = i + 1; j < docs.length; j++) {
  if (docs[i].lang !== docs[j].lang) continue;
  const s = jac(docs[i].sh, docs[j].sh);
  if (s >= 0.15) P.dupText.push([+(s * 100).toFixed(1), docs[i].route, docs[j].route]);
}
P.dupText.sort((a, b) => b[0] - a[0]);

const groupDup = (key) => {
  const m = new Map();
  for (const d of docs) {
    if (d.noindex) continue;
    const v = (d[key] || '').toLowerCase(); if (!v) continue;
    const k = d.lang + '|' + v;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(d.route);
  }
  return [...m.values()].filter(v => v.length > 1);
};
P.dupTitle = groupDup('title'); P.dupDesc = groupDup('desc'); P.dupH1 = groupDup('h1');

const BAD = [/lorem ipsum/i, /\bTODO\b/, /\bTBD\b/, /\bFIXME\b/, /\bXXX\b/, /placeholder/i,
  /\bbla ?bla\b/i, /\btekst hier invullen\b/i, /\bnog invullen\b/i, /class="confirm-tag"/,
  /\{\{[^}]*\}\}/, /\$\{[a-z]/i, /\bundefined\b/i, /\[object Object\]/, /\bNaN\b/];
for (const d of docs) {
  const body = strip(d.html.replace(/<script[\s\S]*?<\/script>/gi, ' '));
  for (const re of BAD) { const m = body.match(re); if (m) P.placeholder.push([d.route, m[0].slice(0, 40)]); }
}
for (const d of docs) if (!d.noindex && d.words < 320) P.thin.push([d.words, d.route]);
P.thin.sort((a, b) => a[0] - b[0]);

for (const d of docs) {
  if (!d.canon) P.noCanon.push(d.route);
  if (d.title.length > 62) P.longTitle.push([d.title.length, d.route]);
  if (!d.noindex && (d.desc.length > 160 || d.desc.length < 70)) P.badDesc.push([d.desc.length, d.route]);
  const imgs = [...d.html.matchAll(/<img\b[^>]*>/g)].filter(m => !/alt="[^"]+"/.test(m[0]));
  if (imgs.length) P.noAlt.push([d.route, imgs.length]);
  const hs = [...d.html.matchAll(/<h([1-6])\b/g)].map(m => +m[1]);
  const h1n = hs.filter(x => x === 1).length;
  if (h1n !== 1) P.headings.push([d.route, 'h1 x' + h1n]);
  else for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i-1] > 1) { P.headings.push([d.route, `h${hs[i-1]} -> h${hs[i]}`]); break; }
}

// 6) sitemapdekking en verweesde pagina's
const sm = existsSync(join(root,'sitemap.xml')) ? readFileSync(join(root,'sitemap.xml'),'utf8') : '';
const inSitemap = new Set([...sm.matchAll(/<loc>https:\/\/mrgolfbal\.nl([^<]*)<\/loc>/g)].map(m => m[1] || '/'));
const linkedTo = new Set();
for (const d of docs) for (const m of d.html.matchAll(/href="(\/[^"#?]*)"/g)) {
  let u = m[1]; if (!u.endsWith('/') && !/\.[a-z0-9]+$/i.test(u)) u += '/';
  linkedTo.add(u);
}
const P2 = { notInSitemap: [], orphan: [], sitemapDead: [] };
for (const d of docs) {
  if (d.noindex) continue;
  if (!inSitemap.has(d.route) && d.route !== '/404.html') P2.notInSitemap.push(d.route);
  if (!linkedTo.has(d.route) && d.route !== '/' && d.route !== '/404.html') P2.orphan.push(d.route);
}
const routes = new Set(docs.map(d => d.route));
for (const u of inSitemap) if (!routes.has(u)) P2.sitemapDead.push(u);

const show = (t, arr, n = 30) => {
  console.log(`\n${t}: ${arr.length}`);
  arr.slice(0, n).forEach(x => console.log('   ', JSON.stringify(x)));
  if (arr.length > n) console.log(`    … en nog ${arr.length - n}`);
};
const med = docs.map(d=>d.words).sort((a,b)=>a-b)[Math.floor(docs.length/2)];
console.log("pagina's:", docs.length, '· mediaan eigen woorden:', med);
show('bijna-dubbele hoofdtekst (>=15% overlap)', P.dupText);
show('dubbele titles', P.dupTitle);
show('dubbele descriptions', P.dupDesc);
show('dubbele H1', P.dupH1);
show('placeholders / interne labels', P.placeholder);
show('dunne pagina\'s (<320 eigen woorden)', P.thin);
show('title te lang (>62)', P.longTitle);
show('description buiten 70-160', P.badDesc);
show('geen canonical', P.noCanon);
show('afbeeldingen zonder alt', P.noAlt);
show('kopstructuur', P.headings);
show('niet in de sitemap', P2.notInSitemap);
show('nergens naar gelinkt (verweesd)', P2.orphan);
show('sitemap wijst naar een pagina die niet bestaat', P2.sitemapDead);
const tot = Object.values(P).reduce((n, a) => n + a.length, 0) + Object.values(P2).reduce((n, a) => n + a.length, 0);
console.log('\nTOTAAL bevindingen:', tot);
process.exit(tot ? 1 : 0);
