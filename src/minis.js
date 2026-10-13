/* ================= 小遊戲 ================= */
MINIS.jam={
  head:"影印機・卡紙",zone:"大廳・影印機",title:"拉出卡紙",
  intro:"打開前蓋，紙路裡卡了四張紙。順著送紙方向，從出紙口那一端開始拉。先拉裡面的，會被前面的紙壓住撕破。",
  mount(el,done){
    const has=[0,1,1,0,1,1];let tears=0,pulls=0;const torn=new Set();
    el.innerHTML=`<div class="jam"><div class="jam-path" role="group" aria-label="紙路">${has.map((h,i)=>`<div class="slot">${h?`<button class="sheetp" data-i="${i}" aria-label="第 ${i+1} 格的紙">A4</button>`:""}<span class="roller"></span></div>`).join("")}</div>
      <div class="jam-cap"><span>送紙匣</span><span>送紙方向 →</span><span>出紙口</span></div></div><p class="feed" aria-live="polite">點一張紙，拉一張。</p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll(".sheetp").forEach(b=>b.addEventListener("click",()=>{
      const i=+b.dataset.i;if(!has[i])return;pulls++;
      const blocked=has.some((h,k)=>h&&k>i);
      if(blocked){tears++;torn.add(i);b.classList.add("crumple");b.classList.remove("shake");void b.offsetWidth;b.classList.add("shake");
        feed.textContent=torn.size>1||tears>1?"又撕破了。前面還有紙壓著它。":"撕破一角。前面還有紙壓著它，碎紙掉進滾輪裡。";return;}
      has[i]=0;b.classList.add("gone");setTimeout(()=>b.remove(),260);
      feed.textContent=torn.has(i)?"連碎紙一起夾出來了。":"拉出一張，完整的。";
      if(!has.some(Boolean)){feed.textContent=`清完了。拉了 ${pulls} 次，撕破 ${tears} 次。`;done({tears,pulls});}
    }));
  }
};

/* 批考卷：找出學生計算過程裡第一個錯的那一行 */
MINIS.grade={
  head:"小考・批改",zone:"講台",title:"找出錯在哪一行",
  intro:"三張小考卷，每張只能點一次。點出第一個算錯的那一行，學生才知道要從哪裡改。",
  papers:[
   {who:"品妤",q:"向量 a=(1,2,2)，求 |a|。",lines:["|a|² = 1² + 2² + 2²","= 1 + 4 + 4","= 9","|a| = 9"],bad:3,why:"開根號忘了開，|a| 應該是 3。"},
   {who:"阿哲",q:"a=(2,−1,3)，b=(1,4,0)，求 a·b。",lines:["a·b = 2×1 + (−1)×4 + 3×0","= 2 + 4 + 0","= 6"],bad:1,why:"(−1)×4 是 −4，負號掉了。答案是 −2。"},
   {who:"試聽生",q:"A(1,0,2)、B(3,2,1)，求向量 AB。",lines:["AB = A − B","= (1−3, 0−2, 2−1)","= (−2, −2, 1)"],bad:0,why:"向量 AB 是終點減起點，B − A = (2, 2, −1)。"}
  ],
  mount(el,done){
    let idx=0,hits=0;const self=this;
    function draw(){
      const p=self.papers[idx];
      el.innerHTML=`<div class="paper"><div class="q">${p.who}・第 ${idx+1} / ${self.papers.length} 張　${p.q}</div>${p.lines.map((l,i)=>`<button class="stepl" data-i="${i}">${l}</button>`).join("")}</div><p class="feed" aria-live="polite">點出第一個錯的那一行。</p><div class="actions" hidden><button class="go" data-next>下一張</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll(".stepl").forEach(b=>b.addEventListener("click",()=>{
        if(!act.hidden)return;const i=+b.dataset.i;el.querySelectorAll(".stepl")[p.bad].classList.add("hit");
        if(i===p.bad){hits++;feed.textContent="抓到了。"+p.why;}else{b.classList.add("miss");feed.textContent="不是這一行。"+p.why;}
        act.hidden=false;const nb=act.querySelector("[data-next]");
        if(idx===self.papers.length-1){nb.textContent="批完了";}
        nb.onclick=()=>{if(idx<self.papers.length-1){idx++;draw();}else{el.querySelector(".feed").textContent=`${self.papers.length} 張批完，抓對 ${hits} 張。`;act.hidden=true;done({hits});}};
      }));
    }
    draw();
  }
};

