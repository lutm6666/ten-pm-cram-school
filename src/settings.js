/* ================= 設定：音量、時間流速、視角、字體 ================= */
const SET_DEF={music:.7,amb:.7,sfx:.8,speed:1,rot:1,font:1};
const SET={...SET_DEF,...(store.get("set",{})||{})};
const SPEEDS=[[.7,"悠閒"],[1,"標準"],[1.4,"緊湊"]],FONTS=[[.9,"小"],[1,"標準"],[1.15,"大"]];
let buses=null;
/* 三條音量通道：音樂、環境音、音效。音量 0.7 = 原本的大小 */
function bus(kind){const a=actx;if(!a)return null;const o=out();
  if(!buses){buses={};["music","amb","sfx"].forEach(k=>{const g=a.createGain();g.connect(o);buses[k]=g;});applyVolumes();}
  return buses[kind]||o;}
function applyVolumes(){if(!buses||!actx)return;const t=actx.currentTime;["music","amb","sfx"].forEach(k=>{buses[k].gain.setTargetAtTime(Math.max(0,SET[k])/.7,t,.05);});}
function applyFont(){document.documentElement.style.fontSize=(16*SET.font)+"px";}
function saveSet(){store.set("set",{...SET});}
applyFont();

let setReturn=null;
function openSettings(){
  if(setReturn==null)setReturn=mode;if(mode==="walk"){mode="info";renderAll();}
  const seg=(key,opts)=>`<div class="seg" role="radiogroup">${opts.map(([v,l])=>`<button role="radio" aria-checked="${SET[key]===v}" data-set="${key}" data-v="${v}">${l}</button>`).join("")}</div>`;
  const rng=(key,label)=>`<label class="srow"><span>${label}</span><input type="range" min="0" max="1" step=".05" value="${SET[key]}" data-range="${key}" aria-label="${label}"><b>${Math.round(SET[key]*100)}</b></label>`;
  openSheet("設定",`
    <div class="sgroup"><div class="lbl">聲音</div>
      <label class="srow"><span>聲音</span><button class="toggle" data-act="sound" aria-pressed="${soundOn}">${soundOn?"開":"關"}</button></label>
      ${rng("music","音樂")}${rng("amb","環境音")}${rng("sfx","音效")}</div>
    <div class="sgroup"><div class="lbl">時間流速</div>${seg("speed",SPEEDS)}<p class="hint">悠閒：每 6 秒 1 分鐘；標準：每 4 秒；緊湊：每 3 秒。</p></div>
    <div class="sgroup"><div class="lbl">視角</div>
      <label class="srow"><span>拖曳靈敏度</span><input type="range" min=".4" max="2" step=".1" value="${SET.rot}" data-range="rot" aria-label="拖曳靈敏度"><b>${SET.rot.toFixed(1)}</b></label>
      <label class="srow"><span>鏡頭距離</span><input type="range" min=".55" max="1.8" step=".05" value="${CAM.zoom}" data-range="zoom" aria-label="鏡頭距離"><b>${CAM.zoom.toFixed(2)}</b></label></div>
    <div class="sgroup"><div class="lbl">字體大小</div>${seg("font",FONTS)}</div>
    <div class="actions"><button class="ghost" data-act="setReset">恢復預設</button></div>`,()=>{if(setReturn==="walk"){mode="walk";renderAll();}setReturn=null;});
}
document.addEventListener("input",e=>{const r=e.target.closest&&e.target.closest("[data-range]");if(!r)return;const k=r.dataset.range,v=+r.value;
  if(k==="zoom"){CAM.zoom=v;saveCam();r.nextElementSibling.textContent=v.toFixed(2);return;}
  SET[k]=v;r.nextElementSibling.textContent=k==="rot"?v.toFixed(1):Math.round(v*100);applyVolumes();saveSet();});
document.addEventListener("change",e=>{const r=e.target.closest&&e.target.closest("[data-range]");if(r&&r.dataset.range==="sfx")beep("blip");});
document.addEventListener("click",e=>{const b=e.target.closest("[data-set]");if(b){SET[b.dataset.set]=+b.dataset.v;saveSet();
    b.parentNode.querySelectorAll("[data-set]").forEach(x=>x.setAttribute("aria-checked",x===b));if(b.dataset.set==="font"){applyFont();renderHud();}beep("blip");return;}
  const a=e.target.closest("[data-act=setReset]");if(a){Object.assign(SET,SET_DEF);CAM.zoom=1;CAM.tilt=1;saveCam();saveSet();applyFont();applyVolumes();openSettings();}});
