/* Eenvoudige statische generator: gedeelde header/footer + per-pagina content.
   Genereert /<slug>/index.html. Nav & footer staan HIER één keer (single source). */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/, '');

const HEAD = (t, d, canon, extra='') => `<!doctype html>
<html lang="nl"><head>
<script>document.documentElement.className+=' js';</script>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="https://mrgolfbal.nl${canon}">
<meta property="og:type" content="website"><meta property="og:title" content="${t}"><meta property="og:description" content="${d}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/styles.css">
${extra}</head><body>`;

const markChip = `<a class="mark-chip" href="/over-mark/" title="Over Mark Reynolds — PGA-professional">
  <span class="arrow">↳</span>
  <span class="avatar"><svg viewBox="0 0 26 26" fill="none"><circle cx="13" cy="9" r="4" fill="#072943"/><path d="M5 22c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#072943"/><line x1="19" y1="5" x2="24" y2="2" stroke="#53c2fe" stroke-width="1.6" stroke-linecap="round"/></svg></span>
  <span>Mark&nbsp;Reynolds</span></a>`;

const HEADER = `
<header class="site-header"><div class="container header-bar">
  <div class="brand-wrap">
    <a class="logo" href="/"><b>Mr<span>Golfbal</span>.nl</b></a>
    ${markChip}
  </div>
  <nav class="main-nav" aria-label="Hoofdmenu">
    <a href="/golfballen-bedrukken/">Golfballen bedrukken</a>
    <a href="/onbedrukte-golfballen/">Onbedrukt</a>
    <a href="/golfballen-bedrukken-voor-bedrijven/">Voor bedrijven &amp; clubs</a>
    <a href="/contact/">Contact</a>
  </nav>
  <div class="header-actions">
    <a class="icon-btn" href="https://wa.me/31627411925" aria-label="WhatsApp Mark"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg></a>
    <a class="btn btn--primary" href="/golfballen-bedrukken/#configurator">Start met bedrukken</a>
  </div>
</div></header>`;

const crumbs = (name) => `<div class="container"><nav class="crumbs"><a href="/">Home</a> › <span>${name}</span></nav></div>`;

const heroBlock = (eyebrow, h1, sub, cta1='Start met bedrukken', cta1href='/golfballen-bedrukken/#configurator') => `
<section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3.2rem)">
  <div class="hero-copy"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p>${sub}</p>
    <div class="hero-cta"><a class="btn btn--primary btn--lg" href="${cta1href}">${cta1} <span class="btn__arrow">→</span></a>
    <a class="btn btn--light btn--lg" href="/contact/">Vraag advies aan Mark</a></div></div>
  <div class="hero-visual"><div class="ballshot"><div class="ball"><span class="logo-print">JOUW<br><span>LOGO</span></span></div></div></div>
</div></section>`;

const ctaBlock = `
<section class="section"><div class="container"><div class="divider-cta">
  <p class="eyebrow" style="color:var(--color-blue)">Klaar om te starten?</p>
  <h2>Bedruk je golfballen met logo, tekst of ontwerp</h2>
  <p>Kies je model, upload je logo en ontvang eerst een digitale drukproef.</p>
  <div class="row" style="justify-content:center;margin-top:1.4rem"><a class="btn btn--primary btn--lg" href="/golfballen-bedrukken/#configurator">Start de configurator →</a><a class="btn btn--light btn--lg" href="/contact/">Vraag advies aan Mark</a></div>
</div></div></section>`;

