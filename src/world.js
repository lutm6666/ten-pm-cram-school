/* ================= 3D 場景（格局資料在 layout.js） ================= */
const C={floorLobby:0xd9d2c3,floorOffice:0xc6cec4,floorLounge:0xd3cbbd,floorHall:0xcdd2d6,floorClass:0xdcd5c6,floorStudy:0xcfd6cf,wall:0xf2f0e9,wallTop:0x66717d,
 desk:0xb08355,deskTop:0xd8b688,counter:0x34506a,copier:0x98a1a9,board:0xffffff,frame:0xa8afb5,sofa:0x7b5e57,shelf:0x8a6a48,metal:0x8b949c};

let renderer,scene,camera,player,ground,marker,hemi,sun;const CHAIRS=[];
function chair(x,z,ry,kid=false){
  CHAIRS.push([x,z]);const c=new THREE.Group(),height=kid?.32:.42,width=kid?.40:.44,color=kid?0xc68d54:0x56606b;
  c.userData={layoutChair:true,kid,seatTop:height+.03};
  const seat=new THREE.Mesh(bgeo(width,.06,.42),mat(color));seat.position.y=height;c.add(seat);
  const bk=new THREE.Mesh(bgeo(width,kid?.34:.45,.05),mat(color));bk.position.set(0,height+(kid?.20:.24),-.2);c.add(bk);
  [[-.16,-.17],[.16,-.17],[-.16,.17],[.16,.17]].forEach(([a,b])=>{const leg=new THREE.Mesh(bgeo(.04,height,.04),mat(0x3e454e));leg.position.set(a,height/2,b);c.add(leg);});
  c.position.set(x,0,z);c.rotation.y=ry;scene.add(c);
}
const isChair=(x,z)=>CHAIRS.some(c=>Math.hypot(c[0]-x,c[1]-z)<.2);
const npcs={},infoMarks={},itemMarks={},extras=[];const solids=[...WALLS];
const stage=document.getElementById("stage");
const R=.3,CELL=.25,GW=W/CELL,GH=H/CELL;let gridB;

const _mc={},_gc={};function mat(c){return _mc[c]||(_mc[c]=new THREE.MeshLambertMaterial({color:c}));}function bgeo(w,h,d){const k=w+','+h+','+d;return _gc[k]||(_gc[k]=new THREE.BoxGeometry(w,h,d));}
function box(w,h,d,color,x,y,z,parent){const m=new THREE.Mesh(bgeo(w,h,d),mat(color));m.position.set(x,y,z);(parent||scene).add(m);return m;}
function rbox(r,h,color,y0=0){return box(r[2]-r[0],h,r[3]-r[1],color,(r[0]+r[2])/2,y0+h/2,(r[1]+r[3])/2);}
function furn(r,h,color,top){solids.push(r);rbox(r,h,color);if(top!==undefined)rbox([r[0]-.03,r[1]-.03,r[2]+.03,r[3]+.03],.05,top,h);}

function canvasTex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;const g=c.getContext("2d");draw(g,w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t;}
function label(text,fg="#1c2633",bg="rgba(255,255,255,.92)",size=40){
  const font=`700 ${size}px "Noto Sans TC","PingFang TC",sans-serif`;
  const m=document.createElement("canvas").getContext("2d");m.font=font;const w=Math.ceil(m.measureText(text).width)+30,h=size+22;
  const t=canvasTex(w,h,(g)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.font=font;g.fillStyle=fg;g.textBaseline="middle";g.fillText(text,15,h/2+2);});
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));s.scale.set(w*.0074,h*.0074,1);s.renderOrder=10;return s;
}
function floorText(text,x,z,rot,size=.55){
  const font=`900 64px "Noto Sans TC","PingFang TC",sans-serif`;const m=document.createElement("canvas").getContext("2d");m.font=font;const w=Math.ceil(m.measureText(text).width)+20;
  const t=canvasTex(w,84,(g)=>{g.font=font;g.fillStyle="rgba(40,48,58,.28)";g.textBaseline="middle";g.fillText(text,10,44);});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w/84*size,size),new THREE.MeshBasicMaterial({map:t,transparent:true,depthWrite:false}));
  p.rotation.x=-Math.PI/2;p.rotation.z=rot;p.position.set(x,.012,z);scene.add(p);
}
function wallSign(text,x,y,z,ry,w=2.4,h=.9,fg="#1c2633",bg="#ffffff",size=56){
  const PX=200,cw=Math.round(w*PX),ch=Math.round(h*PX),pad=Math.round(Math.min(cw,ch)*.12),lines=text.split("\n");
  const t=canvasTex(cw,ch,(g)=>{g.fillStyle=bg;g.fillRect(0,0,cw,ch);g.fillStyle=fg;g.textBaseline="middle";g.textAlign="center";
    const fnt=s=>`700 ${s}px "Noto Sans TC","PingFang TC",sans-serif`;
    // 第一行當標題（較大），其餘行較小；整體縮到放得下
    const rel=lines.map((_,i)=>i===0||lines.length===1?1:.78);let fs=Math.round(size*PX/150);
    for(;fs>8;fs-=2){g.font=fnt(fs);const ok=lines.every((ln,i)=>{g.font=fnt(fs*rel[i]);return g.measureText(ln).width<=cw-pad*2;});
      const tot=rel.reduce((a,r)=>a+fs*r*1.2,0);if(ok&&tot<=ch-pad*1.2)break;}
    const tot=rel.reduce((a,r)=>a+fs*r*1.2,0);let yy=(ch-tot)/2;
    lines.forEach((ln,i)=>{const s2=fs*rel[i];g.font=fnt(s2);g.fillText(ln,cw/2,yy+s2*.6);yy+=s2*1.2;});});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));p.position.set(x,y,z);p.rotation.y=ry;scene.add(p);return p;
}
/* 各教室白板上的字（依劇情更新） */
const BOARDS={},BOARD_TEXT={};
function setBoard(text,room="g2"){const b=BOARDS[room];if(!b||!text||BOARD_TEXT[room]===text)return;BOARD_TEXT[room]=text;const parent=b.parent||scene;parent.remove(b);
  const n=wallSign(text,b.position.x,b.position.y,b.position.z,b.rotation.y,b.userData.w,b.userData.h,"#1d4fc4","#ffffff",60);n.userData={w:b.userData.w,h:b.userData.h};if(parent!==scene){scene.remove(n);parent.add(n);}BOARDS[room]=n;}
