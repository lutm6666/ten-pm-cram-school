// Advance scheduled waits through the production frame loop, without changing
// G.clock or G.idx. Walking and interaction checks keep their original bounds.
const assert=require('assert'),fs=require('fs'),path=require('path');
const CLOCK_PROBE='window.__clockTest={tickClock,simulateFrame,clockT,MIN_PER_SEC,get G(){return G},get mode(){return mode},get speed(){return SET.speed}};';
function withClockProbe(html){
  const at=html.lastIndexOf('})();');
  assert(at>=0,'test page must contain the game closure');
  return html.slice(0,at)+CLOCK_PROBE+html.slice(at);
}
async function installClockProbe(page,pageUrl){
  const url=pageUrl||'file://'+path.join(__dirname,'test.html');
  await page.route(url,async route=>{
    if(url.startsWith('file:'))return route.fulfill({body:withClockProbe(fs.readFileSync(path.join(__dirname,'test.html'),'utf8')),contentType:'text/html'});
    const response=await route.fetch();
    return route.fulfill({response,body:withClockProbe(await response.text())});
  });
}
async function waitForStep(page){
  const start=await page.evaluate(()=>{
    const q=window.__clockTest,g=q&&q.G,st=g&&g.steps[g.idx];
    if(!st||g.stepReady!==false)return null;
    const [h,m]=st.t.split(':').map(Number);
    return {idx:g.idx,id:st.id,clock:g.clock,at:h*60+m,mode:q.mode};
  });
  if(!start)return false;
  assert.strictEqual(start.mode,'walk',`${start.id}: a scheduled wait must allow walking`);
  assert(start.clock<start.at,`${start.id}: pending task activated too early or failed to activate at its time`);
  let last=start;
  for(let batch=0;batch<1500;batch++){
    const beforeClock=last.clock;
    last=await page.evaluate(()=>{
      const q=window.__clockTest,g=q.G,st=g.steps[g.idx];
      const [h,m]=st.t.split(':').map(Number),at=h*60+m;
      for(let i=0;i<200&&g.stepReady===false;i++){
        if(q.mode!=='walk'||q.speed<=0)break;
        const dt=Math.min(.05,Math.max(0,(at-g.clock)/(q.MIN_PER_SEC*q.speed)));
        q.clockT.elapsedTime+=dt;
        q.simulateFrame(dt,q.clockT.elapsedTime);
      }
      return {idx:g.idx,id:g.steps[g.idx]?.id,clock:g.clock,ready:g.stepReady,mode:q.mode};
    });
    assert.strictEqual(last.idx,start.idx,`${start.id}: waiting must not skip a task`);
    assert.strictEqual(last.id,start.id,`${start.id}: waiting must preserve task identity`);
    if(last.ready){
      assert(last.clock>=start.at,`${start.id}: task activated before ${start.at}`);
      console.log('scheduled wait',start.id,`${start.clock.toFixed(3)} -> ${last.clock.toFixed(3)}`,last.mode);
      return true;
    }
    assert(last.clock<start.at,`${start.id}: scheduled task stayed locked after its time`);
    assert.strictEqual(last.mode,'walk',`${start.id}: waiting interrupted free movement`);
    assert(last.clock>beforeClock,`${start.id}: production clock stopped during scheduled waiting`);
  }
  throw new Error(`scheduled wait did not progress: ${JSON.stringify(last)}`);
}
async function settleScheduled(page,drain){
  for(let i=0;i<60;i++){
    if(!await waitForStep(page))return;
    await drain();
  }
  throw new Error('scheduled task chain did not settle');
}
module.exports={CLOCK_PROBE,withClockProbe,installClockProbe,waitForStep,settleScheduled};
