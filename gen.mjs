/* Eenvoudige statische generator: gedeelde header/footer + per-pagina content.
   Genereert /<slug>/index.html. Nav & footer staan HIER één keer (single source). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { EN_PAGES, EN_PRODUCTS, EN_KB, EN_KB_CATS } from './content-en.mjs';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');
const writeFileSync2 = (out, html) => { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, html); };

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
const CTA_ICO = '<svg class="btn__ico" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a6.5 6.5 0 0 0-2.9 12.32V16a1 1 0 0 0 1 1h3.8a1 1 0 0 0 1-1v-1.68A6.5 6.5 0 0 0 12 2Zm-1.8 7.2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm2.3 2a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm.5-3.3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/><path d="M9.6 18h4.8l-.4 2.2a1 1 0 0 1-1 .8h-2a1 1 0 0 1-1-.8L9.6 18Z"/></svg>';

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
    ctaConfig:'Start de configurator →', waLabel:'WhatsApp Mark'
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
    ctaConfig:'Open the configurator →', waLabel:'WhatsApp Mark'
  }
};

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
const HEAD = (t, d, nlCanon, lang='nl', extra='') => {
  const u = UI[lang];
  const canon = SITE + pfx(lang) + nlCanon;
  return `<!doctype html>
<html lang="${u.htmlLang}"><head>
<script>document.documentElement.className+=' js';</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${canon}">
<link rel="alternate" hreflang="nl" href="${SITE}${nlCanon}">
<link rel="alternate" hreflang="en" href="${SITE}${enHref(nlCanon)}">
<link rel="alternate" hreflang="x-default" href="${SITE}${nlCanon}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta property="og:type" content="website"><meta property="og:site_name" content="MrGolfbal.nl"><meta property="og:locale" content="${u.ogLocale}">
<meta property="og:title" content="${t}"><meta property="og:description" content="${d}">
<meta property="og:url" content="${canon}"><meta property="og:image" content="https://mrgolfbal.nl/assets/img/og-home.jpg">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${t}"><meta name="twitter:description" content="${d}"><meta name="twitter:image" content="https://mrgolfbal.nl/assets/img/og-home.jpg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css?v=4">
${siteLD(lang)}${extra}</head><body>`;
};

// Taalswitcher: linkt altijd naar beide talen van DEZE pagina (nlCanon = NL-pad).
const langSwitch = (nlCanon, lang) => `<div class="lang-switch">
  <a href="${nlCanon}"${lang==='nl'?' aria-current="true"':''} hreflang="nl" lang="nl">NL</a>
  <a href="${enHref(nlCanon)}"${lang==='en'?' aria-current="true"':''} hreflang="en" lang="en">EN</a>
</div>`;

const HEADER = (lang='nl', nlCanon='/') => {
  const u = UI[lang], p = pfx(lang);
  return `
<header class="site-header"><div class="container header-bar">
  <a class="logo" href="${p}/"><b>Mr<span>Golfbal</span>.nl</b><small>by Mark Reynolds</small></a>
  <nav class="main-nav" aria-label="${u.menu}">
    <div class="has-dropdown"><a href="${p}/golfballen-bedrukken/">${u.kopen} ▾</a><div class="dropdown">
      <div class="dd-head">${u.ddKopen}</div>
      <a href="${p}/golfballen-bedrukken/">${u.bedrukte}</a>
      <a href="${p}/titleist-golfballen-bedrukken/">${u.titleist}</a>
      <a href="${p}/pinnacle-golfballen-bedrukken/">${u.pinnacle}</a>
      <a href="${p}/onbedrukte-golfballen/">${u.onbedrukt}</a>
      <a href="${p}/golfballen-personaliseren/">${u.personaliseren}</a>
    </div></div>
    <div class="has-dropdown"><a href="${p}/golfballen-bedrukken-voor-bedrijven/">${u.toepassingen} ▾</a><div class="dropdown">
      <div class="dd-head">${u.ddToep}</div>
      <a href="${p}/golfballen-bedrukken-voor-bedrijven/">${u.voorBedrijven}</a>
      <a href="${p}/golfballen-bedrukken-voor-golfclubs-en-toernooien/">${u.voorClubs}</a>
      <a href="${p}/kennisbank/bedrukte-golfballen-als-relatiegeschenk/">${u.relatiegeschenk}</a>
      <a href="${p}/kennisbank/golfballen-voor-je-bedrijfsgolfdag/">${u.bedrijfsgolfdag}</a>
    </div></div>
    <a href="${p}/golfbalkiezer/">${u.welke}</a>
    <a href="${p}/contact/">${u.contact}</a>
  </nav>
  <div class="header-actions">
    ${langSwitch(nlCanon, lang)}
    <a class="icon-btn" href="https://wa.me/31627411925" aria-label="${u.waLabel}"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg></a>
    <a class="btn btn--primary" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.startCta}</a>
  </div>
</div></header>`;
};

const crumbs = (name, lang='nl') => `<div class="container"><nav class="crumbs"><a href="${pfx(lang)}/">${UI[lang].home}</a> › <span>${name}</span></nav></div>`;

const heroBlock = (eyebrow, h1, sub, cta1, cta1href='/golfballen-bedrukken/#configurator', lang='nl') => {
  const u = UI[lang], p = pfx(lang);
  const H = (href) => href.startsWith('/') ? p + href : href;
  const cta = cta1 || u.startCta;
  const withIco = /#configurator/.test(cta1href) || cta === u.startCta;
  return `
<section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3.2rem)">
  <div class="hero-copy"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p>${sub}</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="${H(cta1href)}">${withIco?CTA_ICO:''}${cta} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="${p}/contact/">${u.heroAdvice}</a></div></div>
  <div class="hero-visual"><div class="ballshot"><div class="ball"><span class="logo-print">${u.jouw}<br><span>${u.logo}</span></span></div></div></div>
</div></section>`;
};

const ctaBlock = (lang='nl') => {
  const u = UI[lang], p = pfx(lang);
  return `
<section class="section"><div class="container"><div class="divider-cta">
  <p class="eyebrow" style="color:var(--color-blue)">${u.ctaEye}</p>
  <h2>${u.ctaH}</h2>
  <p>${u.ctaP}</p>
  <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.ctaConfig}</a><a class="btn btn--light btn--lg" href="${p}/contact/">${u.heroAdvice}</a></div>
</div></div></section>`;
};

const FOOTER = (lang='nl') => {
  const u = UI[lang], p = pfx(lang);
  return `
<footer class="site-footer"><div class="container">
  <div class="footer-cta">
    <div><h3>${u.footCtaH}</h3><p>${u.footCtaP}</p></div>
    <a class="btn btn--primary btn--xl" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.footCtaBtn}</a>
  </div>
  <div class="footer-grid">
    <div class="footer-col footer-brand"><b>Mr<span>Golfbal</span>.nl</b><p style="margin-top:.7rem;max-width:32ch">${u.footBrandP}</p><p style="margin-top:.6rem"><a href="tel:+31627411925">+31 6 27 41 19 25</a><br><a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a><br><a href="https://wa.me/31627411925">WhatsApp Mark</a></p></div>
    <div class="footer-col"><h4>${u.footGolf}</h4><ul><li><a href="${p}/golfballen-bedrukken/">${u.fGolfBedrukken}</a></li><li><a href="${p}/onbedrukte-golfballen/">${u.fOnbedrukt}</a></li><li><a href="${p}/titleist-golfballen-bedrukken/">Titleist</a></li><li><a href="${p}/pinnacle-golfballen-bedrukken/">Pinnacle</a></li><li><a href="${p}/golfballen-personaliseren/">${u.fPerson}</a></li></ul></div>
    <div class="footer-col"><h4>${u.footWie}</h4><ul><li><a href="${p}/golfballen-bedrukken-voor-bedrijven/">${u.voorBedrijven}</a></li><li><a href="${p}/golfballen-bedrukken-voor-golfclubs-en-toernooien/">${u.voorClubs}</a></li><li><a href="${p}/golfbalkiezer/">${u.fKiezer}</a></li><li><a href="${p}/kennisbank/">${u.fKennisbank}</a></li><li><a href="${p}/zo-werkt-het/">${u.fZoWerkt}</a></li></ul></div>
    <div class="footer-col"><h4>${u.footService}</h4><ul><li><a href="${p}/over-mark/">${u.fOverMark}</a></li><li><a href="${p}/contact/">${u.contact}</a></li><li><a href="/policies/shipping-policy">${u.fVerzending}</a></li><li><a href="/policies/refund-policy">${u.fRetour}</a></li><li><a href="/policies/privacy-policy">${u.fPrivacy}</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 MrGolfbal.nl · KVK 27326866</span><span class="pay-badges"><span>${u.badge1}</span><span>${u.badge2}</span></span></div>
</div></footer>
<a class="wa-float" href="https://wa.me/31627411925" aria-label="WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg></a>
<script src="/assets/js/site.js?v=4" defer></script>
</body></html>`;
};

// o = { title, desc, canon(NL-pad), crumb, hero(HTML), main(HTML), extra? }
const page = (o, lang='nl') => HEAD(o.title, o.desc, o.canon, lang,
  breadcrumbLD([{name:UI[lang].home,url:'/'},{name:o.crumb,url:o.canon}], lang) + (o.extra||'')
) + HEADER(lang, o.canon) + crumbs(o.crumb, lang) + localize(o.hero, lang) + localize(o.main, lang) + ctaBlock(lang) + FOOTER(lang);

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

const PAGES = [];

/* ---------------- TITLEIST BEDRUKKEN ---------------- */
PAGES.push({
  slug:'titleist-golfballen-bedrukken',
  title:'Titleist golfballen bedrukken met logo | MrGolfbal.nl',
  desc:'Titleist golfballen bedrukken met je logo of tekst — Pro V1, Pro V1x, TruFeel en AVX. Originele ballen, digitale drukproef vooraf, vanaf 144 stuks.',
  canon:'/titleist-golfballen-bedrukken/', crumb:'Titleist golfballen bedrukken',
  hero:heroBlock('Titleist bedrukken','Titleist golfballen bedrukken met jouw <span>logo of tekst</span>','Laat originele Titleist-golfballen bedrukken met je bedrijfs- of clublogo. Van de toursbal Pro V1 tot de zachte TruFeel — altijd eerst een digitale drukproef.'),
  main:`
<section class="section"><div class="container" style="max-width:920px">
  <p class="lead">Titleist is het meest gespeelde balmerk op tour. Met een bedrukte Titleist geef je een relatiegeschenk of clubbal met echte status. Wij bedrukken uitsluitend originele Titleist-ballen en laten je vóór productie een digitale drukproef zien.</p>
</div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Modellen</p><h2>Welke Titleist wil je laten bedrukken?</h2></div>
  <div class="grid grid-4" style="margin-top:1.5rem">
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1 — bedrukt</h3><p class="card__meta">Toursniveau, zacht gevoel, hoge green-spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">Pro V1x — bedrukt</h3><p class="card__meta">Hogere vlucht, steviger, extra spin.</p><div class="card__price" data-shopify-handle="titleist-pro-v1x">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-pro-v1x">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">TruFeel — bedrukt</h3><p class="card__meta">Extra zacht en scherp geprijsd.</p><div class="card__price" data-shopify-handle="titleist-trufeel-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-trufeel-met-bedrukking">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">AVX — bedrukt</h3><p class="card__meta">Zacht gevoel, lage vlucht en spin.</p><div class="card__price" data-shopify-handle="titleist-avx-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-avx-met-bedrukking">Bekijk &amp; bedruk</a></div></article>
  </div></div></section>
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Vergelijking</p><h2>Titleist-modellen vergelijken</h2><p class="lead">Kies op basis van speelgevoel en doelgroep. Twijfel je? Mark adviseert je graag.</p></div>${compareTable('nl')}
  <p class="muted" style="font-size:.85rem;margin-top:.8rem">Baleigenschappen op basis van fabrikantinformatie en praktijkervaring.</p></div></section>
<section class="section section--sky"><div class="container"><div class="grid grid-3">
  <div class="feature"><h3>Vanaf 144 golfballen</h3><p>Minimale afname 144 stuks; staffelkorting bij grotere aantallen.</p></div>
  <div class="feature"><h3>Digitale drukproef</h3><p>Altijd eerst een proef. Productie start na jouw akkoord.</p></div>
  <div class="feature"><h3>Levertijd 5–15 werkdagen</h3><p>Na goedkeuring van de drukproef. <span class="confirm-tag">bevestigen</span></p></div>
</div></div></section>`
});

