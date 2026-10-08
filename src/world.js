/* ================= 3D 樓層 ================= */
const W=28,H=18;
const WALLS=[
 [0,0,28,.2],[0,17.8,28,18],[0,0,.2,18],[27.8,0,28,18],
 [0,4.9,9,5.1],[0,8.9,9,9.1],
 [8.9,0,9.1,1.5],[8.9,3.5,9.1,6],[8.9,8,9.1,12],[8.9,15,9.1,18],
 [11.9,0,12.1,1],[11.9,3,12.1,8],[11.9,10,12.1,13],[11.9,15,12.1,18],
 [12,10.9,28,11.1]
];
const DESK_COLS=[14.5,17,19.5,22,24.5], DESK_ROWS=[4,5.8,7.6,9.4];
const SEATS={pinyu:[17,4.62],zhe:[24.5,10.02],parent:[26.9,5.6],parent2:[26.9,6.8]};
const SPOTS={podium:{pos:[20,2.9],name:"講台",h:1.5}, counter:{pos:[3.75,12.3],name:"櫃台",h:1.4}, bossdesk:{pos:[3.5,3.4],name:"主任的桌子",h:1.3},
  study:{pos:[17,14.8],name:"自習室",h:1.3}, lounge:{pos:[4,8.1],name:"休息室",h:1.3}, copier:{pos:[7.8,11.1],name:"影印機",h:1.4}, door:{pos:[4.5,17],name:"門口",h:1.3},
  classdoor:{pos:[13.1,2],name:"B 班前門",h:1.4}, rank:{pos:[1.2,15.6],name:"榜單牆",h:1.6}, studyfront:{pos:[13.6,12.3],name:"自習室門口",h:1.3}};
const ZONE_RECTS=[["大廳",0,9,9,18,"進門第一眼就是櫃台和榜單。家長都在這裡等。"],["主任室",0,0,9,5,"門通常開著。主任說這樣比較有人情味。"],["講師休息室",0,5,9,9,"老師們放東西、吃便當、偷睡十分鐘的地方。"],["走廊",9,0,12,18,"兩邊都是教室。下課十分鐘這裡最擠。"],["高三 B 班教室",12,0,28,11,"36 個座位。白板上還留著上一堂的公式。"],["自習室",12,11,28,18,"晚上開到十點。安靜到聽得見翻頁聲。"]];
function zoneAt(x,z){return ZONE_RECTS.find(r=>x>=r[1]&&x<r[3]&&z>=r[2]&&z<r[4]);}
const ZONES=[["櫃台 FRONT DESK",4.5,15.6,0],["主任室 OFFICE",6.3,4.2,0],["講師休息室",6.3,8.2,0],["走廊",10.5,6.8,Math.PI/2],["高三 B 班教室",15.5,10.25,0],["自習室 STUDY",24.5,17.2,0]];

const C={floorLobby:0xd9d2c3,floorOffice:0xc6cec4,floorLounge:0xd3cbbd,floorHall:0xcdd2d6,floorClass:0xdcd5c6,floorStudy:0xcfd6cf,wall:0xf2f0e9,wallTop:0x66717d,
 desk:0xb08355,deskTop:0xd8b688,counter:0x34506a,copier:0x98a1a9,board:0xffffff,frame:0xa8afb5,sofa:0x7b5e57,shelf:0x8a6a48,metal:0x8b949c};

