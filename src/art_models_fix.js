/* art_models.js 整併前修正：舊模型替換、UV、材質比例、效能與門牌定位。 */

/* fmChamferGeo 原本只有頂/底面的 UV 有面積；側面上下頂點共用同一組 x/z UV，
   會讓側面木紋/烤漆貼圖塌成一條線。改成頂/底用平面 UV、側面沿周長展開。
   側面 U 依真實邊長比例累積，因此長邊、倒角與短邊不會各自被硬拉成一整張貼圖。
   Phase 2 有大量同尺寸桌腳、椅架與板件，因此再以尺寸+r 做 BufferGeometry 快取。 */
const FM_CHAMFER_CACHE=new Map();
fmChamferGeo=function(w,h,d,r=.06){
  r=Math.min(r,w*.24,d*.24);
  const key=[w,h,d,r].map(v=>Number(v).toFixed(4)).join('|');
  if(FM_CHAMFER_CACHE.has(key))return FM_CHAMFER_CACHE.get(key);
  const x=w/2,z=d/2,y=h/2;
  const p=[[-x+r,-z],[x-r,-z],[x,-z+r],[x,z-r],[x-r,z],[-x+r,z],[-x,z-r],[-x,-z+r]];
  const verts=[],uvs=[];
  const add=(v,uv)=>{verts.push(...v);uvs.push(...uv);};
  const tri=(a,b,c,ua,ub,uc)=>{add(a,ua);add(b,ub);add(c,uc);};
  const faceUV=v=>[v[0]/w+.5,v[2]/d+.5];
  for(let i=1;i<7;i++){
    const b0=[p[0][0],-y,p[0][1]],b1=[p[i][0],-y,p[i][1]],b2=[p[i+1][0],-y,p[i+1][1]];
    const t0=[p[0][0],y,p[0][1]],t1=[p[i+1][0],y,p[i+1][1]],t2=[p[i][0],y,p[i][1]];
    tri(b0,b1,b2,faceUV(b0),faceUV(b1),faceUV(b2));
    tri(t0,t1,t2,faceUV(t0),faceUV(t1),faceUV(t2));
  }
  const edgeLen=p.map((a,i)=>{const b=p[(i+1)%8];return Math.hypot(b[0]-a[0],b[1]-a[1]);});
  const perimeter=edgeLen.reduce((a,b)=>a+b,0);let run=0;
  for(let i=0;i<8;i++){
    const j=(i+1)%8,a=p[i],b=p[j],u0=run/perimeter,u1=(run+edgeLen[i])/perimeter;run+=edgeLen[i];
    const a0=[a[0],-y,a[1]],b0=[b[0],-y,b[1]],b1=[b[0],y,b[1]],a1=[a[0],y,a[1]];
    tri(a0,b1,b0,[u0,0],[u1,1],[u1,0]);
    tri(a0,a1,b1,[u0,0],[u0,1],[u1,1]);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.computeVertexNormals();FM_CHAMFER_CACHE.set(key,geo);return geo;
};

/* 同一張程序貼圖可以共用 Canvas，但不同尺寸家具不能共用同一組 repeat。
   clone() 只複製 Texture 狀態、仍共用原 image，避免為每張桌子再建立 512px Canvas。
   測試 stub 比真實 Three.js 精簡，center/rotation 若不存在就略過，不影響遊戲本體。 */
function fmTextureView(key,base,rx,ry,rotation=0){
  const k='view:'+key;if(FM.textures[k])return FM.textures[k];
  const t=base.clone?base.clone():base;t.wrapS=t.wrapT=THREE.RepeatWrapping;
  if(t.repeat&&t.repeat.set)t.repeat.set(rx,ry);
  if(t.center&&t.center.set)t.center.set(.5,.5);
  if('rotation' in t)t.rotation=rotation;
  t.needsUpdate=true;
  FM.textures[k]=t;return t;
}
const FM_UV_BASE_MAT=fmMat;
fmMat=function(key,opts={}){
  if(FM.materials[key])return FM.materials[key];
  let map=opts.map;
  if(map){
    // 以物件實際尺度分 profile，讓木紋/表面顆粒在不同房間維持接近的物理尺寸。
    const profiles={
      'counterWoodMat':[3.8,.95],
      'p2:deskWood':[1.15,.55],
      'p2:podiumWood':[1.20,.60],
      'p2env:officeWood':[2.55,.82],
      'p2env:counterWood':[1.75,.55],
      'p2env:wallWood':[2.85,.46],
      'navyPaint':[3.6,1.35],
      'sofaFabricMat':[1.15,1.35]
    };
    const pf=profiles[key];if(pf)map=fmTextureView(key,map,pf[0],pf[1],pf[2]||0);
  }
  return FM_UV_BASE_MAT(key,{...opts,map});
};
