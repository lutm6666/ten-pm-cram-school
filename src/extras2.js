/* ================= 安親班、國中部的支線與撿到的東西 ================= */
ITEMS.push(
 {id:"umbrella",phases:["pre"],lines:["care"],icon:"☂️",name:"沒人認領的雨傘",rarity:"常見",pos:[7.4,16.2],where:"大廳・門口旁",
  desc:"一把淡藍色的折疊傘，傘柄上貼著小小的名字貼紙：「張」。",use:"剛剛來詢問的家長好像姓張。",set:{umbrella:1},hint:"門口旁邊有人忘了東西"},
 {id:"sticker",phases:["pre","class"],lines:["care"],icon:"⭐",name:"獎勵貼紙",rarity:"常見",pos:[6.4,8.4],where:"講師休息室・門口",
  desc:"一整張閃亮的星星貼紙。安親班的通用貨幣。",use:"送給好好寫完作業的小朋友。",set:{stickers:1},hint:"休息室門口，閃亮亮的東西"},
 {id:"buscard",phases:["class"],lines:["care"],icon:"💳",name:"粉紅色的悠遊卡",rarity:"少見",pos:[2.7,15.3],where:"大廳・沙發旁",
  desc:"學生悠遊卡，卡套上畫了一隻貓。背面用鉛筆寫著「李」。",use:"李……安安姓李嗎？",set:{buscard:1},hint:"沙發旁，小朋友掉的東西"},
 {id:"midrawing",phases:["break","class"],lines:["care"],icon:"🖍️",name:"一張恐龍畫",rarity:"少見",pos:[10.6,9.8],where:"走廊・教室門口",
  desc:"蠟筆畫的恐龍。仔細看，真的有點像雞。右下角寫著「小米」。",use:"點心時間如果有人在哭，這張畫也許用得上。",set:{midrawing:1},hint:"走廊上掉了一張畫"},
 {id:"vocabcards",phases:["pre"],lines:["jh"],icon:"🗂️",name:"一疊單字卡",rarity:"常見",pos:[29.4,13.4],where:"國中部置物區",
  desc:"用橡皮筋綁起來的手寫單字卡，第一張是 environment。背面寫著：「翔」。",use:"上面的字有一半拼錯了。",set:{vocabcards:1},hint:"國中部的置物區，有人掉了東西"},
 {id:"remote",phases:["pre"],lines:["jh"],icon:"📟",name:"投影機遙控器",rarity:"少見",pos:[10.4,4.6],where:"走廊・B 班門口",
  desc:"貼著「B 班」標籤的投影機遙控器。電池蓋不見了，用膠帶黏著。",use:"許老師等一下大概會找它。",set:{remote:1},hint:"走廊上，B 班門口"},
 {id:"speech",phases:["class","break"],lines:["jh"],icon:"📄",name:"折起來的講稿",rarity:"稀有",pos:[30.2,9.6],where:"國中 C 班・後門邊",
  desc:"一張折成四折的紙，標題是「我最想改變的一件事」。字很工整。",use:"這應該是子晴的。",set:{speechdraft:1},hint:"C 班後門邊的一張紙"},
 {id:"milktea",phases:["class"],lines:["jh"],icon:"🧋",name:"半糖去冰的手搖",rarity:"常見",pos:[33,12.6],where:"國中部置物區",
  desc:"杯子上用麥克筆寫著「Amy 老師」。應該是學生請的。",use:"喝一口，嗓子 +8。反正寫的是國中部英文老師。",fx:{voice:8},hint:"置物區有一杯飲料"}
);
SIDES.care=[
 {id:"umbrellaBack",from:"c_inquiry",until:"c_book",target:{spot:"counter"},title:"張媽媽的雨傘",action:"打電話給張媽媽",avail:G=>G.items.includes("umbrella"),
  pages:G=>[["me","張媽媽您好，您的雨傘忘在我們這邊了。"],[null,"「啊！我找了一下午！那我下週一來試讀的時候拿！」"]],fx:{par:4},set:{umbrellaBack:1},log:"打電話給張媽媽拿傘"},
 {id:"stickerYu",from:"c_homework",until:"c_parents",target:{npc:"yu"},title:"一顆星星",action:"給小宇貼紙",avail:G=>G.items.includes("sticker"),
  pages:G=>[["me","小宇，數學訂正完了，這個給你。"],["yu","星星！我要貼在額頭！"],[null,"接下來二十分鐘，他安靜地寫完了國語。"]],fx:{pat:4,ord:3},log:"給小宇獎勵貼紙"},
 {id:"buscardAnan",from:"c_book",until:"c_parents",target:{npc:"anan"},title:"粉紅色的悠遊卡",action:"問安安",avail:G=>G.items.includes("buscard"),
  pages:G=>[["me","安安，這是你的嗎？"],["anan","……是我的！我以為掉在學校了。"],["anan","阿嬤說掉了要扣零用錢。"],[null,"她把卡片收進書包最裡面的夾層，拉鍊拉了兩次。"]],fx:{par:3,pat:2},log:"把悠遊卡還給安安"},
 {id:"miDrawing",from:"c_snack",until:"c_late",target:{npc:"mi"},title:"像雞的恐龍",action:"拿畫給小米",avail:G=>G.items.includes("midrawing"),
  pages:G=>[["me","小米，這是你畫的嗎？好兇的恐龍。"],["mi","……老師也覺得是恐龍？"],["me","當然是恐龍。"],["mi","老師說像雞。"],[null,"她破涕為笑，把畫拿回去，又在旁邊多畫了一隻。"]],fx:{pat:4},set:{miCalm:1},log:"稱讚小米的恐龍畫"}
];
SIDES.jh=[
 {id:"cardsXiang",from:"j_xiang",until:"j_after",target:{npc:"xiang"},title:"拼錯一半的單字卡",action:"還單字卡",avail:G=>G.items.includes("vocabcards"),
  pages:G=>[["me","阿翔，這是你的嗎？"],["xiang","……蛤，你看到了喔。"],["me","environment 少了一個 n。其他寫得不錯。"],["xiang","（小聲）我會改啦。"]],fx:{stu:6},set:{cards:1},log:"幫阿翔訂正單字卡"},
 {id:"remoteBack",from:"j_room",until:"j_boss",target:{npc:"teacher"},title:"B 班的遙控器",action:"還遙控器",avail:G=>G.items.includes("remote"),
  pages:G=>[["me","許老師，這是 B 班的遙控器嗎？在走廊撿到的。"],["teacher","我找了二十分鐘！謝謝謝謝。"],["teacher","……投影機的事，不好意思啊。下次你們先用。"]],fx:{par:3},set:{remoteBack:1},log:"把遙控器還給許老師"},
 {id:"speechQing",from:"j_class",until:"j_after",target:{npc:"qing"},title:"折起來的講稿",action:"還講稿",avail:G=>G.items.includes("speech"),
  pages:G=>[["me","子晴，這是你的嗎？"],["qing","！……你有看嗎？"],["me","看了第一句。寫得很好。"],[null,"她的耳朵紅了。把講稿攤開，又折回去，這次折得很整齊。"]],fx:{stu:6},set:{readSpeech:1},log:"把講稿還給子晴"}
];
