/* ================= 美術重製 Phase 2：人物 + 教室家具 =================
   目標：保留既有骨架、動畫、碰撞與事件邏輯，只替換真正看得到的模型本體。
   不加入全螢幕濾鏡，不改 renderer 色彩流程。 */

const P2_BASE_PERSON=person;
const P2_BASE_FURN=furn;

function p2Hash(s){let h=2166136261;for(let i=0;i<(s||'').length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function p2Std(key,color,rough=.76,metal=.02){return fmMat('p2:'+key,{color,rough,metal});}
function p2Mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;(parent||scene).add(m);return m;}
function p2HideFirstMesh(group){if(!group)return;const m=group.children&&group.children.find(o=>o&&o.isMesh);if(m)m.visible=false;}

/* ---------- 人物：回歸原版方塊比例 ---------- */
// 原版 person 已提供方塊頭、軀幹、四肢、鞋子、衣領與名牌。
// 不再以球頭和圓柱四肢覆蓋它，避免不同造型語言混用。
person=function(color,opts={}){
  return P2_BASE_PERSON(color,opts);
};

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
  const wood=p2Std('deskWoodSolid',0xc29d70,.70,0);
  const metal=p2Std('deskFrame',0x59626b,.38,.48);
  const basket=p2Std('deskBasket',0x747d85,.52,.30);
  p2Mesh(new THREE.BoxGeometry(1.22,.09,.54),wood,g,0,.745,0);
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
