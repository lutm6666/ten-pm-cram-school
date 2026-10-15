/* ================= 補習班的日常：時間表驅動的人群與職員行程 ================= */
const FX={shake:0,dark:0};
let crowdPhase=null,ambT=2,npcAmbT=3;
const DOOR=[4.5,17.2];
const T=s=>{const [h,m]=s.split(":").map(Number);return h*60+m;};
const pick=a=>a[Math.floor(Math.random()*a.length)];
function phaseOf(){if(!G)return"pre";let last=G.steps.length-1;while(last>0&&G.steps[last].ot)last--;if(G.done||G.idx>last||(G.idx===last&&stepReady()))return"close";let ph="pre";for(const [at,p] of (G.line.schedule||SCHEDULE)){if(G.clock>=T(at))ph=p;}return ph;}
const PHASE_STATUS={class:"上課中",break:"下課",leave:"放學",close:"收拾中"};
function statusOf(){const ph=phaseOf();return (G&&G.line.phaseStatus&&G.line.phaseStatus[ph])||PHASE_STATUS[ph]||(G&&G.line.preStatus)||"準備中";}

/* ---------- 背景人群 ----------
   每個人：kind（kid／jh／eng／parent）、房間、座位、到班與離開時刻（依第一天週二、第二天週三不同）。
   到班：從 1F 大門走到座位（會走樓梯或搭電梯）。離開：走回大門後消失。
   劇情時鐘跳過時（快轉、讀檔），直接補到該在的位置。 */
const KID_COLORS=[0xf59f00,0x4dabf7,0x69db7c,0xff8787,0xb197fc,0x63e6be,0xffa94d,0x74c0fc],JH_COLORS=[0x1971c2,0x2f9e44,0x5f3dc4,0xe8590c,0x0c8599,0x495057,0xc2255c,0x364fc7],PARENT_COLORS=[0x8d7b68,0x5c6b7a,0x9c6644,0x6d597a,0x4a6670,0xa0785a];
/* 每班有幾個座位留給有名字的角色（由劇情控制） */
const NAMED_SEATS={g4:{yu:0,anan:4,mi:6},c9:{zhe:11,pinyu:1,xiang:7,qing:2,trial:9},c8:{bo:6}};
function buildCrowd(){
  const add=(kind,room,seat,opts={})=>{const s=seatsOf(room)[seat];if(!s)return;const kid=kind==="kid"||kind==="eng";
    const p=person((kind==="jh"?JH_COLORS:KID_COLORS)[(seat*3+room.length)%8],{hair:[0x2a2421,0x3b2b20,0x151515,0x5a3a22][seat%4],kid});
    if(kind==="jh")p.userData.rig.scale.setScalar(.92);p.visible=false;extras.push({p,kind,room,home:s,state:"away",idx:extras.length,...opts});};
  const fill=(room,kind,n)=>{const taken=new Set(Object.values(NAMED_SEATS[room]||{}));let k=0;seatsOf(room).forEach((_,i)=>{if(k<n&&!taken.has(i)){add(kind,room,i);k++;}});};
  fill("g5","kid",6);fill("g4","kid",5);fill("g6","kid",7);
  fill("c7","jh",7);fill("c8","jh",8);fill("c9","jh",7);
  fill("english","eng",6);
  // 接送家長：在大廳出現一下就帶小孩走
  for(let i=0;i<8;i++){const p=person(PARENT_COLORS[i%6],{hair:[0x2a2421,0x3b2b20,0x8a8a8a][i%3]});p.visible=false;extras.push({p,kind:"parent",room:"lobby",home:[FLX(0,5.5+((i*1.7)%5.5)),12.4+(i%3)*1.1,Math.PI],state:"away",idx:extras.length});}
  // 八年級名單十二人：其餘三席補在最後（不改動前面人群的編號與到班時間）
  {const taken=new Set(Object.values(NAMED_SEATS.c8)),used=new Set(extras.filter(e=>e.room==="c8").map(e=>e.home.join()));seatsOf("c8").forEach((s,i)=>{if(!taken.has(i)&&!used.has(s.join()))add("jh","c8",i);});}
}
/* 當天的時間表（分鐘） */
function crowdTimes(e,day){const i=e.idx,j=(i*37)%11;
  if(e.kind==="kid"){const arr=day===2?T("12:50")+(i%6)*.8:T("15:52")+(i%6)*.8,leave=T("17:00")+((i*23)%15)*6+(i%4===0?60:0);
    // 四年級（玩家的班）：劇情 18:15 起「只剩一個人」，其他小朋友六點前都被接走
    return [arr,e.room==="g4"?Math.min(leave,T("17:58")):leave];}
  if(e.kind==="jh")return [T("17:20")+((i*13)%34),T("21:00")+(i%8)*1.5];
  if(e.kind==="eng")return [T("18:15")+(i%6)*2,T("20:00")+(i%6)*1.2];
  if(e.kind==="parent"){const a=T("17:24")+((i*11)%8)*5.5+(day===2?3:0);return [a,a+3+(i%3)];}
  return [0,0];}