/* ---------------- PINNACLE BEDRUKKEN ---------------- */
PAGES.push({
  slug:'pinnacle-golfballen-bedrukken',
  title:'Pinnacle golfballen bedrukken (Soft &amp; Rush) | MrGolfbal.nl',
  desc:'Pinnacle golfballen bedrukken met je logo — Pinnacle Soft en Pinnacle Rush. Scherp geprijsd, groot bedrukoppervlak, ideaal voor golfdagen en grote oplages.',
  canon:'/pinnacle-golfballen-bedrukken/', crumb:'Pinnacle golfballen bedrukken',
  hero:heroBlock('Pinnacle bedrukken','Pinnacle golfballen bedrukken met jouw <span>logo</span>','Pinnacle Soft en Rush zijn scherp geprijsd en perfect voor golfdagen, toernooien en grote oplages met bedrijfslogo.'),
  main:`
<section class="section"><div class="container" style="max-width:920px"><p class="lead">Pinnacle biedt een uitstekende prijs-kwaliteitverhouding en een groot, egaal oppervlak dat zich goed leent voor bedrukking. Ideaal wanneer je veel golfballen met logo nodig hebt zonder in te leveren op merkkwaliteit.</p></div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Modellen</p><h2>Pinnacle Soft vs. Pinnacle Rush</h2></div>
  <div class="grid grid-2" style="margin-top:1.5rem">
    <div class="feature"><span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Soft</h3><p>Zacht gevoel en een aangename feel bij de korte spelonderdelen. Populair voor golfdagen en relatiegeschenken met scherpe prijs.</p><a class="btn btn--primary" href="/products/pinnacle-soft-met-bedrukking">Bekijk &amp; bedruk</a></div>
    <div class="feature"><span class="badge">Pinnacle</span><h3 style="margin-top:.6rem">Pinnacle Rush</h3><p>Stevige kern gericht op extra afstand. Een prettige toernooibal die er met jouw logo verzorgd uitziet.</p><a class="btn btn--primary" href="/products/pinnacle-rush-met-bedrukking">Bekijk &amp; bedruk</a></div>
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
    <div class="feature"><h3>Offerte &amp; planning</h3><p>Zakelijke afhandeling met offerte en levering op een afgesproken datum. <span class="confirm-tag">voorwaarden bevestigen</span></p></div>
  </div></div></section>
<section class="section section--sky" id="offerte"><div class="container" style="max-width:820px">
  <div class="section-head"><p class="eyebrow">Offerte op maat</p><h2>Vraag een zakelijke offerte aan</h2><p class="lead">Vul je gegevens in — Mark reageert doorgaans binnen 24 uur met een voorstel en drukproefplanning.</p></div>
  <form class="mt-1" onsubmit="event.preventDefault();this.querySelector('.ok').style.display='block';">
    <div class="grid grid-2"><div class="field"><label>Bedrijfsnaam</label><input required></div><div class="field"><label>Naam</label><input required></div></div>
    <div class="grid grid-2"><div class="field"><label>E-mailadres</label><input type="email" required></div><div class="field"><label>Telefoon</label><input></div></div>
    <div class="grid grid-2"><div class="field"><label>Gewenst merk</label><select><option>Titleist</option><option>Pinnacle</option><option>Weet ik nog niet</option></select></div><div class="field"><label>Gewenst model</label><input placeholder="Bijv. Pro V1"></div></div>
    <div class="grid grid-2"><div class="field"><label>Aantal (dozen of ballen)</label><input placeholder="Bijv. 288"></div><div class="field"><label>Gewenste leverdatum</label><input type="date"></div></div>
    <div class="field"><label>Logo uploaden</label><input type="file" accept=".eps,.ai,.pdf,.png,.jpg"></div>
    <div class="field"><label>Bedrukking &amp; toelichting</label><textarea rows="3" placeholder="1–2 of 3–5 kleuren, één/twee zijden, bijzonderheden"></textarea></div>
    <button class="btn btn--primary btn--lg" type="submit">Verstuur offerteaanvraag →</button>
    <p class="ok" style="display:none;color:var(--success);margin-top:1rem">Bedankt! Je aanvraag is verstuurd (demo). Koppel dit formulier aan je e-mail/CRM in productie.</p>
  </form>
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
  <p class="lead reveal">We werken met originele <strong>Titleist</strong> en <strong>Pinnacle</strong> golfballen. Vertel ons welk model en welk aantal je zoekt, dan stelt Mark een passende offerte op. <span class="confirm-tag">beschikbare modellen &amp; aantallen bevestigen</span></p>
  <div class="row" style="margin-top:1rem"><a class="btn btn--primary btn--lg" href="/contact/">Vraag een offerte aan →</a><a class="btn btn--ghost btn--lg" href="https://wa.me/31627411925">Overleg via WhatsApp</a></div>
</div></section>`
});

