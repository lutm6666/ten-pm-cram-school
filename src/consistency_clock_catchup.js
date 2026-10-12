/* ================= 一致性：劇情時間跳轉的人群補進度 =================
   劇情一步可從 18:00 直接跳到 18:20，但 agentGo 走路使用真實秒數。
   因此不能只用「visible」判斷到場，必須按遊戲內 G.clock 把人群狀態補到正確時間點。 */

function consCareClockSync(){
  if(!G||G.line.id!=='care')return;
  const ph=phaseOf();if(ph!=='leave'&&ph!=='close')return;
  const kids=extras.filter(e=>e.kind==='kid').slice(0,5);
  const hs=extras.filter(e=>e.kind==='class');

  // 未具名小朋友自 18:00 起陸續被接走。劇情走到 18:20 時不應還有背景小朋友滯留在場景其他角落。
  kids.forEach((e,i)=>{
    const leaveAt=18*60+i*1.35;
    if(G.clock>=leaveAt){
      e.p.visible=false;e.p.userData.path=null;e.p.userData.moving=false;e.p.userData.act=null;e.state='gone';
    }
  });

  // B 班 18:30 上課。18:00 起陸續進場，最晚約 18:15 已坐定。
  // 若劇情時鐘已越過某人的到班時間，就直接補到座位，避免畫面仍停留在二十個劇情分鐘以前。
  hs.forEach((e,i)=>{
    const arriveAt=18*60+i*.92; // 16 位背景生約在 18:14 前到齊
    if(G.clock>=arriveAt){
      if(e.state!=='seat'||!e.p.visible||e.p.userData.path){
        e.p.visible=true;e.p.userData.path=null;e.p.userData.moving=false;e.p.userData.act=null;
        agentPlace(e.p,...e.home);e.state='seat';
      }
    }else if(e.state==='gone'){
      e.p.visible=false;e.p.userData.path=null;e.p.userData.moving=false;e.p.userData.act=null;e.state='clockWait';
    }
  });
}

const CONS_CLOCK_BASE_SET_KID_CROWD=setKidCrowd;
setKidCrowd=function(ph,instant,now,kids){
  CONS_CLOCK_BASE_SET_KID_CROWD(ph,instant,now,kids);
  consCareClockSync();
};

const CONS_CLOCK_BASE_TICK_CROWD=tickCrowd;
tickCrowd=function(){
  CONS_CLOCK_BASE_TICK_CROWD();
  consCareClockSync();
};

const CONS_CLOCK_BASE_AUDIT=window.__consistencyAudit;
window.__consistencyAudit=()=>{
  const b=CONS_CLOCK_BASE_AUDIT?CONS_CLOCK_BASE_AUDIT():{};
  const seatedHigh=extras.filter(e=>e.kind==='class'&&e.p.visible&&e.state==='seat'&&!e.p.userData.path).length;
  const visibleBackgroundKids=extras.filter(e=>e.kind==='kid'&&e.p.visible).length;
  return {...b,seatedHigh,visibleBackgroundKids};
};
