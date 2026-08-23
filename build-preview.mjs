import { readFileSync, writeFileSync, existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const R = (p) => readFileSync(join(root, p), 'utf8');

/* welke pagina's zitten in de preview */
const NL = [
  ['/', 'Home'], ['/golfballen-bedrukken/', 'Golfballen bedrukken'],
  ['/titleist-golfballen-bedrukken/', 'Titleist'], ['/pinnacle-golfballen-bedrukken/', 'Pinnacle'],
  ['/onbedrukte-golfballen/', 'Onbedrukt'], ['/golfballen-personaliseren/', 'Personaliseren'],
  ['/golfballen-bedrukken-voor-bedrijven/', 'Voor bedrijven'],
  ['/golfballen-bedrukken-voor-golfclubs-en-toernooien/', 'Voor clubs'],
  ['/golfles/', 'Golfles'], ['/golfshows/', 'Trickshow'], ['/golftrips/', 'Golftrips'],
  ['/golf-repairs/', 'Golf repairs'], ['/golfbalkiezer/', 'Golfbalkiezer'],
  ['/toepassingen/', 'Toepassingen'], ['/kennisbank/', 'Kennisbank'],
  ['/zo-werkt-het/', 'Zo werkt het'], ['/over-mark/', 'Over ons'], ['/contact/', 'Contact'],
];
const EXTRA = [];
for (const s of ['golfballen-relatiegeschenk','golfballen-bedrijfsgolfdag','golfballen-golfevent',
  'golfballen-sponsorwedstrijd','golfballen-goodiebag','golfballen-promotieartikel',
  'golfballen-golftoernooi','golfballen-charitygolf'])
  EXTRA.push([`/toepassingen/${s}/`, s.replace(/-/g,' ')]);
for (const s of ['titleist-pro-v1','titleist-pro-v1x','titleist-trufeel','titleist-avx','titleist-velocity',
  'pinnacle-soft-met-bedrukking','pinnacle-rush-met-bedrukking'])
  EXTRA.push([`/products/${s}/`, s]);
for (const l of ['groningen','friesland','drenthe','overijssel','flevoland','gelderland','utrecht',
  'noord-holland','zuid-holland','zeeland','noord-brabant','limburg','amsterdam','rotterdam','den-haag'])
  EXTRA.push([`/golfshows/${l}/`, 'Golfshow ' + l]);
for (const s of ['merkactivatie','productlancering','bedrijfsevent','personeelsdag','relatiedag','beursstand',
  'clubjubileum','baanopening','charitygolf','teamuitje','sponsordag','vip-dag'])
  EXTRA.push([`/golfshows/toepassingen/${s}/`, 'Golfshow ' + s.replace(/-/g,' ')]);
EXTRA.push(['/golfshows/toepassingen/', 'Golfshow toepassingen']);
for (const s of ['algarve-monte-rei','dubai','marbella','ierland-schotland','yorkshire-engeland'])
  EXTRA.push([`/golftrips/${s}/`, 'Golfreis ' + s.replace(/-/g,' ')]);
EXTRA.push(['/blog/', 'Blog']);
for (const s of ['golfbal-bedrukken-met-logo-checklist','welke-golfbal-past-bij-jouw-spel',
  'golfdag-organiseren-voor-je-bedrijf','golf-trickshow-wat-kun-je-verwachten',
  'relatiegeschenk-dat-blijft-liggen','golfreis-plannen-in-groep','logo-aanleveren-vector-of-jpeg',
  'golfclinic-voor-beginners-op-je-event','golfclub-sponsoren-zichtbaar-maken','pro-v1-of-pinnacle-soft'])
  EXTRA.push([`/blog/${s}/`, 'Blog: ' + s.replace(/-/g,' ')]);
EXTRA.push(['/verzending-en-levering/', 'Verzending'], ['/privacy/', 'Privacy']);
const EN = [['/en/', 'EN Home'], ['/en/golfshows/', 'EN Trick show'], ['/en/golfles/', 'EN Golf lessons']];

const ALL = [...NL, ...EXTRA, ...EN];

const fileFor = (route) => route === '/' ? 'index.html'
  : route === '/en/' ? 'en/index.html'
  : route.replace(/^\//,'').replace(/\/$/,'') + '/index.html';

/* chrome (header + footer) één keer, uit de NL- en EN-homepage */
function chromeOf(file) {
  const s = R(file);
  const hEnd = s.indexOf('</header></div>') + '</header></div>'.length;
  const fStart = s.indexOf('<footer class="site-footer"');
  const fEnd = s.indexOf('</footer>', fStart) + '</footer>'.length;
  return { header: s.slice(s.indexOf('<div class="site-top">'), hEnd), footer: s.slice(fStart, fEnd) };
}
const chromeNL = chromeOf('index.html');
const chromeEN = chromeOf('en/index.html');

/* per pagina alleen de inhoud tussen header en footer */
const pages = {};
let missing = [];
for (const [route] of ALL) {
  const f = fileFor(route);
  if (!existsSync(join(root, f))) { missing.push(route); continue; }
  const s = R(f);
  const hEnd = s.indexOf('</header></div>') + '</header></div>'.length;
  const fStart = s.indexOf('<footer class="site-footer"');
  pages[route] = s.slice(hEnd, fStart);
}
if (missing.length) console.warn('ontbreekt:', missing.join(', '));

const heroBg = 'data:image/jpeg;base64,' + readFileSync(join(root,'assets/img/hero-bg.jpg')).toString('base64');
const css = R('assets/css/styles.css')
  // de hero-achtergrond moet ook in de zelfstandige preview zichtbaar zijn
  .replace(/url\('\/assets\/img\/hero-bg\.jpg'\)/g, () => "url('" + heroBg + "')")
  // niet-ASCII in CSS content-waarden als CSS-escape (\2013 e.d.), zodat de
  // pijltjes en streepjes ook zonder expliciete charset goed renderen
  .replace(/content:\s*'([^']*)'/g, (m, v) =>
    "content: '" + [...v].map(ch => ch.charCodeAt(0) > 127
      ? '\\' + ch.codePointAt(0).toString(16) + ' ' : ch).join('') + "'");
