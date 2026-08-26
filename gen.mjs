/* Eenvoudige statische generator: gedeelde header/footer + per-pagina content.
   Genereert /<slug>/index.html. Nav & footer staan HIER één keer (single source). */
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { EN_PAGES, EN_PRODUCTS, EN_KB, EN_KB_CATS } from './content-en.mjs';
import { TOEPASSINGEN } from './content-toepassingen/index.mjs';
import { PILLARS } from './content-pillars/index.mjs';
import { LOCATIES } from './content-locaties/index.mjs';
import { GOLFCLUBS } from './content-locaties/golfclubs.mjs';
import { GS_TOEPASSINGEN } from './content-golfshow-toepassingen/index.mjs';
import { TRIPS } from './content-trips/index.mjs';
import { POSTS } from './content-blog/index.mjs';
import { EXTRA, EXTRA_PRODUCTS } from './content-extra/index.mjs';
import { KB_EXTRA, KB_EXTRA_EN } from './content-kb-extra/index.mjs';
import { PRODUCT_COPY, PRODUCT_FAQ_COPY } from './content-products/index.mjs';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
// Elke productkaart op de hele site krijgt de echte balfoto in plaats van de
// getekende mockup. Eén centrale plek, zodat er nergens één wordt vergeten.
const withBallPhotos = (out, html) => {
  if (!out.endsWith('.html')) return html;
  // interne werknotities horen niet op de site; vangnet voor het geval er
  // ooit weer een confirm-tag in de content sluipt
  html = html.replace(/\s*<span class="confirm-tag">[^<]*<\/span>/g, '');
  const lang = /\/en\//.test(out) ? 'en' : 'nl';
  return html.replace(/(<a href="(?:\/en)?\/products\/([a-z0-9-]+)\/?"><div class="card__media">)[\s\S]*?(<\/div><\/a>)/g,
      (m, open_, handle, close) => PRODUCT_PHOTOS[handle] ? open_ + ballPhoto(handle, lang, 0) + close : m)
    .replace(/<div class="card__media"><div class="ballshot"[\s\S]*?<\/div><\/div><\/div>(<div class="card__body">[\s\S]{0,600}?data-shopify-handle="([a-z0-9-]+)")/g,
      (m, tail, handle) => PRODUCT_PHOTOS[handle] ? `<div class="card__media">${ballPhoto(handle, lang, 0)}</div>${tail}` : m);
};
const writeFileSync2 = (out, html) => { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, withBallPhotos(out, html)); };

const SITE = 'https://mrgolfbal.nl';
const LANGS = ['nl', 'en'];
const pfx = (lang) => lang === 'en' ? '/en' : '';           // pad-prefix per taal
const enHref = (u) => '/en' + (u === '/' ? '/' : u);
// Prefix interne, root-relatieve links in content-HTML voor de EN-versie.
// Sla assets, Shopify-policies, anchors, externe/tel/mailto-links over.
const INTERNAL = /((?:href|action)=")(\/(?!assets\/|policies\/|en\/)[^"]*)"/g;
const INTERNAL_JS = /href:'(\/(?!assets\/|policies\/|en\/)[^']*)'/g;   // href:'/…' in inline JS (golfbalkiezer)
const localize = (html, lang) => lang === 'en'
  ? html.replace(INTERNAL, (m, p, u) => p + enHref(u) + '"').replace(INTERNAL_JS, (m, u) => "href:'" + enHref(u) + "'")
  : html;

// Icoon in de "Start met bedrukken"-knop (golfbal op tee).
const CTA_ICO = '<svg class="btn__ico" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8.4 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3.6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3.6 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-5.4 3.3a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3.6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2ZM12 14.6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';

// ---- UI-teksten per taal (chrome: nav, footer, knoppen) ----
const UI = {
  nl: {
    htmlLang:'nl', ogLocale:'nl_NL', menu:'Hoofdmenu', home:'Home',
    kopen:'Golfballen kopen', bedrukte:'Bedrukte golfballen', titleist:'Titleist golfballen', pinnacle:'Pinnacle golfballen',
    onbedrukt:'Onbedrukte golfballen (bulk)', personaliseren:'Golfballen personaliseren',
    toepassingen:'Toepassingen', voorBedrijven:'Voor bedrijven', voorClubs:'Voor golfclubs &amp; toernooien',
    relatiegeschenk:'Als relatiegeschenk', bedrijfsgolfdag:'Voor de bedrijfsgolfdag',
    welke:'Welke golfbal?', contact:'Contact', startCta:'Start met bedrukken', ddKopen:'Assortiment', ddToep:'Toepassingen',
    footBrandP:'Originele golfballen — bedrukt met jouw logo of blanco in grote aantallen. Persoonlijk advies van PGA-professional Mark Reynolds.',
    footGolf:'Golfballen', fGolfBedrukken:'Golfballen bedrukken', fOnbedrukt:'Onbedrukt (grote aantallen)', fPerson:'Personaliseren',
    footWie:'Voor wie', fKiezer:'Golfbalkiezer', fKennisbank:'Kennisbank', fZoWerkt:'Zo werkt het',
    footService:'Service', fOverMark:'Over Mark', fVerzending:'Verzending', fRetour:'Retour', fPrivacy:'Privacy',
    footCtaH:'Klaar om je golfballen te laten bedrukken?', footCtaP:'Kies je model, ontvang eerst een digitale drukproef en een offerte op maat.',
    footCtaBtn:'Digitale drukproef &amp; offerte ontvangen →', badge1:'Digitale drukproef vooraf', badge2:'Offerte op maat',
    heroAdvice:'Vraag advies aan Mark', jouw:'JOUW', logo:'LOGO',
    ctaEye:'Klaar om te starten?', ctaH:'Bedruk je golfballen met logo, tekst of ontwerp',
    ctaP:'Kies je model, upload je logo en ontvang eerst een digitale drukproef.',
    ctaConfig:'Start de configurator →', waLabel:'WhatsApp Mark',
    golfshows:'Golfshows', golftrips:'Golftrips', overons:'Over ons', alleToep:'Alle toepassingen', toepHub:'Toepassingen', klanten:'500+ tevreden klanten',
    golfballenNav:'Golfballen', golfles:'Golfles', trickshow:'Trickshow', golfrepairs:'Golf repairs', belBtn:'Bel Mark', waBtn:'App Mark', qrHint:'Scan met je telefoon om te appen',
    topUsp1:'Gratis digitale drukproef vooraf', topUsp2:'Originele Titleist &amp; Pinnacle', topUsp3:'Advies van PGA-professional',
    topUsp4:'Vanaf 144 golfballen', topUsp5:'Levertijd 5\u201315 werkdagen', ervaring:'25 jaar ervaring', belLabel:'Bel direct'
  },
  en: {
    htmlLang:'en', ogLocale:'en_GB', menu:'Main menu', home:'Home',
    kopen:'Buy golf balls', bedrukte:'Printed golf balls', titleist:'Titleist golf balls', pinnacle:'Pinnacle golf balls',
    onbedrukt:'Blank golf balls (bulk)', personaliseren:'Personalise golf balls',
    toepassingen:'Applications', voorBedrijven:'For businesses', voorClubs:'For golf clubs &amp; tournaments',
    relatiegeschenk:'As a corporate gift', bedrijfsgolfdag:'For your company golf day',
    welke:'Which golf ball?', contact:'Contact', startCta:'Start printing', ddKopen:'Range', ddToep:'Applications',
    footBrandP:'Original golf balls — printed with your logo or blank in large quantities. Personal advice from PGA professional Mark Reynolds.',
    footGolf:'Golf balls', fGolfBedrukken:'Print golf balls', fOnbedrukt:'Blank (large quantities)', fPerson:'Personalise',
    footWie:'Who it’s for', fKiezer:'Golf ball finder', fKennisbank:'Knowledge base', fZoWerkt:'How it works',
    footService:'Service', fOverMark:'About Mark', fVerzending:'Shipping', fRetour:'Returns', fPrivacy:'Privacy',
    footCtaH:'Ready to have your golf balls printed?', footCtaP:'Choose your model, receive a digital proof first and a tailored quote.',
    footCtaBtn:'Get a digital proof &amp; quote →', badge1:'Digital proof first', badge2:'Tailored quote',
    heroAdvice:'Ask Mark for advice', jouw:'YOUR', logo:'LOGO',
    ctaEye:'Ready to start?', ctaH:'Print your golf balls with a logo, text or design',
    ctaP:'Choose your model, upload your logo and receive a digital proof first.',
    ctaConfig:'Open the configurator →', waLabel:'WhatsApp Mark',
    golfshows:'Golf shows', golftrips:'Golf trips', overons:'About us', alleToep:'All applications', toepHub:'Applications', klanten:'500+ satisfied customers',
    golfballenNav:'Golf balls', golfles:'Golf lessons', trickshow:'Trick show', golfrepairs:'Golf repairs', belBtn:'Call Mark', waBtn:'WhatsApp', qrHint:'Scan with your phone to chat',
    topUsp1:'Free digital proof first', topUsp2:'Original Titleist &amp; Pinnacle', topUsp3:'Advice from a PGA professional',
    topUsp4:'From 144 golf balls', topUsp5:'Delivery 5\u201315 working days', ervaring:'25 years of experience', belLabel:'Call now'
  }
};

// ---- Icoon-set (inline SVG, currentColor) — voor USP's, features en secties ----
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  invoice: '<path d="M6 2h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M15 2v5h5"/><path d="M9 13h6M9 17h4"/>',
  heart: '<path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.4"/>',
  handshake: '<path d="m11 17 2 2 3-3 3 3 3-3-6-6-2 2-3-3-3 3"/><path d="m2 11 4-4 3 3"/>',

  check:'<path d="M20 6 9 17l-5-5"/>',
  phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.6 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z"/>',
  star:'<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  proof:'<path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="2"/>',
  palette:'<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10.5" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="15.5" cy="10.5" r="1"/><path d="M12 21a3 3 0 0 0 0-6 2 2 0 0 1 0-4"/>',
  truck:'<rect x="1" y="6" width="13" height="10" rx="1"/><path d="M14 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="1.6"/><circle cx="17" cy="18" r="1.6"/>',
  gift:'<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M12 9v12M3 13h18M12 9S9 3 6.5 4.5 9 9 12 9Zm0 0s3-6 5.5-4.5S15 9 12 9Z"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 5.2a3.2 3.2 0 0 1 0 6.1M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
  trophy:'<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 0-3 3"/>',
  flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  spark:'<path d="M12 2v6m0 8v6M4.9 4.9l4.2 4.2m5.8 5.8 4.2 4.2M2 12h6m8 0h6M4.9 19.1l4.2-4.2m5.8-5.8 4.2-4.2"/>',
  ball:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r=".8"/><circle cx="13" cy="8" r=".8"/><circle cx="16" cy="11" r=".8"/><circle cx="11" cy="12" r=".8"/><circle cx="15" cy="15" r=".8"/><circle cx="9" cy="14" r=".8"/>',
  chat:'<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  euro:'<path d="M16 5a7 7 0 1 0 0 14M5 10h7M5 14h7"/>',
  building:'<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
  instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  youtube:'<rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10.5 9.2v5.6l4.6-2.8z" fill="currentColor" stroke="none"/>',
  linkedin:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4M11 17v-7"/>',
  twitter:'<path d="M4 4l7 9M4 20l7-8M13 11l7-7M13 13l7 7" /><path d="M4 4h3l13 16h-3z" fill="currentColor" stroke="none"/>',
  facebook:'<path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.5c0-.4.3-.5.6-.5z" fill="currentColor" stroke="none"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  pin:'<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
};
// Alle socials/contactkanalen (echt, aangeleverd door de klant).
const SOCIALS = [
  { ic:'instagram', label:'Instagram · @MrGolfbal', href:'https://www.instagram.com/mrgolfbal/' },
  { ic:'instagram', label:'Instagram · @MarkReynoldsPGA', href:'https://www.instagram.com/markreynoldspga/' },
  { ic:'youtube', label:'YouTube · @watchmark', href:'https://www.youtube.com/@watchmark/videos' },
  { ic:'linkedin', label:'LinkedIn · Mark Reynolds', href:'https://www.linkedin.com/in/mark-reynolds-1a12756/' },
  { ic:'twitter', label:'X · @markreynoldspga', href:'https://twitter.com/markreynoldspga' },
  { ic:'facebook', label:'Facebook · Mark Reynolds', href:'https://www.facebook.com/mark.reynolds.7399' },
];
const ico = (name, cls='ico-svg') => `<svg class="${cls}" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.check}</svg>`;

// Sitewide organisatie-schema (merk-entiteit). Alleen bekende feiten.
const siteLD = (lang) => `<script type="application/ld+json">${JSON.stringify({
  '@context':'https://schema.org','@type':'Organization','@id':'https://mrgolfbal.nl/#org',
  name:'MrGolfbal.nl', url:'https://mrgolfbal.nl/', logo:'https://mrgolfbal.nl/assets/img/og-home.jpg',
  image:'https://mrgolfbal.nl/assets/img/og-home.jpg',
  description: lang==='en'
    ? 'Original golf balls printed with your logo, text or design — Titleist and Pinnacle, with a digital proof first. Advice from PGA professional Mark Reynolds.'
    : 'Originele golfballen laten bedrukken met logo, tekst of ontwerp — Titleist en Pinnacle, met digitale drukproef vooraf. Advies van PGA-professional Mark Reynolds.',
  telephone:'+31627411925', email:'info@mrgolfbal.nl', areaServed:'NL',
  founder:{'@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional'},
  identifier:{'@type':'PropertyValue',name:'KVK',value:'27326866'}
})}</script>`;

// BreadcrumbList-schema uit een lijst {name,url?}. url = root-relatief NL-pad.
const breadcrumbLD = (items, lang='nl') => `<script type="application/ld+json">${JSON.stringify({
  '@context':'https://schema.org','@type':'BreadcrumbList',
  itemListElement: items.map((it,i)=>{ const li={'@type':'ListItem',position:i+1,name:it.name}; if(it.url) li.item=SITE+(lang==='en'?enHref(it.url):it.url); return li; })
})}</script>`;

// nlCanon = altijd het Nederlandse root-relatieve pad (met trailing slash).

/* ---- SEO-normalisatie: titels en meta-descriptions binnen de zoekmachine-
   grenzen houden (titel ~60 tekens, description ~155). Snijdt op een natuurlijk
   scheidingsteken, nooit midden in een woord. ---- */
const _plain = (x) => String(x).replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&[a-z]+;/g,'x');
const seoTitle = (t) => {
  if (_plain(t).length <= 62) return t;
  const brand = / \| MrGolfbal\.nl$/;
  let out = t.replace(brand, '');
  if (_plain(out).length <= 62) return out;
  for (const sep of [' — ', ': ', ' – ', ', ']) {
    const i = out.lastIndexOf(sep);
    if (i > 24 && _plain(out.slice(0, i)).length <= 62) return out.slice(0, i);
  }
  const cut = out.slice(0, 60);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '');
};
const seoDesc = (d) => {
  if (_plain(d).length <= 160) return d;
  const head = d.slice(0, 158);
  const stop = Math.max(head.lastIndexOf('. '), head.lastIndexOf('! '), head.lastIndexOf('? '));
  if (stop > 90) return d.slice(0, stop + 1);
  return head.slice(0, head.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…';
};

const HEAD = (t0, d0, nlCanon, lang='nl', extra='', noEn=false, noIndex=false) => {
  const u = UI[lang];
  const t = seoTitle(t0), d = seoDesc(d0);
  const canon = SITE + pfx(lang) + nlCanon;
  return `<!doctype html>
<html lang="${u.htmlLang}"><head>
<script>document.documentElement.className+=' js';</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${canon}">
<link rel="alternate" hreflang="nl" href="${SITE}${nlCanon}">
${noEn ? '' : `<link rel="alternate" hreflang="en" href="${SITE}${enHref(nlCanon)}">`}
<link rel="alternate" hreflang="x-default" href="${SITE}${nlCanon}">
<meta name="robots" content="${noIndex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta property="og:type" content="website"><meta property="og:site_name" content="MrGolfbal.nl"><meta property="og:locale" content="${u.ogLocale}">
<meta property="og:title" content="${t}"><meta property="og:description" content="${d}">
<meta property="og:url" content="${canon}"><meta property="og:image" content="https://mrgolfbal.nl/assets/img/og-home.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${d}"><meta name="twitter:image" content="https://mrgolfbal.nl/assets/img/og-home.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="icon" href="/assets/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/styles.css?v=29">
${siteLD(lang)}${extra}</head><body>`;
};

// Taalswitcher: linkt altijd naar beide talen van DEZE pagina (nlCanon = NL-pad).
const FLAG_NL = '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#fff"/><path d="M0 2a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.33H0Z" fill="#AE1C28"/><path d="M0 10.67h24V14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2Z" fill="#21468B"/></svg>';
const FLAG_EN = '<svg class="flag" viewBox="0 0 24 16" aria-hidden="true"><rect width="24" height="16" rx="2" fill="#012169"/><path d="M0 0l24 16M24 0L0 16" stroke="#fff" stroke-width="3.2"/><path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" stroke-width="1.9"/><path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5.4"/><path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3.2"/></svg>';
const langSwitch = (nlCanon, lang, noEn=false) => {
  const cur = lang === 'en' ? { flag: FLAG_EN, code: 'EN' } : { flag: FLAG_NL, code: 'NL' };
  if (noEn) return '';
  return `<div class="lang-switch" data-lang-switch>
  <button class="lang-switch__btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="${lang==='en'?'Change language':'Taal wijzigen'}">
    ${cur.flag}<span>${cur.code}</span><span class="lang-switch__caret" aria-hidden="true">▾</span>
  </button>
  <div class="lang-switch__menu" role="listbox" hidden>
    <a href="${nlCanon}" hreflang="nl" lang="nl" role="option" aria-selected="${lang==='nl'}"${lang==='nl'?' class="is-current"':''}>${FLAG_NL}<span>Nederlands</span></a>
    ${noEn ? '' : `<a href="${enHref(nlCanon)}" hreflang="en" lang="en" role="option" aria-selected="${lang==='en'}"${lang==='en'?' class="is-current"':''}>${FLAG_EN}<span>English</span></a>`}
  </div>
</div>`;
};

// WhatsApp-icoon + contactknoppen (bellen + WhatsApp met desktop-QR).
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg>';
// WhatsApp-knop in exact dezelfde vorm en maat als de andere knoppen.
const waBtn = (lang='nl', variant='light', label=null, lg=true) =>
  `<a class="btn btn--${variant}${lg?' btn--lg':''}" href="https://wa.me/31627411925">${WA_ICON}<span>${label || (lang==='en'?'WhatsApp Mark':'App Mark')}</span></a>`;

const contactBtns = (lang='nl', withQr=true) => { const u = UI[lang]; return `<div class="contact-btns">
    <a class="cbtn cbtn--call" href="tel:+31627411925">${ico('phone','')}<span>${u.belBtn}</span></a>
    <div class="wa-wrap">
      <a class="cbtn cbtn--wa" href="https://wa.me/31627411925" data-wa aria-haspopup="dialog">${WA_ICON}<span>${u.waBtn}</span></a>
      ${withQr ? `<div class="wa-qr" role="dialog" aria-label="WhatsApp QR" hidden><img src="/assets/img/wa-qr.png" width="150" height="150" alt="QR-code — WhatsApp MrGolfbal" loading="lazy"><p>${u.qrHint}</p></div>` : ''}
    </div>
  </div>`; };

// Topbar met USP's, social proof en belknop.
const TOPBAR = (lang='nl') => {
  const u = UI[lang];
  return `<div class="topbar"><div class="container topbar-in">
    <div class="topbar-marquee" data-marquee>
      <ul class="topbar-usps">
        <li>${ico('check','tb-ico')}${u.topUsp1}</li>
        <li>${ico('shield','tb-ico')}${u.topUsp2}</li>
        <li>${ico('star','tb-ico')}${u.topUsp3}</li>
        <li>${ico('trophy','tb-ico')}${u.topUsp4}</li>
        <li>${ico('clock','tb-ico')}${u.topUsp5}</li>
      </ul>
    </div>
    <div class="topbar-right">
      <span class="topbar-proof">${ico('users','tb-ico')}<strong>${u.klanten}</strong></span>
      <span class="topbar-proof topbar-proof--alt">${ico('trophy','tb-ico')}<strong>${u.ervaring}</strong></span>
      ${contactBtns(lang)}
    </div>
  </div></div>`;
};

const HEADER = (lang='nl', nlCanon='/', noEn=false) => {
  const u = UI[lang], p = pfx(lang);
  return `<div class="site-top">${TOPBAR(lang)}
<header class="site-header"><div class="container header-bar">
  <a class="logo" href="${p}/"><b>Mr<span>Golfbal</span>.nl</b><small>by Mark Reynolds</small></a>
  <nav class="main-nav" aria-label="${u.menu}">
    <a href="${p}/">${ico('home','nav-ico')}${u.home}</a>
    <div class="has-dropdown"><a href="${p}/golfballen-bedrukken/">${ico('ball','nav-ico')}${u.golfballenNav} <span class="dd-caret" aria-hidden="true">▾</span></a><div class="dropdown">
      <div class="dd-head">${u.ddKopen}</div>
      <a href="${p}/golfballen-bedrukken/">${u.bedrukte}</a>
      <a href="${p}/titleist-golfballen-bedrukken/">${u.titleist}</a>
      <a href="${p}/pinnacle-golfballen-bedrukken/">${u.pinnacle}</a>
      <a href="${p}/onbedrukte-golfballen/">${u.onbedrukt}</a>
      <a href="${p}/golfballen-personaliseren/">${u.personaliseren}</a>
      <div class="dd-head">${lang==='en'?'More':'Meer'}</div>
      <a href="${p}/toepassingen/">${u.alleToep}</a>
      ${lang==='nl' ? '<a href="/blog/">Blog</a>' : ''}
      <a href="${p}/golfbalkiezer/">${u.welke}</a>
      <a href="${p}/golf-repairs/">${u.golfrepairs}</a>
      <a href="${p}/over-mark/">${u.overons}</a>
    </div></div>
    <a href="${p}/golfles/">${ico('flag','nav-ico')}${u.golfles}</a>
    <a href="${p}/golfshows/">${ico('spark','nav-ico')}${u.trickshow}</a>
    <a href="${p}/golftrips/">${ico('pin','nav-ico')}${u.golftrips}</a>
    <a href="${p}/contact/">${ico('chat','nav-ico')}${u.contact}</a>
  </nav>
  <div class="header-actions">
    ${langSwitch(nlCanon, lang, noEn)}
    <a class="btn btn--primary btn--hide-sm" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.startCta}</a>
    <button class="nav-toggle" type="button" aria-label="${u.menu}" aria-expanded="false" aria-controls="mobnav">
      <span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span>
    </button>
  </div>
</div>
<div class="mobnav" id="mobnav" hidden>
  <nav class="mobnav__in" aria-label="${u.menu}">
    <a href="${p}/">${u.home}</a>
    <div class="mobnav__head">${u.ddKopen}</div>
    <a href="${p}/golfballen-bedrukken/">${u.bedrukte}</a>
    <a href="${p}/titleist-golfballen-bedrukken/">${u.titleist}</a>
    <a href="${p}/pinnacle-golfballen-bedrukken/">${u.pinnacle}</a>
    <a href="${p}/onbedrukte-golfballen/">${u.onbedrukt}</a>
    <a href="${p}/golfballen-personaliseren/">${u.personaliseren}</a>
    <div class="mobnav__head">${lang==='en'?'Services':'Diensten'}</div>
    <a href="${p}/golfles/">${u.golfles}</a>
    <a href="${p}/golfshows/">${u.trickshow}</a>
    <a href="${p}/golftrips/">${u.golftrips}</a>
    <a href="${p}/golf-repairs/">${u.golfrepairs}</a>
    <div class="mobnav__head">${lang==='en'?'More':'Meer'}</div>
    <a href="${p}/toepassingen/">${u.alleToep}</a>
    <a href="${p}/golfbalkiezer/">${u.welke}</a>
    <a href="${p}/kennisbank/">${u.fKennisbank}</a>
    ${lang==='nl' ? '<a href="/blog/">Blog</a><a href="/golfshows/toepassingen/">Golfshow-toepassingen</a>' : ''}
    <a href="${p}/over-mark/">${u.overons}</a>
    <a href="${p}/contact/">${u.contact}</a>
    <a class="btn btn--primary btn--block mobnav__cta" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.startCta}</a>
  </nav>
</div>
</header></div>`;
};

// Zwevende bel-/appknoppen aan de zijkant van de homepage.
const sideRail = (lang='nl') => { const u = UI[lang];
  return `<div class="siderail" data-siderail>
    <a class="siderail__btn siderail__btn--call" href="tel:+31627411925">${ico('phone','')}<span>${u.belBtn}</span></a>
    <a class="siderail__btn siderail__btn--wa" href="https://wa.me/31627411925">${WA_ICON}<span>${lang==='en'?'WhatsApp':'App Mark'}</span></a>
  </div>`;
};

// ---- Herbruikbare blokken (lang-aware) ----
// Hoe werkt het (4 stappen)
const howItWorks = (lang='nl') => {
  const p = pfx(lang);
  const T = lang==='en'
    ? {eye:'How it works',h:'From logo to printed golf balls in 4 steps',steps:[['Choose your golf ball','Pick a brand and model that suits your audience and budget — or use the golf ball finder.'],['Upload your logo or text','Supply your design (EPS, AI or PDF preferred) or type a name in the configurator.'],['Approve the digital proof','You receive a digital proof of the logo on the ball. Production only starts after your approval.'],['Receive your golf balls','Delivery in 5–15 working days after you approve the proof.']]}
    : {eye:'Hoe werkt het',h:'Van logo tot bedrukte golfballen in 4 stappen',steps:[['Kies je golfbal','Selecteer een merk en model dat past bij je doelgroep en budget — of gebruik de golfbalkiezer.'],['Upload je logo of tekst','Lever je ontwerp aan (bij voorkeur EPS, AI of PDF) of typ een naam in de configurator.'],['Keur de digitale drukproef goed','Je ontvangt een digitale proef van het logo op de bal. Productie start pas na jouw akkoord.'],['Ontvang je golfballen','Levering in 5–15 werkdagen na goedkeuring van de drukproef.']]};
  return `<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">${T.eye}</p><h2>${T.h}</h2></div>
    <div class="steps grid grid-4" style="margin-top:1.6rem">
    ${T.steps.map(([h,pp])=>`<div class="step step--card"><div class="num"></div><div><h3>${h}</h3><p>${pp}</p></div></div>`).join('')}
    </div>
    <div class="row" style="margin-top:1.6rem"><a class="btn btn--primary btn--lg" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${lang==='en'?'Start now':'Start nu'} →</a><a class="btn btn--ghost btn--lg" href="${p}/zo-werkt-het/">${lang==='en'?'Read the full process':'Lees het hele proces'} →</a></div>
  </div></section>`;
};
// Waarom MrGolfbal (6 redenen met iconen)
const whyUs = (lang='nl') => {
  const T = lang==='en'
    ? {eye:'Why MrGolfbal.nl',h:'Why choose MrGolfbal for your printed golf balls',items:[['shield','Only original brands','We print exclusively on genuine Titleist and Pinnacle balls — never imitations.'],['proof','Always a proof first','You approve a digital proof before we print a single ball. No surprises.'],['star','Advice from a PGA pro','Founder Mark Reynolds is a PGA professional who helps you pick the right ball.'],['palette','Sharp, durable print','Professional print in up to 5 spot colours that keeps looking good on the course.'],['euro','Tiered pricing','From 144 balls, with better prices per ball as your quantity grows.'],['users','500+ satisfied customers','Businesses, golf clubs and event organisers across the Netherlands trust us.']]}
    : {eye:'Waarom MrGolfbal.nl',h:'Waarom kiezen voor MrGolfbal voor je bedrukte golfballen',items:[['shield','Alleen originele merken','We bedrukken uitsluitend échte Titleist- en Pinnacle-ballen — nooit imitaties.'],['proof','Altijd eerst een drukproef','Je keurt een digitale drukproef goed vóór we ook maar één bal bedrukken. Geen verrassingen.'],['star','Advies van een PGA-pro','Oprichter Mark Reynolds is PGA-professional en helpt je de juiste bal kiezen.'],['palette','Scherpe, duurzame opdruk','Professionele bedrukking in tot 5 spotkleuren die er op de baan goed uit blijft zien.'],['euro','Staffelprijzen','Vanaf 144 ballen, met een gunstigere prijs per bal naarmate je aantal groeit.'],['users','500+ tevreden klanten','Bedrijven, golfclubs en eventorganisatoren door heel Nederland gingen je voor.']]};
  return `<section class="section"><div class="container"><div class="section-head accent-line"><p class="eyebrow">${T.eye}</p><h2>${T.h}</h2></div>
    <div class="grid grid-3" style="margin-top:1.6rem">
    ${T.items.map(([ic,h,pp])=>`<div class="feature feature--ico"><div class="ico">${ico(ic)}</div><h3>${h}</h3><p>${pp}</p></div>`).join('')}
    </div>
  </div></section>`;
};
// FAQ-blok met FAQPage-schema. items = [[vraag, antwoord], ...]
const faqBlock = (items, lang='nl', withSchema=true) => {
  const eye = lang==='en' ? 'FAQ' : 'Veelgestelde vragen';
  const h = lang==='en' ? 'Frequently asked questions' : 'Veelgestelde vragen';
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: items.map(([q,a])=>({'@type':'Question',name:q.replace(/<[^>]+>/g,''),acceptedAnswer:{'@type':'Answer',text:a.replace(/<[^>]+>/g,'')}}))
  })}</script>`;
  return `<section class="section section--sky"><div class="container" style="max-width:860px"><div class="section-head accent-line"><p class="eyebrow">${eye}</p><h2>${h}</h2></div>
    <div class="faq" style="margin-top:1.4rem">
    ${items.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${q}</summary><div class="faq-body">${a}</div></details>`).join('')}
    </div>${withSchema ? ld : ''}
  </div></section>`;
};

// Gedeelde FAQ over bedrukken (met FAQPage-schema) — voor elke bedruk-pagina.
const FAQ_PAGES = new Set(['zo-werkt-het','golfballen-bedrukken-voor-bedrijven']);
const printingFaq = (lang='nl', slug='', withSchema=false) => faqBlock(lang==='en' ? [
  ['What is the minimum order?','The minimum order is 144 golf balls, for example 6 boxes of 24 or 12 dozen. Larger quantities earn tiered discounts.'],
  ['Do I get a digital proof first?','Yes, always. You receive a digital proof of your logo on the ball and production only starts after your approval.'],
  ['How long does delivery take?','Allow 5 to 15 working days after you approve the digital proof.'],
  ['How many colours can I print?','Golf balls are printed in 1 to 5 spot colours. Provide your brand colours as PMS/Pantone values for the best match.'],
  ['How do I supply my logo?','Preferably as a vector file (EPS, AI or PDF) so the logo comes out perfectly crisp. A high-resolution PNG can work for simple logos.'],
  ['Can I play with printed golf balls?','Yes. They are original branded balls with a professional print, so they play exactly like unprinted balls.'],
] : [
  ['Wat is de minimale afname?','De minimale afname is 144 golfballen, bijvoorbeeld 6 dozen van 24 of 12 dozijn. Bij grotere aantallen geldt staffelkorting.'],
  ['Krijg ik eerst een digitale drukproef?','Ja, altijd. Je ontvangt een digitale drukproef van je logo op de bal en de productie start pas na jouw akkoord.'],
  ['Hoe lang duurt de levering?','Reken op 5 tot 15 werkdagen nadat je de digitale drukproef hebt goedgekeurd.'],
  ['Hoeveel kleuren kan ik bedrukken?','Golfballen bedrukken we in 1 tot 5 spotkleuren. Geef je huisstijlkleuren door als PMS/Pantone-waarden voor de beste match.'],
  ['Hoe lever ik mijn logo aan?','Bij voorkeur als vectorbestand (EPS, AI of PDF) voor een haarscherp resultaat. Voor eenvoudige logo\\u2019s kan een PNG in hoge resolutie ook.'],
  ['Kan ik met bedrukte golfballen spelen?','Ja. Het zijn originele merkballen met een professionele opdruk, dus ze spelen precies als onbedrukte ballen.'],
], lang, withSchema);

// Extra SEO-secties per pagina (uit content-extra) — vult pagina's aan richting 2500+ woorden.
const extraSections = (slug, lang, store=EXTRA) => {
  const e = slug && store[slug] && store[slug][lang];
  if (!e || !e.length) return '';
  return `<section class="section"><div class="container"><div class="prose">${localize(e.map(s=>`<h2>${s.h}</h2>${s.html}`).join(''), lang)}</div></div></section>`;
};

/* ---- Klantreviews: ALLEEN echte, door de klant aangeleverde en te bevestigen reviews.
   Leeg = geen review-sectie (geen verzonnen reviews). Vul met geverifieerde voorbeelden. ---- */
