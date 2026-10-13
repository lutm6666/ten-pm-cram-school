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
  const crowd=await p.evaluate(()=>{
    const q=__nav;__dbg.jump('yenroll');q.setCrowd('class',true);
    q.agentPlace(q.npcs.parent,26.9,5.6,-Math.PI/2);q.agentGo(q.npcs.parent,5.2,15.3,Math.PI);q.setCrowd('leave',true);
    let seconds=0;for(let i=0;i<1800&&q.npcs.parent.userData.path;i++){q.clockT.elapsedTime+=.025;q.tickCrowd();q.moveNPCs(.025);seconds+=.025;}
    return {seconds,pos:[q.npcs.parent.position.x,q.npcs.parent.position.z],arrived:!q.npcs.parent.userData.path};
  });
  assert(crowd.arrived,'parent stalled in full classroom departure traffic');assert(Math.hypot(crowd.pos[0]-5.2,crowd.pos[1]-15.3)<.03);console.log('full classroom departure PASS',crowd);
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
