/* Eenvoudige statische generator: gedeelde header/footer + per-pagina content.
   Genereert /<slug>/index.html. Nav & footer staan HIER één keer (single source). */
import { writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { EN_PAGES, EN_PRODUCTS, EN_KB, EN_KB_CATS } from './content-en.mjs';
import { TOEPASSINGEN } from './content-toepassingen/index.mjs';
import { PILLARS } from './content-pillars/index.mjs';
import { EXTRA, EXTRA_PRODUCTS } from './content-extra/index.mjs';
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
    golfballenNav:'Golfballen', golfles:'Golfles', trickshow:'Trickshow', golfrepairs:'Golf repairs', belBtn:'Bel Mark', waBtn:'WhatsApp', qrHint:'Scan met je telefoon om te appen',
    topUsp1:'Gratis digitale drukproef vooraf', topUsp2:'Originele Titleist &amp; Pinnacle', topUsp3:'Advies van PGA-professional', belLabel:'Bel direct'
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
    topUsp1:'Free digital proof first', topUsp2:'Original Titleist &amp; Pinnacle', topUsp3:'Advice from a PGA professional', belLabel:'Call now'
  }
};

// ---- Icoon-set (inline SVG, currentColor) — voor USP's, features en secties ----
const ICONS = {
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
<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="icon" href="/assets/img/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/assets/img/favicon-16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/css/styles.css?v=9">
${siteLD(lang)}${extra}</head><body>`;
};

// Taalswitcher: linkt altijd naar beide talen van DEZE pagina (nlCanon = NL-pad).
const langSwitch = (nlCanon, lang) => `<div class="lang-switch">
  <a href="${nlCanon}"${lang==='nl'?' aria-current="true"':''} hreflang="nl" lang="nl">NL</a>
  <a href="${enHref(nlCanon)}"${lang==='en'?' aria-current="true"':''} hreflang="en" lang="en">EN</a>
</div>`;

// WhatsApp-icoon + contactknoppen (bellen + WhatsApp met desktop-QR).
const WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg>';
const contactBtns = (lang='nl') => { const u = UI[lang]; return `<div class="contact-btns">
    <a class="cbtn cbtn--call" href="tel:+31627411925">${ico('phone','')}<span>${u.belBtn}</span></a>
    <div class="wa-wrap">
      <a class="cbtn cbtn--wa" href="https://wa.me/31627411925" data-wa aria-haspopup="dialog">${WA_ICON}<span>${u.waBtn}</span></a>
      <div class="wa-qr" role="dialog" aria-label="WhatsApp QR" hidden><img src="/assets/img/wa-qr.png" width="150" height="150" alt="QR-code — WhatsApp MrGolfbal" loading="lazy"><p>${u.qrHint}</p></div>
    </div>
  </div>`; };

// Topbar met USP's, social proof en belknop.
const TOPBAR = (lang='nl') => {
  const u = UI[lang];
  return `<div class="topbar"><div class="container topbar-in">
    <ul class="topbar-usps">
      <li>${ico('check','tb-ico')}${u.topUsp1}</li>
      <li>${ico('shield','tb-ico')}${u.topUsp2}</li>
      <li>${ico('star','tb-ico')}${u.topUsp3}</li>
    </ul>
    <div class="topbar-right">
      <span class="topbar-proof">${ico('users','tb-ico')}<strong>${u.klanten}</strong></span>
      ${contactBtns(lang)}
    </div>
  </div></div>`;
};

const HEADER = (lang='nl', nlCanon='/') => {
  const u = UI[lang], p = pfx(lang);
  return `<div class="site-top">${TOPBAR(lang)}
<header class="site-header"><div class="container header-bar">
  <a class="logo" href="${p}/"><b>Mr<span>Golfbal</span>.nl</b><small>by Mark Reynolds</small></a>
  <nav class="main-nav" aria-label="${u.menu}">
    <a href="${p}/">${u.home}</a>
    <div class="has-dropdown"><a href="${p}/golfballen-bedrukken/">${u.golfballenNav} ▾</a><div class="dropdown">
      <div class="dd-head">${u.ddKopen}</div>
      <a href="${p}/golfballen-bedrukken/">${u.bedrukte}</a>
      <a href="${p}/titleist-golfballen-bedrukken/">${u.titleist}</a>
      <a href="${p}/pinnacle-golfballen-bedrukken/">${u.pinnacle}</a>
      <a href="${p}/onbedrukte-golfballen/">${u.onbedrukt}</a>
      <a href="${p}/golfballen-personaliseren/">${u.personaliseren}</a>
      <div class="dd-head">${lang==='en'?'More':'Meer'}</div>
      <a href="${p}/toepassingen/">${u.alleToep}</a>
      <a href="${p}/golfbalkiezer/">${u.welke}</a>
      <a href="${p}/golf-repairs/">${u.golfrepairs}</a>
      <a href="${p}/over-mark/">${u.overons}</a>
    </div></div>
    <a href="${p}/golfles/">${u.golfles}</a>
    <a href="${p}/golfshows/">${u.trickshow}</a>
    <a href="${p}/golftrips/">${u.golftrips}</a>
    <a href="${p}/contact/">${u.contact}</a>
  </nav>
  <div class="header-actions">
    ${langSwitch(nlCanon, lang)}
    <a class="btn btn--primary" href="${p}/golfballen-bedrukken/#configurator">${CTA_ICO}${u.startCta}</a>
  </div>
</div></header></div>`;
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
const faqBlock = (items, lang='nl') => {
  const eye = lang==='en' ? 'FAQ' : 'Veelgestelde vragen';
  const h = lang==='en' ? 'Frequently asked questions' : 'Veelgestelde vragen';
  const ld = `<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity: items.map(([q,a])=>({'@type':'Question',name:q.replace(/<[^>]+>/g,''),acceptedAnswer:{'@type':'Answer',text:a.replace(/<[^>]+>/g,'')}}))
  })}</script>`;
  return `<section class="section section--sky"><div class="container" style="max-width:860px"><div class="section-head accent-line"><p class="eyebrow">${eye}</p><h2>${h}</h2></div>
    <div class="faq" style="margin-top:1.4rem">
    ${items.map(([q,a],i)=>`<details${i===0?' open':''}><summary>${q}</summary><div class="faq-body">${a}</div></details>`).join('')}
    </div>${ld}
  </div></section>`;
};

// Gedeelde FAQ over bedrukken (met FAQPage-schema) — voor elke bedruk-pagina.
const printingFaq = (lang='nl') => faqBlock(lang==='en' ? [
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
], lang);

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
};
const BALLS_DIR = join(root, 'assets', 'img', 'balls');
const titleize = (b) => b.replace(/[-_]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase());
const BALL_IMAGES = (() => {
  let files = [];
  try { files = readdirSync(BALLS_DIR); } catch { return []; }
  return files
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map(f => {
      const base = f.replace(/\.[^.]+$/, '');
      const alt = ALT_MAP[base];
      return {
        src: f,
        nl: alt ? alt.nl : `Bedrukte golfbal — ${titleize(base)} | MrGolfbal.nl`,
        en: alt ? alt.en : `Printed golf ball — ${titleize(base)} | MrGolfbal.nl`,
      };
    });
})();
console.log(`foto's gevonden in assets/img/balls/: ${BALL_IMAGES.length}`);
const ballGallery = (seed=0, lang='nl', n=5) => {
  if (!BALL_IMAGES.length) return ''; // geen foto's aanwezig = geen galerij
  const en = lang==='en';
  const picks = Array.from({length:Math.min(n, BALL_IMAGES.length)}, (_,i)=> BALL_IMAGES[(seed+i)%BALL_IMAGES.length]);
  const head = en ? 'Companies and customers who print their logo golf balls at MrGolfbal.nl' : 'Bedrijven en klanten die hun golfballen met logo bij MrGolfbal.nl laten bedrukken';
  const cells = picks.map(img => `<figure><img src="/assets/img/balls/${img.src}" width="500" height="500" loading="lazy" decoding="async" alt="${img[lang]}"></figure>`).join('');
  return `<section class="section section--sky"><div class="container"><div class="section-head section-head--center accent-line" style="margin-inline:auto"><p class="eyebrow">${en?'Real customers':'Echte klanten'}</p><h2>${head}</h2></div>
    <div class="ballgallery">${cells}</div>
  </div></div></section>`;
};