function limb(w,h,d,color,px,py,pz,parent){const pv=new THREE.Group();pv.position.set(px,py,pz);const m=new THREE.Mesh(bgeo(w,h,d),mat(color));m.position.y=-h/2;pv.add(m);parent.add(pv);return pv;}
function person(color,opts={}){
  const g=new THREE.Group(),hip=.45,torsoH=.5;
  const rig=new THREE.Group();g.add(rig);
  const legL=limb(.15,.44,.18,0x2c3440,-.11,hip,0,rig),legR=limb(.15,.44,.18,0x2c3440,.11,hip,0,rig);
  const torso=new THREE.Group();torso.position.y=hip;rig.add(torso);
  const body=new THREE.Mesh(bgeo(.46,torsoH,.27),mat(color));body.position.y=torsoH/2;torso.add(body);
  const head=new THREE.Group();head.position.y=torsoH+.17;torso.add(head);
  head.add(new THREE.Mesh(bgeo(.3,.3,.3),mat(0xf0d2b6)));
  const hair=new THREE.Mesh(bgeo(.32,.12,.32),mat(opts.hair||0x2a2421));hair.position.y=.13;head.add(hair);
  const back=new THREE.Mesh(bgeo(.32,.2,.08),mat(opts.hair||0x2a2421));back.position.set(0,.02,-.13);head.add(back);
  const faceMat=new THREE.MeshBasicMaterial({color:0x1c1c1c});const eyes=[];
  [-.07,.07].forEach(x=>{const e=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.02),faceMat);e.position.set(x,.03,.152);head.add(e);eyes.push(e);});
  const mouth=new THREE.Mesh(new THREE.BoxGeometry(.09,.025,.02),new THREE.MeshBasicMaterial({color:0x8a3b30}));mouth.position.set(0,-.07,.152);head.add(mouth);
  const armL=limb(.11,.42,.12,color,-.29,torsoH-.04,0,torso),armR=limb(.11,.42,.12,color,.29,torsoH-.04,0,torso);
  [armL,armR].forEach(a=>{const hand=new THREE.Mesh(bgeo(.1,.08,.1),mat(0xf0d2b6));hand.position.y=-.45;a.add(hand);});
  g.userData={eyes,mouth,blinkAt:Math.random()*4,top:hip+torsoH+.37,rig,torso,head,legL,legR,armL,armR,seated:false,phase:Math.random()*6,seed:Math.random()*10,walk:0,act:null};
  if(opts.kid){rig.scale.setScalar(.72);g.userData.top*=.72;g.userData.kid=true;} // 小朋友
  if(opts.name){const l=label(opts.name,"#ffffff",opts.tagBg||"#1c2633",34);l.scale.multiplyScalar(.7);l.position.y=g.userData.top+.24;g.add(l);g.userData.label=l;}
  scene.add(g);return g;
}
function setPose(p,sit){const u=p.userData;u.seated=sit;u.legL.rotation.x=u.legR.rotation.x=sit?-Math.PI/2:0;u.rig.position.y=sit&&u.kid?.026:0;u.torso.rotation.x=0;}
/* 對話泡泡 */
const emoteCache={};
function emote(p,text,dur=2.4){const u=p.userData;if(u.emoteSpr){p.remove(u.emoteSpr);}
  const s=label(text,"#1c2633","rgba(255,255,255,.96)",40);s.scale.multiplyScalar(.85);s.position.y=u.top+(u.label?.6:.42);p.add(s);u.emoteSpr=s;u.emoteUntil=performance.now()/1000+dur;}
