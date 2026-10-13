/* ================= 支線：頭上有「？」的人（新格局） ================= */
const sideGlasses=(id,from,until,fx,extra)=>({id,from,until,target:{npc:"boss"},title:"主任的眼鏡",action:"還眼鏡",avail:G=>G.items.includes("glasses"),
  pages:G=>[["me","主任，這是你的眼鏡嗎？二樓走廊撿到的。"],["boss","我找了一整個下午！難怪看報表都霧霧的。"],...(extra||[])],fx,log:"把眼鏡還給主任"});
const sideBento=(id,from,until)=>({id,from,until,target:{npc:"yun"},title:"消失的便當",avail:G=>G.f.ateBento,
  pages:G=>[["yun","欸……你有看到我冰箱裡的雞腿便當嗎？"],[null,"每一條路，都要有人付。"]],
  choices:G=>[
   {label:"承認，說明天請她吃",fx:{hp:-2},log:"承認吃了小芸的便當",res:[["yun","……你很誠實耶。那我要排骨飯加滷蛋。"]]},
   {label:"說可能是阿宏吃的",fx:{},set:{blamedHong:1},log:"把便當的事推給阿宏",res:[["yun","阿宏！！"],[null,"三樓課輔室傳來一聲很冤枉的「蛤？」"]]}]});
const sideEarphone=(id,from,until,fx,me)=>({id,from,until,target:{npc:"hong"},title:"耳機的主人",action:"找阿宏",avail:G=>G.items.includes("earphone"),
  pages:G=>[["me","阿宏，課輔室撿到一隻耳機，上面貼著「8-柏」。"],["hong","喔，那是八年級小柏的，他找好久了。謝謝。"],["hong","他每天下課都溜去 7-11 吃關東煮，以為沒有人知道。"],["hong","還有九年級的阿哲，其實常常來課輔室。坐最後面畫機器人，但有時候會偷偷寫分數的題目。"]],
  fx,set:{knowBo:1,knowZhe:1},log:"把耳機交給阿宏，聽說小柏和阿哲的事"});

