/* ================= 支線 ================= */
SIDES.teacher=[
 {id:"kid",from:"copy",until:"hall",target:{npc:"parent2"},title:"早到的試聽生",
  pages:G=>[["parent2","老師……請問 B 班教室在哪裡？"],["parent2","我媽說數學老師都很兇。你們這裡的數學會很難嗎？"]],
  choices:G=>[
   {label:"陪他聊兩句",note:"花一點力氣",fx:{hp:-3,trial:8},log:"陪早到的試聽生聊天",res:[["me","會難，但難的地方我都會講兩次。"],["parent2","……喔。那還好。"],[null,"他笑了一下，往沙發那邊跑回去找媽媽。"]]},
   {label:"指個方向就好",fx:{trial:2},log:"幫試聽生指路",res:[["me","走廊走到底，左手邊。"],["parent2","謝謝老師。"]]}
  ]},
 {id:"glasses",from:"hall",until:"office",target:{npc:"boss"},title:"主任的眼鏡",action:"還眼鏡",avail:G=>G.items.includes("glasses")&&G.steps[G.idx].target.npc!=="boss",
  pages:G=>[["me","主任，這是你的眼鏡嗎？走廊撿到的。"],["boss","我找了一整個下午！難怪看什麼都霧霧的。"],["boss","等一下試聽家長那邊，我會多幫你說兩句。"]],
  fx:{trial:5},log:"把眼鏡還給主任"},
 {id:"earphone",from:"copy",until:"after",target:{npc:"hong"},title:"耳機的主人",action:"找阿宏",avail:G=>G.items.includes("earphone"),
  pages:G=>[["me","阿宏，自習室撿到一隻耳機，上面寫高一 C。"],["hong","喔，那是小柏的，他找好久了。謝謝老師。"],["hong","對了老師，你們班那個阿哲，其實常常來自習室。都坐最後面畫畫，但有時候會偷偷寫題目。"]],
  fx:{stu:3},set:{knowZhe:1},log:"把耳機交給助教，聽說阿哲的事"},
 {id:"hongHelp",from:"phone",until:"mic",target:{npc:"hong"},title:"自習室的求救",
  pages:G=>[["hong","老師！救命。有個高一的問我空間向量，我大三了，完全忘光……"],[null,"下課只剩幾分鐘。"]],
  choices:G=>[
   {label:"花三分鐘幫他講",note:"嗓子會再少一點",fx:{voice:-5,par:5,stu:2},log:"幫助教救援自習室",res:[[null,"你在白板角落畫了一個立方體，三分鐘講完。高一生「喔——」了一聲。"],["hong","老師你是神。"]]},
   {label:"叫他明天直接問你",fx:{},log:"請自習室學生明天再問",res:[["hong","好，我跟他說。"]]}
  ]},
 {id:"bentoTalk",from:"after",until:"office",target:{npc:"yun"},title:"消失的便當",avail:G=>G.f.ateBento,
  pages:G=>[["yun","老師……你有看到我冰箱裡的雞腿便當嗎？"],[null,"每一條路，都要有人付。"]],
  choices:G=>[
   {label:"承認，說明天請她吃",fx:{hp:-2},log:"承認吃了小芸的便當",res:[["yun","……老師你很誠實耶。那我要排骨飯加滷蛋。"]]},
   {label:"說可能是助教吃的",fx:{},set:{blamedHong:1},log:"把便當的事推給助教",res:[["yun","阿宏！！"],[null,"自習室傳來一聲很冤枉的「蛤？」"]]}
  ]}
];

SIDES.yun=[
 {id:"yglasses",from:"yparent",until:"yclose",target:{npc:"boss"},title:"主任的眼鏡",action:"還眼鏡",avail:G=>G.items.includes("glasses")&&G.steps[G.idx].target.npc!=="boss",
  pages:G=>[["me","主任，走廊撿到你的眼鏡。"],["boss","難怪我下午看報表都霧霧的！謝謝。"],["boss","對了，今天辛苦了。你的便當記得吃。"]],fx:{pat:5},log:"把眼鏡還給主任"},
 {id:"ybo",from:"ycopy",until:"yzhe",target:{npc:"bo"},title:"小柏的耳機",action:"找小柏",avail:G=>G.items.includes("earphone"),
  pages:G=>[["me","小柏，這是你的耳機嗎？"],["bo","我的耳機！我找一整天了。謝謝小芸姐！"],["bo","……那個，我每天九點都會溜去 7-11 買關東煮。不要跟我爸講喔。"]],fx:{ord:3},set:{knowBo:1},log:"還耳機給小柏，知道他九點會去 7-11"},
 {id:"ylozenge",from:"ymom",until:"yzhe",target:{npc:"teacher"},title:"許老師的嗓子",action:"拿喉糖給老師",avail:G=>G.items.includes("lozenge"),
  pages:G=>[["me","老師，喉糖。你剛剛聲音都啞了。"],["teacher","（沙啞）……你是天使。"]],fx:{pat:3,par:2},log:"拿喉糖給許老師"}
];
SIDES.boss=[
 {id:"bcopier",from:"bmorning",until:"bpitch",target:{spot:"copier"},title:"主任修影印機",action:"打開影印機",avail:G=>!G.f.newCopier,
  pages:G=>[[null,"影印機又在嗶嗶叫。小芸在接電話，騰不出手。"],[null,"你捲起西裝袖子。"]],
  choices:G=>[{label:"自己拉卡紙",mini:"jam",fx:r=>({morale:r.tears?3:8,calm:-3}),log:r=>r.tears?"親自修影印機（撕破幾張）":"親自修好影印機",res:r=>[["yun",r.tears?"主任……你的袖子都是碳粉。不過謝謝。":"主任你會修影印機？我第一次看到。"]]},
   {label:"算了，叫技師",fx:{sales:-2},log:"叫影印機技師",res:[["yun","技師說明天下午才能來。"]]}]},
 {id:"brank",from:"bpitch",until:"breport",target:{spot:"rank"},title:"褪色的榜單",action:"看榜單牆",
  pages:G=>[[null,"榜單牆上的紅紙已經褪成粉紅色。最上面那張是十年前的。"],[null,"你想起去年那個名字被劃掉又寫回去的學生。"]],
  choices:G=>[{label:"拆下舊榜單，換成學生寫的話",fx:{rep:6,sales:-2},set:{rankWords:1},log:"把榜單牆換成學生的話",res:[[null,"你請小芸明天去收學生的小卡：「這間補習班讓我記得的一件事」。"]]},
   {label:"留著，那是大家的回憶",fx:{calm:3},log:"留下舊榜單",res:[[null,"你把翹起來的角重新貼好。"]]}]},
 {id:"bzhe",from:"benroll",until:"breport",target:{npc:"zhe"},title:"自習室的阿哲",action:"找阿哲",avail:G=>G.f.noteZhe||G.f.baseClass,
  pages:G=>[[null,"阿哲一個人坐在自習室，在計算紙上畫畫。角落寫了一題，算到一半。"],["zhe","……主任。"],["me","這題方向是對的。"+(G.f.baseClass?"寒假的基礎班，你媽媽說你願意試試看？":"")],["zhe","嗯。……我想從頭來一次。"]],
  fx:{rep:3,ret:3},log:"在自習室跟阿哲聊"}
];