function tickEmote(p,now){const u=p.userData;if(u.emoteSpr&&now>u.emoteUntil){p.remove(u.emoteSpr);u.emoteSpr=null;}}
/* 肢體動畫 */
function animPerson(p,dt,t,st={}){
  const u=p.userData;if(!u||!u.rig)return;
  const act=st.walk?null:(st.act||u.act);
  u.walk+=((st.walk?1:0)-u.walk)*Math.min(1,dt*10);
  if(st.walk)u.phase+=(u.stepDistance??dt*2.6)*Math.PI*2/.95;
  u.stepDistance=0;
  const w=u.walk,sw=Math.sin(u.phase),br=Math.sin(t*2+u.seed),k=Math.min(1,dt*12),L=(o,v)=>o+(v-o)*k;
  let aL,aR,zL=.05,zR=-.05,hx=0,hy=Math.sin(t*.5+u.seed)*.12,tx=0;
  if(act==='cover'){
    u.legL.rotation.x=u.legR.rotation.x=-1.25;u.rig.position.y=-.38;
    aL=aR=-2.8;hx=.55;tx=.65;
  }else if(!u.seated){
    u.legL.rotation.x=sw*.7*w;u.legR.rotation.x=-sw*.7*w;u.rig.position.y=Math.abs(Math.cos(u.phase))*.06*w;
    aL=-sw*.6*w+br*.04;aR=sw*.6*w-br*.04;tx=.06*w;
    if(act==="phone"){aR=-2.5;zR=-.55;hy=.25;}
    else if(act==="type"){aL=-1.15+Math.sin(t*14)*.08;aR=-1.15+Math.sin(t*14+1.6)*.08;hx=.25;}
    else if(act==="board"){aR=-2.7+Math.sin(t*3)*.15;zR=-.2+Math.sin(t*6)*.35;hy=Math.sin(t*.8)>.6?2.6:0;}
    else if(act==="stretch"){aL=aR=-3.0;zL=.3;zR=-.3;}
    else if(act==="game"){aL=aR=-1.35;hx=.45;zL=.3;zR=-.3;}
    else if(act==="cheer"){aL=aR=-2.9+Math.sin(t*10)*.2;}
    else if(act==="wave"){aR=-2.8;zR=-.4+Math.sin(t*9)*.45;}
    else if(act==="cup"){aR=-1.5;zR=-.3;}
  }else{
    aL=-.95;aR=-.95;hx=.1;
    if(act==="sleep"){aL=aR=-1.4;hx=.6;tx=.5;}
    else if(act==="game"){aL=aR=-1.25;hx=.5;zL=.25;zR=-.25;}
    else if(act==="stretch"){aL=aR=-3.0;zL=.3;zR=-.3;hx=-.2;}
    else if(act==="raise"){aR=-3.05+Math.sin(t*6)*.08;}
    else if(act==="chat"){hy=Math.sin(t*2+u.seed)*.9;aR=-.9+Math.sin(t*5)*.25;}
    else {aR=-.98+Math.sin(t*7+u.seed)*.07*(Math.sin(t*.9+u.seed)>0?1:0);hx=.25+(Math.sin(t*.4+u.seed)>.8?.2:0);}
  }
  if(st.talk){aR=-1.1+Math.sin(t*7+u.seed)*.35;zR=-.25;hy=Math.sin(t*1.7+u.seed)*.25;}
  if(st.raise){aR=-3.05+Math.sin(t*6)*.08;zR=0;}
  u.armL.rotation.x=L(u.armL.rotation.x,aL);u.armR.rotation.x=L(u.armR.rotation.x,aR);u.armL.rotation.z=L(u.armL.rotation.z,zL);u.armR.rotation.z=L(u.armR.rotation.z,zR);
  if(u.mouth){u.mouth.scale.y=st.talk?1+Math.abs(Math.sin(t*14))*2.6:(act==="sleep"?.6:1);u.mouth.scale.x=act==="cheer"||act==="chat"?1.4:1;
    const bl=(t+u.seed)%4<.12||act==="sleep";u.eyes.forEach(e=>e.scale.y=bl?.15:1);}
  u.head.rotation.x=L(u.head.rotation.x,hx);u.head.rotation.y=L(u.head.rotation.y,hy);u.torso.rotation.x=L(u.torso.rotation.x,tx);u.torso.scale.y=1+br*.015;
}
/* 每層樓一個群組：只顯示玩家所在樓層 */
const FLOOR_GROUPS=[];let curFloor=0;
function buildWorld(){
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(innerWidth<600?1.5:2,window.devicePixelRatio||1));stage.appendChild(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,200);
  hemi=new THREE.HemisphereLight(0xffffff,0x80868e,.9);scene.add(hemi);sun=new THREE.DirectionalLight(0xffffff,.5);sun.position.set(-8,16,10);scene.add(sun);
  ground=new THREE.Mesh(new THREE.PlaneGeometry(W+80,H+80),new THREE.MeshBasicMaterial({visible:false}));ground.rotation.x=-Math.PI/2;ground.position.set(W/2,0,H/2);scene.add(ground);
  const fl=(f,r,c)=>box(r[2]-r[0],.1,r[3]-r[1],c,FLX(f,(r[0]+r[2])/2),-.05,(r[1]+r[3])/2);
  for(let f=0;f<FLOOR_N;f++){fl(f,[0,7,30,9.5],0xcdd2d6);
    // 走廊地板黃線
    rbox([FLX(f,0),7.05,FLX(f,30),7.1],.015,0xe2b33c);rbox([FLX(f,0),9.4,FLX(f,30),9.45],.015,0xe2b33c);}
  ROOMS.forEach(r=>fl(r.f,r.rect,r.floor));
  WALLS.forEach(r=>{rbox(r,1.1,C.wall);rbox(r,.04,C.wallTop,1.1);});
  ZONES.forEach(([t,x,z,r])=>floorText(t,x,z,r));
  ROOMS.forEach(furnishRoom);
  // 門牌：貼在走廊那一面的牆上
  ROOMS.forEach(r=>{if(r.open||!r.door)return;const top=r.rect[3]===7,x=FLX(r.f,r.door[1]+.75),z=top?7.12:9.38;
    wallSign(r.name,x,1.42,z,top?0:Math.PI,Math.min(1.4,.36+r.name.length*.17),.3,"#ffffff",r.f===1?"#c2410c":r.f===2?"#2f5d8a":"#425466",34);});
  // 每層電梯廳的樓層標示
  const FLOOR_SIGN=["1F　大廳・櫃台・主任室・美語","2F　國小安親","3F　國中部"];
  for(let f=0;f<FLOOR_N;f++)wallSign(FLOOR_SIGN[f],FLX(f,33),1.9,.22,0,4.6,.5,"#ffffff","#1c2633",44);
  marker=label("！","#ffffff","#c9302a",56);marker.scale.multiplyScalar(.75);scene.add(marker);
  resize();window.addEventListener("resize",resize);buildGrid();
}
/* 依房間種類擺家具（樓層內座標 → 全域座標） */
function furnishRoom(r){
  const f=r.f,o=f*FLOOR_GAP,R4=(a,b,c,d)=>[o+a,b,o+c,d],[x0,z0,x1,z1]=r.rect,cx=(x0+x1)/2;
  const classroom=(kid)=>{const top=z0===0,bz=top?.25:17.75,ry=top?0:Math.PI,bw=x1-x0-3;
    box(bw+.2,1.3,.06,C.frame,o+cx,1.55,bz);box(bw,1.18,.07,C.board,o+cx,1.55,top?bz+.02:bz-.02);
    const b=wallSign({g1:"今日作業\n國習 p.12・生字一行",g2:"今日作業\n數習 p.32・國習 p.18",g34:"今日作業\n數學評量 第三回",c7:"段考範圍\n數學 1-1～2-2",c8:"段考範圍\n理化 第一章～第三章",c9:"會考倒數 210 天\n段考：下週二、三",english:"Unit 3\nWhat's your name?"}[r.id]||"",o+cx,1.6,top?bz+.07:bz-.07,ry,Math.min(4.2,bw-.6),.9,"#1d4fc4","#ffffff",56);
    b.userData={w:Math.min(4.2,bw-.6),h:.9};BOARDS[r.id]=b;
    const pz=top?1.6:16.4;furn([o+cx-.6,pz-.3,o+cx+.6,pz+.3],1.0,0x6b4f39);
    seatsOf(r.id).forEach(([x,z,rot])=>{const dz=rot===Math.PI?-.62:.62;furn([x-.5,z+dz-.25,x+.5,z+dz+.25],kid?.53:.72,C.desk,C.deskTop);chair(x,z,rot,kid);solids.push([x-.28,z-.25,x+.28,z+.25]);});
  };
  switch(r.id){
   case"office":furn(R4(2,2,5.5,3),.78,C.desk,C.deskTop);furn(R4(.3,.3,1.8,.8),1.7,C.shelf);furn(R4(6.3,.3,7.7,.8),1.3,0x6b7479);
     wallSign("本期續班目標 85%",o+4,1.7,.22,0,2.6,.5,"#c9302a","#ffffff",48);chair(o+3.75,1.4,0);break;
   case"copyroom":furn(R4(9,1,11,2),1.05,C.copier,0x4a5560);furn(R4(12,.3,13.7,1.3),1.4,C.shelf);furn(R4(11.4,4.3,13.6,5.1),.8,0xbfb6a6,0xe9e2d4);break;
   case"consult":furn(R4(16.3,2.6,17.7,3.6),.74,0xcfc6b5,0xe9e2d4);chair(o+17,2.1,0);chair(o+17,4.1,Math.PI);furn(R4(18.6,.3,19.7,1.4),1.4,C.shelf);break;
   case"staff":furn(R4(23,2.6,26,3.6),.74,0xcfc6b5,0xe9e2d4);[23.7,25.3].forEach(x=>{chair(o+x,2.1,0);chair(o+x,4.1,Math.PI);});
     furn(R4(28,.3,29.6,1.1),1.8,0xe6e9ec);furn(R4(20.4,.3,23,.9),.9,0xbfb6a6);box(.5,.3,.36,0x333a44,o+21.2,1.05,.6);break;
   case"core1":case"core2":case"core3":
     furn(R4(30.3,.3,32.7,2.8),2.4,0x8b949c);box(1.2,2,.05,0xb6bec6,o+31.5,1,2.83);
     furn(R4(33.2,.3,35.8,2.8),.2,0x9aa3ab);for(let i=1;i<6;i++)box(2.6,.2,.4,0xa7afb7,o+34.5,.1+i*.2,2.8-i*.45);break;
   case"lobby":furn(R4(2,10.4,8,11),1.0,C.counter,0xe9e4d8);box(.5,.35,.05,0x222831,o+3,1.25,10.55);box(.32,.12,.22,0x222222,o+6.6,1.12,10.7);
     chair(o+3,10,Math.PI);chair(o+6,10,Math.PI);
     furn(R4(6.6,16.6,7.2,17.0),1.2,0x3d4650);box(.3,.2,.04,0x7fd1ff,o+6.9,1.1,16.58);
     furn(R4(.3,13,.9,17.4),1.1,0xb59a72);
     furn(R4(10,15.2,13.6,16.1),.45,C.sofa);rbox(R4(10,16.1,13.6,16.4),.85,C.sofa);
     wallSign("會考榜單\n建中 2・北一女 1・5A++ 4",o+.22,1.6,12,Math.PI/2,2.2,1.1,"#c9302a","#fff6e8",46);
     wallSign("國小安親・美語　國中課輔・會考衝刺",o+12,1.7,17.78,Math.PI,4,.5,"#c9302a","#ffffff",44);
     wallSign("刷卡",o+6.9,1.75,17.73,Math.PI,.6,.26,"#ffffff","#2f5d8a",34);
     {const plant=new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),new THREE.MeshLambertMaterial({color:0x5f8a4f}));plant.position.set(o+15.2,.65,17);scene.add(plant);solids.push(R4(14.8,16.6,15.6,17.4));}
     break;
   case"english":classroom(true);break;
   case"store":furn(R4(32,10,35.7,10.8),1.6,C.shelf);furn(R4(35,11.5,35.7,17.4),1.6,C.shelf);break;
   case"g1":case"g2":case"g34":classroom(true);break;
   case"careoffice":furn(R4(1,12,4.5,13),.74,0xcfc6b5,0xe9e2d4);chair(o+2.75,11.5,0);furn(R4(6.8,10,7.7,11.4),1.5,0xe6e9ec);box(.3,.24,.06,0xe03131,o+7.25,1.2,11.43);furn(R4(.3,15,1.2,17.6),1.4,C.shelf);break;
   case"wash":furn(R4(8.3,10.3,8.9,17.4),.7,0xdfe6ea);break;
   case"reading":furn(R4(12.3,17.1,21.7,17.7),1.2,C.shelf);rbox(R4(14,12,20,15.5),.03,0x9ac0a5);break;
   case"snack":furn(R4(23,12.6,29,13.4),.6,0xcfc6b5,0xe9e2d4);break;
   case"cubby":furn(R4(33.2,10,35.7,17.5),1.2,0xb59a72);break;
   case"c7":case"c8":case"c9":classroom(false);if(r.id==="c9")wallSign("會考倒數 210 天",o+25,1.7,6.88,Math.PI,2.4,.45,"#2b8a3e","#ffffff",44);break;
   case"jhlounge":furn(R4(1,12,4.5,13),.74,0xcfc6b5,0xe9e2d4);chair(o+2,11.5,0);chair(o+3.5,13.5,Math.PI);furn(R4(.3,15,.9,17.6),1.6,C.metal);break;
   case"tutor":furn(R4(9,12,19,12.9),.74,0xc9c2b2,0xe7e1d3);furn(R4(9,15,19,15.9),.74,0xc9c2b2,0xe7e1d3);break;
   case"lockers":furn(R4(27.2,10,27.8,17.6),1.5,0x7d8b99);furn(R4(21,16.8,23.6,17.6),.8,0xc9c2b2,0xe7e1d3);box(.5,.18,.35,0xd9480f,o+22.3,.9,17.2);
     wallSign("手機請放籃子",o+24,1.7,17.78,Math.PI,2.2,.42,"#1c2633","#ffd43b",44);break;
   case"jhoffice":furn(R4(30,12,33.5,13),.74,0xcfc6b5,0xe9e2d4);chair(o+31.75,11.5,0);furn(R4(35,10,35.7,14),1.6,C.shelf);break;
  }
}
/* 建好之後，把靜態物件依位置分進各樓層群組，切樓層時只顯示一層 */
function assignFloors(skip){
  for(let f=0;f<FLOOR_N;f++){const g=new THREE.Group();g.name="floor"+f;scene.add(g);FLOOR_GROUPS[f]=g;}
  // 靜態物件的群組都在原點、直接放在場景下，用自己的位置（或第一個子物件的位置）判斷樓層。
  [...scene.children].forEach(o=>{if(skip.has(o)||o.isLight||o===ground||o===marker||FLOOR_GROUPS.includes(o)||o.isSprite||(o.userData&&o.userData.rig))return;
    let x=o.position.x;if(!x&&o.children&&o.children.length)x=o.children[0].position.x;FLOOR_GROUPS[floorOf(x)].add(o);});
  showFloor(0);
}
function showFloor(f){curFloor=f;FLOOR_GROUPS.forEach((g,i)=>{if(g)g.visible=i===f;});}
/* 人物、標記：不在目前樓層就不畫（不影響「在不在場」的邏輯） */
function floorCull(o){if(!o)return;const on=floorOf(o.position.x)===curFloor;if(o.userData&&o.userData.rig){o.children.forEach(c=>c.visible=on);}else o.visible=o.visible&&on;}
function makeNPC(id){const c=CHARS[id];const p=person(c.body,{name:`${c.name}｜${c.short}`,tagBg:c.color,hair:c.hair,kid:c.kid});npcs[id]=p;p.visible=false;return p;}
function makePlayer(line){if(player)scene.remove(player);player=person(line.body,{name:`你｜${line.short}`,tagBg:"#d9a21b",hair:0x2a2421});return player;}
/* 走到某處：坐著的人先站起來；到了如果是椅子就坐下 */
function trafficAvoid(p){
  // Reserve standing story destinations, including NPCs still en route.
  // Moving students yield physically instead of turning the whole queue into
  // an impassable temporary wall in the planning grid.
  const avoid=[];for(const n of Object.values(npcs)){if(n===p||!n.visible)continue;const u=n.userData,a=u.anchor;
    if(u.path&&a&&!isChair(a[0],a[1]))avoid.push([a[0],a[1]]);
    else if(!u.seated&&!u.path)avoid.push([n.position.x,n.position.z]);
  }return avoid;
}
function replanTraffic(){for(const n of Object.values(npcs).concat(extras.map(e=>e.p))){const u=n.userData;if(!n.visible||!u.path?.length)continue;const end=u.path[u.path.length-1],route=findPathFrom(n.position.x,n.position.z,end[0],end[1],trafficAvoid(n));if(route){route.push(end);u.path=route;}}}
function agentGo(p,x,z,rot,onArrive){const u=p.userData;
  // Ambient offsets and story targets can fall inside a desk. Finish on a free
  // cell instead of appending an unchecked segment through furniture.
  if(!isChair(x,z)&&blockedAt(x,z)){const cell=nearestFree(...cellOf(x,z));if(!cell){u.path=null;u.moving=false;u.routeFailed=true;return;}const [i,j]=cell;x=(i+.5)*CELL;z=(j+.5)*CELL;}
  const pth=findPathFrom(p.position.x,p.position.z,x,z,trafficAvoid(p));if(!pth){u.path=null;u.moving=false;u.routeFailed=true;return;}
  u.routeFailed=false;
  if(u.seated){u.departSeat=[p.position.x,p.position.z];setPose(p,false);}pth.push([x,z]);u.path=pth;u.endRot=rot;u.onArrive=onArrive||null;}
