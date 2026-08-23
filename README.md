# MrGolfbal.nl — Headless frontend (Netlify + Shopify Storefront)

Productieklare, snelle frontend voor MrGolfbal.nl. Shopify blijft de bron van
waarheid voor producten, prijzen, voorraad, winkelwagen en checkout; deze
frontend levert de premium presentatie en SEO.

## Architectuur (kort)
- **Frontend:** statische HTML + één design-system CSS + vanilla JS. Geen zware
  build, uitstekende Core Web Vitals. Deploybaar op Netlify.
- **Catalogus/prijzen/cart/checkout:** Shopify **Storefront API** (`assets/js/shopify.js`).
  Prijzen worden **live** opgehaald en nooit hardcoded.
- **Content-pagina's** worden gegenereerd met `gen.mjs` (gedeelde header/footer =
  single source). `index.html` en `golfballen-bedrukken/index.html` zijn met de
  hand geschreven (hero + configurator).
- Volledige onderbouwing: `docs/architectuur.md`.

## Mappen
```
index.html                      Homepage
golfballen-bedrukken/           Primaire SEO-hub + configurator
<slug>/index.html               Kernpagina's (gegenereerd via gen.mjs)
assets/css/styles.css           Design system (huisstijl-tokens)
assets/js/config.js             ⭐ Centrale config: álle commerciële voorwaarden
assets/js/shopify.js            Storefront API: prijzen + cart
_redirects                      301-redirectmap (kannibalisatie)
sitemap.xml / robots.txt        SEO-basis
netlify.toml                    Netlify build/headers
qa.mjs                          Release-gate (placeholders, dubbele H1/title, …)
docs/                           Strategie: consolidatie, keywordmap, tegenstrijdigheden
preview/                        Self-contained previews (CSS inline) voor snel bekijken
```

## Lokaal draaien
```bash
node gen.mjs            # (her)genereer content-pagina's
node build-preview.mjs  # self-contained previews in ./preview
node qa.mjs             # kwaliteitscontrole (faalt bij placeholders etc.)
npx serve .             # of een andere statische server
```

## Deployen op Netlify
1. Push deze map naar een GitHub-repo.
2. Netlify → **Add new site → Import from GitHub**.
3. Build command: `node gen.mjs && node build-preview.mjs` · Publish directory: `.`
4. **Environment variables** (Site settings → Environment):
   - `PUBLIC_SHOPIFY_DOMAIN` = `mrgolfbal.myshopify.com`
   - `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` = *(Storefront API token — alleen prijzen tonen)*
   - `SHOPIFY_ADMIN_DOMAIN` = `mrgolfbal.myshopify.com`  *(server-side, voor facturen)*
   - `SHOPIFY_ADMIN_TOKEN` = *(Admin API token, scope `write_draft_orders`)*
5. Domein `mrgolfbal.nl` koppelen (verhuis DNS naar Netlify).

## Bestellen op factuur (geen online checkout)
Op verzoek is er **geen afrekenstap**. De flow is:
`aanvraag → digitale drukproef → akkoord → factuur → productie → levering`.
De configurator en het offerteformulier sturen de aanvraag naar
`netlify/functions/create-invoice.js`, die server-side een Shopify **Draft Order**
aanmaakt en (optioneel) direct de **factuur** verstuurt. De Admin-token staat
uitsluitend server-side. Storefront wordt alleen gebruikt om prijzen te tónen.

> Storefront-token maak je in Shopify admin → **Settings → Apps and sales
> channels → Develop apps → Create app → Storefront API**. Geef alleen
> lees-scopes voor producten/prijzen + cart-scopes.

## Belangrijk: nog te bevestigen vóór livegang
Zoek in de code op `⚠ BEVESTIGEN` en `confirm-tag`. Zie `docs/tegenstrijdigheden.md`
voor de volledige lijst (minimale afname, levertijd, kleuren/full-colour,
bestandstypen, staffelbedragen, claims over Mark).
