/* ================= 職業線：櫃台班導 ================= */


LINES.yun={
 id:"yun",role:"櫃台班導",short:"班導",body:0x2fb39a,
 pick:"顧櫃台、接電話、點名、追家長。補習班出事，第一個知道的人。",
 cast:["teacher","boss","parent","mom","zhe","hong","chenba","bo"],
 stats:{hp:["體力",55],pat:["耐心",60],par:["家長",50],ord:["秩序",50]},hidden:{trial:50,ret:72,missed:0,cleared:0},
 late:{fx:{par:-4,ord:-3},text:"等你的人臉色不太好看。"},
 coda:"櫃台的電話明天還會響。你記得的是每個打來的人叫什麼名字。",
 msgs:[["17:44","何主任","試聽家長到了跟我說一聲。"],["18:42","妹妹","今天幾點回家？毛線又把衛生紙抓爛了"],["19:34","阿宏","自習室冷氣好冷，遙控器在你那嗎？"],["20:48","櫃台群組","許老師：林媽媽的電話謝謝你先擋著。"],["21:36","媽","菜幫你留在電鍋裡。"]],
 preStatus:"營業中",
 start:[3.75,10.2],dead:G=>G.s.hp<=0||G.s.pat<=0,
 me:G=>({name:"你",title:`${G.pName}・櫃台班導`,abbr:"班",color:"#1f9c86"}),
 npcs:{boss:P.bossOffice,teacher:PY.teacherLounge,pinyu:P.pinyuSeat,zhe:P.zheSeat,hong:P.hongStudy,bo:PY.boStudy,parent:null,parent2:null,yun:null,chenba:null},
 steps:[
  {id:"ycopy",chapter:{t:"17:20",title:"開店",sub:"櫃台的一天，從影印機開始。",status:"營業中",rush:["影印機又卡紙了，許老師的講義還差 8 份。","櫃台電話同時響了起來。"]},
   t:"17:20",target:{spot:"copier"},goal:"影印機在嗶嗶叫",
   pages:G=>[[null,"影印機的螢幕閃著紅燈：「紙路 B 卡紙」。許老師的[[講義]]還差 8 份，一個小時後上課。"],[null,"櫃台電話同時響了起來。每一條路，都要有人付。"]],
   choices:G=>[
    {label:"先把卡紙拉出來",note:"順著送紙方向",mini:"jam",fx:r=>({hp:-4-3*Math.min(4,r.tears),missed:1}),set:{handout:1},log:r=>r.tears?`修影印機，撕破 ${r.tears} 次`:"修好影印機",
     res:r=>r.tears?[[null,"撕破了幾次，最後用鑷子夾出碎紙。講義印好了，電話也停了。"],[null,"未接來電：1 通。"]]:[[null,"四張紙完整拉出來，講義嘩啦啦印好。電話停了。"],[null,"未接來電：1 通。"]]},
    {label:"先接電話，影印機等一下",fx:{pat:-5,ord:-5},set:{noHandout:1},log:"先接電話，講義沒印完",
     res:[[null,"是家長問明天要不要上課。講完電話，已經 17:50 了。"],["teacher","（走過來）小芸，講義……？算了，我改用投影片。"]]},
    {label:"抱著隨身碟跑對面超商印",fx:{hp:-8,missed:2},set:{handout:1},log:"跑超商印講義",res:[[null,"你跑了兩趟，講義印好了。回來時，櫃台的未接來電：2 通。"]]}
   ]},
  {id:"yparent",t:"17:40",target:{npc:"parent"},goal:"試聽家長到了",npc:{parent:PY.parentLobby,parent2:PY.parent2Lobby},
   pages:G=>[["parent","你好，我們是來[[試聽]]的。我姓王。"],["parent","想先問一下學費怎麼算？對面那間說，現在報名打八折耶。"],["parent2","（小聲）媽……"]],
   choices:G=>[
    {label:"照規定說明學費",note:"折扣是主任的事",fx:{par:5,trial:2},log:"照規定說明學費",res:[["me","學費一期是這樣算的，教材另計。折扣的部分，等一下主任可以跟您說明。"],["parent","好，我先聽聽看課。"]]},
    {label:"偷偷給她早鳥價",note:"先把人留住",fx:{trial:12,par:5},set:{discount:1},log:"私下答應早鳥價",res:[["me","（壓低聲音）今天試聽完報名，我幫您算[[早鳥優惠]]。"],["parent","真的嗎？那太好了。"],[null,"你想起主任說過，折扣只能在說明會用。"]]},
    {label:"請主任出來談",fx:{pat:-5,trial:6},log:"請主任出來接待試聽家長",res:[[null,"主任在辦公室講電話，讓王媽媽在沙發等了十分鐘。"],["parent","沒關係，我們不急。"],[null,"她看了兩次手錶。"]]}
   ]},
  {id:"ycalls",chapter:{t:"18:00",title:"電話時間",sub:"六點，下班的家長開始打電話。",status:"營業中"},
   t:"18:00",target:{spot:"counter"},goal:"回櫃台，電話在響",action:"接電話",npc:{parent:P.parentSeat,parent2:P.parent2Seat},
   pages:G=>[[null,"王媽媽和兒子進教室了。櫃台電話開始一通接一通。"],[null,"六點到六點半，是補習班最吵的半小時。"]],
   choices:G=>[
    {label:"一通一通接起來",mini:"calls",fx:r=>({par:r.ok*3-4,pat:-5,cleared:r.ok>=3?1:0,missed:r.ok<2?1:0}),log:r=>`接了四通電話，處理得好 ${r.ok} 通`,
     res:r=>r.ok>=3?[[null,"四通電話都處理得乾淨俐落。你在便利貼上寫下：「林媽媽：下課請許老師回電」。"]]:[[null,"有幾通處理得不太好。你在便利貼上多寫了兩行待辦。"]]},
    {label:"讓它響一下，先倒杯水",fx:{pat:5,par:-10,missed:3},log:"讓電話響，先休息",res:[[null,"你喝完一杯水，未接來電：3 通。"],[null,"其中一通是林媽媽。"]]}
   ]},
  {id:"yroll",chapter:{t:"18:30",title:"上課",sub:"教室門關上，櫃台安靜下來。",status:"上課中"},
   t:"18:35",target:{spot:"classdoor"},goal:"拿點名表去 B 班",action:"點名",npc:{teacher:PY.teacherBoard},
   pages:G=>[[null,"你從前門探頭進去。20 個座位坐了 18 個。"],[null,"沒來的是小安和柏翰。小安上週沒來，這週也沒來。"],...(G.f.noHandout?[[null,"許老師在用投影片上課，看了你一眼。"]]:[])],
   choices:G=>[
    {label:"照座位表一個一個點",note:"找出誰沒來",mini:"roll",fx:r=>({ord:r.miss?2:7,pat:-2}),log:r=>`照座位表點名，點錯 ${r.miss} 次`,set:{rollDone:1},
     res:r=>[[null,r.miss?"點錯了幾次，被學生笑了。不過小安和柏翰確實沒來。":"三十秒點完：小安、柏翰沒來。"],[null,"你在點名表上畫了兩個圈。晚點要打給他們家長。"]]},
    {label:"打給兩個缺席的家長",note:"現在就打",fx:{hp:-5,par:8,ret:-2},set:{calledAbsent:1},log:"打給缺席學生家長",res:[[null,"柏翰在路上塞車，十分鐘後到。"],[null,"小安的媽媽支支吾吾：「我們……已經報了對面了。」"],[null,"你在名單上，把小安的名字畫了一條線。"]]},
    {label:"在家長群組發點名通知",fx:{par:3},log:"在群組發點名通知",res:[[null,"柏翰的媽媽回了一個貼圖。小安的媽媽已讀，沒有回。"]]},
    {label:"先記著，晚點再說",fx:{missed:2,ord:-3},log:"缺席的事晚點再說",res:[[null,"你把點名表夾回櫃台。待辦事項又多了兩行。"]]}
   ]},
  {id:"yseat",t:"19:00",target:{npc:"hong"},goal:"自習室有人在吵架",npc:{teacher:PY.teacherBoard},
   pages:G=>[["hong","小芸姐，救命。兩個高一在搶座位。"],["bo","那是我先[[劃位]]的！"],[null,"另一個高一生抱著書包不肯動。自習室裡十幾雙眼睛都在看。"]],
   choices:G=>[
    {label:"拿出劃位表，照規定來",fx:{ord:10,pat:-5},log:"照劃位表處理座位糾紛",res:[[null,"劃位表上寫得很清楚：小柏。另一個學生嘟著嘴搬走了。"],["bo","謝謝小芸姐。"]]},
    {label:"把兩個人都換到前排",note:"各退一步",fx:{ord:5,pat:-3},log:"把兩個高一都換到前排",res:[[null,"兩個人都不太甘願，但前排有插座，很快就安靜了。"]]},
    {label:"請阿宏自己處理",fx:{ord:-5,pat:5},log:"讓助教自己處理",res:[["hong","……好喔。"],[null,"你回到櫃台時，自習室還在吵。"]]}
   ]},
  {id:"ymom",chapter:{t:"19:50",title:"下課 10 分鐘",sub:"下課鐘一響，櫃台電話也響了。",status:"下課"},
   t:"19:50",target:{spot:"counter"},goal:"林媽媽又打來了",action:"接電話",npc:{teacher:PY.teacherLounge},
   pages:G=>[["mom","小芸，許老師下課了沒？我要跟他講話。"],["mom","阿哲說他不想補了。我們繳了一整年的錢耶。"],[null,"許老師剛走進休息室，手上拿著一杯熱水。"]],
   choices:G=>[
    {label:"去休息室叫許老師",fx:{par:10,cleared:1},set:{teacherNoBreak:1},log:"請許老師下課接電話",res:[["teacher","……好，我來。"],[null,"他把熱水放下，下課十分鐘都在講電話。"]]},
    {label:"自己先安撫，約明天的時間",mini:"calm",fx:r=>({pat:-10,par:r.anger<=20?10:r.anger<=45?5:-5,cleared:1}),log:r=>`先安撫林媽媽（怒氣 ${r.anger}），約隔天談`,res:r=>[["me","林媽媽，許老師明天下午有空，我幫您約四點好嗎？"],["mom",r.anger<=45?"……好吧。四點喔。":"四點！不要再放我鴿子！"]]},
    {label:"說老師在忙，晚點回電",fx:{par:-10,missed:1},log:"跟林媽媽說老師在忙",res:[["mom","每次都在忙！"],[null,"電話被掛斷了。"]]}
   ]},
  {id:"yzhe",t:"19:56",target:{npc:"zhe"},goal:"阿哲站在櫃台前面",npc:{zhe:PY.zheCounter},
   pages:G=>[["zhe","小芸姐……"],["zhe","退費要怎麼算？"],[null,"他沒有看你，一直在摳書包的拉鍊。"]],
   choices:G=>[
    {label:"把退費申請單給他",fx:{ret:-3},set:{refundForm:1},log:"給阿哲退費申請單",res:[["zhe","喔。謝謝。"],[null,"他把單子對折兩次，塞進口袋。"]]},
    {label:"先陪他聊一下",note:"上課鐘快響了",fx:{pat:-5,ret:2},set:{zheTalk:1},log:"陪阿哲聊了一下",res:[["zhe","我不是不想念。我從高一就聽不懂了。上課像在聽外語。"],["zhe","我媽每次打電話來，我都很想消失。"],[null,"上課鐘響了。他說：謝謝小芸姐，然後走回教室。"]]},
    ...(K.has("zheBasics")?[{label:"跟他說主任可以安排基礎班",note:ECHO,fx:{pat:-3,ret:5},set:{zheTalk:1,bossKnowsZhe:1},log:"跟阿哲說有基礎班",res:[["zhe","……從高一開始？不會很丟臉嗎？"],["me","不會。很多人都是從那裡重來的。"],[null,"他把退費的事吞回去了，說要回家跟媽媽講。"]]}]:[]),
    {label:"叫他去找許老師談",fx:{},log:"請阿哲去找許老師",res:[["zhe","……喔。"],[null,"他走到休息室門口，站了一下，又走回教室了。"]]}
   ]},
  {id:"yboss",chapter:{t:"20:05",title:"第二節",sub:"主任在辦公室叫你。",status:"上課中"},
   t:"20:12",target:{npc:"boss"},goal:"主任在辦公室叫你",npc:{zhe:P.zheSeat,teacher:PY.teacherBoard},
   pages:G=>{const l=[["boss",`${G.pName}，試聽的資料準備好了嗎？`]];
     if(G.f.discount)l.push(["boss","還有，王媽媽剛剛說，你答應她早鳥價？"]);
     else l.push(["boss","還有五個沒續班的家長，今天能打完嗎？"]);return l;},
   choices:G=>{const c=[];
    if(G.f.discount){c.push({label:"承認，說是想先留住人",fx:{pat:-5,par:3},log:"跟主任承認早鳥價的事",res:[["boss","（嘆氣）……這次就算了。下次先問我。"]]});
      c.push({label:"說是王媽媽誤會了",fx:{trial:-12},set:{lieDiscount:1},log:"說早鳥價是家長誤會",res:[["boss","我就說嘛。"],[null,"你想到等一下要怎麼跟王媽媽說。"]]});}
    else{c.push({label:"今晚打完",fx:{hp:-10,ret:4,cleared:1},log:"答應今晚打完續班電話",res:[[null,"你在第二節的空檔打完五通。三個說會續，一個說再考慮，一個沒接。"]]});
      c.push({label:"明天再打",fx:{pat:5,ret:-1},log:"續班電話延到明天",res:[["boss","明天一定要喔。總部週五要數字。"]]});}
    if(G.f.zheTalk)c.push({label:"跟主任說阿哲的狀況",note:"他從高一就跟不上",fx:{ret:4,par:3},set:{bossKnowsZhe:1},log:"跟主任說阿哲的狀況",res:[["boss","從高一就跟不上？那他需要的是基礎班，不是退費。"],["boss","我明天打給林媽媽。"]]});
    return c;}},
  {id:"ykid",t:"21:00",target:{npc:"chenba"},goal:"有家長在櫃台等",npc:{chenba:PY.chenLobby,bo:null},
   pages:G=>[["chenba","你好，我來接小柏。自習室的助教說他不在？"],[null,"自習室的登記表上，小柏沒有寫離開時間。"],[null,"陳爸爸的手機撥了兩次，沒有人接。"]],
   choices:G=>{const c=[
    {label:"打給小柏",fx:{par:5},log:"打電話找小柏",res:[[null,"第三通，小柏接了：「我在 7-11 啦……」"],[null,"五分鐘後，他捧著一碗關東煮走進門。"]]},
    {label:"去自習室問阿宏",fx:{ord:5,pat:-5},log:"去自習室問小柏的下落",res:[["hong","他說去買宵夜，十分鐘就回來……那是半小時前。"],[null,"你們在門口等到他捧著一碗關東煮走進來。"],["me","自習室出去要登記，這是規定喔。"]]},
    {label:"請陳爸爸先坐一下",fx:{par:-10},log:"請家長在沙發等",res:[[null,"陳爸爸坐了十五分鐘，越坐臉越黑。"],[null,"小柏捧著一碗關東煮走進門時，陳爸爸已經站起來了。"]]}];
    if(G.f.knowBo||K.has("boSeven"))c.unshift({label:"直接去 7-11 找他",note:G.f.knowBo?"小柏說過他每天九點去買宵夜":ECHO+"：小柏九點會去買宵夜",fx:{hp:-3,par:10,ord:3},log:"去 7-11 找回小柏",res:[[null,"你在 7-11 門口找到小柏，他正在挑關東煮。"],["chenba","你怎麼知道他在這？謝謝你。"]]});
    return c;}},
  {id:"yenroll",chapter:{t:"21:15",title:"下課",sub:"試聽家長走出教室了。",status:"收拾中"},
   t:"21:18",target:{npc:"parent"},goal:"王媽媽在大廳",npc:{parent:PY.parentLobby,parent2:PY.parent2Lobby,bo:PY.boLobby,chenba:null,teacher:PY.teacherPodium},
   pages:G=>{const n=enrolledT(G);const l=[];
     l.push(["parent",n===2?"我們決定報名了。聽說另一位試聽的同學也要報。":n===1?"課是不錯。我們想報名，但……":"我們回去再討論看看。"]);
     if(G.f.lieDiscount)l.push(["parent","對了，你剛剛說的早鳥價？主任說沒有這回事耶。"]);
     else if(G.f.discount)l.push(["parent","早鳥價還算數吧？"]);return l;},
   choices:G=>{const n=enrolledT(G),c=[];
    if(n>=1)c.push({label:"拿報名表和收據",fx:{par:5,ret:1},set:{enrolled:n},log:`試聽生報名（${n} 期）`,res:[[null,"王媽媽填好報名表。試聽生在旁邊偷偷鬆了一口氣。"]]});
    if(n===0)c.push({label:"約下週再試聽一次",fx:{trial:10,par:3},set:{retry:1},log:"約試聽生下週再來",res:[["parent","好啊，下週二。"],[null,"你在行事曆上寫下：王，試聽第二次。"]]});
    c.push({label:"說名額快滿了",note:"推一把",fx:G=>G.h.trial>=55?{trial:5,par:-3}:{trial:-10,par:-5},set:{pushed:1},log:"跟家長說名額快滿",res:G=>G.h.trial>=55?[["parent","那……我們先報名吧。"]]:[["parent","（皺眉）我們不喜歡被催。"]]});
    return c;}},
  {id:"yclose",t:"21:50",target:{spot:"door"},goal:"關門前巡一圈",action:"準備關門",npc:{parent:null,parent2:null,bo:null,zhe:null,pinyu:null},
   pages:G=>[[null,"自習室最後一個學生在登記表上寫下 21:48。"],[null,`櫃台的待辦便利貼還有 ${Math.max(0,G.h.missed-G.h.cleared+2)} 張。`]],
   choices:G=>{const c=[
    {label:"把沒回的電話列好，明天第一件事",fx:{pat:-3,cleared:1},log:"整理明天要回的電話",res:[[null,"你把便利貼排成一排，貼在螢幕邊框上。"]]},
    {label:"關燈，下班",fx:{hp:5},log:"準時關門",res:[[null,"你關掉招牌燈。大廳只剩飲水機的小紅燈。"]]}];
    if(G.f.teacherNoBreak)c.push({label:"在許老師桌上留張紙條",note:"謝謝他下課還接電話",fx:{pat:5,par:2},log:"留紙條謝謝許老師",res:[[null,"「老師，今天下課還讓你接電話，辛苦了。明天幫你泡熱茶。—小芸」"]]});
    return c;}}
 ],
 ending(G){
  const s=G.s,h=G.h,dead=s.hp<=0||s.pat<=0,n=G.f.enrolled??(G.f.pushed&&h.trial>=60?Math.max(1,enrolledT(G)):0),un=Math.max(0,Math.round(h.missed-h.cleared+2));
  let t;
  if(dead)t=s.pat<=0?["今天到此為止","你在第五通抱怨電話之後，請主任接手櫃台，躲進休息室深呼吸。"]:["累到坐在地上","你蹲在影印機旁邊，覺得自己也卡紙了。"];
  else if(s.par>=70&&s.ord>=65)t=["櫃台的定海神針","電話有人接、點名有人管、家長有人顧。這間補習班少了你會亂掉。"];
  else if(s.par>=75)t=["家長最愛的班導","每個家長都記得你的名字。只是你的待辦便利貼也越來越長。"];
  else if(un>=5)t=["電話響不停","今天有太多電話沒有回。明天早上一進門，電話會先響。"];
  else if(s.pat<30)t=["大家的救火隊","整晚都在救火。火是撲滅了，你也快燒完了。"];
  else t=["平安關門","沒有大好也沒有大壞。櫃台的大部分晚上就是這樣過的。"];
  return {title:t[0],desc:t[1],dead,big:[[`${n}/2`,"試聽報名"],[`${un} 通`,"明天要回的電話"]]};
 }
};
