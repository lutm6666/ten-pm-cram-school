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
    tri([p[0][0],-y,p[0][1]],[p[i+1][0],-y,p[i+1][1]],[p[i][0],-y,p[i][1]]);
    tri([p[0][0],y,p[0][1]],[p[i][0],y,p[i][1]],[p[i+1][0],y,p[i+1][1]]);
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
}
function fmChamfer(w,h,d,r,mat,x,y,z,parent){const m=new THREE.Mesh(fmChamferGeo(w,h,d,r),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function fmPlane(w,h,mat,x,y,z,rx=0,ry=0,rz=0,parent){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.receiveShadow=true;(parent||scene).add(m);return m;}

function fmHideLegacyPlant(){
  scene.traverse(o=>{
    if(!o.isMesh||!o.geometry||o.geometry.type!=='SphereGeometry')return;
    if(Math.hypot(o.position.x-.65,o.position.z-9.6)<.12&&Math.abs(o.position.y-.65)<.18)o.visible=false;
  });
}
function fmLobbyFloor(group){
  const mat=fmMat('lobbyFloor',{map:fmVinylTex(),rough:.88,metal:0});
  const p=fmPlane(8.92,8.92,mat,4.5,.004,13.5,-Math.PI/2,0,0,group);p.renderOrder=0;
}
function fmReceptionDesk(group){
  const navy=fmMat('navyPaint',{map:fmPaintTex(),rough:.56,metal:.01});
  const navyDark=fmMat('navyDark',{color:0x1d3548,rough:.48,metal:.04});
  const wood=fmMat('counterWoodMat',{map:fmWoodTex(),rough:.48,metal:.01});
  const metal=fmMat('deskMetal',{color:0x4e5964,rough:.34,metal:.55});
  const black=fmMat('deviceBlack',{color:0x252b31,rough:.42,metal:.08});
  const screen=fmMat('screen',{color:0x5f8ba5,rough:.18,metal:.06});
  const paper=fmMat('paper',{color:0xf7f2e7,rough:.96,metal:0});
  fmChamfer(4.66,.84,.67,.085,navy,3.75,.49,11.30,group);
  [2.22,3.75,5.28].forEach(x=>fmBox(1.34,.59,.035,navy,x,.51,11.655,group));
  [2.98,4.51].forEach(x=>fmBox(.025,.62,.052,navyDark,x,.51,11.674,group));
  fmBox(4.70,.11,.12,navyDark,3.75,.135,11.62,group);
  fmChamfer(4.82,.105,.79,.07,wood,3.75,1.055,11.30,group);
  fmChamfer(1.18,.08,.56,.055,wood,5.18,1.205,11.31,group);
  fmBox(.055,.17,.48,metal,4.72,1.135,11.31,group);fmBox(.055,.17,.48,metal,5.64,1.135,11.31,group);
  fmChamfer(.74,.47,.075,.055,black,2.58,1.43,11.27,group);
  fmPlane(.62,.35,screen,2.58,1.43,11.312,0,0,0,group);
  fmBox(.10,.22,.10,metal,2.58,1.17,11.29,group);fmChamfer(.42,.035,.24,.035,metal,2.58,1.075,11.29,group);
  const kb=fmChamfer(.67,.035,.25,.035,black,2.58,1.105,11.05,group);kb.rotation.x=-.035;
  for(let r=0;r<3;r++)for(let c=0;c<7;c++)fmBox(.065,.012,.038,fmMat('keys',{color:0x4c5660,rough:.55}),2.37+c*.071,1.128,10.985+r*.052,group);
  fmChamfer(.42,.10,.27,.045,black,4.84,1.115,11.18,group);
  for(let r=0;r<3;r++)for(let c=0;c<3;c++)fmBox(.04,.012,.04,metal,4.74+c*.06,1.172,11.12+r*.05,group);
  const handset=fmChamfer(.42,.075,.10,.04,fmMat('phoneHandset',{color:0x39424b,rough:.45}),4.84,1.22,11.19,group);handset.rotation.y=.06;
  for(let i=0;i<3;i++){const p=fmBox(.48,.018,.34,paper,3.55+i*.045,1.125+i*.035,11.08-i*.02,group);p.rotation.y=-.05;}
  const acrylic=fmMat('acrylic',{color:0xd6eef7,rough:.12,metal:0,transparent:true,opacity:.32,depthWrite:false});
  fmBox(.48,.40,.018,acrylic,1.92,1.31,11.08,group);fmBox(.018,.40,.30,acrylic,1.69,1.31,11.20,group);fmBox(.018,.40,.30,acrylic,2.15,1.31,11.20,group);
  const brochure1=fmBox(.34,.26,.012,fmMat('brochure1',{color:0xf2c85b,rough:.9}),1.92,1.28,11.065,group);brochure1.rotation.x=-.06;
  fmBox(.07,.19,.07,fmMat('penBlue',{color:0x2e6f9e,rough:.5}),5.48,1.17,11.06,group);fmBox(.07,.17,.07,fmMat('penRed',{color:0xc94c3e,rough:.5}),5.57,1.16,11.06,group);
  fmCyl(.075,.075,.012,fmMat('grommet',{color:0x30373d,rough:.35,metal:.25}),3.05,1.116,11.47,group,20);
}
function fmSofa(group){
  const fab=fmMat('sofaFabricMat',{map:fmFabricTex(),rough:.92,metal:0});
  const dark=fmMat('sofaSeam',{color:0x6f554e,rough:.88});
  fmChamfer(.90,.25,3.18,.10,dark,.85,.29,15.70,group);
  [14.63,15.70,16.77].forEach(z=>fmChamfer(.78,.18,.90,.10,fab,.88,.53,z,group));
  [14.63,15.70,16.77].forEach(z=>{const b=fmChamfer(.17,.62,.90,.08,fab,.50,.76,z,group);b.rotation.z=-.035;});
  fmChamfer(.78,.44,.18,.07,fab,.88,.55,14.13,group);fmChamfer(.78,.44,.18,.07,fab,.88,.55,17.27,group);
  [14.30,17.10].forEach(z=>[.57,1.17].forEach(x=>fmBox(.09,.18,.09,fmMat('sofaLeg',{color:0x5b4535,rough:.68}),x,.09,z,group)));
}
function fmPlant(group){
  fmHideLegacyPlant();
  const pot=fmMat('pot',{color:0x8a6247,rough:.82});const soil=fmMat('soil',{color:0x3e3027,rough:1});const trunk=fmMat('trunk',{color:0x5d4936,rough:.9});
  fmCyl(.27,.20,.36,pot,.65,.19,9.60,group,16);fmCyl(.285,.285,.045,fmMat('potRim',{color:0x6f4f3a,rough:.8}),.65,.39,9.60,group,16);fmCyl(.21,.21,.018,soil,.65,.415,9.60,group,18);
  fmCyl(.055,.07,.46,trunk,.65,.64,9.60,group,10);
  const leafMat=fmMat('leaf',{color:0x5f8a4f,rough:.82});const leaf2=fmMat('leaf2',{color:0x477442,rough:.82});
  const pts=[[-.16,.83,-.05],[.14,.84,-.05],[-.05,1.00,.05],[.20,1.00,.07],[-.22,1.03,.09],[.02,1.16,-.02]];
  pts.forEach((q,i)=>{const m=new THREE.Mesh(new THREE.DodecahedronGeometry(i===5?.20:.23,0),i%2?leaf2:leafMat);m.position.set(.65+q[0],q[1],9.60+q[2]);m.scale.set(1,.82,1);m.rotation.y=i*.7;m.castShadow=true;group.add(m);});
}
function fmWaitingTable(group){
  const metal=fmMat('waitMetal',{color:0x69737d,rough:.38,metal:.55});const wood=fmMat('waitWood',{map:fmWoodTex(),rough:.56});
  fmCyl(.39,.39,.065,wood,1.02,.49,15.38,group,24);fmCyl(.065,.09,.40,metal,1.02,.25,15.38,group,14);fmCyl(.24,.24,.025,metal,1.02,.035,15.38,group,18);
  const mag=fmChamfer(.38,.045,.27,.025,fmMat('magazine',{color:0x4b83b7,rough:.82}),.95,.545,15.33,group);mag.rotation.y=.12;
  const mag2=fmChamfer(.34,.042,.25,.025,fmMat('magazine2',{color:0xdf7665,rough:.82}),1.10,.59,15.45,group);mag2.rotation.y=-.10;
}
function fmEntryMat(group){
  const tex=fmCanvasTex('entryMat',256,128,(g,w,h)=>{g.fillStyle='#58636d';g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.08)';for(let y=2;y<h;y+=5){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}},2,2);
  const mat=fmMat('entryMatMat',{map:tex,rough:.98});fmBox(2.25,.022,1.00,mat,4.45,.018,16.95,group);
  fmBox(1.45,.008,.045,fmMat('entryGold',{color:0xd3ad55,rough:.58,metal:.12}),4.45,.034,16.95,group);
}

artFrontDesk=function(){
  const group=new THREE.Group();group.name='art-v3-frontdesk';scene.add(group);
  fmLobbyFloor(group);fmReceptionDesk(group);fmSofa(group);fmPlant(group);fmWaitingTable(group);fmEntryMat(group);
};