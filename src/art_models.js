/* =============== 美術實驗層 v3：櫃台區模型 + 紋理重製 ===============
   這一層不做全螢幕濾鏡，只改物件本體。先用櫃台區當成 A/B 樣板。 */

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
function fmVinylTex(){
  return fmCanvasTex('lobbyVinyl',512,512,(g,w,h)=>{
    g.fillStyle='#d7d0c4';g.fillRect(0,0,w,h);
    const rnd=fmRand(1701);
    for(let i=0;i<1200;i++){
      const v=155+Math.floor(rnd()*55),a=.035+rnd()*.055;
      g.fillStyle=`rgba(${v},${v-4},${v-9},${a})`;
      const r=.5+rnd()*1.5;g.fillRect(rnd()*w,rnd()*h,r,r);
    }
    g.strokeStyle='rgba(92,98,104,.16)';g.lineWidth=2;
    for(let x=0;x<=w;x+=128){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
    for(let y=0;y<=h;y+=128){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
    g.strokeStyle='rgba(255,255,255,.34)';g.lineWidth=1;
    for(let x=2;x<=w;x+=128){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
    for(let y=2;y<=h;y+=128){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
  },4.5,4.5);
}
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
function fmPaintTex(){
  return fmCanvasTex('blueLaminate',256,256,(g,w,h)=>{
    g.fillStyle='#294c67';g.fillRect(0,0,w,h);const rnd=fmRand(4431);
    for(let i=0;i<1500;i++){const a=.02+rnd()*.045;g.fillStyle=rnd()>.5?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a})`;const s=.5+rnd();g.fillRect(rnd()*w,rnd()*h,s,s);}
  },1,1);
}
function fmFabricTex(){
  return fmCanvasTex('sofaFabric',256,256,(g,w,h)=>{
    g.fillStyle='#98786d';g.fillRect(0,0,w,h);
    g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;
    for(let i=0;i<w;i+=4){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();}
    g.strokeStyle='rgba(40,24,20,.07)';
    for(let i=0;i<h;i+=4){g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke();}
  },2,4);
}
function fmMat(key,opts={}){
  if(FM.materials[key])return FM.materials[key];
  const m=new THREE.MeshStandardMaterial({color:opts.color===undefined?0xffffff:opts.color,roughness:opts.rough===undefined?.78:opts.rough,metalness:opts.metal||0,map:opts.map||null});
  if(opts.transparent){m.transparent=true;m.opacity=opts.opacity===undefined?.5:opts.opacity;m.depthWrite=opts.depthWrite!==false;}
  FM.materials[key]=m;return m;
}
function fmBox(w,h,d,mat,x,y,z,parent){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function fmCyl(rt,rb,h,mat,x,y,z,parent,seg=18){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function fmChamferGeo(w,h,d,r=.06){
  r=Math.min(r,w*.24,d*.24);const x=w/2,z=d/2,y=h/2;
  const p=[[-x+r,-z],[x-r,-z],[x,-z+r],[x,z-r],[x-r,z],[-x+r,z],[-x,z-r],[-x,-z+r]];
  const verts=[],uvs=[];
  const add=v=>{verts.push(...v);uvs.push(v[0]/w+.5,v[2]/d+.5);};
  const tri=(a,b,c)=>{add(a);add(b);add(c);};
  for(let i=1;i<7;i++){
    tri([p[0][0],-y,p[0][1]],[p[i][0],-y,p[i][1]],[p[i+1][0],-y,p[i+1][1]]);
    tri([p[0][0],y,p[0][1]],[p[i+1][0],y,p[i+1][1]],[p[i][0],y,p[i][1]]);
  }
  for(let i=0;i<8;i++){
    const j=(i+1)%8,a=p[i],b=p[j];
    tri([a[0],-y,a[1]],[b[0],y,b[1]],[b[0],-y,b[1]]);
    tri([a[0],-y,a[1]],[a[0],y,a[1]],[b[0],y,b[1]]);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geo.computeVertexNormals();return geo;
}
function fmChamfer(w,h,d,r,mat,x,y,z,parent){const m=new THREE.Mesh(fmChamferGeo(w,h,d,r),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function fmPlane(w,h,mat,x,y,z,rx=0,ry=0,rz=0,parent){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.receiveShadow=true;(parent||scene).add(m);return m;}