const FOOTER = `
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div class="footer-col footer-brand"><b>Mr<span>Golfbal</span>.nl</b><p style="margin-top:.7rem;max-width:32ch">Originele golfballen — bedrukt met jouw logo of blanco in grote aantallen. Persoonlijk advies van PGA-professional Mark Reynolds.</p><p style="margin-top:.6rem"><a href="tel:+31627411925">+31 6 27 41 19 25</a><br><a href="mailto:info@mrgolfbal.nl">info@mrgolfbal.nl</a><br><a href="https://wa.me/31627411925">WhatsApp Mark</a></p></div>
    <div class="footer-col"><h4>Golfballen</h4><ul><li><a href="/golfballen-bedrukken/">Golfballen bedrukken</a></li><li><a href="/onbedrukte-golfballen/">Onbedrukt (grote aantallen)</a></li><li><a href="/titleist-golfballen-bedrukken/">Titleist</a></li><li><a href="/pinnacle-golfballen-bedrukken/">Pinnacle</a></li><li><a href="/golfballen-personaliseren/">Personaliseren</a></li></ul></div>
    <div class="footer-col"><h4>Voor wie</h4><ul><li><a href="/golfballen-bedrukken-voor-bedrijven/">Voor bedrijven</a></li><li><a href="/golfballen-bedrukken-voor-golfclubs-en-toernooien/">Voor clubs &amp; toernooien</a></li><li><a href="/golfbalkiezer/">Golfbalkiezer</a></li><li><a href="/zo-werkt-het/">Zo werkt het</a></li></ul></div>
    <div class="footer-col"><h4>Service</h4><ul><li><a href="/over-mark/">Over Mark</a></li><li><a href="/contact/">Contact</a></li><li><a href="/policies/shipping-policy">Verzending</a></li><li><a href="/policies/refund-policy">Retour</a></li><li><a href="/policies/privacy-policy">Privacy</a></li></ul></div>
  </div>
  <div class="footer-bottom"><span>© 2026 MrGolfbal.nl · KVK 27326866</span><span class="pay-badges"><span>Digitale drukproef vooraf</span><span>Offerte op maat</span></span></div>
</div></footer>
<a class="wa-float" href="https://wa.me/31627411925" aria-label="WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 .9c.2.1.4.2.4.3.1.2.1.9-.1 1.5Z"/></svg></a>
<script src="/assets/js/site.js" defer></script>
</body></html>`;

const page = (o) => HEAD(o.title, o.desc, o.canon, o.extra||'') + HEADER + crumbs(o.crumb) + o.hero + o.main + ctaBlock + FOOTER;

// ---- modelvergelijkingstabel (herbruikbaar) ----
const compareTable = `
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
<section class="section"><div class="container"><div class="section-head"><p class="eyebrow">Vergelijking</p><h2>Titleist-modellen vergelijken</h2><p class="lead">Kies op basis van speelgevoel en doelgroep. Twijfel je? Mark adviseert je graag.</p></div>${compareTable}
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

// ---- schrijf pagina's ----
for (const p of PAGES) {
  const html = page(p);
  const out = join(root, p.slug, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log('generated /' + p.slug + '/');
}
console.log('TOTAL', PAGES.length, 'content pages');

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

const productPage = (p) => HEAD(
  `${p.name} bedrukken met logo | MrGolfbal.nl`,
  `${p.name} golfballen bedrukken met je logo of tekst. Originele ${p.brand}-ballen, vanaf 144 stuks, digitale drukproef vooraf en een offerte op maat.`,
  `/products/${p.handle}/`,
  `<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'Product',name:p.name,brand:{'@type':'Brand',name:p.brand},
    category:'Golfballen bedrukken',
    description:`${p.name} golfballen bedrukt met logo of tekst. ${p.blurb}`
    // Offer/price: koppel live uit Shopify (geen hardcoded prijs). Zie README.
  })}</script>`
) + HEADER +
`<div class="container"><nav class="crumbs"><a href="/">Home</a> › <a href="${p.merkUrl}">${p.brand} bedrukken</a> › <span>${p.name}</span></nav></div>
<section class="hero" style="padding-block:0"><div class="container" style="padding-block:clamp(2rem,4vw,3rem)">
  <div class="hero-visual" style="order:2"><div class="ballshot"><div class="ball"><span class="logo-print">JOUW<br><span>LOGO</span></span></div></div></div>
  <div class="hero-copy">
    <p class="eyebrow">${p.brand} bedrukken</p>
    <h1>${p.name} bedrukken met jouw <span>logo of tekst</span></h1>
    <p>${p.blurb}</p>
    <div class="hero-cta">
      <a class="btn btn--primary btn--lg" href="/golfballen-bedrukken/#configurator">Digitale drukproef &amp; offerte ontvangen <span class="btn__arrow">→</span></a>
    </div>
    <div class="hero-trust"><span>✓ Origineel ${p.brand}</span><span>✓ Vanaf 144 stuks</span><span>✓ Drukproef vooraf</span><span>✓ Offerte op maat</span></div>
  </div>
