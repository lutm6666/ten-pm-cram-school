// 2026-10-15 GPT 程式檢查回報的回歸測試：小遊戲中開設定、點名人數、短款、報名紀錄、加班扣時、第二天支線。
// 先建測試頁：python3 build.py stub.js tests/test.html
const {chromium}=require('playwright');
const fails=[];const check=(ok,msg)=>{if(!ok)fails.push(msg);};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(300);
  await p.click('[data-role=care]');await p.click('[data-act=start]');await p.waitForTimeout(300);
  if(await p.isVisible('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');

  // 1. 小遊戲中開設定，關掉後回到原小遊戲
  await p.evaluate(()=>{window.__r=null;__dbg.runMini('kidroll3',r=>{window.__r=r;});});
  await p.evaluate(()=>document.querySelector('[data-act=settings]').click());
  check(await p.evaluate(()=>document.querySelector('#sheet .shead span').textContent)==='設定','設定沒有打開');
  await p.click('#sheet [data-act=closeSheet]');
  check(await p.evaluate(()=>!!document.querySelector('#miniArea [data-n]')),'關掉設定後小遊戲不見了');

  // 2. 三人缺席：找到兩人不算完成
  for(const n of ['小宇','小米'])await p.click(`#miniArea [data-n="${n}"]`);
  check(!(await p.isVisible('[data-act=miniOk]')),'三人點名找到兩人就完成');
  await p.click('#miniArea [data-n="阿凱"]');check(await p.isVisible('[data-act=miniOk]'),'三人都找到後沒有完成');
  await p.click('[data-act=miniOk]');

  const r=await p.evaluate(()=>{const G=__dbg.G,out={};
    // 3. 現金短款保留正負號
    const keep={...G.h};
    const step={choices:()=>[]};
    G.h.cash=0;
    const fx=__dbg.LINES.yun.steps.find(s=>s.id==='y_pay').choices(G)[0].fx({right:false,diff:-600});out.fx=fx.cash;
    // 4. 報名紀錄：櫃台「說名額快滿了」、主任「早鳥價」
    const yun=__dbg.LINES.yun.steps.find(s=>s.id==='y_enroll'),boss=__dbg.LINES.boss.steps.find(s=>s.id==='b_enroll');
    G.h.trial=60;const pushOpt=yun.choices(G).find(c=>c.label.includes('名額'));const f={};pushOpt.onResolve({...G,f,h:G.h});out.yunEnroll=f.enrolled;
    G.h.trial=50;const bossOpt=boss.choices(G).find(c=>c.label.includes('早鳥'));const f2={};if(bossOpt)bossOpt.onResolve({...G,f:f2,h:G.h});out.bossEnroll=bossOpt?f2.enrolled:'no-option';
    Object.assign(G.h,keep);
    // 6. 第二天支線：每個位子都有第二天專屬支線，而且時間窗是第二天的場景
    out.sides={};for(const id in __dbg.SIDES){const ids=__dbg.LINES2[id].steps.map(s=>s.id);out.sides[id]=__dbg.SIDES[id].filter(s=>s.day===2).map(s=>ids.indexOf(s.from)>=0&&ids.indexOf(s.until)>=ids.indexOf(s.from));}
    return out;});
  check(r.fx===-600,'短款金額沒有傳出 -600：'+r.fx);
  check(r.yunEnroll===1,'櫃台說名額快滿、家長答應報名，沒有記錄');
  check(r.bossEnroll===1||r.bossEnroll==='no-option','主任給早鳥價、家長答應報名，沒有記錄');
  for(const id in r.sides)check(r.sides[id].length>=1&&r.sides[id].every(Boolean),`${id} 第二天支線缺少或時間窗無效`);

  // 5. 加班小遊戲只扣一次時間：選項寫 8 分鐘，就只過 8 分鐘
  const t=await p.evaluate(async()=>{const G=__dbg.G,before=G.clock;await new Promise(res=>{__dbg.runMini('jam',()=>res(),8);document.querySelectorAll('#miniArea *').length;
    // 直接按完成：jam 小遊戲需要點，這裡用 miniOk 的路徑模擬結束
    const ok=document.querySelector('[data-act=miniOk]');document.getElementById('miniDone').hidden=false;ok.click();});return G.clock-before;});
  check(Math.abs(t-8)<.01,'小遊戲扣時不是選項寫的 8 分鐘：'+t);

  errs.forEach(e=>fails.push('頁面錯誤：'+e));await b.close();
  if(fails.length){console.log(fails.join('\n'));process.exit(1);}
  console.log('回報修正 OK',JSON.stringify(r.sides));})();