function agentPlace(p,x,z,rot){const u=p.userData;u.path=null;u.moving=false;u.stepDistance=0;u.onArrive=null;p.position.set(x,0,z);p.rotation.y=rot??Math.PI;setPose(p,isChair(x,z));}
let nextEntryAt=0;
function entryFree(from){return clockT.elapsedTime>=nextEntryAt&&!Object.values(npcs).concat(extras.map(e=>e.p)).some(p=>p.visible&&Math.hypot(p.position.x-from[0],p.position.z-from[1])<.85);}
function enterAgent(p,from,to,onArrive){
  if(!entryFree(from))return false;
  nextEntryAt=clockT.elapsedTime+1.6;p.visible=true;agentPlace(p,from[0],from[1],Math.PI);setPose(p,false);
  agentGo(p,to[0],to[1],to[2],onArrive);return true;
}
function setNPC(id,spec,instant){ // spec: [x,z,rotY] 或 null（不在場）
  const n=npcs[id]||makeNPC(id);const u=n.userData;if(!spec){n.visible=false;u.path=null;u.entrySpec=null;u.moving=false;return;}
  u.anchor=[spec[0],spec[1],spec[2]??Math.PI];
  const far=Math.hypot(n.position.x-spec[0],n.position.z-spec[1]);
  if(!instant&&n.visible&&far>.3&&far<45){agentGo(n,spec[0],spec[1],spec[2]??Math.PI);return;}
  if(!instant&&!n.visible&&spec[3]){u.entrySpec=spec;if(enterAgent(n,spec[3],u.anchor))u.entrySpec=null;return;}
  u.entrySpec=null;
  n.visible=true;agentPlace(n,spec[0],spec[1],spec[2]);}
