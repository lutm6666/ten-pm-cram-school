/* ================= Phase 2：重複幾何快取 =================
   目標：降低人物與圓形家具重複建立 BufferGeometry 的成本。
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