const js  = R('assets/js/site.js');
const qr  = 'data:image/png;base64,' + readFileSync(join(root,'assets/img/wa-qr.png')).toString('base64');

/* Foto's verkleinen en als data-URI inbakken: een gepubliceerde preview is
   self-contained en kan geen losse bestanden van de server halen. */
const tmp = mkdtempSync(join(tmpdir(), 'mrg-'));
const dataUri = {};
for (const sub of ['balls', 'mark', 'show', 'trips', 'partners', 'products']) {
  const dir = join(root, 'assets', 'img', sub);
  let files = []; try { files = readdirSync(dir); } catch { continue; }
  for (const f of files.filter(x => /\.(jpe?g|png|webp)$/i.test(x))) {
    const keepAlpha = /\.(png|webp)$/i.test(f) && (sub === 'products' || sub === 'partners');
    const out = join(tmp, sub + '-' + f.replace(/\.[^.]+$/, '') + (keepAlpha ? '.webp' : '.jpg'));
    execFileSync('convert', keepAlpha
      ? [join(dir, f), '-background', 'none', '-resize', '520x520>', '-quality', '80', '-strip', out]
      : [join(dir, f), '-background', 'white', '-alpha', 'remove', '-alpha', 'off', '-resize', '720x720>', '-quality', '70', '-strip', out]);
    dataUri[`/assets/img/${sub}/${f}`] = (keepAlpha ? 'data:image/webp;base64,' : 'data:image/jpeg;base64,') + readFileSync(out).toString('base64');
  }
}
console.log(`foto's ingebakken: ${Object.keys(dataUri).length}`);

const inline = (h) => h
  .replace(/\/assets\/img\/wa-qr\.png/g, qr)
  .replace(/<script[^>]*elfsightcdn[^>]*><\/script>/g, '')
  // src -> data-src: de foto's staan één keer in window.__IMG__ en worden bij
  // het renderen ingevuld (anders staat elke foto tientallen keren in het bestand)
  .replace(/src="(\/assets\/img\/(?:balls|mark)\/[^"]+)"/g, 'data-src="$1"');

