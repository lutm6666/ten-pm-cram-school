/* ================= 一致性：補齊場景中的第二位試聽生 =================
   試聽結果、主任報表與數學線原本都以 2 位試聽生計算，但畫面只有王媽媽與一位試聽生。
   加一位不參與互動的安靜試聽生，讓人數、報表、結局一致。 */
let CONS_TRIAL2=null;
const CONS_VIS_BASE_BUILD_WORLD=buildWorld;
buildWorld=function(){
  CONS_VIS_BASE_BUILD_WORLD();
  // 王媽媽與第一位試聽生使用右側臨時座位；再補一張臨時椅給第二位試聽生。
  chair(26.9,7.92,-Math.PI/2);solids.push([26.62,7.64,27.18,8.20]);
  CONS_TRIAL2=person(0x687b91,{hair:0x302822});
  CONS_TRIAL2.userData.rig.scale.setScalar(.97);CONS_TRIAL2.visible=false;
};
function consSyncTrial2(){
  if(!CONS_TRIAL2)return;
  const ok=G&&['teacher','yun','boss'].includes(G.line.id),ref=ok?npcs.parent2:null;
  if(!ref||!ref.visible){CONS_TRIAL2.visible=false;return;}
  CONS_TRIAL2.visible=true;
  // 第一位試聽生還在大廳時，第二位也跟著等；進教室後坐在旁邊的臨時椅。
  const inClass=ref.position.x>20;
  if(inClass){CONS_TRIAL2.position.set(26.9,0,7.92);CONS_TRIAL2.rotation.y=-Math.PI/2;setPose(CONS_TRIAL2,true);}
  else{CONS_TRIAL2.position.set(6.85,0,15.15);CONS_TRIAL2.rotation.y=Math.PI;setPose(CONS_TRIAL2,false);}
}
const CONS_VIS_BASE_SET_CROWD=setCrowd;
setCrowd=function(ph,instant){CONS_VIS_BASE_SET_CROWD(ph,instant);consSyncTrial2();};
const CONS_VIS_BASE_TICK_CROWD=tickCrowd;
tickCrowd=function(){CONS_VIS_BASE_TICK_CROWD();consSyncTrial2();};

if(LINES.teacher){
  const erase=LINES.teacher.steps.find(s=>s.id==='erase');
  if(erase&&erase.pages){const old=erase.pages;erase.pages=G=>old(G).map((r,i)=>i===1?[null,'B 班原班 18 個學生，加上兩位試聽生都看著你。王媽媽打開了筆記本。']:r);}
}

// 擴充專項驗收資料。
const CONS_VIS_BASE_AUDIT=window.__consistencyAudit;
window.__consistencyAudit=()=>{
  const b=CONS_VIS_BASE_AUDIT?CONS_VIS_BASE_AUDIT():{};
  const namedKids=['yu','anan','mi'].filter(id=>npcs[id]&&npcs[id].visible).length;
  return {...b,visibleNamedKids:namedKids,totalCareKids:(b.visibleKids||0)+namedKids,trial2Visible:!!(CONS_TRIAL2&&CONS_TRIAL2.visible)};
};