function crowdWanted(e){if(!G)return false;const t=G.clock,day=G.day||1,[a,l]=crowdTimes(e,day);
  if(G.line.crowd&&!G.line.crowd.includes(e.kind))return false;return t>=a&&t<l;}
function crowdPlace(e){const p=e.p,u=p.userData;p.visible=true;agentPlace(p,e.home[0],e.home[1],e.home[2]);e.state="here";u.act=null;}
function crowdHide(e){const p=e.p,u=p.userData;p.visible=false;u.path=null;u.moving=false;e.state="away";}
/* 依目前時刻，把所有背景人物直接放到該在的地方（開局、讀檔、快轉） */
function crowdSettle(){extras.forEach(e=>{if(crowdWanted(e))crowdPlace(e);else crowdHide(e);});}
function tickCrowd(){if(!G)return;
  extras.forEach(e=>{const want=crowdWanted(e),p=e.p,u=p.userData;
    if(want&&e.state==="away"){
      // 晚到太多（快轉之後）直接就位；否則從大門走進來
      const [a]=crowdTimes(e,G.day||1);if(G.clock-a>8){crowdPlace(e);return;}
      if(!entryFree(DOOR))return;nextEntryAt=clockT.elapsedTime+.9;
      p.visible=true;agentPlace(p,DOOR[0],DOOR[1],Math.PI);setPose(p,false);e.state="arriving";
      agentGo(p,e.home[0],e.home[1],e.home[2],()=>{e.state="here";if(Math.random()<.3)emote(p,e.kind==="kid"?pick(["老師好！","我第一名！","今天作業好多"]):e.kind==="parent"?pick(["我來接小孩","不好意思晚了"]):pick(["老師好","好餓","今天考什麼？"]),2);});
      if(u.routeFailed)crowdPlace(e);
    }else if(!want&&(e.state==="here"||e.state==="arriving")){
      e.state="leaving";u.act=null;if(Math.random()<.3)emote(p,pick(["掰掰","明天見","回家了～"]),2);
      agentGo(p,DOOR[0],DOOR[1],0,()=>crowdHide(e));if(u.routeFailed)crowdHide(e);
    }
  });}
/* 舊介面：劇情換段落時呼叫。instant 時直接補位。 */
function setCrowd(ph,instant){crowdPhase=ph;if(typeof syncItems==="function")syncItems();if(instant)crowdSettle();}

/* ---------- 職員的預設行程 ----------
   不是這條線主角的職員，照這張表在補習班裡移動；劇情步驟用 npc 指定時會覆蓋到下一個行程點。
   [時刻, 地點]；地點是 SPOTS 名稱（站在旁邊）或 null（不在班上）。 */
