/* ================= 第二天：安親班與國中部 ================= */

/* ---------- 安親班老師・第二天（週三下午） ---------- */
LINES2.care={...LINES.care,day:2,
 pick:"第二天。昨天的名單、收據、布丁，今天都還在。",
 coda:"小朋友不會記得哪一天是第二天。但他們記得誰每天都在。",
 msgs:[["14:30","小芸","昨天的收據我對過了～"],["15:30","國小家長群","下午可能會下雨，請記得帶傘"],["17:20","安安媽媽","老師，我今天出差回來了！晚上我去接她"],["18:05","小米媽媽","今天我準時！"]],
 eventSlots:[{after:"c2trial",t:"15:10",phase:"pre"},{after:"c2fight",t:"16:55",phase:"class"},{after:"c2snack",t:"17:50",phase:"class"}],
 steps:[
  {id:"c2open",chapter:{t:"14:00",title:"第二天・週三下午",sub:"昨天的事，今天都有後續。",status:"準備中",rush:["櫃台上有一張小芸留的紙條。","下午可能會下雨。"]},
   t:"14:00",target:{spot:"counter"},goal:"看小芸留的紙條",action:"看紙條",
   pages:G=>{const p=pv(G),l=[[null,"櫃台上貼著一張便利貼，是小芸昨晚留的。"]];
     if(p.paid===0)l.push(["yun","（紙條）昨天阿嬤的收據金額跟抽屜對不起來，差了 600。可以幫我問一下嗎？"]);
     else if(p.handoffGood)l.push(["yun","（紙條）昨天的交接超清楚！謝謝你～收據都歸檔了。"]);
     else l.push(["yun","（紙條）昨天抽屜裡有一張收據沒歸檔，我先收好了。下次跟我說一聲喔！"]);
     if(p.handedMi)l.push([null,"接送名單被人用紅筆圈起來，旁邊寫著：「名單外的人，一律先打電話。」是你自己的字。"]);
     return l;},
   choices:G=>{const p=pv(G),c=[];
     if(p.paid===0)c.push({label:"打給李阿嬤，說明金額算錯了",fx:{par:4,pat:-3},set:{fixPay:1},log:"打給李阿嬤更正學費",res:[["ama","喔……沒關係沒關係，我今天接安安的時候拿過去。"],[null,"她的語氣很平常。你反而比較緊張。"]]});
     c.push({label:"把接送名單重新整理一次",fx:{ord:8,hp:-3},set:{newList:1},log:"重新整理接送名單",res:[[null,"每個小朋友一行，可以接的人、電話、特殊狀況。小米那一行，你寫了媽媽的公司電話。"]]});
     c.push({label:"先泡杯咖啡",fx:{hp:6},log:"開門先喝咖啡",res:[[null,"下午兩點，又是唯一安靜的時候。"]]});return c;}},
  {id:"c2trial",t:"14:40",target:{npc:"zhangma"},goal:"張媽媽又來了",npc:{zhangma:kidIn(PC.zhangLobby)},after:{zhangma:null},
   pages:G=>pv(G).trialKid?[["zhangma","你好！我想說先把試讀的資料填一填，下週一比較快。"],[null,"她手上拿著一張紙，上面是兒子這週的數學作業。應用題那幾題，都被紅筆圈起來了。"]]:[["zhangma","你好……我上次來問過。我去對面看過了，那邊人太多。"],["zhangma","我想再聽你說一次。"]],
   choices:G=>pv(G).trialKid?[
     {label:"一起看他的作業，找出卡在哪",fx:{par:10,hp:-3},set:{lookedHw:1},log:"陪張媽媽看孩子的作業",res:[["me","他不是不會算，是不知道題目在問什麼。你看，這題他把「剩下」當成「一共」了。"],["zhangma","……原來是這樣。"]]},
     {label:"請她填表，週一見",fx:{par:3,ord:3},log:"請張媽媽填試讀表",res:[["zhangma","好，週一見！"]]}]:[
     {label:"這次好好問清楚",mini:"consult",fx:r=>({par:r.score>=3?12:r.score>=1?4:-4,hp:-3}),log:r=>`第二次接待張媽媽（${r.score>=3?"她決定試讀":"她還在考慮"}）`,res:r=>{if(r.score>=3)G.f.trialKid=1;return r.score>=3?[["zhangma","好，那下週一我帶他來。"]]:[["zhangma","我再想想……"]];}},
     {label:"給她價目表",fx:{par:-2},log:"又只給價目表",res:[["zhangma","……好，謝謝。"]]}]},
  {id:"c2pickup",chapter:{t:"15:50",title:"放學",sub:"下雨了。",status:"準備中"},
   t:"15:52",target:{spot:"door"},goal:"拿傘去國小接小朋友",action:"出發",
   after:{yu:kidIn(PC.yuSeat),anan:kidIn(PC.ananSeat),mi:kidIn(PC.miSeat)},
   pages:G=>[[null,"雨下得很大。校門口的家長撐著傘擠成一團。"],[null,"八個小朋友，你只有三把大傘。"]],
   choices:G=>[
    {label:"分兩趟，先帶小的",fx:{hp:-8,ord:6,par:4},log:"下雨分兩趟接小朋友",res:[[null,"第一趟帶小米和一年級的，第二趟回來接大的。你自己的褲管全濕了。"]]},
    {label:"大家擠在傘下一起走",fx:{hp:-3,ord:-4,pat:-3},log:"八個人擠三把傘",res:[[null,"走到一半，小宇跑出傘外去踩水坑。"],["yu","老師你看！好大一個！"]]},
    {label:"請小芸開車來載",fx:{hp:2,par:-2},log:"請小芸幫忙接",res:[["yun","（電話）我還沒上班耶……好啦我十分鐘到。"]]}]},
  {id:"c2fight",t:"16:35",target:{npc:"yu"},goal:"小宇跟人吵起來了",
   pages:G=>[["yu","他拿我的橡皮擦！"],[null,"隔壁的阿凱抓著一個恐龍造型的橡皮擦，眼眶紅紅的。"],[null,"「是我的！我媽昨天買的！」"]],
   choices:G=>[
    {label:"請兩個人各說一次，再一起找",fx:{pat:-5,ord:6,par:3},set:{fair:1},log:"讓兩個小朋友各說一次",res:[[null,"最後在小宇的鉛筆盒底下，找到了另一個一模一樣的恐龍。"],["yu","……喔。"],[null,"兩個人一人一隻，開始比誰的恐龍比較兇。"]]},
    {label:"把橡皮擦收起來，下課再說",fx:{ord:4,pat:2},log:"先沒收橡皮擦",res:[[null,"兩個人都哭了。但至少開始寫作業了。"]]},
    ...(pv(G).yuChecked?[{label:"「小宇，你昨天進位寫得很好喔。」",note:"先讓他冷靜",fx:{pat:3,ord:4},log:"先稱讚小宇再處理",res:[["yu","……真的嗎？"],[null,"他鬆開手。阿凱趁機把橡皮擦拿回去了。"]]}]:[])]},
  {id:"c2anan",t:"17:05",target:{npc:"anan"},goal:"安安拿著聯絡簿過來",
   pages:G=>pv(G).ananNote?[["anan","老師，媽媽回信了！"],[null,"聯絡簿上，安安媽媽寫了一整頁。最後一行是：「謝謝老師幫我看著她。今天我回來了。」"]]:[["anan","老師……聯絡簿今天也沒簽。"],[null,"她低著頭，手指一直捏著聯絡簿的角。"]],
   choices:G=>pv(G).ananNote?[
     {label:"陪她一起讀媽媽寫的",fx:{pat:-2,par:6},log:"陪安安讀媽媽的信",res:[["anan","媽媽說今天會來接我。"],[null,"她把聯絡簿抱在胸前，一整個下午都沒放下來。"]]},
     {label:"「那今天要好好寫作業給媽媽看喔。」",fx:{ord:4},log:"鼓勵安安寫作業",res:[["anan","嗯！"]]}]:[
     {label:"幫她寫說明，傳訊息給媽媽",fx:{par:8,pat:-3},set:{ananNote:1},log:"幫安安寫聯絡簿說明",res:[[null,"媽媽回了：「我今天回來！謝謝老師。」"]]},
     {label:"「沒關係。」",fx:{pat:2},log:"聯絡簿又明天再簽",res:[["anan","……嗯。"]]}]},
  {id:"c2snack",chapter:{t:"17:30",title:"點心時間",sub:"今天是綠豆湯。",status:"點心時間"},
   t:"17:32",target:{npc:"mi"},goal:"小米拿著東西走過來",npc:{mi:PC.miHall},
   pages:G=>{const p=pv(G);return p.waitMi||p.miCalm?[["mi","老師，這個給你。"],[null,"是昨天布丁的蓋子，洗得乾乾淨淨。"],["mi","這是獎牌。"]]:[["mi","我不要吃綠豆。"],[null,"她把碗推得遠遠的，抱著兔子坐在走廊。"]];},
   choices:G=>{const p=pv(G);return p.waitMi||p.miCalm?[
     {label:"把獎牌別在胸前",fx:{pat:6,par:4},set:{medal:1},log:"收下小米的布丁蓋獎牌",res:[[null,"你把布丁蓋用膠帶貼在名牌上。一整個下午，每個小朋友都來問那是什麼。"]]},
     {label:"謝謝她，收進口袋",fx:{pat:3},log:"收下小米的禮物",res:[["mi","要好好收著喔！"]]}]:[
     {label:"陪她吃一口就好",fx:{pat:-3,par:4},log:"陪小米吃點心",res:[["mi","……一口。"],[null,"她吃了三口。"]]},
     {label:"不吃就不吃",fx:{pat:3},log:"讓小米不吃點心",res:[[null,"小米抱著兔子看雨。"]]}];}},
  {id:"c2parents",chapter:{t:"18:00",title:"接送",sub:"雨停了。",status:"接送中"},
   t:"18:02",target:{spot:"door"},goal:"站到門口",action:"拿出接送名單",npc:{mi:kidIn(PC.miSeat)},after:{yu:null,anan:null,mi:null},
   pages:G=>{const l=[[null,"雨停了。家長一個一個來。"]];
     l.push([null,"安安的媽媽拖著行李箱走進來。安安衝過去，聯絡簿掉在地上。"]);
     l.push([null,pv(G).waitMi?"小米媽媽六點整就到了。她說：「昨天謝謝你陪她。」":"小米媽媽今天準時。她遠遠地跟你點了點頭。"]);
     if(G.f.newList)l.push([null,"你手上的新名單，每個人都對得起來。"]);return l;},
   choices:G=>[
    {label:"跟每位家長說一句今天的事",fx:{par:10,hp:-4},log:"跟家長說孩子今天的事",res:[[null,"小宇的恐龍、安安的聯絡簿、小米的獎牌。每個家長走的時候都在笑。"]]},
    {label:"核對名單，一個一個送",fx:{ord:8},log:"照名單送走小朋友",res:[[null,"六點二十，教室空了。高三的學生開始走進來。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.hp<=0||s.pat<=0,f=G.f;
  let t;
  if(dead)t=["第二天的下午太長了","你在休息室的沙發上睡著了。小芸幫你蓋了一件外套。"];
  else if(f.medal&&s.par>=65)t=["戴著布丁蓋的老師","小朋友會長大、會忘記很多事。但今天有人頒了一面獎牌給你。"];
  else if(f.newList&&s.ord>=70)t=["名單上的每一個人","雨天、吵架、聯絡簿。今天的每個小朋友，都交到了對的人手上。"];
  else if(s.par>=72)t=["家長最放心的下午","六點的大廳，每個家長都知道自己的孩子今天發生了什麼。"];
  else t=["又一個下午","安親班的第二天，跟第一天一樣吵，也一樣平安。"];
  return {title:t[0],desc:t[1],dead,big:[[f.trialKid||pv(G).trialKid?"會來":"還在考慮","張媽媽的孩子"],[f.newList?"已更新":"照舊","接送名單"]]};
 }
};

/* ---------- 國中部英文老師・第二天 ---------- */
LINES2.jh={...LINES.jh,day:2,
 pick:"第二天。昨天搶過的東西，今天要重新分配。",
 coda:"走廊最裡面的教室，今天也有燈。",
 msgs:[["17:40","國中部群組","子晴媽媽：老師，子晴說想請你聽她練演講"],["19:05","許老師","昨天不好意思，今天影印機你先用🙏"],["20:30","阿翔媽媽","他說今天手機有自己交！真的嗎？"]],
 eventSlots:[{after:"j2room",t:"18:00",phase:"pre"},{after:"j2class",t:"19:30",phase:"class"},{after:"j2pinyu",t:"20:40",phase:"class"}],
 steps:[
  {id:"j2room",chapter:{t:"17:30",title:"第二天・國中部",sub:"昨天搶過的東西，今天要重新分配。",status:"備課中",rush:["主任室門口貼了一張新的東西。","子晴要練演講。"]},
   t:"17:32",target:{npc:"boss"},goal:"主任室門口貼了東西",
   pages:G=>{const p=pv(G);return p.roomPlan?[[null,"主任室門口貼著一張「教室設備使用表」。是你昨天畫的那張，主任用電腦重打了。"],["boss","許老師說，週三的投影機他想要。你們兩個談一下？"]]:[["boss","今天 B 班又要用投影機。C 班……"],[null,"主任還沒說完，你就知道答案了。"]];},
   choices:G=>pv(G).roomPlan?[
     {label:"去找許老師，一人一半時間",fx:{stu:4,par:3,hp:-2},set:{shareProj:1},log:"跟許老師分投影機時間",res:[["teacher","前半節給你，後半節給我？"],["me","成交。"],[null,"你們在使用表上各簽了名。"]]},
     {label:"讓給高三，換週四整天",fx:{stu:2},set:{trade:1},log:"投影機用週三換週四",res:[["boss","你們國中部真的很好說話。"]]}]:[
     {label:"這次提出使用表",fx:{par:4,hp:-3},set:{roomPlan:1},log:"向主任提出教室使用表",res:[["boss","……好，我們今天就排。"]]},
     {label:"算了，又用白板",fx:{voice:-4},log:"又讓出投影機",res:[[null,"白板筆只剩一支是有水的。"]]}]},
  {id:"j2xiang",t:"18:05",target:{npc:"xiang"},goal:"阿翔在置物區",npc:{xiang:[PJ.xiangLocker[0],PJ.xiangLocker[1],Math.PI,PJ.door]},
   pages:G=>pv(G).deal?[[null,"阿翔自己把手機放進籃子，排得很整齊。"],["xiang","老師，你有沒有那種……單字卡？我想帶回家背。"]]:[["xiang","老師，今天可以不要交嗎？"],[null,"他把手機握得很緊。"]],
   choices:G=>pv(G).deal?[
     {label:"給他一疊單字卡",fx:{stu:10,hp:-2},set:{cards:1},log:"給阿翔單字卡",res:[["xiang","……謝啦。"],[null,"他把單字卡塞進外套口袋，拍了兩下。"]]},
     {label:"叫他用手機 App 背",fx:{stu:4},log:"推薦阿翔用 App 背單字",res:[["xiang","那我手機要拿回來喔？"],["me","下課再說。"]]}]:[
     {label:"跟他做昨天沒做的約定",fx:{stu:6},set:{deal:1},log:"跟阿翔約定手機時間",res:[["xiang","好啦。"]]},
     {label:"照規定收",fx:{stu:-4,par:3},log:"收走阿翔的手機",res:[["xiang","（嘆氣）"]]}]},
  {id:"j2class",chapter:{t:"18:30",title:"國中 C 班",sub:"18:30–19:50・句型",status:"上課中"},
   t:"18:30",target:{spot:"jhpodium"},goal:"走上 C 班講台",npc:{xiang:PJ.xiangSeat},
   pages:G=>[[null,G.f.shareProj?"前半節，投影機是 C 班的。畫面很清楚。":"白板上寫著今天的句型：現在完成式。"],[null,"會考英文的句子重組，每年都有人錯在同一個地方。"]],
   choices:G=>[
    {label:"句子重組",note:"點的順序就是句子的順序",mini:"order",fx:r=>({voice:-5,stu:r.right>=5?12:r.right>=3?5:-2}),log:r=>`句子重組，${r.right}/6 個字放對`,
     res:r=>r.right>=5?[[null,"「I have never been to Japan.」全班一起念了一次。"]]:[[null,"有人寫成「I never have been」。你在白板上圈了起來。"]]},
    {label:"講文法規則",fx:{voice:-10,stu:-2},log:"直接講文法",res:[[null,"have + p.p.。第三排有人已經在畫 p.p. 的小人了。"]]}]},
  {id:"j2qing",chapter:{t:"19:50",title:"下課",sub:"子晴拿著講稿。",status:"下課"},
   t:"19:55",target:{npc:"qing"},goal:"子晴在門口等你",npc:{qing:PJ.qingHall},after:{qing:PJ.qingSeat},
   pages:G=>{const p=pv(G);return p.speech||p.talkMom?[["qing","老師，可以聽我念一次講稿嗎？三分鐘就好。"],[null,"題目是「我最想改變的一件事」。"]]:[["qing","我跟學校說不參加演講比賽了。"],[null,"她講得很平靜。但講稿還夾在她的講義裡。"]];},
   choices:G=>{const p=pv(G);return p.speech||p.talkMom?[
     {label:"認真聽完，給她三個建議",fx:{stu:10,voice:-4},set:{listened:1},log:"聽子晴練演講",res:[["qing","「成績單上的排名」……老師，這個題目會不會太敢講？"],["me","就是因為敢講，大家才會聽。"]]},
     {label:"「講得很好，加油。」",fx:{stu:4},log:"鼓勵子晴",res:[["qing","謝謝老師！"]]}]:[
     {label:"「講稿可以給我看嗎？」",fx:{stu:8,hp:-2},set:{readSpeech:1},log:"看子晴沒用上的講稿",res:[[null,"講稿的第一句是：「如果成績單上沒有排名，我會更喜歡英文。」"],["me","……明年還有比賽。"]]},
     {label:"尊重她的決定",fx:{par:3},log:"尊重子晴不比賽",res:[["qing","嗯。"]]}];}},
  {id:"j2pinyu",t:"20:25",target:{npc:"pinyu"},goal:"品妤在 C 班門口",npc:{pinyu:PJ.pinyuJhDoor},after:{pinyu:P.pinyuSeat},
   pages:G=>pv(G).talkback?[["pinyu","老師……昨天的事，我們班有人在講國中部很吵。"],["pinyu","可是我其實覺得你們的搶答好好玩。"]]:[["pinyu","老師，不好意思……我想問，C 班下課後可以借我們讀書會用嗎？自習室滿了。"]],
   choices:G=>pv(G).talkback?[
     {label:"「下次搶答，邀 B 班一起比？」",fx:{stu:8,par:4},set:{bridge:1},log:"邀高三一起比單字搶答",res:[["pinyu","真的嗎？我回去問許老師！"]]},
     {label:"「昨天我也說得太衝了。」",fx:{par:4},log:"跟品妤說昨天說得太衝",res:[["pinyu","沒有啦……"]]}]:[
     {label:"借她，九點半前還",fx:{par:4,hp:-2},set:{lend:1},log:"借 C 班給高三讀書會",res:[["pinyu","謝謝老師！"],[null,"你在使用表上多寫了一行：「21:20–21:30 高三讀書會」。"]]},
     {label:"「C 班要打掃。」",fx:{hp:2},log:"沒借 C 班",res:[["pinyu","喔……好。"]]}]},
  {id:"j2boss",chapter:{t:"21:15",title:"下課",sub:"國中生下課最快。",status:"收拾中"},
   t:"21:25",target:{npc:"boss"},goal:"去主任室",after:{xiang:null},
   pages:G=>{const l=[["boss","兩天辛苦了。國中部最近好像不太一樣。"]];
     if(G.f.shareProj||G.f.bridge||G.f.lend)l.push(["boss","許老師說，你們國中部很好合作。"]);
     l.push(["boss","下學期國中部想再開一班。你覺得呢？"]);return l;},
   choices:G=>[
    {label:"開，但要有自己的教室和投影機",fx:{par:6,hp:-3},set:{newClass:1},log:"答應開新班，要求教室設備",res:[["boss","好。這次寫在申請的第一行。"]]},
    {label:"先把現在的 C 班顧好",fx:{stu:6},log:"先顧好現在的 C 班",res:[["boss","也好。慢慢來。"]]}]}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,f=G.f;
  let t;
  if(dead)t=["第二天的嗓子先倒了","句子重組的最後一句，是阿翔幫你念的。"];
  else if((f.shareProj||f.bridge||f.lend)&&s.stu>=65)t=["走廊兩端的教室","投影機分一半、教室借一下、搶答邀一起。B 班和 C 班之間，不再只有搶。"];
  else if((f.listened||f.readSpeech||f.cards)&&s.stu>=65)t=["有人願意多背一點","單字卡、講稿。今天 C 班有人帶了一點東西回家。"];
  else if(s.par>=72)t=["國中部家長的定心丸","阿翔媽媽、子晴媽媽，今天都收到了好消息。"];
  else t=["又一個晚上","國中部的第二天，在高三的燈光旁邊，也亮著。"];
  return {title:t[0],desc:t[1],dead,big:[[f.shareProj?"一人一半":f.trade?"換到週四":"白板","投影機"],[G.minis.order?`${G.minis.order.right}/6`:"—","句子重組"]]};
 }
};
MINIS.order.sets.jh=["I","have","never","been","to","Japan."];