const J = (o) => JSON.stringify(o)
  .replace(/</g, '\\u003c')
  // alles buiten ASCII als \\uXXXX: het bestand blijft dan pure ASCII en is
  // ongevoelig voor een verkeerd geraden tekenset bij de host
  .replace(/[\u007f-\uffff]/g, (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const routes = Object.keys(pages);
const navBtns = [...NL, ['/golfshows/gelderland/','↳ Gelderland'], ['/golfshows/zeeland/','↳ Zeeland'], ['/golfshows/amsterdam/','↳ Amsterdam']]
  .map(([r,l]) => `<button data-go="${r}">${l}</button>`).join('');

const out = `<title>MrGolfbal Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<style>${css}</style>
<style>
  /* preview-balk (hoort niet bij de site zelf) */
  #pvbar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:9999;
    display:flex;gap:6px;align-items:center;max-width:min(96vw,1180px);overflow-x:auto;
    background:rgba(4,26,44,.94);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16);
    border-radius:999px;padding:7px 10px;box-shadow:0 12px 40px rgba(0,0,0,.4);scrollbar-width:thin}
  #pvbar b{color:#7ad2ff;font:700 11px/1 Ubuntu,system-ui,sans-serif;letter-spacing:.1em;
    text-transform:uppercase;padding:0 8px 0 4px;white-space:nowrap;flex:none}
  #pvbar button{flex:none;border:0;cursor:pointer;white-space:nowrap;border-radius:999px;
    padding:7px 12px;font:600 12px/1 Ubuntu,system-ui,sans-serif;color:#cfe4f3;background:transparent;
    transition:background .15s,color .15s}
  #pvbar button:hover{background:rgba(255,255,255,.12);color:#fff}
  #pvbar button[aria-current="true"]{background:#53c2fe;color:#062339}
  #pvbar button:focus-visible{outline:2px solid #7ad2ff;outline-offset:2px}
  body{padding-bottom:76px}
  #pvmiss{display:none;max-width:640px;margin:70px auto;padding:26px 28px;border:1px solid var(--color-border);
    border-radius:10px;background:var(--sky-50);font-family:Ubuntu,system-ui,sans-serif}
  #pvmiss h2{margin:0 0 .4rem}
  @media print{#pvbar{display:none}}
</style>

<div id="pvroot"></div>
<div id="pvbar"><b>Preview</b>${navBtns}</div>

<script>
window.__CHROME__ = ${J({ nl: inline(chromeNL.header), nlF: inline(chromeNL.footer), en: inline(chromeEN.header), enF: inline(chromeEN.footer) })};
window.__PAGES__ = ${J(Object.fromEntries(Object.entries(pages).map(([k,v]) => [k, inline(v)])))};
window.__LABELS__ = ${J(Object.fromEntries(ALL))};
window.__IMG__ = ${J(dataUri)};
</script>
<script>
(function(){
  var root=document.getElementById('pvroot'), bar=document.getElementById('pvbar');
  function norm(h){ h=(h||'').replace(/^#/,''); return h && h.charAt(0)==='/' ? h : '/'; }
  function render(route){
    var body=window.__PAGES__[route];
    var en=route.indexOf('/en/')===0;
    var C=window.__CHROME__;
    if(body===undefined){
      root.innerHTML=(en?C.en:C.nl)+
        '<div id="pvmiss" style="display:block"><h2>Niet in deze preview</h2><p>De pagina <code>'+route+
        '</code> bestaat wel op de echte site, maar zit niet in dit voorbeeld. Kies hieronder een andere pagina.</p></div>'+
        (en?C.enF:C.nlF);
    } else {
      root.innerHTML=(en?C.en:C.nl)+body+(en?C.enF:C.nlF);
    }
    root.querySelectorAll('img[data-src]').forEach(function(im){
      var u=window.__IMG__[im.getAttribute('data-src')];
      if(u){ im.src=u; } else { im.remove(); }
    });
    bar.querySelectorAll('button').forEach(function(b){
      b.setAttribute('aria-current', b.getAttribute('data-go')===route ? 'true':'false');
    });
    document.title=(window.__LABELS__[route]||'Pagina')+' — MrGolfbal Preview';
    window.scrollTo(0,0);
    if(window.__initSite__) window.__initSite__();
  }
  function go(route){ if(norm(location.hash)!==route){ location.hash=route; } else { render(route); } }
  bar.addEventListener('click',function(e){
    var b=e.target.closest('button[data-go]'); if(b) go(b.getAttribute('data-go'));
  });
  document.addEventListener('click',function(e){
    var a=e.target.closest('a'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(href.charAt(0)==='/'){ e.preventDefault(); go(href.split('#')[0]); }
  });
  window.addEventListener('hashchange',function(){ render(norm(location.hash)); });
  render(norm(location.hash));
})();
</script>
<script>
/* site.js van de echte site, opnieuw aanroepbaar na elke paginawissel */
window.__initSite__=function(){
${js}
};
window.__initSite__();
</script>
`;
writeFileSync(join(root, 'preview.html'), out);
console.log('preview.html geschreven —', routes.length, 'pagina\'s,', (Buffer.byteLength(out)/1048576).toFixed(2), 'MB');
