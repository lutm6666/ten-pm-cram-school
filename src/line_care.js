/* ================= 職業線：安親班老師（下午場 14:00–18:30） ================= */
/* 下午的補習班：B 班教室借給國小安親，櫃台還沒人，繳費和詢問都是你。 */
const PC={door:[4.5,17.6],zhangLobby:[5.2,15.3,Math.PI],amaCounter:[3.4,12.7,Math.PI],yuSeat:[17,4.62,Math.PI],ananSeat:[22,4.62,Math.PI],miSeat:[14.5,6.42,Math.PI],
  yunDesk:[3.75,10.3,0],teacherLounge:[3.2,8,0],amaDoor:[4.9,15.9,Math.PI],miHall:[10.6,12.6,Math.PI/2]};
const kidIn=(seat)=>[seat[0],seat[1],seat[2],PC.door];

LINES.care={
 id:"care",role:"安親班老師",short:"安親",body:0xffc078,shift:"下午 14:00–18:30",
 pick:"下午顧國小安親班。接放學、看功課、簽聯絡簿，櫃台沒人的時候，繳費和詢問也是你。",
 cast:["yu","anan","mi","ama","zhangma","yun"],
 stats:{hp:["體力",60],pat:["耐心",60],par:["家長",50],ord:["秩序",50]},hidden:{},
 late:{fx:{par:-4,ord:-3},text:"小朋友已經在亂跑了。"},
 coda:"六點半，高三的學生走進來，坐上小朋友剛剛坐過的椅子。補習班的一天還沒結束。",
 msgs:[["14:35","何主任","我今天在總部開會，五點半才會到。櫃台先麻煩你。"],["15:40","國小家長群","今天三點五十放學喔～"],["16:45","小芸","我五點到！今天影印機好像又怪怪的"],["17:50","安安阿嬤","老師，我六點會到"],["18:12","小米媽媽","老師不好意思，我會晚一點😢"]],
 preStatus:"準備中",ownItems:true,endAt:"18:30",daylight:true,crowd:"kids",
 board:"今日作業\n數習 p.32・國習 p.18",
 zoneText:{"高三 B 班教室":"晚上是高三 B 班，下午借給安親班。桌子併起來，椅子降低一格。","自習室":"晚上七點才開。下午只有冷氣在等人。","主任室":"主任今天在總部開會，桌上只有一杯冷掉的咖啡。","大廳":"下午的大廳很安靜。家長來詢問、來繳費，都在這裡。"},
 schedule:[["14:00","pre"],["16:10","class"],["17:30","break"],["17:45","class"],["18:00","leave"]],
 phaseStatus:{class:"寫作業",break:"點心時間",leave:"接送中",close:"接送中"},
 bells:{class:["安親時間","小朋友回到座位，開始寫作業。"],break:["點心時間","休息十五分鐘，吃點心。"],leave:["接送時間","家長陸續來接小朋友了。"]},
 events:["quake","blackout"],
 eventSlots:[{after:"c_prep",t:"14:40",phase:"pre"},{after:"c_homework",t:"16:50",phase:"class"},{after:"c_snack",t:"17:50",phase:"class"}],
 chats:["yu","anan","mi","ama","zhangma","yun"],
 start:[4.5,16.6],dead:G=>G.s.hp<=0||G.s.pat<=0,
 me:G=>({name:"你",title:`${G.pName}・安親班老師`,abbr:"安",color:"#e8590c"}),
 npcs:{yun:null,boss:null,teacher:null,pinyu:null,zhe:null,hong:null,bo:null,parent:null,parent2:null,chenba:null,yu:null,anan:null,mi:null,zhangma:null,ama:null,care:null},
 steps:[
  {id:"c_open",chapter:{t:"14:00",title:"下午・開門",sub:"晚上的補習班，下午是另一個樣子。",status:"準備中",rush:["櫃台還沒有人。","四點要去國小接小朋友。"]},
   t:"14:00",target:{spot:"door"},goal:"拉開鐵門",action:"拉開鐵門",
   pages:G=>[[null,"鐵門拉起來，陽光照進大廳。昨晚高三留下的講義還散在櫃台上。"],[null,"B 班教室的白板上，還寫著「空間向量」。下午，那間教室是[[安親]]班的。"]],
   choices:G=>[
    {label:"先把 B 班的桌椅排成小朋友的",fx:{ord:8,hp:-4},set:{roomReady:1},log:"把教室排成安親的樣子",res:[[null,"你把高三的桌子兩兩併起來，椅子降低一格。白板擦乾淨，寫上今天的作業。"]]},
    {label:"開冷氣、泡杯咖啡，先坐一下",fx:{hp:6},log:"開門先喝杯咖啡",res:[[null,"下午兩點的補習班安靜得像圖書館。這是今天唯一安靜的時候。"]]}]},
  {id:"c_prep",t:"14:20",target:{spot:"copier"},goal:"把今天各班的教材分好",action:"分教材",
   pages:G=>[[null,"影印機旁邊疊著五疊東西，有國小的、國中的、高三的，還有櫃台的。"],[null,"昨天晚上有人把它們疊在一起了。"]],
   choices:G=>[
    {label:"一疊一疊分好",mini:"sortout",fx:r=>({ord:r.ok>=5?10:r.ok>=3?4:-4,hp:-2}),log:r=>`分教材，${r.ok}/5 疊放對`,
     res:r=>r.ok>=5?[[null,"五疊東西各歸各位。晚上小芸來，應該會很感動。"]]:[[null,"有一疊放錯了地方。晚上大概會有人找不到東西。"]]},
    {label:"全部先堆在櫃台",fx:{ord:-6,hp:2},log:"教材先堆在櫃台",res:[[null,"櫃台多了一座小山。"]]}]},
  {id:"c_inquiry",t:"14:50",target:{npc:"zhangma"},goal:"有家長走進來",npc:{zhangma:kidIn(PC.zhangLobby)},after:{zhangma:null},
   pages:G=>[["zhangma","你好，我想問一下你們的安親班……"],[null,"她手上拿著對面補習班的傳單，還有一張寫滿字的便條紙。"]],
   choices:G=>[
    {label:"請她坐下，好好聊",note:"問清楚再推薦",mini:"consult",fx:r=>({par:r.score>=3?12:r.score>=1?4:-6,hp:-3}),set:{},log:r=>`接待詢問家長（${r.score>=3?"她當場想試讀":r.score>=1?"她說回去考慮":"她皺著眉頭走了"}）`,
     res:r=>{if(r.score>=3)G.f.trialKid=1;return r.score>=3?[["zhangma","那……下週一可以先試讀嗎？"],[null,"你在便條紙上寫下：張，三年級，數學應用題。"]]:r.score>=1?[["zhangma","好，我回去跟他爸討論一下。"]]:[["zhangma","……我再看看好了。"],[null,"她把對面的傳單放回包包。"]];}},
    {label:"給她一張價目表",fx:{par:-3,hp:2},log:"只給詢問家長價目表",res:[["zhangma","喔……好，謝謝。"],[null,"她看了一眼價目表，又看了一眼對面的傳單。"]]}]},
  {id:"c_pay",t:"15:20",target:{npc:"ama"},goal:"李阿嬤來繳費",npc:{ama:kidIn(PC.amaCounter)},after:{ama:null},
   pages:G=>[["ama","老師，我來繳安安這個月的錢。"],[null,"她從布包裡拿出一個信封，裡面是一疊折得整整齊齊的千元鈔。"],["ama","收據要寫她媽媽的名字喔，公司可以報。"]],
   choices:G=>[
    {label:"算錢、找零、開收據",mini:"change",fx:r=>({par:r.right&&r.exact?8:r.right?3:-8,ord:r.right?4:-4}),log:r=>r.right?`幫李阿嬤繳費，找零 ${r.bills} 張／個`:"繳費金額算錯了",
     res:r=>{G.f.paid=r.right?1:0;return r.right?[["ama","老師你算得好快。"],[null,"收據上寫著安安媽媽的名字。阿嬤把收據折好，放進信封。"]]:[[null,"晚上小芸對帳的時候，會發現少了一筆。"],["ama","（沒發現）謝謝老師～"]];}},
    {label:"請阿嬤晚上再來，等小芸",fx:{par:-6,hp:2},log:"請阿嬤晚上再來繳費",res:[["ama","喔……好啦，我晚上接安安的時候再來。"],[null,"她慢慢走出門口，外面太陽很大。"]]}]},
  {id:"c_pickup",chapter:{t:"15:50",title:"放學",sub:"去國小門口接小朋友。",status:"準備中"},
   t:"15:52",target:{spot:"door"},goal:"去國小門口接小朋友",action:"出發",
   after:{yu:kidIn(PC.yuSeat),anan:kidIn(PC.ananSeat),mi:kidIn(PC.miSeat)},
   pages:G=>[[null,"國小門口擠滿了家長、機車和舉著牌子的安親老師。你舉起寫著補習班名字的牌子。"],[null,"要接 8 個小朋友。陸陸續續出來了，可是隊伍還少兩個。"]],
   choices:G=>[
    {label:"看名單，找出還沒出來的",mini:"kidroll",fx:r=>({ord:r.miss?2:8,pat:-3}),log:r=>r.miss?`點名接小朋友，點錯 ${r.miss} 次`:"一次就點出還沒出來的兩個",
     res:r=>[[null,"小宇在操場打球打到忘了時間，晴晴在找她的水壺。"],[null,"八個小朋友排成一排，跟著你過馬路。小宇一路都在講他剛剛進了三球。"]]},
    {label:"等到人都出來再走",fx:{hp:-5,pat:-6},log:"在校門口等到人齊",res:[[null,"等了二十分鐘。小宇最後一個跑出來，滿頭大汗。"]]}]},
  {id:"c_homework",t:"16:30",target:{npc:"yu"},goal:"小宇說他寫完了",
   pages:G=>[["yu","老師！我數學寫完了！可以去玩了嗎？"],[null,"他的數習本皺皺的，最後一題的答案被擦了三次。"]],
   choices:G=>[
    {label:"一題一題看",note:"找出第一個錯的地方",mini:"kidgrade",fx:r=>({pat:-3,par:r.hits>=2?6:0,ord:r.hits>=2?4:-2}),log:r=>`看小宇的作業，抓對 ${r.hits}/3 題`,
     res:r=>{G.f.yuChecked=r.hits>=2?1:0;return r.hits>=2?[["yu","喔……原來要進位。"],[null,"他自己擦掉重寫，這次對了。"]]:[[null,"有一題你也沒看出來。晚上他媽媽會在聯絡簿上寫：「這題是不是錯了？」"]];}},
    {label:"「寫完了？那去看書。」",fx:{pat:3,par:-4},log:"沒檢查就讓小宇去玩",res:[["yu","耶！"],[null,"他的數習本躺在桌上，第二題的答案是錯的。"]]}]},
  {id:"c_book",t:"17:00",target:{npc:"anan"},goal:"安安拿著聯絡簿過來",
   pages:G=>[["anan","老師……我的[[聯絡簿]]昨天沒有簽。"],[null,"聯絡簿上，家長簽名那一格是空的。下面有一行很小的字，是安安自己寫的：「媽媽出差。」"],["anan","阿嬤說她眼睛不好，叫我跟老師說。"]],
   choices:G=>[
    {label:"幫她在聯絡簿上寫說明，傳訊息給媽媽",fx:{par:8,pat:-3},set:{ananNote:1},log:"幫安安寫聯絡簿說明",res:[[null,"你寫：「家長出差中，今日由安親班確認作業。」然後拍照傳給安安媽媽。"],[null,"五分鐘後，媽媽回了一個「謝謝老師🙏」。"]]},
    {label:"「沒關係，明天再簽。」",fx:{pat:2},log:"聯絡簿明天再簽",res:[["anan","……好。"],[null,"她把聯絡簿收進書包，拉鍊拉得很慢。"]]},
    ...(G.chatUsed&&G.chatUsed.some(k=>k.startsWith("anan:"))?[{label:"問她：媽媽什麼時候回來？",note:"你們剛剛聊過",fx:{pat:-2,par:5},set:{ananTalk:1},log:"陪安安聊媽媽出差的事",res:[["anan","下禮拜三。……我在月曆上畫圈了。"],[null,"你們一起數了一下，還有六天。"]]}]:[])]},
  {id:"c_handoff",t:"17:12",target:{npc:"yun"},goal:"小芸來上班了",npc:{yun:[PC.yunDesk[0],PC.yunDesk[1],0,PC.door]},
   pages:G=>[["yun","午安～下午辛苦了！"],["yun","我等一下馬上要去修影印機。你先跟我說最重要的三件事就好。"]],
   choices:G=>[
    {label:"挑三件事交接",mini:"summary",fx:r=>({ord:r.v>=7?8:r.v>=4?3:-3}),log:r=>`跟小芸交接（${r.v>=7?"重點都講到了":r.v>=4?"還可以":"漏了重要的事"}）`,
     res:r=>{G.f.handoffGood=r.v>=7?1:0;return r.v>=7?[["yun","了解！阿嬤的收據、張媽媽的試讀、小米媽媽會晚到。我記下來了。"]]:[["yun","好……那還有別的嗎？"],[null,"她已經被影印機叫走了。"]];}},
    {label:"「沒什麼特別的。」",fx:{hp:2,ord:-5},log:"沒有交接",res:[["yun","好喔！"],[null,"晚上七點，小芸會在抽屜裡發現一張沒歸檔的收據。"]]}]},
  {id:"c_snack",chapter:{t:"17:30",title:"點心時間",sub:"布丁和麥茶。",status:"點心時間"},
   t:"17:32",target:{npc:"mi"},goal:"小米在走廊哭",npc:{mi:PC.miHall,teacher:[PC.teacherLounge[0],PC.teacherLounge[1],0,PC.door]},
   pages:G=>[[null,"點心時間。小米抱著兔子娃娃，坐在走廊的地上哭。"],["mi","我要媽媽……"],[null,"布丁放在她旁邊，一口都沒吃。"]],
   choices:G=>[
    {label:"蹲下來，陪她一起吃布丁",fx:{pat:-4,par:6},set:{miCalm:1},log:"陪小米吃點心",res:[["me","布丁跟你的兔子同名耶。它叫什麼？"],["mi","……布丁。"],[null,"她吃了一口。又一口。"]]},
    {label:"讓她打電話給媽媽",fx:{par:4,ord:-2},set:{miCall:1},log:"讓小米打給媽媽",res:[["mi","媽媽……"],[null,"電話那頭說了很久。小米掛掉電話的時候，不哭了。"]]},
    {label:"「大家都在吃喔，你也去坐好。」",fx:{ord:4,pat:2},log:"請小米回座位",res:[[null,"小米站起來走回教室。她沒有哭了，但也沒有吃布丁。"]]}]},
  {id:"c_parents",chapter:{t:"18:00",title:"接送",sub:"家長陸續來了。",status:"接送中"},
   t:"18:02",target:{spot:"door"},goal:"站到門口看接送名單",action:"拿出接送名單",npc:{mi:kidIn(PC.miSeat)},after:{yu:null,anan:null},
   pages:G=>[[null,"六點。門口開始有人來接小朋友。"],[null,"你手上有一張[[接送名單]]。不在名單上的人來接，要先打給家長。"]],
   choices:G=>[
    {label:"一個一個確認",mini:"pickup",fx:r=>({par:r.ok>=4?10:r.ok>=3?3:-10,ord:r.ok>=4?6:0}),set:{},log:r=>`接送，${r.ok}/4 個處理得對`,
     res:r=>{if(r.handedMi)G.f.handedMi=1;G.f.pickupOk=r.ok>=4?1:0;return r.ok>=4?[[null,"每一個小朋友都交到對的人手上。"]]:r.handedMi?[[null,"小米跟著那位阿姨走了。你看著她們的背影，突然覺得哪裡不對。"]]:[[null,"有一位家長被你攔下來確認，臉色不太好。"]]; }},
    {label:"家長來了就讓小朋友出去",fx:{ord:-8,par:-4},set:{handedMi:1},log:"接送沒有核對名單",res:[[null,"十分鐘內，教室空了一半。"],[null,"小米也跟著一位你沒見過的阿姨走了。"]]}]},
  {id:"c_late",t:"18:20",target:{spot:"door"},goal:G=>G.f.handedMi?"小米媽媽衝進來了":"小米還在等媽媽",
   npc:{mi:G=>G.f.handedMi?null:[4.9,15.9,Math.PI]},
   pages:G=>G.f.handedMi?[[null,"六點二十，小米媽媽氣喘吁吁地跑進來。"],[null,"「我同事說小米已經接到了。我是有拜託她……但我沒有先跟你們說，對不起。」"],[null,"「不過，下次你們還是要先打給我。好不好？」"]]
    :[[null,"六點二十。教室裡只剩小米一個人。高三的學生已經開始走進來了。"],["mi","老師，媽媽是不是忘記我了？"]],
   choices:G=>G.f.handedMi?[
     {label:"道歉，承諾以後一定先確認",fx:{par:4,pat:-4},set:{lesson:1},log:"跟小米媽媽道歉",res:[[null,"你在接送名單最上面寫：「名單外的人，一律先打電話。」"]]}]:[
     {label:"陪她坐在門口等",fx:{hp:-5,par:10},set:{waitMi:1},log:"陪小米等媽媽",res:[[null,"你們坐在大廳的沙發上，一起數走進來的高三學生。數到第十二個的時候，媽媽到了。"],["mi","掰掰老師！布丁明天還有嗎？"]]},
     {label:"打給媽媽，問她幾點到",fx:{par:5,pat:-2},log:"打給小米媽媽",res:[[null,"「十分鐘！真的十分鐘！」"],[null,"十二分鐘後，她到了。"]]},
     {label:"請小芸幫忙看著，自己先下班",fx:{hp:6,par:-6},set:{leftMi:1},log:"把小米交給小芸",res:[["yun","好，我看著她。"],[null,"你走出門口時，回頭看見小米抱著兔子，坐在櫃台旁邊。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f,paid=G.minis.change&&G.minis.change.right;
  let t;
  if(dead)t=s.pat<=0?["耐心用完了","小宇第五次問「可以去玩了嗎」的時候，你請主任先幫忙看一下，自己躲進休息室。"]:["下午就累壞了","晚上的補習班才正要開始，你已經沒力氣了。"];
  else if(f.handedMi&&!f.lesson)t=["一張沒核對的名單","今天大家都平安回家了。但你知道，平安有時候只是運氣。"];
  else if(s.par>=72&&s.ord>=65)t=["家長最放心的安親老師","收據對、作業對、人也交對。家長群組裡，有人說：「交給蔡老師很放心。」"];
  else if(f.waitMi||f.miCalm||f.ananNote)t=["記得每個小朋友的事","誰想媽媽、誰的聯絡簿沒簽、誰的布丁沒吃。你都記得。"];
  else if(s.ord>=70)t=["有條有理的下午","教材分好、名單核對、收據開對。晚上的人接手時，一切都在位子上。"];
  else t=["平安的下午","沒有大好也沒有大壞。小朋友都回家了，晚上的補習班要開始了。"];
  return {title:t[0],desc:t[1],dead,big:[[paid?"已收":"未收","安安的學費"],[f.trialKid?"1 位":"0 位","新的試讀"]]};
 }
};

/* ---------- 下午場的小遊戲 ---------- */
/* 分教材：每一疊放到對的地方 */
MINIS.sortout={
  head:"影印機旁・分教材",zone:"大廳・影印機",title:"一疊一疊分好",cost:4,
  intro:"五疊東西，各有各的去處。分錯了，晚上就會有人找不到。",
  opts:["國小安親","國中部","高三 B 班","櫃台"],
  items:[["國小二年級 數學習作解答",0],["國中八年級 英文段考複習卷",1],["高三 B 班 空間向量講義",2],["李阿嬤要的收據本",3],["今天的點心登記表",0]],
  mount(el,done){let i=0,ok=0;const self=this;
    function draw(){const it=self.items[i];
      el.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.items.length} 疊</div><div>${esc(it[0])}</div></div><div class="choices">${self.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o)}</button>`).join("")}</div><p class="feed" aria-live="polite"></p><div class="actions" hidden><button class="go" data-next>下一疊</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(!act.hidden)return;const k=+b.dataset.k;
        if(k===it[1]){ok++;feed.textContent="放好了。";}else feed.textContent=`應該是「${self.opts[it[1]]}」的。`;
        el.querySelectorAll("[data-k]").forEach((x,j)=>{x.disabled=true;if(j===it[1])x.style.borderColor="var(--green)";});act.hidden=false;
        act.querySelector("[data-next]").onclick=()=>{if(i<self.items.length-1){i++;draw();}else{el.innerHTML=`<p class="feed">分完了，放對 ${ok} / ${self.items.length} 疊。</p>`;done({ok});}};}));}
    draw();}
};
/* 家長詢問：先問清楚，再推薦 */
MINIS.consult={
  head:"大廳・家長詢問",zone:"大廳",title:"先問清楚，再推薦",cost:6,
  intro:"張媽媽來問安親班。先弄清楚孩子的狀況，再推薦適合的。一開口就推銷，家長會跑掉。",
  rounds:[
   {say:"「我想問一下你們的安親班。」",opts:[["「小朋友現在幾年級？」",1],["「我們這期打八折喔！」",-1],["「這是我們的價目表。」",0]]},
   {say:"「三年級。數學有點跟不上，回家作業都寫到很晚。」",opts:[["「是哪一種題目寫比較久？應用題還是計算？」",1],["「那報全科最划算。」",-1],["「我們老師都很有經驗。」",0]]},
   {say:"「應用題。他看不懂題目在問什麼。我跟他爸都六點半才下班。」",opts:[["「安親可以待到七點，週三另外有閱讀理解課，可以一起看看。」",1],["「那要不要考慮國中先修班？」",-1],["「我們安親有點心喔。」",0]]},
   {say:"「那學費大概多少？」",opts:[["「每月 6,800，含點心。可以先試讀一週再決定。」",1],["「今天報名有送書包！」",0],["「價錢不是重點啦。」",-1]]}
  ],
  mount(el,done){let r=0,score=0;const self=this;
    function draw(){const R=self.rounds[r];
      el.innerHTML=`<div class="paper"><div class="q">張媽媽・第 ${r+1} / ${self.rounds.length} 句</div>${esc(R.say)}</div><div class="choices">${R.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o[0])}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{const d=R.opts[+b.dataset.k][1];score+=d;r++;
        if(r<self.rounds.length)draw();else{el.innerHTML=`<p class="feed">${score>=3?"張媽媽點點頭，拿出手機記下試讀時間。":score>=1?"張媽媽說會回去考慮。":"張媽媽的表情越來越客氣。"}</p>`;done({score});}}));}
    draw();}
};
/* 繳費：先算應收，再找零 */
MINIS.change={
  head:"櫃台・繳費",zone:"櫃台",title:"算錢、找零、開收據",cost:5,
  intro:"先算出這個月要收多少，再從抽屜裡拿零錢找給阿嬤。",
  bill:[["十月安親費",6800],["點心費",600],["教材費",350]],paid:10000,
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
/* 國小門口點名：找出還沒出來的 */
MINIS.kidroll={...MINIS.roll,
  head:"國小門口・接小朋友",zone:"國小門口",title:"誰還沒出來？",
  intro:"要接 8 個小朋友，隊伍裡只有 6 個。在名單上點出還沒出來的兩個。點錯了，小朋友會說「我在這裡啦！」",
  names:["小宇","安安","小米","阿凱","妞妞","子恩","晴晴","大頭"],absent:["小宇","晴晴"]};
/* 看國小作業：找出第一個錯的地方 */
MINIS.kidgrade={...MINIS.grade,
  head:"安親・看作業",zone:"安親教室",title:"找出第一個錯的地方",
  intro:"小宇的數習，三題。點出每一題第一個寫錯的那一行。",
  papers:[
   {who:"小宇",q:"38 + 47 = ?",lines:["個位：8 + 7 = 15，寫 5 進 1","十位：3 + 4 = 7","答：75"],bad:1,why:"十位要加上進位的 1，是 8。答案 85。"},
   {who:"小宇",q:"小明有 52 元，買了 18 元的鉛筆，還剩多少？",lines:["52 − 18","個位：12 − 8 = 4","十位：5 − 1 = 4","答：剩 44 元"],bad:2,why:"十位借給個位之後只剩 4，4 − 1 = 3。答案是 34 元。"},
   {who:"小宇",q:"一盒 6 顆蛋，3 盒有幾顆？",lines:["6 + 3 = 9","答：9 顆"],bad:0,why:"3 盒是 3 個 6，要算 6 × 3 = 18。"}
  ]};
/* 接送：名單上的人才交 */
MINIS.pickup={
  head:"門口・接送",zone:"大門口",title:"交給對的人",cost:6,
  intro:"接送名單：安安｜阿嬤、媽媽　小宇｜媽媽　小米｜媽媽。不在名單上的人來接，先打給家長。",
  opts:["交給他","先打電話給家長確認","請他到旁邊等一下"],
  rounds:[
   {who:"李阿嬤",say:"「老師，我來接安安。」",ok:0},
   {who:"年輕男生",say:"「我是小宇的舅舅，他媽媽叫我來接。」",ok:1},
   {who:"小宇媽媽",say:"「不好意思！他舅舅剛剛打給我，我還是自己來了。」",ok:0},
   {who:"一位阿姨",say:"「我是小米媽媽的同事，她說今天會晚，叫我先來接。」",ok:1,mi:1}
  ],
  mount(el,done){let i=0,ok=0,handedMi=false;const self=this;
    function draw(){const R=self.rounds[i];
      el.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.rounds.length} 位・${esc(R.who)}</div>${esc(R.say)}</div><div class="choices">${self.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o)}</button>`).join("")}</div><p class="feed" aria-live="polite"></p><div class="actions" hidden><button class="go" data-next>下一位</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(!act.hidden)return;const k=+b.dataset.k;
        if(k===R.ok){ok++;feed.textContent=R.ok===0?"名單上有。小朋友揮揮手走了。":"電話打過去，家長說：「謝謝你們有先問！」";}
        else if(k===0){feed.textContent="不在名單上，你卻交出去了。";if(R.mi)handedMi=true;}
        else feed.textContent=R.ok===0?"名單上明明有，家長等得有點不耐煩。":"他在旁邊等著，但最後還是要打電話。";
        el.querySelectorAll("[data-k]").forEach((x,j)=>{x.disabled=true;if(j===R.ok)x.style.borderColor="var(--green)";});act.hidden=false;
        act.querySelector("[data-next]").onclick=()=>{if(i<self.rounds.length-1){i++;draw();}else{el.innerHTML=`<p class="feed">接送完了，處理得對的有 ${ok} / ${self.rounds.length} 位。</p>`;done({ok,handedMi});}};}));}
    draw();}
};
