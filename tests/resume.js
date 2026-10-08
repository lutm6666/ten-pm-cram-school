const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');
await p.click('[data-act=start]');
const vis=s=>p.isVisible(s).catch(()=>false);
async function drain(){for(let g=0;g<60;g++){
 if(await vis('[data-act=miniOk]')){await p.click('[data-act=miniOk]');continue;}
 if(await vis('#miniArea .sheetp')){const n=await p.$$('.sheetp:not(.gone)');await n[n.length-1].click();await p.waitForTimeout(300);continue;}
 if(await vis('#miniArea [data-c]')){const ok=await p.evaluate(()=>{const c=[...document.querySelectorAll('#miniArea [data-c]')].find(b=>parseFloat(b.style.opacity)>.2);if(c){c.click();return true}return false});if(ok)continue;}
 if(await vis('#miniArea [data-k]:not([disabled])')){await p.click('#miniArea [data-k]:not([disabled]) >> nth=0');continue;}
 if(await vis('#miniArea [data-next]')){await p.click('#miniArea [data-next]');continue;}
 if(await vis('#miniArea .stepl')){await p.click('#miniArea .stepl >> nth=0');continue;}
 if(await vis('[data-act=chapterGo]')){await p.click('[data-act=chapterGo]');continue;}
 if(await vis('#dlg .choice')){await p.click('#dlg .choice >> nth=1');continue;}
 if(await vis('[data-act=dnext]')){await p.click('[data-act=dnext]');continue;}
 return;}}
async function doStep(){await drain();await p.click('[data-act=guide]');for(let k=0;k<300;k++){await p.waitForTimeout(60);if(await p.evaluate(()=>{const n=__dbg.near();return n&&n.type==='main'}))break;}await p.click('#actBtn');await drain();}
await drain();await doStep();await doStep();
const before=await p.evaluate(()=>[__dbg.G.idx,__dbg.G.time,__dbg.G.log.length]);
await p.click('[data-act=home]');await p.waitForTimeout(200);
console.log('resume btn:',await p.textContent('[data-act=resume]').catch(()=>'NONE'));
await p.click('[data-act=resume]');await p.waitForTimeout(300);
const after=await p.evaluate(()=>[__dbg.G.idx,__dbg.G.time,__dbg.G.log.length,__dbg.mode]);
console.log('before',before,'after',after);
for(let i=0;i<14;i++){if(await vis('.report'))break;await doStep();}
console.log('report',await p.textContent('.report h2').catch(()=>'NONE'),'resume after finish:',await p.isVisible('[data-act=resume]'),errs);
await p.click('[data-act=codex]').catch(()=>{});await p.click('[data-tab=ach]').catch(()=>{});console.log((await p.textContent('#sheet').catch(()=>'')).slice(0,200));
await b.close();})();
