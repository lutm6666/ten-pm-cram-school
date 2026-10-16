/* ================= 第二天：跑堂數學、櫃台、主任 ================= */

/* ---------- 跑堂數學・第二天：先上八年級，再上九年級 ---------- */
LINES2.teacher={...LINES.teacher,day:2,
 pick:"第二天・週三。先上八年級，再上九年級。昨天答應的、沒答應的，今天都會回來找你。",
 coda:"第二天比第一天難。因為你已經知道每個人叫什麼名字了。",
 msgs:[["17:36","鄭老師","許老師，九年級第一節考英文模擬，第二節是您的數學模擬，考完麻煩您檢討🙏"],["18:30","媽","今天也會很晚嗎？"],["19:50","另一間補習班","許老師，明天的講義收到了嗎？"],["21:05","何主任","下課後下來一下，寒假的事。"]],
 boards:{c8:"段考複習：乘法公式與多項式\n(a + b)² = a² + 2ab + b²",c9:"第一節 英文模擬（鄭老師）\n第二節 數學模擬＋檢討（許老師）"},
 teachAt:G=>G.clock<T("19:25")?"c8podium":"c9podium",
 events:["quake","blackout","roach","rain"],
 eventSlots:[{after:"t2_c8",t:"18:25",phase:"class"},{after:"t2_c9",t:"19:58",phase:"class"},{after:"t2_pinyu",t:"20:52",phase:"class"}],
 npcs:{...LINES.teacher.npcs,bo:SEAT("c8","bo"),hr:PJ.hrDesk,zhe:null,pinyu:SEAT("c9","pinyu"),qing:SEAT("c9","qing"),xiang:SEAT("c9","xiang")},
 steps:[
  {id:"t2_arrive",chapter:{t:"17:30",title:"第二天・週三",sub:"今天第一節是八年級，第二節才是九年級。",status:"趕路中",rush:["八年級的班導今天請假。","九年級第一節在考段考模擬。"]},
   t:"17:30",target:{npc:"yun"},goal:"到櫃台拿今天的資料",
   pages:G=>{const y=pa(G,"yun"),p=pv(G),l=[["yun","許老師！今天八年級的班導請假，阿宏幫忙顧，講義放在八年級講桌。"]];
     if(p.enrolled)l.push(["yun","試聽的王同學下週一開始上，主任把他排在第三排。"]);
     if(p.zheOpen)l.push(["yun","阿哲的媽媽中午打來，問段考完那個週四提早半小時是幾點。我說五點半。"]);
     return l;},
   choices:G=>[
    {label:"在茶水間吃完便當再上樓",fx:{hp:10},set:{ate2:1},log:"上課前吃完晚餐",res:[[null,"今天微波爐前面沒有人排隊。九年級今天考模擬考，鄭老師她們都提早吃了。"]]},
    {label:"便當帶上樓，先看八年級的講義",fx:{hp:-2,stu:3},log:"沒吃晚餐，先看講義",res:[[null,"電梯裡只有你和便當。"]]}]},
  {id:"t2_c8check",t:"17:45",target:{spot:"c8podium"},goal:"確認八年級的講義",action:"翻講義",
   pages:G=>[[null,"八年級講桌上：講義九份，小考卷九份。名單上是十二個人。"],[null,"班導請假，沒有人知道是誰印的、為什麼少了三份。"]],
   choices:G=>[
    {label:"下樓自己補印三份",fx:{hp:-4,stu:3},set:{printed8:1},log:"自己下樓補印八年級講義",res:[[null,"你搭電梯下去、印、再上來。五點五十八分，講義放到每張桌上。"]]},
    {label:"兩人共用一份，小考題寫在白板上",fx:{voice:-4,stu:-1},log:"八年級講義兩人共用",res:[[null,"白板右半邊寫滿了小考題。最後一排的同學舉手：「老師，看不到。」"]]}]},
  {id:"t2_c8",chapter:{t:"18:00",title:"第一節・八年級",sub:"18:00–19:25・段考複習：乘法公式",status:"上課中"},
   t:"18:00",target:{spot:"c8podium"},goal:"走上講台，開始上課",
   pages:G=>[[null,"八年級跟九年級不一樣：還沒有會考的影子，聲音大一倍，問題也多一倍。"],[null,"第三排的小柏把鉛筆盒當鼓在敲。"]],
   choices:G=>[
    {label:"先來五題暖身搶答",note:"限時",mini:"quiz8",fx:r=>({voice:-8,stu:r.right>=4?10:r.right>=2?4:-2}),log:r=>`八年級暖身五題，答對 ${r.right} 題`,
     res:r=>r.right>=4?[[null,"搶答搶到有人站起來。小柏的鉛筆盒終於停了。"]]:[[null,"答對的不多。但至少小柏不敲了，他在想答案。"]]},
    {label:"用紙片拼一個大正方形，複習 (a + b)²",note:"從看得到的東西開始",fx:{voice:-6,stu:8},set:{straws:1},log:"用紙片拼正方形複習乘法公式",res:[[null,"一大塊 a²、一小塊 b²、兩長條 ab。你在講桌上把四張紙片拼起來，剛好是一個邊長 a + b 的正方形。"],[null,"小柏從第三排站起來看：「欸，真的耶。」"]]}]},
  {id:"t2_bo",t:"18:40",target:{npc:"bo"},goal:"小柏舉手",
   pages:G=>{const y=pa(G,"yun"),l=[["bo","老師，學這個以後要幹嘛？我又不當數學老師。"],[null,"全班笑了。但每個人都在等你怎麼回。"]];
     if(y.boFound)l.push([null,"你想起小芸說過，昨天晚上小柏下課跑去 7-11，是她把人找回來的。他爸爸在工地上班。"]);return l;},
   choices:G=>{const y=pa(G,"yun"),c=[];
     if(y.boFound||y.boNotice||y.boDad||y.boTold)c.push({label:"「你爸在工地，鋪地磚算面積就是在算這個。」",note:"(a + b)²",fx:{stu:12,voice:-4},set:{boHook:1},log:"用工地鋪地磚回答小柏",res:[["me","一間房間要鋪成正方形，大片的、小片的、長條的磚各要幾片？你爸每天都在算 (a + b)²。你回去問他。"],["bo","……蛤，真的假的。"],[null,"他把講義翻到下一頁，第一次自己往下寫。"]]});
     c.push({label:"教他用乘法公式心算",fx:{stu:8,voice:-5},set:{boMental:1},log:"用心算複習乘法公式",res:[["me","99 的平方怎麼算？100 減 1，(100 − 1)² = 10000 − 200 + 1。"],["bo","……9801？"],["me","對。你剛剛三秒就算出來了。"]]});
     c.push({label:"「段考會考。」",fx:{stu:-4,voice:2},log:"跟小柏說段考會考",res:[["bo","喔。"],[null,"他坐下了，鉛筆盒又開始響。"]]});return c;}},
  {id:"t2_zhe",chapter:{t:"19:25",title:"下課十分鐘",sub:"從八年級走到九年級，中間會經過阿哲。",status:"下課"},
   t:"19:27",target:{npc:"zhe"},goal:"阿哲在九年級門口",npc:{zhe:PJ.zheHall},after:{zhe:SEAT("c9","zhe")},
   pages:G=>{const p=pv(G);
     if(p.shamedZhe)return [[null,"阿哲站在九年級門口。看到你走過來，他把頭轉開。"],[null,"昨天他站在白板前面，寫了一個 x 就停住。有人笑了。"]];
     if(p.zheOpen)return [["zhe","老師，剛剛英文模擬，我把會的都寫完了。第一次寫完。"],["zhe","等一下數學，分數的題目我先跳過。"]];
     if(p.nudgedZhe)return [["zhe","老師，昨天那題……是 5/6 對不對？我回家問我姊。"]];
     return [[null,"阿哲在九年級門口滑手機。看到你，把手機收進口袋。"],["zhe","……老師好。"]];},
   choices:G=>{const p=pv(G);
     if(p.shamedZhe)return [
      {label:"「昨天叫你上台，是我不對。」",fx:{stu:12,hp:-2},set:{sorryZhe:1},log:"跟阿哲道歉",res:[["zhe","……喔。"],[null,"他沒有多說什麼。但上課鐘響時，他坐到了倒數第二排。"]]},
      {label:"點點頭，走進教室",fx:{stu:-4},log:"沒跟阿哲說話",res:[[null,"你們都沒說話。"]]}];
     if(p.zheOpen)return [
      {label:"「寫完了，就是贏一半。」",fx:{stu:10,hp:-2},set:{zheWin:1},log:"稱讚阿哲把會的寫完",res:[["zhe","……贏一半。"],[null,"他把這三個字念了兩次，才走進教室。"]]}];
     if(p.nudgedZhe)return [
      {label:"「對，5/6。你自己算出來的。」",fx:{stu:10},set:{zheWin:1},log:"確認阿哲算對了",res:[["zhe","我姊教的啦……可是是我算的。"]]}];
     return [
      {label:"問他今天模擬考寫得怎樣",fx:{stu:5,hp:-2},set:{zheAsked:1},log:"問阿哲模擬考",res:[["zhe","……寫了一半。分數的都不會。"],["me","一半也是一半。"]]},
      {label:"叫他先進教室",fx:{stu:-2},log:"叫阿哲進教室",res:[[null,"他走進去，坐到最後一排。"]]}];}},
  {id:"t2_c9",chapter:{t:"19:35",title:"第二節・九年級",sub:"19:35–21:00・數學模擬五十分鐘，接著檢討",status:"上課中"},
   t:"19:36",target:{spot:"c9podium"},goal:"走上講台，發數學模擬卷",action:"發考卷",
   pages:G=>[[null,"九年級第一節剛考完英文模擬。大家的臉都是灰的。"],[null,"第二節是數學模擬：五十分鐘，考完你直接檢討。"]],
   choices:G=>[
    {label:"在後面慢慢巡，記下大家停住的題號",fx:{stu:4,hp:-2},set:{watchMath:1},log:"監考數學模擬，記下卡住的題號",res:[[null,"第 14 題前面，停住的筆最多。"]]},
    {label:"坐在講台上改八年級的小考",fx:{hp:2,stu:-1},log:"監考時改八年級小考",res:[[null,"改到一半抬頭，阿翔在看窗外。"]]}]},
  {id:"t2_review",t:"20:27",target:{spot:"c9podium"},goal:"收卷，檢討錯最多的三題",action:"收卷",
   pages:G=>[[null,"數學模擬卷收回來了。你邊翻邊挑出錯最多的三題。"],[null,G.f.watchMath?"跟你巡堂時記下的題號一樣：第 14 題最多人停住。":"還剩半小時。"]],
   choices:G=>[
    {label:"直接講錯最多的三題",note:"找出錯在哪一行",mini:"grade2",fx:r=>({voice:-6,stu:r.hits>=2?10:2}),log:r=>`檢討模擬考，抓對 ${r.hits}/3`,
     res:r=>r.hits>=2?[[null,"三題講完，有人在下面小聲說：「原來是這裡。」"]]:[[null,"有一題你也講得不清楚。品妤在講義角落打了一個問號。"]]},
    {label:"先讓他們站起來動一動，講一個笑話",fx:{voice:-4,stu:6,hp:-1},log:"考完先帶氣氛",res:[["me","你們知道數學老師最怕什麼嗎？……負評。因為他們會開根號。"],[null,"沉默三秒，然後後排笑了。笑的是你講得很爛。"]]}]},
  {id:"t2_pinyu",t:"20:45",target:{npc:"pinyu"},goal:"品妤在講義上畫了一個問號",
   pages:G=>{const p=pv(G),l=[["pinyu","老師，模擬考第 14 題……我列了比例，可是答案跟詳解不一樣。"]];
     if(p.stayedPinyu)l.push(["pinyu","昨天你陪我做完那題之後，我昨天……十二點半就睡了。比平常早。"]);return l;},
   choices:G=>[
    {label:"讓她上台講她的算法",note:"錯在哪，全班一起看",fx:{stu:10,voice:-3},set:{pinyuBoard:1},log:"讓品妤上台講她的算法",res:[[null,"她在白板上寫了三行。第二行，對應邊列反了。"],[null,"她自己看出來，轉頭說：「啊。」全班都笑了，她也笑了。"]]},
    {label:"走過去，在她講義上圈出錯的那一行",fx:{stu:5},log:"幫品妤圈出錯誤",res:[["pinyu","……對應邊。我又把它對反了。"]]}]},
  {id:"t2_after",chapter:{t:"21:00",title:"放學",sub:"國中生搶電梯，走廊很快就空了。",status:"放學"},
   t:"21:02",target:{spot:"c9podium"},goal:"回講台收東西",npc:{pinyu:null,qing:null,xiang:null,zhe:G=>pv(G).zheOpen||G.f.zheWin||G.f.sorryZhe?AT("c9door",-1,.4,Math.PI):null},
   pages:G=>{const l=G.f.straws?[[null,"講桌上還留著八年級那節剪的紙片正方形，你順手帶上來的。"]]:[];if(pv(G).zheOpen||G.f.zheWin||G.f.sorryZhe)l.push([null,"阿哲站在門口沒走。"]);l.push([null,"你還要騎二十分鐘回家。明天下午的國小五年級分數講義還沒看完。"]);return l;},
   choices:G=>{const c=[];
     if(pv(G).zheOpen||G.f.zheWin||G.f.sorryZhe)c.push({label:"給阿哲一張分數的練習題",note:"明天下午你剛好要上分數",fx:{hp:-3,stu:10},set:{zheSheet:1},log:"把國小五年級的分數講義給阿哲",res:[["me","這是我明天要上五年級的。你先寫，寫不出來沒關係。"],["zhe","……五年級喔。"],[null,"他把講義捲起來，塞進書包側袋。沒有說不要。"]]});
     c.push({label:"擦白板，下樓",fx:{hp:3},log:"擦白板下樓",res:[[null,"白板擦乾淨了。明天八年級的同學應該還會記得 (a + b)²。"]]});return c;}},
  {id:"t2_boss",t:"21:12",target:{npc:"boss"},goal:"主任在樓下等你",npc:{boss:PC.bossDesk,zhe:null},
   pages:G=>{const p=pv(G),b=pa(G,"boss"),l=[];
     if(p.baseWinter||b.baseClass)l.push(["boss","寒假的分數基礎班排好了，週二週四晚上。林媽媽今天下午來簽了。"]);
     else l.push(["boss","阿哲的媽媽今天來過，說要再想想退費的事。"]);
     if(p.winter4)l.push(["boss","寒假你答應四天，我排好了。……你看起來很累。"]);
     else if(p.winter2)l.push(["boss","寒假你說兩天。我想問，八年級能不能也給你？七點二十五八年級下課的時候，好幾個學生在電梯口說今天數學聽得懂。"]);
     else l.push(["boss","寒假的事，你想好了嗎？"]);
     return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.winter4)c.push({label:"「四天太多了。改三天，第四天給基礎班。」",fx:{hp:4,stu:4},set:{winter3:1},log:"寒假改成三天加基礎班",res:[["boss","……好。你說的對。"]]});
     c.push({label:"「八年級我可以。」",fx:{hp:-4,par:5},set:{take8:1},log:"答應寒假也上八年級",res:[["boss","太好了。"],[null,G.f.boHook?"你騎車回家的時候，想起小柏那句：「真的假的。」他今天大概會回去問他爸。":G.f.boMental?"你騎車回家的時候，想起小柏三秒算出 9801 的樣子。":"你騎車回家的時候，想起小柏敲鉛筆盒的聲音。八年級，還有一整個寒假。"]]});
     c.push({label:"「我回去想一下，明天回您。」",fx:{hp:3},log:"寒假的事明天再回",res:[["boss","好，不急。路上小心。"]]});return c;}}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,f=G.f;
  let t;
  if(dead&&s.hp<=0)t=["跑堂跑倒了","兩個班上完，你在國中老師休息室的椅子上睡著了。"];
  else if(dead)t=["失聲的週三","九年級還沒講完，你的聲音就沒了。鄭老師幫你把錯題寫在白板上。"];
  else if(f.boHook&&(f.zheSheet||f.zheWin)&&s.stu>=70)t=["有人回家問了爸爸","小柏會回家問他爸鋪地磚的事，阿哲書包裡有一張五年級的分數題。今天教的不只是數學。"];
  else if(f.sorryZhe)t=["說出口的道歉","昨天那一聲笑，今天終於有人收回來了。"];
  else if(s.stu>=75)t=["兩個班都記得的老師","八年級記得 (a + b)²，九年級記得錯在哪一行。"];
  else t=["平安下課","兩個班，三個小時。騎車回家，明天下午還有別間的課。"];
  return {title:t[0],desc:t[1],dead,big:[[f.boHook?"有":"沒有","小柏回家要問的事"],[f.zheSheet?"有":"沒有","阿哲書包裡的分數題"]]};
 }
};
MINIS.quiz8={...MINIS.quiz,head:"八年級・暖身搶答",zone:"八年級教室",
  qs:[["(x + 3)² 展開？",["x² + 6x + 9","x² + 9","x² + 3x + 9","2x + 6"],0],["√49 = ?",["7","±7","49","24.5"],0],["(a + b)² = ?",["a² + 2ab + b²","a² + b²","a² + ab + b²","2a + 2b"],0],["用乘法公式算 101² = ?",["10201","10101","10001","1021"],0],["√2 大約是？",["1.414","1.732","2","1.2"],0]]};
