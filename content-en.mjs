/* =============================================================================
 * content-en.mjs — Engelse content voor de /en/-versie van de site.
 * Structuur spiegelt de Nederlandse bron in gen.mjs. Interne links in `main`
 * en `body` blijven Nederlandse root-paden; de generator prefixt ze met /en.
 * =========================================================================== */
import { EN_PRODUCTS } from './content-en/products.mjs';
import { PAGES_A } from './content-en/pages-a.mjs';
import { PAGES_B } from './content-en/pages-b.mjs';
import { PAGES_C } from './content-en/pages-c.mjs';
import { KB_A } from './content-en/kb-a.mjs';
import { KB_B } from './content-en/kb-b.mjs';

export { EN_PRODUCTS };

export const EN_KB_CATS = {
  techniek: 'Printing & technique',
  merken: 'Brands & models',
  toepassingen: 'Applications & inspiration',
};

export const EN_PAGES = { ...PAGES_A, ...PAGES_B, ...PAGES_C };
export const EN_KB = { ...KB_A, ...KB_B };
