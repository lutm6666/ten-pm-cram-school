/* ================= 劇情／場景一致性修正 =================
   讓「角色已到場」「畫面看得到」「可互動」「劇情文字」使用同一套狀態。
   先集中在這裡驗證，Phase 2 穩定後再併回各主檔。 */

/* ---------- 資料層：已確認的文字／人數矛盾 ---------- */
if(LINES.care){
  // 15:52 就要出發接人，不是四點。
  const open=LINES.care.steps.find(s=>s.id==='c_open');
  if(open&&open.chapter&&open.chapter.rush)open.chapter.rush=open.chapter.rush.map(t=>t==='四點要去國小接小朋友。'?'三點五十分要去國小接小朋友。':t);

  // 小芸實際在 17:12 的交接段落進場，訊息改成和場景接近的時間。
  LINES.care.msgs=LINES.care.msgs.map(m=>m[1]==='小芸'&&/五點到/.test(m[2])?[m[0],m[1],m[2].replace('我五點到！','我五點十分左右到！')]:m);

  // 高三學生從六點後陸續進場，六點半時已經坐進教室。
  LINES.care.coda='六點半，高三的學生已經坐上小朋友剛剛坐過的椅子。補習班的一天還沒結束。';
  const late=LINES.care.steps.find(s=>s.id==='c_late');
  if(late){
    // 小米還在時，真正走到小米旁邊才能觸發；若已被接走才以門口為目標。
    late.target=G=>G.f.handedMi?{spot:'door'}:{npc:'mi'};
    const oldPages=late.pages;
    late.pages=G=>{
      const p=oldPages(G);
      if(!G.f.handedMi&&p&&p[0])p[0]=[null,'六點二十。安親班只剩小米還沒被接走。B 班的高三學生已經陸續進教室。'];
      return p;
    };
  }
}

if(LINES.jh){
  // 17:30 的章節明說六點後才陸續到班，子晴不能一開場就坐在教室。
  LINES.jh.npcs.qing=null;
  const xiang=LINES.jh.steps.find(s=>s.id==='j_xiang');
  if(xiang){
    xiang.npc=xiang.npc||{};
    xiang.npc.qing=[PJ.qingSeat[0],PJ.qingSeat[1],PJ.qingSeat[2],PJ.door];
  }
  // C 班物理座位是 9 席：7 個背景學生 + 阿翔 + 子晴。
  const cls=LINES.jh.steps.find(s=>s.id==='j_class');
  if(cls&&cls.pages){
    const oldPages=cls.pages;
    cls.pages=G=>oldPages(G).map(row=>[row[0],typeof row[1]==='string'?row[1].replace('C 班十個人。','C 班九個人。'):row[1]]);
  }
}

if(LINES.boss){
  const first=LINES.boss.steps&&LINES.boss.steps[0];
  if(first&&first.chapter&&first.chapter.title==='開門前')first.chapter.title='晚班開始前';
  if(first&&first.chapter&&first.chapter.rush)first.chapter.rush=first.chapter.rush.map(t=>t==='老師們在休息室等你。'?'許老師在休息室等你。':t);
}

if(LINES.yun){
  // 點名時場景固定呈現 18/20；若文字保證「柏翰十分鐘後到」，之後畫面卻永遠仍是 18 人會矛盾。
  // 改成家長回報「會晚很多，先記遲到」，保留這條劇情但不虛構畫面上不存在的第 19 人。
  const roll=LINES.yun.steps.find(s=>s.id==='yroll');
  if(roll&&roll.choices){
    const oldChoices=roll.choices;
    roll.choices=G=>oldChoices(G).map(c=>c.label==='打給兩個缺席的家長'?{...c,res:[[null,'柏翰塞在路上，媽媽說今天會晚很多，先幫他記遲到。'],[null,'小安的媽媽支支吾吾：「我們……已經報了對面了。」'],[null,'你在名單上，把小安的名字畫了一條線。']]}:c);
  }
}

