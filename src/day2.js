/* ================= 第二天：週三。昨天的選擇，今天都有後續 ================= */
/* G.prev = 這個位子第一天結束時的旗標；G.prevAll = 三個位子第一天的結果（跨線）。 */
const LINES2={};
const pv=G=>G.prev||{},pa=(G,id)=>((G.prevAll||{})[id]||{}).f||{};
const D2={zheEarly:[13,9,Math.PI/2],pinyuHall:[11.2,5.3,Math.PI],parentLobby:[5.2,15.3,Math.PI],chenLobby:[6.4,14.6,Math.PI],
  teacherLounge:[3.2,8,0],hongCounter:[5.2,12.6,Math.PI],yunDesk:[3.75,10.3,0],bossOffice:[3.5,1.2,0],teacherOffice:[4.6,3.6,Math.PI]};

/* ---------- 數學老師・第二天 ---------- */
LINES2.teacher={...LINES.teacher,day:2,
 pick:"第二天。昨天答應的、沒答應的，今天都會回來找你。",
 coda:"第二天比第一天難。因為你已經知道每個人叫什麼名字了。",
 msgs:[["17:40","B 班群組","小芸：今天小考範圍是空間向量第一節喔。"],["18:50","媽","今天也會很晚嗎？"],["20:12","何主任","下課來一下我辦公室。"],["21:30","B 班群組","品妤：老師今天的例題好清楚，謝謝！"]],
 npcs:{yun:P.yunDesk,boss:P.bossOffice,pinyu:P.pinyuSeat,zhe:D2.zheEarly,parent:null,parent2:null,hong:P.hongStudy,teacher:null},
 eventSlots:[{after:"t2prep",t:"18:22",phase:"pre"},{after:"t2class",t:"19:30",phase:"class"},{after:"t2parent",t:"20:40",phase:"class"}],
 steps:[
  {id:"t2note",chapter:{t:"17:20",title:"第二天・週三",sub:"昨天的事，今天都有後續。",status:"備課中",rush:["小芸手上有一張早上的留言。","今天小考，空間向量第一節。"]},
   t:"17:22",target:{npc:"yun"},goal:"小芸手上拿著一張便利貼",
   pages:G=>{const p=pv(G),l=[["yun","老師早～這是今天早上的留言。"]];
     if(p.freeTutor)l.push(["yun","林媽媽問，你答應的一對一，是這週六嗎？"]);
     if(p.shamedZhe)l.push(["yun","還有……林媽媽說，阿哲昨天回家把講義撕了。今天會不會來，她也不知道。"]);
     else if(p.zheOpen)l.push(["yun","阿哲五點半就到了，坐在走廊。他說是你昨天跟他約好的。"]);
     if(p.otEarly)l.push(["yun","你貼在影印機上那張「明早 7:30 印考卷」？我早上順手幫你印好了。"]);
     if(p.blamedHong)l.push(["yun","對了，阿宏說，我的便當不是他吃的。"]);
     if(l.length===1)l.push(["yun","今天沒有人打來抱怨。這可能是這個月第一次。"]);
     return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.freeTutor){c.push({label:"回覆林媽媽：週六早上十點",note:"說到做到",fx:{par:8,hp:-4},set:{tutorSat:1},log:"確認週六幫阿哲一對一",res:[["yun","好，我幫你回。……老師你週六也要來喔？"]]});
       c.push({label:"請小芸先別回，我要問主任",fx:{par:-3},set:{askBoss:1},log:"一對一的事先問主任",res:[["yun","了解。那我跟她說今天晚上回覆。"]]});}
     if(p.shamedZhe)c.push({label:"請小芸幫忙轉告：我想跟阿哲道歉",fx:{par:6,stu:3},set:{sorryZhe:1},log:"想跟阿哲道歉",res:[["yun","（愣了一下，然後笑了）好，我跟林媽媽說。"]]});
     if(p.blamedHong)c.push({label:"「……其實是我吃的。」",fx:{hp:-2,stu:2},set:{bentoTruth:1},log:"承認便當是自己吃的",res:[["yun","我就知道！今天的晚餐你請。"]]});
     c.push({label:"謝謝，先去備課",fx:{hp:3},log:"看完留言去備課",res:[["yun","加油喔，今天有小考。"]]});return c;}},
  {id:"t2zhe",t:"17:50",target:{npc:"zhe"},goal:"阿哲在走廊",
   pages:G=>{const p=pv(G),s=G.f;
     if(p.shamedZhe)return [[null,"阿哲來了。他站在走廊，看到你就把頭轉開。"],[null,s.sorryZhe?"他手上捏著手機，螢幕上是林媽媽的訊息：「老師說想跟你講話。」":"昨天那一聲笑，好像還留在走廊上。"]];
     if(p.zheOpen)return [[null,"阿哲坐在走廊的長椅上，腿上攤著一本高一的講義。"],["zhe","我把以前的講義翻出來了。這題……我算到這裡就卡住。"],[null,"是向量的長度。他算出了平方和，忘了開根號。"]];
     return [[null,"阿哲在走廊滑手機，看到你走過來，把手機收進口袋。"],["zhe","……老師好。"]];},
   choices:G=>{const p=pv(G);
     if(p.shamedZhe)return [
      {label:"「昨天叫你上台，是我不對。」",fx:{stu:12,hp:-3},set:{sorryZhe:1,zheBack:1},log:"跟阿哲道歉",res:[["zhe","……喔。"],[null,"他沒有多說什麼。但上課鐘響時，他坐到了倒數第二排。"]]},
      {label:"點點頭，走進教室",fx:{stu:-4},log:"沒跟阿哲說話",res:[[null,"他看著你走過去。你們都沒說話。"]]}];
     if(p.zheOpen)return [
      {label:"陪他把這題算完",note:"上課前還有一點時間",fx:{hp:-5,stu:10},set:{zheSolved:1},log:"上課前陪阿哲算完一題",res:[["me","最後一步，開根號。"],["zhe","……3。是 3 嗎？"],["me","是 3。"],[null,"他在答案旁邊畫了一個很小的圈。"]]},
      {label:"給他三題基礎題回家寫",fx:{stu:5},set:{zheHomework:1},log:"給阿哲三題基礎題",res:[["zhe","三題喔……好。"],[null,"他把紙折兩折，塞進講義裡。"]]}];
     return [
      {label:"問他昨天聽懂多少",fx:{stu:6,hp:-2},set:{zheAsked:1},log:"問阿哲聽懂多少",res:[["zhe","……一成吧。"],["me","一成也是一成。今天我們從那一成開始。"]]},
      {label:"叫他先進教室坐好",fx:{stu:-2},log:"叫阿哲進教室",res:[[null,"阿哲走進教室，坐到最後一排。"]]}];}},
  {id:"t2prep",t:"18:05",target:{spot:"podium"},goal:"回講台排今天的例題",action:"排例題",npc:{zhe:P.zheSeat},
   pages:G=>[[null,"今天的小考是空間向量第一節。你手上有五題例題，還沒決定順序。"],[null,pv(G).used14?"昨天用品妤的第 14 題開場效果很好。今天也想讓每個人都跟得上。":"昨天後排有人一開始就跟不上了。今天想讓每個人都跟得上。"]],
   choices:G=>[
    {label:"由淺到深排好",note:"點的順序就是上課的順序",mini:"order",fx:r=>({stu:r.right>=4?10:r.right>=2?4:-3,hp:-2}),log:r=>`排例題，${r.right}/5 題放對位置`,
     res:r=>r.right>=4?[[null,"從長度、到兩點求向量、到內積、到夾角。一步一步，最後一題才是平面。"]]:[[null,"順序有點亂。你在白板角落補寫了一行：「先看第 2 題。」"]]},
    {label:"照課本的順序",fx:{stu:2},log:"照課本順序上",res:[[null,"課本的順序沒有錯，只是有點跳。"]]}]},
  {id:"t2class",chapter:{t:"18:30",title:"第一節",sub:"18:30–19:50・小考",status:"上課中"},
   t:"18:30",target:{spot:"podium"},goal:"走上講台，開始上課",npc:{pinyu:P.pinyuSeat,zhe:G=>pv(G).shamedZhe&&!G.f.sorryZhe?P.zheSeat:[SEATS.zhe[0]-2.5,SEATS.zhe[1]-1.8,Math.PI]},
   pages:G=>{const p=pv(G),l=[[null,"小考卷發下去，教室安靜得只剩下筆的聲音。"]];
     if(p.stayedPinyu)l.push([null,"品妤第一個寫完向量那一大題。她沒有抬頭，但你看到她寫得很快。"]);
     if(G.f.zheSolved)l.push([null,"阿哲寫第一題時，在答案旁邊畫了一個很小的圈。"]);
     else if(G.f.zheBack)l.push([null,"阿哲坐在倒數第二排。比昨天前面一排。"]);
     l.push([null,"收卷之後，還有四十分鐘。"]);return l;},
   choices:G=>[
    {label:"當場檢討，錯最多的先講",fx:{voice:-12,stu:8},log:"小考當場檢討",res:[[null,"錯最多的是內積那題。你從「它在算什麼」開始講，品妤一直點頭。"]]},
    {label:"把會的人跟不會的人配成兩人一組",note:"你在旁邊巡",fx:{voice:-5,stu:6,hp:-4},set:{pairs:1},log:"兩人一組互相教",res:[[null,"教室吵了起來，但是是好的那種吵。"],[null,G.f.zheSolved||G.f.zheBack?"阿哲旁邊的人在跟他講長度那題。他點了兩次頭。":"後排有兩個人在偷聊天，但大部分的人都在講題目。"]]},
    {label:"直接上新進度",fx:{voice:-8,stu:-3},log:"小考後直接上新進度",res:[[null,"進度趕上了。改考卷時才發現，一半的人內積都錯同一個地方。"]]}]},
  {id:"t2pinyu",chapter:{t:"19:50",title:"下課",sub:"下課 15 分鐘。",status:"下課"},
   t:"19:52",target:{npc:"pinyu"},goal:"品妤在走廊等你",npc:{pinyu:D2.pinyuHall},
   pages:G=>{const p=pv(G);
     if(p.stayedPinyu)return [["pinyu","老師，向量那題我全對！"],["pinyu","……還有，我想問你一件事。我想念心理系，可是我媽說那個沒有前途。"]];
     if(p.promisedPinyu||p.talkedPinyu)return [["pinyu","老師，昨天你說下課再談……後來你好像很忙。"],["pinyu","沒關係啦。我只是想問，心理系是不是真的很難找工作。"]];
     return [["pinyu","老師……我可以問一個跟數學沒關係的問題嗎？"],["pinyu","我想念心理系，可是我還沒跟我媽說。"]];},
   choices:G=>[
    {label:"幫她想怎麼跟媽媽開口",fx:{stu:10,hp:-5},set:{pinyuPlan:1},log:"陪品妤想怎麼跟媽媽說",res:[["me","先不要說「我想念」，先說「我查了這些」。帶著資料去講。"],["pinyu","……好。我回去查。"]]},
    {label:"說先專心準備學測",fx:{stu:-3,par:3},log:"叫品妤先專心學測",res:[["pinyu","嗯……也是。"],[null,"她把筆記本收起來的動作，比平常慢一點。"]]},
    ...(pv(G).promisedPinyu?[{label:"先為昨天的事道歉",fx:{stu:8},set:{pinyuSorry:1},log:"為昨天沒留下來道歉",res:[["pinyu","真的沒關係。……不過謝謝你記得。"]]}]:[])]},
  {id:"t2parent",t:"19:58",target:{npc:"parent"},goal:"王媽媽在大廳",npc:{parent:D2.parentLobby,parent2:G=>(G.prev.enrolled||G.prev.retry)?[6.4,15.3,Math.PI]:null},after:{parent:null,parent2:null},
   pages:G=>{const p=pv(G),n=p.enrolled||0;
     if(n>=1)return [["parent","老師！我兒子今天正式上課了。"],["parent","他昨天回家說：「那個老師會告訴你錯在哪一行。」他很少這樣講老師。"]];
     if(p.retry)return [["parent","我們又來試聽了。他說想再聽一次再決定。"]];
     return [["parent","老師你好……我們最後報了對面。"],["parent","今天是來還試聽的講義。他說你的講義比較好懂，可是對面比較近。"]];},
   choices:G=>{const p=pv(G),n=p.enrolled||0;
     if(n>=1)return [
      {label:"請他坐前面一點",fx:{stu:4,par:6},log:"讓新生坐前排",res:[["parent","好好好，謝謝老師。"]]},
      {label:"跟王媽媽說：有問題直接問我",fx:{par:8,hp:-2},log:"讓家長直接聯絡自己",res:[["parent","真的嗎？那我加你 LINE。"],[null,"你的手機多了一個聯絡人。今晚大概會多三則訊息。"]]}];
     if(p.retry)return [
      {label:"「今天上的是小考檢討，剛好看得出他卡在哪。」",fx:{par:6,trial:10},set:{enrolled2:1},log:"第二次試聽",res:[["parent","那我們今天就報名吧。"]]},
      {label:"請小芸幫他們找座位",fx:{par:2},log:"請小芸安排第二次試聽",res:[[null,"王媽媽坐在窗邊，又打開了那本筆記本。"]]}];
     return [
      {label:"「講義留著吧，有不懂的可以來問。」",fx:{par:10,hp:-2},set:{keptHandout:1},log:"讓沒報名的學生留著講義",res:[["parent","……這樣好嗎？"],["me","講義本來就是要給人看懂的。"],[null,"王媽媽鞠了一個躬才走。"]]},
      {label:"收下講義，祝他們順利",fx:{par:2},log:"收回試聽講義",res:[[null,"王媽媽走出門口，又回頭看了一眼招生海報。"]]}];}},
  {id:"t2mom",chapter:{t:"21:15",title:"下課",sub:"林媽媽在電話上。",status:"收拾中"},
   t:"21:18",target:{npc:"yun"},goal:"小芸說林媽媽在電話上",npc:{zhe:null,pinyu:null},
   pages:G=>{const p=pv(G),l=[["yun","老師，林媽媽。她說想聽你講阿哲今天的狀況。"]];
     if(p.called)l.push([null,"昨天你跟她講過電話。今天她的聲音沒有那麼急了。"]);
     l.push(["mom","老師，他今天……還好嗎？"]);return l;},
   choices:G=>[
    {label:"挑三件事跟她說",note:"只講三件，她才記得住",mini:"summary",fx:r=>({par:r.v>=7?12:r.v>=4?5:-4,voice:-4}),log:r=>`跟林媽媽講阿哲的三件事（${r.v>=7?"講得很好":r.v>=4?"還可以":"講錯重點"}）`,
     res:r=>r.v>=7?[["mom","……他自己算出來的？"],[null,"電話那頭安靜了一下。"],["mom","謝謝老師。我今天不罵他了。"]]:[["mom","好，我知道了。"],[null,"她聽起來還是很擔心。"]]},
    {label:"請小芸跟她說明天再回",fx:{hp:3,par:-5},log:"林媽媽的電話延到明天",res:[["yun","（摀住話筒）她說好……但她聽起來很失望。"]]}]},
  {id:"t2boss",t:"21:40",target:{npc:"boss"},goal:"去主任室",
   pages:G=>{const p=pv(G),l=[["boss","坐。兩件事。"]];
     if(G.f.tutorSat)l.push(["boss","第一，你週六要幫阿哲一對一？小芸跟我說了。"]);
     else if(G.f.askBoss)l.push(["boss","第一，你說一對一的事要先問我？謝謝你先問。"]);
     else l.push(["boss","第一，今天的小考成績我看了。內積那題，全班錯一半。"]);
     l.push(["boss","第二，寒假要開衝刺班。我想排你一週四天。"]);
     if(pv(G).otNo)l.push([null,"昨天你跟主任說「排不出來」。他好像還記得。"]);return l;},
   choices:G=>[
    {label:"一週兩天，其他時間留給基礎班",note:"幫阿哲那種學生",fx:{stu:10,hp:-3},set:{baseWinter:1},log:"寒假只排兩天，另開基礎班",res:[["boss","基礎班不賺錢喔。"],["me","但是它會留住人。"],["boss","……好。照你說的排。"]]},
    {label:"照主任說的排四天",fx:{hp:-10,par:5},set:{winter4:1},log:"寒假排四天",res:[["boss","太好了，謝謝你。"],[null,"你回家的路上算了一下：寒假只剩三天是自己的。"]]},
    {label:"「先讓我想一個晚上。」",fx:{hp:4},log:"寒假排課先想想",res:[["boss","可以。明天給我答案。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,f=G.f;
  let t;
  if(dead)t=["第二天也撐不住","連續兩天，你的身體先投降了。主任說：明天找人代課。"];
  else if((f.zheSolved||f.sorryZhe||f.zheAsked)&&f.pinyuPlan&&s.stu>=70)t=["記得每個名字的老師","阿哲算出了一題，品妤查好了資料。這兩件事都不會出現在週報上。"];
  else if(s.stu>=72)t=["今天有人聽懂了","小考的平均沒有高多少，但今天教室裡，抬頭的人比昨天多。"];
  else if(s.par>=72)t=["家長的定心丸","家長群組今天很安靜。安靜，就是最好的評價。"];
  else if(s.hp<25)t=["連上兩天的代價","課是上完了。回家的路上，你在捷運上睡過站。"];
  else t=["又一個晚上","第二天沒有第一天那麼驚險。但補習班的每一天都是這樣接下去的。"];
  return {title:t[0],desc:t[1],dead,big:[[f.zheSolved?"1 題":"—","阿哲自己算出來的"],[f.winter4?"4 天":f.baseWinter?"2 天＋基礎班":"未定","寒假排課"]]};
 }
};

/* ---------- 櫃台班導・第二天 ---------- */
LINES2.yun={...LINES.yun,day:2,
 pick:"第二天。昨天沒回的電話，今天會先響。",
 coda:"便利貼撕掉一張，又會貼上一張。但你今天記得先吃晚餐了。",
 msgs:[["17:36","何主任","今天王媽媽會再來一次。"],["18:44","妹妹","毛線今天把整包衛生紙拖到床底下了"],["20:02","阿宏","陳爸爸剛剛問小柏的事，我說你知道"],["21:24","媽","今天也有留菜。"]],
 npcs:{boss:P.bossOffice,teacher:PY.teacherLounge,pinyu:P.pinyuSeat,zhe:P.zheSeat,hong:P.hongStudy,bo:PY.boStudy,parent:null,parent2:null,yun:null,chenba:null},
 eventSlots:[{after:"y2mom",t:"17:55",phase:"pre"},{after:"y2order",t:"19:10",phase:"class"},{after:"y2bo",t:"20:00",phase:"break"}],
 steps:[
  {id:"y2open",chapter:{t:"17:20",title:"第二天・週三",sub:"昨天的便利貼，還貼在螢幕邊框上。",status:"營業中",rush:["螢幕邊框上有六張便利貼。","今天只來得及先處理三件。"]},
   t:"17:22",target:{spot:"counter"},goal:"看螢幕上的便利貼",action:"看便利貼",
   pages:G=>{const o=(G.prevAll||{}).yun||{},h=o.h||{},n=Math.max(0,Math.round((h.missed||0)-(h.cleared||0)+2));
     return [[null,`螢幕邊框上貼著昨天的便利貼。${n?`還有 ${n} 通電話沒回。`:"昨天的電話都回完了，只剩一些雜事。"}`],[null,"影印機還沒開，電話還沒響。這是今天唯一安靜的十分鐘。"]];},
   choices:G=>[
    {label:"挑最急的三件先處理",mini:"summary",fx:r=>({ord:r.v>=7?10:r.v>=4?4:-4,pat:-2}),log:r=>`挑三件事先做（${r.v>=7?"挑得很準":r.v>=4?"還可以":"挑錯了"}）`,
     res:r=>r.v>=7?[[null,"三張便利貼撕下來，揉成一團。剩下的三張，晚一點也沒關係。"]]:[[null,"你處理完三件，才發現最急的那件還貼在螢幕上。"]]},
    {label:"從最上面一張開始，照順序來",fx:{pat:-5,ord:2},log:"便利貼照順序處理",res:[[null,"第一張是「冷氣遙控器：阿宏要」。這件事花了你十分鐘。"]]}]},
  {id:"y2mom",t:"17:45",target:{spot:"counter"},goal:"電話響了",action:"接電話",
   pages:G=>{const p=pv(G);
     if(p.refundForm)return [["mom","我是阿哲的媽媽。昨天你給我的退費試算……我看了一整晚。"],["mom","他說他不想退。他說櫃台的姐姐有跟他講話。"]];
     if(p.zheTalk)return [["mom","我是阿哲的媽媽。他昨天回家，說櫃台的姐姐陪他聊了一下。"],["mom","他很久沒有主動跟我說補習班的事了。"]];
     return [["mom","我是阿哲的媽媽。我想問……他昨天上課到底怎麼樣？"]];},
   choices:G=>[
    {label:"跟她說阿哲今天也有來",fx:{par:6,pat:-2},log:"跟林媽媽說阿哲有來",res:[["mom","……他有來就好。"]]},
    {label:"幫她轉給許老師，約下課後",fx:{par:3,ord:3},set:{momToTeacher:1},log:"把林媽媽轉給許老師",res:[["mom","好，那我九點多再打。"]]},
    ...(pv(G).refundForm?[{label:"「退費單先放我這裡，不急。」",fx:{par:10,pat:-3},set:{refundHold:1},log:"先壓著阿哲的退費單",res:[["mom","……謝謝你。真的。"]]}]:[])]},
  {id:"y2parent",t:"18:08",target:{npc:"parent"},goal:"王媽媽來了",npc:{parent:D2.parentLobby,parent2:[6.4,15.3,Math.PI]},after:{parent:null,parent2:null},
   pages:G=>{const p=pv(G);
     if(p.lieDiscount)return [["parent","小芸，我問了主任。他說根本沒有什麼早鳥價。"],["parent","你昨天為什麼要那樣說？"]];
     if(p.discount)return [["parent","昨天你說的早鳥價，今天報名還算嗎？"]];
     if(p.enrolled)return [["parent","今天開始正式上課了！要填什麼資料嗎？"]];
     return [["parent","我們想再試聽一次。昨天他說聽得懂，可是我還想再看看。"]];},
   choices:G=>{const p=pv(G);
     if(p.lieDiscount)return [
      {label:"老實道歉：是我講錯了",fx:{par:5,pat:-5},set:{apologized:1},log:"跟王媽媽承認早鳥價是自己講錯",res:[["parent","……好吧。至少你承認。"],[null,"她最後還是填了報名表，只是沒有再對你笑。"]]},
      {label:"說是誤會，請主任出來",fx:{par:-8,pat:3},log:"把早鳥價的事推給主任",res:[["parent","每個人都說是誤會。"],[null,"主任出來陪笑了十分鐘。"]]}];
     if(p.discount)return [
      {label:"照答應的算",fx:{par:8,ord:-3},log:"照昨天答應的價格算",res:[["parent","你們說話算話，我就放心了。"]]},
      {label:"請主任確認後再回覆",fx:{par:-2,ord:3},log:"價格請主任確認",res:[["parent","好，那我等你們電話。"]]}];
     return [
      {label:"幫他準備座位和講義",fx:{par:6,ord:3},set:{enrolled2:1},log:"幫試聽生準備座位",res:[[null,"你把講義放在前排的桌上，旁邊放了一支筆。"],["parent","你們好細心喔。"]]},
      {label:"請他們自己進教室找位子",fx:{par:-2},log:"請試聽生自己找位子",res:[[null,"他們在走廊站了一下，才找到 B 班。"]]}];}},
  {id:"y2order",chapter:{t:"18:30",title:"第一節",sub:"上課了。電話開始響。",status:"上課中"},
   t:"18:35",target:{spot:"counter"},goal:"整理今晚要回的電話",action:"排順序",
   pages:G=>[[null,"上課鐘一響，電話就跟著響。五通留言，你要決定先回哪一通。"]],
   choices:G=>[
    {label:"按急迫程度排好",note:"點的順序就是回電的順序",mini:"order",fx:r=>({ord:r.right>=4?8:r.right>=2?3:-3,par:r.right>=3?4:0}),log:r=>`排回電順序，${r.right}/5 通排對`,
     res:r=>r.right>=4?[[null,"最急的先回，能等的放最後。九點前全部回完。"]]:[[null,"回到第三通才發現，第五通的家長已經在樓下等了。"]]},
    {label:"誰先打來就先回誰",fx:{pat:-4},log:"電話照時間回",res:[[null,"公平，但不一定對。"]]}]},
  {id:"y2bo",chapter:{t:"19:50",title:"下課",sub:"陳爸爸提早來了。",status:"下課"},
   t:"19:55",target:{npc:"chenba"},goal:"陳爸爸在大廳",npc:{chenba:D2.chenLobby},after:{chenba:null},
   pages:G=>{const p=pv(G);
     if(p.knowBo)return [["chenba","昨天謝謝你。你怎麼知道他在 7-11？"],["chenba","我想拜託你一件事。他每天九點會跑出去，你可以……幫我看一下嗎？"]];
     return [["chenba","昨天的事我想了一晚上。他出去半小時，補習班都沒人知道？"],["chenba","我不是要罵你們。我只是想知道，以後怎麼辦。"]];},
   choices:G=>[
    {label:"答應九點傳訊息給他",fx:{par:10,pat:-4},set:{boMsg:1},log:"答應每天九點跟陳爸爸報平安",res:[["chenba","……謝謝。真的謝謝。"],[null,"你在手機設了一個每天 21:00 的鬧鐘。"]]},
    {label:"請阿宏盯自習室的登記表",fx:{ord:8,par:4},set:{signRule:1},log:"自習室外出要登記",res:[["chenba","這樣好。有規定比較好。"],[null,"阿宏在登記表上加了一欄：「去哪裡」。"]]},
    {label:"說補習班管不到外面",fx:{par:-8,pat:4},log:"跟家長說外出管不到",res:[["chenba","……我知道了。"],[null,"他走的時候，沒有跟你說再見。"]]}]},
  {id:"y2teacher",chapter:{t:"21:15",title:"下課",sub:"老師們回到休息室。",status:"收拾中"},
   t:"21:18",target:{npc:"teacher"},goal:"許老師在休息室",
   pages:G=>{const p=pv(G),l=[];
     if(p.teacherNoBreak)l.push(["teacher","（沙啞）昨天下課接完電話，今天嗓子就這樣了。"]);
     else l.push(["teacher","今天的小考，阿哲自己算出一題。"]);
     if(G.f.momToTeacher)l.push(["teacher","林媽媽的電話我接了。謝謝你先幫我擋一下。"]);
     l.push(["teacher","小芸，你今天有吃晚餐嗎？"]);return l;},
   choices:G=>[
    {label:"「……還沒。」然後去吃",fx:{hp:12,pat:4},log:"終於去吃晚餐",res:[[null,"你在休息室吃了今天第一口飯。便利貼「記得吃晚餐」終於可以撕掉了。"]]},
    {label:"泡一杯熱茶給許老師",fx:{hp:-2,pat:5},log:"幫許老師泡熱茶",res:[["teacher","你自己也喝一杯吧。"],[null,"你們兩個坐在休息室，誰都沒說話，喝完了一整杯。"]]}]},
  {id:"y2boss",t:"21:40",target:{npc:"boss"},goal:"主任找你",
   pages:G=>{const b=pa(G,"boss"),l=[];
     if(b.yunLeave)l.push(["boss","……我昨天想了一晚。如果你真的想走，我不會攔你。但我想先問你，是哪裡讓你想走？"]);
     else if(b.yunStay)l.push(["boss","我說過要幫你分擔。所以下個月，櫃台會多一個工讀生。"]);
     else l.push(["boss","寒假要開衝刺班。櫃台會更忙。你撐得住嗎？"]);
     return l;},
   choices:G=>[
    {label:"說出來：櫃台需要第二個人",fx:{pat:8,ord:5},set:{askedHelp:1},log:"跟主任說櫃台需要人手",res:[["boss","好。我寫進總部的申請。這次寫你的名字。"]]},
    {label:"說沒問題，我可以",fx:{pat:-8,par:3},log:"說自己撐得住",res:[["boss","謝謝你。"],[null,"你走出主任室，在便利貼寫下：「撐得住嗎？」然後又撕掉了。"]]},
    {label:"「我週末想要完整休兩天。」",fx:{hp:8,ord:-2},set:{weekend:1},log:"跟主任要週末休假",res:[["boss","（想了一下）合理。我排排看。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=["第二天也投降了","你請了明天的假。主任說：好，先休息。"];
  else if(f.askedHelp&&s.ord>=65)t=["櫃台不是一個人","今天你第一次開口要人手。原來說出來，事情真的會變。"];
  else if(s.par>=72)t=["家長最信任的人","陳爸爸、林媽媽、王媽媽，今天都記得你的名字。"];
  else if(s.ord>=70)t=["有條有理的櫃台","電話照順序回、便利貼照順序撕。今天櫃台沒有亂。"];
  else if(s.hp>=70)t=["今天有吃晚餐","這聽起來很小。但對櫃台來說，是很大的進步。"];
  else t=["又一個晚上","第二天的便利貼，比第一天少一張。"];
  return {title:t[0],desc:t[1],dead,big:[[f.boMsg||f.signRule?"有":"沒有","小柏的外出規則"],[f.askedHelp?"申請中":f.weekend?"週末休兩天":"照舊","櫃台人手"]]};
 }
};

/* ---------- 補習班主任・第二天 ---------- */
LINES2.boss={...LINES.boss,day:2,
 pick:"第二天。週報送出去了，總部的電話會來。",
 coda:"數字下週還會再來一次。但今天，你知道數字後面是誰。",
 msgs:[["17:28","總部","區經理今天會打電話給您。"],["18:46","粉專通知","對面補習班：寒假衝刺班七折，限量 30 名"],["20:20","老婆","今天會早一點嗎？"],["21:22","小芸","主任，工讀生的面試我排在週五。"]],
 npcs:{yun:P.yunDesk,teacher:P.teacherLounge,pinyu:P.pinyuSeat,zhe:P.zheSeat,hong:P.hongStudy,bo:PY.boStudy,parent:null,parent2:null,boss:null,chenba:null},
 eventSlots:[{after:"b2copier",t:"18:05",phase:"pre"},{after:"b2price",t:"19:30",phase:"class"},{after:"b2report",t:"21:00",phase:"class"}],
 steps:[
  {id:"b2hq",chapter:{t:"17:20",title:"第二天・週三",sub:"週報送出去了。總部的電話會來。",status:"營業中",rush:["區經理今天會打來。","對面發了新傳單：七折。"]},
   t:"17:22",target:{spot:"bossdesk"},goal:"總部打電話來了",action:"接電話",
   pages:G=>{const p=pv(G);
     if(p.lied)return [[null,"區經理的聲音很平靜。"],[null,"「何主任，你們上週 85%，這週我看系統，怎麼只有 74%？」"]];
     if(p.explained)return [[null,"區經理說：「你的說明我看完了。影印機那段，我拿去給採購看。」"],[null,"「不過，續班率還是要拉。下季目標不變。」"]];
     if(p.otDodge)return [[null,"「何主任，昨天網路還好嗎？」區經理笑了一下。"],[null,"「我們今天好好談一下數字。」"]];
     return [[null,"「何主任，週報收到了。78%，沒有達標。」"],[null,"「我想聽你說，下一步是什麼。」"]];},
   choices:G=>{const p=pv(G),c=[];
     if(p.lied)c.push({label:"承認：上週的數字是先填的",fx:{rep:8,calm:-10},set:{confessed:1},log:"跟總部承認週報數字是先填的",res:[[null,"電話那頭安靜了很久。"],[null,"「……謝謝你說實話。下次不要這樣。」"]]},
       {label:"說是系統延遲",fx:{calm:5,rep:-10},set:{lied2:1},log:"把數字差異推給系統",res:[[null,"「好，我請資訊部查。」"],[null,"你掛掉電話，手心都是汗。"]]});
     c.push({label:"提出開基礎班的計畫",note:"留住跟不上的學生",fx:{rep:6,calm:-4},set:{basePlan:1},log:"跟總部提基礎班",res:[[null,"「基礎班？賺得了錢嗎？」"],["me","賺不了。但它會讓續班率回來。"],[null,"「……寫一份企劃給我。」"]]});
     c.push({label:"說會加強電話行銷",fx:{sales:6,morale:-4},log:"跟總部說會加強電話行銷",res:[[null,"「好，下週看數字。」"]]});return c;}},
  {id:"b2copier",t:"17:50",target:{spot:"copier"},goal:"影印機那邊有人在叫",
   pages:G=>pv(G).newCopier?[[null,"新的影印機到了。很大、很白、很安靜。"],["yun","主任……它的螢幕全部是英文。"]]:[[null,"影印機又卡紙了。小芸站在旁邊，表情像是在看一個老朋友生病。"],["yun","主任，它昨天被你修過一次，今天又……"]],
   choices:G=>pv(G).newCopier?[
     {label:"陪小芸一起把設定改成中文",fx:{morale:8,calm:-3},log:"陪小芸設定新影印機",res:[[null,"你們蹲在影印機前面二十分鐘，終於找到語言設定。"],["yun","主任你剛剛跟我一起蹲著耶。"]]},
     {label:"請廠商明天來教",fx:{calm:3,morale:-2},log:"新影印機請廠商來教",res:[["yun","好……那今天先用舊的。"]]}]:[
     {label:"捲起袖子自己拉",mini:"jam",fx:r=>({calm:r.tears?-6:-2,morale:5}),log:r=>r.tears?`主任修影印機，撕破 ${r.tears} 次`:"主任親手修好影印機",res:r=>r.tears?[[null,"紙拉出來了，袖子黑了。"],["yun","主任，濕紙巾。"]]:[[null,"四張紙都完整拉出來。小芸在旁邊拍手。"]]},
     {label:"當場下訂新的影印機",fx:{sales:-8,morale:10},set:{newCopier2:1},log:"終於下訂新影印機",res:[["yun","真的嗎？！"],[null,"小芸在便利貼上寫：「阿卡，謝謝你這八年。」貼在舊影印機上。"]]}]},
  {id:"b2yun",t:"18:15",target:{npc:"yun"},goal:"小芸在櫃台",after:{yun:G=>G.f.yunEarly?null:P.yunDesk},
   pages:G=>{const p=pv(G);
     if(p.yunLeave)return [[null,"小芸把一個信封放在櫃台上。上面寫著：「離職申請」。"],["yun","主任，我想做到下個月底。這是我想了很久的。"]];
     if(p.yunStay)return [[null,"櫃台多了一個便利貼架，上面寫著：「待辦，不是待命。」"],["yun","主任，我把今天的事分成三類了。紅色是一定要今天做的。"]];
     if(p.hongPhones)return [["hong","（拿著話筒）您好，這裡是……呃，補習班。"],["yun","（小聲）主任，他接電話的開場白我教了三次了。"]];
     return [["yun","主任，昨天的試聽家長，今天要再來一次。"],[null,"她講話的時候，眼睛下面有很深的黑眼圈。"]];},
   choices:G=>{const p=pv(G);
     if(p.yunLeave)return [
      {label:"收下，問她想做到什麼時候",fx:{morale:5,calm:-6},set:{acceptLeave:1},log:"收下小芸的離職申請",res:[["yun","謝謝主任沒有罵我。"],[null,"她走回櫃台，背挺得比平常直一點。"]]},
      {label:"「如果有一件事改變，你會留下來嗎？」",fx:{morale:8,calm:-4},set:{yunAsk:1},log:"問小芸什麼能讓她留下",res:[["yun","……如果櫃台有第二個人。"],[null,"你把信封收進抽屜，沒有拆。"]]}];
     return [
      {label:"「今天你六點就下班。」",fx:{morale:10,calm:-5},set:{yunEarly:1},log:"讓小芸提早下班",res:[["yun","……真的嗎？那電話誰接？"],["me","我接。"]]},
      {label:"謝謝她，請她繼續加油",fx:{morale:2},log:"跟小芸說加油",res:[["yun","嗯，加油。"]]}];}},
  {id:"b2price",chapter:{t:"18:30",title:"第一節",sub:"上課了。門口有家長在等你。",status:"上課中"},
   t:"18:40",target:{npc:"chenba"},goal:"有家長拿著傳單在大廳",npc:{chenba:D2.chenLobby},after:{chenba:null},
   pages:G=>pv(G).priceWar?[["chenba","主任，聽說你們新生打八折了？那我們老生呢？"],[null,"他手上拿著兩張傳單：你們的八折，對面的七折。"]]:[["chenba","主任，對面打七折耶。你們不考慮嗎？"],[null,"他手上拿著對面的傳單，摺得很整齊。"]],
   choices:G=>[
    {label:"「我們不打折。但我們記得孩子的名字。」",fx:{rep:10,sales:-4},log:"不跟對面打價格戰",res:[["chenba","……這句話好像廣告。"],[null,"但他把對面的傳單揉成一團，丟進了你們的垃圾桶。"]]},
    {label:"給老生一樣的折扣",fx:{sales:-8,rep:6,calm:-3},set:{oldDiscount:1},log:"給老生也打折",res:[["chenba","這樣才公平嘛。"]]},
    {label:"推出分期付款",fx:{sales:4,rep:4},set:{installment:1},log:"推出學費分期",res:[["chenba","分期喔……這樣我比較好跟他媽媽說。"]]}]},
  {id:"b2mom",chapter:{t:"19:50",title:"下課",sub:"林媽媽打電話來了。",status:"下課"},
   t:"19:55",target:{spot:"counter"},goal:"櫃台電話在響",action:"接電話",
   pages:G=>[...(G.f.yunEarly?[[null,"小芸六點就下班了。你說過，電話你接。"]]:[["yun","主任，林媽媽找你。"]]),...(pv(G).baseClass?[["mom","主任，寒假那個高一的複習班，阿哲說他要去。"],["mom","他從來沒有主動說要上課過。"]]:[["mom","主任，我想來想去，還是想問退費的事。"],["mom","他說他聽不懂。我也不知道該怎麼辦了。"]])],
   choices:G=>pv(G).baseClass?[
     {label:"「我們幫他保留位子。」",fx:{rep:8,morale:3},log:"幫阿哲保留基礎班位子",res:[["mom","謝謝主任。"],[null,"電話掛掉之後，你在寒假班的名單上寫下阿哲的名字。第一個。"]]},
     {label:"請許老師親自打給她",fx:{rep:5,morale:-2},log:"請許老師回林媽媽電話",res:[[null,"許老師說：「好，我下課打。」他聽起來很高興。"]]}]:[
     {label:"先照規定試算退費",fx:{sales:-6,rep:4},log:"幫林媽媽試算退費",res:[["mom","……好，我再想想。"]]},
     {label:"提出免費旁聽基礎班",fx:{rep:10,sales:-2,calm:-3},set:{baseClass2:1},log:"讓阿哲免費旁聽基礎班",res:[["mom","免費？……你們為什麼要這樣做？"],["me","因為他不是不想念。他只是從高一就沒跟上。"]]}]},
  {id:"b2report",t:"20:40",target:{spot:"bossdesk"},goal:"回辦公室寫給總部的說明",action:"開始寫",
   pages:G=>[[null,"區經理說：「寫三行就好。我會轉給總經理。」"],[null,"三行。整間補習班的事，只能寫三行。"]],
   choices:G=>[
    {label:"挑最重要的三件寫",mini:"summary",fx:r=>({rep:r.v>=7?10:r.v>=4?4:-4,calm:-3}),log:r=>`寫給總部的三行（${r.v>=7?"說到重點":r.v>=4?"還可以":"沒說到重點"}）`,
     res:r=>r.v>=7?[[null,"你按下送出。五分鐘後，區經理回了一個字：「收」。"],[null,"然後又一封：「人手的部分，我幫你提。」"]]:[[null,"送出之後，區經理回：「數字呢？」"]]},
    {label:"只寫數字",fx:{calm:3,rep:-4},log:"給總部只寫數字",res:[[null,"74%、2 位試聽、0 位退費。三個數字，三行。"]]}]},
  {id:"b2teacher",chapter:{t:"21:15",title:"下課",sub:"許老師在休息室。",status:"收拾中"},
   t:"21:20",target:{npc:"teacher"},goal:"許老師在休息室",npc:{teacher:P.teacherLounge},
   pages:G=>{const t=pa(G,"teacher"),l=[["teacher","主任，寒假的課，你想排我幾天？"]];
     if(t.otNo)l.push(["teacher","我昨天說排不出來……其實不是不想。是嗓子真的撐不住。"]);
     if(t.zheOpen||t.baseWinter)l.push(["teacher","還有，我想開一個高一的基礎班。給阿哲那種學生。"]);
     return l;},
   choices:G=>[
    {label:"一週兩天，加一個基礎班",fx:{morale:10,sales:-4},set:{teacherBase:1},log:"寒假給許老師排兩天加基礎班",res:[["teacher","……謝謝主任。"],[null,"他走出去之前，回頭說：「我會把它教好。」"]]},
    {label:"一週四天，總部要的",fx:{sales:8,morale:-8},log:"寒假給許老師排四天",res:[["teacher","好。"],[null,"他只說了一個字。"]]},
    {label:"「你自己決定。」",fx:{morale:6,calm:-2},log:"讓許老師自己決定寒假排課",res:[["teacher","我想一下，明天跟你說。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.calm<=0,f=G.f,p=pv(G);
  let t;
  if(dead)t=["第二天先倒下的是主任","你在車上睡著了，醒來時停車場已經關燈。"];
  else if(f.lied2)t=["謊要用謊來圓","系統延遲。這四個字，下週你還要再說一次。"];
  else if(f.confessed&&s.rep>=60)t=["說了實話的第二天","總部沒有罵你。他們只是開始相信你的數字了。"];
  else if((f.basePlan||f.baseClass2||f.teacherBase)&&s.morale>=65)t=["開一個不賺錢的班","基礎班不會讓週報好看，但它會讓明年的續班名單長一點。"];
  else if(s.morale>=72)t=["大家願意留下來","今天休息室有人在笑。你很久沒聽到了。"];
  else if(s.sales>=70)t=["數字回來了","業績回來了。只是你有點想不起來，今天有沒有跟誰好好說話。"];
  else t=["又一個晚上","主任的第二天，跟第一天一樣，在很多個「差一點」之間做選擇。"];
  return {title:t[0],desc:t[1],dead,big:[[f.basePlan||f.baseClass2||f.teacherBase?"開":"不開","寒假基礎班"],[f.confessed?"說了":f.lied2?"又圓了一次":"—","週報的實話"]]};
 }
};

/* ---------- 第二天的小遊戲 ---------- */
/* 只講三件事：從六件裡挑三件 */
MINIS.summary={
  head:"只講三件事",zone:"三行",title:"挑三件最重要的",cost:4,
  get intro(){return {teacher:"林媽媽在電話那頭。她記不住太多事，你只講三件。挑對她最有用的三件。",yun:"螢幕邊框上有六張便利貼。今天先處理三張，挑最急的。",boss:"總部只看三行。挑三件最能說明這間補習班現在需要什麼的事。"}[G&&G.line.id]||"挑三件。";},
  sets:{
   teacher:[["他今天自己算出一題向量的長度",3],["他的基礎要從高一的向量補起",2],["下週開始每週提早半小時來",3],["他上課會畫畫，畫得很像",1],["他昨天上課手機沒關聲音",0],["模考 3 級分，全班最低",0]],
   yun:[["陳爸爸：九點要確認小柏在不在",3],["王媽媽：今天會再來，報名表要準備好",3],["林媽媽：退費的事要回電",2],["影印機：碳粉剩 10%",1],["冷氣遙控器：阿宏要",0],["上週的收據要歸檔",0]],
   boss:[["櫃台只有一個人，電話和點名顧不過來",3],["有學生從高一就跟不上，需要基礎班",3],["影印機老舊，每天卡紙影響上課",2],["對面打七折，家長在比價",1],["本週續班率比上週低",0],["老師們都很努力",0]]},
  mount(el,done){const list=this.sets[G.line.id]||this.sets.teacher,pick=new Set(),order=list.map((_,i)=>i).sort(()=>Math.random()-.5);
    el.innerHTML=`<div class="choices">${order.map(i=>`<button class="choice" data-i="${i}" aria-pressed="false">${esc(list[i][0])}</button>`).join("")}</div><p class="feed" aria-live="polite">選 3 件。</p><div class="actions" hidden><button class="go" data-call>就講這三件</button></div>`;
    const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
    el.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.i;if(act.dataset.done)return;
      if(pick.has(i))pick.delete(i);else if(pick.size<3)pick.add(i);
      el.querySelectorAll("[data-i]").forEach(x=>{const on=pick.has(+x.dataset.i);x.setAttribute("aria-pressed",on);x.style.borderColor=on?"var(--ink)":"";x.style.background=on?"var(--surface)":"";});
      feed.textContent=`已選 ${pick.size} / 3。`;act.hidden=pick.size!==3;}));
    act.querySelector("[data-call]").onclick=()=>{act.dataset.done=1;act.hidden=true;let v=0;pick.forEach(i=>v+=list[i][1]);
      el.querySelectorAll("[data-i]").forEach(x=>{const w=list[+x.dataset.i][1];if(w>=2)x.style.borderColor="var(--green)";x.disabled=true;});
      feed.textContent=v>=7?"三件都說到重點了。":v>=4?"有說到一些重點。綠框的是最重要的。":"重點好像沒說到。綠框的才是最重要的。";done({v});};}
};
/* 排順序：依序點，點的順序就是答案 */
MINIS.order={
  head:"排順序",zone:"順序",title:"照順序點",cost:4,
  get intro(){return {teacher:"五題例題，由淺到深點一次。點的順序就是上課的順序。",yun:"五通要回的電話，最急的先點。點的順序就是回電的順序。"}[G&&G.line.id]||"照順序點。";},
  sets:{teacher:["向量的長度 |a|","兩點求向量 AB","內積的定義 a·b","用內積求夾角","空間中的平面方程式"],
        yun:["王媽媽：已經在樓下等","陳爸爸：九點要接小柏","林媽媽：退費進度","高二家長：問講義","廠商：影印機保養"]},
  mount(el,done){const list=this.sets[G.line.id]||this.sets.teacher,seq=[],order=list.map((_,i)=>i).sort(()=>Math.random()-.5);
    el.innerHTML=`<div class="choices">${order.map(i=>`<button class="choice" data-n="${i}"><span class="ord"></span>${esc(list[i])}</button>`).join("")}</div><p class="feed" aria-live="polite">點第 1 個。</p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(b.disabled)return;b.disabled=true;seq.push(+b.dataset.n);b.querySelector(".ord").textContent=seq.length+"．";
      if(seq.length<list.length){feed.textContent=`點第 ${seq.length+1} 個。`;return;}
      const right=seq.filter((v,k)=>v===k).length;
      el.querySelectorAll("[data-n]").forEach(x=>{const k=seq.indexOf(+x.dataset.n);x.style.borderColor=k===+x.dataset.n?"var(--green)":"var(--red)";});
      feed.innerHTML=`${right} / ${list.length} 個放對位置。正確順序：${list.map((s,i)=>`${i+1}. ${esc(s)}`).join("　")}`;done({right});}));}
};
