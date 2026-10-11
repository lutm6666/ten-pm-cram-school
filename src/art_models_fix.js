/* art_models.js 整併前修正：舊模型替換、UV 與門牌定位。 */

/* fmChamferGeo 原本只有頂/底面的 UV 有面積；側面上下頂點共用同一組 x/z UV，
   會讓側面木紋/烤漆貼圖塌成一條線。改成頂/底用平面 UV、側面沿周長展開。 */
fmChamferGeo=function(w,h,d,r=.06){
  r=Math.min(r,w*.24,d*.24);const x=w/2,z=d/2,y=h/2;
  const p=[[-x+r,-z],[x-r,-z],[x,-z+r],[x,z-r],[x-r,z],[-x+r,z],[-x,z-r],[-x,-z+r]];
  const verts=[],uvs=[];
  const add=(v,uv)=>{verts.push(...v);uvs.push(...uv);};
  const tri=(a,b,c,ua,ub,uc)=>{add(a,ua);add(b,ub);add(c,uc);};
  const faceUV=v=>[v[0]/w+.5,v[2]/d+.5];
  for(let i=1;i<7;i++){
    const b0=[p[0][0],-y,p[0][1]],b1=[p[i+1][0],-y,p[i+1][1]],b2=[p[i][0],-y,p[i][1]];
    const t0=[p[0][0],y,p[0][1]],t1=[p[i][0],y,p[i][1]],t2=[p[i+1][0],y,p[i+1][1]];
    tri(b0,b1,b2,faceUV(b0),faceUV(b1),faceUV(b2));
    tri(t0,t1,t2,faceUV(t0),faceUV(t1),faceUV(t2));
  }
  const edgeLen=p.map((a,i)=>{const b=p[(i+1)%8];return Math.hypot(b[0]-a[0],b[1]-a[1]);});
  const perimeter=edgeLen.reduce((a,b)=>a+b,0);let run=0;
  for(let i=0;i<8;i++){
    const j=(i+1)%8,a=p[i],b=p[j],u0=run/perimeter,u1=(run+edgeLen[i])/perimeter;run+=edgeLen[i];
    const a0=[a[0],-y,a[1]],b0=[b[0],-y,b[1]],b1=[b[0],y,b[1]],a1=[a[0],y,a[1]];
    tri(a0,b0,b1,[u0,0],[u1,0],[u1,1]);
    tri(a0,b1,a1,[u0,0],[u1,1],[u0,1]);
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