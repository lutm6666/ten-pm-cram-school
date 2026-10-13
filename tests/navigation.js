// Reproduce yenroll's podium traffic jam without random timing or longer waits.
const {chromium}=require('playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{const b=await chromium.launch();try{
  const p=await b.newPage();
  await p.route('**/test.html',route=>{let h=fs.readFileSync(process.env.TEST_PAGE||__dirname+'/test.html','utf8');const at=h.lastIndexOf('})();');h=h.slice(0,at)+'window.__nav={npcs,extras,agentPlace,agentGo,moveAgent,moveNPCs,guideTarget,setCrowd,tickCrowd,clockT};'+h.slice(at);return route.fulfill({body:h,contentType:'text/html'});});
  await p.goto('file://'+__dirname+'/test.html');await p.click('[data-role=yun]');await p.click('[data-act=start]');
  const result=await p.evaluate(()=>{
    const q=__nav;__dbg.jump('yenroll');Object.values(q.npcs).forEach(n=>n.visible=false);q.extras.forEach(e=>e.p.visible=false);
    const n=q.npcs.parent,t=q.npcs.teacher;n.visible=t.visible=true;q.agentPlace(t,18.6,2.9,Math.PI);
    return [.006,.016,.025,.05].flatMap(dt=>[[18.995004248215558,3.4392568647553245],[18.971953598247648,3.439789962439228],[19.02594244957587,3.4480274229685453]].map(start=>{
      q.agentPlace(n,...start,0);n.userData.anchor=[5.2,15.3,Math.PI];q.agentGo(n,5.2,15.3,Math.PI);
      let min=Infinity,wall=false;for(let i=0;i<Math.ceil(30/dt)&&n.userData.path;i++){q.moveAgent(n,dt);min=Math.min(min,Math.hypot(n.position.x-t.position.x,n.position.z-t.position.z));wall ||= __dbg.blockedAt(n.position.x,n.position.z);}
      // Yielding is part of the trip, even on frames with no displacement.
      q.agentGo(n,26,3.375,0);n.userData.moving=false;const guide=q.guideTarget({npc:'parent'});
      return {dt,min,initial:Math.hypot(start[0]-t.position.x,start[1]-t.position.z),wall,arrived:Math.hypot(n.position.x-5.2,n.position.z-15.3)<.03,guide:[guide.x,guide.z]};
    }));
  });
  for(const r of result){assert(r.arrived,`podium detour stalled at dt=${r.dt}`);assert(!r.wall,'detour crossed furniture/wall');assert(r.min>=Math.min(.66,r.initial)-.00001,'actor overlap increased');assert.deepStrictEqual(r.guide,[5.2,15.3],'guide changed during yield');}
  console.log('yenroll podium detour / body separation / stable guide PASS',result);
  if(await p.isVisible('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');
  await p.evaluate(()=>{window.__savedDelta=__nav.clockT.getDelta;__nav.clockT.getDelta=()=>.05;__dbg.tp(9.624773519383476,3.2078527119334486);__dbg.go(3.5,3.4);});
  await p.waitForFunction(()=>{const [x,z]=__dbg.pos();return x<8.6&&Math.hypot(x-3.5,z-3.4)<1.9;},null,{timeout:5000});
  await p.evaluate(()=>{__nav.clockT.getDelta=window.__savedDelta;});console.log('low-frame-rate office doorway PASS');
  const crowd=await p.evaluate(()=>{
    const q=__nav;__dbg.jump('yenroll');q.setCrowd('class',true);
    q.agentPlace(q.npcs.parent,26.9,5.6,-Math.PI/2);q.agentGo(q.npcs.parent,5.2,15.3,Math.PI);q.setCrowd('leave',true);
    let seconds=0;for(let i=0;i<1800&&q.npcs.parent.userData.path;i++){q.clockT.elapsedTime+=.025;q.tickCrowd();q.moveNPCs(.025);seconds+=.025;}
    return {seconds,pos:[q.npcs.parent.position.x,q.npcs.parent.position.z],arrived:!q.npcs.parent.userData.path};
  });
  assert(crowd.arrived,'parent stalled in full classroom departure traffic');assert(Math.hypot(crowd.pos[0]-5.2,crowd.pos[1]-15.3)<.03);console.log('full classroom departure PASS',crowd);
  const exit=await p.evaluate(()=>{
    const q=__nav,n=q.npcs.pinyu;q.setCrowd('class',true);
    // yclose explicitly removes the parents, Bo and Zhe before ot_pickup.
    for(const id of ['parent','parent2','bo','zhe'])q.npcs[id].visible=false;
    n.visible=true;q.agentPlace(n,17,4.62,Math.PI);n.userData.anchor=[4.6,16.3,Math.PI];q.agentGo(n,4.6,16.3,Math.PI);q.setCrowd('close',true);
    let arrival=null;const exits=[];for(let i=0;i<2400;i++){const visible=q.extras.filter(e=>e.p.visible);q.clockT.elapsedTime+=.025;q.tickCrowd();q.moveNPCs(.025);for(const e of visible)if(!e.p.visible)exits.push([e.p.position.x,e.p.position.z]);if(!n.userData.path&&arrival===null)arrival=i*.025;}
    return {arrival,pos:[n.position.x,n.position.z],remaining:q.extras.filter(e=>e.p.visible).map(e=>({kind:e.kind,state:e.state})),exits};
  });
  assert(exit.arrival!==null&&exit.arrival<45,'waiting student stalled in closing traffic');assert(Math.hypot(exit.pos[0]-4.6,exit.pos[1]-16.3)<.03);assert(exit.remaining.every(e=>e.kind==='study'&&e.state==='seat'),'departing students stalled');assert(exit.exits.length>20);assert(exit.exits.every(([x,z])=>x>3.6&&x<5.4&&z>=16.9&&z<=17.7),'student disappeared outside the entrance');console.log('closing traffic / waiting student / physical exit PASS',exit);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
