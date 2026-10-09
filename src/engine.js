/* ================= 遊戲引擎 ================= */
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const rich=s=>esc(s).replace(/\[\[(.+?)\]\]/g,(m,t)=>`<button class="term" data-term="${t}">${t}</button>`);
const plain=s=>esc(String(s).replace(/\[\[|\]\]/g,""));
const val=(x,a)=>typeof x==="function"?x(a):x;
const clamp=v=>Math.max(0,Math.min(100,v));
const store={get(k,d){try{const v=localStorage.getItem("ten-pm:"+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem("ten-pm:"+k,JSON.stringify(v));}catch(e){}}};

let guiding=false,G=null,mode="title",path=null,keys={},near=null,pickedLine=store.get("line","teacher"),pickedDay=store.get("day",1),clockT=new THREE.Clock();

/* ---------- 音效（第一次點擊後才會出聲） ---------- */
let soundOn=store.get("sound",true),actx=null;
function beep(kind){if(!soundOn)return;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();
  const seq={blip:[[660,.05]],pick:[[880,.08],[1320,.12]],chap:[[392,.18],[523,.28]],ok:[[523,.08],[659,.08],[784,.14]],bad:[[220,.16]],side:[[740,.07],[988,.1]]}[kind]||[[600,.05]];
  let t0=actx.currentTime;seq.forEach(([f,d])=>{const o=actx.createOscillator(),g=actx.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.2,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(bus("sfx"));o.start(t0);o.stop(t0+d+.02);t0+=d*.9;});}catch(e){}}
let seenSides=new Set(store.get("sides",[]));             // 各職業線的支線：SIDES[lineId]=[...]
let seenItems=new Set(store.get("items",[])),seenInfo=new Set(store.get("info",[])),doneLines=new Set(store.get("done",[]));

