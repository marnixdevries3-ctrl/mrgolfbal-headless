/* Slop-audit: zoekt de kenmerken van machinaal klinkende tekst.
   Niet letterlijke duplicatie (dat doet content-audit.mjs) maar het mál:
   clichés, holle zinnen, terugkerende zinsopeningen en formules die op tien
   pagina's hetzelfde patroon volgen. */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/,'');
const SKIP = new Set(['node_modules','.git','assets','docs','netlify','_toe-raw','_trip-raw','_blog-raw','_kb-raw']);
const pages=[];(function w(d,rel=''){for(const e of readdirSync(d)){if(SKIP.has(e))continue;const f=join(d,e);
  if(statSync(f).isDirectory())w(f,rel+'/'+e);else if(e==='index.html')pages.push([(rel||'')+'/',f]);}})(root);
if (existsSync(join(root,'404.html'))) pages.push(['/404.html', join(root,'404.html')]);
pages.sort();

const strip = h => h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ')
  .replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&[a-z]+;/g," ").replace(/\s+/g,' ').trim();
const bodyOf = h => { let s=h; const a=s.indexOf('</header></div>'); if(a>-1)s=s.slice(a+15);
  const b=s.indexOf('<footer class="site-footer"'); if(b>-1)s=s.slice(0,b);
  return s.replace(/<div class="sticky-cta"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g,' '); };
const secOf = h => (bodyOf(h).match(/<section\b[\s\S]*?<\/section>/g)||[]);
const key = sec => strip(sec).slice(0,200);

// sjabloonsecties (>=4 pagina's) tellen niet mee
const cnt=new Map(), raw=new Map();
for(const [r,f] of pages){ const h=readFileSync(f,'utf8'); raw.set(r,h);
  for(const k of new Set(secOf(h).map(key))) cnt.set(k,(cnt.get(k)||0)+1); }
