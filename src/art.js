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

/* ---------- 建築收邊 ---------- */
function artAddBaseboards(){
  const col=0x98a0a8;
  WALLS.forEach(r=>{
    const w=r[2]-r[0],d=r[3]-r[1];
    if(w>d) artBox(w,.07,Math.max(.05,d+.035),col,(r[0]+r[2])/2,.045,(r[1]+r[3])/2,null,.88,0);
    else artBox(Math.max(.05,w+.035),.07,d,col,(r[0]+r[2])/2,.045,(r[1]+r[3])/2,null,.88,0);
  });
}
function artThreshold(x,z,w,d,color=0x77818b){artBox(w,.02,d,color,x,.012,z,null,.72,.04);}
function artAddDoorThresholds(){
  // Explicit open entry: the old continuous perimeter wall hid the doorway.
  const entry=new THREE.Group();entry.name='p2-main-entrance';scene.add(entry);
  // 牆只有 1.1m 高（俯視切面），門框跟牆頂齊平、不加門楣，否則從鏡頭看像一個空心框。
  [3.25,5.75].forEach(x=>artBox(.14,1.14,.2,0x647481,x,.57,17.87,entry));
  artThreshold(4.5,17.84,2.35,.25);
  const sign=wallSign('入口 / 出口',2.2,.78,17.73,Math.PI,1.1,.24,'#ffffff','#386657',32);sign.material.side=THREE.DoubleSide;
  // Open classroom jambs make the C-class entrance readable from both sides.
  [29.54,31.66].forEach(x=>artBox(.10,1.45,.18,0x657985,x,.725,11));
  artThreshold(30.6,11,1.9,.30);
  // 幾個最常經過的門口，直接用實體門檻增加空間分區感。
  [[9,2.5,.30,1.7],[9,7,.30,1.7],[9,13.5,.30,2.5],[12,2,.30,1.8],[12,9,.30,1.8],[12,14,.30,1.8],[28,14,.30,1.8]].forEach(v=>artThreshold(...v));
}

/* ---------- 大廳 / 櫃台 ---------- */
function artFrontDesk(){
  // 櫃台正面分板與踢腳板
  [2.15,3.75,5.35].forEach(x=>artBox(1.35,.56,.035,0x294763,x,.55,11.62,null,.58,.04));
  artBox(4.55,.10,.10,0x1e3448,3.75,.12,11.65,null,.55,.05);
  // 電腦螢幕、底座、鍵盤、電話
  artBox(.62,.40,.055,0x252b32,2.65,1.38,11.32);artBox(.50,.29,.018,0x58758c,2.65,1.38,11.285);
  artBox(.12,.18,.12,0x545d66,2.65,1.13,11.34);artBox(.62,.03,.20,0x333a42,2.65,1.075,11.12,null,.55,.08);
  artBox(.38,.10,.22,0x2b3036,4.95,1.10,11.22);artBox(.09,.10,.11,0x454b52,4.78,1.19,11.21);
  // 文件盤與講義
  [0,1,2].forEach(i=>{artPaper(.55,.36,3.65+i*.07,1.08+i*.045,11.20-i*.015,i===1?0xfff2b2:0xf8f5ed,-.06);});
  artBox(.07,.18,.07,0x315d88,5.55,1.17,11.14);artBox(.07,.16,.07,0xc84630,5.62,1.16,11.14);
  // 壓克力立牌 / 試聽表。快取材質是共享的，透明設定要用獨立 clone，避免污染同參數物件。
  const stand=artBox(.34,.42,.025,0xdde9ef,1.95,1.30,11.16,null,.2,.02);stand.material=stand.material.clone();stand.material.transparent=true;stand.material.opacity=.78;
  artPaper(.26,.17,1.95,1.115,11.08,0xfff3c2,0);
  // 等候區小桌與雜誌
  // 等候區不放穿入沙發的茶几；雜誌移到櫃台旁的獨立矮桌。
  artBox(.70,.055,.48,0x8a6b50,1.55,.48,15.45);artBox(.07,.45,.07,0x65717c,1.55,.23,15.45);
  artBook(.38,.26,1.46,.52,15.39,0xe86b5b,.12);artBook(.34,.24,1.65,.54,15.49,0x4e88c7,-.10);
  // 原本的綠球補上盆體，終於看起來是盆栽。
  artCyl(.27,.20,.38,0x8b6549,.65,.20,9.60,null,14);
  artCyl(.31,.31,.035,0x6e513b,.65,.40,9.60,null,14);
  // 入口地墊
  artBox(2.20,.018,1.00,0x5c6670,4.45,.012,16.95,null,.96,0);
  artBox(1.55,.008,.045,0xd8b153,4.45,.024,16.95,null,.8,0);
}

/* ---------- 主任室 ---------- */
function artOfficeDetails(){
  // 桌燈
  artCyl(.14,.18,.05,0x454b52,4.45,.86,2.15,null,16);artBox(.055,.48,.055,0x4b5259,4.45,1.10,2.15,null,.5,.18);
  const shade=artCyl(.22,.12,.22,0xe3c184,4.45,1.37,2.15,null,18);shade.rotation.z=.12;
  // 筆電、文件夾、名牌
  artBox(.62,.035,.40,0x3e4751,3.10,.82,2.10,null,.45,.12);const scr=artBox(.58,.36,.025,0x313a44,3.10,1.02,1.93,null,.42,.08);scr.rotation.x=-.18;
  artBook(.42,.30,2.50,.84,2.32,0x8d3c36,.05);artBook(.38,.28,2.56,.90,2.30,0x365f86,-.03);
  artBox(.58,.14,.10,0x7e674f,3.80,.86,2.35); // 桌上名牌底
  // 書櫃增加書脊色塊
  const cols=[0x9d4b43,0x3f698d,0xc49b4b,0x4f7a5a,0x6c5a84];
  for(let i=0;i<8;i++)artBox(.11,.42,.24,cols[i%cols.length],.48+i*.15,1.30,.82,null,.82,0);
}