const toMin=s=>{const [h,m]=s.split(":").map(Number);return h*60+m;},fmt=m=>{m=Math.floor(m);return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");};
const MIN_PER_SEC=1/4;
const lineOf=(id,day)=>day===2&&LINES2[id]?LINES2[id]:LINES[id];
function newGame(lineId,day=1){
  const L=lineOf(lineId,day),name=(store.get("name","")||"").trim();
  const sur=name?(/^[一-鿿]/.test(name)?name[0]:name+" "):"許";
  G={line:L,idx:0,s:{},h:{...L.hidden},f:{},log:[],items:[],sidesDone:{},tName:lineId==="teacher"?sur+"老師":"許老師",pName:name||({yun:"小芸",boss:"何主任",care:"蔡老師"}[lineId]||"你"),name,tipShown:false,status:"",time:"17:20",chapterTitle:""};
  for(const k in L.stats)G.s[k]=L.stats[k][1];
  G.day=day;const outAll=store.get("out",{});G.prevAll=outAll;G.prev=day===2?((outAll[lineId]||{}).f||{}):{};
  G.steps=buildSteps(L);G.minis={};G.chatUsed=[];G.chatWith=[];G.hard=doneLines.has(lineId);G.clock=toMin(G.steps[0].t);G.lates=0;G.lateMin=0;
  Object.defineProperty(G,"time",{get(){return fmt(G.clock);},set(v){},configurable:true});
  if(player)scene.remove(player);makePlayer(L);player.position.set(L.start[0],0,L.start[1]);player.rotation.y=Math.PI;
  Object.keys(CHARS).forEach(id=>{if(CHARS[id].body!==undefined)setNPC(id,null);});
  for(const id in L.npcs)if(CHARS[id]&&CHARS[id].body!==undefined)setNPC(id,val(L.npcs[id],G),true);
  Object.values(itemMarks).forEach(m=>scene.remove(m));for(const k in itemMarks)delete itemMarks[k];
  syncItems();
  for(const id in sideMarks){scene.remove(sideMarks[id]);delete sideMarks[id];}
  setBoard(L.board);setDaylight(!!L.daylight);placeJuniorHigh(L);
  crowdPhase=null;setCrowd(phaseOf(),true);FX.shake=FX.dark=0;
  path=null;enterStep();
}
const step=()=>G.steps[G.idx];
function enterStep(){
  const st=step();if(!st)return finish();
  if(st.npc)for(const id in st.npc)setNPC(id,val(st.npc[id],G));
  G.clock=Math.max(G.clock,toMin(st.t));G.due=null;
  if(!st.auto){let nx=G.idx+1;while(G.steps[nx]&&G.steps[nx].auto)nx++;const nt=G.steps[nx]?toMin(G.steps[nx].t):endMin();G.due=Math.max(nt,G.clock+8);}
  if(st.chapter){G.chapterTitle=st.chapter.title;}G.status=statusOf();
  setCrowd(phaseOf());saveGame();
  if(st.chapter)showChapter(st.chapter);
  else if(st.auto){mode="walk";renderAll();openStep();}
  else{mode="walk";renderAll();}
}
function nextStep(){if(G.idx===0)store.set("tipWalk",true);const st=step();if(st&&st.after)for(const id in st.after)setNPC(id,val(st.after[id],G));G.idx++;path=null;enterStep();}

/* ---------- 目標與附近的東西 ---------- */
function guideTarget(t){const m=targetOf(t);if(t&&t.npc){const u=npcs[t.npc].userData;if(u.moving&&u.anchor)return{...m,x:u.anchor[0],z:u.anchor[1]};}return m;}
function targetOf(t){if(!t)return null;if(t.npc){const n=npcs[t.npc];return{x:n.position.x,z:n.position.z,h:n.userData.top+.85,name:CHARS[t.npc].name,kind:"npc",id:t.npc};}
  const s=SPOTS[t.spot];return{x:s.pos[0],z:s.pos[1],h:s.h+.5,name:s.name,kind:"spot"};}
function activeSides(){const list=SIDES[G.line.id]||[],ids=G.steps.map(s=>s.id);
  return list.filter(sd=>!G.sidesDone[sd.id]&&G.idx>=ids.indexOf(sd.from)&&G.idx<=ids.indexOf(sd.until)&&(!sd.avail||sd.avail(G)));}
function nearest(){
  const px=player.position.x,pz=player.position.z,d=(x,z)=>Math.hypot(x-px,z-pz),c=[];
  const m=targetOf(step().target);if(m){const dm=d(m.x,m.z);if(dm<1.9)c.push({dist:dm,type:"main",label:step().action||(m.kind==="npc"?`找${CHARS[m.id].name}`:`到${m.name}`)});}
  for(const sd of activeSides()){const t=targetOf(sd.target);if(t){const ds=d(t.x,t.z);if(ds<1.9)c.push({dist:ds,type:"side",sd,label:sd.action||`找${t.name}`});}}
  for(const it of ITEMS){if(itemMarks[it.id]&&!G.items.includes(it.id)){const di=d(it.pos[0],it.pos[1]);if(di<1.3)c.push({dist:di-.3,type:"item",it,label:"撿起來"});}}
  for(const id of chatTargets()){const n=npcs[id],dc=d(n.position.x,n.position.z);if(dc<1.5)c.push({dist:dc+.8,type:"chat",id,label:`聊聊・${CHARS[id].name}`});}
  if(c.length){c.sort((a,b)=>a.dist-b.dist);return c[0];}
  for(const inf of INFO){if(d(inf.pos[0],inf.pos[1])<1.6)return{type:"info",inf,label:"看說明"};}
  return null;
}
function interact(){if(mode!=="walk"||!near)return;
  if(near.type==="main")openStep();else if(near.type==="side")openSide(near.sd);else if(near.type==="item")pickItem(near.it);else if(near.type==="info")openInfo(near.inf);else if(near.type==="chat")openChat(near.id);}

/* ---------- HUD ---------- */
function renderAll(){renderHud();renderNext();renderDock();}
function renderHud(){
  if(!G){$("hud").innerHTML=`<div class="bar-row"><div class="clockbox"><div class="clock">17:20</div><div class="clocksub">高三數學 B 班</div></div><span class="spacer"></span><button class="hbtn" data-act="settings" aria-label="設定">設定</button><button class="hbtn" data-act="codex">圖鑑</button></div>`;return;}
  const L=G.line,low=k=>G.s[k]<25?"low":"";
  const st=statusOf(),cls=/上課/.test(st)?"ok":/下課|收拾/.test(st)?"":"bad";
  $("hud").innerHTML=`<div class="bar-row"><div class="clockbox"><div class="clock" id="clk">${mode==="end"?fmt(Math.max(G.clock,endMin())):G.time}</div><div class="clocksub" id="clksub">${dueText()}</div></div>
   <span class="spacer"></span><span class="pill ${cls}"><i></i>${esc(st)}</span><button class="hbtn" data-act="settings" aria-label="設定">設定</button><button class="hbtn" data-act="home">主頁</button><button class="hbtn" data-act="codex">圖鑑</button></div>
   <div class="meters">${Object.keys(L.stats).map(k=>`<div class="meter ${low(k)}"><div class="lab"><span>${L.stats[k][0]}</span><b>${G.s[k]}</b></div><div class="track"><div class="fill" style="width:${G.s[k]}%"></div></div></div>`).join("")}</div>`;
  $("next").style.top=document.querySelector(".hud").offsetHeight+8+"px";
}
function endMin(){return toMin((G&&G.line.endAt)||"22:00");}
function otMin(){return G?Math.max(0,Math.floor(G.clock-endMin())):0;}
function dueText(){if(!G)return"";if(otMin()&&mode!=="end"){const r=mode==="walk"&&G.due!=null?Math.floor(G.due-G.clock):null;return `<span class="ot">已加班 ${otMin()} 分</span>`+(r==null?"":r>=0?`<span class="due ${r<=3?"warn":""}">剩 ${r} 分</span>`:`<span class="due late">晚 ${-r} 分</span>`);}return dueText0();}
function dueText0(){if(mode==="walk"&&G.due!=null){const r=Math.floor(G.due-G.clock);return r>=0?`<span class="due ${r<=3?"warn":""}">${fmt(G.due)} 前・剩 ${r} 分</span>`:`<span class="due late">已經晚了 ${-r} 分</span>`;}return `${esc(G.chapterTitle||"")}・${esc(G.line.role)}`;}
let lastClockMin=-1;
function tickClock(dt){if(!G||mode!=="walk")return;G.clock+=dt*MIN_PER_SEC*SET.speed;const m=Math.floor(G.clock);if(m!==lastClockMin){lastClockMin=m;checkMsgs();checkBell();const c=$("clk");if(c){c.textContent=G.time;$("clksub").innerHTML=dueText();}}}
function checkBell(){if(!G)return;const ph=phaseOf();if(ph===crowdPhase)return;const prev=crowdPhase;setCrowd(ph);G.status=statusOf();renderHud();
  const B=G.line.bells||{class:["上課鐘響了","學生陸續回到座位。"],break:["下課了","下課 15 分鐘，20:05 上第二節。"],leave:["下課了","今天的課上完了，學生陸續離開。"]};
  if(ph==="class"){chime();showBanner(...B.class);}else if(ph==="break"){chime();showBanner(...B.break);}else if(ph==="leave"&&prev!=="close"){chime();showBanner(...B.leave);}}
function spend(min){if(G){G.clock+=min;checkBell();}}
function renderNext(){
  const el=$("next");if(mode!=="walk"){el.hidden=true;return;}el.hidden=false;
  const hint=G.idx===0&&!store.get("tipWalk",false)?`<div class="in"><p class="nexthint">按「帶我去」會自己走過去。想自己走：用左下的方向鍵，或點地板。頭上有紅色「！」的就是要找的對象。</p></div>`:"";
  el.innerHTML=`<div class="in"><div class="nextcard"><span class="tag">${G.due!=null?fmt(G.due)+" 前":"下一步"}</span><span class="g">${esc(val(step().goal,G))}</span><button data-act="guide">帶我去</button></div></div>${hint}`;
  $("next").style.top=document.querySelector(".hud").offsetHeight+8+"px";
}
function renderDock(){
  const d=$("dock");if(mode!=="walk"){d.hidden=true;return;}d.hidden=false;
  const touch=matchMedia("(pointer:coarse)").matches;
  $("dpad").hidden=!touch;$("keys").hidden=touch;
  const a=$("actBtn");a.hidden=!near;if(near){a.textContent=near.label;a.className="act"+(near.type==="info"?" info":near.type==="chat"?" chat":"");}
}

/* ---------- 章節卡 ---------- */
function showChapter(ch){
  if(/上課|下課/.test(ch.status||""))chime();else beep("chap");mode="chapter";renderAll();const c=$("cover");c.className="cover dark";c.hidden=false;
  c.innerHTML=`<div class="chap fade"><div class="t">${esc(ch.t)}</div><h2>${esc(ch.title)}</h2><p>${esc(ch.sub||"")}</p>${ch.rush?`<div class="rush">${ch.rush.map(r=>`<div>${rich(r)}</div>`).join("")}</div>`:""}<button data-act="chapterGo">繼續</button></div>`;
  c.querySelector("[data-act=chapterGo]").focus();
}
function closeChapter(){$("cover").hidden=true;$("cover").className="cover";mode="walk";renderAll();if(step().auto)openStep();}

/* ---------- 對話 ---------- */
let D=null; // {pages,i,choices,onChoice,endLabel,onEnd,deltas}
function speaker(who){
  if(!who)return{name:"現場狀況",title:"",abbr:"!",color:null};
  if(who==="me")return G.line.me(G);
  const c=CHARS[who];return{name:c.name,title:c.title,abbr:c.abbr,color:c.color};
}
function runDialog(o){D={i:0,...o};mode="dialog";path=null;guiding=false;renderAll();drawDialog();}
function drawDialog(){
  const p=D.pages[D.i],sp=speaker(p[0]),last=D.i===D.pages.length-1,n=D.pages.length;
  let foot="";
  if(last&&D.choices&&D.choices.length){foot=`<div class="choices">${D.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${plain(c.label)}${c.note?`<small>${esc(c.note)}</small>`:""}</button>`).join("")}</div>`;}
  const showTip=!G.tipShown&&/\[\[/.test(p[1]);if(showTip)G.tipShown=true;
  $("dlg").hidden=false;
  $("dlg").innerHTML=`<div class="box fade" role="dialog" aria-label="對話"><div class="spk"><span class="face ${sp.color?"":"sys"}" style="${sp.color?`background:${sp.color}`:""}">${esc(sp.abbr)}</span><div><b>${esc(sp.name)}</b>${sp.title?`<small>${esc(sp.title)}</small>`:""}</div></div>
   <p class="say ${p[0]?"":"narr"}">${rich(p[1])}</p>${showTip?`<div class="tip">有虛線的詞可以點，會跳出白話解釋。</div>`:""}
   ${last&&D.deltas?`<div class="deltas">${D.deltas}</div>`:""}${foot}
   <div class="foot"><span class="pg">${D.i+1} / ${n}</span>${!last&&n>2&&!D.noskip?`<button class="skip" data-act="dskip">跳過</button>`:""}${last&&!(D.choices&&D.choices.length)&&canChat(D.chatId)?`<button class="ghost" data-act="dchat">多聊幾句</button>`:""}${last&&D.choices&&D.choices.length?"":`<button class="go" data-act="dnext">${last?esc(D.endLabel||"好"):"繼續"}</button>`}</div></div>`;
  const f=$("dlg").querySelector(".choice,.go");if(f)f.focus({preventScroll:true});
}
function dNext(){beep("blip");if(D.i<D.pages.length-1){D.i++;drawDialog();}else{const cb=D.onEnd;D=null;$("dlg").hidden=true;cb&&cb();}}
function canChat(id){return !!(id&&G&&CHATS[id]&&id!==G.line.id&&npcs[id]&&npcs[id].visible);}
function dChat(){const id=D.chatId,cb=D.onEnd;D=null;$("dlg").hidden=true;openChat(id,cb);}
function dSkip(){D.i=D.pages.length-1;drawDialog();}
function dChoose(i){const c=D.choices[i],cb=D.onChoice;D=null;$("dlg").hidden=true;cb(c);}

function applyFx(fx){const out=[];for(const k in fx){if(!fx[k])continue;
  if(k in G.s){const b=G.s[k];G.s[k]=clamp(b+fx[k]);const dv=G.s[k]-b;if(dv)out.push(`<span class="d ${dv>0?"up":"down"}">${G.line.stats[k][0]} ${dv>0?"+":""}${dv}</span>`);}
  else G.h[k]=clamp((G.h[k]??50)+fx[k]);}
  return out.join("");}
function resolveChoice(c,onDone,arg){
  const a=arg!==undefined?arg:G;
  const fx=val(c.fx,a)||{},res=val(c.res,a),log=val(c.log,a);
  if(c.min)spend(c.min);if(c.set)Object.assign(G.f,c.set);if(log)G.log.push([G.time,log]);
  const deltas=applyFx(fx);renderHud();
  const pages=typeof res==="string"?[[null,res]]:res||[[null,"……"]];
  if(G.s.voice!==undefined&&G.s.voice>0&&G.s.voice<20&&!G.f.hoarse){G.f.hoarse=1;pages.push([null,"你的聲音開始沙啞了。"]);}
  const dead=G.line.dead?G.line.dead(G):(G.s.voice!==undefined&&G.s.voice<=0)||(G.s.hp!==undefined&&G.s.hp<=0);
  const chatId=dead?null:G.chatNpc;G.chatNpc=null;
  runDialog({pages,chatId,deltas:deltas||`<span class="d">沒有變化</span>`,endLabel:dead?"……":"好",noskip:true,onEnd:()=>dead?finish():onDone()});
}
function openStep(){
  const st=step();if(st.effect)startEffect(st.effect);const carry=G.idx===0&&G.line.carry&&G.day!==2?G.line.carry(G):[];if(st.id==="ev_rain")startRain(12);if(/phone|calls|ymom|bmom|ycalls|ot_group/.test(st.id))ring(2);let pages=val(st.pages,G);const choices=st.choices?val(st.choices,G):null;
  if(carry.length)pages=[...carry,...pages];
  if(G.due!=null&&G.clock>G.due+.5&&!st.auto){const late=Math.floor(G.clock-G.due),k=Math.min(3,Math.ceil(late/5));G.lates++;G.lateMin+=late;const lf=G.line.late||{};const fx={};for(const a in lf.fx||{})fx[a]=lf.fx[a]*k;const d=applyFx(fx);G.log.push([G.time,`遲到 ${late} 分鐘`]);pages=[[null,`你晚了 ${late} 分鐘。${lf.text||""}`],...pages];if(d)G.lateDeltas=d;renderHud();}
  spend(2);G.chatNpc=st.target&&st.target.npc;
  runDialog({pages,choices,chatId:choices?null:G.chatNpc,endLabel:st.endLabel,onEnd:choices?null:()=>{if(st.fx)applyFx(val(st.fx,G));if(st.set)Object.assign(G.f,st.set);nextStep();},
    onChoice:c=>{if(c.mini)runMini(c.mini,r=>resolveChoice(c,nextStep,r));else resolveChoice(c,nextStep);}});
}
function openSide(sd){
  spend(3);G.chatNpc=sd.target&&sd.target.npc;
  const pages=val(sd.pages,G),choices=sd.choices?val(sd.choices,G):null;
  const done=()=>{G.sidesDone[sd.id]=1;setTimeout(checkAch,50);seenSides.add(G.line.id+":"+sd.id);store.set("sides",[...seenSides]);beep("side");mode="walk";renderAll();};
  runDialog({pages,choices,chatId:choices?null:G.chatNpc,onEnd:choices?null:()=>{if(sd.fx)applyFx(val(sd.fx,G));if(sd.set)Object.assign(G.f,sd.set);if(sd.log)G.log.push([G.time,"（支線）"+sd.log]);done();},
    onChoice:c=>{const go=r=>resolveChoice({...c,log:c.log?(a=>"（支線）"+val(c.log,a)):null},done,r);if(c.mini)runMini(c.mini,go);else go();}});
}

/* ---------- 面板：說明、小遊戲、撿到的東西、圖鑑 ---------- */
function openSheet(head,html,onClose){
  $("sheetBg").hidden=false;const s=$("sheet");s.hidden=false;s.scrollTop=0;
  s.innerHTML=`<div class="in"><div class="shead"><span>${esc(head)}</span>${onClose===false?"":`<button class="close" data-act="closeSheet">關閉</button>`}</div><div id="sheetBody">${html}</div></div>`;
  S_onClose=onClose||null;const b=s.querySelector(".close,button");if(b)b.focus({preventScroll:true});
}
let S_onClose=null;
function closeSheet(){$("sheet").hidden=true;$("sheetBg").hidden=true;const f=S_onClose;S_onClose=null;if(f)f();}
function tableHTML(rows){return `<table class="tbl"><thead><tr><th>項目</th><th>現況</th><th>燈號</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${rich(r[0])}</td><td>${rich(r[1])}<small>${rich(r[2])}</small></td><td class="lamp ${r[3]}"><i></i>${{r:"紅燈",y:"黃燈",g:"綠燈"}[r[3]]}</td></tr>`).join("")}</tbody></table>`;}
function openInfo(inf){
  mode="info";renderAll();seenInfo.add(inf.id);store.set("info",[...seenInfo]);
  openSheet("說明",`<div class="zone">${esc(inf.zone)}</div><h3>${esc(inf.title)}</h3>${inf.body.map(p=>`<p>${rich(p)}</p>`).join("")}${inf.table?tableHTML(inf.table(G)):""}`,()=>{mode="walk";renderAll();});
}
function runMini(id,cb){
  const M=MINIS[id];mode="mini";renderAll();
  openSheet(M.head,`<div class="zone">${esc(M.zone)}</div><h3>${esc(M.title)}</h3><p>${rich(M.intro)}</p><div id="miniArea"></div><div class="actions" id="miniDone" hidden><button class="go" data-act="miniOk">好</button></div>`,false);
  let result=null;M.mount($("miniArea"),r=>{result=r;beep("ok");$("miniDone").hidden=false;$("miniDone").querySelector("button").focus();});
  $("sheet").querySelector("[data-act=miniOk]").onclick=()=>{$("sheet").hidden=true;$("sheetBg").hidden=true;spend(M.cost||5);G.minis[id]=result;checkAch();cb(result);};
}
function pickItem(it){
  beep("pick");mode="info";renderAll();const first=!seenItems.has(it.id);G.items.push(it.id);seenItems.add(it.id);store.set("items",[...seenItems]);
  if(itemMarks[it.id]){scene.remove(itemMarks[it.id]);delete itemMarks[it.id];}
  const deltas=it.fx?applyFx(it.fx):"";if(it.set)Object.assign(G.f,it.set);G.log.push([G.time,`撿到「${it.name}」`]);renderHud();
  openSheet("撿到的東西",`<div class="itemcard" style="display:flex;gap:12px;align-items:center;border:1px solid var(--rule);border-radius:6px;padding:10px">
    <div style="width:52px;height:52px;border-radius:6px;background:var(--tray);display:grid;place-items:center;font-size:1.6rem;flex:none">${it.icon}</div>
    <div><div class="zone">${esc(it.rarity)}${first?"・第一次撿到":""}</div><h3 style="margin:0">${esc(it.name)}</h3><small style="color:var(--muted)">${esc(it.where)}</small></div></div>
    <p style="margin-top:10px">${rich(it.desc)}</p><p style="border-left:3px solid var(--amber);padding-left:10px"><b>用處</b>　${rich(it.use)}</p>${deltas?`<div class="deltas">${deltas}</div>`:""}
    <p class="hint">收在圖鑑的「撿到的東西」裡。</p><div class="actions"><button class="go" data-act="closeSheet">收下</button></div>`,()=>{mode="walk";renderAll();});
}
let codexTab="people";
function openCodex(){
  const prev=mode;if(mode==="walk")mode="info";renderAll();
  const tabs=[["ach","成就"],["people","人物"],["items","撿到的東西"],["sides","支線"],["info","地點"],["terms","名詞"]];
  const body=()=>{
    if(codexTab==="people")return `<dl class="list">${Object.entries(CHARS).map(([id,c])=>`<dt><span style="color:${c.color}">■</span> ${esc(c.name)}</dt><dd>${esc(c.title)}</dd>`).join("")}</dl>`;
    if(codexTab==="ach")return `<p class="hint">解鎖 ${ACH.filter(a=>achSet.has(a.id)).length} / ${ACH.length} 個成就。</p><dl class="list">${ACH.map(a=>achSet.has(a.id)?`<dt>★ ${esc(a.name)}</dt><dd>${esc(a.desc)}</dd>`:`<dt style="color:var(--muted)">☆ ？？？</dt><dd>${esc(a.desc)}</dd>`).join("")}</dl>`;
    if(codexTab==="sides"){const all=Object.entries(SIDES).flatMap(([l,arr])=>arr.map(s=>[l,s]));return `<p class="hint">完成過 ${all.filter(([l,s])=>seenSides.has(l+":"+s.id)).length} / ${all.length} 條支線。頭上有黃色「？」的人，可能有事找你。</p><dl class="list">${all.map(([l,s])=>`<dt>${seenSides.has(l+":"+s.id)?"✓ "+esc(s.title):"？？？"}</dt><dd>${esc(LINES[l]?LINES[l].role:"")}</dd>`).join("")}</dl>`;}
    if(codexTab==="terms")return `<dl class="list">${Object.entries(TERMS).map(([t,d])=>`<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join("")}</dl>`;
    if(codexTab==="info")return `<p class="hint">看過 ${INFO.filter(i=>seenInfo.has(i.id)).length} / ${INFO.length} 個地點說明。</p><dl class="list">${INFO.map(i=>seenInfo.has(i.id)?`<dt>${esc(i.title)}</dt><dd>${esc(i.zone)}</dd>`:`<dt>？？？</dt><dd>${esc(i.zone)}</dd>`).join("")}</dl>`;
    return ITEMS.length?`<p class="hint">撿過 ${ITEMS.filter(i=>seenItems.has(i.id)).length} / ${ITEMS.length} 樣。東西會依時段出現和消失，有些只有特定職業撿得到。</p><dl class="list">${ITEMS.map(i=>seenItems.has(i.id)?`<dt>${i.icon} ${esc(i.name)}</dt><dd>${esc(i.rarity)}・${esc(i.desc)}</dd>`:`<dt>？？？</dt><dd>${esc(i.rarity)}・${esc(i.hint||"還沒撿到")}${i.phases?"・"+i.phases.map(p=>PHASE_NAME[p]).join("／"):""}${i.lines?"・"+i.lines.map(l=>LINES[l]?LINES[l].short:l).join("／"):""}</dd>`).join("")}</dl>`:`<p class="hint">還沒有東西。</p>`;
  };
  const draw=()=>{openSheet("圖鑑",`<div class="tabs">${tabs.map(([k,t])=>`<button data-tab="${k}" aria-pressed="${k===codexTab}">${t}</button>`).join("")}</div>${body()}`,()=>{if(prev==="walk"){mode="walk";renderAll();}});};
  window.__codexDraw=draw;draw();
}

/* ---------- 開場與結算 ---------- */
function showTitle(){
  mode="title";G=null;renderAll();$("dlg").hidden=true;$("sheet").hidden=true;$("sheetBg").hidden=true;
  const c=$("cover");c.className="cover";c.hidden=false;const lines=Object.values(LINES);
  if(!LINES[pickedLine])pickedLine="teacher";
  const L=LINES[pickedLine];
  c.innerHTML=`<div class="card fade"><div class="ticker"><span class="r">●</span><span>17:20</span><span>高三B 試聽 2 位</span><span>ON-DUTY ▸ 你</span></div>
   <h1>晚上<em>十點</em>下課</h1><p class="lede">補習班打工人的一個晚上</p>
   <div class="lbl">你的名字</div><input id="nameIn" maxlength="8" placeholder="許（可以不填）" value="${esc(store.get("name",""))}" style="width:100%;font:inherit;padding:10px 12px;border:1px solid var(--rule);border-radius:4px;background:var(--tray);color:var(--ink)">
   <div class="lbl">今天你是</div><div class="roles">${["teacher","yun","boss","care","jh"].map(id=>{const l=LINES[id];return l?`<button class="role" data-role="${id}" aria-pressed="${id===pickedLine}"><b>${esc(l.role)}${doneLines.has(id)?" ✓":""}</b><small style="display:block;font-family:var(--mono);color:var(--muted)">${l.shift||"晚上 17:20–22:00"}</small><small>${esc(l.pick)}</small></button>`:`<button class="role" disabled><b>${{yun:"櫃台班導",boss:"補習班主任"}[id]}</b><small>製作中</small></button>`;}).join("")}</div>
   <div class="lbl">哪一天</div><div class="seg" role="radiogroup" aria-label="哪一天" style="grid-template-columns:1fr 1fr">${[1,2].map(d=>{const ok=d===1||(doneLines.has(pickedLine)&&!!LINES2[pickedLine]);return `<button role="radio" data-day="${d}" aria-checked="${(pickedDay===d||(d===1&&!(doneLines.has(pickedLine)&&LINES2[pickedLine])))&&ok}" ${ok?"":"disabled"}>${d===1?"第一天・週二":"第二天・週三"}${d===2&&doneLines.has(pickedLine+"@2")?" ✓":""}${ok?"":`<small style="display:block;font-size:.75rem;opacity:.8">${LINES2[pickedLine]?"先玩完第一天":"之後推出"}</small>`}</button>`;}).join("")}</div>
   ${pickedDay===2&&doneLines.has(pickedLine)&&LINES2[pickedLine]?`<p class="hint" style="margin-top:6px">${esc(LINES2[pickedLine].pick)}</p>`:""}
   <div class="lbl">今天會遇到的人</div><div class="cast">${(L.cast||["yun","boss","pinyu","zhe","parent","mom"]).map(id=>{const ch=CHARS[id];return `<div><i style="background:${ch.color}"></i><b>${esc(ch.name)}</b><span>${esc(ch.title)}</span></div>`;}).join("")}</div>
   ${(()=>{const sv=store.get("save",null);return sv&&LINES[sv.line]?`<button class="ghost" data-act="resume" style="width:100%;margin-top:16px;padding:12px;border-color:var(--ink)">繼續上次：${sv.day===2?"第二天・":""}${esc(LINES[sv.line].role)}・${fmt(sv.clock)}</button>`:"";})()}
   <button class="big-go" data-act="start">上班</button>
   ${["teacher","yun","boss"].every(i=>doneLines.has(i))?`<button class="ghost" data-act="epilogue" style="width:100%;margin-top:8px;padding:12px">一個月後 ▸</button>`:`<p class="hint">三個位子都玩過，會解鎖「一個月後」。目前完成 ${["teacher","yun","boss"].filter(i=>doneLines.has(i)).length} / 3。</p>`}
   <p class="hint">系統會告訴你下一步。跟著頭上有紅色「！」的人或地方走，或按「帶我去」。頭上有「i」的地方可以看說明，地上一閃一閃發光的地方有東西可以撿。</p>
   <div class="links"><button data-act="codex">圖鑑</button><button data-act="settings">設定</button><button data-act="about">關於</button></div>
   <p class="hint">人物、補習班、數字與情節都是虛構的遊戲設定。</p></div>`;
  $("nameIn").addEventListener("input",e=>store.set("name",e.target.value));
}
function remember(r){
  const f=G.f,add=k=>knowSet.add(k);
  if(f.zheOpen||f.zheTalk||f.baseClass)add("zheBasics");if(f.knowBo)add("boSeven");if(G.day!==2&&G.line.id==="boss"&&G.idx>=G.steps.findIndex(s=>s.id==="byun"))add("yunTired");if(G.items.includes("notebook"))add("momNotes");
  store.set("know",[...knowSet]);
  const key=G.day===2?"out2":"out",out=store.get(key,{});out[G.line.id]={f:{...f},title:r.title,s:{...G.s},h:{...G.h},enrolled:f.enrolled??0};store.set(key,out);
}
function epilogue(){
  unlockAch("epi");
  const o=store.get("out",{}),T=o.teacher||{f:{}},Y=o.yun||{f:{}},B=o.boss||{f:{}},any=k=>T.f[k]||Y.f[k]||B.f[k];
  const P=[];
  P.push(["阿哲",any("zheOpen")||any("baseClass")||any("zheTalk")?"阿哲每週二提早半小時來，寒假去上了高一的基礎班。上次模考，數學從 3 級分到 6 級分。他說：「至少現在聽得懂一半了。」":T.f.shamedZhe||Y.f.refundForm?"阿哲沒有再來了。林媽媽辦了退費。有一次在捷運站遇到他，他戴著耳機，沒有看到你。":"阿哲還坐在最後一排。有時候睡覺，有時候畫畫。沒有人知道他聽懂了多少。"]);
  P.push(["品妤",T.f.stayedPinyu||T.f.used14?"下一次模考，向量那一大題她全對。12 級分，回來了。她在講台上留了一張紙條：「謝謝老師那天留下來。」":"她還是每天念到兩點。模考 10 級分，比上次好一點，黑眼圈比上次深一點。"]);
  P.push(["小芸",B.f.yunStay?"小芸留下來了。櫃台多了一個便利貼架，上面寫：「待辦，不是待命。」":B.f.yunLeave?"小芸在月底離職了。新來的工讀生第一天就被影印機卡紙卡到哭。大家才發現，以前那些事是誰在做。":B.f.hongPhones?"電話分了一半給阿宏。阿宏接電話的開場白是：「您好，這裡是……呃，補習班。」小芸笑了一個月。":"小芸還在櫃台。便利貼越貼越多，她說再撐一期就好。"]);
  const enr=Math.max(T.enrolled||0,Y.enrolled||0,B.enrolled||0);
  P.push(["王媽媽",enr?"王媽媽的兒子坐在第二排。上週，他第一次舉手問問題。":"王媽媽最後報了對面。聽說對面也打八折。"]);
  P.push(["榜單牆",B.f.rankWords?"榜單牆換成了學生寫的小卡。最多人寫的一句是：「這裡有人記得我的名字。」":"榜單牆還是那張褪色的紅紙。主任說，今年一定要換。"]);
  P.push(["週報",B.f.lied?"總部打電話來問：為什麼上週 85%，這週 74%？主任在電話那頭沉默了很久。":B.f.explained?"總部的回信只有一行：「下季目標維持 85%，請加油。」但附件裡，多了一台新影印機的採購單。":"續班率最後停在 78%。沒有達標，也沒有很難看。"]);
  const c=$("cover");c.className="cover";c.hidden=false;
  c.innerHTML=`<div class="card report fade"><div class="kick">十一月・同一間補習班</div><h2>一個月後</h2>
   <dl class="list">${P.map(([a,b])=>`<dt>${esc(a)}</dt><dd style="color:var(--ink)">${esc(b)}</dd>`).join("")}</dl>
   <p class="hint" style="font-size:.95rem;margin-top:16px">數字會回來，也可能不會。但這一個月裡，有一些人被記得了名字。</p>
   <p class="hint">換個選擇再玩一次，一個月後的樣子也會跟著改變。</p>
   <div class="actions"><button class="primary" data-act="title">回主頁</button></div></div>`;
}
/* ---------- 存檔 ---------- */
function saveGame(){if(!G)return;store.set("save",{line:G.line.id,day:G.day||1,steps:G.steps.map(s=>({id:s.id,t:s.t})),idx:G.idx,s:G.s,h:G.h,f:G.f,log:G.log,items:G.items,sidesDone:G.sidesDone,clock:G.clock,status:G.status,chapterTitle:G.chapterTitle,lates:G.lates,lateMin:G.lateMin,minis:G.minis,chatUsed:G.chatUsed||[],chatWith:G.chatWith||[],hard:G.hard,pName:G.pName,tName:G.tName,name:G.name,pos:[player.position.x,player.position.z],when:Date.now()});}
function clearSave(){store.set("save",null);}
function resumeGame(){
  const sv=store.get("save",null);if(!sv||!LINES[sv.line])return showTitle();
  const L=lineOf(sv.line,sv.day||1);$("cover").hidden=true;startAmbient();
  G={line:L,idx:sv.idx,s:sv.s,h:sv.h,f:sv.f,log:sv.log,items:sv.items,sidesDone:sv.sidesDone,clock:sv.clock,status:sv.status,chapterTitle:sv.chapterTitle,lates:sv.lates||0,lateMin:sv.lateMin||0,minis:sv.minis||{},day:sv.day||1,chatUsed:sv.chatUsed||[],chatWith:sv.chatWith||[],hard:sv.hard,pName:sv.pName,tName:sv.tName,name:sv.name,tipShown:true};
  {const outAll=store.get("out",{});G.prevAll=outAll;G.prev=G.day===2?((outAll[sv.line]||{}).f||{}):{};}
  Object.defineProperty(G,"time",{get(){return fmt(G.clock);},set(v){},configurable:true});
  G.steps=sv.steps.map(m=>{const s=L.steps.find(x=>x.id===m.id);if(s)return s;if(/^ot_/.test(m.id))return otRestore(m.id,m.t,L);const ev=EVENTS.find(e=>"ev_"+e.id===m.id);return ev?{...ev.make(),id:m.id,t:m.t,isEvent:true}:null;}).filter(Boolean);
  makePlayer(L);player.position.set(sv.pos[0],0,sv.pos[1]);
  Object.keys(CHARS).forEach(id=>{if(CHARS[id].body!==undefined)setNPC(id,null);});
  for(const id in L.npcs)if(CHARS[id]&&CHARS[id].body!==undefined)setNPC(id,val(L.npcs[id],G),true);
  for(let i=0;i<=G.idx&&i<G.steps.length;i++){const s=G.steps[i];if(s.npc)for(const id in s.npc)setNPC(id,val(s.npc[id],G),true);if(i<G.idx&&s.after)for(const id in s.after)setNPC(id,val(s.after[id],G),true);}
  Object.values(itemMarks).forEach(m=>scene.remove(m));for(const k in itemMarks)delete itemMarks[k];
  syncItems();
  for(const id in sideMarks){scene.remove(sideMarks[id]);delete sideMarks[id];}
  setBoard(L.board);setDaylight(!!L.daylight);placeJuniorHigh(L);
  crowdPhase=null;setCrowd(phaseOf(),true);FX.shake=FX.dark=0;path=null;
  const st=G.steps[G.idx];G.due=null;if(!st.auto){let nx=G.idx+1;while(G.steps[nx]&&G.steps[nx].auto)nx++;const nt=G.steps[nx]?toMin(G.steps[nx].t):endMin();G.due=Math.max(nt,G.clock+8);}
  mode="walk";renderAll();if(st.auto)openStep();
}
function finish(){
  mode="end";const r=G.line.ending(G);G.result=r;remember(r);G.done=true;clearSave();doneLines.add(G.day===2?G.line.id+"@2":G.line.id);store.set("done",[...doneLines]);checkAch();renderAll();
  const c=$("cover");c.className="cover";c.hidden=false;
  const its=G.items.map(id=>ITEMS.find(i=>i.id===id)).filter(Boolean);
  c.innerHTML=`<div class="card report fade"><div class="kick">${G.day===2?"第二天・":""}${r.dead?"提早下班":fmt(Math.max(G.clock,endMin()))+" 下班"}・${esc(G.line.role)}・結案報告</div><h2>${esc(r.title)}</h2><p style="margin:0">${esc(r.desc)}</p>${G.line.coda?`<p style="margin:10px 0 0;font-family:var(--display);color:var(--muted)">${esc(G.line.coda)}</p>`:""}
   <div class="big">${r.big.map(([v,l])=>`<div><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("")}</div>
   <div class="big" style="grid-template-columns:repeat(${Object.keys(G.s).length},1fr)">${Object.keys(G.s).map(k=>`<div><b style="font-size:1.1rem">${G.s[k]}</b><span>${G.line.stats[k][0]}</span></div>`).join("")}</div>
   <div class="lbl">準時</div><p style="margin:0">${G.lates?`遲到 ${G.lates} 次，一共 ${G.lateMin} 分鐘。`:"每一件事都準時到。"}${r.dead?"":otMin()?`加班 ${otMin()} 分鐘。`:"準時十點下班。"}${(G.chatWith||[]).length?`跟 ${G.chatWith.length} 個人聊了天。`:""}</p>
   ${its.length?`<div class="lbl">今晚撿到</div><p style="margin:0">${its.map(i=>`${i.icon} ${esc(i.name)}`).join("　")}</p>`:""}
   <ol class="log">${G.log.map(([a,b])=>`<li><span>${esc(a)}</span>${esc(b)}</li>`).join("")}</ol>
   <div class="actions"><button class="primary" data-act="start">再上一天班</button><button class="ghost" data-act="shareCard">成績卡</button><button class="ghost" data-act="copy">複製結算</button><button class="ghost" data-act="title">換個位子</button><span class="toast" id="toast" aria-live="polite"></span></div>
   <textarea id="copybox" readonly hidden style="width:100%;margin-top:10px;min-height:8em;font:inherit;background:var(--tray);color:var(--ink);border:1px solid var(--rule);border-radius:4px;padding:8px"></textarea></div>`;
  G.result=r;
}
function summaryText(){const r=G.result;return `晚上十點下課｜${G.day===2?"第二天｜":""}${G.line.role}｜${r.title}\n${r.big.map(([v,l])=>`${l} ${v}`).join("　")}\n${Object.keys(G.s).map(k=>`${G.line.stats[k][0]} ${G.s[k]}`).join("　")}\n`+G.log.map(([a,b])=>`${a} ${b}`).join("\n");}

/* ---------- 輸入 ---------- */
document.addEventListener("click",e=>{
  const term=e.target.closest("[data-term]");if(term){const t=term.dataset.term;const prev=$("sheet").hidden?null:$("sheet").innerHTML;
    $("termPop").hidden=false;$("termPop").innerHTML=`<div class="in"><div class="shead"><span>${esc(t)}</span><button class="close" data-act="closeTerm">關閉</button></div><p>${esc(TERMS[t]||"")}</p></div>`;return;}
  const tab=e.target.closest("[data-tab]");if(tab){codexTab=tab.dataset.tab;window.__codexDraw&&window.__codexDraw();return;}
  const dy=e.target.closest("[data-day]");if(dy&&!dy.disabled&&mode==="title"){pickedDay=+dy.dataset.day;store.set("day",pickedDay);showTitle();return;}
  const role=e.target.closest("[data-role]");if(role){pickedLine=role.dataset.role;store.set("line",pickedLine);showTitle();return;}
  const ch=e.target.closest("[data-choice]");if(ch&&D){dChoose(+ch.dataset.choice);return;}
  const a=e.target.closest("[data-act]");if(!a)return;const act=a.dataset.act;
  if(act==="start"){$("cover").hidden=true;startAmbient();newGame(pickedLine,pickedDay===2&&doneLines.has(pickedLine)&&LINES2[pickedLine]?2:1);}
  else if(act==="chapterGo")closeChapter();
  else if(act==="epilogue")epilogue();
  else if(act==="resume")resumeGame();
  else if(act==="dnext")dNext();else if(act==="dchat")dChat();else if(act==="dskip")dSkip();
  else if(act==="closeSheet")closeSheet();else if(act==="closeTerm")$("termPop").hidden=true;
  else if(act==="camReset"){CAM.yaw=0;CAM.tilt=1;CAM.zoom=1;saveCam();}
  else if(act==="guide"){const t=guideTarget(step().target);path=findPath(t.x,t.z);guiding=true;}
  else if(act==="codex")openCodex();
  else if(act==="sound"){soundOn=!soundOn;store.set("sound",soundOn);renderHud();if(soundOn){beep("ok");startAmbient();}else stopAmbient();a.setAttribute("aria-pressed",soundOn);if(a.classList.contains("toggle"))a.textContent=soundOn?"開":"關";}
  else if(act==="settings")openSettings();
  else if(act==="shareCard")openShareCard();
  else if(act==="home"){showTitle();}
  else if(act==="title")showTitle();
  else if(act==="about")openSheet("關於",`<h3>晚上十點下課</h3><p>一個補習班晚上的小遊戲。靈感來自晶圓廠的打工遊戲 fab24hr，把場景換成台灣的補習班。</p><p>可以玩三個不同的位子：數學老師、櫃台班導、補習班主任。同一個晚上，看到的事情不一樣。</p><p class="hint">補習班、人物、數字都是虛構的，不代表任何一家補習班。</p>`);
  else if(act==="copy"){const txt=summaryText(),t=$("toast");const fb=()=>{const b=$("copybox");b.hidden=false;b.value=txt;b.select();t.textContent="無法自動複製，已幫你選取文字";};
    try{navigator.clipboard.writeText(txt).then(()=>t.textContent="已複製",fb);}catch(err){fb();}}
});
$("sheetBg").addEventListener("click",()=>{if(mode!=="mini")closeSheet();});
$("actBtn").addEventListener("click",interact);
document.addEventListener("contextmenu",e=>{if(!e.target.closest("input,textarea"))e.preventDefault();});
document.addEventListener("selectstart",e=>{if(!e.target.closest||!e.target.closest("input,textarea"))e.preventDefault();});
const KEYMAP={ArrowUp:"u",KeyW:"u",ArrowDown:"d",KeyS:"d",ArrowLeft:"l",KeyA:"l",ArrowRight:"r",KeyD:"r"};
document.addEventListener("keydown",e=>{
  if(e.target.closest&&e.target.closest("input,textarea"))return;
  if(e.key==="Escape"){if(!$("termPop").hidden)$("termPop").hidden=true;else if(!$("sheet").hidden&&mode!=="mini")closeSheet();return;}
  if(KEYMAP[e.code]&&mode==="walk"){keys[KEYMAP[e.code]]=1;path=null;guiding=false;e.preventDefault();return;}
  if(e.code==="KeyE"&&mode==="walk"){e.preventDefault();interact();}
  if(mode==="dialog"&&D&&/^Digit[1-9]$/.test(e.code)){const i=+e.code.slice(5)-1;if(D.choices&&D.i===D.pages.length-1&&D.choices[i])dChoose(i);}
});
document.addEventListener("keyup",e=>{if(KEYMAP[e.code])keys[KEYMAP[e.code]]=0;});
document.querySelectorAll("#dpad button").forEach(b=>{const k=b.dataset.k;
  const on=e=>{e.preventDefault();keys[k]=1;path=null;guiding=false;},off=()=>{keys[k]=0;};
  b.addEventListener("pointerdown",on);b.addEventListener("pointerup",off);b.addEventListener("pointerleave",off);b.addEventListener("pointercancel",off);});
let downAt=null;const ray=new THREE.Raycaster();
/* 視角：拖曳旋轉、上下拖改俯角、雙指或滾輪縮放 */
const CAM={yaw:0,tilt:1,zoom:1};const ptrs=new Map();let dragged=false,pinch0=0,zoom0=1,last=null;
try{const c=store.get("cam",null);if(c){CAM.tilt=c.tilt||1;CAM.zoom=c.zoom||1;}}catch(e){}
function saveCam(){store.set("cam",{tilt:CAM.tilt,zoom:CAM.zoom});}
stage.addEventListener("pointerdown",e=>{ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(ptrs.size===1){downAt=[e.clientX,e.clientY];last=[e.clientX,e.clientY];dragged=false;}
  else if(ptrs.size===2){const [a,b]=[...ptrs.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);zoom0=CAM.zoom;dragged=true;}});
stage.addEventListener("pointermove",e=>{if(!ptrs.has(e.pointerId))return;ptrs.set(e.pointerId,[e.clientX,e.clientY]);
  if(ptrs.size===2){const [a,b]=[...ptrs.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch0>0){CAM.zoom=Math.max(.55,Math.min(1.8,zoom0*pinch0/d));}return;}
  if(!last)return;const mx=e.clientX-last[0],my=e.clientY-last[1];
  if(!dragged&&Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>10)dragged=true;
  if(dragged){CAM.yaw-=mx*.009*SET.rot;CAM.tilt=Math.max(.45,Math.min(1.6,CAM.tilt-my*.006*SET.rot));}last=[e.clientX,e.clientY];});
const ptrEnd=e=>{ptrs.delete(e.pointerId);if(ptrs.size===0){last=null;saveCam();}};
stage.addEventListener("pointercancel",ptrEnd);
stage.addEventListener("wheel",e=>{e.preventDefault();CAM.zoom=Math.max(.55,Math.min(1.8,CAM.zoom*(1+Math.sign(e.deltaY)*.08)));saveCam();},{passive:false});
document.addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea"))return;if(e.code==="KeyQ")CAM.yaw+=Math.PI/8;if(e.code==="KeyR")CAM.yaw-=Math.PI/8;});
stage.addEventListener("pointerup",e=>{const wasDrag=dragged||ptrs.size>1;ptrEnd(e);if(!downAt||mode!=="walk"||wasDrag)return;if(Math.hypot(e.clientX-downAt[0],e.clientY-downAt[1])>10)return;
  const r=renderer.domElement.getBoundingClientRect();ray.setFromCamera({x:(e.clientX-r.left)/r.width*2-1,y:-(e.clientY-r.top)/r.height*2+1},camera);
  const hit=ray.intersectObject(ground)[0];if(hit){path=findPath(hit.point.x,hit.point.z);guiding=false;}});

const sideMarks={};let bannerT=null;
function showBanner(title,text){const b=$("banner");b.innerHTML=`<b>${esc(title)}</b>${esc(text)}`;b.style.top="auto";b.style.bottom="calc(190px + env(safe-area-inset-bottom,0px))";b.hidden=false;clearTimeout(bannerT);bannerT=setTimeout(()=>b.hidden=true,2800);}
/* ---------- 依時段與職業出現的物品 ---------- */
const PHASE_NAME={pre:"上課前",class:"上課中",break:"下課",leave:"下課後",close:"關門前"};
function syncItems(){if(!G)return;const ph=typeof phaseOf==="function"?phaseOf():"pre";
  ITEMS.forEach(it=>{const ok=G.day!==2&&!G.line.noItems&&(!it.lines||it.lines.includes(G.line.id))&&!G.items.includes(it.id)&&(!it.phases||it.phases.includes(ph));
    if(ok&&!itemMarks[it.id])addItemMark(it);else if(!ok&&itemMarks[it.id]){scene.remove(itemMarks[it.id]);delete itemMarks[it.id];}});}
/* ---------- 手機訊息、教學提示、畫面外箭頭 ---------- */
let msgT=null;
function showMsg(from,text){const m=$("msg");m.innerHTML=`<small>${esc(from)}</small><div>${esc(text)}</div>`;const nx=$("next");m.style.top=(nx.hidden?document.querySelector(".hud").offsetHeight+10:nx.offsetTop+nx.offsetHeight+10)+"px";m.hidden=false;beep("side");clearTimeout(msgT);msgT=setTimeout(()=>m.hidden=true,5200);}
function checkMsgs(){if(!G||mode!=="walk")return;const list=G.line.msgs||[];G.msgIdx=G.msgIdx||0;
  while(G.msgIdx<list.length&&toMin(list[G.msgIdx][0])<=G.clock){const [at,from,text]=list[G.msgIdx++];if(G.clock-toMin(at)<20){showMsg(from,val(text,G));break;}}}
function tickTips(){if(!G||mode!=="walk")return;
  if(!store.get("tipSide",false)&&activeSides().length){store.set("tipSide",true);showBanner("有人頭上出現「？」","那是支線。可以繞過去看看，也可以不理它。");}
  if(!store.get("tipItem",false)&&ITEMS.some(it=>itemMarks[it.id]&&Math.hypot(it.pos[0]-player.position.x,it.pos[1]-player.position.z)<5)){store.set("tipItem",true);showBanner("地上有東西在發光","走過去可以撿起來。撿東西會花一點時間。");}}
const _pv=new THREE.Vector3();
function tickEdge(){const a=$("edgeArrow");if(!G||mode!=="walk"){a.hidden=true;return;}const m=targetOf(step()?.target);if(!m){a.hidden=true;return;}
  _pv.set(m.x,1,m.z).project(camera);const W=innerWidth,H=innerHeight;let sx=(_pv.x+1)/2*W,sy=(1-_pv.y)/2*H;const behind=_pv.z>1;
  const nx=$("next"),nb=nx&&!nx.hidden?nx.getBoundingClientRect().bottom:0,top=Math.max(document.querySelector(".hud").offsetHeight+90,nb+34),l=34,r=W-34;let bot=H-40;
  for(const sel of [".dpad","#actBtn",".camreset"]){const e=document.querySelector(sel);if(e&&e.offsetParent){const b=e.getBoundingClientRect();if(b.height)bot=Math.min(bot,b.top-32);}}
  if(!behind&&sx>l&&sx<r&&sy>top&&sy<bot){a.hidden=true;return;}
  const cx=W/2,cy=(top+bot)/2;let dx=sx-cx,dy=sy-cy;if(behind){dx=-dx;dy=-dy;}
  const k=Math.min(Math.abs((dx>0?r-cx:l-cx)/(dx||1e-6)),Math.abs((dy>0?bot-cy:top-cy)/(dy||1e-6)));
  a.style.left=(cx+dx*k)+"px";a.style.top=(cy+dy*k)+"px";a.firstChild.style.transform=`rotate(${Math.atan2(dy,dx)}rad)`;a.hidden=false;}
/* ---------- 主迴圈 ---------- */
const camOff=new THREE.Vector3(0,9,7.4),camLook=new THREE.Vector3(4.5,.6,16);let lastNearKey="";
function tick(){
  const dt=Math.min(.05,clockT.getDelta()),t=clockT.elapsedTime;
  if(G&&player){
    if(mode==="walk"){
      let dx=0,dz=0;const ix=(keys.r?1:0)-(keys.l?1:0),iz=(keys.d?1:0)-(keys.u?1:0);
      if(ix||iz){const cy=Math.cos(CAM.yaw),sy=Math.sin(CAM.yaw);dx=ix*cy+iz*sy;dz=-ix*sy+iz*cy;}
      if(!dx&&!dz&&path&&path.length){const [px,pz]=path[0],vx=px-player.position.x,vz=pz-player.position.z,dd=Math.hypot(vx,vz);if(dd<.08)path.shift();else{dx=vx/dd;dz=vz/dd;}}
      if(dx||dz){const l=Math.hypot(dx,dz);dx/=l;dz/=l;const ox=player.position.x,oz=player.position.z;stepPlayer(ox+dx*3.4*dt,oz+dz*3.4*dt);
        if(path&&Math.hypot(player.position.x-ox,player.position.z-oz)<.002){G.stuck=(G.stuck||0)+dt;if(G.stuck>.4){G.stuck=0;const end=path[path.length-1];path=findPath(end[0],end[1]);}}else G.stuck=0;player.rotation.y=Math.atan2(dx,dz);G.moving=true;}
      else G.moving=false;
      near=nearest();const key=near?near.type+near.label:"";if(key!==lastNearKey){lastNearKey=key;renderDock();}
      if(guiding&&near&&near.type==="main"&&path&&path.length<=1){path=null;}
      if(guiding&&!(near&&near.type==="main")){G.reg=(G.reg||0)-dt;if(G.reg<=0){G.reg=.6;const tg=guideTarget(step().target);const end=path&&path.length?path[path.length-1]:null;
        if(tg&&(!end||Math.hypot(end[0]-tg.x,end[1]-tg.z)>1.2))path=findPath(tg.x,tg.z);}}
    } else if(near){near=null;lastNearKey="";}
    const act=mode==="walk"?activeSides():[];
    for(const id in sideMarks)sideMarks[id].visible=false;
    act.forEach(sd=>{const tg=targetOf(sd.target);if(!tg)return;const mk=sideMarks[sd.id]||(sideMarks[sd.id]=addSideMark());mk.visible=true;mk.position.set(tg.x,tg.h+Math.sin(t*3+1)*.1,tg.z);});
    if(mode==="walk"){const z=zoneAt(player.position.x,player.position.z);if(z&&z[0]!==G.zone){G.zone=z[0];if(!G.zonesSeen)G.zonesSeen={};if(!G.zonesSeen[z[0]]){G.zonesSeen[z[0]]=1;showBanner(z[0],(G.line.zoneText&&G.line.zoneText[z[0]])||z[5]);}}}
    const m=targetOf(step()?.target);marker.visible=mode==="walk"&&!!m;if(m)marker.position.set(m.x,m.h+Math.sin(t*3)*.12,m.z);
    tickItemMarks(t);tickEdge();tickTips();
    tickClock(dt);tickNight(dt);tickRain(dt);moveNPCs(dt);tickCrowd();if(mode!=="title")tickAmbient(dt);tickFX(dt);
    const spk=mode==="dialog"&&D?D.pages[D.i][0]:null,now=performance.now()/1000;
    animPerson(player,dt,t,{walk:mode==="walk"&&G.moving,talk:spk==="me"});tickEmote(player,now);
    for(const id in npcs){const n=npcs[id];if(!n.visible)continue;animPerson(n,dt,t,{walk:n.userData.moving,talk:spk===id,act:npcAct(id,n,t),raise:id==="parent"&&G.line.id==="teacher"&&step()?.id==="ask"&&mode==="walk"});tickEmote(n,now);}
    extras.forEach(e=>{if(!e.p.visible)return;animPerson(e.p,dt,t,{walk:e.p.userData.moving});tickEmote(e.p,now);});
    const ph=innerWidth<600,rr=(ph?8.6:7.4)*CAM.zoom/Math.sqrt(CAM.tilt),hh=(ph?10.4:9)*CAM.zoom*Math.sqrt(CAM.tilt);
    const want=new THREE.Vector3(player.position.x+Math.sin(CAM.yaw)*rr,hh,player.position.z+Math.cos(CAM.yaw)*rr);
    const k=1-Math.pow(.002,dt);camera.position.lerp(want,k);camLook.lerp(new THREE.Vector3(player.position.x,.6,player.position.z),k);
    if(FX.shake>0){const a=.18*Math.min(1,FX.shake);camera.position.x+=(Math.random()-.5)*a;camera.position.y+=(Math.random()-.5)*a;}
  } else {camera.position.set(14+Math.sin(t*.1)*6,16,22);camLook.set(14,0,9);const now=performance.now()/1000;moveNPCs(dt);
    extras.forEach(e=>{if(e.p.visible){animPerson(e.p,dt,t,{});tickEmote(e.p,now);}});for(const id in npcs)if(npcs[id].visible)animPerson(npcs[id],dt,t,{act:npcAct(id,npcs[id],t)});}
  camera.lookAt(camLook);renderer.render(scene,camera);requestAnimationFrame(tick);
}