const REVIEWS = []; // { stars, nl:{t,q}, en:{t,q}, by, city }  ← alleen echte, met toestemming
const reviewsBlock = (lang='nl') => {
  if (!REVIEWS.length) return ''; // geen sectie tot er echte reviews zijn aangeleverd
  const en = lang==='en';
  return `<section class="section"><div class="container"><div class="section-head section-head--center accent-line" style="margin-inline:auto"><p class="eyebrow">${en?'Reviews':'Klantbeoordelingen'}</p><h2>${en?'What our customers say':'Wat onze klanten zeggen'}</h2></div>
    <div class="reviews-rail">
    ${REVIEWS.map(r=>`<article class="review"><div class="stars" aria-label="${r.stars} ${en?'out of 5 stars':'van de 5 sterren'}">${'★'.repeat(r.stars)}</div><h3>${r[lang].t}</h3><p>“${r[lang].q}”</p><div class="rev-by"><b>${r.by}</b><span>${r.city}</span></div></article>`).join('')}
    </div></div></section>`;
};
const socialsBlock = (lang='nl') => {
  const en = lang==='en';
  // Live, automatisch bijgewerkte social-feed via Elfsight (door klant aangeleverd).
  const feed = `<div class="elfsight-app-07f44f44-5464-46c5-b3a4-1815ba74bc6f" data-elfsight-app-lazy></div>`;
  return `<section class="section"><div class="container"><div class="socials">
    <p class="eyebrow" style="color:var(--color-blue)">${en?'Follow us':'Volg ons'}</p>
    <h2>${en?'The latest and best from our socials!':'Het nieuwste en beste van onze socials!'}</h2>
    <p>${en?'Follow us on Instagram, YouTube, LinkedIn, X and Facebook for printed golf balls, golf shows and behind the scenes.':'Volg ons op Instagram, YouTube, LinkedIn, X en Facebook voor bedrukte golfballen, golfshows en behind the scenes.'}</p>
    <div class="ig-feed">${feed}</div>
    <div class="social-links">
      ${SOCIALS.map(s=>`<a href="${s.href}" rel="noopener" target="_blank">${ico(s.ic,'ico-svg')} ${s.label}</a>`).join('')}
    </div>
    <p style="margin-top:1rem;font-size:.9rem;color:#cfe4f3">${en?'Or reach us directly:':'Of bereik ons direct:'} <a href="mailto:info@mrgolfbal.nl" style="color:#fff;font-weight:600">info@mrgolfbal.nl</a> · <a href="tel:+31627411925" style="color:#fff;font-weight:600">+31 6 27 41 19 25</a> · KVK 27326866</p>
  </div></div></section>`;
};
const statBand = (lang='nl') => {
  const en = lang==='en';
  const stats = en
    ? [['500+','satisfied customers'],['144','minimum order'],['5–15','working days delivery'],['PGA','professional advice']]
    : [['500+','tevreden klanten'],['144','minimale afname'],['5–15','werkdagen levering'],['PGA','advies van een pro']];
  return `<section class="section"><div class="container"><div class="statband"><div class="statrow">
    ${stats.map(([b,s])=>`<div class="stat"><b>${b}</b><span>${s}</span></div>`).join('')}
  </div></div></div></section>`;
};

/* ---- Foto-galerij (echte bedrukte-bal foto's). IMAGES_READY schakelt van
   placeholder-mockups naar echte <img>. Elke pagina krijgt via een seed een
   unieke, niet-herhalende set. Bestanden komen in /assets/img/balls/. ---- */
/* Auto-detectie: alles wat in assets/img/balls/ staat wordt automatisch
   opgepakt (jpg/jpeg/png/webp). Alt-teksten komen uit ALT_MAP wanneer de
   bestandsnaam bekend is; anders wordt de bestandsnaam netjes omgezet naar
   een beschrijvende alt-tekst. Geen bestanden = geen galerij. */
const ALT_MAP = {
  'tmi': { nl:'Bedrukte Titleist golfbal met TMI-logo in het gras', en:'Printed Titleist golf ball with the TMI logo on grass' },
  'damvast': { nl:'Bedrukte golfbal met DAMVAST-logo', en:'Printed golf ball with the DAMVAST logo' },
  'reen-vastgoed': { nl:'Bedrukte golfbal met REEN Vastgoed-logo', en:'Printed golf ball with the REEN Vastgoed logo' },
  'verwelius-bouwen': { nl:'Bedrukte golfbal met Verwelius Bouwen-logo', en:'Printed golf ball with the Verwelius Bouwen logo' },
  'mark-reynolds-mr': { nl:'Golfbal met het MR-logo van Mark Reynolds', en:'Golf ball with the MR logo of Mark Reynolds' },
  'bucket-logoballen': { nl:'Emmer vol bedrukte golfballen met bedrijfslogo\u2019s', en:'A bucket full of printed golf balls with company logos' },
  'hand-logoballen': { nl:'Hand met bedrukte golfballen met verschillende bedrijfslogo\u2019s', en:'A hand holding printed golf balls with different company logos' },
  'gezicht-golfbal': { nl:'Golfbal gepersonaliseerd met een gezicht erop', en:'Golf ball personalised with a face printed on it' },
  'foto-op-golfbal': { nl:'Hand houdt een golfbal vast met een foto van een gezicht erop bedrukt', en:'A hand holding a golf ball with a photo of a face printed on it' },
  'handvol-logoballen': { nl:'Twee handen vol bedrukte golfballen met verschillende bedrijfslogo’s', en:'Two hands full of printed golf balls with various company logos' },
  'logoballen-stapel': { nl:'Stapel bedrukte golfballen met logo’s van uiteenlopende bedrijven', en:'A pile of printed golf balls carrying logos of a range of companies' },
  'bak-logoballen': { nl:'Bak vol bedrukte golfballen met verschillende bedrijfslogo’s', en:'A tub full of printed golf balls with different company logos' },
  'gezicht-bal-boven-bak': { nl:'Hand houdt een golfbal met een gezicht erop boven een bak bedrukte ballen', en:'A hand holding a golf ball printed with a face above a tub of printed balls' },
};
const BALLS_DIR = join(root, 'assets', 'img', 'balls');
const titleize = (b) => b.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, m => m.toUpperCase());
// Generieke camera-/exportnamen (IMG_1234, DSC00012, foto3, image-2, screenshot…)
// leveren geen bruikbare alt-tekst op; die krijgen een beschrijvende SEO-alt.
const GENERIC_NAME = /^(img|image|foto|photo|dsc|dscn|pxl|screenshot|schermafbeelding|whatsapp|untitled|naamloos)[\s._-]*\d*$/i;
const FALLBACK_ALT = [
  { nl:'Bedrukte golfbal met bedrijfslogo van MrGolfbal.nl', en:'Printed golf ball with a company logo by MrGolfbal.nl' },
  { nl:'Golfballen met logo, bedrukt door MrGolfbal.nl', en:'Golf balls with a logo, printed by MrGolfbal.nl' },
  { nl:'Originele golfbal bedrukt met logo voor een bedrijfsgolfdag', en:'Original golf ball printed with a logo for a company golf day' },
  { nl:'Golfbal laten bedrukken met eigen logo — voorbeeld van MrGolfbal.nl', en:'Golf ball printed with your own logo — example by MrGolfbal.nl' },
  { nl:'Bedrukte golfballen als relatiegeschenk met bedrijfslogo', en:'Printed golf balls as a corporate gift with a company logo' },
  { nl:'Golfbal met logo-opdruk, geleverd door PGA-professional Mark Reynolds', en:'Golf ball with a printed logo, supplied by PGA professional Mark Reynolds' },
];
const BALL_IMAGES = (() => {
  let files = [];
  try { files = readdirSync(BALLS_DIR); } catch { return []; }
  const picked = files.filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();
  const skipped = files.filter(f => !/\.(jpe?g|png|webp|avif|txt|md)$/i.test(f) && !f.startsWith('.'));
  if (skipped.length) console.warn(`  [!] overgeslagen (geen webformaat): ${skipped.join(', ')}`);
  return picked.map((f, i) => {
    const base = f.replace(/\.[^.]+$/, '');
    const key = base.toLowerCase().trim();
    const alt = ALT_MAP[key] || (GENERIC_NAME.test(key) ? FALLBACK_ALT[i % FALLBACK_ALT.length] : null);
    return {
      src: encodeURIComponent(f),          // spaties/rare tekens blijven werken in de URL
      nl: alt ? alt.nl : `Bedrukte golfbal met logo — ${titleize(base)} | MrGolfbal.nl`,
      en: alt ? alt.en : `Printed golf ball with logo — ${titleize(base)} | MrGolfbal.nl`,
    };
  });
})();
console.log(`foto's gevonden in assets/img/balls/: ${BALL_IMAGES.length}`);
/* Als er (nog) geen foto's in de map staan, gebruiken we de acht verwachte
   bestandsnamen alvast. Ontbreekt een bestand op de server, dan haalt
   site.js die figure weg en verbergt hij een lege galerij — dus nooit een
   kapot plaatje. Zodra de foto's in assets/img/balls/ staan (met of zonder
   opnieuw genereren) verschijnen ze vanzelf. */
const PENDING_IMAGES = Object.entries(ALT_MAP).map(([k, v]) => ({ src: `${k}.jpg`, nl: v.nl, en: v.en }));
const GALLERY_IMAGES = BALL_IMAGES.length ? BALL_IMAGES : PENDING_IMAGES;
const GALLERY_PENDING = BALL_IMAGES.length === 0;

const ballGallery = (seed=0, lang='nl', n=5) => {
  if (!GALLERY_IMAGES.length) return '';
  const en = lang==='en';
  const picks = Array.from({length:Math.min(n, GALLERY_IMAGES.length)}, (_,i)=> GALLERY_IMAGES[(seed+i)%GALLERY_IMAGES.length]);
  const head = en ? 'Companies and customers who print their logo golf balls at MrGolfbal.nl' : 'Bedrijven en klanten die hun golfballen met logo bij MrGolfbal.nl laten bedrukken';
  const cells = picks.map(img => `<figure><img src="/assets/img/balls/${img.src}" width="500" height="500" loading="lazy" decoding="async" alt="${img[lang]}" onerror="this.closest('figure').remove()"></figure>`).join('');
  return `<section class="section section--sky"${GALLERY_PENDING?' data-gallery-pending':''}><div class="container"><div class="section-head section-head--center accent-line" style="margin-inline:auto"><p class="eyebrow">${en?'Real customers':'Echte klanten'}</p><h2>${head}</h2></div>
    <div class="ballgallery">${cells}</div>
  </div></div></section>`;
};


// Deterministische seed per pagina, zodat elke pagina een andere (niet-herhalende) fotoset krijgt.
const seedOf = (s='') => Array.from(String(s)).reduce((a,c)=>a + c.charCodeAt(0), 0);

const crumbs = (name, lang='nl') => `<div class="container"><nav class="crumbs"><a href="${pfx(lang)}/">${UI[lang].home}</a> › <span>${name}</span></nav></div>`;


/* Echte foto's van Mark Reynolds en de baan, per pagina in de hero. */
const PAGE_PHOTOS = {
  'titleist-golfballen-bedrukken': { dir:'products', file:'titleist-pro-v1x-geel.webp',
    nl:'Gele Titleist Pro V1x golfbal van dichtbij',
    en:'Close-up of a yellow Titleist Pro V1x golf ball' },
  'pinnacle-golfballen-bedrukken': { dir:'products', file:'pinnacle-soft-geel.webp',
    nl:'Gele Pinnacle Soft golfbal van dichtbij',
    en:'Close-up of a yellow Pinnacle Soft golf ball' },
  'onbedrukte-golfballen': { dir:'products', file:'titleist-blanco-wit.webp',
    nl:'Onbedrukte witte Titleist golfbal van dichtbij',
    en:'Close-up of a blank white Titleist golf ball' },
  'over-mark': { file:'mark-trofee-matchplay.jpg',
    nl:'Mark Reynolds kust de trofee van het Nationaal Open Matchplay, kampioen 2005',
    en:'Mark Reynolds kissing the Dutch National Open Matchplay trophy, 2005 champion' },
  'golfles': { file:'mark-drive.jpg',
    nl:'PGA-professional Mark Reynolds slaat af met de driver tijdens een toernooi',
    en:'PGA professional Mark Reynolds hitting a drive during a tournament' },
  'golf-repairs': { file:'mark-golfbag-klm.jpg',
    nl:'Mark Reynolds bij zijn Titleist-golfbag op het KLM Open',
    en:'Mark Reynolds beside his Titleist golf bag at the KLM Open' },
  'zo-werkt-het': { file:'mark-putt-klm-open.jpg',
    nl:'Mark Reynolds put op de green tijdens het KLM Open',
    en:'Mark Reynolds putting on the green at the KLM Open' },
};
const PILLAR_PHOTOS = {
  'golftrips': { file:'golfbaan-golftrip.jpg',
    nl:'Golfer slaat uit de bunker op een zonnige golfbaan met uitzicht op een meer',
    en:'A golfer playing out of a bunker on a sunlit golf course overlooking a lake' },
};
const heroPhoto = (ph, lang) => ph
  ? `<div class="hero-visual"><figure class="hero-photo${ph.dir==='products'?' hero-photo--ball':''}"><img src="/assets/img/${ph.dir||'mark'}/${ph.file}" width="${ph.dir==='products'?760:1400}" height="${ph.dir==='products'?760:900}" alt="${ph[lang]}" loading="eager" decoding="async" fetchpriority="high"></figure></div>`
  : '';

const heroBlock = (eyebrow, h1, sub, cta1, cta1href='/golfballen-bedrukken/#configurator', lang='nl', photo=null) => {
  const u = UI[lang], p = pfx(lang);
  const H = (href) => href.startsWith('/') ? p + href : href;
  const cta = cta1 || u.startCta;
  const withIco = /#configurator/.test(cta1href) || cta === u.startCta;
  return `
<section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3.2rem)">
  <div class="hero-copy"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p>${sub}</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="${H(cta1href)}">${withIco?CTA_ICO:''}${cta} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="${p}/contact/">${u.heroAdvice}</a></div></div>
  ${photo ? heroPhoto(photo, lang) : `<div class="hero-visual"><div class="ballshot"><div class="ball"><span class="logo-print">${u.jouw}<br><span>${u.logo}</span></span></div></div></div>`}
</div></section>`;
};

const ctaBlock = (lang='nl', canon='/', kind=null) => {
  const u = UI[lang], p = pfx(lang);
  const c = ctaFor(canon, lang, kind) || ctaFor('/', lang);
  return `
<section class="section"><div class="container"><div class="divider-cta">
  <p class="eyebrow" style="color:var(--color-blue)">${c.eye}</p>
  <h2>${c.h}</h2>
  <p>${c.p}</p>
  <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}${c.href}">${CTA_ICO}${c.btn} →</a><a class="btn btn--light btn--lg" href="${p}/contact/">${u.heroAdvice}</a></div>
</div></div></section>`;
};

const PAY_ICONS = `
<span class="pay-ico" title="iDEAL"><svg viewBox="0 0 46 16" role="img" aria-label="iDEAL"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700" font-style="italic" fill="currentColor">iDEAL</text></svg></span>
<span class="pay-ico" title="Bancontact"><svg viewBox="0 0 33 16" role="img" aria-label="Bancontact"><path d="M1 13 l7 -10 h8 l-7 10 z" fill="currentColor"/><path d="M15 13 l7 -10 h8 l-7 10 z" fill="currentColor" opacity=".55"/></svg></span>
<span class="pay-ico" title="Visa"><svg viewBox="0 0 44 16" role="img" aria-label="Visa"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" font-style="italic" fill="currentColor">VISA</text></svg></span>
<span class="pay-ico" title="Mastercard"><svg viewBox="0 0 22 16" role="img" aria-label="Mastercard"><circle cx="7" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".7"/></svg></span>
<span class="pay-ico" title="Maestro"><svg viewBox="0 0 22 16" role="img" aria-label="Maestro"><circle cx="7" cy="8" r="6.4" fill="currentColor" opacity=".45"/><circle cx="15" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>
<span class="pay-ico" title="PayPal"><svg viewBox="0 0 58 16" role="img" aria-label="PayPal"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" font-style="italic" fill="currentColor">PayPal</text></svg></span>
<span class="pay-ico" title="Apple Pay"><svg viewBox="0 0 44 16" role="img" aria-label="Apple Pay"><g transform="translate(-5.2,-2.6) scale(1.35)" fill="currentColor"><path d="M9.4 5.4c-.3.4-.8.7-1.3.6-.1-.5.2-1 .4-1.3.3-.4.8-.6 1.2-.7.1.5-.1 1-.3 1.4Zm.3.7c-.7 0-1.3.4-1.6.4-.3 0-.8-.4-1.4-.4-.7 0-1.4.4-1.7 1.1-.7 1.3-.2 3.1.5 4.1.4.5.8 1 1.3 1 .5 0 .7-.3 1.4-.3.6 0 .8.3 1.4.3.6 0 .9-.5 1.3-1 .3-.4.4-.7.6-1.1-1.5-.6-1.3-2.7.1-3.2-.4-.5-1-.8-1.4-.8Z"/></g><text x="11.5" y="13" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="600" fill="currentColor">Pay</text></svg></span>`;

const FOOTER_INNER = (lang='nl') => {
  const u = UI[lang], p = pfx(lang);
  return `
<footer class="site-footer"><div class="container">
  <div class="footer-cta">
    <div><h3>${u.footCtaH}</h3><p>${u.footCtaP}</p></div>
    <a class="btn btn--primary btn--xl" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.footCtaBtn}</a>
  </div>
  <div class="footer-grid">
    <div class="footer-col footer-brand"><b>Mr<span>Golfbal</span>.nl</b><p style="margin-top:.7rem;max-width:32ch">${u.footBrandP}</p><ul class="footcontact"><li>${ico('phone','')}<a href="tel:+31627411925">+31 6 27 41 19 25</a></li><li>${ico('mail','')}<a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a></li><li>${WA_ICON}<a href="https://wa.me/31627411925">WhatsApp Mark</a></li><li>${ico('pin','')}<span>The International, Badhoevedorp</span></li></ul></div>
    <div class="footer-col"><h4>${u.footGolf}</h4><ul><li><a href="${p}/golfballen-bedrukken/">${u.fGolfBedrukken}</a></li><li><a href="${p}/onbedrukte-golfballen/">${u.fOnbedrukt}</a></li><li><a href="${p}/titleist-golfballen-bedrukken/">Titleist</a></li><li><a href="${p}/pinnacle-golfballen-bedrukken/">Pinnacle</a></li><li><a href="${p}/golfballen-personaliseren/">${u.fPerson}</a></li></ul></div>
    <div class="footer-col"><h4>${u.footWie}</h4><ul><li><a href="${p}/golfballen-bedrukken-voor-bedrijven/">${u.voorBedrijven}</a></li><li><a href="${p}/golfballen-bedrukken-voor-golfclubs-en-toernooien/">${u.voorClubs}</a></li><li><a href="${p}/golfbalkiezer/">${u.fKiezer}</a></li><li><a href="${p}/kennisbank/">${u.fKennisbank}</a></li><li><a href="${p}/zo-werkt-het/">${u.fZoWerkt}</a></li></ul></div>
    <div class="footer-col"><h4>${lang==='en'?'Services':'Diensten'}</h4><ul><li><a href="${p}/golfles/">${u.golfles}</a></li><li><a href="${p}/golfshows/">${u.trickshow}</a></li><li><a href="${p}/golftrips/">${u.golftrips}</a></li><li><a href="${p}/golf-repairs/">${u.golfrepairs}</a></li></ul></div>
    <div class="footer-col"><h4>${u.footService}</h4><ul><li><a href="${p}/over-mark/">${u.fOverMark}</a></li><li><a href="${p}/contact/">${u.contact}</a></li><li><a href="${p}/kennisbank/">${u.fKennisbank}</a></li><li><a href="${p}/verzending-en-levering/">${u.fVerzending}</a></li><li><a href="${p}/privacy/">${u.fPrivacy}</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 MrGolfbal.nl · KVK 27326866</span></div>
</div></footer>`;
};

/* =================== CTA PASSEND BIJ DE PAGINA ===================
   Een bezoeker op een pagina over golfles moet geen trickshow aangeboden
   krijgen. Daarom leidt één functie de CTA af uit het pad van de pagina;
   zowel de meebewegende balk als het CTA-blok onderaan gebruiken die. */
