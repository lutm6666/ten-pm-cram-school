(function(){
class V{constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z;}set(x,y,z){this.x=x;this.y=y;this.z=z;return this;}add(v){this.x+=v.x;this.y+=v.y;this.z+=v.z;return this;}lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this;}multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this;}}
class O{constructor(){this.position=new V();this.rotation=new V();this.scale=new V(1,1,1);this.children=[];this.userData={};this.visible=true;this.material={};}add(c){this.children.push(c);}remove(){}lookAt(){}clone(){const o=new this.constructor();o.position=new V(this.position.x,this.position.y,this.position.z);return o;}updateProjectionMatrix(){}}
const T={Vector3:V,Group:O,Scene:O,Mesh:class extends O{constructor(g,m){super();this.material=m||{};}},Sprite:class extends O{constructor(m){super();this.material=m;}},
PerspectiveCamera:O,HemisphereLight:O,DirectionalLight:O,GridHelper:O,
BoxGeometry:O,CircleGeometry:O,BufferGeometry:class extends O{constructor(){super();this.attributes={};}setAttribute(k,v){this.attributes[k]=v;}},BufferAttribute:class{constructor(a){this.count=a.length/3;}getY(){return 0}setY(){}},Points:class extends O{constructor(g){super();this.geometry=g;}},PointsMaterial:O,Color:class{constructor(c){}},DoubleSide:2,CylinderGeometry:O,SphereGeometry:O,PlaneGeometry:O,MeshLambertMaterial:O,MeshBasicMaterial:O,SpriteMaterial:class{constructor(o){Object.assign(this,o);}},CanvasTexture:O,
Clock:class{constructor(){this.t=performance.now();this.elapsedTime=0;}getDelta(){const n=performance.now(),d=(n-this.t)/1000;this.t=n;this.elapsedTime+=d;return d;}},
Raycaster:class{setFromCamera(){}intersectObject(){return [];}},
WebGLRenderer:class{constructor(){this.domElement=document.createElement('canvas');}setPixelRatio(){}setSize(){}render(){}}};
window.THREE=T;})();
