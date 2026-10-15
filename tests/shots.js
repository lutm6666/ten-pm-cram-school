// 用真的 three.js 截圖（CI 用）：python3 build.py --dbg <three-url> tests/shots.html && node tests/shots.js
// 國小＋國中版：三層樓（1F x 0–36、2F x 48–84、3F x 96–132）。
const {chromium}=require('playwright');const fs=require('fs');
const OUT=process.env.OUT||'shots';fs.mkdirSync(OUT,{recursive:true});
const F2=x=>48+x,F3=x=>96+x;
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [tag,vp] of [['phone',{width:390,height:844,hasTouch:true,isMobile:true,deviceScaleFactor:2}],['desktop',{width:1280,height:800}]]){
  const p=await b.newPage({viewport:{width:vp.width,height:vp.height},hasTouch:!!vp.hasTouch,isMobile:!!vp.isMobile,deviceScaleFactor:vp.deviceScaleFactor||1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/shots.html');await p.waitForTimeout(2500);
  const shot=async n=>{await p.waitForTimeout(1600);await p.screenshot({path:`${OUT}/${tag}-${n}.png`});};
  const perf=async label=>{const v=await p.evaluate(()=>window.__p2PerfAudit?window.__p2PerfAudit():null);if(v){fs.writeFileSync(`${OUT}/${tag}-perf-${label}.json`,JSON.stringify(v,null,2));console.log(`[perf:${tag}:${label}] ${JSON.stringify(v)}`);}return v;};
  const vis=s=>p.isVisible(s).catch(()=>false);
  const drain=async()=>{for(let i=0;i<20;i++){if(await vis('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');else if(await vis('#dlg .choice'))await p.click('#dlg .choice >> nth=0');else if(await vis('[data-act=dnext]'))await p.click('[data-act=dnext]');else break;}};
  const role=async id=>{await p.evaluate(()=>{localStorage.removeItem('ten-pm:save')});await p.reload();await p.waitForTimeout(1500);await p.click(`[data-role=${id}]`);await p.click('[data-act=start]');await drain();};
  await shot('01-title');
  // 櫃台：1F
  await role('yun');await perf('yun');await shot('02-yun-start');
  await p.evaluate(()=>__dbg.tp(6,13.5,Math.PI));await shot('03-lobby-counter');
  await p.evaluate(()=>__dbg.tp(23,5,0));await shot('04-staff-meeting');
  await p.evaluate(()=>__dbg.tp(28,13,0));await shot('05-store-mop');
  await p.evaluate(()=>__dbg.tp(4,4.5,0));await shot('06-boss-room');
  // 安親：2F
  await role('care');await perf('care');await shot('07-care-start');
  await p.evaluate(()=>__dbg.jump('c_snack'));await drain();await p.waitForTimeout(6000);await p.evaluate(()=>__dbg.tp(48+15,5.5,0));await shot('08-care-snack');
  await p.evaluate(()=>__dbg.tp(48+15,13.5,0));await shot('09-2f-reading');
  await p.evaluate(()=>__dbg.jump('c_late'));await drain();await p.waitForTimeout(4000);await p.evaluate(()=>__dbg.tp(48+15,5.5,0));await shot('10-care-late');
  // 九年級班導：3F
  await role('jh');await perf('jh');
  await p.evaluate(()=>__dbg.jump('j_roll'));await drain();await p.waitForTimeout(6000);await p.evaluate(()=>__dbg.tp(96+25,6,0));await shot('11-jh-c9');
  await p.evaluate(()=>__dbg.tp(96+31,14,0));await shot('12-jh-office');
  await p.evaluate(()=>{__dbg.G.clock=21*60+40;__dbg.tp(96+14,13.5,0);});await shot('13-night-tutor');
  fs.writeFileSync(`${OUT}/${tag}-errors.txt`,errs.join('\n')||'none');await p.close();}
await b.close();})();