const CTA_KINDS = {
  print: {
    nl: { eye:'Klaar om te starten?', h:'Bedruk je golfballen met logo, tekst of ontwerp',
          p:'Kies je model, upload je logo en ontvang eerst een gratis digitale drukproef. Pas na jouw akkoord gaat het in productie.',
          btn:'Start de configurator', sticky:'Golfballen bedrukken met jouw logo?', stickyBtn:'Vraag je drukproef aan',
          href:'/golfballen-bedrukken/#configurator' },
    en: { eye:'Ready to start?', h:'Print your golf balls with a logo, text or design',
          p:'Choose your model, upload your logo and receive a free digital proof first. Production starts only once you approve it.',
          btn:'Open the configurator', sticky:'Printing golf balls with your logo?', stickyBtn:'Request your proof',
          href:'/golfballen-bedrukken/#configurator' },
  },
  show: {
    nl: { eye:'Boek de show', h:'Een golfshow op jouw event',
          p:'Vertel kort wat voor gelegenheid het is, waar en wanneer. Je krijgt een voorstel op maat; prijs en beschikbaarheid op aanvraag.',
          btn:'Vraag beschikbaarheid aan', sticky:'Golfshow boeken voor jouw event?', stickyBtn:'Vraag beschikbaarheid',
          href:'/contact/' },
    en: { eye:'Book the show', h:'A golf show at your event',
          p:'Tell us briefly what the occasion is, where and when. You will get a tailored proposal; price and availability on request.',
          btn:'Check availability', sticky:'Booking a golf show for your event?', stickyBtn:'Check availability',
          href:'/contact/' },
  },
  trips: {
    nl: { eye:'Ga mee', h:'Een golfreis met een PGA-pro erbij',
          p:'Vertel met hoeveel spelers je wilt gaan en in welke periode. Je krijgt de actuele reizen en een voorstel op maat.',
          btn:'Vraag de reisdata op', sticky:'Interesse in een golfreis?', stickyBtn:'Vraag de reisdata op',
          href:'/golftrips/' },
    en: { eye:'Come along', h:'A golf trip with a PGA pro alongside',
          p:'Tell us how many players you want to travel with and in which period. You will get the current trips and a tailored proposal.',
          btn:'Ask for the dates', sticky:'Interested in a golf trip?', stickyBtn:'Ask for the dates',
          href:'/golftrips/' },
  },
  les: {
    nl: { eye:'Plan je les', h:'Golfles bij Mark Reynolds',
          p:'Van eerste kennismaking tot het bijschaven van je swing. Les op The International in Badhoevedorp, in overleg ingepland.',
          btn:'Plan een les', sticky:'Golfles bij een PGA-professional?', stickyBtn:'Plan een les',
          href:'/contact/' },
    en: { eye:'Book a lesson', h:'Golf lessons with Mark Reynolds',
          p:'From a first introduction to fine-tuning your swing. Lessons at The International in Badhoevedorp, scheduled in consultation.',
          btn:'Book a lesson', sticky:'A lesson with a PGA professional?', stickyBtn:'Book a lesson',
          href:'/contact/' },
  },
  repairs: {
    nl: { eye:'Breng je clubs langs', h:'Je clubs laten nakijken of herstellen',
          p:'Nieuwe grips, een losse kop of een shaft die vervangen moet worden. Vertel wat er speelt, dan hoor je wat er mogelijk is.',
          btn:'Vraag het Mark', sticky:'Je clubs laten nakijken?', stickyBtn:'Vraag het Mark',
          href:'/contact/' },
    en: { eye:'Bring your clubs', h:'Have your clubs checked or repaired',
          p:'New grips, a loose head or a shaft that needs replacing. Tell us what is going on and you will hear what is possible.',
          btn:'Ask Mark', sticky:'Getting your clubs looked at?', stickyBtn:'Ask Mark',
          href:'/contact/' },
  },
  advies: {
    nl: { eye:'Vraag het Mark', h:'Een vraag over jouw situatie?',
          p:'Leg je vraag voor aan een PGA-professional die zelf bedrukt, shows geeft en met groepen op reis gaat. Je krijgt een eerlijk antwoord.',
          btn:'Neem contact op', sticky:'Een vraag aan Mark?', stickyBtn:'Neem contact op',
          href:'/contact/' },
    en: { eye:'Ask Mark', h:'A question about your situation?',
          p:'Put your question to a PGA professional who prints the balls, performs the shows and travels with the groups himself.',
          btn:'Get in touch', sticky:'A question for Mark?', stickyBtn:'Get in touch',
          href:'/contact/' },
  },
};
// Welke CTA hoort bij welk pad. Eerste match wint; 'none' betekent geen balk.
const CTA_ROUTES = [
  // contact-, bedank- en privacypagina's krijgen geen balk; verzending gaat wel
  // over een bestelling en houdt dus de bedruk-CTA
  [/^\/(en\/)?(contact|bedankt|privacy)\//, 'none'],
  [/^\/404/, 'none'],
  [/^\/(en\/)?golfshows\//, 'show'],
  [/^\/(en\/)?golftrips\//, 'trips'],
  [/^\/(en\/)?golfles\//, 'les'],
  [/^\/(en\/)?golf-repairs\//, 'repairs'],
  [/^\/(en\/)?over-mark\//, 'advies'],
  [/^\/(en\/)?blog\/?$/, 'advies'],
];
const BLOG_CTA = { 'Bedrukken':'print', 'Spel & materiaal':'print', 'Events':'show', 'Golfreizen':'trips' };
const ctaKind = (canon = '/', extra = null) => {
  if (extra) return extra;
  const c = canon.startsWith('/') ? canon : '/' + canon;
  for (const [re, kind] of CTA_ROUTES) if (re.test(c)) return kind;
  return 'print';
};
const ctaFor = (canon = '/', lang = 'nl', kind = null) => {
  const k = ctaKind(canon, kind);
  if (k === 'none') return null;
  return CTA_KINDS[k][lang] || CTA_KINDS[k].nl;
};

/* Wie is Mark? Eén compacte component in plaats van een erelijst die op
   veertig pagina's opnieuw werd naverteld. De volledige lijst staat op
   /over-mark/; hier alleen de kern, met een link erheen. */
const markCred = (lang='nl') => { const p = pfx(lang), en = lang==='en';
  return `<section class="section markcred-sec"><div class="container">
    <aside class="markcred">
      <figure class="markcred__photo"><img src="/assets/img/mark/mark-trofee-matchplay.jpg" width="1400" height="900" loading="lazy" decoding="async" alt="${en?'Mark Reynolds with the Dutch National Open Matchplay trophy':'Mark Reynolds met de trofee van het Nationaal Open Matchplay'}"></figure>
      <div class="markcred__txt">
        <p class="eyebrow">${ico('trophy','ico-inline')} ${en?'Who you are booking':'Wie je boekt'}</p>
        <h2>Mark Reynolds</h2>
        <p>${en
          ? `PGA Golf Professional since 1995, with his own golf school in the Netherlands since 2001. Three-time winner of the Dutch PGA Order of Merit and European champion with the Dutch team in 2019.`
          : `PGA Golf Professional sinds 1995, met sinds 2001 een eigen golfschool in Nederland. Drievoudig winnaar van de Nederlandse PGA Order of Merit en in 2019 Europees kampioen met het Nederlandse team.`}</p>
        <p><a class="markcred__link" href="${p}/over-mark/">${en?'The full record and the story behind it':'De volledige erelijst en het verhaal erachter'} →</a></p>
      </div>
    </aside>
  </div></section>`;
};

// Meebewegende boekingsbalk: verschijnt zodra de hero uit beeld is.
const stickyCta = (lang='nl', canon='/', h=null, btn=null, kind=null) => {
  const p = pfx(lang), en = lang==='en';
  const c = ctaFor(canon, lang, kind);
  if (!c) return '';                       // op contact- en beleidspagina's geen balk
  return `<div class="sticky-cta" data-sticky-cta hidden>
    <div class="container sticky-cta__in">
      <p class="sticky-cta__txt">${h || c.sticky}</p>
      <div class="sticky-cta__btns">
        <a class="btn btn--primary" href="${p}${c.href}">${ico('chat','btn__ico')}${btn || c.stickyBtn}</a>
        <a class="btn btn--light sticky-cta__wa" href="https://wa.me/31627411925">${WA_ICON}<span>${en?'WhatsApp':'App Mark'}</span></a>
      </div>
    </div>
  </div>`;
};

const FOOTER = (lang='nl', canon='/', stickyH=null, stickyBtn=null, kind=null) => stickyCta(lang, canon, stickyH, stickyBtn, kind) + FOOTER_INNER(lang) + `
<script src="https://elfsightcdn.com/platform.js" async></script>
<script src="/assets/js/site.js?v=14" defer></script>
</body></html>`;

// o = { title, desc, canon(NL-pad), crumb, hero(HTML), main(HTML), extra? }
// Icoonblok: voor welk doel laat je golfballen bedrukken?
const DOELEN = [
  { ico:'gift',      href:'/golfballen-personaliseren/',  nl:['Persoonlijk cadeau','Een bal met een foto, naam of eigen ontwerp — voor een verjaardag, jubileum of afscheid.'], en:['Personal gift','A ball with a photo, name or your own design — for a birthday, anniversary or farewell.'] },
  { ico:'pencil',    href:'/golfballen-personaliseren/',  nl:['Naam of tekst','Alleen een naam, initialen of een korte tekst. Herkenbaar op de baan, klaar in één drukgang.'], en:['Name or text','Just a name, initials or a short message. Recognisable on the course, printed in one run.'] },
  { ico:'handshake', href:'/toepassingen/golfballen-relatiegeschenk/', nl:['Relatiegeschenk','Je logo op een originele Titleist of Pinnacle — een cadeau dat maanden in de tas blijft.'], en:['Corporate gift','Your logo on an original Titleist or Pinnacle — a gift that stays in the bag for months.'] },
  { ico:'building',  href:'/golfballen-bedrukken-voor-bedrijven/',     nl:['Voor bedrijven','Bedrijfsgolfdagen, relatiedagen en events. Staffelkorting vanaf grotere aantallen.'], en:['For businesses','Company golf days, client days and events. Volume discount on larger runs.'] },
  { ico:'flag',      href:'/golfballen-bedrukken-voor-golfclubs-en-toernooien/', nl:['Voor golfclubs','Clublogo op de bal voor toernooien, jubilea en de shop van je eigen club.'], en:['For golf clubs','Your club logo on the ball for tournaments, anniversaries and the club shop.'] },
  { ico:'trophy',    href:'/toepassingen/golfballen-golftoernooi/',    nl:['Toernooi & sponsoring','Sponsorlogo of toernooinaam op elke bal op de tee. Zichtbaar bij elke slag.'], en:['Tournament & sponsoring','Sponsor logo or tournament name on every ball on the tee. Seen on every shot.'] },
];
const doelBlock = (lang='nl') => {
  const p = pfx(lang), en = lang==='en';
  return `<section class="section"><div class="container">
    <div class="section-head center"><p class="eyebrow">${en?'For every purpose':'Voor elk doel'}</p>
      <h2>${en?'Printed golf balls for every occasion':'Bedrukte golfballen voor elk doel'}</h2>
      <p class="lead center">${en?'From a personal gift to a full tournament run — for private customers, companies and golf clubs.':'Van een persoonlijk cadeau tot een complete toernooi-oplage — voor particulieren, bedrijven en golfclubs.'}</p></div>
    <div class="doelgrid">${DOELEN.map(d=>`<a class="doelcard" href="${p}${d.href}">
      <span class="doelcard__ico">${ico(d.ico,'')}</span>
      <span class="doelcard__body"><b>${d[lang][0]}</b><span>${d[lang][1]}</span></span>
      <span class="doelcard__go" aria-hidden="true">→</span>
    </a>`).join('')}</div>
  </div></section>`;
};


const DOEL_PAGES = new Set(['golfballen-bedrukken-voor-bedrijven','golfballen-bedrukken-voor-golfclubs-en-toernooien','golfballen-personaliseren','zo-werkt-het']);
const page = (o, lang='nl') => HEAD(o.title, o.desc, o.canon, lang,
  breadcrumbLD([{name:UI[lang].home,url:'/'},{name:o.crumb,url:o.canon}], lang) + (o.extra||''), false, !!o.noIndex
) + HEADER(lang, o.canon, !!o.noEn) + crumbs(o.crumb, lang) + localize(o.hero, lang) + localize(o.main, lang)
  + extraSections(o.slug, lang)
  + (DOEL_PAGES.has(o.slug) ? doelBlock(lang) : '')
  + ballGallery(seedOf(o.canon || o.slug || ''), lang)
  + (o.noBlocks ? '' : howItWorks(lang) + whyUs(lang) + reviewsBlock(lang)
      + (FAQ_PAGES.has(o.slug) ? printingFaq(lang, o.slug, o.slug === 'zo-werkt-het') : ''))
  + socialsBlock(lang)
  + ctaBlock(lang, o.canon) + FOOTER(lang, o.canon);

// ---- modelvergelijkingstabel (herbruikbaar, per taal) ----
const compareTable = (lang='nl') => lang==='en' ? `
<div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel">
<thead><tr><th>Model</th><th>Feel</th><th>Ball flight</th><th>Spin</th><th>Suited to</th></tr></thead><tbody>
<tr><td><strong>Titleist Pro V1</strong></td><td>Soft</td><td>Penetrating</td><td>High</td><td>Low/mid handicap, premium gift</td></tr>
<tr><td><strong>Titleist Pro V1x</strong></td><td>Firmer</td><td>Higher</td><td>Very high</td><td>Height and control</td></tr>
<tr><td><strong>Titleist TruFeel</strong></td><td>Extra soft</td><td>Mid</td><td>Mid</td><td>Recreational, budget business</td></tr>
<tr><td><strong>Pinnacle Soft</strong></td><td>Soft</td><td>Mid-high</td><td>Lower</td><td>Golf days, large runs</td></tr>
<tr><td><strong>Pinnacle Rush</strong></td><td>Firm</td><td>High</td><td>Lower</td><td>Distance, tournaments</td></tr>
</tbody></table></div>` : `
<div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel">
<thead><tr><th>Model</th><th>Gevoel</th><th>Balvlucht</th><th>Spin</th><th>Geschikt voor</th></tr></thead><tbody>
<tr><td><strong>Titleist Pro V1</strong></td><td>Zacht</td><td>Penetrerend</td><td>Hoog</td><td>Lage/midden handicap, premium cadeau</td></tr>
<tr><td><strong>Titleist Pro V1x</strong></td><td>Steviger</td><td>Hoger</td><td>Zeer hoog</td><td>Hoogte en controle</td></tr>
<tr><td><strong>Titleist TruFeel</strong></td><td>Extra zacht</td><td>Midden</td><td>Midden</td><td>Recreatief, prijsbewust zakelijk</td></tr>
<tr><td><strong>Pinnacle Soft</strong></td><td>Zacht</td><td>Midden-hoog</td><td>Lager</td><td>Golfdagen, grote oplages</td></tr>
<tr><td><strong>Pinnacle Rush</strong></td><td>Stevig</td><td>Hoog</td><td>Lager</td><td>Afstand, toernooien</td></tr>
</tbody></table></div>`;

/* =================== ECHTE PRODUCTFOTO'S PER BAL =================== */
// Per model één of meer kleurvarianten. De eerste foto is de hoofdafbeelding.
const PRODUCT_PHOTOS = {
  'titleist-pro-v1':  [['titleist-pro-v1-wit.webp','Titleist Pro V1 golfbal, wit','Titleist Pro V1 golf ball, white'],
                       ['titleist-pro-v1-rct-wit.webp','Titleist Pro V1 RCT golfbal met radarmarkering','Titleist Pro V1 RCT golf ball with radar marking']],
  'titleist-pro-v1x': [['titleist-pro-v1x-wit.webp','Titleist Pro V1x golfbal, wit','Titleist Pro V1x golf ball, white'],
                       ['titleist-pro-v1x-geel.webp','Titleist Pro V1x golfbal, geel','Titleist Pro V1x golf ball, yellow']],
  'titleist-trufeel': [['titleist-trufeel-wit.webp','Titleist TruFeel golfbal, wit','Titleist TruFeel golf ball, white'],
                       ['titleist-trufeel-geel.webp','Titleist TruFeel golfbal, geel','Titleist TruFeel golf ball, yellow']],
  'titleist-avx':     [['titleist-avx-wit.webp','Titleist AVX golfbal, wit','Titleist AVX golf ball, white'],
                       ['titleist-avx-geel.webp','Titleist AVX golfbal, geel','Titleist AVX golf ball, yellow']],
  'titleist-velocity':[['titleist-velocity-wit.webp','Titleist Velocity golfbal, wit','Titleist Velocity golf ball, white'],
                       ['titleist-velocity-groen.webp','Titleist Velocity golfbal, matgroen','Titleist Velocity golf ball, matte green'],
                       ['titleist-velocity-oranje.webp','Titleist Velocity golfbal, matoranje','Titleist Velocity golf ball, matte orange']],
  'titleist-tour-soft':[['titleist-tour-soft-wit.webp','Titleist Tour Soft golfbal, wit','Titleist Tour Soft golf ball, white'],
                       ['titleist-tour-soft-groen.webp','Titleist Tour Soft golfbal, groen','Titleist Tour Soft golf ball, green']],
  'pinnacle-soft-met-bedrukking':[['pinnacle-soft-wit.webp','Pinnacle Soft golfbal, wit','Pinnacle Soft golf ball, white'],
                       ['pinnacle-soft-geel.webp','Pinnacle Soft golfbal, geel','Pinnacle Soft golf ball, yellow']],
  'pinnacle-rush-met-bedrukking':[['pinnacle-rush-wit.webp','Pinnacle Rush golfbal, wit','Pinnacle Rush golf ball, white']],
  'titleist-trufeel-met-bedrukking': [['titleist-trufeel-wit.webp','Titleist TruFeel golfbal, wit','Titleist TruFeel golf ball, white']],
  'titleist-avx-met-bedrukking':     [['titleist-avx-wit.webp','Titleist AVX golfbal, wit','Titleist AVX golf ball, white']],
  'titleist-velocity-met-bedrukking':[['titleist-velocity-wit.webp','Titleist Velocity golfbal, wit','Titleist Velocity golf ball, white']],
  'onbedrukt':        [['titleist-blanco-wit.webp','Onbedrukte Titleist golfbal, wit','Blank Titleist golf ball, white'],
                       ['titleist-blanco-geel.webp','Onbedrukte Titleist golfbal, geel','Blank Titleist golf ball, yellow']],
};
// Eén productfoto als <img>; valt terug op de mockup wanneer er geen foto is.
const ballPhoto = (handle, lang='nl', i=0, cls='') => {
  const set = PRODUCT_PHOTOS[handle]; if (!set || !set[i]) return '';
  const [f, nl, en] = set[i];
  return `<img class="ballphoto${cls?' '+cls:''}" src="/assets/img/products/${f}" width="760" height="760" loading="lazy" decoding="async" alt="${lang==='en'?en:nl}">`;
};
const ballVariants = (handle, lang='nl') => {
  const set = PRODUCT_PHOTOS[handle]; if (!set || set.length < 2) return '';
  const en = lang==='en';
  return `<section class="section"><div class="container">
    <div class="section-head center"><p class="eyebrow">${ico('palette','ico-inline')} ${en?'Also available in':'Ook verkrijgbaar in'}</p>
      <h2>${en?'Other versions of this ball':'Andere uitvoeringen van deze bal'}</h2>
      <p class="lead center">${en?'Every version can be printed with your logo or text. Which one suits you best is something we are happy to advise on.':'Elke uitvoering kan bedrukt worden met je logo of tekst. Welke het beste bij je past, adviseren we graag.'}</p></div>
    <div class="ballvariants">${set.slice(1).map((v,i)=>`<figure>${ballPhoto(handle, lang, i+1)}<figcaption>${lang==='en'?v[2]:v[1]}</figcaption></figure>`).join('')}</div>
  </div></section>`;
};
const ballMedia = (handle, lang='nl') => {
  const img = ballPhoto(handle, lang, 0);
  return img || `<div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div>`;
};

const PAGES = [];

/* ---------------- TITLEIST BEDRUKKEN ---------------- */
PAGES.push({
  slug:'titleist-golfballen-bedrukken',
  title:'Titleist golfballen bedrukken met logo | MrGolfbal.nl',
  desc:'Titleist golfballen bedrukken met je logo of tekst — Pro V1, Pro V1x, TruFeel en AVX. Originele ballen, digitale drukproef vooraf, vanaf 144 stuks.',
  canon:'/titleist-golfballen-bedrukken/', crumb:'Titleist golfballen bedrukken',
  hero:heroBlock('Titleist bedrukken','Titleist golfballen bedrukken met jouw <span>logo of tekst</span>','Laat originele Titleist-golfballen bedrukken met je bedrijfs- of clublogo. Van de toursbal Pro V1 tot de zachte TruFeel — altijd eerst een digitale drukproef.',undefined,undefined,'nl',PAGE_PHOTOS['titleist-golfballen-bedrukken']),
  main:`
<section class="section"><div class="container" style="max-width:920px">
  <p class="lead">Titleist is het meest gespeelde balmerk op tour. Met een bedrukte Titleist geef je een relatiegeschenk of clubbal met echte status. Wij bedrukken uitsluitend originele Titleist-ballen en laten je vóór productie een digitale drukproef zien.</p>
</div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Modellen</p><h2>Welke Titleist wil je laten bedrukken?</h2></div>
  <div class="grid grid-4" style="margin-top:1.5rem">
    <article class="card"><div class="card__media">${ballMedia('titleist-pro-v1', 'nl')}</div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1 — bedrukt</h3><p class="card__meta">Toursniveau, zacht gevoel, hoge green-spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media">${ballMedia('titleist-pro-v1x', 'nl')}</div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1x — bedrukt</h3><p class="card__meta">Hogere vlucht, steviger, extra spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1x">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1x">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media">${ballMedia('titleist-trufeel', 'nl')}</div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">TruFeel — bedrukt</h3><p class="card__meta">Extra zacht en scherp geprijsd.</p><div class="card__price" data-shopify-handle="titleist-trufeel-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-trufeel">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media">${ballMedia('titleist-avx', 'nl')}</div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">AVX — bedrukt</h3><p class="card__meta">Zacht gevoel, lage vlucht en spin.</p><div class="card__price" data-shopify-handle="titleist-avx-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-avx">Bekijk &amp; bedruk</a></div></article>
  </div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Vergelijking</p><h2>Titleist-modellen vergelijken</h2><p class="lead">Kies op basis van speelgevoel en doelgroep. Twijfel je? Mark adviseert je graag.</p></div>${compareTable('nl')}
  <p class="muted" style="font-size:.85rem;margin-top:.8rem">Baleigenschappen op basis van fabrikantinformatie en praktijkervaring.</p></div></section>
<section class="section section--sky"><div class="container"><div class="grid grid-3">
  <div class="feature"><h3>Vanaf 144 golfballen</h3><p>Minimale afname 144 stuks; staffelkorting bij grotere aantallen.</p></div>
  <div class="feature"><h3>Digitale drukproef</h3><p>Altijd eerst een proef. Productie start na jouw akkoord.</p></div>
  <div class="feature"><h3>Levertijd 5–15 werkdagen</h3><p>Na goedkeuring van de drukproef.</p></div>
</div></div></section>`
});


/* ---------------- VERZENDING & LEVERING ---------------- */
PAGES.push({
  slug:'verzending-en-levering',
  title:'Verzending en levering van bedrukte golfballen | MrGolfbal.nl',
  desc:'Hoe bedrukte golfballen worden gemaakt en geleverd: eerst een digitale drukproef, daarna 5 tot 15 werkdagen productie, verzending in Nederland en België.',
  canon:'/verzending-en-levering/', crumb:'Verzending en levering',
  hero:heroBlock('Verzending','Verzending en <span>levering</span>','Wat er gebeurt tussen jouw akkoord op de drukproef en de doos op de mat — en hoe je je bestelling plant zodat die op tijd voor je event binnen is.','Vraag naar je leverdatum','/contact/'),
  main:`
<section class="section"><div class="container"><div class="prose">
  <p class="lead">Bedrukte golfballen worden op bestelling gemaakt. Er gaat niets in productie voordat je een digitale drukproef hebt gezien en goedgekeurd. Daarom begint de levertijd bij jouw akkoord en niet bij je bestelling.</p>
  <h2>Van bestelling tot deurmat</h2>
  <p>Je stuurt je logo of tekst aan, het liefst als vectorbestand (EPS, AI of PDF) met de PMS/Pantone-kleuren die je gebruikt. Je krijgt een digitale drukproef waarop precies te zien is hoe de bedrukking op de bal staat. Na jouw akkoord start de productie, die <strong>5 tot 15 werkdagen</strong> duurt. Daarna gaan de ballen naar het adres dat je opgeeft.</p>
  <h2>Plannen rond een evenement</h2>
  <p>Zijn de ballen bedoeld voor een toernooi, een <a href="/toepassingen/golfballen-bedrijfsgolfdag/">bedrijfsgolfdag</a> of als cadeau, houd dan drie tot vier weken aan tussen het aanleveren van je logo en de datum waarop je ze nodig hebt. Dat geeft comfortabel ruimte voor drukproef, eventuele aanpassing, productie en transport. Zit je krapper? Geef de datum door via <a href="/contact/">contact</a>, dan hoor je meteen of het haalbaar is.</p>
  <h2>Aantallen en verzending</h2>
  <p>Bedrukken begint bij 144 ballen, oftewel twaalf dozijn. Grotere oplages worden in meerdere dozen verstuurd. Levering binnen Nederland en België is standaard; voor andere bestemmingen worden de verzendkosten meegenomen in je <a href="/golfballen-bedrukken-voor-bedrijven/">offerte</a>.</p>
  <h2>Iets mis met je levering?</h2>
  <p>Meld het zodra je het ziet. Omdat elke bestelling wordt gedrukt naar jouw eigen goedgekeurde drukproef, worden problemen per geval opgelost in plaats van via een standaard retourprocedure. Mark is bereikbaar per telefoon, e-mail en WhatsApp via de <a href="/contact/">contactpagina</a>.</p>
  <h2>Bewaren en uitpakken</h2>
  <p>Bedrukte ballen komen in hun originele verpakking en kun je gewoon droog en op kamertemperatuur bewaren. Vocht is de enige echte vijand: een kartonnen doos die maanden in een vochtige kelder of een koude garage staat, gaat zwellen en dat zie je aan de verpakking terug, ook al mankeert de bal zelf niets. Zet de dozen dus liever binnen dan in een schuur.</p>
  <p>Controleer bij ontvangst een willekeurige doos in plaats van alleen de bovenste. Zo weet je zeker dat de hele oplage eruitziet zoals je hem hebt goedgekeurd. Bewaar ook je drukproef; bij een herhaalorder is dat het snelste vertrekpunt, en het scheelt een ronde heen en weer over kleuren en plaatsing.</p>
  <h2>Een tweede oplage bestellen</h2>
  <p>Bij een herhaalorder gebruiken we het bestand dat we van je hebben, tenzij je iets wilt wijzigen. De minimale afname van 144 stuks geldt opnieuw, want elke productie is een eigen run. Ook krijg je opnieuw een drukproef ter goedkeuring — dat lijkt overbodig maar voorkomt dat een oude versie van je logo ongemerkt weer in productie gaat. Meer over dat proces staat bij <a href="/kennisbank/digitale-drukproef-golfballen/">de digitale drukproef</a> en bij <a href="/zo-werkt-het/">zo werkt het</a>.</p>
</div></div></section>`
});

/* ---------------- PRIVACY ---------------- */
PAGES.push({
  slug:'privacy',
  title:'Privacyverklaring | MrGolfbal.nl',
  desc:'Welke gegevens MrGolfbal.nl via de contact- en offerteformulieren verzamelt, wie ze verwerkt, hoe lang ze bewaard blijven en hoe je ze laat verwijderen.',
  canon:'/privacy/', crumb:'Privacy',
  hero:heroBlock('Privacy','<span>Privacyverklaring</span>','Een gewone beschrijving van wat deze website met je gegevens doet. Geen tracking, geen advertentieprofielen — alleen de gegevens die je zelf invult.','Neem contact op','/contact/'),
  main:`
<section class="section"><div class="container"><div class="prose">
  <p class="lead">MrGolfbal.nl is een kleine onderneming van Mark Reynolds. Op deze pagina staat wat er feitelijk met je gegevens gebeurt op deze website.</p>
  <h2>Welke gegevens</h2>
  <p>Alleen wat je zelf invult: je naam, e-mailadres, eventueel je telefoonnummer, bedrijfsnaam en de inhoud van je bericht of offerteaanvraag, plus een logobestand als je dat meestuurt. Er is op deze site geen account, geen nieuwsbrief en geen aankoopgeschiedenis.</p>
  <h2>Hoe formulierberichten worden verstuurd</h2>
  <p>De contact- en offerteformulieren op deze website worden verzonden via Web3Forms, een dienst die het bericht doorstuurt naar de mailbox van MrGolfbal.nl. Je bericht loopt dus via die dienst op weg naar de e-mail.</p>
  <h2>Waarvoor en hoe lang</h2>
  <p>Je gegevens worden gebruikt om je vraag te beantwoorden en om een bestelling voor te bereiden en te leveren. Correspondentie en logobestanden blijven bewaard zolang ze nuttig zijn voor herhaalorders, zodat een volgende editie hetzelfde bestand kan gebruiken.</p>
  <h2>Delen met anderen</h2>
  <p>Gegevens worden alleen gedeeld waar een bestelling dat vraagt, bijvoorbeeld met de drukkerij of de vervoerder. Je gegevens worden niet verkocht en niet gebruikt voor advertentieprofielen.</p>
  <h2>Jouw rechten</h2>
  <p>Je kunt vragen welke gegevens er van je zijn, ze laten corrigeren of laten verwijderen. Een bericht via de <a href="/contact/">contactpagina</a> is genoeg; het bestand en de correspondentie worden dan verwijderd.</p>
  <h2>Cookies en externe diensten</h2>
  <p>Deze website plaatst zelf geen trackingcookies. Pagina's met een YouTube-video laden die via youtube-nocookie.com, wat beperkt wat YouTube opslaat tot je daadwerkelijk op afspelen drukt. Het lettertype wordt geladen via Google Fonts; daarbij wordt je IP-adres gezien door die dienst, zoals bij elk extern bestand dat je browser ophaalt.</p>
  <p>De website draait op Netlify. Zoals elke webserver houdt die technische logbestanden bij met onder meer IP-adres, tijdstip en opgevraagde pagina. Die gegevens dienen om de site te laten werken en misbruik tegen te gaan, niet om bezoekers te volgen.</p>
  <h2>Beveiliging</h2>
  <p>De site is alleen via een beveiligde verbinding (https) bereikbaar, zodat wat je in een formulier invult onderweg niet leesbaar is voor derden. E-mail is van nature minder afgeschermd: stuur daarom geen gegevens die je niet ook per gewone post zou versturen. Heb je iets vertrouwelijks te melden, bel dan liever even.</p>
  <h2>Vragen of een klacht</h2>
  <p>Kom je er samen met ons niet uit, dan kun je een klacht indienen bij de Autoriteit Persoonsgegevens. We horen het liever eerst zelf: een bericht via de <a href="/contact/">contactpagina</a> of een telefoontje is meestal genoeg om het op te lossen. Deze verklaring beschrijft de situatie zoals die nu is; verandert er iets aan de manier waarop de site werkt, dan passen we de tekst hier aan.</p>
</div></div></section>`
});

/* ---------------- PINNACLE BEDRUKKEN ---------------- */
PAGES.push({
  slug:'pinnacle-golfballen-bedrukken',
  title:'Pinnacle golfballen bedrukken (Soft &amp; Rush) | MrGolfbal.nl',
  desc:'Pinnacle golfballen bedrukken met je logo — Pinnacle Soft en Pinnacle Rush. Scherp geprijsd, groot bedrukoppervlak, ideaal voor golfdagen en grote oplages.',
  canon:'/pinnacle-golfballen-bedrukken/', crumb:'Pinnacle golfballen bedrukken',
  hero:heroBlock('Pinnacle bedrukken','Pinnacle golfballen bedrukken met jouw <span>logo</span>','Pinnacle Soft en Rush zijn scherp geprijsd en perfect voor golfdagen, toernooien en grote oplages met bedrijfslogo.',undefined,undefined,'nl',PAGE_PHOTOS['pinnacle-golfballen-bedrukken']),
  main:`
<section class="section"><div class="container" style="max-width:920px"><p class="lead">Pinnacle biedt een uitstekende prijs-kwaliteitverhouding en een groot, egaal oppervlak dat zich goed leent voor bedrukking. Ideaal wanneer je veel golfballen met logo nodig hebt zonder in te leveren op merkkwaliteit.</p></div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Modellen</p><h2>Pinnacle Soft vs. Pinnacle Rush</h2></div>
  <div class="grid grid-2" style="margin-top:1.5rem">
    <div class="feature">${ballPhoto('pinnacle-soft-met-bedrukking','nl',0,'ballphoto--feature')}<span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Soft</h3><p>Zacht gevoel en een aangename feel bij de korte spelonderdelen. Populair voor golfdagen en relatiegeschenken met scherpe prijs.</p><a class="btn btn--primary" href="/products/pinnacle-soft-met-bedrukking">Bekijk &amp; bedruk</a></div>
    <div class="feature">${ballPhoto('pinnacle-rush-met-bedrukking','nl',0,'ballphoto--feature')}<span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Rush</h3><p>Stevige kern gericht op extra afstand. Een prettige toernooibal die er met jouw logo verzorgd uitziet.</p><a class="btn btn--primary" href="/products/pinnacle-rush-met-bedrukking">Bekijk &amp; bedruk</a></div>
  </div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Verschillen</p><h2>Welke Pinnacle past bij jouw doel?</h2></div>
  <div style="overflow-x:auto;margin-top:1.5rem"><table class="staffel"><thead><tr><th>Model</th><th>Gevoel</th><th>Focus</th><th>Ideaal voor</th></tr></thead><tbody>
  <tr><td><strong>Pinnacle Soft</strong></td><td>Zacht</td><td>Feel &amp; controle</td><td>Golfdagen, cadeaus, grote oplages</td></tr>
  <tr><td><strong>Pinnacle Rush</strong></td><td>Stevig</td><td>Afstand</td><td>Toernooien, langere spelers</td></tr>
  </tbody></table></div></div></section>`
});

/* ---------------- VOOR BEDRIJVEN ---------------- */
PAGES.push({
  slug:'golfballen-bedrukken-voor-bedrijven',
  title:'Golfballen bedrukken voor bedrijven met bedrijfslogo | MrGolfbal.nl',
  desc:'Bedrukte golfballen met bedrijfslogo als relatiegeschenk, voor de bedrijfsgolfdag of sponsoring. Originele Titleist &amp; Pinnacle, staffelkorting, offerte op maat.',
  canon:'/golfballen-bedrukken-voor-bedrijven/', crumb:'Voor bedrijven',
  extra:'',
  hero:heroBlock('Voor bedrijven','Golfballen bedrukken met jouw <span>bedrijfslogo</span>','Een relatiegeschenk dat écht gebruikt wordt. Laat originele golfballen bedrukken met je bedrijfslogo voor de golfdag, sponsoring of als zakelijk cadeau.','Vraag een offerte aan','#offerte'),
  main:`
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Zakelijk</p><h2>Bedrukte golfballen voor elk zakelijk doel</h2></div>
  <div class="grid grid-3" style="margin-top:1.5rem">
    <div class="feature"><h3>Relatiegeschenk</h3><p>Een blijvend, functioneel cadeau voor golfende klanten en relaties.</p></div>
    <div class="feature"><h3>Bedrijfsgolfdag</h3><p>Voorzie deelnemers van ballen met jouw logo — herkenbaar en verzorgd.</p></div>
    <div class="feature"><h3>Sponsoring &amp; promotie</h3><p>Sponsorlogo op de bal bij events, clinics en netwerkbijeenkomsten.</p></div>
    <div class="feature"><h3>Personeelsgeschenk</h3><p>Een sportief bedankje voor medewerkers die golfen.</p></div>
    <div class="feature"><h3>Grote oplage</h3><p>Staffelkorting bij grotere aantallen; herhaalbestellingen eenvoudig geregeld.</p></div>
    <div class="feature"><h3>Offerte &amp; planning</h3><p>Zakelijke afhandeling met offerte en levering op een afgesproken datum.</p></div>
  </div></div></section>
<section class="section section--sky" id="offerte"><div class="container" style="max-width:1000px">
  <div class="section-head accent-line"><p class="eyebrow">Offerte op maat</p><h2>Vraag een zakelijke offerte aan</h2><p class="lead">Vul je gegevens in — Mark reageert doorgaans binnen 24 uur met een voorstel, staffelprijs en drukproefplanning. Geen online afrekenen: alles netjes op factuur.</p></div>
  <div class="grid grid-2" style="margin-top:1.4rem;align-items:start;gap:1.6rem">
    <form class="feature" style="padding:1.6rem" action="https://api.web3forms.com/submit" method="POST" enctype="multipart/form-data">
      <input type="hidden" name="access_key" value="63fb5800-8156-4d0c-9bbb-b1cc16f16dff">
      <input type="hidden" name="subject" value="Nieuwe offerteaanvraag via MrGolfbal.nl">
      <input type="hidden" name="from_name" value="MrGolfbal.nl">
      <input type="hidden" name="redirect" value="https://mrgolfbal.nl/bedankt/">
      <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="form-grid">
        <div class="field"><label for="o-bedrijf">Bedrijfsnaam *</label><input id="o-bedrijf" name="bedrijfsnaam" autocomplete="organization" required></div>
        <div class="field"><label for="o-naam">Naam *</label><input id="o-naam" name="name" autocomplete="name" required></div>
        <div class="field"><label for="o-mail">E-mailadres *</label><input id="o-mail" type="email" name="email" autocomplete="email" required></div>
        <div class="field"><label for="o-tel">Telefoon</label><input id="o-tel" type="tel" name="telefoon" autocomplete="tel"></div>
        <div class="field"><label for="o-merk">Gewenst merk</label><select name="merk"><option>Titleist</option><option>Pinnacle</option><option>Weet ik nog niet</option></select></div>
        <div class="field"><label for="o-model">Gewenst model</label><input id="o-model" name="model" placeholder="Bijv. Pro V1"></div>
        <div class="field"><label for="o-aantal">Aantal (ballen of dozen)</label><input id="o-aantal" name="aantal" placeholder="Bijv. 288"></div>
        <div class="field"><label for="o-datum">Gewenste leverdatum</label><input id="o-datum" type="date" name="leverdatum"></div>
        <div class="field full"><label>Bedrukking &amp; toelichting</label><textarea name="message" rows="3" placeholder="1–2 of 3–5 kleuren, één of twee zijden, bijzonderheden"></textarea></div>
      </div>
      <div class="upload-field"><label class="dropzone" for="offerteLogo"><svg class="dz-ico" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg><strong>Logo uploaden (optioneel)</strong><span class="muted">EPS, AI of PDF · of stuur je logo later na</span><input type="file" id="offerteLogo" accept=".eps,.ai,.pdf,.svg,.png,.jpg,.jpeg"></label></div>
      <button class="btn btn--primary btn--lg btn--block" type="submit">${CTA_ICO}Verstuur offerteaanvraag →</button>
      <p class="muted" style="font-size:.82rem;margin:.7rem 0 0;text-align:center">We reageren doorgaans binnen 24 uur. Je gegevens gebruiken we uitsluitend voor je aanvraag.</p>
    </form>
    <aside class="stack">
      <div class="feature feature--ico"><div class="ico">${ico('proof')}</div><h3>Altijd eerst een drukproef</h3><p>Je ziet je logo op de bal vóór productie. Pas na jouw akkoord gaan we drukken.</p></div>
      <div class="feature feature--ico"><div class="ico">${ico('clock')}</div><h3>Reactie binnen 24 uur</h3><p>Meestal nog dezelfde werkdag een voorstel met staffelprijs en planning.</p></div>
      <div class="feature feature--ico"><div class="ico">${ico('star')}</div><h3>Advies van een PGA-pro</h3><p>Mark denkt mee over de juiste bal voor jouw doelgroep en budget.</p></div>
      <div class="feature feature--ico"><div class="ico">${ico('chat')}</div><h3>Liever direct overleg?</h3><p><a href="https://wa.me/31627411925">WhatsApp Mark</a> of bel <a href="tel:+31627411925">+31 6 27 41 19 25</a>.</p></div>
    </aside>
  </div>
</div></section>`
});

/* ---------------- VOOR CLUBS & TOERNOOIEN ---------------- */
PAGES.push({
  slug:'golfballen-bedrukken-voor-golfclubs-en-toernooien',
  title:'Golfballen bedrukken voor golfclubs &amp; toernooien | MrGolfbal.nl',
  desc:'Golfballen met clublogo of toernooilogo. Voor golfclubs, golfdagen, wedstrijden, sponsor- en charity-events. Originele ballen, staffelkorting, drukproef vooraf.',
  canon:'/golfballen-bedrukken-voor-golfclubs-en-toernooien/', crumb:'Voor clubs &amp; toernooien',
  hero:heroBlock('Voor clubs &amp; toernooien','Golfballen bedrukken met <span>club- of toernooilogo</span>','Voor de golfshop, ledenacties, een golfdag of charity event: originele golfballen met jouw club- of toernooilogo.','Vraag een offerte aan','/golfballen-bedrukken-voor-bedrijven/#offerte'),
  main:`
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Voor de golfwereld</p><h2>Van clubshop tot charitytoernooi</h2></div>
  <div class="grid grid-3" style="margin-top:1.5rem">
    <div class="feature"><h3>Golfclub &amp; clubshop</h3><p>Ballen met clublogo voor de shop, ledenacties of als welkomstgeschenk.</p></div>
    <div class="feature"><h3>Golftoernooi &amp; golfdag</h3><p>Toernooilogo op de bal voor deelnemers — herkenbaar en professioneel.</p></div>
    <div class="feature"><h3>Sponsor- &amp; charity-events</h3><p>Sponsorlogo op de bal; een mooi tastbaar element bij goededoelenacties.</p></div>
  </div>
  <div class="notice mt-2">Tip: kies een scherp geprijsde Pinnacle voor grote deelnemersaantallen, of een Titleist voor een premium beleving. <a href="/golfballen-bedrukken/#configurator">Vraag een offerte op maat →</a></div>
</div></section>`
});

/* ---------------- PERSONALISEREN ---------------- */
PAGES.push({
  slug:'golfballen-personaliseren',
  title:'Golfballen personaliseren met naam of tekst | MrGolfbal.nl',
  desc:'Golfballen personaliseren met naam, initialen, een eigen nummer of persoonlijke tekst. Een origineel golfcadeau, altijd met digitale drukproef vooraf.',
  canon:'/golfballen-personaliseren/', crumb:'Personaliseren',
  hero:heroBlock('Personaliseren','Golfballen personaliseren met <span>naam of tekst</span>','Een persoonlijk golfcadeau: golfballen met naam, initialen, een eigen nummer of een korte boodschap. Origineel, verzorgd en altijd eerst een drukproef.'),
  main:`
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Persoonlijk</p><h2>Wat kun je personaliseren?</h2></div>
  <div class="grid grid-4" style="margin-top:1.5rem">
    <div class="feature"><h3>Naam</h3><p>De naam van de golfer op de bal.</p></div>
    <div class="feature"><h3>Initialen</h3><p>Strak en subtiel met initialen.</p></div>
    <div class="feature"><h3>Eigen nummer</h3><p>Herken je eigen bal met een uniek nummer.</p></div>
    <div class="feature"><h3>Persoonlijke tekst</h3><p>Een korte boodschap of felicitatie.</p></div>
  </div>
  <div class="mt-2"><a class="btn btn--primary btn--lg" href="/golfballen-bedrukken/#configurator">Personaliseer in de configurator →</a></div>
</div></section>
<section class="section section--sky"><div class="container" style="max-width:920px"><div class="section-head"><p class="eyebrow">Cadeau-tip</p><h2>Een golfcadeau dat gebruikt wordt</h2></div>
  <p class="lead">Gepersonaliseerde golfballen zijn een ideaal cadeau voor een verjaardag, jubileum of als bedankje. Kies een model dat past bij het spelniveau van de ontvanger — Mark denkt graag met je mee.</p></div></section>`
});

/* ---------------- ONBEDRUKTE GOLFBALLEN (grote aantallen) ---------------- */
PAGES.push({
  slug:'onbedrukte-golfballen',
  title:'Onbedrukte golfballen in grote aantallen | MrGolfbal.nl',
  desc:'Originele golfballen zonder logo in grote aantallen — Titleist en Pinnacle. Ideaal voor golfbanen, driving ranges, clubs, evenementen en wederverkoop. Vraag een offerte op maat.',
  canon:'/onbedrukte-golfballen/', crumb:'Onbedrukt',
  hero:heroBlock('Zonder logo · grote aantallen','Onbedrukte golfballen in <span>grote aantallen</span>','Ook zonder bedrukking ben je bij ons aan het juiste adres. Originele golfballen van topmerken, in grote aantallen geleverd — met persoonlijk advies van Mark en een offerte op maat.','Vraag een offerte aan','/contact/'),
  main:`
<section class="section"><div class="container" style="max-width:920px">
  <p class="lead reveal">Naast bedrukte golfballen leveren we ook <strong>blanco, onbedrukte golfballen</strong> in grote aantallen. Handig wanneer je puur volume nodig hebt tegen een scherpe, op maat gemaakte offerte — zonder logo of opdruk.</p>
</div></section>
<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">Voor wie</p><h2>Grote aantallen zonder logo</h2></div>
  <div class="grid grid-3" style="margin-top:1.5rem">
    <div class="feature reveal"><h3>Golfbanen &amp; driving ranges</h3><p>Rangeballen en verkoopballen in bulk, betrouwbaar en van originele merken.</p></div>
    <div class="feature reveal"><h3>Golfclubs &amp; shops</h3><p>Voorraad voor de clubshop of ledenacties, zonder minimale opdrukkosten.</p></div>
    <div class="feature reveal"><h3>Evenementen &amp; clinics</h3><p>Veel ballen nodig voor een dag of clinic? Wij leveren het volume.</p></div>
    <div class="feature reveal"><h3>Wederverkoop</h3><p>Originele Titleist en Pinnacle in grote aantallen voor doorverkoop.</p></div>
    <div class="feature reveal"><h3>Bedrijven</h3><p>Grote afname voor sportdagen of als relatiegeschenk zonder opdruk.</p></div>
    <div class="feature reveal"><h3>Later toch bedrukken?</h3><p>Wil je alsnog een logo? Bekijk <a href="/golfballen-bedrukken/">golfballen bedrukken</a>.</p></div>
  </div>
</div></section>
<section class="section"><div class="container" style="max-width:920px"><div class="section-head accent-line"><p class="eyebrow">Merken &amp; aantallen</p><h2>Originele merken, elk aantal bespreekbaar</h2></div>
  <p class="lead reveal">We werken met originele <strong>Titleist</strong> en <strong>Pinnacle</strong> golfballen. Vertel ons welk model en welk aantal je zoekt, dan stelt Mark een passende offerte op.</p>
  <div class="row" style="margin-top:1rem"><a class="btn btn--primary btn--lg" href="/contact/">Vraag een offerte aan →</a><a class="btn btn--ghost btn--lg" href="https://wa.me/31627411925">Overleg via WhatsApp</a></div>
</div></section>`
});

/* ---------------- ZO WERKT HET ---------------- */
PAGES.push({
  slug:'zo-werkt-het',
  title:'Zo werkt golfballen bedrukken — stap voor stap | MrGolfbal.nl',
  desc:'Van model kiezen en logo uploaden tot digitale drukproef en levering. Zo werkt het bedrukken van golfballen bij MrGolfbal.nl, stap voor stap.',
  canon:'/zo-werkt-het/', crumb:'Zo werkt het',
  hero:heroBlock('Zo werkt het','Golfballen bedrukken in <span>vier heldere stappen</span>','Geen gedoe met bestanden of verrassingen achteraf. Je beslist pas definitief nadat je de digitale drukproef hebt goedgekeurd.',undefined,undefined,'nl',PAGE_PHOTOS['zo-werkt-het']),
  main:`
<section class="section"><div class="container">
<div class="section-head"><p class="eyebrow">Het proces</p><h2>De vier stappen van bestelling tot levering</h2></div>
<div class="steps grid grid-2" style="gap:1rem;margin-top:1.6rem">
  <div class="step"><div class="num"></div><div><h3>Kies je golfbal</h3><p>Selecteer merk en model dat past bij je doelgroep en budget. Twijfel je? Gebruik de golfbalkiezer of vraag Mark.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Upload je logo of tekst</h3><p>Lever je ontwerp aan, bij voorkeur als vectorbestand (EPS, AI of PDF). Of typ een naam/tekst in de configurator.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Keur de digitale drukproef goed</h3><p>Je ontvangt een digitale proef van het logo op de bal. Pas na jouw akkoord start de productie.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Ontvang je bedrukte golfballen</h3><p>Levering in 5–15 werkdagen na goedkeuring van de drukproef.</p></div></div>
</div>
<div class="mt-2"><a class="btn btn--primary btn--lg" href="/golfballen-bedrukken/#configurator">Start nu →</a></div>
</div></section>
<section class="section section--sky"><div class="container" style="max-width:820px"><div class="section-head"><p class="eyebrow">Goed voorbereid</p><h2>Je logo aanleveren</h2></div>
  <p class="lead">Voor het scherpste resultaat lever je je logo aan als vectorbestand (EPS, AI of PDF). Heb je alleen een JPEG of PNG? Vaak kunnen we daar iets mee — Mark laat het je weten en helpt met de opmaak.</p></div></section>`
});

/* ---------------- GOLFLES ---------------- */
PAGES.push({
  slug:'golfles',
  title:'Golfles Badhoevedorp bij PGA-pro Mark | MrGolfbal.nl',
  desc:'Golfles bij PGA-golfprofessional Mark Reynolds op The International in Badhoevedorp. Voor beginners, gevorderden, junioren en clinics bij Amsterdam. Boek je les.',
  canon:'/golfles/', crumb:'Golfles', noBlocks:true,
  hero:heroBlock('Golfles','Golfles bij een <span>echte PGA-professional</span>','Leer golfen of verbeter je swing bij Mark Reynolds op The International in Badhoevedorp, op een steenworp van Amsterdam en Schiphol. Voor elk niveau, van eerste swing tot lage handicap.','Plan je golfles','/contact/','nl',PAGE_PHOTOS['golfles']),
  main:`
<section class="section"><div class="container"><div class="prose">
<h2>Golfles op The International in Badhoevedorp</h2>
<p>Wil je leren golfen, of speel je al jaren maar wil je die frustrerende slice er eindelijk uit? Bij MrGolfbal.nl krijg je golfles van Mark Reynolds, PGA-golfprofessional sinds 1995. Sinds 2014 geeft hij les op The International golfclub in Badhoevedorp, ideaal gelegen tussen Amsterdam, Amstelveen, Haarlem en Schiphol. Voor wie voor het eerst een club vastpakt en voor wie zijn spel flink wil aanscherpen: hier vind je een gecertificeerde professional die precies weet hoe hij jou vooruit helpt.</p>
<p>Golf is een prachtig spel, maar het kan ook onnodig ingewikkeld voelen. Verkeerde tips van medespelers, een grip die niet klopt, of een houding die je swing in de weg zit. Tijdens een golfles kijkt Mark met een geoefend oog naar jouw beweging en vertaalt hij vakkennis naar begrijpelijke, praktische aanwijzingen. Geen ingewikkeld jargon, maar duidelijke stappen waarmee je meteen betere ballen slaat en meer plezier op de baan hebt.</p>
<h2>Voor wie is de golfles bedoeld?</h2>
<p>Iedereen is welkom, ongeacht leeftijd of niveau. Ben je absolute beginner en wil je golfles voor beginners in de buurt van Amsterdam? Dan begin je bij de basis: de juiste grip, houding en een swing die je vertrouwen geeft. Speel je al een tijdje en wil je van je handicap af? Dan werk je gericht aan die onderdelen die je scores echt verbeteren, van je korte spel rond de green tot je consistentie op de driving range.</p>
<p>Mark begeleidt onder andere:</p>
<ul>
<li>Beginners die willen leren golfen of hun GVB (Golfvaardigheidsbewijs) willen halen</li>
<li>Gevorderde spelers en lage handicappers die scherper willen worden</li>
<li>Junioren die het spel op een speelse manier onder de knie krijgen</li>
<li>Bedrijven en groepen die een clinic of teamuitje zoeken</li>
</ul>
<p>Voor de zakelijke markt organiseert Mark regelmatig golfclinics: een leuke, laagdrempelige manier om collega's of relaties kennis te laten maken met golf. Wil je iets memorabels toevoegen aan zo'n dag? Bekijk dan ook zijn spectaculaire <a href="/golfshows/">golfshows</a>, waarin hij als trickshot-artiest laat zien wat er allemaal met een golfbal mogelijk is.</p>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
<h2>Privéles golf of samen leren</h2>
<p>Een privéles golf is de snelste manier om vooruitgang te boeken. Alle aandacht gaat naar jou, je swing en jouw persoonlijke leerdoelen. Mark stemt elke les af op waar jij staat, zodat je nooit tijd verliest aan dingen die je al beheerst. Liever samen leren? Golfles met z'n tweeën of in een klein groepje is gezellig én leerzaam, en vaak een fijne manier om met je partner, vriend of collega hetzelfde tempo te houden.</p>
<p>Omdat de lessen op The International in Badhoevedorp worden gegeven, heb je alle faciliteiten binnen handbereik: een uitstekende driving range, oefengreens en een prachtige baan waar je het geleerde meteen in de praktijk brengt. De ligging vlak bij Amsterdam en Schiphol maakt golfles hier goed bereikbaar, vanuit de stad net zo goed bereikbaar als vanuit de regio Haarlemmermeer.</p>
<h2>Waarom golfles bij Mark Reynolds?</h2>
<p>Dertig jaar in het vak levert een gevoel op voor wat werkt en wat niet. Hij groeide op in Maltby bij Rotherham in Engeland en begon op zijn zestiende met zijn PGA-opleiding onder Simon Thornhill op Rotherham Golf Club. In 2000 verhuisde hij naar Nederland om les te geven, en in 2001 startte hij zijn eigen golfschool. Sindsdien heeft hij honderden golfers van elk niveau beter zien worden.</p>
<p>Naast lesgeven speelt Mark zelf op hoog niveau. Hij won de Nederlandse PGA Order of Merit in 2005, 2009 en 2018, pakte in 2019 het European PGA Team Championship, won de PGA Cup in 2005 en speelde meerdere KLM Opens, waarin hij in 2018 de best geklasseerde Nederlandse speler was. Met meer dan tien professionele overwinningen op zijn naam weet hij als geen ander wat er nodig is om onder druk goed te spelen, en dat vertaalt hij naar zijn lessen. Meer weten over zijn verhaal? Lees dan de pagina <a href="/over-mark/">over Mark</a>.</p>
<p>Belangrijker nog dan zijn palmares is zijn manier van lesgeven: warm, geduldig en helder. Mark gelooft dat golf leuk hoort te zijn, en dat je het snelst leert wanneer je met vertrouwen en plezier op de baan staat.</p>
</div></div></section>
<section class="section"><div class="container"><div class="prose">
<h2>Meer dan golfles alleen</h2>
<p>MrGolfbal.nl draait om meer dan lesgeven. De hoofdactiviteit van het merk is het <a href="/golfballen-bedrukken/">bedrukken van golfballen</a>, ideaal als relatiegeschenk, voor een toernooi of gewoon om je eigen ballen herkenbaar te maken op de baan. Weet je niet welke bal bij jouw spel past? Doe dan de handige <a href="/golfbalkiezer/">golfbalkiezer</a> en ontdek welke golfbal het beste bij jouw swing en niveau hoort. Dat sluit mooi aan op je lessen: de juiste techniek én het juiste materiaal maken samen het verschil.</p>
<p>Speelt je materiaal je parten? Mark kan je clubs ook <a href="/golf-repairs/">repareren en fitten</a>, zodat techniek en uitrusting perfect op elkaar aansluiten. Wil je golf combineren met een onvergetelijke reis? Mark begeleidt ook <a href="/golftrips/">golftrips</a> naar prachtige bestemmingen, waar les, spel en ontspanning samenkomen. Een geweldige manier om je spel in korte tijd een flinke boost te geven onder professionele begeleiding.</p>
<h2>Plan jouw golfles in Badhoevedorp</h2>
<p>Klaar om te beginnen of om die volgende stap in je spel te zetten? Golfles bij Mark Reynolds op The International in Badhoevedorp is geschikt voor elk niveau en elke leeftijd. Neem gerust contact op om je mogelijkheden te bespreken en een moment in te plannen dat jou uitkomt.</p>
<p>Je bereikt Mark telefonisch op <a href="tel:+31627411925">+31 6 27 41 19 25</a>, via <a href="https://wa.me/31627411925">WhatsApp</a> of per e-mail op <a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a>. Alle gegevens vind je ook op de <a href="/contact/">contactpagina</a>. Tot snel op de baan, dan zorgen we samen dat golfen weer een feestje wordt.</p>
</div></div></section>`
});

/* ---------------- GOLF REPAIRS ---------------- */
PAGES.push({
  slug:'golf-repairs',
  title:'Golfclubs repareren &amp; fitting | MrGolfbal.nl',
  desc:'Golfclubs laten repareren bij PGA-pro Mark Reynolds op The International: grips vervangen, reshaften, loft en lie aanpassen en custom fitting. Vraag naar de mogelijkheden.',
  canon:'/golf-repairs/', crumb:'Golf repairs', noBlocks:true,
  hero:heroBlock('Golf repairs','Golfclubs repareren door een <span>PGA-professional</span>','Van nieuwe grips tot een compleet nieuwe shaft: laat je golfclubs vakkundig repareren en fitten door Mark Reynolds op The International in Badhoevedorp. Persoonlijk advies, degelijk werk.','Vraag naar de mogelijkheden','/contact/','nl',PAGE_PHOTOS['golf-repairs']),
  main:`
<section class="section"><div class="container"><div class="prose">
<h2>Golfclubs repareren: vakwerk dat je in je swing voelt</h2>
<p>Een golfclub is een precisie-instrument. Een versleten grip, een verkeerd afgestelde lie-hoek of een shaft die net niet bij jouw swing past, kost je zomaar meters en zuiverheid. Goede golfclubs hoeven daarom niet meteen te worden vervangen; heel vaak zijn ze prima te repareren en opnieuw op maat te maken. Bij MrGolfbal.nl kun je je golfclubs laten repareren door Mark Reynolds, PGA Golf Professional sinds 1995 en vaste kracht op golfclub The International in Badhoevedorp, vlakbij Amsterdam en Schiphol.</p>
<p>Omdat Mark zowel lesgeeft als clubs repareert, kijkt hij verder dan alleen de reparatie. Hij ziet hoe jij de bal raakt en weet daardoor precies wat jouw materiaal nodig heeft. Repareren en fitten lopen bij hem naadloos in elkaar over, zodat je clubs weer heel zijn en daarna ook echt bij je passen. Wil je meteen weten wat er mogelijk is voor jouw set? <a href="/contact/">Neem contact op</a> en vraag naar de mogelijkheden.</p>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
<h2>Grips vervangen op je golfclub</h2>
<p>De grip is het enige contactpunt tussen jou en de club, en tegelijk het onderdeel dat het snelst slijt. Een gladde, verharde of gedraaide grip zorgt ongemerkt voor een te sterke greep en spanning in je onderarmen; precies wat je niet wilt in een vloeiende swing. Regripping, oftewel het vervangen van grips op je golfclub, is dan ook een van de meest waardevolle en betaalbare ingrepen die je kunt laten doen.</p>
<p>Mark helpt je bij het kiezen van de juiste maat en dikte, want een grip die te dun of te dik is, beïnvloedt direct de stand van je clubface bij impact. Je hele set opnieuw laten gripen kan, en alleen je meest gebruikte ijzers ook. Grips vervangen is bovendien een mooi moment om te kijken of de rest van je club nog in topconditie is. Vraag gerust naar de mogelijkheden en de opties in grips die bij jouw spel passen.</p>
</div></div></section>
<section class="section"><div class="container"><div class="prose">
<h2>Reshaften: een nieuwe shaft in je golfclub</h2>
<p>De shaft is de motor van je club. Is je shaft gebroken, verbogen of past de stijfheid (flex) simpelweg niet meer bij je swingsnelheid, dan is reshaften de oplossing. Bij het vervangen van een shaft kijkt Mark naar meer dan alleen het vervangen van een kapot onderdeel: de juiste flex, het gewicht en het kickpoint kunnen je balvlucht, je afstand en je gevoel merkbaar verbeteren.</p>
<p>Ook het inkorten of verlengen van shafts hoort hierbij. Ben je langer of korter dan gemiddeld, of sta je gebogen over de bal, dan zorgt de juiste clublengte voor een betere houding en consistenter contact. Een verkeerde lengte werkt namelijk door in je hele swingopbouw. Twijfel je of jouw shafts nog bij je passen? Dat is precies iets om samen met een pro te bekijken, bijvoorbeeld in combinatie met een <a href="/golfles/">golfles</a> waarin je swing én je materiaal onder de loep gaan.</p>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
<h2>Loft en lie aanpassen</h2>
<p>Twee clubs die er identiek uitzien, kunnen totaal anders spelen door kleine verschillen in loft en lie. De lie-hoek bepaalt of je clubface bij impact netjes vlak op de grond staat; staat de teen of de hiel te veel omhoog, dan trek of duw je de bal onbewust weg van je doel. Het aanpassen van loft en lie is daarom een van de meest onderschatte manieren om zuiverder te leren richten.</p>
<p>Mark meet en past loft en lie aan op basis van hoe jij daadwerkelijk zwaait, niet op basis van standaardwaarden uit de fabriek. Zo krijgen je ijzers een consistente afstandsverdeling en verdwijnt dat ene rare gat tussen twee clubs. Merk je dat je met bepaalde ijzers structureel naar links of rechts mist? Dan is een loft- en lie-controle vaak het eerste wat je zou moeten laten doen.</p>
</div></div></section>
<section class="section"><div class="container"><div class="prose">
<h2>Ferrule vervangen en swingweight afstellen</h2>
<p>Het zijn de details die het verschil maken. Een gebarsten of ontbrekende ferrule, het zwarte ringetje tussen de clubkop en de shaft, ziet er niet alleen onverzorgd uit, maar kan op termijn ook vocht doorlaten. Het vervangen van een ferrule is een klein maar netjes klusje dat je clubs er weer als nieuw uit laat zien.</p>
<p>Belangrijker voor je spel is de swingweight: de gevoelsmatige balans van je club tijdens de swing. Twee clubs met exact hetzelfde totale gewicht kunnen compleet anders aanvoelen als de gewichtsverdeling verschilt. Door het afstellen van de swingweight voelen al je clubs consistent aan, wat rust en ritme in je swing brengt. Zeker als je grips, shafts of tape hebt laten vervangen, is het slim om de swingweight opnieuw te laten controleren.</p>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
<h2>Golfclub fitting: reparatie en maatwerk in één</h2>
<p>Repareren is het herstellen van wat kapot is; fitten is het afstemmen van je clubs op wie jij bent als speler. Bij MrGolfbal.nl lopen die twee bewust in elkaar over. Tijdens een custom fitting kijkt Mark naar je lengte, je houding, je swingsnelheid en je balcontact, en vertaalt hij dat naar concreet advies over grips, shafts, lengte, loft en lie. Zo haal je uit je bestaande set vaak veel meer dan je denkt, zonder meteen een compleet nieuwe uitrusting te kopen.</p>
<p>Als PGA-professional met meer dan tien professionele overwinningen en meerdere titels in de Nederlandse PGA Order of Merit (2005, 2009 en 2018) weet Mark uit eigen ervaring hoeveel het juiste materiaal uitmaakt. Wil je meer weten over zijn achtergrond en aanpak? Lees dan zijn verhaal op de pagina <a href="/over-mark/">over Mark</a>.</p>
</div></div></section>
<section class="section"><div class="container"><div class="prose">
<h2>Meer dan alleen reparaties</h2>
<p>MrGolfbal.nl draait om het complete plezier van het spel, niet alleen om je clubs. Wil je weten welke bal het beste bij jouw spel past? Doe dan de <a href="/golfbalkiezer/">golfbalkiezer</a> en ontdek in een paar stappen jouw ideale golfbal. En zoek je een origineel cadeau voor een golfvriend, een bedrijfsuitje of je eigen club? Bekijk dan de mogelijkheden voor <a href="/golfballen-bedrukken/">golfballen bedrukken</a> met je eigen naam, logo of tekst. Of boek een <a href="/golfles/">golfles</a> om techniek en materiaal samen te verbeteren.</p>
<p>Zo vind je bij MrGolfbal.nl alles onder één dak: deskundige reparatie en fitting van je clubs, persoonlijke golfles en leuke extra's die het golfen nog mooier maken. Altijd met de kennis en ervaring van een echte PGA-professional erachter.</p>
<h2>Je golfclubs laten repareren? Zo werkt het</h2>
<p>Wil je je golfclubs laten repareren of eens goed laten fitten? Neem dan contact op met Mark, dan bespreken we samen wat jouw set nodig heeft en wat er mogelijk is. Omdat elke reparatie maatwerk is, kijken we eerst naar jouw clubs en jouw wensen voordat we iets afspreken. Bel of app naar <a href="tel:+31627411925">+31 6 27 41 19 25</a>, mail naar <a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a> of kijk op de <a href="/contact/">contactpagina</a>. Je vindt Mark op golfclub The International in Badhoevedorp, tussen Amsterdam en Schiphol.</p>
</div></div></section>`
});

/* ---------------- OVER MARK ---------------- */
PAGES.push({
  slug:'over-mark',
  title:'Over ons — Mark Reynolds, PGA-professional &amp; oprichter | MrGolfbal.nl',
  desc:'Maak kennis met Mark Reynolds: PGA-golfprofessional, meervoudig winnaar van de Dutch PGA Order of Merit en oprichter van MrGolfbal.nl. Advies van een echte pro.',
  canon:'/over-mark/', crumb:'Over ons', noBlocks:true,
  extra:`<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional',
    worksFor:{'@id':'https://mrgolfbal.nl/#org'}, nationality:'British', birthPlace:'Maltby, Rotherham, Engeland',
    award:['Dutch PGA Order of Merit 2005','Dutch PGA Order of Merit 2009','Dutch PGA Order of Merit 2018','European PGA Team Championship 2019','PGA Cup 2005'],
    description:'PGA-golfprofessional sinds 1995, gevestigd op The International (Badhoevedorp), en oprichter van MrGolfbal.nl.'
  })}</script>`,
  hero:heroBlock('Over ons','Mark Reynolds — <span>PGA-professional</span> &amp; oprichter','Achter MrGolfbal.nl staat een echte golfprofessional. Mark combineert originele merkballen met advies dat verder gaat dan bedrukken: welke bal past bij welke speler, en wat maakt indruk op je gasten.','Neem contact op met Mark','/contact/','nl',PAGE_PHOTOS['over-mark']),
  main:`
<section class="section"><div class="container"><div class="prose">
  <p class="lead">Mark Reynolds is PGA-golfprofessional en de oprichter van MrGolfbal.nl. Met tientallen jaren ervaring op en rond de baan — als speler én als leraar — weet hij als geen ander welke golfbal bij welke speler past, en hoe je een logo strak en herkenbaar op die bal krijgt.</p>
  <h2>Van Yorkshire naar de Nederlandse fairways</h2>
  <p>Mark werd in 1978 geboren in Maltby, in het Engelse Rotherham, en stond al op zijn vijfde met een golfclub in zijn handen. Op zijn zestiende begon hij zijn PGA-opleiding onder Simon Thornhill op Rotherham Golf Club, en sinds 1995 is hij <strong>PGA Golf Professional</strong>. In 2000 verruilde hij Engeland voor Nederland om les te geven, en in 2001 begon hij zijn eigen golfschool. Sinds 2014 is Mark verbonden aan <strong>The International</strong> in Badhoevedorp bij Amsterdam, waar hij nog altijd lesgeeft en speelt.</p>
  <h2>Prestaties &amp; erkenning</h2>
  <p>Mark is geen coach die alleen aan de kant staat — hij presteert zelf op hoog niveau. Hij won de <strong>Dutch PGA Order of Merit</strong> in 2005, 2009 én 2018, werd Europees kampioen met het <strong>European PGA Team Championship in 2019</strong> en won in 2005 de <strong>PGA Cup</strong> met Groot-Brittannië &amp; Ierland tegen de Verenigde Staten. Hij speelde meerdere edities van het <strong>KLM Open</strong> en was daar in 2018 de best geklasseerde Nederlander. In totaal boekte hij meer dan tien professionele overwinningen.</p>
  <h2>Waarom een PGA-pro achter je golfballen?</h2>
  <p>Die achtergrond is precies wat je terugziet in het advies. Bij MrGolfbal.nl koop je niet zomaar bedrukte golfballen — je krijgt advies van iemand die het spel door en door kent. Van de keuze tussen een <a href="/products/titleist-pro-v1/">Pro V1</a> en <a href="/products/titleist-pro-v1x/">Pro V1x</a> tot de beste bal voor een gemengd deelnemersveld op een <a href="/toepassingen/golfballen-bedrijfsgolfdag/">bedrijfsgolfdag</a>: Mark denkt met je mee. Twijfel je? Doe de <a href="/golfbalkiezer/">golfbalkiezer</a> of leg je vraag rechtstreeks aan hem voor.</p>
  <h2>Meer dan bedrukken: golfshows &amp; golftrips</h2>
  <p>Mark is ook een gevierd <a href="/golfshows/">golfshow- en trickshow-artist</a> en begeleidt <a href="/golftrips/">golftrips</a> als PGA-pro. Zo kun je hem inschakelen voor bedrukte golfballen en hem daarnaast boeken voor entertainment op je golfdag of een onvergetelijke golfreis — in Nederland, Europa en daarbuiten.</p>
  <h2>Persoonlijk contact</h2>
  <p>Vragen over balkeuze, je logo of een bestelling? Mark is direct bereikbaar via <a href="/contact/">contact</a>, telefoon (<a href="tel:+31627411925">+31 6 27 41 19 25</a>) en <a href="https://wa.me/31627411925">WhatsApp</a>. Persoonlijk, deskundig en zonder omwegen.</p>
</div></div></section>`
});


/* ---------------- BEDANKT (na formulierverzending) ---------------- */
PAGES.push({
  slug:'bedankt',
  title:'Bedankt voor je bericht | MrGolfbal.nl',
  desc:'Je bericht is verstuurd. Mark reageert doorgaans binnen 24 uur op je aanvraag voor bedrukte golfballen, een golfshow of een golfles.',
  canon:'/bedankt/', crumb:'Bedankt', noBlocks:true, noIndex:true,
  hero:heroBlock('Bedankt','Je bericht is <span>verstuurd</span>','Mark heeft je aanvraag ontvangen en reageert doorgaans binnen 24 uur — meestal nog dezelfde werkdag.','Terug naar de homepage','/'),
  main:`
<section class="section"><div class="container"><div class="prose">
<h2>Wat gebeurt er nu?</h2>
<p>Je aanvraag staat in de mailbox van Mark. Hij kijkt er persoonlijk naar en komt bij je terug met een voorstel of een paar verduidelijkende vragen. Gaat het om een offerte voor bedrukte golfballen, dan ontvang je daarbij ook meteen de staffelprijzen die bij jouw aantal horen.</p>
<p>Heb je haast, of wil je iets nog even toelichten? Bel of app gerust naar <a href="tel:+31627411925">+31 6 27 41 19 25</a> of stuur een bericht via <a href="https://wa.me/31627411925">WhatsApp</a>.</p>
<h2>Ondertussen</h2>
<p>Kijk vast rond terwijl je wacht: doe de <a href="/golfbalkiezer/">golfbalkiezer</a> om te zien welke bal bij je past, lees hoe het <a href="/zo-werkt-het/">bedrukken stap voor stap werkt</a>, of bekijk de <a href="/golfshows/">golfshows</a> en <a href="/golftrips/">golftrips</a> van Mark.</p>
</div></div></section>`
});

/* ---------------- CONTACT ---------------- */
PAGES.push({
  slug:'contact',
  title:'Contact — persoonlijk advies van Mark | MrGolfbal.nl',
  desc:'Neem contact op met MrGolfbal.nl. Persoonlijk advies over golfballen bedrukken, je logo of een spoedbestelling — via e-mail, telefoon of WhatsApp.',
  canon:'/contact/', crumb:'Contact', noBlocks:true,
  hero:'',   // geen hero op de contactpagina: bezoekers willen meteen het formulier
  main:`
<section class="section pagehead"><div class="container">
  <p class="eyebrow">${ico('chat','ico-inline')} Contact</p>
  <h1>Persoonlijk advies? <span>Mark helpt je</span></h1>
  <p class="lead">Vragen over golfballen bedrukken, je logo-opmaak, een spoedbestelling, een golfshow of een golfreis? Bel of app gerust — je krijgt doorgaans binnen 24 uur antwoord.</p>
  ${contactBtns('nl', false)}
</div></section>
<section class="section"><div class="container"><div class="grid grid-2" style="gap:2.5rem;align-items:start">
  <div>
    <div class="section-head"><p class="eyebrow">Direct contact</p><h2>Zo bereik je ons</h2></div>
    <div class="stack mt-1">
      <div class="feature"><h3>E-mail</h3><p><a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a></p></div>
      <div class="feature"><h3>Telefoon</h3><p><a href="tel:+31627411925">+31 6 27 41 19 25</a></p></div>
      <div class="feature"><h3>WhatsApp</h3><p><a href="https://wa.me/31627411925">Chat direct met Mark</a> — handig voor snel overleg over je logo of bestelling.</p></div>
      <div class="feature"><h3>Waarmee we helpen</h3><p>Productkeuze, logo-opmaak, staffels/offertes en spoedbestellingen.</p></div>
    </div>
    <p class="muted mt-1">KVK 27326866</p>
  </div>
  <div><div class="section-head"><p class="eyebrow">Stuur een bericht</p><h2>Contactformulier</h2></div>
    <form class="mt-1" action="https://api.web3forms.com/submit" method="POST">
      <input type="hidden" name="access_key" value="63fb5800-8156-4d0c-9bbb-b1cc16f16dff">
      <input type="hidden" name="subject" value="Nieuw bericht via MrGolfbal.nl">
      <input type="hidden" name="from_name" value="MrGolfbal.nl">
      <input type="checkbox" name="botcheck" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field"><label for="c-naam">Naam</label><input id="c-naam" name="name" autocomplete="name" required></div>
      <div class="field"><label for="c-onderwerp">Onderwerp</label><select id="c-onderwerp" name="onderwerp"><option>Offerteaanvraag</option><option>Digitale drukproef</option><option>Onbedrukte golfballen (grote aantallen)</option><option>Golfshow / trickshow boeken</option><option>Golfles of clinic</option><option>Hulp bij bestellen</option><option>Algemene vraag</option></select></div>
      <div class="field"><label for="c-mail">E-mailadres</label><input id="c-mail" type="email" name="email" autocomplete="email" required></div>
      <div class="field"><label for="c-tel">Telefoon <span class="muted">(optioneel)</span></label><input id="c-tel" type="tel" name="telefoon" autocomplete="tel"></div>
      <div class="field"><label for="c-bericht">Bericht</label><textarea id="c-bericht" name="message" rows="5" required></textarea></div>
      <input type="hidden" name="redirect" value="https://mrgolfbal.nl/bedankt/">
      <button class="btn btn--primary btn--lg" type="submit">${ico('mail','btn__ico')}Verstuur bericht →</button>
    </form>
  </div>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
  <h2>Wat je het beste meestuurt</h2>
  <p>Hoe concreter je bericht, hoe sneller je een bruikbaar antwoord terugkrijgt. Voor een aanvraag voor bedrukte golfballen helpen vier dingen: om hoeveel ballen het gaat, welk merk of model je in gedachten hebt, wanneer je ze nodig hebt en welk bestand je van je logo hebt. Weet je dat laatste niet zeker, stuur dan gewoon wat je hebt — Mark laat je weten of het werkt of dat er iets aan moet gebeuren.</p>
  <p>Gaat het om een golfshow, een clinic of een golfreis, dan zijn de datum, de locatie en het aantal gasten de eerste vragen. Voor een show is ook nuttig om te weten of het buiten op een range gebeurt of binnen in een zaal, want dat bepaalt welke onderdelen mogelijk zijn. Twijfel je over de opzet, beschrijf dan het dagprogramma in een paar zinnen; het advies volgt daarna vanzelf.</p>
  <h2>Hoe snel je antwoord krijgt</h2>
  <p>Berichten worden doorgaans binnen 24 uur beantwoord, op werkdagen meestal sneller. Mark staat een groot deel van de week op de baan of op de range, dus het kan gebeuren dat een reactie aan het eind van de dag komt in plaats van meteen. Heb je haast — een event dat al vaststaat, een levering die krap zit — zet dat er dan bij, dan schuift je bericht naar voren.</p>
  <p>Voor korte vragen is WhatsApp vaak het handigst: een foto van een logo of een verpakking zegt meer dan een lange beschrijving. Bellen kan ook; krijg je geen gehoor, dan wordt er teruggebeld zodra het kan.</p>
  <h2>Wat er daarna gebeurt</h2>
  <p>Bij een bestelling van bedrukte ballen volgt eerst een voorstel met model, aantal en prijs. Ga je akkoord, dan maken we een <a href="/kennisbank/digitale-drukproef-golfballen/">digitale drukproef</a> waarop je precies ziet hoe je logo op de bal komt te staan. Pas na jouw akkoord op die proef start de productie, die 5 tot 15 werkdagen duurt. De hele volgorde staat uitgeschreven bij <a href="/zo-werkt-het/">zo werkt het</a>, en de praktische kant van levering vind je bij <a href="/verzending-en-levering/">verzending en levering</a>.</p>
  <p>Bij een boeking voor een show of reis leggen we eerst datum en opzet vast, daarna volgt de bevestiging met de afspraken die daarbij horen. Prijzen zijn altijd op aanvraag, omdat ze afhangen van aantal, locatie en wat je precies wilt.</p>
  <h2>Waar Mark te vinden is</h2>
  <p>Mark Reynolds is PGA Golf Professional en sinds 2014 verbonden aan The International in Badhoevedorp, bij Amsterdam. Daar geeft hij <a href="/golfles/">les</a> en speelt hij zelf. Voor <a href="/golfshows/">golfshows</a> en clinics reist hij door heel Nederland en België, en met <a href="/golftrips/">golfreizen</a> gaat hij verder Europa in. Meer over zijn achtergrond lees je op <a href="/over-mark/">over Mark</a>.</p>
</div></div></section>`
});

/* GOLFBALKIEZER wordt apart gegenereerd via quizPage() (stap-voor-stap quiz). */

// ---- schrijf pagina's (NL op root, EN onder /en/) ----
for (const p of PAGES) {
  writeFileSync2(join(root, p.slug, 'index.html'), page(p, 'nl'));
  console.log('generated /' + p.slug + '/');
  const e = EN_PAGES[p.slug];
  if (e) {
    const eo = { slug:p.slug, noBlocks:p.noBlocks, noIndex:p.noIndex, noEn:p.noEn, title:e.title, desc:e.desc, canon:p.canon, crumb:e.crumb,
      hero: e.hero || heroBlock(e.he, e.hh1, e.hsub, e.hcta, e.hhref || '/golfballen-bedrukken/#configurator', 'en', PAGE_PHOTOS[p.slug]),
      main: e.main };
    writeFileSync2(join(root, 'en', p.slug, 'index.html'), page(eo, 'en'));
    console.log('generated /en/' + p.slug + '/');
  } else {
    console.warn('  [!] geen EN-content voor', p.slug);
  }
}
console.log('TOTAL', PAGES.length, 'content pages (NL) + EN');

/* =================== PRODUCTPAGINA'S =================== */
// Baleigenschappen kwalitatief (fabrikant/algemeen bekend). Exacte specs: fabrikant.
const PRODUCTS = [
  { handle:'titleist-pro-v1', brand:'Titleist', merkUrl:'/titleist-golfballen-bedrukken/', name:'Titleist Pro V1',
    feel:'Zacht', flight:'Penetrerend', spin:'Hoog rond de green', target:'Lage tot midden handicap; premium relatiegeschenk',
    blurb:'De Pro V1 is al jaren de meest gespeelde bal op tour. Een zacht gevoel, een penetrerende, consistente balvlucht en veel controle rond de green. Bedrukt met jouw logo is het een relatiegeschenk met echte status.' },
  { handle:'titleist-pro-v1x', brand:'Titleist', merkUrl:'/titleist-golfballen-bedrukken/', name:'Titleist Pro V1x',
    feel:'Iets steviger', flight:'Hoger', spin:'Zeer hoog rond de green', target:'Spelers die hoogte en maximale controle zoeken',
    blurb:'De Pro V1x vliegt hoger, voelt iets steviger en biedt nog meer spin. Ideaal voor spelers die met hoogte en controle willen aanvallen. Een premium keuze om te bedrukken.' },
  { handle:'titleist-trufeel', brand:'Titleist', merkUrl:'/titleist-golfballen-bedrukken/', name:'Titleist TruFeel',
    feel:'Extra zacht', flight:'Midden', spin:'Midden', target:'Recreatief en prijsbewuste zakelijke bestellingen',
    blurb:'De TruFeel combineert een extra zacht gevoel met een scherpe prijs. Een toegankelijke Titleist die zich uitstekend leent voor grotere bedrukte oplages.' },
  { handle:'titleist-avx', brand:'Titleist', merkUrl:'/titleist-golfballen-bedrukken/', name:'Titleist AVX',
    feel:'Zeer zacht', flight:'Lager', spin:'Lager in het lange spel', target:'Spelers die een lage, penetrerende vlucht willen',
    blurb:'De AVX biedt een zeer zacht gevoel met een lagere balvlucht en spin. Een onderscheidende premium keuze om te laten bedrukken.' },
  { handle:'titleist-velocity', brand:'Titleist', merkUrl:'/titleist-golfballen-bedrukken/', name:'Titleist Velocity',
    feel:'Stevig', flight:'Hoog', spin:'Laag', target:'Afstand en een rechte, hoge vlucht; recreatief',
    blurb:'De Velocity is gebouwd voor snelheid en afstand met een hoge vlucht en lage spin. Een sportieve, herkenbare bal om te bedrukken.' },
  { handle:'pinnacle-soft-met-bedrukking', brand:'Pinnacle', merkUrl:'/pinnacle-golfballen-bedrukken/', name:'Pinnacle Soft',
    feel:'Zacht', flight:'Midden-hoog', spin:'Lager', target:'Golfdagen, grote oplages, scherpe prijs',
    blurb:'De Pinnacle Soft biedt een zacht gevoel tegen een scherpe prijs en heeft een groot, egaal oppervlak dat zich prima leent voor bedrukking. Populair voor golfdagen en relatiegeschenken.' },
  { handle:'pinnacle-rush-met-bedrukking', brand:'Pinnacle', merkUrl:'/pinnacle-golfballen-bedrukken/', name:'Pinnacle Rush',
    feel:'Stevig', flight:'Hoog', spin:'Lager', target:'Afstand zoeken; toernooiballen',
    blurb:'De Pinnacle Rush heeft een stevige kern gericht op extra afstand. Een prettige, scherp geprijsde toernooibal die er met jouw logo verzorgd uitziet.' },
];

// Product-UI per taal (chrome/labels). Baleigenschappen komen uit PRODUCTS / EN_PRODUCTS.
const PU = {
  nl: {
    title:(n)=>`${n} bedrukken met logo | MrGolfbal.nl`,
    desc:(n,b)=>`${n} golfballen bedrukken met je logo of tekst. Originele ${b}-ballen, vanaf 144 stuks, digitale drukproef vooraf en een offerte op maat.`,
    ldDesc:(n,bl)=>`${n} golfballen bedrukt met logo of tekst. ${bl}`,
    crumbBrand:(b)=>`${b} bedrukken`, eyebrowBrand:(b)=>`${b} bedrukken`,
    h1:(n)=>`${n} bedrukken met jouw <span>logo of tekst</span>`,
    ctaProof:'Digitale drukproef &amp; offerte ontvangen',
    trust:(b)=>`<span>✓ Origineel ${b}</span><span>✓ Vanaf 144 stuks</span><span>✓ Drukproef vooraf</span><span>✓ Offerte op maat</span>`,
    propsEye:'Eigenschappen', propsH:'Speelgevoel &amp; doelgroep',
    tFeel:'Gevoel', tFlight:'Balvlucht', tSpin:'Spin', tTarget:'Geschikt voor',
    qualNote:'Kwalitatieve weergave op basis van fabrikantinformatie en praktijkervaring.', confirmSpecs:'exacte specificaties bevestigen',
    orderEye:'Bedrukking &amp; bestellen', orderH:(n)=>`Zo bestel je ${n} bedrukt`,
    printH:'Bedrukking', printP:'Logo, tekst, naam of ontwerp in 1 tot 5 kleuren (spotkleuren). Eén zijde standaard; tweede zijde op aanvraag.', confirm:'bevestigen',
    minH:'Minimale afname', minP:'Vanaf 144 golfballen; grotere aantallen zijn voordeliger. Je ontvangt een offerte op maat.',
    proofH:'Drukproef &amp; offerte', proofP:'Je ontvangt eerst een digitale drukproef en een offerte. Productie start na jouw akkoord. Levertijd 5–15 werkdagen.',
    cmpEye:'Vergelijk', cmpH:(n)=>`${n} vs. andere modellen`, allBrand:(b)=>`Alle ${b} bedrukte golfballen →`,
    relEye:'Ook interessant', relH:'Gerelateerde bedrukte golfballen', viewModel:'Bekijk model'
  },
  en: {
    title:(n)=>`Print ${n} with your logo | MrGolfbal.nl`,
    desc:(n,b)=>`Print ${n} golf balls with your logo or text. Original ${b} balls, from 144 units, digital proof first and a tailored quote.`,
    ldDesc:(n,bl)=>`${n} golf balls printed with a logo or text. ${bl}`,
    crumbBrand:(b)=>`Print ${b}`, eyebrowBrand:(b)=>`Print ${b}`,
    h1:(n)=>`Print ${n} with your <span>logo or text</span>`,
    ctaProof:'Get a digital proof &amp; quote',
    trust:(b)=>`<span>✓ Original ${b}</span><span>✓ From 144 balls</span><span>✓ Proof first</span><span>✓ Tailored quote</span>`,
    propsEye:'Characteristics', propsH:'Feel &amp; who it suits',
    tFeel:'Feel', tFlight:'Ball flight', tSpin:'Spin', tTarget:'Suited to',
    qualNote:'Qualitative overview based on manufacturer information and practical experience.', confirmSpecs:'confirm exact specifications',
    orderEye:'Printing &amp; ordering', orderH:(n)=>`How to order ${n} printed`,
    printH:'Printing', printP:'Logo, text, name or design in 1 to 5 colours (spot colours). One side as standard; second side on request.', confirm:'to confirm',
    minH:'Minimum order', minP:'From 144 golf balls; larger quantities are more economical. You receive a tailored quote.',
    proofH:'Proof &amp; quote', proofP:'You first receive a digital proof and a quote. Production starts after your approval. Delivery 5–15 working days.',
    cmpEye:'Compare', cmpH:(n)=>`${n} vs. other models`, allBrand:(b)=>`All ${b} printed golf balls →`,
    relEye:'Also interesting', relH:'Related printed golf balls', viewModel:'View model'
  }
};

// velden per taal ophalen (EN valt terug op NL als een veld ontbreekt)
const pf = (p, lang, field) => (lang==='en' && EN_PRODUCTS[p.handle] && EN_PRODUCTS[p.handle][field]) || p[field];

// Per model drie vragen die echt over díe bal gaan. De algemene bedrukvragen
// staan op /zo-werkt-het/ en hoeven niet op elke productpagina te herhalen.
const PRODUCT_FAQ = (p, lang='nl') => {
  const set = PRODUCT_FAQ_COPY[p.handle];
  return set ? (set[lang] || set.nl) : [];
};

const productPage = (p, lang='nl') => {
  const t = PU[lang], u = UI[lang], pre = pfx(lang);
  const feel=pf(p,lang,'feel'), flight=pf(p,lang,'flight'), spin=pf(p,lang,'spin'), target=pf(p,lang,'target'), blurb=pf(p,lang,'blurb');
  return HEAD(
    t.title(p.name), t.desc(p.name, p.brand), `/products/${p.handle}/`, lang,
    `<script type="application/ld+json">${JSON.stringify({
      '@context':'https://schema.org','@type':'Product',name:p.name,brand:{'@type':'Brand',name:p.brand},
      category:'Golfballen bedrukken', description:t.ldDesc(p.name, blurb)
    })}</script>` +
    breadcrumbLD([{name:u.home,url:'/'},{name:t.crumbBrand(p.brand),url:p.merkUrl},{name:p.name,url:`/products/${p.handle}/`}], lang)
  ) + HEADER(lang, `/products/${p.handle}/`) +
`<div class="container"><nav class="crumbs"><a href="${pre}/">${u.home}</a> › <a href="${pre}${p.merkUrl}">${t.crumbBrand(p.brand)}</a> › <span>${p.name}</span></nav></div>
<section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3rem)">
  <div class="hero-visual" style="order:2">${PRODUCT_PHOTOS[p.handle]
      ? `<figure class="ballphoto-main">${ballPhoto(p.handle, lang, 0)}</figure>`
      : `<div class="ballshot"><div class="ball"><span class="logo-print">${u.jouw}<br><span>${u.logo}</span></span></div></div>`}</div>
  <div class="hero-copy">
    <p class="eyebrow">${t.eyebrowBrand(p.brand)}</p>
    <h1>${t.h1(p.name)}</h1>
    <p>${blurb}</p>
    <div class="hero-cta">
      <a class="btn btn--primary btn--lg" href="${pre}/golfballen-bedrukken/#configurator">${CTA_ICO}${t.ctaProof} <span class="btn__arrow">→</span></a>
    </div>
    <div class="hero-trust">${t.trust(p.brand)}</div>
  </div>
</div></section>
${PRODUCT_COPY[p.handle] ? `<section class="section"><div class="container"><div class="prose">${localize(PRODUCT_COPY[p.handle][lang] || PRODUCT_COPY[p.handle].nl, lang)}</div></div></section>` : ''}
${ballVariants(p.handle, lang)}
<section class="section"><div class="container"><div class="grid grid-2" style="gap:2.5rem;align-items:start">
  <div>
    <div class="section-head"><p class="eyebrow">${t.propsEye}</p><h2>${t.propsH}</h2></div>
    <table class="staffel" style="margin-top:1rem"><tbody>
      <tr><td>${t.tFeel}</td><td style="text-align:right"><strong>${feel}</strong></td></tr>
      <tr><td>${t.tFlight}</td><td style="text-align:right"><strong>${flight}</strong></td></tr>
      <tr><td>${t.tSpin}</td><td style="text-align:right"><strong>${spin}</strong></td></tr>
      <tr><td>${t.tTarget}</td><td style="text-align:right"><strong>${target}</strong></td></tr>
    </tbody></table>
    <p class="muted" style="font-size:.82rem;margin-top:.7rem">${t.qualNote}</p>
  </div>
  <div>
    <div class="section-head"><p class="eyebrow">${t.orderEye}</p><h2>${t.orderH(p.name)}</h2></div>
    <div class="stack mt-1">
      <div class="feature"><h3>${t.printH}</h3><p>${t.printP}</p></div>
      <div class="feature"><h3>${t.minH}</h3><p>${t.minP}</p></div>
      <div class="feature"><h3>${t.proofH}</h3><p>${t.proofP}</p></div>
    </div>
    <a class="btn btn--primary btn--block btn--lg mt-1" href="${pre}/golfballen-bedrukken/#configurator">${CTA_ICO}${t.ctaProof} →</a>
  </div>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">${t.cmpEye}</p><h2>${t.cmpH(p.name)}</h2></div>${compareTable(lang)}
  <div class="mt-2"><a class="btn btn--ghost" href="${pre}${p.merkUrl}">${t.allBrand(p.brand)}</a></div>
</div></section>
<section class="section"><div class="container"><div class="section-head section-head--center"><p class="eyebrow">${t.relEye}</p><h2>${t.relH}</h2></div>
  <div class="grid grid-3" style="margin-top:1.5rem">
    ${PRODUCTS.filter(x=>x.handle!==p.handle && x.brand===p.brand).slice(0,3).map(x=>`
    <article class="card">${PRODUCT_PHOTOS[x.handle] ? `<div class="card__media">${ballPhoto(x.handle, lang, 0)}</div>` : ''}<div class="card__body"><span class="card__brand">${x.brand}</span><h3 class="card__title">${x.name}</h3><p class="card__meta">${pf(x,lang,'feel')} · ${pf(x,lang,'flight')}</p><a class="btn btn--primary btn--block" href="${pre}/products/${x.handle}/">${t.viewModel}</a></div></article>`).join('')}
  </div></div></section>`
  + extraSections(p.handle, lang, EXTRA_PRODUCTS)
  + ballGallery(seedOf(p.handle), lang)
  + howItWorks(lang) + whyUs(lang) + reviewsBlock(lang)
  + faqBlock(PRODUCT_FAQ(p, lang), lang, false)
  + socialsBlock(lang)
  + ctaBlock(lang, `/products/${p.handle}/`) + FOOTER(lang, `/products/${p.handle}/`);
};

for (const p of PRODUCTS) {
  writeFileSync2(join(root, 'products', p.handle, 'index.html'), productPage(p, 'nl'));
  writeFileSync2(join(root, 'en', 'products', p.handle, 'index.html'), productPage(p, 'en'));
  console.log('generated /products/' + p.handle + '/ (+EN)');
}
console.log('TOTAL', PRODUCTS.length, 'product pages (NL+EN)');

/* =================== KENNISBANK =================== */
const KB_CATS = { techniek:'Bedrukken & techniek', merken:'Merken & modellen', toepassingen:'Toepassingen & inspiratie' };
const KB_CATS_L = { nl: KB_CATS, en: EN_KB_CATS };

const kbRelated = (lang='nl') => lang==='en' ? `
<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">Keep going</p><h2>Get started yourself</h2></div>
  <div class="grid grid-3" style="margin-top:1.2rem">
    <a class="usecase" href="/en/golfballen-bedrukken/#configurator" style="text-decoration:none"><h3>Open the configurator</h3><p>Pick brand, model and quantity and receive a proof.</p><span>To the configurator →</span></a>
    <a class="usecase" href="/en/golfbalkiezer/" style="text-decoration:none"><h3>Golf ball finder</h3><p>Not sure which ball fits? Take the quiz.</p><span>Take the test →</span></a>
    <a class="usecase" href="/en/contact/" style="text-decoration:none"><h3>Ask Mark</h3><p>Personal advice from a PGA professional.</p><span>Get in touch →</span></a>
  </div></div></section>` : `
<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">Direct verder</p><h2>Zelf aan de slag</h2></div>
  <div class="grid grid-3" style="margin-top:1.2rem">
    <a class="usecase" href="/golfballen-bedrukken/#configurator" style="text-decoration:none"><h3>Start de configurator</h3><p>Kies merk, model en aantal en ontvang een drukproef.</p><span>Naar de configurator →</span></a>
    <a class="usecase" href="/golfbalkiezer/" style="text-decoration:none"><h3>Golfbalkiezer</h3><p>Niet zeker welke bal past? Doe de keuzehulp.</p><span>Doe de test →</span></a>
    <a class="usecase" href="/contact/" style="text-decoration:none"><h3>Vraag Mark</h3><p>Persoonlijk advies van een PGA-professional.</p><span>Neem contact op →</span></a>
  </div></div></section>`;

const KB = [
/* ---- BEDRUKKEN & TECHNIEK ---- */
{ slug:'logo-aanleveren-voor-golfballen-bedrukken', cat:'techniek',
  title:'Logo aanleveren voor golfballen bedrukken: formaten &amp; tips | MrGolfbal.nl',
  desc:'Hoe lever je je logo aan om golfballen te laten bedrukken? Vectorbestanden (EPS, AI, PDF), kleuren, resolutie en veelgemaakte fouten — met praktische tips.',
  h1:'Logo aanleveren voor het bedrukken van golfballen',
  body:`<p class="lead">Een strak bedrukt logo begint bij een goed aangeleverd bestand. Op deze pagina lees je precies welk bestand je het beste aanlevert, waarom een vectorbestand de voorkeur heeft en welke fouten je voorkomt — zodat je logo haarscherp op de bal komt.</p>
  <h2>Waarom een vectorbestand het beste werkt</h2>
  <p>Een golfbal is klein en rond, en het bedrukoppervlak is beperkt. Daardoor moet je logo bij elke afmeting scherp blijven. Een <strong>vectorbestand</strong> (EPS, AI of PDF) bestaat uit lijnen en vlakken die oneindig schaalbaar zijn: of we het logo nu groot of klein plaatsen, de randen blijven strak. Een gewone foto of schermafbeelding (JPEG, PNG) bestaat uit pixels en wordt bij vergroten korrelig of wazig.</p>
  <p>Heb je alleen een JPEG of PNG? Vaak kunnen we daar iets mee, zeker bij een eenvoudig logo — maar we laten het je eerlijk weten als de kwaliteit te laag is, en Mark denkt mee over de beste oplossing.</p>
  <h2>Aanbevolen bestandsformaten</h2>
  <p>Lever bij voorkeur aan als <strong>EPS, AI of PDF</strong> (vector). Zorg dat lettertypes zijn omgezet naar lettercontouren (outlines), zodat de tekst er bij ons exact zo uitziet als bij jou. Een PNG met transparante achtergrond in hoge resolutie is een acceptabel alternatief voor eenvoudige logo's.</p>
  <h2>Kleuren en huisstijl</h2>
  <p>Golfballen bedrukken we in <strong>spotkleuren</strong> (1 tot 5 kleuren). Geef je huisstijlkleuren door — bij voorkeur als PMS/Pantone-waarden — dan stemmen we de opdruk daarop af. Hoe minder kleuren en hoe eenvoudiger de vormen, hoe strakker het resultaat op het bolle baloppervlak.</p>
  <h2>Veelgemaakte fouten</h2>
  <p>De meest voorkomende problemen: een logo met heel fijne lijntjes of kleine tekst (verdwijnt op een klein oppervlak), een lage-resolutie afbeelding van internet, of een ontwerp met veel kleurovergangen. Houd het logo helder en contrastrijk; dat leest het beste op een witte golfbal.</p>
  <h2>En daarna?</h2>
  <p>Je hoeft niet meteen het perfecte bestand te hebben. Upload wat je hebt in de <a href="/golfballen-bedrukken/#configurator">configurator</a>; je ontvangt altijd eerst een <a href="/kennisbank/digitale-drukproef-golfballen/">digitale drukproef</a> waarop je precies ziet hoe het logo op de bal komt. Productie start pas na jouw akkoord.</p>` },

{ slug:'hoeveel-kleuren-golfbal-bedrukken', cat:'techniek',
  title:'Hoeveel kleuren kun je op een golfbal bedrukken? | MrGolfbal.nl',
  desc:'Hoeveel kleuren passen er op een bedrukte golfbal? Uitleg over spotkleuren (1 tot 5), het verschil met full-colour en hoe je je logo het beste laat uitkomen.',
  h1:'Hoeveel kleuren kun je op een golfbal bedrukken?',
  body:`<p class="lead">Het aantal kleuren bepaalt mee hoe je logo eruitziet én wat er technisch mogelijk is op het kleine, bolle oppervlak van een golfbal. Hier lees je hoe kleurbedrukking werkt en hoe je je logo het beste laat uitkomen.</p>
  <h2>Bedrukking in spotkleuren</h2>
  <p>Golfballen bedrukken we standaard in <strong>spotkleuren</strong>: heldere, egale kleuren die per stuk worden aangebracht. Meestal gaat het om <strong>1 tot 5 kleuren</strong>. Elke extra kleur is een aparte stap in het proces, dus een logo met twee of drie heldere kleuren is technisch eenvoudiger — en vaak fraaier — dan een ontwerp met veel kleurovergangen.</p>
  <h2>Spotkleur versus full-colour</h2>
  <p>Bij spotkleuren kies je concrete, afgebakende kleuren (bijvoorbeeld je twee huisstijlkleuren). Full-colour of fotoprints met verlopen zijn op een bol, klein oppervlak lastiger en niet altijd beschikbaar. Wil je een foto of ontwerp met verloop laten bedrukken? Leg het ons voor, dan bekijken we samen wat mogelijk is.</p>
  <h2>Zo komt je logo het beste uit</h2>
  <p>Op een witte golfbal werken donkere, contrastrijke kleuren het best. Houd lijnen niet te dun en tekst niet te klein. Twijfel je of jouw logo geschikt is? In de <a href="/kennisbank/logo-aanleveren-voor-golfballen-bedrukken/">aanleverpagina</a> lees je hoe je je bestand voorbereidt, en op de <a href="/golfballen-bedrukken/#configurator">configurator</a> kies je direct het aantal kleuren.</p>
  <h2>Altijd eerst een proef</h2>
  <p>Wat je ook kiest: je ziet het resultaat vooraf. Je ontvangt een <a href="/kennisbank/digitale-drukproef-golfballen/">digitale drukproef</a> met de kleuren en positie, en pas na jouw goedkeuring gaat het in productie.</p>` },

{ slug:'digitale-drukproef-golfballen', cat:'techniek',
  title:'Digitale drukproef bij golfballen bedrukken: zo werkt het | MrGolfbal.nl',
  desc:'Wat is een digitale drukproef en waarom krijg je die altijd vooraf? Uitleg over het proces bij het bedrukken van golfballen: van aanvraag tot akkoord en productie.',
  h1:'De digitale drukproef: zo weet je vooraf hoe het eruitziet',
  body:`<p class="lead">Niemand wil een doos golfballen ontvangen waarvan het logo net iets anders staat dan bedoeld. Daarom ontvang je bij ons altijd eerst een digitale drukproef. Zo weet je precies wat je krijgt — vóórdat er ook maar één bal wordt bedrukt.</p>
  <h2>Wat is een digitale drukproef?</h2>
  <p>Een digitale drukproef is een visuele weergave van jouw logo of tekst op de gekozen golfbal. Je ziet de positie, de kleuren en de verhoudingen. Het is jouw laatste controlemoment: klopt de kleur, staat het logo goed, is de tekst correct gespeld?</p>
  <h2>Zo verloopt het proces</h2>
  <p>Je start met een aanvraag via de <a href="/golfballen-bedrukken/#configurator">configurator</a> of het <a href="/golfballen-bedrukken-voor-bedrijven/#offerte">offerteformulier</a>: je kiest merk, model en aantal en levert je logo of tekst aan. Vervolgens maken wij de digitale drukproef en sturen die naar je toe, samen met een offerte op maat. Pas ná jouw akkoord op de proef start de productie. Reken daarna op een levertijd van <strong>5 tot 15 werkdagen</strong>.</p>
  <h2>Waarom dit belangrijk is</h2>
  <p>Bedrukte golfballen zijn maatwerk. Een goede proef voorkomt teleurstellingen en zorgt dat het eindresultaat klopt met je verwachting. Het geeft ook ruimte om nog kleine dingen aan te passen: een kleur bijstellen, het logo iets verplaatsen of de tekst corrigeren.</p>
  <h2>Handig om te weten</h2>
  <p>De online preview in de configurator is <em>indicatief</em>: de definitieve positie, kleur en afmeting bevestigen we altijd in de digitale drukproef. Twijfel je over je aangeleverde bestand? Bekijk <a href="/kennisbank/logo-aanleveren-voor-golfballen-bedrukken/">hoe je je logo aanlevert</a>, of vraag het Mark.</p>` },

/* ---- MERKEN & MODELLEN ---- */
{ slug:'titleist-pro-v1-vs-pro-v1x', cat:'merken',
  title:'Titleist Pro V1 vs Pro V1x: welke laat je bedrukken? | MrGolfbal.nl',
  desc:'Pro V1 of Pro V1x om te laten bedrukken? Het verschil in gevoel, balvlucht en spin, en welke het beste past bij jouw golfers of als premium relatiegeschenk.',
  h1:'Titleist Pro V1 vs. Pro V1x: welke kies je?',
  body:`<p class="lead">De Pro V1 en Pro V1x zijn al jaren de meest gespeelde ballen op tour en een premium keuze om te laten bedrukken. Ze lijken op elkaar, maar spelen verschillend. Dit is het verschil in gewone taal.</p>
  <h2>Pro V1: zacht en penetrerend</h2>
  <p>De <a href="/products/titleist-pro-v1/">Pro V1</a> staat bekend om een zacht gevoel en een wat lagere, penetrerende balvlucht. Veel spelers kiezen 'm voor de controle en het gevoel rond de green. Een veelzijdige keuze die bij een brede groep golfers past.</p>
  <h2>Pro V1x: hoger en steviger</h2>
  <p>De <a href="/products/titleist-pro-v1x/">Pro V1x</a> vliegt wat hoger, voelt iets steviger en biedt doorgaans meer spin. Ideaal voor spelers die met hoogte aanvallen en maximale controle zoeken bij de langere ijzers.</p>
  <h2>Welke past bij jou?</h2>
  <p>Zoek je een allrounder met een zacht gevoel, dan is de Pro V1 een veilige keuze. Wil je juist hoogte en extra spin, kijk dan naar de Pro V1x. Voor een <a href="/golfballen-bedrukken-voor-bedrijven/">premium relatiegeschenk</a> maakt het spelverschil minder uit — beide stralen kwaliteit uit met jouw logo erop.</p>
  <h2>Twijfel je nog?</h2>
  <p>Doe de <a href="/golfbalkiezer/">golfbalkiezer</a> voor een advies op maat, of vergelijk alle modellen op de <a href="/titleist-golfballen-bedrukken/">Titleist bedrukken</a>-pagina. Beide modellen laten we bedrukken vanaf 144 stuks, altijd met een digitale drukproef vooraf.</p>` },

{ slug:'pinnacle-soft-vs-rush', cat:'merken',
  title:'Pinnacle Soft vs Rush: verschillen &amp; wanneer welke | MrGolfbal.nl',
  desc:'Pinnacle Soft of Pinnacle Rush laten bedrukken? De verschillen in gevoel en afstand, en welke bal het beste past bij golfdagen, toernooien en grote oplages.',
  h1:'Pinnacle Soft vs. Pinnacle Rush',
  body:`<p class="lead">Pinnacle is scherp geprijsd en heeft een groot, egaal oppervlak dat zich uitstekend leent voor bedrukking. Perfect wanneer je veel golfballen met logo nodig hebt. Maar kies je de Soft of de Rush?</p>
  <h2>Pinnacle Soft: zacht gevoel</h2>
  <p>De <a href="/products/pinnacle-soft-met-bedrukking/">Pinnacle Soft</a> biedt een zacht gevoel en een prettige feel bij de korte spelonderdelen. Populair voor golfdagen en relatiegeschenken waarbij je scherp geprijsde, verzorgde ballen wilt.</p>
  <h2>Pinnacle Rush: gericht op afstand</h2>
  <p>De <a href="/products/pinnacle-rush-met-bedrukking/">Pinnacle Rush</a> heeft een stevigere kern en is gebouwd voor extra afstand. Een prettige toernooibal die er met jouw logo netjes uitziet.</p>
  <h2>Wanneer welke?</h2>
  <p>Zoek je een zachte, allround bal voor een golfdag of als cadeau, kies dan de Soft. Wil je afstand en een steviger gevoel, bijvoorbeeld voor een <a href="/golfballen-bedrukken-voor-golfclubs-en-toernooien/">toernooi</a>, dan is de Rush een goede keuze. Beide zijn ideaal voor grotere oplages.</p>
  <h2>Meer weten?</h2>
  <p>Bekijk alle opties op de <a href="/pinnacle-golfballen-bedrukken/">Pinnacle bedrukken</a>-pagina, of gebruik de <a href="/golfbalkiezer/">golfbalkiezer</a> als je twijfelt tussen merken en modellen.</p>` },

/* ---- TOEPASSINGEN & INSPIRATIE ---- */
{ slug:'bedrukte-golfballen-als-relatiegeschenk', cat:'toepassingen',
  title:'Bedrukte golfballen als relatiegeschenk: waarom het werkt | MrGolfbal.nl',
  desc:'Waarom bedrukte golfballen een sterk relatiegeschenk zijn: functioneel, blijvend en persoonlijk. Tips voor merkkeuze, aantallen en aanpak voor golfende relaties.',
  h1:'Bedrukte golfballen als relatiegeschenk',
  body:`<p class="lead">Een relatiegeschenk werkt het best als het écht gebruikt wordt. Voor golfende klanten en relaties zijn bedrukte golfballen daarom een schot in de roos: functioneel, blijvend en met jouw logo op een plek die telt.</p>
  <h2>Waarom golfballen werken als cadeau</h2>
  <p>Golfballen worden gebruikt, keer op keer. Anders dan een pen of een blocnote verdwijnt een goede golfbal niet in een la — hij gaat mee de baan op. En elke keer dat je relatie afslaat, ziet hij of zij jouw logo. Zeker met een premium bal als de <a href="/products/titleist-pro-v1/">Titleist Pro V1</a> straal je kwaliteit en waardering uit.</p>
  <h2>Welke bal kies je?</h2>
  <p>Wil je maximale indruk maken, kies dan een toursbal zoals de Pro V1 of Pro V1x. Heb je een grotere groep of een scherper budget, dan is een <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> een uitstekende keuze. Twijfel je? De <a href="/golfbalkiezer/">golfbalkiezer</a> helpt je kiezen op basis van doelgroep en budget.</p>
  <h2>Aantallen en aanpak</h2>
  <p>De minimale afname is <strong>144 golfballen</strong>; grotere aantallen zijn voordeliger. Lever je logo aan, ontvang een digitale drukproef en na akkoord volgt de productie (levertijd 5–15 werkdagen). Zo weet je zeker dat het resultaat klopt vóór je bestelt.</p>
  <h2>Zakelijk regelen</h2>
  <p>Voor zakelijke bestellingen werk je met een offerte op maat. Vul het <a href="/golfballen-bedrukken-voor-bedrijven/#offerte">offerteformulier</a> in of lees meer op de pagina <a href="/golfballen-bedrukken-voor-bedrijven/">golfballen voor bedrijven</a>.</p>` },

{ slug:'golfballen-voor-je-bedrijfsgolfdag', cat:'toepassingen',
  title:'Golfballen voor je bedrijfsgolfdag: zo pak je het aan | MrGolfbal.nl',
  desc:'Een bedrijfsgolfdag organiseren? Zo kies je bedrukte golfballen met je bedrijfslogo: aantallen, timing, merkkeuze en een soepele aanpak van aanvraag tot levering.',
  h1:'Golfballen voor je bedrijfsgolfdag',
  body:`<p class="lead">Een bedrijfsgolfdag is bij uitstek het moment om je merk zichtbaar te maken. Bedrukte golfballen met je bedrijfslogo geven de dag een verzorgde, professionele uitstraling — en deelnemers nemen ze mee naar huis.</p>
  <h2>Bepaal je aantal</h2>
  <p>Reken uit hoeveel deelnemers je verwacht en hoeveel ballen je per persoon wilt geven (een sleeve van drie of een dozijn is gebruikelijk). De minimale afname is 144 golfballen; grotere aantallen zijn voordeliger. Bestel liever iets ruimer dan te krap.</p>
  <h2>Kies de juiste bal</h2>
  <p>Voor een premium beleving kies je een <a href="/titleist-golfballen-bedrukken/">Titleist</a>; voor grotere groepen tegen een scherpe prijs is een <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> ideaal. Niet zeker? De <a href="/golfbalkiezer/">golfbalkiezer</a> geeft een advies op maat.</p>
  <h2>Denk aan de timing</h2>
  <p>Houd rekening met de digitale drukproef én de productie. Na akkoord op de proef is de levertijd 5–15 werkdagen. Plan je aanvraag dus ruim vóór de golfdag, zeker in het drukke voorjaar en de zomer.</p>
  <h2>Zo vraag je aan</h2>
  <p>Vul het <a href="/golfballen-bedrukken-voor-bedrijven/#offerte">zakelijke offerteformulier</a> in met je gewenste merk, model, aantal en leverdatum, en upload je logo. Je ontvangt een offerte op maat en een drukproef. Meer inspiratie vind je op <a href="/golfballen-bedrukken-voor-bedrijven/">golfballen voor bedrijven</a>.</p>` },

/* ---- meer TECHNIEK ---- */
{ slug:'hoe-duurzaam-is-de-opdruk-op-een-golfbal', cat:'techniek',
  title:'Hoe duurzaam is de opdruk op een golfbal? | MrGolfbal.nl',
  desc:'Blijft een bedrukte golfbal er na een paar holes nog goed uitzien? Uitleg over de duurzaamheid van de opdruk, het verschil met een sticker en spelen met bedrukte ballen.',
  h1:'Hoe duurzaam is de opdruk op een bedrukte golfbal?',
  body:`<p class="lead">Een veelgestelde vraag: gaat het logo er niet meteen af als je de bal slaat? Hier lees je hoe de opdruk zich houdt en wat je ervan mag verwachten.</p>
  <h2>Geen sticker, maar een echte opdruk</h2>
  <p>De bedrukking wordt professioneel op de originele merkbal aangebracht — het is nadrukkelijk géén sticker. Daardoor houdt de opdruk normaal gebruik op de baan goed door.</p>
  <h2>Gewoon mee spelen</h2>
  <p>Je speelt met een bedrukte golfbal precies zoals met een onbedrukte: dezelfde bal, dezelfde eigenschappen, nu met jouw logo, naam of tekst. Voor de speeleigenschappen maakt de opdruk geen verschil.</p>
  <h2>Waar het van afhangt</h2>
  <p>Hoe lang een opdruk er strak uitziet, hangt onder meer af van hoe vaak de bal wordt gespeeld en onder welke omstandigheden. Voor relatiegeschenken en golfdagen — waar de bal vaak meer wordt gekoesterd dan versleten — blijft het resultaat lang mooi.</p>
  <p>Meer weten over de bedrukking zelf? Lees <a href="/kennisbank/hoeveel-kleuren-golfbal-bedrukken/">hoeveel kleuren je kunt bedrukken</a> of start direct in de <a href="/golfballen-bedrukken/#configurator">configurator</a>.</p>` },

{ slug:'golfballen-bedrukken-kleine-oplage', cat:'techniek',
  title:'Golfballen bedrukken in kleine oplage: de mogelijkheden | MrGolfbal.nl',
  desc:'Kun je golfballen ook in kleine oplage laten bedrukken? Uitleg over de minimale afname van 144 stuks, wanneer minder kan en hoe je een offerte op maat aanvraagt.',
  h1:'Golfballen bedrukken in kleine oplage',
  body:`<p class="lead">Niet iedereen heeft duizenden ballen nodig. Hoe zit het met kleinere aantallen bedrukte golfballen? Dit zijn de mogelijkheden.</p>
  <h2>Minimale afname</h2>
  <p>De minimale afname is <strong>144 golfballen</strong> (bijvoorbeeld 6 dozen van 24 of 12 dozijn). Dat is een bewuste ondergrens: bedrukken vraagt voorbereiding, een drukproef en insteltijd, en onder een bepaald aantal wordt dat per bal onevenredig duur.</p>
  <h2>En als je minder nodig hebt?</h2>
  <p>Heb je écht minder nodig? Neem dan <a href="/contact/">contact</a> op. Mark kijkt naar wat mogelijk is en denkt mee over een passende oplossing — soms is een net iets ander model of aantal de sleutel.</p>
  <h2>Grotere aantallen zijn voordeliger</h2>
  <p>Boven de 144 stuks wordt de prijs per bal gunstiger. Voor golfdagen, clubs en relatiegeschenken zit je met een grotere oplage dus vaak scherper. Je ontvangt altijd een offerte op maat.</p>
  <p>Bereken je aantal in de <a href="/golfballen-bedrukken/#configurator">configurator</a> of lees meer over <a href="/onbedrukte-golfballen/">onbedrukte golfballen in bulk</a>.</p>` },

{ slug:'hoeveel-golfballen-in-een-doos-of-dozijn', cat:'techniek',
  title:'Hoeveel golfballen zitten er in een doos of dozijn? | MrGolfbal.nl',
  desc:'Een dozijn, een sleeve, een doos — hoeveel golfballen zijn dat precies? Handige uitleg van de aantallen, zodat je makkelijk je bestelling en oplage inschat.',
  h1:'Hoeveel golfballen zitten er in een dozijn, sleeve of doos?',
  body:`<p class="lead">Golfballen worden in vaste eenheden verkocht. Even de aantallen op een rij, zodat je je bestelling makkelijk inschat.</p>
  <h2>De gangbare eenheden</h2>
  <p>Een <strong>sleeve</strong> bevat doorgaans 3 golfballen. Een <strong>dozijn</strong> is 12 golfballen (meestal 4 sleeves). Een <strong>doos</strong> kan variëren, maar bevat vaak meerdere dozijnen. Bij ons is de minimale afname <strong>144 golfballen</strong> — dat komt neer op 12 dozijn.</p>
  <h2>Handig bij het bestellen</h2>
  <p>Wil je bijvoorbeeld elke deelnemer van een golfdag een sleeve van 3 geven, dan reken je: aantal deelnemers × 3. Kom je daarmee onder de 144, dan bestel je iets ruimer of kies je voor een grotere gift per persoon.</p>
  <h2>Zelf berekenen</h2>
  <p>In de <a href="/golfballen-bedrukken/#configurator">configurator</a> zie je direct hoeveel dozijn jouw aantal is. Twijfel je over de juiste oplage voor een evenement? Lees <a href="/kennisbank/golfballen-voor-je-bedrijfsgolfdag/">golfballen voor je bedrijfsgolfdag</a>.</p>` },

/* ---- meer MERKEN & KOPEN ---- */
{ slug:'golfballen-kopen-waar-op-letten', cat:'merken',
  title:'Golfballen kopen: waar moet je op letten? | MrGolfbal.nl',
  desc:'Golfballen kopen maar niet zeker welke? Let op speelgevoel, balvlucht, spin, je niveau en budget. Praktische koopwijzer plus de optie om ze te laten bedrukken.',
  h1:'Golfballen kopen: waar moet je op letten?',
  body:`<p class="lead">De ene golfbal is de andere niet. Wil je golfballen kopen die echt bij je passen, let dan op een paar dingen. Deze koopwijzer helpt je kiezen.</p>
  <h2>Je niveau en spel</h2>
  <p>Beginnende en recreatieve spelers hebben vaak baat bij een zachte, vergevingsgezinde bal met een goede prijs-kwaliteitverhouding. Gevorderde spelers en lage handicaps kiezen doorgaans een toursbal met meer controle en spin, zoals de <a href="/products/titleist-pro-v1/">Titleist Pro V1</a>.</p>
  <h2>Gevoel, vlucht en spin</h2>
  <p>Let op drie dingen: het <strong>gevoel</strong> (zacht of stevig), de <strong>balvlucht</strong> (laag en penetrerend of juist hoog) en de <strong>spin</strong> rond de green. Een zachtere bal geeft meestal meer feel; een steviger bal vaak meer afstand.</p>
  <h2>Budget en aantal</h2>
  <p>Bepaal je budget per bal en hoeveel je nodig hebt. Voor grotere aantallen — bijvoorbeeld voor een club of bedrijf — is een <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> scherp geprijsd, terwijl <a href="/titleist-golfballen-bedrukken/">Titleist</a> de premium keuze is.</p>
  <h2>Meteen laten bedrukken</h2>
  <p>Koop je voor een bedrijf, club of als cadeau? Dan kun je je golfballen direct <a href="/golfballen-bedrukken/">laten bedrukken met je logo</a>. Niet zeker welke bal? Doe de <a href="/golfbalkiezer/">golfbalkiezer</a>.</p>` },

{ slug:'titleist-golfballen-kopen-en-bedrukken', cat:'merken',
  title:'Titleist golfballen kopen én laten bedrukken | MrGolfbal.nl',
  desc:'Titleist golfballen kopen en direct laten bedrukken met je logo? Overzicht van de modellen (Pro V1, Pro V1x, TruFeel, AVX) en voor wie ze geschikt zijn.',
  h1:'Titleist golfballen kopen én laten bedrukken',
  body:`<p class="lead">Titleist is het meest gespeelde balmerk op tour en een geliefde keuze om te kopen én te laten bedrukken. Dit is het overzicht van de modellen en voor wie ze passen.</p>
  <h2>De modellen op een rij</h2>
  <p>De <a href="/products/titleist-pro-v1/">Pro V1</a> en <a href="/products/titleist-pro-v1x/">Pro V1x</a> zijn de toursballen: premium, met veel controle. De <a href="/products/titleist-trufeel/">TruFeel</a> is extra zacht en toegankelijker geprijsd, en de <a href="/products/titleist-avx/">AVX</a> biedt een zacht gevoel met een lagere vlucht. Meer verschillen lees je in <a href="/kennisbank/titleist-pro-v1-vs-pro-v1x/">Pro V1 vs Pro V1x</a>.</p>
  <h2>Waarom Titleist als relatiegeschenk?</h2>
  <p>Een bedrukte Titleist straalt kwaliteit uit. Voor een <a href="/kennisbank/bedrukte-golfballen-als-relatiegeschenk/">premium relatiegeschenk</a> of een belangrijke klant maakt dat indruk — je geeft niet zomaar een bal, maar een bal met naam.</p>
  <h2>Kopen en bedrukken in één</h2>
  <p>Bij ons koop je originele Titleist-ballen en laat je ze desgewenst direct bedrukken met je logo, vanaf 144 stuks en altijd met een digitale drukproef vooraf. Bekijk alle opties op <a href="/titleist-golfballen-bedrukken/">Titleist golfballen bedrukken</a>.</p>` },

{ slug:'welke-golfbal-voor-beginner-gevorderd-lage-handicap', cat:'merken',
  title:'Welke golfbal past bij beginner, gevorderde of lage handicap? | MrGolfbal.nl',
  desc:'Welke golfbal past bij jouw niveau? Advies voor beginners, recreatieve en gevorderde spelers en lage handicaps — plus de golfbalkiezer voor een persoonlijk advies.',
  h1:'Welke golfbal past bij jouw niveau?',
  body:`<p class="lead">Je niveau bepaalt mee welke golfbal het prettigst speelt. Een korte gids per spelersgroep — zodat je gericht kiest.</p>
  <h2>Beginnend</h2>
  <p>Als beginner heb je baat bij een vergevingsgezinde, zachte bal met een goede prijs. Je verliest nog wel eens een bal, dus een scherp geprijsde <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> is een verstandige keuze.</p>
  <h2>Recreatief</h2>
  <p>Speel je regelmatig maar zonder scherpe ambities, dan is een zachte allroundbal ideaal — bijvoorbeeld een <a href="/products/titleist-trufeel/">Titleist TruFeel</a> of een Pinnacle Soft. Comfortabel gevoel, nette prestaties.</p>
  <h2>Gevorderd &amp; lage handicap</h2>
  <p>Speel je op een hoger niveau, dan wil je controle en spin: de toursballen <a href="/products/titleist-pro-v1/">Pro V1</a> en <a href="/products/titleist-pro-v1x/">Pro V1x</a> geven je precies dat. Kies de Pro V1 voor een wat lagere vlucht, de Pro V1x voor meer hoogte en spin.</p>
  <h2>Twijfel je?</h2>
  <p>Doe de <a href="/golfbalkiezer/">golfbalkiezer</a>: enkele vragen en je krijgt een advies op maat op basis van niveau, doel en budget.</p>` },

/* ---- meer TOEPASSINGEN ---- */
{ slug:'golfballen-met-clublogo-voor-je-golfclub', cat:'toepassingen',
  title:'Golfballen met clublogo voor je golfclub of shop | MrGolfbal.nl',
  desc:'Golfballen met clublogo voor de clubshop, ledenacties of als welkomstgeschenk. Zo pak je een bestelling met clublogo aan: merkkeuze, aantallen en drukproef.',
  h1:'Golfballen met clublogo voor je golfclub of shop',
  body:`<p class="lead">Golfballen met je eigen clublogo geven je club een verzorgde, herkenbare uitstraling — in de shop, bij ledenacties of als welkomstgeschenk voor nieuwe leden.</p>
  <h2>Waarvoor je ze inzet</h2>
  <p>Verkoop in de clubshop, een cadeau bij een nieuw lidmaatschap, prijzen bij wedstrijden of een presentje bij een clubevenement. Een bal met clublogo blijft in omloop en houdt je club zichtbaar.</p>
  <h2>Welke bal kies je?</h2>
  <p>Voor de shop is een herkenbaar merk fijn: een <a href="/titleist-golfballen-bedrukken/">Titleist</a> voor de premium klant, een <a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a> voor het scherpere segment. Zo bedien je verschillende leden.</p>
  <h2>Zo regel je het</h2>
  <p>Lever je clublogo aan (bij voorkeur als <a href="/kennisbank/logo-aanleveren-voor-golfballen-bedrukken/">vectorbestand</a>), ontvang een digitale drukproef en na akkoord volgt de productie. Vanaf 144 stuks; grotere aantallen zijn voordeliger. Meer op <a href="/golfballen-bedrukken-voor-golfclubs-en-toernooien/">voor golfclubs &amp; toernooien</a>.</p>` },

{ slug:'golfballen-voor-golftoernooi-of-sponsorwedstrijd', cat:'toepassingen',
  title:'Golfballen voor een golftoernooi of sponsorwedstrijd | MrGolfbal.nl',
  desc:'Bedrukte golfballen voor een golftoernooi, sponsorwedstrijd of charity-event. Met toernooi- of sponsorlogo, in de juiste aantallen en op tijd geleverd.',
  h1:'Golfballen voor een golftoernooi of sponsorwedstrijd',
  body:`<p class="lead">Een toernooi of sponsorwedstrijd is hét moment om een logo op de bal te zetten. Of het nu het toernooilogo of dat van de sponsor is: bedrukte golfballen maken de dag compleet.</p>
  <h2>Toernooi- of sponsorlogo</h2>
  <p>Je kunt kiezen voor het logo van het toernooi zelf, van de hoofdsponsor, of een combinatie. Voor een charity-event is een bal met het logo van het goede doel een mooi, tastbaar gebaar.</p>
  <h2>De juiste bal en oplage</h2>
  <p>Voor grote deelnemersvelden is een scherp geprijsde <a href="/products/pinnacle-rush-met-bedrukking/">Pinnacle Rush</a> ideaal; wil je een premium beleving, kies dan Titleist. Reken uit hoeveel ballen je per deelnemer geeft en bestel iets ruimer.</p>
  <h2>Denk aan de timing</h2>
  <p>Houd rekening met de drukproef en een levertijd van 5–15 werkdagen na akkoord. Plan je aanvraag dus ruim vóór het event. Vraag een <a href="/golfballen-bedrukken-voor-bedrijven/#offerte">offerte op maat</a> aan of lees meer op <a href="/golfballen-bedrukken-voor-golfclubs-en-toernooien/">voor clubs &amp; toernooien</a>.</p>` },
];

function kbArticlePage(a, lang='nl'){
  const cat = KB_CATS_L[lang][a.cat];
  const u = UI[lang], pre = pfx(lang);
  // EN-velden vallen terug op NL als vertaling ontbreekt.
  const e = lang==='en' ? (EN_KB[a.slug]||{}) : {};
  const title=e.title||a.title, desc=e.desc||a.desc, h1=e.h1||a.h1, body=e.body||a.body;
  return HEAD(title, desc, `/kennisbank/${a.slug}/`, lang,
    `<script type="application/ld+json">${JSON.stringify({
      '@context':'https://schema.org','@type':'Article',headline:h1,
      description:desc, articleSection:cat, about:cat, inLanguage: lang==='en'?'en-GB':'nl-NL',
      image:'https://mrgolfbal.nl/assets/img/og-home.jpg',
      author:{'@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional'},
      publisher:{'@id':'https://mrgolfbal.nl/#org'},
      mainEntityOfPage: SITE+pfx(lang)+`/kennisbank/${a.slug}/`
    })}</script>` +
    breadcrumbLD([{name:u.home,url:'/'},{name:u.fKennisbank,url:'/kennisbank/'},{name:h1,url:`/kennisbank/${a.slug}/`}], lang)) + HEADER(lang, `/kennisbank/${a.slug}/`) +
  `<div class="container"><nav class="crumbs"><a href="${pre}/">${u.home}</a> › <a href="${pre}/kennisbank/">${u.fKennisbank}</a> › <span>${cat}</span></nav></div>
  <article class="section" style="padding-top:1rem"><div class="container" style="max-width:820px">
    <p class="eyebrow">${cat}</p>
    <h1>${h1}</h1>
    <div class="kb-body">${localize(body, lang)}${localize((lang==='en' ? KB_EXTRA_EN[a.slug] : KB_EXTRA[a.slug]) || '', lang)}</div>
  </div></article>
  ${kbRelated(lang)}` + ballGallery(seedOf('kb-'+a.slug), lang) + socialsBlock(lang) + ctaBlock(lang, `/kennisbank/${a.slug}/`) + FOOTER(lang, `/kennisbank/${a.slug}/`);
}

function kbHubPage(lang='nl'){
  const u = UI[lang], pre = pfx(lang), cats = KB_CATS_L[lang];
  const enHub = lang==='en';
  const byCat = Object.keys(KB_CATS).map(catKey=>{
    const items = KB.filter(a=>a.cat===catKey);
    return `<section class="section" style="padding-block:2rem"><div class="container">
      <div class="section-head accent-line"><p class="eyebrow">${cats[catKey]}</p><h2>${cats[catKey]}</h2></div>
      <div class="grid grid-3" style="margin-top:1.2rem">
      ${items.map(a=>{ const e = enHub ? (EN_KB[a.slug]||{}) : {}; const h1=e.h1||a.h1, desc=e.desc||a.desc;
        return `<a class="card" href="${pre}/kennisbank/${a.slug}/" style="text-decoration:none"><div class="card__body"><span class="card__brand">${cats[a.cat]}</span><h3 class="card__title">${h1}</h3><p class="card__meta">${desc.split('.')[0]}.</p><span style="color:var(--blue-600);font-weight:600;margin-top:.4rem">${enHub?'Read more':'Lees meer'} →</span></div></a>`; }).join('')}
      </div></div></section>`;
  }).join('');
  const title = enHub ? 'Knowledge base — printing golf balls, brands &amp; applications | MrGolfbal.nl' : 'Kennisbank — golfballen bedrukken, merken &amp; toepassingen | MrGolfbal.nl';
  const desc = enHub ? 'The MrGolfbal.nl knowledge base: practical, in-depth articles about printing golf balls, brands and models (Titleist, Pinnacle) and applications such as corporate gifts and company golf days.' : 'De kennisbank van MrGolfbal.nl: praktische, diepgaande artikelen over golfballen bedrukken, merken en modellen (Titleist, Pinnacle) en toepassingen zoals relatiegeschenken en bedrijfsgolfdagen.';
  const hubEye = enHub ? 'Knowledge base' : 'Kennisbank';
  const hubH1 = enHub ? 'Everything about printing golf balls' : 'Alles over golfballen bedrukken';
  const hubSub = enHub ? 'Practical, honest articles about printing and technique, the differences between brands and models, and smart applications. Written from experience — with advice from PGA professional Mark Reynolds.' : 'Praktische, eerlijke artikelen over bedrukken en techniek, de verschillen tussen merken en modellen, en slimme toepassingen. Geschreven vanuit de praktijk — met advies van PGA-professional Mark Reynolds.';
  return HEAD(title, desc, '/kennisbank/', lang,
    breadcrumbLD([{name:u.home,url:'/'},{name:u.fKennisbank,url:'/kennisbank/'}], lang)) + HEADER(lang, '/kennisbank/') +
  `<div class="container"><nav class="crumbs"><a href="${pre}/">${u.home}</a> › <span>${u.fKennisbank}</span></nav></div>
  <section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3rem)">
    <div class="hero-copy" style="max-width:none"><p class="eyebrow">${hubEye}</p><h1>${hubH1}</h1>
    <p>${hubSub}</p></div>
    <div class="hero-visual"><div class="ballshot"><div class="ball"><span class="logo-print">${u.jouw}<br><span>${u.logo}</span></span></div></div></div>
  </div></section>
  ${byCat}` + ballGallery(seedOf('kennisbank-hub'), lang) + socialsBlock(lang) + ctaBlock(lang, '/kennisbank/') + FOOTER(lang, '/kennisbank/');
}

for (const lang of LANGS) {
  const base = lang==='en' ? join(root,'en','kennisbank') : join(root,'kennisbank');
  writeFileSync2(join(base,'index.html'), kbHubPage(lang));
  for (const a of KB){ writeFileSync2(join(base,a.slug,'index.html'), kbArticlePage(a, lang)); }
  console.log('generated '+(lang==='en'?'/en':'')+'/kennisbank/ + '+KB.length+' articles');
}
console.log('TOTAL', KB.length, 'kennisbank articles + hub (NL+EN)');

/* =================== TOEPASSINGEN (data-driven landingspagina's) =================== */
const toepBallCards = (handles, lang) => {
  const p = pfx(lang);
  const cards = (handles||[]).map(h => PRODUCTS.find(x=>x.handle===h)).filter(Boolean).slice(0,3);
  if (!cards.length) return '';
  const head = lang==='en' ? 'Recommended golf balls for this' : 'Aanbevolen golfballen hiervoor';
  const view = lang==='en' ? 'View &amp; print' : 'Bekijk &amp; bedruk';
  return `<section class="section"><div class="container"><div class="section-head accent-line"><p class="eyebrow">${lang==='en'?'Ball advice':'Baladvies'}</p><h2>${head}</h2></div>
    <div class="grid grid-3" style="margin-top:1.4rem">
    ${cards.map(x=>`<article class="card"><div class="card__body"><span class="card__brand">${x.brand}</span><h3 class="card__title">${x.name}</h3><p class="card__meta">${pf(x,lang,'feel')} · ${pf(x,lang,'flight')} · ${pf(x,lang,'target')}</p><a class="btn btn--primary btn--block" href="${p}/products/${x.handle}/">${view}</a></div></article>`).join('')}
    </div></div></section>`;
};
const toepRelated = (related, lang) => {
  const p = pfx(lang);
  const items = (related||[]).map(s => TOEPASSINGEN.find(t=>t.slug===s)).filter(Boolean);
  if (!items.length) return '';
  const head = lang==='en' ? 'Related applications' : 'Gerelateerde toepassingen';
  return `<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">${lang==='en'?'Keep exploring':'Verder kijken'}</p><h2>${head}</h2></div>
    <div class="linkchips" style="margin-top:1rem">
    ${items.map(t=>`<a href="${p}/toepassingen/${t.slug}/">${ico(t.ico,'ico-svg')} ${t[lang].name}</a>`).join('')}
    <a href="${p}/toepassingen/">${lang==='en'?'All applications':'Alle toepassingen'} →</a>
    </div></div></section>`;
};
const toepassingPage = (t, lang='nl') => {
  const c = t[lang], u = UI[lang], p = pfx(lang);
  const sectionsHtml = (c.sections||[]).map(s=>`<h2>${s.h}</h2>${s.html}`).join('');
  return HEAD(c.metaTitle, c.metaDesc, `/toepassingen/${t.slug}/`, lang,
    breadcrumbLD([{name:u.home,url:'/'},{name:u.toepHub,url:'/toepassingen/'},{name:c.crumb||c.name,url:`/toepassingen/${t.slug}/`}], lang)
  ) + HEADER(lang, `/toepassingen/${t.slug}/`) +
  `<div class="container"><nav class="crumbs"><a href="${p}/">${u.home}</a> › <a href="${p}/toepassingen/">${u.toepHub}</a> › <span>${c.crumb||c.name}</span></nav></div>
  <section class="pillar-hero"><div class="container" style="padding-block:clamp(2.4rem,5vw,4rem)">
    <p class="eyebrow">${c.eyebrow}</p><h1>${c.h1}</h1><p>${c.lead}</p>
    <div class="hero-cta" style="margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.startCta} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="${p}/contact/">${u.heroAdvice}</a></div>
  </div></section>
  <section class="section"><div class="container"><div class="prose">${localize(c.intro||'', lang)}${localize(sectionsHtml, lang)}</div></div></section>
  ${extraSections(t.slug, lang)}
  ${toepBallCards(t.balls, lang)}
  ${howItWorks(lang)}
  ${whyUs(lang)}
  ${faqBlock((c.faq||[]).map(([q,a])=>[q, localize(a, lang)]), lang)}
  ${toepRelated(t.related, lang)}` + ballGallery(seedOf('toep-'+t.slug), lang) + reviewsBlock(lang) + socialsBlock(lang) + ctaBlock(lang, `/toepassingen/${t.slug}/`) + FOOTER(lang, `/toepassingen/${t.slug}/`);
};
const toepHubPage = (lang='nl') => {
  const u = UI[lang], p = pfx(lang), en = lang==='en';
  const metaTitle = en ? 'Applications — printed golf balls for every occasion | MrGolfbal.nl' : 'Toepassingen — bedrukte golfballen voor elke gelegenheid | MrGolfbal.nl';
  const metaDesc = en ? 'Printed golf balls for company golf days, events, corporate gifts, goodie bags, tournaments and more. Discover the ideal application for your logo golf balls.' : 'Bedrukte golfballen voor bedrijfsgolfdagen, events, relatiegeschenken, goodiebags, toernooien en meer. Ontdek de ideale toepassing voor jouw golfballen met logo.';
  const eyebrow = en ? 'Applications' : 'Toepassingen';
  const h1 = en ? 'Printed golf balls for <span>every occasion</span>' : 'Bedrukte golfballen voor <span>elke gelegenheid</span>';
  const lead = en ? 'From company golf days to events, corporate gifts and tournaments — find the application that fits your goal and see which golf ball works best.' : 'Van bedrijfsgolfdagen tot events, relatiegeschenken en toernooien — vind de toepassing die bij jouw doel past en zie welke golfbal het beste werkt.';
  const cards = TOEPASSINGEN.map(t=>`<a class="toep-card" href="${p}/toepassingen/${t.slug}/"><div class="ico">${ico(t.ico)}</div><div><h3>${t[lang].name}</h3><p>${(t[lang].metaDesc||'').split('.')[0]}.</p><span class="go">${en?'Read more':'Lees meer'} →</span></div></a>`).join('');
  return HEAD(metaTitle, metaDesc, '/toepassingen/', lang,
    breadcrumbLD([{name:u.home,url:'/'},{name:u.toepHub,url:'/toepassingen/'}], lang)
  ) + HEADER(lang, '/toepassingen/') +
  `<div class="container"><nav class="crumbs"><a href="${p}/">${u.home}</a> › <span>${u.toepHub}</span></nav></div>
  <section class="pillar-hero"><div class="container" style="padding-block:clamp(2.4rem,5vw,4rem)">
    <p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p>${lead}</p></div></section>
  <section class="section"><div class="container">
    <div class="section-head center"><p class="eyebrow">${ico('target','ico-inline')} ${lang==='en'?'Pick your use':'Kies je toepassing'}</p><h2>${lang==='en'?'All applications at a glance':'Alle toepassingen op een rij'}</h2></div>
    <div class="toep-grid">${cards}</div></div></section>
  <section class="section section--sky"><div class="container"><div class="prose">
    ${lang==='en' ? `<h2>How to pick the right application</h2>
    <p>The same printed ball behaves very differently depending on the occasion. A gift handed over one to one may carry a detailed design, because the recipient looks at it from close up and keeps it. A ball that ends up in a goodie bag among two hundred others has to work at a glance, which usually means a simpler mark and stronger contrast.</p>
    <p>Quantity is the second thing that decides the direction. Printing starts at 144 balls, and every separate print counts as its own run. If several sponsors want their own logo, plan the split before you order rather than afterwards. Larger volumes bring the price per ball down, which is why a club buying stock for the season lands in a different place from a company ordering one box for a single afternoon.</p>
    <p>The third question is who plays them. A field of mixed handicaps is better served by a soft, keenly priced ball than by a tour model, however flattering the latter looks in the box. If you are unsure, work through the <a href="/golfbalkiezer/">golf ball finder</a> or simply describe your day via <a href="/contact/">contact</a> and you will get a recommendation rather than a catalogue.</p>`
    : `<h2>Zo kies je de juiste toepassing</h2>
    <p>Dezelfde bedrukte bal doet iets heel anders, afhankelijk van de gelegenheid. Een cadeau dat je persoonlijk overhandigt, mag een gedetailleerd ontwerp dragen: de ontvanger bekijkt hem van dichtbij en bewaart hem. Een bal die tussen tweehonderd andere in een goodiebag verdwijnt, moet het in één oogopslag doen — en dat betekent meestal een eenvoudiger merkteken en meer contrast.</p>
    <p>Het aantal bepaalt de tweede helft van de richting. Bedrukken start bij 144 ballen, en elke afzonderlijke opdruk telt als een eigen oplage. Willen meerdere sponsors hun eigen logo, verdeel de oplage dan vóór je bestelt in plaats van erna. Bij grotere aantallen daalt de prijs per bal, waardoor een club die voorraad inkoopt voor het seizoen op een ander punt uitkomt dan een bedrijf dat één doos bestelt voor één middag.</p>
    <p>De derde vraag is wie ze speelt. Een veld met gemengde handicaps is beter af met een zachte, scherp geprijsde bal dan met een toursmodel, hoe mooi dat laatste in de doos ook oogt. Twijfel je, doorloop dan de <a href="/golfbalkiezer/">golfbalkiezer</a> of beschrijf je dag gewoon via <a href="/contact/">contact</a> — je krijgt een advies terug, geen catalogus.</p>`}
  </div></div></section>
  ${whyUs(lang)}${howItWorks(lang)}` + ballGallery(seedOf('toepassingen-hub'), lang) + reviewsBlock(lang) + socialsBlock(lang) + ctaBlock(lang, '/toepassingen/') + FOOTER(lang, '/toepassingen/');
};
for (const lang of LANGS) {
  const base = lang==='en' ? join(root,'en','toepassingen') : join(root,'toepassingen');
  writeFileSync2(join(base,'index.html'), toepHubPage(lang));
  for (const t of TOEPASSINGEN){ writeFileSync2(join(base,t.slug,'index.html'), toepassingPage(t, lang)); }
  console.log('generated '+(lang==='en'?'/en':'')+'/toepassingen/ + '+TOEPASSINGEN.length+' pages');
}
console.log('TOTAL', TOEPASSINGEN.length, 'toepassingen + hub (NL+EN)');



/* =================== STICKY CTA + FOTOSTRIP =================== */

// Fotostrip met echte foto's van Mark; per pagina een andere volgorde.
const MARK_STRIP = [
  { file:'mark-drive.jpg', nl:'Mark Reynolds slaat af met de driver tijdens een toernooi', en:'Mark Reynolds hitting a drive during a tournament' },
  { file:'mark-putt-klm-open.jpg', nl:'Mark Reynolds put op de green tijdens het KLM Open', en:'Mark Reynolds putting on the green at the KLM Open' },
  { file:'mark-golfbag-klm.jpg', nl:'Mark Reynolds bij zijn Titleist-golfbag op het KLM Open', en:'Mark Reynolds beside his Titleist golf bag at the KLM Open' },
  { dir:'show', file:'trickshow-tee-op-persoon.jpg', nl:'Mark Reynolds slaat tijdens een golf trickshow een bal van een tee die een vrijwilliger vasthoudt', en:'Mark Reynolds hitting a ball off a tee held by a volunteer during a golf trick show' },
  { dir:'show', file:'trickshow-range-publiek.jpg', nl:'Mark Reynolds geeft een golfshow op de driving range voor publiek', en:'Mark Reynolds performing a golf show on the driving range in front of an audience' },
  { dir:'show', file:'trickshow-swing-publiek.jpg', nl:'Mark Reynolds midden in de swing tijdens een trickshow, met toeschouwers vlak achter de afzetting', en:'Mark Reynolds mid-swing during a trick show, with spectators right behind the barrier' },
  { dir:'show', file:'trickshow-buiten-gezelschap.jpg', nl:'Mark Reynolds slaat af tijdens een golfshow op een event, omringd door genodigden', en:'Mark Reynolds teeing off during a golf show at an event, surrounded by guests' },
  { dir:'show', file:'trickshow-demonstratie.jpg', nl:'Golfdemonstratie voor een groep toeschouwers langs de afslagplaats', en:'Golf demonstration for a group of spectators alongside the teeing area' },
  { dir:'show', file:'trickshow-luchtfoto-publiek.jpg', nl:'Publiek in een kring rond de afslagplaats tijdens een golfshow, van bovenaf gezien', en:'Spectators gathered in a circle around the tee during a golf show, seen from above' },
  { dir:'show', file:'clinic-kinderen.jpg', nl:'Mark Reynolds geeft een golfclinic aan kinderen op de driving range', en:'Mark Reynolds giving a golf clinic to children on the driving range' },
  { dir:'show', file:'groep-golfers-baan.jpg', nl:'Groep golfers klaar voor de start van een golfdag op de baan', en:'A group of golfers ready to start a golf day on the course' },
  { dir:'show', file:'mark-caddie-toernooi.jpg', nl:'Mark Reynolds loopt met zijn caddie over de baan tijdens een toernooi', en:'Mark Reynolds walking the course with his caddie during a tournament' },
  { dir:'show', file:'mark-trofee-selfie.jpg', nl:'Mark Reynolds met een gewonnen trofee', en:'Mark Reynolds holding a trophy he won' },
  { dir:'trips', file:'marbella-bergbaan.jpg', nl:'Golfbaan in de heuvels bij Marbella aan de Costa del Sol', en:'Golf course in the hills near Marbella on the Costa del Sol' },
  { dir:'trips', file:'dubai-skyline-baan.jpg', nl:'Golfbaan in Dubai met de skyline van de stad op de achtergrond', en:'Golf course in Dubai with the city skyline behind it' },
  { dir:'trips', file:'luchtfoto-green.jpg', nl:'Luchtfoto van een green omringd door bunkers', en:'Aerial view of a green surrounded by bunkers' },
  { dir:'trips', file:'baan-zonsondergang.jpg', nl:'Golfbaan bij zonsondergang', en:'Golf course at sunset' },
];
const markStrip = (seed=0, lang='nl', n=3, exclude=[]) => {
  const en = lang==='en';
  // geen enkele foto twee keer op dezelfde pagina
  const pool = MARK_STRIP.filter(m => !exclude.includes(m.file));
  const picks = Array.from({length:Math.min(n, pool.length)}, (_,i)=> pool[(seed+i)%pool.length]);
  return `<section class="section markstrip-sec"><div class="container">
    <div class="section-head center"><p class="eyebrow">${en?'On the course':'Op de baan'}</p><h2>${en?'Mark Reynolds in action':'Mark Reynolds in actie'}</h2></div>
    <div class="markstrip">${picks.map(m=>`<figure><img src="/assets/img/${m.dir||'mark'}/${m.file}" width="1400" height="900" loading="lazy" decoding="async" alt="${m[lang]}"><figcaption>${m[lang]}</figcaption></figure>`).join('')}</div>
  </div></section>`;
};

/* =================== DIENSTEN, REFERENTIES, TEAM & PARTNERS =================== */
// Alle diensten van Mark Reynolds in één scanbaar raster.
const SERVICES = [
  { ico:'spark',  href:'/golfshows/',                        nl:['Trickshow','Een live golf trickshow vol precisie, humor en publiek dat meedoet.'],                    en:['Trick show','A live golf trick show full of precision, humour and audience participation.'] },
  { ico:'target', href:'/golfshows/', hrefNl:'/golfshows/toepassingen/bedrijfsevent/', nl:['Beat the pro','Daag Mark uit op de baan of op een afgezette hole — dichtst bij de pin wint.'], en:['Beat the pro','Take on Mark on the course or a closed hole — nearest the pin wins.'] },
  { ico:'camera', href:'/contact/',                          nl:['Fotografie','Beeld van je golfdag of event, klaar voor je eigen kanalen.'],                          en:['Photography','Images of your golf day or event, ready for your own channels.'] },
  { ico:'gift',   href:'/golfballen-bedrukken/',             nl:['Merchandise','Bedrukte golfballen, tees en accessoires met je eigen logo of tekst.'],                 en:['Merchandise','Printed golf balls, tees and accessories with your own logo or text.'] },
  { ico:'truck',  href:'/contact/',                          nl:['Caddie & chauffeur','Mark als caddie of chauffeur tijdens je golfdag — advies bij elke slag.'],       en:['Caddie & chauffeur','Mark as your caddie or driver during your golf day — advice on every shot.'] },
  { ico:'chat',   href:'/contact/',                          nl:['Motivational speaker','Een verhaal over toppresteren, tegenslag en focus, met golf als rode draad.'], en:['Motivational speaker','A talk on performing, setbacks and focus, with golf as the thread.'] },
  { ico:'flag',   href:'/golfles/',                          nl:['Clinic','Een clinic waarin je gasten in kleine groepen zelf leren slaan.'],                          en:['Clinic','A clinic where your guests learn to hit in small groups.'] },
];
const servicesBlock = (lang='nl') => { const p = pfx(lang), en = lang==='en';
  return `<section class="section section--sky" id="diensten"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('star','ico-inline')} ${en?'Services':'Diensten'}</p>
    <h2>${en?'Unforgettable golf entertainment with Mark Reynolds':'Onvergetelijk golfentertainment met Mark Reynolds'}</h2>
    <p class="lead center">${en?'Make your golf event truly special with Mark’s incredible skills and engaging activities — from a full trick show to a clinic, a caddie for the day or a talk on stage.':'Maak van je golfevent iets bijzonders met het vakmanschap van Mark en activiteiten waar gasten aan meedoen — van een volledige trickshow tot een clinic, een caddie voor de dag of een verhaal op het podium.'}</p></div>
  <div class="svcgrid">${SERVICES.map(s=>`<a class="svccard" href="${p}${(lang==='nl' && s.hrefNl) ? s.hrefNl : s.href}"><span class="svccard__ico">${ico(s.ico,'')}</span><h3>${s[lang][0]}</h3><p>${s[lang][1]}</p></a>`).join('')}</div>
</div></section>`; };

// Echte, met naam ondertekende referenties zoals aangeleverd door Mark.
const TESTIMONIALS = [
  { q:'Next to the tricks, Mark is a great entertainer and is capable of creating an overwhelming atmosphere during his performance. I can recommend Mark not only as a golf pro but as well for his trick shows.', by:'Wim Iserief', role:'CCM KLM / Air France', lang:'en' },
  { q:'Ik heb zojuist met heel veel plezier je nieuwe website en je nieuwe trickshow trailer bekeken. De show was al een fantastische combinatie van talent, balgevoel en humor. In de trailer zag ik een aantal nieuwe tricks die ik graag heel snel kom bekijken. Leuk ook dat je Twitter en Facebook gebruikt als nieuwe media. Ik ben er trots op dat ik je (kleine) sponsor ben!', by:'Joost Hembrecht', role:'Directeur Florius', lang:'nl' },
  { q:'Mark has the gift of entertaining a small or big audience with spectacular golf shots while being funny for both children as grown-up’s. If your company, golfclub or group of friends want to have a laugh and see what can be done with a golfclub, Mark Reynolds is your guy!', by:'Sepp Koster', role:'Managing Director, Blue Bay Curaçao Golf & Beach Resort', lang:'en' },
  { q:'De trickshow van Mark Reynolds is van uitzonderlijke klasse! Het is ongelooflijk wat hij met een golfbal kan. Veel van de tricks hebben een zeer hoge moeilijkheidsgraad. Daarnaast is Mark een enorme entertainer. Het customer event dat Interoute organiseerde was daarmee een groot succes, waarbij alle klanten van Interoute enorm genoten hebben van de trickshow van Mark Reynolds.', by:'Johan van Rijn', role:'Marketing Manager Benelux, Interoute', lang:'nl' },
];
const testimonialsBlock = (lang='nl') => { const en = lang==='en';
  return `<section class="section"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('star','ico-inline')} ${en?'References':'Referenties'}</p>
    <h2>${en?'What people say about the show':'Wat men over de show zegt'}</h2></div>
  <div class="quotegrid">${TESTIMONIALS.map(t=>`<figure class="quotecard"><span class="quotecard__mark" aria-hidden="true">”</span>
    <blockquote${t.lang!==lang?` lang="${t.lang}"`:''}><p>${t.q}</p></blockquote>
    <figcaption><b>${t.by}</b><span>${t.role}</span></figcaption></figure>`).join('')}</div>
</div></section>`; };

/* Algarve AM AM — rolt na juli automatisch door naar de volgende editie.
   Het jaartal wordt bij het bouwen gezet én in de browser bijgewerkt, zodat de
   pagina ook zonder nieuwe build actueel blijft. */
const amamYear = (d = new Date()) => d.getFullYear() + (d.getMonth() >= 7 ? 1 : 0);
const amamBlock = (lang='nl') => { const p = pfx(lang), en = lang==='en', y = amamYear();
  return `<section class="section amam"><div class="container amam__in">
    <figure class="amam__photo"><img src="/assets/img/trips/algarve-kustbaan.jpg" width="1600" height="1067" loading="lazy" decoding="async" alt="${en?'Golf course on the Algarve coast, the setting for the Algarve AM AM':'Golfbaan aan de kust van de Algarve, de omgeving van de Algarve AM AM'}"></figure>
    <div class="amam__txt">
      <p class="eyebrow">${ico('trophy','ico-inline')} ${en?'Upcoming golf trip':'Aankomende golfreis'}</p>
      <h2>${en?'Join the Algarve AM AM' : 'Doe mee met de Algarve AM AM'} <span data-amam-year>${y}</span> ${en?'at Monte Rei, Portugal':'op Monte Rei, Portugal'}</h2>
      <p>${en?`Play one of Europe’s finest golf courses and enjoy a memorable team tournament in the stunning Algarve. Places are limited — secure yours in time.`:`Speel op een van de mooiste golfbanen van Europa en beleef een teamtoernooi om niet te vergeten in de Algarve. Het aantal plaatsen is beperkt, dus wees op tijd.`}</p>
      <div class="hero-cta"><a class="btn btn--primary btn--lg" href="${en ? '/en/golftrips/' : '/golftrips/algarve-monte-rei/'}">${ico('pin','btn__ico')}${en?'View the trip':'Bekijk de reis'} <span class="btn__arrow">→</span></a>
      ${waBtn(lang, 'light', en?'Ask about availability':'Vraag naar beschikbaarheid')}</div>
    </div>
  </div></section>`; };

// The Team Behind The Pro — alleen rollen, geen verzonnen namen.
const teamBlock = (lang='nl') => { const en = lang==='en';
  const roles = en ? [
    ['users','Mark Reynolds','PGA Golf Professional since 1995. On the range, on stage and on the road — the face and the hands behind everything on this site.'],
    ['ball','Printing & production','The people who turn your logo into a clean print on an original Titleist or Pinnacle, from digital proof to delivery.'],
    ['camera','Show & event crew','The crew that sets up the show, keeps the playing zone safe and captures the day on camera.'],
    ['pin','Travel & logistics','The partners who arrange tee times, transfers and accommodation so a golf trip simply runs.'],
  ] : [
    ['users','Mark Reynolds','PGA Golf Professional sinds 1995. Op de range, op het podium en onderweg — het gezicht en de handen achter alles op deze site.'],
    ['ball','Bedrukken & productie','De mensen die je logo omzetten in een strakke bedrukking op een originele Titleist of Pinnacle, van drukproef tot levering.'],
    ['camera','Show- en eventcrew','De crew die de show opbouwt, de speelzone veilig houdt en de dag vastlegt op beeld.'],
    ['pin','Reizen & logistiek','De partners die tee-times, transfers en verblijf regelen, zodat een golfreis gewoon loopt.'],
  ];
  return `<section class="section section--sky"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('users','ico-inline')} ${en?'Behind the scenes':'Achter de schermen'}</p>
    <h2>${en?'The team behind the pro':'The Team Behind The Pro'}</h2>
    <p class="lead center">${en?'Mark stands in front, but he is never alone. A small team keeps the printing, the shows and the trips running.':'Mark staat vooraan, maar hij staat er nooit alleen voor. Een klein team zorgt dat het bedrukken, de shows en de reizen lopen.'}</p></div>
  <div class="teamgrid">${roles.map(([i,h,t])=>`<article class="teamcard"><span class="teamcard__ico">${ico(i,'')}</span><h3>${h}</h3><p>${t}</p></article>`).join('')}</div>
</div></section>`; };

// Sponsors & partners — logowand.
const PARTNERS = [
  ['wealth-management-partners.png','Wealth Management Partners'],
  ['base-logistics.png','Base Logistics'],
  ['laketown.png','Laketown'],
  ['max-golf-protein.png','MAX GOLF PROTEIN'],
  ['titleist.png','Titleist'],
  ['j-lindeberg.png','J.Lindeberg'],
  ['druh.png','DRUH'],
  ['hiltermann-lease.png','Hiltermann Lease'],
  ['kaddey.png','Kaddey'],
];
const partnersBlock = (lang='nl') => { const en = lang==='en', p = pfx(lang);
  return `<section class="section partners"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('handshake','ico-inline')} ${en?'Sponsors & partners':'Sponsors & partners'}</p>
    <h2>${en?'Sponsors & partners':'Sponsors & partners'}</h2>
    <p class="lead center">${en?'The brands and companies Mark works with, on and off the course.':'De merken en bedrijven waarmee Mark samenwerkt, op en naast de baan.'}</p></div>
  <ul class="logowall">${PARTNERS.map(([f,n])=>`<li><img src="/assets/img/partners/${f}" alt="${en?'Logo of':'Logo van'} ${n}" loading="lazy" decoding="async"></li>`).join('')}
    <li class="logowall__cta"><a href="${p}/contact/">${ico('handshake','')}<b>${en?'Your logo here?':'Jouw logo hier?'}</b><span>${en?'Sponsor Mark Reynolds':'Sponsor Mark Reynolds'}</span></a></li>
  </ul>
</div></section>`; };

/* =================== GOLFSHOW-TOEPASSINGEN (inzet per gelegenheid) =================== */
// Raster met alle gelegenheden waarvoor de golf trickshow geboekt wordt.
const gsToepGrid = (currentSlug='', title=true) => `<section class="section"><div class="container">
  ${title ? `<div class="section-head center"><p class="eyebrow">${ico('spark','ico-inline')} Toepassingen</p><h2>Waarvoor wordt de golfshow geboekt?</h2><p class="lead center">Van merkactivatie tot clubjubileum: elke gelegenheid vraagt een eigen opzet. Kies je situatie voor de mogelijkheden, de praktische kant en veelgestelde vragen.</p></div>` : ''}
  <div class="toepgrid">${GS_TOEPASSINGEN.filter(t=>t.slug!==currentSlug).map(t=>
    `<a class="toepgrid__item" href="/golfshows/toepassingen/${t.slug}/">${ico(t.ico,'ico-svg')}<span>${t.name}</span></a>`).join('')}</div>
</div></section>`;

/* =================== LOCATIEPAGINA'S (golfshows per regio) =================== */
const locGrid = (currentSlug='', title=true) => `<section class="section section--sky"><div class="container">
  ${title ? `<div class="section-head center"><p class="eyebrow">Heel Nederland</p><h2>Golfshow boeken in jouw regio</h2><p class="lead center">Kies je regio voor de mogelijkheden ter plaatse.</p></div>` : ''}
  <div class="locgrid">${LOCATIES.filter(l=>l.slug!==currentSlug).map(l=>
    `<a class="locgrid__item" href="/golfshows/${l.slug}/">${ico('target','ico-svg')}<span>${l.name}</span></a>`).join('')}</div>
</div></section>`;


// Feitelijk overzicht van golfclubs in de provincie. Alleen "deze clubs liggen
// hier" — nadrukkelijk geen claim over optredens of samenwerking.
const clubBlock = (slug, naam) => {
  const clubs = GOLFCLUBS[slug];
  if (!clubs || !clubs.length) return '';
  return `<section class="section section--sky"><div class="container">
    <div class="section-head center"><p class="eyebrow">${ico('flag','ico-inline')} Banen in de provincie</p>
      <h2>Golfclubs in ${naam}</h2>
      <p class="lead center">${naam} telt onder meer deze golfclubs. Speelt jouw club of je event op een van deze banen — of ergens anders in de provincie — dan is de golfshow daar te boeken.</p></div>
    <ul class="clublist">${clubs.map(([c,plaats])=>`<li>${ico('pin','')}<span><b>${c}</b><small>${plaats}</small></span></li>`).join('')}</ul>
    <p class="clublist__note">Bovenstaande clubs zijn genoemd als golfbanen die in ${naam} liggen. Dat is geen aanduiding van een samenwerking of eerder optreden.</p>
  </div></section>`;
};

const locationPage = (loc) => {
  const u = UI.nl, seed = seedOf('loc-'+loc.slug);
  const ld = {'@context':'https://schema.org','@type':'Service',serviceType:'Golfshow / golf trickshow',
    provider:{'@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional','@id':'https://mrgolfbal.nl/over-mark/#person'},
    areaServed:{'@type':'Place',name:loc.name},
    url:`https://mrgolfbal.nl/golfshows/${loc.slug}/`, name:loc.title.split(' | ')[0], description:loc.desc};
  return HEAD(loc.title, loc.desc, `/golfshows/${loc.slug}/`, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Golfshows',url:'/golfshows/'},{name:loc.name,url:`/golfshows/${loc.slug}/`}], 'nl')
    + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`, true)
  + HEADER('nl', `/golfshows/${loc.slug}/`, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <a href="/golfshows/">Golfshows</a> › <span>${loc.name}</span></nav></div>
  <section class="loc-hero"><div class="container">
    <p class="eyebrow">Golfshow · ${loc.name}</p>
    <h1>${loc.h1}</h1>
    <p class="loc-hero__lead">${loc.lead}</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="/contact/">${ico('chat','btn__ico')}Vraag beschikbaarheid aan <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="/golfshows/">Bekijk de golfshow</a></div>
  </div></section>
  ${loc.main}
  ${loc.kind === 'provincie' ? clubBlock(loc.slug, loc.name) : ''}
  ${markStrip(seed, 'nl')}
  ${markCred('nl')}
  ${faqBlock(loc.faq, 'nl')}
  <section class="section"><div class="container"><div class="divider-cta">
    <p class="eyebrow" style="color:var(--color-blue)">Boek nu</p><h2>Golfshow boeken in ${loc.name}</h2>
    <p>Vertel kort waar en wanneer je event plaatsvindt en hoeveel gasten je verwacht. Je krijgt een voorstel op maat; prijs en beschikbaarheid op aanvraag.</p>
    <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="/contact/">Neem contact op →</a><a class="btn btn--light btn--lg" href="tel:+31627411925">Bel Mark</a></div>
  </div></div></section>
  ${locGrid(loc.slug)}
  ${gsToepGrid('', true)}`
  + testimonialsBlock('nl') + ballGallery(seed, 'nl') + socialsBlock('nl') + FOOTER('nl', `/golfshows/${loc.slug}/`, `Golfshow boeken in ${loc.name}?`);
};
for (const loc of LOCATIES) writeFileSync2(join(root, 'golfshows', loc.slug, 'index.html'), locationPage(loc));
console.log('generated ' + LOCATIES.length + ' golfshow-locatiepaginas: ' + LOCATIES.map(l=>l.slug).join(', '));

// Unieke landingspagina per gelegenheid: eigen tekst, FAQ, CTA en interne links.
const gsToepPage = (t) => {
  const u = UI.nl, seed = seedOf('gstoe-'+t.slug), canon = `/golfshows/toepassingen/${t.slug}/`;
  const ld = {'@context':'https://schema.org','@type':'Service',serviceType:'Golfshow / golf trickshow — '+t.name,
    provider:{'@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional','@id':'https://mrgolfbal.nl/over-mark/#person'},
    areaServed:{'@type':'Country',name:'Nederland'},
    url:SITE+canon, name:t.title.split(' | ')[0], description:t.desc};
  return HEAD(t.title, t.desc, canon, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Golfshows',url:'/golfshows/'},{name:'Toepassingen',url:'/golfshows/toepassingen/'},{name:t.name,url:canon}], 'nl')
    + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`, true)
  + HEADER('nl', canon, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <a href="/golfshows/">Golfshows</a> › <a href="/golfshows/toepassingen/">Toepassingen</a> › <span>${t.name}</span></nav></div>
  <section class="loc-hero"><div class="container">
    <p class="eyebrow">${ico(t.ico,'ico-inline')} Golfshow · ${t.name}</p>
    <h1>${t.h1}</h1>
    <p class="loc-hero__lead">${t.lead}</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="/contact/">${ico('chat','btn__ico')}Vraag beschikbaarheid aan <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="/golfshows/">Bekijk de golfshow</a></div>
  </div></section>
  ${t.main}
  ${markStrip(seed, 'nl')}
  ${markCred('nl')}
  ${faqBlock(t.faq, 'nl')}
  <section class="section"><div class="container"><div class="divider-cta">
    <p class="eyebrow" style="color:var(--color-blue)">Boek nu</p><h2>Golfshow boeken voor je ${t.name.toLowerCase()}</h2>
    <p>Vertel kort wat voor gelegenheid het is, waar en wanneer het plaatsvindt en hoeveel gasten je verwacht. Je krijgt een voorstel op maat; prijs en beschikbaarheid op aanvraag.</p>
    <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="/contact/">Neem contact op →</a><a class="btn btn--light btn--lg" href="tel:+31627411925">Bel Mark</a></div>
  </div></div></section>
  ${gsToepGrid(t.slug, true)}
  ${locGrid('', true)}`
  + testimonialsBlock('nl') + ballGallery(seed, 'nl') + socialsBlock('nl') + FOOTER('nl', canon, `Golfshow boeken voor je ${t.name.toLowerCase()}?`);
};

// Hub met alle gelegenheden.
const gsToepHub = () => {
  const u = UI.nl, canon = '/golfshows/toepassingen/';
  const cards = GS_TOEPASSINGEN.map(t=>`<a class="toep-card" href="/golfshows/toepassingen/${t.slug}/"><div class="ico">${ico(t.ico)}</div><div><h3>${t.name}</h3><p>${(t.desc||'').split(':')[1]||t.desc}</p><span class="go">Lees meer →</span></div></a>`).join('');
  return HEAD('Golfshow boeken: alle gelegenheden | MrGolfbal.nl',
    'Voor welke gelegenheid boek je een golf trickshow? Van merkactivatie en productlancering tot clubjubileum, personeelsdag en charity event — bekijk alle toepassingen.',
    canon, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Golfshows',url:'/golfshows/'},{name:'Toepassingen',url:canon}], 'nl'), true)
  + HEADER('nl', canon, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <a href="/golfshows/">Golfshows</a> › <span>Toepassingen</span></nav></div>
  <section class="loc-hero"><div class="container">
    <p class="eyebrow">${ico('spark','ico-inline')} Golfshow · Toepassingen</p>
    <h1>Voor welke gelegenheid boek je een <span>golf trickshow</span>?</h1>
    <p class="loc-hero__lead">Een golfshow, trick shot show, golfdemonstratie of golf entertainment act werkt op heel verschillende dagen — maar niet overal op dezelfde manier. Hieronder staat per gelegenheid wat er mogelijk is, hoe de act in het draaiboek past en wat je praktisch moet regelen.</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="/contact/">${ico('chat','btn__ico')}Vraag beschikbaarheid aan <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="/golfshows/">Bekijk de golfshow</a></div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-head center"><p class="eyebrow">${ico('target','ico-inline')} Kies je gelegenheid</p><h2>Alle gelegenheden op een rij</h2></div>
    <div class="toep-cards">${cards}</div></div></section>
  ${locGrid('', true)}`
  + markStrip(seedOf('gstoe-hub'), 'nl') + ballGallery(seedOf('gstoe-hub'), 'nl') + socialsBlock('nl')
  + FOOTER('nl', '/golfshows/toepassingen/', 'Golfshow boeken voor jouw gelegenheid?');
};
writeFileSync2(join(root, 'golfshows', 'toepassingen', 'index.html'), gsToepHub());
for (const t of GS_TOEPASSINGEN) writeFileSync2(join(root, 'golfshows', 'toepassingen', t.slug, 'index.html'), gsToepPage(t));
console.log('generated /golfshows/toepassingen/ + ' + GS_TOEPASSINGEN.length + ' toepassingspaginas: ' + GS_TOEPASSINGEN.map(t=>t.slug).join(', '));

/* =================== GOLFREIZEN (bestemmingen) =================== */
const TRIP_PHOTO_FILES = TRIPS.map(t=>t.photo);
const tripGrid = (currentSlug='', lang='nl') => { const en = lang==='en';
  return `<section class="section section--sky"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('pin','ico-inline')} ${en?'Destinations':'Bestemmingen'}</p>
    <h2>${en?'Exclusive golf trips':'Exclusieve golfreizen'}</h2>
    <p class="lead center">${en?'Fully organised group trips with a PGA pro as your travel companion. Choose a destination for what a week there looks like.':'Volledig georganiseerde groepsreizen met een PGA-pro als reisgenoot. Kies een bestemming voor wat een week daar inhoudt.'}</p></div>
  <div class="tripgrid">${TRIPS.filter(t=>t.slug!==currentSlug).map(t=>`<a class="tripcard" href="/golftrips/${t.slug}/">
    <img src="/assets/img/trips/${t.photo}" width="1200" height="800" loading="lazy" decoding="async" alt="${t.alt}">
    <span class="tripcard__body"><b>${t.name}</b><small>${(t.desc||'').split('.')[0]}.</small><em>${en?'Read more':'Lees meer'} →</em></span></a>`).join('')}</div>
</div></section>`; };

// Snel een mail of WhatsApp met de actuele, aankomende reizen opvragen.
const tripAsk = (lang='nl', extra='') => { const en = lang==='en';
  const subj = en ? 'Upcoming golf trips — availability' : 'Aankomende golfreizen — beschikbaarheid';
  const bodyTxt = en
    ? `Hi Mark,\n\nCould you send me the current upcoming golf trips and their availability${extra?` (I'm especially interested in ${extra})`:''}?\n\nName:\nNumber of players:\nPreferred period:\n\nThanks!`
    : `Hallo Mark,\n\nZou je mij de actuele aankomende golfreizen en de beschikbaarheid kunnen sturen${extra?` (ik heb vooral interesse in ${extra})`:''}?\n\nNaam:\nAantal spelers:\nGewenste periode:\n\nAlvast bedankt!`;
  const wa = 'https://wa.me/31627411925?text=' + encodeURIComponent(en
    ? `Hi Mark, could you send me the current upcoming golf trips and availability${extra?` — especially ${extra}`:''}?`
    : `Hallo Mark, kun je mij de actuele aankomende golfreizen en beschikbaarheid sturen${extra?` — vooral ${extra}`:''}?`);
  const mail = 'mailto:info@mrgolfbal.nl?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyTxt);
  return `<section class="section"><div class="container"><div class="tripask">
    <div><p class="eyebrow">${ico('clock','ico-inline')} ${en?'Availability':'Beschikbaarheid'}</p>
      <h2>${en?'Which trips are coming up?':'Welke reizen komen eraan?'}</h2>
      <p>${en?'The calendar changes through the year. Send a message in one tap and you’ll get the current list of upcoming trips, dates and remaining places.':'De agenda verandert door het jaar heen. Stuur met één tik een bericht en je krijgt de actuele lijst met aankomende reizen, data en beschikbare plaatsen.'}</p></div>
    <div class="tripask__btns">
      <a class="btn btn--primary btn--lg" href="${mail}">${ico('mail','btn__ico')}${en?'Email me the trips':'Mail mij de reizen'}</a>
      <a class="btn btn--light btn--lg" href="${wa}">${WA_ICON}<span>${en?'Ask via WhatsApp':'Vraag via WhatsApp'}</span></a>
    </div>
  </div></div></section>`; };

const TRIP_INCL = (lang='nl') => { const en = lang==='en'; return [
  ['building', en?'Luxurious accommodation':'Luxe accommodatie', en?'A resort or villa chosen for the group, close to the course.':'Een resort of villa die bij de groep past, dicht bij de baan.'],
  ['flag',     en?'Green fees at top courses':'Greenfees op topbanen', en?'Tee times arranged in advance at the courses on the programme.':'Tee-times die vooraf worden vastgelegd op de banen uit het programma.'],
  ['star',     en?'All meals and drinks':'Alle maaltijden en drankjes', en?'From breakfast to the evening table, in consultation with the group.':'Van ontbijt tot de avondtafel, in overleg met de groep.'],
  ['users',    en?'Personal service':'Persoonlijke begeleiding', en?'Mark travels with you: coaching on course, and someone who arranges things.':'Mark reist mee: coaching op de baan en iemand die het regelwerk doet.'],
  ['truck',    en?'Transfers':'Transfers', en?'Airport, resort and course — you don’t have to work out the driving.':'Vliegveld, resort en baan — je hoeft het rijden niet uit te zoeken.'],
]; };
const tripIncl = (lang='nl') => { const en = lang==='en';
  return `<section class="section section--sky"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('check','ico-inline')} ${en?'What’s included':'Wat is inbegrepen'}</p>
    <h2>${en?'What’s included in a trip':'Wat er bij een reis inbegrepen is'}</h2>
    <p class="lead center">${en?'Every trip is put together to measure, so the exact package is agreed in advance. This is what a fully organised trip normally covers.':'Elke reis wordt op maat samengesteld, dus het precieze pakket spreken we vooraf af. Dit is wat een volledig georganiseerde reis doorgaans omvat.'}</p></div>
  <div class="doelgrid">${TRIP_INCL(lang).map(([i,h,t])=>`<article class="doelcard"><span class="doelcard__ico">${ico(i,'')}</span><h3>${h}</h3><p>${t}</p></article>`).join('')}</div>
</div></section>`; };

// Sfeerbeeld van verblijf en omgeving. Deze drie foto's staan nergens anders,
// dus ze kunnen niet botsen met de fotostrip of de bestemmingskaarten.
const STAY_PHOTOS = [
  ['resort-zwembad.jpg', 'Golfresort met zwembad en uitzicht over de baan', 'Golf resort with a pool overlooking the course'],
  ['villa-golfresort.jpg', 'Moderne villa op een golfresort', 'A modern villa on a golf resort'],
  ['costa-del-sol-clubhuis.jpg', 'Golfbaan met clubhuis aan de Costa del Sol', 'Golf course with clubhouse on the Costa del Sol'],
];
const tripStay = (lang='nl') => { const en = lang==='en';
  return `<section class="section markstrip-sec"><div class="container">
    <div class="section-head center"><p class="eyebrow">${ico('building','ico-inline')} ${en?'Where you stay':'Waar je verblijft'}</p>
      <h2>${en?'Accommodation and surroundings':'Verblijf en omgeving'}</h2>
      <p class="lead center">${en?'The resort or villa is chosen to fit the group and the courses on the programme; what is shown here gives an impression of the kind of setting.':'Het resort of de villa wordt gekozen bij de groep en de banen op het programma; deze beelden geven een indruk van het soort omgeving.'}</p></div>
    <div class="markstrip">${STAY_PHOTOS.map(([f,nl,en2])=>`<figure><img src="/assets/img/trips/${f}" width="1400" height="900" loading="lazy" decoding="async" alt="${en?en2:nl}"><figcaption>${en?en2:nl}</figcaption></figure>`).join('')}</div>
  </div></section>`; };

const tripPage = (t) => {
  const u = UI.nl, seed = seedOf('trip-'+t.slug), canon = `/golftrips/${t.slug}/`;
  const ld = {'@context':'https://schema.org','@type':'TouristTrip', name:t.title.split(' | ')[0], description:t.desc,
    url:SITE+canon, provider:{'@type':'Person',name:'Mark Reynolds',jobTitle:'PGA-golfprofessional','@id':'https://mrgolfbal.nl/over-mark/#person'}};
  return HEAD(t.title, t.desc, canon, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Golftrips',url:'/golftrips/'},{name:t.name,url:canon}], 'nl')
    + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`, true)
  + HEADER('nl', canon, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <a href="/golftrips/">Golftrips</a> › <span>${t.name}</span></nav></div>
  <section class="pillar-hero"><div class="container pillar-hero--photo" style="padding-block:clamp(2.6rem,6vw,4.5rem)">
    <div><p class="eyebrow">${ico('pin','ico-inline')} Golfreis · ${t.name}</p><h1>${t.h1}</h1><p>${t.lead}</p>
    <div class="hero-cta" style="margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="/contact/">${ico('chat','btn__ico')}Vraag beschikbaarheid aan <span class="btn__arrow">→</span></a>
    ${waBtn('nl','light')}</div></div>
    <figure class="hero-photo"><img src="/assets/img/trips/${t.photo}" width="1400" height="826" alt="${t.alt}" loading="eager" decoding="async" fetchpriority="high"></figure>
  </div></section>
  ${t.main}
  ${tripIncl('nl')}
  ${tripStay('nl')}
  ${tripAsk('nl', t.name)}
  ${markStrip(seed, 'nl', 3, TRIP_PHOTO_FILES)}
  ${markCred('nl')}
  ${faqBlock(t.faq, 'nl')}
  <section class="section"><div class="container"><div class="divider-cta">
    <p class="eyebrow" style="color:var(--color-blue)">Boek nu</p><h2>Golfreis naar ${t.name}</h2>
    <p>Vertel met hoeveel spelers je wilt gaan en in welke periode. Je krijgt een voorstel op maat; prijs op aanvraag.</p>
    <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="/contact/">Neem contact op →</a><a class="btn btn--light btn--lg" href="tel:+31627411925">Bel Mark</a></div>
  </div></div></section>
  ${tripGrid(t.slug, 'nl')}`
  + amamBlock('nl') + testimonialsBlock('nl') + socialsBlock('nl')
  + FOOTER('nl', canon, `Golfreis naar ${t.name}?`, 'Vraag beschikbaarheid');
};
for (const t of TRIPS) writeFileSync2(join(root, 'golftrips', t.slug, 'index.html'), tripPage(t));
console.log('generated ' + TRIPS.length + ' golfreisbestemmingen: ' + TRIPS.map(t=>t.slug).join(', '));

/* =================== BLOG =================== */
const BLOG_CATS = [...new Set(POSTS.map(p=>p.cat))];
const blogCard = (a) => `<a class="blogcard" href="/blog/${a.slug}/"><span class="blogcard__cat">${a.cat}</span><h3>${a.h1}</h3><p>${a.lead}</p><em>Lees het artikel →</em></a>`;
const blogGrid = (currentSlug='', n=6) => {
  const items = POSTS.filter(a=>a.slug!==currentSlug).slice(0, n);
  return `<section class="section section--sky"><div class="container">
  <div class="section-head center"><p class="eyebrow">${ico('pencil','ico-inline')} Blog</p><h2>Lezen over golfballen, events en golfreizen</h2>
    <p class="lead center">Praktische artikelen over bedrukken, je golfdag organiseren, materiaalkeuze en op reis gaan met een PGA-pro.</p></div>
  <div class="bloggrid">${items.map(blogCard).join('')}</div>
  <p class="center" style="margin-top:1.4rem"><a class="btn btn--light" href="/blog/">Alle artikelen →</a></p>
</div></section>`; };

const blogPost = (a) => {
  const u = UI.nl, seed = seedOf('blog-'+a.slug), canon = `/blog/${a.slug}/`;
  const ld = {'@context':'https://schema.org','@type':'BlogPosting', headline:a.h1, description:a.desc,
    mainEntityOfPage:{'@type':'WebPage','@id':SITE+canon},
    author:{'@type':'Person',name:'Mark Reynolds','@id':'https://mrgolfbal.nl/over-mark/#person'},
    publisher:{'@type':'Organization',name:'MrGolfbal.nl',url:SITE}, inLanguage:'nl-NL', articleSection:a.cat};
  const related = POSTS.filter(x=>x.cat===a.cat && x.slug!==a.slug).slice(0,3);
  return HEAD(a.title, a.desc, canon, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Blog',url:'/blog/'},{name:a.h1,url:canon}], 'nl')
    + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`, true)
  + HEADER('nl', canon, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <a href="/blog/">Blog</a> › <span>${a.cat}</span></nav></div>
  <article class="section blogpost"><div class="container">
    <header class="blogpost__head"><p class="eyebrow">${ico('pencil','ico-inline')} ${a.cat}</p><h1>${a.h1}</h1><p class="lead">${a.lead}</p></header>
    <div class="prose">${a.body}</div>
  </div></article>
  ${faqBlock(a.faq, 'nl')}
  ${ctaBlock('nl', canon, BLOG_CTA[a.cat] || 'advies')}
  ${related.length ? `<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">Ook interessant</p><h2>Meer over ${a.cat.toLowerCase()}</h2></div>
    <div class="bloggrid" style="margin-top:1rem">${related.map(blogCard).join('')}</div></div></section>` : ''}`
  + ballGallery(seed, 'nl') + socialsBlock('nl') + FOOTER('nl', canon, null, null, BLOG_CTA[a.cat] || 'advies');
};

const blogHub = () => {
  const u = UI.nl, canon = '/blog/';
  const ld = {'@context':'https://schema.org','@type':'Blog', name:'MrGolfbal.nl blog', url:SITE+canon, inLanguage:'nl-NL',
    blogPost: POSTS.map(a=>({'@type':'BlogPosting', headline:a.h1, url:SITE+`/blog/${a.slug}/`}))};
  return HEAD('Blog over golfballen bedrukken & golfevents | MrGolfbal.nl',
    'Artikelen over golfballen bedrukken, je bedrijfsgolfdag organiseren, een trickshow boeken, balkeuze en golfreizen in groep — geschreven door PGA-professional Mark Reynolds.',
    canon, 'nl',
    breadcrumbLD([{name:u.home,url:'/'},{name:'Blog',url:canon}], 'nl')
    + `<script type="application/ld+json">${JSON.stringify(ld)}</script>`, true)
  + HEADER('nl', canon, true)
  + `<div class="container"><nav class="crumbs"><a href="/">${u.home}</a> › <span>Blog</span></nav></div>
  <section class="loc-hero"><div class="container">
    <p class="eyebrow">${ico('pencil','ico-inline')} Blog</p>
    <h1>Alles over <span>golfballen, events en golfreizen</span></h1>
    <p class="loc-hero__lead">Praktische artikelen uit de werkplaats en van de baan: hoe je een logo goed aanlevert, hoe je een golfdag opzet die loopt, welke bal bij je spel past en wat een golfreis in groepsverband inhoudt.</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="/contact/">${ico('chat','btn__ico')}Stel je vraag aan Mark <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="/kennisbank/">Naar de kennisbank</a></div>
  </div></section>
  ${BLOG_CATS.map(c=>`<section class="section"><div class="container">
    <div class="section-head accent-line"><p class="eyebrow">${c}</p><h2>${c}</h2></div>
    <div class="bloggrid" style="margin-top:1rem">${POSTS.filter(a=>a.cat===c).map(blogCard).join('')}</div>
  </div></section>`).join('')}`
  + markStrip(seedOf('blog-hub'), 'nl') + ballGallery(seedOf('blog-hub'), 'nl') + socialsBlock('nl') + FOOTER('nl', '/blog/');
};
writeFileSync2(join(root, 'blog', 'index.html'), blogHub());
for (const a of POSTS) writeFileSync2(join(root, 'blog', a.slug, 'index.html'), blogPost(a));
console.log('generated /blog/ + ' + POSTS.length + ' artikelen');


/* =================== PILLARS (golfshows, golftrips — Mark Reynolds diensten) =================== */
// t = { slug, ico, related:[slug], nl:{metaTitle,metaDesc,eyebrow,h1,lead,intro,sections:[{h,html}],faq,bookH,bookP}, en:{...} }
// Donkere trickshow-hero met YouTube-video in het midden en feature-bullets.
const tsHero = (t, c, lang='nl') => {
  const p = pfx(lang); const v = c.video || {};
  const feats = (v.feats||[]).map(f=>`<li><span class="ts-ico">${ico(f.ico,'')}</span><div><b>${f.t}</b>${f.s?`<span>${f.s}</span>`:''}</div></li>`).join('');
  return `<section class="ts-hero"><div class="container">
    <p class="eyebrow">${c.eyebrow}</p>
    <h1>${c.h1}</h1>
    <p class="ts-sub">${v.sub||c.lead}</p>
    <div class="ts-grid">
      <div class="ts-video"><iframe src="https://www.youtube-nocookie.com/embed/${t.videoId}?rel=0" title="${v.videoTitle||(lang==='en'?'Golf Trick Show — Mark Reynolds':'Golf trickshow — Mark Reynolds')}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <ul class="ts-feats">${feats}</ul>
    </div>
    <div class="hero-cta" style="margin-top:1.6rem"><a class="btn btn--primary btn--lg" href="${p}/contact/">${ico('chat','btn__ico')}${lang==='en'?'Book the trick show':'Boek de trickshow'} <span class="btn__arrow">→</span></a><a class="btn btn--light btn--lg" href="https://wa.me/31627411925">WhatsApp Mark</a></div>
  </div></section>`;
};

const pillarPage = (t, lang='nl') => {
  const c = t[lang], u = UI[lang], p = pfx(lang);
  const sectionsHtml = (c.sections||[]).map(s=>`<h2>${s.h}</h2>${s.html}`).join('');
  const bookH = c.bookH || (lang==='en' ? 'Book Mark Reynolds' : 'Boek Mark Reynolds');
  const bookP = c.bookP || (lang==='en' ? 'Get in touch for availability and a tailored proposal.' : 'Neem contact op voor beschikbaarheid en een voorstel op maat.');
  const relItems = (t.related||[]).map(s => PILLARS.find(x=>x.slug===s) || TOEPASSINGEN.find(x=>x.slug===s)).filter(Boolean);
  const relBase = (s) => PILLARS.find(x=>x.slug===s.slug) ? '/' : '/toepassingen/';
  return HEAD(c.metaTitle, c.metaDesc, `/${t.slug}/`, lang,
    breadcrumbLD([{name:u.home,url:'/'},{name:c.crumb||c.name,url:`/${t.slug}/`}], lang)
  ) + HEADER(lang, `/${t.slug}/`) +
  `<div class="container"><nav class="crumbs"><a href="${p}/">${u.home}</a> › <span>${c.crumb||c.name}</span></nav></div>
  ${t.videoId ? tsHero(t, c, lang) : `<section class="pillar-hero"><div class="container${PILLAR_PHOTOS[t.slug]?' pillar-hero--photo':''}" style="padding-block:clamp(2.6rem,6vw,4.5rem)">
    <div><p class="eyebrow">${c.eyebrow}</p><h1>${c.h1}</h1><p>${c.lead}</p>
    <div class="hero-cta" style="margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}/contact/">${ico('chat','btn__ico')}${lang==='en'?'Request availability':'Vraag beschikbaarheid aan'} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="https://wa.me/31627411925">${lang==='en'?'WhatsApp Mark':'WhatsApp Mark'}</a></div></div>
    ${PILLAR_PHOTOS[t.slug] ? `<figure class="hero-photo"><img src="/assets/img/mark/${PILLAR_PHOTOS[t.slug].file}" width="1400" height="826" alt="${PILLAR_PHOTOS[t.slug][lang]}" loading="eager" decoding="async" fetchpriority="high"></figure>` : ''}
  </div></section>`}
  <section class="section"><div class="container"><div class="prose">${localize(c.intro||'', lang)}${localize(sectionsHtml, lang)}</div></div></section>
  ${extraSections(t.slug, lang)}
  ${faqBlock((c.faq||[]).map(([q,a])=>[q, localize(a, lang)]), lang)}
  <section class="section"><div class="container"><div class="divider-cta">
    <p class="eyebrow" style="color:var(--color-blue)">${lang==='en'?'Book now':'Boek nu'}</p><h2>${bookH}</h2><p>${bookP}</p>
    <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}/contact/">${lang==='en'?'Get in touch':'Neem contact op'} →</a><a class="btn btn--light btn--lg" href="tel:+31627411925">${lang==='en'?'Call':'Bel'} +31 6 27 41 19 25</a></div>
  </div></div></section>
  ${relItems.length ? `<section class="section section--sky"><div class="container"><div class="section-head accent-line"><p class="eyebrow">${lang==='en'?'Also interesting':'Ook interessant'}</p><h2>${lang==='en'?'Explore more':'Ontdek meer'}</h2></div>
    <div class="linkchips" style="margin-top:1rem">${relItems.map(x=>`<a href="${p}${relBase(x)}${x.slug}${relBase(x)==='/'?'/':'/'}">${ico(x.ico,'ico-svg')} ${x[lang].name}</a>`).join('')}</div></div></section>` : ''}`
  + markStrip(seedOf('pillar-'+t.slug), lang, 3, t.slug==='golftrips' ? TRIP_PHOTO_FILES : [])
  + markCred(lang)
  + (t.slug==='golfshows' ? servicesBlock(lang) + testimonialsBlock(lang) : '')
  + (t.slug==='golfshows' && lang==='nl' ? gsToepGrid('') + locGrid('') : '')
  + (t.slug==='golftrips' && lang==='nl' ? tripGrid('', lang) + tripIncl(lang) + tripStay(lang) + amamBlock(lang) + tripAsk(lang) : '')
  + (t.slug==='golfshows' ? teamBlock(lang) + partnersBlock(lang) : '')
  + ballGallery(seedOf('pillar-'+t.slug), lang) + reviewsBlock(lang) + socialsBlock(lang)
  + FOOTER(lang, `/${t.slug}/`);
};
for (const lang of LANGS) {
  const base = lang==='en' ? join(root,'en') : root;
  for (const t of PILLARS){ writeFileSync2(join(base, t.slug, 'index.html'), pillarPage(t, lang)); }
  console.log('generated '+(lang==='en'?'/en':'')+' pillars: '+PILLARS.map(x=>x.slug).join(', '));
}
console.log('TOTAL', PILLARS.length, 'pillar pages (NL+EN)');

/* =================== GOLFBALKIEZER (stap-voor-stap quiz, 10 vragen) =================== */
const QUIZ_PRODUCTS = [
  { name:'Titleist Pro V1', brand:'Titleist', handle:'titleist-pro-v1', tags:{premium:3,laag:3,controle:3,cadeau:2}, blurb:{nl:'Toursbal: zacht gevoel, penetrerende vlucht en veel controle rond de green.', en:'Tour ball: soft feel, penetrating flight and plenty of greenside control.'} },
  { name:'Titleist Pro V1x', brand:'Titleist', handle:'titleist-pro-v1x', tags:{premium:3,laag:3,controle:2,hoogte:3}, blurb:{nl:'Hogere vlucht en meer spin, iets steviger gevoel.', en:'Higher flight and more spin, a slightly firmer feel.'} },
  { name:'Titleist AVX', brand:'Titleist', handle:'titleist-avx', tags:{premium:2,controle:2,laag:2}, blurb:{nl:'Zeer zacht gevoel met een lagere vlucht en spin.', en:'Very soft feel with a lower flight and spin.'} },
  { name:'Titleist TruFeel', brand:'Titleist', handle:'titleist-trufeel', tags:{recreatief:3,scherp:2,cadeau:2}, blurb:{nl:'Extra zacht en scherper geprijsd; fijne allround merkbal.', en:'Extra soft and keenly priced; a fine all-round brand ball.'} },
  { name:'Titleist Velocity', brand:'Titleist', handle:'titleist-velocity', tags:{afstand:3,recreatief:2}, blurb:{nl:'Snel en lang, hoge vlucht en lage spin.', en:'Fast and long, high flight and low spin.'} },
  { name:'Pinnacle Soft', brand:'Pinnacle', handle:'pinnacle-soft-met-bedrukking', tags:{scherp:3,recreatief:3,oplage:3,cadeau:2}, blurb:{nl:'Zacht en scherp geprijsd; groot bedrukoppervlak voor je logo.', en:'Soft and keenly priced; a large surface for your logo.'} },
  { name:'Pinnacle Rush', brand:'Pinnacle', handle:'pinnacle-rush-met-bedrukking', tags:{afstand:3,scherp:2,oplage:2}, blurb:{nl:'Stevige kern gericht op afstand; prettige toernooibal.', en:'Firm core aimed at distance; a pleasant tournament ball.'} },
];
const QUIZ_Q = (lang) => lang==='en' ? [
  ['Who are the golf balls for?', [['My company',{oplage:1}],['A golf club',{oplage:2}],['A tournament / golf day',{afstand:1,oplage:1}],['Myself or as a gift',{cadeau:2,controle:1}]]],
  ['What will they mainly be used for?', [['Corporate gift',{premium:2,cadeau:2}],['Company golf day',{oplage:2,scherp:1}],['Tournament / competition',{afstand:1,oplage:1}],['My own game',{controle:1}],['A personal gift',{cadeau:3,premium:1}]]],
  ['What level are the golfers?', [['Beginner',{recreatief:2,scherp:2,afstand:1}],['Recreational',{recreatief:2,scherp:1}],['Advanced',{controle:2,premium:1,hoogte:1}],['Low handicap / (almost) pro',{laag:3,controle:2,premium:2}]]],
  ['What is the budget per ball?', [['Keenly priced',{scherp:3,oplage:1}],['Mid-range',{recreatief:1}],['Premium — quality first',{premium:3,controle:1}]]],
  ['What look do you want?', [['As premium as possible',{premium:3}],['Neutral / a good middle ground',{recreatief:1}],['Mainly keenly priced',{scherp:3}]]],
  ['How many golf balls do you need?', [['144–288',{}],['288–576',{oplage:1}],['576 or more',{oplage:3,scherp:1}]]],
  ['What matters most in play?', [['Distance',{afstand:3}],['Control around the green',{controle:3,laag:1}],['A soft feel',{premium:1,controle:1}],['A straight, high flight',{hoogte:2,afstand:1}]]],
  ['Do the balls need printing?', [['Yes, with a logo/text',{}],['No, blank',{scherp:1}]]],
  ['Which brand do you prefer?', [['Titleist (premium)',{premium:2,controle:1}],['Pinnacle (sharp price)',{scherp:2,oplage:1}],['No preference',{}]]],
  ['What delivery time do you need?', [['Plenty of time',{}],['Normal',{}],['Rush',{scherp:1}]]],
] : [
  ['Voor wie zijn de golfballen?', [['Mijn bedrijf',{oplage:1}],['Een golfclub',{oplage:2}],['Een toernooi / golfdag',{afstand:1,oplage:1}],['Mezelf of als cadeau',{cadeau:2,controle:1}]]],
  ['Waarvoor worden ze vooral gebruikt?', [['Relatiegeschenk',{premium:2,cadeau:2}],['Bedrijfsgolfdag',{oplage:2,scherp:1}],['Toernooi / wedstrijd',{afstand:1,oplage:1}],['Eigen spel',{controle:1}],['Persoonlijk cadeau',{cadeau:3,premium:1}]]],
  ['Wat is het niveau van de golfers?', [['Beginnend',{recreatief:2,scherp:2,afstand:1}],['Recreatief',{recreatief:2,scherp:1}],['Gevorderd',{controle:2,premium:1,hoogte:1}],['Laag handicap / (bijna) pro',{laag:3,controle:2,premium:2}]]],
  ['Wat is het budget per bal?', [['Scherp geprijsd',{scherp:3,oplage:1}],['Gemiddeld',{recreatief:1}],['Premium — kwaliteit voorop',{premium:3,controle:1}]]],
  ['Welke uitstraling wil je?', [['Zo premium mogelijk',{premium:3}],['Neutraal / goede middenweg',{recreatief:1}],['Vooral scherp geprijsd',{scherp:3}]]],
  ['Hoeveel golfballen heb je nodig?', [['144–288',{}],['288–576',{oplage:1}],['576 of meer',{oplage:3,scherp:1}]]],
  ['Wat vind je het belangrijkst in het spel?', [['Afstand',{afstand:3}],['Controle rond de green',{controle:3,laag:1}],['Een zacht gevoel',{premium:1,controle:1}],['Een rechte, hoge vlucht',{hoogte:2,afstand:1}]]],
  ['Moeten de ballen bedrukt worden?', [['Ja, met logo/tekst',{}],['Nee, onbedrukt',{scherp:1}]]],
  ['Welk merk heeft je voorkeur?', [['Titleist (premium)',{premium:2,controle:1}],['Pinnacle (scherpe prijs)',{scherp:2,oplage:1}],['Geen voorkeur',{}]]],
  ['Welke levertijd heb je nodig?', [['Ruim de tijd',{}],['Normaal',{}],['Spoed',{scherp:1}]]],
];
const quizPage = (lang='nl') => {
  const u = UI[lang], p = pfx(lang), en = lang==='en';
  const qs = QUIZ_Q(lang);
  const prods = QUIZ_PRODUCTS.map(x=>({ name:x.name, brand:x.brand, href:`${p}/products/${x.handle}/`, tags:x.tags, blurb:x.blurb[lang] }));
  const title = en ? 'Golf ball finder — which golf ball suits you? | MrGolfbal.nl' : 'Golfbalkiezer — welke golfbal past bij jou? | MrGolfbal.nl';
  const desc = en ? 'Take the golf ball finder quiz: answer 10 quick questions and get up to 3 personal recommendations for the right (printed) golf ball — by goal, level and budget.' : 'Doe de golfbalkiezer-quiz: beantwoord 10 korte vragen en krijg tot 3 persoonlijke aanbevelingen voor de juiste (bedrukte) golfbal — op doel, niveau en budget.';
  const steps = qs.map((qq,qi)=>{
    const [q,opts] = qq;
    return `<div class="quiz-step${qi===0?' active':''}" data-step="${qi}">
      <span class="quiz-count">${en?'Question':'Vraag'} ${qi+1} / ${qs.length}</span>
      <div class="quiz-q">${q}</div>
      <div class="quiz-opts">
      ${opts.map(([l,b])=>`<button type="button" class="quiz-opt" data-boost='${JSON.stringify(b)}'><span class="dot"></span>${l}</button>`).join('')}
      </div>
      <div class="quiz-nav"><button type="button" class="quiz-back"${qi===0?' disabled':''}>← ${en?'Back':'Terug'}</button><span class="muted" style="font-size:.85rem">${en?'Tap an answer to continue':'Tik een antwoord om verder te gaan'}</span></div>
    </div>`;
  }).join('');
  return HEAD(title, desc, '/golfbalkiezer/', lang,
    breadcrumbLD([{name:u.home,url:'/'},{name:en?'Golf ball finder':'Golfbalkiezer',url:'/golfbalkiezer/'}], lang)
  ) + HEADER(lang, '/golfbalkiezer/') +
  `<div class="container"><nav class="crumbs"><a href="${p}/">${u.home}</a> › <span>${en?'Golf ball finder':'Golfbalkiezer'}</span></nav></div>
  <section class="pillar-hero"><div class="container" style="padding-block:clamp(2rem,4vw,3.2rem)">
    <p class="eyebrow">${en?'Quiz':'Keuzehulp'}</p><h1>${en?'Which golf ball <span>suits you?</span>':'Welke golfbal <span>past bij jou?</span>'}</h1>
    <p>${en?'Answer 10 quick questions — one at a time — and get up to three personal recommendations with a short explanation. Not sure? Mark is happy to help.':'Beantwoord 10 korte vragen — één voor één — en krijg tot drie persoonlijke aanbevelingen met uitleg. Twijfel je? Mark denkt met je mee.'}</p>
  </div></section>
  <section class="section"><div class="container"><div class="quiz" id="quiz">
    <div class="quiz-progress"><b id="qbar"></b></div>
    <div id="qsteps">${steps}</div>
    <div id="qresult" style="display:none"></div>
  </div></div></section>
  <script>
  (function(){
    var PRODUCTS = ${JSON.stringify(prods)};
    var TXT = ${JSON.stringify(en ? {eye:'Our recommendation',h:'These golf balls suit you',best:' · best match',view:'View this model',again:'Start again',note:'Indicative advice based on your answers and general ball characteristics. For tailored advice, ',ask:'ask Mark',contact:p+'/contact/'} : {eye:'Onze aanbeveling',h:'Deze golfballen passen bij jou',best:' · beste match',view:'Bekijk dit model',again:'Opnieuw beginnen',note:'Indicatief advies op basis van je antwoorden en algemene baleigenschappen. Voor maatwerk: ',ask:'vraag Mark',contact:p+'/contact/'})};
    var steps = Array.prototype.slice.call(document.querySelectorAll('.quiz-step'));
    var bar = document.getElementById('qbar'), result = document.getElementById('qresult'), stepsWrap = document.getElementById('qsteps');
    var cur = 0, answers = [];
    function show(i){ steps.forEach(function(s,n){ s.classList.toggle('active', n===i); }); bar.style.width = Math.round(((i)/steps.length)*100)+'%'; cur=i; }
    function finish(){
      bar.style.width='100%';
      var boost={}; answers.forEach(function(b){ for(var k in b){ boost[k]=(boost[k]||0)+b[k]; } });
      var scores = PRODUCTS.map(function(pr){ var s=0; for(var k in pr.tags){ s+=(boost[k]||0)*pr.tags[k]; } return {p:pr,score:s}; }).sort(function(a,b){return b.score-a.score;});
      var top = scores.slice(0,3);
      var html='<div class="section-head accent-line"><p class="eyebrow">'+TXT.eye+'</p><h2>'+TXT.h+'</h2></div><div class="grid grid-3" style="margin-top:1.2rem">';
      top.forEach(function(r,i){ var pr=r.p;
        html+='<article class="card"><div class="card__body"><span class="card__brand">'+pr.brand+(i===0?TXT.best:'')+'</span><h3 class="card__title">'+pr.name+'</h3><p class="card__meta">'+pr.blurb+'</p><a class="btn btn--primary btn--block" href="'+pr.href+'">'+TXT.view+'</a></div></article>';
      });
      html+='</div><p class="muted" style="margin-top:1.2rem">'+TXT.note+'<a href="'+TXT.contact+'">'+TXT.ask+'</a>.</p><button type="button" class="btn btn--ghost" id="qrestart" style="margin-top:.6rem">↺ '+TXT.again+'</button>';
      stepsWrap.style.display='none'; result.style.display='block'; result.innerHTML=html;
      result.scrollIntoView({behavior:'smooth',block:'center'});
      document.getElementById('qrestart').addEventListener('click',function(){ answers=[]; result.style.display='none'; stepsWrap.style.display='block'; show(0); window.scrollTo({top:document.getElementById('quiz').offsetTop-120,behavior:'smooth'}); });
    }
    steps.forEach(function(step,i){
      step.querySelectorAll('.quiz-opt').forEach(function(btn){
        btn.addEventListener('click',function(){
          step.querySelectorAll('.quiz-opt').forEach(function(b){ b.classList.remove('sel'); });
          btn.classList.add('sel');
          answers[i] = JSON.parse(btn.getAttribute('data-boost')||'{}');
          setTimeout(function(){ if(i+1<steps.length){ show(i+1); } else { finish(); } }, 220);
        });
      });
      var back = step.querySelector('.quiz-back');
      if(back) back.addEventListener('click',function(){ if(i>0) show(i-1); });
    });
    show(0);
  })();
  </script>
  ${faqBlock(en ? [
    ['How does the golf ball finder work?','You answer 10 short questions about your goal, level, budget and preferences. Based on your answers we score every ball and show the three best matches.'],
    ['Is the advice binding?','No, it is indicative. The finder points you in the right direction; for a tailored recommendation you can always ask Mark, a PGA professional.'],
    ['Can I have the recommended ball printed?','Yes. Every recommended model can be printed with your logo or text. Open the configurator to start.'],
    ['What if I am not sure about my answers?','Just pick what fits best. You can go back a step at any time, or start again at the end.'],
  ] : [
    ['Hoe werkt de golfbalkiezer?','Je beantwoordt 10 korte vragen over je doel, niveau, budget en voorkeuren. Op basis daarvan scoren we elke bal en tonen we de drie beste matches.'],
    ['Is het advies bindend?','Nee, het is indicatief. De kiezer wijst je de goede richting; voor maatwerk kun je altijd Mark vragen, een PGA-professional.'],
    ['Kan ik de aanbevolen bal laten bedrukken?','Ja. Elk aanbevolen model kun je met je logo of tekst laten bedrukken. Open de configurator om te starten.'],
    ['Wat als ik twijfel bij een antwoord?','Kies wat het beste past. Je kunt altijd een stap terug, of aan het eind opnieuw beginnen.'],
  ], lang)}` + ballGallery(seedOf('golfbalkiezer'), lang) + socialsBlock(lang) + ctaBlock(lang, '/golfbalkiezer/') + FOOTER(lang, '/golfbalkiezer/');
};
for (const lang of LANGS) {
  const out = lang==='en' ? join(root,'en','golfbalkiezer','index.html') : join(root,'golfbalkiezer','index.html');
  writeFileSync2(out, quizPage(lang));
}
console.log('generated /golfbalkiezer/ + /en/golfbalkiezer/ (stap-voor-stap quiz)');


/* =================== 404-PAGINA =================== */
// Netlify serveert 404.html vanzelf bij een onbekend pad. Zonder deze pagina
// krijgt een bezoeker de kale Netlify-melding zonder menu of weg terug.
{
  const links = [
    ['ball',  '/golfballen-bedrukken/', 'Golfballen bedrukken', 'Je logo of tekst op een originele Titleist of Pinnacle.'],
    ['spark', '/golfshows/', 'Golf trickshow', 'Een live show van PGA-professional Mark Reynolds.'],
    ['pin',   '/golftrips/', 'Golfreizen', 'Volledig georganiseerde groepsreizen met een pro erbij.'],
    ['flag',  '/golfles/', 'Golfles', 'Les van een PGA-professional bij The International.'],
    ['pencil','/blog/', 'Blog', 'Artikelen over bedrukken, events en op reis gaan.'],
    ['chat',  '/contact/', 'Contact', 'Bel of app Mark; je krijgt doorgaans binnen 24 uur antwoord.'],
  ];
  const html = HEAD('Pagina niet gevonden | MrGolfbal.nl',
    'Deze pagina bestaat niet (meer). Ga terug naar de homepage of kies hieronder waar je naartoe wilt.',
    '/404/', 'nl', '', true, true)
  + HEADER('nl', '/404/', true)
  + `<section class="section pagehead"><div class="container">
      <p class="eyebrow">${ico('target','ico-inline')} Foutje</p>
      <h1>Deze pagina is er <span>niet (meer)</span></h1>
      <p class="lead">Misschien is de link verouderd of staat er een typefout in het adres. Hieronder staat waar je waarschijnlijk naartoe wilde.</p>
      ${contactBtns('nl', false)}
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head center"><p class="eyebrow">${ico('home','ico-inline')} Verder op de site</p><h2>Waar wilde je naartoe?</h2></div>
      <div class="svcgrid">${links.map(([i,h,t,s])=>`<a class="svccard" href="${h}"><span class="svccard__ico">${ico(i,'')}</span><h3>${t}</h3><p>${s}</p></a>`).join('')}</div>
      <p class="center" style="margin-top:1.6rem"><a class="btn btn--primary btn--lg" href="/">${ico('home','btn__ico')}Terug naar de homepage <span class="btn__arrow">→</span></a></p>
    </div></section>`
  + FOOTER('nl', '/404/');
  writeFileSync2(join(root, '404.html'), html);
  console.log('generated /404.html');
}

/* =================== SITEMAP (NL + EN met hreflang-alternatieven) =================== */
{
  // Alle NL root-paden met prioriteit. EN = /en + pad. Homepage/hub zijn handgebouwd.
  const urls = [
    ['/', '1.0'], ['/golfballen-bedrukken/', '0.9'],
    ['/golfbalkiezer/', '0.7'],
    ...PAGES.filter(p => !p.noIndex).map(p => [p.canon, '0.8']),
    ...PRODUCTS.map(p => [`/products/${p.handle}/`, '0.7']),
    ['/kennisbank/', '0.7'],
    ...KB.map(a => [`/kennisbank/${a.slug}/`, '0.6']),
    ['/toepassingen/', '0.8'],
    ...TOEPASSINGEN.map(t => [`/toepassingen/${t.slug}/`, '0.7']),
    ...PILLARS.map(t => [`/${t.slug}/`, '0.8']),
    ...LOCATIES.map(l => [`/golfshows/${l.slug}/`, '0.7', true]),
    ['/golfshows/toepassingen/', '0.8', true],
    ...GS_TOEPASSINGEN.map(t => [`/golfshows/toepassingen/${t.slug}/`, '0.7', true]),
    ...TRIPS.map(t => [`/golftrips/${t.slug}/`, '0.8', true]),
    ['/blog/', '0.8', true],
    ...POSTS.map(a => [`/blog/${a.slug}/`, '0.6', true]),
  ];
  // nlOnly = geen /en/-tweeling; die pagina's krijgen ook geen hreflang-alternatief.
  const entry = (path, prio, nlOnly) => {
    const nl = SITE + path, en = SITE + enHref(path);
    if (nlOnly) return `  <url><loc>${nl}</loc><priority>${prio}</priority></url>`;
    const alts = `<xhtml:link rel="alternate" hreflang="nl" href="${nl}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${nl}"/>`;
    return `  <url><loc>${nl}</loc>${alts}<priority>${prio}</priority></url>\n  <url><loc>${en}</loc>${alts}<priority>${prio}</priority></url>`;
  };
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Automatisch gegenereerd door gen.mjs — NL + EN met hreflang-alternatieven.
     Shopify product-/collectie-sitemaps kunnen via een sitemap-index worden samengevoegd. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(([p, pr, only]) => entry(p, pr, only)).join('\n')}
</urlset>\n`;
  writeFileSync2(join(root, 'sitemap.xml'), xml);
  console.log('generated sitemap.xml (' + urls.reduce((n,u)=>n+(u[2]?1:2),0) + ' urls, NL+EN)');
}

/* =================== STATISCHE PAGINA'S SYNCHRONISEREN ===================
   index.html en golfballen-bedrukken/index.html zijn met de hand gebouwd.
   De header, footer en de gedeelde fotoblokken komen hier uit de generator,
   zodat ze nooit meer uit de pas lopen met de rest van de site. */
const STATIC_PAGES = [
  { file: 'index.html',                        lang: 'nl', canon: '/',                       blocks: ['services','strip','testimonials','amam','gallery','blog','partners'] },
  { file: 'golfballen-bedrukken/index.html',   lang: 'nl', canon: '/golfballen-bedrukken/',  blocks: ['doel','gallery','sticky'] },
  { file: 'en/index.html',                     lang: 'en', canon: '/',                       blocks: ['services','strip','testimonials','amam','gallery','partners'] },
  { file: 'en/golfballen-bedrukken/index.html',lang: 'en', canon: '/golfballen-bedrukken/',  blocks: ['doel','gallery','sticky'] },
];
const between = (html, name, replacement) => {
  const a = `<!--${name}:START-->`, b = `<!--${name}:END-->`;
  const i = html.indexOf(a), j = html.indexOf(b);
  if (i < 0 || j < 0) { console.warn(`  [!] marker ${name} ontbreekt`); return html; }
  return html.slice(0, i + a.length) + '\n' + replacement + '\n' + html.slice(j);
};
for (const sp of STATIC_PAGES) {
  const f = join(root, sp.file);
  let html;
  try { html = readFileSync(f, 'utf8'); } catch { console.warn('  [!] ontbreekt:', sp.file); continue; }
  const seed = seedOf('static-' + sp.file);
  const blocks = sp.blocks.map(b =>
    b === 'strip'   ? markStrip(seed, sp.lang) :
    b === 'doel'    ? doelBlock(sp.lang) :
    b === 'gallery' ? ballGallery(seed, sp.lang) :
    b === 'services' ? servicesBlock(sp.lang) :
    b === 'testimonials' ? testimonialsBlock(sp.lang) :
    b === 'amam' ? amamBlock(sp.lang) :
    b === 'partners' ? partnersBlock(sp.lang) :
    b === 'blog' ? blogGrid('', 6) :
    b === 'sticky' ? stickyCta(sp.lang, sp.canon) : '').join('\n');
  html = between(html, 'HEADER', HEADER(sp.lang, sp.canon));
  html = between(html, 'FOOTER', FOOTER_INNER(sp.lang));
  html = between(html, 'BLOCKS', blocks);
  // Productkaarten in de handgebouwde pagina's krijgen de echte balfoto.
  html = html.replace(/(<a href="(?:\/en)?\/products\/([a-z0-9-]+)\/?"><div class="card__media">)[\s\S]*?(<\/div><\/a>)/g,
    (m, open_, handle, close) => PRODUCT_PHOTOS[handle] ? open_ + ballPhoto(handle, sp.lang, 0) + close : m);
  writeFileSync(f, html);
  console.log('gesynchroniseerd: ' + sp.file);
}

