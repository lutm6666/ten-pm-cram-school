/* ================= 隨機事件：每一輪抽兩件，插在固定的空檔 ================= */
const byLine=(G,m)=>m[G.line.id]||(G.line.id==="care"?m.yun:G.line.id==="jh"?m.teacher:null)||{};
const EVENTS=[
 {id:"quake",phases:["pre","class","break"],make:()=>({auto:true,effect:"shake",goal:"地震！",
  pages:G=>[[null,"桌子突然晃了起來。吊燈在晃，有人尖叫了一聲。"],[null,"是地震。大概三級，晃了十秒左右。"]],
  choices:G=>[
   {label:"叫大家躲到桌子底下",fx:G=>byLine(G,{teacher:{voice:-5,stu:6},yun:{ord:8,pat:-3},boss:{calm:-3,rep:5}}),log:"地震時叫大家躲桌下",res:[[null,"大家鑽到桌子底下。停了之後有人笑出來：「老師你躲最快。」氣氛反而輕鬆了。"]]},
   {label:"先穩住，等它停",fx:G=>byLine(G,{teacher:{stu:2},yun:{pat:3},boss:{calm:5}}),log:"地震時先穩住",res:[[null,"十秒後停了。你深呼吸一下，大家也跟著安靜下來。"]]},
   {label:"繼續做事，當作沒事",fx:G=>byLine(G,{teacher:{stu:-5},yun:{ord:-5},boss:{rep:-3}}),log:"地震時照常做事",res:[[null,"震完了，一半的人在滑手機看地震報告。"]]}]})},
 {id:"blackout",phases:["pre","class","break"],make:()=>({auto:true,effect:"dark",goal:"停電了",
  pages:G=>[[null,"燈閃了兩下，全暗。冷氣「咚」一聲停了。"],[null,"三秒後燈亮了，冷氣沒有回來。整層樓開始變熱。"]],
  choices:G=>[
   {label:"開窗，把電風扇搬出來",fx:G=>byLine(G,{teacher:{hp:-5,stu:3},yun:{hp:-5,ord:3},boss:{calm:-2,morale:5}}),log:"停電後開窗搬電風扇",res:[[null,"窗戶一開，外面的機車聲灌進來。至少有風了。"]]},
   {label:"打給大樓管理員",fx:G=>byLine(G,{teacher:{voice:-3},yun:{pat:-5,par:2},boss:{calm:-5,rep:2}}),log:"停電後找管理員",res:[[null,"管理員說是跳電，十分鐘後冷氣回來了。"]]},
   {label:"說這是最好的專注訓練",fx:G=>byLine(G,{teacher:{stu:-2,voice:-5},yun:{pat:2},boss:{morale:-3}}),log:"停電時精神喊話",res:[[null,"沒有人覺得好笑。有人用講義搧風。"]]}]})},
 {id:"delivery",phases:["pre","break"],make:()=>({target:{npc:"deliv"},goal:"門口有外送員在找人",npc:{deliv:[4.5,16.4,Math.PI]},after:{deliv:null},
  pages:G=>[["deliv","請問這裡是 B 班嗎？二十杯珍奶，已經付款了。"],["deliv","訂購人寫：王媽媽。備註：「謝謝老師，請大家喝」。"]],
  choices:G=>[
   {label:"收下，下課分給大家",fx:G=>byLine(G,{teacher:{stu:8,trial:5},yun:{ord:-3,par:5},boss:{morale:8,trial:5}}),log:"收下試聽家長請的珍奶",res:[[null,"二十杯珍奶在櫃台排成兩排。下課時，走廊上全是吸珍珠的聲音。"]]},
   {label:"婉拒，說補習班不能收家長的禮",fx:G=>byLine(G,{teacher:{trial:-3},yun:{pat:-3},boss:{rep:6,trial:-3}}),log:"婉拒家長請的珍奶",res:[["deliv","……那我要怎麼辦？已經付款了耶。"],[null,"最後珍奶還是留下來了，只是大家喝得有點尷尬。"]]}]})},
 {id:"nosebleed",phases:["class"],make:()=>({target:{npc:"pinyu"},goal:"前排有人流鼻血",
  pages:G=>[[null,"前排的品妤流鼻血了。她用手按著鼻子，講義上滴了兩滴。"],[null,"她桌上的衛生紙已經用完。"]],
  choices:G=>[
   {label:"拿面紙，陪她去洗手間",fx:G=>byLine(G,{teacher:{stu:5,voice:2},yun:{par:5,hp:-3},boss:{rep:4,calm:-2}}),log:"陪流鼻血的學生去洗手間",res:[["pinyu","……謝謝。最近都睡不好。"],[null,"她說模考之後每天念到兩點。"]],set:{pinyuTalk:1}},
   {label:"請隔壁同學陪她去",fx:G=>byLine(G,{teacher:{stu:1},yun:{ord:2},boss:{calm:2}}),log:"請同學陪她去洗手間",res:[[null,"隔壁同學扶著她出去。五分鐘後，她回來了，鼻子塞著衛生紙。"]]}]})},
 {id:"roach",phases:["pre","class","break"],make:()=>({target:{npc:"hong"},goal:"自習室傳來尖叫",
  pages:G=>[["hong","有、有蟑螂！會飛的那種！"],[null,"自習室的學生全部站到椅子上。"]],
  choices:G=>[
   {label:"拿拖鞋親自處理",fx:G=>byLine(G,{teacher:{hp:-5,stu:5},yun:{hp:-5,ord:8},boss:{calm:-5,morale:8}}),log:"親自處理自習室的蟑螂",res:[[null,"一拖鞋。全場鼓掌。"],["hong","你是我的英雄。"]]},
   {label:"打開門窗讓牠自己出去",fx:G=>byLine(G,{teacher:{stu:-2},yun:{ord:-3},boss:{calm:3}}),log:"讓蟑螂自己出去",res:[[null,"十五分鐘後，牠自己飛走了。這十五分鐘沒有人在念書。"]]}]})},
 {id:"rain",phases:["pre","break","class"],make:()=>({auto:true,goal:"外面下大雨了",
  pages:G=>[[null,"外面突然下起大雨，雨聲大到蓋過講話聲。"],[null,"手機群組一直跳通知：好幾個家長說會晚點來接。"]],
  choices:G=>[
   {label:"在群組公告：自習室延到十點半",fx:G=>byLine(G,{teacher:{par:6,hp:-3},yun:{par:8,pat:-3},boss:{rep:6,calm:-3}}),log:"下雨延長自習室開放",res:[[null,"家長群組出現一排「謝謝」的貼圖。"]]},
   {label:"把櫃台的備用雨傘借出去",fx:G=>byLine(G,{teacher:{par:3},yun:{par:5,ord:-2},boss:{rep:4}}),log:"借出備用雨傘",res:[[null,"十二把傘全部借光。明天應該只會回來八把。"]]},
   {label:"照常，不特別處理",fx:G=>byLine(G,{teacher:{},yun:{pat:3,par:-5},boss:{calm:3,rep:-3}}),log:"下雨照常處理",res:[[null,"雨一直下到十點。"]]}]})}
];
const EVENT_SLOTS={
 teacher:[{after:"hall",t:"18:10",phase:"pre"},{after:"zhe",t:"19:30",phase:"class"},{after:"ask",t:"20:55",phase:"class"}],
 yun:[{after:"yparent",t:"17:55",phase:"pre"},{after:"yseat",t:"19:20",phase:"class"},{after:"yzhe",t:"20:00",phase:"break"}],
 boss:[{after:"bpitch",t:"18:20",phase:"pre"},{after:"bflyer",t:"19:35",phase:"class"},{after:"bq",t:"21:00",phase:"class"}]
};
function buildSteps(L){
  const steps=[...L.steps],slots=[...(L.eventSlots||EVENT_SLOTS[L.id]||[])].sort(()=>Math.random()-.5).slice(0,2),used=new Set();
  slots.forEach(sl=>{const pool=EVENTS.filter(e=>(!L.events||L.events.includes(e.id))&&e.phases.includes(sl.phase)&&!used.has(e.id)&&!(e.id==="nosebleed"&&L.id!=="teacher"&&sl.phase!=="class"));
    if(!pool.length)return;const ev=pool[Math.floor(Math.random()*pool.length)];used.add(ev.id);
    const st={...ev.make(),id:"ev_"+ev.id,t:sl.t,isEvent:true};const i=steps.findIndex(s=>s.id===sl.after);if(i>=0)steps.splice(i+1,0,st);});
  if(typeof otSteps==="function")steps.push(...otSteps(L));
  return steps;
}