let renderer,scene,camera,player,ground,marker,hemi,sun;const CHAIRS=[];
function chair(x,z,ry){CHAIRS.push([x,z]);const c=new THREE.Group();const seat=new THREE.Mesh(bgeo(.44,.06,.42),mat(0x56606b));seat.position.y=.42;c.add(seat);const bk=new THREE.Mesh(bgeo(.44,.45,.05),mat(0x56606b));bk.position.set(0,.66,-.2);c.add(bk);[[-.18,-.17],[.18,-.17],[-.18,.17],[.18,.17]].forEach(([a,b])=>{const l=new THREE.Mesh(bgeo(.04,.42,.04),mat(0x3e454e));l.position.set(a,.21,b);c.add(l);});c.position.set(x,0,z);c.rotation.y=ry;scene.add(c);}
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
  const t=canvasTex(512,Math.round(512*h/w),(g,cw,ch)=>{g.fillStyle=bg;g.fillRect(0,0,cw,ch);g.fillStyle=fg;g.font=`700 ${size}px "Noto Sans TC","PingFang TC",sans-serif`;g.textBaseline="middle";
    text.split("\n").forEach((ln,i,a)=>g.fillText(ln,24,ch/2+(i-(a.length-1)/2)*size*1.15));});
  const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t}));p.position.set(x,y,z);p.rotation.y=ry;scene.add(p);return p;
}
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
  if(opts.name){const l=label(opts.name,"#ffffff",opts.tagBg||"#1c2633",34);l.position.y=g.userData.top+.32;g.add(l);g.userData.label=l;}
  scene.add(g);return g;
}
function setPose(p,sit){const u=p.userData;u.seated=sit;u.legL.rotation.x=u.legR.rotation.x=sit?-Math.PI/2:0;u.rig.position.y=0;u.torso.rotation.x=0;}
/* 對話泡泡 */
const emoteCache={};
function emote(p,text,dur=2.4){const u=p.userData;if(u.emoteSpr){p.remove(u.emoteSpr);}
  const s=label(text,"#1c2633","rgba(255,255,255,.96)",40);s.scale.multiplyScalar(.85);s.position.y=u.top+(u.label?.78:.42);p.add(s);u.emoteSpr=s;u.emoteUntil=performance.now()/1000+dur;}
