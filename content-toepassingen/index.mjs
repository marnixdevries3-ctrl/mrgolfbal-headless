/* Aggregator voor toepassingspagina's. Volgorde = weergave op de hub. */
import bedrijfsgolfdag from './golfballen-bedrijfsgolfdag.mjs';
import relatiegeschenk from './golfballen-relatiegeschenk.mjs';
import golftoernooi from './golfballen-golftoernooi.mjs';
import sponsorwedstrijd from './golfballen-sponsorwedstrijd.mjs';
import golfevent from './golfballen-golfevent.mjs';
import charitygolf from './golfballen-charitygolf.mjs';
import goodiebag from './golfballen-goodiebag.mjs';
import promotieartikel from './golfballen-promotieartikel.mjs';

export const TOEPASSINGEN = [
  bedrijfsgolfdag, relatiegeschenk, golftoernooi, sponsorwedstrijd,
  golfevent, charitygolf, goodiebag, promotieartikel,
];
