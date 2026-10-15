/* =============== 美術共用工具：程序貼圖、材質、倒角板件 ===============
   art_phase2.js 的桌椅、講台都用這裡的工具。 */

const FM={textures:{},materials:{}};
function fmCanvasTex(key,w,h,draw,rx=1,ry=1){
  if(FM.textures[key])return FM.textures[key];
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const g=c.getContext('2d');draw(g,w,h);
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);
  const an=renderer&&renderer.capabilities&&renderer.capabilities.getMaxAnisotropy?renderer.capabilities.getMaxAnisotropy():4;
  t.anisotropy=Math.min(8,an||4);FM.textures[key]=t;return t;
}
function fmRand(seed){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);}
function fmWoodTex(){
  return fmCanvasTex('counterWood',512,256,(g,w,h)=>{
    g.fillStyle='#b98d64';g.fillRect(0,0,w,h);
    const rnd=fmRand(9663);
    for(let i=0;i<95;i++){
      const y=rnd()*h,amp=2+rnd()*7,phase=rnd()*6.28;
      g.beginPath();
      for(let x=0;x<=w;x+=8){const yy=y+Math.sin(x*.026+phase)*amp+Math.sin(x*.071+phase)*1.2;x?g.lineTo(x,yy):g.moveTo(x,yy);}
      g.strokeStyle=`rgba(${70+Math.floor(rnd()*45)},${43+Math.floor(rnd()*35)},${24+Math.floor(rnd()*25)},${.05+rnd()*.10})`;
      g.lineWidth=.6+rnd()*1.7;g.stroke();
    }
    const grad=g.createLinearGradient(0,0,0,h);grad.addColorStop(0,'rgba(255,255,255,.13)');grad.addColorStop(.5,'rgba(255,255,255,0)');grad.addColorStop(1,'rgba(71,43,25,.08)');g.fillStyle=grad;g.fillRect(0,0,w,h);
  },3.2,1.2);
}
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
/* 材質快取。有貼圖的材質依實際尺寸調整 repeat，讓木紋在不同物件上維持接近的物理尺寸。 */
const FM_MAP_PROFILES={'p2:podiumWood':[1.20,.60]};
function fmMat(key,opts={}){
  if(FM.materials[key])return FM.materials[key];
  let map=opts.map;const pf=map&&FM_MAP_PROFILES[key];if(pf)map=fmTextureView(key,map,pf[0],pf[1],pf[2]||0);
  const m=new THREE.MeshStandardMaterial({color:opts.color===undefined?0xffffff:opts.color,roughness:opts.rough===undefined?.78:opts.rough,metalness:opts.metal||0,map:map||null});
  if(opts.transparent){m.transparent=true;m.opacity=opts.opacity===undefined?.5:opts.opacity;m.depthWrite=opts.depthWrite!==false;}
  FM.materials[key]=m;return m;
}
/* 倒角板件：頂/底用平面 UV、側面沿周長展開，木紋不會塌成一條線。
   側面 U 依真實邊長比例累積，因此長邊、倒角與短邊不會各自被硬拉成一整張貼圖。
   Phase 2 有大量同尺寸桌腳、椅架與板件，因此再以尺寸+r 做 BufferGeometry 快取。 */
const FM_CHAMFER_CACHE=new Map();
function fmChamferGeo(w,h,d,r=.06){
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
}
