// 用真的 three.js 截圖（CI 用）：python3 build.py --dbg <three-url> tests/shots.html && node tests/shots.js
const {chromium}=require('playwright');const fs=require('fs');
const OUT=process.env.OUT||'shots';fs.mkdirSync(OUT,{recursive:true});
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
for(const [tag,vp] of [['phone',{width:390,height:844,hasTouch:true,isMobile:true,deviceScaleFactor:2}],['desktop',{width:1280,height:800}]]){
  const p=await b.newPage({viewport:{width:vp.width,height:vp.height},hasTouch:!!vp.hasTouch,isMobile:!!vp.isMobile,deviceScaleFactor:vp.deviceScaleFactor||1});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/shots.html');await p.waitForTimeout(2500);
  const shot=async n=>{await p.waitForTimeout(1600);await p.screenshot({path:`${OUT}/${tag}-${n}.png`});};
  await shot('01-title');
  await p.click('[data-act=start]');
  const vis=s=>p.isVisible(s).catch(()=>false);
  const drain=async()=>{for(let i=0;i<20;i++){if(await vis('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');else if(await vis('#dlg .choice'))await p.click('#dlg .choice >> nth=0');else if(await vis('[data-act=dnext]'))await p.click('[data-act=dnext]');else break;}};
  await drain();await shot('02-start');
  await p.evaluate(()=>__dbg.tp(20,3.4,0));await shot('03-whiteboard');
  await p.evaluate(()=>__dbg.tp(10.4,10,Math.PI/2));await shot('04-schedule');
  await p.evaluate(()=>__dbg.tp(2.4,10.6,0));await shot('05-lobby-sign');
  await p.evaluate(()=>__dbg.tp(1.6,15.4,Math.PI/2));await shot('06-rank');
  await p.evaluate(()=>__dbg.tp(5,1.2,0));await shot('07-boss-room');
  await p.evaluate(()=>__dbg.tp(26,16,0));await shot('08-edge-arrow');
  await p.evaluate(()=>__dbg.tp(15,4,Math.PI));await shot('09-edge-arrow2');
  await p.evaluate(()=>{__dbg.G.clock=22*60+9;__dbg.tp(4.5,15.6,0);});await shot('10-overtime-hud');
  await p.evaluate(()=>{__dbg.CAM.tilt=.5;__dbg.CAM.zoom=1.6;__dbg.tp(4.5,15.6,Math.PI);});await shot('11-night-out');
  fs.writeFileSync(`${OUT}/${tag}-errors.txt`,errs.join('\n')||'none');await p.close();}
await b.close();})();
