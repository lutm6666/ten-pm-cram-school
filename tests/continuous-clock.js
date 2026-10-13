// Deterministic browser logic regression. UI choices use the real dialogue
// handlers; controlled 50 ms frames advance the production clock, never jump it.
// Build first: python build.py stub.js tests/test.html
const {chromium}=require('playwright');
const assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http');
const probe=`window.__clockQA={get G(){return G},get mode(){return mode},get player(){return player},get D(){return D},step,stepReady,enterStep,nextStep,openStep,tickClock,simulateFrame,nearest,renderAll,renderDock,activeSides,phaseOf,setCrowd,tickCrowd,saveGame,npcs,extras,INFO,LINES,SET,toMin,fmt,clockT,get marker(){return marker},refreshNear(){near=nearest();renderDock();}};SET.speed=0;`;
const root=path.resolve(__dirname,'..'),htmlPath=path.join(__dirname,'test.html');
assert(fs.existsSync(htmlPath),'Build tests/test.html before running continuous-clock.js');
const server=http.createServer((req,res)=>{
  if(req.url==='/stub.js'){res.setHeader('Content-Type','application/javascript');res.end(fs.readFileSync(path.join(__dirname,'stub.js')));return;}
  if(req.url!=='/'){res.statusCode=404;res.end();return;}
  let html=fs.readFileSync(htmlPath,'utf8'),at=html.lastIndexOf('})();');
  assert(at>=0,'Built test page must retain its lexical game closure');
  html=html.slice(0,at)+probe+html.slice(at);
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);
});
const results=[];
const toMinute=t=>{const [h,m]=t.split(':').map(Number);return h*60+m;};
function check(label,detail){results.push({label,...detail});console.log('PASS',label,detail?JSON.stringify(detail):'');}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  // Disable only automatic rendering in this logic suite. simulateFrame still
  // exercises input, collisions, NPC movement, and the same clock used by RAF.
  await page.addInitScript(()=>{window.requestAnimationFrame=()=>0;});
  const url=`http://127.0.0.1:${server.address().port}/`;
  const state=()=>page.evaluate(()=>{const q=__clockQA,G=q.G,s=q.step();return {idx:G.idx,id:s.id,clock:G.clock,time:G.time,ready:G.stepReady,due:G.due,mode:q.mode,phase:q.phaseOf(),chapter:G.chapterTitle,log:G.log.length};});
  async function start(line,config={}){
    await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();
    await page.evaluate(([line,config])=>{if(config.noEvents)__clockQA.LINES[line].eventSlots=[];
      if(config.event)__clockQA.LINES[line].eventSlots=[config.event];
      if(config.events)__clockQA.LINES[line].events=config.events;
    },[line,config]);
    await page.locator(`[data-role="${line}"]`).click();await page.locator('[data-act="start"]').click();
    if(await page.isVisible('[data-act="chapterGo"]'))await page.locator('[data-act="chapterGo"]').click();
    assert.strictEqual(await page.evaluate(()=>__clockQA.mode),'walk',`${line} starts in walking mode`);
  }
  async function drain(choice=0){
    for(let i=0;i<40;i++){
      const mode=await page.evaluate(()=>__clockQA.mode);
      if(mode==='chapter'){await page.locator('[data-act="chapterGo"]').click();continue;}
      if(mode!=='dialog')return;
      if(await page.isVisible('#dlg .choice')){
        assert(await page.locator(`#dlg [data-choice="${choice}"]`).count(),'Fixture choice must exist');
        await page.locator(`#dlg [data-choice="${choice}"]`).click();
      }else await page.locator('[data-act="dnext"]').click();
    }
    assert.fail('Dialogue did not finish within its page/choice count');
  }
  async function frames(seconds){await page.evaluate(seconds=>{const q=__clockQA;for(let t=0;t<seconds;t+=.05){q.clockT.elapsedTime+=.05;q.simulateFrame(.05,q.clockT.elapsedTime);}},seconds);}
  async function atMain(){
    const targetNpc=await page.evaluate(()=>{const t=typeof __clockQA.step().target==='function'?__clockQA.step().target(__clockQA.G):__clockQA.step().target;return t&&t.npc;});
    if(targetNpc){
      // Do not put the fixture player on top of a travelling target: player
      // collision correctly stops NPC paths, which would hide the main action.
      await page.evaluate(id=>{const n=__clockQA.npcs[id],a=n.userData.anchor;__dbg.tp(a[0],a[1]+2.4);},targetNpc);
      await frames(30);
    }
    await page.evaluate(()=>{const t=__dbg.targetOf(__clockQA.step().target);if(!t)throw Error('Current task must have a target');__dbg.tp(t.x,t.z);__clockQA.refreshNear();});
    assert.strictEqual(await page.evaluate(()=>__dbg.near()?.type),'main','Ready task is offered at its real target: '+JSON.stringify(await page.evaluate(()=>({id:__clockQA.step().id,target:__dbg.targetOf(__clockQA.step().target),near:__dbg.near()?.type,npcs:__dbg.npcState()}))));
  }
  async function finishMain(choice=0){await atMain();await page.locator('#actBtn').click();await drain(choice);}
  async function advanceTo(target){
    // Small production ticks preserve minute boundaries, messages, bells, and
    // activation. A hard iteration budget catches non-progress instead of
    // increasing Playwright timeouts or setting G.clock to the target.
    return page.evaluate(target=>{
      const q=__clockQA,start=q.G.clock;q.SET.speed=1;let count=0;
      while(q.G.clock<target&&q.mode==='walk'){
        if(++count>60000)throw Error('Clock failed to progress within 60,000 natural ticks');
        q.tickClock(Math.min(.05,(target-q.G.clock)/.25));
      }
      q.SET.speed=0;return {start,end:q.G.clock,count,mode:q.mode};
    },target);
  }
  async function resume(){
    await page.evaluate(()=>__clockQA.saveGame());await page.reload();
    assert(await page.isVisible('[data-act="resume"]'),'Saved game is offered after reload');
    await page.locator('[data-act="resume"]').click();
  }
  async function blockedBeforeTime(){
    const before=await state();
    const after=await page.evaluate(()=>{
      const q=__clockQA,t=__dbg.targetOf(q.step().target);if(t)__dbg.tp(t.x,t.z);
      q.refreshNear();const near=__dbg.near()?.type;
      q.openStep();q.nextStep();q.simulateFrame(.05,0);
      return {idx:q.G.idx,clock:q.G.clock,mode:q.mode,near,ready:q.G.stepReady,due:q.G.due,marker:q.marker.visible};
    });
    assert.notStrictEqual(after.near,'main','Scheduled main task is absent from nearby actions');
    assert.strictEqual(after.idx,before.idx,'nextStep cannot complete an unopened scheduled task');
    assert.strictEqual(after.clock,before.clock,'openStep before start must not spend time');
    assert.strictEqual(after.mode,'walk','Early open must not show dialogue or chapter');
    assert.strictEqual(after.ready,false);assert.strictEqual(after.due,null);assert.strictEqual(after.marker,false);
  }
  try{
    // All five unmodified first task dialogues finish twelve minutes before
    // their next production task. Fixture time is set before opening a task;
    // the transition itself must account for only openStep's two minutes.
    for(const line of ['teacher','yun','boss','care','jh']){
      await start(line);
      const fixture=await page.evaluate(()=>{
        const q=__clockQA,nt=q.toMin(q.G.steps[1].t);q.G.clock=nt-14;q.renderAll();
        return {start:q.G.clock,next:nt,nextId:q.G.steps[1].id};
      });
      await finishMain(({teacher:2,yun:1,boss:1,care:1,jh:0})[line]);
      const pending=await state();
      assert.strictEqual(pending.id,fixture.nextId);assert.strictEqual(pending.clock,fixture.start+2,`${line} cannot fast-forward at nextStep`);
      assert.strictEqual(fixture.next-pending.clock,12);assert.strictEqual(pending.ready,false);assert.strictEqual(pending.due,null);
      assert.strictEqual(await page.textContent('#clk'),pending.time,'HUD shows actual clock');
      assert((await page.textContent('#clksub')).includes(qTime(fixture.next)),'HUD announces scheduled start');
      await blockedBeforeTime();
      await advanceTo(fixture.next-.025);assert.strictEqual((await state()).ready,false,'Task remains waiting immediately before start');
      const natural=await advanceTo(fixture.next);
      const active=await state();assert.strictEqual(active.clock,fixture.next);assert.strictEqual(active.ready,true);assert.strictEqual(active.id,fixture.nextId);
      assert.strictEqual(active.mode,'walk');assert(active.due>active.clock,'Activation installs original deadline');
      await atMain();
      check(`${line}: early dialogue completion, defensive gate, natural scheduled activation`,{pending:pending.time,next:qTime(fixture.next),ticks:natural.count});
    }

    await start('teacher',{noEvents:true});
    await page.evaluate(()=>{__clockQA.G.clock=17*60+36;__clockQA.renderAll();});await finishMain(2);
    const waiting=await state();
    const bossBefore=await page.evaluate(()=>__clockQA.npcs.boss.userData.anchor.slice());
    assert.deepStrictEqual(bossBefore.slice(0,2),[3.5,1.2],'Next task must not move the director into the hall early');
    // Real key events feed production movement/collision simulation.
    await page.evaluate(()=>__dbg.tp(4.5,16.5));const pos0=await page.evaluate(()=>__dbg.pos());
    await page.keyboard.down('ArrowUp');await frames(.8);await page.keyboard.up('ArrowUp');
    const pos1=await page.evaluate(()=>__dbg.pos());assert(Math.hypot(pos1[0]-pos0[0],pos1[1]-pos0[1])>1,'Waiting player can walk freely');
    assert.strictEqual((await state()).id,waiting.id);assert.strictEqual((await state()).clock,waiting.clock);
    const kid=await page.evaluate(()=>__clockQA.activeSides().find(s=>s.id==='kid')?.id);assert.strictEqual(kid,'kid','Existing allowed side is available while waiting');
    await page.evaluate(()=>{const sd=__clockQA.activeSides().find(s=>s.id==='kid'),t=__dbg.targetOf(sd.target);__dbg.tp(t.x,t.z);__clockQA.refreshNear();});
    assert.strictEqual(await page.evaluate(()=>__dbg.near()?.type),'side');await page.locator('#actBtn').click();await drain(1);
    assert.strictEqual(await page.evaluate(()=>__clockQA.G.sidesDone.kid),1);assert.strictEqual((await state()).clock,waiting.clock+3);assert.strictEqual((await state()).ready,false);
    // An environment explanation uses its visible interaction and close UI.
    await page.evaluate(()=>{const i=__clockQA.INFO[0];__dbg.tp(i.pos[0],i.pos[1]);__clockQA.refreshNear();});
    assert.strictEqual(await page.evaluate(()=>__dbg.near()?.type),'info');await page.locator('#actBtn').click();
    assert.strictEqual(await page.evaluate(()=>__clockQA.mode),'info');await page.locator('#sheet [data-act="closeSheet"]').click();
    assert.strictEqual((await state()).mode,'walk');assert.strictEqual((await state()).ready,false);
    const saved=await state(),savedPos=await page.evaluate(()=>__dbg.pos());await resume();const loaded=await state();
    assert.deepStrictEqual(loaded,saved,'Waiting main task state and clock survive reload');assert.deepStrictEqual(await page.evaluate(()=>__dbg.pos()),savedPos,'Waiting position survives reload');
    assert.deepStrictEqual(await page.evaluate(()=>__clockQA.npcs.boss.userData.anchor.slice(0,2)),[3.5,1.2],'Resume cannot apply pending NPC location');
    await blockedBeforeTime();
    await page.evaluate(()=>{__clockQA.G.clock+=.375;__dbg.tp(10.4,15.1);__clockQA.renderAll();});
    const reloadWaiting=await state(),reloadPos=await page.evaluate(()=>__dbg.pos());
    await page.reload();await page.locator('[data-act="resume"]').click();
    assert.deepStrictEqual(await state(),reloadWaiting,'Direct reload checkpoints the fractional waiting clock through pagehide');
    assert.deepStrictEqual(await page.evaluate(()=>__dbg.pos()),reloadPos,'Direct reload checkpoints current exploration position');
    assert.strictEqual(await page.evaluate(()=>__clockQA.extras.filter(e=>['class','jh','study'].includes(e.kind)&&e.p.visible).length),0,'Evening crowds cannot arrive during the early waiting fixture');
    assert.strictEqual(await page.evaluate(()=>['amy','qing','xiang'].some(id=>__clockQA.npcs[id].visible)),false,'Time-driven named arrivals remain absent before schedule');
    check('waiting: free movement, allowed side, environment interaction, save/reload, NPC/crowd timing',{clock:loaded.time,id:loaded.id});

    // Deadlines cannot be recomputed to clock+8 when restoring an active task.
    await advanceTo(17*60+50);
    const due=(await state()).due;await page.evaluate(due=>{__clockQA.G.clock=due+11;__clockQA.renderAll();},due);
    const lateBefore=await page.evaluate(()=>({due:__clockQA.G.due,clock:__clockQA.G.clock,s:{...__clockQA.G.s},h:{...__clockQA.G.h},lates:__clockQA.G.lates,lateMin:__clockQA.G.lateMin}));
    await resume();assert.strictEqual((await state()).due,due,'Resume preserves original deadline after it has passed');
    await atMain();await page.locator('#actBtn').click();
    const lateAfter=await page.evaluate(()=>({s:__clockQA.G.s,h:__clockQA.G.h,lates:__clockQA.G.lates,lateMin:__clockQA.G.lateMin,log:__clockQA.G.log,text:document.querySelector('#dlg').innerText}));
    assert.strictEqual(lateAfter.lates,lateBefore.lates+1);assert.strictEqual(lateAfter.lateMin,lateBefore.lateMin+11);
    assert.strictEqual(lateAfter.s.stu,lateBefore.s.stu-12);assert.strictEqual(lateAfter.h.trial,lateBefore.h.trial-9);
    assert.strictEqual(lateAfter.log.filter(r=>r[1]==='遲到 11 分鐘').length,1);assert(lateAfter.text.includes('晚了 11 分鐘'));
    await drain(2);check('late arrival: original deadline, 11-minute count, scaled penalty, and log survive resume',{due:qTime(due),lates:lateAfter.lates,lateMin:lateAfter.lateMin});

    // A future chapter must not move its cast or interrupt exploration.
    await start('teacher',{noEvents:true});await page.evaluate(()=>__dbg.jump('hall'));
    await page.evaluate(()=>{__clockQA.G.clock=18*60+16;__clockQA.renderAll();});await finishMain(2);
    const chapterWait=await state();assert.strictEqual(chapterWait.id,'erase');assert.strictEqual(chapterWait.time,'18:18');assert.strictEqual(chapterWait.mode,'walk');assert.strictEqual(chapterWait.phase,'pre');
    assert.deepStrictEqual(await page.evaluate(()=>__clockQA.npcs.parent.userData.anchor.slice(0,2)),[5.2,15.3],'Chapter NPCs retain their earlier positions');
    await resume();assert.deepStrictEqual(await state(),chapterWait,'Waiting chapter survives reload');
    assert.deepStrictEqual(await page.evaluate(()=>__clockQA.npcs.parent.userData.anchor.slice(0,2)),[5.2,15.3],'Pending chapter cast remains in lobby after resume');
    await advanceTo(18*60+29.975);assert.strictEqual((await state()).mode,'walk');
    await advanceTo(18*60+30);assert.strictEqual((await state()).mode,'chapter');assert.strictEqual((await state()).phase,'class');
    assert(await page.isVisible('[data-act="chapterGo"]'));assert.strictEqual((await state()).clock,18*60+30);
    await page.locator('[data-act="chapterGo"]').click();await atMain();await page.locator('#actBtn').click();await drain(1);
    assert.strictEqual((await state()).id,'lesson1');assert.strictEqual((await state()).ready,false);assert.strictEqual((await state()).time,'18:32','Follow-up automatic lesson also waits');
    const autoWait=await state();await resume();assert.deepStrictEqual(await state(),autoWait,'Waiting automatic lesson survives reload');
    await advanceTo(18*60+34.975);assert.strictEqual((await state()).mode,'walk');
    await advanceTo(18*60+35);assert.strictEqual((await state()).mode,'dialog');assert.strictEqual((await state()).id,'lesson1');assert.strictEqual((await state()).time,'18:37','Automatic task spends only its normal opening time at scheduled start');
    check('chapter and following auto task: wait, resume, then activate at their production times',{chapter:'18:30',auto:'18:35'});

    // A deterministic real random-event slot retains serializable event IDs.
    await start('jh',{event:{after:'j_room',t:'18:00',phase:'pre'},events:['blackout']});await page.evaluate(()=>__dbg.jump('j_room'));
    await finishMain(1);
    const eventWait=await state();assert.strictEqual(eventWait.id,'ev_blackout');assert.strictEqual(eventWait.time,'17:52');assert.strictEqual(eventWait.mode,'walk');assert.strictEqual(eventWait.ready,false);
    await resume();assert.deepStrictEqual(await state(),eventWait,'Pending generated event restores without opening it');
    assert.strictEqual(await page.evaluate(()=>__clockQA.npcs.xiang.visible),false,'Future main-task NPC has not entered');
    await advanceTo(17*60+59.975);assert.strictEqual((await state()).mode,'walk');await advanceTo(18*60);
    assert.strictEqual((await state()).id,'ev_blackout');assert.strictEqual((await state()).mode,'dialog');assert.strictEqual((await state()).time,'18:02');
    await drain(0);const xiangWait=await state();assert.strictEqual(xiangWait.id,'j_xiang');assert.strictEqual(xiangWait.ready,false);
    await resume();assert.deepStrictEqual(await state(),xiangWait);assert.strictEqual(await page.evaluate(()=>__clockQA.npcs.xiang.visible),false,'Pending main NPC remains absent on reload');
    await advanceTo(18*60+9.975);assert.strictEqual(await page.evaluate(()=>__clockQA.npcs.xiang.visible),false);await advanceTo(18*60+10);
    assert.strictEqual((await state()).ready,true);await frames(1);assert(await page.evaluate(()=>__clockQA.npcs.xiang.visible||!!__clockQA.npcs.xiang.userData.entrySpec),'Named main NPC starts entering only when its task opens');
    check('generated auto event and future named NPC: serialized waiting, scheduled activation',{event:'18:00',npc:'18:10'});

    // Last-step index alone cannot force the crowd into the closing phase.
    await start('care',{noEvents:true});await page.evaluate(()=>__dbg.jump('c_parents'));
    if(await page.isVisible('[data-act="chapterGo"]'))await page.locator('[data-act="chapterGo"]').click();
    await page.evaluate(()=>{__clockQA.G.clock=18*60+6;__clockQA.renderAll();});await finishMain(1);
    const finalWait=await state();assert.strictEqual(finalWait.id,'c_late');assert.strictEqual(finalWait.time,'18:08');assert.strictEqual(finalWait.ready,false);assert.strictEqual(finalWait.phase,'leave');
    await resume();assert.deepStrictEqual(await state(),finalWait,'Pending final task keeps real crowd phase on resume');await advanceTo(18*60+20);
    assert.strictEqual((await state()).ready,true);assert.strictEqual((await state()).phase,'close');
    check('pending final task: closing phase waits for scheduled start',{waiting:'18:08',start:'18:20'});

    // Held glasses exercise a side's availability on targetless automatic
    // events, where accessing step().target.npc used to throw.
    await start('teacher',{event:{after:'hall',t:'18:10',phase:'pre'},events:['blackout']});
    await page.evaluate(()=>__dbg.jump('hall'));await finishMain(2);
    await page.evaluate(()=>{__clockQA.G.items.push('glasses');__clockQA.simulateFrame(.05,0);});
    const glassesWait=await state();assert.strictEqual(glassesWait.id,'ev_blackout');assert.strictEqual(glassesWait.ready,false);
    assert(await page.evaluate(()=>__clockQA.activeSides().some(s=>s.id==='glasses')),'Allowed side stays available while waiting for a targetless event');
    await resume();assert.deepStrictEqual(await state(),glassesWait);assert(await page.evaluate(()=>__clockQA.activeSides().some(s=>s.id==='glasses')),'Held-glasses side survives targetless waiting resume');
    check('targetless auto waiting with held glasses: allowed side and reload remain valid',{event:glassesWait.id});

    // An allowed side can spend past the main task's start without interrupting
    // its dialogue or applying the main NPC layout underneath it.
    await start('teacher',{noEvents:true});await finishMain(2);
    await page.evaluate(()=>{const q=__clockQA;q.G.clock=17*60+49;const sd=q.activeSides().find(s=>s.id==='kid'),t=__dbg.targetOf(sd.target);__dbg.tp(t.x,t.z);q.refreshNear();q.renderAll();});
    assert.strictEqual(await page.evaluate(()=>__dbg.near()?.type),'side');await page.locator('#actBtn').click();
    const crossing=await state();assert.strictEqual(crossing.clock,17*60+52);assert.strictEqual(crossing.mode,'dialog');assert.strictEqual(crossing.ready,false);
    assert.deepStrictEqual(await page.evaluate(()=>__clockQA.npcs.boss.userData.anchor.slice(0,2)),[3.5,1.2],'Main NPC cannot move before the side dialogue returns to walking');
    await page.evaluate(()=>__clockQA.tickClock(.05));assert.deepStrictEqual(await state(),crossing,'Dialogue clock tick cannot activate the waiting main');
    await drain(1);assert.strictEqual((await state()).ready,false);await page.evaluate(()=>__clockQA.tickClock(.05));
    const crossed=await state();assert.strictEqual(crossed.ready,true);assert.strictEqual(crossed.clock,crossing.clock,'Main activation after side completion does not add a time jump');assert.strictEqual(crossed.mode,'walk');
    check('side spends across schedule: finish dialogue, then activate main without clock jump',{clock:crossed.time,id:crossed.id});

    // Saves predating the waiting fields infer readiness from their stored
    // clock. Neither legacy shape can push the clock or open a future task.
    await page.locator('[data-act="home"]').click();
    await page.evaluate(()=>{const sv=JSON.parse(localStorage.getItem('ten-pm:save'));delete sv.stepReady;delete sv.due;delete sv.chapterPending;localStorage.setItem('ten-pm:save',JSON.stringify(sv));});
    await page.reload();await page.locator('[data-act="resume"]').click();const legacyActive=await state();
    assert.strictEqual(legacyActive.clock,crossed.clock);assert.strictEqual(legacyActive.idx,crossed.idx);assert.strictEqual(legacyActive.ready,true);assert.strictEqual(legacyActive.mode,'walk');
    await page.locator('[data-act="home"]').click();
    await page.evaluate(()=>{const sv=JSON.parse(localStorage.getItem('ten-pm:save'));sv.clock=17*60+38;delete sv.stepReady;delete sv.due;delete sv.chapterPending;localStorage.setItem('ten-pm:save',JSON.stringify(sv));});
    await page.reload();await page.locator('[data-act="resume"]').click();const legacyWait=await state();
    assert.strictEqual(legacyWait.clock,17*60+38);assert.strictEqual(legacyWait.idx,crossed.idx);assert.strictEqual(legacyWait.ready,false);assert.strictEqual(legacyWait.due,null);assert.strictEqual(legacyWait.mode,'walk');
    await blockedBeforeTime();check('legacy save shape: active and waiting readiness inferred without clock jump',{active:legacyActive.time,waiting:legacyWait.time});
    // 「等到 HH:MM」：等待中可直接快轉。時鐘落在排定時間、步驟啟動，路上的人都已到位。
    for(const line of ['teacher','yun','boss','care','jh']){
      await start(line);await finishMain(({teacher:2,yun:1,boss:1,care:1,jh:0})[line]);
      const before=await state();assert.strictEqual(before.ready,false,line+' waits after early completion');
      assert(await page.isVisible('[data-act="waitNext"]'),line+' shows the wait button while waiting');
      const target=toMinute(await page.evaluate(()=>__clockQA.step().t));
      await page.locator('[data-act="waitNext"]').click();
      if(await page.isVisible('[data-act="chapterGo"]'))await page.locator('[data-act="chapterGo"]').click();
      await drain();
      const after=await state();
      assert(after.clock>=target&&after.clock<target+15,line+' clock lands on the scheduled start, not beyond: '+after.time);
      assert(after.ready||after.idx>before.idx,line+' next task activates');
      const stale=await page.evaluate(()=>__clockQA.extras.filter(e=>(e.state==='clockWait'&&__clockQA.G.clock>=(e.arriveClock??Infinity))||e.state==='arriving').length);
      assert.strictEqual(stale,0,line+' background arrivals are caught up after skipping');
      check('wait skip: '+line,{from:before.time,to:after.time,id:after.id});
    }
    assert.deepStrictEqual(errors,[],'Browser game logic must not throw');
    console.log(`Continuous-clock regression passed: ${results.length} scenario groups; five production role transitions.`);
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
function qTime(m){return `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;}