// alleen echte lopende tekst: alinea's en lijstitems uit de eigen secties,
// zonder kaarten, knoppen, kruimelpaden en bijschriften
const own = (h) => {
  let s = bodyOf(h).replace(/<section\b[\s\S]*?<\/section>/g, x => (cnt.get(key(x))||0)>=4 ? ' ' : x);
  s = s.replace(/<nav[\s\S]*?<\/nav>/g,' ')
       .replace(/<figcaption[\s\S]*?<\/figcaption>/g,' ')
       .replace(/<a class="(?:toep-card|blogcard|tripcard|svccard|locgrid__item|toepgrid__item)[\s\S]*?<\/a>/g,' ')
       .replace(/<article class="card"[\s\S]*?<\/article>/g,' ')
       .replace(/<div class="divider-cta"[\s\S]*?<\/div>/g,' ')
       .replace(/<a class="btn[\s\S]*?<\/a>/g,' ')
       .replace(/<p class="eyebrow"[\s\S]*?<\/p>/g,' ');
  const bits = [];
  for (const m of s.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = strip(m[2]);
    if (t.split(' ').length >= 6) bits.push(t);
  }
  return bits.join(' ');
};

const docs = pages.map(([r,f]) => { const h=raw.get(r); const t=own(h);
  return { route:r, text:t, lang:(/^\/en\//.test(r)||r==='/en/')?'en':'nl',
           sents:t.split(/(?<=[.!?])\s+(?=[A-Z“"'(]|$)/).map(x=>x.trim()).filter(x=>x.split(' ').length>2) }; });

/* ---- 1) clichés en holle formuleringen ---- */
const CLICHE = {
  nl: [
    [/\bof je nu\b[^.]{0,80}\bof\b/gi, 'of je nu X of Y'],
    [/\bniet alleen\b[^.]{0,90}\bmaar ook\b/gi, 'niet alleen X maar ook Y'],
    [/\bhet is (?:belangrijk|essentieel|cruciaal|verstandig) om\b/gi, 'het is belangrijk om'],
    [/\bin de wereld van\b/gi, 'in de wereld van'],
    [/\bals het gaat om\b/gi, 'als het gaat om'],
    [/\bspeelt een (?:belangrijke|cruciale|grote) rol\b/gi, 'speelt een belangrijke rol'],
    [/\bstaat of valt met\b/gi, 'staat of valt met'],
    [/\bmaakt het verschil\b/gi, 'maakt het verschil'],
    [/\bhet spreekt voor zich\b/gi, 'spreekt voor zich'],
    [/\bkortom\b/gi, 'kortom'],
    [/\bal met al\b/gi, 'al met al'],
    [/\bin een notendop\b/gi, 'in een notendop'],
    [/\bde sleutel (?:tot|is)\b/gi, 'de sleutel tot'],
    [/\bwaardevolle? (?:inzicht|toevoeging|bijdrage)/gi, 'waardevolle toevoeging'],
    [/\bunieke? (?:ervaring|kans|mogelijkheid)/gi, 'unieke ervaring'],
    [/\bperfecte? (?:oplossing|keuze|manier)/gi, 'perfecte oplossing'],
    [/\bonvergetelijke? (?:ervaring|dag|moment)/gi, 'onvergetelijke ervaring'],
    [/\bhet beste van beide werelden\b/gi, 'beste van beide werelden'],
    [/\bin de praktijk blijkt\b/gi, 'in de praktijk blijkt'],
    [/\bnu je (?:weet|hebt gelezen)\b/gi, 'nu je weet'],
    [/\bdenk (?:hierbij )?aan\b/gi, 'denk aan'],
    [/\bkun je (?:het )?beste\b/gi, 'kun je het beste'],
    [/\bhoe dan ook\b/gi, 'hoe dan ook'],
    [/\bmet andere woorden\b/gi, 'met andere woorden'],
  ],
  en: [
    [/\bwhether you(?:'re| are)\b[^.]{0,80}\bor\b/gi, 'whether you X or Y'],
    [/\bnot only\b[^.]{0,90}\bbut also\b/gi, 'not only X but also Y'],
    [/\bit(?:'s| is) important to\b/gi, "it's important to"],
    [/\bin the world of\b/gi, 'in the world of'],
    [/\bwhen it comes to\b/gi, 'when it comes to'],
    [/\bplays a (?:key|crucial|vital|major) role\b/gi, 'plays a key role'],
    [/\bmakes all the difference\b/gi, 'makes all the difference'],
    [/\bin a nutshell\b/gi, 'in a nutshell'],
    [/\bthe key (?:to|is)\b/gi, 'the key to'],
    [/\bunique (?:experience|opportunity)\b/gi, 'unique experience'],
    [/\bperfect (?:solution|choice|way)\b/gi, 'perfect solution'],
    [/\bunforgettable\b/gi, 'unforgettable'],
    [/\bbest of both worlds\b/gi, 'best of both worlds'],
    [/\bat the end of the day\b/gi, 'at the end of the day'],
    [/\bthat said\b/gi, 'that said'],
    [/\bin short\b/gi, 'in short'],
    [/\bseamless(?:ly)?\b/gi, 'seamless'],
    [/\bdelve into\b/gi, 'delve into'],
    [/\brest assured\b/gi, 'rest assured'],
  ],
};

/* ---- 2) zinsopeningen die te vaak terugkomen ---- */
const openers = new Map();
for (const d of docs) for (const s of d.sents) {
  const o = s.toLowerCase().replace(/[^a-zà-ÿ ]/g,'').split(' ').slice(0,3).join(' ');
  if (!o) continue;
  if (!openers.has(o)) openers.set(o, []);
  openers.get(o).push(d.route);
}

/* ---- 3) formuleringen (3-6 woorden) die op veel pagina's terugkomen ---- */
const phrases = new Map();
for (const d of docs) {
  const w = d.text.toLowerCase().replace(/[^a-z0-9à-ÿ ]+/g,' ').split(/\s+/).filter(Boolean);
  const seen = new Set();
  for (let n = 4; n <= 6; n++) for (let i=0; i+n<=w.length; i++) {
    const p = w.slice(i,i+n).join(' ');
    if (seen.has(p)) continue; seen.add(p);
    if (!phrases.has(p)) phrases.set(p, new Set());
    phrases.get(p).add(d.route);
  }
}

/* ---- 4) ritme: te uniforme zinslengte ---- */
const rhythm = [];
for (const d of docs) {
  if (d.sents.length < 12) continue;
  const L = d.sents.map(s=>s.split(' ').length);
  const m = L.reduce((a,b)=>a+b,0)/L.length;
  const sd = Math.sqrt(L.reduce((a,b)=>a+(b-m)**2,0)/L.length);
  const short = L.filter(x=>x<=8).length / L.length;
  if (sd < 5.5 || short < 0.05) rhythm.push([+sd.toFixed(1), Math.round(m), +(short*100).toFixed(0)+'% kort', d.route]);
}
rhythm.sort((a,b)=>a[0]-b[0]);

/* ---- rapport ---- */
const clicheHits = [];
const clicheDetail = [];
for (const d of docs) for (const [re,label] of CLICHE[d.lang]) {
  const m = d.text.match(re); if (!m) continue;
  clicheHits.push([m.length, label, d.route]);
  for (const hit of m) {
    const i = d.text.indexOf(hit);
    const ctx = d.text.slice(Math.max(0,i-70), i+hit.length+50).replace(/\s+/g,' ');
    clicheDetail.push([label, d.route, ctx]);
  }
}
if (process.argv.includes('--detail')) {
  console.log('--- alle treffers ---');
  for (const [l,r,c] of clicheDetail) console.log(`${l} | ${r}\n    …${c}…`);
  console.log('');
}
const byLabel = new Map();
for (const [n,label,route] of clicheHits) {
  if (!byLabel.has(label)) byLabel.set(label, {n:0, pages:new Set()});
  const e = byLabel.get(label); e.n += n; e.pages.add(route);
}
const hotOpeners = [...openers.entries()].filter(([o,v]) => v.length >= 8 && o.split(' ').length === 3)
  .map(([o,v]) => [v.length, new Set(v).size, o]).sort((a,b)=>b[0]-a[0]);
const hotPhrases = [...phrases.entries()].filter(([p,s]) => s.size >= 8)
  .map(([p,s]) => [s.size, p]).sort((a,b)=>b[0]-a[0] || b[1].length-a[1].length);

const show = (t,a,n=25)=>{console.log(`\n${t}: ${a.length}`);a.slice(0,n).forEach(x=>console.log('   ',JSON.stringify(x)));if(a.length>n)console.log(`    … en nog ${a.length-n}`);};
console.log("pagina's:", docs.length, '· zinnen:', docs.reduce((n,d)=>n+d.sents.length,0));
show('cliché / holle formulering (totaal, #pagina\'s)',
  [...byLabel.entries()].map(([l,e])=>[e.n, e.pages.size, l]).sort((a,b)=>b[0]-a[0]));
show('zinsopening op ≥8 plekken (aantal, #pagina\'s, opening)', hotOpeners);
show('formulering op ≥8 pagina\'s (#pagina\'s, tekst)', hotPhrases, 30);
show('te vlak ritme (spreiding, gem. zinslengte, aandeel korte zinnen)', rhythm, 15);
const tot = byLabel.size + hotOpeners.length + hotPhrases.length + rhythm.length;
console.log('\nTOTAAL signalen:', tot);
