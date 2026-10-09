/* ================= 夜晚的氣氛：窗外、街道、環境音、鐘聲 ================= */
const NIGHT=0x101826,DAY=0xa9cbe6;const cars=[],NIGHT_PARTS={glows:[],bmat:null,ground:[]};
/* 下午場：天還亮著，窗外大樓不亮燈、路燈關著 */
function setDaylight(on){MUSIC_DAY=on;scene.background=new THREE.Color(on?DAY:NIGHT);NIGHT_PARTS.glows.forEach(m=>m.visible=!on);NIGHT_PARTS.ground.forEach(([m,n,d])=>{m.material.color=new THREE.Color(on?d:n);});if(NIGHT_PARTS.bmat){NIGHT_PARTS.bmat.emissiveIntensity=on?.05:.55;NIGHT_PARTS.bmat.color=new THREE.Color(on?0xb8c4d2:0xffffff);}}
function buildNight(){
  scene.background=new THREE.Color(NIGHT);
  const out=new THREE.Mesh(new THREE.PlaneGeometry(140,140),new THREE.MeshLambertMaterial({color:0x1a2230}));NIGHT_PARTS.ground.push([out,0x1a2230,0x8d9aa6]);out.rotation.x=-Math.PI/2;out.position.set(14,-.08,9);scene.add(out);
  // 南邊的馬路與騎樓
  const road=new THREE.Mesh(new THREE.PlaneGeometry(80,4.2),new THREE.MeshLambertMaterial({color:0x262d38}));NIGHT_PARTS.ground.push([road,0x262d38,0x5b6370]);road.rotation.x=-Math.PI/2;road.position.set(14,-.06,21);scene.add(road);
  for(let x=-24;x<54;x+=3){const l=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.12),new THREE.MeshBasicMaterial({color:0x8a8f5a}));l.rotation.x=-Math.PI/2;l.position.set(x,-.05,21);scene.add(l);}
  const side=new THREE.Mesh(new THREE.PlaneGeometry(80,1.6),new THREE.MeshLambertMaterial({color:0x3a414c}));NIGHT_PARTS.ground.push([side,0x3a414c,0xa3a9b0]);side.rotation.x=-Math.PI/2;side.position.set(14,-.055,18.6);scene.add(side);
  // 路燈
  for(let x=-6;x<36;x+=9){const pole=new THREE.Mesh(new THREE.BoxGeometry(.1,2.6,.1),new THREE.MeshLambertMaterial({color:0x555c66}));pole.position.set(x,1.3,19.2);scene.add(pole);
    const lamp=new THREE.Mesh(new THREE.BoxGeometry(.5,.12,.3),new THREE.MeshBasicMaterial({color:0xffd27a}));lamp.position.set(x,2.6,19.5);scene.add(lamp);
    const glow=new THREE.Mesh(new THREE.CircleGeometry(1.4,20),new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.12}));NIGHT_PARTS.glows.push(glow,lamp);glow.rotation.x=-Math.PI/2;glow.position.set(x,-.04,19.8);scene.add(glow);}
  // 周圍大樓：亮著窗戶
  const winTex=canvasTex(128,256,(g,w,h)=>{g.fillStyle="#1b2433";g.fillRect(0,0,w,h);for(let y=8;y<h;y+=22)for(let x=8;x<w;x+=20){const on=Math.random()<.45;g.fillStyle=on?(Math.random()<.3?"#ffe7a8":"#cfe3ff"):"#253044";g.fillRect(x,y,12,14);}});
  const bmat=new THREE.MeshLambertMaterial({map:winTex,emissive:0xffffff,emissiveMap:winTex,emissiveIntensity:.55});NIGHT_PARTS.bmat=bmat;
  [[-6,3,4,10,8],[-6,13,4,8,5],[42,2,5,9,10],[42,12,4,7,6],[3,-6,9,4,7],[18,-6,12,4,9],[32,-6,6,4,5],[-2,27,10,5,6],[16,27,8,5,9],[30,27,9,5,7]].forEach(([x,z,w,d,h])=>{
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),bmat);b.position.set(x,h/2-.1,z);scene.add(b);});
  // 對面補習班的招牌
  const sign=wallSign("對面補習班　學測衝刺 8 折",16,3.4,24.5,0,7,.9,"#ffffff","#c9302a",58);sign.material.side=THREE.DoubleSide;
  // 會動的機車燈
  for(let i=0;i<5;i++){const c=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(.9,.4,.35),new THREE.MeshLambertMaterial({color:[0x6b7a8f,0x9a4a3a,0xd0d0d0,0x3a5a3a,0x222222][i]}));body.position.y=.35;c.add(body);
    const hl=new THREE.Mesh(new THREE.BoxGeometry(.06,.12,.12),new THREE.MeshBasicMaterial({color:0xfff2c0}));hl.position.set(.48,.42,0);c.add(hl);
    const beam=new THREE.Mesh(new THREE.CircleGeometry(.9,16),new THREE.MeshBasicMaterial({color:0xfff2c0,transparent:true,opacity:.18}));beam.rotation.x=-Math.PI/2;beam.position.set(1.3,-.03,0);c.add(beam);
    const dir=i%2?1:-1;c.userData={dir,speed:5+Math.random()*4,x:-20+i*15};c.position.set(c.userData.x,0,dir>0?20.3:21.7);c.rotation.y=dir>0?0:Math.PI;scene.add(c);cars.push(c);}
}
function tickNight(dt){cars.forEach(c=>{const u=c.userData;u.x+=u.dir*u.speed*dt;if(u.x>50)u.x=-22;if(u.x<-22)u.x=50;c.position.x=u.x;});}

