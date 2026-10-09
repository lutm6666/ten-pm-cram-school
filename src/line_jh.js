/* ================= 職業線：國中部英文老師（晚上 17:30–21:45） ================= */
/* 國中部在走廊最裡面的 C 班。影印機、投影機、教室，都要跟高三搶。 */
const PJ={copierWait:[7.2,12,0],amyPodium:[32,2.6,0],xiangLocker:[33,14.4,Math.PI],xiangSeat:[32,6.42,Math.PI],qingSeat:[34.4,4.62,Math.PI],qingHall:[30.6,12.4,Math.PI],
  pinyuJhDoor:[30.6,12.3,0],door:[4.5,17.6]};
const jhPrev=G=>((G.prevAll||{}).care||{}).f||null;

LINES.jh={
 id:"jh",role:"國中部英文老師",short:"國中",body:0x8ce99a,shift:"晚上 17:30–21:45",
 pick:"教國中 C 班的會考英文。教室在走廊最裡面，影印機、投影機都要跟高三搶。",
 cast:["xiang","qing","boss","yun","teacher","pinyu"],
 stats:{hp:["體力",55],voice:["嗓子",60],stu:["學生",50],par:["家長",50]},hidden:{},
 late:{fx:{stu:-4,par:-2},text:"國中生已經開始滑手機了。"},
 coda:"國中生不會記得你今天搶到了投影機。但有人會記得，那個單字你教了三遍。",
 msgs:[["17:42","國中部群組","子晴媽媽：老師，子晴這次段考英文幾分？"],["18:20","許老師","不好意思，影印機我們先用一下喔🙏"],["19:36","何主任","C 班今天可以小聲一點嗎？B 班有試聽。"],["20:58","國中部群組","阿翔媽媽：他今天有沒有把手機交出來？"]],
 preStatus:"備課中",endAt:"21:45",noItems:true,
 events:["quake","blackout","rain","roach"],
 eventSlots:[{after:"j_room",t:"18:00",phase:"pre"},{after:"j_noise",t:"19:30",phase:"class"},{after:"j_line",t:"20:35",phase:"class"}],
 start:[4.5,16.6],
 me:G=>({name:"你",title:`${G.pName}・國中部英文`,abbr:"英",color:"#2b8a3e"}),
 npcs:{yun:P.yunDesk,boss:P.bossOffice,teacher:P.teacherLounge,pinyu:P.pinyuSeat,zhe:P.zheSeat,hong:P.hongStudy,qing:PJ.qingSeat,xiang:null,amy:null,parent:null,parent2:null,bo:PY.boStudy,chenba:null},
 steps:[
  {id:"j_copier",chapter:{t:"17:30",title:"國中部・傍晚",sub:"國中生六點以後會陸續到。",status:"備課中",rush:["段考複習卷還沒印。","影印機前面已經有人在排隊。"]},
   t:"17:30",target:{spot:"copier"},goal:"去印段考複習卷",action:"排隊",
   pages:G=>[[null,"影印機正在吐高三的講義。旁邊還有一疊貼著便利貼：「許老師・B 班・24 份」。"],["yun","啊，國中部的老師！你也要印嗎？許老師的還要十分鐘……"],[null,"你手上的段考複習卷，只要 30 張。"]],
   choices:G=>[
    {label:"「我只要 30 張，可以先插一下嗎？」",fx:{stu:4},set:{cutQueue:1},log:"影印機插隊印複習卷",res:[["yun","……好啦，那我跟許老師說晚五分鐘。"],[null,"三十張複習卷印好了。走廊另一頭，許老師探頭看了一眼。"]]},
    {label:"排隊等",min:10,fx:{hp:-3},log:"影印機乖乖排隊",res:[[null,"你等了十分鐘，順便幫小芸把卡住的一張紙拉出來。"],["yun","謝謝你～下次你先！"]]},
    {label:"去對面超商印",min:15,fx:{hp:-6,par:2},log:"跑超商印複習卷",res:[[null,"超商的影印機一張兩塊。三十張，六十塊，收據記得留。"]]}]},
  {id:"j_room",t:"17:50",target:{npc:"boss"},goal:"主任找你",
   pages:G=>[["boss","今天 B 班有試聽，C 班的投影機先借 B 班用。"],["boss","你們國中部……今天先用白板，可以吧？"],[null,"C 班的投影機是上個月才修好的。"]],
   choices:G=>[
    {label:"爭取：國中部也有家長在看",fx:{par:4,hp:-2},set:{fought:1},log:"跟主任爭取投影機",res:[["boss","我知道……但試聽只有今天。"],[null,"投影機還是被搬走了。不過主任在本子上寫了一行：「C 班投影機」。"]]},
    {label:"好，改用白板",fx:{voice:-4},log:"讓出投影機改用白板",res:[["boss","謝謝你體諒。"]]},
    {label:"借自習室的電視",note:"要自己搬",fx:{hp:-6,stu:5},set:{tv:1},log:"搬自習室電視到 C 班",res:[[null,"你跟阿宏把電視推過走廊，輪子卡了兩次。"],["hong","國中部的老師好拼喔。"]]}]},
  {id:"j_xiang",t:"18:10",target:{npc:"xiang"},goal:"阿翔不肯交手機",npc:{xiang:[PJ.xiangLocker[0],PJ.xiangLocker[1],Math.PI,PJ.door]},
   pages:G=>{const c=jhPrev(G),l=[["xiang","老師，我手機不能交啦，我媽會打來。"]];
     if(c&&c.yuChecked)l.push(["xiang","……對了，我弟說今天安親老師教他進位。他說回家要寫給我看。"]);
     else if(c)l.push(["xiang","我弟今天數學又錯一堆，我媽叫我回家教他。我哪有空。"]);
     else l.push([null,"籃子裡已經有十二支手機了。只差他一支。"]);
     return l;},
   choices:G=>[
    {label:"規定就是規定，放籃子",fx:{stu:-5,par:4},log:"收走阿翔的手機",res:[["xiang","（嘆氣）好啦。"],[null,"他把手機丟進籃子，用書包蓋住。"]]},
    {label:"約好：上課放籃子，下課前十分鐘還你",fx:{stu:6},set:{deal:1},log:"跟阿翔約定手機時間",res:[["xiang","……真的？好。"],[null,"他自己把手機放進去，還排得很整齊。"]]},
    {label:"「你媽打來，我幫你接。」",fx:{stu:3,par:2,voice:-2},set:{momLine:1},log:"幫阿翔接媽媽電話",res:[["xiang","蛤……好啦。"]]}]},
  {id:"j_class",chapter:{t:"18:30",title:"國中 C 班",sub:"18:30–19:50・會考英文",status:"上課中"},
   t:"18:30",target:{spot:"jhpodium"},goal:"走上 C 班講台",npc:{xiang:PJ.xiangSeat},
   pages:G=>{const l=[[null,"C 班十個人。後排兩個在偷看籃子裡的手機。"]];if(!G.f.tv&&!G.f.fought)l.push([null,"投影機不在。白板上還有上一堂的單字。"]);else if(G.f.tv)l.push([null,"自習室的電視架在講台邊，畫面有點歪。"]);l.push([null,"會考英文，單字不熟，什麼都別說。"]);return l;},
   choices:G=>[
    {label:"單字搶答",note:"五題",mini:"vocab",fx:r=>({voice:-6,stu:r.right>=4?12:r.right>=2?5:-2}),set:{loud:1},log:r=>`單字搶答，答對 ${r.right} 題`,
     res:r=>r.right>=4?[[null,"C 班搶答搶到拍桌子。連阿翔都舉手了。"]]:[[null,"答對的不多，但至少大家醒了。"]]},
    {label:"直接講課文",fx:{voice:-10,stu:-2},log:"直接上課文",res:[[null,"課文講完了。有一半的人在畫重點，另一半在畫畫。"]]}]},
  {id:"j_noise",t:"19:15",target:{npc:"pinyu"},goal:"有人在 C 班門口",npc:{pinyu:PJ.pinyuJhDoor},after:{pinyu:P.pinyuSeat},
   pages:G=>[["pinyu","老師……不好意思，許老師說 B 班在小考，請你們小聲一點。"],...(G.f.loud?[[null,"剛剛的單字搶答，整條走廊都聽得到。"]]:[]),...(G.f.cutQueue?[["pinyu","還有……我們今天講義晚到，有人沒拿到。"]]:[])],
   choices:G=>[
    {label:"道歉，把門關上",fx:{stu:-2,par:2},log:"跟 B 班道歉關門",res:[["pinyu","謝謝老師。"],[null,"C 班安靜了。安靜到有人開始打瞌睡。"]]},
    {label:"把搶答改成寫在白板上",note:"一樣好玩，比較安靜",fx:{voice:4,stu:4},set:{boardQuiz:1},log:"搶答改成寫白板",res:[[null,"學生排隊衝上台寫答案。沒有人喊，但每個人都想寫。"]]},
    {label:"「國中生也在上課啊。」",fx:{stu:4,par:-4},set:{talkback:1},log:"跟 B 班說國中生也在上課",res:[["pinyu","……喔，好。"],[null,"品妤走回去的時候，你聽到 B 班有人說：「國中部好吵。」"]]}]},
  {id:"j_qing",chapter:{t:"19:50",title:"下課",sub:"國中生下課最快衝出去。",status:"下課"},
   t:"19:55",target:{npc:"qing"},goal:"子晴在門口等你",npc:{qing:PJ.qingHall},after:{qing:PJ.qingSeat},
   pages:G=>[["qing","老師，學校要我參加英文演講比賽。"],["qing","可是練習時間是週四晚上……就是補習的時間。我媽說會考比較重要。"]],
   choices:G=>[
    {label:"支持她去比賽，課另外補",fx:{hp:-5,stu:8},set:{speech:1},log:"支持子晴去比演講",res:[["qing","真的可以嗎？"],["me","演講也是英文。而且這種機會，國三就沒有了。"]]},
    {label:"「會考比較重要。」",fx:{par:5,stu:-5},log:"勸子晴以會考為重",res:[["qing","……嗯，我知道。"]]},
    {label:"「我幫你跟媽媽說。」",fx:{par:2,stu:5,hp:-3},set:{talkMom:1},log:"答應幫子晴跟媽媽談",res:[["qing","老師你人好好！"]]}]},
  {id:"j_line",t:"20:20",auto:true,goal:"手機一直震",
   pages:G=>[[null,"學生在寫複習卷。你的手機震個不停，是子晴媽媽。"],[null,"「老師，子晴這次段考英文 98，可是全班排第三。請問她還要加強什麼？」"]],
   choices:G=>[
    {label:"挑三件事回她",mini:"summary",fx:r=>({par:r.v>=7?10:r.v>=4?4:-4}),log:r=>`回子晴媽媽的訊息（${r.v>=7?"說到重點":r.v>=4?"還可以":"沒說到重點"}）`,
     res:r=>r.v>=7?[[null,"五分鐘後，子晴媽媽回：「原來她有在練演講，我都不知道。謝謝老師。」"]]:[[null,"子晴媽媽回了一個「👍」。你不知道那是什麼意思。"]]},
    {label:"「下課後回您。」",fx:{par:-3},log:"家長訊息下課再回",res:[[null,"你把手機翻過去。螢幕又亮了一次。"]]}]},
  {id:"j_score",t:"20:45",target:{spot:"jhpodium"},goal:"登段考成績",action:"打開成績單",
   pages:G=>[[null,"主任說今天要把段考成績登進系統。三張成績單，總分是學生自己算的。"]],
   choices:G=>[
    {label:"一張一張核對",mini:"jhscore",fx:r=>({par:r.hits>=2?6:-4,hp:-2}),log:r=>`核對段考成績，抓到 ${r.hits}/3 個錯`,res:r=>r.hits>=2?[[null,"錯的地方都圈出來了。系統裡的數字是對的。"]]:[[null,"有一張漏看了。明天大概會有家長打來問。"]]},
    {label:"照學生寫的登",fx:{hp:3,par:-6},log:"段考成績照抄",res:[[null,"很快就登完了。"]]}]},
  {id:"j_after",chapter:{t:"21:15",title:"下課",sub:"家長在樓下等。",status:"收拾中"},
   t:"21:18",target:{spot:"jhdoor"},goal:"阿翔的媽媽來了",
   after:{xiang:null},
   pages:G=>{const c=jhPrev(G),l=[[null,"阿翔的媽媽站在 C 班門口，手上提著小宇的書包。"]];
     if(c&&c.pickupOk)l.push([null,"「下午他舅舅去接小宇，安親班老師有先打給我確認。我覺得你們很細心。」"]);
     else if(c&&c.handedMi)l.push([null,"「聽說下午安親班有小朋友被名單外的人接走？……我們家的接送名單，我想再確認一次。」"]);
     else if(c)l.push([null,"「下午他舅舅說在門口等了好久。下次我會先講。」"]);
     l.push([null,"「老師，阿翔會考……還有救嗎？」"]);return l;},
   choices:G=>[
    {label:"說實話：單字要每天背",fx:{par:5,stu:3},log:"跟阿翔媽媽說要每天背單字",res:[[null,"「每天？他連牙都不一定每天刷。」"],[null,"她笑了一下。阿翔在旁邊翻白眼，但沒有反駁。"]]},
    {label:"說他今天有舉手",fx:{par:8},log:"跟阿翔媽媽說他今天的表現",res:[[null,"「真的？他在家都不講話的。」"]]},
    ...(G.f.deal?[{label:"說他今天手機有自己交",note:"你們的約定",fx:{par:6,stu:6},log:"稱讚阿翔遵守手機約定",res:[[null,"阿翔的耳朵紅了。"]]}]:[])]},
  {id:"j_boss",t:"21:30",target:{npc:"boss"},goal:"去主任室",
   pages:G=>{const l=[["boss","今天辛苦了。投影機的事，不好意思。"]];
     if(G.f.talkback)l.push(["boss","還有，許老師說 C 班今天有點吵……"]);
     if(G.f.cutQueue)l.push(["boss","小芸說你插隊印講義？我是沒差啦，只是許老師的講義晚了。"]);
     l.push(["boss","國中部這學期人數多了三個。你有什麼想法？"]);return l;},
   choices:G=>[
    {label:"提出：排一張教室和設備的使用表",fx:{par:4,stu:4,hp:-3},set:{roomPlan:1},log:"提議排教室設備使用表",res:[["boss","好主意。高三、國中、安親，誰什麼時候用什麼，寫清楚。"],[null,"你回家前在白紙上畫了第一版。影印機那一格寫得最大。"]]},
    {label:"申請 C 班自己的投影機",fx:{stu:3},set:{ownProjector:1},log:"申請 C 班投影機",res:[["boss","我寫進總部的申請……不保證喔。"]]},
    {label:"「沒什麼，今天這樣就好。」",fx:{hp:4},log:"沒提國中部的需求",res:[["boss","好，早點回去。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,f=G.f;
  let t;
  if(dead)t=s.voice<=0?["國中部的老師失聲了","第二節的單字，你是用寫的。學生說老師今天好安靜。"]:["搶了一晚上，累倒了","影印機、投影機、教室。你今天什麼都在搶，最後連力氣都沒了。"];
  else if(f.roomPlan&&s.stu>=65)t=["讓國中部被看見","一張使用表，讓走廊最裡面的 C 班，也有一格是自己的。"];
  else if(s.stu>=72)t=["C 班的單字王","沒有投影機也沒關係。今天 C 班的人，都記得了五個單字。"];
  else if(s.par>=72)t=["家長群組的定心丸","子晴媽媽、阿翔媽媽，今天都安心了一點。"];
  else if(f.talkback)t=["走廊最裡面的教室","你替國中部說了話。代價是，B 班現在覺得國中部很吵。"];
  else t=["平安下課","國中部的大部分晚上，就是在高三的影子裡把課上完。"];
  return {title:t[0],desc:t[1],dead,big:[[f.roomPlan?"有":"沒有","教室設備使用表"],[G.minis.vocab?`${G.minis.vocab.right}/5`:"—","單字搶答"]]};
 }
};

/* ---------- 國中部的小遊戲 ---------- */
MINIS.vocab={
  head:"C 班・單字搶答",zone:"國中 C 班",title:"會考單字搶答",cost:5,
  intro:"五個會考常見單字，選出正確的中文意思。",
  qs:[["environment",["環境","娛樂","設備"],0],["necessary",["附近的","必要的","緊張的"],1],["decide",["決定","描述","裝飾"],0],["several",["嚴重的","幾個","分開的"],1],["borrow",["借入","煩惱","邊界"],0]],
  mount(el,done){let i=0,right=0;const self=this;
    function draw(){const q=self.qs[i];
      el.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.qs.length} 題</div><div style="font-size:1.6rem;font-weight:700;font-family:var(--mono)">${q[0]}</div></div><div class="choices">${q[1].map((o,k)=>`<button class="choice" data-k="${k}">${o}</button>`).join("")}</div><p class="feed" aria-live="polite"></p><div class="actions" hidden><button class="go" data-next>下一題</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(!act.hidden)return;const k=+b.dataset.k;
        if(k===q[2]){right++;feed.textContent="台下：「我就說吧！」";}else feed.textContent=`台下：「蛤～」答案是「${q[1][q[2]]}」。`;
        el.querySelectorAll("[data-k]").forEach((x,j)=>{x.disabled=true;if(j===q[2])x.style.borderColor="var(--green)";});act.hidden=false;
        act.querySelector("[data-next]").onclick=()=>{if(i<self.qs.length-1){i++;draw();}else{el.innerHTML=`<p class="feed">五題，全班答對 ${right} 題。</p>`;done({right});}};}));}
    draw();}
};
MINIS.jhscore={...MINIS.grade,
  head:"段考成績・核對",zone:"國中 C 班",title:"找出算錯的那一行",
  intro:"三張成績單，總分是學生自己加的。點出第一個算錯的那一行。",
  papers:[
   {who:"阿翔",q:"國文 72、英文 58、數學 64",lines:["72 + 58 = 130","130 + 64 = 184","總分 184，平均 61.3"],bad:1,why:"130 + 64 = 194。總分 194，平均 64.7。"},
   {who:"子晴",q:"國文 91、英文 98、數學 88",lines:["91 + 98 = 189","189 + 88 = 267","總分 267，平均 89"],bad:1,why:"189 + 88 = 277。總分 277，平均 92.3。"},
   {who:"小班長",q:"國文 85、英文 77、數學 90",lines:["85 + 77 = 152","152 + 90 = 242","總分 242，平均 80.7"],bad:0,why:"85 + 77 = 162。總分 252，平均 84。"}
  ]};
/* 晚上其他位子：國中部的人也在 */
function placeJuniorHigh(L){if(!["teacher","yun","boss"].includes(L.id))return;setNPC("amy",PJ.amyPodium,true);setNPC("xiang",PJ.xiangSeat,true);setNPC("qing",PJ.qingSeat,true);}