MINIS.grade2={...MINIS.grade,head:"九年級・模擬考檢討",zone:"九年級教室",
  intro:"錯最多的三題。點出每一題第一個寫錯的那一行。",
  papers:[
   {who:"模擬考第 14 題",q:"△ABC ∼ △DEF，AB = 4、BC = 6、DE = 6，求 EF",lines:["AB/DE = BC/EF","4/6 = EF/6","EF = 4"],bad:1,why:"代入時要跟上一行對應：4/6 = 6/EF，EF = 9。"},
   {who:"模擬考第 9 題",q:"竿子 1.5 公尺、影長 2 公尺；同時樹影 12 公尺，樹高？",lines:["1.5 : 2 = 12 : 樹高","樹高 = 16 公尺"],bad:0,why:"高對高、影對影：1.5 : 2 = 樹高 : 12，樹高 = 9 公尺。"},
   {who:"模擬考第 18 題",q:"相似比 3 : 5，大三角形面積 50，小三角形面積？",lines:["面積比 = 3 : 5","x : 50 = 3 : 5","x = 30"],bad:0,why:"面積比是相似比的平方 9 : 25，所以 x = 18。"}
  ]};

/* ---------- 櫃台・第二天 ---------- */
LINES2.yun={...LINES.yun,day:2,
 busy:[["12:00","17:25",null,"櫃台日常","接電話、收講義費、回家長訊息。",15],["17:55","21:15",null,"國中上課中","補印講義、接電話、整理今天的收據。",15]],
 carryH:(G,h)=>{G.h.missed=Math.max(0,Math.round((h.missed||0)-(h.cleared||0)));},
 pick:"第二天・週三。國小中午就放學，櫃台十二點開。昨天沒回的電話，今天都會再打來。",
 coda:"第二天的電話，有一半是昨天的回音。你記得每一通的開頭。",
 msgs:[["12:08","林老師","小芸，今天有家長改接送的話直接打我手機🙏"],["15:48","何主任",G=>pa(G,"boss").bossDesk?"放學那一小時，我會下來":"放學那一小時人多，有事打分機給我"],["19:10","妹妹","毛線今天沒有抓衛生紙。牠抓了窗簾。"],["21:32","媽","今天也很晚喔？"]],
 schedule:[["12:00","pre"],["17:00","leave"],["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]],
 eventSlots:[{after:"y2_zhang",t:"14:40",phase:"pre"},{after:"y2_trial",t:"18:30",phase:"class"},{after:"y2_bo",t:"20:15",phase:"class"}],
 npcs:{...LINES.yun.npcs,mom:null,anma:null},
 steps:[
  {id:"y2_open",chapter:{t:"12:00",title:"第二天・週三",sub:"國小中午放學，櫃台提早開。",status:"營業中",rush:["十二點半，三個安親老師同時出發。","下午三點，林媽媽約了主任。"]},
   t:"12:00",target:{spot:"counterIn"},goal:"坐進櫃台，看今天的便利貼",action:"看便利貼",
   pages:G=>{const p=pv(G),b=pa(G,"boss"),l=[[null,b.yunEarly?"主任昨天請你週三提早來。你十一點五十就到了，大廳的燈是你開的。":"週三的櫃台十二點就要開。國小十二點四十放學，安親的小朋友十二點五十五回來。"]];
     const notes=[];if(p.linAppt)notes.push("「林媽媽 15:00 主任」");if(p.retry)notes.push("「王，談報名，17:50」");if(p.enrolled)notes.push("「王同學：報名表、收據影本」");if(G.h.missed-G.h.cleared>0)notes.push(`「昨天沒回的電話 ${Math.round(G.h.missed-G.h.cleared)} 通」`);
     l.push([null,notes.length?`螢幕邊框上的便利貼：${notes.join("、")}。`:"螢幕邊框上只剩一張便利貼：「記得吃晚餐」。"]);return l;},
   choices:G=>[
    {label:"挑最急的三件先處理",mini:"summary",fx:r=>({ord:r.v>=7?10:r.v>=4?4:-4,pat:-2,cleared:r.v>=7?1:0}),log:r=>`挑三件事先做（${r.v>=7?"挑得很準":r.v>=4?"還可以":"挑錯了"}）`,res:r=>r.v>=7?[[null,"三張便利貼撕下來。這是今天最安靜的二十分鐘。"]]:[[null,"處理完三件，最急的那件還貼在螢幕上。"]]},
    {label:"先回昨天沒回的電話",fx:{par:5,hp:-3,cleared:1},log:"先回昨天沒回的電話",res:[[null,"第一通：「喔，你們終於回了。」第二通沒人接。第三通說謝謝。"]]}]},
  {id:"y2_calls",t:"12:35",auto:true,goal:"電話一通接一通",
   pages:G=>[[null,"十二點三十五，三個安親老師都出門了。電話開始響。"],[null,"「今天阿嬤接，不是我。」「小米今天我五點五十到。」「安安今天我自己去接！」"],[null,"三通電話，三個改變。安親老師現在都在國小門口。"]],
   choices:G=>[
    {label:"一通一通寫在接送表上，再傳給老師",fx:{ord:6,hp:-3,par:3},set:{pickupLog:1},log:"把改接送寫進接送表",res:[[null,"接送表上多了三行。你拍照傳到安親老師的群組。"],["cai","（貼圖）收到！"]]},
    {label:"直接轉給老師的手機",fx:{pat:2,par:-3,missed:1},log:"把改接送轉給安親老師",res:[[null,"蔡老師的手機沒接。她在校門口點名，手上舉著牌子。"]]}]},
  {id:"y2_back",t:"12:57",target:{spot:"door"},goal:"安親的小朋友回來了",action:"開門",
   pages:G=>[[null,"三個隊伍一起進門。大廳一下子塞滿了書包和室內鞋。"],[null,"小米站在門口不動，臉上有淚痕。她剛剛跟錯了隊伍。"]],
   choices:G=>[
    {label:"蹲下來問她：「你的兔子叫什麼名字？」",fx:{par:4,pat:-2},log:"在門口安撫小米",res:[["mi","……布丁。"],[null,"她牽著蔡老師的手上了二樓。回頭看了你一眼。"]]},
    {label:"請蔡老師先帶她上樓",fx:{ord:3},log:"請安親老師帶小米上樓",res:[[null,"大廳空了。只剩一隻掉在地上的室內鞋。"]]}]},
  {id:"y2_quiet",t:"13:15",target:{spot:"counterIn"},goal:"午休時間，電話又響了",action:"接電話",
   pages:G=>[[null,"二樓在午休，整棟樓安靜得聽得到冷氣聲。櫃台的電話響了第三聲。"]],
   choices:G=>[
    {label:"壓低聲音接，記下來再回",fx:{par:4,hp:-1},log:"午休時間小聲接電話",res:[[null,"是國中家長問段考前的課輔時間。你用氣音講完，對方也跟著小聲起來。"]]},
    {label:"把鈴聲調小，讓它轉語音",fx:{pat:3,par:-2},set:{missedNap:1},log:"午休時讓電話轉語音",res:[[null,"語音信箱多了一則留言。你在便利貼上寫：13:15，回電。"]]}]},
  {id:"y2_zhang",t:"14:10",target:{npc:"zhangma"},goal:"張媽媽又來了",npc:{zhangma:PC.zhangLobby},after:{zhangma:null},
   pages:G=>{const c=pa(G,"care"),b=pa(G,"boss"),l=[];
     if(c.trialKid||b.trialWeek)l.push(["zhangma","我來填下週一試讀的資料。"],["zhangma",b.carePrice?"還有，主任說的早鳥價，可以寫在收據上嗎？":"試讀那一週，需要先繳什麼嗎？"]);
     else l.push(["zhangma","我昨天回去想了一下。對面一個月便宜六百……可是這邊的老師有問我他卡在哪裡，對面沒有人問。"],["zhangma","我還是想先試讀看看。"]);return l;},
   choices:G=>[
    {label:"填試讀單，告訴她第一天要帶什麼",fx:{par:6,ord:3},set:{zhangForm:1},log:"幫張媽媽填試讀單",res:[["me","室內鞋、水壺、一本聯絡簿。其他的我們都有。"],["zhangma","好，那下週一見。"]]},
    {label:"請主任出來說明價錢",min:10,fx:{pat:-2,par:3},log:"請主任說明價錢",res:[[null,"主任在講電話。張媽媽在沙發上等了十分鐘。"]]}]},
  {id:"y2_lin",t:"15:00",target:{npc:"mom"},goal:"林媽媽到了",npc:{mom:AT("counter",-.8,.8)},after:{mom:PC.zhangConsult},
   pages:G=>{const p=pv(G),l=[];
     if(p.linAppt)l.push(["mom","三點，我準時到了。主任呢？"]);
     else if(p.teacherNoBreak)l.push(["mom","昨天謝謝你幫我轉給鄭老師。她很有耐心，可是講完了，阿哲還是說不想來。"],["mom","所以今天我自己來了。我想跟主任當面談。"]);
     else l.push(["mom","昨天打來，你們說老師在忙。今天我自己來了。"]);
     l.push([null,"她手上拿著一張摺起來的紙。是退費單。"]);return l;},
   choices:G=>[
    {label:"帶她進諮詢室，倒杯水，再請主任",fx:{par:8,hp:-2},set:{linToBoss:1},log:"帶林媽媽進諮詢室",res:[["mom","……謝謝。"],[null,"你敲主任室的門。主任把電話掛掉，站起來。"]]},
    {label:"「退費單給我，我先幫您試算。」",fx:{ord:4,par:-4},log:"幫林媽媽試算退費",res:[[null,"退費只能退一半。你把數字寫給她看。"],["mom","一半？那我兒子這半年算什麼？"]]}]},
  {id:"y2_ama",t:"16:20",target:{npc:"ama"},goal:"李阿嬤來了",npc:{ama:PC.amaLobby},after:{ama:null,mom:null},
   pages:G=>{const p=pv(G);
     if(p.paid===0&&p.payDiff>0)return [["ama","小姐，昨天的錢……安安媽媽看了收據，說好像多收了六百。"],[null,"阿嬤把收據攤在櫃台上，上面的總數多寫了 600。"]];
     if(p.paid===0)return [["ama","小姐，昨天你找給我的錢……我回家數，好像多了六百。"],[null,"阿嬤從信封裡拿出六張百元鈔，攤在櫃台上。"]];
     return [["ama","小姐，安安媽媽今天回來了。她說公司補助要收據的影本。"],...(p.payLate?[[null,"是昨天放學高峰時，阿嬤在沙發上等了一陣子才開好的那張。"]]:[]),[null,"她從布包裡拿出一個保溫杯：「這是綠豆湯，給你。」"]];},
   choices:G=>{const p=pv(G);
     if(p.paid===0&&p.payDiff>0)return [
      {label:"道歉，退 600 元，重開收據",fx:{par:4,ord:6},set:{amaFix:1},log:"退還李阿嬤多收的錢",res:[["me","阿嬤，對不起，是我算錯了。"],["ama","沒關係啦，人都會算錯。"]]}];
     if(p.paid===0)return [
      {label:"道謝，重新開一張正確的收據",fx:{par:8,ord:6},set:{amaFix:1},log:"李阿嬤送回多找的錢",res:[["me","阿嬤，謝謝你。是我算錯了。"],["ama","數錢我很會，我以前在菜市場賣菜。"]]}];
     return [
      {label:"印收據影本，蓋章給她",fx:{par:5,hp:-1},log:"幫李阿嬤印收據影本",res:[["ama","你蓋章蓋得好正。"],[null,"綠豆湯還是溫的。"]]},
      {label:"「綠豆湯不用啦，阿嬤留著喝。」",fx:{par:2},log:"婉拒李阿嬤的綠豆湯",res:[["ama","不行，我煮了一整鍋。"],[null,"保溫杯最後還是留在櫃台上。"]]}];}},
  {id:"y2_rush",chapter:{t:"17:00",title:"放學高峰",sub:"電話、廣播、家長交代、繳費、刷卡，一起來。",status:"放學高峰"},
   t:"17:25",target:{spot:"counterIn"},goal:"櫃台前又排了三個家長",action:"開始處理",npc:{boss:G=>pa(G,"boss").bossDesk?AT("counterIn",1.1,0,0):PC.bossDesk},after:{boss:PC.bossDesk},
   pages:G=>{const b=pa(G,"boss"),l=[[null,"安安媽媽在大廳等安安，阿翔媽媽說她晚上要上三樓，國中生陸續刷卡。電話在響。"]];
     if(b.bossDesk)l.push([null,"何主任真的下來了。他站在你旁邊，拿起第二支電話：「您好，補習班。」"]);
     else if(b.yunLeave)l.push([null,"主任室的門關著。你昨天說了「好」，今天還是一個人。"]);
     else l.push([null,"你只有一雙手。"]);return l;},
   choices:G=>[
    {label:"一件一件處理",mini:"rush",fx:r=>{const b=pa(G,"boss").bossDesk?3:0;return {par:r.ok*2-8-(r.wrong||0)*2+b,ord:r.ok>=7?6:r.ok>=5?2:-4,pat:-6+b,missed:r.drop};},log:r=>`放學高峰處理好 ${r.ok} 件${r.wrong?`，弄錯 ${r.wrong} 件`:""}，漏掉 ${r.drop} 件`,
     res:r=>r.ok>=7?[[null,"這一波過去了，大廳空了一半。你喝了一口阿嬤的綠豆湯。"]]:[[null,"有幾件沒顧到。便利貼又多了兩張。"]]},
    {label:"先廣播，再一個一個來",fx:{ord:4,pat:-3,par:-2},log:"先廣播再處理家長",res:[[null,"「四年級安安，媽媽來接囉。」二樓傳來一聲很大的「耶——」。"]]}]},
  {id:"y2_trial",t:"17:52",target:{npc:"parent"},goal:"王媽媽到了",npc:{parent:AT("counter",-.9,.8)},after:{parent:null},
   pages:G=>{const p=pv(G),b=pa(G,"boss"),l=[];
     if(p.retry)l.push(["parent","我們來談報名的事了。他昨天回家說，數學老師講的他聽得懂。"]);
     else if(p.enrolled)l.push(["parent","我來繳學費，順便拿下週一的講義。"]);
     else l.push(["parent","我們想了一下，想來問清楚報名的事。"]);
     if(p.discount)l.push(["parent","昨天你說的早鳥價……還算數吧？"],[null,b.discount?"主任昨天也給了她折扣。兩個折扣，疊不疊？":"主任不知道你昨天說了什麼。"]);
     return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.discount){
      c.push({label:"「算數。我去跟主任說，是我答應的。」",fx:{par:6,pat:-5},set:{ownDiscount:1},log:"跟主任承認私下給了折扣",res:[[null,"你敲主任室的門，把昨天的事說了一遍。"],["boss","……下次先問我。這次照你說的。"]]});
      c.push({label:"「那是說明會的價格，我昨天說錯了。」",fx:{par:-8,ord:4},log:"收回私下的折扣",res:[["parent","……你們補習班講話是不是不算話？"]]});}
     else c.push({label:"說明報名流程，學費請主任說明",fx:{par:5},log:"說明報名流程",res:[["parent","好，那我去找主任。"]]});
     return c;}},
  {id:"y2_mock",t:"18:40",target:{spot:"counterIn"},goal:"三樓分機：模擬考的卷子有問題",action:"接分機",
   pages:G=>[["hong","小芸姐，模擬考的英文卷有一張第二頁印歪了，看不到最後兩題。"],["hong","鄭老師在休息室跟家長談，我在顧考場走不開。"]],
   choices:G=>[
    {label:"去教材室重印一張，送上三樓",fx:{ord:5,hp:-4},log:"重印模擬考卷送上三樓",res:[[null,"你印好、爬樓梯上三樓，從後門把卷子遞進去。阿宏比了一個「謝謝」的口型。"]]},
    {label:"請阿宏先把題目寫在白板上",fx:{pat:2,ord:-2},log:"請阿宏把題目抄在白板",res:[["hong","……好，我抄。"],[null,"你聽見分機那頭，白板筆唰唰地響。"]]}]},
  {id:"y2_bo",chapter:{t:"19:25",title:"國中下課",sub:"下課鐘一響，有人往門口走。",status:"國中下課"},
   t:"19:27",target:{npc:"bo"},goal:"小柏要出門",npc:{bo:AT("cardreader",.4,-.4,Math.PI)},after:{bo:SEAT("c8","bo")},
   pages:G=>{const p=pv(G),l=[["bo","姊姊，我下課去一下 7-11，十分鐘就回來。"]];
     if(p.boNotice)l.push([null,"你想起陳爸爸昨天說：「我在工地，沒看手機。」"]);
     else if(p.boFound||p.boDad)l.push([null,"昨天晚上第二節開始了他還沒回來，你為他打了好幾通電話。"]);
     l.push([null,"規定是：國中生下課不能自己離開，除非家長同意。"]);return l;},
   choices:G=>{const c=pa(G,"care"),l=[
    {label:"打給陳爸爸問",fx:{par:6,pat:-2},set:{boCall:1},log:"打給陳爸爸確認小柏外出",res:[["chenba","（電話）不行。叫他乖乖待著。……謝謝你打來。"],["bo","蛤——"]]},
    {label:"「不行，規定就是規定。」",fx:{ord:4,par:-1},log:"不讓小柏外出",res:[["bo","……喔。"],[null,"他回到樓上。下課剩七分鐘。"]]}];
    if(c.extraPudding)l.unshift({label:"「冰箱有安親多的布丁，要不要？」",fx:{par:4,ord:3},set:{boPudding:1},log:"用布丁留住小柏",res:[["bo","……布丁喔？好啊。"],[null,"他站在冰箱前面把布丁吃完，然後自己走回樓上。"]]});
    return l;}},
  {id:"y2_close",chapter:{t:"21:15",title:"日結",sub:"現金、收據、刷卡紀錄。對得起來才能下班。",status:"日結中"},
   t:"21:15",target:{spot:"counterIn"},goal:"日結對帳",action:"打開抽屜",npc:{parent:null,trial:null},
   pages:G=>[[null,"抽屜裡是今天收的現金，收據本上是今天開的收據。"],[null,G.f.amaFix?((pv(G).payDiff||0)>0?"抽屜少了六張百元鈔，是退給阿嬤的那六百。收據已經重開。":"多了六張百元鈔，是阿嬤送回來的那六百。"):"今天的收據比昨天多三張。"]],
   choices:G=>[
    {label:"一筆一筆對",mini:"ledger",fx:r=>({ord:r.ok?8:-4,hp:-4}),log:r=>r.ok?"日結對得起來":r.diff?`日結差了 ${r.diff} 元`:"日結時多疑了一筆，帳其實是對的",res:r=>r.ok?[[null,"一塊錢都不差。你把現金放進保險箱。"]]:r.diff?[[null,`差了 ${r.diff} 元。你把今天的收據又翻了一次。`]]:[[null,"你把那一筆又算了三次，才確定它沒有錯。帳是對的，只是你太累了。"]]},
    {label:"先放保險箱，明天再對",fx:{hp:4,ord:-6},log:"日結延到明天",res:[[null,"你關掉招牌燈。阿嬤的保溫杯還在櫃台上。"]]}]}
 ],
 ending(G){
  const s=G.s,h=G.h,dead=s.hp<=0||s.pat<=0,f=G.f,un=Math.max(0,Math.round(h.missed-h.cleared+2));
  let t;
  if(dead)t=["今天到此為止","週三從中午開始，到第九個小時，你請主任接手櫃台。"];
  else if(f.ownDiscount&&s.par>=65)t=["說到做到的櫃台","你答應的折扣，你自己去跟主任說。王媽媽不知道這件事，但主任會記得。"];
  else if(f.amaFix)t=["阿嬤數的錢","六百塊回來了。你在收據本最後一頁寫：「以後找錢數兩次。」"];
  else if(s.par>=70&&s.ord>=65)t=["櫃台的定海神針","從中午到晚上，每一通改接送、每一張收據，都在對的地方。"];
  else if(un>=5)t=["電話響不停","今天回了昨天的電話，又欠了今天的電話。"];
  else t=["平安關門","週三比週二早一個半小時開門。你關上招牌燈的時候，腳是麻的。"];
  return {title:t[0],desc:t[1],dead,big:[[f.pickupLog?"有":"沒有","接送表上的改變"],[`${un} 通`,"明天要回的電話"]]};
 }
};

/* ---------- 主任・第二天 ---------- */
LINES2.boss={...LINES.boss,day:2,
 busy:[["11:50","17:25",null,"主任的下午","回總部的信、看續班名單、打給還在考慮的家長。",15],["17:55","21:15",null,"巡班","在三層樓之間走一圈：看課、聽電話、跟老師講兩句。",15]],
 pick:"第二天・週三。總部回信了。昨天答應老師、櫃台、家長的事，今天都要兌現。",
 coda:"第二天，你開始知道哪些承諾是真的。",
 msgs:[["11:52","總部","已收到貴分校週報。"],["14:20","粉專通知","有一則新的留言"],["18:15","老婆","女兒問你今天可不可以早點回來。"],["20:50","小芸","主任，我等一下可以跟你說一件事嗎？"]],
 schedule:[["11:50","pre"],["17:00","leave"],["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]],
 eventSlots:[{after:"b2_ac",t:"13:40",phase:"pre"},{after:"b2_patrol",t:"19:00",phase:"class"},{after:"b2_hr",t:"20:40",phase:"class"}],
 npcs:{...LINES.boss.npcs,mom:null},
 steps:[
  {id:"b2_mail",chapter:{t:"11:50",title:"第二天・週三",sub:"總部回信了。",status:"營業中",rush:["今天國小中午放學。","林媽媽下午三點要來。"]},
   t:"11:50",target:{spot:"bossdesk"},goal:"打開總部的回信",action:"看信",
   pages:G=>{const p=pv(G);
     if(p.lied)return [[null,"「貴分校本週續班率 85%，表現良好。下週三區經理將到校訪視，請準備續班名單備查。」"],[null,"續班名單上，實際的數字是另一個。"]];
     if(p.explained)return [[null,"「已閱說明。影印機汰換申請核准。另，安親人力不足之事，請提出具體方案，下週討論。」"],[null,"區經理在信末多寫了一句：「謝謝你寫這麼多。」"]];
     return [[null,"「已收到貴分校週報。續班率未達標，請於下週提出改善計畫。」"],[null,"跟上個月一模一樣的一句話。"]];},
   choices:G=>{const p=pv(G),c=[];
     if(p.lied){c.push({label:"打給區經理，說週報填錯了",fx:{calm:-10,rep:8},set:{confess:1},log:"跟總部更正續班率",res:[[null,"電話那頭沉默了很久：「……好，下週三我還是會去。但我會看真的名單。」"]]});
       c.push({label:"開始想下週要補哪幾個學生",fx:{calm:-4,sales:4},log:"開始補續班的缺口",res:[[null,"你列出十一個名字。下週三之前，要讓其中幾個說「好」。"]]});}
     else c.push({label:"開始寫安親人力的方案",fx:{calm:-3,morale:5},set:{carePlan:1},log:"寫安親人力方案",res:[[null,"你在白紙上寫：週三中午、三個年級、三個老師。然後在旁邊畫了一個問號。"]]});
     c.push({label:"先回信：收到",fx:{calm:3},log:"回覆總部：收到",res:[[null,"「收到，謝謝。」送出。"]]});return c;}},
  {id:"b2_pickup",t:"12:30",target:G=>pv(G).bossPickup?{spot:"door"}:{npc:"yun"},goal:G=>pv(G).bossPickup?"跟安親老師一起去接人":"櫃台的電話一直響",action:G=>pv(G).bossPickup?"出發":null,
   npc:{yun:G=>pv(G).yunEarly||!pv(G).bossPickup?PC.yunDesk:null},
   pages:G=>{const p=pv(G);
     if(p.bossPickup)return [["lin","主任真的來了！你負責六年級的隊伍尾巴，看到有人脫隊就喊。"],[null,"國小門口擠滿機車和家長。吳老師舉著牌子，你站在最後面。"],[null,"一個六年級的小朋友回頭看你：「你是誰的爸爸？」"]];
     return [["yun","主任，三個安親老師都出去了，電話一直來改接送……"],[null,"櫃台前面站著一位阿公：「我孫子四年級，今天我來接，他在哪？」"]];},
   choices:G=>{const p=pv(G);
     if(p.bossPickup)return [
      {label:"一路點人數，過馬路時站在車道那一側",fx:{calm:-5,morale:10,rep:4},set:{walkedKids:1},log:"跟安親老師一起接六年級",res:[[null,"十二個人，點了四次。過馬路時，一台機車在你面前停下來。"],["wu","主任，你剛剛那一步，比我們站得還前面。"]]},
      {label:"「我在後面，你們放心。」",fx:{calm:-2,morale:6},log:"跟在隊伍後面",res:[[null,"你走在最後面，看著二十七個書包在前面晃。這是你第一次走這條路。"]]}];
     return [
      {label:"自己接電話，讓小芸處理阿公",fx:{calm:-4,morale:5},log:"主任幫櫃台接電話",res:[[null,"你接了三通。「今天阿嬤接」「小米五點五十」「安安媽媽自己來」。全部寫在接送表上。"]]},
      {label:"「先請阿公坐，我打給蔡老師。」",fx:{calm:-2,rep:2},log:"處理沒登記的接送",res:[[null,"阿公不在接送名單上。蔡老師打給小朋友的媽媽確認：是阿公沒錯。"]]}];}},
  {id:"b2_ac",t:"13:10",target:{spot:"g4door"},goal:"上二樓看午休",action:"看一下",
   pages:G=>{const p=pv(G);
     if(p.acFix)return [[null,"四年級教室的冷氣沒有在滴水了。七個小朋友趴在桌上，睡成三排。"],["cai","（小聲）主任，昨天修好了，今天午休終於不用聽滴水聲。"]];
     return [[null,"冷氣還在滴水。水桶放在兩排桌子中間，滴答、滴答。"],["cai","（小聲）主任……小宇說他睡不著，因為那個聲音好像有人在敲門。"]];},
   choices:G=>{const p=pv(G),c=[];
     if(!p.acFix)c.push({label:"現在打給廠商，今天一定要來",fx:{sales:-4,morale:6,calm:-3},set:{acFix2:1},log:"叫冷氣廠商今天來修",res:[[null,"廠商說四點到。你說：「三點半。」他說：「好。」"]]});
     c.push({label:"在門口站一下，不打擾",fx:{calm:4},log:"看一下午休",res:[[null,"窗簾拉上的教室很暗。有一個小朋友趴著睡，口水滴在聯絡簿上。"]]});return c;}},
  {id:"b2_post",t:"14:20",target:{spot:"bossdesk"},goal:"粉專有一則新留言",action:"打開粉專",
   pages:G=>{const p=pv(G);
     if(p.photo)return [[null,"留言：「昨天上課照拍到我女兒，請問有經過家長同意嗎？請刪除。」"],[null,"按讚數 46，分享 3。照片很好看。"]];
     return [[null,"留言是對面補習班的小編：「我們的會考衝刺班，歡迎比較！」"],[null,"底下有兩個你們的家長回了：「比過了，我們留下來。」"]];},
   choices:G=>{const p=pv(G);
     if(p.photo)return [
      {label:"刪照片，私訊家長道歉",fx:{rep:6,sales:-2},set:{photoDown:1},log:"刪除上課照並道歉",res:[[null,"家長回：「謝謝主任處理。」你在筆記本上寫：下次先發同意書。"]]},
      {label:"把她女兒的臉打馬賽克，照片留著",fx:{rep:-6,sales:2},log:"上課照打馬賽克留著",res:[[null,"她回了一個字：「……」"]]}];
     return [
      {label:"不回，截圖存起來",fx:{calm:4},log:"不回對面的留言",res:[[null,"你把那兩個家長的回覆截圖，傳到老師群組。"],["lin","（貼圖）"]]},
      {label:"回一句：「歡迎比較，我們等你們。」",min:10,fx:{sales:3,rep:-3},log:"在粉專回嗆對面",res:[[null,"十分鐘後，對面的小編刪掉了留言。你也刪掉了你的。"]]}];}},
  {id:"b2_lin",t:"15:00",target:{npc:"mom"},goal:"林媽媽在諮詢室等你",npc:{mom:PC.zhangConsult},after:{mom:null},
   pages:G=>{const p=pv(G),t=pa(G,"teacher"),l=[["mom","主任，我直接說：我想退費。阿哲說他聽不懂，我不想再浪費他的時間。"]];
     if(p.baseClass)l.push(["mom","昨天晚上您打來說的基礎班……我想先聽您說清楚。"]);
     if(t.zheOpen)l.push(["mom","可是……他昨天回家說，許老師跟他約了段考完的週四提早來。他很久沒有自己說要早去了。"]);return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.baseClass||pa(G,"teacher").zheOpen)c.push({label:"拿出基礎班的時間表",note:"寒假，週二、週四，從分數開始",fx:{rep:10,sales:4,calm:-4},set:{linSign:1},log:"林媽媽改報基礎班",res:[["mom","從分數開始……他國一就卡在那裡。"],[null,"她看了很久，最後在報名表上簽了名。"],["mom","如果他還是聽不懂，我會再來。"]]});
     c.push({label:"先讓她把話說完",note:"她今天是來吵架的",mini:"calm",fx:r=>({calm:-8,rep:r.anger<=20?8:r.anger<=45?3:-5}),log:r=>`安撫林媽媽（怒氣 ${r.anger}）`,res:r=>r.anger<=45?[["mom","……好，我再給他一個月。"]]:[["mom","退費單我放這裡。"],[null,"她走的時候，退費單壓在你的茶杯底下。"]]});
     c.push({label:"照規定辦退費",fx:{sales:-6,rep:2},set:{refunded:1},log:"幫林媽媽辦退費",res:[[null,"你算給她看：退一半。她點點頭，簽了名。"],[null,"九年級的名單上，少了一個人。"]]});return c;}},
  {id:"b2_sched",t:"15:40",target:{spot:"bossdesk"},goal:"排段考後一週的課表",action:"打開課表",
   pages:G=>[[null,"段考後那一週，學生最想休息，家長最想加課。"],[null,"許老師的時數已經滿了，鄭老師上週也說她很累。"]],
   choices:G=>[
    {label:"段考後減一天課，讓老師喘口氣",fx:{morale:6,sales:-3},set:{restWeek:1},log:"段考後一週減課",res:[[null,"你在群組裡公告：段考後週一停課一天，改成線上錯題檢討。"]]},
    {label:"照常上課，加開錯題檢討班",fx:{sales:5,morale:-4},log:"段考後加開檢討班",res:[[null,"報名表貼出去，第一個小時就有六個人。鄭老師看到公告，沒有說話。"]]}]},
  {id:"b2_rush",chapter:{t:"17:00",title:"放學高峰",sub:"大廳擠滿了家長。",status:"放學中"},
   t:"17:25",target:G=>pv(G).bossDesk?{spot:"counterIn"}:{npc:"yun"},goal:G=>pv(G).bossDesk?"你答應過，放學這一小時下去顧櫃台":"小芸一個人在櫃台",action:G=>pv(G).bossDesk?"站進櫃台":null,
   npc:{yun:PC.yunDesk},
   pages:G=>{const p=pv(G);
     if(p.bossDesk)return [[null,"你站進櫃台。小芸看了你一眼，把第二支電話推到你面前。"],["yun","主任，四年級安安的媽媽在等，你先廣播。"]];
     if(p.yunLeave)return [[null,"小芸一個人在櫃台。她看到你，點了一下頭，又低頭接電話。"],[null,"昨天她說「好」的時候，你就知道不是真的好。"]];
     return [[null,"小芸一個人在櫃台，電話夾在脖子上，手上在找零。"]];},
   choices:G=>{const p=pv(G);
     return [
      {label:p.bossDesk?"接電話、廣播、收費，跟著小芸一起做":"站進櫃台幫她",mini:"rush",fx:r=>({rep:r.ok*2-8-(r.wrong||0)*2,morale:p.bossDesk?10:6,calm:-6}),set:{deskHelp:1},log:r=>`主任顧櫃台，處理好 ${r.ok} 件`,res:r=>[[null,r.ok>=7?"這一波過去了，大廳空了一半。小芸遞給你一杯水。":"你接錯了一通電話，小芸笑了出來。"],["yun","主任，你的廣播比我還大聲。"]]},
      {label:"在大廳招呼家長，櫃台交給小芸",fx:{rep:4,morale:-4,calm:-2},log:"主任在大廳招呼家長",res:[[null,"家長看到主任都很客氣。櫃台後面，小芸的電話還是一直響。"]]}];}},
  {id:"b2_trial",t:"17:55",target:{npc:"parent"},goal:"王媽媽在大廳",npc:{parent:AT("sofa",0,.2,Math.PI)},after:{parent:null},
   pages:G=>{const p=pv(G),y=pa(G,"yun"),l=[];
     if(p.enrolled)l.push(["parent","主任，我來繳學費。"]);else l.push(["parent","主任，我們想來談報名的事。他說許老師的課聽得懂。"]);
     if(y.discount&&(p.discount||p.lastDiscount))l.push(["parent","櫃台小姐昨天說有早鳥價，主任您也說有折扣……那是兩個都算嗎？"],[null,"你不知道小芸昨天說了什麼。"]);
     else if(y.discount)l.push(["parent","櫃台小姐昨天說，今天報名有早鳥價。"],[null,"你沒有說過這件事。"]);
     else if(p.discount||p.lastDiscount)l.push(["parent","昨天您說的折扣，還算數吧？"]);
     return l;},
   choices:G=>{const p=pv(G),y=pa(G,"yun"),c=[];
     if(y.discount)c.push({label:"「算數。櫃台說的，就是我們說的。」",note:"之後再跟小芸談",fx:{sales:-4,rep:6,morale:6},set:{backYun:1},log:"替櫃台的折扣背書",res:[["parent","你們內部很團結耶。"],[null,"櫃台那邊，小芸假裝在整理收據，耳朵是紅的。"]]});
     c.push({label:"照原價，說明差別在哪裡",fx:{sales:4,rep:-2},log:"照原價收費",res:[["parent","……好吧。"]]});
     if(p.discount||p.lastDiscount)c.push({label:"照昨天說的折扣",fx:{sales:-2,rep:3},log:"照昨天的折扣收費",res:[["parent","謝謝主任。"]]});
     return c;}},
  {id:"b2_patrol",chapter:{t:"18:00",title:"巡堂",sub:"週三，八年級是許老師的數學。",status:"國中上課中"},
   t:"18:40",target:{spot:"c8door"},goal:"上三樓巡堂",action:"從門上的小窗看",npc:{teacher:AT("c8podium",0,0,0),bo:SEAT("c8","bo")},
   pages:G=>[[null,"八年級的門上小窗：許老師在講桌上用紙片拼了一個正方形：一大塊、一小塊、兩長條。"],[null,"小柏站起來看，後面三個人也跟著站起來。教室很吵，但每個人都在看同一個地方。"],[null,"九年級那邊很安靜，門口是阿宏在顧英文模擬考。鄭老師在休息室跟阿翔媽媽談。"]],
   choices:G=>[
    {label:"記下來，週會的時候說",fx:{morale:6,calm:2},set:{praiseT:1},log:"記下許老師的課",res:[[null,"你在筆記本上寫：「八年級，紙片拼正方形，(a + b)²。下週週會講。」"]]},
    {label:"拍一張照",note:"這次先問",fx:{sales:3,rep:2},log:"先徵求同意再拍照",res:[[null,"你下樓請小芸先在家長群組發同意書。照片下週再拍。"]]}]},
  {id:"b2_hr",t:"20:20",target:{npc:"hr"},goal:"鄭老師下樓找你",npc:{hr:AT("bossdesk",.9,.4,Math.PI)},after:{hr:PJ.hrDesk},
   pages:G=>{const p=pv(G),l=[["hr","主任，阿翔的媽媽六點半在三樓跟我談了二十分鐘。她一個人帶兩個，下午接小的，晚上接大的。"]];
     l.push(["hr",p.hongHall?"還有，阿宏下課站走廊，今天電梯口有兩個人吵架，他馬上拉開了。":"還有，今天電梯口又有八年級在推。走廊沒有人。"]);
     l.push(["hr","我想問……週三能不能讓安親的小宇，跟哥哥一起等媽媽？在課輔室，阿宏看著。"]);return l;},
   choices:G=>[
    {label:"「可以。週三小宇在課輔室等，阿宏看。」",fx:{rep:8,morale:4,calm:-3},set:{brothers:1},log:"讓阿翔和小宇週三一起等",res:[["hr","真的嗎？我跟阿翔媽媽說。"],[null,"你在班表上加了一行：週三 19:00–21:00，課輔室，小宇。旁邊註明：請阿翔媽媽在聯絡簿上簽同意。"]]},
    {label:"「安親和國中不能混在一起。」",fx:{calm:3,rep:-3},log:"不讓安親和國中混在一起",res:[["hr","……也是，規定是這樣。"]]}]},
  {id:"b2_yun",chapter:{t:"21:00",title:"國中放學",sub:"小芸在櫃台等你。",status:"放學"},
   t:"21:05",target:{npc:"yun"},goal:"小芸有話要說",npc:{yun:AT("counterIn",0,0,0)},
   pages:G=>{const p=pv(G),l=[];
     if(p.yunStay&&(p.bossDesk||G.f.deskHelp))l.push(["yun","主任，今天你真的下來了。"],["yun","我昨天說想辭職……我想再試一期。但週三中午，我需要一個人。"]);
     else if(p.yunStay)l.push(["yun","主任，加薪的事謝謝你。"],["yun","可是今天放學的時候，我還是一個人。錢不是我缺的東西。"]);
     else if(p.yunLeave)l.push(["yun","主任，我想好了。我做到下個月底。"],[null,"她把一個信封放在櫃台上。"]);
     else l.push(["yun","主任，今天的帳對好了。"],["yun","……還有，週三中午真的需要多一個人。"]);
     return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.yunLeave&&!G.f.deskHelp)c.push({label:"「我知道了。謝謝你這兩年。」",fx:{morale:-6,calm:4},set:{yunGone:1},log:"接受小芸的辭呈",res:[["yun","……主任，你也要記得吃晚餐。"]]});
     c.push({label:"「週三中午的兼職，我明天就開缺。」",fx:{sales:-4,morale:12},set:{hirePT:1},log:"答應週三加兼職人手",res:[["yun","……真的？"],[null,"她把便利貼「記得吃晚餐」撕下來，貼到你的手機背面。"]]});
     c.push({label:"「下週總部來，我會把人手的事寫進去。」",fx:{morale:4,calm:-2},log:"把人手寫進給總部的方案",res:[["yun","好。我等。"]]});return c;}},
  {id:"b2_report",t:"21:15",target:{spot:"bossdesk"},goal:"回辦公室，寫下週的計畫",action:"打開筆記本",
   pages:G=>[[null,"筆記本攤在桌上。這兩天你寫了很多字：影印機、冷氣、人手、阿哲、小芸、對面的傳單。"],[null,"下週只能先做一件事。"]],
   choices:G=>[
    {label:"安親週三中午的人手",fx:{morale:8,sales:-3},set:{plan:"care"},log:"下週先解決安親人手",res:[[null,"你在第一行寫：週三中午，四個人接三個年級。"]]},
    {label:"續班名單，一個一個打",fx:{sales:8,calm:-4},set:{plan:"renew"},log:"下週先衝續班",res:[[null,"你在第一行寫：十一個名字，五天。"]]},
    {label:"九年級的基礎班",fx:{rep:8,sales:-2},set:{plan:"base"},log:"先排寒假基礎班",res:[[null,"你在第一行寫：寒假分數班，週二、週四。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.calm<=0,f=G.f,p=pv(G);
  let t;
  if(dead)t=["主任先下班了","你跟小芸說今天先這樣。車子發動之前，你在停車場坐了很久。"];
  else if(f.confess)t=["改回真的數字","區經理下週三會來。你準備好的，是真的名單。"];
  else if(f.yunGone)t=["櫃台的空位","小芸做到下個月底。你開始學怎麼用刷卡機。"];
  else if(f.hirePT&&(f.deskHelp||p.bossDesk)&&s.morale>=70)t=["老師們都看到了","你接過小朋友、顧過櫃台、答應了兼職。這兩天說出口的事，都做了。"];
  else if(f.linSign&&f.brothers)t=["留住的不只是學生","阿哲改上基礎班，小宇週三可以等哥哥。報表上沒有這兩格，但你知道。"];
  else if(s.sales>=70)t=["業績第一","數字很好看。只是你注意到，今天茶水間有人在看人力銀行。"];
  else t=["平安的週三","中午接人、晚上巡堂。主任的一天，就是把每個人放回對的位置。"];
  return {title:t[0],desc:t[1],dead,big:[[f.linSign?"基礎班":f.refunded?"退費":"考慮中","阿哲"],[f.hirePT?"開缺":f.yunGone?"離職":"再撐一期","小芸"]]};
 }
};

/* ---------- 第二天專屬支線：每個位子一條，承接第一天的選擇（不重播第一天的支線） ---------- */
SIDES.care.push({id:"miDraw",day:2,from:"c2_wake",until:"c2_mima",target:{npc:"mi"},title:"小米的畫",action:"看小米的畫",
  avail:G=>!!(G.prev.waitMi||G.prev.leftMi),
  pages:G=>G.prev.waitMi?[["mi","老師，這個給你。"],[null,"一張畫：兩個人坐在桌子前面，把彩色筆排成一排。旁邊寫著「老師跟我等媽媽」。"]]
    :[["mi","老師……昨天櫃台的姊姊陪我等。"],[null,"她給你一張畫：櫃台旁邊一張小椅子，椅子上坐著一個抱著兔子的人。"],["mi","今天媽媽會準時嗎？"]],
  choices:G=>[
   {label:"貼在老師桌旁邊",fx:{pat:3,par:2},log:"把小米的畫貼在老師桌旁",res:[[null,"小米看著你把畫貼好，回座位的時候腳步輕了一點。"]]},
   {label:"「放進資料夾，帶回家給媽媽看。」",fx:{par:5},log:"請小米把畫帶回家給媽媽",res:[["mi","……好。"],[null,"她把畫折好，夾進聯絡簿裡。"]]}]});
SIDES.jh.push({id:"bentoPay",day:2,from:"j2_xiang",until:"j2_out",target:{npc:"xiang"},title:"昨天的便當錢",action:"找阿翔",
  avail:G=>!!G.prev.paidFor,
  pages:G=>[["xiang","老師……昨天的便當錢。我媽叫我拿來。"],[null,"八十五元：一個五十元、三個十元、一個五元，用橡皮筋綁著。"]],
  choices:G=>[
   {label:"收下，在聯絡本寫「已還，謝謝」",fx:{par:4},log:"收回幫阿翔墊的便當錢",res:[[null,"你在聯絡本上寫了一行。阿翔看了一眼，沒說話，把聯絡本收進書包。"]]},
   {label:"收下，跟他說「謝謝你記得」",fx:{stu:4},log:"謝謝阿翔記得還錢",res:[["xiang","……是我媽記得。"],[null,"他說完，嘴角動了一下。"]]}]});
SIDES.teacher.push({id:"score32",day:2,from:"t2_c8",until:"t2_zhe",target:{npc:"bo"},title:"三十二分",action:"跟小柏說",
  avail:G=>!!G.prev.told32,
  pages:G=>[["bo","老師，九年級的說你國中數學考過三十二分，真的假的？"],[null,"前兩排的人都轉過頭來。"]],
  choices:G=>[
   {label:"「真的。所以我知道卡住是什麼感覺。」",fx:{stu:6,voice:-1},log:"跟八年級說自己考過三十二分",res:[["bo","那你後來怎麼變老師的？"],["me","下課再跟你說。先把這一題乘開。"]]},
   {label:"「先上課，下課再說。」",fx:{voice:1},log:"請小柏先回座位",res:[["bo","喔……"],[null,"他坐回去，但一直在看你。"]]}]});
SIDES.yun.push({id:"earlyPrice",day:2,from:"y2_open",until:"y2_trial",target:{npc:"boss"},title:"昨天說出去的早鳥價",action:"找主任",
  avail:G=>!!G.prev.discount,
  pages:G=>[["boss","小芸，王媽媽說你昨天答應她早鳥價？"],["boss","價錢的事要先問我。不是不能給，是要一致。"]],
  choices:G=>[
   {label:"照實說：是我沒先問",fx:{ord:4,pat:-2},log:"跟主任承認早鳥價沒先問",res:[["boss","好，這次照你說的給。下次先傳訊息給我。"],[null,"主任在你的便利貼上補了一行：「價錢 → 先問主任」。"]]},
   {label:"「家長一直問，我只是先安撫。」",fx:{pat:2,ord:-2},log:"跟主任解釋早鳥價",res:[["boss","……我知道櫃台很難。可是其他家長也會來問。"],[null,"主任沒有再說什麼，回主任室了。"]]}]});
SIDES.boss.push({id:"oldCopier",day:2,from:"b2_post",until:"b2_trial",target:{npc:"yun"},title:"影印機的事",action:"找小芸",
  avail:G=>!!(G.prev.newCopier||G.prev.splitCopy),
  pages:G=>G.prev.newCopier?[["yun","主任，新影印機的廠商說週五送來。舊的那台要不要留著？"],["yun","蔡老師說二樓如果有一台，練習卷就不用下樓搶了。"]]
    :[["yun","主任，鄭老師說昨天分兩批印的辦法很好，今天模擬卷也照這樣排。"],["yun","可是這樣安親每天都要等到四點……"]],
  choices:G=>G.prev.newCopier?[
   {label:"舊的搬到二樓給安親用",fx:{morale:5,calm:-2},log:"舊影印機留給安親",res:[["yun","我跟蔡老師說！她一定很高興。"]]},
   {label:"請廠商回收，折抵價錢",fx:{sales:4},log:"舊影印機折抵",res:[["yun","好，我跟廠商說。"],[null,"你在支出單上把那一行劃掉，改成小一點的數字。"]]}]
   :[{label:"排一張固定的影印時間表",fx:{morale:4,calm:-2},log:"排固定的影印時間表",res:[["yun","我做一張貼在教材室門口！"]]},
     {label:"先這樣，段考完再說",fx:{calm:2},log:"影印順序段考完再說",res:[["yun","好。"]]}]});
