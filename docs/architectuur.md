# Architectuurkeuze

## Keuze: headless (Netlify frontend + Shopify Storefront API)
Conform jouw voorkeur. Shopify blijft **bron van waarheid** voor producten,
varianten, prijzen, voorraad, kortingen, winkelwagen, klanten, bestellingen,
checkout, betalingen en verzending. De frontend levert presentatie + SEO.

### Waarom deze opzet
- **Snelheid/CWV:** statische HTML + één CSS-bestand + minimale JS → uitstekende
  LCP/CLS/INP zonder zware Shopify-thema-apps.
- **Geen dubbele database, geen onveilige betaalstroom:** prijzen en cart via
  Storefront API; checkout op Shopify.
- **Onderhoud:** commerciële voorwaarden staan centraal in `assets/js/config.js`;
  content-pagina's via `gen.mjs` met één gedeelde header/footer.

### Belangrijke principes (uit de opdracht)
- Geen hardcoded prijzen — `assets/js/shopify.js` haalt ze live op.
- Geen dubbele productdatabase.
- Checkout blijft Shopify (veilig).
- Webhooks (optioneel) voor cache-invalidatie bij productwijzigingen.

### Wanneer NIET headless
Als het beheer voor het team te complex wordt, is "Optie A" (bestaand Shopify-
thema verbeteren met dezelfde design-tokens en secties) een valide alternatief.
De volledige `styles.css` en de contentblokken zijn zo opgezet dat ze ook als
Liquid-secties herbruikbaar zijn.

## Datastroom (bestellen op factuur — geen checkout)
```
Bezoeker → Netlify (statische HTML/CSS/JS)
             │  data-shopify-handle → Storefront API (prijs "vanaf", alleen tonen)
             │  "Bestel op factuur" → /.netlify/functions/create-invoice
             ▼
        Shopify Admin API → Draft Order → factuur naar klant
        (aanvraag → drukproef → akkoord → factuur → productie → levering)
```
Bewuste keuze: **geen online betaling/checkout**. Betaling verloopt op factuur.
De Admin-token staat alleen server-side (Netlify function).

## Meting (aanbevolen events)
`product_viewed`, `configurator_started`, `logo_uploaded`, `proof_info_viewed`,
`quantity_selected`, `add_to_cart`, `checkout_started`, `purchase`,
`quote_submitted`, `whatsapp_clicked`. Koppel via GA4/GTM of Shopify-analytics.
