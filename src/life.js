/* ================= 樓層裡的生活：學生上下課、NPC 日常動作、泡泡、特效 ================= */
const FX={shake:0,dark:0};
let crowdPhase=null,ambT=2,npcAmbT=3;
const BREAK_SPOTS=[[30,14],[32.5,13.6],[29.6,15.6],[10.4,3],[10.6,6.5],[10.3,9.5],[10.7,12.5],[7.6,15.9],[3,13.2],[6.8,13.6],[10.5,16],[13.6,12.2],[2.2,16.2]];
const DOOR=[4.5,17.3];
function phaseOf(){if(!G)return"pre";if(G.idx>=G.steps.length-1)return"close";let ph="pre";for(const [at,p] of (G.line.schedule||SCHEDULE)){const [h,m]=at.split(":").map(Number);if(G.clock>=h*60+m)ph=p;}return ph;}
const PHASE_STATUS={class:"上課中",break:"下課",leave:"收拾中",close:"收拾中"};
function statusOf(){const ph=phaseOf();return (G&&G.line.phaseStatus&&G.line.phaseStatus[ph])||PHASE_STATUS[ph]||(G&&G.line.preStatus)||"備課中";}
function setCrowd(ph,instant){
  if(ph===crowdPhase&&!instant)return;crowdPhase=ph;if(typeof syncItems==="function")syncItems();
  const now=clockT.elapsedTime,kidMode=!!(G&&G.line.crowd==="kids"),kids=extras.filter(e=>e.kind==="kid");
  if(kidMode)return setKidCrowd(ph,instant,now,kids);
  kids.forEach(e=>{e.p.visible=false;e.state="gone";e.p.userData.path=null;});
  const cls=extras.filter(e=>e.kind==="class"||e.kind==="jh"),stu=extras.filter(e=>e.kind==="study");
  if(ph==="pre"){
    cls.forEach((e,i)=>{e.p.userData.act=null;if(!instant)return;
      if(i%2===0){e.p.visible=true;agentPlace(e.p,...e.home);e.state="seat";}else{e.p.visible=false;e.state="toArrive";e.at=now+2+i*1.6;}});
    stu.forEach(e=>{e.p.visible=true;agentPlace(e.p,...e.home);e.state="seat";});
  }else if(ph==="class"){
    cls.forEach(e=>{e.p.visible=true;agentPlace(e.p,...e.home);e.state="seat";e.p.userData.act=null;});
  }else if(ph==="break"){
    let k=0;cls.forEach((e,i)=>{const u=e.p.userData;e.p.visible=true;
      if(i%3===0){const sp=BREAK_SPOTS[k++%BREAK_SPOTS.length];e.state="out";u.act=null;
        agentGo(e.p,sp[0]+(Math.random()-.5)*.5,sp[1]+(Math.random()-.5)*.5,Math.random()*6,()=>{u.act=["phone","stretch","cup","game","chat"][i%5];});}
      else u.act=i%3===1?"chat":(i%2?"stretch":"game");});
  }else if(ph==="leave"||ph==="close"){
    (ph==="close"?extras:cls).forEach((e,i)=>{if(e.state==="gone"||e.state==="exiting"||e.state==="leaving")return;
      if(!e.p.visible){e.state="gone";return;}e.state="leaving";e.p.userData.act=null;e.leaveAt=now+.3+i*.55;});
  }
}
/* 下午：只有安親班的小朋友。四點十分陸續進來，六點開始一個一個被接走 */
function setKidCrowd(ph,instant,now,kids){
  extras.forEach(e=>{if(e.kind!=="kid"){e.p.visible=false;e.state="gone";e.p.userData.path=null;}});
  if(ph==="pre"){kids.forEach(e=>{e.p.visible=false;e.state="gone";e.p.userData.path=null;});return;}
  if(ph==="class"){kids.forEach((e,i)=>{e.p.userData.act=null;
    if(e.p.visible||instant){e.p.visible=true;agentPlace(e.p,...e.home);e.state="seat";}else{e.state="toArrive";e.at=now+.5+i*1.2;}});return;}
  if(ph==="break"){let k=0;kids.forEach((e,i)=>{const u=e.p.userData;if(!e.p.visible)return;
    if(i%2===0){const sp=[[13.6,8.5],[15,9.6],[11,7.2],[10.6,4],[16.5,9.8]][k++%5];e.state="out";u.act=null;agentGo(e.p,sp[0],sp[1],Math.random()*6,()=>{u.act=pick(["cheer","wave","cup"]);});}
    else u.act="cup";});return;}
  if(ph==="leave"||ph==="close"){kids.forEach((e,i)=>{if(e.state==="gone"||e.state==="exiting"||e.state==="leaving")return;
    if(!e.p.visible){e.state="gone";return;}e.state="leaving";e.p.userData.act=null;e.leaveAt=now+(ph==="close"?.3+i*.4:2+i*4);});}
}
function tickCrowd(){
  const now=clockT.elapsedTime;
  extras.forEach(e=>{const p=e.p;
    if(e.state==="toArrive"&&now>e.at){e.state="arriving";p.visible=true;agentPlace(p,DOOR[0],DOOR[1],Math.PI);setPose(p,false);
      if(Math.random()<.5)emote(p,e.kind==="kid"?pick(["老師好！","我要喝水","今天作業好多","我第一名！"]):pick(["老師好","好熱","今天考什麼？","呼～趕上了"]),2);
      agentGo(p,e.home[0],e.home[1],e.home[2],()=>{e.state="seat";});}
    if(e.state==="leaving"&&now>e.leaveAt){e.state="exiting";if(Math.random()<.35)emote(p,["掰掰","回家了～","好餓","明天見"][Math.floor(Math.random()*4)],2);
      agentGo(p,DOOR[0],DOOR[1],0,()=>{p.visible=false;e.state="gone";});}
  });
}
const pick=a=>a[Math.floor(Math.random()*a.length)];
function tickAmbient(dt){
  const now=clockT.elapsedTime;
  extras.forEach(e=>{const u=e.p.userData;if(u.actUntil&&now>u.actUntil){u.act=e.state==="out"?u.act:null;u.actUntil=0;}});
  ambT-=dt;if(ambT<=0){ambT=1.2+Math.random()*1.6;
    const ph=crowdPhase,vis=extras.filter(e=>e.p.visible&&!e.p.userData.path&&!e.p.userData.actUntil);
    if(vis.length){const e=pick(vis),u=e.p.userData;
      if(e.state==="seat"&&e.kind==="jh"&&ph==="class"){const r=Math.random();if(r<.35){u.act="raise";u.actUntil=now+2.5;emote(e.p,pick(["老師這單字怎麼念？","段考會考嗎？","我會！","Teacher！"]),2.4);}else if(r<.55){u.act="phone";u.actUntil=now+2.5;emote(e.p,"📱",2);}else{u.act="chat";u.actUntil=now+2.5;}}
      else if(e.state==="seat"&&e.kind==="class"&&ph==="class"){const r=Math.random();
        if(r<.3){u.act="raise";u.actUntil=now+3;emote(e.p,pick(["？","老師！","這題不懂"]),2.6);}
        else if(r<.5){u.act="sleep";u.actUntil=now+5;emote(e.p,"zzz",3);}
        else if(r<.75){u.act="chat";u.actUntil=now+3;emote(e.p,pick(["（小聲）","欸你寫完沒","借我抄"]),2.2);}
        else{u.act="stretch";u.actUntil=now+1.6;}}
      else if(e.kind==="kid"&&e.state==="seat"){const r=Math.random();if(r<.35){u.act="raise";u.actUntil=now+2.5;emote(e.p,pick(["老師這題怎麼寫？","我寫完了！","橡皮擦借我","他踢我！"]),2.4);}else if(r<.6){u.act="type";u.actUntil=now+3;}else{u.act="stretch";u.actUntil=now+1.4;}}
      else if(e.kind==="kid"&&e.state==="out"){emote(e.p,pick(["哈哈哈","鬼抓人！","我要布丁","你當鬼！","好好吃"]),2.2);}
      else if(e.state==="seat"&&e.kind==="study"){const r=Math.random();if(r<.4){u.act="stretch";u.actUntil=now+1.6;}else if(r<.7){emote(e.p,pick(["…","這題好難","嗯？"]),2);}else{u.act="game";u.actUntil=now+3;}}
      else if(e.state==="out"){emote(e.p,pick(["哈哈哈","好餓","明天考什麼？","♪","累死了","手搖要不要？","我昨天打到牌位了"]),2.4);}
      else if(e.state==="seat"&&ph==="break"){emote(e.p,pick(["欸欸","你看這個","……"]),2);}
      else if(e.state==="seat"&&ph==="pre"){u.act=pick(["game","chat",null]);u.actUntil=now+3;}
    }}
  // 會走動的 NPC：主任踱步、助教巡自習室
  npcAmbT-=dt;if(npcAmbT<=0&&mode==="walk"){npcAmbT=4+Math.random()*4;
    const roam={boss:[[0,0],[2.2,.4],[-.8,.5]],hong:[[0,0],[-3.6,0],[3.6,0],[0,0]]};
    for(const id in roam){const n=npcs[id];if(!n||!n.visible||n.userData.path||!n.userData.anchor)continue;
      if(step()&&step().target&&step().target.npc===id&&Math.hypot(player.position.x-n.position.x,player.position.z-n.position.z)<3)continue;
      const a=n.userData.anchor;if(Math.hypot(n.position.x-a[0],n.position.z-a[1])>5)continue;
      const o=pick(roam[id]);agentGo(n,a[0]+o[0],a[1]+o[1],a[2]);
      if(Math.random()<.4)emote(n,id==="boss"?pick(["總部又來信了…","72%…","嗯……"]):pick(["這題我看看","安靜一點喔","誰還有問題？"]),2.2);}
    const y=npcs.yun;if(y&&y.visible&&Math.random()<.3&&Math.hypot(y.position.x-3.75,y.position.z-10.3)<1)emote(y,pick(["您好，這裡是…","好的我記下來","☎"]),2.2);
    const tc=npcs.teacher;if(tc&&tc.visible&&crowdPhase==="class"&&Math.random()<.35&&Math.hypot(tc.position.x-20,tc.position.z-1.2)<1.2)emote(tc,pick(["這題很重要！","看這邊","畫個圖就懂了"]),2.4);
  }
}
function npcAct(id,n,t){
  const u=n.userData;if(u.moving)return null;const x=n.position.x,z=n.position.z,ph=crowdPhase;
  if(id==="yun"&&Math.hypot(x-3.75,z-10.3)<1)return (t%12)<7?"type":"phone";
  if(id==="teacher"){if(ph==="class"&&Math.hypot(x-20,z-1.2)<1.2)return "board";if(x<9&&z>5&&z<9)return "cup";}
  if(id==="boss"&&x<9&&z<5)return (t%16)<5?"phone":null;
  if(id==="zhe"){if(u.seated&&ph==="class")return "sleep";if(ph==="break"||ph==="pre")return "game";}
  if(id==="bo"&&u.seated)return "game";
  if(CHARS[id]&&CHARS[id].kid&&u.seated)return ph==="class"?"type":null;
  if(id==="deliv")return "wave";
  if(id==="hong"&&!u.moving&&(t%9)<3)return "board";
  return null;
}
function tickFX(dt){
  FX.shake=Math.max(0,FX.shake-dt);FX.dark=Math.max(0,FX.dark-dt);
  const d=FX.dark>0?Math.min(1,FX.dark*2):0,late=crowdPhase==="leave"||crowdPhase==="close"?.18:0,fl=Math.random()<.004?.25:0;const day=G&&G.line.daylight?.2:0;hemi.intensity=.9+day-.75*d-late-fl;sun.intensity=.5+day-.45*d-late*.6;
}
function startEffect(kind){
  if(kind==="shake"){FX.shake=2.6;extras.concat(Object.values(npcs).map(p=>({p}))).forEach(e=>{if(e.p.visible&&Math.random()<.6)emote(e.p,pick(["！","地震！","哇"]),1.8);});}
  if(kind==="dark"){FX.dark=3.2;extras.forEach(e=>{if(e.p.visible&&Math.random()<.5)emote(e.p,pick(["欸？","停電了","好暗"]),2);});}
}