/* ---------------- ZO WERKT HET ---------------- */
PAGES.push({
  slug:'zo-werkt-het',
  title:'Zo werkt golfballen bedrukken — stap voor stap | MrGolfbal.nl',
  desc:'Van model kiezen en logo uploaden tot digitale drukproef en levering. Zo werkt het bedrukken van golfballen bij MrGolfbal.nl, stap voor stap.',
  canon:'/zo-werkt-het/', crumb:'Zo werkt het',
  hero:heroBlock('Zo werkt het','Golfballen bedrukken in <span>vier heldere stappen</span>','Geen gedoe met bestanden of verrassingen achteraf. Je beslist pas definitief nadat je de digitale drukproef hebt goedgekeurd.'),
  main:`
<section class="section"><div class="container"><div class="steps grid grid-2" style="gap:1rem">
  <div class="step"><div class="num"></div><div><h3>Kies je golfbal</h3><p>Selecteer merk en model dat past bij je doelgroep en budget. Twijfel je? Gebruik de golfbalkiezer of vraag Mark.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Upload je logo of tekst</h3><p>Lever je ontwerp aan, bij voorkeur als vectorbestand (EPS, AI of PDF). Of typ een naam/tekst in de configurator.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Keur de digitale drukproef goed</h3><p>Je ontvangt een digitale proef van het logo op de bal. Pas na jouw akkoord start de productie.</p></div></div>
  <div class="step"><div class="num"></div><div><h3>Ontvang je bedrukte golfballen</h3><p>Levering in 5–15 werkdagen na goedkeuring van de drukproef.</p></div></div>
</div>
<div class="mt-2"><a class="btn btn--primary btn--lg" href="/golfballen-bedrukken/#configurator">Start nu →</a></div>
</div></section>
<section class="section section--sky"><div class="container" style="max-width:820px"><div class="section-head"><p class="eyebrow">Goed voorbereid</p><h2>Je logo aanleveren</h2></div>
  <p class="lead">Voor het scherpste resultaat lever je je logo aan als vectorbestand (EPS, AI of PDF). Heb je alleen een JPEG of PNG? Vaak kunnen we daar iets mee — Mark laat het je weten en helpt met de opmaak. <span class="confirm-tag">bestandstypen bevestigen</span></p></div></section>`
});

