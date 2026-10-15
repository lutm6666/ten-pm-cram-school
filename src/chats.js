/* ================= 閒聊：跟重要人物多聊幾句 ================= */
/* 每個人有一組問題。回答可以依時段不同：pre 上課前、class 上課中、break 下課、after 放學後；_ 是不分時段的。
   也可以依「你是誰」（care／jh／teacher／yun／boss）或第二天（d2）換說法。
   玩家可以點問題，也可以自己打字，用關鍵字找最接近的一題。 */
const ME=G=>({teacher:"許老師",yun:"小芸",boss:"主任",care:"蔡老師",jh:"鄭老師"}[G.line.id]);
const PERIOD={pre:"上課前",class:"上課中",break:"下課",leave:"放學後",close:"放學後"};
const periodKey=()=>{const p=phaseOf();return p==="leave"||p==="close"?"after":p;};
const Q=(q,keys,a,set)=>({q,keys,a,set});
const WISH=["希望","改掉","改","最想"];
const CHATS={
 /* ---------- 職員 ---------- */
 yun:{hi:{pre:"欸，你找我？我手上還有三件事，你先說。",class:"（小聲）國中上課了，電話終於少一點。怎麼了？",break:"下課了！電話又要開始響了。要聊什麼？",after:"今天辛苦了……你也還沒走喔？"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"回電話、排試讀、收學費。下午的影印機已經卡第二次了。",class:"打補課電話，把今天的繳費輸入電腦。",break:"國中生來借雨傘、借充電線、問考卷。",after:"日結。抽屜的錢跟收據要一樣，才能下班。"}),
   Q("放學那一小時是什麼狀況？",["放學","高峰","五點","最忙"],{_:"電話、廣播、家長交代事情、繳費、國中生刷卡，全部在半小時裡。我只有一雙手。",boss:"電話、廣播、繳費、刷卡全部擠在一起。主任你可以來站一次看看。","d2.boss":"昨天你說要下來……今天會來嗎？"}),
   Q("接下來會發生什麼事？",["接下來","等一下","之後","下一"],{pre:"四點以後安親的家長會開始打來，五點半最亂。",class:"七點二十五下課，又是一波電話。",break:"第二節上完九點下課，家長會在大廳等。",after:"對完帳就可以回家了。如果對得起來的話。"}),
   Q("便利貼上寫什麼？",["便利貼","貼","寫什麼"],{_:"待辦。有一張是「記得吃晚餐」，我自己寫的，今天還沒撕掉。"}),
   Q("影印機為什麼一直卡？",["影印機","卡紙","卡"],{_:"它用了八年了。我幫它取了名字叫「阿卡」。卡紙要順著出紙方向拉，硬扯就會撕破。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"希望大家知道，櫃台不是待命，是在做事。我每次吃飯吃到一半都會被叫走。"}),
   Q("下班後要做什麼？",["下班","回家","放假"],{_:"回家撿衛生紙。我妹說我們家的貓又把衛生紙抓爛了。"})]},
 boss:{hi:{pre:"來，坐。今天的事很多，你先說。",class:"（盯著螢幕）嗯？你說。",break:"走廊人很多，進來講。",after:"還沒走？好，聊一下。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"看總部的報表，還有廠商的報價。冷氣、影印機，每一樣都要錢。",class:"巡堂。安親、國中、美語，每一層都要看一眼。",break:"想對面那張八折的傳單要怎麼回應。",after:"填週報。總部今晚十點前要。"}),
   Q("這期招生怎麼樣？",["招生","續班","報名","數字"],{_:"續班率卡在七十幾。總部的目標是 85。差的那十幾個百分點，每一個都是一個學生。"}),
   Q("安親和國中，哪個比較難顧？",["安親","國中","比較難","難顧"],{_:"安親是每一分鐘都要有人看著，國中是每一個人都有自己的心事。兩個都難，難的地方不一樣。"}),
   Q("總部都看什麼數字？",["總部","報表","看什麼"],{_:"續班率、試聽轉換率、退費數。沒有一格是寫「孩子今天有沒有笑」。"}),
   Q("為什麼開補習班？",["為什麼","開補習班","當主任"],{_:"我國中也是補習班出來的。那時候有個老師留下來陪我算到十點。我想讓別人也有那種人。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"影印機。真的。還有，希望總部來這裡待一個週三，再決定目標。"})]},
 teacher:{hi:{pre:"喔，你好。我在想今天怎麼開場。",class:"（小聲）我在上課耶……一下下就好。",break:"嗓子要休息一下，你說，我聽。",after:"今天終於上完了。怎麼了？"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"看講義。下午在別間上國小數學，現在要把腦袋換成九年級。",class:"檢討段考複習卷。這週每一班都在複習。",break:"喝水，順便看剛剛的小考。",after:"改考卷。明天下午還有別間的課要備。"}),
   Q("跑堂是什麼感覺？",["跑堂","別間","兩間","趕"],{_:"下午一間、晚上一間，中間騎二十分鐘機車。便當常常在機車箱裡涼掉。"}),
   Q("上課要怎麼讓人不睡著？",["睡","氣氛","笑話","故事"],{_:"笑話要短，故事要跟題目有關。七點以後要檢討比較難的錯題，一定要先讓大家動一下。"}),
   Q("阿哲怎麼樣？",["阿哲","最後一排"],{_:"他不是懶。他是從國一的分數就沒跟上，後來就不知道從哪裡開始問了。"}),
   Q("為什麼當補習班老師？",["為什麼","當老師","補習班老師"],{_:"本來想當學校老師，考了三年沒考上。後來發現，在這裡也能把一個人教會。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"講義不要再印錯版本了。還有，下課十分鐘真的不夠喝一杯水。"})]},
 hr:{hi:{pre:"等我一下，我在數考卷……好，你說。",class:"（小聲）我在後面看，有事嗎？",break:"下課要簽聯絡本，你長話短說喔。",after:"終於放學了。聯絡本還有一半沒寫。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"印考卷、登成績、打掃教室。段考前一週，班務清單長一倍。",class:"顧秩序，順便改小考。",break:"簽聯絡本。每一本都有家長的話要回。",after:"把今天的事寫成家長看得懂的三行字。"}),
   Q("班導都在做什麼？",["班導","工作","做哪些"],{_:"上課的不是我，可是班上的事都是我的。誰沒到、誰沒交、誰的家長打來，全部都是。"}),
   Q("九年級最近怎麼樣？",["九年級","班上","學生"],{_:"段考前一週，大家都很緊。有人緊到睡不著，有人緊到乾脆不來。"}),
   Q("阿翔最近怎麼了？",["阿翔","網咖","遲到"],{_:"他媽媽一個人帶兩個。下午接小的，晚上接大的。他不想一直被拿來跟弟弟比。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"影印機要排隊。安親、美語、國中，大家都在搶同一台。"})]},
 cai:{hi:{pre:"嗨！我在改評量，等我圈完這題。",class:"（小聲）小朋友在寫作業，你說～",after:"今天的小朋友都交出去了。怎麼了？",_:"嗨～"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"改評量、排作業。下午三點二十要去接人。","d2.pre":"發午睡枕。今天大家都是半天，中午要去接人。",class:"看作業。每一本都要看到第一個錯的地方。",after:"寫聯絡簿、收教室。"}),
   Q("安親老師一天怎麼過？",["安親","一天","怎麼過"],{_:"十一點半到班，打掃、改評量；接人、點心、寫作業；五點到六點一個一個交給家長。中間沒有一分鐘是空的。"}),
   Q("四年級的小朋友好帶嗎？",["四年級","好帶","小朋友"],{_:"他們會跟你講所有的事。媽媽出差、兔子叫什麼名字、昨天誰踩到誰。你要記得。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"影印機下午可以讓安親先印。我們只有八張。"})]},
 lin:{hi:{care:"喔，蔡老師～我在數人頭。",_:"你好～我在數人頭。"},
  qs:[
   Q("五年級今天怎麼樣？",["五年級","今天","怎樣"],{_:"有兩個在吵誰喜歡誰。五年級就是開始有八卦的年紀，作業反而沒人在吵。"}),
   Q("午餐吃什麼？",["午餐","便當","吃"],{_:"樓下那家自助餐。我每天都夾一樣的，老闆已經不問了。"}),
   Q("你帶安親多久了？",["多久","幾年","資深"],{_:"九年。四年前帶的五年級，現在在三樓上九年級了，看到我還會不好意思。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"家長群組晚上十點以後可以自動靜音。"})]},
 wu:{hi:{_:"（推推眼鏡）嗯？"},
  qs:[
   Q("六年級好帶嗎？",["六年級","好帶"],{_:"最難的是他們覺得自己已經長大了。手機、私中考試、誰跟誰在一起，每天都有新的。"}),
   Q("你在忙什麼？",["忙","在做","做什麼"],{_:"改私中模擬卷。班上有三個要考私中，家長比小孩還緊張。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"六年級的作業可以少一點。他們已經比國中生還晚睡了。"})]},
 amy:{hi:{_:"Hi～有事嗎？"},
  qs:[
   Q("美語班都在上什麼？",["美語","英文","上什麼"],{_:"國小的。發音、繪本、一點點文法。小朋友喜歡唱歌，不喜歡寫字。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"美語教室可以有自己的投影機。每次都要跟國中部借。"})]},
 hong:{hi:{pre:"嗨，課輔室冷氣又在吵架了。",class:"課輔室這邊還好，有事嗎？",break:"等一下喔，有三個人排隊問題目。",after:"快收了。怎麼了？"},
  qs:[
   Q("課輔在做什麼？",["課輔","在做","忙"],{_:"國中生寫作業、問題目、等家長。我大三，數學系，國中的題目我還可以。理化不要問我。"}),
   Q("下課的走廊怎麼樣？",["走廊","電梯","下課"],{_:"只有一台電梯，國中生下課十分鐘全部要搶。上禮拜有人在電梯裡推來推去。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"便當。我的便當昨天不見了。我不是在抱怨，我只是在陳述。"})]},
 /* ---------- 國中生 ---------- */
 pinyu:{hi:{pre:"（拿下耳機）嗯？",class:"（小聲）怎麼了？",break:"……我在背單字。",after:"我在等我媽來接。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"背理化。每次都從第一章開始背，所以第一章最熟。",class:"抄筆記。老師說的我都想寫下來。",break:"把剛剛不懂的地方圈起來。",after:"把今天的錯題抄到筆記本。"}),
   Q("段考準備得怎樣？",["段考","考試","成績","前三"],{_:"我媽說要考進前三。我上次第四。"}),
   Q("以後想念哪裡？",["以後","高中","志願","念哪"],{_:"我媽說北一女。我自己……還沒想。"}),
   Q("最近睡得好嗎？",["睡","累","休息"],{_:"兩點睡，六點起來。我覺得還好……應該還好吧。","d2":"昨天十二點半就睡了。比平常早。"})]},
 zhe:{hi:{pre:"……喔。",class:"（趴在桌上，眼睛是睜開的）",break:"幹嘛。",after:"……還好啦。"},
  qs:[
   Q("今天上課聽得懂嗎？",["聽得懂","上課","懂"],{_:"……一成吧。"}),
   Q("數學從什麼時候開始不會的？",["什麼時候","不會","卡"],{_:"國一。分數。後面全部都是分數。"}),
   Q("你平常喜歡做什麼？",["喜歡","平常","興趣"],{_:"畫畫。畫機器人。我媽說那不能考試。"}),
   Q("退費的事是真的嗎？",["退費","不想補","退"],{_:"我媽繳了一整年……我覺得很浪費她的錢。","d2":"我媽說……先不要退。我也不知道。"})]},
 xiang:{hi:{_:"幹嘛……我手機有交喔。"},
  qs:[
   Q("段考準備得怎樣？",["段考","準備","考試"],{_:"英文單字背不起來。數學還好。"}),
   Q("你弟今天乖嗎？",["弟弟","小宇","弟"],{_:"他在二樓安親。我媽說我比他小時候還皮。她每次都這樣說。"}),
   Q("以後想念哪裡？",["以後","高中","念哪"],{_:"高職。我想修車。我爸不太開心。"}),
   Q("昨天去哪了？",["昨天","網咖","去哪"],{_:"……不想講。","d2":"我媽昨天哭了。今天我五點半就到了。"})]},
 qing:{hi:{_:"老師好。"},
  qs:[
   Q("段考準備得怎樣？",["段考","考試","成績"],{_:"英文應該還好。我媽說英文好不算，要全部都好。"}),
   Q("演講比賽要講什麼？",["演講","比賽"],{_:"題目是「我最想改變的一件事」。我還在想。","d2":"我想講成績單上的排名。"}),
   Q("你最希望哪件事被改掉？",WISH,{_:"成績單上不要寫排名。"})]},
 bo:{hi:{_:"（揮揮手）"},
  qs:[
   Q("八年級好玩嗎？",["八年級","好玩"],{_:"還好。比九年級好。九年級的看起來都很累。"}),
   Q("下課都去哪？",["下課","7-11","去哪","出去"],{_:"7-11。關東煮的白蘿蔔。……不要跟我爸說。"}),
   Q("你爸在做什麼？",["爸爸","你爸","工作"],{_:"工地。他每天都比我早出門，比我晚回家。"})]},
 /* ---------- 國小生 ---------- */
 yu:{hi:{class:"老師！我寫完了！（其實還沒）",after:"我媽什麼時候來？",_:"老師好！"},
  qs:[
   Q("作業寫完了嗎？",["作業","寫完","數習"],{_:"快了！只剩……三頁。"}),
   Q("你哥哥呢？",["哥哥","阿翔","哥"],{_:"他在三樓。他很厲害，可是他都不教我。"}),
   Q("你長大想做什麼？",["長大","以後","想做"],{_:"恐龍博士！或是籃球員。或是恐龍籃球員。"})]},
 anan:{hi:{_:"（點點頭）"},
  qs:[
   Q("媽媽什麼時候回來？",["媽媽","出差","回來"],{_:"明天。阿嬤說明天中午。","d2":"今天！媽媽今天會來接我！"}),
   Q("你喜歡畫畫嗎？",["畫畫","畫","喜歡"],{_:"喜歡。我畫了一張媽媽在高鐵上。"})]},
 mi:{hi:{_:"（手裡握著書包上的兔子吊飾，看著你）"},
  qs:[
   Q("你的兔子叫什麼名字？",["兔子","吊飾","名字","布丁"],{_:"……布丁。牠會怕黑。"}),
   Q("媽媽幾點來？",["媽媽","幾點","來接"],{_:"媽媽說六點。可是媽媽的六點都很晚。","d2":"媽媽說今天五點五十！"})]},
 /* ---------- 家長 ---------- */
 parent:{hi:{pre:"你好你好。",class:"（小聲）從門口看進去，老師上課好像滿有條理的。",break:"下課了？我想問一下……",after:"謝謝你們今天招待。"},
  qs:[
   Q("為什麼想來試聽？",["試聽","為什麼","來這"],{_:"他在學校的數學老師講太快。他說相似形的對應邊老是找錯，可是他回家都不跟我講。"}),
   Q("對面那間怎麼樣？",["對面","別間","比較"],{_:"打八折，榜單比較長。可是我兒子說，那邊的老師不會看他。"})]},
 ama:{hi:{_:"老師好～"},
  qs:[
   Q("安安最近好嗎？",["安安","最近","好嗎"],{_:"她很乖。可是媽媽出差，她晚上都抱著媽媽的枕頭睡。"}),
   Q("阿嬤以前做什麼？",["以前","工作","做什麼"],{_:"在菜市場賣菜。三十年。算錢我很會，看字就不行了。"})]},
 zhangma:{hi:{_:"你好～我先看看。"},
  qs:[
   Q("孩子在哪間國小？",["國小","學校","哪間"],{_:"對面那間。四年級，數學應用題看不懂在問什麼。"}),
   Q("為什麼在找安親？",["為什麼","找安親","安親"],{_:"我跟他爸都六點半才下班。以前是阿公顧，阿公上個月開刀了。"})]},
 xiangma:{hi:{_:"（一手拿著外套，一手在講電話）……喔，老師你好。"},
  qs:[
   Q("今天還好嗎？",["還好","今天","累"],{_:"下午接小的，晚上接大的，中間回去煮飯。我先生在外地。"}),
   Q("阿翔最近怎麼樣？",["阿翔","大兒子","網咖"],{_:"他最近都不跟我講話。我知道我常常拿弟弟講他……我也知道不應該。"})]},
 chenba:{hi:{_:"你好，我來接小柏。"},
  qs:[
   Q("今天下班很晚嗎？",["下班","很晚","工作"],{_:"工地趕工。今天灌漿，灌完才能走。"}),
   Q("小柏在家怎麼樣？",["小柏","在家","兒子"],{_:"我回去的時候他都睡了。早上我出門他還沒起來。我們一天講不到十句話。"})]},
 mima:{hi:{_:"老師～不好意思～"},
  qs:[
   Q("工作很忙嗎？",["工作","忙","開會"],{_:"業務。下午的會永遠開不完。小米都知道，媽媽的六點是七點。"})]},
 anma:{hi:{_:"老師好，我是安安媽媽。"},
  qs:[
   Q("出差很久嗎？",["出差","多久","回來"],{_:"一個禮拜，台中跟高雄。每天晚上視訊，安安都不講話，只是把畫拿給我看。"})]}
};
const CHAT_FX={
  yu:{care:{pat:2}},anan:{care:{par:2}},mi:{care:{pat:2}},ama:{care:{par:2},yun:{par:2}},zhangma:{care:{par:1},yun:{par:1},boss:{sales:1}},
  lin:{care:{hp:1},boss:{morale:2}},wu:{care:{ord:1},boss:{morale:1}},cai:{jh:{pat:1},yun:{ord:1},boss:{morale:2}},amy:{boss:{morale:1}},
  yun:{care:{pat:1},jh:{pat:1},teacher:{hp:1},boss:{morale:2}},boss:{care:{par:1},jh:{par:1},teacher:{par:1},yun:{pat:1}},
  teacher:{jh:{stu:1},yun:{ord:1},boss:{morale:2}},hr:{teacher:{stu:1},yun:{ord:1},boss:{morale:2}},hong:{jh:{pat:1},teacher:{hp:1},yun:{ord:1},boss:{morale:1}},
  pinyu:{jh:{stu:2},teacher:{stu:2},yun:{par:1},boss:{rep:1}},zhe:{jh:{stu:2},teacher:{stu:2},yun:{par:1},boss:{rep:1}},xiang:{jh:{stu:2},teacher:{stu:1}},qing:{jh:{stu:2},teacher:{stu:1}},
  bo:{teacher:{stu:1},yun:{pat:1},boss:{rep:1}},parent:{teacher:{par:2},yun:{par:2},boss:{sales:2}},chenba:{yun:{par:1},boss:{rep:1}},
  xiangma:{care:{par:2},jh:{par:2},yun:{par:1},boss:{rep:1}},mima:{care:{par:1}},anma:{care:{par:2}}};
const CHAT_IDK={yu:"蛤？我不知道啦！",anan:"……我不知道。",mi:"（搖頭）",ama:"這個阿嬤不懂啦。",zhangma:"這我不太清楚耶。",yun:"嗯……這個我不太清楚耶。你問問看別的？",boss:"這個嘛……我們改天再聊。",teacher:"這題我答不出來。真的。",hr:"這個……我還沒想過。",cai:"嗯？我剛剛在想別的事。",lin:"這個你要問主任喔。",wu:"……不知道。",amy:"Sorry，我不太確定。",pinyu:"……我不知道。",zhe:"不知道。",xiang:"蛤？",qing:"這個……我要想一下。",hong:"這個我也不確定欸。",bo:"……蛤？",parent:"這個我不太懂耶。",chenba:"這我不清楚。",xiangma:"……抱歉，我現在腦袋很亂。",mima:"啊？不好意思我在看訊息。",anma:"這個我不太清楚耶。"};
/* 回答查找順序：第二天 → 職業.時段 → 職業 → 時段 → 不分時段。這樣同一題可以依「你是誰」換說法。 */
function chatAnswer(c,pk){const a=c.a,r=G.line.id,d2=G.day===2;return (d2?a["d2."+r]??a["d2."+pk]??a["d2"]:undefined)??a[r+"."+pk]??a[r]??a[pk]??a._??Object.values(a)[0];}
function matchQ(qs,text){const t=text.replace(/\s/g,"");let best=-1,score=0;
  qs.forEach((q,i)=>{let s=0;q.keys.forEach(k=>{if(t.includes(k))s+=k.length;});if(t&&q.q.replace(/[？?]/g,"").includes(t))s+=t.length;if(s>score){score=s;best=i;}});return best;}
function chatTargets(){
  if(!G)return[];const st=step(),main=stepReady()&&val(st.target,G)?.npc,side=new Set(activeSides().map(s=>s.target&&s.target.npc).filter(Boolean));
  return Object.keys(CHATS).filter(id=>(!G.line.chats||G.line.chats.includes(id))&&id!==G.line.id&&npcs[id]&&npcs[id].visible&&id!==main&&!side.has(id));
}
let CH=null;
function openChat(id,after){
  const n=npcs[id],C=CHATS[id],c=CHARS[id];if(!C)return after&&after();
  if(n&&player&&n.visible){n.rotation.y=Math.atan2(player.position.x-n.position.x,player.position.z-n.position.z);player.rotation.y=Math.atan2(n.position.x-player.position.x,n.position.z-player.position.z);}
  const pk=periodKey(),ret=mode;mode="chat";path=null;guiding=false;renderAll();
  G.chatUsed=G.chatUsed||[];CH={id,pk,after,busy:false,asked:new Set(G.chatUsed.filter(k=>k.startsWith(id+":")).map(k=>+k.split(":")[1]))};
  const first=!(G.chatWith||(G.chatWith=[])).includes(id);if(first)G.chatWith.push(id);
  spend(1);
  openSheet("閒聊",`<div class="chatp">
    <div class="chead"><span class="face" style="background:${c.color}">${esc(c.abbr)}</span><div class="who"><b>${esc(c.name)}</b><small>${esc(c.title)}</small></div><button class="ghost" data-act="chatEnd">結束對話</button></div>
    <p class="cnote">現在的時刻：${PERIOD[phaseOf()]||"上課前"}。${esc(c.name)}的回答會跟著時刻變。</p>
    <div class="clog" id="clog" aria-live="polite"><div class="bub them">${esc(chatAnswer({a:C.hi},pk))}</div></div>
    <div class="cchips" id="cchips">${C.qs.map((q,i)=>`<button class="chip ${CH.asked.has(i)?"asked":""}" data-q="${i}">${esc(q.q)}</button>`).join("")}</div>
    <form class="cask" id="cask"><input id="caskIn" type="text" enterkeyhint="send" autocomplete="off" placeholder="自己打字問${esc(c.name)}…" aria-label="自己打字問${esc(c.name)}"><button class="go" type="submit">送出</button></form>
    <p class="hint">回答是預先寫好的。打字問的時候，會依關鍵字找最接近的一題。每問一題大約花 1 分鐘。</p></div>`,()=>endChat(first,ret));
  $("cask").addEventListener("submit",e=>{e.preventDefault();const inp=$("caskIn"),t=inp.value.trim();if(!t||CH.busy)return;inp.value="";askChat(matchQ(C.qs,t),t);});
}
function askChat(i,typed){
  if(!CH||CH.busy)return;const C=CHATS[CH.id],log=$("clog");if(!log)return;
  const q=i>=0?C.qs[i]:null;CH.busy=true;
  log.insertAdjacentHTML("beforeend",`<div class="bub me">${esc(typed||q.q)}</div><div class="bub them typing">想一下…</div>`);log.scrollTop=log.scrollHeight;
  spend(1);beep("blip");
  setTimeout(()=>{if(!CH)return;const tp=log.querySelector(".typing");const ans=q?chatAnswer(q,CH.pk).replace(/\{me\}/g,ME(G)):CHAT_IDK[CH.id];
    if(tp){tp.classList.remove("typing");tp.textContent=ans;}log.scrollTop=log.scrollHeight;CH.busy=false;
    if(q&&q.set)Object.assign(G.f,q.set);
    if(q){const key=CH.id+":"+i;if(!G.chatUsed.includes(key))G.chatUsed.push(key);CH.asked.add(i);const b=document.querySelector(`#cchips [data-q="${i}"]`);if(b)b.classList.add("asked");
      const seen=new Set(store.get("chats",[]));seen.add(key);store.set("chats",[...seen]);}
    renderHud();},520);
}
function endChat(first,ret){const id=CH&&CH.id,after=CH&&CH.after;CH=null;
  let d="";if(first&&id){const fx=(CHAT_FX[id]||{})[G.line.id];if(fx&&Object.keys(fx).length)d=applyFx(fx);}
  mode=ret==="chat"?"walk":ret;if(mode==="dialog")mode="walk";renderAll();setTimeout(checkAch,50);
  if(d)showBanner("聊了幾句",`${CHARS[id].name}・`+d.replace(/<[^>]+>/g,""));
  if(after)after();}
document.addEventListener("click",e=>{const q=e.target.closest("#cchips [data-q]");if(q){askChat(+q.dataset.q);return;}
  if(e.target.closest("[data-act=chatEnd]"))closeSheet();});
