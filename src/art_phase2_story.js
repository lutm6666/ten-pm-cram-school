/* Phase 2: inexpensive, time-aware classroom storytelling props.
   Decorative only: no collision or NPC interactions. */
const P2_STORY_PROPS=[];
function p2StoryBox(group,w,h,d,x,y,z,mat){
  const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
  m.position.set(x,y,z);group.add(m);return m;
}
function p2StoryMat(key,color){
  return fmMat('p2story:'+key,{color,rough:.86,metal:0});
}
function p2StoryDesk(x,z,index){
  const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
  const paper=p2StoryMat('paper',0xe9e4d7),ink=p2StoryMat('ink',0x475a70);
  const cover=p2StoryMat('cover'+index%3,[0x6c8d83,0x92755f,0x637b9b][index%3]);
  const bottle=p2StoryMat('bottle'+index%3,[0x86a9ac,0xb4a18c,0x8b9cbd][index%3]);
  // Unoccupied desks still have handouts. Student belongings arrive with the class.
  p2StoryBox(g,.29,.014,.21,-.20,.797,-.06,paper);
  p2StoryBox(g,.24,.018,.16,-.19,.813,-.06,cover);
  const belongings=new THREE.Group();g.add(belongings);
  p2StoryBox(belongings,.24,.045,.09,.20,.813,-.09,cover);
  p2StoryBox(belongings,.035,.19,.035,.36,.878,.09,bottle);
  p2StoryBox(belongings,.20,.010,.13,-.18,.825,-.055,paper);
  p2StoryBox(belongings,.15,.009,.009,-.18,.833,-.04,ink);
  P2_STORY_PROPS.push({belongings});
}
function p2StoryDecorate(){
  DESK_COLS.forEach((x,i)=>DESK_ROWS.forEach((z,j)=>p2StoryDesk(x,z,i*DESK_ROWS.length+j)));
}
function p2StoryUpdate(){
  // Match the established evening arrival clock; avoid spawning belongings
  // during the afternoon care shift or before high-school students arrive.
  const minutes=typeof G!=='undefined'&&G&&Number.isFinite(G.clock)?G.clock:null;
  const present=minutes!==null&&minutes>=18*60&&minutes<22*60;
  P2_STORY_PROPS.forEach(({belongings})=>{belongings.visible=present;});
}
const P2_STORY_BASE_DECORATE=artDecorateWorld;
artDecorateWorld=function(){P2_STORY_BASE_DECORATE();p2StoryDecorate();p2StoryUpdate();};