SIDES.teacher=[
 sideGlasses("glasses","t_arrive","t_boss",{par:3},[["boss","等一下試聽家長那邊，我會多幫你說兩句。"]]),
 sideEarphone("earphone","t_lesson1","t_after",{stu:3}),
 {id:"hongHelp",from:"t_break",until:"t_lesson2",target:{npc:"hong"},title:"課輔室的求救",
  pages:G=>[["hong","許老師！救命。八年級的問我乘法公式為什麼長這樣，我只會背，講不出來……"],[null,"下課只剩幾分鐘。"]],
  choices:G=>[
   {label:"花三分鐘畫給他看",note:"嗓子會再少一點",fx:{voice:-5,stu:2},log:"幫課輔救援八年級",res:[[null,"你在白板角落畫了一個正方形，切成四塊。八年級的「喔——」了一聲。"],["hong","老師你是神。"]]},
   {label:"叫他明天直接問你",fx:{},log:"請八年級明天再問",res:[["hong","好，我跟他說。"]]}]},
 sideBento("bentoTalk","t_after","t_boss")
];
SIDES.jh=[
 sideGlasses("glasses","j_arrive","j_close",{par:3},[["boss","鄭老師，段考的考卷印得還順嗎？影印機的事我在想辦法。"]]),
 sideEarphone("earphone","j_xiang","j_close",{stu:3}),
 {id:"zhedraw",from:"j_zhe",until:"j_out",target:{npc:"zhe"},title:"機器人計算紙",action:"拿給阿哲",avail:G=>G.items.includes("zhedraw"),
  pages:G=>[["me","這是你的嗎？角落那題，通分的方向是對的。"],["zhe","……你有看到那題喔。"],["zhe","機器人是我畫的。我想以後做這個。可是要念工科，數學要好。"]],
  fx:{stu:5},set:{zheDrawTalk:1},log:"跟阿哲聊他的機器人"},
 sideBento("bentoTalk","j_boss","j_close")
];
SIDES.care=[
 sideGlasses("glasses","c_open","c_close",{par:3},[["boss","二年級的冷氣我有在處理。小朋友熱不熱？"]]),
 {id:"shoe",from:"c_open",until:"c_pickup",target:{npc:"lin"},title:"小安的室內鞋",action:"拿給林老師",avail:G=>G.items.includes("shoe"),
  pages:G=>[["me","林老師，洗手台撿到一隻小鞋子，上面寫「1-小安」。"],["lin","是小安的！他早上哭著說鞋子被偷了，原來是自己脫在洗手台。"],["lin","謝謝。下午接人的時候，我們的隊伍你幫我看一下尾巴喔。"]],
  fx:{ord:3},log:"把室內鞋還給林老師"},
 {id:"sticker",from:"c_homework",until:"c_rush",target:{npc:"yu"},title:"恐龍貼紙",action:"拿貼紙給小宇",avail:G=>G.items.includes("sticker"),
  pages:G=>[["me","數習寫完、訂正完，這張給你。"],["yu","三角龍！我最喜歡三角龍！"],[null,"他把貼紙貼在聯絡簿封面上，又回去把最後一題看了一次。"]],
  fx:{pat:3,ord:2},log:"用恐龍貼紙鼓勵小宇"},
 {id:"crayon",from:"c_snack",until:"c_late",target:{npc:"mi"},title:"紅色蠟筆",action:"拿蠟筆給小米",avail:G=>G.items.includes("crayon"),
  pages:G=>[["me","你是不是在找紅色？"],["mi","……恐龍要有紅色的嘴巴。"],[null,"她把斷成兩截的蠟筆，一截給兔子，一截自己用。"]],
  fx:{par:3,pat:2},set:{miCrayon:1},log:"把紅色蠟筆還給小米"}
];
SIDES.yun=[
 sideGlasses("glasses","y_arrive","y_close",{pat:5},[["boss","今天辛苦了。你的晚餐記得吃。"]]),
 {id:"ybo",from:"y_trial",until:"y_bo",target:{npc:"hong"},title:"耳機的主人",action:"找阿宏",avail:G=>G.items.includes("earphone"),
  pages:G=>[["me","阿宏，課輔室撿到一隻耳機，上面貼著「8-柏」。"],["hong","小柏的。他每天下課都溜去 7-11 吃關東煮，九點也會。"],["hong","不要跟他爸講喔，雖然他爸應該也猜得到。"]],
  fx:{ord:3},set:{knowBo:1},log:"聽說小柏常去 7-11"},
 {id:"remote",from:"y_rush",until:"y_close",target:{npc:"hong"},title:"冷氣遙控器",action:"拿遙控器給阿宏",
  pages:G=>[[null,"便利貼上那張：「冷氣遙控器：阿宏要」。遙控器在櫃台抽屜，電池用膠帶黏著。"],["hong","小芸姐！課輔室冷氣一直設 28 度，國中生說快熱死了。謝謝謝謝。"]],
  fx:{ord:3,hp:-1},log:"把冷氣遙控器拿給阿宏"}
];
SIDES.boss=[
 sideEarphone("earphone","b_patrol","b_report",{morale:3}),
 {id:"amy",from:"b_staff",until:"b_complaint",target:{npc:"amy"},title:"美語教室的投影機",
  pages:G=>[["amy","主任～美語教室的投影機又被借去三樓了。我四點半的課要放繪本。"],[null,"三樓的投影機，是國中部借走的。"]],
  choices:G=>[
   {label:"「下個月採購單上，加一台。」",fx:{sales:-3,morale:6},set:{amyProj:1},log:"答應美語教室加一台投影機",res:[["amy","真的？那這個月……我先用手機投好了。"]]},
   {label:"「跟國中部排時間輪流用。」",fx:{calm:2,morale:-2},log:"請美語和國中輪流用投影機",res:[["amy","……好，我去排。"]]}]},
 {id:"brank",from:"b_trial",until:"b_report",target:{spot:"rank"},title:"褪色的榜單",action:"看榜單牆",
  pages:G=>[[null,"榜單牆上的紅紙已經褪成粉紅色。最上面那張是十年前的。"],[null,"旁邊還貼著一張安親班小朋友的畫：補習班的大門，門口站著很多大人。"]],
  choices:G=>[{label:"拆下舊榜單，換成學生寫的話",fx:{rep:6,sales:-2},set:{rankWords:1},log:"把榜單牆換成學生的話",res:[[null,"你請小芸明天去收小卡：「這間補習班讓我記得的一件事」。安親的小朋友可以用畫的。"]]},
   {label:"留著，那是大家的回憶",fx:{calm:3},log:"留下舊榜單",res:[[null,"你把翹起來的角重新貼好。"]]}]}
];