const STAFF_DAY={
 // 15:20 在門口集合出發，15:25 人已經在國小（畫面上不在），15:52 帶小朋友回來
 lin:[["11:30","g5podium"],["15:20","door"],["15:25",null],["15:52","g5podium"],["18:40",null]],
 wu:[["11:30","g6podium"],["15:20","door"],["15:25",null],["15:52","g6podium"],["18:40",null]],
 cai:[["11:30","g4podium"],["15:20","door"],["15:25",null],["15:52","g4podium"],["19:00",null]],
 amy:[["16:30","engpodium"],["20:10",null]],
 hong:[["17:00","tutor"],["21:20",null]],
 boss:[["13:00","bossdesk"],["21:30",null]],
 yun:[["13:30","counterIn"],["21:30",null]]
};
/* 同一個地點有好幾位老師時錯開站，不要疊在一起 */
const STAFF_OFF={door:{lin:[-1.5,-1.3],wu:[1.5,-1.3],cai:[0,-1.6]}};
const STAFF_DAY2={lin:[["11:30","g5podium"],["12:20","door"],["12:25",null],["12:52","g5podium"],["18:40",null]],wu:[["11:30","g6podium"],["12:20","door"],["12:25",null],["12:52","g6podium"],["18:40",null]],cai:[["11:30","g4podium"],["12:20","door"],["12:25",null],["12:52","g4podium"],["19:00",null]]};
function staffSpec(id){const sch=((G&&G.day===2&&STAFF_DAY2[id])||STAFF_DAY[id]);if(!sch)return undefined;let at=null;for(const [t,s] of sch){if(G.clock>=T(t))at=s;}
  if(!at)return null;if(at==="bossdesk")return AT("bossdesk",0,-2.3,0);if(at==="counterIn")return AT("counterIn",0,0,0);const off=STAFF_OFF[at]&&STAFF_OFF[at][id];if(off)return AT(at,off[0],off[1],Math.PI);const s=SPOTS[at];return[s.pos[0]+(at.endsWith("podium")?0:.6),s.pos[1]+(at.endsWith("podium")?0:.4),at.endsWith("podium")?0:Math.PI];}
let staffLast={};
function tickStaff(instant){if(!G)return;for(const id of (G.line.staff||[])){if(G.line.self===id||!STAFF_DAY[id])continue;
  const sp=staffSpec(id),key=JSON.stringify(sp);if(staffLast[id]===key)continue;staffLast[id]=key;setNPC(id,sp,instant);}}

