/* ================= 職業線：數學老師 ================= */
const P={yunDesk:[3.75,10.3,0],bossOffice:[3.5,1.2,0],bossHall:[10.5,4.3,Math.PI],bossLobby:[6.5,13.2,Math.PI],pinyuHall:[11.2,5.3,Math.PI],
 pinyuSeat:[SEATS.pinyu[0],SEATS.pinyu[1],Math.PI],pinyuPodium:[18.6,3.1,Math.PI],zheSeat:[SEATS.zhe[0],SEATS.zhe[1],Math.PI],zheDoor:[13,9,Math.PI/2],
 parentSeat:[SEATS.parent[0],SEATS.parent[1],-Math.PI/2],parent2Seat:[SEATS.parent2[0],SEATS.parent2[1],-Math.PI/2],parentLobby:[5.2,15.3,Math.PI],
 hongStudy:[20,14.8,0],teacherPodium:[20,2.75,0],teacherLounge:[3.2,8,0]};

const PY={teacherLounge:[3.2,8,0],teacherBoard:[20,1.2,0],teacherPodium:[18.6,2.9,Math.PI],parentLobby:[5.2,15.3,Math.PI],parent2Lobby:[6.4,15.3,Math.PI],
 zheCounter:[5.2,12.5,Math.PI],boStudy:[19.9,12.6,0],boLobby:[4.5,16.2,Math.PI],chenLobby:[6.4,14.6,Math.PI]};

