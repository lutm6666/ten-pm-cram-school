// 三層樓格局的尋路與人流：
// 1. 從 1F 門口到每一個命名地點都有路；跨樓層的路會經過樓梯或電梯。
// 2. 每一間教室的每一個座位，從教室門口都走得到。
// 3. 國中生 17:20 起陸續到班、國小生週三 12:50 回來：全部走到座位，沒有人卡住。
// 4. 玩家按「帶我去」從 1F 走到 3F 九年級講台，會換樓層並抵達。
// 先建測試頁：python3 build.py stub.js tests/test.html
const {chromium}=require('playwright');
const fs=require('fs'),assert=require('assert');
(async()=>{const b=await chromium.launch();try{
  const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.route('**/test.html',route=>{let h=fs.readFileSync(__dirname+'/test.html','utf8');const at=h.lastIndexOf('})();');
    h=h.slice(0,at)+'window.__nav={npcs,extras,agentPlace,agentGo,moveAgent,moveNPCs,tickCrowd,crowdSettle,crowdTimes,crowdWanted,findPathFrom,seatsOf,CLASS_SEATS,SPOTS,floorOf,blockedAt,get G(){return G},clockT,setG:g=>{G=g}};'+h.slice(at);
    route.fulfill({contentType:'text/html',body:h});});
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(300);

  const spots=await p.evaluate(()=>{const q=__nav,door=q.SPOTS.door.pos,bad=[],cross=[];
    for(const k in q.SPOTS){const s=q.SPOTS[k].pos,path=q.findPathFrom(door[0],door[1],s[0],s[1]);
      if(!path){bad.push(k);continue;}const end=path[path.length-1];if(Math.hypot(end[0]-s[0],end[1]-s[1])>1.6)bad.push(k+' 終點太遠');
      if(q.floorOf(s[0])!==0&&!path.some(pt=>pt.via))bad.push(k+' 跨樓層沒有經過樓梯或電梯');if(q.floorOf(s[0])!==0)cross.push(k);}
    return {bad,cross:cross.length,total:Object.keys(q.SPOTS).length};});
  assert.deepStrictEqual(spots.bad,[],'每個地點都要走得到：'+spots.bad.join('、'));
  console.log(`spots reachable from 1F door PASS (${spots.total} 個地點，${spots.cross} 個要換樓層)`);

  const seats=await p.evaluate(()=>{const q=__nav,bad=[];let n=0;const a=q.extras.find(e=>e.kind==='jh').p,kid=q.extras.find(e=>e.kind==='kid').p;
    q.extras.forEach(e=>e.p.visible=false);Object.values(q.npcs).forEach(x=>x.visible=false);
    const doorOf={g5:'g5door',g4:'g4door',g6:'g6door',c7:'c7door',c8:'c8door',c9:'c9door',english:'engdoor'};
    for(const room in q.CLASS_SEATS){const d=q.SPOTS[doorOf[room]].pos,who=q.CLASS_SEATS[room].kid||room==='english'?kid:a;who.visible=true;
      q.seatsOf(room).forEach(([x,z,r],i)=>{n++;q.agentPlace(who,d[0],d[1],0);q.agentGo(who,x,z,r);let k=0;while(who.userData.path&&k++<4000)q.moveAgent(who,.05);
        const dd=Math.hypot(who.position.x-x,who.position.z-z);if(who.userData.routeFailed||dd>.15)bad.push(`${room}#${i} 停在 ${dd.toFixed(2)}`);});
      who.visible=false;}
    return {bad,n};});
  assert.deepStrictEqual(seats.bad,[],'每個座位都要坐得到：'+seats.bad.join('、'));
  console.log(`every classroom seat: walk in from the door and sit down PASS (${seats.n} 個座位)`);

  // 人流：用假的 G 驅動時間表，固定步長模擬
  const crowd=await p.evaluate(()=>{const q=__nav,res={};
    for(const [label,line,day,from,until,kinds] of [['國中生到班','jh',1,17*60+19,17*60+58,['jh']],['週三國小生回來','care',2,12*60+49,13*60+5,['kid']]]){
      const G={line:{id:line,crowd:kinds},day,clock:from,done:false,idx:0,steps:[{t:"00:00"}],stepReady:false};q.setG(G);
      q.extras.forEach(e=>{e.p.visible=false;e.state='away';e.p.userData.path=null;});
      let t=0;const dt=.05;while(G.clock<until){G.clock+=dt*.25;q.clockT.elapsedTime+=dt;q.tickCrowd();q.moveNPCs(dt);t+=dt;}
      // 再多走 40 秒讓最後到的人坐下
      for(let i=0;i<800;i++){q.clockT.elapsedTime+=dt;q.tickCrowd();q.moveNPCs(dt);}
      const mine=q.extras.filter(e=>kinds.includes(e.kind)&&q.crowdWanted(e));
      res[label]={want:mine.length,here:mine.filter(e=>e.state==='here').length,stuck:mine.filter(e=>e.state!=='here').map(e=>[e.room,e.state,+e.p.position.x.toFixed(1),+e.p.position.z.toFixed(1)]),failed:mine.filter(e=>e.p.userData.routeFailed).length};}
    q.setG(null);return res;});
  for(const [label,r] of Object.entries(crowd)){assert(r.want>0,label+' 應該有人');assert.strictEqual(r.here,r.want,label+' 有人沒走到座位：'+JSON.stringify(r.stuck));}
  console.log('crowd arrivals reach their seats PASS',JSON.stringify(Object.fromEntries(Object.entries(crowd).map(([k,v])=>[k,`${v.here}/${v.want}`]))));

  // 玩家：1F 門口 → 3F 九年級講台
  await p.reload();await p.waitForTimeout(300);await p.click('[data-act=start]');
  if(await p.isVisible('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');
  const ok=await p.evaluate(()=>{const s=__nav.SPOTS.c9podium.pos;__dbg.tp(__nav.SPOTS.door.pos[0],__nav.SPOTS.door.pos[1]-.5);return __dbg.go(s[0],s[1]+.6);});
  assert(ok,'1F 到 3F 九年級講台要有路');
  await p.waitForFunction(()=>{const s=__nav.SPOTS.c9podium.pos,[x,z]=__dbg.pos();return Math.hypot(x-s[0],z-s[1])<1.9&&!(__dbg.path||[]).length;},null,{timeout:60000}).catch(async e=>{console.log('player at',await p.evaluate(()=>({pos:__dbg.pos(),path:__dbg.path,mode:__dbg.mode,target:__nav.SPOTS.c9podium.pos})));throw e;});
  assert.strictEqual(await p.evaluate(()=>__nav.floorOf(__dbg.pos()[0])),2,'玩家換到 3F');
  console.log('player cross-floor walk 1F door → 3F podium PASS');
  assert.deepStrictEqual(errs,[],'頁面不能有錯誤');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exit(1);});
