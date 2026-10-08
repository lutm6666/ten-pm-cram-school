// 加班小遊戲與閒聊的測試
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.click('[data-act=start]');
const vis=s=>p.isVisible(s).catch(()=>false);
while(await vis('[data-act=dnext]')||await vis('[data-act=chapterGo]')){if(await vis('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');else await p.click('[data-act=dnext]');}
let fail=0;
// 閒聊
const ts=await p.evaluate(()=>__dbg.chatTargets());console.log('chat targets',ts);
let chatted=0;
for(const id of ts.slice(0,3)){
  let ok=false;for(let r=0;r<6&&!ok;r++){await p.evaluate(id=>{const n=__dbg.targetOf({npc:id});__dbg.go(n.x,n.z+.6)||__dbg.go(n.x+.6,n.z)||__dbg.go(n.x-.6,n.z);},id);
    for(let k=0;k<120;k++){await p.waitForTimeout(50);if(await p.evaluate(id=>{const n=__dbg.near();return n&&n.type==='chat'&&n.id===id},id)){ok=true;break;}}}
  if(!ok){console.log('chat',id,'NOT REACHED');continue;}
  const label=await p.textContent('#actBtn');await p.click('#actBtn');
  const say=await p.textContent('#dlg .say');while(await vis('[data-act=dnext]'))await p.click('[data-act=dnext]');
  chatted++;console.log('chat',id,label,'|',say.slice(0,30));}
const used=await p.evaluate(()=>__dbg.chatUsed);console.log('used',used);
if(ts.length&&!chatted)fail++;
for(const id of ['lockup','reply','wait']){
  await p.evaluate(id=>{window.__r=null;__dbg.runMini(id,r=>{window.__r=r;});},id);
  for(let g=0;g<40;g++){
    if(await vis('[data-act=miniOk]')){await p.click('[data-act=miniOk]');break;}
    if(await vis('#miniArea [data-n]:not([disabled])')){await p.click('#miniArea [data-n]:not([disabled]) >> nth=0');continue;}
    if(await vis('#miniArea [data-k]:not([disabled])')){await p.click('#miniArea [data-k]:not([disabled]) >> nth=0');continue;}
    if(await vis('#miniArea [data-next]:not([disabled])')){await p.click('#miniArea [data-next]');continue;}
  }
  const r=await p.evaluate(()=>window.__r);console.log('mini',id,JSON.stringify(r));if(!r)fail++;
  while(await vis('[data-act=dnext]'))await p.click('[data-act=dnext]');
}

// 設定
const md0=await p.evaluate(()=>__dbg.mode);await p.click('.hud [data-act=settings]');await p.click('[data-set=speed][data-v="1.4"]');await p.click('[data-set=font][data-v="1.15"]');
const fs=await p.evaluate(()=>getComputedStyle(document.documentElement).fontSize);const st=await p.evaluate(()=>JSON.parse(localStorage.getItem('ten-pm:set')));
await p.click('#sheet [data-act=closeSheet]');const md=await p.evaluate(()=>__dbg.mode);console.log('settings',fs,JSON.stringify(st),md);
if(fs!=='18.4px'||st.speed!==1.4||md!==md0)fail++;
console.log(fail||errs.length?'FAIL':'PASS',errs);await b.close();process.exit(fail||errs.length?1:0);})();
