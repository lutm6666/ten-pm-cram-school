(function(){
class V{project(){this.x=2;this.y=0;this.z=.5;return this;}setScalar(v){this.x=this.y=this.z=v;return this;}constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this;}multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this;}}
class C{constructor(v){this.value=v;}setHex(v){this.value=v;return this;}}
class O{constructor(){this.position=new V();this.rotation=new V();this.scale=new V(1,1,1);this.children=[];this.userData={};this.visible=true;this.material={};}add(c){this.children.push(c);return this;}remove(){}lookAt(){}clone(){const o=new this.constructor();o.position=new V(this.position.x,this.position.y,this.position.z);return o;}updateProjectionMatrix(){}traverse(fn){fn(this);this.children.forEach(c=>c&&c.traverse?c.traverse(fn):fn(c));}}
class G extends O{constructor(){super();this.type=this.constructor.name;}computeVertexNormals(){}setAttribute(k,v){this.attributes||(this.attributes={});this.attributes[k]=v;return this;}}
class Mat{constructor(o={}){Object.assign(this,o);}}
class Tex extends O{constructor(){super();this.repeat=new V(1,1,1);this.offset=new V();}}
class Light extends O{constructor(color=0xffffff,intensity=1){super();this.color=new C(color);this.groundColor=new C(0x808080);this.intensity=intensity;}}
class Hemi extends Light{constructor(color=0xffffff,ground=0x808080,intensity=1){super(color,intensity);this.groundColor=new C(ground);}}
class Mesh extends O{constructor(g,m){super();this.geometry=g;this.material=m||{};this.isMesh=true;this.castShadow=false;this.receiveShadow=false;}}
class BAttr{constructor(a,n=3){this.array=a;this.itemSize=n;this.count=a.length/n;}getY(){return 0}setY(){}}
const T={Vector3:V,Group:O,Scene:O,Mesh,Sprite:class extends O{constructor(m){super();this.material=m;}},
PerspectiveCamera:O,HemisphereLight:Hemi,DirectionalLight:Light,PointLight:Light,GridHelper:O,
BoxGeometry:class extends G{},CircleGeometry:class extends G{},BufferGeometry:G,BufferAttribute:BAttr,Float32BufferAttribute:BAttr,Points:class extends O{constructor(g){super();this.geometry=g;}},PointsMaterial:Mat,Color:C,DoubleSide:2,AdditiveBlending:2,CylinderGeometry:class extends G{},SphereGeometry:class extends G{},PlaneGeometry:class extends G{},DodecahedronGeometry:class extends G{},MeshLambertMaterial:Mat,MeshStandardMaterial:Mat,MeshBasicMaterial:Mat,SpriteMaterial:Mat,CanvasTexture:Tex,RepeatWrapping:1000,sRGBEncoding:3001,NoToneMapping:0,
Clock:class{constructor(){this.t=performance.now();this.elapsedTime=0;}getDelta(){const n=performance.now(),d=(n-this.t)/1000;this.t=n;this.elapsedTime+=d;return d;}},
Raycaster:class{setFromCamera(){}intersectObject(){return [];}},
WebGLRenderer:class{constructor(){this.domElement=document.createElement('canvas');this.capabilities={getMaxAnisotropy:()=>4};}setPixelRatio(){}setSize(){}render(){}}};
window.THREE=T;})();