/* ---------------- OVER MARK ---------------- */
PAGES.push({
  slug:'over-mark',
  title:'Over Mark Reynolds — PGA-professional &amp; oprichter | MrGolfbal.nl',
  desc:'Maak kennis met Mark Reynolds, PGA-golfprofessional en oprichter van MrGolfbal.nl. Persoonlijk advies over golfballen, bedrukking en de juiste keuze per doelgroep.',
  canon:'/over-mark/', crumb:'Over Mark',
  hero:heroBlock('Over de oprichter','Mark Reynolds — <span>PGA-professional</span> &amp; oprichter','MrGolfbal.nl combineert originele merkballen met het advies van een golfprofessional. Mark helpt je de juiste bal én de juiste bedrukking te kiezen.','Neem contact op met Mark','/contact/'),
  main:`
<section class="section"><div class="container" style="max-width:920px">
  <p class="lead">Mark Reynolds is golfprofessional en de oprichter van MrGolfbal.nl. Vanuit jarenlange ervaring op en rond de baan weet hij welke bal bij welke golfer past — en hoe je een logo strak en herkenbaar op die bal krijgt.</p>
  <p>Die combinatie maakt het verschil: je koopt niet zomaar bedrukte golfballen, maar krijgt advies van iemand die het spel door en door kent. Van de keuze tussen een Pro V1 en Pro V1x tot de beste bedrukking voor jouw doelgroep.</p>
  <div class="notice">De onderstaande gegevens komen van de bestaande website en worden <strong>door de klant bevestigd</strong> vóór publicatie. <span class="confirm-tag">claims verifiëren</span></div>
  <div class="grid grid-2 mt-2" style="gap:1.5rem">
    <div class="feature"><h3>Achtergrond</h3><p>PGA Golf Professional sinds 1995, met meerdere professionele overwinningen.</p></div>
    <div class="feature"><h3>Prestaties (te bevestigen)</h3><p>Dutch PGA Order of Merit (2005, 2009, 2018), beste Nederlander KLM Open 2018, European PGA Team Championship 2019, PGA Cup 2005.</p></div>
    <div class="feature"><h3>Waarom MrGolfbal.nl</h3><p>Originele merkballen combineren met persoonlijk, deskundig advies — voor golfers, bedrijven en clubs.</p></div>
    <div class="feature"><h3>Persoonlijk contact</h3><p>Vragen over balkeuze of je logo? Mark is bereikbaar via telefoon en WhatsApp.</p></div>
  </div>
</div></section>`
});

