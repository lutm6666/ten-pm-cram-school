// Real WebGL regression runner. State fixtures are explicit; UI navigation is real.
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {CLOCK_PROBE,waitForStep}=require('./wait-for-step');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.env.OUT||'../../outputs');
const tag=process.env.TAG||'after';fs.mkdirSync(out,{recursive:true});
let three;
const probe=CLOCK_PROBE+`window.__qa={get near(){return near},get G(){return G},get mode(){return mode},get step(){return step()},get player(){return player},npcs,extras,scene,LINES,EVENTS,WALLS,SET,agentGo,agentPlace,moveAgent,animPerson,blockedAt,setCrowd,tickCrowd,openStep,enterStep,nextStep,FX,CAM,clockT};`;
const server=http.createServer((req,res)=>{
  if(req.url==='/three.js'){res.setHeader('Content-Type','application/javascript');res.end(three);return;}
  let html=(process.env.BASELINE_REF?require('child_process').execFileSync('git',['show',process.env.BASELINE_REF+':index.html'],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,'index.html'),'utf8')).replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','/three.js');
  const at=html.lastIndexOf('})();');html=html.slice(0,at)+probe+html.slice(at);
  res.setHeader('Content-Type','text/html');res.end(html);
});
(async()=>{
  const cached=process.env.THREE_FILE||path.resolve(root,'../three.min.js');
  if(fs.existsSync(cached))three=fs.readFileSync(cached);else{const response=await fetch('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js');assert(response.ok,'Three.js download failed');three=await response.text();}
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  const url=`http://127.0.0.1:${server.address().port}`;
  const shot=async name=>{await p.screenshot({path:path.join(out,`${tag}-${name}.png`)});};
  const click=async s=>p.locator(s).click();
  const drain=async (choose=true)=>{for(let i=0;i<20;i++){
    if(await p.isVisible('[data-act=chapterGo]'))await click('[data-act=chapterGo]');
    else if(await p.isVisible('#dlg .choice')){if(!choose)return;await p.locator('#dlg .choice').first().click();}
    else if(await p.isVisible('[data-act=dnext]'))await click('[data-act=dnext]');else return;
  }};
  const navigate=async()=>{await waitForStep(p);if(await p.isVisible('[data-act=chapterGo]'))await click('[data-act=chapterGo]');await click('#next [data-act=guide]');try{await p.waitForFunction(()=>__qa.near?.type==='main',{},{timeout:45000});}catch(e){console.log(await p.evaluate(()=>({step:__qa.step.id,npcs:Object.entries(__qa.npcs).filter(([id,n])=>n.visible).map(([id,n])=>({id,x:n.position.x,z:n.position.z,path:n.userData.path,moving:n.userData.moving})),player:[__qa.player.position.x,__qa.player.position.z]})));throw e;}
    await click('#actBtn');
  };
  try{
    await p.goto(url);await p.waitForFunction(()=>window.__qa);await p.evaluate(()=>{localStorage.clear();__qa.LINES.jh.events=['quake'];__qa.LINES.jh.eventSlots=[{after:'j_room',t:'18:00',phase:'pre'}];});
    await click('[data-role=jh]');await click('[data-act=start]');await drain();
    await navigate();await drain(); // copier
    await navigate();await drain(false); // office
    await p.locator('#dlg .choice').nth(1).click();await drain(false);
    // Finish office result, then earthquake opens automatically.
    await drain(false);
    await waitForStep(p);await drain(false);
    await p.locator('#dlg .choice').first().click();await p.waitForTimeout(400);await shot('quake-1802');
    const quake=await p.evaluate(()=>({clock:__qa.G.clock,text:document.querySelector('#dlg').innerText,zone:[__qa.player.position.x,__qa.player.position.z],bossAct:__qa.npcs.boss.userData.act,playerY:__qa.player.userData.rig.position.y}));
    if(tag==='after'){assert(!quake.text.includes('大家鑽到桌子底下'));assert(quake.text.includes('主任室'));assert.strictEqual(quake.bossAct,'cover');assert(quake.playerY<0);}
    await drain();
    // Advance to 18:13 as reported, without skipping arrival movement.
    await p.evaluate(()=>{__qa.G.clock=18*60+13;__qa.SET.speed=0;__qa.player.position.set(31,0,14.5);__qa.CAM.yaw=0;__qa.CAM.zoom=1.4;});
    const samples=[];for(let i=0;i<400;i++){await p.waitForTimeout(150);samples.push(await p.evaluate(()=>__qa.extras.filter(e=>e.p.visible&&e.p.userData.path).map(e=>({id:__qa.extras.indexOf(e),kind:e.kind,x:e.p.position.x,z:e.p.position.z,seated:e.p.userData.seated,moving:e.p.userData.moving,phase:e.p.userData.phase,leg:e.p.userData.legL.rotation.x,wall:__qa.WALLS.some(s=>e.p.position.x>s[0]-.28&&e.p.position.x<s[2]+.28&&e.p.position.z>s[1]-.28&&e.p.position.z<s[3]+.28)}))));
      if(i===35)await p.evaluate(()=>{__qa.player.position.set(18,0,14.7);});
      if(i===40)await shot('arrival-queue');
      if(i===45)await p.evaluate(()=>{__qa.player.position.set(31,0,14.5);});
      if(i===190)await shot('arrivals-1813');
    }
    const arrivalEnd=await p.evaluate(()=>({jh:__qa.extras.filter(e=>e.kind==='jh'&&e.state==='seat').length,xiang:__qa.npcs.xiang.userData.path,qing:__qa.npcs.qing.userData.path,remaining:__qa.extras.filter(e=>e.p.visible&&e.p.userData.path).map(e=>({kind:e.kind,pos:[e.p.position.x,e.p.position.z],path:e.p.userData.path}))}));
    if(tag==='after'){console.log('arrival end',JSON.stringify(arrivalEnd));assert.strictEqual(arrivalEnd.jh,7,'C-class students must reach their seats, not stall in the study room');assert(!arrivalEnd.xiang&&!arrivalEnd.qing,'named students must finish arrival');}
    let minGap=Infinity,walking=0;for(const rows of samples){for(let i=0;i<rows.length;i++){if(rows[i].moving&&Math.abs(rows[i].leg)>.1&&!rows[i].seated)walking++;for(let j=i+1;j<rows.length;j++)minGap=Math.min(minGap,Math.hypot(rows[i].x-rows[j].x,rows[i].z-rows[j].z));}}
    if(tag==='after'){assert(minGap>=.64,`overlap: ${minGap}`);assert(walking>30,'walking leg animation missing');assert(!samples.flat().some(r=>r.wall),'NPC crossed a wall');}
    await p.evaluate(()=>{__qa.player.position.set(32,0,13.4);__qa.CAM.yaw=-Math.PI/2;});await p.waitForTimeout(900);await shot('lockers');
    await p.evaluate(()=>{__qa.player.position.set(4.5,0,15.5);__qa.CAM.yaw=Math.PI;});await p.waitForTimeout(900);await shot('entrance');
    const models=await p.evaluate(()=>__qa.scene.children.filter(o=>/p2-(cabinet|lockers|fridge|main-entrance)/.test(o.name)).map(o=>({name:o.name,x:o.position.x,z:o.position.z,yaw:o.rotation.y})));
    if(tag==='after'){assert(models.find(m=>m.name==='p2-lockers'&&m.yaw===-Math.PI/2));assert(models.find(m=>m.name==='p2-main-entrance'));}
    if(tag==='after'){
      // After the stress fixture, navigate by UI, collect the phone, then start class.
      await p.evaluate(()=>{__qa.SET.speed=1;});await navigate();await drain();
      await navigate();await drain(false);await shot('class-ready');
      assert.strictEqual(await p.evaluate(()=>__consistencyAudit().jhClassReady),true);
      // Narrow Chromium viewports: real WebGL and visible touch-sized controls.
      await p.locator('#dlg .choice').nth(1).click();await drain();for(const width of [375,390,430]){await p.setViewportSize({width,height:844});await p.waitForTimeout(250);await shot(`phone-${width}`);assert(await p.isVisible('#dpad'));}
      await p.setViewportSize({width:1280,height:800});
    }
    // Classroom earthquake, all choices, result cleanup and no contradictory past-tense opening.
    const eventChecks=await p.evaluate(()=>{
      const q=__qa;Object.values(q.npcs).forEach(n=>{n.visible=false;});q.extras.forEach(e=>{e.p.visible=false;});
      const e=q.extras.find(e=>e.kind==='jh');e.p.visible=true;q.agentPlace(e.p,...e.home);q.player.position.set(e.home[0]+.7,0,e.home[1]+.3);
      q.G.clock=19*60+30;const result=[];
      for(let i=0;i<3;i++){const ev=q.EVENTS.find(e=>e.id==='quake').make();ev.onOpen?.();const opening=ev.pages(q.G);const c=ev.choices(q.G)[i];c.onResolve?.();const text=typeof c.res==='function'?c.res(q.G):c.res;
        if(i===0)q.animPerson(e.p,.2,1,{act:e.p.userData.act});result.push({opening,text,act:e.p.userData.act,y:e.p.userData.rig.position.y});ev.onClose?.();}
      return {result,restored:e.p.userData.act!=='cover'&&e.p.userData.rig.position.y===0};
    });
    if(tag==='after'){assert(eventChecks.result[0].opening[1][1].includes('還在晃'));assert.strictEqual(eventChecks.result[0].act,'cover');assert(eventChecks.restored);}
    let routeChecks=null;
    if(tag==='after'){
      routeChecks=await p.evaluate(()=>{
        const q=__qa;Object.values(q.npcs).forEach(n=>n.visible=false);q.extras.forEach(e=>e.p.visible=false);
        const a=q.extras[0].p,b=q.extras[1].p;let escaped=false;
        a.visible=true;q.agentPlace(a,15.4023,3.517,0);q.agentGo(a,4.5,17.3,0,()=>escaped=true);
        for(let i=0;i<1200&&!escaped;i++){q.moveAgent(a,.025);q.animPerson(a,.025,i*.025,{walk:a.userData.moving});}
        q.agentPlace(a,30,14,0);b.visible=true;q.agentPlace(b,32,14,0);let doneA=false,doneB=false,min=Infinity;
        q.agentGo(a,32,14,0,()=>doneA=true);q.agentGo(b,30,14,0,()=>doneB=true);
        for(let i=0;i<800&&!(doneA&&doneB);i++){q.moveAgent(a,.025);q.moveAgent(b,.025);min=Math.min(min,Math.hypot(a.position.x-b.position.x,a.position.z-b.position.z));}
        const initial=a.userData.phase;q.moveAgent(a,.1);q.animPerson(a,.1,21,{walk:false});
        return {escaped,doneA,doneB,min,idlePhaseUnchanged:a.userData.phase===initial};
      });
      assert(routeChecks.escaped,'desk-corner escape failed');assert(routeChecks.doneA&&routeChecks.doneB,'opposing traffic stalled');assert(routeChecks.min>=.64);assert(routeChecks.idlePhaseUnchanged);
    }
    fs.writeFileSync(path.join(out,`${tag}-observations.json`),JSON.stringify({quake,minGap,walking,models,eventChecks,routeChecks,arrivalEnd,samples,errors},null,2));
    assert.deepStrictEqual(errors,[]);console.log(tag,'real browser reproduction complete',quake);
  }finally{await b.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