function tickEmote(p,now){const u=p.userData;if(u.emoteSpr&&now>u.emoteUntil){p.remove(u.emoteSpr);u.emoteSpr=null;}}
/* 肢體動畫 */
function animPerson(p,dt,t,st={}){
  const u=p.userData;if(!u||!u.rig)return;
  const act=st.act||u.act;
  u.walk+=((st.walk?1:0)-u.walk)*Math.min(1,dt*10);if(st.walk)u.phase+=dt*11;
  const w=u.walk,sw=Math.sin(u.phase),br=Math.sin(t*2+u.seed),k=Math.min(1,dt*12),L=(o,v)=>o+(v-o)*k;
  let aL,aR,zL=.05,zR=-.05,hx=0,hy=Math.sin(t*.5+u.seed)*.12,tx=0;
  if(!u.seated){
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
function buildWorld(){
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(innerWidth<600?1.5:2,window.devicePixelRatio||1));stage.appendChild(renderer.domElement);
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(38,1,.1,200);
  hemi=new THREE.HemisphereLight(0xffffff,0x80868e,.9);scene.add(hemi);sun=new THREE.DirectionalLight(0xffffff,.5);sun.position.set(-8,16,10);scene.add(sun);
  const fl=(r,c)=>box(r[2]-r[0],.1,r[3]-r[1],c,(r[0]+r[2])/2,-.05,(r[1]+r[3])/2);
  fl([0,9,9,18],C.floorLobby);fl([0,0,9,5],C.floorOffice);fl([0,5,9,9],C.floorLounge);fl([9,0,12,18],C.floorHall);fl([12,0,28,11],C.floorClass);fl([12,11,28,18],C.floorStudy);
  ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80),new THREE.MeshBasicMaterial({visible:false}));ground.rotation.x=-Math.PI/2;scene.add(ground);
  const grid=new THREE.GridHelper(16,16,0xc2baa8,0xc2baa8);grid.position.set(20,.006,5.5);grid.scale.z=11/16;scene.add(grid);
  // 走廊地板黃線
  [[9.25,0,9.3,18],[11.7,0,11.75,18]].forEach(r=>rbox(r,.015,0xe2b33c));
  WALLS.forEach(r=>{rbox(r,1.1,C.wall);rbox(r,.04,C.wallTop,1.1);});
  ZONES.forEach(([t,x,z,r])=>floorText(t,x,z,r));

  // 大廳
  furn([1.5,11,6,11.6],1.0,C.counter,0xe9e4d8);box(.32,.12,.22,0x222222,5.4,1.12,11.3);box(.5,.35,.05,0x222831,2.4,1.25,11.15);
  furn([7.2,9.5,8.4,10.4],1.05,C.copier,0x4a5560);
  furn([.4,14,1.3,17.4],.45,C.sofa);rbox([.3,14,.6,17.4],.85,C.sofa);
  furn([8.2,16.7,8.75,17.5],1.1,0xdfe6ea);box(.12,.12,.06,0x3b82f6,8.36,.85,16.66);box(.12,.12,.06,0xe11d48,8.6,.85,16.66);
  wallSign("招生看板\n續班率 72% ▼",2.2,1.9,9.12,0,2.2,.9,"#ffd166","#1c2633",50);
  wallSign("去年學測榜單\n頂標 3・前標 11",.22,1.6,15.6,Math.PI/2,2.2,1.1,"#c9302a","#fff6e8",46);
  wallSign("學測衝刺班 熱烈招生中",4.5,1.7,17.78,Math.PI,3,.5,"#c9302a","#ffffff",46);
  const plant=new THREE.Mesh(new THREE.SphereGeometry(.38,8,6),new THREE.MeshLambertMaterial({color:0x5f8a4f}));plant.position.set(.65,.65,9.6);scene.add(plant);solids.push([.25,9.2,1.05,10.0]);

  // 主任室
  furn([2,1.8,5,2.8],.78,C.desk,C.deskTop);furn([.3,.3,1.8,.8],1.7,C.shelf);furn([6.5,3.9,8.7,4.7],.5,0x5d6b7a);
  wallSign("本期續班目標 85%",5,1.7,.22,0,2.6,.5,"#c9302a","#ffffff",48);
  box(.5,.32,.04,0x1c2633,3.5,1.0,2.1);

  // 講師休息室
  furn([2,6.2,5,7.4],.74,0xcfc6b5,0xe9e2d4);furn([.3,5.3,1.1,6.3],1.7,0xe6e9ec);furn([6.6,5.3,8.7,5.9],.9,0xbfb6a6);box(.5,.3,.36,0x333a44,7.2,1.05,5.6);
  furn([.3,7.4,1.1,8.8],1.6,C.metal);

  // 走廊
  wallSign("今日課表\n18:30 高三B 數學\n18:30 高二A 英文\n19:00 自習室 課輔",9.12,1.5,10,Math.PI/2,1.9,1.4,"#1c2633","#ffffff",40);

  // B 班教室
  box(10.2,1.3,.06,C.frame,20,1.55,.25);box(10,1.18,.07,C.board,20,1.55,.27);
  wallSign("空間向量　學測倒數 101 天",20,1.75,.32,0,6,.42,"#1d4fc4","#ffffff",44);
  furn([19.4,1.7,20.6,2.3],1.0,0x6b4f39);
  box(.06,.5,.6,0x222831,27.75,1.9,3);// 時鐘
  DESK_COLS.forEach((cx,ci)=>DESK_ROWS.forEach((rz,ri)=>{
    furn([cx-.6,rz-.25,cx+.6,rz+.25],.72,C.desk,C.deskTop);solids.push([cx-.28,rz+.35,cx+.28,rz+.85]);
    chair(cx,rz+.62,Math.PI);const key=cx+","+rz;if(key==="17,4"||key==="24.5,9.4"||key==="22,7.6"||key==="14.5,9.4") return;
    const s=person([0x4b6a8f,0x8f4b55,0x5c7d5a,0x8a7a4a,0x6a5c8f,0xb0643c,0x3f8a8a][(ci*2+ri)%7],{hair:[0x2a2421,0x3b2b20,0x151515,0x5a3a22][(ci*3+ri)%4]});extras.push({p:s,home:[cx,rz+.62,Math.PI],kind:"class"});
  }));
  [SEATS.parent,SEATS.parent2].forEach(([x,z])=>{solids.push([x-.28,z-.28,x+.28,z+.28]);chair(x,z,-Math.PI/2);});

  // 自習室
  [[14,13,19,13.9],[21,13,26,13.9],[14,15.7,19,16.6],[21,15.7,26,16.6]].forEach(r=>furn(r,.74,0xc9c2b2,0xe7e1d3));
  [[15,12.6],[17.8,12.6],[22.2,12.6],[24.6,16.95],[15.6,16.95],[19.9,12.6]].forEach(([x,z],i)=>{chair(x,z,z<14?0:Math.PI);solids.push([x-.25,z-.25,x+.25,z+.25]);if(i===5)return;const s=person([0x6d8fb0,0xb07a6d,0x7a9a6a,0x9a8a5a,0x7a6aa0][i]);extras.push({p:s,home:[x,z,z<14?0:Math.PI],kind:"study"});});
  extras.forEach(e=>{e.p.position.set(e.home[0],0,e.home[1]);e.p.rotation.y=e.home[2];setPose(e.p,true);e.state="seat";});

  marker=label("！","#ffffff","#c9302a",56);marker.scale.multiplyScalar(1.1);scene.add(marker);
  resize();window.addEventListener("resize",resize);buildGrid();
}
function makeNPC(id){const c=CHARS[id];const p=person(c.body,{name:`${c.name}｜${c.short}`,tagBg:c.color,hair:c.hair});npcs[id]=p;p.visible=false;return p;}
function makePlayer(line){if(player)scene.remove(player);player=person(line.body,{name:`你｜${line.short}`,tagBg:"#d9a21b",hair:0x2a2421});return player;}
/* 走到某處：坐著的人先站起來；到了如果是椅子就坐下 */
function agentGo(p,x,z,rot,onArrive){const u=p.userData;
  const pth=findPathFrom(p.position.x,p.position.z,x,z);if(!pth){p.position.set(x,0,z);p.rotation.y=rot??p.rotation.y;setPose(p,isChair(x,z));onArrive&&onArrive();return;}
  if(u.seated){setPose(p,false);}pth.push([x,z]);u.path=pth;u.endRot=rot;u.onArrive=onArrive||null;}