/* 環境音：冷氣低鳴、鐘聲、雨聲、電話鈴 */
let amb=null,MUSIC_DAY=false;
function ensureAudio(){if(!soundOn)return null;try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();if(actx.state==="suspended")actx.resume();}catch(e){return null;}return actx;}
function noiseBuf(a,sec){const b=a.createBuffer(1,a.sampleRate*sec,a.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.5;}return b;}
let master=null;
function out(){const a=actx;if(!master){master=a.createGain();master.gain.value=1;master.connect(a.destination);}return master;}
function startAmbient(){const a=ensureAudio();if(!a||amb)return;const o=out();
  const src=a.createBufferSource();src.buffer=noiseBuf(a,4);src.loop=true;const f=a.createBiquadFilter();f.type="lowpass";f.frequency.value=420;const g=a.createGain();g.gain.value=.16;
  const hum=a.createOscillator();hum.frequency.value=60;const hg=a.createGain();hg.gain.value=.02;hum.connect(hg);hg.connect(bus("amb"));hum.start();
  src.connect(f);f.connect(g);g.connect(bus("amb"));src.start();
  /* 背景音樂：溫和的和弦循環 */
  const mg=a.createGain();mg.gain.value=.0001;mg.gain.exponentialRampToValueAtTime(.11,a.currentTime+3);mg.connect(bus("music"));
  const NIGHT_CH=[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,349.2]],DAY_CH=[[293.7,370,440,587.3],[329.6,415.3,493.9,659.3],[246.9,293.7,370,493.9],[220,277.2,329.6,440]];
  let i=0,t0=a.currentTime+.2;const bar=3.2;
  const sched=()=>{if(!amb)return;while(t0<a.currentTime+bar*2){const chords=MUSIC_DAY?DAY_CH:NIGHT_CH;const ch=chords[i++%chords.length];
      ch.forEach((fq,k)=>{const os=a.createOscillator(),gg=a.createGain();os.type=k?"sine":"triangle";os.frequency.value=fq*(k?1:.5);gg.gain.setValueAtTime(.0001,t0);gg.gain.exponentialRampToValueAtTime(k?.18:.25,t0+.6);gg.gain.exponentialRampToValueAtTime(.0001,t0+bar+.4);os.connect(gg);gg.connect(mg);os.start(t0);os.stop(t0+bar+.5);});
      [0,1,2,3].forEach(n=>{const fq=ch[(n*2+i)%4]*2,tt=t0+n*bar/4+.1,os=a.createOscillator(),gg=a.createGain();os.type="sine";os.frequency.value=fq;gg.gain.setValueAtTime(.0001,tt);gg.gain.exponentialRampToValueAtTime(.07,tt+.02);gg.gain.exponentialRampToValueAtTime(.0001,tt+.7);os.connect(gg);gg.connect(mg);os.start(tt);os.stop(tt+.8);});
      t0+=bar;}};
  sched();const iv=setInterval(sched,1000);
  amb={src,g,hum,hg,mg,iv};}
