import { chromium } from 'playwright-core';
const file = process.argv[2];
const outp = process.argv[3] || 'pg';
const exe='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1200,height:1050},deviceScaleFactor:1.25});
await p.goto('file://'+file,{waitUntil:'load'});
await p.waitForTimeout(700);
const total=await p.evaluate(()=>document.body.scrollHeight);
const step=980; let i=1;
for(let y=0;y<total;y+=step){
  await p.evaluate(_y=>window.scrollTo(0,_y), y);
  await p.waitForTimeout(160);
  await p.screenshot({path:`preview/${outp}-${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:82});
  i++;
}
await b.close();console.log('captured',i-1,'sections');
