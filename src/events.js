/* ================= 隨機事件：每一輪抽兩件，插在固定的空檔 ================= */
const byLine=(G,m)=>m[G.line.id]||(G.line.id==="care"?m.yun:null)||{};
// Earthquake narration refers to the people actually near the player, even before class.
let quakeScene=null;
function beginQuake(){
  const z=zoneAt(player.position.x,player.position.z),zone=z&&z[0]||'走廊';
  const people=Object.values(npcs).concat(extras.map(e=>e.p)).filter(p=>p.visible&&Math.hypot(p.position.x-player.position.x,p.position.z-player.position.z)<4&&zoneAt(p.position.x,p.position.z)?.[0]===zone);
  quakeScene={zone,people,covered:false,classroom:zone.includes('教室')&&people.some(p=>p.userData.seated)};
}
function coverQuake(){if(!quakeScene)return;quakeScene.covered=true;FX.shake=0;[player,...quakeScene.people].forEach(p=>{p.userData.quakePose={act:p.userData.act,seated:p.userData.seated};p.userData.act='cover';p.userData.moving=false;});}
function endQuake(){
  if(quakeScene)[player,...quakeScene.people].forEach(p=>{const u=p.userData,old=u.quakePose;if(old){u.act=old.act;setPose(p,old.seated);u.rig.position.y=old.seated&&u.kid?.22:0;delete u.quakePose;}});
  quakeScene=null;FX.shake=0;
}
const EVENTS=[
 {id:"quake",phases:["pre","class","break"],make:()=>({auto:true,effect:"shake",goal:"地震！",onOpen:beginQuake,onClose:endQuake,
  pages:G=>[[null,`${quakeScene.zone}的地板突然晃了起來。是地震。`],[null,quakeScene.classroom?"桌椅還在晃，附近的學生看著你，等你指示。":"晃動還沒停。先顧好眼前的人，遠離玻璃與可能倒下的櫃子。"]],
  choices:G=>[
   {label:"就近趴下、掩護、穩住",onResolve:coverQuake,fx:G=>byLine(G,{teacher:{voice:-5,stu:6},jh:{pat:-3,stu:6},yun:{ord:8,pat:-3},care:{ord:8,pat:-3},boss:{calm:-3,rep:5}}),log:"地震時就近掩護",res:G=>[[null,quakeScene.classroom?"你和附近的學生低下身、護住頭頸。片刻後晃動停了，大家仍維持掩護姿勢，確認安全再起身。":`此刻你在${quakeScene.zone}。你${quakeScene.people.length?'提醒身邊的人一起':''}蹲低、護住頭頸。片刻後晃動停了，先確認周圍安全，再起身。`]]},
   {label:"先穩住，等它停",onResolve:()=>{FX.shake=0;},fx:G=>byLine(G,{teacher:{stu:2},jh:{pat:3},yun:{pat:3},care:{pat:3},boss:{calm:5}}),log:"地震時先穩住",res:[[null,"片刻後晃動停了。你深呼吸一下，確認身邊的人是否平安。"]]},
   {label:"繼續做事，當作沒事",onResolve:()=>{FX.shake=0;},fx:G=>byLine(G,{teacher:{stu:-5},jh:{stu:-5,par:-2},yun:{ord:-5},care:{ord:-5,par:-3},boss:{rep:-3}}),log:"地震時照常做事",res:[[null,"震完了，你才停下手邊的事，拿手機查看地震消息。家長群組已經在問了。"]]}]})},
 {id:"blackout",phases:["pre","class","break"],make:()=>({auto:true,effect:"dark",goal:"停電了",
  pages:G=>[[null,"燈閃了兩下，全暗。冷氣「咚」一聲停了。"],[null,"三秒後燈亮了，冷氣沒有回來。整層樓開始變熱。"]],
  choices:G=>[
   {label:"開窗，把電風扇搬出來",fx:G=>byLine(G,{teacher:{hp:-5,stu:3},jh:{hp:-5,stu:3},yun:{hp:-5,ord:3},boss:{calm:-2,morale:5}}),log:"停電後開窗搬電風扇",res:[[null,"窗戶一開，外面的機車聲灌進來。至少有風了。"]]},
   {label:"打給大樓管理員",fx:G=>byLine(G,{teacher:{voice:-3},jh:{pat:-3},yun:{pat:-5,par:2},boss:{calm:-5,rep:2}}),log:"停電後找管理員",res:[[null,"管理員說是跳電，十分鐘後冷氣回來了。"],[null,"主任在群組補了一句：「總開關旁邊那顆不要再同時開三台。」"]]},
   {label:"說這是最好的專注訓練",fx:G=>byLine(G,{teacher:{stu:-2,voice:-5},jh:{stu:-4},yun:{pat:2},boss:{morale:-3}}),log:"停電時精神喊話",res:[[null,"沒有人覺得好笑。有人用考卷搧風。"]]}]})},
 {id:"delivery",phases:["break"],make:()=>({target:{npc:"deliv"},goal:"門口有外送員在找人",npc:{deliv:[4.5,16.4,Math.PI]},after:{deliv:null},
  pages:G=>[["deliv","請問九年級是在這裡嗎？十五杯珍奶，已經付款了。"],["deliv","訂購人寫：子晴媽媽。備註：「段考前，請九年級的大家喝」。"],[null,"子晴媽媽是家長會的，每次段考前都會這樣。"]],
  choices:G=>[
   {label:"收下，下課分給大家",fx:G=>byLine(G,{teacher:{stu:8},jh:{stu:8,pat:-2},yun:{ord:-3,par:5},boss:{morale:8}}),log:"收下家長請的珍奶",res:[[null,"十五杯珍奶在櫃台排成兩排。下課時，三樓走廊全是吸珍珠的聲音。"],[null,"有兩個人說不喝含糖的。你把那兩杯放進休息室冰箱。"]]},
   {label:"婉拒，說補習班不能收家長的禮",fx:G=>byLine(G,{teacher:{stu:-1},jh:{par:-2},yun:{pat:-3},boss:{rep:6}}),log:"婉拒家長請的珍奶",res:[["deliv","……那我要怎麼辦？已經付款了耶。"],[null,"最後珍奶還是留下來了，只是大家喝得有點尷尬。"]]}]})},
 {id:"nosebleed",lines:["teacher","jh"],phases:["class"],make:()=>({target:{npc:"pinyu"},goal:"前排有人流鼻血",
  pages:G=>[[null,"前排的品妤流鼻血了。她用手按著鼻子，考卷上滴了兩滴。"],[null,"她桌上的衛生紙已經用完。"]],
  choices:G=>[
   {label:"拿面紙，陪她去洗手間",fx:G=>byLine(G,{teacher:{stu:5,voice:2},jh:{stu:5,hp:-2}}),log:"陪流鼻血的學生去洗手間",res:[["pinyu","……謝謝。最近都睡不好。"],[null,"她說段考前每天念到兩點，媽媽還幫她多報了一科。"]],set:{pinyuTalk:1}},
   {label:"請隔壁同學陪她去",fx:G=>byLine(G,{teacher:{stu:1},jh:{stu:1,pat:2}}),log:"請同學陪她去洗手間",res:[[null,"隔壁同學扶著她出去。五分鐘後，她回來了，鼻子塞著衛生紙。"]]}]})},
 {id:"roach",phases:["class","break"],make:()=>({target:{npc:"hong"},goal:"課輔室傳來尖叫",
  pages:G=>[["hong","有、有蟑螂！會飛的那種！"],[null,"阿宏一個人在課輔室整理講義，現在站在椅子上，手機在錄影。"]],
  choices:G=>[
   {label:"拿拖鞋親自處理",fx:G=>byLine(G,{teacher:{hp:-5,stu:5},jh:{hp:-5,stu:5},yun:{hp:-5,ord:8},boss:{calm:-5,morale:8}}),log:"親自處理課輔室的蟑螂",res:[[null,"一拖鞋。阿宏鼓掌。"],["hong","你是我的英雄。"]]},
   {label:"打開門窗讓牠自己出去",fx:G=>byLine(G,{teacher:{stu:-2},jh:{stu:-2},yun:{ord:-3},boss:{calm:3}}),log:"讓蟑螂自己出去",res:[[null,"十五分鐘後，牠自己飛走了。這十五分鐘，阿宏一直站在椅子上。"]]}]})},
 {id:"rain",phases:["pre","break","class"],make:()=>({auto:true,goal:"外面下大雨了",
  pages:G=>[[null,"外面突然下起大雨，雨聲大到蓋過講話聲。"],[null,"手機群組一直跳通知：好幾個家長說會晚點來接。"]],
  choices:G=>[
   {label:G.line.id==="teacher"?"請小芸在群組公告：課輔室開到九點半":"在群組公告：課輔室開到九點半",fx:G=>byLine(G,{teacher:{par:6,hp:-3},jh:{par:6,hp:-3},yun:{par:8,pat:-3},boss:{rep:6,calm:-3}}),log:"下雨延長課輔室開放",res:[[null,"家長群組出現一排「謝謝」的貼圖。阿宏說他可以多留半小時。"]]},
   {label:"把櫃台的備用雨傘借出去",fx:G=>byLine(G,{teacher:{par:3},jh:{par:3},yun:{par:5,ord:-2},boss:{rep:4}}),log:"借出備用雨傘",res:[[null,"十二把傘全部借光。明天應該只會回來八把。"]]},
   {label:"照常，不特別處理",fx:G=>byLine(G,{teacher:{},jh:{pat:2,par:-4},yun:{pat:3,par:-5},boss:{calm:3,rep:-3}}),log:"下雨照常處理",res:[[null,"雨一直下到九點多。"]]}]})}
];
const EVENT_SLOTS={
 teacher:[{after:"t_lesson1",t:"18:20",phase:"class"},{after:"t_mood",t:"19:12",phase:"class"},{after:"t_lesson2",t:"20:30",phase:"class"}]
};
function buildSteps(L){
  const steps=[...L.steps],slots=[...(L.eventSlots||EVENT_SLOTS[L.id]||[])].sort(()=>Math.random()-.5).slice(0,2),used=new Set();
  slots.forEach(sl=>{const pool=EVENTS.filter(e=>(!L.events||L.events.includes(e.id))&&(!e.lines||e.lines.includes(L.id))&&e.phases.includes(sl.phase)&&!used.has(e.id)&&!(e.id==="nosebleed"&&L.id!=="teacher"&&sl.phase!=="class"));
    if(!pool.length)return;const ev=pool[Math.floor(Math.random()*pool.length)];used.add(ev.id);
    const st={...ev.make(),id:"ev_"+ev.id,t:sl.t,isEvent:true};const i=steps.findIndex(s=>s.id===sl.after);if(i>=0)steps.splice(i+1,0,st);});
  if(typeof otSteps==="function")steps.push(...otSteps(L));
  return steps;
}
