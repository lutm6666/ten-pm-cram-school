/* ================= 啟動 ================= */
try{buildWorld();buildNight();const L=LINES.teacher;for(const id in L.npcs)if(CHARS[id]&&CHARS[id].body!==undefined)setNPC(id,typeof L.npcs[id]==="function"?null:L.npcs[id],true);showTitle();tick();}
catch(err){const c=$("cover");c.hidden=false;c.innerHTML=`<div class="card"><h2>3D 場景載入失敗</h2><p>你的瀏覽器可能不支援 WebGL，或 3D 函式庫沒有載入。請換一個瀏覽器，或重新整理頁面再試一次。</p></div>`;console.error(err);}
