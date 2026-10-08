const {chromium}=require('playwright');
const line=process.argv[2]||'teacher', pick=+(process.argv[3]||0), grab=(process.argv[4]||'').split(',').filter(Boolean);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_TUNNEL|Failed to load/.test(m.text()))errs.push(m.text())});
await p.goto('file://'+__dirname+'/test.html');
if(line!=='teacher') await p.click(`[data-role=${line}]`);
await p.click('[data-act=start]');
const vis=s=>p.isVisible(s).catch(()=>false);
async function walkUntil(x,z,check){await p.evaluate(([x,z])=>__dbg.go(x,z),[x,z]);for(let k=0;k<300;k++){await p.waitForTimeout(60);if(await p.evaluate(check))return true;}return false;}
async function drain(){let g=0;while(g++<60){
  if(await vis('#miniArea')){
    if(await vis('[data-act=miniOk]')){await p.click('[data-act=miniOk]');continue;}
    if(await vis('#miniArea [data-c]')){const ok=await p.evaluate(()=>{const c=[...document.querySelectorAll('#miniArea [data-c]')].find(b=>parseFloat(b.style.opacity)>.2);if(c){c.click();return true}return false});if(ok)continue;}
    if(await vis('#miniArea [data-n]:not([disabled])')){await p.click('#miniArea [data-n]:not([disabled]) >> nth=0');continue;}
    if(await vis('#miniArea [data-submit]:not([disabled])')){if(pick===1)await p.click('#miniArea [data-d="2"]');await p.click('#miniArea [data-submit]');continue;}
    if(await vis('.sheetp')){const n=await p.$$('.sheetp:not(.gone)');await n[n.length-1].click();await p.waitForTimeout(300);}
    else if(await vis('#miniArea [data-k]:not([disabled])')){await p.click('#miniArea [data-k]:not([disabled]) >> nth='+(pick%3));}
    else if(await vis('#miniArea [data-next]')){await p.click('#miniArea [data-next]');}
    else if(await vis('#miniArea .choice[data-i]')&&!(await vis('#miniArea [data-call]'))&&!(await vis('[data-act=miniOk]'))){for(const i of [0,5,4]) await p.click(`#miniArea .choice[data-i="${i}"]`);}
    else if(await vis('#miniArea [data-call]')){await p.click('#miniArea [data-call]');}
    else if(await vis('.stepl')){if(await vis('[data-next]')) await p.click('[data-next]'); else await p.click('.stepl >> nth=0');}
    if(await vis('[data-act=miniOk]')) await p.click('[data-act=miniOk]');continue;}
  if(await vis('[data-act=chapterGo]')){await p.click('[data-act=chapterGo]');continue;}
  if(await vis('#dlg .choice')){const cs=await p.$$('#dlg .choice');await cs[Math.min(pick,cs.length-1)].click();continue;}
  if(await vis('[data-act=dnext]')){await p.click('[data-act=dnext]');continue;}
  if(await vis('#sheet [data-act=closeSheet]')){await p.click('#sheet [data-act=closeSheet]');continue;}
  return;}}
await drain();
for(const id of grab){const pos=await p.evaluate(id=>__dbg.ITEMS.find(i=>i.id===id).pos,id);
  const ok=await walkUntil(pos[0],pos[1],`(()=>{const n=__dbg.near();return n&&n.type==='item'&&n.it.id==='${id}'})()`);
  if(ok){await p.click('#actBtn');await drain();}console.log('grab',id,ok);}
let guard=0;
while(guard++<60){
  if(await vis('.report'))break;await drain();if(await vis('.report'))break;
  if(process.env.GRAB==='all'){const ms=await p.evaluate(()=>__dbg.marks);for(const id of ms){const pos=await p.evaluate(id=>__dbg.ITEMS.find(i=>i.id===id).pos,id);
      const ok=await walkUntil(pos[0],pos[1],`(()=>{const n=__dbg.near();return n&&n.type==='item'&&n.it.id==='${id}'})()`);console.log('  item',id,ok?'picked':'NOT REACHED');if(ok){await p.click('#actBtn');await drain();}}}
  const sides=await p.evaluate(()=>__dbg.activeSides().map(s=>[s.id,(()=>{const t=__dbg.targetOf(s.target);return[t.x,t.z]})()]));
  if(sides.length){const [id]=sides[0];let ok=false;for(let r=0;r<12&&!ok;r++){const [x,z]=await p.evaluate(id=>{const s=__dbg.activeSides().find(s=>s.id===id);const t=__dbg.targetOf(s.target);return[t.x,t.z]},id);
      await p.evaluate(([x,z])=>__dbg.go(x,z),[x,z]);for(let k=0;k<25;k++){await p.waitForTimeout(60);if(await p.evaluate(`(()=>{const n=__dbg.near();return n&&n.type==='side'&&n.sd.id==='${id}'})()`)){ok=true;break;}}}
    console.log('  side',id,ok?'done':'NOT REACHED');if(ok){await p.click('#actBtn');await drain();continue;}else break;}
  const g=await p.textContent('.nextcard .g');await p.click('[data-act=guide]');
  let ok=false;for(let k=0;k<300;k++){await p.waitForTimeout(60);const n=await p.evaluate(()=>{const n=__dbg.near();return n&&n.type==='main'});if(n){ok=true;break;}}
  console.log('step',g,ok?'ok':'NOT REACHED');if(!ok)console.log(await p.evaluate(()=>{const d=__dbg,n=d.near();return JSON.stringify({path:d.path,guiding:d.guiding,keys:d.keys,pos:d.pos(),tg:d.targetOf(d.G.steps[d.G.idx].target),mode:d.mode,near:n&&n.type,id:d.G.steps[d.G.idx].id,sides:d.activeSides().map(s=>s.id)})}));if(!ok)break;try{await p.click('#actBtn',{timeout:5000});}catch(e){console.log('CLICKFAIL',await p.evaluate(()=>JSON.stringify({mode:__dbg.mode,dock:document.getElementById('dock').hidden,cover:document.getElementById('cover').hidden,coverHTML:document.getElementById('cover').innerHTML.slice(0,120),dlg:document.getElementById('dlg').hidden,sheet:document.getElementById('sheet').hidden,id:__dbg.G.steps[__dbg.G.idx].id})));break;}
}
await drain();
if(await vis('[data-act=shareCard]')){await p.click('[data-act=shareCard]');const ok=await p.evaluate(()=>{const i=document.querySelector('#sheet img');return !!(i&&i.src.startsWith('data:image/png')&&i.src.length>20000)});console.log('share card',ok?'ok':'FAIL');if(!ok)errs.push('share card failed');await p.click('#sheet [data-act=closeSheet]');}
console.log('report:',(await p.textContent('.report h2').catch(()=>'NONE')),'| log:',await p.evaluate(()=>__dbg.G&&__dbg.G.log.map(l=>l[1]).join(' / ')),'| errors',errs);await b.close();})();