/* ---------- 下午 crowd：8 個小朋友，18:00 後高三開始進場 ---------- */
setKidCrowd=function(ph,instant,now,kids){
  // 劇情明定接 8 個：3 個有名字 + 5 個背景小朋友。多出的背景模型不參與本線。
  const activeKids=kids.slice(0,5),overflowKids=kids.slice(5);
  const hs=extras.filter(e=>e.kind==='class');
  const hide=e=>{e.p.visible=false;e.state='gone';e.p.userData.path=null;e.p.userData.act=null;};
  overflowKids.forEach(hide);
  extras.filter(e=>e.kind!=='kid'&&e.kind!=='class').forEach(hide);

  // 接送前，高三生不該提早坐在 B 班。
  if(ph!=='leave'&&ph!=='close')hs.forEach(hide);

  if(ph==='pre'){
    activeKids.forEach(hide);return;
  }
  if(ph==='class'){
    activeKids.forEach((e,i)=>{
      e.p.userData.act=null;
      if(e.p.visible||instant){e.p.visible=true;agentPlace(e.p,...e.home);e.state='seat';}
      else{e.state='toArrive';e.at=now+.5+i*1.2;}
    });return;
  }
  if(ph==='break'){
    let k=0;activeKids.forEach((e,i)=>{const u=e.p.userData;if(!e.p.visible)return;
      if(i%2===0){const sp=[[13.6,8.5],[15,9.6],[11,7.2],[10.6,4],[16.5,9.8]][k++%5];e.state='out';u.act=null;agentGo(e.p,sp[0],sp[1],Math.random()*6,()=>{u.act=pick(['cheer','wave','cup']);});}
      else u.act='cup';
    });return;
  }
  if(ph==='leave'||ph==='close'){
    activeKids.forEach((e,i)=>{
      if(e.state==='gone'||e.state==='exiting'||e.state==='leaving')return;
      if(!e.p.visible){e.state='gone';return;}
      e.state='leaving';e.p.userData.act=null;e.leaveAt=now+(ph==='close'?.3+i*.4:2+i*4);
    });

    // B 班晚課 18:30 開始。18:00 後讓高中生從門口逐批進來，而不是結尾只靠文字描述。
    hs.forEach((e,i)=>{
      if(instant){e.p.visible=true;agentPlace(e.p,...e.home);e.state='seat';return;}
      if(e.state==='seat'||e.state==='arriving'||e.state==='toArrive')return;
      e.p.visible=false;e.p.userData.path=null;e.p.userData.act=null;e.state='toArrive';
      const namedKidSeat=[PC.yuSeat,PC.ananSeat,PC.miSeat].some(s=>Math.hypot(e.home[0]-s[0],e.home[1]-s[1])<.35);
      e.at=now+1+i*.85+(namedKidSeat?10:0);
    });
  }
};

/* ---------- 晚間 pre：國中生六點後才陸續到，不在 17:20 就坐滿 ---------- */
// 原本 placeJuniorHigh() 會在老師／班導／主任線一開場就把 Amy、阿翔、子晴瞬移進 C 班。
// 先隱藏，之後由時鐘在 17:55–18:06 依序從大門走進來。
placeJuniorHigh=function(L){
  if(!['teacher','yun','boss'].includes(L.id))return;
  setNPC('amy',null,true);setNPC('xiang',null,true);setNPC('qing',null,true);
};

const CONS_BASE_SET_CROWD=setCrowd;
setCrowd=function(ph,instant){
  CONS_BASE_SET_CROWD(ph,instant);
  if(!G||G.line.crowd==='kids'||ph!=='pre')return;
  const now=clockT.elapsedTime;
  extras.filter(e=>e.kind==='jh').forEach((e,i)=>{
    const at=18*60+i*1.4;
    e.arriveClock=at;e.speed=1.9+(i%4)*.07;
    if(G.clock<at){
      e.p.visible=false;e.p.userData.path=null;e.p.userData.act=null;e.state='clockWait';e.arriveClock=at;
    }else if(e.state==='clockWait'){
      e.state='toArrive';e.at=now+i*.10;
    }
  });
};
const CONS_BASE_TICK_CROWD=tickCrowd;
tickCrowd=function(){
  if(G&&G.line.crowd!=='kids'){
    const now=clockT.elapsedTime;
    extras.forEach((e,i)=>{
      if(e.state==='clockWait'&&G.clock>=(e.arriveClock||Infinity)){e.state='toArrive';e.at=now+(i%4)*.12;}
    });
    // 其他晚間職業線也要看得到國中部的人「真的走進來」，而不是 17:20 就憑空坐好。
    if(['teacher','yun','boss'].includes(G.line.id)){
      const arrivals=[
        ['amy',17*60+55,PJ.amyPodium],
        ['qing',18*60+2,PJ.qingSeat],
        ['xiang',18*60+6,PJ.xiangSeat]
      ];
      arrivals.forEach(([id,at,pos])=>{
        const n=npcs[id];
        if(G.clock>=at&&n&&!n.visible)setNPC(id,[pos[0],pos[1],pos[2],PJ.door]);
      });
    }
  }
  CONS_BASE_TICK_CROWD();
};

/* ---------- 目標層：到定點以前不可搶跑；離場後不再殘留互動 ---------- */
function consTarget(t){return val(t,G);}
function consNpcReady(n){return !!(n&&n.visible&&!n.userData.path&&!n.userData.moving);}