// Deterministische seed per pagina, zodat elke pagina een andere (niet-herhalende) fotoset krijgt.
const seedOf = (s='') => Array.from(String(s)).reduce((a,c)=>a + c.charCodeAt(0), 0);

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

const PAY_ICONS = `
<span class="pay-ico" title="iDEAL"><svg viewBox="0 0 46 16" role="img" aria-label="iDEAL"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="700" font-style="italic" fill="currentColor">iDEAL</text></svg></span>
<span class="pay-ico" title="Bancontact"><svg viewBox="0 0 33 16" role="img" aria-label="Bancontact"><path d="M1 13 l7 -10 h8 l-7 10 z" fill="currentColor"/><path d="M15 13 l7 -10 h8 l-7 10 z" fill="currentColor" opacity=".55"/></svg></span>
<span class="pay-ico" title="Visa"><svg viewBox="0 0 44 16" role="img" aria-label="Visa"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" font-style="italic" fill="currentColor">VISA</text></svg></span>
<span class="pay-ico" title="Mastercard"><svg viewBox="0 0 22 16" role="img" aria-label="Mastercard"><circle cx="7" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="15" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".7"/></svg></span>
<span class="pay-ico" title="Maestro"><svg viewBox="0 0 22 16" role="img" aria-label="Maestro"><circle cx="7" cy="8" r="6.4" fill="currentColor" opacity=".45"/><circle cx="15" cy="8" r="6.4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span>
<span class="pay-ico" title="PayPal"><svg viewBox="0 0 58 16" role="img" aria-label="PayPal"><text x="0" y="13" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="800" font-style="italic" fill="currentColor">PayPal</text></svg></span>
<span class="pay-ico" title="Apple Pay"><svg viewBox="0 0 44 16" role="img" aria-label="Apple Pay"><g transform="translate(-5.2,-2.6) scale(1.35)" fill="currentColor"><path d="M9.4 5.4c-.3.4-.8.7-1.3.6-.1-.5.2-1 .4-1.3.3-.4.8-.6 1.2-.7.1.5-.1 1-.3 1.4Zm.3.7c-.7 0-1.3.4-1.6.4-.3 0-.8-.4-1.4-.4-.7 0-1.4.4-1.7 1.1-.7 1.3-.2 3.1.5 4.1.4.5.8 1 1.3 1 .5 0 .7-.3 1.4-.3.6 0 .8.3 1.4.3.6 0 .9-.5 1.3-1 .3-.4.4-.7.6-1.1-1.5-.6-1.3-2.7.1-3.2-.4-.5-1-.8-1.4-.8Z"/></g><text x="11.5" y="13" font-family="Arial,Helvetica,sans-serif" font-size="14" font-weight="600" fill="currentColor">Pay</text></svg></span>`;

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
    <div class="footer-col"><h4>${lang==='en'?'Services':'Diensten'}</h4><ul><li><a href="${p}/golfles/">${u.golfles}</a></li><li><a href="${p}/golfshows/">${u.trickshow}</a></li><li><a href="${p}/golftrips/">${u.golftrips}</a></li><li><a href="${p}/golf-repairs/">${u.golfrepairs}</a></li></ul></div>
    <div class="footer-col"><h4>${u.footService}</h4><ul><li><a href="${p}/over-mark/">${u.fOverMark}</a></li><li><a href="${p}/contact/">${u.contact}</a></li><li><a href="${p}/kennisbank/">${u.fKennisbank}</a></li><li><a href="/policies/shipping-policy">${u.fVerzending}</a></li><li><a href="/policies/privacy-policy">${u.fPrivacy}</a></li></ul></div>
  </div>
  <div class="footer-pay"><span class="footer-pay__lbl">${lang==='en'?'Secure payment':'Veilig betalen'}</span><span class="pay-row">${PAY_ICONS}</span></div>
  <div class="footer-bottom"><span>© 2026 MrGolfbal.nl · KVK 27326866</span><span class="pay-badges"><span>${u.badge1}</span><span>${u.badge2}</span></span></div>