function agentPlace(p,x,z,rot){p.userData.path=null;p.position.set(x,0,z);p.rotation.y=rot??Math.PI;setPose(p,isChair(x,z));}
function setNPC(id,spec,instant){ // spec: [x,z,rotY] 或 null（不在場）
  const n=npcs[id]||makeNPC(id);const u=n.userData;if(!spec){n.visible=false;u.path=null;return;}
  u.anchor=[spec[0],spec[1],spec[2]??Math.PI];
  const far=Math.hypot(n.position.x-spec[0],n.position.z-spec[1]);
  if(!instant&&n.visible&&far>.3&&far<45){agentGo(n,spec[0],spec[1],spec[2]??Math.PI);return;}
  n.visible=true;agentPlace(n,spec[0],spec[1],spec[2]);}
function moveAgent(n,dt,speed=2.6){const u=n.userData;if(!u.path||!n.visible){u.moving=false;return;}
  if(!u.path.length){u.path=null;u.moving=false;if(u.endRot!=null)n.rotation.y=u.endRot;setPose(n,isChair(n.position.x,n.position.z));const f=u.onArrive;u.onArrive=null;f&&f();return;}
  const [x,z]=u.path[0],vx=x-n.position.x,vz=z-n.position.z,d=Math.hypot(vx,vz);
  if(d<.06){u.path.shift();return;}const sp=Math.min(d,speed*dt);n.position.x+=vx/d*sp;n.position.z+=vz/d*sp;n.rotation.y=Math.atan2(vx,vz);u.moving=true;}
