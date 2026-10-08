/* ================= 職業線：補習班主任 ================= */
LINES.boss={
 id:"boss",role:"補習班主任",short:"主任",body:0x2f3a4a,
 pick:"顧業績、顧老師、顧總部的週報。數字不好看，第一個被問的人。",
 cast:["teacher","yun","hong","parent","mom","zhe"],
 stats:{calm:["冷靜",60],sales:["業績",50],rep:["口碑",50],morale:["士氣",50]},hidden:{trial:50,ret:72},
 late:{fx:{calm:-4,rep:-2},text:"大家等主任等到有點尷尬。"},
 coda:"週報上的數字是你的責任，數字後面的人也是。",
 msgs:[["17:38","總部","各分校週報請於明天中午前上傳。"],["18:52","粉專通知","對面補習班發布了新貼文：學測衝刺 8 折最後三天！"],["19:44","小芸","主任，等一下下課可以跟你講一件事嗎？"],["20:18","老婆","女兒說要等你回家才睡。"],["21:32","總部","續班率是不是有更新？"]],
 preStatus:"營業中",
 start:[3.5,3.9],dead:G=>G.s.calm<=0,
 me:G=>({name:"你",title:`${G.pName}・補習班主任`,abbr:"主",color:"#c2457f"}),
 npcs:{yun:P.yunDesk,teacher:P.teacherLounge,pinyu:P.pinyuSeat,zhe:P.zheSeat,hong:P.hongStudy,bo:PY.boStudy,parent:null,parent2:null,boss:null,chenba:null},
 steps:[
  {id:"bmorning",chapter:{t:"17:20",title:"開門前",sub:"總部的週報，明天中午要交。",status:"營業中",rush:["本期續班率 72%，總部的目標是 85%。","老師們在休息室等你。"]},
   t:"17:20",target:{npc:"teacher"},goal:"許老師在休息室找你",
   pages:G=>[["teacher","主任，影印機又卡紙了，麥克風電池也沒了。"],["teacher","這期真的不能換一台影印機嗎？小芸每天都在跟它打架。"],[null,"你想起總部上個月寄來的信：「各分校本季請控制支出」。"]],
   choices:G=>[
    {label:"撥預算換新影印機",fx:{sales:-10,morale:15},set:{newCopier:1},log:"撥預算換影印機",res:[["teacher","真的？我馬上跟小芸說。"],[null,"休息室裡有人小聲歡呼。總部那邊，你還要想怎麼寫。"]]},
    {label:"先買電池，影印機下期再說",fx:{sales:-2,morale:5},log:"先買電池，影印機延後",res:[["teacher","好吧，有電池就好。"]]},
    {label:"請大家再撐一下",fx:{morale:-10,calm:5},log:"請老師們再撐一下",res:[["teacher","……好。"],[null,"他拿起講義走了。休息室安靜了幾秒。"]]}
   ]},
  {id:"brenew",t:"17:50",target:{spot:"bossdesk"},goal:"回辦公室看續班名單",action:"看名單",
   pages:G=>[[null,"桌上是還沒[[續班]]的名單。總部要的數字是 85%，現在是 72%。"],[null,"上課前只有時間打三通電話。"]],
   choices:G=>[
    {label:"親自打電話",mini:"renew",fx:r=>({sales:r.v*2-4,calm:-5,ret:r.v>=7?7:r.v>=4?3:0}),log:r=>`親自打續班電話，效果 ${r.v>=7?"很好":r.v>=4?"還可以":"不太好"}`,
     res:r=>r.v>=7?[[null,"三通都打在點上。你在名單上打了兩個勾。"]]:r.v>=4?[[null,"有一通有用。剩下的，下週再說。"]]:[[null,"打了三通，好像都不是最需要打的那三個。"]]},
    {label:"交給小芸明天打",fx:{calm:5,morale:-5},log:"把續班電話交給小芸",res:[["yun","（從櫃台）……好喔，明天。"],[null,"她的待辦便利貼又多了一張。"]]}
   ]},
  {id:"bpitch",t:"18:10",target:{npc:"parent"},goal:"試聽家長在大廳",npc:{parent:PY.parentLobby,parent2:PY.parent2Lobby,teacher:P.teacherLounge},
   pages:G=>[["parent","主任您好，我姓王。我兒子高三，想來[[試聽]]。"],["parent","我想先知道，你們的老師有什麼特別的？"]],
   choices:G=>[
    {label:"指著榜單牆",note:"數字最有說服力",fx:{trial:8},log:"用榜單介紹補習班",res:[["me","去年三個[[頂標]]、十一個[[前標]]。都是許老師帶的。"],["parent","嗯。"],[null,"她看了榜單一眼，又看了一眼褪色的紅紙。"]]},
    {label:"帶她去看教室和自習室",note:"花點時間",fx:{calm:-5,trial:12,rep:3},log:"帶試聽家長參觀",res:[[null,"你帶她走過走廊、看了自習室。阿宏正在幫高一生講題。"],["parent","晚上還有助教在，這個不錯。"]]},
    {label:"直接給早鳥折扣",fx:{trial:15,sales:-8,rep:-3},set:{discount:1},log:"直接給試聽家長折扣",res:[["parent","這樣啊……那我們先聽聽看。"],[null,"櫃台的小芸抬頭看了你一眼。"]]}
   ]},
  {id:"bpatrol",chapter:{t:"18:30",title:"巡堂",sub:"上課鐘響了。",status:"上課中"},
   t:"18:40",target:{spot:"classdoor"},goal:"去 B 班前門巡堂",action:"從門窗看",npc:{teacher:PY.teacherBoard,parent:P.parentSeat,parent2:P.parent2Seat},
   pages:G=>[[null,"從前門的窗戶看進去：許老師在講空間向量，王媽媽在窗邊抄筆記。"],[null,"最後一排，阿哲趴在桌上睡著了。"]],
   choices:G=>[
    {label:"進去把阿哲叫起來",fx:{morale:-5,trial:3},log:"進教室叫醒阿哲",res:[[null,"全班看著你走到最後一排。許老師的課停了十秒。"],["teacher","（下課後）主任，下次讓我自己處理好嗎？"]]},
    {label:"記下來，下課跟許老師談",fx:{calm:3},set:{noteZhe:1},log:"記下阿哲的狀況",res:[[null,"你在筆記本上寫：阿哲，第一節就睡，媽媽這週打三通。"]]},
    {label:"拍一張上課照發粉專",note:"招生素材",fx:{sales:5,rep:-5},log:"拍上課照發粉專",res:[[null,"照片很好看。半小時後，家長群組有人問：「照片有拍到我小孩耶，有經過同意嗎？」"]]}
   ]},
  {id:"bflyer",t:"19:20",target:{spot:"door"},goal:"門口有人塞了東西",action:"撿起來看",
   pages:G=>[[null,"門縫塞進一張傳單：對面補習班，學測衝刺班，八折。"],[null,"傳單背面印著他們去年的榜單。比你們多一個頂標。"]],
   choices:G=>[
    {label:"我們也打八折",fx:{sales:-10,trial:5,rep:-5},set:{priceWar:1},log:"跟進對面打八折",res:[[null,"你請小芸做一張新海報。她問：「那之前原價報名的家長怎麼辦？」"]]},
    {label:"不理它",fx:{calm:5},log:"不理對面的傳單",res:[[null,"你把傳單折好，丟進回收桶。"]]},
    {label:"打給三個老生家長聊聊",note:"問問他們怎麼想",fx:{calm:-5,ret:3,rep:5},log:"打給老生家長了解想法",res:[[null,"一個家長說：「我們不在意便宜幾千塊，在意老師會不會記得我小孩的名字。」"]]}
   ]},
  {id:"bmom",chapter:{t:"19:50",title:"下課 10 分鐘",sub:"小芸拿著電話朝你揮手。",status:"下課"},
   t:"19:50",target:{npc:"yun"},goal:"小芸拿著電話找你",npc:{teacher:P.teacherLounge},
   pages:G=>[["yun","主任，林媽媽。她說要問[[退費]]。"],["mom","主任，阿哲說他不想補了。退費怎麼算？"],...(G.f.noteZhe?[[null,"你想起筆記本上那行字：第一節就睡。"]]:[])],
   choices:G=>{const c=[
    {label:"照規定試算退費",fx:{rep:5,sales:-5,ret:-2},log:"幫林媽媽試算退費",res:[["me","照規定，已上的堂數扣掉之後是這樣……"],["mom","好，我再跟他爸討論。"]]},
    {label:"請許老師跟她談",fx:{morale:-5,ret:1},log:"請許老師處理退費電話",res:[["teacher","（放下熱水）……好。"],[null,"他下課十分鐘都在講電話。"]]}];
    if(G.f.noteZhe||K.has("zheBasics"))c.unshift({label:"提議免費旁聽高一基礎班",note:G.f.noteZhe?"他可能是從前面就跟不上":ECHO+"：他從高一就跟不上",fx:{sales:-3,ret:4,rep:6},set:{baseClass:1},log:"讓阿哲免費旁聽基礎班",res:[["mom","基礎班？……其實他高一就跟不上了，我一直不敢講。"],["mom","好，讓他試試看。"]]});
    return c;}},
  {id:"byun",t:"19:58",target:{npc:"yun"},goal:"小芸好像有話要說",
   pages:G=>[["yun","主任……我下個月想辭職。"],["yun","電話、點名、印講義、追家長，全部都是我。我今天連便當都還沒吃。"],[null,"上課鐘還有兩分鐘響。"]],
   choices:G=>[
    ...(K.has("yunTired")?[{label:"說你早就注意到了，下個月起她不用再顧電話",note:ECHO,fx:{sales:-4,morale:15},set:{yunStay:1,hongPhones:1},log:"提早幫小芸減輕工作",res:[["yun","……主任你怎麼知道？"],[null,"她低頭笑了一下：「那我再做做看。」"]]}]:[]),
    {label:"幫她加薪",fx:{sales:-8,morale:10},set:{yunStay:1},log:"幫小芸加薪",res:[["yun","……真的嗎？那我再想想。"],[null,"她笑了一下，眼睛有點紅。"]]},
    {label:"把電話分一半給阿宏",fx:{morale:5},set:{hongPhones:1},log:"把櫃台電話分給助教",res:[["yun","阿宏會接電話嗎？……好啦，總比沒有好。"]]},
    {label:"說再撐一期就好",fx:{morale:-15,calm:3},set:{yunLeave:1},log:"請小芸再撐一期",res:[["yun","……好。"],[null,"她回到櫃台，把一張便利貼撕下來，揉成一團。"]]}
   ]},
  {id:"bhong",chapter:{t:"20:05",title:"第二節",sub:"自習室的阿宏在等你。",status:"上課中"},
   t:"20:30",target:{npc:"hong"},goal:"阿宏在自習室找你",npc:{teacher:PY.teacherBoard},
   pages:G=>[["hong","主任，我下個月期中考，可以少排幾天班嗎？"],...(G.f.hongPhones?[["hong","還有……小芸姐說以後電話要我接？"]]:[]),[null,"自習室有十幾個學生在等助教解題。"]],
   choices:G=>[
    {label:"准假，現在重排下個月班表",note:"自己來",mini:"roster",fx:r=>({morale:r.bad?-3:10,calm:r.bad?-5:2}),log:r=>r.bad?`重排班表，還有 ${r.bad} 個問題`:"排出完美的班表",
     res:r=>r.bad?[["hong","主任……週三我真的要考試。"],[null,"你只好再改一次。"]]:[["hong","主任你太神了！謝謝！"]]},
    {label:"准假，你自己找人代",fx:{morale:5,calm:-5},log:"准助教的假",res:[["hong","謝謝主任！"],[null,"你打開排班表，發現那幾天沒有人能代。"]]},
    {label:"准假，請他推薦學弟妹來",fx:{morale:8},log:"請助教推薦學弟妹",res:[["hong","沒問題，我們系上很多人想打工。"]]},
    {label:"不准，自習室不能沒人",fx:{morale:-10,calm:3},log:"不准助教的假",res:[["hong","……好。"],[null,"他轉身回去解題，背影有點垮。"]]}
   ]},
  {id:"bq",t:"20:50",target:{npc:"parent"},goal:"王媽媽走出教室講電話",npc:{parent:PY.parentLobby},
   pages:G=>[["parent","主任，我剛剛在裡面算了一下，一班 20 個人。"],["parent","老師真的顧得過來嗎？我兒子不太會主動問問題。"]],
   choices:G=>[
    {label:"說老師會個別批改小考",fx:{trial:5},log:"說明個別批改",res:[["parent","每個人的都會看？那還不錯。"]]},
    {label:"答應幫他排前排、小考另外批",note:"老師會多一點工作",fx:{trial:12,morale:-5},log:"承諾試聽生特別照顧",res:[["parent","那我就放心了。"],[null,"你想到等一下要怎麼跟許老師開口。"]]},
    {label:"說人多才有競爭力",fx:{trial:-5,calm:3},log:"說大班有競爭力",res:[["parent","……是喔。"]]}
   ]},
  {id:"benroll",chapter:{t:"21:15",title:"下課",sub:"王媽媽和兒子走到櫃台前。",status:"收拾中"},
   t:"21:20",target:{npc:"parent"},goal:"王媽媽要做決定了",npc:{parent:PY.parentLobby,parent2:PY.parent2Lobby,teacher:PY.teacherPodium,zhe:G=>G.f.baseClass||G.f.noteZhe?[16.2,12.6,0]:null},
   pages:G=>{const n=enrolledT(G);return [["parent",n===2?"我們決定報名了。另一位試聽的同學，聽說也要報。":n===1?"課是不錯，我們想報名。":"我們回去再討論看看。"],...(G.f.priceWar?[["parent","對了，門口那張八折的海報是今天的嗎？"]]:[])];},
   choices:G=>{const n=enrolledT(G),c=[];
    if(n>=1)c.push({label:"親自收報名表",fx:{sales:8*n,ret:1},set:{enrolled:n},log:`試聽生報名 ${n} 位`,res:[[null,"你在報名表上蓋了章。報表上的數字跳了一格。"]]});
    else c.push({label:"給她早鳥價，現在報名",fx:G=>G.h.trial>=40?{sales:3,rep:-3,trial:20}:{rep:-3},set:{lastDiscount:1},log:"最後用早鳥價留人",res:G=>G.h.trial>=40?[["parent","這樣的話……好吧，我們報。"]]:[["parent","不是價錢的問題。"]]});
    c.push({label:"請她回去跟孩子討論",fx:{rep:5,calm:3},log:"讓家長回去考慮",res:[["parent","謝謝主任不催我們。"]]});
    return c;}},
  {id:"breport",t:"21:40",target:{spot:"bossdesk"},goal:"回辦公室填總部週報",action:"打開週報",npc:{parent:null,parent2:null,zhe:null},
   pages:G=>[[null,`總部的週報表格開在螢幕上。[[續班率]]那一格，今天算下來是 ${Math.round(G.h.ret)}%。`],[null,"總部的目標是 85%。上一個沒達標的分校主任，下一季就被調走了。"]],
   choices:G=>[
    {label:"照實填",fx:{rep:5,calm:-8},log:`照實填續班率 ${Math.round(G.h.ret)}%`,res:[[null,"你按下送出。螢幕上跳出：「已送出」。就這樣。"]]},
    {label:"先填 85%，下週再補回來",fx:{calm:10,rep:-10},set:{lied:1},log:"週報先填 85%",res:[[null,"你按下送出。數字很好看。"],[null,"下週要補的，是 13 個百分點的學生。"]]},
    {label:"照實填，另外寫一段說明",note:"寫出你今晚看到的事",fx:{rep:10,calm:-12,morale:5},set:{explained:1},log:"照實填週報並附上說明",res:[[null,"你寫了半小時：影印機、小芸、阿哲、對面的傳單。"],[null,"最後一句是：「數字會回來的，但要先把人留住。」"]]}
   ]}
 ],
 ending(G){
  const s=G.s,h=G.h,dead=s.calm<=0,n=G.f.enrolled??(G.f.lastDiscount&&h.trial>=70?1:0),ret=Math.round(h.ret);
  let t;
  if(dead)t=["主任先下班了","你把週報關掉，跟小芸說今天先這樣，然後在車上坐了二十分鐘才發動。"];
  else if(G.f.lied)t=["數字很好看","週報上的 85% 很漂亮。下週，你要把這個數字變成真的。"];
  else if(s.morale>=70&&s.rep>=65)t=["大家想留下來的補習班","老師沒有走，櫃台沒有走，家長說你們會記得孩子的名字。"];
  else if(G.f.explained)t=["說實話的主任","總部會怎麼回，你不知道。但今晚你寫下的每一件事都是真的。"];
  else if(s.sales>=70)t=["業績第一","報名表收了，數字也好看。只是休息室最近比較安靜。"];
  else if(s.morale<30)t=["一個人撐著","數字還過得去，但你感覺得到，有人在偷偷看人力銀行。"];
  else t=["撐過一個晚上","主任的大部分晚上，就是在每一個『差一點』之間做選擇。"];
  return {title:t[0],desc:t[1],dead,big:[[`${ret}%`,"本期續班率"],[`${n}/2`,"試聽報名"]]};
 }
};
