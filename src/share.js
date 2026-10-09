/* ================= 分享：結算成績卡、PWA ================= */
const SHARE_URL="https://lutm6666.github.io/ten-pm-cram-school/";
function wrapText(g,text,maxW){const out=[];let line="";for(const ch of text){if(g.measureText(line+ch).width>maxW&&line){out.push(line);line=ch;}else line+=ch;}if(line)out.push(line);return out;}
function drawResultCard(){
  const r=G.result,W=1080,H=1350,c=document.createElement("canvas");c.width=W;c.height=H;const g=c.getContext("2d");
  const F=(w,s)=>`${w} ${s}px "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif`,M=s=>`700 ${s}px "JetBrains Mono",ui-monospace,monospace`;
  const role={teacher:"#b7791f",yun:"#1f9c86",boss:"#c2457f"}[G.line.id]||"#c9302a";
  g.fillStyle="#101826";g.fillRect(0,0,W,H);
  // 窗外的夜景
  for(let i=0;i<46;i++){const x=640+(i*97)%(W-660),y=36+((i*53)%190);g.fillStyle=i%5?"rgba(255,209,102,.10)":"rgba(160,200,255,.12)";g.fillRect(x,y,26,16);}
  g.fillStyle="#f6f3ec";g.fillRect(60,250,W-120,H-330);
  g.fillStyle=role;g.fillRect(60,250,W-120,14);
  g.fillStyle="#ffd166";g.font=F(900,64);g.fillText("晚上十點下課",64,130);
  g.fillStyle="#9fb0c4";g.font=F(500,30);g.fillText(`${G.line.role}・${r.dead?"提早下班":fmt(Math.max(G.clock,endMin()))+" 下班"}`,68,190);
  let y=330;g.fillStyle="#6b7480";g.font=F(500,28);g.fillText("結案報告",110,y);
  y+=74;g.fillStyle="#1c2633";g.font=F(900,64);wrapText(g,r.title,W-220).forEach(l=>{g.fillText(l,110,y);y+=78;});
  g.font=F(400,30);g.fillStyle="#3a4452";wrapText(g,r.desc||"",W-220).slice(0,4).forEach(l=>{y+=4;g.fillText(l,110,y);y+=42;});
  y+=30;const bw=(W-220-30)/2;
  (r.big||[]).slice(0,2).forEach(([v,l],i)=>{const x=110+i*(bw+30);g.fillStyle="#ffffff";g.fillRect(x,y,bw,150);g.strokeStyle="#d9d4c8";g.lineWidth=2;g.strokeRect(x,y,bw,150);
    g.fillStyle="#1c2633";g.font=M(64);g.fillText(String(v),x+28,y+86);g.fillStyle="#6b7480";g.font=F(500,26);g.fillText(l,x+28,y+128);});
  y+=200;const ks=Object.keys(G.s),mw=(W-220-30)/2;
  ks.forEach((k,i)=>{const x=110+(i%2)*(mw+30),yy=y+Math.floor(i/2)*84;g.fillStyle="#3a4452";g.font=F(500,28);g.fillText(G.line.stats[k][0],x,yy);
    g.font=M(30);const t=String(G.s[k]);g.fillText(t,x+mw-g.measureText(t).width,yy);g.fillStyle="#e3ded3";g.fillRect(x,yy+16,mw,12);g.fillStyle=G.s[k]<25?"#c9302a":"#2456c9";g.fillRect(x,yy+16,mw*G.s[k]/100,12);});
  y+=Math.ceil(ks.length/2)*84+30;
  const facts=[G.lates?`遲到 ${G.lates} 次`:"整晚沒遲到",otMin()?`加班 ${otMin()} 分`:"準時下班",`撿到 ${G.items.length} 樣`,`聊了 ${(G.chatWith||[]).length} 人`,`成就 ${achSet.size}/${ACH.length}`];
  g.font=F(700,30);let x=110;facts.forEach(f=>{const w=g.measureText(f).width+40;if(x+w>W-110){x=110;y+=64;}g.fillStyle="#1c2633";g.fillRect(x,y,w,50);g.fillStyle="#f6f3ec";g.fillText(f,x+20,y+36);x+=w+14;});
  const its=G.items.map(id=>ITEMS.find(i=>i.id===id)).filter(Boolean);if(its.length){y+=110;g.font=F(400,44);g.fillStyle="#1c2633";let ix=110;its.slice(0,14).forEach(it=>{g.fillText(it.icon,ix,y);ix+=60;});}
  g.fillStyle="#6b7480";g.font=F(500,26);g.fillText("lutm6666.github.io/ten-pm-cram-school",110,H-120);
  g.fillStyle="#9fb0c4";g.font=F(500,26);g.fillText("補習班打工人的一個晚上",68,H-30);
  return c;
}
function openShareCard(){
  let c;try{c=drawResultCard();}catch(e){return;}
  const url=c.toDataURL("image/png"),name=`十點下課-${G.line.role}.png`;
  const prev=mode;mode="info";
  openSheet("成績卡",`<img src="${url}" alt="成績卡：${esc(G.line.role)}・${esc(G.result.title)}" style="width:100%;border-radius:6px;display:block">
    <p class="hint">長按（或右鍵）圖片可以儲存。</p><div class="actions"><button class="primary" data-act="shareImg">分享</button>${document.querySelector('link[rel="manifest"]')?`<a class="ghost btnlink" download="${esc(name)}" href="${url}">下載圖片</a>`:""}</div>`,()=>{mode=prev;});
  const btn=$("sheet").querySelector("[data-act=shareImg]");
  btn.onclick=()=>{c.toBlob(b=>{const f=new File([b],name,{type:"image/png"}),text=`我在《晚上十點下課》當${G.line.role}，結局是「${G.result.title}」。`;
    try{if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],text,url:SHARE_URL}).catch(()=>{});
      else if(navigator.share)navigator.share({text,url:SHARE_URL}).catch(()=>{});
      else{navigator.clipboard.writeText(text+" "+SHARE_URL);btn.textContent="已複製連結";}}catch(e){btn.textContent="請長按圖片儲存";}},"image/png");};
}
/* PWA：只有獨立網頁版（有 manifest）才註冊 service worker */
if(document.querySelector('link[rel="manifest"]')&&"serviceWorker" in navigator&&location.protocol==="https:"){addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{});});}
