/* art_models.js 整併前修正：舊模型替換與門牌定位。 */

/* 新櫃台 / 沙發是替換，不和舊方塊疊放。 */
function fmHideLegacyFrontDesk(){
  const targets=[
    [3.75,.50,11.30,.08],[3.75,1.025,11.30,.08], // 舊櫃台本體與檯面
    [5.40,1.12,11.30,.10],[2.40,1.25,11.15,.10], // 舊電話 / 螢幕
    [.85,.225,15.70,.12],[.45,.425,15.70,.12]     // 舊沙發座面 / 椅背
  ];
  scene.children.forEach(o=>{
    if(!o||!o.isMesh)return;
    for(const [x,y,z,e] of targets){
      if(Math.abs(o.position.x-x)<e&&Math.abs(o.position.y-y)<e&&Math.abs(o.position.z-z)<e){o.visible=false;break;}
    }
  });
}
const FM_FRONTDESK_REPLACEMENT=artFrontDesk;
artFrontDesk=function(){fmHideLegacyFrontDesk();FM_FRONTDESK_REPLACEMENT();};

/* 門牌改到真正門口旁的實牆，消防器材貼牆。 */
artHallDetails=function(){
  wallSign("主任室",9.13,1.38,3.65,Math.PI/2,.70,.28,"#ffffff","#425466",36);
  wallSign("講師休息室",9.13,1.38,7.95,Math.PI/2,1.05,.28,"#ffffff","#425466",32);
  // B 班牌掛在 z=3 之後的實牆，不跨門洞。
  wallSign("高三 B 班",11.88,1.42,3.45,-Math.PI/2,.90,.30,"#ffffff","#8a5c32",34);
  wallSign("自習室",11.88,1.42,12.35,-Math.PI/2,.72,.30,"#ffffff","#4f6d62",34);
  // C 班門洞為 x=29.6~31.6；牌子貼在左側門柱實牆，正面朝置物區 (+z)。
  wallSign("國中 C 班",29.24,1.42,11.12,0,.70,.30,"#ffffff","#4c6f8c",32);

  // 走廊南端牆掛式滅火器，不佔通道。
  artBox(.58,.92,.045,0xe9ecef,10.82,1.00,17.72,null,.88,.02);
  artCyl(.105,.125,.55,0xc83a31,10.82,.84,17.64,null,18);
  artCyl(.075,.075,.055,0x30363d,10.82,1.145,17.64,null,14);
  artBox(.18,.055,.07,0x2b3036,10.82,1.20,17.64,null,.55,.12);
  artBox(.035,.34,.035,0x333a40,10.95,.93,17.60,null,.55,.08);
  wallSign("滅火器",10.82,1.55,17.69,Math.PI,.52,.20,"#ffffff","#c83a31",28);
};