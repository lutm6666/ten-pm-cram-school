/* ================= 職業線：補習班主任（何主任） ================= */
/* 13:00 到班。整體行政、熟悉每個老師在做什麼、第一線面對家長、設備維修與採購、人手調度。 */
LINES.boss={
 id:"boss",self:"boss",role:"補習班主任",short:"主任",body:0x2f3a4a,shift:"13:00–21:30",
 pick:"顧整間補習班。招生、續班、家長、老師、影印機、冷氣、總部的週報。出事了，最後一個扛的人。",
 cast:["yun","cai","hr","teacher","lin","zhangma","parent","mom","xiangma"],
 stats:{calm:["冷靜",60],sales:["業績",50],rep:["口碑",50],morale:["士氣",50]},hidden:{trial:50,ret:74},
 late:{fx:{calm:-4,rep:-2},text:"大家等主任等到有點尷尬。"},
 coda:"週報上的數字是你的責任，數字後面的人也是。",
 msgs:[["13:10","總部","各分校週報請於今晚十點前上傳。"],["15:45","粉專通知","對面補習班：會考衝刺班 8 折最後三天！"],["19:20","小芸","主任，等一下第二節開始後，可以跟你講一件事嗎？"],["20:18","老婆","女兒說要等你回家才睡。"]],
 preStatus:"營業中",endAt:"21:30",daylight:true,dead:G=>G.s.calm<=0,
 staff:["lin","wu","amy","hong","cai"],
 busy:[["13:00","17:35",null,"主任的下午","回總部的信、看續班名單、打給還在考慮的家長。",15],["17:55","21:12",null,"巡班","在三層樓之間走一圈：看課、聽電話、跟老師講兩句。",15]],
 zoneText:{"主任室":"你的辦公室。續班名單、總部的信、一台不太好用的筆電。","四年級安親教室":"冷氣在漏水。小朋友四點就回來了。","九年級教室":"今晚的試聽在這裡。你只能從門上的小窗看。"},
 schedule:[["13:00","pre"],["17:00","leave"],["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]],
 phaseStatus:{pre:"營業中",class:"國中上課中",break:"國中下課",leave:"放學中",close:"收拾中"},
 events:["quake","blackout","rain","roach"],
 eventSlots:[{after:"b_ac",t:"15:40",phase:"pre"},{after:"b_patrol",t:"19:00",phase:"class"},{after:"b_hr",t:"20:40",phase:"class"}],
 chats:["yun","cai","hr","teacher","lin","wu","amy","hong","parent","zhangma","xiangma"],
 start:[FLX(0,4.5),16.6],
 me:G=>({name:"你",title:`${G.pName}・補習班主任`,abbr:"主",color:"#c2457f"}),
 npcs:{boss:null,yun:null,hr:null,teacher:null,cai:AT("g4podium",0,0,0),lin:PC.lin,wu:PC.wu,amy:null,hong:null,zhangma:null,parent:null,trial:null,xiangma:null},
 steps:[
  {id:"b_arrive",chapter:{t:"13:00",title:"到班",sub:"總部的週報，今晚十點前要交。",status:"營業中",rush:["本期續班率 74%，總部的目標是 85%。","影印機昨天又卡了三次。"]},
   t:"13:00",target:{spot:"bossdesk"},goal:"打開總部的信",action:"看信",
   pages:G=>[[null,"信件匣最上面：「各分校本季請控制支出。另，續班率未達 85% 之分校，下季將進行輔導。」"],[null,"桌上是這個月的支出單：影印機維修 3 次、安親冷氣保養、九年級便當代墊。"]],
   choices:G=>[
    {label:"先排今天要打的續班電話",mini:"renew",fx:r=>({sales:r.v*2-4,calm:-4,ret:r.v>=7?6:r.v>=4?3:0}),log:r=>`打續班電話，效果 ${r.v>=7?"很好":r.v>=4?"還可以":"不太好"}`,
     res:r=>r.v>=7?[[null,"三通都打在點上。你在名單上打了兩個勾。"]]:r.v>=4?[[null,"有一通有用。剩下的，下週再說。"]]:[[null,"打了三通，好像都不是最需要打的那三個。"]]},
    {label:"先把支出單整理好",fx:{calm:4,morale:-2},log:"先整理支出",res:[[null,"影印機維修費，三次加起來，差不多可以買半台新的。"]]}]},
  {id:"b_copier",t:"13:50",target:{spot:"copier"},goal:"教材室傳來「嗶——」",action:"過去看",npc:{hr:AT("copier",.9,.3,Math.PI/2),cai:AT("copier",-.9,.5,-Math.PI/2)},after:{hr:PC.hrDesk,cai:AT("g4podium",0,0,0)},
   pages:G=>[[null,"影印機前站著兩個人：九年級的鄭老師，和四年級的蔡老師。卡紙燈在閃。"],["hr","主任，我段考複習卷還有一百多張……"],["cai","我只有十張：練習卷、解答和講義，下午三點二十前要印好。"]],
   choices:G=>[
    {label:"當場下訂新的影印機",fx:{sales:-10,morale:12},set:{newCopier:1},log:"下訂新影印機",res:[["cai","真的嗎？！"],[null,"鄭老師在影印機上貼了一張便利貼：「阿卡，謝謝你這八年。」"],[null,"總部那邊，你要想怎麼寫。"]]},
    {label:"捲起袖子自己拉",mini:"jam",fx:r=>({calm:r.tears?-6:-2,morale:5}),log:r=>r.tears?`主任修影印機，撕破 ${r.tears} 次`:"主任親手修好影印機",res:r=>r.tears?[[null,"紙拉出來了，袖子黑了。"]]:[[null,"四張紙完整拉出來。兩個老師在旁邊拍手。"]]},
    {label:"「安親的先印，國中的分兩批。」",fx:{calm:2,morale:3},set:{splitCopy:1},log:"排定影印機的順序",res:[[null,"安親的練習卷先印好。鄭老師的考卷分兩批，第二批四點前印完。"]]}]},
  {id:"b_consult",t:"14:45",target:{npc:"zhangma"},goal:"諮詢室：張媽媽在等你談學費",npc:{zhangma:PC.zhangConsult},after:{zhangma:null},
   pages:G=>[["zhangma","剛剛蔡老師說得很清楚。學費小芸也跟我說了……可是對面比較便宜耶。"],[null,"她手上的對面傳單寫著：「安親月費 6,200，報名送書包」。你們是 6,800。"]],
   choices:G=>[
    {label:"「先試讀一週，不收費。」",fx:{sales:-2,rep:6},set:{trialWeek:1},log:"讓張媽媽先免費試讀一週",res:[["zhangma","不用錢嗎？那下週一我帶他來。"]]},
    {label:"給她早鳥折扣，對齊對面",fx:{sales:4,rep:-3},set:{carePrice:1},log:"安親給早鳥折扣",res:[["zhangma","這樣啊……好，我回去跟他爸說。"],[null,"你知道，下個月全部的家長都會來問同樣的折扣。"]]},
    {label:"照價，說明差別在哪裡",fx:{sales:2,rep:3,calm:-3},log:"照價說明安親內容",res:[["me","我們四年級一個老師顧八個，對面一個顧十五個。"],["zhangma","……我再想想。"]]}]},
  {id:"b_ac",t:"15:05",target:{spot:"g4door"},goal:"二樓：安親教室冷氣在漏水",action:"上樓看",
   pages:G=>[[null,"四年級教室的冷氣滴水，地上放了一個水桶。小朋友三點五十就回來了。"],["cai","主任，上個月保養過，可是又漏了……"]],
   choices:G=>[
    {label:"叫廠商今天來修",fx:{sales:-4,morale:4,calm:-2},set:{acFix:1},log:"叫冷氣廠商今天來修",res:[[null,"廠商說五點到。正好是放學高峰。"]]},
    {label:"水桶先頂著，週末再修",fx:{calm:3,morale:-4},log:"冷氣週末再修",res:[[null,"你又放了一個水桶。小朋友會覺得很好玩，家長不會。"]]},
    {label:"先把四年級搬到閱讀角",fx:{morale:2,rep:2,calm:-3},log:"四年級先搬到閱讀角",res:[["cai","閱讀角沒有桌子……好吧，地墊也可以寫。"]]}]},
  {id:"b_staff",t:"16:10",target:{npc:"lin"},goal:"五年級的林老師找你",npc:{lin:AT("g5door",0,.6,Math.PI/2)},after:{lin:PC.lin},
   pages:G=>[["lin","主任，明天週三三個年級都半天。五年級十個、四年級八個、六年級十二個，三個隊伍同一時間過馬路。"],["lin","上禮拜三，小米差點跟錯隊伍。"]],
   choices:G=>[
    {label:"「明天中午我跟你們一起去接。」",fx:{calm:-5,morale:10,rep:3},set:{bossPickup:1},log:"答應週三一起去接小朋友",res:[["lin","主任要去？……好，你負責六年級的隊伍尾巴。"]]},
    {label:"請小芸週三提早來支援",fx:{morale:-3,calm:2},set:{yunEarly:1},log:"請櫃台週三提早支援",res:[["lin","小芸會願意嗎？她已經……算了，我問她。"]]},
    {label:"「下個月再找一個兼職。」",fx:{sales:-3,morale:4},log:"答應下個月加安親人手",res:[["lin","那明天呢？"],[null,"你沒有回答。"]]}]},
  {id:"b_tour",t:"16:30",target:{spot:"g4door"},goal:"國小家長想先看看安親教室",action:"帶家長上樓",
   pages:G=>[[null,"一位五年級的家長下班順路過來，想看看安親班平常的樣子。"],[null,"二樓正在寫作業，四年級教室很安靜，五年級有人在問數學。"]],
   choices:G=>[
    {label:"帶她從門口看，不打擾上課",fx:{rep:5,calm:-2},log:"帶家長參觀安親教室",res:[[null,"她在門口站了三分鐘，看林老師蹲在一個小朋友旁邊講題目。下樓的時候，她拿了一份簡章。"]]},
    {label:"在大廳看照片和簡章就好",fx:{calm:3,sales:-1},log:"請參觀家長在大廳看簡章",res:[[null,"你翻著粉專的照片給她看。她說：「好，我回去想想。」"]]}]},
  {id:"b_complaint",chapter:{t:"17:00",title:"放學高峰",sub:"大廳擠滿了家長。櫃台只有一個人。",status:"放學中"},
   t:"17:35",target:{npc:"xiangma"},goal:"一位家長在大廳提高聲音",npc:{xiangma:PC.xiangmaLobby},after:{xiangma:null},
   pages:G=>[["xiangma","主任，我小兒子的數習，昨天老師說檢查過，結果三題都錯。"],["xiangma","還有我大兒子，九年級的阿翔……他傳訊息說今天會晚到，我打給他都不接。"],[null,"她一手牽著小宇，手機一直在震。"]],
   choices:G=>[
    {label:"請她到諮詢室坐下，一件一件說",fx:{calm:-4,rep:8},set:{xiangmaTalk:1},log:"請阿翔媽媽到諮詢室談",res:[[null,"你倒了一杯水。她說到阿翔的時候，聲音小了下來：「他最近都去網咖。」"]]},
    {label:"「我請兩位老師直接跟您說明。」",fx:{rep:3,morale:-3},log:"請老師跟家長說明",res:[[null,"你打給二樓和三樓。兩位老師都在忙，都說「馬上下去」。"]]},
    {label:"「作業檢查是安親老師的事，我會轉達。」",fx:{rep:-6,calm:3},log:"把客訴轉給安親老師",res:[["xiangma","……好。"],[null,"她走的時候沒有說再見。"]]}]},
  {id:"b_trial",t:"17:55",target:{npc:"parent"},goal:"試聽家長要先離開",npc:{parent:AT("sofa",0,.2,Math.PI)},after:{parent:null},
   pages:G=>[["parent","主任您好，我姓王。我兒子九年級，在對面國中，今天來試聽數學。我先去吃個飯，下課再回來。"],["parent","走之前想先知道，你們的老師有什麼特別的？"]],
   choices:G=>[
    {label:"指著榜單牆",note:"數字最有說服力",fx:{trial:6},log:"用榜單介紹補習班",res:[["me","去年建中兩個、北一女一個、5A++ 四個。"],["parent","嗯。對面說他們建中三個。"]]},
    {label:"帶她看教室和課輔室",note:"花點時間",fx:{calm:-5,trial:12,rep:3},log:"帶試聽家長參觀",res:[[null,"你帶她搭電梯上三樓，從門上的小窗看了一眼九年級。課輔室裡阿宏在幫八年級講題。"],["parent","晚上還有人可以問問題，這個不錯。"]]},
    {label:"直接給早鳥折扣",fx:{trial:14,sales:-8,rep:-3},set:{discount:1},log:"直接給試聽家長折扣",res:[["parent","這樣啊……那我們先聽聽看。"]]}]},
  {id:"b_patrol",chapter:{t:"18:00",title:"巡堂",sub:"國中上課了。",status:"國中上課中"},
   t:"18:40",target:{spot:"c9door"},goal:"上三樓巡堂",action:"從門上的小窗看",
   npc:{teacher:PJ.teacherPodium,zhe:SEAT("c9","zhe"),trial:SEAT("c9","trial"),hr:PJ.back,xiang:SEAT("c9","xiang"),pinyu:SEAT("c9","pinyu"),qing:SEAT("c9","qing")},after:{hr:PJ.hrDesk},
   pages:G=>[[null,"從門上的小窗看進去：許老師在白板上畫了一大一小兩個三角形。試聽生坐在第三排，在抄。"],[null,"阿哲趴在桌上。後面的鄭老師在幫他撿掉在地上的講義。"]],
   choices:G=>[
    {label:"拍一張上課照發粉專",note:"招生素材",fx:{sales:5,rep:-5},set:{photo:1},log:"拍上課照發粉專",res:[[null,"照片很好看。半小時後，家長群組有人問：「照片有拍到我小孩耶，有經過同意嗎？」"]]},
    {label:"記下來，下課跟班導談阿哲",fx:{calm:3},set:{noteZhe:1},log:"記下阿哲的狀況",res:[[null,"你在筆記本上寫：阿哲，第一節就睡，媽媽這週打三通。"]]},
    {label:"不打擾，下樓",fx:{calm:2},log:"安靜離開",res:[[null,"你搭電梯下樓。電梯鏡子裡的你，看起來比早上老五歲。"]]}]},
  {id:"b_yun",chapter:{t:"19:35",title:"第二節",sub:"國中上課了。小芸從櫃台走過來。",status:"國中上課中"},
   t:"19:40",target:{npc:"yun"},goal:"小芸好像有話要說",npc:{yun:AT("bossdesk",1,.4,Math.PI)},after:{yun:PC.yunDesk},
   pages:G=>[["yun","主任……我下個月想辭職。"],["yun","電話、廣播、繳費、印考卷、家長，全部都是我。今天放學的時候，我連水都沒喝。"],[null,"樓上傳來國中部上課的麥克風聲。"]],
   choices:G=>[
    {label:"「放學那一小時，我下去跟你一起顧櫃台。」",fx:{calm:-6,morale:12},set:{yunStay:1,bossDesk:1},log:"答應放學高峰親自支援櫃台",res:[["yun","……主任要來櫃台？"],[null,"她笑了一下，眼睛有點紅。"]]},
    {label:"幫她加薪",fx:{sales:-8,morale:8},set:{yunStay:1},log:"幫小芸加薪",res:[["yun","……真的嗎？那我再想想。"]]},
    {label:"「再撐一期就好。」",fx:{morale:-15,calm:3},set:{yunLeave:1},log:"請小芸再撐一期",res:[["yun","……好。"],[null,"她回到櫃台，把一張便利貼撕下來，揉成一團。"]]}]},
  {id:"b_hr",t:"20:20",target:{npc:"hr"},goal:"鄭老師下樓找你",npc:{hr:AT("bossdesk",.9,.4,Math.PI)},after:{hr:PJ.back},
   pages:G=>[["hr","主任，我想跟你說阿哲的事。他下課問我退費單在哪裡。"],["hr","他從國一就聽不懂分數了。他媽媽繳了一整年，現在退只能拿回一半……"],["hr","還有，下課時段三樓走廊沒人顧，今天有人在電梯裡推來推去。"]],
   choices:G=>[
    {label:"「阿哲需要的是寒假的基礎班，我等一下就打給林媽媽。」",fx:{rep:6,sales:-2},set:{baseClass:1},log:"讓阿哲轉基礎班",res:[["hr","真的嗎？我先跟他說，不要急著拿退費單。"]]},
    {label:"「照規定試算退費給家長看。」",fx:{rep:3,sales:-4},log:"照規定試算退費",res:[["hr","……好，我請櫃台準備。"]]},
    {label:"「下課時段請阿宏站三樓走廊。」",fx:{morale:4,calm:2},set:{hongHall:1},log:"安排課輔老師顧下課走廊",res:[["hr","好，那阿哲的事呢？"],[null,"你說：「明天再說。」"]]}]},
  {id:"b_enroll",chapter:{t:"21:00",title:"國中放學",sub:"王媽媽和兒子走到櫃台前。",status:"放學"},
   t:"21:05",target:{npc:"parent"},goal:"王媽媽要做決定了",npc:{parent:AT("counter",-.9,.8),trial:AT("counter",-.2,1.2),hr:PJ.hrDesk},
   pages:G=>{const n=enrolledT(G);return [["parent",n?"他說聽得懂。老師說他卡在找對應邊，從那裡開始檢討的。":"我們回去再討論看看。對面也約了週四。"]];},
   choices:G=>{const n=enrolledT(G),c=[];
    if(n)c.push({label:"親自收報名表",fx:{sales:8,ret:1},set:{enrolled:1},log:"試聽生報名",res:[[null,"你在報名表上蓋了章。報表上的數字跳了一格。"]]});
    else c.push({label:"給她早鳥價，現在報名",fx:G=>G.h.trial>=45?{sales:3,rep:-3,trial:20}:{rep:-3},set:{lastDiscount:1},onResolve:G=>{if(G.h.trial>=45)G.f.enrolled=1;},log:"最後用早鳥價留人",res:G=>G.h.trial>=45?[["parent","這樣的話……好吧，我們報。"]]:[["parent","不是價錢的問題。"]]});
    c.push({label:"「讓他自己決定，週四去對面聽完再說。」",fx:{rep:6,calm:3},log:"讓家長回去考慮",res:[["parent","你們是第一間不催我們的。"]]});
    return c;}},
  {id:"b_report",t:"21:12",target:{spot:"bossdesk"},goal:"回辦公室填總部週報",action:"打開週報",npc:{parent:null,trial:null},
   pages:G=>[[null,`總部的週報表格開在螢幕上。[[續班率]]那一格，今天算下來是 ${Math.round(G.h.ret)}%。`],[null,"總部的目標是 85%。上一個沒達標的分校主任，下一季就被調走了。"]],
   choices:G=>[
    {label:"照實填",fx:{rep:5,calm:-8},log:`照實填續班率 ${Math.round(G.h.ret)}%`,res:[[null,"你按下送出。螢幕上跳出：「已送出」。就這樣。"]]},
    {label:"先填 85%，下週再補回來",fx:{calm:10,rep:-10},set:{lied:1},log:"週報先填 85%",res:[[null,"你按下送出。數字很好看。"],[null,`下週要補的，是 ${85-Math.round(G.h.ret)} 個百分點的學生。`]]},
    {label:"照實填，另外寫一段說明",note:"寫出你今天看到的事",fx:{rep:10,calm:-12,morale:5},set:{explained:1},log:"照實填週報並附上說明",res:[[null,"你寫了半小時：影印機、冷氣、安親人手、小芸、阿哲、對面的傳單。"],[null,"最後一句是：「數字會回來的，但要先把人留住。」"]]}]}
 ],
 ending(G){
  const s=G.s,h=G.h,dead=s.calm<=0,ret=Math.round(h.ret);
  let t;
  if(dead)t=["主任先下班了","你把週報關掉，跟小芸說今天先這樣，然後在車上坐了二十分鐘才發動。"];
  else if(G.f.lied)t=["數字很好看","週報上的 85% 很漂亮。下週，你要把這個數字變成真的。"];
  else if(s.morale>=70&&s.rep>=65)t=["大家想留下來的補習班","老師沒有走，櫃台沒有走，家長說你們會記得孩子的名字。"];
  else if(G.f.explained)t=["說實話的主任","總部會怎麼回，你不知道。但今晚你寫下的每一件事都是真的。"];
  else if(s.sales>=70)t=["業績第一","報名表收了，數字也好看。只是茶水間最近比較安靜。"];
  else if(s.morale<30)t=["一個人撐著","數字還過得去，但你感覺得到，有人在偷偷看人力銀行。"];
  else t=["撐過一天","主任的大部分日子，就是在每一個「差一點」之間做選擇。"];
  return {title:t[0],desc:t[1],dead,big:[[`${ret}%`,"本期續班率"],[G.f.enrolled?"報名":"考慮中","試聽生"]]};
 }
};

MINIS.renew={
  head:"主任室・續班名單",zone:"主任室",title:"今天打給誰",
  intro:"六個還沒續班的學生。今天只有時間親自打三通。打給「還在猶豫、而且有理由能說服」的家長，最有用。",
  list:[
   {n:"品妤（九年級）",info:"段考前壓力很大，媽媽在比較兩間",v:3,res:"你說會加開段考前的課輔，媽媽當場說要續。"},
   {n:"阿哲（九年級）",info:"數學小考常不及格，媽媽這週打了三通電話",v:2,res:"林媽媽說再想想，但語氣軟了很多。"},
   {n:"冠宇（八年級）",info:"已經轉去對面補習班",v:0,res:"家長客氣地說已經報了別家。"},
   {n:"柏翰（九年級）",info:"成績穩定，每期都續，只是還沒繳費",v:0,res:"家長說本來就要續，不用特別打來。"},
   {n:"芷晴（七年級）",info:"說學費太貴，在考慮自己念",v:2,res:"你提了分期付款，家長說會考慮。"},
   {n:"大頭（四年級安親）",info:"媽媽說安親班太吵，想換小班",v:3,res:"你說四年級一個老師顧八個，媽媽說那就續。"}
  ],
  mount(el,done){const pick=new Set();const self=this;
    el.innerHTML=`<div class="choices">${this.list.map((s,i)=>`<button class="choice" data-i="${i}" aria-pressed="false"><b>${s.n}</b><small>${s.info}</small></button>`).join("")}</div><p class="feed" aria-live="polite">選 3 個人。</p><div class="actions" hidden><button class="go" data-call>打電話</button></div>`;
    const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
    el.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.i;if(act.dataset.done)return;
      if(pick.has(i))pick.delete(i);else if(pick.size<3)pick.add(i);
      el.querySelectorAll("[data-i]").forEach(x=>{const on=pick.has(+x.dataset.i);x.setAttribute("aria-pressed",on);x.style.borderColor=on?"var(--ink)":"";x.style.background=on?"var(--surface)":"";});
      feed.textContent=`已選 ${pick.size} / 3。`;act.hidden=pick.size!==3;}));
    act.querySelector("[data-call]").onclick=()=>{act.dataset.done=1;act.hidden=true;let v=0;const lines=[...pick].map(i=>{const s=self.list[i];v+=s.v;return `<li><b>${s.n}</b>：${s.res}</li>`;});
      feed.innerHTML=`<ul style="margin:0;padding-left:1.2em">${lines.join("")}</ul><p style="margin-top:6px">這三通電話的效果：${v>=7?"很好":v>=4?"還可以":"幾乎沒有"}。</p>`;done({v});};
  }
};