function moveAgent(n,dt,speed=2.6){const u=n.userData;u.stepDistance=0;u.moving=false;if(!u.path||!n.visible||u.act==='cover')return;
  if(!u.path.length){u.path=null;u.moving=false;if(u.endRot!=null)n.rotation.y=u.endRot;setPose(n,isChair(n.position.x,n.position.z));const f=u.onArrive;u.onArrive=null;f&&f();return;}
  if(u.path[0].via){portalHop(n,u.path.shift());return;}
  // Passing traffic can carry an actor beyond an intermediate waypoint. Do
  // not turn back into the same merge point: retain only the forward segment
  // when the connector is clear. The final destination still arrives exactly.
  while(u.path.length>1){
    const [ax,az]=u.path[0],[bx,bz]=u.path[1];
    if((n.position.x-ax)*(bx-ax)+(n.position.z-az)*(bz-az)<=0||!los(n.position.x,n.position.z,bx,bz,trafficAvoid(n),R))break;
    u.path.shift();
  }
  const [x,z]=u.path[0],vx=x-n.position.x,vz=z-n.position.z,d=Math.hypot(vx,vz);
  if(d<.025){u.path.shift();return;}
  const sp=Math.min(d,speed*dt),nx=n.position.x+vx/d*sp,nz=n.position.z+vz/d*sp;
  // Following traffic yields before body overlap. Seated people are part of furniture.
  const actors=Object.values(npcs).concat(extras.map(e=>e.p));
  // Story placements may start slightly overlapping. A recovery step must
  // increase separation until the normal body clearance is restored.
  const actorsClear=(a,b)=>!actors.some(p=>p!==n&&p.visible&&!p.userData.seated&&Math.hypot(a-p.position.x,b-p.position.z)<Math.min(.66,Math.hypot(n.position.x-p.position.x,n.position.z-p.position.z))-.00001);
  const obstacle=actors.find(p=>p!==n&&p.visible&&!p.userData.seated&&Math.hypot(nx-p.position.x,nz-p.position.z)<.66&&Math.hypot(nx-p.position.x,nz-p.position.z)<Math.hypot(n.position.x-p.position.x,n.position.z-p.position.z));
  if(obstacle){
    u.yieldTime=(u.yieldTime||0)+dt;
    // A stationary actor will never clear the lane. Replan immediately:
    // alternating forward/back steps otherwise reset the yield timer forever.
    if(!obstacle.userData.path||u.yieldTime>.6){
      const end=u.path[u.path.length-1],avoid=trafficAvoid(n);
      if(obstacle.userData.path)avoid.push([obstacle.position.x,obstacle.position.z]);
      const detour=findPathFrom(n.position.x,n.position.z,end[0],end[1],avoid);
      if(detour){detour.push(end);u.path=detour;u.yieldTime=0;return;}u.yieldTime=0;
    }
    // A small passing step lets opposing traffic and standing NPCs clear each other.
    const side=u.passSide||1;
    // At a desk edge both perpendicular steps can be blocked. Back out along
    // the incoming lane so a safe grid connector becomes available again.
    for(const [ox,oz,sign] of [[vz/d*side,-vx/d*side,side],[-vz/d*side,vx/d*side,-side],[-vx/d,-vz/d,side]]){
      const sx=n.position.x+ox*sp,sz=n.position.z+oz*sp;
      if(!blockedAt(sx,sz)&&actorsClear(sx,sz)){
        n.rotation.y=Math.atan2(ox,oz);n.position.x=sx;n.position.z=sz;u.passSide=sign;u.stepDistance=sp;u.moving=true;return;
      }
    }return;
  }
  u.yieldTime=0;
  // The final approach may enter only its own chair footprint; route segments stay on the grid.
  const ownSeat=u.path.length===1&&isChair(x,z)&&d<.9;
  if(u.departSeat&&Math.hypot(nx-u.departSeat[0],nz-u.departSeat[1])>.9)u.departSeat=null;
  const hitSolid=(a,b)=>solids.some(s=>a>s[0]-R&&a<s[2]+R&&b>s[1]-R&&b<s[3]+R&&!(ownSeat&&x>s[0]&&x<s[2]&&z>s[1]&&z<s[3])&&!(u.departSeat&&u.departSeat[0]>s[0]&&u.departSeat[0]<s[2]&&u.departSeat[1]>s[1]&&u.departSeat[1]<s[3]));
  if(hitSolid(nx,nz)){
    // Axis-wise escape prevents a smoothed path from cutting a desk corner
    // after a passing step, without allowing any penetration of the desk.
    for(const [ax,az] of [[n.position.x,nz],[nx,n.position.z]]){
      const travel=Math.hypot(ax-n.position.x,az-n.position.z);
      if(travel>.0001&&!hitSolid(ax,az)&&actorsClear(ax,az)){
        setPose(n,false);n.rotation.y=Math.atan2(ax-n.position.x,az-n.position.z);n.position.x=ax;n.position.z=az;u.stepDistance=travel;u.moving=true;return;
      }
    }
    // Preserve traffic avoidance when recovering from a furniture corner.
    // A static-only replan here erased the detour and sent actors straight
    // back through the teacher at the podium on the following frame.
    u.blockTime=(u.blockTime||0)+dt;if(u.blockTime>.2){const end=u.path[u.path.length-1],reroute=findPathFrom(n.position.x,n.position.z,end[0],end[1],trafficAvoid(n));if(reroute){reroute.push(end);u.path=reroute;}u.blockTime=0;}return;
  }
  u.blockTime=0;
  setPose(n,false);n.position.x=nx;n.position.z=nz;n.rotation.y=Math.atan2(vx,vz);u.stepDistance=sp;u.moving=true;}