targetOf=function(t){
  t=consTarget(t);if(!t)return null;
  if(t.npc){const n=npcs[t.npc];if(!n||(!n.visible&&!n.userData.entrySpec))return null;const a=!n.visible&&n.userData.anchor;return{x:a?a[0]:n.position.x,z:a?a[1]:n.position.z,h:n.userData.top+.8,name:CHARS[t.npc].name,kind:'npc',id:t.npc};}
  const s=SPOTS[t.spot];if(!s)return null;return{x:s.pos[0],z:s.pos[1],h:s.h+.5,name:s.name,kind:'spot'};
};
guideTarget=function(t){
  t=consTarget(t);const m=targetOf(t);if(!m)return null;
  if(t&&t.npc){const u=npcs[t.npc].userData;if((u.path||u.moving)&&u.anchor)return{...m,x:u.anchor[0],z:u.anchor[1]};}
  return m;
};
activeSides=function(){
  const list=SIDES[G.line.id]||[],ids=G.steps.map(s=>s.id),mt=stepReady()?consTarget(step().target):null,mainNpc=mt&&mt.npc,idx=sideStepIndex();
  return list.filter(sd=>{
    const st=consTarget(sd.target),n=st&&st.npc?npcs[st.npc]:null;
    return !G.sidesDone[sd.id]&&!(mainNpc&&st&&st.npc===mainNpc)&&idx>=ids.indexOf(sd.from)&&idx<=ids.indexOf(sd.until)&&(!sd.avail||sd.avail(G))&&(!st||!st.npc||consNpcReady(n));
  });
};
nearest=function(){
  const px=player.position.x,pz=player.position.z,d=(x,z)=>Math.hypot(x-px,z-pz),c=[],st=step(),mt=stepReady()?consTarget(st&&st.target):null,m=targetOf(mt);
  if(m&&(m.kind!=='npc'||consNpcReady(npcs[m.id]))){const dm=d(m.x,m.z);if(dm<1.9)c.push({dist:dm,type:'main',label:st.action||(m.kind==='npc'?`找${CHARS[m.id].name}`:`到${m.name}`)});}
  for(const sd of activeSides()){const t=targetOf(sd.target);if(t){const ds=d(t.x,t.z);if(ds<1.9)c.push({dist:ds,type:'side',sd,label:sd.action||`找${t.name}`});}}
  for(const it of ITEMS){if(itemMarks[it.id]&&!G.items.includes(it.id)){const di=d(it.pos[0],it.pos[1]);if(di<1.3)c.push({dist:di-.3,type:'item',it,label:'撿起來'});}}
  for(const id of chatTargets()){const n=npcs[id];if(!consNpcReady(n))continue;const dc=d(n.position.x,n.position.z);if(dc<1.5)c.push({dist:dc+.8,type:'chat',id,label:`聊聊・${CHARS[id].name}`});}
  const chatIds=new Set(chatTargets()),mainId=m&&m.kind==='npc'?m.id:null;
  for(const id in npcs){const n=npcs[id];if(!consNpcReady(n)||id===mainId||chatIds.has(id)||id===G.line.id)continue;const dn=d(n.position.x,n.position.z);if(dn<1.4)c.push({dist:dn+1.2,type:'greet',p:n,id,label:'打招呼'});}
  for(const e of extras){if(!e.p.visible||e.p.userData.path||e.p.userData.moving)continue;const de=d(e.p.position.x,e.p.position.z);if(de<1.1)c.push({dist:de+1.2,type:'greet',p:e.p,kind:e.kind,label:'打招呼'});}
  if(c.length){c.sort((a,b)=>a.dist-b.dist);return c[0];}
  for(const inf of INFO){if(d(inf.pos[0],inf.pos[1])<1.6)return{type:'info',inf,label:'看說明'};}
  return null;
};

/* 測試／人工驗收可直接看目前一致性狀態。 */
window.__consistencyAudit=()=>({
  line:G&&G.line&&G.line.id,step:G&&G.steps[G.idx]&&G.steps[G.idx].id,
  visibleKids:extras.filter(e=>e.kind==='kid'&&e.p.visible).length,
  visibleHigh:extras.filter(e=>e.kind==='class'&&e.p.visible).length,
  visibleJh:extras.filter(e=>e.kind==='jh'&&e.p.visible).length,
  namedJh:['amy','qing','xiang'].filter(id=>npcs[id]&&npcs[id].visible),
  movingNpcs:Object.keys(npcs).filter(id=>npcs[id].visible&&(npcs[id].userData.path||npcs[id].userData.moving))
});