/* ---------------- CONTACT ---------------- */
PAGES.push({
  slug:'contact',
  title:'Contact — persoonlijk advies van Mark | MrGolfbal.nl',
  desc:'Neem contact op met MrGolfbal.nl. Persoonlijk advies over golfballen bedrukken, je logo of een spoedbestelling — via e-mail, telefoon of WhatsApp.',
  canon:'/contact/', crumb:'Contact',
  hero:heroBlock('Contact','Persoonlijk advies? <span>Mark helpt je</span>','Vragen over golfballen bedrukken, je logo-opmaak of een spoedbestelling? Neem gerust contact op — we reageren doorgaans binnen 24 uur.','Stuur een WhatsApp','https://wa.me/31627411925'),
  main:`
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
    <form class="mt-1" onsubmit="event.preventDefault();this.querySelector('.ok').style.display='block';">
      <div class="field"><label>Naam</label><input required></div>
      <div class="field"><label>Onderwerp</label><select><option>Offerteaanvraag</option><option>Digitale drukproef</option><option>Onbedrukte golfballen (grote aantallen)</option><option>Hulp bij bestellen</option><option>Algemene vraag</option></select></div>
      <div class="field"><label>E-mailadres</label><input type="email" required></div>
      <div class="field"><label>Bericht</label><textarea rows="5" required></textarea></div>
      <button class="btn btn--primary btn--lg" type="submit">Verstuur bericht →</button>
      <p class="ok" style="display:none;color:var(--success);margin-top:1rem">Bedankt! Je bericht is verstuurd (demo). Koppel dit formulier in productie aan je e-mail/CRM.</p>
    </form>
  </div>
</div></div></section>`
});

