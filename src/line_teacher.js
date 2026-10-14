/* ================= 職業線：跑堂的國中數學老師（許老師） ================= */
/* 17:30 從另一間補習班趕來，課前確認講義考卷；18:00–21:00 上九年級數學。
   上課要帶氣氛、講笑話、說故事，用有趣的方式把觀念講清楚。 */
LINES.teacher={
 id:"teacher",self:"teacher",role:"國中數學老師",short:"數學",body:0xf0f0f0,shift:"17:30–21:30",
 pick:"跑堂的國中數學老師。下午在別間補習班，晚上趕來上九年級。講義、氣氛、段考，全看這三個小時。",
 cast:["hr","pinyu","zhe","xiang","trial","parent","boss"],
 stats:{hp:["體力",50],voice:["嗓子",60],stu:["學生",50],par:["家長",50]},hidden:{trial:50},
 late:{fx:{stu:-4,trial:-3},text:"台下已經開始聊天了，有人在看時鐘。"},
 coda:"白板上的字明天就會被擦掉。但今天，有人聽懂了一題。",
 msgs:[["17:34","鄭老師","許老師，複習卷印好了，在九年級講桌上🙏"],["18:12","媽","晚餐在電鍋裡，記得吃。"],["19:40","另一間補習班","許老師，明天下午的課可以提早半小時嗎？"],["21:20","鄭老師","今天謝謝老師！阿哲的事我明天再跟主任談"]],
 preStatus:"趕路中",endAt:"21:30",daylight:false,
 staff:["lin","wu","amy","hong"],
 boards:{c9:"第一次段考複習：相似形\n複習卷・錯題檢討"},
 zoneText:{"九年級教室":"今晚的教室。十二個人，一個是來試聽的。","國中老師休息室":"跑堂老師的中繼站。放包包、喝口水、改考卷。","大廳":"機車停好，安全帽還沒摘，先跟櫃台打聲招呼。"},
 crowd:["jh","eng","parent"],
 chats:["hr","pinyu","zhe","xiang","qing","bo","yun","boss","hong","parent"],
 start:[FLX(0,4.5),16.6],
 me:G=>({name:"你",title:`${G.tName}・國中數學`,abbr:"師",color:"#b7791f"}),
 npcs:{yun:PC.yunDesk,boss:PC.bossDesk,hr:PJ.hrDesk,cai:null,lin:null,wu:null,amy:null,hong:null,pinyu:SEAT("c9","pinyu"),zhe:SEAT("c9","zhe"),qing:SEAT("c9","qing"),xiang:null,trial:null,parent:null,teacher:null},
 steps:[
  {id:"t_arrive",chapter:{t:"17:30",title:"跑堂",sub:"下午在別間補習班上了兩堂國小數學。現在是九年級。",status:"趕路中",rush:["機車停好，安全帽還沒摘。","今天有試聽生，段考前一週。"]},
   t:"17:30",target:{npc:"yun"},goal:"到櫃台拿今天的資料",
   pages:G=>[["yun","許老師！今天九年級有一位試聽生，媽媽會在樓下等。"],["yun","還有鄭老師說，複習卷她改了一頁，印好放在講桌上了。"],[null,"你看了一下手錶：離上課二十八分鐘。便當還在機車箱裡。"]],
   choices:G=>[
    {label:"在茶水間把便當吃完",fx:{hp:10},set:{ate:1},log:"上課前吃完晚餐",res:[[null,"你在茶水間用八分鐘吃完便當。微波爐前面排了兩個安親老師。"]]},
    {label:"便當先放著，上樓確認講義",fx:{hp:-3,stu:3},log:"沒吃晚餐，先上樓",res:[[null,"你搭電梯上三樓。電梯裡擠了四個國中生，大家都在滑手機。"]]}]},
  {id:"t_check",t:"17:42",target:{npc:"hr"},goal:"跟班導確認講義和考卷",npc:{hr:PJ.back},
   pages:G=>[["hr","許老師，複習卷十五份、小考十五份都在這裡。"],[null,"你翻了一下。複習卷第二頁，是你上週那個版本——你下午傳的新檔案，沒有印到。"],["hr","……啊，是第二頁嗎？我印的時候影印機卡紙，可能抓到舊檔。"]],
   choices:G=>[
    {label:"「沒關係，第二頁我寫在白板上。」",fx:{voice:-5,stu:4},set:{boardPage:1},log:"把改過的題目寫在白板上",res:[["hr","真的很抱歉……"],[null,"你在白板右邊寫了四題。寫完的時候，學生已經坐滿了。"]]},
    {label:"請班導下樓重印第二頁",fx:{hp:2,par:-2},set:{reprint:1},log:"請班導重印講義",res:[[null,"鄭老師衝下樓。十八點零五分，熱熱的第二頁送進教室。"]]},
    {label:"用舊版本上，反正差不多",fx:{stu:-4},log:"用舊版本講義上課",res:[[null,"舊版本少了兩題段考最常考的。你決定等一下口頭補。"]]}]},
  {id:"t_trial",t:"17:52",target:{npc:"trial"},goal:"試聽生已經坐好了",npc:{trial:SEAT("c9","trial")},
   pages:G=>[[null,"第三排靠窗，一個沒見過的男生。書包還背在身上。"],["trial","……老師好。我媽在樓下。"]],
   choices:G=>[
    {label:"問他學校考到哪裡、哪一章最卡",fx:{trial:8,hp:-2},set:{askedTrial:1},log:"上課前跟試聽生聊兩句",res:[["trial","相似形……我都找錯對應邊。我們老師講太快了。"],[null,"你在複習卷第二題畫了一顆星。等一下從這題開始檢討。"]]},
    {label:"「書包放下，等一下專心聽就好。」",fx:{trial:2},log:"簡單招呼試聽生",res:[["trial","嗯。"]]}]},
  {id:"t_lesson1",chapter:{t:"18:00",title:"第一節",sub:"18:00–19:25・段考複習：相似形",status:"上課中"},
   t:"18:00",target:{spot:"c9podium"},goal:"走上講台，開始上課",
   pages:G=>[[null,"手機收進籃子。十一個人坐著，阿翔的位子空著。"],[null,"段考前一週，台下一半的人在偷看別科的講義。"]],
   choices:G=>{const c=[
    {label:"先來五題暖身搶答",note:"限時",mini:"quiz",fx:r=>({voice:-8,stu:r.right>=4?12:r.right>=2?5:-2,trial:r.right>=4?10:3}),log:r=>`暖身五題，台下答對 ${r.right} 題`,
     res:r=>r.right>=4?[[null,"搶答搶到拍桌子。連最後一排都有人舉手。"]]:[[null,"答對的不多，但至少大家醒了。"]]},
    {label:"照複習卷一題一題檢討",fx:{voice:-10,stu:-3,trial:5},log:"照複習卷一題一題檢討",res:[[null,"檢討得很順。有一半的人一直在看別科的講義。"]]}];
    if(G.f.askedTrial)c.unshift({label:"從找對應邊開始，用放大照片來講",note:"試聽生說他卡在這裡",fx:{voice:-8,stu:10,trial:12},set:{storyStart:1},log:"從對應邊開始複習",res:[[null,"「相似就是把照片放大。手機兩指一拉，眼睛還是對眼睛、鼻子還是對鼻子。」你在白板上畫了一大一小兩個三角形，把對應的角塗成同一個顏色。"],[null,"試聽生第一次抬頭。品妤在講義上寫了「角對角，邊對邊」。"]]});
    return c;}},
  {id:"t_zhe",t:"18:40",target:{npc:"zhe"},goal:"阿哲睡著了",
   pages:G=>[[null,"最後一排，阿哲趴著。他的講義停在第一頁，空白的。"],[null,"全班都知道他睡著了。試聽生也看到了。"]],
   choices:G=>[
    {label:"叫他起來解剛剛那題",fx:{stu:-6},set:{shamedZhe:1},log:"點阿哲上台解題",res:[[null,"阿哲拖著腳走上台，盯著白板一分鐘，寫了一個 x 就停住。有人笑出來。"]]},
    {label:"走過去，在他講義上寫一個簡單的題目",note:"不停課",fx:{hp:-2,stu:5},set:{nudgedZhe:1},log:"給阿哲一題簡單的",res:[[null,"你在他講義上寫：「1/2 + 1/3 = ?」"],[null,"十分鐘後你再走過去，他寫了「2/5」，然後又劃掉了。"]]},
    {label:"讓他睡",fx:{voice:2,stu:-2},log:"讓阿哲繼續睡",res:[[null,"你繼續講。他一直睡到下課鐘響。"]]}]},
  {id:"t_mood",t:"19:00",target:{spot:"c9podium"},goal:"全班開始放空",action:"帶氣氛",
   pages:G=>[[null,"晚上七點。吃飽了、上了一整天學校的課，台下的眼神開始渙散。"],[null,"段考前一週，這個時候再檢討比較難的錯題，大概沒有人聽得進去。"]],
   choices:G=>[
    {label:"帶一下氣氛",note:"什麼時候講笑話、什麼時候說故事",mini:"mood",fx:r=>({voice:-4,stu:r.mood>=7?12:r.mood>=4?5:-4,trial:r.mood>=7?8:r.mood>=4?3:-3}),set:{},log:r=>`帶氣氛（${r.mood>=7?"全班醒了":r.mood>=4?"還可以":"冷場"}）`,
     res:r=>r.mood>=7?[[null,"最後十分鐘，連阿哲都抬起頭了。"]]:r.mood>=4?[[null,"有笑，但有人笑完又趴下了。"]]:[[null,"笑話講完，只有你自己在笑。"]]},
    {label:"發一張小考，邊寫邊巡",note:"順便批改",mini:"grade",fx:r=>({voice:5,stu:r.hits>=2?8:2,trial:r.hits>=2?5:-3}),log:r=>`發小考，批改抓對 ${r.hits}/3`,
     res:r=>r.hits>=2?[[null,"你一邊巡一邊批，錯在哪一行都圈出來。試聽生拿回考卷，看了很久。"]]:[[null,"你批得有點急，圈錯了地方。品妤舉手：老師，我這行哪裡錯？"]]}]},
  {id:"t_break",chapter:{t:"19:25",title:"下課十分鐘",sub:"走廊擠滿了等電梯的國中生。",status:"下課"},
   t:"19:26",target:{npc:"parent"},goal:"試聽家長在走廊等你",npc:{parent:AT("c9door",-1.6,.6,Math.PI/2)},after:{parent:null},
   pages:G=>[["parent","許老師嗎？我是試聽生的媽媽，我姓王。主任說下課可以上來問一下。"],["parent","我想請問……你們跟對面那間比，差在哪裡？"]],
   choices:G=>[
    {label:"講去年的會考成績",fx:{trial:6,par:3},log:"用榜單回答試聽家長",res:[["me","去年九年級數學，十五個有九個 A 以上。"],["parent","嗯。對面說他們十個。"]]},
    {label:"「今天他自己說卡在找對應邊，我從那裡開始檢討的。」",fx:G=>G.f.askedTrial?{trial:12,par:8}:{trial:3,par:2},log:"說今天怎麼教她的孩子",res:G=>G.f.askedTrial?[["parent","他有跟你說？他在家都不跟我講學校的事。"],[null,"她把手機收進包包，好像不急著走了。"]]:[["parent","……喔，是這樣嗎？"],[null,"她不太確定你說的是不是她兒子。"]]},
    {label:"「適不適合，要看他自己聽不聽得懂。」",fx:{trial:5,par:5},log:"請家長讓孩子自己決定",res:[["parent","……你們是第一間不跟我推銷的。"]]}]},
  {id:"t_hr",t:"19:32",target:{npc:"hr"},goal:"班導在門口等你",npc:{hr:AT("c9door",.8,.6,Math.PI/2)},after:{hr:PJ.back},
   pages:G=>[["hr","許老師，剛剛阿哲問我退費單在哪裡。"],[null,G.f.shamedZhe?"你想起他剛剛站在白板前面，寫了一個 x 就停住。":G.f.nudgedZhe?"你想起他講義上那個被劃掉的「2/5」。":"你想起他整節課都趴著。"],["hr","他說他從國一就聽不懂了。"]],
   choices:G=>[
    {label:"「下課我留下來跟他談。」",fx:{hp:-4,stu:6},set:{zheLater:1},log:"答應下課跟阿哲談",res:[["hr","真的嗎？他應該會想聽你說。"]]},
    {label:"「跟主任說，他需要基礎班，不是退費。」",fx:{stu:4,par:4},set:{zheBase:1},log:"建議阿哲上基礎班",res:[["hr","我等一下就去跟主任說。"]]},
    {label:"「這是家長跟補習班的事。」",fx:{hp:2,stu:-4},log:"不介入阿哲的退費",res:[["hr","……喔，好。"]]}]},
  {id:"t_lesson2",chapter:{t:"19:35",title:"第二節",sub:"19:35–21:00・段考衝刺",status:"上課中"},
   t:"19:40",target:{spot:"c9podium"},goal:"有人問：老師，段考會考什麼？",action:"回答",
   pages:G=>[["xiang","老師，段考會考什麼？你直接給我們答案好不好。"],[null,"全班笑了，但每個人都在等你回答。"]],
   choices:G=>[
    {label:"「我不給答案，我把你們以前卡住的地方再講清楚。」",fx:{voice:-10,stu:8,trial:6},log:"段考前把卡住的觀念重新釐清",res:[[null,"你把三種列比例的方法排在一起，讓他們自己挑。阿翔第一次自己算出來，喊了一聲「欸！」"]]},
    {label:"整理五個常考題型",fx:{voice:-8,stu:4,trial:8},log:"整理段考常考題型",res:[[null,"全班都在抄。很有效率，但沒有人問為什麼。"]]},
    {label:"講一個你國中數學考 32 分的故事",fx:{voice:-6,stu:10,trial:4},set:{told32:1},log:"講自己國中數學考 32 分的故事",res:[[null,"「我國二的時候數學考 32 分，我爸把考卷貼在冰箱上三個月。」"],[null,"全班安靜了。阿哲第一次抬起頭看你。"]]}]},
  {id:"t_after",chapter:{t:"21:00",title:"放學",sub:"大部分的人很快就搶電梯走了。",status:"放學"},
   t:"21:00",target:{spot:"c9podium"},goal:"回講台收東西",npc:{pinyu:AT("c9podium",-1.2,.8,Math.PI/2),zhe:G=>G.f.zheLater?AT("c9door",-1,.4,Math.PI):null,qing:null,xiang:null,trial:null},
   pages:G=>{const l=[[null,"品妤抱著講義站在講台邊。"]];if(G.f.zheLater)l.push([null,"阿哲背著書包，站在門口沒走。"]);l.push([null,"你還要騎二十分鐘回家，明天下午別間補習班的課還沒備。"]);return l;},
   choices:G=>{const c=[{label:"留下來陪品妤看完那題",fx:{hp:-8,voice:-4,stu:8},set:{stayedPinyu:1},log:"下課陪品妤看題目",res:[[null,"你們把找對應邊那題重做一次。第三題她自己做出來了。"],["pinyu","老師，我其實……每天兩點才睡。"]]}];
     if(G.f.zheLater)c.push({label:"先跟阿哲談",fx:{hp:-6,stu:12,par:5},set:{zheOpen:1},log:"下課跟阿哲談",res:[["zhe","……分數。我國一的分數就不會了。"],["me","那我們從分數開始。下週二提早半小時來。"],[null,"他點了一下頭，搶在電梯關門前衝進去。"]]});
     c.push({label:"請課輔老師阿宏幫忙",fx:{hp:4,stu:-3},log:"把問題交給課輔",res:[[null,"你帶品妤去課輔室。阿宏前面已經排了三個人。"]]});return c;}},
  {id:"t_boss",t:"21:12",target:{npc:"boss"},goal:"主任請你下樓",npc:{boss:PC.bossDesk,pinyu:null,zhe:null},
   pages:G=>{const n=enrolledT(G);G.f.enrolled=n;const l=[["boss",n?"試聽的王媽媽說，她兒子說聽得懂。下週一開始上。":"王媽媽說要回去考慮，對面也約了試聽。"]];if(G.f.zheBase||G.f.zheOpen)l.push(["boss","還有阿哲……鄭老師跟我說了。你覺得他需要什麼？"]);l.push(["boss","另外，寒假我想排你一週四天，可以嗎？"]);return l;},
   choices:G=>{const c=[];
     if(G.f.zheBase||G.f.zheOpen)c.push({label:"「開一個國一的分數基礎班，我來教。」",fx:{stu:8,hp:-4},set:{baseWinter:1},log:"提議開基礎班給阿哲",res:[["boss","基礎班不賺錢喔。"],["me","但它會留住人。"],["boss","……好。照你說的排。"]]});
     c.push({label:"「一週兩天就好，我還有別間的課。」",fx:{hp:4,par:-2},set:{winter2:1},log:"寒假只排兩天",res:[["boss","我懂。跑堂的老師都這樣。"]]});
     c.push({label:"「好，四天。」",fx:{hp:-8,par:5},set:{winter4:1},log:"寒假排四天",res:[["boss","太好了！"],[null,"你騎車回家的路上算了一下：寒假只剩三天是自己的。"]]});return c;}}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,n=dead?0:enrolledT(G);
  let t;
  if(dead&&s.hp<=0)t=["跑堂跑倒了","你在國中老師休息室的椅子上睡著了。阿宏幫你關了燈。"];
  else if(dead)t=["失聲下課","第二節還沒上完，你的聲音就沒了。鄭老師幫你發了考卷。"];
  else if(G.f.zheOpen&&s.stu>=70)t=["從分數開始","阿哲下週二會提早半小時來。這件事不會出現在榜單上。"];
  else if(n&&s.stu>=70)t=["主任口中的王牌","試聽生報名了，班上的學生也被你照顧到了。"];
  else if(s.stu>=75)t=["學生會記得的老師","今天有人是帶著一個觀念回家的，不只是答案。"];
  else if(n)t=["試聽收割機","試聽生報名了。班上的學生有點被晾在一旁，段考完再看。"];
  else t=["平安下課","沒有大好也沒有大壞。騎車回家，明天下午還有別間的課。"];
  return {title:t[0],desc:t[1],dead,big:[[n?"報名":"考慮中","試聽生"],[G.f.zheOpen?"有":"沒有","跟阿哲談過"]]};
 }
};
function enrolledT(G){return G.h.trial>=68?1:0;}

