/* Exercises the real layout/world/art builders and movement policy without WebGL. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto');
const read=p=>fs.readFileSync(p,'utf8'),json=value=>JSON.parse(JSON.stringify(value));
const draw=new Proxy({measureText:s=>({width:String(s).length*26}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(t,k)=>k in t?t[k]:()=>{}});
const element=()=>({style:{},appendChild(){},addEventListener(){},getContext:()=>draw});
const sandbox={window:{innerWidth:1200,innerHeight:800,devicePixelRatio:1,addEventListener(){}},document:{getElementById:element,createElement:element},innerWidth:1200,innerHeight:800,performance,console,Math};
vm.createContext(sandbox);vm.runInContext(read('tests/stub.js')+'\nvar THREE=window.THREE;',sandbox);
const names=['layout.js','floor-travel.js','world.js','art.js','art_models.js','art_models_fix.js','art_phase2.js'];
for(const name of names)vm.runInContext(read('src/'+name),sandbox,{filename:name});
vm.runInContext('buildWorld();globalThis.api={ROOMS,SPOTS,WALLS,PORTALS,CLASS_SEATS,CHAIRS,scene,solids,seatsOf,floorOf,blockedAt,findPathFrom,floorTravelQuote,person,setPose,agentPlace,agentGo,moveAgent,ART_LAYOUT_DETAILS};',sandbox);
const A=sandbox.api;
// The story's spatial contract must exactly equal the agreed source commit.
const expectedHashes={
  "ROOMS": "84696e3c349b77bec900622e33e3ed55f112d12a432c1631d862481465c0603e",
  "SPOTS": "a16d951e3c4c8716a90a826e4f4709b6d84b04eaf8204645ee5d752b2bedc7fd",
  "WALLS": "227099e1f56bb85659ce078d824f41f9b25d22a3adbda794678aa97b98c7a4da",
  "PORTALS": "837eec11315cd6d540a33c9d4c9f83e677921f272752c00e40a3fd7bf5284c48",
  "CLASS_SEATS": "cdef4868dd8191dd330f6706e9c2221efaa78c1dcb68e9e0b27ea0efc59735fc"
};
for(const [k,hash]of Object.entries(expectedHashes))assert.equal(crypto.createHash('sha256').update(JSON.stringify(A[k])).digest('hex'),hash,k+' changed without coordinate review');
const bad=[],door=A.SPOTS.door.pos;let samples=0;
for(const [id,s]of Object.entries(A.SPOTS)){
  const path=A.findPathFrom(...door,...s.pos);assert.ok(path,'unreachable '+id);let cursor=door;
  for(const p of path){
    if(p.via){assert.ok(A.PORTALS.some(portal=>portal.kind===p.via&&[portal.a,portal.b].some(a=>Math.hypot(a[0]-p[0],a[1]-p[1])<.25)),'unknown portal');}
    else{const n=Math.max(1,Math.ceil(Math.hypot(p[0]-cursor[0],p[1]-cursor[1])/.05));for(let i=1;i<=n;i++){const t=i/n;assert.equal(A.blockedAt(cursor[0]+(p[0]-cursor[0])*t,cursor[1]+(p[1]-cursor[1])*t),false,'wall crossing '+id);samples++;}}
    cursor=p;
  }
  assert.ok(Math.hypot(cursor[0]-s.pos[0],cursor[1]-s.pos[1])<1.6,id+' final approach');
}
const doorOf={g1:'g1door',g2:'g2door',g34:'g34door',c7:'c7door',c8:'c8door',c9:'c9door',english:'engdoor'};let seatCount=0;
for(const [id,seats]of Object.entries(A.CLASS_SEATS)){
  const kid=!!seats.kid||id==='english',person=A.person(0x667788,{kid}),d=A.SPOTS[doorOf[id]].pos;
  for(const [x,z,ry]of A.seatsOf(id)){
    const chair=A.scene.children.find(c=>c.userData.layoutChair&&c.position.x===x&&c.position.z===z);
    assert.ok(chair,id+' missing chair');assert.equal(chair.userData.kid,kid);
    assert.ok(Math.abs(chair.userData.seatTop-(kid?.35:.4675))<1e-8);
    A.agentPlace(person,...d,0);A.agentGo(person,x,z,ry);
    let n=0;while(person.userData.path&&n++<4000)A.moveAgent(person,.05);
    if(person.userData.routeFailed||Math.hypot(person.position.x-x,person.position.z-z)>.15)bad.push(id+' '+x+','+z);
    assert.equal(person.userData.seated,true);
    if(kid)assert.ok(Math.abs(person.userData.rig.position.y+.45*.72-.35)<1e-8,'kid hip aligns with chair');
    seatCount++;
  }
  person.visible=false;
}
assert.deepEqual(bad,[],'seats unreachable');
// Decorations must remain in their declared room and cannot add collisions.
for(const o of A.ART_LAYOUT_DETAILS){const m=o.userData.layoutDetail,r=A.ROOMS.find(r=>r.id===m.room),x=o.position.x-r.f*48,z=o.position.z;assert.ok(x>=r.rect[0]-.15&&x<=r.rect[2]+.15&&z>=r.rect[1]-.15&&z<=r.rect[3]+.15,m.room+' prop outside room');}
assert.deepEqual(json(A.floorTravelQuote('stairs',0,2,1060)),{min:1,max:1,hp:2,peak:false});
assert.equal(A.floorTravelQuote('elev',0,2,1060).peak,true);
assert.equal(A.floorTravelQuote('elev',0,2,1265).peak,true);
assert.equal(A.floorTravelQuote('elev',0,2,900).peak,false);
assert.equal(A.floorTravelQuote('elev',0,2,1290).peak,false);
assert.equal(A.floorTravelQuote('bad',0,2,900),null);
// Execute the actual engine callback to verify that both guide and floor picker
// charge the same game minutes and preserve existing minimum HP behavior.
const engine=read('src/engine.js');const excerpt=engine.slice(engine.indexOf('const FLOOR_LABEL='),engine.indexOf('/* ---------- 目標與附近的東西'));
vm.runInContext('var G={clock:900,s:{hp:10}};function spend(m){G.clock+=m;}function showBanner(){}function renderHud(){};'+excerpt+';globalThis.charge=(kind,from,to,clock,hp)=>{G.clock=clock;G.s={hp};floorCost(kind,from,to);return {clock:G.clock,hp:G.s.hp}};',sandbox);
assert.deepEqual(json(sandbox.charge('stairs',0,2,900,10)),{clock:901,hp:8});
assert.deepEqual(json(sandbox.charge('stairs',0,2,900,1)),{clock:901,hp:1});
const elev=sandbox.charge('elev',0,2,1060,10);assert.ok(elev.clock>=1062.1&&elev.clock<=1062.9);assert.equal(elev.hp,10);
console.log(`PASS: layout unchanged; ${Object.keys(A.SPOTS).length} story spots, ${seatCount} seats, ${samples} path samples, ${A.ART_LAYOUT_DETAILS.length} props, actual floor-cost callback.`);
