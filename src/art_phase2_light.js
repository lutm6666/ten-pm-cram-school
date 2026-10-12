/* ================= Phase 2：局部燈具與實體光源 =================
   只使用少量 PointLight + 可見燈具，不改 tone mapping / exposure / outputEncoding。
   不開陰影，避免手機端額外負擔。 */

const P2_LOCAL_LIGHTS=[];
function p2LightFixture(x,y,z,w,d,color=0xf4f1e8,ry=0){
  const mat=fmMat('p2light:fixture:'+color,{color,rough:.28,metal:.10});
  const m=p2Mesh(fmChamferGeo(w,.045,d,.022),mat,null,x,y,z);m.rotation.y=ry;m.castShadow=false;m.receiveShadow=false;return m;
}
function p2Point(name,x,y,z,color,intensity,distance){
  const l=new THREE.PointLight(color,intensity,distance,2);l.position.set(x,y,z);l.castShadow=false;
  l.userData.p2Name=name;l.userData.nightIntensity=intensity;scene.add(l);P2_LOCAL_LIGHTS.push(l);return l;
}
function p2BuildLocalLighting(){
  // 主任室：沿用既有桌燈造型，給它真正的暖色局部光。
  p2Point('office',4.45,1.55,2.15,0xffd6a3,.34,4.4);

  // 高三 B 班：兩支牆頂日光燈，實際只用一顆低強度光源照亮桌面區。
  p2LightFixture(16.7,1.145,.26,2.1,.13,0xf6f4ed);
  p2LightFixture(23.3,1.145,.26,2.1,.13,0xf6f4ed);
  p2Point('classB',20,2.05,5.5,0xf1f6ff,.18,8.2);

  // 自習室：稍微偏冷、強度較低，保留安靜區感覺。
  p2LightFixture(20,1.145,11.16,2.4,.12,0xf2f4ee);
  p2Point('study',20,2.0,14.5,0xe9f0ff,.13,7.0);

  // 國中 C 班：色溫略中性，和高中部做很小的視覺區別。
  p2LightFixture(30.3,1.145,.26,1.7,.13,0xf3f5ed);
  p2LightFixture(33.8,1.145,.26,1.7,.13,0xf3f5ed);
  p2Point('classC',32,2.0,5.5,0xf0f6ea,.16,7.0);

  // 休息室只給一點暖光，不把整個區域染黃。
  p2Point('lounge',4.2,1.8,7.0,0xffe2bd,.12,4.8);
}
function p2ApplyLocalLighting(day){
  P2_LOCAL_LIGHTS.forEach(l=>{l.intensity=l.userData.nightIntensity*(day?.18:1);});
}

const P2_LIGHT_BASE_BUILDWORLD=buildWorld;
buildWorld=function(){
  P2_LIGHT_BASE_BUILDWORLD();
  P2_LOCAL_LIGHTS.length=0;
  p2BuildLocalLighting();
  p2ApplyLocalLighting(!!MUSIC_DAY);
};

const P2_LIGHT_BASE_DAYLIGHT=setDaylight;
setDaylight=function(on){
  P2_LIGHT_BASE_DAYLIGHT(on);
  p2ApplyLocalLighting(!!on);
};
