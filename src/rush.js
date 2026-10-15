/* ================= 放學高峰：多工佇列（17:30–18:00） =================
   電話、家長、繳費、刷卡、對講機會一件一件跑進來，每一件都有耐心條。
   一次只能處理一件：點一件 → 選怎麼處理。處理中別的事情還在等，耐心條照樣在掉。
   隊伍空了，下一件會馬上進來，所以手快的人可以早一點結束。
   結果：ok 處理對、wrong 處理錯、drop 等到放棄。 */
const RUSH_SETS={
 1:[
  {ic:"🙋",who:"阿翔媽媽",say:"我來接小宇。",opts:["廣播：四年級小宇，媽媽來接","廣播：五年級小宇，媽媽來接"],ok:0,why:"小宇是四年級。",pat:9},
  {ic:"📞",who:"電話・子晴媽媽",say:"今天子晴會晚十分鐘到喔。",opts:["傳訊息給鄭老師","說好，掛掉"],ok:0,why:"國中生到班是班導在確認的，要讓鄭老師知道。",pat:8},
  {ic:"💰",who:"美語家長",say:"十月的美語學費 3,200。（遞給你 5,000）",opts:["找 1,800，開收據","找 2,800，開收據"],ok:0,why:"5,000 − 3,200 = 1,800。",pat:10},
  {ic:"📞",who:"電話・安安阿嬤",say:"明天中午我會晚十分鐘喔。",opts:["寫在明天的接送表上","說好，掛掉"],ok:0,why:"接送的改變要寫下來，明天中午的老師才看得到。",pat:8},
  {ic:"🪪",who:"九年級學生",say:"姊姊，我卡片忘了帶……",opts:["手動登記到班時間","讓他直接上樓"],ok:0,why:"沒刷卡，家長就收不到到班通知，要手動補登。",pat:7},
  {ic:"🙋",who:"不認識的阿姨",say:"我來接小米，我是她阿姨。",opts:["先打給小米媽媽確認","廣播：四年級小米下樓"],ok:0,why:"不在[[接送名單]]上的人，一律先打給家長確認。",pat:10},
  {ic:"🙋",who:"妞妞爸爸",say:"妞妞，四年級的。",opts:["廣播：四年級妞妞，爸爸來接","請他自己上二樓找"],ok:0,why:"安親的小朋友由老師帶下樓，家長在大廳等。",pat:8},
  {ic:"📟",who:"二樓對講機・蔡老師",say:"小米媽媽有打來嗎？",opts:["有，她說會晚一點","還沒有，有消息我馬上通知你"],ok:1,why:"小米媽媽還沒聯絡。照實說，不要替家長猜。",pat:7},
  {ic:"💰",who:"九年級學生",say:"便當錢 85 元。（遞給你 100）",opts:["找 15 元","找 25 元"],ok:0,why:"100 − 85 = 15。",pat:8},
  {ic:"📞",who:"電話・陌生號碼",say:"請問明天國中部有上課嗎？",opts:["有，國中部週三照常上課","我不清楚，明天再打來"],ok:0,why:"這種問題櫃台自己就能回答。",pat:7}
 ],
 2:[
  {ic:"🙋",who:"安安媽媽",say:"我來接安安！我出差回來了。",opts:["廣播：四年級安安，媽媽來接","請她先到櫃台簽名"],ok:0,why:"她在接送名單上，直接廣播就好。",pat:9},
  {ic:"📞",who:"電話・阿翔媽媽",say:"我六點半上三樓找鄭老師，小宇要待到七點。",opts:["寫在接送表，通知蔡老師","說好，掛掉"],ok:0,why:"小宇晚接，二樓的老師要知道。",pat:8},
  {ic:"💰",who:"張媽媽",say:"試讀單的資料費 350。（遞給你 1,000）",opts:["找 650，開收據","找 750，開收據"],ok:0,why:"1,000 − 350 = 650。",pat:10},
  {ic:"🪪",who:"八年級學生",say:"姊姊，我卡片消磁了……",opts:["手動登記到班時間","叫他明天再刷"],ok:0,why:"沒刷到卡，就要手動補登，家長才收得到通知。",pat:7},
  {ic:"🙋",who:"一位阿公",say:"我來接孫子，四年級的阿凱。",opts:["先查接送名單","廣播：四年級阿凱下樓"],ok:0,why:"先確認阿公在不在名單上。",pat:10},
  {ic:"📟",who:"二樓對講機・林老師",say:"五年級小安的鞋子有人撿到嗎？",opts:["有，在失物籃","沒看到"],ok:0,why:"失物都會先放櫃台的失物籃。",pat:7},
  {ic:"📞",who:"電話・國小家長",say:"週五戶外教學，那天安親幾點去接？",opts:["照學校通知的回校時間去接","我們也去戶外教學"],ok:0,why:"戶外教學是國小的活動，安親照學校公布的回校時間接人。",pat:8},
  {ic:"🙋",who:"小米媽媽",say:"我來接小米！今天準時喔！",opts:["廣播：四年級小米，媽媽來接","請她上樓"],ok:0,why:"四年級小米，廣播就好。",pat:8},
  {ic:"💰",who:"九年級學生",say:"模擬考卷的影印費 40。（遞給你 50）",opts:["找 10 元","找 20 元"],ok:0,why:"50 − 40 = 10。",pat:8},
  {ic:"📞",who:"電話・陌生號碼",say:"請問你們有四年級安親嗎？",opts:["有，請留電話，明天下午回您","沒有"],ok:0,why:"四年級還有名額。",pat:7}
 ]
};
MINIS.rush={
  head:"櫃台・放學高峰",zone:"大廳・櫃台",title:"一次只有一雙手",cost:8,
  intro:"電話、家長、繳費、刷卡會一件一件進來，每一件都有耐心條。點一件來處理，再選怎麼處理。處理的時候，其他人還在等。",
  mount(el,done){
    const day=(G&&G.day)||1,list=RUSH_SETS[day]||RUSH_SETS[1],help=G&&G.line.id==="yun"&&day===2&&pa(G,"boss").bossDesk||G&&G.line.id==="boss";
    const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
    const tasks=list.map((t,i)=>({...t,id:i,left:t.pat*(help?1.25:1),max:t.pat*(help?1.25:1),state:"wait"}));
    let next=0,clock=0,ok=0,wrong=0,drop=0,sel=null,ended=false,feedText="";
    const spawnAt=i=>i<3?0:3+(i-3)*2.6; // 前三件一起來，之後約每 2.6 秒一件
    const queue=()=>tasks.filter(t=>t.state==="here"),col=v=>v<.35?"var(--red)":v<.65?"var(--amber)":"var(--green)";
    // 只更新耐心條，不重畫按鈕（保留焦點，也不會點到一半按鈕被換掉）
    function bars(){el.querySelectorAll("[data-bar]").forEach(f=>{const t=tasks[+f.dataset.bar],v=Math.max(0,t.left/t.max);f.style.width=v*100+"%";f.style.background=col(v);});const h=el.querySelector(".rushhead span");if(h)h.textContent=fmt(17*60+30+Math.min(30,Math.round(clock/((tasks.length*2.6+3)/30))));}
    function spawn(){while(next<tasks.length&&(clock>=spawnAt(next)||!queue().length)){tasks[next].state="here";tasks[next].born=clock;next++;}}
    function finish(){if(ended)return;ended=true;clearInterval(timer);
      el.innerHTML=`<p class="feed">這一波過去了。處理好 ${ok} 件${wrong?`，弄錯 ${wrong} 件`:""}${drop?`，有 ${drop} 件等不及走了`:""}。</p>`;done({ok,drop,wrong});}
    function draw(){
      const q=queue(),bar=t=>Math.max(0,t.left/t.max),gm=Math.min(30,Math.round(clock/((tasks.length*2.6+3)/30)));
      const head=`<div class="rushhead"><span>${fmt(17*60+30+gm)}</span><span>✓ ${ok}　✗ ${wrong}　走掉 ${drop}</span><span>還有 ${tasks.length-next} 件會進來</span></div>`;
      if(sel){const t=sel;el.innerHTML=head+`<div class="paper rushsel"><div class="q">${t.ic} ${esc(t.who)}</div><div>${rich(t.say)}</div><div class="track"><div class="fill" data-bar="${t.id}" style="width:${bar(t)*100}%;background:${col(bar(t))}${reduce?";transition:none":""}"></div></div></div>
        <div class="choices">${t.opts.map((o,k)=>`<button class="choice" data-k="${k}" data-opt="1">${esc(o)}</button>`).join("")}</div><p class="hint">${q.length?`後面還有 ${q.length} 個人在等。`:"後面暫時沒有人。"}</p>${q.length?`<button class="ghost" data-back style="width:100%;padding:10px">先放著，處理別的</button>`:""}<p class="feed" aria-live="polite">${esc(feedText)}</p>`;
        const bk=el.querySelector("[data-back]");if(bk)bk.addEventListener("click",()=>{if(!sel||ended)return;sel.state="here";sel=null;feedText="";draw();});
        el.querySelectorAll("[data-opt]").forEach(b=>b.addEventListener("click",()=>{if(!sel||ended)return;const k=+b.dataset.k;
          if(k===t.ok){ok++;feedText=`${t.who}：處理好了。`;beep&&beep("ok");}else{wrong++;feedText=`${t.who}：弄錯了。${plain(t.why)}`;}
          t.state="done";sel=null;spawn();if(next>=tasks.length&&!queue().length)finish();else draw();}));return;}
      el.innerHTML=head+`<div class="rushq" role="list">${q.length?q.map(t=>`<button class="choice rushc" role="listitem" data-k="${t.id}" data-task="1"><span class="rushi" aria-hidden="true">${t.ic}</span><span><b>${esc(t.who)}</b><small>${esc(plain(t.say))}</small></span><span class="track" aria-label="耐心 ${Math.round(bar(t)*100)}%"><span class="fill" data-bar="${t.id}" style="display:block;width:${bar(t)*100}%;background:${col(bar(t))}${reduce?";transition:none":""}"></span></span></button>`).join(""):`<p class="hint">暫時沒有人。喝一口水。</p>`}</div><p class="feed" aria-live="polite">${esc(feedText)}</p>`;
      el.querySelectorAll("[data-task]").forEach(b=>b.addEventListener("click",()=>{if(ended)return;const t=tasks[+b.dataset.k];if(!t||t.state!=="here")return;sel=t;t.state="busy";feedText="";draw();}));
    }
    // 耐心條：處理中的那件掉得比較慢（人就在你面前）
    const timer=setInterval(()=>{if(ended)return;if(!document.body.contains(el)){clearInterval(timer);return;}clock+=.1;
      let changed=false;tasks.forEach(t=>{if(t.state==="here"||t.state==="busy"){t.left-=t.state==="busy"?.04:.1;if(t.left<=0){if(t.state==="busy")sel=null;t.state="gone";drop++;feedText=`${t.who}等不及，先走了。`;changed=true;}}});
      const before=next;spawn();if(next!==before)changed=true;
      if(next>=tasks.length&&!queue().length&&!sel){finish();return;}
      if(changed)draw();else bars();},100);
    spawn();draw();
  }
};
