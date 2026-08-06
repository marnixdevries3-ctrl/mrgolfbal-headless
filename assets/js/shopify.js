/* =============================================================================
 * Shopify Storefront API — prijzen, varianten & winkelwagen (bron van waarheid)
 * -----------------------------------------------------------------------------
 * Prijzen worden NOOIT hardcoded. Ze komen live hier vandaan.
 * Vul PUBLIC_SHOPIFY_DOMAIN en PUBLIC_SHOPIFY_STOREFRONT_TOKEN in via env
 * (Netlify: Site settings → Environment variables) of build-time replace.
 * =========================================================================== */
import { CONFIG } from './config.js';

const DOMAIN = CONFIG.shopify.domain;
const TOKEN = CONFIG.shopify.storefrontToken;
const API = `https://${DOMAIN}/api/${CONFIG.shopify.apiVersion}/graphql.json`;

async function storefront(query, variables = {}) {
  if (!TOKEN) { console.warn('[shopify] Geen Storefront-token ingesteld — prijzen blijven leeg.'); return null; }
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) { console.error('[shopify] API-fout', res.status); return null; }
  const json = await res.json();
  if (json.errors) console.error('[shopify] GraphQL', json.errors);
  return json.data;
}

const money = (amount, currency = 'EUR') =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency }).format(Number(amount));

/** Haal prijs (vanaf) op per product-handle en vul elementen met data-shopify-handle. */
export async function hydratePrices() {
  const nodes = [...document.querySelectorAll('[data-shopify-handle]')];
  if (!nodes.length) return;
  await Promise.all(nodes.map(async (el) => {
    const handle = el.getAttribute('data-shopify-handle');
    const data = await storefront(`
      query($handle:String!){ product(handle:$handle){
        title priceRange{ minVariantPrice{ amount currencyCode } } } }`, { handle });
    const p = data?.product?.priceRange?.minVariantPrice;
    if (p) el.textContent = `vanaf ${money(p.amount, p.currencyCode)}`;
    // Geen prijs? Neutrale tekst laten staan (geen verzonnen prijs).
  }));
}

/**
 * BESTELLEN OP FACTUUR — geen online checkout.
 * De configuratie/aanvraag gaat naar een server-side functie die in Shopify een
 * **Draft Order** aanmaakt (Admin API) en de klant een **factuur** stuurt.
 * De Admin-token staat ALLEEN server-side (Netlify function), nooit in de browser.
 */
export async function submitInvoiceRequest(payload) {
  const res = await fetch('/.netlify/functions/create-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), // {klant, model, aantal, bedrukking, tekst, logoRef, ...}
  });
  if (!res.ok) { console.error('[factuur] aanvraag mislukt', res.status); return null; }
  return res.json(); // { ok:true, draftOrderId, invoiceUrl? }
}

// Auto-hydrate bij load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => { hydratePrices().catch(() => {}); });
}