function moveNPCs(dt){
  for(const id in npcs){const n=npcs[id],u=n.userData;if(u.entrySpec){const s=u.entrySpec;if(enterAgent(n,s[3],u.anchor))u.entrySpec=null;}moveAgent(n,dt);}
  extras.forEach(e=>moveAgent(e.p,dt,e.speed||2.05));
}
function addInfoMark(info){const s=label("i","#ffffff","#5f6b78",40);s.scale.multiplyScalar(.75);s.position.set(info.pos[0],info.h||1.6,info.pos[1]);scene.add(s);infoMarks[info.id]=s;}
function addSideMark(){const s=label("？","#1c2633","#f0b45a",48);s.scale.multiplyScalar(.75);scene.add(s);return s;}
/* 收集物：地上一閃一閃的四角星（金色星星加深色外框與影子，淺色地板上也看得到） */
let sparkTex=null,shadowTex=null;
function sparkTextures(){if(sparkTex)return;
  const star=(g,c,R,r)=>{g.beginPath();for(let k=0;k<8;k++){const a=k*Math.PI/4-Math.PI/2,rr=k%2?r:R;g.lineTo(c+Math.cos(a)*rr,c+Math.sin(a)*rr);}g.closePath();};
  sparkTex=canvasTex(128,128,(g,W)=>{const c=W/2;
    const gr=g.createRadialGradient(c,c,0,c,c,c);gr.addColorStop(0,"rgba(255,214,90,.55)");gr.addColorStop(1,"rgba(255,214,90,0)");g.fillStyle=gr;g.fillRect(0,0,W,W);
    star(g,c,c-6,13);g.lineJoin="round";g.lineWidth=7;g.strokeStyle="rgba(120,72,0,.9)";g.stroke();g.fillStyle="#ffcf3a";g.fill();
    star(g,c,c*.5,6);g.fillStyle="#ffffff";g.fill();});
  shadowTex=canvasTex(64,64,(g,W)=>{const c=W/2,gr=g.createRadialGradient(c,c,0,c,c,c);gr.addColorStop(0,"rgba(40,30,0,.45)");gr.addColorStop(1,"rgba(40,30,0,0)");g.fillStyle=gr;g.fillRect(0,0,W,W);});}
function addItemMark(item){sparkTextures();const g=new THREE.Group();g.position.set(item.pos[0],0,item.pos[1]);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(.7,.7),new THREE.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.015;g.add(sh);
  const mk=()=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:sparkTex,transparent:true,depthWrite:false,depthTest:false}));s.renderOrder=9;g.add(s);return s;};
  const star=mk();star.position.y=.5;const small=mk();small.position.set(.25,.32,.1);
  g.userData={star,small,sh,seed:Math.random()*10};scene.add(g);itemMarks[item.id]=g;}
