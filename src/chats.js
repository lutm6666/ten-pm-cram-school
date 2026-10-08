/* ================= 閒聊：走到重要人物旁邊可以聊兩句 ================= */
/* 每段閒聊：ph 限定時段（pre/class/break/leave/close），only/not 限定職業線。
   每段一輪只聊一次；聊完了就只會點頭。第一次跟某人聊天，會有一點小小的影響。 */
const ME=G=>({teacher:"老師",yun:"小芸",boss:"主任"}[G.line.id]);
const CHATS={
 yun:[
  {ph:["pre"],p:G=>[["yun","影印機今天已經卡第三次了。我在想要不要幫它取個名字。"],["me","取什麼？"],["yun","「阿卡」。卡紙的卡。"]]},
  {ph:["class"],p:G=>[["yun","（小聲）上課的時候櫃台最安靜，可是電話最多。"],["yun","家長好像都算好老師在上課，才打來問進度。"]]},
  {ph:["break"],p:G=>[["yun","你看我螢幕邊邊。"],[null,"螢幕邊框貼滿了便利貼，有一張寫著：「記得吃晚餐」。字跡是她自己的。"],["yun","那張是提醒我自己的。今天還沒撕掉。"]]},
  {ph:["leave","close"],p:G=>[["yun","我妹說我們家的貓又把衛生紙抓爛了。"],["yun","每天回家第一件事，就是撿衛生紙屑。也算是一種下班儀式吧。"]]},
  {ph:["pre","class","break"],only:["boss"],p:G=>[["yun","主任，那個……新的影印機，總部有說什麼嗎？"],["me","還在問。"],["yun","喔。好。"],[null,"她低下頭繼續貼便利貼。"]]}
 ],
 boss:[
  {ph:["pre"],p:G=>[["boss","你知道我剛來這裡的時候，這層樓只有兩間教室嗎？"],["boss","那時候學生會在走廊吃泡麵，被房東罵。現在不准吃了，我反而有點懷念。"]]},
  {ph:["class"],p:G=>[["boss","（盯著螢幕）總部那個表，每一格都要填數字。"],["boss","可是沒有一格，是寫「學生今天有沒有笑」。"]]},
  {ph:["break"],p:G=>[["boss","對面又在發傳單了。八折。"],["boss","我年輕的時候也發過傳單。發到手都是油墨味。"]]},
  {ph:["leave","close"],p:G=>[["boss","辛苦了。"],[null,"主任停了一下，好像還想說什麼。"],["boss","……明天見。"]]}
 ],
 teacher:[
  {ph:["pre"],p:G=>[["teacher","今天上空間向量。每年教到這裡，就有一半的人開始放棄。"],["teacher","所以我都先畫一個房間的角落，跟他們說：你們就住在向量裡面。"]]},
  {ph:["break"],p:G=>[["teacher","（喝水）嗓子要撐到九點十五。"],["teacher","以前我老師說，補習班老師的職業病有三個：喉嚨、膝蓋、還有記不住自己小孩的作息。"]]},
  {ph:["class"],p:G=>[[null,"許老師正在黑板上畫一個立方體，用手勢示意你等一下。"],["teacher","（小聲）下課再聊，我現在在跟 z 軸搏鬥。"]]},
  {ph:["leave","close"],p:G=>[["teacher","今天阿哲有舉手。雖然答錯了。"],["teacher","但他舉手了。"]]}
 ],
 pinyu:[
  {ph:["pre","break"],p:G=>[["pinyu","（翻著單字本）……abandon、abandon、abandon。"],["pinyu","每次都從 A 開始背，所以我 A 開頭的單字最熟。"]]},
  {ph:["class"],p:G=>[["pinyu","（小聲）"+ME(G)+"，你覺得內積是什麼意思？"],["pinyu","我會算，可是不知道它在算什麼。"]]},
  {ph:["break","leave"],p:G=>[["pinyu","我昨天兩點才睡。"],["pinyu","我媽說，上次模考掉了兩級分，是因為我不夠努力。"],[null,"她說這句話的時候，一直在轉手上的筆。"]]},
  {ph:["leave","close"],p:G=>[["pinyu","我想念心理系。"],["pinyu","可是我還沒跟我媽說。"]]}
 ],
 zhe:[
  {ph:["pre","break"],p:G=>[[null,"阿哲的講義邊邊畫滿了東西：一隻貓、一台機車、一個很像許老師的人。"],["zhe","……不要跟老師說。"],[null,"畫得其實很像。"]]},
  {ph:["class"],p:G=>[[null,"阿哲趴在桌上，眼睛是睜開的。"],["zhe","我有在聽啦。只是聽不懂而已。"]]},
  {ph:["break","leave"],p:G=>[["zhe","我其實想念設計。"],["zhe","可是我媽說，數學不好連設計都考不上。"],[null,"他說完就戴上耳機。"]]},
  {ph:["leave","close"],p:G=>[["zhe","今天……還好。"],[null,"這是他今晚講最長的一句話。"]]}
 ],
 hong:[
  {ph:["pre","class"],p:G=>[["hong","自習室今天 23 個人。冷氣開 24 度，有人說冷，有人說熱。"],["hong","我覺得當助教最難的不是解題，是調冷氣。"]]},
  {ph:["break"],p:G=>[["hong","我下禮拜期中考，三科。"],["hong","我在這裡顧自習室，順便自己也念。感覺像是在陪考。"]]},
  {ph:["leave","close"],p:G=>[["hong","以前我也是在這裡補習的。坐自習室最後一排。"],["hong","那時候覺得助教好帥。現在才知道，助教只是很會找插座。"]]}
 ],
 bo:[
  {ph:["pre","class","break"],p:G=>[["bo","我每天七點就來了。"],["bo","家裡沒人，這裡有冷氣，還有人。"]]},
  {ph:["break","leave"],p:G=>[["bo","（拿出一包餅乾）要不要吃？"],["bo","我媽買一整箱，說晚餐不夠可以吃。"]]},
  {ph:["leave","close"],p:G=>[["bo",ME(G)+"，你也是一個人回家嗎？"],["me","對啊。"],["bo","喔。那我們一樣。"]]}
 ],
 parent:[
  {ph:["pre"],p:G=>[["parent","我們家那個，國中數學都還不錯。上高中才開始掉。"],["parent","我也不知道是哪裡出問題。我數學也不好，教不了他。"]]},
  {ph:["class","break"],p:G=>[["parent","（小聲）老師上課好像滿有條理的。"],["parent","不過對面也說他們老師很有條理。我是真的不知道怎麼選。"]]},
  {ph:["leave","close"],p:G=>[["parent","謝謝你們今天招待。"],["parent","我回去跟他爸討論一下。他爸比較……看價錢。"]]}
 ],
 chenba:[
  {ph:["pre","class","break","leave","close"],p:G=>[["chenba","我們家那個在自習室嗎？"],["chenba","他說在這裡念書比較專心。我是覺得，有人看著比較放心啦。"]]}
 ]
};
const CHAT_FX={yun:{teacher:{hp:1},yun:{},boss:{morale:2}},boss:{teacher:{par:1},yun:{pat:1},boss:{}},teacher:{teacher:{},yun:{ord:1},boss:{morale:2}},
  pinyu:{teacher:{stu:2},yun:{par:1},boss:{rep:1}},zhe:{teacher:{stu:2},yun:{par:1},boss:{rep:1}},hong:{teacher:{hp:1},yun:{ord:1},boss:{morale:1}},
  bo:{teacher:{stu:1},yun:{pat:1},boss:{rep:1}},parent:{teacher:{par:2},yun:{par:2},boss:{sales:2}},chenba:{teacher:{par:1},yun:{par:1},boss:{rep:1}}};
