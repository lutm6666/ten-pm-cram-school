/* ================= Phase 2：重複幾何快取 + 場景 profiler =================
   目標：降低人物與圓形家具重複建立 BufferGeometry 的成本，並量化 mesh 熱點。
   只共用幾何資料，不改 Mesh、Material、動畫骨架或 transform。 */

const P2_PERF_GEO_CACHE=new Map();
function p2PerfKey(type,args){return type+'|'+args.map(v=>typeof v==='number'?Number(v).toFixed(5):String(v)).join('|');}
function p2PerfCachedCtor(type,Base){
  function Cached(...args){
    const k=p2PerfKey(type,args);
    let g=P2_PERF_GEO_CACHE.get(k);
    if(!g){g=new Base(...args);P2_PERF_GEO_CACHE.set(k,g);}
    return g;
  }
  Cached.prototype=Base.prototype;
  return Cached;
}

/* 這些幾何在目前場景中都只透過 Mesh transform 改形，不直接 mutate geometry。 */
if(THREE.SphereGeometry&&!THREE.SphereGeometry.__p2Cached){
  const Base=THREE.SphereGeometry,C=p2PerfCachedCtor('sphere',Base);C.__p2Cached=true;C.__p2Base=Base;THREE.SphereGeometry=C;
}
if(THREE.CylinderGeometry&&!THREE.CylinderGeometry.__p2Cached){
  const Base=THREE.CylinderGeometry,C=p2PerfCachedCtor('cylinder',Base);C.__p2Cached=true;C.__p2Base=Base;THREE.CylinderGeometry=C;
}
if(THREE.CircleGeometry&&!THREE.CircleGeometry.__p2Cached){
  const Base=THREE.CircleGeometry,C=p2PerfCachedCtor('circle',Base);C.__p2Cached=true;C.__p2Base=Base;THREE.CircleGeometry=C;
}

/* 場景 profiler：不改渲染，只盤點 draw-call 候選熱點。
   會在 CI screenshot artifact 留下 teacher / care / jh 三組 JSON。 */
function p2PerfAudit(){
  if(!scene||!scene.traverse)return null;
  const geoCount=new Map(),matCount=new Map();
  let meshes=0,visibleMeshes=0;
  scene.traverse(o=>{
    if(!o||!o.isMesh)return;
    meshes++;if(o.visible!==false)visibleMeshes++;
    if(o.geometry)geoCount.set(o.geometry,(geoCount.get(o.geometry)||0)+1);
    const mats=Array.isArray(o.material)?o.material:[o.material];
    mats.forEach(m=>{if(m)matCount.set(m,(matCount.get(m)||0)+1);});
  });
  const names=new Map();
  if(typeof FM_CHAMFER_CACHE!=='undefined')for(const [k,g] of FM_CHAMFER_CACHE)names.set(g,'chamfer:'+k);
  for(const [k,g] of P2_PERF_GEO_CACHE)names.set(g,k);
  const top=[...geoCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,16).map(([g,count])=>({
    count,
    key:names.get(g)||g.type||g.constructor&&g.constructor.name||'geometry',
    vertices:g.attributes&&g.attributes.position&&g.attributes.position.count||null
  }));
  const summary={meshes,visibleMeshes,uniqueGeometries:geoCount.size,uniqueMaterials:matCount.size,cachedRoundGeometries:P2_PERF_GEO_CACHE.size,cachedChamferGeometries:typeof FM_CHAMFER_CACHE!=='undefined'?FM_CHAMFER_CACHE.size:null,topGeometries:top};
  window.__artPerf=summary;
  return summary;
}
window.__p2PerfAudit=p2PerfAudit;

/* ================= 靜態場景合併 =================
   家具、牆、地板裝飾在整場遊戲中不會動，依「材質 × 9m 區塊」合併成一個 mesh，
   把 draw call 與 scene graph 的走訪量降到原本的一小部分。
   會動、會換、會切換顯示的東西都排除：人物、車、夜景燈、課桌上的個人物品、
   點擊用的地板、半透明材質、白板（setBoard 會整塊換掉）。 */