/* ---------- 講師休息室 ---------- */
function artLoungeDetails(){
  artCup(2.75,.80,6.72,0xf3eee4);artCup(3.20,.80,6.84,0x5f7fa0);
  artBook(.40,.28,4.20,.79,6.65,0xd88952,.10);
  // 便當盒與筷子
  artBox(.48,.12,.34,0xdbc8a4,3.55,.81,6.95,null,.9,0);artBox(.44,.025,.30,0xf2eadc,3.55,.885,6.95,null,.9,0);
  artBox(.025,.025,.42,0x775c42,3.80,.91,6.96,null,.85,0).rotation.y=.15;
  artBox(.025,.025,.42,0x775c42,3.84,.91,6.96,null,.85,0).rotation.y=.15;
  // 冰箱把手由 Phase 2 冰箱模型本體繪製，避免舊把手浮在外面。
}

/* ---------- 教室桌面與白板細節 ---------- */
function artClassroomDetails(){
  // 白板托盤、板擦、色筆
  artBox(5.4,.055,.13,0x9da5ad,20,.91,.38,null,.46,.13);
  artBox(.34,.08,.10,0x44505a,18.55,.97,.33,null,.72,.02);
  [19.25,19.40,19.55].forEach((x,i)=>artBox(.06,.06,.18,[0x3366aa,0xc84630,0x20252b][i],x,.98,.34,null,.60,.02));
  // 講桌桌面加講義與粉筆盒
  artBook(.46,.32,20.00,1.055,1.92,0x426d96,.04);artPaper(.40,.28,20.15,1.09,2.04,0xf8f5ed,-.08);
  artBox(.28,.08,.16,0xe0c780,19.68,1.07,2.10,null,.84,0);
  // 學生桌上放一些不規則講義 / 筆袋，避免 20 張桌子像複製貼上。
  const props=[
    [14.5,4,0x4f78a5,.10],[17,5.8,0xb95d55,-.08],[19.5,7.6,0x5b8a65,.04],[22,4,0xd3a444,-.12],
    [24.5,5.8,0x7a64a5,.09],[14.5,7.6,0x3e8b8b,-.04],[19.5,9.4,0xa96a42,.13],[24.5,7.6,0x3f698d,-.10]
  ];
  props.forEach(([x,z,c,r],i)=>{
    artBook(.42,.28,x-.12,.765,z,c,r);artPaper(.36,.25,x+.16,.79,z+.04,0xf9f6ee,-r*.7);
    if(i%2===0){const pc=artBox(.34,.085,.12,0x464f58,x+.22,.80,z-.12,null,.70,.02);pc.rotation.y=-r;}
  });
}
function artStudyDetails(){
  [[15.2,13.35,0x53769a],[18.2,13.35,0x8a654f],[22.4,13.35,0x5f805c],[24.7,16.05,0x77649a],[16.0,16.05,0x9a744f]].forEach(([x,z,c],i)=>{
    artBook(.40,.27,x,.78,z,c,(i%2?-.08:.07));
    artBook(.36,.25,x+.08,.84,z+.04,0xc8a55a,(i%2?.05:-.04));
  });
}
function artJuniorDetails(){
  // C 班白板配件
  artBox(3.9,.05,.12,0x9da5ad,32,.92,.38,null,.46,.13);artBox(.32,.08,.10,0x3d4a55,31.15,.98,.33);
  // 國中桌面：更多彩色筆袋與課本
  [[29.6,4,0x3f7fb7],[32,5.8,0xd0724d],[34.4,7.6,0x6f5bb0],[29.6,7.6,0x4c8b62]].forEach(([x,z,c],i)=>{
    artBook(.39,.26,x-.10,.765,z,c,.06*(i-1));artBox(.32,.08,.12,0x555f69,x+.22,.80,z-.12,null,.72,.01).rotation.y=.10*(i%2?1:-1);
  });
  // 手機籃真正放入數支手機
  for(let i=0;i<6;i++){
    const ph=artBox(.10,.035,.19,[0x20242a,0x434b54,0x6a443e][i%3],29.70+(i%3)*.18,.94,16.86+Math.floor(i/3)*.18,null,.42,.08);
    ph.rotation.y=(i%2?.14:-.10);
  }
}

/* ---------- 走廊 / 門牌 ---------- */
function artHallDetails(){
  // 牆面門牌，比只有地板字更像真實補習班。
  wallSign("主任室",9.13,1.38,3.65,Math.PI/2,.70,.28,"#ffffff","#425466",36);
  wallSign("講師休息室",9.13,1.38,7.95,Math.PI/2,1.05,.28,"#ffffff","#425466",32);
  wallSign("高三 B 班",12.08,1.42,2.95,-Math.PI/2,.90,.30,"#ffffff","#8a5c32",34);
  wallSign("自習室",12.08,1.42,12.35,-Math.PI/2,.72,.30,"#ffffff","#4f6d62",34);
  wallSign("國中 C 班",28.08,1.42,9.95,-Math.PI/2,.90,.30,"#ffffff","#4c6f8c",34);
  // 公告夾與消防器材
  artBox(.32,.62,.16,0xc93c31,10.82,.38,16.30,null,.58,.04);artBox(.18,.14,.18,0xe9e4d8,10.82,.74,16.30,null,.85,0);
}

function artDecorateWorld(){
  // 新格局（layout.js）：只保留依牆面資料產生的踢腳板；各房間細節等新格局美術重做。
  artAddBaseboards();
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
