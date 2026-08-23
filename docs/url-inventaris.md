# URL-inventaris (waargenomen) + nieuwe sitestructuur

## Waargenomen op de oude site (navigatie, footer, index-search)
| URL | Type | Organisch doel | Actie |
|-----|------|----------------|-------|
| /pages/golfballen-laten-bedrukken | pagina | golfballen bedrukken | 301 → /golfballen-bedrukken/ |
| /pages/titleist-golfballen-bedrukken | pagina | titleist bedrukken | 301 → /titleist-golfballen-bedrukken/ |
| /pages/golfballen-kopen-hoogwaardige-ballen-altijd-laag-geprijsd | pagina | golfballen kopen | Behouden/verbeteren |
| /pages/golfhandschoen-bestellen-... | pagina | golfhandschoenen | Behouden (buiten scope fase 1) |
| /pages/contact | pagina | contact | 301 → /contact/ |
| /collections/titleist-golfballen-bedrukken | collectie | titleist bedrukken | 301 → merkpagina |
| /collections/titleist-pro-v1-bedrukken | collectie | pro v1 bedrukken | 301 → merkpagina |
| /collections/titleist-pro-v1x-bedrukken | collectie | pro v1x bedrukken | 301 → merkpagina |
| /collections/pinnacle-golfballen-met-bedrukking | collectie | pinnacle bedrukken | 301 → /pinnacle-golfballen-bedrukken/ |
| /collections/titleist-golfhandschoenen(+heren/vrouw/kind) | collectie | handschoenen | Behouden |
| /products/titleist-pro-v1 · pro-v1x · trufeel · avx · velocity · pro-v1-rct | product | model kopen/bedrukken | Behouden (Shopify) |
| /products/pinnacle-soft-met-bedrukking · pinnacle-rush-met-bedrukking | product | pinnacle bedrukken | Behouden |
| /blogs/nieuws | blog | advies | Behouden, consolideren |
| /policies/{privacy,refund,shipping,terms,contact-information} | policy | juridisch | Behouden |

> **Let op:** dit is de waargenomen set. De volledige lijst (alle producten,
> collecties, blogs, metaobjecten) komt uit de Shopify-sitemaps; die konden via
> WebFetch niet volledig worden uitgelezen (gecomprimeerde XML). Vul aan met een
> admin-export om de inventaris 100% te maken.

## Nieuwe sitestructuur (fase 1)
```
/                                         Home (golfballen laten bedrukken)
/golfballen-bedrukken/                    ⭐ Primaire hub + configurator
  /titleist-golfballen-bedrukken/         Merk
  /pinnacle-golfballen-bedrukken/         Merk
/golfballen-bedrukken-voor-bedrijven/     B2B + offerteformulier
/golfballen-bedrukken-voor-golfclubs-en-toernooien/
/golfballen-personaliseren/               Naam/tekst/foto
/prijzen-golfballen-bedrukken/            Prijzen & staffels
/zo-werkt-het/                            Proces
/over-mark/                               Autoriteit/E-E-A-T
/contact/                                 Contact + formulier
/products/*                               Blijven in Shopify (prijzen live)
```
Interne links: elke pagina linkt naar hub, relevant merk, toepassing, prijzen en
configurator. Geen wees-URL's; kernpagina's binnen 3 klikken bereikbaar.