/* 電話分流：櫃台班導 */
MINIS.calls={
  head:"櫃台・電話",zone:"大廳・櫃台",title:"四通電話",
  intro:"六點到六點半，電話一通接一通。每一通只能選一種處理方式。",
  calls:[
   {who:"高二家長",say:"「明天英文課要帶課本嗎？還是只帶講義？」",opts:["自己回答","記下來回電","轉給主任"],ok:0,why:"這種問題櫃台自己就能回答，不用麻煩別人。"},
   {who:"林媽媽",say:"「我要跟許老師講話，現在。」（許老師正在上課）",opts:["衝進教室叫老師","記下來，下課請老師回電","轉給主任"],ok:1,why:"上課中不打斷老師。記下來，下課第一時間轉達。"},
   {who:"陌生號碼",say:"「對面那間比較便宜耶，你們能算便宜一點嗎？」",opts:["自己給折扣","記下來回電","轉給主任"],ok:2,why:"價格的事櫃台不能自己決定，交給主任。"},
   {who:"高三家長",say:"「小孩發燒，今天要請假，可以補課嗎？」",opts:["幫他登記錄影補課","記下來回電","轉給主任"],ok:0,why:"請假補課有固定流程：登記[[錄影補課]]就好。"}
  ],
  mount(el,done){let i=0,ok=0;const self=this;
    function draw(){const c=self.calls[i];
      el.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.calls.length} 通・${c.who}</div><div>${rich(c.say)}</div></div><div class="choices">${c.opts.map((o,k)=>`<button class="choice" data-k="${k}">${o}</button>`).join("")}</div><p class="feed" aria-live="polite"></p><div class="actions" hidden><button class="go" data-next>${i===self.calls.length-1?"掛電話":"下一通"}</button></div>`;
      const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{if(!act.hidden)return;const k=+b.dataset.k;
        if(k===c.ok){ok++;feed.innerHTML="處理得好。"+rich(c.why);}else{feed.innerHTML="不太對。"+rich(c.why);}
        el.querySelectorAll("[data-k]").forEach((x,j)=>{x.disabled=true;if(j===c.ok)x.style.borderColor="var(--green)";});act.hidden=false;
        act.querySelector("[data-next]").onclick=()=>{if(i<self.calls.length-1){i++;draw();}else{el.innerHTML=`<p class="feed">四通電話處理完，處理得好的有 ${ok} 通。</p>`;done({ok});}};}));}
    draw();}
};

/* 擦白板：由上往下擦，下面先擦乾淨的話，上面擦下來的墨粉會掉下去 */
MINIS.erase={
  head:"白板・板擦",zone:"B 班教室・講台",title:"擦白板",
  intro:"白板上還留著上一堂高二的英文單字（第二次玩起會寫滿四排）。板擦一次擦掉一層，每一格要擦兩下。由上往下擦：下面先擦乾淨的話，上面擦下來的墨粉會掉到下面那格。",
  words:["vocabulary","ambitious","p.132","accumulate","Unit 7","inevitable","考前必背","although","→ 文法","sophisticated","Quiz 週五","hypothesis","p.140","consequence","背到 Unit 9","閱讀測驗"],
  mount(el,done){const R=G&&G.hard?4:3,Cc=4,dirt=Array(R*Cc).fill(2);let taps=0,falls=0;const self=this;
    el.innerHTML=`<div style="display:grid;grid-template-columns:repeat(${Cc},1fr);gap:4px;background:var(--surface);border:6px solid var(--muted);border-radius:6px;padding:6px">${dirt.map((d,i)=>`<button data-c="${i}" style="aspect-ratio:3/2;border:1px dashed var(--rule);border-radius:3px;background:var(--surface);font-family:var(--display);font-size:.8rem;color:#1d4fc4;overflow:hidden;padding:2px">${self.words[i]}</button>`).join("")}</div><p class="feed" aria-live="polite">點一格，擦一下。</p>`;
    const cells=[...el.querySelectorAll("[data-c]")],feed=el.querySelector(".feed");
    const paint=()=>cells.forEach((c,i)=>{c.style.opacity=dirt[i]===0?.15:dirt[i]===1?.55:1;c.style.textDecoration=dirt[i]===1?"line-through":"none";});
    cells.forEach(c=>c.addEventListener("click",()=>{const i=+c.dataset.c;if(!dirt[i])return;taps++;dirt[i]--;
      const below=i+Cc;let msg=dirt[i]?"擦掉一層。":"這格乾淨了。";
      if(below<R*Cc&&dirt[below]===0){dirt[below]=1;falls++;msg="墨粉掉到下面那格了，又要重擦。";}
      paint();feed.textContent=msg;
      if(dirt.every(d=>d===0)){feed.textContent=`白板擦乾淨了。擦了 ${taps} 下，墨粉掉下去 ${falls} 次。`;done({extra:taps-R*Cc*2,falls});}}));
    paint();}
};

/* 暖身五題：限時 */
MINIS.quiz={
  head:"上課・暖身",zone:"B 班教室",title:"暖身五題",
  intro:"你在白板上寫了五題，全班一起搶答。限時內（第二次玩起只有 22 秒），答對越多題，台下越有精神。",
  qs:[["|(3, 4, 0)| = ?",["5","7","25","12"],0],["(1, 2, 3)·(1, 0, 1) = ?",["3","4","6","2"],1],["(2, 0, 0) 和 (0, 3, 0) 的夾角？",["0°","45°","90°","180°"],2],["(1, 1, 0) 的長度？",["2","1","√3","√2"],3],["A(0,0,0)、B(1,2,2)，|AB| = ?",["3","5","√5","9"],0]],
  mount(el,done){const T=G&&G.hard?22:30;let i=0,right=0,left=T,ended=false;const self=this;
    el.innerHTML=`<div class="track" style="height:6px"><div class="fill" id="qbar" style="width:100%"></div></div><div id="qbox"></div><p class="feed" aria-live="polite"></p>`;
    const bar=el.querySelector("#qbar"),box=el.querySelector("#qbox"),feed=el.querySelector(".feed");
    const end=()=>{if(ended)return;ended=true;clearInterval(tm);box.innerHTML="";feed.textContent=`時間到。答對 ${right} / ${self.qs.length} 題，剩 ${Math.max(0,Math.round(left))} 秒。`;done({right,left:Math.max(0,Math.round(left))});};
    const tm=setInterval(()=>{left-=.1;bar.style.width=Math.max(0,left/T*100)+"%";if(left<=0)end();},100);
    function draw(){if(i>=self.qs.length)return end();const [q,opts,ok]=self.qs[i];
      box.innerHTML=`<div class="paper"><div class="q">第 ${i+1} / ${self.qs.length} 題</div>${q}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">${opts.map((o,k)=>`<button class="choice" data-k="${k}" style="text-align:center;font-family:var(--mono)">${o}</button>`).join("")}</div>`;
      box.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{const k=+b.dataset.k;if(k===ok){right++;feed.textContent="台下：「喔～」";}else{feed.textContent="台下：「蛤？」";left-=3;}i++;draw();}));}
    draw();}
};