</div></footer>
<script src="https://elfsightcdn.com/platform.js" async></script>
<script src="/assets/js/site.js?v=9" defer></script>
</body></html>`;
};

// o = { title, desc, canon(NL-pad), crumb, hero(HTML), main(HTML), extra? }
const page = (o, lang='nl') => HEAD(o.title, o.desc, o.canon, lang,
  breadcrumbLD([{name:UI[lang].home,url:'/'},{name:o.crumb,url:o.canon}], lang) + (o.extra||'')
) + HEADER(lang, o.canon) + crumbs(o.crumb, lang) + localize(o.hero, lang) + localize(o.main, lang)
  + extraSections(o.slug, lang)
  + ballGallery(seedOf(o.canon || o.slug || ''), lang)
  + (o.noBlocks ? '' : howItWorks(lang) + whyUs(lang) + reviewsBlock(lang) + printingFaq(lang))
  + socialsBlock(lang)
  + ctaBlock(lang) + FOOTER(lang);

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
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">TruFeel — bedrukt</h3><p class="card__meta">Extra zacht en scherp geprijsd.</p><div class="card__price" data-shopify-handle="titleist-trufeel-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-trufeel">Bekijk &amp; bedruk</a></div></article>
    <article class="card"><div class="card__media"><div class="ballshot" style="border-radius:0"><div class="ball" style="width:52%"><span class="logo-print" style="font-size:.8rem">LOGO</span></div></div></div><div class="card__body"><span class="card__brand">Titleist</span><h3 class="card__title">AVX — bedrukt</h3><p class="card__meta">Zacht gevoel, lage vlucht en spin.</p><div class="card__price" data-shopify-handle="titleist-avx-met-bedrukking">Prijs op aanvraag</div><a class="btn btn--primary btn--block" href="/products/titleist-avx">Bekijk &amp; bedruk</a></div></article>
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
<section class="section section--sky" id="offerte"><div class="container" style="max-width:1000px">
  <div class="section-head accent-line"><p class="eyebrow">Offerte op maat</p><h2>Vraag een zakelijke offerte aan</h2><p class="lead">Vul je gegevens in — Mark reageert doorgaans binnen 24 uur met een voorstel, staffelprijs en drukproefplanning. Geen online afrekenen: alles netjes op factuur.</p></div>
  <div class="grid grid-2" style="margin-top:1.4rem;align-items:start;gap:1.6rem">
    <form class="feature" style="padding:1.6rem" onsubmit="event.preventDefault();var ok=this.querySelector('.ok');ok.style.display='block';ok.scrollIntoView({behavior:'smooth',block:'center'});">
      <div class="form-grid">
        <div class="field"><label>Bedrijfsnaam *</label><input required></div>
        <div class="field"><label>Naam *</label><input required></div>
        <div class="field"><label>E-mailadres *</label><input type="email" required></div>
        <div class="field"><label>Telefoon</label><input type="tel"></div>
        <div class="field"><label>Gewenst merk</label><select><option>Titleist</option><option>Pinnacle</option><option>Weet ik nog niet</option></select></div>
        <div class="field"><label>Gewenst model</label><input placeholder="Bijv. Pro V1"></div>
        <div class="field"><label>Aantal (ballen of dozen)</label><input placeholder="Bijv. 288"></div>
        <div class="field"><label>Gewenste leverdatum</label><input type="date"></div>
        <div class="field full"><label>Bedrukking &amp; toelichting</label><textarea rows="3" placeholder="1–2 of 3–5 kleuren, één of twee zijden, bijzonderheden"></textarea></div>
      </div>
      <div class="upload-field"><label class="dropzone" for="offerteLogo"><svg class="dz-ico" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg><strong>Logo uploaden (optioneel)</strong><span class="muted">EPS, AI of PDF · of stuur je logo later na</span><input type="file" id="offerteLogo" accept=".eps,.ai,.pdf,.svg,.png,.jpg,.jpeg"></label></div>
      <button class="btn btn--primary btn--lg btn--block" type="submit">${CTA_ICO}Verstuur offerteaanvraag →</button>
      <p class="muted" style="font-size:.82rem;margin:.7rem 0 0;text-align:center">We reageren doorgaans binnen 24 uur. Je gegevens gebruiken we uitsluitend voor je aanvraag.</p>
      <p class="ok" style="display:none;color:var(--success);margin-top:1rem;font-weight:600">Bedankt! Je aanvraag is verstuurd (demo). Koppel dit formulier in productie aan je e-mail/CRM.</p>
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

/* ---------------- GOLFLES ---------------- */
PAGES.push({
  slug:'golfles',
  title:'Golfles Badhoevedorp bij PGA-pro Mark | MrGolfbal.nl',
  desc:'Golfles bij PGA-golfprofessional Mark Reynolds op The International in Badhoevedorp. Voor beginners, gevorderden, junioren en clinics bij Amsterdam. Boek je les.',
  canon:'/golfles/', crumb:'Golfles', noBlocks:true,
  hero:heroBlock('Golfles','Golfles bij een <span>echte PGA-professional</span>','Leer golfen of verbeter je swing bij Mark Reynolds op The International in Badhoevedorp, op een steenworp van Amsterdam en Schiphol. Voor elk niveau, van eerste swing tot lage handicap.','Plan je golfles','/contact/'),
  main:`
