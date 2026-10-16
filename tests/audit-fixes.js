// 2026-10-16 正式站實玩檢查（F01–F09）的回歸測試。
// 先建測試頁：python3 build.py stub.js tests/test.html
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const fails=[];const check=(ok,msg)=>{if(!ok)fails.push(msg);};

// F01：選項結果寫了「N 分鐘後／等了 N 分鐘／講了 N 分鐘」，就要用 min 把時間算進去（小遊戲自己會算時間）。
const SRC=path.join(__dirname,'..','src');
const SPAN=/(分鐘後|等了[^，。」]{0,4}分鐘|講了[^，。」]{0,4}分鐘|花了[^，。」]{0,4}分鐘|用[^，。」]{0,3}分鐘)/;
for(const f of fs.readdirSync(SRC).filter(f=>f.endsWith('.js')))
  fs.readFileSync(path.join(SRC,f),'utf8').split('\n').forEach((line,i)=>{
    if(/\{label:/.test(line)&&SPAN.test(line)&&!/\bmin:\d/.test(line)&&!/\bmini:/.test(line))fails.push(`${f}:${i+1} 結果寫了經過的時間，選項卻沒有 min`);});

(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/'+(process.env.TEST_HTML||'test.html'));await p.waitForTimeout(300);

  const r=await p.evaluate(()=>{const {LINES,LINES2,OT_EVENTS,CHATS}=__dbg,out={};
    const st=(L,id)=>L.steps.find(s=>s.id===id);
    const text=pages=>(pages||[]).map(x=>typeof x[1]==="string"?x[1]:"").join("");
    const mkG=(L,day,f={},prev={},prevAll={},clock=18*60)=>({line:L,day,f,prev,prevAll,s:Object.fromEntries(Object.keys(L.stats).map(k=>[k,50])),h:{trial:50,cash:0,...L.hidden},items:[],clock,time:"18:00",minis:{},log:[],idx:0,steps:L.steps,sidesDone:{},chatUsed:[],chatWith:[]});
    const real=__dbg.G;
    // F01 重印：17:4x 的結果不能先說六點零五分送到；上課時才送進來
    const check=st(LINES.teacher,"t_check").choices(mkG(LINES.teacher,1)).find(c=>c.set&&c.set.reprint);
    out.reprintNow=text(check.res);
    {const G=mkG(LINES.teacher,1,{reprint:1});__dbg.setG(G);
     out.reprintLater=st(LINES.teacher,"t_lesson1").choices(G).map(c=>text(typeof c.res==="function"?c.res(c.mini?{right:4,mood:7,hits:2}:G):c.res));__dbg.setG(real);}
    // F02 延後收費：當場收完、開收據，並花時間
    const wait=st(LINES.yun,"y_pay").choices(mkG(LINES.yun,1)).find(c=>c.label.includes("等一下"));
    out.payWait={min:wait.min,set:wait.set};
    // F03 前一天已轉接班導
    {const G=mkG(LINES2.yun,2,{},{teacherNoBreak:1});out.lin=text(st(LINES2.yun,"y2_lin").pages(G));}
    // F04 打給家長之後要等到人接走
    {const ev=OT_EVENTS.find(e=>e.id==="pickup").make("yun");const G=mkG(LINES.yun,2);__dbg.setG(G);const c=ev.choices(G).find(c=>c.label.includes("打給家長"));out.pickup={min:c.min,res:text(c.res)};__dbg.setG(real);}
    // F05 小芸閒聊：前一天只加薪、沒答應下來顧櫃台
    {const q=CHATS.yun.qs.find(q=>q.q.includes("放學那一小時"));const ans={};
     for(const [k,prev,clock] of [["raiseBefore",{yunStay:1},16*60],["raiseAfter",{yunStay:1},21*60+9],["deskBefore",{yunStay:1,bossDesk:1},16*60],["deskAfter",{yunStay:1,bossDesk:1},21*60+9]]){
       const G=mkG(LINES2.boss,2,{},prev,{},clock);__dbg.setG(G);const a=q.a["d2.boss"];ans[k]=typeof a==="function"?a(G):a;}
     __dbg.setG(real);out.chat=ans;}
    // F07 數學老師只回想實際說過的話
    {const G=mkG(LINES2.teacher,2,{boMental:1},{},{boss:{f:{}}});__dbg.setG(G);const c=st(LINES2.teacher,"t2_boss").choices(G).find(c=>c.label.includes("八年級我可以"));out.take8=c?text(c.res):"no-option";__dbg.setG(real);}
    // F08 週三第一節是英文模擬考
    {const B=LINES2.jh.bells.class;const at=m=>(typeof B==="function"?B({...mkG(LINES2.jh,2),clock:m}):B).join("");out.bell18=at(18*60);out.bell1935=at(19*60+35);out.day1bell=LINES.jh.bells.class.join("");}
    return out;});
  check(!/六點零五/.test(r.reprintNow),'F01 重印的結果仍然在 17:4x 說六點零五分送到');
  check(r.reprintLater.length&&r.reprintLater.every(t=>t.includes("第二頁送進來")),'F01 上課時沒有交代重印的第二頁送到');
  check(r.payWait.min>0&&r.payWait.set&&r.payWait.set.paid===1,'F02 延後收費沒有收尾或沒花時間：'+JSON.stringify(r.payWait));
  check(r.lin.includes("鄭老師")&&!r.lin.includes("老師在忙"),'F03 林媽媽忽略昨天已轉接班導：'+r.lin);
  check(r.pickup.min>=21&&r.pickup.res.includes("上車"),'F04 打給家長後沒有等到接走：'+JSON.stringify(r.pickup));
  check(!r.chat.raiseBefore.includes("昨天你說要下來")&&!r.chat.raiseAfter.includes("昨天你說要下來"),'F05 只加薪卻被說成答應下來顧櫃台：'+JSON.stringify(r.chat));
  check(r.chat.deskBefore.includes("今天會來嗎")&&!r.chat.deskAfter.includes("今天會來嗎"),'F05 放學後還在問今天會不會來：'+JSON.stringify(r.chat));
  check(r.take8!=="no-option"&&!r.take8.includes("問我爸")&&!r.take8.includes("問他爸"),'F07 回想了沒選過的工地對話：'+r.take8);
  check(r.bell18.includes("英文")&&!r.bell18.includes("許老師開始上課"),'F08 週三第一節的上課通知不是英文模擬考：'+r.bell18);
  check(r.bell1935.includes("許老師"),'F08 週三第二節的上課通知沒有許老師：'+r.bell1935);
  check(r.day1bell.includes("許老師"),'F08 週二的上課通知被改掉了');

  // F06、F09：實際進入班導週二，打給阿翔媽媽，選「下樓當面說」
  await p.evaluate(()=>{localStorage.clear();});await p.reload();await p.waitForTimeout(200);
  await p.click('[data-role=jh]');await p.click('[data-act=start]');await p.waitForTimeout(200);
  if(await p.isVisible('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');
  await p.evaluate(()=>{__dbg.tp(...__dbg.SPOTS.c9door.pos);__dbg.jump('j_callma');});
  for(let i=0;i<20&&!(await p.isVisible('#dlg .choice'));i++){if(await p.isVisible('[data-act=dnext]'))await p.click('[data-act=dnext]');else await p.waitForTimeout(100);}
  const before=await p.evaluate(()=>({clock:__dbg.G.clock}));
  const idx=await p.evaluate(()=>[...document.querySelectorAll('#dlg .choice')].findIndex(b=>b.textContent.includes('下樓跟您當面說')));
  check(idx>=0,'F09 找不到「下樓跟您當面說」選項');
  if(idx>=0){await p.click(`#dlg .choice >> nth=${idx}`);await p.waitForTimeout(150);
    const s=await p.evaluate(()=>{const pos=__dbg.pos(),st=__dbg.npcState();const ma=st.find(n=>n.id==="xiangma");
      const spk=document.querySelector('#dlg .spk small')?.textContent||"";
      return {pos,blocked:__dbg.blockedAt(pos[0],pos[1]),floorX:pos[0],ma:!!ma,maDist:ma?Math.hypot(ma.x-pos[0],ma.z-pos[1]):null,clock:__dbg.G.clock,spk};});
    const lobby=await p.evaluate(()=>__dbg.SPOTS.counter.pos[0]);
    check(Math.abs(s.floorX-lobby)<6,'F09 玩家沒有到一樓大廳：'+JSON.stringify(s.pos));
    check(!s.blocked,'F09 玩家被放在家具裡：'+JSON.stringify(s.pos));
    check(s.ma&&s.maDist<3,'F09 阿翔媽媽不在玩家面前：'+s.maDist);
    check(s.clock>before.clock,'F09 搭電梯下樓沒有花時間');}

  // F06：林媽媽本人在場時，副標不能是「電話中」
  const sub=await p.evaluate(()=>{const sp=__dbg.speaker;if(!sp)return {missing:true};
    __dbg.placeNPC("mom",__dbg.SPOTS.counter.pos[0]-.8,__dbg.SPOTS.counter.pos[1]+.8);const here=sp("mom");__dbg.placeNPC("mom",null);const phone=sp("mom");return {here,phone};});
  check(!sub.missing,'F06 測試頁沒有輸出 speaker');
  if(!sub.missing){check(!sub.here.title.includes("電話中")&&sub.here.abbr!=="☎",'F06 本人在場仍顯示電話中：'+JSON.stringify(sub.here));
    check(sub.phone.title.includes("電話中"),'F06 打電話時的副標被改掉了');}

  errs.forEach(e=>fails.push('頁面錯誤：'+e));await b.close();
  if(fails.length){console.log(fails.join('\n'));process.exit(1);}
  console.log('實玩檢查 F01–F09 OK');})();
