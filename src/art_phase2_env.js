/* ================= Phase 2：全地圖材質 + 房間辨識度 =================
   不改 renderer 色彩流程，不加全螢幕濾鏡。
   只改善地板表面、房間大型家具與可辨識的空間元素。 */

function p2EnvTex(key,base,line,grain,rx=4,ry=4){
  return fmCanvasTex('p2env:'+key,512,512,(g,w,h)=>{
    g.fillStyle=base;g.fillRect(0,0,w,h);
    const rnd=fmRand(p2Hash(key));
    for(let i=0;i<1300;i++){
      const a=.018+rnd()*.035,s=.5+rnd()*1.3;
      g.fillStyle=`rgba(${grain[0]},${grain[1]},${grain[2]},${a})`;
      g.fillRect(rnd()*w,rnd()*h,s,s);
    }
    if(line){
      g.strokeStyle=line;g.lineWidth=1;
      for(let x=0;x<=w;x+=128){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
      for(let y=0;y<=h;y+=128){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
    }
  },rx,ry);
}
function p2WoodPanelTex(){
  return fmCanvasTex('p2env:woodPanel',512,256,(g,w,h)=>{
    g.fillStyle='#9a7454';g.fillRect(0,0,w,h);const rnd=fmRand(47031);
    for(let i=0;i<70;i++){
      const y=rnd()*h,phase=rnd()*6.28;
      g.beginPath();
      for(let x=0;x<=w;x+=8){const yy=y+Math.sin(x*.03+phase)*(1+rnd()*3);x?g.lineTo(x,yy):g.moveTo(x,yy);}
      g.strokeStyle=`rgba(67,39,22,${.035+rnd()*.07})`;g.lineWidth=.7+rnd()*1.1;g.stroke();
    }
  },2.5,1);
}
function p2Floor(w,d,x,z,texKey,base,line,grain,rx,ry){
  const tex=p2EnvTex(texKey,base,line,grain,rx,ry);
  const mat=fmMat('p2env:floor:'+texKey,{map:tex,rough:.90,metal:0});
  const p=fmPlane(w,d,mat,x,.003,z,-Math.PI/2);p.renderOrder=0;return p;
}
function p2EnvFloors(){
  // 大廳由 art_models.js 管理，這裡補齊其他區域。
  p2Floor(8.96,4.96,4.5,2.5,'office','#c2c9c0','rgba(83,91,83,.10)',[95,101,94],4,2.2);
  p2Floor(8.96,3.96,4.5,7.0,'lounge','#d1c8b9','rgba(105,92,76,.10)',[116,101,84],4,2);
  p2Floor(2.94,17.96,10.5,9.0,'hall','#cbd0d3','rgba(78,88,98,.10)',[91,99,105],1.7,8);
  p2Floor(15.96,10.96,20,5.5,'class','#ded7c9','rgba(123,107,88,.13)',[135,121,103],7.5,5);
  p2Floor(15.96,6.96,20,14.5,'study','#ccd3cc','rgba(72,91,78,.10)',[90,105,94],7.5,3.2);
  p2Floor(7.96,10.96,32,5.5,'jh','#d4dbc8','rgba(81,105,78,.12)',[98,116,94],4,5);
  p2Floor(7.96,6.96,32,14.5,'jhStorage','#d8d1c6','rgba(100,88,76,.10)',[117,103,90],4,3.2);
}

function p2CabinetUnit(x,z,w,h,d,bodyMat,doorMat,parent){
  const g=new THREE.Group();g.position.set(x,0,z);(parent||scene).add(g);
  p2Mesh(fmChamferGeo(w,h,d,.045),bodyMat,g,0,h/2,0);
  const gap=.035,doorW=(w-gap*3)/2;
  [-1,1].forEach(s=>{
    p2Mesh(fmChamferGeo(doorW,h-.12,.035,.018),doorMat,g,s*(doorW/2+gap/2),h/2,d/2+.022);
    p2Mesh(fmChamferGeo(.035,.18,.025,.009),p2Std('cabHandle',0x606970,.34,.58),g,s*.075,h*.54,d/2+.055);
  });
  p2Mesh(fmChamferGeo(w+.05,.055,d+.04,.025),bodyMat,g,0,h+.028,0);
  return g;
}
function p2ShelfBooks(parent,x,y,z,span,count=7){
  const cols=[0x8b4b43,0x466b88,0xc09a4a,0x54755d,0x6d5b85,0xa96a42];
  for(let i=0;i<count;i++){
    const ww=span/count*.68,xx=x-span/2+(i+.5)*span/count;
    p2Mesh(fmChamferGeo(ww,.32,.16,.012),p2Std('book:'+cols[i%cols.length],cols[i%cols.length],.84,0),parent,xx,y,z);
  }
}

function p2OfficeDesk(r){
  solids.push(r);const g=new THREE.Group(),cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2;g.position.set(cx,0,cz);scene.add(g);
  const wood=fmMat('p2env:officeWood',{map:p2WoodPanelTex(),rough:.64,metal:0});
  const dark=p2Std('officeDeskDark',0x5e5146,.72,.01),metal=p2Std('officeDeskMetal',0x555e66,.34,.55);
  p2Mesh(fmChamferGeo(3.05,.11,1.03,.055),wood,g,0,.79,0);
  [-1.25,1.25].forEach(x=>p2Mesh(fmChamferGeo(.11,.70,.73,.028),dark,g,x,.38,0));
  p2Mesh(fmChamferGeo(2.35,.06,.06,.018),metal,g,0,.33,.25);
  // 桌前木質擋板，主任室輪廓和教室桌分開。
  p2Mesh(fmChamferGeo(2.36,.43,.045,.018),wood,g,0,.48,.43);
}
function p2LoungeTable(r){
  solids.push(r);const g=new THREE.Group(),cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2;g.position.set(cx,0,cz);scene.add(g);
  const top=fmMat('p2env:loungeTop',{color:0xd8cec0,rough:.86,metal:0});const metal=p2Std('loungeMetal',0x667078,.38,.50);
  p2Mesh(fmChamferGeo(3.02,.08,1.18,.06),top,g,0,.75,0);
  [-1.25,1.25].forEach(x=>[-.42,.42].forEach(z=>p2Mesh(fmChamferGeo(.055,.68,.055,.015),metal,g,x,.36,z)));
  p2Mesh(fmChamferGeo(2.38,.04,.04,.012),metal,g,0,.31,0);
}
function p2Fridge(r){
  solids.push(r);const cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const body=p2Std('fridgeBody',0xe5e8e9,.55,.15),edge=p2Std('fridgeEdge',0xa1a8ae,.36,.46);
  p2Mesh(fmChamferGeo(.78,1.68,.98,.07),body,g,0,.84,0);
  p2Mesh(fmChamferGeo(.69,.018,.035,.009),edge,g,0,1.05,.505);
  p2Mesh(fmChamferGeo(.035,.42,.035,.009),edge,g,.27,.86,.51);
}
function p2CounterCabinet(r,h){
  solids.push(r);const w=r[2]-r[0],d=r[3]-r[1],cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const wood=fmMat('p2env:counterWood',{map:p2WoodPanelTex(),rough:.66,metal:0});const door=p2Std('loungeDoor',0xc9c0b2,.82,0);
  p2Mesh(fmChamferGeo(w,h,d,.045),door,g,0,h/2,0);p2Mesh(fmChamferGeo(w+.06,.07,d+.04,.03),wood,g,0,h+.035,0);
  const n=Math.max(2,Math.round(w/.62));for(let i=1;i<n;i++)p2Mesh(fmChamferGeo(.025,h-.12,.035,.008),p2Std('cabSeam',0x9c9489,.78,0),g,-w/2+i*w/n,h/2,d/2+.025);
}
function p2JhLockers(r){
  solids.push(r);const w=r[2]-r[0],d=r[3]-r[1],cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const body=p2Std('lockerBody',0x71808e,.58,.12),door=p2Std('lockerDoor',0x8796a4,.62,.10),handle=p2Std('lockerHandle',0x444d55,.32,.55);
  p2Mesh(fmChamferGeo(w,1.48,d,.035),body,g,0,.74,0);
  const rows=4,cols=2;for(let r0=0;r0<rows;r0++)for(let c=0;c<cols;c++){
    const yy=.20+r0*.35,xx=(c?1:-1)*.30;
    p2Mesh(fmChamferGeo(.52,.31,.035,.015),door,g,xx,yy,d/2+.023);
    p2Mesh(fmChamferGeo(.035,.08,.022,.007),handle,g,xx+(c?-.16:.16),yy,d/2+.055);
  }
}

const P2_ENV_BASE_FURN=furn;
furn=function(r,h,color,top){
  const w=r[2]-r[0],d=r[3]-r[1];
  // 主任桌
  if(Math.abs(w-3)<.03&&Math.abs(d-1)<.03&&Math.abs(h-.78)<.03){p2OfficeDesk(r);return;}
  // 休息室中央桌
  if(Math.abs(w-3)<.03&&Math.abs(d-1.2)<.03&&Math.abs(h-.74)<.03){p2LoungeTable(r);return;}
  // 休息室冰箱
  if(Math.abs(w-.8)<.03&&Math.abs(d-1)<.03&&Math.abs(h-1.7)<.03){p2Fridge(r);return;}
  // 休息室工作檯
  if(Math.abs(w-2.1)<.03&&Math.abs(d-.6)<.03&&Math.abs(h-.9)<.03){p2CounterCabinet(r,h);return;}
  // 國中部大型置物櫃
  if(Math.abs(w-1.3)<.03&&Math.abs(d-5.2)<.03&&Math.abs(h-1.5)<.03){p2JhLockers(r);return;}
  P2_ENV_BASE_FURN(r,h,color,top);
};

function p2RoomIdentity(){
  // 主任室：木質矮牆、文件櫃與大型軟木板。
  const wood=fmMat('p2env:wallWood',{map:p2WoodPanelTex(),rough:.74,metal:0});
  fmBox(3.7,.42,.045,wood,6.65,.36,.225);
  p2CabinetUnit(7.65,1.05,1.05,1.35,.42,p2Std('officeCab',0x6b7479,.62,.15),p2Std('officeCabDoor',0x81898e,.65,.10));
  wallSign('續班追蹤\n本週待聯絡',6.25,1.48,.235,0,2.2,.72,'#3d3126','#d6ba8a',42);

  // 講師休息室：上櫃、公告板，空間變成「工作休息區」而非另一間教室。
  [2.1,3.35,4.60].forEach(x=>p2CabinetUnit(x,5.38,1.05,.72,.30,p2Std('loungeUpper',0xb7afa4,.82,0),p2Std('loungeUpperDoor',0xd3ccc1,.86,0)));
  wallSign('代課・請假・影印提醒',5.75,1.45,5.13,0,2.2,.48,'#3d4b55','#f0e4c8',38);

  // B 班：右側教材櫃 + 公告欄。
  p2CabinetUnit(27.25,8.55,.75,1.18,.42,p2Std('classCab',0x7b858b,.60,.14),p2Std('classCabDoor',0x9da6aa,.66,.10));
  wallSign('高三 B 班\n本週進度：空間向量',27.72,1.48,7.15,-Math.PI/2,2.0,.68,'#64462f','#f1dfb9',38);

  // 自習室：安靜區書架與規則板。
  const shelf=p2CabinetUnit(27.20,16.35,.82,1.25,.40,p2Std('studyShelf',0x66766c,.68,.06),p2Std('studyShelfDoor',0x87958a,.72,.04));
  p2ShelfBooks(shelf,0,.98,.225,.55,6);
  wallSign('自習室\n手機靜音・小聲討論',12.18,1.48,16.0,Math.PI/2,1.8,.68,'#36564a','#eef1e9',38);

  // 國中 C 班：彩色教材櫃與會考公告，語彙和高中區分開。
  p2CabinetUnit(35.35,8.65,.72,1.10,.42,p2Std('jhCab',0x678b88,.62,.08),p2Std('jhCabDoor',0x86aaa5,.70,.04));
  wallSign('會考倒數\n單字・作文・複習考',35.72,1.48,7.20,-Math.PI/2,1.9,.72,'#2f6657','#e8f0df',38);

  // 國中部置物區：手搖飲／書包提示板，和教室形成明顯切換。
  wallSign('置物區\n書包靠牆・手機入籃',28.18,1.42,15.35,Math.PI/2,1.65,.68,'#604b3d','#efe3d4',36);
}

function p2EnvDecorate(){p2EnvFloors();p2RoomIdentity();}
const P2_ENV_BASE_DECORATE=artDecorateWorld;
artDecorateWorld=function(){P2_ENV_BASE_DECORATE();p2EnvDecorate();};
