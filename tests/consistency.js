// 內容一致性：國小＋國中版的劇本、事件、閒聊、物品不能殘留高中版的設定，
// 每一段對話的說話者、每一個 NPC 站位都要指向存在的人物與地點，
// 並且在「全部旗標都沒有」「全部旗標都有」兩種極端下都能產生對話與選項。
// 先建測試頁：python3 build.py stub.js tests/test.html
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path');
const SRC=path.join(__dirname,'..','src');
const CONTENT=fs.readdirSync(SRC).filter(f=>/^(line_|day2)/.test(f)).concat(['events.js','overtime.js','chats.js','items.js','sides.js','rush.js','ach.js','minis.js','common.js','cast.js']);
const BANNED=['高三','高一','高二','學測','模考','向量','內積','B 班','C 班','自習室','助教','配方法','一元二次','畢氏','墊子','兔子娃娃','段考數學又是 C'];
const fails=[];const check=(ok,msg)=>{if(!ok)fails.push(msg);};
for(const f of CONTENT){const text=fs.readFileSync(path.join(SRC,f),'utf8');
  text.split('\n').forEach((line,i)=>{for(const w of BANNED)if(line.includes(w))fails.push(`${f}:${i+1} 殘留高中版用語「${w}」`);});}
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+__dirname+'/test.html');await p.waitForTimeout(300);
  const out=await p.evaluate(()=>{const {LINES,LINES2,EVENTS,OT_EVENTS,SPOTS,CHARS}=__dbg,bad=[];
    const flagsOf=L=>{const set=new Set();const scan=o=>{if(!o||typeof o!=="object")return;if(o.set)Object.keys(o.set).forEach(k=>set.add(k));Object.values(o).forEach(v=>{if(Array.isArray(v))v.forEach(scan);});};return set;};
    // 全部線第一天出現過的旗標（用原始碼字串抓，涵蓋函式裡的 set）
    const src=[...Object.values(LINES),...Object.values(LINES2)].map(L=>L.steps.map(s=>String(s.choices)+String(s.pages)).join('')).join('')+EVENTS.map(e=>String(e.make)).join('');
    const allFlags=new Set([...src.matchAll(/set:\{([^}]*)\}/g)].flatMap(m=>m[1].split(',').map(x=>x.split(':')[0].trim()).filter(Boolean)));
    const ok=(v)=>v==null||Array.isArray(v)&&v.length>=2&&typeof v[0]==="number";
    const who=(id,where)=>{if(id!==null&&id!=="me"&&!CHARS[id])bad.push(`${where}：說話者 ${id} 不存在`);};
    const mkG=(L,day,full)=>{const f={},prev={},prevAll={};if(full){allFlags.forEach(k=>{f[k]=1;prev[k]=1;});["care","jh","teacher","yun","boss"].forEach(id=>prevAll[id]={f:{...prev}});}
      return {line:L,day,f,prev,prevAll,s:Object.fromEntries(Object.keys(L.stats).map(k=>[k,50])),h:{trial:50,ret:74,missed:2,cleared:1,cash:0,...L.hidden},items:full?["glasses","earphone","zhedraw"]:[],clock:12*60,time:"12:00",minis:{},log:[],idx:0,steps:L.steps,sidesDone:{},chatUsed:[],chatWith:[]};};
    const R={ok:3,drop:1,wrong:1,miss:1,hits:2,right:3,tears:1,score:3,mood:5,anger:30,v:6,left:1,trap:false,bills:3,diff:0,bad:0};
    const runStep=(st,G,where)=>{let pages;try{G.idx=G.steps.indexOf(st);pages=typeof st.pages==="function"?st.pages(G):st.pages;}catch(e){bad.push(`${where} pages 例外：${e.message}`);return;}
      if(!pages||!pages.length)bad.push(`${where} 沒有對話`);(pages||[]).forEach(pg=>who(pg[0],where));
      let ch;try{ch=typeof st.choices==="function"?st.choices(G):st.choices;}catch(e){bad.push(`${where} choices 例外：${e.message}`);return;}
      (ch||[]).forEach((c,i)=>{try{const res=typeof c.res==="function"?c.res(c.mini?R:G):c.res;(res||[]).forEach(pg=>who(pg[0],`${where} 選項 ${i}`));
        const fx=typeof c.fx==="function"?c.fx(c.mini?R:G):c.fx;if(fx&&Object.values(fx).some(v=>typeof v!=="number"||isNaN(v)))bad.push(`${where} 選項 ${i} 數值不是數字`);
        if(c.mini&&!__dbg.MINIS[c.mini])bad.push(`${where} 小遊戲 ${c.mini} 不存在`);
        if(typeof c.log==="function")c.log(R);}catch(e){bad.push(`${where} 選項 ${i} 例外：${e.message}`);}});
      for(const k of ["npc","after"])if(st[k])for(const id in st[k]){if(!CHARS[id])bad.push(`${where} ${k} 人物 ${id} 不存在`);let v;try{v=typeof st[k][id]==="function"?st[k][id](G):st[k][id];}catch(e){bad.push(`${where} ${k}.${id} 例外`);continue;}if(!ok(v))bad.push(`${where} ${k}.${id} 站位格式錯誤`);}
      let t;try{t=typeof st.target==="function"?st.target(G):st.target;}catch(e){bad.push(`${where} target 例外`);}
      if(t&&t.spot&&!SPOTS[t.spot])bad.push(`${where} 地點 ${t.spot} 不存在`);if(t&&t.npc&&!CHARS[t.npc])bad.push(`${where} 人物 ${t.npc} 不存在`);};
    for(const [L,day] of [...Object.values(LINES).map(L=>[L,1]),...Object.values(LINES2).map(L=>[L,2])]){
      for(const full of [false,true]){const G=mkG(L,day,full);window.G_TEST=G;
        // 對話函式裡讀的是全域 G：暫時換成測試用的 G
        const real=__dbg.G;__dbg.setG&&__dbg.setG(G);
        L.steps.forEach(st=>runStep(st,G,`${L.id}@${day}${full?"(全旗標)":""}.${st.id}`));
        EVENTS.filter(e=>(!L.events||L.events.includes(e.id))&&(!e.lines||e.lines.includes(L.id))).forEach(e=>{if(e.id==="quake")return;runStep({...e.make(),id:"ev_"+e.id},G,`${L.id}@${day} 事件 ${e.id}`);});
        OT_EVENTS.filter(e=>e.lines.includes(L.id)).forEach(e=>runStep({...e.make(L.id),id:"ot_"+e.id},G,`${L.id}@${day} 加班 ${e.id}`));
        __dbg.setG&&__dbg.setG(real);}
      if(!L.ending)bad.push(`${L.id}@${day} 沒有結局`);
    }
    for(const id in __dbg.CHATS||{})if(!CHARS[id])bad.push(`閒聊 ${id} 不是人物`);
    for(const L of Object.values(LINES))for(const id of (L.chats||[]))if(!(__dbg.CHATS||{})[id])bad.push(`${L.id} 的閒聊名單有 ${id}，但沒有閒聊內容`);
    return bad;});
  out.forEach(m=>fails.push(m));errs.forEach(e=>fails.push('頁面錯誤：'+e));
  await b.close();
  if(fails.length){console.log(fails.slice(0,80).join('\n'));console.log(`內容一致性：${fails.length} 個問題`);process.exit(1);}
  console.log('內容一致性 OK');})();
