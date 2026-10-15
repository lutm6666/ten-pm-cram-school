// npm install; python3 build.py --dbg <local-three.js-path> tests/shots.html
// node tools/render-og.cjs [output.png]
// Uses actual redesigned rooms, not a mockup. Requires a Traditional Chinese font.
const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),output=process.argv[2]||path.join(root,'assets/og.png');
(async()=>{
  const browser=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:650}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('**/shots.html',route=>{
      let html=fs.readFileSync(path.join(root,'tests/shots.html'),'utf8');
      const at=html.lastIndexOf('})();');
      html=html.slice(0,at)+'window.__ogFloor=showFloor;'+html.slice(at);
      return route.fulfill({contentType:'text/html',body:html});
    });
    await page.goto('file://'+path.join(root,'tests/shots.html'));
    await page.waitForFunction(()=>!!window.__dbg);
    const capture=async(role,step,x,z,floor)=>{
      await page.reload();await page.waitForFunction(()=>!!window.__dbg);
      await page.click(`[data-role="${role}"]`);await page.click('[data-act="start"]');
      if(await page.isVisible('[data-act="chapterGo"]'))await page.click('[data-act="chapterGo"]');
      await page.evaluate(([step,x,z,floor])=>{
        __dbg.jump(step);__dbg.tp(x,z,0);__dbg.CAM.zoom=1.28;__dbg.CAM.tilt=1.1;__ogFloor(floor);
      },[step,x,z,floor]);
      await page.addStyleTag({content:'body>*:not(#stage){visibility:hidden!important}'});
      await page.waitForTimeout(1400);
      return (await page.screenshot()).toString('base64');
    };
    const care=await capture('care','c_homework',62.6,4.4,1);
    const jh=await capture('teacher','t_lesson1',120.6,4.4,2);
    if(errors.length)throw new Error(errors.join('\n'));
    await page.setViewportSize({width:1200,height:630});
    await page.setContent(`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;background:#172c38;color:#fff;font-family:'Noto Sans TC','Noto Sans CJK TC',sans-serif}
      .copy{position:absolute;left:48px;top:42px;width:410px;height:550px}.eyebrow{color:#b8cccb;font-size:20px;letter-spacing:3px}
      h1{font-size:66px;line-height:1.23;margin:30px 0 20px;letter-spacing:1px}h1 em{font-style:normal;color:#edbb64}
      .sub{font-size:27px;font-weight:700;margin:0 0 12px}.desc{font-size:19px;color:#c4d4d6;line-height:1.65}
      .roles{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px;max-width:350px}.roles span{border:1px solid #557580;border-radius:5px;padding:8px 12px;font-size:18px}
      .bottom{position:absolute;bottom:0;font-size:18px;color:#c4d4d6}.bottom b{color:#edbb64;margin-right:12px}
      .rooms{position:absolute;left:500px;right:28px;top:28px;bottom:28px;display:grid;grid-template-rows:1fr 1fr;gap:16px}
      figure{margin:0;position:relative;overflow:hidden;border-radius:12px;border:1px solid #72888c;background:#d8dfe3}
      img{width:100%;height:100%;object-fit:cover}figcaption{position:absolute;left:14px;top:14px;background:#172c38eb;padding:8px 14px;border-radius:5px;font-size:19px;font-weight:700}
    </style><div class="copy"><div class="eyebrow">台灣補習班・3D 網頁遊戲</div><h1>晚上<br><em>十點</em>下課</h1><p class="sub">國小安親＋國中部</p><div class="desc">五個位子，兩天的故事。<br>從接小朋友，到國中下課。</div><div class="roles"><span>安親老師</span><span>國中班導</span><span>數學老師</span><span>櫃台</span><span>主任</span></div><div class="bottom"><b>17:30</b>放學高峰，你一次只有一雙手。</div></div><div class="rooms"><figure><img src="data:image/png;base64,${care}"><figcaption>2F｜四年級安親</figcaption></figure><figure><img src="data:image/png;base64,${jh}"><figcaption>3F｜九年級段考複習</figcaption></figure></div></html>`);
    await page.evaluate(()=>document.fonts.ready);
    await page.screenshot({path:output});
    console.log(output);
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
