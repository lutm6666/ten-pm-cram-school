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
  WALLS.forEach(r=>{const w=r[2]-r[0],d=r[3]-r[1];artBox(w+.03,.07,d+.03,0x98a0a8,(r[0]+r[2])/2,.045,(r[1]+r[3])/2,null,.88,0);});
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
      seatsOf(room.id).forEach(([x,z,rot],i)=>{
        const ri=Math.floor(i/seats.cols.length),ci=i%seats.cols.length;
        if((ri+ci)%3!==0)return;
        // seatsOf 回傳椅子的位置；桌心偏移與 furnishRoom 使用同一方向。
        const deskZ=z+(rot===Math.PI?-.62:.62);
        artRecord(room,'book',artBook(.28,.20,x-.13,height+.085,deskZ,room.f===2?0x507e9c:0xd6a05d,.04));
        artRecord(room,'paper',artPaper(.25,.20,x+.17,height+.065,deskZ+.015));
      });
      const top=z0===0,bz=top?.34:17.66;
      const care=['g4','g5','g6'].includes(room.id),boardX=care?cx-1:cx;
      artRecord(room,'boardTray',artBox(Math.min(4.2,x1-x0-(care?5:3)),.045,.12,0x9da5ad,o+boardX,.92,bz));
      artRecord(room,'eraser',artBox(.25,.065,.10,0x4e646e,o+boardX-.7,.97,bz));
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
    if(room.id==='jhlounge'||room.id==='jhoffice'){
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
  artRedesignRooms();
}