LINES.teacher={
 id:"teacher",role:"數學老師",short:"數學",body:0xf0f0f0,
 pick:"顧高三 B 班的數學課。上課出事，第一個被找的人。",
 rush:["影印機卡紙，講義還差 12 份。","試聽家長今天會坐在教室裡。而且每個人都在等你。"],
 stats:{hp:["體力",50],voice:["嗓子",60],stu:["學生",50],par:["家長",50]},hidden:{trial:50},
 late:{fx:{stu:-4,trial:-3},text:"台下已經開始聊天了，有人在看手錶。"},
 coda:"白板上的字明天就會被擦掉。但今天，有人聽懂了一題。",
 start:[4.5,16.6],
 me:G=>({name:"你",title:`${G.tName}・高三數學`,abbr:"師",color:"#b7791f"}),
 npcs:{yun:P.yunDesk,boss:P.bossOffice,pinyu:P.pinyuHall,zhe:P.zheSeat,parent:P.parentLobby,parent2:[6,14.8,Math.PI],hong:P.hongStudy,teacher:null},
 steps:[
  {id:"copy",chapter:{t:"17:20",title:"上課前",sub:"距離上課還有 70 分鐘。",status:"備課中"},
   t:"17:20",target:{npc:"yun"},goal:"到櫃台找小芸",
   pages:G=>[["yun","老師，影印機又卡紙了。今天的[[講義]]只印了 24 份，B 班有 36 個人。"],["yun","我剛剛拉了一下，有一張卡在裡面，我不敢再拉了。"],["me","剩下 12 份？"],[null,"離上課還有 70 分鐘。每一條路，都要有人付。"]],
   choices:G=>[
    {label:"自己打開影印機處理",note:"順著送紙方向拉",mini:"jam",set:{handout:1},
     fx:r=>({hp:-6-3*Math.min(4,r.tears)}),
     log:r=>r.tears?`自己修影印機，撕破 ${r.tears} 次`:"自己修好影印機",
     res:r=>r.tears?[[null,`紙拉出來了，但撕破了 ${r.tears} 次。碎紙卡在滾輪裡，你又花了十分鐘用鑷子夾。`],["yun","老師你手上全是碳粉……我去拿濕紙巾。"]]
                   :[[null,"四張紙都完整拉出來。你按下列印，剩下的 12 份講義嘩啦啦吐出來。"],["yun","老師你好會修喔。我上次撕破一張，等技師等了兩天。"]]},
    {label:"請小芸去對面超商印",note:"櫃台會沒人顧",fx:{par:-5},set:{handout:1,yunOut:1},log:"請小芸去超商印講義",
     res:[[null,"小芸抓了零錢包衝出去，回來時講義還是熱的。"],["yun","剛剛櫃台電話好像響了兩次……我回來的時候已經掛掉了。"]]},
    {label:"改用投影片，講義下次補",fx:{stu:-5},log:"講義下次補",
     res:[[null,"你把題目存進隨身碟。"],["yun","那我跟學生說講義下次發喔。……有 12 個人要抄題目耶。"]]}
   ]},
  {id:"hall",t:"17:50",target:{npc:"boss"},goal:"主任在走廊等你",npc:{boss:P.bossHall,pinyu:P.pinyuHall},
   pages:G=>[["boss",`${G.tName}，今天兩位[[試聽]]生，其中一位是附中的。`],["boss","家長很在意升學數字。上精彩一點，這一班的[[續班]]就靠你了。"],
     [null,"品妤站在主任後面，手上捏著[[模考]]成績單。數學從 12 [[級分]]掉到 9 級分。"],["pinyu","老師……我可以問你一下嗎？"]],
   choices:G=>[
    {label:"先跟品妤談",note:"請主任等一下",fx:{hp:-5,stu:10},set:{talkedPinyu:1},log:"上課前先陪品妤看成績",
     res:[["pinyu","[[空間向量]]那題我完全看不懂，後面就整個亂掉了……"],[null,"她講到一半眼眶紅了。你記下她錯的題號：第 14 題。"],["boss","（看了兩次手錶）那我先去招呼家長。"]]},
    {label:"先跟主任對流程",note:"試聽比較重要",fx:{trial:10,stu:-5},log:"先跟主任確認試聽流程",
     res:[["boss","資料在這。高二、附中、目標是[[前標]]。媽媽姓王，很會問問題。"],[null,"你轉頭時，品妤已經走回教室了。"]]},
    {label:"跟兩個人都說下課再談",fx:{stu:-3},set:{promisedPinyu:1},log:"把談話都延到下課",
     res:[["boss","好，下課來我辦公室。"],["pinyu","……好。"],[null,"她點了頭，但看起來沒有比較安心。"]]}
   ]},
  {id:"erase",chapter:{t:"18:30",title:"第一節",sub:"18:30–19:50",status:"上課中",rush:["36 個座位坐了 34 個。","表定要上空間向量，但模考成績昨天才發下去。"]},
   t:"18:30",target:{spot:"podium"},goal:"走上講台，開始上課",npc:{boss:P.bossOffice,pinyu:P.pinyuSeat,parent:P.parentSeat,parent2:P.parent2Seat},
   pages:G=>[[null,"白板上還留著上一堂高二英文的單字，寫得滿滿的。"],[null,"台下 34 個人在看你。王媽媽打開了筆記本。"]],
   choices:G=>[
    {label:"拿板擦，先把白板擦乾淨",note:"由上往下擦",mini:"erase",fx:r=>({hp:-2,trial:r.falls?1:5}),log:r=>r.falls?`擦白板，墨粉掉下去 ${r.falls} 次`:"俐落地擦乾淨白板",
     res:r=>r.falls?[[null,"白板擦了好一陣子，前排有人在笑你被墨粉弄髒的袖子。"]]:[[null,"三十秒，白板乾乾淨淨。王媽媽在筆記本上寫了一行字。"]]},
    {label:"直接寫在右下角的空白處",fx:{stu:-3,trial:-3},log:"在白板角落上課",res:[[null,"你的字擠在 vocabulary 和 Quiz 週五 中間。後排有人瞇起眼睛。"]]}
   ]},
  {id:"lesson1",auto:true,
   t:"18:35",target:{spot:"podium"},goal:"開始上課",
   pages:G=>{const l=[[null,"最後一排的阿哲已經趴下了。教室窗邊坐著王媽媽和她兒子，王媽媽拿著筆記本。"]];
     if(!G.f.handout)l.push([null,"前排有人小聲問：今天沒有講義喔？"]);
     l.push([null,"今天表定要上[[空間向量]]，但模考成績昨天才剛發下去。台下一半的人在偷看成績單。"]);return l;},
   choices:G=>{const c=[
    {label:"照進度上空間向量",fx:{voice:-10,trial:10,stu:-5},log:"照進度上新單元",res:[[null,"你講得很順，王媽媽一直在抄。台下卻有一半的人還在看模考成績單。"]]},
    {label:"先用五題暖身，再上新單元",note:"限時搶答",mini:"quiz",fx:r=>({voice:-8,stu:r.right>=4?12:r.right>=2?5:-2,trial:r.right>=4?10:3}),log:r=>`暖身五題，台下答對 ${r.right} 題`,
     res:r=>r.right>=4?[[null,"台下搶答搶到拍桌子。連最後一排都有人舉手。"],["parent","（對兒子小聲）這個老師好有活力。"]]:[[null,"答對的題目不多，但至少大家醒了。你順勢帶進空間向量。"]]},
    {label:"整節課檢討模考",fx:{voice:-15,stu:10,trial:-5},log:"整節課檢討模考",res:[[null,"大家終於把錯的題目搞懂了。"],["parent","（小聲）今天不是要上新單元嗎？"]]}];
    if(G.f.talkedPinyu)c.push({label:"用第 14 題當例題，帶進空間向量",note:"品妤錯的那一題",fx:{voice:-10,stu:15,trial:10},set:{used14:1},log:"用模考第 14 題接新單元",
      res:[[null,"第 14 題正好是空間向量的入門題。你從錯誤的解法開始講，台下好幾個人「啊」了一聲。"],[null,"品妤抬起頭。王媽媽在筆記本上畫了一顆星。"]]});
    else c.push({label:"挑錯最多的三題講，剩下時間上新進度",fx:{voice:-15,stu:5,trial:5},log:"模考和新進度各講一半",res:[[null,"兩邊都顧到了，但都只講了一半。你的嗓子開始乾了。"]]});
    return c;}},
  {id:"zhe",t:"19:10",target:{npc:"zhe"},goal:"最後一排傳出遊戲音效",
   pages:G=>[[null,"最後一排傳出遊戲音效。阿哲的手機沒關聲音。"],[null,"全班轉過頭去。王媽媽也轉過頭去。"]],
   choices:G=>[
    {label:"叫阿哲上台解剛剛那題",fx:{stu:-5},set:{shamedZhe:1},log:"點阿哲上台解題",res:[[null,"阿哲拖著腳走上台，盯著白板一分鐘，寫了一個 x 就停住。有人笑出來。"],[null,"他走回座位時，把手機用力塞進書包。"]]},
    {label:"敲敲他的桌子，繼續講課",note:"不停下來",fx:{hp:-3,trial:5},set:{nudgedZhe:1},log:"不停課，提醒阿哲",res:[[null,"你邊講邊敲了兩下他的桌面。阿哲把手機收進抽屜。"],[null,"王媽媽看見你沒有中斷課程。"]]},
    {label:"停下來講五分鐘學測倒數",fx:{voice:-10,stu:-5,trial:-5},log:"停課精神喊話",res:[[null,"你講到「[[學測]]倒數 101 天」時，前排的人點頭，後排沒有人抬頭。"],[null,"阿哲把音量關掉，繼續滑。"]]}
   ]},
  {id:"phone",chapter:{t:"19:50",title:"下課 10 分鐘",sub:"櫃台電話又響了。",status:"下課"},
   t:"19:50",target:{npc:"yun"},goal:"小芸在櫃台叫你",
   pages:G=>{const l=[];if(G.f.ateBento)l.push(["yun","（小聲）……我的便當怎麼不見了。"]);l.push(["yun","老師，阿哲媽媽，今天第三次打來了。"]);if(G.f.yunOut)l.push(["yun","剛剛我去印講義的時候，她打的就是那兩通。"]);
     l.push(["mom","老師，他模考數學 3 級分。我們繳了一整年的錢……"]);
     if(G.f.shamedZhe)l.push(["mom","他剛剛傳訊息給我，說今天上課很丟臉。"]);
     l.push(["mom","下禮拜可以幫他一對一嗎？"]);return l;},
   choices:G=>[
    {label:"現在接，好好跟她說",note:"用掉整個下課",mini:"calm",fx:r=>({hp:-10,voice:-5,par:(r.anger<=20?12:r.anger<=45?6:-6)+(G.f.notebook||K.has("momNotes")?5:0)}),set:{called:1},log:r=>`下課時間安撫林媽媽（怒氣 ${r.anger}）`,res:r=>[[null,G.f.notebook||K.has("momNotes")?"你照聯絡簿上寫的，先講阿哲今天哪一題寫對了。":r.anger<=45?"你跟她說阿哲底子不差，是基本題不熟。林媽媽的語氣緩下來了。":"電話講到最後，林媽媽還是很生氣。"],[null,"下課鐘響。你一口水都沒喝到。"]]},
    {label:"請小芸說下課後回電",note:"先喝水",fx:{hp:5,voice:5,par:-5},set:{callback:1},log:"電話延到下課後回",res:[[null,"你灌了一大杯溫水，在講師休息室坐了五分鐘。"],["yun","（小聲）她聽起來不太高興喔。"]]},
    {label:"直接答應免費一對一",fx:{hp:-5,par:15},set:{freeTutor:1},log:"答應免費一對一",res:[["mom","謝謝老師！謝謝老師！謝謝老師！"],[null,"你掛掉電話才想起來，主任說過一對一要另外收費。"]]}
   ]},
  {id:"mic",chapter:{t:"20:00",title:"第二節",sub:"20:00–21:10",status:"上課中"},
   t:"20:00",target:{spot:"podium"},goal:"回講台上第二節",
   pages:G=>[[null,"你剛拿起麥克風，它「嗶」了一聲。沒電了。"],[null,"備用電池在櫃台抽屜。教室在走廊另一頭。"]],
   choices:G=>[
    ...(G.f.battery?[{label:"換上撿到的備用電池",note:"休息室撿到的那兩顆",fx:{trial:3},log:"換上撿到的備用電池",res:[[null,"你從口袋掏出那兩顆用橡皮筋綁著的電池。十秒鐘，麥克風又亮了。"],["parent","（點頭）準備得真周到。"]]}]:[]),
    {label:"不用麥克風，直接講",fx:{voice:-25},log:"不用麥克風硬撐",res:[[null,"最後一排的人聽得到了，但每講一句，喉嚨就刮一下。"]]},
    {label:"回櫃台拿電池",fx:{hp:-3,trial:-5,stu:-3},log:"回櫃台拿電池",res:[[null,"來回花了五分鐘。你回到教室時，裡面已經吵成一片。"]]},
    {label:"發小考卷，讓大家先寫",note:"順便批改",mini:"grade",fx:r=>({voice:5,stu:r.hits>=2?8:2,trial:r.hits>=2?5:-3}),log:r=>`發小考，批改抓對 ${r.hits}/3`,
     res:r=>r.hits>=2?[[null,"你一邊巡堂一邊批，錯在哪一行都圈出來。學生拿回考卷時安靜地看了很久。"],["parent","（低聲對兒子）你看，他會告訴你錯在哪。"]]
                     :[[null,"你批得有點急，圈錯了地方。阿哲舉手問：老師，我這行哪裡錯？"],[null,"你只好重講一次。"]]}
   ]},
  {id:"ask",t:"20:40",target:{npc:"parent"},goal:"王媽媽在窗邊舉手",
   pages:G=>[["parent","老師，請問你們跟對面那間比，差在哪裡？"],[null,"全班突然安靜下來。"]],
   choices:G=>[
    {label:"講去年的榜單數字",fx:{trial:10,par:5,stu:-5},log:"用榜單回答試聽家長",res:[["me","去年三個[[頂標]]、十一個[[前標]]。"],[null,"王媽媽點點頭。台下有人小聲說：又來了。"]]},
    {label:"說適不適合要看孩子",note:"請他再試聽一堂",fx:{trial:5,par:5,stu:5},log:"請試聽生再來一堂",res:[["me","適不適合，要看孩子自己聽不聽得懂。下禮拜再來一堂，讓他自己決定。"],[null,"前排幾個學生互看了一眼，好像有點意外你沒有趁機推銷。"]]},
    {label:"開玩笑說對面的老師沒有我帥",fx:G=>G.h.trial>=60?{trial:10,stu:10}:{trial:-10,stu:5},log:"用玩笑帶過",
     res:G=>G.h.trial>=60?[[null,"全班笑翻了，王媽媽也笑了。氣氛熱起來，接下來二十分鐘大家都很專心。"]]:[[null,"學生笑了，王媽媽沒有笑。她把筆記本闔起來。"]]}
   ]},
  {id:"after",chapter:{t:"21:10",title:"下課",sub:"大部分的人很快就走光了。",status:"收拾中"},
   t:"21:10",target:{spot:"podium"},goal:"回講台收東西",npc:{pinyu:P.pinyuPodium,parent:P.parentLobby,parent2:null,zhe:G=>G.f.shamedZhe?null:[23.2,10,Math.PI/2]},
   pages:G=>{const l=[];
     l.push(!G.f.talkedPinyu||G.f.promisedPinyu?[null,"品妤抱著成績單站在講台邊。"]:["pinyu","老師，謝謝你剛剛用我那題……我還有一題想問。"]);
     if(G.f.nudgedZhe)l.push([null,"阿哲收書包收得很慢，好像想說什麼。"]);
     if(G.f.shamedZhe)l.push([null,"阿哲第一個走出教室，沒有回頭。"]);
     if(G.f.callback)l.push(["yun","（從走廊探頭）老師，林媽媽還在等你回電。"]);
     l.push([null,"你只剩下一點力氣，大概只能再處理一件事。"]);return l;},
   choices:G=>{const c=[{label:"留下來陪品妤看題目",fx:{hp:-10,voice:-5,stu:10},set:{stayedPinyu:1},log:"下課陪品妤看題目",
       res:[[null,"你們把第 14 題重做一次，又做了兩題類題。第三題她自己做出來了。"],["pinyu","下次模考，我想先寫向量。"]]}];
     if(G.f.nudgedZhe)c.push({label:"走過去跟阿哲聊兩句",fx:G=>({hp:-5,stu:G.f.zheSheet||G.f.knowZhe?15:10,par:5}),set:{zheOpen:1},log:"下課找阿哲聊",
       res:G=>[...(G.f.zheSheet?[["me","這張是你的吧？角落這題你算到一半，方向是對的。"],[null,"阿哲愣了一下，把紙接過去。"]]:G.f.knowZhe?[["me","聽阿宏說，你常在自習室偷偷寫題目？"],[null,"阿哲耳朵紅了。"]]:[]),["zhe","我不是不想念。我從高一就聽不懂了，現在上課像在聽外語。"],[null,"你跟他約好，下週提早半小時來。"]]});
     if(G.f.callback)c.push({label:"先回電給林媽媽",fx:{voice:-5,par:10},set:{called:1},log:"下課後回電林媽媽",
       res:[["mom","老師，我等一個多小時了。"],[null,"你跟她講了阿哲哪些題目可以先救。她說會叫阿哲早點來。"]]});
     if(!G.f.nudgedZhe&&!G.f.shamedZhe&&K.has("zheBasics"))c.push({label:"去跟阿哲說，可以從高一的基礎補起",note:ECHO+"：他從高一就跟不上",fx:{hp:-5,stu:12,par:5},set:{zheOpen:1},log:"主動找阿哲談基礎",
       res:[["zhe","……你怎麼知道？"],["me","猜的。很多人都是卡在那裡。"],[null,"阿哲沉默了一下，說他下週會提早來。"]]});
     c.push({label:"請小芸幫大家排課輔",note:"今天先到這裡",fx:{hp:5,stu:-5},log:"把問題交給課輔",res:[[null,"小芸在白板旁邊貼了一張[[課輔]]登記表。品妤看了一眼，寫了名字。"]]});
     return c;}},
  {id:"office",t:"21:40",target:{npc:"boss"},goal:"去主任室",npc:{pinyu:null,zhe:null,parent:null},
   pages:G=>{const n=enrolledT(G);G.f.enrolled=n;const l=[["boss",n===2?"兩位試聽生都報名了！王媽媽說你上課很有條理。":n===1?"一位報名了。王媽媽說要回去考慮看看。":"兩位都說要再考慮。"]];
     if(!n)l.push([null,"主任沒有多說什麼，只是在本子上寫了幾個字。"]);
     if(G.f.freeTutor)l.push(["boss","還有，你答應林媽媽免費一對一？這個我們要談一下。"]);return l;},
   choices:G=>{const c=[];
     if(G.f.zheOpen)c.push({label:"跟主任說阿哲需要從高一補起",fx:{stu:5,par:5},log:"幫阿哲爭取基礎班",res:[["boss","寒假有一個高一數學的複習班。讓他免費旁聽吧。"]]});
     if(G.f.freeTutor)c.push({label:"承認自己沒先確認",note:"下次會先問",fx:{},log:"跟主任承認一對一的事",res:[["boss","（嘆氣）這次就算了。免費一對一只能一次。"]]});
     c.push({label:"報告今天的狀況，然後下班",fx:{hp:5},log:"報告完下班",res:[["boss","辛苦了，早點回去。"],[null,"你把白板擦乾淨，關掉教室的燈。"]]});
     return c;}}
 ],
 ending(G){
  const s=G.s,dead=s.voice<=0||s.hp<=0,n=dead?0:enrolledT(G),ret=Math.max(10,Math.min(98,Math.round(45+(s.stu-50)*.8+(s.par-50)*.5)));
  let t;
  if(dead&&s.hp<=0)t=["累倒在講台","你撐著講台把最後一題講完，然後在講師休息室睡著了。小芸幫你關了燈。"];
  else if(dead)t=["失聲下班","第二節還沒上完，你的聲音就沒了。小芸幫你發了講義，你在白板上寫：老師今天失聲。"];
  else if(n===2&&s.stu>=70)t=["主任口中的王牌","試聽生全部報名，班上的學生也被你照顧到了。主任在群組裡貼了一個大拇指。"];
  else if(s.stu>=75)t=["學生會記得的老師","試聽數字不一定最好看，但今天有學生是帶著答案回家的。"];
  else if(n===2)t=["試聽收割機","兩位試聽生都報名了。班上的學生有點被晾在一旁，下一期續不續班還不好說。"];
  else if(s.par>=70)t=["家長群組的好評","家長那邊安撫得很好。只是電話講得再好，學生的級分也不會自己上去。"];
  else if(s.stu<40&&s.par<40)t=["很長的一個晚上","今晚好像每件事都差一點。明天還有課，先回家睡覺吧。"];
  else t=["平安下課","沒有大好也沒有大壞。補習班的大部分晚上就是這樣過的。"];
  return {title:t[0],desc:t[1],dead,big:[[`${n}/2`,"試聽生報名"],[dead?"—":ret+"%","預估續班率"]]};
 }
};
function enrolledT(G){return G.h.trial>=70?2:G.h.trial>=45?1:0;}