/* ---------------- GOLFBALKIEZER (keuzehulp) ---------------- */
PAGES.push({
  slug:'golfbalkiezer',
  title:'Golfbalkiezer — welke golfbal past bij jou? | MrGolfbal.nl',
  desc:'Doe de golfbalkiezer en ontvang in enkele vragen maximaal 3 persoonlijke aanbevelingen voor de juiste (bedrukte) golfbal, op basis van doel, niveau en budget.',
  canon:'/golfbalkiezer/', crumb:'Golfbalkiezer',
  hero:heroBlock('Keuzehulp','Golfbalkiezer — <span>welke bal past bij jou?</span>','Beantwoord een paar korte vragen. Je krijgt maximaal drie aanbevelingen met uitleg, gebaseerd op doel, niveau en budget. Twijfel je? Mark denkt met je mee.','Start de kiezer','#kiezer'),
  main:`
<section class="section" id="kiezer"><div class="container" style="max-width:820px">
  <form id="quiz" class="stack">
    ${[
      ['q1','Voor wie zijn de golfballen?',['Mijn bedrijf','Een golfclub','Een toernooi/golfdag','Mezelf of als cadeau']],
      ['q2','Waarvoor worden ze gebruikt?',['Relatiegeschenk','Bedrijfsgolfdag','Toernooi/wedstrijd','Eigen spel','Persoonlijk cadeau']],
      ['q3','Wat is het niveau van de golfers?',['Beginnend','Recreatief','Gevorderd','Laag handicap / (bijna) pro']],
      ['q4','Wat is het budget per bal?',['Scherp geprijsd','Gemiddeld','Premium — kwaliteit voorop']],
      ['q5','Welke uitstraling is gewenst?',['Zo premium mogelijk','Neutraal / goede middenweg','Vooral scherp geprijsd']],
      ['q6','Hoeveel golfballen heb je nodig?',['144–288','288–576','576 of meer']],
      ['q7','Is bedrukking nodig?',['Ja, met logo/tekst','Nee, onbedrukt']],
      ['q8','Wat is de gewenste levertijd?',['Ruim de tijd','Normaal','Spoed']],
    ].map(([id,q,opts])=>`
    <div class="feature"><h3>${q}</h3><div class="pill-row">
      ${opts.map((o,i)=>`<label class="badge" style="cursor:pointer"><input type="radio" name="${id}" value="${o}" ${i===0?'checked':''} style="margin-right:.4rem">${o}</label>`).join('')}
    </div></div>`).join('')}
    <button class="btn btn--primary btn--lg" type="submit">Toon mijn aanbevelingen →</button>
  </form>
  <div id="result" style="margin-top:2rem"></div>
</div></section>
<script>
(function(){
  var P = {
    'Titleist Pro V1':{brand:'Titleist',href:'/products/titleist-pro-v1',blurb:'Toursbal: zacht gevoel, penetrerende vlucht, hoge green-spin.',tags:{premium:3,laag:3,controle:3,cadeau:2}},
    'Titleist Pro V1x':{brand:'Titleist',href:'/products/titleist-pro-v1x',blurb:'Hogere vlucht en meer spin, iets steviger gevoel.',tags:{premium:3,laag:3,controle:2,hoogte:3}},
    'Titleist AVX':{brand:'Titleist',href:'/products/titleist-avx',blurb:'Zacht gevoel met lagere vlucht en spin.',tags:{premium:2,controle:2,laag:2}},
    'Titleist TruFeel':{brand:'Titleist',href:'/products/titleist-trufeel',blurb:'Extra zacht en scherper geprijsd; fijne allround merkbal.',tags:{recreatief:3,scherp:2,cadeau:2}},
    'Titleist Velocity':{brand:'Titleist',href:'/products/titleist-velocity',blurb:'Snel en lang, hoge vlucht, lage spin.',tags:{afstand:3,recreatief:2}},
    'Pinnacle Soft':{brand:'Pinnacle',href:'/products/pinnacle-soft-met-bedrukking',blurb:'Zacht en scherp geprijsd; groot bedrukoppervlak.',tags:{scherp:3,recreatief:3,oplage:3,cadeau:2}},
    'Pinnacle Rush':{brand:'Pinnacle',href:'/products/pinnacle-rush-met-bedrukking',blurb:'Stevige kern gericht op afstand; prettige toernooibal.',tags:{afstand:3,scherp:2,oplage:2}}
  };
  var MAP = {
    'Laag handicap / (bijna) pro':{laag:3,controle:2,premium:2}, 'Gevorderd':{controle:2,premium:1,hoogte:1},
    'Recreatief':{recreatief:2,scherp:1}, 'Beginnend':{recreatief:2,scherp:2,afstand:1},
    'Scherp geprijsd':{scherp:3,oplage:1}, 'Gemiddeld':{recreatief:1}, 'Premium — kwaliteit voorop':{premium:3,controle:1},
    'Zo premium mogelijk':{premium:3}, 'Neutraal / goede middenweg':{recreatief:1}, 'Vooral scherp geprijsd':{scherp:3},
    '144–288':{}, '288–576':{oplage:1}, '576 of meer':{oplage:3,scherp:1},
    'Relatiegeschenk':{premium:2,cadeau:2}, 'Bedrijfsgolfdag':{oplage:2,scherp:1}, 'Toernooi/wedstrijd':{afstand:1,oplage:1},
    'Eigen spel':{controle:1}, 'Persoonlijk cadeau':{cadeau:3,premium:1}
  };
  document.getElementById('quiz').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target), boost={};
    for(var v of fd.values()){ var m=MAP[v]||{}; for(var k in m){ boost[k]=(boost[k]||0)+m[k]; } }
    var scores=Object.keys(P).map(function(name){
      var s=0,t=P[name].tags; for(var k in t){ s += (boost[k]||0)*t[k]; } return {name:name,score:s};
    }).sort(function(a,b){return b.score-a.score;});
    var top=scores.slice(0,3);
    var html='<div class="section-head"><p class="eyebrow">Onze aanbeveling</p><h2>Deze golfballen passen bij jou</h2></div><div class="grid grid-3" style="margin-top:1rem">';
    top.forEach(function(r,i){ var p=P[r.name];
      html+='<article class="card"><div class="card__body"><span class="card__brand">'+p.brand+(i===0?' · beste match':'')+'</span><h3 class="card__title">'+r.name+'</h3><p class="card__meta">'+p.blurb+'</p><a class="btn btn--primary btn--block" href="'+p.href+'">Bekijk dit model</a></div></article>';
    });
    html+='</div><p class="muted" style="margin-top:1rem">Advies indicatief, op basis van je antwoorden en algemene baleigenschappen. Voor maatwerk: <a href="/contact/">vraag Mark</a>.</p>';
    var el=document.getElementById('result'); el.innerHTML=html; el.scrollIntoView({behavior:'smooth'});
  });
})();
</script>`
});