function moveNPCs(dt){for(const id in npcs)moveAgent(npcs[id],dt);extras.forEach(e=>moveAgent(e.p,dt,e.speed||2.2));}
function addInfoMark(info){const s=label("i","#ffffff","#5f6b78",40);s.scale.multiplyScalar(.75);s.position.set(info.pos[0],info.h||1.6,info.pos[1]);scene.add(s);infoMarks[info.id]=s;}
function addSideMark(){const s=label("？","#1c2633","#f0b45a",48);scene.add(s);return s;}
function addItemMark(item){const s=label("✦","#1c2633","#f0b45a",40);s.scale.multiplyScalar(.7);s.position.set(item.pos[0],.5,item.pos[1]);scene.add(s);itemMarks[item.id]=s;}
function resize(){const w=window.innerWidth,h=window.innerHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.fov=w<600?52:38;camera.updateProjectionMatrix();}

/* ---------- 碰撞與尋路 ---------- */
function blockedAt(x,z,r=R){if(x<r||z<r||x>W-r||z>H-r)return true;for(const s of solids){if(x>s[0]-r&&x<s[2]+r&&z>s[1]-r&&z<s[3]+r)return true;}return false;}
function buildGrid(){gridB=new Uint8Array(GW*GH);for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)gridB[j*GW+i]=blockedAt((i+.5)*CELL,(j+.5)*CELL)?1:0;}
const cellOf=(x,z)=>[Math.max(0,Math.min(GW-1,Math.floor(x/CELL))),Math.max(0,Math.min(GH-1,Math.floor(z/CELL)))];
function nearestFree(i,j){if(!gridB[j*GW+i])return[i,j];for(let r=1;r<40;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<GW&&b<GH&&!gridB[b*GW+a])return[a,b];}return[i,j];}
function los(ax,az,bx,bz){const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.05);for(let k=1;k<=n;k++){const t=k/n;if(blockedAt(ax+(bx-ax)*t,az+(bz-az)*t,R+.07))return false;}return true;}
function findPath(tx,tz){return findPathFrom(player.position.x,player.position.z,tx,tz);}
function findPathFrom(fx,fz,tx,tz){
  const [si,sj]=nearestFree(...cellOf(fx,fz)),[gi,gj]=nearestFree(...cellOf(tx,tz));
  const N=GW*GH,g=new Float32Array(N).fill(1e9),prev=new Int32Array(N).fill(-1),closed=new Uint8Array(N),s=sj*GW+si,goal=gj*GW+gi;g[s]=0;
  const h=k=>Math.hypot(k%GW-gi,Math.floor(k/GW)-gj);const open=[s];
  while(open.length){let bi=0,bf=g[open[0]]+h(open[0]);for(let k=1;k<open.length;k++){const f=g[open[k]]+h(open[k]);if(f<bf){bf=f;bi=k;}}
    const cur=open[bi];open[bi]=open[open.length-1];open.pop();if(cur===goal)break;if(closed[cur])continue;closed[cur]=1;const ci=cur%GW,cj=Math.floor(cur/GW);
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const a=ci+di,b=cj+dj;if(a<0||b<0||a>=GW||b>=GH)continue;const k=b*GW+a;
      if(gridB[k]||closed[k])continue;if(di&&dj&&(gridB[cj*GW+a]||gridB[b*GW+ci]))continue;const ng=g[cur]+(di&&dj?1.414:1);if(ng<g[k]){g[k]=ng;prev[k]=cur;open.push(k);}}}
  if(prev[goal]<0&&goal!==s)return null;
  const pts=[];for(let k=goal;k!==-1&&k!==s;k=prev[k])pts.unshift([(k%GW+.5)*CELL,(Math.floor(k/GW)+.5)*CELL]);
  const out=[];let ax=fx,az=fz,i=0;while(i<pts.length){let j=pts.length-1;while(j>i&&!los(ax,az,pts[j][0],pts[j][1]))j--;out.push(pts[j]);[ax,az]=pts[j];i=j+1;}
  return out;
}
function stepPlayer(x,z){const p=player.position;if(!blockedAt(x,p.z))p.x=x;if(!blockedAt(p.x,z))p.z=z;}
