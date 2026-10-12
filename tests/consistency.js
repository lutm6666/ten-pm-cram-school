const {chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const fails=[];
  const assert=(ok,msg,detail)=>{console.log(ok?'✓':'✗',msg,detail||'');if(!ok)fails.push(msg+(detail?' '+detail:''));};
  const vis=s=>p.isVisible(s).catch(()=>false);
  async function start(line){
    await p.goto('file://'+__dirname+'/test.html');
    await p.evaluate(()=>localStorage.clear());await p.reload();
    if(line!=='teacher')await p.click(`[data-role=${line}]`);
    await p.click('[data-act=start]');
    if(await vis('[data-act=chapterGo]'))await p.click('[data-act=chapterGo]');
    await p.waitForTimeout(120);
  }
  async function audit(){return p.evaluate(()=>window.__consistencyAudit());}

  // 1) 任何從門口走向定點的主線 NPC，在真正抵達前都不能搶跑互動。
  await start('care');
  await p.evaluate(()=>__dbg.jump('c_handoff'));
  await p.waitForTimeout(120);
  let a=await audit();
  const yunMoving=a.movingNpcs.includes('yun');
  assert(yunMoving,'小芸進場時確實處於移動狀態',JSON.stringify(a));
  if(yunMoving){
    const t=await p.evaluate(()=>__dbg.targetOf(__dbg.G.steps[__dbg.G.idx].target));
    await p.evaluate(t=>__dbg.tp(t.x,t.z),t);await p.waitForTimeout(150);
    const early=await p.evaluate(()=>{const n=__dbg.near();return n&&n.type;});
    assert(early!=='main','NPC 尚未到定點時不能提前執行主線',String(early));
    for(let i=0;i<80;i++){await p.waitForTimeout(100);a=await audit();if(!a.movingNpcs.includes('yun'))break;}
    const t2=await p.evaluate(()=>__dbg.targetOf(__dbg.G.steps[__dbg.G.idx].target));
    await p.evaluate(t=>__dbg.tp(t.x,t.z),t2);await p.waitForTimeout(180);
    const after=await p.evaluate(()=>{const n=__dbg.near();return n&&n.type;});
    assert(after==='main','NPC 抵達定點後主線才可互動',String(after));
  }

  // 2) 安親班劇情明定接 8 個小朋友，場景也必須是 8 個。
  await start('care');
  await p.evaluate(()=>__dbg.jump('c_homework'));
  await p.waitForTimeout(7200);
  a=await audit();
  assert(a.totalCareKids===8,'安親班到班後場景總數為 8 個小朋友',JSON.stringify(a));

  // 主任說 17:30 回分校，點心段落要真的看得到他從門口回來。
  await p.evaluate(()=>__dbg.jump('c_snack'));await p.waitForTimeout(150);
  a=await audit();
  assert(a.movingNpcs.includes('boss'),'17:30 左右主任真的回到分校',JSON.stringify(a));

  // 3) 18:20 只剩小米，高三背景生已實際坐進 B 班，而不是只在 elsewhere visible。
  await p.evaluate(()=>__dbg.jump('c_late'));
  await p.waitForTimeout(350);
  a=await audit();
  assert(a.visibleBackgroundKids===0&&a.totalCareKids===1,'18:20 安親班只剩最後一位小朋友',JSON.stringify(a));
  assert(a.seatedHigh===16,'18:20 高三背景學生已坐進 B 班等待 18:30 上課',JSON.stringify(a));

  // 4) 國中部 17:30 尚未到班，18:30 則應是 9 人且都已坐定。
  await start('jh');
  a=await audit();
  assert(a.visibleJh===0&&a.namedJh.length===0,'17:30 國中生不會提早坐滿 C 班',JSON.stringify(a));
  await p.evaluate(()=>__dbg.jump('j_class'));await p.waitForTimeout(250);
  a=await audit();
  assert(a.visibleJh+a.namedJh.length===9,'18:30 C 班畫面與「九個人」一致',JSON.stringify(a));
  assert(a.jhClassReady===true&&!a.movingNpcs.includes('xiang')&&!a.movingNpcs.includes('qing'),'18:30 阿翔、子晴與背景學生都已坐定再開始上課',JSON.stringify(a));

  // 5) 晚間共用時間線：17:20 高三背景生與自習生都尚未到，之後依課表出現。
  await start('teacher');
  a=await audit();
  assert(a.trial2Visible===true,'兩位試聽生的第二位有實際場景模型',JSON.stringify(a));
  assert(a.visibleHigh===0,'17:20 高三背景學生尚未提早坐滿教室',JSON.stringify(a));
  assert(a.visibleStudy===0,'17:20 自習室背景學生尚未提早出現',JSON.stringify(a));
  await p.evaluate(()=>__dbg.jump('erase'));await p.waitForTimeout(250);
  a=await audit();
  assert(a.visibleHigh>0&&a.visibleStudy===0,'18:30 高三已到班，但 19:00 自習背景生仍未提早出現',JSON.stringify(a));
  await p.evaluate(()=>__dbg.jump('zhe'));await p.waitForTimeout(1200);
  a=await audit();
  assert(a.visibleStudy>0,'19:00 後自習室背景學生開始進場',JSON.stringify(a));

  await b.close();
  if(fails.length){console.error('\nConsistency failures:\n- '+fails.join('\n- '));process.exit(1);}
  console.log('\nNarrative/scene consistency checks passed.');
})();
