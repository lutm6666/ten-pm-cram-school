/* ================= 延遲下班：十點前後的加班事件與小遊戲 ================= */
/* 每輪在最後一個場景之後插入 1～2 件。選項的 min 是會多花掉的分鐘數。 */
const OT_EVENTS=[
 {id:"lockup",lines:["teacher","boss"],make:L=>({target:{spot:L==="teacher"?"classdoor":"door"},goal:"最後巡一圈，關燈關冷氣",action:"開始巡",
  pages:G=>[[null,"人差不多都走了。走廊的燈還亮著，冷氣還在轉。"],[null,G.line.id==="boss"?"上個月電費單上那個數字，你到現在還記得。":"小芸說今天她要先走，請最後一個人關燈。最後一個人好像是你。"]],
  choices:G=>[
   {label:"一間一間巡",mini:"lockup",min:4,fx:r=>{const b=byLine(G,{teacher:{hp:-3},boss:{calm:-2,rep:2}});if(r&&r.trap){b.par=(b.par||0)-3;b.rep=(b.rep||0)-2;}return b;},log:r=>r&&r.left?`巡樓漏了 ${r.left} 個開關`:r&&r.trap?"巡樓時關了自習室的燈":"巡樓關燈關冷氣",
    res:r=>r&&r.trap?[[null,"自習室傳來一聲：「欸——我還在！」"],[null,"你趕快把燈打開，跟角落那個學生道歉。"]]:r&&r.left?[[null,"走到樓下才想起來，好像有東西沒關。算了，明天第一個到的人會看到。"]]:[[null,"整層樓暗下來，只剩緊急出口的綠燈。"]]},
   {label:"留給明天早上的人",fx:G=>byLine(G,{teacher:{hp:3},boss:{calm:3,rep:-3}}),log:"沒巡樓就走",res:[[null,"你按下電梯。走廊的燈還亮著，在玻璃門上反光。"]]}]})},
 {id:"pickup",lines:["teacher","yun","boss"],make:L=>({target:{npc:"pinyu"},goal:"門口還有學生沒人接",npc:{pinyu:[4.6,16.3,Math.PI]},after:{pinyu:null},
  pages:G=>[[null,"鐵門拉下一半了。品妤還坐在門口的台階上，書包抱在胸前。"],["pinyu","我媽說她會議還沒開完，會晚一點……她說十點半。"],[null,"外面的機車一台一台騎走。"]],
  choices:G=>[
   {label:"陪她等",note:"多待一陣子",mini:"wait",min:20,fx:r=>{const b=byLine(G,{teacher:{hp:-5,stu:6},yun:{hp:-6,par:8},boss:{calm:-4,rep:6}});return b;},set:{waitedPinyu:1},log:"陪品妤等家長",
    res:r=>r&&r.mood>=3?[["pinyu","……謝謝。其實我有點不想回家，回家又要被問模考。"],[null,"她媽媽的車停在門口時，是 22:32。她媽媽搖下車窗，跟你點了點頭。"]]:[[null,"她媽媽終於來了。品妤上車前回頭揮了一下手。"]]},
   {label:"打給家長確認",min:6,fx:G=>byLine(G,{teacher:{par:3},yun:{par:4,pat:-2},boss:{rep:3}}),log:"打電話確認接送",res:[[null,"電話那頭很吵：「我十五分鐘到！真的很不好意思！」"],[null,"你讓品妤在櫃台旁邊等，燈先不關。"]]},
   {label:"讓她自己去搭公車",fx:G=>byLine(G,{teacher:{hp:3,par:-4},yun:{hp:4,par:-6},boss:{calm:4,rep:-5}}),set:{pinyuBus:1},log:"讓品妤自己搭公車",res:[[null,"品妤點點頭，往公車站走。你看著她的背影在路口轉彎。"],[null,"一直到睡前，你都在想她有沒有到家。"]]}]})},
 {id:"group",lines:["teacher","yun","boss"],auto:true,make:L=>({auto:true,goal:"群組又跳出訊息",
  pages:G=>[[null,"手機震個不停。是家長群組。"],[null,"十點多了。最上面一則是：「老師請問明天小考範圍是？」底下還有三則。"]],
  choices:G=>[
   {label:"現在一則一則回",mini:"reply",min:4,fx:r=>{const b=byLine(G,{teacher:{par:2,hp:-3},yun:{par:2,pat:-3},boss:{rep:2,calm:-3}});const k=r?r.ok:0;b.par=(b.par||0)+k*2;if(G.line.id==="boss")b.rep=(b.rep||0)+k;return b;},log:r=>`深夜回群組訊息（回得好 ${r?r.ok:0} 則）`,
    res:r=>r&&r.ok>=3?[[null,"群組出現一排貼圖。你把手機蓋在桌上。"]]:[[null,"有一則回完之後，對方已讀不回。你盯著那兩個字很久。"]]},
   {label:"已讀，明天早上再回",fx:G=>byLine(G,{teacher:{hp:3,par:-3},yun:{pat:3,par:-4},boss:{calm:3,rep:-2}}),log:"群組訊息留到明天",res:[[null,"你把通知關掉。明天早上，群組會變成 27 則未讀。"]]}]})},
 {id:"meeting",lines:["teacher","yun"],make:L=>({target:{npc:"boss"},goal:"主任說「等一下，有件事」",npc:{boss:[3.4,3.2,0]},
  pages:G=>[["boss","欸，你先別走。五分鐘就好。"],[null,"主任說的五分鐘，從來都不是五分鐘。"],["boss","下個月想開一個寒假衝刺班，你覺得排得出來嗎？"]],
  choices:G=>[
   {label:"留下來好好談",min:22,fx:G=>byLine(G,{teacher:{hp:-6,voice:-3,par:3},yun:{hp:-8,pat:-3,ord:4}}),set:{otMeeting:1},log:"下班後留下來跟主任開會",
    res:[[null,"你們談到十點半。主任最後說：「好，那就照你說的，一週兩次，不要再多。」"],[null,"這是今天第一次，有人問你排不排得出來。"]]},
   {label:"說明天上班再討論",fx:G=>byLine(G,{teacher:{hp:3},yun:{hp:4,pat:2}}),log:"請主任明天再談",res:[["boss","……也是，你今天也夠累了。明天一早來找我。"]]},
   {label:"直接說：排不出來",fx:G=>byLine(G,{teacher:{hp:2,par:-2},yun:{pat:5,ord:-2}}),set:{otNo:1},log:"直接拒絕寒假加課",res:[["boss","（愣了一下）好，我知道了。"],[null,"走出主任室，你的心跳很快。但腳步很輕。"]]}]})},
 {id:"hq",lines:["boss"],make:L=>({target:{spot:"bossdesk"},goal:"總部突然打視訊來",action:"接起來",
  pages:G=>[[null,"十點零幾分，電腦跳出視訊邀請。是總部的區經理。"],[null,"「何主任，還沒下班吧？我看一下你們這週的數字。」"]],
  choices:G=>[
   {label:"把今晚的狀況一件一件講",min:18,fx:{calm:-6,rep:6,morale:3},set:{otHQ:1},log:"深夜跟總部視訊說明狀況",res:[[null,"你講了影印機、櫃台、阿哲、對面的傳單。區經理在筆記本上寫了很久。"],[null,"「我會幫你爭取一台新的影印機。剩下的，我們下週再看。」"]]},
   {label:"只報數字，越短越好",min:6,fx:{calm:2,rep:-2},log:"跟總部視訊只報數字",res:[[null,"三分鐘就結束了。區經理說：「好，繼續加油。」畫面一黑，你看到自己的倒影。"]]},
   {label:"假裝網路不好",fx:{calm:5,rep:-6},set:{otDodge:1},log:"假裝網路斷線躲掉視訊",res:[[null,"你按掉視訊，傳了一句：「抱歉這邊網路很不穩，明天回電！」"],[null,"罪惡感大概維持了三秒鐘。"]]}]})},
 {id:"reprint",lines:["teacher","yun"],make:L=>({target:{spot:"copier"},goal:"明天的考卷還沒印",action:"去印",
  pages:G=>[[null,"你突然想起來：明天早上第一堂的小考卷還沒印。"],[null,"影印機發出「嗶——」的一聲。卡紙燈又亮了。"]],
  choices:G=>[
   {label:"把卡紙拉出來，印完再走",mini:"jam",min:8,fx:r=>byLine(G,{teacher:{hp:-4,stu:4},yun:{hp:-4,ord:6}}),log:"加班把明天的考卷印完",res:[[null,"最後一張考卷印出來時，機器是溫的。你把考卷疊好，壓上一本講義。"]]},
   {label:"明天早點來印",fx:G=>byLine(G,{teacher:{hp:3,stu:-2},yun:{hp:3,ord:-3}}),set:{otEarly:1},log:"考卷明早再印",res:[[null,"你在便利貼寫上：「明早 7:30 印考卷」，貼在影印機上。"]]}]})}
];
const OT_TIMES=["21:56","22:00"];
function otSteps(L){
  const pool=OT_EVENTS.filter(e=>e.lines.includes(L.id)&&!(L.day===2&&e.id==="meeting")).sort(()=>Math.random()-.5);
  const n=Math.random()<.5?1:2;
  return pool.slice(0,n).map((e,i)=>({...e.make(L.id),id:"ot_"+e.id,t:OT_TIMES[i],isEvent:true,ot:true}));
}
function otRestore(id,t,L){const e=OT_EVENTS.find(x=>"ot_"+x.id===id);return e?{...e.make(L.id),id,t,isEvent:true,ot:true}:null;}

