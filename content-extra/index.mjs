/* Extra SEO-secties per pagina/product — aggregator.
   Fragmenten worden ná de hoofd-main ingevoegd om pagina's naar 2500+ woorden te brengen.
   EXTRA is gekeyd op slug (contentpagina's, toepassingen, pillars); EXTRA_PRODUCTS op producthandle. */
import { EXTRA_CONTENT_A } from './extra-content-a.mjs';
import { EXTRA_CONTENT_B } from './extra-content-b.mjs';
import { EXTRA_TOEP_A } from './extra-toep-a.mjs';
import { EXTRA_TOEP_B } from './extra-toep-b.mjs';
import { EXTRA_PILLARS } from './extra-pillars.mjs';
import { EXTRA_PROD_A } from './extra-prod-a.mjs';
import { EXTRA_PROD_B } from './extra-prod-b.mjs';

export const EXTRA = {
  ...EXTRA_CONTENT_A, ...EXTRA_CONTENT_B,
  ...EXTRA_TOEP_A, ...EXTRA_TOEP_B,
  ...EXTRA_PILLARS,
};
export const EXTRA_PRODUCTS = { ...EXTRA_PROD_A, ...EXTRA_PROD_B };