/* 安撫電話：三輪對話，怒氣越低越好 */
MINIS.calm={
  head:"電話・林媽媽",zone:"櫃台電話",title:"安撫林媽媽",
  intro:"林媽媽的火氣很大。每一輪選一句回話，讓她的怒氣降下來。",
  rounds:[
   {say:"「他段考數學又是 C！我們繳了一整年的錢！」",opts:[["媽媽您先別急，我們先看他哪幾題寫對了。",-25],["C 確實很危險。",15],["這要看他自己有沒有用功。",25]]},
   {say:"「他說上課都聽不懂，是不是老師教太快？」",opts:[["可能是，我們會注意。",-5],["其他同學都聽得懂。",25],["他是從國一的分數就沒跟上，不是他不努力。",-25]]},
   {say:"「那現在到底要怎麼辦？」",opts:[["先觀察看看。",10],["我們排一個分數的基礎補強，每週多半小時。",-25],["要不要考慮退費？",20]]}
  ],
  mount(el,done){let r=0,anger=70;const self=this;
    function draw(){const R=self.rounds[r];
      el.innerHTML=`<div class="lab" style="display:flex;justify-content:space-between;font-size:.8rem"><span>林媽媽的怒氣</span><b style="font-family:var(--mono)">${anger}</b></div><div class="track" style="height:8px"><div class="fill" style="width:${anger}%;background:${anger>50?"var(--red)":anger>25?"var(--amber)":"var(--green)"}"></div></div>
       <div class="paper"><div class="q">第 ${r+1} / 3 輪</div>${R.say}</div><div class="choices">${R.opts.map((o,k)=>`<button class="choice" data-k="${k}">${o[0]}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
      el.querySelectorAll("[data-k]").forEach(b=>b.addEventListener("click",()=>{const d=R.opts[+b.dataset.k][1];anger=Math.max(0,Math.min(100,anger+d));r++;
        if(r<self.rounds.length)draw();else{el.innerHTML=`<p class="feed">${anger<=20?"林媽媽：「……好，謝謝你願意花時間跟我講。」":anger<=45?"林媽媽：「好吧，我再看看。」":"林媽媽：「我會再打來。」（電話掛斷）"}</p><p class="hint">最後怒氣：${anger}</p>`;done({anger});}}));}
    draw();}
};

