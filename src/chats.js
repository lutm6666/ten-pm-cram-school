/* ================= 閒聊：跟重要人物多聊幾句 ================= */
/* 每個人有一組問題。回答可以依時段不同：pre 上課前、class 上課中、break 下課、after 放學後；_ 是不分時段的。
   玩家可以點問題，也可以自己打字，用關鍵字找最接近的一題。 */
const ME=G=>({teacher:"老師",yun:"小芸",boss:"主任"}[G.line.id]);
const PERIOD={pre:"上課前",class:"上課中",break:"下課",leave:"放學後",close:"放學後"};
const periodKey=()=>{const p=phaseOf();return p==="leave"||p==="close"?"after":p;};
const Q=(q,keys,a,set)=>({q,keys,a,set});
const CHATS={
 yun:{hi:{pre:"欸，你找我？我手上還有三件事，你先說。",class:"（小聲）上課中，櫃台電話最多。怎麼了？",break:"下課了！終於可以喝口水。要聊什麼？",after:"今天辛苦了……你也還沒走喔？"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{care:"剛到，先把晚上的講義印一印。下午辛苦了！小朋友今天乖嗎？",pre:"印講義、回電話、排試聽座位。影印機今天已經卡第三次了。",class:"接家長電話。他們好像都算好老師在上課，才打來問進度。",break:"把點名表輸入電腦。還有把便利貼上的事一件一件劃掉。",after:"關冷氣、收登記表、把沒回的電話寫成明天的便利貼。"}),
   Q("櫃台今天狀況怎麼樣？",["櫃台","狀況","今天","怎樣"],{_:"電話一直響，影印機一直卡，家長一直來。跟平常一樣，只是今天三件事同時發生。"}),
   Q("接下來會發生什麼事？",["接下來","等一下","之後","下一"],{care:"六點家長會來接小朋友，六點半高三就上課了。中間那半小時最亂。",pre:"六點半上課，試聽家長大概六點十分會到。主任說要我先招待。","boss.pre":"六點半上課，試聽家長大概六點十分會到。你不是說要我先招待嗎？",class:"七點五十下課。下課十五分鐘，自習室的學生會全部衝來問問題。",break:"八點零五上第二節。然後九點多，家長會開始來接人。",after:"十點關門。如果沒有人忘記帶東西回來拿的話。"}),
   Q("便利貼上寫什麼？",["便利貼","貼","寫什麼"],{_:"待辦。有一張是「記得吃晚餐」，我自己寫的，今天還沒撕掉。"}),
   Q("影印機為什麼一直卡？",["影印機","卡紙","卡"],{_:"它用了八年了。我幫它取了名字叫「阿卡」。卡紙要順著出紙方向拉，硬扯就會撕破。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"希望大家知道，櫃台不是待命，是在做事。我每次吃飯吃到一半都會被叫走。"}),
   Q("下班後要做什麼？",["下班","回家","放假"],{_:"回家撿衛生紙。我妹說我們家的貓又把衛生紙抓爛了。"})]},
 boss:{hi:{pre:"來，坐。今天有試聽，你知道吧？",class:"（盯著螢幕）嗯？你說。",break:"走廊人很多，進來講。",after:"還沒走？好，聊一下。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"看總部的報表。每天早上第一件事。",class:"巡堂。順便看一下試聽家長的表情。",break:"想對面那張八折的傳單要怎麼回應。",after:"填週報。總部明天中午要。"}),
   Q("這期招生怎麼樣？",["招生","續班","報名","數字"],{_:"續班率卡在七十幾。總部的目標是 85。差的那十幾個百分點，每一個都是一個學生。"}),
   Q("接下來會發生什麼事？",["接下來","等一下","之後"],{pre:"六點半開課。試聽家長會坐在教室裡，那一堂很重要。",class:"下課我要找試聽家長談。今天能不能簽，就看這一下。",break:"第二節上完，九點十五下課，家長會在大廳等。",after:"週報送出去，然後等總部的電話。"}),
   Q("總部都看什麼數字？",["總部","報表","看什麼"],{_:"續班率、試聽轉換率、退費數。沒有一格是寫「學生今天有沒有笑」。"}),
   Q("為什麼開補習班？",["為什麼","開補習班","當主任"],{_:"我以前也是補習班出來的。那時候有個老師留下來陪我算到十點。我想讓別人也有那種人。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"影印機。真的。還有，希望總部來這裡待一個晚上，再決定目標。"})]},
 teacher:{hi:{pre:"喔，你好。我在想今天怎麼開場。",class:"（小聲）我在上課耶……一下下就好。",break:"嗓子要休息一下，你說，我聽。",after:"今天終於上完了。怎麼了？"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"備課。今天上空間向量，每年教到這裡，就有一半的人開始放棄。",class:"跟 z 軸搏鬥。",break:"喝水，順便看剛剛的小考。",after:"改考卷。明天還要印新的。"}),
   Q("今天上什麼？",["上什麼","教什麼","進度","向量"],{_:"空間向量。我會先畫一個房間的角落，跟他們說：你們就住在向量裡面。"}),
   Q("接下來會發生什麼事？",["接下來","等一下","之後"],{pre:"六點半上課。試聽家長會坐在後面，我有點緊張。",class:"七點五十下課。下課一定有人來問題目。",break:"第二節要講內積。最難的那一段。",after:"跟主任報告試聽的狀況，然後回家。","boss.after":"等一下去你辦公室報告試聽的狀況，然後回家。"}),
   Q("阿哲怎麼樣？",["阿哲","最後一排"],{_:"他不是懶。他是從高一就沒跟上，後來就不知道從哪裡開始問了。"}),
   Q("為什麼當補習班老師？",["為什麼","當老師","補習班老師"],{_:"本來想當學校老師，考了三年沒考上。後來發現，在這裡也能把一個人教會。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"講義不要再印不夠了。還有，下課十五分鐘真的不夠喝一杯水。"})]},
 pinyu:{hi:{pre:"（拿下耳機）嗯？",class:"（小聲）怎麼了？",break:"……我在背單字。",after:"我在等我媽來接。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"背單字。每次都從 A 開始背，所以我 A 開頭的最熟。",class:"抄筆記。老師說的我都想寫下來。","teacher.class":"抄筆記。你說的我都想寫下來。",break:"把剛剛不懂的地方圈起來。",after:"把今天的錯題抄到筆記本。"}),
   Q("模考考得怎樣？",["模考","考試","成績","級分"],{_:"掉了兩級分。我媽說是因為我不夠努力。"}),
   Q("想念哪個科系？",["科系","大學","念什麼","志願"],{_:"心理系。可是我還沒跟我媽說。"}),
   Q("內積是在算什麼？",["內積","數學","向量"],{_:"我會算，可是不知道它在算什麼。這樣是不是很奇怪？",teacher:"我會算，可是不知道它在算什麼……老師，你下次可以從這裡講嗎？"}),
   Q("最近睡得好嗎？",["睡","累","休息"],{_:"兩點睡，六點起來。我覺得還好……應該還好吧。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"希望考試不要每次都拿來跟上一次比。"})]},
 zhe:{hi:{pre:"……喔。",class:"（趴在桌上，眼睛是睜開的）",break:"幹嘛。",after:"……還好啦。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"沒有啊。發呆。",class:"有在聽啦。只是聽不懂而已。","teacher.class":"有在聽啦……你講的我只是聽不懂而已。",break:"畫畫。不要跟老師說。","teacher.break":"畫畫。……你不會沒收吧？",after:"等我媽打電話來。"}),
   Q("你在畫什麼？",["畫","畫畫","圖"],{_:"一隻貓、一台機車，還有一個很像許老師的人。……畫得很像吧。",teacher:"一隻貓、一台機車……還有一個人。（他把講義翻過去）沒什麼啦。"}),
   Q("數學哪裡卡住？",["數學","卡住","不懂","聽不懂"],{_:"從高一就卡住了。現在上的東西，我連題目在問什麼都看不懂。"}),
   Q("以後想做什麼？",["以後","未來","科系","想做"],{_:"設計。可是我媽說，數學不好連設計都考不上。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"不要每次都點我起來。我又不會。",teacher:"……可以不要每次都點我起來嗎。我又不會。"})]},
 hong:{hi:{pre:"嗨，自習室冷氣又在吵架了。",class:"自習室這邊還好，有事嗎？",break:"等一下喔，有三個人排隊問題目。",after:"快收了。怎麼了？"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"開冷氣、排座位、把插座分好。",class:"解題。今天被問最多的是三角函數。",break:"一次被三個人問問題。",after:"收登記表，看誰沒寫離開時間。"}),
   Q("自習室狀況怎麼樣？",["自習室","狀況","人"],{_:"今天 23 個人。冷氣開 24 度，有人說冷，有人說熱。"}),
   Q("期中考準備得怎樣？",["期中","考試","大學"],{_:"下禮拜三科。我在這裡顧自習室，順便自己也念。感覺像是在陪考。"}),
   Q("為什麼來當助教？",["為什麼","助教","打工"],{_:"以前我也在這裡補習，坐自習室最後一排。那時候覺得助教好帥。現在才知道，助教只是很會找插座。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"冷氣遙控器可以不要只有一支嗎。"})]},
 bo:{hi:{pre:"（揮揮手）",class:"我在寫作業。",break:"要不要吃餅乾？",after:"……我在等我爸。"},
  qs:[
   Q("你現在在忙什麼？",["忙","在做","做什麼"],{pre:"寫學校作業。",class:"寫數學。好難。",break:"吃餅乾。",after:"等人。"}),
   Q("你幾點來的？",["幾點","來","什麼時候"],{_:"七點就來了。家裡沒人，這裡有冷氣，還有人。"}),
   Q("晚餐吃什麼？",["晚餐","吃","餓","餅乾","宵夜","關東煮"],{_:"餅乾。我媽買一整箱，說晚餐不夠可以吃。九點的時候會去 7-11 買關東煮。"},{knowBo:1}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"希望我媽可以早一點下班。她在醫院輪班。"})]},
 parent:{hi:{pre:"你好你好。",class:"（小聲）老師上課好像滿有條理的。","teacher.class":"（小聲）老師你上課好有條理。",break:"下課了？我想問一下……",after:"謝謝你們今天招待。"},
  qs:[
   Q("為什麼想來試聽？",["為什麼","試聽","來"],{_:"我們家那個國中數學還不錯，上高中才開始掉。我數學也不好，教不了他。"}),
   Q("覺得上課怎麼樣？",["上課","覺得","怎麼樣","老師"],{pre:"還沒上，我先看看。",_:"老師講得滿清楚的。不過人有點多，不知道顧不顧得過來。",teacher:"你講得滿清楚的。不過一班二十個人，你顧得過來嗎？","teacher.pre":"還沒上課呢，等一下就看你的了。"}),
   Q("有在看對面那家嗎？",["對面","別家","比較","八折"],{_:"有啊，對面打八折。我是真的不知道怎麼選，所以才兩邊都來看。"}),
   Q("孩子平常怎麼念書？",["孩子","念書","平常","兒子"],{_:"關在房間。我也不知道他是在念書還是在滑手機。"})]},
 yu:{hi:{class:"老師！我寫完了！（其實還沒）",break:"老師你要不要玩鬼抓人？",after:"我媽什麼時候來？",_:"老師好！"},
  qs:[
   Q("你在做什麼？",["做什麼","在幹嘛","忙"],{class:"寫數學……我討厭進位。",break:"吃布丁！",after:"等我媽。",_:"沒有啊。"}),
   Q("作業寫到哪了？",["作業","寫到","寫完"],{class:"數學寫完了……應該啦。國語還沒。",_:"還沒開始寫。"}),
   Q("最喜歡什麼課？",["喜歡","課","科目"],{_:"體育！還有下課。"}),
   Q("長大想做什麼？",["長大","以後","夢想"],{_:"YouTuber！不然就是消防員。"})]},
 anan:{hi:{_:"（點點頭）"},
  qs:[
   Q("在看什麼書？",["書","看什麼","閱讀"],{_:"《小王子》。阿嬤說她小時候也看過。"}),
   Q("聯絡簿簽了嗎？",["聯絡簿","簽名","簽"],{_:"媽媽出差。阿嬤說她眼睛不好，叫我跟老師說。"}),
   Q("你最希望哪件事被改掉？",["希望","改掉","改","最想"],{_:"希望媽媽不要一直出差。"})]},
 mi:{hi:{_:"（抱著兔子娃娃，看著你）"},
  qs:[
   Q("娃娃叫什麼名字？",["娃娃","名字","兔子"],{_:"叫布丁！跟點心一樣。"}),
   Q("想媽媽嗎？",["媽媽","想"],{_:"想……媽媽說她今天會來。"}),
   Q("今天在學校做什麼？",["學校","今天","上課"],{_:"畫畫！我畫了一隻恐龍，老師說像雞。"})]},
 ama:{hi:{_:"老師好～"},
  qs:[
   Q("安安在家乖嗎？",["安安","乖","在家"],{_:"很乖。太乖了，有時候我都怕她有什麼事不講。"}),
   Q("平常都是阿嬤來接嗎？",["接","平常","每天"],{_:"她媽媽在外地工作，平常都是我。走路十分鐘，剛好運動。"}),
   Q("收據要怎麼寫？",["收據","繳費","發票"],{_:"寫她媽媽的名字。公司可以報一點。"})]},
 zhangma:{hi:{_:"你好～我先看看。"},
  qs:[
   Q("孩子幾年級？",["幾年級","年級","孩子"],{_:"三年級。"}),
   Q("平常誰接送？",["接送","誰接","下班"],{_:"我六點半才下班，所以想找可以待到七點的。"}),
   Q("有在比較別家嗎？",["比較","別家","對面"],{_:"有啊，對面也有安親，但是人太多了。"})]},
 chenba:{hi:{_:"你好，我來接小柏。"},
  qs:[
   Q("平常幾點來接？",["幾點","接","平常"],{_:"九點多。我下班直接過來，常常還沒吃飯。"}),
   Q("工作很忙嗎？",["工作","忙","上班"],{_:"做工地的，早上五點出門。他媽媽在醫院輪班，所以晚上都是我。"}),
   Q("小柏在家怎麼樣？",["小柏","在家","家裡"],{_:"話不多。他說在這裡念書比較專心。我是覺得，有人看著比較放心啦。"})]}
};
const CHAT_FX={yu:{care:{pat:2}},anan:{care:{par:2}},mi:{care:{pat:2}},ama:{care:{par:2}},zhangma:{care:{par:1}},yun:{teacher:{hp:1},yun:{},boss:{morale:2}},boss:{teacher:{par:1},yun:{pat:1},boss:{}},teacher:{teacher:{},yun:{ord:1},boss:{morale:2}},
  pinyu:{teacher:{stu:2},yun:{par:1},boss:{rep:1}},zhe:{teacher:{stu:2},yun:{par:1},boss:{rep:1}},hong:{teacher:{hp:1},yun:{ord:1},boss:{morale:1}},
  bo:{teacher:{stu:1},yun:{pat:1},boss:{rep:1}},parent:{teacher:{par:2},yun:{par:2},boss:{sales:2}},chenba:{teacher:{par:1},yun:{par:1},boss:{rep:1}}};
const CHAT_IDK={yu:"蛤？我不知道啦！",anan:"……我不知道。",mi:"（搖頭）",ama:"這個阿嬤不懂啦。",zhangma:"這我不太清楚耶。",yun:"嗯……這個我不太清楚耶。你問問看別的？",boss:"這個嘛……我們改天再聊。",teacher:"這題我答不出來。真的。",pinyu:"……我不知道。",zhe:"不知道。",hong:"這個我也不確定欸。",bo:"……蛤？",parent:"這個我不太懂耶。",chenba:"這我不清楚。"};
/* 回答查找順序：職業.時段 → 職業 → 時段 → 不分時段。這樣同一題可以依「你是誰」換說法。 */
function chatAnswer(c,pk){const a=c.a,r=G.line.id;return a[r+"."+pk]??a[r]??a[pk]??a._??Object.values(a)[0];}
function matchQ(qs,text){const t=text.replace(/\s/g,"");let best=-1,score=0;
  qs.forEach((q,i)=>{let s=0;q.keys.forEach(k=>{if(t.includes(k))s+=k.length;});if(t&&q.q.replace(/[？?]/g,"").includes(t))s+=t.length;if(s>score){score=s;best=i;}});return best;}
function chatTargets(){
  if(!G)return[];const st=step(),main=st&&st.target&&st.target.npc,side=new Set(activeSides().map(s=>s.target&&s.target.npc).filter(Boolean));
  return Object.keys(CHATS).filter(id=>(!G.line.chats||G.line.chats.includes(id))&&id!==G.line.id&&npcs[id]&&npcs[id].visible&&id!==main&&!side.has(id));
}
let CH=null;
function openChat(id,after){
  const n=npcs[id],C=CHATS[id],c=CHARS[id];if(!C)return after&&after();
  if(n&&player&&n.visible){n.rotation.y=Math.atan2(player.position.x-n.position.x,player.position.z-n.position.z);player.rotation.y=Math.atan2(n.position.x-player.position.x,n.position.z-player.position.z);}
  const pk=periodKey(),ret=mode;mode="chat";path=null;guiding=false;renderAll();
  G.chatUsed=G.chatUsed||[];CH={id,pk,after,busy:false,asked:new Set(G.chatUsed.filter(k=>k.startsWith(id+":")).map(k=>+k.split(":")[1]))};
  const first=!(G.chatWith||(G.chatWith=[])).includes(id);if(first)G.chatWith.push(id);
  spend(1);
  openSheet("閒聊",`<div class="chatp">
    <div class="chead"><span class="face" style="background:${c.color}">${esc(c.abbr)}</span><div class="who"><b>${esc(c.name)}</b><small>${esc(c.title)}</small></div><button class="ghost" data-act="chatEnd">結束對話</button></div>
    <p class="cnote">現在的時刻：${PERIOD[phaseOf()]||"上課前"}。${esc(c.name)}的回答會跟著時刻變。</p>
    <div class="clog" id="clog" aria-live="polite"><div class="bub them">${esc(chatAnswer({a:C.hi},pk))}</div></div>
    <div class="cchips" id="cchips">${C.qs.map((q,i)=>`<button class="chip ${CH.asked.has(i)?"asked":""}" data-q="${i}">${esc(q.q)}</button>`).join("")}</div>
    <form class="cask" id="cask"><input id="caskIn" type="text" enterkeyhint="send" autocomplete="off" placeholder="自己打字問${esc(c.name)}…" aria-label="自己打字問${esc(c.name)}"><button class="go" type="submit">送出</button></form>
    <p class="hint">回答是預先寫好的。打字問的時候，會依關鍵字找最接近的一題。每問一題大約花 1 分鐘。</p></div>`,()=>endChat(first,ret));
  $("cask").addEventListener("submit",e=>{e.preventDefault();const inp=$("caskIn"),t=inp.value.trim();if(!t||CH.busy)return;inp.value="";askChat(matchQ(C.qs,t),t);});
}
function askChat(i,typed){
  if(!CH||CH.busy)return;const C=CHATS[CH.id],log=$("clog");if(!log)return;
  const q=i>=0?C.qs[i]:null;CH.busy=true;
  log.insertAdjacentHTML("beforeend",`<div class="bub me">${esc(typed||q.q)}</div><div class="bub them typing">想一下…</div>`);log.scrollTop=log.scrollHeight;
  spend(1);beep("blip");
  setTimeout(()=>{if(!CH)return;const tp=log.querySelector(".typing");const ans=q?chatAnswer(q,CH.pk).replace(/\{me\}/g,ME(G)):CHAT_IDK[CH.id];
    if(tp){tp.classList.remove("typing");tp.textContent=ans;}log.scrollTop=log.scrollHeight;CH.busy=false;
    if(q&&q.set)Object.assign(G.f,q.set);
    if(q){const key=CH.id+":"+i;if(!G.chatUsed.includes(key))G.chatUsed.push(key);CH.asked.add(i);const b=document.querySelector(`#cchips [data-q="${i}"]`);if(b)b.classList.add("asked");
      const seen=new Set(store.get("chats",[]));seen.add(key);store.set("chats",[...seen]);}
    renderHud();},520);
}
function endChat(first,ret){const id=CH&&CH.id,after=CH&&CH.after;CH=null;
  let d="";if(first&&id){const fx=(CHAT_FX[id]||{})[G.line.id];if(fx&&Object.keys(fx).length)d=applyFx(fx);}
  mode=ret==="chat"?"walk":ret;if(mode==="dialog")mode="walk";renderAll();setTimeout(checkAch,50);
  if(d)showBanner("聊了幾句",`${CHARS[id].name}・`+d.replace(/<[^>]+>/g,""));
  if(after)after();}
document.addEventListener("click",e=>{const q=e.target.closest("#cchips [data-q]");if(q){askChat(+q.dataset.q);return;}
  if(e.target.closest("[data-act=chatEnd]"))closeSheet();});
