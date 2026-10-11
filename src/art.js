/* ================= 美術實驗層：光影、色溫、空間層次 =================
   只放在 art-overhaul-prototype 分支。刻意不改玩法與座標資料，方便隨時撤回。 */
const ART_LIGHTS=[];

function artDarkenHex(c,f=.72){
  if(typeof c!=="string"||!/^#[0-9a-f]{6}$/i.test(c))return c;
  const n=parseInt(c.slice(1),16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
  return `#${[r,g,b].map(v=>Math.round(v*f).toString(16).padStart(2,"0")).join("")}`;
}

/* 名牌：保留原本角色色，但提高底色濃度與文字邊緣對比。 */
const ART_BASE_LABEL=label;
label=function(text,fg="#1c2633",bg="rgba(255,255,255,.92)",size=40){
  if(fg==="#ffffff"&&typeof bg==="string"&&bg[0]==="#")bg=artDarkenHex(bg,.68);
  const font=`700 ${size}px "Noto Sans TC","PingFang TC",sans-serif`;
  const m=document.createElement("canvas").getContext("2d");m.font=font;
  const w=Math.ceil(m.measureText(text).width)+36,h=size+24;
  const t=canvasTex(w,h,(g)=>{
    g.fillStyle=bg;g.fillRect(0,0,w,h);
    g.font=font;g.textBaseline="middle";
    if(fg==="#ffffff"){g.strokeStyle="rgba(0,0,0,.28)";g.lineWidth=3;g.strokeText(text,18,h/2+2);}
    g.fillStyle=fg;g.fillText(text,18,h/2+2);
  });
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,depthTest:false,transparent:true}));
  s.scale.set(w*.0074,h*.0074,1);s.renderOrder=10;return s;
};

function artZoneLight(x,z,color,night=.34,day=.10,distance=8){
  const l=new THREE.PointLight(color,night,distance,1.7);
  l.position.set(x,2.7,z);
  l.userData.artNight=night;l.userData.artDay=day;
  scene.add(l);ART_LIGHTS.push(l);return l;
}
function artAddWallContactShadows(){
  const m=new THREE.MeshBasicMaterial({color:0x101722,transparent:true,opacity:.11,depthWrite:false});
  WALLS.forEach(r=>{
    const w=r[2]-r[0],d=r[3]-r[1];
    const s=new THREE.Mesh(new THREE.BoxGeometry(w+.16,.008,d+.16),m);
    s.position.set((r[0]+r[2])/2,.008,(r[1]+r[3])/2);s.renderOrder=1;scene.add(s);
  });
}
function artBlobShadow(o,r=.34,opacity=.16){
  if(!o||o.userData.artBlob)return;
  const m=new THREE.MeshBasicMaterial({color:0x111821,transparent:true,opacity,depthWrite:false});
  const s=new THREE.Mesh(new THREE.CircleGeometry(1,24),m);
  s.rotation.x=-Math.PI/2;s.scale.set(r,r*.62,1);s.position.y=.012;s.renderOrder=1;
  o.add(s);o.userData.artBlob=s;
}
function artTuneScene(){
  if(renderer){
    // Retina 手機用較高 DPR 保持輪廓清楚；仍設上限避免 GPU 負擔暴增。
    const dpr=window.devicePixelRatio||1;
    renderer.setPixelRatio(Math.min(dpr,innerWidth<600?2.25:2));
    if(THREE.sRGBEncoding!==undefined)renderer.outputEncoding=THREE.sRGBEncoding;
    if(THREE.LinearToneMapping!==undefined)renderer.toneMapping=THREE.LinearToneMapping;
    renderer.toneMappingExposure=.93;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  }
  if(hemi){hemi.color.setHex(0xc5d8f1);hemi.groundColor.setHex(0x343b45);hemi.intensity=.36;}
  if(sun){
    sun.color.setHex(0xffdfb5);sun.intensity=.44;sun.position.set(-9,18,11);sun.castShadow=true;
    const sm=innerWidth<760?1024:2048;sun.shadow.mapSize.width=sm;sun.shadow.mapSize.height=sm;
    sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=22;sun.shadow.camera.bottom=-22;
    sun.shadow.camera.near=.5;sun.shadow.camera.far=55;sun.shadow.bias=-.00045;sun.shadow.normalBias=.02;
  }
  scene.traverse(o=>{
    if(!o.isMesh||!o.material)return;
    const mats=Array.isArray(o.material)?o.material:[o.material];
    const opaque=mats.every(m=>!m.transparent&&!(m instanceof THREE.MeshBasicMaterial));
    if(opaque){o.receiveShadow=true;o.castShadow=true;}
  });
  artZoneLight(4.5,13.4,0xffdfb4,.18,.055,7.2);  // 櫃台：暖，但不洗白
  artZoneLight(4.3,2.5,0xffd6a0,.17,.05,6.3);    // 主任室
  artZoneLight(4.5,7.0,0xffe1c1,.15,.05,6.0);    // 休息室
  artZoneLight(10.5,9.0,0xd6e5ff,.13,.045,6.5);  // 走廊
  artZoneLight(20.0,5.5,0xd9e8ff,.24,.075,8.6);  // 高三 B 班
  artZoneLight(20.0,14.4,0xe2ecff,.19,.065,7.7); // 自習室
  artZoneLight(32.0,5.4,0xd9e8ff,.22,.07,7.5);   // 國中 C 班
  artAddWallContactShadows();
  [player,...Object.values(npcs)].filter(Boolean).forEach(o=>artBlobShadow(o,o===player?.38:.32,o===player?.18:.14));
}

const ART_BASE_BUILD_WORLD=buildWorld;
buildWorld=function(){
  // 比第一版再壓一階明度，讓人物、家具與動線從地板上跳出來。
  C.floorLobby=0xb6aa94;C.floorOffice=0xa6b1a7;C.floorLounge=0xb5aa9a;C.floorHall=0xaab4bc;
  C.floorClass=0xc3b69f;C.floorStudy=0xacb9ad;C.wall=0xdcd8ce;C.wallTop=0x3f4c5b;
  C.desk=0x805d3f;C.deskTop=0xb8895e;C.counter=0x24415a;C.copier=0x707c86;C.frame=0x747f89;
  ART_BASE_BUILD_WORLD();
  artTuneScene();
};

const ART_BASE_SET_DAYLIGHT=setDaylight;
setDaylight=function(on){
  ART_BASE_SET_DAYLIGHT(on);
  if(renderer)renderer.toneMappingExposure=on?.96:.93;
  if(hemi){
    hemi.color.setHex(on?0xdcecff:0xc5d8f1);hemi.groundColor.setHex(on?0x626d77:0x343b45);hemi.intensity=on?.52:.36;
  }
  if(sun){sun.color.setHex(on?0xffefd0:0xffdfb5);sun.intensity=on?.61:.44;}
  ART_LIGHTS.forEach(l=>{l.intensity=on?l.userData.artDay:l.userData.artNight;});
};