/* 點名：從座位表找出沒來的人 */
MINIS.roll={
  head:"點名表",zone:"B 班前門",title:"誰沒來？",
  intro:"前兩排應到 10 個人。看座位表，在名單上點出沒來的兩個人。點錯會被學生笑。",
  names:["柏翰","佳穎","子涵","品妤","小安","宇軒","思妤","冠廷","詠晴","家豪"],absent:["小安","柏翰"],
  mount(el,done){const self=this;const present=this.names.filter(n=>!this.absent.includes(n)).sort(()=>Math.random()-.5);let found=0,miss=0;
    const seats=[...present,"",""].sort(()=>Math.random()-.5);
    el.innerHTML=`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin:8px 0">${seats.map(n=>`<div style="border:1px solid var(--rule);border-radius:3px;padding:6px 2px;text-align:center;font-size:.82rem;background:${n?"var(--surface)":"var(--tray)"};color:${n?"var(--ink)":"var(--muted)"}">${n||"空位"}</div>`).join("")}</div>
      <div class="lbl">名單</div><div style="display:flex;flex-wrap:wrap;gap:6px">${[...this.names].sort(()=>Math.random()-.5).map(n=>`<button class="choice" data-n="${n}" style="padding:6px 10px">${n}</button>`).join("")}</div><p class="feed" aria-live="polite"></p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(b.disabled)return;const n=b.dataset.n;b.disabled=true;
      if(self.absent.includes(n)){found++;b.style.borderColor="var(--green)";feed.textContent=`${n}：沒來。`;}else{miss++;b.style.borderColor="var(--red)";feed.textContent=`${n}：「我在這裡啦！」`;}
      if(found===2){feed.textContent=`找到了：${self.absent.join("、")}沒來。點錯 ${miss} 次。`;el.querySelectorAll("[data-n]").forEach(x=>x.disabled=true);done({miss});}}));}
};

/* 排班表：主任 */
MINIS.roster={
  head:"主任室・排班表",zone:"主任室",title:"下個月的自習室班表",
  intro:"週一到週五，每晚要一個助教顧自習室。點格子換人，排好後送出。",
  rules:["阿宏：週二、週三期中考，不能排","小陳：只能排週一、週二、週五","小林：週一要上課，不能排","每個人最多排兩天"],
  mount(el,done){const days=["一","二","三","四","五"],ppl=["阿宏","小陳","小林"],pick=[0,0,0,0,0];const self=this;
    el.innerHTML=`<ul style="margin:0 0 8px;padding-left:1.2em;font-size:.88rem">${this.rules.map(r=>`<li>${r}</li>`).join("")}</ul><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px">${days.map((d,i)=>`<div style="text-align:center"><div class="zone">週${d}</div><button class="choice" data-d="${i}" style="width:100%;text-align:center;padding:10px 2px">${ppl[0]}</button></div>`).join("")}</div><div class="actions"><button class="go" data-submit>送出班表</button></div><p class="feed" aria-live="polite"></p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-d]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.d;pick[i]=(pick[i]+1)%3;b.textContent=ppl[pick[i]];}));
    el.querySelector("[data-submit]").onclick=()=>{const v=[];const cnt=[0,0,0];pick.forEach((p,i)=>{cnt[p]++;
        if(p===0&&(i===1||i===2))v.push(`週${days[i]}：阿宏要期中考`);if(p===1&&![0,1,4].includes(i))v.push(`週${days[i]}：小陳不能排`);if(p===2&&i===0)v.push("週一：小林要上課");});
      cnt.forEach((c,k)=>{if(c>2)v.push(`${ppl[k]} 排了 ${c} 天`);});
      el.querySelectorAll("[data-d]").forEach(b=>b.disabled=true);el.querySelector("[data-submit]").disabled=true;
      feed.innerHTML=v.length?`有 ${v.length} 個問題：<br>${v.join("<br>")}`:"完美的班表，沒有人有意見。";done({bad:v.length});};}
};