/* 第二輪：只使用 layout.js 的房間、座位與既有家具表面，不增加碰撞。 */
function artRedesignRooms(){
  const ink=0x425566,cream=0xf4eedf,teal=0x638c87;
  ROOMS.filter(r=>r.f>0).forEach(room=>{
    const o=FLX(room.f,0),[x0,z0,x1,z1]=room.rect;
    const record=(kind,obj)=>artRecord(room,kind,obj);
    const detail=(w,h,d,c,x,y,z)=>record('roomDetail',artBox(w,h,d,c,o+x,y,z));
    const sign=(text,x,y,z,ry,w,h,fg='#314857',bg='#f4eedf')=>record('roomNotice',wallSign(text,o+x,y,z,ry,w,h,fg,bg,38));
    const books=(x,y,z,n,step=.16)=>{
      const cols=[0x648b89,0xc09357,0x8c6d78,0x59758e];
      for(let i=0;i<n;i++)detail(.10,.30+(i%3)*.035,.23,cols[i%cols.length],x+i*step,y,z);
    };
    if(['g4','g5','g6'].includes(room.id)){
      const grade={g4:'四',g5:'五',g6:'六'}[room.id],color={g4:0xc68d54,g5:teal,g6:0x7186a3}[room.id],dx=x1-1.35;
      // 老師桌的前板與改評量工具；白板前沒有講台。
      detail(1.75,.38,.035,color,dx,.45,1.57);
      record('teacherPaper',artPaper(.38,.25,o+dx-.2,.81,1.30));
      detail(.18,.20,.16,ink,dx+.69,.86,1.15);
      detail(.025,.24,.025,0xd86654,dx+.66,1.05,1.15);
      detail(.025,.27,.025,0x577ea7,dx+.72,1.07,1.15);
      sign(grade+'年級｜作品與提醒',x0+.23,1.72,3.8,Math.PI/2,2.5,.75,'#4b5045','#e4d6b7');
      // 公告欄上的作品卡以圖形呈現，不把學校作業寫成全班統一進度。
      for(let i=0;i<3;i++){
        detail(.025,.22,.35,[0xffeed0,0xe1ebdb,0xdce5ef][i],x0+.26,1.56,3.15+i*.60);
      }
      sign('聯絡簿・評量分開放',dx,1.69,.32,0,1.7,.32);
    }
    if(room.id==='careoffice'){
      sign('安親儲藏室\n評量・教具・備品',4.7,1.8,17.77,Math.PI,2.6,.72);
      // 儲藏櫃內的分類箱：沿既有櫃體的朝向，物件仍在櫃體範圍。
      [10.9,12.5,14.1,15.7,17.0].forEach((z,i)=>{
        detail(.06,.35,.72,[0xc6a578,0x79958c,0x8196ad][i%3],1.22,.93,z);
        sign(['評量','教具','備品','清潔','失物'][i],1.265,.96,z,Math.PI/2,.55,.21);
      });
      [3.1,4.3,5.5,6.7].forEach((x,i)=>{
        detail(.85,.30,.46,i%2?0x8fa59e:0xc1a886,x,1.56,17.35);
        sign(['四年級','五年級','六年級','備用紙'][i],x,1.54,17.02,Math.PI,.65,.22);
      });
      // 教具箱原本就有碰撞；補上箱蓋與把手，不再留下浮在空中的辦公桌書本。
      detail(1.62,.055,.82,0x537d99,3.8,.54,13);
      detail(.3,.055,.035,cream,3.8,.41,13.42);
    }
    if(room.id==='wash'){
      [11.3,13.8,16.3].forEach(z=>{
        detail(.42,.025,.55,0x849ca7,8.6,.72,z);
        detail(.06,.27,.06,0x7b8e98,8.48,.86,z-.24);
        detail(.23,.06,.06,0x7b8e98,8.56,.97,z-.24);
      });
      sign('洗手・擦乾\n水龍頭記得關',8.23,1.65,13.8,Math.PI/2,1.8,.62);
    }
    if(room.id==='reading'){
      sign('閱讀角\n書看完，放回原位',17,1.75,17.78,Math.PI,2.7,.72,'#36564a','#e5eee1');
      [13.1,15.5,18.0,20.4].forEach(x=>books(x,1.36,17.4,5));
      // 閱讀地墊上的平面書頁圖案；沒有午休床墊或新增通道障礙。
      detail(1.15,.012,.72,0xe6e3d3,17,.052,13.7);
      detail(.025,.013,.72,0x749789,17,.06,13.7);
    }
    if(room.id==='snack'){
      sign('點心區\n吃完收好・垃圾分類',26,1.7,17.78,Math.PI,2.6,.7);
      [24,26,28].forEach(x=>{
        detail(.62,.025,.30,0x7c9792,x,.67,13);
        detail(.25,.08,.23,cream,x,.72,13);
      });
    }
    if(room.id==='cubby'){
      // 書包櫃朝向走廊；格線與年級色條貼在既有櫃面。
      [.39,.77,1.14].forEach(y=>detail(.025,.025,7.4,ink,33.18,y,13.75));
      for(let i=0;i<8;i++)detail(.025,1.12,.035,ink,33.18,.60,10.25+i*.94);
      [10.7,12.6,14.5,16.4].forEach((z,i)=>detail(.027,.12,.42,[0xc68d54,teal,0x7186a3,teal][i],33.16,1.02,z));
      sign('書包放好再下樓',32.5,1.65,17.78,Math.PI,2.1,.4);
    }
    if(['c7','c8','c9'].includes(room.id)){
      sign('段考複習\n複習卷・錯題整理',x0+.22,1.7,4.1,Math.PI/2,2.6,.7,'#385975','#e5ecf0');
      // 講桌上的卷子和紅筆，對應考前檢討；不增加新的課程進度文字。
      record('reviewPaper',artPaper(.43,.27,o+(x0+x1)/2,.963,1.6));
      detail(.28,.018,.025,0xb94e46,(x0+x1)/2+.36,.973,1.6);
    }
    if(room.id==='tutor'){
      sign('課輔室\n先試寫，再問卡住的地方',14,1.7,17.78,Math.PI,3.6,.72,'#36564a','#e5eee1');
      [12.45,15.45].forEach(z=>[10.5,14.5,17.5].forEach((x,i)=>{
        record('tutorPaper',artPaper(.42,.28,o+x,.817,z));
        if(i===0)record('tutorBook',artBook(.35,.25,o+x+.7,.84,z,0x59758e));
      }));
    }
    if(room.id==='jhlounge'){
      sign('講師休息室\n水杯・講義・下一堂課',5,1.75,17.78,Math.PI,3,.72);
      record('teacherCup',artCup(o+4,.89,12.5));
      record('teacherPaper',artPaper(.42,.28,o+2.8,.817,12.5));
    }
    if(room.id==='jhoffice'){
      sign('班導工作區\n到班紀錄・家長留言',32,1.7,17.78,Math.PI,3,.72);
      record('attendancePaper',artPaper(.44,.3,o+32.5,.817,12.5));
      for(let i=0;i<5;i++)detail(.23,.30+(i%3)*.035,.10,[0x648b89,0xc09357,0x8c6d78,0x59758e][i%4],35.35,1.75,10.55+i*.12);
    }
    if(room.id==='lockers'){
      // 國中置物櫃只加面板細節，不搬動國中部家具。
      [.48,.95,1.42].forEach(y=>detail(.025,.025,7.4,ink,27.18,y,13.8));
      for(let i=0;i<9;i++)detail(.025,1.38,.025,ink,27.18,.75,10.15+i*.9);
      sign('書包靠櫃・走道留空',24,1.65,9.72,0,2.8,.38);
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
