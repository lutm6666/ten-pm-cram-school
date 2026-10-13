// 檢查每條線（第一天、第二天）步驟時間不倒退，事件插槽落在前後步驟之間，加班事件在最後一步之後。
// 先建測試頁：python3 build.py stub.js tests/test.html
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(300);
const bad=await p.evaluate(()=>{const {LINES,LINES2,EVENTS,EVENT_SLOTS,OT_EVENTS,SPOTS,CHARS}=__dbg;const out=[],tm=s=>{const [h,m]=s.split(':').map(Number);return h*60+m;};
  const all=[...Object.values(LINES).map(L=>[L,1]),...Object.values(LINES2).map(L=>[L,2])];
  for(const [L,day] of all){const tag=`${L.id}@${day}`,st=L.steps;
    for(let i=1;i<st.length;i++)if(tm(st[i].t)<tm(st[i-1].t))out.push(`${tag}: ${st[i].id} ${st[i].t} 早於 ${st[i-1].id} ${st[i-1].t}`);
    for(const s of st){if(s.chapter&&tm(s.chapter.t)>tm(s.t))out.push(`${tag}: ${s.id} 章節 ${s.chapter.t} 晚於步驟 ${s.t}`);if(!s.auto&&!s.target)out.push(`${tag}: ${s.id} 沒有 target`);}
    const slots=L.eventSlots||EVENT_SLOTS[L.id]||[];
    for(const sl of slots){const i=st.findIndex(s=>s.id===sl.after);if(i<0){out.push(`${tag}: 插槽 after ${sl.after} 找不到`);continue;}
      if(tm(sl.t)<tm(st[i].t))out.push(`${tag}: 插槽 ${sl.t} 早於 ${sl.after} ${st[i].t}`);
      if(st[i+1]&&tm(sl.t)>tm(st[i+1].t))out.push(`${tag}: 插槽 ${sl.t} 晚於下一步 ${st[i+1].id} ${st[i+1].t}`);
      const pool=EVENTS.filter(e=>(!L.events||L.events.includes(e.id))&&(!e.lines||e.lines.includes(L.id))&&e.phases.includes(sl.phase));if(!pool.length)out.push(`${tag}: 插槽 ${sl.t}（${sl.phase}）沒有可用事件`);}
    const end=tm(L.endAt||'22:00'),last=st[st.length-1];if(tm(last.t)>end-4)out.push(`${tag}: 最後一步 ${last.t} 太接近下班 ${L.endAt}`);
    for(const s of st){if(s.target&&typeof s.target!=='function'&&s.target.spot&&!SPOTS[s.target.spot])out.push(`${tag}: ${s.id} 地點 ${s.target.spot} 不存在`);if(s.target&&typeof s.target!=='function'&&s.target.npc&&!CHARS[s.target.npc])out.push(`${tag}: ${s.id} 人物 ${s.target.npc} 不存在`);}
  }
  for(const e of OT_EVENTS)for(const id of e.lines){const L=LINES[id];const s=e.make(id);if(s.target&&s.target.spot&&!SPOTS[s.target.spot])out.push(`加班 ${e.id}@${id}: 地點 ${s.target.spot} 不存在`);}
  return out;});
console.log(bad.length?bad.join('\n'):'timeline ok');if(errs.length)console.log(errs);await b.close();process.exit(bad.length||errs.length?1:0);})();