const CHAT_BUSY={yun:"小芸正在接電話，對你比了一個「等一下」的手勢。",boss:"主任盯著螢幕，對你點了點頭。",teacher:"許老師在改考卷，抬頭笑了一下。",pinyu:"品妤戴著耳機在背單字。",zhe:"阿哲趴在桌上。",hong:"阿宏在幫學生看題目。",bo:"小柏在寫作業，對你揮揮手。",parent:"王媽媽在講電話。",chenba:"陳爸爸在滑手機。"};
function chatFor(id){
  const list=CHATS[id]||[],ph=phaseOf(),L=G.line.id;G.chatUsed=G.chatUsed||[];
  const i=list.findIndex((c,k)=>!G.chatUsed.includes(id+":"+k)&&(!c.ph||c.ph.includes(ph))&&(!c.only||c.only.includes(L))&&(!c.not||!c.not.includes(L)));
  return i<0?null:{key:id+":"+i,c:list[i]};
}
function chatTargets(){
  if(!G)return[];const st=step(),main=st&&st.target&&st.target.npc,side=new Set(activeSides().map(s=>s.target&&s.target.npc).filter(Boolean));
  return Object.keys(CHATS).filter(id=>id!==G.line.id&&npcs[id]&&npcs[id].visible&&id!==main&&!side.has(id));
}
function openChat(id){
  const n=npcs[id],ch=chatFor(id);
  if(n&&player){n.rotation.y=Math.atan2(player.position.x-n.position.x,player.position.z-n.position.z);player.rotation.y=Math.atan2(n.position.x-player.position.x,n.position.z-player.position.z);}
  if(!ch){beep("blip");runDialog({pages:[[null,CHAT_BUSY[id]||"對方在忙。"]],onEnd:()=>{mode="walk";renderAll();}});return;}
  spend(1);G.chatUsed.push(ch.key);if(typeof emote==="function"&&n)try{emote(n,"💬");}catch(e){}
  const first=!(G.chatWith||(G.chatWith=[])).includes(id);if(first)G.chatWith.push(id);
  const seen=new Set(store.get("chats",[]));seen.add(ch.key);store.set("chats",[...seen]);
  runDialog({pages:ch.c.p(G),onEnd:()=>{let d="";if(first){const fx=(CHAT_FX[id]||{})[G.line.id];if(fx)d=applyFx(fx);renderHud();}mode="walk";renderAll();setTimeout(checkAch,50);
    if(d)showBanner("聊了兩句",`${CHARS[id].name}・`+d.replace(/<[^>]+>/g,""));}});
}
