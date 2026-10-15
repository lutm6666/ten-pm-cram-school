/* ================= 職業線：國中九年級班導（鄭老師） ================= */
/* 13:30 到班：班務、印考卷、登成績、打掃。17:20 學生到班，17:50 確認到班、沒到的打給家長。
   上課時在後面顧秩序、收手機；下課簽聯絡本、處理大家的需求。 */
LINES.jh={
 id:"jh",self:"hr",role:"國中班導",short:"班導",body:0x5b7fa6,shift:"13:30–21:30",
 pick:"帶國中九年級。印考卷、登成績、點到班、打電話、簽聯絡本。上課的是別人，班上的事都是你的。",
 cast:["pinyu","zhe","xiang","qing","teacher","boss","yun","xiangma"],
 stats:{hp:["體力",55],pat:["耐心",60],stu:["學生",50],par:["家長",50]},hidden:{},
 late:{fx:{stu:-4,par:-2},text:"班上已經在滑手機了。"},
 coda:"九年級的燈關了。聯絡本疊在桌上，每一本都簽了名。明天，段考倒數五天。",
 msgs:[["14:20","許老師","鄭老師，複習卷我改了一頁，檔案重傳了🙏"],["16:50","九年級家長群","子晴媽媽：老師，段考前可以多一次小考嗎？"],["18:05","主任","試聽生坐第三排靠窗，麻煩多看一下"],["20:40","阿翔媽媽","老師，他有到嗎？今天真的很謝謝你"]],
 preStatus:"準備中",endAt:"21:30",daylight:true,
 staff:["lin","wu","amy","hong","cai"],
 boards:{c9:"會考倒數 210 天\n段考：下週二、三"},
 zoneText:{"九年級教室":"你的班。十二個座位，後面黑板寫著會考倒數。","國中辦公室":"你的桌子。成績登記本、聯絡本、一整疊還沒改的考卷。","教材室":"影印機在這裡。下午兩點到四點，全補習班都在排隊。"},
 schedule:[["13:30","pre"],["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]],
 phaseStatus:{pre:"準備中",class:"上課中",break:"下課",leave:"放學",close:"收拾中"},
 bells:{class:["上課了","手機進籃子。許老師開始上課。"],break:["下課十分鐘","簽聯絡本、上廁所、搶電梯。"],leave:["放學","刷卡、等家長、搶電梯。"]},
 events:["quake","blackout","rain","delivery","nosebleed"],
 eventSlots:[{after:"j_score",t:"15:40",phase:"pre"},{after:"j_xiang",t:"18:40",phase:"class"},{after:"j_qing",t:"19:33",phase:"break"}],
 chats:["pinyu","zhe","xiang","qing","teacher","boss","yun","hong","cai"],
 start:[FLX(0,4.5),16.6],dead:G=>G.s.hp<=0||G.s.pat<=0,
 me:G=>({name:"你",title:`${G.pName}・九年級班導`,abbr:"導",color:"#2f5d8a"}),
 npcs:{yun:PC.yunDesk,boss:PC.bossDesk,teacher:null,cai:AT("g4podium",0,0,0),lin:PC.lin,wu:PC.wu,hong:null,amy:null,pinyu:null,zhe:null,xiang:null,qing:null,trial:null,parent:null,xiangma:null,bo:null,chenba:null,hr:null},
 steps:[
  {id:"j_arrive",chapter:{t:"13:30",title:"到班",sub:"段考倒數六天。班務清單比平常長一倍。",status:"準備中",rush:["數學、英文、理化的考卷要印。","昨天的小考還沒登。","教室還沒掃。"]},
   t:"13:30",target:{spot:"hrdesk"},goal:"上三樓，看今天的班務",action:"打開班務本",
   pages:G=>[[null,"三樓還沒有人。你的桌上放著班務本，第一頁是主任的字：「段考前一週，考卷一份都不能少。」"],[null,"今天要印：數學複習卷 15 份、英文小考 15 份、理化題本 15 份。昨天的小考要登記。教室要打掃。"]],
   choices:G=>[
    {label:"先印考卷，影印機下午會塞",fx:{ord:0,hp:-2,stu:2},set:{printFirst:1},log:"先下樓印考卷",res:[[null,"你抱著三份原稿下樓。電梯在一樓不動。"]]},
    {label:"先把昨天的成績登完",fx:{par:3},log:"先登成績",res:[[null,"你登到第五個人的時候，想起影印機。下午兩點以後，安親和美語都會來排。"]]}]},
  {id:"j_copy",t:"13:45",target:{spot:"copier"},goal:"下樓印考卷",action:"開始印",npc:{cai:AT("copier",1,.4,Math.PI/2)},after:{cai:AT("g4podium",0,0,0)},
   pages:G=>[[null,"影印機前，四年級的蔡老師抱著一疊練習卷的原稿。"],["cai","鄭老師也要印？我只有八張……"],[null,"你手上的考卷，加起來一百二十張。影印機發出「嗶——」的一聲，卡紙燈亮了。"]],
   choices:G=>[
    {label:"自己拉卡紙",mini:"jam",fx:r=>({hp:-3-2*Math.min(4,r.tears),pat:r.tears?-3:2}),log:r=>r.tears?`修影印機，撕破 ${r.tears} 次`:"修好影印機",res:r=>r.tears?[[null,"碎紙卡在滾輪裡，蔡老師拿鑷子幫你夾。"],["cai","我先去樓上用手寫好了。"]]:[[null,"四張紙完整拉出來。"],["cai","好厲害！那你先印，我等。"]]},
    {label:"讓蔡老師先印，八張很快",fx:{pat:3,hp:1},set:{letCai:1},log:"讓安親先用影印機",res:[["cai","謝謝謝謝！"],[null,"八份練習卷印完，輪到你的時候，影印機開始卡紙。你拉了十分鐘。"]]},
    {label:"「我們段考前一週，真的比較急。」",fx:{stu:3,pat:-3},log:"國中部先用影印機",res:[["cai","……好，那你先。"],[null,"她抱著原稿站在旁邊。等到第四十張的時候，她走回樓上了。"]]}]},
  {id:"j_score",t:"15:00",target:{spot:"hrdesk"},goal:"登記昨天的小考成績",action:"打開成績單",
   pages:G=>[[null,"三張小考卷，總分是學生自己加的。家長會在聯絡本上看到這個數字。"]],
   choices:G=>[
    {label:"一張一張核對",mini:"jhscore",fx:r=>({par:r.hits>=2?6:-4,hp:-2}),log:r=>`核對小考成績，抓到 ${r.hits}/3 個錯`,res:r=>r.hits>=2?[[null,"錯的地方都圈出來了。系統裡的數字是對的。"]]:[[null,"有一張漏看了。明天大概會有家長打來問。"]]},
    {label:"照學生寫的登",fx:{hp:3,par:-6},log:"成績照抄",res:[[null,"很快就登完了。"]]}]},
  {id:"j_clean",t:"16:30",target:{spot:"c9back"},goal:"打掃教室，排今天的座位",action:"排座位",
   pages:G=>[[null,"段考前一週，品妤昨天傳訊息說想坐第一排。阿哲的媽媽也說「讓他坐前面一點，被老師看著」。"],[null,"第一排只有四個位子。今天還有一個試聽生要坐。"]],
   choices:G=>[
    {label:"照小考成績排，前面是最需要被看著的",fx:{stu:4,par:4,hp:-3},set:{zheFront:1},log:"照成績把阿哲排到前面",res:[[null,"阿哲在第二排，品妤在第一排靠門，試聽生在第三排靠窗。"]]},
    {label:"照原本的座位，不動",fx:{hp:2},log:"座位不動",res:[[null,"阿哲還是最後一排靠窗。窗外看得到網咖的招牌。"]]},
    {label:"讓學生自己選",fx:{stu:2,par:-4},set:{freeSeat:1},log:"讓學生自己選座位",res:[[null,"你寫在白板上：「先到先選」。你已經知道最後一排會被誰搶走。"]]}]},
  {id:"j_bento",chapter:{t:"17:20",title:"到班",sub:"國中生陸續到班。先刷卡，再吃晚餐。",status:"到班中"},
   t:"17:25",target:{spot:"lockers"},goal:"收晚餐便當的錢",action:"拿出便當單",npc:{pinyu:C9("pinyu"),qing:C9("qing")},
   pages:G=>[[null,"便當單上：雞腿 6、排骨 4、素食 1。錢收了 9 份，便當訂了 11 個。"],["qing","老師，阿翔說他的先幫他墊……他等一下就到。"],[null,"還有一份沒付錢的，是阿哲的。他還沒到。"]],
   choices:G=>[
    {label:"先墊，記在聯絡本上請家長補",fx:{par:4,hp:-1},set:{paidFor:1},log:"先幫兩個人墊便當錢",res:[[null,"你在兩本聯絡本上寫：「今日便當 85 元，老師先代墊。」"]]},
    {label:"沒付錢的不訂，讓他們自己買",fx:{stu:-4,par:-2,pat:3},log:"沒付錢的便當退掉",res:[[null,"便當店老闆在電話那頭說：「已經做好了耶。」"]]}]},
  {id:"j_roll",chapter:{t:"17:50",title:"確認到班",sub:"上課前十分鐘。沒到的要打給家長。",status:"到班中"},
   t:"17:50",target:{spot:"c9door"},goal:"確認誰還沒到",action:"拿點名表",npc:{zhe:C9("zhe"),trial:C9("trial")},
   pages:G=>[[null,"刷卡紀錄和教室對一次。十二個人裡，有兩個還沒到。"]],
   choices:G=>[
    {label:"照刷卡紀錄一個一個點",mini:"roll",fx:r=>({stu:r.miss?1:4,pat:-2}),set:{rollDone:1},log:r=>`確認到班，點錯 ${r.miss} 次`,res:r=>[[null,r.miss?"點錯了一次，被阿哲說：「老師我在這啦。」":"阿翔、子涵沒到。"],[null,"子涵的媽媽早上就傳過請假訊息。阿翔沒有。"]]},
    {label:"在群組發一則「還沒到的請回覆」",fx:{par:-2,hp:2},log:"在群組請家長回覆",res:[[null,"群組安靜了三分鐘。然後子涵媽媽回：「早上有請假喔」。阿翔家沒有回。"]]}]},
  {id:"j_callma",t:"17:55",auto:true,goal:"打給阿翔媽媽",
   pages:G=>[[null,"你撥了阿翔媽媽的電話。背景很吵，有小孩的聲音。"],["xiangma","老師？我在你們樓下接小宇啊。阿翔沒到？他五點就說他出門了……"],[null,"電話那頭安靜了一下。你們都想到同一個地方：學校旁邊那間網咖。"]],
   choices:G=>[
    {label:"「我下樓跟您當面說。」",fx:{hp:-3,par:10},set:{metXiangma:1},log:"下樓跟阿翔媽媽當面談",res:[[null,"你搭電梯下樓。阿翔媽媽一手牽著小宇，一手在撥阿翔的手機。"],["xiangma","老師對不起……他最近都這樣。我先去網咖找他。"]]},
    {label:"「我先打給阿翔看看。」",fx:{stu:3,pat:-2},set:{calledXiang:1},log:"直接打給阿翔",res:[[null,"第三通，阿翔接了：「……我在路上啦。」背景有鍵盤聲。"]]},
    {label:"「我記下來，到了再跟您說。」",fx:{hp:2,par:-4},log:"記下阿翔缺席",res:[["xiangma","……好。"],[null,"她掛電話的聲音很重。"]]}]},
  {id:"j_xiang",chapter:{t:"18:00",title:"第一節",sub:"18:00–19:25・數學・許老師",status:"上課中"},
   t:"18:15",target:{npc:"xiang"},goal:"阿翔到了",npc:{xiang:[...PJ.xiangHall,DOOR],teacher:PJ.teacherPodium},after:{xiang:SEAT("c9","xiang")},
   pages:G=>[[null,"十八點十五分，阿翔出現在教室門口。他身上有一股網咖的菸味，手機還握在手上。"],["xiang","……老師，我等一下就交手機。"]],
   choices:G=>[
    {label:"在門口小聲問他去哪了",fx:{stu:5,hp:-2},set:{askedXiang:1},log:"小聲問阿翔遲到的原因",res:[["xiang","……我只是不想一直被比。我媽一直說小宇乖。"],[null,"他把手機放進籃子，走進教室。你在聯絡本上沒有寫「網咖」兩個字。"]]},
    {label:"「手機交出來，下課再說。」",fx:{stu:-2,par:3},log:"收手機，下課再談",res:[[null,"他把手機丟進籃子。下課的時候，他是第一個衝去電梯的。"]]},
    {label:"傳訊息告訴媽媽他到了",fx:{par:6},set:{toldMaArrived:1},log:"通知阿翔媽媽他已到班",res:[[null,"阿翔媽媽回了一大段話，最後一行是：「謝謝老師，真的。」"]]}]},
  {id:"j_zhe",chapter:{t:"19:25",title:"下課十分鐘",sub:"簽聯絡本、上廁所、搶電梯。",status:"下課"},
   t:"19:26",target:{npc:"zhe"},goal:"阿哲在走廊等你",npc:{zhe:PJ.zheHall},after:{zhe:SEAT("c9","zhe")},
   pages:G=>[["zhe","老師……退費單要去哪裡拿？"],[null,"他沒有看你，一直在摳書包的拉鍊。"],["zhe","我媽說繳了一整年。可是我從國一就聽不懂了。"]],
   choices:G=>[
    {label:"「先跟我說，你卡在哪裡。」",fx:{stu:8,pat:-4},set:{zheTalk:1},log:"陪阿哲聊他卡在哪裡",res:[["zhe","……分數。國一的分數我就不會了。後面全部都是分數。"],[null,"上課鐘響了。他說：「老師，不要跟我媽說我想退。」"]]},
    {label:"告訴他退費單在櫃台",fx:{hp:2},set:{refundForm:1},log:"告訴阿哲退費單在櫃台",res:[["zhe","喔。謝謝。"]]},
    {label:"「這件事要跟媽媽一起談。」",fx:{par:5,stu:-3},log:"請阿哲和媽媽一起談",res:[["zhe","……喔。"],[null,"他走回教室，坐下就趴著了。"]]}]},
  {id:"j_qing",t:"19:31",target:{npc:"qing"},goal:"子晴拿著聯絡本過來",npc:{qing:PJ.qingHall},after:{qing:SEAT("c9","qing")},
   pages:G=>[["qing","老師，聯絡本要簽……還有，學校要我參加英文演講比賽。"],["qing","練習時間是週四晚上，就是這裡上課的時間。我媽說段考比較重要。"]],
   choices:G=>[
    {label:"「週四的課我幫你錄影，你去比。」",fx:{stu:8,hp:-3},set:{speech:1},log:"支持子晴去比賽、課另外補",res:[["qing","真的可以嗎？"],["me","演講也是英文。九年級之後，這種機會就少了。"]]},
    {label:"「我幫你跟媽媽說。」",fx:{par:3,stu:5,hp:-3},set:{talkMom:1},log:"答應幫子晴跟媽媽談",res:[["qing","老師你人好好！"]]},
    {label:"「段考比較重要，先準備段考。」",fx:{par:4,stu:-5},log:"勸子晴先顧段考",res:[["qing","……嗯，我知道。"]]}]},
  {id:"j_note",chapter:{t:"19:35",title:"第二節",sub:"19:35–21:00・數學・許老師",status:"上課中"},
   t:"19:50",target:{spot:"c9back"},goal:"後排在傳紙條",action:"走過去",
   pages:G=>[[null,"許老師在檢討相似形的複習卷。後排兩個人在傳紙條，一個在笑。"],[null,"試聽生坐在第三排，也在看。"]],
   choices:G=>[
    {label:"走過去，把紙條收走，不說話",fx:{stu:3,pat:-2},log:"安靜收走紙條",res:[[null,"紙條上寫著：「段考完要不要去唱歌」。你把它折好，放進口袋。"]]},
    {label:"在後面輕輕敲桌子",fx:{stu:2},log:"敲桌子提醒",res:[[null,"他們坐正了。試聽生轉回去看白板。"]]},
    {label:"當場唸出來",fx:{stu:-6,par:2},set:{readNote:1},log:"當眾唸出紙條",res:[[null,"全班笑了，許老師的課停了一分鐘。傳紙條的那個人整節課都沒抬頭。"]]}]},
  {id:"j_boss",t:"20:20",target:{npc:"boss"},goal:"下樓找主任談人手",npc:{boss:PC.bossDesk},
   pages:G=>[["boss","鄭老師？上課中怎麼下來了。"],[null,"你把下午的事講了一遍：影印機、便當、阿翔、退費單、子晴的比賽。"],["boss","……所以你想要什麼？"]],
   choices:G=>[
    {label:"「下課時段需要一個人顧三樓走廊。」",fx:{par:3,hp:-2},set:{askHelp:1},log:"跟主任要下課時段的人手",res:[["boss","我讓阿宏下課時站一下走廊。先這樣，下個月再看。"]]},
    {label:"「阿哲的事，要不要先跟媽媽談基礎班？」",fx:{stu:5,par:3},set:{bossKnowsZhe:1},log:"跟主任談阿哲的退費",res:[["boss","從國一就沒跟上？那他要的是基礎班，不是退費。我明天打給林媽媽。"]]},
    {label:"「沒事，來看一下。」",fx:{hp:2},log:"沒提需求",res:[["boss","好，那你上去吧。"]]}]},
  {id:"j_out",chapter:{t:"21:00",title:"放學",sub:"刷卡、等家長、搶電梯。",status:"放學"},
   t:"21:03",target:{npc:"pinyu"},goal:"品妤還坐在位子上",npc:{pinyu:SEAT("c9","pinyu"),zhe:null,qing:null,xiang:null,trial:null,teacher:null},
   pages:G=>[[null,"大家都走了。品妤還坐在位子上，手放在肚子上。"],["pinyu","老師，我胃有點痛……沒事，可能是太緊張。我媽說要我段考考進前三。"]],
   choices:G=>[
    {label:"陪她下樓，順便跟來接的媽媽說一聲",fx:{hp:-3,par:6,stu:4},set:{pinyuMa:1},log:"陪品妤下樓、跟媽媽說她胃痛",res:[[null,"品妤媽媽聽完，沉默了一下：「……她都沒跟我說。」"]]},
    {label:"給她一杯溫水，問她最近睡得怎樣",fx:{stu:6,hp:-2},set:{pinyuSleep:1},log:"問品妤最近睡得好不好",res:[["pinyu","兩點睡，六點起來。我覺得還好……應該還好吧。"],[null,"你把這句話寫進了聯絡本的最後一行。"]]},
    {label:"「早點回家休息。」",fx:{hp:2},log:"叫品妤早點回家",res:[["pinyu","嗯。老師晚安。"]]}]},
  {id:"j_close",t:"21:15",target:{spot:"hrdesk"},goal:"簽聯絡本、登今天的考卷",action:"坐下來",
   pages:G=>[[null,"十二本聯絡本，十二張考卷。今天的事，要寫成家長看得懂的三行字。"]],
   choices:G=>[
    {label:"每本都寫一句今天的事",fx:{par:8,hp:-6},set:{notesAll:1},log:"每本聯絡本都寫一句話",res:[[null,"寫到阿哲那本，你停了很久，最後寫：「今天有問問題。」"]]},
    {label:"只寫成績，簽名",fx:{hp:3,par:-2},log:"聯絡本只寫成績",res:[[null,"二十分鐘寫完。你關燈的時候，三樓只剩電梯的聲音。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=["班導先倒了","你在國中辦公室的桌上趴著睡著了。主任叫醒你的時候，十點半了。"];
  else if((f.askedXiang||f.metXiangma)&&(f.zheTalk||f.bossKnowsZhe)&&s.stu>=68)t=["每個人的事都有人接住","阿翔為什麼去網咖、阿哲為什麼想退費。今天有人聽完了。"];
  else if(s.par>=72)t=["家長群組的定心丸","便當、到班、聯絡本，家長今天每一件都收到了。"];
  else if(s.stu>=72)t=["學生會找的班導","下課十分鐘，你的桌前排了三個人。"];
  else if(f.readNote)t=["那張紙條","全班笑了一分鐘。那個人，今天一直沒有抬頭。"];
  else t=["平安放學","印完、登完、點完、簽完。班導的大部分晚上，就是這樣過的。"];
  return {title:t[0],desc:t[1],dead,big:[[f.askedXiang?"有":"沒有","知道阿翔為什麼去網咖"],[f.zheTalk?"知道":"不知道","阿哲卡在哪裡"]]};
 }
};

/* ---------- 班導的小遊戲 ---------- */
MINIS.roll={
  head:"九年級・確認到班",zone:"九年級教室",title:"誰沒到？",
  intro:"刷卡紀錄和教室對一次。十二個人，在名單上點出還沒到的兩個。點錯會被學生笑。",
  names:["品妤","阿哲","阿翔","子晴","子涵","宇軒","思妤","冠廷","詠晴","家豪","佳穎","柏翰"],absent:["阿翔","子涵"],
  mount(el,done){const self=this;const present=this.names.filter(n=>!this.absent.includes(n)).sort(()=>Math.random()-.5);let found=0,miss=0;
    const seats=[...present,...self.absent.map(()=>"")].sort(()=>Math.random()-.5);
    el.innerHTML=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:8px 0">${seats.map(n=>`<div style="border:1px solid var(--rule);border-radius:3px;padding:6px 2px;text-align:center;font-size:.82rem;background:${n?"var(--surface)":"var(--tray)"};color:${n?"var(--ink)":"var(--muted)"}">${n||"空位"}</div>`).join("")}</div>
      <div class="lbl">名單</div><div style="display:flex;flex-wrap:wrap;gap:6px">${[...this.names].sort(()=>Math.random()-.5).map(n=>`<button class="choice" data-n="${n}" style="padding:6px 10px">${n}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(b.disabled)return;const n=b.dataset.n;b.disabled=true;
      if(self.absent.includes(n)){found++;b.style.borderColor="var(--green)";feed.textContent=`${n}：沒到。`;}else{miss++;b.style.borderColor="var(--red)";feed.textContent=`${n}：「我在這裡啦！」`;}
      if(found===self.absent.length){feed.textContent=`找到了：${self.absent.join("、")}沒到。點錯 ${miss} 次。`;el.querySelectorAll("[data-n]").forEach(x=>x.disabled=true);done({miss});}}));}
};
MINIS.jhscore={...MINIS.grade,
  head:"小考成績・核對",zone:"國中辦公室",title:"找出算錯的那一行",
  intro:"三張小考卷，總分是學生自己加的。點出第一個算錯的那一行。",
  papers:[
   {who:"阿翔",q:"第一大題 32、第二大題 18、第三大題 24",lines:["32 + 18 = 50","50 + 24 = 64","總分 64"],bad:1,why:"50 + 24 = 74。總分 74。"},
   {who:"子晴",q:"第一大題 38、第二大題 29、第三大題 27",lines:["38 + 29 = 67","67 + 27 = 84","總分 84"],bad:1,why:"67 + 27 = 94。總分 94。"},
   {who:"阿哲",q:"第一大題 12、第二大題 6、第三大題 9",lines:["12 + 6 = 18","18 + 9 = 27","總分 72"],bad:2,why:"總分是 27，不是 72。他把數字寫反了——還是故意的？"}
  ]};
