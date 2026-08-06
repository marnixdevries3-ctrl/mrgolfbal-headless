import { chromium } from 'playwright-core';
const exe='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:900},deviceScaleFactor:1.5});
await p.goto('file://'+process.cwd()+'/preview/index.html',{waitUntil:'load'});
await p.waitForTimeout(600);
const total=await p.evaluate(()=>document.body.scrollHeight);
const slices=[[0,1500],[1500,1500],[3000,1550],[4550,1650],[6200,1450],[7650, total-7650]];
let i=1;
for(const [y,h] of slices){
  const hh=Math.min(h, total-y);
  if(hh<=0) break;
  try{ await p.screenshot({path:`preview/home-${i}.png`,clip:{x:0,y,width:1280,height:hh}}); console.log('ok',i,y,hh);}catch(e){console.log('ERR',i,e.message);}
  i++;
}
await b.close();
