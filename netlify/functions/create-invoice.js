/* =============================================================================
 * Netlify Function — maak een Shopify DRAFT ORDER en stuur een FACTUUR.
 * Server-side: de Admin API-token staat ALLEEN hier (env), nooit in de browser.
 * Er vindt GEEN online betaling plaats; de klant betaalt op factuur.
 *
 * Env vars (Netlify → Site settings → Environment):
 *   SHOPIFY_ADMIN_DOMAIN   = mrgolfbal.myshopify.com
 *   SHOPIFY_ADMIN_TOKEN    = shpat_...   (Admin API, scope: write_draft_orders)
 * =========================================================================== */
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const DOMAIN = process.env.SHOPIFY_ADMIN_DOMAIN;
  const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
  const body = await req.json().catch(() => ({}));

  // Verwachte payload uit configurator/offerteformulier:
  // { klant:{naam,bedrijf,email,telefoon}, model, aantal, bedrukking, tekst, leverdatum, opmerking }
  if (!body.klant?.email) return Response.json({ ok: false, error: 'email ontbreekt' }, { status: 400 });

  if (!DOMAIN || !TOKEN) {
    // Demo/preview zonder token: log en bevestig zonder echte draft order.
    console.warn('[create-invoice] geen Admin-token — draft order niet aangemaakt (demo).');
    return Response.json({ ok: true, demo: true });
  }

  // Draft order aanmaken. line_items koppel je bij voorkeur aan echte variant_id's;
  // hier als voorbeeld met custom line item + notitie (prijs bepaalt MrGolfbal in de factuur).
  const draft = {
    draft_order: {
      email: body.klant.email,
      note: `Bedrukte golfballen aanvraag\nModel: ${body.model}\nAantal: ${body.aantal}\nBedrukking: ${body.bedrukking}\nTekst: ${body.tekst || '-'}\nLeverdatum: ${body.leverdatum || '-'}\n${body.opmerking || ''}`,
      tags: 'website-aanvraag,bedrukken',
      line_items: [{ title: `${body.model} — bedrukt (${body.bedrukking})`, quantity: Number(body.aantal) || 144, price: '0.00' }],
      use_customer_default_address: false,
    },
  };

  const r = await fetch(`https://${DOMAIN}/admin/api/2024-10/draft_orders.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(draft),
  });
  if (!r.ok) return Response.json({ ok: false, error: `Shopify ${r.status}` }, { status: 502 });
  const data = await r.json();
  const id = data?.draft_order?.id;

  // Optioneel: direct de factuur/uitnodiging sturen:
  // await fetch(`https://${DOMAIN}/admin/api/2024-10/draft_orders/${id}/send_invoice.json`, {...})

  return Response.json({ ok: true, draftOrderId: id });
};