function p2MergeStatic(){
  if(!scene||!THREE.BufferGeometry)return 0;
  const skip=new Set();
  const addTree=o=>o&&o.traverse&&o.traverse(c=>skip.add(c));
  Object.values(npcs).forEach(addTree);extras.forEach(e=>addTree(e.p));if(typeof player!=='undefined')addTree(player);
  if(typeof cars!=='undefined')cars.forEach(addTree);
  if(typeof NIGHT_PARTS!=='undefined'){NIGHT_PARTS.glows.forEach(addTree);NIGHT_PARTS.ground.forEach(([m])=>addTree(m));}
  if(typeof P2_STORY_PROPS!=='undefined')P2_STORY_PROPS.forEach(s=>addTree(s.belongings));
  if(typeof ground!=='undefined')addTree(ground);if(typeof boardSign!=='undefined')addTree(boardSign);
  scene.updateMatrixWorld(true);
  const visibleChain=o=>{for(let c=o;c;c=c.parent)if(c.visible===false)return false;return true;};
  const buckets=new Map();
  scene.traverse(o=>{
    if(!o.isMesh||skip.has(o)||o.isSkinnedMesh||o.isInstancedMesh)return;
    const m=o.material,g=o.geometry;
    if(!m||Array.isArray(m)||m.transparent||m.vertexColors||o.renderOrder)return;
    if(!g||!g.isBufferGeometry||!g.attributes.position||!g.attributes.normal||(g.groups&&g.groups.length>1))return;
    if(!visibleChain(o)){return;}
    if(o.matrixWorld.determinant()<0)return;
    const p=new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
    const key=m.uuid+'|'+Math.floor(p.x/9)+'|'+Math.floor(p.z/9);
    if(!buckets.has(key))buckets.set(key,{mat:m,list:[]});buckets.get(key).list.push(o);
  });
  const nm=new THREE.Matrix3();let removed=0;
  for(const {mat,list} of buckets.values()){
    if(list.length<2)continue;
    const useUv=list.every(o=>o.geometry.attributes.uv);
    let vCount=0,iCount=0;
    list.forEach(o=>{const g=o.geometry;vCount+=g.attributes.position.count;iCount+=g.index?g.index.count:g.attributes.position.count;});
    const pos=new Float32Array(vCount*3),nor=new Float32Array(vCount*3),uv=useUv?new Float32Array(vCount*2):null;
    const idx=vCount>65535?new Uint32Array(iCount):new Uint16Array(iCount);
    let vo=0,io=0;const v=new THREE.Vector3();
    list.forEach(o=>{const g=o.geometry,P=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;
      nm.getNormalMatrix(o.matrixWorld);
      // 鏡像縮放會把三角形翻面；這種少見情況就保留原物件。
      for(let i=0;i<P.count;i++){
        v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);pos[(vo+i)*3]=v.x;pos[(vo+i)*3+1]=v.y;pos[(vo+i)*3+2]=v.z;
        v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();nor[(vo+i)*3]=v.x;nor[(vo+i)*3+1]=v.y;nor[(vo+i)*3+2]=v.z;
        if(uv){uv[(vo+i)*2]=U.getX(i);uv[(vo+i)*2+1]=U.getY(i);}
      }
      if(g.index){for(let i=0;i<g.index.count;i++)idx[io+i]=g.index.getX(i)+vo;io+=g.index.count;}
      else{for(let i=0;i<P.count;i++)idx[io+i]=vo+i;io+=P.count;}
      vo+=P.count;
    });
    const mg=new THREE.BufferGeometry();
    mg.setAttribute('position',new THREE.BufferAttribute(pos,3));mg.setAttribute('normal',new THREE.BufferAttribute(nor,3));
    if(uv)mg.setAttribute('uv',new THREE.BufferAttribute(uv,2));
    mg.setIndex(new THREE.BufferAttribute(idx,1));mg.computeBoundingSphere();mg.computeBoundingBox();
    const merged=new THREE.Mesh(mg,mat);merged.name='p2-static-merged';merged.matrixAutoUpdate=false;
    merged.castShadow=list.some(o=>o.castShadow);merged.receiveShadow=list.some(o=>o.receiveShadow);
    scene.add(merged);
    list.forEach(o=>{o.parent&&o.parent.remove(o);removed++;});
  }
  // 合併後變空的群組也拿掉，scene graph 走訪更輕。
  const empty=[];scene.traverse(o=>{if(o.isGroup&&!skip.has(o)&&o.children.length===0)empty.push(o);});
  empty.forEach(o=>o.parent&&o.parent.remove(o));
  return removed;
}