<section class="section"><div class="container"><div class="prose">
<h2>Golfles op The International in Badhoevedorp</h2>
<p>Wil je leren golfen, of speel je al jaren maar wil je die frustrerende slice er eindelijk uit? Bij MrGolfbal.nl krijg je golfles van Mark Reynolds, PGA-golfprofessional sinds 1995. Sinds 2014 geeft hij les op The International golfclub in Badhoevedorp, ideaal gelegen tussen Amsterdam, Amstelveen, Haarlem en Schiphol. Of je nu voor het eerst een club vastpakt of je spel flink wilt aanscherpen: hier vind je een gecertificeerde professional die precies weet hoe hij jou vooruit helpt.</p>
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
<p>Omdat de lessen op The International in Badhoevedorp worden gegeven, heb je alle faciliteiten binnen handbereik: een uitstekende driving range, oefengreens en een prachtige baan waar je het geleerde meteen in de praktijk brengt. De ligging vlak bij Amsterdam en Schiphol maakt golfles hier goed bereikbaar, of je nu uit de stad komt of uit de regio Haarlemmermeer.</p>
<h2>Waarom golfles bij Mark Reynolds?</h2>
<p>Ervaring maakt het verschil, en die heeft Mark ruimschoots. Hij groeide op in Maltby bij Rotherham in Engeland en begon op zijn zestiende met zijn PGA-opleiding onder Simon Thornhill op Rotherham Golf Club. In 2000 verhuisde hij naar Nederland om les te geven, en in 2001 startte hij zijn eigen golfschool. Sindsdien heeft hij honderden golfers van elk niveau beter zien worden.</p>
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
  hero:heroBlock('Golf repairs','Golfclubs repareren door een <span>PGA-professional</span>','Van nieuwe grips tot een compleet nieuwe shaft: laat je golfclubs vakkundig repareren en fitten door Mark Reynolds op The International in Badhoevedorp. Persoonlijk advies, degelijk werk.','Vraag naar de mogelijkheden','/contact/'),
  main:`
<section class="section"><div class="container"><div class="prose">
<h2>Golfclubs repareren: vakwerk dat je in je swing voelt</h2>
<p>Een golfclub is een precisie-instrument. Een versleten grip, een verkeerd afgestelde lie-hoek of een shaft die net niet bij jouw swing past, kost je zomaar meters en zuiverheid. Goede golfclubs hoeven daarom niet meteen te worden vervangen; heel vaak zijn ze prima te repareren en opnieuw op maat te maken. Bij MrGolfbal.nl kun je je golfclubs laten repareren door Mark Reynolds, PGA Golf Professional sinds 1995 en vaste kracht op golfclub The International in Badhoevedorp, vlakbij Amsterdam en Schiphol.</p>
<p>Omdat Mark zowel lesgeeft als clubs repareert, kijkt hij verder dan alleen de reparatie. Hij ziet hoe jij de bal raakt en weet daardoor precies wat jouw materiaal nodig heeft. Repareren en fitten lopen bij hem naadloos in elkaar over, zodat je clubs niet alleen weer heel zijn, maar ook echt bij je passen. Wil je meteen weten wat er mogelijk is voor jouw set? <a href="/contact/">Neem contact op</a> en vraag naar de mogelijkheden.</p>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="prose">
<h2>Grips vervangen op je golfclub</h2>
<p>De grip is het enige contactpunt tussen jou en de club, en tegelijk het onderdeel dat het snelst slijt. Een gladde, verharde of gedraaide grip zorgt ongemerkt voor een te sterke greep en spanning in je onderarmen; precies wat je niet wilt in een vloeiende swing. Regripping, oftewel het vervangen van grips op je golfclub, is dan ook een van de meest waardevolle en betaalbare ingrepen die je kunt laten doen.</p>
<p>Mark helpt je bij het kiezen van de juiste maat en dikte, want een grip die te dun of te dik is, beïnvloedt direct de stand van je clubface bij impact. Of je nu je hele set opnieuw wilt laten gripen of alleen je meest gebruikte ijzers, het kan allemaal. Grips vervangen is bovendien een mooi moment om te kijken of de rest van je club nog in topconditie is. Vraag gerust naar de mogelijkheden en de opties in grips die bij jouw spel passen.</p>
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
  hero:heroBlock('Over ons','Mark Reynolds — <span>PGA-professional</span> &amp; oprichter','Achter MrGolfbal.nl staat een echte golfprofessional. Mark combineert originele merkballen met advies dat verder gaat dan bedrukken: welke bal past bij welke speler, en wat maakt indruk op je gasten.','Neem contact op met Mark','/contact/'),
  main:`
