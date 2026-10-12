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
