import { chromium } from 'playwright-core';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: exe, args:['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await p.goto('file://' + process.cwd() + '/preview/index.html', { waitUntil: 'load' });
await p.waitForTimeout(700);
await p.screenshot({ path: 'preview/homepage-full.png', fullPage: true });
await b.close();
console.log('done');
