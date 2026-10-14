/* ================= 職業線：四年級安親老師（蔡老師） ================= */
/* 第一天週二：四年級整天，15:20 出發接人。11:30 到班先打掃、批改，下午接人、看作業、放學接送。 */
LINES.care={
 id:"care",self:"cai",role:"四年級安親老師",short:"安親",body:0xffc078,shift:"11:30–19:00",
 pick:"顧四年級的安親班。接放學、看作業、簽聯絡簿，還有跟每一位家長說今天發生了什麼。",
 cast:["yu","anan","mi","lin","yun","ama","zhangma"],
 stats:{hp:["體力",60],pat:["耐心",60],par:["家長",50],ord:["秩序",50]},hidden:{},
 late:{fx:{par:-4,ord:-3},text:"小朋友已經在亂跑了。"},
 coda:"六點多，四年級教室只剩一張沒收的椅子。明天中午，又要去接人了。",
 msgs:[["12:05","四年級家長群","安安阿嬤：老師，安安媽媽出差到明天，這兩天都是我接喔"],["14:55","國小家長群","下週一校慶補假，安親照常開"],["16:20","小芸","樓下有家長來問安親，等一下可能要請你下來"],["18:12","小米媽媽","老師不好意思，公司在開會，我會晚一點😢"]],
 preStatus:"準備中",endAt:"19:00",daylight:true,
 staff:["lin","wu","amy","hong"],
 boards:{g4:"評量進度　學校作業先寫完\n數學 第4回・國語 第3回・自然 第2回"},
 zoneText:{"四年級安親教室":"你的教室。九張小桌子，八個小朋友，一個永遠空著的位子。","大廳":"白天的大廳很安靜。四點以後，就是接送的戰場。","國中置物區":"晚上才會熱鬧。現在只有一籃空空的手機格。"},
 schedule:[["11:30","pre"],["15:50","class"],["17:00","leave"]],
 phaseStatus:{pre:"準備中",class:"寫作業",leave:"放學中",close:"收拾中"},
 bells:{class:["小朋友回來了","洗手、吃點心、寫作業。"],leave:["放學時間","家長陸續來接了。櫃台會廣播誰的家長到了。"]},
 events:["kidfall","schoolcall","pudding"],
 eventSlots:[{after:"c_grade",t:"12:30",phase:"pre"},{after:"c_homework",t:"16:45",phase:"class"},{after:"c_book",t:"17:08",phase:"leave"}],
 chats:["yu","anan","mi","lin","wu","yun","ama","zhangma","boss","xiangma","mima","anma"],
 start:[FLX(0,4.5),16.6],dead:G=>G.s.hp<=0||G.s.pat<=0,
 me:G=>({name:"你",title:`${G.pName}・四年級安親`,abbr:"安",color:"#e8590c"}),
 npcs:{yun:null,boss:null,teacher:null,hr:null,lin:PC.lin,wu:PC.wu,amy:null,hong:null,yu:null,anan:null,mi:null,zhangma:null,ama:null,xiangma:null,mima:null,cai:null},
 steps:[
  {id:"c_open",chapter:{t:"11:30",title:"上午・到班",sub:"今天週二，四年級上整天。下午三點二十才要去接人。",status:"準備中",rush:["先上二樓打掃教室。","昨天的評量還沒改完。"]},
   t:"11:30",target:{spot:"g4podium"},goal:"上二樓，打掃四年級教室",action:"開始打掃",
   pages:G=>[[null,"一樓的大廳還沒開燈。你走樓梯上二樓，五年級的林老師已經在擦桌子了。"],["lin","早～我們班昨天又有人把室內鞋穿回家了，今天一雙拖鞋走來。"],[null,"四年級教室的地上有昨天的橡皮擦屑，還有一隻被遺忘的室內鞋。"]],
   choices:G=>[
    {label:"桌椅、地板、白板全部整理",fx:{ord:8,hp:-5},set:{roomReady:1},log:"把教室整理乾淨",res:[[null,"九張小桌子排整齊，白板寫上今天的評量進度。那隻室內鞋，鞋底寫著「子恩」。"]]},
    {label:"掃一下地就好，先改評量",fx:{hp:2,ord:-2},log:"簡單打掃，先改評量",res:[[null,"地板乾淨了。桌子有點歪，下午小朋友會自己推回去……大概。"]]}]},
  {id:"c_grade",t:"11:50",target:{spot:"g4podium"},goal:"坐到老師桌改昨天的評量",action:"改評量",
   pages:G=>[[null,"八本數學評量，疊在教室前面的老師桌上。昨天回家前沒改完。"],[null,"下午小朋友回來要訂正，現在不改完，等一下就來不及了。"]],
   choices:G=>[
    {label:"一題一題看，錯的地方圈起來",note:"花比較多時間",fx:{ord:6,hp:-4,par:3},set:{gradedAll:1},log:"仔細改完八本評量",res:[[null,"八本改完，紅筆用掉半支。小宇第三題的進位又錯了，你在旁邊畫了一個小箭頭。"]]},
    {label:"只核對答案，打勾打叉",fx:{hp:2,ord:-3},log:"評量只對答案",res:[[null,"很快就改完了。不過小朋友只會知道「錯了」，不知道「錯在哪」。"]]}]},
  {id:"c_lunch",t:"12:40",target:{npc:"lin"},goal:"林老師叫你一起吃午餐",npc:{lin:AT("g4podium",1.4,1.2)},after:{lin:PC.lin},
   pages:G=>[["lin","來啦，便當要涼了。"],["lin","對了，你們班的小米，三年級是在另一棟給陳老師帶的。陳老師說她很黏媽媽，媽媽要是晚到，她會一直問。"],["lin","我中午又被家長傳了十幾則訊息……先吃飯，不講了。"]],
   choices:G=>[
    {label:"多問幾句小米的事",fx:{par:2,hp:3},set:{knowMi:1},log:"跟林老師問小米的狀況",res:[["lin","她有一隻兔子娃娃，叫「布丁」。哭的時候問她布丁好不好，會比問她怎麼了有用。"]]},
    {label:"邊吃邊對一下每個人的聯絡簿作業",fx:{ord:4,hp:2},log:"午餐時排好下午的進度",res:[[null,"八個小朋友，在三個不同的班。你在便當盒蓋上寫：學校作業先寫，寫完的做數學評量第 4 回。"]]}]},
  {id:"c_copy",chapter:{t:"13:40",title:"下午・印評量",sub:"一樓的影印機，下午是大家的。",status:"準備中"},
   t:"13:40",target:{spot:"copier"},goal:"下樓印明天的評量",action:"排隊",npc:{hr:AT("copier",.9,.3,Math.PI/2)},after:{hr:PC.hrDesk},
   pages:G=>[[null,"影印機正在吐國中部的考卷。九年級的鄭老師站在旁邊，一臉焦慮。"],["hr","啊，蔡老師也要印嗎？我這邊還有……一百二十張。段考複習卷。"],[null,"影印機發出「嗶——」的一聲。卡紙燈亮了。"]],
   choices:G=>[
    {label:"「我來拉，我很會。」",mini:"jam",fx:r=>({hp:-3-2*Math.min(4,r.tears),ord:r.tears?-2:3}),set:{fixedCopier:1},log:r=>r.tears?`幫忙修影印機，撕破 ${r.tears} 次`:"幫國中部修好影印機",res:r=>r.tears?[[null,"紙拉出來了，但碎紙卡在滾輪裡。鄭老師拿鑷子夾了五分鐘。"]]:[[null,"四張紙完整拉出來。影印機又開始吐考卷。"],["hr","你救了我。你先印，八張而已。"]]},
    {label:"讓她先印完",fx:{pat:-4,hp:2},log:"讓國中部先用影印機",res:[[null,"你在旁邊等了二十分鐘，把評量的順序重排了兩次。"],["hr","不好意思不好意思……我晚點請你喝飲料。"]]},
    {label:"改用手抄，評量明天再印",fx:{ord:-4,hp:-2},set:{noCopy:1},log:"評量沒印，改成手抄",res:[[null,"你回到二樓，在白板上抄了五題。明天的評量……明天再說。"]]}]},
  {id:"c_consult",t:"14:30",target:{npc:"zhangma"},goal:"小芸請你下樓：有家長來問安親",npc:{zhangma:PC.zhangConsult,yun:PC.yunDesk},after:{zhangma:null},
   pages:G=>[["yun","（電話）蔡老師～有一位張媽媽想問四年級的安親，我請她在諮詢室等你喔。"],[null,"諮詢室裡，張媽媽手上拿著對面補習班的傳單，還有一張寫滿字的便條紙。"],["zhangma","你好，我想問四年級的安親……"]],
   choices:G=>[
    {label:"坐下來，先問清楚孩子的狀況",note:"學費交給櫃台說",mini:"consult",fx:r=>({par:r.score>=3?12:r.score>=1?4:-6,hp:-3}),log:r=>`接待詢問家長（${r.score>=3?"她想先試讀":r.score>=1?"她說回去考慮":"她客氣地走了"}）`,
     res:r=>{if(r.score>=3)G.f.trialKid=1;return r.score>=3?[["zhangma","那……下週一可以先試讀一週嗎？"],[null,"你在便條紙上寫下：張，四年級，數學應用題。轉給櫃台小芸。"]]:r.score>=1?[["zhangma","好，我回去跟他爸討論一下。"]]:[["zhangma","……我再看看好了。"],[null,"她把對面的傳單放回包包。"]];}},
    {label:"給她簡章，請她去櫃台問",fx:{par:-3,hp:2},log:"只給詢問家長簡章",res:[["zhangma","喔……好，謝謝。"],[null,"她看了一眼簡章，又看了一眼對面的傳單。"]]}]},
  {id:"c_pickup",chapter:{t:"15:20",title:"放學",sub:"三個安親老師一起出發去國小。",status:"接人中"},
   t:"15:20",target:{spot:"door"},goal:"出發去國小接人",action:"出發",
   after:{yu:kidIn(SEAT("g4","yu")),anan:kidIn(SEAT("g4","anan")),mi:kidIn(SEAT("g4","mi"))},
   pages:G=>[[null,"國小門口擠滿了家長、機車和舉著牌子的安親老師。你舉起寫著補習班名字的牌子。"],[null,"四年級要接 8 個。陸陸續續出來了，可是隊伍還少兩個。"]],
   choices:G=>[
    {label:"看名單，找出還沒出來的",mini:"kidroll",fx:r=>({ord:r.miss?2:8,pat:-3}),log:r=>r.miss?`點名接小朋友，點錯 ${r.miss} 次`:"一次就點出還沒出來的兩個",
     res:r=>[[null,"小宇在操場打球打到忘了時間，晴晴在找她的水壺。"],[null,"八個小朋友排成一排，跟著你過馬路。小宇一路都在講他剛剛進了三球。"]]},
    {label:"等到人都出來再走",fx:{hp:-5,pat:-6},log:"在校門口等到人齊",res:[[null,"等了二十分鐘。小宇最後一個跑出來，滿頭大汗。"]]}]},
  {id:"c_snack",chapter:{t:"15:55",title:"點心時間",sub:"洗手、吃點心，四點十分開始寫作業。",status:"點心時間"},
   t:"15:58",target:{npc:"mi"},goal:"小米坐在點心區不動",npc:{mi:PC.miSnack},after:{mi:SEAT("g4","mi")},
   pages:G=>[[null,"大家都在吃布丁。小米抱著兔子娃娃，坐在點心區的角落。"],["mi","……我想打電話給媽媽。"],[null,"布丁放在她旁邊，一口都沒吃。"]],
   choices:G=>[
    {label:G.f.knowMi?"「布丁今天好不好？」":"蹲下來，陪她一起吃",fx:G.f.knowMi?{pat:-2,par:8}:{pat:-4,par:5},set:{miCalm:1},log:"陪小米吃點心",res:G=>G.f.knowMi?[["mi","……布丁說牠想吃布丁。"],[null,"她舀了一口，先餵兔子，再餵自己。"]]:[["me","你的兔子叫什麼名字？"],["mi","……布丁。"],[null,"她吃了一口。又一口。"]]},
    {label:"讓她打給媽媽",fx:{par:3,ord:-3},set:{miCall:1},log:"讓小米打給媽媽",res:[[null,"電話沒人接。小米把話筒放回去，哭得更大聲了。"]]},
    {label:"「大家都在吃喔，你也去坐好。」",fx:{ord:4,pat:2},log:"請小米回座位",res:[[null,"小米站起來走回教室。她沒有哭了，但也沒有吃布丁。"]]}]},
  {id:"c_homework",t:"16:30",target:{npc:"yu"},goal:"小宇說他寫完了",
   pages:G=>[["yu","老師！我數學寫完了！可以去閱讀角了嗎？"],[null,"他的數習本皺皺的，最後一題的答案被擦了三次。"]],
   choices:G=>[
    {label:"一題一題看",note:"找出第一個錯的地方",mini:"kidgrade",fx:r=>({pat:-3,par:r.hits>=2?6:0,ord:r.hits>=2?4:-2}),log:r=>`看小宇的作業，抓對 ${r.hits}/3 題`,
     res:r=>{G.f.yuChecked=r.hits>=2?1:0;return r.hits>=2?[["yu","喔……原來要進位。"],[null,"他自己擦掉重寫，這次對了。"]]:[[null,"有一題你也沒看出來。晚上他媽媽會在聯絡簿上寫：「這題是不是錯了？」"]];}},
    {label:"「寫完了？那去看書。」",fx:{pat:3,par:-4},log:"沒檢查就讓小宇去玩",res:[["yu","耶！"],[null,"他的數習本躺在桌上，第二題的答案是錯的。"]]}]},
  {id:"c_book",t:"16:55",target:{npc:"anan"},goal:"安安拿著聯絡簿過來",
   pages:G=>[["anan","老師……我的[[聯絡簿]]昨天沒有簽。"],[null,"家長簽名那一格是空的。下面有一行很小的字，是安安自己寫的：「媽媽出差。」"],["anan","媽媽明天才回來。阿嬤說她眼睛不好，叫我跟老師說。"]],
   choices:G=>[
    {label:"在聯絡簿上寫說明，拍照傳給媽媽",fx:{par:8,pat:-3},set:{ananNote:1},log:"幫安安寫聯絡簿說明",res:[[null,"你寫：「家長出差中，今日由安親班確認作業。」然後拍照傳給安安媽媽。"],[null,"五分鐘後，媽媽回了一個「謝謝老師🙏 明天中午我就回來了」。"]]},
    {label:"「沒關係，明天再簽。」",fx:{pat:2},log:"聯絡簿明天再簽",res:[["anan","……好。"],[null,"她把聯絡簿收進書包，拉鍊拉得很慢。"]]}]},
  {id:"c_rush",chapter:{t:"17:00",title:"放學",sub:"櫃台開始廣播。誰的家長到了，就讓誰下樓。",status:"放學中"},
   t:"17:25",target:{npc:"yu"},goal:"廣播：小宇的媽媽到了",npc:{xiangma:PC.xiangmaLobby},
   pages:G=>[[null,"天花板的喇叭響了：「四年級小宇，媽媽來接囉。」"],[null,"小宇的國習還有半頁沒寫，數習第二題也還沒訂正。"],["yu","老師，我媽來了！我可以走了嗎？"]],
   choices:G=>[
    {label:"牽他下樓，跟媽媽說今天要練進位",fx:{hp:-4,par:8},set:{toldXiangma:1},log:"親自帶小宇下樓跟媽媽交代",res:[[null,"大廳裡，阿翔媽媽一手拿著小宇的外套，一手在講電話。"],["xiangma","（掛掉電話）……喔，老師你說進位？好，我叫他哥哥教他。"],[null,"她看起來有別的事在煩。"]]},
    {label:"請媽媽等五分鐘，寫完再走",fx:{ord:6,par:-3},log:"讓小宇寫完國習才下樓",res:[[null,"小宇用最快的速度寫完半頁，字歪到像在跑步。"],[null,"樓下的櫃台又廣播了一次。"]]},
    {label:"讓他自己下樓",fx:{pat:3,par:-4},log:"讓小宇自己下樓",res:[["yu","掰掰老師！"],[null,"他的數習還攤在桌上。明天你會在第二題旁邊，看到一模一樣的錯。"]]}]},
  {id:"c_ama",t:"17:45",target:{npc:"ama"},goal:"李阿嬤來接安安",npc:{ama:PC.amaLobby},after:{ama:null,anan:null},
   pages:G=>[["ama","老師，安安在樓上嗎？"],["ama","還有……這個聯絡簿的字太小了，我看不清楚。老師可以跟我講一下今天寫什麼嗎？"]],
   choices:G=>[
    {label:"一項一項念給阿嬤聽",fx:{par:8,hp:-3},log:"幫李阿嬤念聯絡簿",res:[[null,"國習、數習、明天要帶彩色筆。阿嬤點了三次頭。"],["ama","老師你人好好。安安這個月的錢我等一下去櫃台繳。"]]},
    {label:"請阿嬤到櫃台，小芸可以幫忙",fx:{pat:2,par:-2},log:"請李阿嬤去櫃台問",res:[["ama","喔……好。"],[null,"她慢慢走向櫃台。櫃台前面已經排了三個家長。"]]}]},
  {id:"c_late",chapter:{t:"18:00",title:"剩下的人",sub:"大部分的小朋友都走了。",status:"放學中"},
   t:"18:20",target:{npc:"mi"},goal:"小米還在等媽媽",npc:{mi:SEAT("g4","mi")},
   pages:G=>[[null,"六點二十。四年級教室只剩小米一個人。樓下傳來國中生搶電梯的聲音。"],["mi","老師，媽媽是不是忘記我了？"]],
   choices:G=>[
    {label:"陪她坐著等",fx:{hp:-5,par:10},set:{waitMi:1},log:"陪小米等媽媽",res:[[null,"你們一起把彩色筆按顏色排好。排到第二十四支的時候，媽媽到了。"],["mi","掰掰老師！布丁明天還有嗎？"]]},
    {label:"打給媽媽，問她幾點到",fx:{par:5,pat:-2},log:"打給小米媽媽",res:[[null,"「二十分鐘！真的二十分鐘！」"],[null,"二十五分鐘後，她到了。"]]},
    {label:"請小芸幫忙看著，自己先收拾",fx:{hp:6,par:-6},set:{leftMi:1},log:"把小米交給櫃台",res:[["yun","……好，我看著她。（電話又響了）"],[null,"你回頭看見小米抱著兔子，坐在櫃台旁邊的小椅子上。"]]}]},
  {id:"c_close",t:"18:45",target:{spot:"g4podium"},goal:"收拾教室",action:"收拾",npc:{mi:null},
   pages:G=>[[null,"教室空了。桌上有一張畫，畫的是一隻很像雞的恐龍，右下角寫著「小米」。"],[null,"明天週三，十二點二十就要去接人，接回來就午休。"]],
   choices:G=>[
    {label:"把明天午休的墊子先準備好",fx:{ord:6,hp:-3},set:{readyNap:1},log:"先準備好明天的午休",res:[[null,"八個小枕頭排在櫃子上，每個貼上名字。"]]},
    {label:"關燈，下班",fx:{hp:5},log:"準時下班",res:[[null,"你關上四年級教室的燈。三樓還很吵，國中部的晚上才剛開始。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=s.pat<=0?["耐心用完了","小宇第五次問「可以去玩了嗎」的時候，你請林老師幫忙看一下，自己躲進儲藏室。"]:["下午就累壞了","晚上的補習班才正要開始，你已經沒力氣了。"];
  else if(f.leftMi)t=["櫃台旁邊的小椅子","小米最後是在櫃台旁邊等到媽媽的。小芸說，她一直抱著兔子沒說話。"];
  else if(s.par>=72&&s.ord>=65)t=["家長最放心的安親老師","作業看了、聯絡簿交代了、人也交對了。家長群組裡，有人說：「交給蔡老師很放心。」"];
  else if(f.waitMi||f.miCalm||f.ananNote)t=["記得每個小朋友的事","誰想媽媽、誰的聯絡簿沒簽、誰的布丁沒吃。你都記得。"];
  else if(s.ord>=70)t=["有條有理的下午","評量改好、名單核對、教室收好。明天中午接人，一切都在位子上。"];
  else t=["平安的下午","沒有大好也沒有大壞。小朋友都回家了，三樓的國中部才剛開始。"];
  return {title:t[0],desc:t[1],dead,big:[[f.yuChecked?"有":"沒有","小宇的進位"],[f.trialKid?"1 位":"0 位","新的試讀"]]};
 }
};

/* ---------- 安親的小遊戲 ---------- */
MINIS.consult={
  head:"諮詢室・家長詢問",zone:"諮詢室",title:"先問清楚，再推薦",cost:6,
  intro:"張媽媽來問四年級的安親。先弄清楚孩子的狀況，再說安親班能幫上什麼。學費的事交給櫃台。",
  rounds:[
   {say:"「我想問一下你們四年級的安親。」",opts:[["「小朋友現在在哪一間國小？下午幾點放學？」",1],["「我們這期打八折喔！」",-1],["「這是我們的簡章。」",0]]},
   {say:"「就在對面國小。數學有點跟不上，回家作業都寫到很晚。」",opts:[["「是哪一種題目寫比較久？應用題還是計算？」",1],["「那全科都報比較划算。」",-1],["「我們老師都很有經驗。」",0]]},
   {say:"「應用題。他看不懂題目在問什麼。我跟他爸都六點半才下班。」",opts:[["「我們會先陪他把題目念一遍、圈出問什麼。最晚可以待到七點。」",1],["「那要不要考慮珠心算？」",-1],["「我們有點心喔。」",0]]},
   {say:"「那學費大概多少？」",opts:[["「細的請櫃台小芸跟您說，可以先試讀一週再決定。」",1],["「今天報名有送書包！」",0],["「價錢不是重點啦。」",-1]]}
  ],
  mount(el,done){let r=0,score=0;const self=this;
    function draw(){const R=self.rounds[r];
      el.innerHTML=`<div class="paper"><div class="q">張媽媽・第 ${r+1} / ${self.rounds.length} 句</div>${esc(R.say)}</div><div class="choices">${R.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o[0])}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{const d=R.opts[+b.dataset.k][1];score+=d;r++;
        if(r<self.rounds.length)draw();else{el.innerHTML=`<p class="feed">${score>=3?"張媽媽點點頭，拿出手機記下試讀時間。":score>=1?"張媽媽說會回去考慮。":"張媽媽的表情越來越客氣。"}</p>`;done({score});}}));}
    draw();}
};
MINIS.kidroll={...MINIS.roll,
  head:"國小門口・接小朋友",zone:"國小門口",title:"誰還沒出來？",
  intro:"四年級要接 8 個小朋友，隊伍裡只有 6 個。在名單上點出還沒出來的兩個。點錯了，小朋友會說「我在這裡啦！」",
  names:["小宇","安安","小米","阿凱","妞妞","子恩","晴晴","大頭"],absent:["小宇","晴晴"]};
MINIS.kidgrade={...MINIS.grade,
  head:"安親・看作業",zone:"四年級安親教室",title:"找出第一個錯的地方",
  intro:"小宇的數習，三題。點出每一題第一個寫錯的那一行。",
  papers:[
   {who:"小宇",q:"38 × 4 = ?",lines:["個位：8 × 4 = 32，寫 2 進 3","十位：3 × 4 = 12","答：122"],bad:1,why:"十位要加上進位的 3：12 + 3 = 15。答案 152。"},
   {who:"小宇",q:"小明有 520 元，買了 3 本 128 元的書，還剩多少？",lines:["128 × 3 = 384","520 − 384 = 246","答：剩 246 元"],bad:1,why:"520 − 384 = 136，借位時十位只剩 1。答案 136 元。"},
   {who:"小宇",q:"一條緞帶 3/5 公尺，用掉 1/5 公尺，還剩多少？",lines:["3/5 − 1/5 = 2/0","答：剩 2/0 公尺"],bad:0,why:"分母一樣，分母不變、分子相減：2/5 公尺。"}
  ]};

/* ---------- 安親才會發生的事 ---------- */
EVENTS.push(
 {id:"kidfall",lines:["care"],phases:["class","leave"],make:()=>({target:{npc:"yu"},goal:"走廊傳來哭聲",
  pages:G=>[[null,"小宇在走廊跑，滑了一跤。膝蓋擦破一塊皮，他咬著嘴唇沒哭出聲。"],["yu","……我沒事。"]],
  choices:G=>[
   {label:"擦藥、貼 OK 繃，寫在聯絡簿上",fx:{pat:-3,par:6},log:"幫小宇擦藥並告知家長",res:G=>[[null,`你在聯絡簿寫：「今天 ${G.time} 在走廊跌倒，右膝擦傷，已消毒。」`],["yu","OK 繃上面有恐龍耶。"]]},
   {label:"「不要在走廊跑，起來。」",fx:{pat:3,par:-5},log:"叫小宇自己站起來",res:[[null,"他站起來了。晚上他媽媽看到膝蓋，打了一通電話來。"]]},
   {label:"打給媽媽，問要不要來接",fx:{par:3,ord:-3},log:"打給小宇媽媽",res:[[null,"「沒事沒事，小擦傷，謝謝老師告訴我。」"]]}]})},
 {id:"schoolcall",lines:["care"],phases:["pre","class"],make:()=>({auto:true,goal:"教室的分機響了",
  pages:G=>[[null,"電話是國小的班導打來的。"],[null,"「安安今天的國語作業本留在學校了。明天要交，你們那邊可以先讓她寫在白紙上嗎？」"]],
  choices:G=>[
   {label:"照著題目抄一份給她",fx:{ord:4,hp:-2},log:"幫安安抄一份作業",res:[[null,"你把生字格畫在白紙上。安安說：「老師的格子比我們老師的大。」"]]},
   {label:"請班導拍照傳過來",fx:{par:3},log:"請國小老師傳作業照片",res:[[null,"三分鐘後，手機收到四張照片。拍得有點歪。"]]}]})},
 {id:"pudding",lines:["care"],phases:["pre"],make:()=>({auto:true,goal:"點心送來了",
  pages:G=>[[null,"點心店送來了今天的布丁。"],[null,"你數了一下：三十個。今天三個班一共二十一個小朋友。"]],
  choices:G=>[
   {label:"退回九個",fx:{ord:4,hp:-2},log:"把多送的布丁退回去",res:[[null,"外送員嘆了一口氣，把多的抱回車上。"]]},
   {label:"留下來，晚上給國中部",fx:{par:4,ord:-2},set:{extraPudding:1},log:"多的布丁留給國中部",res:[[null,"你在冰箱貼了一張紙：「安親多的布丁，國中部請自取。」"]]}]})}
);
