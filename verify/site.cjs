'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const shots = path.join(os.tmpdir(), 'grid-qa');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const levels = require('../levels.js');
(async () => {
 const browser = await chromium.launch({executablePath:process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url()+': '+r.status())});
 const base=process.env.TEST_URL || 'http://localhost:4173';
 fs.mkdirSync(shots,{recursive:true});
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:path.join(shots,'landing-desktop.png'),fullPage:true});
 await page.waitForTimeout(2100);
 const synced=await page.evaluate(()=>{let b=document.querySelector('#preview-board'),v=document.querySelector('#preview-columns').textContent;let widths=[...b.children].map(c=>c.getBoundingClientRect().width);return b.style.gridTemplateColumns===v && Math.abs(widths[0]/widths[1]-parseFloat(v))<.02});assert(synced);
 await page.getByRole('button',{name:'Pause animation'}).click();const frozen=await page.locator('#preview-columns').textContent();await page.waitForTimeout(300);assert.equal(await page.locator('#preview-columns').textContent(),frozen);
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();assert.equal(await page.locator('#preview-columns').textContent(),'1fr 1fr 1fr');await page.waitForTimeout(300);assert.equal(await page.locator('#preview-columns').textContent(),'1fr 1fr 1fr');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.getByRole('link',{name:'Play GRIDVILLE'}).click();assert.equal(new URL(page.url()).pathname,'/play/');
 await page.reload();assert(await page.locator('#editor').isVisible());
 await page.screenshot({path:path.join(shots,'game-desktop.png'),fullPage:true});
 await page.getByRole('button',{name:'How to play',exact:true}).click();assert(await page.locator('#how-dialog').isVisible());await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.id),'how-open');
 await page.locator('#editor').focus();await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'btn-check');
 for(let i=0;i<levels.length;i++){
  await page.locator('#level-strip button').nth(i).click();await page.locator('#editor').fill(levels[i].solution);await page.locator('#editor').press('Control+Enter');assert(await page.locator('#modal.open').isVisible(),'level '+(i+1));await page.keyboard.press('Escape');
 }
 await page.reload();assert.equal(await page.locator('#editor').inputValue(),levels[7].solution);assert.match(await page.locator('#progress').textContent(),/8\/8 built/);
 await page.getByRole('button',{name:'Settings',exact:true}).click();await page.getByRole('button',{name:'Reset current CSS'}).click();await page.keyboard.press('Escape');assert.equal(await page.locator('#editor').inputValue(),levels[7].starter);assert.match(await page.locator('#progress').textContent(),/8\/8 built/);
 await page.locator('#level-strip button').first().click();await page.locator('#editor').fill('.board { display: block; }');await page.locator('#btn-check').click();await page.locator('#btn-check').click();assert(!await page.locator('#hintbox').evaluate(e=>e.classList.contains('locked')));
 await page.getByRole('link',{name:'← Home'}).click();assert.equal(new URL(page.url()).pathname,'/');
 await page.goto(base+'/#play');await page.waitForURL('**/play/#play');
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const route of ['/','/play/']){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width+route);
   await page.screenshot({path:path.join(shots,(route==='/'?'landing':'game')+'-'+width+'.png'),fullPage:true});
  }
 }
 for(const route of ['/','/play/']){
  await page.goto(base+route);assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://grid.techwebster.com'+route);
  JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  const links=await page.locator('[src],link[href]').evaluateAll(es=>es.map(e=>e.src||e.href).filter(u=>u.startsWith(location.origin)));
  for(const u of links){let r=await page.request.get(u);assert.equal(r.status(),200,u)}
 }
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto(base);assert.match(await nojs.locator('h1').textContent(),/Learn CSS Grid/);await nojs.close();
 assert.deepEqual(errors,[]);await browser.close();console.log('SITE-PASS');
})().catch(e=>{console.error(e);process.exit(1)});