/* ---------- 加班小遊戲 ---------- */
/* 巡樓：把還開著的關掉；自習室還有人，不能關 */
MINIS.lockup={
  head:"巡樓・關燈",zone:"整層樓",title:"關掉還開著的東西",cost:4,
  intro:"點一下就會關掉。全部巡完按「鎖門」。小心：自習室角落還有學生在念書，那盞燈不能關。",
  mount(el,done){
    const all=[["大廳燈","💡",1],["招牌燈","🪧",1],["B 班冷氣","❄️",1],["B 班投影機","📽️",1],["影印機","🖨️",1],["休息室熱水壺","♨️",1],["主任室電腦","🖥️",0],["走廊燈","💡",1],["A 班冷氣","❄️",0],["自習室角落的燈","📚",2],["飲水機","🚰",0],["櫃台電腦","🖥️",1]];
    const items=all.map(a=>({n:a[0],ic:a[1],k:a[2],on:a[2]>0||Math.random()<.3})).sort(()=>Math.random()-.5);
    let trap=false;
    el.innerHTML=`<div class="lock">${items.map((it,i)=>it.on?`<button class="lk on" data-n="${i}" aria-pressed="true"><span>${it.ic}</span>${it.n}</button>`:`<div class="lk off"><span>${it.ic}</span>${it.n}</div>`).join("")}</div>
      <p class="feed" aria-live="polite">亮著的是還開著的。</p><div class="actions"><button class="go" data-next>鎖門</button></div>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(b.disabled)return;const it=items[+b.dataset.n];b.disabled=true;it.on=false;b.classList.remove("on");b.setAttribute("aria-pressed","false");
      if(it.k===2){trap=true;feed.textContent="「欸——我還在！」角落有人喊了一聲。";}else feed.textContent=`${it.n}：關了。`;}));
    el.querySelector("[data-next]").addEventListener("click",function(){if(this.disabled)return;this.disabled=true;el.querySelectorAll("[data-n]").forEach(x=>x.disabled=true);
      const left=items.filter(it=>it.on&&it.k===1).length;
      feed.textContent=left?`鎖門了。還有 ${left} 樣忘了關。`:trap?"都關了，包括不該關的那盞。":"全部關好，自習室的燈也留著。完美。";done({left,trap});});
  }
};
/* 深夜群組：挑一句最得體的回覆 */
MINIS.reply={
  head:"家長群組・22:03",zone:"手機",title:"回覆群組訊息",cost:4,
  intro:"四則訊息，每則挑一句回。太晚、太冷淡、太熱情都可能出事。",
  msgs:[
   {who:"王媽媽",say:"老師請問明天小考範圍是？孩子說他忘記抄🙏",opts:["講義第 3 到第 5 頁，空間向量的內積。早點睡喔！","上課有講。","我明天再公佈。"],ok:0},
   {who:"陳爸爸",say:"請問下週三可以請假嗎？要回南部喝喜酒。",opts:["不行喔。","可以的，我幫他登記，補課時間再跟您約。","喜酒好啊！祝新人百年好合🎉🎉🎉"],ok:1},
   {who:"林媽媽",say:"阿哲說今天老師有問他問題，他很開心。",opts:["（已讀）","謝謝媽媽告訴我，他今天有試著回答，很棒。","他其實答錯了。"],ok:1},
   {who:"不認識的號碼",say:"請問你們有沒有國中部？收費多少？急！",opts:["您好，目前只有高中部。明天上班時間再幫您詳細說明。","有喔！馬上打給您！","沒有。"],ok:0}
  ],
  mount(el,done){let i=0,ok=0;const self=this;
    function draw(){const m=self.msgs[i];
      el.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.msgs.length} 則・${m.who}</div><div>${esc(m.say)}</div></div><div class="choices">${m.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o)}</button>`).join("")}</div><p class="feed" aria-live="polite"></p><div class="actions" hidden><button class="go" data-next>下一則</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(!act.hidden)return;const k=+b.dataset.k;
        if(k===m.ok){ok++;feed.textContent="送出。對方回了一個貼圖。";}else feed.textContent=["送出。……對方已讀，沒有回。","送出。三秒後收到：「？」","送出。群組安靜了好一陣子。"][k%3];
        el.querySelectorAll("[data-k]").forEach((x,j)=>{x.disabled=true;if(j===m.ok)x.style.borderColor="var(--green)";});act.hidden=false;
        act.querySelector("[data-next]").onclick=()=>{if(i<self.msgs.length-1){i++;draw();}else{el.innerHTML=`<p class="feed">四則回完了，回得得體的有 ${ok} 則。</p>`;done({ok});}};}));}
    draw();}
};
/* 陪品妤等家長：聊天，讓她放鬆一點 */
MINIS.wait={
  head:"門口・等家長",zone:"大門口",title:"陪品妤等",cost:6,
  intro:"品妤不太說話。挑一句話跟她聊，讓等待不那麼難熬。",
  rounds:[
   {say:"品妤一直看手機，又把手機收起來。",opts:[["「你媽媽常常開會開到這麼晚嗎？」",1],["「今天的錯題訂正了沒？」",-1],["（安靜地坐在她旁邊）",1]]},
   {say:"「……你們也會這麼晚下班喔？」",opts:[["「常常啊。你看，我們都是夜貓子。」",1],["「對啊，所以你考完學測就自由了。」",0],["「大人的事你不用管。」",-1]]},
   {say:"一台車慢下來，又開走了。不是她媽媽。",opts:[["「要不要吃餅乾？櫃台還有。」",1],["「她應該快到了吧。」",0],["「回家記得早點睡，不要又念到兩點。」",-1]]}
  ],
  mount(el,done){let r=0,mood=0;const self=this;
    function draw(){const R=self.rounds[r];
      el.innerHTML=`<div class="paper"><div class="q">${fmt(22*60+8+r*7)}</div>${esc(R.say)}</div><div class="choices">${R.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o[0])}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{mood+=R.opts[+b.dataset.k][1];r++;
        if(r<self.rounds.length)draw();else{el.innerHTML=`<p class="feed">${mood>=2?"品妤笑了一下，說：「其實我想念心理系。」":mood>=0?"品妤點點頭，繼續看著路口。":"品妤把耳機戴上了。"}</p>`;done({mood:mood+1});}}));}
    draw();}
};
