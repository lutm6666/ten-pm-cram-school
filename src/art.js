/* ================= 美術實驗層：光影、色溫、空間層次 =================
   只放在 art-overhaul-prototype 分支。刻意不改玩法與座標資料，方便隨時撤回。 */
const ART_LIGHTS=[];

function artZoneLight(x,z,color,night=.34,day=.10,distance=8){
  const l=new THREE.PointLight(color,night,distance,1.7);
  l.position.set(x,2.7,z);
  l.userData.artNight=night;l.userData.artDay=day;
  scene.add(l);ART_LIGHTS.push(l);return l;
}
function artAddWallContactShadows(){
  const m=new THREE.MeshBasicMaterial({color:0x101722,transparent:true,opacity:.07,depthWrite:false});
  WALLS.forEach(r=>{
    const w=r[2]-r[0],d=r[3]-r[1];
    const s=new THREE.Mesh(new THREE.BoxGeometry(w+.14,.008,d+.14),m);
    s.position.set((r[0]+r[2])/2,.008,(r[1]+r[3])/2);s.renderOrder=1;scene.add(s);
  });
}
function artTuneScene(){
  if(renderer){
    // 手機原版只用 1.5 DPR，在 Retina 螢幕上會明顯被放大變糊。
    // 美術版提高到 2.25，上限仍保守，避免 GPU 負擔暴增。
    const dpr=window.devicePixelRatio||1;
    renderer.setPixelRatio(Math.min(dpr,innerWidth<600?2.25:2));
    if(THREE.sRGBEncoding!==undefined)renderer.outputEncoding=THREE.sRGBEncoding;
    // 低多邊形純色場景用 ACES 會壓平局部對比，視覺上像蒙霧；改回線性映射。
    if(THREE.LinearToneMapping!==undefined)renderer.toneMapping=THREE.LinearToneMapping;
    renderer.toneMappingExposure=1.0;
    renderer.shadowMap.enabled=true;
    renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  }
  if(hemi){hemi.color.setHex(0xc9dcff);hemi.groundColor.setHex(0x424954);hemi.intensity=.46;}
  if(sun){
    sun.color.setHex(0xffdfb5);sun.intensity=.50;sun.position.set(-9,18,11);sun.castShadow=true;
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
  artZoneLight(4.5,13.4,0xffe3bc,.24,.07,7.5);   // 櫃台：較暖
  artZoneLight(4.3,2.5,0xffd8a5,.22,.06,6.5);    // 主任室
  artZoneLight(4.5,7.0,0xffe6c9,.19,.06,6.2);    // 休息室
  artZoneLight(10.5,9.0,0xd9e7ff,.17,.05,6.8);   // 走廊
  artZoneLight(20.0,5.5,0xddeaff,.31,.09,9.0);   // 高三 B 班
  artZoneLight(20.0,14.4,0xe6efff,.24,.08,8.0);  // 自習室
  artZoneLight(32.0,5.4,0xddeaff,.29,.09,7.8);   // 國中 C 班
  artAddWallContactShadows();
}

const ART_BASE_BUILD_WORLD=buildWorld;
buildWorld=function(){
  // 原版偏米灰且各區接近；原型版拉開材質色相，讓玩家只看地面就能辨識區域。
  C.floorLobby=0xc8bda9;C.floorOffice=0xb8c2b6;C.floorLounge=0xc5b9aa;C.floorHall=0xbcc4cb;
  C.floorClass=0xd3c8b5;C.floorStudy=0xbfc9c1;C.wall=0xe8e5dc;C.wallTop=0x485565;
  C.desk=0x916b45;C.deskTop=0xc79a68;C.counter=0x294763;C.copier=0x7e8993;C.frame=0x87919a;
  ART_BASE_BUILD_WORLD();
  artTuneScene();
};

const ART_BASE_SET_DAYLIGHT=setDaylight;
setDaylight=function(on){
  ART_BASE_SET_DAYLIGHT(on);
  if(renderer)renderer.toneMappingExposure=on?1.04:1.0;
  if(hemi){
    hemi.color.setHex(on?0xe7f3ff:0xc9dcff);hemi.groundColor.setHex(on?0x75818a:0x424954);hemi.intensity=on?.64:.46;
  }
  if(sun){sun.color.setHex(on?0xfff0ce:0xffdfb5);sun.intensity=on?.70:.50;}
  ART_LIGHTS.forEach(l=>{l.intensity=on?l.userData.artDay:l.userData.artNight;});
};
