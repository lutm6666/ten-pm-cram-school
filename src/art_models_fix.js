/* art_models.js 紋理 repeat 參數相容修正：
   初版材質函式呼叫保留了 canvas 寬高參數，這裡在紋理建立前把真正 repeat 值取回。 */
const FM_CANVAS_TEX_RAW=fmCanvasTex;
fmCanvasTex=function(key,w,h,draw,rx=1,ry=1,...extra){
  if(extra.length>=2){rx=extra[0];ry=extra[1];}
  return FM_CANVAS_TEX_RAW(key,w,h,draw,rx,ry);
};

/* ================= 清晰度 + 走廊消防器材修正 =================
   手機用完整 Retina DPR（最高 3），避免 2.25x 畫布被 iPhone 3x 螢幕再次放大。
   同時撤掉地上的紅色方塊消防器材，改成靠牆、能讀成滅火器的模型。 */

// art.js 的走廊細節改版：保留門牌，但重新做消防器材。
artHallDetails=function(){
  wallSign("主任室",9.13,1.38,3.65,Math.PI/2,.70,.28,"#ffffff","#425466",36);
  wallSign("講師休息室",9.13,1.38,7.95,Math.PI/2,1.05,.28,"#ffffff","#425466",32);
  wallSign("高三 B 班",12.08,1.42,2.95,-Math.PI/2,.90,.30,"#ffffff","#8a5c32",34);
  wallSign("自習室",12.08,1.42,12.35,-Math.PI/2,.72,.30,"#ffffff","#4f6d62",34);
  wallSign("國中 C 班",28.08,1.42,9.95,-Math.PI/2,.90,.30,"#ffffff","#4c6f8c",34);

  // 靠牆消防設備：白色背板 + 紅色筒身 + 深色閥門/軟管。
  // 放在走廊右牆，不再像一塊遺落在地板中央的紅色積木。
  artBox(.045,.92,.58,0xe9ecef,11.865,1.00,16.28,null,.88,.02);
  artCyl(.105,.125,.55,0xc83a31,11.79,.84,16.28,null,18);
  artCyl(.075,.075,.055,0x30363d,11.79,1.145,16.28,null,14);
  artBox(.18,.055,.07,0x2b3036,11.79,1.20,16.28,null,.55,.12);
  artBox(.035,.34,.035,0x333a40,11.74,.93,16.42,null,.55,.08);
};

// 最後一層包裝 buildWorld，確保前面所有美術層完成後再把畫布升到原生 Retina 清晰度。
const FM_BUILD_WORLD_RETINA=buildWorld;
buildWorld=function(){
  FM_BUILD_WORLD_RETINA();
  if(renderer){
    const dpr=window.devicePixelRatio||1;
    renderer.setPixelRatio(Math.min(dpr,innerWidth<600?3:2.5));
    // setPixelRatio 會重設 drawing buffer；再依目前舞台尺寸補一次，避免 in-app browser chrome 改變 viewport 後軟縮放。
    const r=stage.getBoundingClientRect();
    if(r.width&&r.height)renderer.setSize(r.width,r.height,false);
  }
};