function tickItemMarks(t){Object.values(itemMarks).forEach(g=>{const u=g.userData;if(!u||!u.star)return;
  const c=((t+u.seed)%1.4)/1.4,f=c<.4?Math.sin(c/.4*Math.PI):0;u.star.scale.setScalar(.38+.42*f);u.star.material.opacity=.7+.3*f;u.star.material.rotation=Math.sin(t*1.5+u.seed)*.25;
  u.star.position.y=.5+Math.sin(t*2+u.seed)*.05;u.sh.scale.setScalar(.8+.3*f);
  const c2=((t*1.3+u.seed+.7)%1.4)/1.4,f2=c2<.3?Math.sin(c2/.3*Math.PI):0;u.small.scale.setScalar(.05+.25*f2);u.small.material.opacity=f2;});}
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<600?52:38;camera.updateProjectionMatrix();}

/* ---------- 碰撞與尋路（三層樓） ---------- */
// 樓層之間的空白區、樓層外都算牆。
// 碰撞查詢很頻繁（尋路平滑、視線檢查），solids 依 x 分桶；solids 只會增加，長度變了就重建。
const SOLID_BIN=2,SOLID_PAD=.5;let solidBins=null,solidBinN=-1;
function solidsNear(x){if(solidBinN!==solids.length){solidBinN=solids.length;solidBins=[];const nb=Math.ceil(W/SOLID_BIN)+1;for(let b=0;b<nb;b++)solidBins.push([]);
    for(const s of solids){const a=Math.max(0,Math.floor((s[0]-SOLID_PAD)/SOLID_BIN)),c=Math.min(nb-1,Math.floor((s[2]+SOLID_PAD)/SOLID_BIN));for(let b=a;b<=c;b++)solidBins[b].push(s);}}
  return solidBins[Math.max(0,Math.min(solidBins.length-1,Math.floor(x/SOLID_BIN)))];}
function blockedAt(x,z,r=R,ignore=[]){if(x<r||z<r||x>W-r||z>H-r)return true;const lx=x-floorOf(x)*FLOOR_GAP;if(lx<r||lx>FLOOR_W-r)return true;
  const list=r<=SOLID_PAD?solidsNear(x):solids;
  for(const s of list){if(x>s[0]-r&&x<s[2]+r&&z>s[1]-r&&z<s[3]+r&&!ignore.includes(s))return true;}return false;}
const PORTAL_LINKS=new Map();// 格子 → [[另一端格子, 成本(格), portal]]
function buildGrid(){gridB=new Uint8Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)gridB[j*GW+i]=blockedAt((i+.5)*CELL,(j+.5)*CELL)?1:0;
  PORTAL_LINKS.clear();const link=(a,b,c,p)=>{const k=cellOf(...a),q=cellOf(...b),ka=k[1]*GW+k[0],kb=q[1]*GW+q[0];if(!PORTAL_LINKS.has(ka))PORTAL_LINKS.set(ka,[]);PORTAL_LINKS.get(ka).push([kb,c,p]);};
  // 成本換算成「走幾格」：樓梯約 6 公尺、電梯約 10 公尺（含等待）。
  PORTALS.forEach(p=>{const c=(p.kind==="stairs"?6:10)/CELL;link(p.a,p.b,c,p);link(p.b,p.a,c,p);});}
const cellOf=(x,z)=>[Math.max(0,Math.min(GW-1,Math.floor(x/CELL))),Math.max(0,Math.min(GH-1,Math.floor(z/CELL)))];
function nearestFree(i,j,cells=gridB,reachable=()=>true){const free=(a,b)=>!cells[b*GW+a]&&reachable((a+.5)*CELL,(b+.5)*CELL);if(free(i,j))return[i,j];for(let r=1;r<40;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<GW&&b<GH&&floorOf((a+.5)*CELL)===floorOf((i+.5)*CELL)&&free(a,b))return[a,b];}return null;}
function los(ax,az,bx,bz,avoid=[],radius=R+.07,ignore=[]){if(floorOf(ax)!==floorOf(bx))return false;const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.05);
  // 只留離線段夠近、可能擋路的人（每個人的門檻是 min(.72, 與起點距離)）
  let av=null;if(avoid.length){const ux=bx-ax,uz=bz-az,L2=ux*ux+uz*uz||1e-9;for(const p of avoid){const lim=Math.min(.72,Math.hypot(ax-p[0],az-p[1]))-.00001;if(lim<=0)continue;const t=Math.max(0,Math.min(1,((p[0]-ax)*ux+(p[1]-az)*uz)/L2));if(Math.hypot(ax+ux*t-p[0],az+uz*t-p[1])<lim)(av||(av=[])).push([p[0],p[1],lim]);}}
  for(let k=1;k<=n;k++){const t=k/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;if(blockedAt(x,z,radius,ignore))return false;if(av)for(const p of av)if(Math.hypot(x-p[0],z-p[1])<p[2])return false;}return true;}