/* ---------- 挑三件事、排順序 ---------- */
/* 只講三件事：從六件裡挑三件 */
MINIS.summary={
  head:"只講三件事",zone:"三行",title:"挑三件最重要的",cost:4,
  get intro(){return {teacher:"林媽媽在電話那頭。她記不住太多事，你只講三件。挑對她最有用的三件。",yun:"螢幕邊框上有六張便利貼。今天先處理三張，挑最急的。",boss:"總部只看三行。挑三件最能說明這間補習班現在需要什麼的事。",care:"林老師只有一分鐘聽你交接。挑明天最需要知道的三件事。",jh:"子晴媽媽在等你回覆。挑三件最能說明子晴狀況的事。"}[G&&G.line.id]||"挑三件。";},
  sets:{
   yun:[["阿翔媽媽：今天五點半接小宇，要提醒二樓",3],["上週請假的三個國中生：補課還沒排",3],["子晴媽媽：段考前想多一次小考",2],["影印機：碳粉剩 10%",1],["冷氣遙控器：阿宏要",0],["上週的收據要歸檔",0]],
   teacher:[["他今天自己算出一題分數",3],["他的基礎要從國一的分數補起",3],["下週開始提早半小時來",2],["他上課會畫畫，畫得很像",1],["他上課手機沒關聲音",0],["段考數學 C，全班最低",0]],
   jh:[["英文 A，但作文扣分最多，可以多練寫作",3],["她被學校選去參加英文演講比賽",3],["上課很認真，常幫同學解釋單字",2],["班上排第三，前兩名差一分",1],["這次段考比較簡單",0],["其他同學也都考得不錯",0]],
   care:[["李阿嬤明天中午會晚十分鐘",3],["張媽媽下週一要帶孩子來試讀",3],["小米媽媽今天會晚到",2],["小宇的數習第二題要訂正",1],["點心布丁剩三個",0],["下午影印機沒有卡紙",0]],
   boss:[["櫃台只有一個人，放學高峰顧不過來",3],["有學生從國一就跟不上，需要基礎班",3],["影印機老舊，每天卡紙影響上課",2],["對面打八折，家長在比價",1],["本週續班率比上週低",0],["老師們都很努力",0]]},
  mount(el,done){const list=this.sets[G.line.id]||this.sets.teacher,pick=new Set(),order=list.map((_,i)=>i).sort(()=>Math.random()-.5);
    el.innerHTML=`<div class="choices">${order.map(i=>`<button class="choice" data-i="${i}" aria-pressed="false">${esc(list[i][0])}</button>`).join("")}</div><p class="feed" aria-live="polite">選 3 件。</p><div class="actions" hidden><button class="go" data-call>就講這三件</button></div>`;
    const feed=el.querySelector(".feed"),act=el.querySelector(".actions");
    el.querySelectorAll("[data-i]").forEach(b=>b.addEventListener("click",()=>{const i=+b.dataset.i;if(act.dataset.done)return;
      if(pick.has(i))pick.delete(i);else if(pick.size<3)pick.add(i);
      el.querySelectorAll("[data-i]").forEach(x=>{const on=pick.has(+x.dataset.i);x.setAttribute("aria-pressed",on);x.style.borderColor=on?"var(--ink)":"";x.style.background=on?"var(--surface)":"";});
      feed.textContent=`已選 ${pick.size} / 3。`;act.hidden=pick.size!==3;}));
    act.querySelector("[data-call]").onclick=()=>{act.dataset.done=1;act.hidden=true;let v=0;pick.forEach(i=>v+=list[i][1]);
      el.querySelectorAll("[data-i]").forEach(x=>{const w=list[+x.dataset.i][1];if(w>=2)x.style.borderColor="var(--green)";x.disabled=true;});
      feed.textContent=v>=7?"三件都說到重點了。":v>=4?"有說到一些重點。綠框的是最重要的。":"重點好像沒說到。綠框的才是最重要的。";done({v});};}
};
/* 排順序：依序點，點的順序就是答案 */
MINIS.order={
  head:"排順序",zone:"順序",title:"照順序點",cost:4,
  get intro(){return {teacher:"五題例題，由淺到深點一次。點的順序就是上課的順序。",yun:"五通要回的電話，最急的先點。點的順序就是回電的順序。",jh:"把字照正確的句子順序點一次。"}[G&&G.line.id]||"照順序點。";},
  sets:{teacher:["分數的通分","一元一次方程式","因式分解","配方法","一元二次方程式應用題"],
        yun:["王媽媽：已經在樓下等","陳爸爸：九點要接小柏","林媽媽：退費進度","高二家長：問講義","廠商：影印機保養"]},
  mount(el,done){const list=this.sets[G.line.id]||this.sets.teacher,seq=[],order=list.map((_,i)=>i).sort(()=>Math.random()-.5);
    el.innerHTML=`<div class="choices">${order.map(i=>`<button class="choice" data-n="${i}"><span class="ord"></span>${esc(list[i])}</button>`).join("")}</div><p class="feed" aria-live="polite">點第 1 個。</p>`;
    const feed=el.querySelector(".feed");
    el.querySelectorAll("[data-n]").forEach(b=>b.addEventListener("click",()=>{if(b.disabled)return;b.disabled=true;seq.push(+b.dataset.n);b.querySelector(".ord").textContent=seq.length+"．";
      if(seq.length<list.length){feed.textContent=`點第 ${seq.length+1} 個。`;return;}
      const right=seq.filter((v,k)=>v===k).length;
      el.querySelectorAll("[data-n]").forEach(x=>{const k=seq.indexOf(+x.dataset.n);x.style.borderColor=k===+x.dataset.n?"var(--green)":"var(--red)";});
      feed.innerHTML=`${right} / ${list.length} 個放對位置。正確順序：${list.map((s,i)=>`${i+1}. ${esc(s)}`).join("　")}`;done({right});}));}
};
