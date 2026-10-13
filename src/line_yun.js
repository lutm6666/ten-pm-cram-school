/* ================= 職業線：櫃台老師（小芸） ================= */
/* 13:30 到班。收費、接電話、轉達家長的話、廣播放學。17:30–18:00 最忙：
   電話、廣播、家長交代、繳費、國中生刷卡同時來。21:15 日結對帳才能下班。 */
LINES.yun={
 id:"yun",self:"yun",role:"櫃台老師",short:"櫃台",body:0x2fb39a,shift:"13:30–21:30",
 pick:"顧櫃台。收費、接電話、廣播、轉達每一位家長的話。補習班出事，第一個知道的人。",
 cast:["boss","cai","hr","teacher","ama","xiangma","parent","chenba","mom","zhangma"],
 stats:{hp:["體力",55],pat:["耐心",60],par:["家長",50],ord:["秩序",50]},hidden:{trial:50,missed:0,cleared:0,cash:0},
 late:{fx:{par:-4,ord:-3},text:"等你的人臉色不太好看。"},
 coda:"櫃台的電話明天還會響。你記得的是每個打來的人叫什麼名字。",
 msgs:[["13:44","何主任","下午有一位張媽媽會來問安親，麻煩先接待"],["16:12","鄭老師","小芸，九年級的便當今天訂 11 個喔"],["18:40","妹妹","今天幾點回家？毛線又把衛生紙抓爛了"],["20:48","許老師","林媽媽的電話謝謝你🙏"],["21:36","媽","菜幫你留在電鍋裡。"]],
 preStatus:"營業中",endAt:"21:30",daylight:true,
 staff:["lin","wu","amy","hong"],
 zoneText:{"大廳":"你的戰場。櫃台、刷卡機、沙發、鞋櫃，還有永遠在響的電話。","教材室":"影印機在這裡。卡紙的時候，大家第一個找的是你。","主任室":"門通常開著。主任講電話的聲音，櫃台聽得到一半。"},
 schedule:[["13:30","pre"],["17:00","leave"],["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]],
 phaseStatus:{pre:"營業中",class:"國中上課中",break:"國中下課",leave:"放學高峰",close:"日結中"},
 bells:{leave:["放學高峰","電話、廣播、繳費、刷卡，全部一起來。"],class:["國中上課了","大廳終於安靜下來。"],break:["國中下課","電話又開始響了。"]},
 events:["blackout","rain","roach"],
 eventSlots:[{after:"y_consult",t:"15:00",phase:"pre"},{after:"y_trial",t:"18:30",phase:"class"},{after:"y_mom",t:"20:15",phase:"class"}],
 chats:["boss","cai","hr","teacher","hong","ama","zhangma","xiangma","chenba","parent"],
 start:[FLX(0,4.5),16.6],dead:G=>G.s.hp<=0||G.s.pat<=0,
 me:G=>({name:"你",title:`${G.pName}・櫃台`,abbr:"櫃",color:"#1f9c86"}),
 npcs:{yun:null,boss:PC.bossDesk,hr:null,teacher:null,cai:AT("g2podium",0,0,0),lin:PC.lin,wu:PC.wu,amy:null,hong:null,ama:null,xiangma:null,parent:null,trial:null,chenba:null,bo:null,zhangma:null,deliv:null},
 steps:[
  {id:"y_arrive",chapter:{t:"13:30",title:"到班",sub:"螢幕邊框上，昨天的便利貼還在。",status:"營業中",rush:["六張便利貼，今天先處理三張。","下午會有家長來問安親。"]},
   t:"13:30",target:{spot:"counterIn"},goal:"坐進櫃台，看昨天的便利貼",action:"看便利貼",
   pages:G=>[[null,"櫃台螢幕邊框貼著六張便利貼。最上面那張是你自己的字：「記得吃晚餐」。"],[null,"電話還沒響，影印機還沒卡，安親的小朋友還沒回來。這是今天唯一安靜的半小時。"]],
   choices:G=>[
    {label:"挑最急的三件先處理",mini:"summary",fx:r=>({ord:r.v>=7?10:r.v>=4?4:-4,pat:-2,cleared:r.v>=7?1:0}),log:r=>`挑三件事先做（${r.v>=7?"挑得很準":r.v>=4?"還可以":"挑錯了"}）`,
     res:r=>r.v>=7?[[null,"三張便利貼撕下來，揉成一團。剩下的三張，晚一點也沒關係。"]]:[[null,"你處理完三件，才發現最急的那件還貼在螢幕上。"]]},
    {label:"從最上面一張開始，照順序來",fx:{pat:-5,ord:2},log:"便利貼照順序處理",res:[[null,"第一張是「冷氣遙控器：阿宏要」。這件事花了你十分鐘。"]]}]},
  {id:"y_call",t:"14:05",target:{spot:"counterIn"},goal:"電話響了",action:"接電話",
   pages:G=>[[null,"「你好，我想問國小美語。我女兒三年級，你們有分班測驗嗎？」"],[null,"美語的 Amy 老師四點半才到。"]],
   choices:G=>[
    {label:"約週六上午來做分班測驗",fx:{par:5,ord:3},log:"幫新生約美語分班測驗",res:[[null,"你在行事曆寫下：週六 10:00，三年級，分班測驗。"]]},
    {label:"「請您晚上再打來，美語老師在。」",fx:{pat:2,par:-3,missed:1},log:"請美語家長晚上再打",res:[[null,"對方說：「喔……好。」你知道她今晚不會再打來了。"]]}]},
  {id:"y_consult",t:"14:30",target:{npc:"zhangma"},goal:"張媽媽來問二年級安親",npc:{zhangma:PC.zhangLobby},after:{zhangma:PC.zhangConsult},
   pages:G=>[["zhangma","你好，我想問一下二年級的安親……我兒子在對面國小。"],[null,"她手上拿著對面補習班的傳單，摺得很整齊。"]],
   choices:G=>[
    {label:"請她到諮詢室，叫二年級的蔡老師下來說明",fx:{par:6,hp:-2},set:{callCai:1},log:"請安親老師下樓說明",res:[[null,"你打電話上二樓。蔡老師說：「我馬上下去。」"],["zhangma","有老師親自說明，真好。"]]},
    {label:"自己說明安親時間和學費",fx:{par:2,ord:3},log:"自己說明安親",res:[["zhangma","學費我了解了……那老師會幫忙看應用題嗎？"],[null,"這題你答不出來。"]]},
    {label:"請主任出來談",fx:{pat:-3,par:3},log:"請主任接待",res:[[null,"主任在講總部的電話，讓張媽媽在沙發等了十分鐘。"]]}]},
  {id:"y_watch",chapter:{t:"15:20",title:"安親老師去接人了",sub:"二樓空了，大廳只剩你。",status:"營業中"},
   t:"15:30",target:{npc:"deliv"},goal:"門口有人送東西來",npc:{deliv:AT("door",0,-.6)},after:{deliv:null},
   pages:G=>[["deliv","你好，點心！三十個布丁，已經付款了。"],[null,"櫃台電話同時響了。是阿翔媽媽：「我今天五點半接小宇，可以嗎？」"]],
   choices:G=>[
    {label:"先簽收，再回電話",fx:{ord:3,par:-2},log:"先簽收點心",res:[[null,"布丁收進冰箱。電話那頭已經掛了。你在便利貼寫：「阿翔媽媽 17:30」。"]]},
    {label:"夾著電話簽收",fx:{pat:-4,par:3,hp:-2},log:"邊講電話邊簽收",res:[[null,"脖子很痛。但兩件事都處理好了。"]]}]},
  {id:"y_remind",t:"16:30",target:{npc:"boss"},goal:"主任叫你",npc:{boss:AT("counter",.6,1.2,Math.PI)},after:{boss:PC.bossDesk},
   pages:G=>[["boss","小芸，上週請假的三個國中生，補課還沒排。今天能打完嗎？"],["boss","還有，今晚九年級有一位試聽，媽媽姓王，五點五十到。"]],
   choices:G=>[
    {label:"現在就打",fx:{hp:-6,par:6,cleared:1},log:"下午打完補課電話",res:[[null,"三通打完。一個約週六、一個要看錄影、一個說「段考完再說」。"]]},
    {label:"「放學高峰前打不完，晚上再打。」",fx:{pat:3,missed:1},log:"補課電話延到晚上",res:[["boss","好，那晚上記得。"]]}]},
  {id:"y_rush",chapter:{t:"17:00",title:"放學高峰",sub:"電話、廣播、家長交代、繳費、刷卡，一起來。",status:"放學高峰"},
   t:"17:25",target:{spot:"counterIn"},goal:"櫃台前排了三個家長",action:"開始處理",npc:{xiangma:PC.xiangmaLobby},
   pages:G=>[[null,"刷卡機嗶個不停，國中生陸續到班。三個家長站在櫃台前，電話在響，二樓還在等你廣播。"],[null,"你只有一雙手。"]],
   choices:G=>[
    {label:"一件一件處理",mini:"rush",fx:r=>({par:r.ok*2-5,ord:r.ok>=5?6:r.ok>=3?2:-4,pat:-6,missed:r.drop}),log:r=>`放學高峰處理好 ${r.ok} 件，漏掉 ${r.drop} 件`,
     res:r=>r.ok>=5?[[null,"十八點整，大廳空了一半。你喝了今天第一口水。"]]:[[null,"有幾件沒顧到。便利貼又多了兩張。"]]},
    {label:"請主任出來幫忙",fx:{pat:-2,par:3,ord:2},log:"請主任支援放學高峰",res:[[null,"主任出來接了兩通電話。家長看到主任，語氣都客氣了一點。"]]}]},
  {id:"y_pay",t:"17:46",target:{npc:"ama"},goal:"李阿嬤來繳安安的學費",npc:{ama:PC.amaLobby},after:{ama:null},
   pages:G=>[["ama","小姐，我來繳安安這個月的錢。"],[null,"她從布包裡拿出一個信封，裡面是一疊折得整整齊齊的千元鈔。"],["ama","收據要寫她媽媽的名字喔，她公司有子女教育補助。"]],
   choices:G=>[
    {label:"算錢、找零、開收據",mini:"change",fx:r=>({par:r.right&&r.exact?8:r.right?3:-8,ord:r.right?4:-4,cash:r.right?0:-600}),log:r=>r.right?`幫李阿嬤繳費，找零 ${r.bills} 張／個`:"繳費金額算錯了",
     res:r=>{G.f.paid=r.right?1:0;return r.right?[["ama","小姐你算得好快。"],[null,"收據上寫著安安媽媽的名字。阿嬤把收據折好，放進信封。"]]:[[null,"阿嬤開心地走了。你沒發現抽屜裡的錢少了一點。"]];}},
    {label:"請阿嬤先坐，等一下再算",fx:{par:-4,pat:2},log:"請阿嬤等一下再繳費",res:[[null,"阿嬤坐在沙發上等了二十分鐘。她說沒關係，但她看了四次時鐘。"]]}]},
  {id:"y_trial",t:"17:52",target:{npc:"parent"},goal:"試聽家長到了",npc:{parent:AT("door",0,-.8),trial:AT("door",.7,-.6)},after:{trial:[...SEAT("c9","trial"),DOOR],parent:AT("sofa",0,.2,Math.PI)},
   pages:G=>[["parent","你好，我們是來[[試聽]]的，我姓王。"],["parent","想先問一下學費……對面那間說，現在報名打八折耶。"],["trial","（小聲）媽……"]],
   choices:G=>[
    {label:"說明試聽流程，學費請主任說明",note:"折扣是主任的事",fx:{par:5,trial:2},log:"說明試聽流程",res:[["me","同學請到三樓九年級，家長可以在這邊沙發等。下課的時候主任會跟您談。"],["parent","好，那我在這等。"]]},
    {label:"偷偷給她早鳥價",note:"先把人留住",fx:{trial:12,par:5},set:{discount:1},log:"私下答應早鳥價",res:[["me","（壓低聲音）今天試聽完報名，我幫您算[[早鳥優惠]]。"],["parent","真的嗎？"],[null,"你想起主任說過，折扣只能在說明會用。"]]},
    {label:"倒杯茶，帶她看榜單和教室",fx:{pat:-3,trial:6,par:4},log:"帶試聽家長看環境",res:[[null,"王媽媽在榜單前站了很久。「建中兩個啊……」"]]}]},
  {id:"y_mom",chapter:{t:"19:25",title:"國中下課",sub:"下課鐘一響，櫃台電話也響了。",status:"國中下課"},
   t:"19:26",target:{spot:"counterIn"},goal:"林媽媽打來找許老師",action:"接電話",
   pages:G=>[["mom","小芸，許老師下課了沒？我要跟他講話。"],["mom","阿哲說他不想補了。我們繳了一整年的錢耶。"],[null,"許老師在三樓。下課只有十分鐘。"]],
   choices:G=>[
    {label:"自己先安撫，約明天下午的時間",mini:"calm",fx:r=>({pat:-10,par:r.anger<=20?10:r.anger<=45?5:-5,cleared:1}),log:r=>`先安撫林媽媽（怒氣 ${r.anger}），約隔天談`,res:r=>[["me","林媽媽，主任明天下午有空，我幫您約三點好嗎？"],["mom",r.anger<=45?"……好吧。三點喔。":"三點！不要再放我鴿子！"]]},
    {label:"轉上三樓給許老師",fx:{par:8},set:{teacherNoBreak:1},log:"把林媽媽轉給許老師",res:[[null,"許老師的下課十分鐘，全部在講電話。"]]},
    {label:"「老師在忙，下課後回您。」",fx:{par:-8,missed:1},log:"跟林媽媽說老師在忙",res:[["mom","每次都在忙！"],[null,"電話被掛斷了。"]]}]},
  {id:"y_bo",chapter:{t:"21:00",title:"國中放學",sub:"家長在樓下等，國中生搶電梯。",status:"放學"},
   t:"21:02",target:{npc:"chenba"},goal:"陳爸爸來接小柏",npc:{chenba:AT("counter",.9,.8)},
   pages:G=>[["chenba","你好，我來接小柏。八年級的，他在樓上嗎？"],[null,"刷卡紀錄：小柏 19:27 刷卡離班。之後沒有再刷進來。"],[null,"陳爸爸的手機撥了兩次，沒有人接。"]],
   choices:G=>{const c=[
    {label:"打給小柏",fx:{par:5},log:"打電話找小柏",res:[[null,"第三通，小柏接了：「我在 7-11 啦……」"],[null,"五分鐘後，他捧著一碗關東煮走進門。"]]},
    {label:"「下課時間他刷卡出去，系統有傳通知給您喔。」",fx:{par:-6,ord:4},log:"跟陳爸爸說刷卡通知",res:[["chenba","……我在工地，沒看手機。"],[null,"他的語氣變了。不是生氣，是累。"]]}];
    if(K.has("boSeven"))c.unshift({label:"直接去 7-11 找他",note:ECHO,fx:{hp:-3,par:10,ord:3},log:"去 7-11 找回小柏",res:[[null,"你在 7-11 找到小柏，他正在挑關東煮。"],["chenba","你怎麼知道他在這？謝謝你。"]]});
    return c;}},
  {id:"y_enroll",t:"21:06",target:{npc:"parent"},goal:"王媽媽要做決定",npc:{parent:AT("counter",-.9,.8),trial:AT("counter",-.2,1.2),bo:null,chenba:null},
   pages:G=>{const n=enrolledT(G),l=[];
     l.push(["parent",n?"他說聽得懂。我們想報名。":"我們回去再討論看看。對面也約了週四試聽。"]);
     if(G.f.discount)l.push(["parent","早鳥價還算數吧？"]);return l;},
   choices:G=>{const n=enrolledT(G),c=[];
    if(n)c.push({label:"拿報名表和收據",fx:{par:5,cash:0},set:{enrolled:1},log:"試聽生報名",res:[[null,"王媽媽填好報名表。試聽生在旁邊偷偷鬆了一口氣。"]]});
    else c.push({label:"約下週再試聽一次",fx:{trial:10,par:3},set:{retry:1},log:"約試聽生再來一次",res:[["parent","好啊，那就明天同一個時間。"],[null,"你在行事曆上寫：王，試聽第二次。"]]});
    c.push({label:"說名額快滿了",note:"推一把",fx:G=>G.h.trial>=55?{trial:5,par:-3}:{trial:-10,par:-5},set:{pushed:1},log:"跟家長說名額快滿",res:G=>G.h.trial>=55?[["parent","那……我們先報名吧。"]]:[["parent","（皺眉）我們不喜歡被催。"]]});
    return c;}},
  {id:"y_close",chapter:{t:"21:15",title:"日結",sub:"現金、收據、刷卡紀錄。對得起來才能下班。",status:"日結中"},
   t:"21:15",target:{spot:"counterIn"},goal:"日結對帳",action:"打開抽屜",npc:{parent:null,trial:null},
   pages:G=>[[null,"抽屜裡是今天收的現金，收據本上是今天開的收據。兩邊要一樣。"],[null,`櫃台的待辦便利貼還有 ${Math.max(0,G.h.missed-G.h.cleared+2)} 張。`]],
   choices:G=>[
    {label:"一筆一筆對",mini:"ledger",fx:r=>({ord:r.ok?8:-4,hp:-4}),log:r=>r.ok?"日結對得起來":`日結差了 ${r.diff} 元`,res:r=>r.ok?[[null,"一塊錢都不差。你把現金放進保險箱。"]]:[[null,`差了 ${r.diff} 元。你把今天的收據又翻了一次。`]]},
    {label:"先放保險箱，明天再對",fx:{hp:4,ord:-6},log:"日結延到明天",res:[[null,"你關掉招牌燈。大廳只剩飲水機的小紅燈。"]]}]}
 ],
 ending(G){
  const s=G.s,h=G.h,dead=s.hp<=0||s.pat<=0,un=Math.max(0,Math.round(h.missed-h.cleared+2));
  let t;
  if(dead)t=s.pat<=0?["今天到此為止","你在第五通抱怨電話之後，請主任接手櫃台，躲進茶水間深呼吸。"]:["累到坐在地上","你蹲在影印機旁邊，覺得自己也卡紙了。"];
  else if(s.par>=70&&s.ord>=65)t=["櫃台的定海神針","電話有人接、廣播有人喊、錢有人對。這間補習班少了你會亂掉。"];
  else if(s.par>=75)t=["家長最愛的櫃台","每個家長都記得你的名字。只是你的待辦便利貼也越來越長。"];
  else if(un>=5)t=["電話響不停","今天有太多電話沒有回。明天一進門，電話會先響。"];
  else if(s.pat<30)t=["大家的救火隊","整天都在救火。火是撲滅了，你也快燒完了。"];
  else t=["平安關門","沒有大好也沒有大壞。櫃台的大部分晚上就是這樣過的。"];
  return {title:t[0],desc:t[1],dead,big:[[G.f.enrolled?"報名":"考慮中","試聽生"],[`${un} 通`,"明天要回的電話"]]};
 }
};

/* ---------- 櫃台的小遊戲 ---------- */
MINIS.change={
  head:"櫃台・繳費",zone:"櫃台",title:"算錢、找零、開收據",cost:5,
  intro:"先算出這個月要收多少，再從抽屜裡拿零錢找給阿嬤。",
  bill:[["十月安親費",6800],["點心費",600],["評量費",350]],paid:10000,
  mount(el,done){const self=this,total=this.bill.reduce((a,b)=>a+b[1],0),opts=[total,total-600,total+600].sort(()=>Math.random()-.5);let right=false,stage=1;
    el.innerHTML=`<div class="paper"><div class="q">安安・十月</div>${this.bill.map(b=>`<div style="display:flex;justify-content:space-between"><span>${b[0]}</span><b style="font-family:var(--mono)">${b[1].toLocaleString()}</b></div>`).join("")}<div style="margin-top:6px">阿嬤給了 <b style="font-family:var(--mono)">${this.paid.toLocaleString()}</b> 元</div></div>
      <div id="chStage"><div class="lbl">應收多少？</div><div class="choices">${opts.map(v=>`<button class="choice" data-k="${v}">${v.toLocaleString()} 元</button>`).join("")}</div></div><p class="feed" aria-live="polite"></p>`;
    const feed=el.querySelector(".feed"),box=el.querySelector("#chStage");
    box.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(stage!==1)return;stage=2;right=+b.dataset.k===total;
      feed.textContent=right?"對，應收 "+total.toLocaleString()+" 元。":"再算一次……應收是 "+total.toLocaleString()+" 元。";
      let left=self.paid-total;const used=[],den=[1000,500,100,50,10,5,1];
      box.innerHTML=`<div class="lbl">要找 <b id="chLeft" style="font-family:var(--mono)">${left}</b> 元。點抽屜裡的錢。</div><div class="choices" style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${den.map(d=>`<button class="choice" data-n="${d}" style="text-align:center">${d>=100?"💵":"🪙"} ${d}</button>`).join("")}</div><div class="lbl">已拿：<span id="chUsed">—</span></div><div class="actions" hidden><button class="go" data-next>開收據</button></div>`;
      const sync=()=>{box.querySelectorAll("[data-n]").forEach(x=>x.disabled=+x.dataset.n>left);box.querySelector("#chLeft").textContent=left;box.querySelector("#chUsed").textContent=used.length?used.join("＋"):"—";box.querySelector(".actions").hidden=left!==0;};
      box.querySelectorAll("[data-n]").forEach(x=>x.addEventListener("click",()=>{const d=+x.dataset.n;if(d>left)return;left-=d;used.push(d);sync();}));
      box.querySelector("[data-next]").addEventListener("click",function(){if(this.disabled)return;this.disabled=true;
        let rem=self.paid-total,opt=0;den.forEach(d=>{while(rem>=d){rem-=d;opt++;}});const exact=used.length<=opt;
        feed.textContent=`找了 ${used.length} 張／個${exact?"，剛剛好。":"。其實可以用更少張。"}收據上寫：安安媽媽。`;done({right,bills:used.length,exact});});
      sync();}));}
};
/* 日結：收據和現金逐筆對，找出差在哪 */
MINIS.ledger={
  head:"櫃台・日結",zone:"櫃台",title:"現金和收據對不起來？",cost:5,
  intro:"今天開了四張收據。點出跟抽屜現金對不起來的那一筆；都對就按「都對」。",
  mount(el,done){const short=G&&G.h&&G.h.cash<0;
    const rows=[["安安（李阿嬤）",7750,short?7150:7750],["補課講義費・九年級",300,300],["美語分班測驗報名",500,500],["國中便當代墊回收",170,170]];
    el.innerHTML=`<div class="paper">${rows.map((r,i)=>`<button class="stepl" data-i="${i}" style="display:flex;justify-content:space-between;width:100%"><span>${r[0]}</span><span style="font-family:var(--mono)">收據 ${r[1]}｜抽屜 ${r[2]}</span></button>`).join("")}</div><div class="actions"><button class="go" data-ok>都對</button></div><p class="feed" aria-live="polite"></p>`;
    const feed=el.querySelector(".feed");let doneOnce=false;const finish=(pick)=>{if(doneOnce)return;doneOnce=true;const bad=rows.findIndex(r=>r[1]!==r[2]),diff=bad<0?0:rows[bad][1]-rows[bad][2];
      const ok=pick===bad;feed.textContent=bad<0?(pick<0?"都對。今天可以準時下班。":"這一筆其實沒問題。"):ok?`找到了：${rows[bad][0]}，少了 ${diff} 元。是下午算錯的那一筆。`:`不是這一筆。差的是：${rows[bad][0]}，少了 ${diff} 元。`;
      done({ok:bad<0?pick<0:ok,diff});};
    el.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>finish(+b.dataset.i)));el.querySelector("[data-ok]").addEventListener("click",()=>finish(-1));}
};
/* 放學高峰（暫時版）：一次只能做一件，選先處理哪一件 */
MINIS.rush={
  head:"櫃台・放學高峰",zone:"大廳",title:"先處理哪一件？",cost:6,
  intro:"每一輪有好幾件事同時發生，你只能先做一件。沒做的會留到下一輪，等太久就會出事。",
  mount(el,done){const all=[
     {k:"call",t:"電話：「我是子晴媽媽，今天會晚到喔」",w:2},
     {k:"bc1",t:"廣播：二年級小宇，媽媽來接",w:3},
     {k:"pay",t:"家長要繳美語學費",w:1},
     {k:"msg",t:"安安阿嬤：「明天中午我會晚十分鐘」",w:2},
     {k:"card",t:"國中生：「我卡片忘了帶，可以先進去嗎？」",w:2},
     {k:"bc2",t:"廣播：一年級妞妞，爸爸來接",w:3},
     {k:"call2",t:"電話：「請問今天有上課嗎？」",w:1}];
    let queue=all.slice(0,3),next=3,ok=0,drop=0,round=0;const self=this;
    function draw(){if(!queue.length&&next>=all.length){el.innerHTML=`<p class="feed">高峰過了。處理好 ${ok} 件，漏掉 ${drop} 件。</p>`;done({ok,drop});return;}
      el.innerHTML=`<div class="q">第 ${round+1} 輪・同時有 ${queue.length} 件事</div><div class="choices">${queue.map((q,i)=>`<button class="choice" data-k="${i}">${esc(q.t)}${q.age?`<small>（已經等了 ${q.age} 輪）</small>`:""}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.k;queue.splice(i,1);ok++;round++;
        queue.forEach(q=>q.age=(q.age||0)+1);const late=queue.filter(q=>q.age>=q.w);drop+=late.length;queue=queue.filter(q=>q.age<q.w);
        if(next<all.length)queue.push(all[next++]);if(next<all.length&&round%2===0)queue.push(all[next++]);draw();}));}
    draw();}
};
