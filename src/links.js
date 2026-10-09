/* ================= 把一天接起來：下午的安親、國中部，晚上都看得到 ================= */
const careF=G=>((G.prevAll||{}).care||{}).f||null,jhF=G=>((G.prevAll||{}).jh||{}).f||null;
/* 晚上三個位子的第一個場景前，先帶一句下午留下來的事（只有下午場玩過才會出現） */
LINES.yun.carry=G=>{const c=careF(G),l=[];if(!c)return l;
  if(c.handoffGood)l.push([null,"下午蔡老師的交接很清楚：阿嬤的學費收了、張媽媽下週一要試讀、小米媽媽今天會晚到。"]);
  else l.push([null,"抽屜裡有一張沒歸檔的收據。下午好像沒有人跟你說。"]);
  if(c.paid===0)l.push([null,"收據上的金額，跟抽屜裡的錢對不起來。"]);
  if(c.extraPudding)l.push([null,"冰箱上貼著一張紙：「安親多的布丁，晚上的同學請自取。」已經少了三個。"]);return l;};
LINES.teacher.carry=G=>{const c=careF(G);if(!c)return [];
  return [[null,c.roomReady?"B 班的桌子被下午的安親班兩兩併起來了，椅子降低了一格。":"白板角落還留著下午安親班的字：「數習 p.32」。"]];};
LINES.boss.carry=G=>{const c=careF(G),j=jhF(G),l=[];
  if(c&&c.trialKid)l.push([null,"桌上有一張下午的便條：「張媽媽，三年級，下週一安親試讀。」"]);
  if(j&&j.roomPlan)l.push([null,"桌上還有一張國中部老師畫的「教室設備使用表」。影印機那一格寫得最大。"]);return l;};

/* 國中部跟晚上的其他人搶東西 */
EVENTS.push(
 {id:"jhcopy",phases:["pre","break"],make:()=>({target:{npc:"amy"},goal:"國中部的 Amy 老師也在等影印機",npc:{amy:PJ.copierWait},after:{amy:PJ.amyPodium},
  pages:G=>[["amy","不好意思～我只要印 30 張國中的複習卷，可以先讓我嗎？"],[null,"影印機前面已經排了兩疊。"]],
  choices:G=>[
   {label:"讓她先印",fx:G=>byLine(G,{teacher:{stu:-3},yun:{ord:-3,pat:2},boss:{morale:5}}),log:"讓國中部先用影印機",res:[["amy","謝謝！下次換我讓你。"]]},
   {label:"「高三的先，等一下就好。」",fx:G=>byLine(G,{teacher:{stu:3},yun:{ord:3,par:-2},boss:{morale:-4,sales:2}}),log:"影印機讓高三先用",res:[["amy","……好吧。"],[null,"她抱著原稿站在旁邊等。"]]},
   {label:"幫她拉一下卡紙，兩邊輪流印",fx:G=>byLine(G,{teacher:{hp:-4},yun:{hp:-3,ord:4},boss:{calm:-2,morale:6}}),log:"影印機兩邊輪流印",res:[[null,"十張高三、十張國中、十張高三。影印機發出很努力的聲音。"]]}]})},
 {id:"jhnoise",phases:["class"],make:()=>({target:{npc:"amy"},goal:"走廊盡頭傳來國中部的搶答聲",npc:{amy:[30.6,12.3,Math.PI]},after:{amy:PJ.amyPodium},
  pages:G=>[[null,"C 班在玩單字搶答。「Environment！」「環境！」整條走廊都聽得到。"],["amy","啊……吵到你們了嗎？"]],
  choices:G=>[
   {label:"請她小聲一點",fx:G=>byLine(G,{teacher:{stu:3},yun:{ord:4},boss:{calm:2,morale:-2}}),log:"請國中部小聲一點",res:[["amy","好，我把門關上。"]]},
   {label:"「沒關係，國中生本來就比較有活力。」",fx:G=>byLine(G,{teacher:{stu:-3},yun:{pat:3},boss:{morale:4}}),log:"不介意國中部的聲音",res:[["amy","謝謝你～"],[null,"她回到教室。搶答聲小了一點點。"]]}]})}
);

/* 國中部的人也可以聊天 */
Object.assign(CHATS,{
 amy:{hi:{_:"嗨～國中部這邊比較吵，不好意思喔。"},qs:[
   Q("國中部在忙什麼？",["忙","在做","國中部"],{pre:"印段考複習卷。影印機要排隊。",class:"單字搶答。他們只有比賽的時候會醒。",_:"收手機、發考卷、回家長訊息。"}),
   Q("國中生跟高三有什麼不一樣？",["不一樣","差別","國中生"],{_:"高三是怕來不及，國中是還不知道要怕。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"C 班可以有自己的投影機。每次都要借，借到最後被借走的是我們。"})]},
 xiang:{hi:{_:"幹嘛……我手機有交喔。"},qs:[
   Q("會考準備得怎樣？",["會考","準備","考試"],{_:"英文單字背不起來。數學還好。"}),
   Q("你弟今天乖嗎？",["弟弟","小宇","弟"],{_:"他在安親班。我媽說我比他小時候還皮。"}),
   Q("以後想念哪裡？",["以後","高中","念哪"],{_:"高職。我想修車。我爸不太開心。"})]},
 qing:{hi:{_:"老師好。"},qs:[
   Q("段考考得怎樣？",["段考","考試","成績"],{_:"英文 98。可是排第三。我媽說第三就是沒有第一。"}),
   Q("演講比賽要講什麼？",["演講","比賽"],{_:"題目是「我最想改變的一件事」。我還在想。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"成績單上不要寫排名。"})]}
});
Object.assign(CHAT_FX,{amy:{teacher:{stu:1},yun:{ord:1},boss:{morale:2}},xiang:{jh:{stu:2},teacher:{},yun:{},boss:{}},qing:{jh:{stu:2},teacher:{},yun:{},boss:{}}});
