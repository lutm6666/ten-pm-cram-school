/* ================= Phase 2：名牌與任務標記整理 =================
   目標：多人同框時減少頭頂 UI 疊在一起。
   玩家 / 主線 / 支線優先；遠處一般 NPC 名牌自動退場。
   只改顯示邏輯，不碰事件、尋路或任務判定。 */

const P2_UI_PROJ=new THREE.Vector3();
let P2_UI_NEXT=0;

function p2UiRememberScale(o){
  if(!o||!o.scale)return null;
  o.userData=o.userData||{};
  if(!o.userData.p2BaseScale)o.userData.p2BaseScale=[o.scale.x,o.scale.y,o.scale.z];
  return o.userData.p2BaseScale;
}
function p2UiScale(o,f){
  const b=p2UiRememberScale(o);if(!b)return;
  o.scale.set(b[0]*f,b[1]*f,b[2]*f);
}
function p2UiProject(actor,label){
  if(!actor||!label||!camera)return null;
  P2_UI_PROJ.set(actor.position.x,actor.position.y+(label.position?.y||1.45),actor.position.z).project(camera);
  if(P2_UI_PROJ.z<-1||P2_UI_PROJ.z>1||Math.abs(P2_UI_PROJ.x)>1.16||Math.abs(P2_UI_PROJ.y)>1.16)return null;
  return {x:(P2_UI_PROJ.x+1)*.5*innerWidth,y:(1-P2_UI_PROJ.y)*.5*innerHeight};
}
function p2UiRectsTouch(a,b,margin){
  return !(a.r+margin<b.l||b.r+margin<a.l||a.b+margin<b.t||b.b+margin<a.t);
}
function p2UiLabelEntry(actor,id,priority,dist){
  const label=actor&&actor.userData&&actor.userData.label;if(!label)return null;
  const p=p2UiProject(actor,label);if(!p)return {actor,label,id,priority,dist,off:true};
  const base=p2UiRememberScale(label)||[1,1,1];
  const w=Math.max(72,Math.min(168,70+base[0]*58)),h=innerWidth<600?32:28;
  return {actor,label,id,priority,dist,p,rect:{l:p.x-w/2,r:p.x+w/2,t:p.y-h/2,b:p.y+h/2}};
}
function p2UiResolvedTarget(t){return typeof t==='function'?t(G):t;}
function p2UiTuneLabels(){
  if(!G||!player||!camera||mode!=="walk")return;
  const mobile=innerWidth<600,maxDist=mobile?5.4:7.2,maxLabels=mobile?4:7;
  const cur=step&&step(),mainTarget=p2UiResolvedTarget(cur&&cur.target),mainId=mainTarget&&mainTarget.npc||null;
  const sideIds=new Set(),chatIds=new Set();
  try{activeSides().forEach(sd=>{const t=p2UiResolvedTarget(sd.target);if(t&&t.npc)sideIds.add(t.npc);});}catch(e){}
  try{chatTargets().forEach(id=>chatIds.add(id));}catch(e){}
  const pZone=zoneAt(player.position.x,player.position.z),pZoneName=pZone&&pZone[0],entries=[];

  const add=(actor,id,isPlayer=false)=>{
    if(!actor||!actor.visible||!actor.userData||!actor.userData.label)return;
    const d=Math.hypot(actor.position.x-player.position.x,actor.position.z-player.position.z);
    const z=zoneAt(actor.position.x,actor.position.z),same=!!(z&&pZoneName&&z[0]===pZoneName);
    let pri=isPlayer?100:id===mainId?96:sideIds.has(id)?86:chatIds.has(id)?72:d<2.2?66:same?48:24;
    const keep=isPlayer||id===mainId||sideIds.has(id)||d<=maxDist||(same&&d<=maxDist+1.8);
    actor.userData.label.visible=keep;
    if(!keep)return;
    const e=p2UiLabelEntry(actor,id,pri,d);if(e)entries.push(e);
  };
  add(player,"__player",true);for(const id in npcs)add(npcs[id],id,false);

  entries.sort((a,b)=>b.priority-a.priority||a.dist-b.dist);
  const kept=[];let count=0;
  for(const e of entries){
    if(e.off){e.label.visible=false;continue;}
    const overlap=kept.some(k=>p2UiRectsTouch(e.rect,k.rect,mobile?7:5));
    const forced=e.id==="__player"||e.id===mainId;
    const show=(forced||!overlap)&&count<maxLabels;
    e.label.visible=show;
    if(show){
      const f=forced?1:(e.dist<2.8?.96:e.dist<5?.86:.76);
      p2UiScale(e.label,f);kept.push(e);count++;
    }
  }
}
function p2UiTuneMarkers(){
  if(!G||!player||mode!=="walk")return;
  const mobile=innerWidth<600,pZone=zoneAt(player.position.x,player.position.z),pName=pZone&&pZone[0];
  const dist=(x,z)=>Math.hypot(x-player.position.x,z-player.position.z);

  // 主線驚嘆號一直保留，但遠距離略縮小；畫面外仍由 edgeArrow 導航。
  if(marker&&marker.visible){
    const d=dist(marker.position.x,marker.position.z);p2UiScale(marker,d<3?1:d<7?.88:.76);
  }

  // 支線問號只在附近或同區域顯示，避免隔牆整排問號浮在畫面上。
  let active=[];try{active=activeSides();}catch(e){}
  active.forEach(sd=>{
    const mk=sideMarks[sd.id],tg=targetOf(sd.target);if(!mk||!tg)return;
    const d=dist(tg.x,tg.z),z=zoneAt(tg.x,tg.z),same=!!(z&&pName&&z[0]===pName);
    const show=d<(mobile?6.2:8.0)||(same&&d<11.5);
    mk.visible=mk.visible&&show;
    if(mk.visible)p2UiScale(mk,d<3?1:d<6?.86:.72);
  });

  // 資訊點是低優先級，只留同區域 / 近距離的，任務與收集物不受影響。
  for(const id in infoMarks){
    const mk=infoMarks[id];if(!mk)continue;
    const d=dist(mk.position.x,mk.position.z),z=zoneAt(mk.position.x,mk.position.z),same=!!(z&&pName&&z[0]===pName);
    mk.visible=d<(mobile?4.8:6.2)||(same&&d<8.5);
    if(mk.visible)p2UiScale(mk,d<3?.9:.76);
  }
}
function p2UiTick(){
  const now=performance.now();if(now<P2_UI_NEXT)return;P2_UI_NEXT=now+110;
  p2UiTuneLabels();p2UiTuneMarkers();
}

/* tickEdge 每幀本來就會被主迴圈呼叫；在它後面做低頻 UI 排版，不另開 RAF。 */
const P2_UI_BASE_TICK_EDGE=tickEdge;
tickEdge=function(){P2_UI_BASE_TICK_EDGE();p2UiTick();};
