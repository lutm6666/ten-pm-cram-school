/* ================= 撿到的東西 ================= */
ITEMS.push(
 {id:"lozenge",phases:["break"],lines:["teacher","yun"],icon:"🍬",name:"喉糖",rarity:"常見",pos:[6.2,7.8],where:"講師休息室・桌上",
  desc:"一整盒的喉糖，盒子上寫著「大家的」。已經被吃掉一半了。",use:"含一顆，嗓子 +10。連上兩節課的人都知道它的價值。",fx:{voice:10},hint:"休息室裡大家共用的東西"},
 {id:"bento",phases:["pre"],icon:"🍱",name:"雞腿便當",rarity:"常見",pos:[1.6,6.7],where:"講師休息室・冰箱旁",
  desc:"還是溫的雞腿便當。蓋子上貼著便利貼：「小芸的，勿動」。",use:"吃掉的話體力 +10。如果你不是小芸，她會不會發現是另一回事。",fx:{hp:10},set:{ateBento:1},hint:"冰箱旁邊，有人的晚餐"},
 {id:"battery",phases:["break"],lines:["teacher","yun"],icon:"🔋",name:"備用電池",rarity:"少見",pos:[1.7,8.4],where:"講師休息室・置物櫃下",
  desc:"兩顆三號電池，用橡皮筋綁在一起。不知道是誰掉的。",use:"麥克風沒電的時候，可以直接換上，不用跑回櫃台。",set:{battery:1},hint:"置物櫃附近的小東西"},
 {id:"notebook",phases:["pre","class"],lines:["teacher","yun"],icon:"📒",name:"家長聯絡簿",rarity:"少見",pos:[6.6,12.4],where:"大廳・櫃台旁",
  desc:"小芸手寫的家長通話紀錄。林媽媽那一頁寫著：「先講好消息，再講分數」。",use:"之後跟林媽媽講電話時，家長多 +5。",set:{notebook:1},hint:"櫃台旁邊的手寫紀錄"},
 {id:"form",phases:["pre"],icon:"📝",name:"填一半的報名表",rarity:"常見",pos:[1.9,13.4],where:"大廳・沙發旁",
  desc:"試聽生的報名表，家長欄填了一半就停了。筆還夾在上面。",use:"主任最想要的東西。順手收好交給櫃台，試聽印象 +5。",fx:{trial:5,ret:2},hint:"沙發旁有人填到一半"},
 {id:"glasses",phases:["pre","class"],lines:["teacher","yun"],icon:"👓",name:"老花眼鏡",rarity:"少見",pos:[10.5,15.4],where:"走廊・靠大廳那頭",
  desc:"金色細框，鏡腳用透明膠帶纏過。整個補習班只有一個人會戴這種眼鏡。",use:"可以還給失主。",hint:"走廊上有人掉了東西"},
 {id:"earphone",phases:["class","break"],icon:"🎧",name:"一隻藍牙耳機",rarity:"常見",pos:[20.2,12.3],where:"自習室・桌子底下",
  desc:"只有右耳那一隻。外殼貼了一張很小的貼紙：「高一 C」。",use:"可以拿去問自習室的助教。",hint:"自習室桌子底下"},
 {id:"zhesheet",phases:["break","leave"],lines:["teacher","boss"],icon:"📄",name:"畫滿的計算紙",rarity:"少見",pos:[23.25,8.6],where:"B 班教室・最後一排走道",
  desc:"整張紙畫滿了遊戲角色。角落寫了一題向量內積，算到一半，方向是對的。",use:"下課跟阿哲聊的時候，可以提起它。",set:{zheSheet:1},hint:"教室後排走道上的紙"},
 {id:"chalk",phases:["leave","close"],icon:"🖍️",name:"一截粉筆",rarity:"稀有",pos:[26.6,1.1],where:"B 班教室・角落",
  desc:"這間教室早就換成白板了，角落卻還有一截白粉筆。",use:"沒有用處。聽說這裡以前是黑板，十年前的學生都在這裡考上大學。",hint:"不該出現在這間教室的東西"},
 {id:"oldlist",phases:["pre","class"],lines:["yun","boss"],icon:"📜",name:"榜單草稿",rarity:"少見",pos:[7.6,2.3],where:"主任室・櫃子旁",
  desc:"去年榜單的手寫草稿。有一個名字被劃掉，又在旁邊寫了回去。",use:"沒有用處。看完，你會想知道那個學生後來怎麼了。",hint:"主任室裡沒丟掉的紙"},
 {id:"redpen",phases:["class","break"],lines:["teacher"],icon:"🖊️",name:"沒水的紅筆",rarity:"常見",pos:[21.4,3.1],where:"B 班教室・講台邊",
  desc:"筆蓋被咬得坑坑巴巴。試了三次，只畫出一條很淡的線。",use:"沒有用處。每個老師的抽屜裡都有十支。",hint:"講台邊的文具"},
 {id:"postit",phases:["leave","close"],icon:"🗒️",name:"自習室的便利貼",rarity:"稀有",pos:[25.6,14.8],where:"自習室・最後一張桌子",
  desc:"貼在桌角，字很小：「如果我學測考到 12 級分，就跟她告白。」",use:"沒有用處。你把它貼回原位。",hint:"自習室角落有人留了話"}
 ,{id:"pineapple",phases:["break"],lines:["yun"],icon:"🎁",name:"家長送的鳳梨酥",rarity:"少見",pos:[2.6,12.5],where:"大廳・櫃台前",
  desc:"一盒六個，盒子上貼著：「謝謝小芸姐幫我們家小孩排課輔」。",use:"吃一個，耐心 +8。剩下的放在休息室給大家。",fx:{pat:8},hint:"下課時，有家長留了東西在櫃台"}
 ,{id:"hqletter",phases:["pre"],lines:["boss"],icon:"✉️",name:"總部的信封",rarity:"常見",pos:[6.2,1.5],where:"主任室・門邊",
  desc:"「各分校本季請控制支出。另，續班率未達 85% 之分校，下季將進行輔導。」",use:"沒有用處。但你知道「輔導」是什麼意思。",fx:{calm:-3},hint:"上課前，總部寄來的東西"}
 ,{id:"coupon",phases:["class"],lines:["yun","boss"],icon:"🎟️",name:"對面的折價券",rarity:"少見",pos:[3.2,16.6],where:"大廳・門口地上",
  desc:"對面補習班的折價券，學測衝刺班 8 折，期限只到月底。",use:"沒有用處。但你知道他們的折扣撐不了多久。",hint:"上課時，有人從門縫塞了東西"}
 ,{id:"thanks",phases:["leave","close"],lines:["teacher"],icon:"💌",name:"講台上的小卡",rarity:"稀有",pos:[21.0,3.2],where:"B 班教室・講台",
  desc:"沒有署名，字很工整：「老師，向量我懂了一點點了。謝謝。」",use:"體力 +6。下課後才會出現。",fx:{hp:6},hint:"下課後，講台上多了一樣東西"}
);
