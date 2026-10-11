/* art_models.js 整併前修正：紋理、模型替換、色彩、解析度、門牌。 */

/* repeat 參數相容修正 */
const FM_CANVAS_TEX_RAW=fmCanvasTex;
fmCanvasTex=function(key,w,h,draw,rx=1,ry=1,...extra){
  if(extra.length>=2){rx=extra[0];ry=extra[1];}
  const t=FM_CANVAS_TEX_RAW(key,w,h,draw,rx,ry);
  // 保持和原版相同的線性色彩流程，避免整體被 sRGB 輸出洗淡。
  if(THREE.LinearEncoding!==undefined){t.encoding=THREE.LinearEncoding;t.needsUpdate=true;}
  return t;
};

/* 切角幾何補 UV：讓木紋 / 烤漆紋理真的能顯示。 */
fmChamferGeo=function(w,h,d,r=.06){
  r=Math.min(r,w*.24,d*.24);const x=w/2,z=d/2,y=h/2;
  const p=[[-x+r,-z],[x-r,-z],[x,-z+r],[x,z-r],[x-r,z],[-x+r,z],[-x,z-r],[-x,-z+r]];
  const verts=[],uvs=[];
  const add=(v)=>{verts.push(...v);uvs.push(v[0]/w+.5,v[2]/d+.5);};
  const tri=(a,b,c)=>{add(a);add(b);add(c);};
  for(let i=1;i<7;i++){
    tri([p[0][0],-y,p[0][1]],[p[i+1][0],-y,p[i+1][1]],[p[i][0],-y,p[i][1]]);
    tri([p[0][0], y,p[0][1]],[p[i][0], y,p[i][1]],[p[i+1][0], y,p[i+1][1]]);
  }
  for(let i=0;i<8;i++){
    const j=(i+1)%8,a=p[i],b=p[j];
    tri([a[0],-y,a[1]],[b[0],-y,b[1]],[b[0],y,b[1]]);
    tri([a[0],-y,a[1]],[b[0],y,b[1]],[a[0],y,a[1]]);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.computeVertexNormals();return geo;
};

/* 新櫃台 / 沙發是替換，不和舊方塊疊放。 */
function fmHideLegacyFrontDesk(){
  const targets=[
    [3.75,.50,11.30,.08],[3.75,1.025,11.30,.08], // 舊櫃台本體與檯面
    [5.40,1.12,11.30,.10],[2.40,1.25,11.15,.10], // 舊電話 / 螢幕
    [.85,.225,15.70,.12],[.45,.425,15.70,.12]     // 舊沙發座面 / 背面
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
  wallSign("高三 B 班",11.88,1.42,3.45,-Math.PI/2,.90,.30,"#ffffff","#8a5c32",34);
  wallSign("自習室",11.88,1.42,12.35,-Math.PI/2,.72,.30,"#ffffff","#4f6d62",34);
  wallSign("國中 C 班",32.40,1.42,11.12,0,.90,.30,"#ffffff","#4c6f8c",34);

  // 走廊南端牆掛式滅火器，不佔通道。
  artBox(.58,.92,.045,0xe9ecef,10.82,1.00,17.72,null,.88,.02);
  artCyl(.105,.125,.55,0xc83a31,10.82,.84,17.64,null,18);
  artCyl(.075,.075,.055,0x30363d,10.82,1.145,17.64,null,14);
  artBox(.18,.055,.07,0x2b3036,10.82,1.20,17.64,null,.55,.12);
  artBox(.035,.34,.035,0x333a40,10.95,.93,17.60,null,.55,.08);
  wallSign("滅火器",10.82,1.55,17.69,Math.PI,.52,.20,"#ffffff","#c83a31",28);
};

/* 最後一層 buildWorld：恢復原版色彩，解析度取清晰度與耗電的折衷。 */
const FM_BUILD_WORLD_CLEAN=buildWorld;
buildWorld=function(){
  FM_BUILD_WORLD_CLEAN();
  if(renderer){
    const dpr=window.devicePixelRatio||1;
    // 3x 相較原版 1.5x 要畫 4 倍像素；2.5x 可保留 Retina 清晰度又少約 31% 像素負擔。
    renderer.setPixelRatio(Math.min(dpr,innerWidth<600?2.5:2));
    if(THREE.LinearEncoding!==undefined)renderer.outputEncoding=THREE.LinearEncoding;
    if(THREE.NoToneMapping!==undefined)renderer.toneMapping=THREE.NoToneMapping;
    const r=stage.getBoundingClientRect();
    if(r.width&&r.height)renderer.setSize(r.width,r.height,false);
  }
  if(typeof FM!=="undefined"&&THREE.LinearEncoding!==undefined){
    Object.values(FM.textures).forEach(t=>{t.encoding=THREE.LinearEncoding;t.needsUpdate=true;});
  }
};