function findPath(tx,tz){return findPathFrom(player.position.x,player.position.z,tx,tz);}
/* 二元堆積 */
function heapPush(h,f,k,fs){h.push(k);fs.push(f);let i=h.length-1;while(i>0){const p=(i-1)>>1;if(fs[p]<=fs[i])break;[h[p],h[i]]=[h[i],h[p]];[fs[p],fs[i]]=[fs[i],fs[p]];i=p;}}
function heapPop(h,fs){const top=h[0],last=h.pop(),lf=fs.pop();if(h.length){h[0]=last;fs[0]=lf;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<h.length&&fs[l]<fs[m])m=l;if(r<h.length&&fs[r]<fs[m])m=r;if(m===i)break;[h[m],h[i]]=[h[i],h[m]];[fs[m],fs[i]]=[fs[i],fs[m]];i=m;}}return top;}
let _pathBuf=null;
function findPathFrom(fx,fz,tx,tz,avoid=[]){
  let routeGrid=gridB;
  if(avoid.length){routeGrid=gridB.slice();const rr=Math.ceil(.72/CELL);
    avoid.forEach(([px,pz])=>{const [ci,cj]=cellOf(px,pz);for(let dj=-rr;dj<=rr;dj++)for(let di=-rr;di<=rr;di++){const i=ci+di,j=cj+dj;if(i<0||j<0||i>=GW||j>=GH)continue;if(Math.hypot((i+.5)*CELL-px,(j+.5)*CELL-pz)<.72)routeGrid[j*GW+i]=1;}});}
  // A passing step can leave the current cell inside another actor's planning
  // margin. Select a reachable start in the SAME temporary grid.
  // 終點在家具裡（例如椅子）時，附近 1 公尺內所有空格都算終點，避免挑到被桌子圍住的小角落。
  const starts=[],tc=cellOf(tx,tz),goals=new Set();
  if(!routeGrid[tc[1]*GW+tc[0]])goals.add(tc[1]*GW+tc[0]);
  else{const rr=Math.ceil(1/CELL),tf=floorOf(tx);for(let dj=-rr;dj<=rr;dj++)for(let di=-rr;di<=rr;di++){const i=tc[0]+di,j=tc[1]+dj;if(i<0||j<0||i>=GW||j>=GH||routeGrid[j*GW+i])continue;const x=(i+.5)*CELL,z=(j+.5)*CELL;if(floorOf(x)===tf&&Math.hypot(x-tx,z-tz)<=1)goals.add(j*GW+i);}}
  const end=goals.size?tc:nearestFree(...tc,routeGrid);if(!goals.size&&end)goals.add(end[1]*GW+end[0]);
  if(blockedAt(fx,fz)&&isChair(fx,fz)){
    const ownSeat=solids.filter(s=>fx>s[0]&&fx<s[2]&&fz>s[1]&&fz<s[3]),[ci,cj]=cellOf(fx,fz);
    for(let dj=-4;dj<=4;dj++)for(let di=-4;di<=4;di++){const i=ci+di,j=cj+dj,x=(i+.5)*CELL,z=(j+.5)*CELL;if(i>=0&&j>=0&&i<GW&&j<GH&&!routeGrid[j*GW+i]&&Math.hypot(x-fx,z-fz)<=.9&&los(fx,fz,x,z,avoid,R,ownSeat))starts.push([i,j]);}
  }else{const start=nearestFree(...cellOf(fx,fz),routeGrid,(x,z)=>los(fx,fz,x,z,avoid,R));if(start)starts.push(start);}
  if(!starts.length||!end)return null;
  const [gi,gj]=end,N=GW*GH,gf=floorOf((gi+.5)*CELL);let goal=-1;
  if(!_pathBuf||_pathBuf.g.length!==N)_pathBuf={g:new Float32Array(N),prev:new Int32Array(N),closed:new Uint8Array(N),via:new Int16Array(N)};
  const {g,prev,closed,via}=_pathBuf;g.fill(1e9);prev.fill(-1);closed.fill(0);via.fill(-1);
  // 啟發值：同樓層用直線距離；不同樓層先算到電梯廳再加最低換層成本，保持可採納。
  const coreX=CORE.elev[0]/CELL,coreZ=CORE.elev[1]/CELL,gl=gi-gf*FLOOR_GAP/CELL;
  const h=k=>{const i=k%GW,j=(k/GW)|0,f=floorOf((i+.5)*CELL);if(f===gf)return Math.hypot(i-gi,j-gj);const li=i-f*FLOOR_GAP/CELL;return Math.hypot(li-coreX,j-coreZ)+Math.hypot(gl-coreX,gj-coreZ)+6/CELL*Math.abs(f-gf);};
  const open=[],fs=[];starts.forEach(([i,j])=>{const k=j*GW+i;g[k]=Math.hypot((i+.5)*CELL-fx,(j+.5)*CELL-fz)/CELL;heapPush(open,g[k]+h(k),k,fs);});let reached=false;
  while(open.length){const cur=heapPop(open,fs);if(goals.has(cur)){goal=cur;reached=true;break;}if(closed[cur])continue;closed[cur]=1;const ci=cur%GW,cj=(cur/GW)|0;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const a=ci+di,b=cj+dj;if(a<0||b<0||a>=GW||b>=GH)continue;const k=b*GW+a;
      if(routeGrid[k]||closed[k])continue;if(di&&dj&&(routeGrid[cj*GW+a]||routeGrid[b*GW+ci]))continue;const ng=g[cur]+(di&&dj?1.414:1);if(ng<g[k]){g[k]=ng;prev[k]=cur;via[k]=-1;heapPush(open,ng+h(k),k,fs);}}
    const links=PORTAL_LINKS.get(cur);if(links)links.forEach(([k,c,p])=>{if(closed[k]||routeGrid[k])return;const ng=g[cur]+c;if(ng<g[k]){g[k]=ng;prev[k]=cur;via[k]=PORTALS.indexOf(p);heapPush(open,ng+h(k),k,fs);}});}
  if(!reached)return null;
  // 還原路徑：遇到跨樓層連結就分段，連結那一點標記 via（走到前一段終點後直接換到這一點）。
  const segs=[[]];for(let k=goal;k!==-1;k=prev[k]){const pt=[(k%GW+.5)*CELL,(((k/GW)|0)+.5)*CELL];segs[0].unshift(pt);if(via[k]>=0){pt.via=PORTALS[via[k]].kind;segs.unshift([]);}}
  const out=[];let ax=fx,az=fz;
  segs.forEach(pts=>{if(!pts.length)return;if(pts[0].via){out.push(pts[0]);[ax,az]=pts[0];pts=pts.slice(1);}
    // 拉直：從目前錨點往前延伸到最後一個看得到的點（避免整條路徑倒著逐點檢查）。
    let i=0;while(i<pts.length){let j=i;while(j+1<pts.length&&los(ax,az,pts[j+1][0],pts[j+1][1],avoid))j++;out.push(pts[j]);[ax,az]=pts[j];i=j+1;}});
  return out;
}
/* 走到跨樓層連結的下一點：直接換樓層 */
function portalHop(o,pt){const from=floorOf(o.position.x);o.position.x=pt[0];o.position.z=pt[1];if(o===player){const to=floorOf(pt[0]);showFloor(to);onFloorChange&&onFloorChange(pt.via,from,to);}}
/* 每幀：不在目前樓層的人物與標記不畫 */
function floorCullAll(){const f=curFloor,on=o=>floorOf(o.position.x)===f;
  for(const id in npcs){const n=npcs[id];n.children.forEach(c=>c.visible=on(n));}
  extras.forEach(e=>e.p.children.forEach(c=>c.visible=on(e.p)));
  if(marker&&marker.visible&&!on(marker))marker.visible=false;
  [itemMarks,infoMarks,typeof sideMarks!=="undefined"?sideMarks:{}].forEach(o=>Object.values(o).forEach(m=>{if(m.visible&&!on(m))m.visible=false;}));}
let onFloorChange=null;
function stepPlayer(x,z){const p=player.position;if(blockedAt(p.x,p.z)){p.x=x;p.z=z;return;}if(!blockedAt(x,p.z))p.x=x;if(!blockedAt(p.x,z))p.z=z;}