/* ---------- 數學老師的小遊戲 ---------- */
MINIS.quiz.qs=[["兩三角形相似，對應邊比 2 : 3。小的周長 10，大的周長？",["15","20","13","30"],0],["三角形兩邊中點連線長 4，第三邊長？",["8","4","2","6"],0],["AA 相似是指？",["兩組對應角相等","兩組對應邊成比例","三邊相等","一角一邊相等"],0],["相似比 1 : 2，面積比？",["1 : 4","1 : 2","1 : 8","2 : 1"],0],["人高 1.6 公尺、影長 2 公尺；同時樹影 10 公尺，樹高？",["8 公尺","12.5 公尺","6 公尺","16 公尺"],0]];
MINIS.grade.papers=[
 {who:"品妤",q:"△ABC ∼ △DEF，AB = 6、BC = 8、DE = 9，求 EF",lines:["AB/DE = EF/BC","6/9 = EF/8","EF = 16/3"],bad:0,why:"比例要同一個方向：AB/DE = BC/EF，6/9 = 8/EF，EF = 12。"},
 {who:"阿翔",q:"D、E 是 AB、AC 的中點，BC = 10，求 DE",lines:["DE // BC","DE = BC × 2","DE = 20"],bad:1,why:"兩邊中點連線是第三邊的一半：DE = 5。"},
 {who:"試聽生",q:"兩三角形相似比 2 : 3，小的面積 8，大的面積？",lines:["面積比 = 2 : 3","8 : x = 2 : 3","x = 12"],bad:0,why:"面積比是相似比的平方 4 : 9，所以 x = 18。"}
];
/* 帶氣氛：三個時刻，選擇最適合的做法，讓全班的精神回來 */
MINIS.mood={
  head:"九年級・帶氣氛",zone:"九年級教室",title:"什麼時候講笑話？",cost:4,
  intro:"全班的精神快沒了。每一個時刻選一種做法：講笑話、說故事、讓大家動一動，或繼續講。同一招用太多次就不好笑了。",
  rounds:[
   {say:"十九點零二分。第一排在打哈欠，最後一排已經趴下兩個。",opts:[["「全部站起來，兩手比一個三角形，跟隔壁的比大小。」",3],["講一個數學老師的冷笑話",1],["繼續講下一題",-1]]},
   {say:"十九點十分。大家醒了一點，但下一題是全班錯最多的對應邊。",opts:[["說一個「手機放大照片」的故事",3],["再講一個笑話",-1],["「這題段考常考，抄下來。」",1]]},
   {say:"十九點十八分。快下課了，阿哲抬起頭在看你。",opts:[["講你國中數學考 32 分的事",3],["「下課前再寫一題。」",0],["點阿哲回答",-2]]}
  ],
  mount(el,done){let r=0,mood=1;const self=this;
    function draw(){const R=self.rounds[r];
      el.innerHTML=`<div class="lab" style="display:flex;justify-content:space-between;font-size:.8rem"><span>全班的精神</span><b style="font-family:var(--mono)">${mood}</b></div><div class="track" style="height:8px"><div class="fill" style="width:${Math.max(0,Math.min(10,mood))*10}%;background:${mood>=7?"var(--green)":mood>=4?"var(--amber)":"var(--red)"}"></div></div>
       <div class="paper"><div class="q">第 ${r+1} / 3 個時刻</div>${esc(R.say)}</div><div class="choices">${R.opts.map((o,k)=>`<button class="choice" data-k="${k}">${esc(o[0])}</button>`).join("")}</div>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{mood=Math.max(0,mood+R.opts[+b.dataset.k][1]);r++;
        if(r<self.rounds.length)draw();else{el.innerHTML=`<p class="feed">${mood>=7?"下課鐘響的時候，有人說：「蛤，下課了喔？」":mood>=4?"有人醒了，有人又睡回去。":"台下一片安靜。不是專心的那種安靜。"}</p>`;done({mood});}}));}
    draw();}
};
