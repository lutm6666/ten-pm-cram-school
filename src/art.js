/* ================= 美術實驗層 v2：實體場景與角色細節 =================
   原則：不靠全螢幕濾鏡改觀感。保留原版清楚的色調，只增加真正的 3D 物件、材質分層與角色辨識度。 */

/* ---------- 小型美術工具 ---------- */
const ART_MATERIAL_CACHE=new Map();
function artMat(color,rough=.78,metal=.02){
  const key=`${color}|${rough}|${metal}`;
  if(ART_MATERIAL_CACHE.has(key))return ART_MATERIAL_CACHE.get(key);
  const m=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
  ART_MATERIAL_CACHE.set(key,m);return m;
}
function artBox(w,h,d,color,x,y,z,parent,rough=.78,metal=.02){
  const m=new THREE.Mesh(bgeo(w,h,d),artMat(color,rough,metal));
  m.position.set(x,y,z);(parent||scene).add(m);return m;
}
function artCyl(rt,rb,h,color,x,y,z,parent,segments=16){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,segments),artMat(color));
  m.position.set(x,y,z);(parent||scene).add(m);return m;
}
function artPaper(w,d,x,y,z,color=0xf7f3e8,ry=0){
  const p=artBox(w,.018,d,color,x,y,z,null,.92,0);p.rotation.y=ry;return p;
}
function artBook(w,d,x,y,z,color,ry=0){
  const b=artBox(w,.055,d,color,x,y,z,null,.82,0);b.rotation.y=ry;
  artBox(w*.93,.008,d*.92,0xf5f0e5,x,y+.032,z,null,.95,0).rotation.y=ry;return b;
}
function artCup(x,y,z,color=0xf4f4f0){
  const c=artCyl(.09,.075,.18,color,x,y,z,null,14);artCyl(.065,.065,.008,0x49392d,x,y+.094,z,null,14);return c;
}

/* ---------- 人物：直接增加輪廓細節 ---------- */
const ART_BASE_PERSON=person;
person=function(color,opts={}){
  const p=ART_BASE_PERSON(color,opts),u=p.userData;
  // 鞋子：原版腿部末端沒有鞋，近距離看像兩根柱子。
  [u.legL,u.legR].forEach((leg,i)=>{
    const shoe=new THREE.Mesh(bgeo(.17,.085,.24),artMat(i?0x20252d:0x242a31,.72,.03));
    shoe.position.set(0,-.43,.035);leg.add(shoe);
  });
  // 衣領 / 胸前分層，讓上半身不再是一整塊方盒。
  const collarL=new THREE.Mesh(bgeo(.13,.055,.285),artMat(0xf1eee6,.9,0));
  collarL.position.set(-.085,.43,.005);collarL.rotation.z=-.24;u.torso.add(collarL);
  const collarR=collarL.clone();collarR.position.x=.085;collarR.rotation.z=.24;u.torso.add(collarR);
  // 小朋友加書包。
  if(opts.kid){
    const bag=new THREE.Mesh(bgeo(.34,.38,.14),artMat(0x445d78,.78,0));bag.position.set(0,.26,-.20);u.torso.add(bag);
    const flap=new THREE.Mesh(bgeo(.30,.10,.025),artMat(0x32485f,.78,0));flap.position.set(0,.36,-.278);u.torso.add(flap);
  }
  // 有名字的工作人員 / 玩家加簡單識別證。家長與試聽生不加。
  const nm=opts.name||"";
  if(nm && !/媽媽|爸爸|家長|試聽生/.test(nm)){
    const strap=new THREE.Mesh(bgeo(.018,.28,.012),artMat(0x59616c,.7,0));strap.position.set(0,.28,.151);u.torso.add(strap);
    const badge=new THREE.Mesh(bgeo(.15,.105,.018),artMat(0xf1f3f5,.85,0));badge.position.set(0,.13,.158);u.torso.add(badge);
  }
  return p;
};