/* ---------- 環境動作 ---------- */
function tickAmbient(dt){
  const now=clockT.elapsedTime;
  extras.forEach(e=>{const u=e.p.userData;if(u.actUntil&&now>u.actUntil){u.act=null;u.actUntil=0;}});
  if(G&&G.line.daylight&&mode==="walk"&&Math.random()<dt/9)chirp();
  const t=G?G.clock:0,nap=G&&G.day===2&&t>=T("13:00")&&t<T("13:30"),jhClass=t>=T("18:00")&&t<T("21:00")&&!(t>=T("19:25")&&t<T("19:35"));
  extras.forEach(e=>{if(e.kind==="kid"&&e.state==="here")e.p.userData.act=nap?"sleep":(e.p.userData.actUntil?e.p.userData.act:null);});
  ambT-=dt;if(ambT<=0){ambT=1.2+Math.random()*1.6;
    const vis=extras.filter(e=>e.p.visible&&e.state==="here"&&!e.p.userData.actUntil&&floorOf(e.p.position.x)===curFloor);
    if(vis.length){const e=pick(vis),u=e.p.userData;
      if(e.kind==="kid"&&!nap){const r=Math.random();if(r<.35){u.act="raise";u.actUntil=now+2.5;emote(e.p,pick(["老師這題怎麼寫？","我寫完了！","橡皮擦借我","他踢我！","可以去上廁所嗎？"]),2.4);}else if(r<.6){u.act="type";u.actUntil=now+3;}else{u.act="stretch";u.actUntil=now+1.4;}}
      else if(e.kind==="jh"&&jhClass){const r=Math.random();if(r<.3){u.act="raise";u.actUntil=now+2.5;emote(e.p,pick(["老師這題考嗎？","我不懂","可以再講一次嗎？"]),2.4);}else if(r<.5){u.act="sleep";u.actUntil=now+4;}else if(r<.7){u.act="chat";u.actUntil=now+2.5;emote(e.p,pick(["（小聲）","欸借我抄","段考完要去哪？"]),2);}else{u.act="stretch";u.actUntil=now+1.6;}}
      else if(e.kind==="jh"){u.act=pick(["game","chat","phone"]);u.actUntil=now+3;if(Math.random()<.4)emote(e.p,pick(["好餓","你寫完沒","我昨天打到鑽石了","段考完要去哪？","手搖要不要？"]),2.2);}
      else if(e.kind==="eng"){u.act="raise";u.actUntil=now+2;emote(e.p,pick(["Apple!","Teacher!","I know!"]),2);}
      else if(e.kind==="parent"){emote(e.p,pick(["我來接小孩","請問四年級在幾樓？","我要繳費","作業寫完了嗎？"]),2.2);}
    }}
  // 會走動的職員：主任在主任室踱步、課輔老師在課輔室
  npcAmbT-=dt;if(npcAmbT<=0&&mode==="walk"){npcAmbT=4+Math.random()*4;
    const roam={boss:[[0,0],[1.6,.3],[-.8,.4]],hong:[[0,0],[-3,0],[3,0]]};
    for(const id in roam){const n=npcs[id];if(!n||!n.visible||n.userData.path||!n.userData.anchor||id===G?.line.self)continue;
      const wanted=step()?.target?.npc===id||(typeof activeSides==='function'&&activeSides().some(sd=>sd.target?.npc===id));
      if(wanted&&Math.hypot(player.position.x-n.position.x,player.position.z-n.position.z)<3)continue;
      const a=n.userData.anchor;if(Math.hypot(n.position.x-a[0],n.position.z-a[1])>5)continue;
      const o=pick(roam[id]);agentGo(n,a[0]+o[0],a[1]+o[1],a[2]);
      if(Math.random()<.4)emote(n,id==="boss"?pick(["總部又來信了…","續班率…","影印機又…"]):pick(["這題我看看","排隊喔","下一位"]),2.2);}
    const y=npcs.yun;if(y&&y.visible&&Math.random()<.3&&near2(y,"counterIn",1))emote(y,pick(["您好，這裡是…","好的我記下來","☎"]),2.2);
  }
}
const near2=(n,spot,r)=>{const s=SPOTS[spot];return s&&Math.hypot(n.position.x-s.pos[0],n.position.z-s.pos[1])<r;};
function npcAct(id,n,t){
  if(n.userData.act==='cover')return 'cover';
  const u=n.userData;if(u.moving)return null;const c=G?G.clock:0,jhClass=c>=T("18:00")&&c<T("21:00")&&!(c>=T("19:25")&&c<T("19:35"));
  if(id==="yun"&&near2(n,"counterIn",1.2))return (t%12)<7?"type":"phone";
  if(id==="teacher"&&jhClass&&near2(n,"c9podium",1.4))return "board";
  if((id==="lin"||id==="wu"||id==="cai")&&(near2(n,"g5podium",1.4)||near2(n,"g4podium",1.4)||near2(n,"g6podium",1.4)))return (t%10)<4?"board":null;
  if(id==="amy"&&near2(n,"engpodium",1.4))return "board";
  if(id==="boss"&&near2(n,"bossdesk",2.6))return (t%16)<5?"phone":null;
  if(id==="zhe"){if(u.seated&&jhClass)return "sleep";if(u.seated)return "game";}
  if(id==="bo"&&u.seated)return "game";
  if(CHARS[id]&&CHARS[id].kid&&u.seated)return G&&G.day===2&&c>=T("13:00")&&c<T("13:30")?"sleep":"type";
  if(id==="deliv")return "wave";
  if(id==="hong"&&!u.moving&&(t%9)<3)return "board";
  return null;
}
function tickFX(dt){
  FX.shake=Math.max(0,FX.shake-dt);FX.dark=Math.max(0,FX.dark-dt);
  const d=FX.dark>0?Math.min(1,FX.dark*2):0;const day=G&&G.line.daylight&&(G.clock<T("17:40"))?-.16:0;hemi.intensity=.9+day-.75*d;sun.intensity=.5+day*.5-.45*d;
}
function startEffect(kind){
  if(kind==="shake"){FX.shake=2.6;extras.concat(Object.values(npcs).map(p=>({p}))).forEach(e=>{if(e.p.visible&&Math.random()<.6)emote(e.p,pick(["！","地震！","哇"]),1.8);});}
  if(kind==="dark"){FX.dark=3.2;extras.forEach(e=>{if(e.p.visible&&Math.random()<.5)emote(e.p,pick(["欸？","停電了","好暗"]),2);});}
}
