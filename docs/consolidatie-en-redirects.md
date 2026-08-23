# Consolidatiematrix & redirectstrategie

## Primaire URL-keuze voor "golfballen bedrukken"
Kandidaten (waargenomen): `/pages/golfballen-laten-bedrukken` (staat in de
hoofdnavigatie en is de huidige rankende pagina), plus diverse
`/collections/...bedrukken`-varianten.

**Gekozen primaire URL: `/golfballen-bedrukken/`** (nieuw, schone hub-URL).
Reden: kort, exact op de intentie, en combineert content + configurator +
merken + toepassingen op één sterke pagina. De oude
`/pages/golfballen-laten-bedrukken` (met bestaande autoriteit) wordt met **301**
doorgestuurd, zodat linkwaarde meegaat. De home-H1 mikt op de variant
"golfballen **laten** bedrukken" om overlap te vermijden.

> Advies: bevestig de keuze met GSC "Pagina's"-export (welke oude URL de 1.812
> vertoningen op "golfballen bedrukken" ontvangt). Ontvangt een `/collections/…`
> die vertoningen, overweeg dan die als 301-bron met de meeste waarde.

## Consolidatiematrix (waargenomen + te verifiëren)
| Oude URL | Zoekintentie | Nieuwe hoofd-URL | Actie |
|----------|--------------|------------------|-------|
| /pages/golfballen-laten-bedrukken | golfballen bedrukken | /golfballen-bedrukken/ | 301 + inhoud opnemen |
| /pages/titleist-golfballen-bedrukken | titleist bedrukken | /titleist-golfballen-bedrukken/ | 301 |
| /collections/titleist-golfballen-bedrukken | titleist bedrukken | /titleist-golfballen-bedrukken/ | 301 |
| /collections/titleist-pro-v1-bedrukken | pro v1 bedrukken | /titleist-golfballen-bedrukken/ (of productpagina) | 301 |
| /collections/titleist-pro-v1x-bedrukken | pro v1x bedrukken | /titleist-golfballen-bedrukken/ | 301 |
| /collections/pinnacle-golfballen-met-bedrukking | pinnacle bedrukken | /pinnacle-golfballen-bedrukken/ | 301 |
| /pages/golfballen-met-logo-bedrukken* | golfballen met logo | /golfballen-bedrukken/ | 301 (VERIFY) |
| /collections/golfbal-met-logo-bedrukken* | golfbal met logo | /golfballen-bedrukken/ | 301 (VERIFY) |
| /pages/golfballen-kopen-hoogwaardige-ballen-... | golfballen kopen | (eigen pagina behouden) | Behouden/verbeteren |
| /pages/golfhandschoen-... | golfhandschoenen | (eigen categorie) | Behouden (buiten scope fase 1) |
| /products/* | product | zichzelf | Behouden (Shopify) |

\* = in de brief genoemd; bestaan nog te bevestigen via volledige sitemap.

## Redirectregels
- Uitsluitend **301** (permanent). Geen chains (bron → eind, niet bron → bron → eind).
- Nooit alles naar de homepage; altijd naar de inhoudelijk best passende pagina.
- Oude URL uit `sitemap.xml` verwijderen en uit interne links halen.
- Redirects langdurig laten staan (minimaal 12 maanden, bij voorkeur permanent).

## Volledige matrix afmaken
De WebFetch-crawl kon de gecomprimeerde Shopify-XML-sitemaps niet volledig
uitlezen. Exporteer daarom de complete lijst via **Shopify admin** of open
`sitemap_products_1.xml`, `sitemap_collections_1.xml`, `sitemap_pages_1.xml`,
`sitemap_blogs_1.xml` in de browser en plak de URL's. Daarmee vullen we de
`# VERIFY`-rijen in `_redirects` 1-op-1 aan.