/* ---------- 依 layout.js 資料產生建築收邊及房間細節 ---------- */
const ART_LAYOUT_DETAILS=[];
function artRecord(room,kind,object){object.userData.layoutDetail={room:room.id,floor:room.f,kind};ART_LAYOUT_DETAILS.push(object);return object;}
function artDecorateWorld(){
  WALLS.forEach(r=>{const w=r[2]-r[0],d=r[3]-r[1];artBox(w,.07,d,0x98a0a8,(r[0]+r[2])/2,.045,(r[1]+r[3])/2,null,.88,0);});
  ROOMS.forEach(room=>{
    const o=FLX(room.f,0),[x0,z0,x1,z1]=room.rect,cx=(x0+x1)/2;
    // Door thresholds and jambs fit inside the existing collision footprint.
    if(room.door&&!room.open){const top=z1===7,z=top?7:9.5,[a,b]=room.door;
      artRecord(room,'threshold',artBox(b-a,.015,.16,0x85989d,o+(a+b)/2,.012,z));
      [a-.055,b+.055].forEach(x=>artRecord(room,'jamb',artBox(.09,1.1,.18,0x7c8f94,o+x,.55,z)));
    }
    const seats=CLASS_SEATS[room.id];
    if(seats){
      const kid=!!seats.kid||room.id==='english',height=kid?.53:.72;
      seats.rows.forEach((z,ri)=>seats.cols.forEach((x,ci)=>{
        if((ri+ci)%3!==0)return;
        artRecord(room,'book',artBook(.28,.20,o+x-.13,height+.085,z,room.f===2?0x507e9c:0xd6a05d,.04));
        artRecord(room,'paper',artPaper(.25,.20,o+x+.17,height+.065,z+.015));
      }));
      const top=z0===0,bz=top?.34:17.66;
      artRecord(room,'boardTray',artBox(Math.min(4.2,x1-x0-3),.045,.12,0x9da5ad,o+cx,.92,bz));
      artRecord(room,'eraser',artBox(.25,.065,.10,0x4e646e,o+cx-.7,.97,bz));
    }
    if(room.id==='copyroom'){
      artRecord(room,'copierScreen',artBox(.3,.035,.23,0x5f8ba5,o+10.5,1.105,1.55));
      artRecord(room,'paper',artPaper(.4,.29,o+10,1.11,1.55));
    }
    if(room.id==='lobby'){
      artRecord(room,'keyboard',artBox(.5,.025,.18,0x303b43,3,1.065,10.77));
      artRecord(room,'phone',artBox(.35,.1,.2,0x303b43,6,1.105,10.7));
      artRecord(room,'paper',artPaper(.4,.28,4.4,1.07,10.7));
    }
    if(room.id==='office'){
      artRecord(room,'paper',artPaper(.45,.28,o+3.3,.845,2.5));
      artRecord(room,'book',artBook(.32,.25,o+4.7,.85,2.5,0x5b7991));
    }
    if(room.id==='careoffice'||room.id==='jhlounge'||room.id==='jhoffice'){
      const deskX=room.id==='jhoffice'?32:2.8;
      artRecord(room,'book',artBook(.35,.26,o+deskX,.81,12.5,0x507e9c));
    }
    if(room.id.startsWith('core')){
      // Platform locations CORE.elev and CORE.stairs remain free for pathfinding.
      artRecord(room,'elevatorSeam',artBox(.035,2,.06,0x6d7f88,o+CORE.elev[0],1,2.86));
      artRecord(room,'elevatorIndicator',wallSign(FLOOR_NAMES[room.f],o+CORE.elev[0],2.2,2.88,0,.5,.22,'#d2edb5','#33434e',30));
      artRecord(room,'stairsRail',artBox(.045,1.1,2.4,0x748991,o+CORE.stairs[0]-1.22,.8,1.5));
      artRecord(room,'stairsSign',wallSign('樓梯',o+CORE.stairs[0],1.4,.22,0,1.1,.3,'#ffffff','#536a77',32));
    }
  });
}

/* ---------- 建世界：保留原版色調，限制像素倍率並加入實體細節 ---------- */
const ART_BASE_BUILD_WORLD=buildWorld;
buildWorld=function(){
  // 恢復 Claude 原版調色，讓比較只看「美術內容」本身。
  C.floorLobby=0xd9d2c3;C.floorOffice=0xc6cec4;C.floorLounge=0xd3cbbd;C.floorHall=0xcdd2d6;
  C.floorClass=0xdcd5c6;C.floorStudy=0xcfd6cf;C.wall=0xf2f0e9;C.wallTop=0x66717d;
  C.desk=0xb08355;C.deskTop=0xd8b688;C.counter=0x34506a;C.copier=0x98a1a9;C.frame=0xa8afb5;
  ART_BASE_BUILD_WORLD();
  if(renderer){
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,innerWidth<600?1.5:2));
    if(THREE.NoToneMapping!==undefined)renderer.toneMapping=THREE.NoToneMapping;
  }
  // 保留原本白光，不再加暖冷濾鏡或區域光霧。
  if(hemi){hemi.color.setHex(0xffffff);hemi.groundColor.setHex(0x80868e);hemi.intensity=.9;}
  if(sun){sun.color.setHex(0xffffff);sun.intensity=.5;}
  artDecorateWorld();
};

/* 日夜切換完全交回原遊戲，不再覆寫曝光。 */
