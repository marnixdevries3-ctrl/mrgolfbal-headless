/* =============================================================================
 * MrGolfbal.nl — CENTRALE CONFIGURATIE (single source of truth)
 * -----------------------------------------------------------------------------
 * Alle commerciële voorwaarden staan HIER en nergens anders hardcoded.
 * Pas een waarde hier aan en de hele site verandert mee.
 *
 * Velden gemarkeerd met  // ⚠ BEVESTIGEN  bevatten waarden waar de oude site
 * zichzelf tegensprak of die niet publiek verifieerbaar zijn. Bevestig deze
 * vóór livegang. Zie docs/tegenstrijdigheden.md voor de bronregels.
 * =========================================================================== */

export const CONFIG = {
  brand: {
    name: 'MrGolfbal.nl',
    tagline: 'By Mark Reynolds',
    kvk: '27326866',
    email: 'info@mrgolfbal.nl',
    phone: '+31 6 27 41 19 25',
    phoneHref: 'tel:+31627411925',
    whatsapp: 'https://wa.link/s3n6ew',
    instagram: 'https://www.instagram.com/mrgolfbal/',
    youtube: 'https://www.youtube.com/@watchmark',
    responseTime: 'binnen 24 uur',
  },

  // --- Commerciële kernvoorwaarden -----------------------------------------
  terms: {
    // Oude site: body "vanaf 6 dozen" vs FAQ "12 dozijn (144 ballen)".
    // Beide komen uit op 144 golfballen. Gestandaardiseerd op stuks.
    minOrderBalls: 144,                 // ⚠ BEVESTIGEN
    minOrderLabel: 'vanaf 144 golfballen',
    minOrderHelp: 'Bijvoorbeeld 6 dozen van 24 of 12 dozijn.',

    // Oude site: 5–14 / 5–15 / 14 werkdagen (3 varianten). Gestandaardiseerd.
    leadTimeLabel: '5–15 werkdagen',    // ⚠ BEVESTIGEN
    leadTimeNote: 'na goedkeuring van de digitale drukproef',

    // Oude site: "1–2 kleuren" en "3–5 kleuren". GEEN full-colour geclaimd.
    printColors: 'bedrukking in 1 tot 5 kleuren (spotkleuren)', // ⚠ BEVESTIGEN of foto/full-colour echt kan
    printSides: 'één zijde standaard; tweede zijde op aanvraag', // ⚠ BEVESTIGEN
    proof: 'Je ontvangt altijd een digitale drukproef. Productie start pas na jouw akkoord.',

    // Oude site noemt expliciet alleen JPEG en EPS.
    fileTypes: ['EPS', 'AI', 'PDF', 'JPEG', 'PNG'], // ⚠ BEVESTIGEN welke echt geaccepteerd worden
    fileTypesPreferred: 'Bij voorkeur een vectorbestand (EPS, AI of PDF).',

    // BESTELLEN OP FACTUUR — geen online betaling/checkout.
    payment: 'Bestellen op factuur; geen online betaling. Factuur na akkoord op de drukproef.',
    orderFlow: 'aanvraag → digitale drukproef → akkoord → factuur → productie → levering',
    shipping: 'Verzendkosten worden op de factuur/offerte berekend.', // GEEN gratis verzending claimen
    returns: 'Gepersonaliseerde/bedrukte golfballen kunnen niet worden geretourneerd. Overige artikelen: 30 dagen.',
    currency: 'EUR',
    currencySymbol: '€',
  },

  // --- Merken die ECHT bestelbaar zijn -------------------------------------
  // Titleist + Pinnacle bevestigd via navigatie/producten.
  // Callaway/TaylorMade worden op tekst genoemd maar zijn niet als product
  // gevonden -> NIET tonen tot bevestigd.
  brandsConfirmed: ['Titleist', 'Pinnacle'],
  brandsToVerify: ['Callaway', 'TaylorMade'], // ⚠ BEVESTIGEN of bestelbaar

  // --- Shopify Storefront API ----------------------------------------------
  // Prijzen, varianten en voorraad komen LIVE uit Shopify. Nooit hardcoden.
  shopify: {
    domain: import.meta?.env?.PUBLIC_SHOPIFY_DOMAIN || 'mrgolfbal.myshopify.com',
    storefrontToken: import.meta?.env?.PUBLIC_SHOPIFY_STOREFRONT_TOKEN || '',
    apiVersion: '2024-10',
  },

  // --- Voorbeeldstaffel voor de calculator ---------------------------------
  // ⚠ LET OP: dit zijn VOORBEELDwaarden zodat de calculator werkt in de demo.
  // Echte prijzen komen uit Shopify. Vervang of koppel aan Storefront API.
  staffelExample: {
    label: 'Voorbeeldstaffel (echte prijzen live uit Shopify)',
    tiers: [
      { balls: 144, pricePerBall: null },
      { balls: 288, pricePerBall: null },
      { balls: 576, pricePerBall: null },
      { balls: 1008, pricePerBall: null },
    ],
  },
};

export default CONFIG;