</div></section>
<section class="section"><div class="container"><div class="grid grid-2" style="gap:2.5rem;align-items:start">
  <div>
    <div class="section-head"><p class="eyebrow">Eigenschappen</p><h2>Speelgevoel &amp; doelgroep</h2></div>
    <table class="staffel" style="margin-top:1rem"><tbody>
      <tr><td>Gevoel</td><td style="text-align:right"><strong>${p.feel}</strong></td></tr>
      <tr><td>Balvlucht</td><td style="text-align:right"><strong>${p.flight}</strong></td></tr>
      <tr><td>Spin</td><td style="text-align:right"><strong>${p.spin}</strong></td></tr>
      <tr><td>Geschikt voor</td><td style="text-align:right"><strong>${p.target}</strong></td></tr>
    </tbody></table>
    <p class="muted" style="font-size:.82rem;margin-top:.7rem">Kwalitatieve weergave op basis van fabrikantinformatie en praktijkervaring. <span class="confirm-tag">exacte specificaties bevestigen</span></p>
  </div>
  <div>
    <div class="section-head"><p class="eyebrow">Bedrukking &amp; bestellen</p><h2>Zo bestel je ${p.name} bedrukt</h2></div>
    <div class="stack mt-1">
      <div class="feature"><h3>Bedrukking</h3><p>Logo, tekst, naam of ontwerp in 1 tot 5 kleuren (spotkleuren). Eén zijde standaard; tweede zijde op aanvraag. <span class="confirm-tag">bevestigen</span></p></div>
      <div class="feature"><h3>Minimale afname</h3><p>Vanaf 144 golfballen; grotere aantallen zijn voordeliger. Je ontvangt een offerte op maat.</p></div>
      <div class="feature"><h3>Drukproef &amp; offerte</h3><p>Je ontvangt eerst een digitale drukproef en een offerte. Productie start na jouw akkoord. Levertijd 5–15 werkdagen.</p></div>
    </div>
    <a class="btn btn--primary btn--block btn--lg mt-1" href="/golfballen-bedrukken/#configurator">Digitale drukproef &amp; offerte ontvangen →</a>
  </div>
</div></div></section>
<section class="section section--sky"><div class="container"><div class="section-head"><p class="eyebrow">Vergelijk</p><h2>${p.name} vs. andere modellen</h2></div>${compareTable}
  <div class="mt-2"><a class="btn btn--ghost" href="${p.merkUrl}">Alle ${p.brand} bedrukte golfballen →</a></div>
</div></section>
<section class="section"><div class="container"><div class="section-head section-head--center"><p class="eyebrow">Ook interessant</p><h2>Gerelateerde bedrukte golfballen</h2></div>
  <div class="grid grid-3" style="margin-top:1.5rem">
    ${PRODUCTS.filter(x=>x.handle!==p.handle && x.brand===p.brand).slice(0,3).map(x=>`
    <article class="card"><div class="card__body"><span class="card__brand">${x.brand}</span><h3 class="card__title">${x.name}</h3><p class="card__meta">${x.feel} · ${x.flight}</p><a class="btn btn--primary btn--block" href="/products/${x.handle}/">Bekijk model</a></div></article>`).join('')}
  </div></div></section>` + ctaBlock + FOOTER;

for (const p of PRODUCTS) {
  const out = join(root, 'products', p.handle, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, productPage(p));
  console.log('generated /products/' + p.handle + '/');
}
console.log('TOTAL', PRODUCTS.length, 'product pages');
