/* ================= 第二天：週三。國小全部中午放學；昨天的選擇，今天都有後續 ================= */
/* G.prev = 這個位子第一天的旗標；G.prevAll = 五個位子第一天的結果（跨線）。 */

const pv=G=>G.prev||{},pa=(G,id)=>((G.prevAll||{})[id]||{}).f||{};

/* ---------- 四年級安親・第二天 ---------- */
/* 週三：國小吃完午餐 12:40 放學。12:30 出發接人，12:55 回來，13:00–13:30 午休，起床寫作業，17:00–18:00 陸續放學。 */
LINES2.care={...LINES.care,day:2,
 pick:"第二天・週三。全部的小朋友中午就放學。接人、午休、寫作業，還有安安的媽媽今天回來了。",
 coda:"週三的下午特別長。可是每一個小朋友，都是你親手交到家長手上的。",
 msgs:[["11:42","林老師","今天三個年級同時放，十二點四十。我們 12:30 樓下集合喔"],["13:58","國小家長群","週五戶外教學，回條請明天交給導師"],["16:05","安安媽媽","老師我下午五點多會到，想跟您聊一下安安這週的狀況"],["18:35","小芸","蔡老師，小宇媽媽在三樓跟鄭老師談，請你幫忙看一下小宇🙏"]],
 boards:{g4:"午休 13:00–13:30\n評量進度：數學 第5回・國語 第4回"},
 schedule:[["11:30","pre"],["12:55","class"],["17:00","leave"]],
 busy:[["12:30","13:05","g4door","接回來了","三個年級的小朋友吃完午餐，一起走回來。十二點五十五進教室，洗手、上廁所、拿出午睡枕。"],["13:32","18:15","g4podium","巡堂","看作業、簽聯絡簿、回答「老師這題怎麼寫」。下午小朋友都在，沒有空檔。"],["18:15","18:55","g4podium","送走最後一個","最後一個小朋友被接走後，把桌椅推回去、把今天的聯絡簿收好。"]],
 phaseStatus:{pre:"準備中",class:"午休・寫作業",leave:"放學中",close:"收拾中"},
 bells:{class:["小朋友回來了","洗手、換室內鞋，一點整午休。"],leave:["放學時間","家長陸續來接了。櫃台會廣播誰的家長到了。"]},
 events:["kidfall","schoolcall","pudding"],
 eventSlots:[{after:"c2_brief",t:"12:05",phase:"pre"},{after:"c2_fight",t:"16:30",phase:"class"},{after:"c2_anma",t:"17:35",phase:"leave"}],
 npcs:{...LINES.care.npcs,yu:null,anan:null,mi:null,anma:null,mima:null,xiangma:null},
 steps:[
  {id:"c2_open",chapter:{t:"11:30",title:"第二天・週三",sub:"今天國小吃完午餐，十二點四十放學。十二點半出發。",status:"準備中",rush:["接回來先午休，一點半起床寫作業。","安安的媽媽今天出差回來。"]},
   t:"11:30",target:{spot:"g4podium"},goal:"上二樓，準備午休",action:"看一下教室",
   pages:G=>{const p=pv(G),l=[];
     l.push([null,p.readyNap?"八個午睡枕排在櫃子上，名字朝外。昨天下班前的你，做了一件好事。":"午睡枕還堆在櫃子最上層。有兩個的名字貼紙掉了。"]);
     if(p.noCopy)l.push([null,"白板角落還留著昨天手抄的五題。練習卷昨天沒有印。"]);
     l.push([null,"小朋友在學校吃完午餐才放學。十二點半出發去接人，一點以前，四年級的小朋友就會回到這間教室午休。"]);return l;},
   choices:G=>{const p=pv(G),c=[];
     if(!p.readyNap)c.push({label:"把午睡枕發到每個位子、補上名字",fx:{ord:6,hp:-4},set:{napReady:1},log:"準備好午睡枕",res:[[null,"八張桌子上各放一個午睡枕。沒有名字的那兩個，你憑印象寫上「子恩」和「大頭」。"]]});
     else c.push({label:"把午睡枕發到每個位子",fx:{ord:4,hp:-1},set:{napReady:1},log:"發好午睡枕",res:[[null,"昨天排好的，今天三分鐘就發完了。"]]});
     if(p.noCopy)c.push({label:"下樓把昨天沒印的練習卷印好",fx:{ord:5,hp:-3},set:{printed:1},log:"補印昨天的練習卷",res:[[null,"中午的影印機很空。八份練習卷，一分鐘。"]]});
     c.push({label:"先把評量進度寫在白板上",fx:{ord:3,hp:1},log:"先寫好評量進度",res:[[null,"數學第 5 回、國語第 4 回。學校作業每個人不一樣，寫完的人再寫評量。你在旁邊畫了一個睡覺的月亮。"]]});return c;}},
  {id:"c2_brief",t:"11:55",target:{npc:"lin"},goal:"林老師在分配今天接誰",npc:{lin:AT("g4door",-1,.4,Math.PI/2)},after:{lin:PC.lin},
   pages:G=>{const b=pa(G,"boss"),l=[["lin","我們五年級今天兩個請假，隊伍短一點。你們四年級幾個？"]];
     if(b.bossPickup)l.push(["lin","還有，主任說他今天也要跟去，站六年級隊伍尾巴。……我有點不敢相信。"]);
     else if(b.yunEarly)l.push(["lin","小芸今天提早來顧櫃台，有家長打來改接送，她會轉給我們。"]);
     else l.push(["lin","上禮拜三小米差點跟錯隊伍，今天大家點名要點兩次。"]);
     l.push(["lin","四年級今天有一個請假，聯絡簿群組裡有寫，你看一下。"]);return l;},
   choices:G=>[
    {label:"現在就看群組，確認誰請假",fx:{ord:4,pat:-1},set:{knowAbsent:1},log:"出發前確認請假名單",res:[[null,"阿凱的媽媽早上傳的：「今天看牙醫，中午我自己接。」你在名單上把阿凱劃掉。"]]},
    {label:"「到校門口再點就好。」",fx:{hp:2},log:"到校門口再點名",res:[["lin","好，那你自己注意喔。"]]}]},
  {id:"c2_pickup",chapter:{t:"12:30",title:"中午放學",sub:"三個年級、三個隊伍、一個路口。",status:"接人中"},
   t:"12:30",target:{spot:"door"},goal:"出發去國小接人",action:"出發",
   after:{yu:kidIn(SEAT("g4","yu")),anan:kidIn(SEAT("g4","anan")),mi:kidIn(SEAT("g4","mi"))},
   pages:G=>{const b=pa(G,"boss"),l=[[null,"十二點四十，中午的校門口比下午還擠。三個年級吃完午餐同時出來，所有安親班的牌子都舉得高高的。"]];
     if(b.bossPickup)l.push([null,"何主任站在六年級隊伍最後面，西裝外套脫了，袖子捲起來。家長經過都多看了他一眼。"]);
     l.push([null,G.f.knowAbsent?"四年級要接 7 個。隊伍裡現在只有 5 個。":"名單上 8 個。隊伍裡現在只有 5 個。"]);return l;},
   choices:G=>[
    {label:"看名單，找出還沒出來的",mini:G.f.knowAbsent?"kidroll2":"kidroll3",fx:r=>({ord:r.miss?2:8,pat:-3}),log:r=>r.miss?`中午點名，點錯 ${r.miss} 次`:"一次就點出還沒出來的人",
     res:r=>[[null,"小米跟著五年級的隊伍走了半條街，林老師把她牽回來。"],["mi","……我以為那是我們。"],[null,G.f.knowAbsent?"小宇在合作社排隊買養樂多。七個人，排成一排過馬路。":"你在校門口多等了五分鐘才想起來：阿凱今天請假。"]]},
    {label:"請林老師幫忙看著隊伍，自己進校門找",fx:{hp:-5,pat:-3,ord:3},log:"進校門找還沒出來的小朋友",res:[[null,"你在合作社找到小宇，在五年級隊伍裡找到小米。"],["lin","小米！你是四年級的啦！"]]}]},
  {id:"c2_nap",chapter:{t:"12:55",title:"午休",sub:"洗手、換鞋、躺下。一點整關燈。",status:"午休"},
   t:"13:05",target:{npc:"yu"},goal:"小宇趴不住",
   pages:G=>[[null,"燈關了，窗簾拉上。六個小朋友都趴好了，只有小宇一直在踢桌腳。"],[null,pa(G,"boss").acFix?"冷氣昨天修好了，教室裡只聽得到冷氣的風聲。":"冷氣下面的水桶還在滴答、滴答。"],["yu","老師，我不想睡。我又不累。"],[null,"隔壁的安安被吵到，眉頭皺起來。"]],
   choices:G=>[
    {label:"坐在他旁邊，小聲講一個很無聊的故事",fx:{pat:-3,ord:4},set:{napStory:1},log:"陪小宇午休",res:[[null,"你講到第三隻綿羊翻過圍牆的時候，他的呼吸變慢了。"],[null,"第四隻綿羊還沒翻，你自己也差點睡著。"]]},
    {label:"讓他到閱讀角安靜看書",fx:{ord:-2,pat:2},set:{yuRead:1},log:"讓小宇去閱讀角看書",res:[[null,"他抱了一本恐龍圖鑑過去。翻頁的聲音很大，但至少沒有踢人了。"]]},
    {label:"「再吵就打給媽媽。」",fx:{ord:5,par:-4},log:"用打給媽媽嚇小宇",res:[[null,"他不動了，眼睛瞪著天花板。"],[null,"你知道他沒有睡。他只是不敢動。"]]}]},
  {id:"c2_wake",chapter:{t:"13:30",title:"起床・寫作業",sub:"收午睡枕、喝水、拿出聯絡簿。",status:"寫作業"},
   t:"13:32",target:{npc:"mi"},goal:"小米蹲在桌子旁邊哭",
   pages:G=>{const p=pv(G),l=[[null,"燈打開了。大家在收午睡枕，小米蹲在地上，在桌子底下找來找去。"],["mi","布丁不見了……"]];
     if(p.leftMi)l.push([null,"昨天她在櫃台旁邊等媽媽的時候，也是這樣握著兔子吊飾。今天她不太看你。"]);return l;},
   choices:G=>[
    {label:"先陪她找",fx:{pat:-3,par:5},set:{foundBunny:1},log:"陪小米找兔子",res:[[null,"布丁從書包上掉下來，卡在桌子和牆壁的縫裡，耳朵被壓扁了。"],["mi","牠剛剛也在睡覺。"],[null,"她把兔子吊飾掛回書包，回座位拿出了國習。"]]},
    {label:"「先寫作業，寫完老師幫你找。」",min:20,fx:{ord:4,par:-3},log:"請小米先寫作業",res:[[null,"她坐回位子，國習翻開了，一個字也沒寫。"],[null,"二十分鐘後，你在桌子和牆壁的縫裡找到了兔子。"]]}]},
  {id:"c2_yu",t:"14:20",target:{npc:"yu"},goal:"小宇的數習又卡住了",
   pages:G=>{const p=pv(G),j=pa(G,"jh"),l=[[null,"數習 p.34，三位數乘二位數。第一題又是進位。"]];
     if(p.toldXiangma)l.push(["yu","我媽說叫我哥教我，可是我哥昨天很晚才回來。"],["yu",j.metXiangma?"我媽去網咖找他。回來的時候她都沒講話。":"他回來就關在房間。"]);
     else if(p.yuChecked)l.push(["yu","我知道！要進位！……進到哪裡？"]);
     else l.push(["yu","老師，昨天你說我寫對了，結果我媽說三題都錯。"]);return l;},
   choices:G=>[
    {label:"拿積木陪他把進位做一次",note:"十個一捆",mini:"kidgrade2",fx:r=>({pat:-4,par:r.hits>=2?6:0,ord:r.hits>=2?4:-2}),log:r=>`陪小宇練進位，抓對 ${r.hits}/3 題`,
     res:r=>{G.f.yuCarry=r.hits>=2?1:0;return r.hits>=2?[["yu","十個綁成一捆，拿到隔壁！"],[null,"他自己把第三題擦掉重算。這次是對的。"]]:[[null,"他算對了一題，另外兩題你也沒看出來。明天聯絡簿上，大概又會有一行字。"]];}},
    {label:"在聯絡簿上寫：請家長在家多練習進位",fx:{pat:2,par:-3},log:"把進位的事交給家長",res:[[null,"你寫完才想起來，他媽媽昨天在大廳講電話講得多急。"]]}]},
  {id:"c2_call",t:"15:30",auto:true,goal:"教室的分機響了",
   pages:G=>{const j=pa(G,"jh"),l=[["xiangma","蔡老師嗎？我是小宇媽媽。"]];
     l.push(["xiangma",j.metXiangma||j.askedXiang?"今天晚上我要上三樓跟阿翔的班導談一下……小宇可以待到七點嗎？":"今天我要上三樓找阿翔的班導，可能會晚。小宇可以待到七點嗎？"]);
     l.push([null,"安親最晚到七點。七點，也是你下班的時間。"]);return l;},
   choices:G=>[
    {label:"「可以，我陪他寫到七點。」",fx:{hp:-3,par:8},set:{yuLate:1},log:"答應小宇留到七點",res:[["xiangma","真的很謝謝……我最近兩個孩子都顧不好。"],[null,"她最後那句講得很小聲。"]]},
    {label:"「最好六點半前來接，晚了我會請櫃台幫忙看。」",fx:{par:2,pat:2},log:"請小宇媽媽六點半前接",res:[["xiangma","好……我盡量。"]]}]},
  {id:"c2_fight",t:"16:10",target:{npc:"anan"},goal:"安安和阿凱吵起來了",npc:{anan:AT("reading",-.6,0,Math.PI/2)},after:{anan:SEAT("g4","anan")},
   pages:G=>[[null,"閱讀角傳來大哭聲。安安手上抓著一支粉紅色的自動鉛筆，阿凱說那是他的。"],["anan","這是我媽媽買給我的！她出差前買的！"],[null,"阿凱下午才從牙醫那邊回來，臉還腫腫的，也在哭。"]],
   choices:G=>[
    {label:"兩個人分開坐，一個一個聽",note:"先聽完再判斷",fx:{pat:-5,ord:6,par:4},set:{heardBoth:1},log:"分開聽兩個人說",res:[[null,"安安說：筆是媽媽買的，筆蓋上有她自己畫的星星。"],[null,"阿凱說：他的那支今天早上掉在學校了。"],[null,"筆蓋上真的有一顆歪歪的星星。阿凱擦擦眼淚，說：「……那我的在哪裡？」"]]},
    {label:"筆先收起來，放學再說",fx:{ord:4,par:-4},log:"把鉛筆先沒收",res:[[null,"兩個人都不哭了，也都不說話了。"],[null,"安安一直盯著你的抽屜。"]]},
    {label:"「借來借去很正常，大家好好相處。」",min:5,fx:{pat:2,ord:-4,par:-3},log:"請兩個人和好",res:[[null,"他們都說好。五分鐘後，閱讀角又吵起來了。"]]}]},
  {id:"c2_anma",chapter:{t:"17:00",title:"放學",sub:"櫃台開始廣播。今天安安的媽媽會自己來。",status:"放學中"},
   t:"17:20",target:{npc:"anma"},goal:"安安的媽媽到了",npc:{anma:PC.mimaLobby},after:{anma:null,anan:null},
   pages:G=>{const p=pv(G),l=[["anma","蔡老師！我是安安媽媽，終於見到您了。"]];
     if(p.ananNote)l.push(["anma","昨天您傳的聯絡簿照片，我在高鐵上看了好幾次。阿嬤眼睛不好，我真的很怕她看不懂。"]);
     else l.push(["anma","我剛剛看了聯絡簿……有兩天都沒有簽名。我出差，阿嬤又看不清楚，對不起。"]);
     if(G.f.heardBoth)l.push([null,"安安抱著媽媽的腰，手上還握著那支有星星的鉛筆。"]);
     l.push(["anma","老師，她這週……還好嗎？"]);return l;},
   choices:G=>{const c=[
    {label:"一件一件跟她說這週的事",note:"聯絡簿、作業、今天的鉛筆",fx:{par:10,hp:-4},set:{toldAnma:1},log:"跟安安媽媽說這週的狀況",res:G=>[["me","她這兩天很想你。聯絡簿沒簽的那天，她自己在下面寫了「媽媽出差」。"],...(G.f.heardBoth?[["me","今天那支鉛筆，她跟同學吵起來，說是你買的。她講得很清楚，沒有亂哭。"]]:[]),["anma","……謝謝您。我以為她都沒有在想我。"]]},
    {label:"「她很乖，都很好。」",fx:{pat:2,par:2},log:"簡單跟安安媽媽說她很好",res:[["anma","那就好。"],[null,"她牽著安安走出大門。安安回頭揮了兩次手。"]]}];
    return c;}},
  {id:"c2_mima",t:"17:50",target:{npc:"mima"},goal:"小米的媽媽今天準時到了",npc:{mima:PC.mimaLobby,mi:AT("lobby",.3,.8)},after:{mima:null,mi:null},
   pages:G=>{const p=pv(G),l=[["mima","老師～今天我五點五十就到了！"]];
     if(p.leftMi)l.push(["mima","小米昨天說她坐在櫃台旁邊等我……老師，安親不是到七點嗎？"],[null,"她的語氣不是生氣，是在確認。"]);
     else if(p.waitMi)l.push(["mima","昨天謝謝您陪她排彩色筆。她回家講了一整晚。"]);
     else l.push(["mima","昨天又晚到，真的很不好意思。"]);
     if(G.f.foundBunny)l.push(["mi","媽媽！布丁今天有午睡喔！"]);return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.leftMi)c.push({label:"「昨天是我先收拾，請櫃台幫忙看。以後我會陪到您來。」",fx:{par:8,pat:-2},set:{apologyMi:1},log:"跟小米媽媽說明昨天的事",res:[["mima","……好，謝謝老師說清楚。"],[null,"小米晃了晃書包上的兔子吊飾，跟你揮手。"]]});
     c.push({label:"跟媽媽說小米今天的事",fx:{par:6,hp:-2},log:"跟小米媽媽說今天的事",res:[["me",G.f.foundBunny?"午休起來布丁不見了，她很緊張，找到之後作業寫得很快。":"她今天作業都寫完了。"],["mima","她只有在這裡會這樣。在家都很黏我。"]]});
     c.push({label:"「明天也要準時喔！」",fx:{pat:2,par:-2},log:"提醒小米媽媽準時",res:[["mima","……好，我盡量。"]]});return c;}},
  {id:"c2_late",chapter:{t:"18:00",title:"剩下的人",sub:"四年級只剩一個。",status:"放學中"},
   t:"18:15",target:{npc:"yu"},goal:"小宇還在等媽媽",npc:{yu:SEAT("g4","yu")},
   pages:G=>{const j=pa(G,"jh"),l=[[null,"六點十五。四年級教室只剩小宇一個人。三樓傳來國中生上課的聲音。"]];
     l.push(["yu",G.f.yuLate?"我媽說她六點半要去樓上找我哥的老師。她說要很久。":"我媽說她等一下要去三樓。為什麼她去三樓不來二樓？"]);
     l.push(["yu",j.askedXiang?"我哥昨天跟我說，他不是故意不教我的。":"我哥是不是又被罵了？"]);return l;},
   choices:G=>[
    {label:"陪他把明天的國習先寫一頁",fx:{hp:-4,par:6,ord:3},set:{stayYu:1},log:"陪小宇寫明天的作業",res:[[null,"寫到第五個生字的時候，他問：「老師，你也有哥哥嗎？」"],[null,"你說有。他說：「那你哥會教你數學嗎？」"]]},
    {label:"讓他畫畫，自己整理明天的評量",fx:{hp:2,ord:4,par:-2},log:"讓小宇畫畫等媽媽",res:[[null,"他畫了一隻很大的恐龍，旁邊有一個比較小的。他說小的是他。"]]},
    {label:"帶他下樓，請櫃台幫忙看",fx:{hp:5,par:-6},set:{yuDesk:1},log:"把小宇交給櫃台",res:[[null,"小芸一邊接電話一邊對小宇比了一個「坐」的手勢。"],[null,"你走上樓梯的時候，聽到他在問：「姊姊，這個電話是誰打來的？」"]]}]},
  {id:"c2_close",t:"18:55",target:{spot:"g4podium"},goal:"收拾教室",action:"收拾",npc:{yu:null},
   pages:G=>[[null,G.f.yuDesk?"小宇的媽媽六點五十到。她在櫃台跟小芸道謝，沒有上二樓。":"六點五十，小宇的媽媽到了。她眼睛有點紅，牽著小宇的手說：「哥哥明天會早點去補習。」"],[null,"教室空了。午睡枕收回櫃子，桌子推回去。白板上那個睡覺的月亮還在。"]],
   choices:G=>[
    {label:"在交接本寫下這週每個小朋友的事",fx:{ord:6,hp:-3},set:{weekNote:1},log:"寫好這週的交接本",res:[[null,"安安的鉛筆、小米的兔子、小宇的進位、阿凱的牙齒。你寫滿了兩頁。"]]},
    {label:"關燈，下班",fx:{hp:5},log:"準時下班",res:[[null,"你關上四年級教室的燈。三樓還很吵。明天週四，四年級整天，三點二十才要去接人。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=s.pat<=0?["週三的耐心額度","午休、吵架、找兔子。四點多，你請林老師幫你看一下，自己去洗手台洗了很久的臉。"]:["中午就累壞了","從十二點半站到現在。晚上的補習班還沒開始，你已經沒力氣了。"];
  else if(f.toldAnma&&f.heardBoth&&s.par>=70)t=["把每個人好好交出去","安安的媽媽知道她這週想她，阿凱知道他的筆不是被偷的。週三很長，但沒有一件事被吞掉。"];
  else if(f.yuDesk&&f.yuLate)t=["說好的七點","你答應陪小宇到七點，最後他是在櫃台等到的。他不會記得是誰答應的，但你會。"];
  else if(s.par>=72)t=["家長最放心的安親老師","接人、午休、作業、放學。家長群組裡有人說：「週三也交給蔡老師。」"];
  else if(s.ord>=70)t=["整整齊齊的週三","午睡枕、名單、作業，全部都在位子上。只是有些話，今天沒有人說出口。"];
  else t=["平安的週三","中午接回來，晚上交出去。沒有大好也沒有大壞。"];
  return {title:t[0],desc:t[1],dead,big:[[f.yuCarry?"會了":"還沒","小宇的進位"],[f.toldAnma?"有":"沒有","跟安安媽媽聊這週"]]};
 }
};
MINIS.kidroll2={...MINIS.kidroll,intro:"四年級今天接 7 個（阿凱請假），隊伍裡只有 5 個。在名單上點出還沒出來的兩個。",
  names:["小宇","安安","小米","妞妞","子恩","晴晴","大頭"],absent:["小宇","小米"]};
MINIS.kidroll3={...MINIS.kidroll,intro:"名單上 8 個，隊伍裡只有 5 個。在名單上點出還沒出來的人。（有人今天請假，你沒看群組。）",
  names:["小宇","安安","小米","阿凱","妞妞","子恩","晴晴","大頭"],absent:["小宇","小米","阿凱"]};
MINIS.kidgrade2={...MINIS.kidgrade,intro:"小宇的數習 p.34，三題。點出每一題第一個寫錯的那一行。",
  papers:[
   {who:"小宇",q:"246 × 13 = ?",lines:["246 × 3 = 728","246 × 10 = 2460","728 + 2460 = 3188"],bad:0,why:"個位 6 × 3 = 18，進 1；十位 4 × 3 = 12，再加進位的 1 是 13，寫 3 進 1；百位 2 × 3 + 1 = 7。246 × 3 = 738，答案 3198。"},
   {who:"小宇",q:"700 − 368 = ?",lines:["個位不夠減，跟十位借；十位是 0，再跟百位借","個位：10 − 8 = 2","十位：10 − 6 = 4","百位：7 − 3 = 4","答：432"],bad:2,why:"十位借給個位之後只剩 9：9 − 6 = 3；百位剩 6：6 − 3 = 3。答案 332。"},
   {who:"小宇",q:"1/4 + 2/4 = ?",lines:["1/4 + 2/4 = 3/8","答：3/8"],bad:0,why:"分母一樣，分母不變、分子相加：3/4。"}
  ]};

/* ---------- 九年級班導・第二天 ---------- */
/* 今天到考場的人數：十二個人，阿哲沒來就少一個 */
const zheGone2=G=>!!(G.f.zheAbsent||pv(G).refundForm&&!(pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe));
const c9Here2=G=>12-(zheGone2(G)?1:0),CN={6:"六",8:"八",9:"九",12:"十二",11:"十一",22:"二十二",24:"二十四"};
LINES2.jh={...LINES.jh,day:2,
 busy:[["13:30","17:35",null,"整理班務","改小考、回家長訊息、整理聯絡本。",15],["19:35","21:03",null,"顧班","在教室和辦公室之間來回：顧秩序、接家長電話、簽聯絡本。",15]],
 pick:"第二天・週三。段考倒數五天。昨天的聯絡本，今天都有家長的回覆。",
 coda:"班導的工作沒有下課鐘。但今天，有人在聯絡本上回了一句「謝謝老師」。",
 msgs:[["13:40","何主任","鄭老師，段考模擬卷今天要印好喔"],["15:20","品妤媽媽","老師您好，方便的話下午想跟您通個電話"],["18:05","阿翔媽媽","老師我六點半到，在三樓等您"],["20:40","許老師","九年級今天狀況不錯👍"]],
 boards:{c9:"會考倒數 209 天\n段考：下週二、三"},
 eventSlots:[{after:"j2_pinyuma",t:"15:50",phase:"pre"},{after:"j2_class",t:"18:20",phase:"class"},{after:"j2_qing",t:"19:33",phase:"break"}],
 npcs:{...LINES.jh.npcs,xiangma:null,mom:null},
 // 週三第一節是英文模擬考，班導發卷監考；第二節才是許老師的數學模擬。
 bells:{...LINES.jh.bells,class:G=>G.clock<T("19:30")?["段考模擬開始","手機進籃子。英文模擬考，你發卷監考。"]:["上課了","手機進籃子。第二節，許老師的數學模擬。"]},
 steps:[
  {id:"j2_arrive",chapter:{t:"13:30",title:"第二天・週三",sub:"段考倒數五天。昨晚家長的回覆都傳來了。",status:"準備中",rush:["家長在群組和私訊的回覆要看完。","段考模擬卷要印。"]},
   t:"13:30",target:{spot:"hrdesk"},goal:"上三樓，看家長的回覆",action:"打開手機",
   pages:G=>{const p=pv(G),l=[[null,"聯絡本要等學生傍晚帶來。昨晚家長簽完，多半先拍照私訊給你。"]];
     if(p.notesAll)l.push([null,"林媽媽拍了阿哲那本：你寫的「今天有問問題」下面，多了一行她的字：「他回家有說。謝謝老師。」"]);
     if(p.paidFor)l.push([null,"櫃台轉上來一個信封，是林媽媽中午送來的便當錢。八十五元，零錢用膠帶黏在紙上。"]);
     if(p.readNote)l.push([null,"有一位家長只傳了一句：「孩子說老師在全班面前念他的紙條，請問這是補習班的做法嗎？」"]);
     if(l.length===1)l.push([null,"大部分只有簽名。有一本寫：「段考加油」，不知道是寫給孩子還是寫給你。"]);return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.readNote)c.push({label:"打給那位家長，為念紙條道歉",fx:{par:8,pat:-4},set:{sorryNote:1},log:"為念紙條向家長道歉",res:[[null,"電話那頭沉默了一下：「……老師願意打來，我就知道了。」"]]});
     c.push({label:"每一則都回一句",fx:{par:5,hp:-4},set:{replyAll:1},log:"每位家長都回覆",res:[[null,"十二位家長，十二句。回到第九位，手指開始痠。"]]});
     c.push({label:"先已讀，去印考卷",fx:{hp:2},log:"家長回覆先已讀",res:[[null,"你抱起模擬卷原稿下樓。"]]});return c;}},
  {id:"j2_print",t:"14:00",target:{spot:"copier"},goal:"下樓印段考模擬卷",action:"開始印",
   pages:G=>{const b=pa(G,"boss"),p=pv(G),l=[];
     if(b.newCopier)l.push([null,"影印機上貼著一張新的便利貼：「新機週五到，請大家再忍一下。——主任」"]);
     else if(b.splitCopy)l.push([null,"影印機旁邊貼了一張表：「安親 14:00 前、國中 14:00–16:00、美語 16:00 後」。現在剛好輪到你。"]);
     l.push([null,"模擬卷兩科：第一節英文、第二節數學，每科十五份，正反面。"]);
     if(p.letCai)l.push([null,"影印機上放著一杯珍奶，杯子上寫著「鄭」。旁邊的便利貼是蔡老師的字：「昨天謝謝你讓我先印！」"]);return l;},
   choices:G=>[
    {label:"一份一份印，印完自己裝訂",mini:"jam",fx:r=>({hp:-3-2*Math.min(3,r.tears),stu:r.tears?0:3}),log:r=>r.tears?`印模擬卷，撕破 ${r.tears} 張`:"順利印完模擬卷",res:r=>r.tears?[[null,"卡了兩次。最後一份的第三頁，印歪了一點。"]]:[[null,"三十份，裝訂好，疊成兩疊。"]]},
    {label:"請櫃台幫忙印，自己回去排座位",fx:{hp:2,pat:-2},log:"請櫃台幫忙印模擬卷",res:[["yun","好……我盡量。（電話又響了）"]]}]},
  {id:"j2_seatplan",t:"14:40",target:{spot:"hrdesk"},goal:"核對今晚模擬考的名單",action:"拿出名單",
   pages:G=>[[null,"名單上十二個人。子涵昨天請假去比合唱，今天早上比完了。"],[null,"段考前最後一次模擬，缺考的人要另外補考。"]],
   choices:G=>[
    {label:"傳訊息給子涵媽媽，確認今天會到",fx:{par:4,hp:-1},log:"確認子涵今天會到",res:[[null,"子涵媽媽回：「比完了！第二名！今天會準時到。」"]]},
    {label:"先印一份補考卷備著",fx:{stu:2,hp:-2},log:"多準備一份補考卷",res:[[null,"你在備用卷上寫：「補考用」，放進抽屜。"]]}]},
  {id:"j2_pinyuma",t:"15:30",target:{spot:"hrdesk"},goal:"品妤媽媽打來",action:"接電話",
   pages:G=>{const p=pv(G),l=[];
     if(p.pinyuSleep)l.push(["pinyuma","老師，您在聯絡本最後寫：「品妤說她兩點睡、六點起。」是什麼意思？"]);
     else if(p.pinyuMa)l.push(["pinyuma","老師，昨天謝謝您打來。她說胃痛，我帶她去看了，醫生說是壓力。"]);
     else l.push(["pinyuma","老師，品妤最近小考怎麼樣？我看她每天都念到很晚。"]);
     l.push(["pinyuma","她說她想段考考進前三。我是覺得……她可以的。"]);return l;},
   choices:G=>[
    {label:"「她可以，但她現在很累。」",note:"把看到的說出來",fx:{par:4,stu:6,pat:-4},set:{toldPinyuMa:1},log:"跟品妤媽媽說她很累",res:[["pinyuma","……她都沒跟我說。"],["me","她不會跟您說。她怕您覺得她做不到。"],[null,"電話那頭安靜了很久。最後她說：「那我今天早點去接她。」"]]},
    {label:"報告她的小考成績",fx:{par:5},log:"跟品妤媽媽報告成績",res:[["pinyuma","九十二、九十五、八十八……嗯，理化要再加強。"],[null,"你沒有說兩點睡的事。"]]}]},
  {id:"j2_seat",t:"16:30",target:{spot:"c9back"},goal:"打掃教室，排段考模擬座位",action:"排座位",
   pages:G=>{const p=pv(G),l=[[null,"段考模擬要照考試的座位坐：單人單排，桌子拉開。"]];
     l.push([null,p.zheFront?"昨天阿哲坐第二排。他媽媽在聯絡本寫：「他說坐前面比較不會睡。」":p.freeSeat?"昨天讓學生自己選，最後一排擠了四個人。":"阿哲還是最後一排靠窗。"]);return l;},
   choices:G=>[
    {label:"照座號排，跟學校段考一樣",fx:{stu:4,hp:-4},log:"照座號排模擬座位",res:[[null,"十二張桌子，拉成四排。地上貼了膠帶標記。"]]},
    {label:"照座號排，阿哲那張桌子放一張便利貼",note:"「分數的題目先跳過」",fx:{stu:6,hp:-4},set:{zheNote:1},log:"在阿哲桌上留了一張便利貼",res:[[null,"你寫：「分數的題目先跳過，會的先寫。」然後在旁邊畫了一個箭頭。"]]}]},
  {id:"j2_xiang",chapter:{t:"17:20",title:"到班",sub:"國中生陸續到班。今天是段考模擬。",status:"到班中"},
   t:"17:35",target:{npc:"xiang"},goal:"阿翔到了",npc:{xiang:[...AT("lockers",-.8,.4,Math.PI),DOOR],pinyu:C9("pinyu"),qing:C9("qing")},after:{xiang:SEAT("c9","xiang")},
   pages:G=>{const p=pv(G),l=[];
     if(p.askedXiang)l.push([null,"五點三十五分，阿翔出現在置物區。比昨天早了四十分鐘。"],["xiang","……老師，手機。"],[null,"他把手機放進籃子，停了一下才放手。"]);
     else if(p.calledXiang||p.metXiangma)l.push([null,"阿翔到了。他媽媽陪他走到電梯口才離開。"],["xiang","……我媽說她晚上要上來找你。"]);
     else l.push([null,"阿翔到了，五點三十五。手機還握在手上。"],["xiang","今天模擬考喔？那我交手機。"]);return l;},
   choices:G=>[
    {label:"「今天很準時。你媽媽晚上會上來，你知道嗎？」",fx:{stu:5,pat:-2},set:{toldXiang:1},log:"先跟阿翔說媽媽晚上會來",res:[["xiang","知道。她昨天哭了。"],[null,"他說完就走進教室，坐下，把模擬卷翻過來看。"]]},
    {label:"點頭，收手機",fx:{hp:1},log:"收阿翔的手機",res:[[null,"他走進教室。你在點名表上寫：17:35。"]]}]},
  {id:"j2_zhe",t:"17:52",target:G=>pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe?{npc:"zhe"}:{spot:"hrdesk"},goal:G=>pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe?"阿哲在門口等你":"阿哲還沒到",action:G=>pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe?null:"打電話",
   npc:{zhe:G=>pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe?AT("c9door",-1.2,.5,Math.PI):null},after:{zhe:G=>pv(G).refundForm&&!(pa(G,"boss").baseClass||pa(G,"teacher").zheOpen||pv(G).bossKnowsZhe)?null:SEAT("c9","zhe")},
   pages:G=>{const p=pv(G),b=pa(G,"boss"),t=pa(G,"teacher"),l=[];
     if(b.baseClass||p.bossKnowsZhe)l.push(["zhe","老師，主任打給我媽了。說寒假有分數的基礎班。"],["zhe","我媽說……先不退了。"]);
     else if(t.zheOpen)l.push(["zhe","許老師說，段考完的週四叫我提早半小時來。他說從分數開始。"]);
     if(l.length){if(G.f.zheNote||p.zheTalk)l.push(["zhe","還有……我桌上那張便利貼，是你寫的嗎？"]);return l;}
     l.push([null,"阿哲還沒到。刷卡紀錄是空的。"]);
     if(p.refundForm)l.push([null,"櫃台說，林媽媽中午來拿了一張退費單。"]);
     l.push([null,"你撥了林媽媽的電話。"]);return l;},
   choices:G=>{const p=pv(G),b=pa(G,"boss"),t=pa(G,"teacher");
     if(b.baseClass||t.zheOpen||p.bossKnowsZhe)return [
      {label:"「分數的題目先跳過，會的先寫。」",fx:{stu:8,pat:-2},set:{zheStay:1},log:"陪阿哲準備模擬考",res:[["zhe","……會的先寫。好。"],[null,"他走進教室，坐下的時候看了一眼桌上的便利貼。"]]},
      {label:"「進去吧，要開始了。」",fx:{stu:2},set:{zheStay:1},log:"請阿哲進教室",res:[[null,"他點點頭，走進去。"]]}];
     return [
      {label:"「林媽媽，我想先跟您談阿哲卡在哪裡。」",fx:{par:6,pat:-5},set:{zheMomTalk:1},log:"跟林媽媽談阿哲卡在哪裡",res:[["mom","……他卡在哪裡？他從來沒跟我說過。"],["me","分數。從國一就是。"],[null,"電話那頭的聲音軟了下來：「那……還有辦法嗎？」"]]},
      {label:"確認他今天會不會來",fx:{par:2},set:{zheAbsent:1},log:"確認阿哲今天是否到班",res:[["mom","他說不想去了。退費單我拿了，還沒填。"],[null,"今天的模擬考，十二張桌子有一張是空的。"]]}];}},
  {id:"j2_class",chapter:{t:"18:00",title:"段考模擬",sub:"18:00–18:50 英文模擬，之後對答案訂正",status:"上課中"},
   t:"18:02",target:{spot:"c9podium"},goal:"發模擬卷，開始監考",action:"發考卷",
   pages:G=>[[null,`「考卷翻過來。」${CN[c9Here2(G)]}支筆同時開始動。`],[null,"監考的時候，你看得到每一個人卡在哪裡：有人一直擦，有人一直看時鐘，有人在第一題就停住了。"]],
   choices:G=>[
    {label:"在後面慢慢巡，記下每個人卡住的題號",fx:{stu:6,hp:-3},set:{watchNotes:1},log:"監考時記下每個人卡住的地方",res:[[null,"你的筆記本上寫滿了座號和題號。阿翔在第十二題停了很久，最後寫了一個答案。"]]},
    {label:"坐在講台上改昨天的小考",fx:{hp:3,stu:-2},log:"監考時順便改考卷",res:[[null,"改到一半抬頭，最後一排有人在偷看手機。"]]}]},
  {id:"j2_xiangma",t:"18:32",target:{npc:"xiangma"},goal:"阿翔媽媽在國中老師休息室等你",npc:{xiangma:AT("jhlounge",0,.6,Math.PI)},after:{xiangma:null},
   pages:G=>{const p=pv(G),l=[[null,"你請課輔的阿宏到九年級門口幫忙看一下考場，才下樓到休息室。"],["xiangma","老師，抱歉打擾您上課。小宇還在二樓，我下午有先跟蔡老師說會晚一點。"]];
     l.push(["xiangma",p.askedXiang?"昨天回家，阿翔跟我說了……他說他覺得我一直拿他跟小宇比。":"昨天我在網咖找到他。回家他一句話都沒說。"]);
     l.push(["xiangma","我一個人帶兩個，下午接小的，晚上接大的。我真的不知道要怎麼辦。"]);return l;},
   choices:G=>[
    {label:"先聽她說完，再談阿翔在班上的樣子",note:"花點時間",min:20,fx:{par:10,hp:-5,pat:-3},set:{heardXiangma:1},log:"聽阿翔媽媽說完",res:[[null,"她講了二十分鐘。你只在最後說了一句：「他今天五點三十五就到了，比昨天早了四十分鐘。」"],["xiangma","……真的嗎？"],[null,"她低頭擦眼睛。二樓傳來小朋友的笑聲。"]]},
    {label:"給她看今天的到班紀錄和小考成績",fx:{par:5,stu:3},log:"給阿翔媽媽看到班紀錄",res:[["xiangma","數學八十二……他以前都不到六十。"],[null,"她把成績單拍下來，說要給爸爸看。"]]},
    {label:"「建議您們家裡先好好談一次。」",fx:{par:-3,hp:2},log:"請阿翔媽媽回家談",res:[["xiangma","……好。謝謝老師。"],[null,"她起身的時候，看起來比剛來的時候更累。"]]}]},
  {id:"j2_qing",chapter:{t:"19:25",title:"下課十分鐘",sub:"英文考完了，第二節是許老師的數學模擬。",status:"下課"},
   t:"19:27",target:{npc:"qing"},goal:"子晴拿著一張紙過來",npc:{qing:PJ.qingHall},after:{qing:SEAT("c9","qing"),teacher:PJ.teacherPodium},
   pages:G=>{const p=pv(G),l=[];
     if(p.speech)l.push(["qing","老師，演講的題目我寫好了：「我最想改變的一件事」。可以聽我講一分鐘嗎？"]);
     else if(p.talkMom)l.push(["qing","老師，你昨天跟我媽說了嗎？她今天早上說……她要再想想。"]);
     else l.push(["qing","老師，聯絡本要簽。"],[null,"她沒有再提演講比賽的事。報名表從她的資料夾露出一角。"]);return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.speech)c.push({label:"站在走廊聽她講完",fx:{stu:8,hp:-2},set:{heardSpeech:1},log:"在走廊聽子晴練習演講",res:[["qing","「我最想改變的一件事，是成績單上的排名。」"],[null,"走廊上等電梯的人都安靜了。講完的時候，有兩個八年級的拍手。"]]});
     else if(p.talkMom)c.push({label:"「我晚上再打給你媽媽一次。」",fx:{stu:5,par:3,hp:-3},set:{callQingMa:1},log:"答應再跟子晴媽媽談",res:[["qing","……謝謝老師。"]]});
     else c.push({label:"「報名表是不是還在你那裡？」",fx:{stu:6,pat:-2},set:{askSpeech:1},log:"問子晴演講比賽的事",res:[["qing","……老師你看到了喔。"],[null,"她把報名表抽出來，上面已經寫好名字了。只差家長簽名。"]]});
     c.push({label:"簽聯絡本，提醒她準備第二節",fx:{hp:1},log:"簽子晴的聯絡本",res:[["qing","好。"]]});return c;}},
  {id:"j2_hall",t:"20:10",target:{spot:"c9door"},goal:"走廊有人在吵",action:"走出去",
   pages:G=>{const p=pv(G),b=pa(G,"boss"),l=[[null,"第二節上到一半，走廊傳來八年級的吵架聲。有人在電梯口推來推去。"]];
     if(p.askHelp||b.hongHall)l.push([null,"阿宏已經站在電梯口了，兩手各拉著一個。"],["hong","鄭老師，這兩個為了誰先搭電梯打起來。"]);
     else l.push([null,"走廊沒有人顧。一個八年級的跌坐在地上，另一個在旁邊喊「是他先的」。"]);return l;},
   choices:G=>[
    {label:"兩個帶到休息室，分開問",fx:{stu:4,pat:-5},log:"把吵架的八年級分開問",res:[[null,"一個說他要去 7-11，一個說他要回教室。電梯只有一台。"],[null,"你讓他們各寫一張紙，放在八年級班導的桌上。她今天請假，明天會看到。"]]},
    {label:"「回教室，下課再說。」",fx:{pat:2,stu:-2},log:"叫吵架的人回教室",res:[[null,"他們回去了。你知道下課的時候，電梯口還是只有一台電梯。"]]}]},
  {id:"j2_out",chapter:{t:"21:00",title:"放學",sub:"刷卡、等家長、搶電梯。",status:"放學"},
   t:"21:03",target:{npc:"pinyu"},goal:"品妤收書包收得很慢",npc:{pinyu:SEAT("c9","pinyu"),zhe:null,qing:null,xiang:null,trial:null,teacher:null},
   pages:G=>{const l=[[null,"品妤把模擬卷收進資料夾。數學那一份，紅筆圈了好幾個地方。"]];
     l.push(["pinyu",G.f.toldPinyuMa?"老師，我媽今天說……如果累的話，可以不用考前三。她從來沒講過這種話。":"老師，我數學錯好多。我媽一定會說我不夠認真。"]);return l;},
   choices:G=>[
    {label:G.f.toldPinyuMa?"「那今天早點睡。」":"「錯在哪裡，比錯幾題重要。」",fx:{stu:6,hp:-2},set:{pinyuOk:1},log:"陪品妤收書包",res:G=>G.f.toldPinyuMa?[["pinyu","……嗯。今天十二點前睡。"],[null,"她背起書包，第一次沒有在電梯裡翻講義。"]]:[["pinyu","……錯在哪裡。"],[null,"她把資料夾又打開，在第一個紅圈旁邊寫了三個字：「對應邊」。"]]},
    {label:"「早點回家。」",fx:{hp:2},log:"叫品妤早點回家",res:[["pinyu","嗯。老師晚安。"]]}]},
  {id:"j2_close",t:"21:15",target:{spot:"hrdesk"},goal:"整理模擬考、寫聯絡本",action:"坐下來",
   pages:G=>[[null,`收回來的模擬卷 ${CN[c9Here2(G)*2]} 張，備用卷 ${CN[30-c9Here2(G)*2]} 張另外收好。${CN[c9Here2(G)]}本聯絡本。`],[null,G.f.watchNotes?"監考時記下的題號，正好可以寫進每個人的聯絡本。":"今天的事，要寫成家長看得懂的三行字。"]],
   choices:G=>[
    {label:G.f.watchNotes?"把每個人卡住的題號寫進聯絡本":"每本都寫一句今天的事",fx:{par:8,hp:-6,stu:G.f.watchNotes?4:0},set:{notesAll2:1},log:"每本聯絡本都寫一句話",res:G=>[[null,G.f.watchNotes?"「第 12 題停了很久，但寫出來了。」這是阿翔那本。":"寫到阿翔那本，你寫：「今天 17:35 到班。」"]]},
    {label:"只寫成績，簽名",fx:{hp:3,par:-2},log:"聯絡本只寫成績",res:[[null,"你關燈的時候，三樓只剩電梯的聲音。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=["週三的班導先倒了","模擬考改到一半，你趴在桌上睡著了。阿宏幫你蓋了一件外套。"];
  else if(f.heardXiangma&&(f.zheStay||f.zheMomTalk)&&s.stu>=68)t=["一個班的家","阿翔的媽媽、阿哲的媽媽，今天都找到了可以說話的人。這件事不會寫在班務本上。"];
  else if(f.toldPinyuMa&&f.pinyuOk)t=["前三名以外的事","品妤今天十二點前睡。這是段考前一週，最難得的一件事。"];
  else if(s.par>=72)t=["家長群組的定心丸","電話、聯絡本、休息室。今天每一位家長都有人回。"];
  else if(s.stu>=72)t=["學生會找的班導","模擬考考完，還有人留下來問你理化。"];
  else t=["平安放學","印完、考完、簽完。段考倒數四天。"];
  return {title:t[0],desc:t[1],dead,big:[[f.heardXiangma?"聽完了":"沒有","阿翔媽媽的話"],[f.zheStay?"留下來":f.zheMomTalk?"談過了":"空著","阿哲的座位"]]};
 }
};
