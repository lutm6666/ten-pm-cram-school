/* ================= 美術重製 Phase 2：人物 + 教室家具 =================
   目標：保留既有骨架、動畫、碰撞與事件邏輯，只替換真正看得到的模型本體。
   不加入全螢幕濾鏡，不改 renderer 色彩流程。 */

const P2_BASE_PERSON=person;
const P2_BASE_FURN=furn;

function p2Hash(s){let h=2166136261;for(let i=0;i<(s||'').length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function p2Std(key,color,rough=.76,metal=.02){return fmMat('p2:'+key,{color,rough,metal});}
function p2Mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function p2HideFirstMesh(group){if(!group)return;const m=group.children&&group.children.find(o=>o&&o.isMesh);if(m)m.visible=false;}

/* ---------- 人物本體 ---------- */
function p2Hair(head,hairColor,variant,kid){
  const hair=p2Std('hair:'+hairColor,hairColor,.84,0);
  // 低多邊形髮帽，取代原本的方盒頭髮。
  const cap=p2Mesh(new THREE.SphereGeometry(kid?.178:.182,10,7),hair,head,0,.075,-.008);
  cap.scale.set(1.04,.72,1.04);
  if(variant===0){
    // 短髮：瀏海分三束，輪廓比單一方塊自然。
    [-.095,-.025,.055].forEach((x,i)=>{const q=p2Mesh(fmChamferGeo(.09,.13,.075,.025),hair,head,x,.035,.145);q.rotation.z=(i-1)*.10;});
  }else if(variant===1){
    // 側分短髮。
    const side=p2Mesh(fmChamferGeo(.075,.25,.20,.025),hair,head,-.145,-.005,-.015);side.rotation.z=-.08;
    const fringe=p2Mesh(fmChamferGeo(.19,.10,.07,.025),hair,head,.035,.075,.145);fringe.rotation.z=-.18;
  }else if(variant===2){
    // 鮑伯頭：兩側髮束延伸到臉頰。
    [-1,1].forEach(s=>{const q=p2Mesh(fmChamferGeo(.075,.27,.18,.03),hair,head,s*.145,-.045,-.005);q.rotation.z=-s*.04;});
    p2Mesh(fmChamferGeo(.25,.11,.065,.025),hair,head,0,.07,.147);
  }else{
    // 馬尾／束髮，遠距離也能和短髮角色分開。
    p2Mesh(fmChamferGeo(.24,.10,.07,.025),hair,head,0,.07,.147);
    const tie=p2Mesh(new THREE.SphereGeometry(.055,8,6),hair,head,0,.035,-.185);
    const tail=p2Mesh(new THREE.SphereGeometry(.09,8,6),hair,head,0,-.045,-.235);tail.scale.set(.72,1.35,.72);
  }
}
function p2RoleDetails(p,color,opts,seed){
  const u=p.userData,torso=u.torso,head=u.head,name=opts.name||'';
  const dark=p2Std('detailDark',0x27313b,.70,.03),paper=p2Std('detailLight',0xf1eee6,.90,0);
  if(/主任/.test(name)){
    // 主任：深色西裝前襟 + 領帶。
    const lapL=p2Mesh(fmChamferGeo(.12,.30,.025,.018),paper,torso,-.105,.29,.153);lapL.rotation.z=-.28;
    const lapR=p2Mesh(fmChamferGeo(.12,.30,.025,.018),paper,torso,.105,.29,.153);lapR.rotation.z=.28;
    const tie=p2Mesh(fmChamferGeo(.055,.25,.024,.012),p2Std('bossTie',0x7d2f31,.72,0),torso,0,.25,.169);tie.rotation.z=.02;
  }else if(/小芸/.test(name)){
    // 小芸：細腰帶 + 馬尾固定辨識。
    p2Mesh(fmChamferGeo(.47,.055,.292,.025),p2Std('yunBelt',0x53606d,.72,.02),torso,0,.10,0);
  }else if(/媽媽|爸爸|家長/.test(name)){
    // 家長：側背包，避免和學生只靠衣服顏色區分。
    const bag=p2Mesh(fmChamferGeo(.22,.28,.11,.045),p2Std('parentBag',0x725443,.82,.01),torso,.29,.20,-.08);bag.rotation.z=-.08;
    const strap=p2Mesh(fmChamferGeo(.025,.55,.018,.008),dark,torso,.13,.31,.152);strap.rotation.z=-.42;
  }else if(/^你｜/.test(name)){
    // 玩家：袖口與腰部的小色塊，鏡頭拉遠時仍容易找到自己。
    p2Mesh(fmChamferGeo(.48,.055,.29,.025),p2Std('playerWaist',0x46515c,.72,.02),torso,0,.095,0);
  }else if(name && !/試聽生/.test(name)){
    // 其他有名角色用一個小胸袋，和背景路人做層級區別。
    p2Mesh(fmChamferGeo(.105,.095,.018,.018),p2Std('staffPocket',0xe4e7ea,.88,0),torso,.13,.29,.162);
  }
  // 少量角色配眼鏡，固定由 seed 決定，避免每次重整亂跳。
  if(!u.kid && seed%5===0){
    [-.072,.072].forEach(x=>{const rim=p2Mesh(new THREE.CircleGeometry(.054,12),dark,head,x,.035,.166);rim.scale.set(1,.78,1);});
    p2Mesh(fmChamferGeo(.055,.014,.012,.004),dark,head,0,.035,.169);
  }
}
person=function(color,opts={}){
  // 先沿用既有動畫 rig、標籤、鞋子、識別證等功能層，再替換核心幾何。
  const p=P2_BASE_PERSON(color,opts),u=p.userData,name=opts.name||'',seed=p2Hash(name+'|'+color+'|'+(opts.hair||0));
  const skin=p2Std('skin',0xf0d2b6,.90,0),cloth=p2Std('cloth:'+color,color,.88,0),pants=p2Std('pants',0x2c3440,.86,.01);

  // 頭：隱藏方盒皮膚與原版方盒頭髮，但保留眼睛、嘴與表情動畫。
  if(u.head&&u.head.children){u.head.children.slice(0,3).forEach(o=>{if(o&&o.isMesh)o.visible=false;});}
  const face=p2Mesh(new THREE.SphereGeometry(.17,10,8),skin,u.head,0,0,0);face.scale.set(.96,1.04,.94);
  let hairVariant=seed%4;if(/小芸/.test(name))hairVariant=3;if(opts.kid)hairVariant=seed%3;
  p2Hair(u.head,opts.hair||0x2a2421,hairVariant,!!opts.kid);

  // 身體：方盒 torso 換成六角低多邊形衣身，腰部稍收。
  p2HideFirstMesh(u.torso);
  const body=p2Mesh(new THREE.CylinderGeometry(.235,.265,.50,6),cloth,u.torso,0,.25,0);body.rotation.y=Math.PI/6;body.scale.z=.68;

  // 手腳：沿用原本 limb pivot，所以所有走路、聊天、坐姿動畫都仍有效。
  [u.armL,u.armR].forEach(a=>{p2HideFirstMesh(a);const arm=p2Mesh(new THREE.CylinderGeometry(.057,.068,.40,7),cloth,a,0,-.20,0);arm.scale.z=.88;});
  [u.legL,u.legR].forEach(l=>{p2HideFirstMesh(l);const leg=p2Mesh(new THREE.CylinderGeometry(.068,.078,.42,7),pants,l,0,-.21,0);leg.scale.z=.88;});

  // 小朋友稍微增加坐姿可見高度。原版只抬 .22，部分俯視角只剩頭頂。
  if(opts.kid)u.p2KidSeatLift=.07;
  p2RoleDetails(p,color,opts,seed);
  return p;
};

// 保留原 setPose 行為，只替小朋友坐姿再抬高一點。
const P2_BASE_SETPOSE=setPose;
setPose=function(p,sit){P2_BASE_SETPOSE(p,sit);const u=p.userData;if(sit&&u.kid&&u.p2KidSeatLift)u.rig.position.y+=u.p2KidSeatLift;};

/* ---------- 椅子：塑膠椅面 + 金屬骨架 ---------- */
chair=function(x,z,ry){
  CHAIRS.push([x,z]);
  const g=new THREE.Group();
  const zone=x>=28?'jh':(z>=11?'study':'class');
  const plastic=zone==='jh'?p2Std('chairJh',0x668b8d,.72,.01):zone==='study'?p2Std('chairStudy',0x65736e,.75,.01):p2Std('chairClass',0x586878,.72,.01);
  const metal=p2Std('chairMetal',0x49515a,.36,.52);
  const seat=p2Mesh(fmChamferGeo(.46,.075,.43,.055),plastic,g,0,.43,0);
  const back=p2Mesh(fmChamferGeo(.46,.42,.075,.055),plastic,g,0,.69,-.19);back.rotation.x=-.08;
  // H 型金屬腳架，比四根方柱更像教室椅。
  [-.17,.17].forEach(xx=>{
    p2Mesh(fmChamferGeo(.045,.42,.045,.012),metal,g,xx,.21,-.14);
    p2Mesh(fmChamferGeo(.045,.42,.045,.012),metal,g,xx,.21,.14);
    p2Mesh(fmChamferGeo(.045,.12,.045,.012),metal,g,xx,.50,-.19);
  });
  p2Mesh(fmChamferGeo(.38,.035,.035,.010),metal,g,0,.19,.14);
  g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);
};

/* ---------- 教室桌：桌板 + 金屬框 + 書籃 ---------- */
function p2StudentDesk(r,color,top){
  solids.push(r);
  const cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2;
  const g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const wood=fmMat('p2:deskWood',{map:fmWoodTex(),rough:.62,metal:0});
  const metal=p2Std('deskFrame',0x59626b,.38,.48);
  const basket=p2Std('deskBasket',0x747d85,.52,.30);
  p2Mesh(fmChamferGeo(1.22,.075,.54,.045),wood,g,0,.745,0);
  [-.47,.47].forEach(xx=>[-.17,.17].forEach(zz=>p2Mesh(fmChamferGeo(.045,.66,.045,.012),metal,g,xx,.35,zz)));
  p2Mesh(fmChamferGeo(.94,.035,.035,.010),metal,g,0,.29,-.16);
  p2Mesh(fmChamferGeo(.94,.035,.035,.010),metal,g,0,.29,.16);
  // 書籃用三根橫條表現，不增加大量細 mesh。
  [-.12,0,.12].forEach(zz=>p2Mesh(fmChamferGeo(.76,.025,.025,.008),basket,g,0,.54,zz));
  p2Mesh(fmChamferGeo(.025,.16,.30,.008),basket,g,-.38,.50,0);
  p2Mesh(fmChamferGeo(.025,.16,.30,.008),basket,g,.38,.50,0);
}
function p2Podium(r){
  solids.push(r);const cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const wood=fmMat('p2:podiumWood',{map:fmWoodTex(),rough:.58,metal:0});
  const dark=p2Std('podiumDark',0x5a4636,.70,.01);
  p2Mesh(fmChamferGeo(1.18,.86,.56,.065),dark,g,0,.43,0);
  p2Mesh(fmChamferGeo(1.28,.085,.64,.05),wood,g,0,.90,0);
  p2Mesh(fmChamferGeo(.78,.48,.025,.025),wood,g,0,.46,.294);
}
function p2StudyTable(r){
  solids.push(r);const cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,w=r[2]-r[0],g=new THREE.Group();g.position.set(cx,0,cz);scene.add(g);
  const top=fmMat('p2:studyTop',{color:0xd8d0c1,rough:.80,metal:0});
  const metal=p2Std('studyFrame',0x667079,.40,.45);
  p2Mesh(fmChamferGeo(w,.075,.92,.045),top,g,0,.745,0);
  [-w/2+.28,w/2-.28].forEach(xx=>[-.30,.30].forEach(zz=>p2Mesh(fmChamferGeo(.055,.66,.055,.014),metal,g,xx,.35,zz)));
  p2Mesh(fmChamferGeo(w-.52,.04,.04,.012),metal,g,0,.30,0);
}

furn=function(r,h,color,top){
  const w=r[2]-r[0],d=r[3]-r[1];
  // B 班與 C 班學生桌。
  if(Math.abs(w-1.2)<.03&&Math.abs(d-.5)<.03&&Math.abs(h-.72)<.03){p2StudentDesk(r,color,top);return;}
  // 兩間教室的講桌。
  if(Math.abs(w-1.2)<.03&&Math.abs(d-.6)<.03&&Math.abs(h-1.0)<.03){p2Podium(r);return;}
  // 自習室長桌。
  if(Math.abs(w-5.0)<.04&&Math.abs(d-.9)<.04&&Math.abs(h-.74)<.03){p2StudyTable(r);return;}
  P2_BASE_FURN(r,h,color,top);
};
