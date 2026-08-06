import { chromium } from 'playwright-core';
const exe='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b=await chromium.launch({executablePath:exe,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1280,height:800},deviceScaleFactor:1.5});

// HOME top (header + hero)
await p.goto('file://'+process.cwd()+'/preview/index.html',{waitUntil:'load'});
await p.waitForTimeout(700);
await p.screenshot({path:'preview/c-home-top.jpg',type:'jpeg',quality:85});

// scroll ~55% -> ball mid-fairway
await p.evaluate(()=>window.scrollTo(0, document.body.scrollHeight*0.5));
await p.waitForTimeout(500);
await p.screenshot({path:'preview/c-home-mid.jpg',type:'jpeg',quality:85});

// scroll to very bottom -> ball in hole + Mark micdrop
await p.evaluate(()=>window.scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(1400);
await p.screenshot({path:'preview/c-home-bottom.jpg',type:'jpeg',quality:88});
// zoom on the golf strip bottom-right
await p.screenshot({path:'preview/c-golfstrip.jpg',type:'jpeg',quality:90,clip:{x:820,y:640,width:460,height:160}});

// HUB configurator: choose Foto -> text hidden
await p.goto('file://'+process.cwd()+'/preview/golfballen-bedrukken/index.html',{waitUntil:'load'});
await p.waitForTimeout(700);
await p.evaluate(()=>{const s=document.getElementById('druktype'); s.value='Foto/afbeelding'; s.dispatchEvent(new Event('change'));});
await p.waitForTimeout(300);
await p.evaluate(()=>document.getElementById('configurator').scrollIntoView());
await p.waitForTimeout(300);
await p.screenshot({path:'preview/c-cfg-foto.jpg',type:'jpeg',quality:85});
// choose Naam of tekst -> upload hidden
await p.evaluate(()=>{const s=document.getElementById('druktype'); s.value='Naam of tekst'; s.dispatchEvent(new Event('change'));});
await p.waitForTimeout(300);
await p.screenshot({path:'preview/c-cfg-tekst.jpg',type:'jpeg',quality:85});

await b.close(); console.log('checks done');