// ---- schrijf pagina's (NL op root, EN onder /en/) ----
for (const p of PAGES) {
  writeFileSync2(join(root, p.slug, 'index.html'), page(p, 'nl'));
  console.log('generated /' + p.slug + '/');
  const e = EN_PAGES[p.slug];
  if (e) {
    const eo = { title:e.title, desc:e.desc, canon:p.canon, crumb:e.crumb,
      hero: e.hero || heroBlock(e.he, e.hh1, e.hsub, e.hcta, e.hhref || '/golfballen-bedrukken/#configurator', 'en'),
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
  <div class="hero-visual" style="order:2"><div class="ballshot"><div class="ball"><span class="logo-print">${u.jouw}<br><span>${u.logo}</span></span></div></div></div>
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
<section class="section"><div class="container"><div class="grid grid-2" style="gap:2.5rem;align-items:start">
  <div>
    <div class="section-head"><p class="eyebrow">${t.propsEye}</p><h2>${t.propsH}</h2></div>
    <table class="staffel" style="margin-top:1rem"><tbody>
      <tr><td>${t.tFeel}</td><td style="text-align:right"><strong>${feel}</strong></td></tr>
      <tr><td>${t.tFlight}</td><td style="text-align:right"><strong>${flight}</strong></td></tr>
      <tr><td>${t.tSpin}</td><td style="text-align:right"><strong>${spin}</strong></td></tr>
      <tr><td>${t.tTarget}</td><td style="text-align:right"><strong>${target}</strong></td></tr>
    </tbody></table>
    <p class="muted" style="font-size:.82rem;margin-top:.7rem">${t.qualNote} <span class="confirm-tag">${t.confirmSpecs}</span></p>
  </div>
  <div>
    <div class="section-head"><p class="eyebrow">${t.orderEye}</p><h2>${t.orderH(p.name)}</h2></div>
    <div class="stack mt-1">
      <div class="feature"><h3>${t.printH}</h3><p>${t.printP} <span class="confirm-tag">${t.confirm}</span></p></div>
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
    <article class="card"><div class="card__body"><span class="card__brand">${x.brand}</span><h3 class="card__title">${x.name}</h3><p class="card__meta">${pf(x,lang,'feel')} · ${pf(x,lang,'flight')}</p><a class="btn btn--primary btn--block" href="${pre}/products/${x.handle}/">${t.viewModel}</a></div></article>`).join('')}
  </div></div></section>` + ctaBlock(lang) + FOOTER(lang);
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
  <p>Lever bij voorkeur aan als <strong>EPS, AI of PDF</strong> (vector). Zorg dat lettertypes zijn omgezet naar lettercontouren (outlines), zodat de tekst er bij ons exact zo uitziet als bij jou. Een PNG met transparante achtergrond in hoge resolutie is een acceptabel alternatief voor eenvoudige logo's. <span class="confirm-tag">exacte lijst bevestigen</span></p>
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
  <p>Bij spotkleuren kies je concrete, afgebakende kleuren (bijvoorbeeld je twee huisstijlkleuren). Full-colour of fotoprints met verlopen zijn op een bol, klein oppervlak lastiger en niet altijd beschikbaar. <span class="confirm-tag">foto/full-colour bevestigen</span> Wil je een foto of ontwerp met verloop laten bedrukken? Leg het ons voor, dan bekijken we samen wat mogelijk is.</p>
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
  <p>De bedrukking wordt professioneel op de originele merkbal aangebracht — het is nadrukkelijk géén sticker. Daardoor houdt de opdruk normaal gebruik op de baan goed door. <span class="confirm-tag">exacte slijtvastheid door klant bevestigen</span></p>
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
  <p>Denk aan verkoop in de clubshop, een cadeau bij een nieuw lidmaatschap, prijzen bij wedstrijden of een presentje bij een clubevenement. Een bal met clublogo blijft in omloop en houdt je club zichtbaar.</p>
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
    <div class="kb-body">${localize(body, lang)}</div>
  </div></article>
  ${kbRelated(lang)}` + ctaBlock(lang) + FOOTER(lang);
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
  ${byCat}` + ctaBlock(lang) + FOOTER(lang);
}

for (const lang of LANGS) {
  const base = lang==='en' ? join(root,'en','kennisbank') : join(root,'kennisbank');
  writeFileSync2(join(base,'index.html'), kbHubPage(lang));
  for (const a of KB){ writeFileSync2(join(base,a.slug,'index.html'), kbArticlePage(a, lang)); }
  console.log('generated '+(lang==='en'?'/en':'')+'/kennisbank/ + '+KB.length+' articles');
}
console.log('TOTAL', KB.length, 'kennisbank articles + hub (NL+EN)');

/* =================== SITEMAP (NL + EN met hreflang-alternatieven) =================== */
{
  // Alle NL root-paden met prioriteit. EN = /en + pad. Homepage/hub zijn handgebouwd.
  const urls = [
    ['/', '1.0'], ['/golfballen-bedrukken/', '0.9'],
    ...PAGES.map(p => [p.canon, p.slug==='golfbalkiezer'?'0.6':'0.8']),
    ...PRODUCTS.map(p => [`/products/${p.handle}/`, '0.7']),
    ['/kennisbank/', '0.7'],
    ...KB.map(a => [`/kennisbank/${a.slug}/`, '0.6']),
  ];
  const entry = (path, prio) => {
    const nl = SITE + path, en = SITE + enHref(path);
    const alts = `<xhtml:link rel="alternate" hreflang="nl" href="${nl}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${nl}"/>`;
    return `  <url><loc>${nl}</loc>${alts}<priority>${prio}</priority></url>\n  <url><loc>${en}</loc>${alts}<priority>${prio}</priority></url>`;
  };
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Automatisch gegenereerd door gen.mjs — NL + EN met hreflang-alternatieven.
     Shopify product-/collectie-sitemaps kunnen via een sitemap-index worden samengevoegd. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(([p, pr]) => entry(p, pr)).join('\n')}
</urlset>\n`;
  writeFileSync2(join(root, 'sitemap.xml'), xml);
  console.log('generated sitemap.xml (' + (urls.length*2) + ' urls, NL+EN)');
}