function stopAmbient(){if(!amb)return;try{amb.src.stop();amb.hum.stop();clearInterval(amb.iv);amb.mg.disconnect();}catch(e){}amb=null;}
function chime(){const a=ensureAudio();if(!a)return;const notes=MUSIC_DAY?[784,659,784,659,880,784]:[659,523,587,392,392,587,659,523];let t0=a.currentTime+.05;
  notes.forEach(fq=>{const o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.value=fq;g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.2,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+.9);o.connect(g);g.connect(bus("sfx"));o.start(t0);o.stop(t0+1);t0+=.42;});}
function rainSound(sec=8){const a=ensureAudio();if(!a)return;const s=a.createBufferSource();const b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;s.buffer=b;s.loop=true;
  const f=a.createBiquadFilter();f.type="highpass";f.frequency.value=1200;const g=a.createGain();g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.16,a.currentTime+1);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+sec);
  s.connect(f);f.connect(g);g.connect(bus("amb"));s.start();s.stop(a.currentTime+sec+.2);}
function ring(times=2){const a=ensureAudio();if(!a)return;let t0=a.currentTime+.05;for(let k=0;k<times;k++){for(let j=0;j<8;j++){const o=a.createOscillator(),g=a.createGain();o.frequency.value=j%2?440:480;g.gain.setValueAtTime(.12,t0);g.gain.setValueAtTime(0,t0+.05);o.connect(g);g.connect(bus("sfx"));o.start(t0);o.stop(t0+.05);t0+=.05;}t0+=.6;}}
/* 白天：偶爾有鳥叫、遠處的機車 */
function chirp(){const a=ensureAudio();if(!a||!amb)return;let t0=a.currentTime+.02;const n=2+Math.floor(Math.random()*3),base=2400+Math.random()*900;
  for(let k=0;k<n;k++){const o=a.createOscillator(),g=a.createGain();o.type="sine";o.frequency.setValueAtTime(base,t0);o.frequency.exponentialRampToValueAtTime(base*1.35,t0+.07);
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.05,t0+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+.09);o.connect(g);g.connect(bus("amb"));o.start(t0);o.stop(t0+.1);t0+=.13;}}
/* 雨：畫面上的雨滴 */
let rain=null;
function startRain(sec=10){if(rain)return;const n=500,geo=new THREE.BufferGeometry(),pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=Math.random()*40-6;pos[i*3+1]=Math.random()*8;pos[i*3+2]=Math.random()*30-4;}
  geo.setAttribute("position",new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:0x9fb4d8,size:.06,transparent:true,opacity:.7}));scene.add(pts);rain={pts,until:clockT.elapsedTime+sec};rainSound(sec);}
function tickRain(dt){if(!rain)return;const p=rain.pts.geometry.attributes.position;for(let i=0;i<p.count;i++){let y=p.getY(i)-dt*14;if(y<0)y=8;p.setY(i,y);}p.needsUpdate=true;if(clockT.elapsedTime>rain.until){scene.remove(rain.pts);rain=null;}}
