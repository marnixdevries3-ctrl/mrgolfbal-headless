# De 10 belangrijkste vervolgstappen

1. **Bevestig de commerciële voorwaarden** (`docs/tegenstrijdigheden.md`):
   minimale afname (144?), levertijd (5–15?), kleuren/full-colour, bestandstypen,
   verzending, Callaway/TaylorMade. Pas daarna `assets/js/config.js` aan.
2. **Verifieer Mark's claims** (PGA sinds 1995, overwinningen, titels). Alleen
   controleerbare claims publiceren; anders neutraler formuleren.
3. **Koppel Shopify Storefront API**: maak een Storefront-token, vul de env-vars,
   controleer dat prijzen ("vanaf …") en de "toevoegen aan winkelwagen" → checkout
   werken. Verifieer de product-handles in de kaarten.
4. **Volledige sitemap-export** uit Shopify admin → maak de consolidatiematrix en
   `_redirects` compleet (vervang alle `# VERIFY`-rijen). Controleer met GSC
   "Pagina's" welke oude URL de meeste vertoningen op "golfballen bedrukken" heeft.
5. **Zet de 301-redirects live** (via `_redirects` op Netlify óf Shopify URL
   Redirects als je op Shopify blijft). Test op chains met een crawler.
6. **Voeg echte media toe**: macrofoto's van bedrukte ballen, drukproef-
   voorbeelden, foto van Mark, klantcases. Optimaliseer naar AVIF/WebP met
   sprekende bestandsnamen en alt-teksten.
7. **Echte reviews & cases** verzamelen en pas dán Review/AggregateRating-
   structured data toevoegen (nooit zonder zichtbare, controleerbare bron).
8. **Configurator → cart** afmaken: koppel de configuratiekeuzes (model, aantal,
   bedrukking, tekst, upload-referentie) als line-item attributes aan de
   Storefront cart; upload-bestanden veilig (niet openbaar) opslaan.
9. **Meting inrichten** (GA4/GTM): de events uit `docs/architectuur.md`, plus
   conversie per SEO-landingspagina en omzet per merk/toepassing.
10. **Uitbreiden na fase 1**: productpagina's per model (veel long-tail
    vertoningen), golfbalkiezer, blog-consolidatie, en een aparte
    golfhandschoenen-categorie (honderden vertoningen laten liggen).

## Later meten (na livegang)
Lighthouse mobiel (streef Performance ≥90, SEO 100), CWV in Search Console,
CTR-verbetering op "golfballen bedrukken" (nu 3 klikken op 1.812 vertoningen).