<section class="section"><div class="container"><div class="prose">
  <p class="lead">Mark Reynolds is PGA-golfprofessional en de oprichter van MrGolfbal.nl. Met tientallen jaren ervaring op en rond de baan — als speler én als leraar — weet hij als geen ander welke golfbal bij welke speler past, en hoe je een logo strak en herkenbaar op die bal krijgt.</p>
  <h2>Van Yorkshire naar de Nederlandse fairways</h2>
  <p>Mark werd in 1978 geboren in Maltby, in het Engelse Rotherham, en stond al op zijn vijfde met een golfclub in zijn handen. Op zijn zestiende begon hij zijn PGA-opleiding onder Simon Thornhill op Rotherham Golf Club, en sinds 1995 is hij <strong>PGA Golf Professional</strong>. In 2000 verruilde hij Engeland voor Nederland om les te geven, en in 2001 begon hij zijn eigen golfschool. Sinds 2014 is Mark verbonden aan <strong>The International</strong> in Badhoevedorp bij Amsterdam, waar hij nog altijd lesgeeft en speelt.</p>
  <h2>Prestaties &amp; erkenning</h2>
  <p>Mark is geen coach die alleen aan de kant staat — hij presteert zelf op hoog niveau. Hij won de <strong>Dutch PGA Order of Merit</strong> in 2005, 2009 én 2018, werd Europees kampioen met het <strong>European PGA Team Championship in 2019</strong> en won in 2005 de <strong>PGA Cup</strong> met Groot-Brittannië &amp; Ierland tegen de Verenigde Staten. Hij speelde meerdere edities van het <strong>KLM Open</strong> en was daar in 2018 de best geklasseerde Nederlander. In totaal boekte hij meer dan tien professionele overwinningen.</p>
  <h2>Waarom een PGA-pro achter je golfballen?</h2>
  <p>Die achtergrond maakt het verschil. Bij MrGolfbal.nl koop je niet zomaar bedrukte golfballen — je krijgt advies van iemand die het spel door en door kent. Van de keuze tussen een <a href="/products/titleist-pro-v1/">Pro V1</a> en <a href="/products/titleist-pro-v1x/">Pro V1x</a> tot de beste bal voor een gemengd deelnemersveld op een <a href="/toepassingen/golfballen-bedrijfsgolfdag/">bedrijfsgolfdag</a>: Mark denkt met je mee. Twijfel je? Doe de <a href="/golfbalkiezer/">golfbalkiezer</a> of leg je vraag rechtstreeks aan hem voor.</p>
  <h2>Meer dan bedrukken: golfshows &amp; golftrips</h2>
  <p>Mark is ook een gevierd <a href="/golfshows/">golfshow- en trickshow-artist</a> en begeleidt <a href="/golftrips/">golftrips</a> als PGA-pro. Zo kun je hem niet alleen inschakelen voor bedrukte golfballen, maar ook boeken voor entertainment op je golfdag of een onvergetelijke golfreis — in Nederland, Europa en daarbuiten.</p>
  <h2>Persoonlijk contact</h2>
  <p>Vragen over balkeuze, je logo of een bestelling? Mark is direct bereikbaar via <a href="/contact/">contact</a>, telefoon (<a href="tel:+31627411925">+31 6 27 41 19 25</a>) en <a href="https://wa.me/31627411925">WhatsApp</a>. Persoonlijk, deskundig en zonder omwegen.</p>
