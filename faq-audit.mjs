/* FAQ-audit: de vraag-en-antwoordblokken staan op ruim honderd pagina's en zijn
   een plek waar herhaling makkelijk wegkruipt. Hier vergelijken we elk antwoord
   met elk ander antwoord. */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('.', import.meta.url).pathname.replace(/\/$/,'');
const SKIP=new Set(['node_modules','.git','assets','docs','netlify','_toe-raw','_trip-raw','_blog-raw','_kb-raw']);
const pages=[];(function w(d,rel=''){for(const e of readdirSync(d)){if(SKIP.has(e))continue;const f=join(d,e);
 if(statSync(f).isDirectory())w(f,rel+'/'+e);else if(e==='index.html')pages.push([(rel||'')+'/',f]);}})(root);
const strip=h=>h.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();
const items=[];
for(const [r,f] of pages){
  const h=readFileSync(f,'utf8');
  for(const m of h.matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g))
    items.push({route:r, q:strip(m[1]), a:strip(m[2])});
  for(const m of h.matchAll(/itemprop="name"[^>]*>([\s\S]*?)<[\s\S]{0,300}?itemprop="text"[^>]*>([\s\S]*?)<\/div>/g))
    items.push({route:r, q:strip(m[1]), a:strip(m[2])});
}
const uniq=new Map();
for(const it of items){ const k=it.route+'|'+it.q; if(!uniq.has(k)) uniq.set(k,it); }
const all=[...uniq.values()].filter(x=>x.a.split(' ').length>12);
const sh=(t,n=6)=>{const w=t.toLowerCase().replace(/[^a-z0-9à-ÿ ]+/g,' ').split(/\s+/).filter(Boolean);
  const o=new Set();for(let i=0;i+n<=w.length;i++)o.add(w.slice(i,i+n).join(' '));return o;};
const jac=(a,b)=>{if(!a.size||!b.size)return 0;let i=0;const[s,l]=a.size<b.size?[a,b]:[b,a];for(const x of s)if(l.has(x))i++;return i/(a.size+b.size-i);};
all.forEach(x=>x.sh=sh(x.a));
const dupA=[], dupQ=new Map();
for(let i=0;i<all.length;i++){
  const qk=all[i].q.toLowerCase();
  if(!dupQ.has(qk))dupQ.set(qk,[]); dupQ.get(qk).push(all[i].route);
  for(let j=i+1;j<all.length;j++){
    const s=jac(all[i].sh,all[j].sh);
    if(s>=0.30) dupA.push([+(s*100).toFixed(0), all[i].route, all[j].route, all[i].q.slice(0,55)]);
  }
}
dupA.sort((a,b)=>b[0]-a[0]);
const sameQ=[...dupQ.entries()].filter(([q,v])=>v.length>1 && new Set(v).size>1);
console.log('FAQ-items:', all.length, 'op', new Set(all.map(x=>x.route)).size, "pagina's");
console.log('\nbijna gelijke antwoorden (>=30%):', dupA.length);
dupA.slice(0,20).forEach(x=>console.log('   ',JSON.stringify(x)));
console.log('\nzelfde vraag op meerdere pagina\'s:', sameQ.length);
sameQ.slice(0,15).forEach(([q,v])=>console.log(`    ${v.length}x  ${q.slice(0,70)}`));