</div></div></section>`
});

/* ---------------- CONTACT ---------------- */
PAGES.push({
  slug:'contact',
  title:'Contact — persoonlijk advies van Mark | MrGolfbal.nl',
  desc:'Neem contact op met MrGolfbal.nl. Persoonlijk advies over golfballen bedrukken, je logo of een spoedbestelling — via e-mail, telefoon of WhatsApp.',
  canon:'/contact/', crumb:'Contact', noBlocks:true,
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

/* GOLFBALKIEZER wordt apart gegenereerd via quizPage() (stap-voor-stap quiz). */

// ---- schrijf pagina's (NL op root, EN onder /en/) ----
for (const p of PAGES) {
  writeFileSync2(join(root, p.slug, 'index.html'), page(p, 'nl'));
  console.log('generated /' + p.slug + '/');
  const e = EN_PAGES[p.slug];
  if (e) {
    const eo = { slug:p.slug, noBlocks:p.noBlocks, title:e.title, desc:e.desc, canon:p.canon, crumb:e.crumb,
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
  </div></div></section>`
  + extraSections(p.handle, lang, EXTRA_PRODUCTS)
  + ballGallery(seedOf(p.handle), lang)
  + howItWorks(lang) + whyUs(lang) + reviewsBlock(lang) + printingFaq(lang)
  + socialsBlock(lang)
  + ctaBlock(lang) + FOOTER(lang);
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
  ${kbRelated(lang)}` + ballGallery(seedOf('kb-'+a.slug), lang) + socialsBlock(lang) + ctaBlock(lang) + FOOTER(lang);
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
  ${byCat}` + ballGallery(seedOf('kennisbank-hub'), lang) + socialsBlock(lang) + ctaBlock(lang) + FOOTER(lang);
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
  ${toepRelated(t.related, lang)}` + ballGallery(seedOf('toep-'+t.slug), lang) + reviewsBlock(lang) + socialsBlock(lang) + ctaBlock(lang) + FOOTER(lang);
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
  <section class="section"><div class="container"><div class="toep-grid">${cards}</div></div></section>
  ${whyUs(lang)}${howItWorks(lang)}` + ballGallery(seedOf('toepassingen-hub'), lang) + reviewsBlock(lang) + socialsBlock(lang) + ctaBlock(lang) + FOOTER(lang);
};
for (const lang of LANGS) {
  const base = lang==='en' ? join(root,'en','toepassingen') : join(root,'toepassingen');
  writeFileSync2(join(base,'index.html'), toepHubPage(lang));
  for (const t of TOEPASSINGEN){ writeFileSync2(join(base,t.slug,'index.html'), toepassingPage(t, lang)); }
  console.log('generated '+(lang==='en'?'/en':'')+'/toepassingen/ + '+TOEPASSINGEN.length+' pages');
}
console.log('TOTAL', TOEPASSINGEN.length, 'toepassingen + hub (NL+EN)');

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
  ${t.videoId ? tsHero(t, c, lang) : `<section class="pillar-hero"><div class="container" style="padding-block:clamp(2.6rem,6vw,4.5rem)">
    <p class="eyebrow">${c.eyebrow}</p><h1>${c.h1}</h1><p>${c.lead}</p>
    <div class="hero-cta" style="margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="${p}/contact/">${ico('chat','btn__ico')}${lang==='en'?'Request availability':'Vraag beschikbaarheid aan'} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="https://wa.me/31627411925">${lang==='en'?'WhatsApp Mark':'WhatsApp Mark'}</a></div>
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
  + ballGallery(seedOf('pillar-'+t.slug), lang) + reviewsBlock(lang) + socialsBlock(lang)
  + FOOTER(lang);
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
  ], lang)}` + ballGallery(seedOf('golfbalkiezer'), lang) + socialsBlock(lang) + ctaBlock(lang) + FOOTER(lang);
};
for (const lang of LANGS) {
  const out = lang==='en' ? join(root,'en','golfbalkiezer','index.html') : join(root,'golfbalkiezer','index.html');
  writeFileSync2(out, quizPage(lang));
}
console.log('generated /golfbalkiezer/ + /en/golfbalkiezer/ (stap-voor-stap quiz)');

/* =================== SITEMAP (NL + EN met hreflang-alternatieven) =================== */
{
  // Alle NL root-paden met prioriteit. EN = /en + pad. Homepage/hub zijn handgebouwd.
  const urls = [
    ['/', '1.0'], ['/golfballen-bedrukken/', '0.9'],
    ['/golfbalkiezer/', '0.7'],
    ...PAGES.map(p => [p.canon, '0.8']),
    ...PRODUCTS.map(p => [`/products/${p.handle}/`, '0.7']),
    ['/kennisbank/', '0.7'],
    ...KB.map(a => [`/kennisbank/${a.slug}/`, '0.6']),
    ['/toepassingen/', '0.8'],
    ...TOEPASSINGEN.map(t => [`/toepassingen/${t.slug}/`, '0.7']),
    ...PILLARS.map(t => [`/${t.slug}/`, '0.8']),
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
