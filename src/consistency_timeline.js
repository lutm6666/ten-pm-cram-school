/* ================= 一致性：跨職業線共用到班時間 =================
   高三、國中、自習室不應因玩家選了不同職業就提早一小時坐滿。
   這層只調整背景 crowd 的到場時鐘與幾段相互矛盾的文字。 */

/* 17:20–18:00 高三背景學生尚未到班；18:00 後開始陸續進來。
   自習室課表 19:00 開始，背景自習生 18:50 起才陸續進場。 */
const CONS_TIME_BASE_SET_CROWD=setCrowd;
setCrowd=function(ph,instant){
  CONS_TIME_BASE_SET_CROWD(ph,instant);
  if(!G||G.line.crowd==='kids'||ph!=='pre')return;
  const now=clockT.elapsedTime;
  const hold=(list,start,spacing)=>list.forEach((e,i)=>{
    const at=start+i*spacing;
    if(G.clock<at){e.p.visible=false;e.p.userData.path=null;e.p.userData.act=null;e.state='clockWait';e.arriveClock=at;}
    else if(e.state==='clockWait'){e.state='toArrive';e.at=now+(i%4)*.12;}
  });
  hold(extras.filter(e=>e.kind==='class'),18*60,1.15);
  hold(extras.filter(e=>e.kind==='study'),18*60+50,1.5);
};

/* 安親線：主任 14:35 說 17:30 會回分校，就讓他真的在點心時間從門口回主任室。 */
if(LINES.care){
  const snack=LINES.care.steps.find(s=>s.id==='c_snack');
  if(snack){snack.npc=snack.npc||{};snack.npc.boss=[P.bossOffice[0],P.bossOffice[1],P.bossOffice[2]||0,PC.door];}
}

/* C 班共 9 人，阿翔尚未交手機時籃子應該是其他 8 支，不是 12 支。 */
if(LINES.jh){
  const x=LINES.jh.steps.find(s=>s.id==='j_xiang');
  if(x&&x.pages){const old=x.pages;x.pages=G=>old(G).map(r=>[r[0],typeof r[1]==='string'?r[1].replace('籃子裡已經有十二支手機了。只差他一支。','籃子裡已經有八支手機了。只差他一支。'):r[1]]);}
}

/* 自習室實際以少量代表性模型呈現，不再寫成畫面上看不到的「十幾雙眼睛」。 */
if(LINES.yun){
  const seat=LINES.yun.steps.find(s=>s.id==='yseat');
  if(seat&&seat.pages){const old=seat.pages;seat.pages=G=>old(G).map(r=>[r[0],typeof r[1]==='string'?r[1].replace('自習室裡十幾雙眼睛都在看。','自習室裡好幾雙眼睛都在看。'):r[1]]);}
}

/* 第二天阿哲原本 17:22 已在場，文字卻說 17:30 才到；改成與當下場景一致。 */
if(typeof LINES2!=='undefined'&&LINES2.teacher){
  const note=LINES2.teacher.steps.find(s=>s.id==='t2note');
  if(note&&note.pages){const old=note.pages;note.pages=G=>old(G).map(r=>{
    if(typeof r[1]!=='string')return r;
    let t=r[1]
      .replace('阿哲五點半就到了，坐在走廊。他說是你昨天跟他約好的。','阿哲已經到了，坐在走廊。他說是你昨天跟他約好的。')
      .replace('還有……林媽媽說，阿哲昨天回家把講義撕了。今天會不會來，她也不知道。','還有……阿哲剛剛還是來了，坐在走廊一句話都沒說。林媽媽說他昨天回家把講義撕了。');
    return [r[0],t];
  });}
}

const CONS_TIME_BASE_AUDIT=window.__consistencyAudit;
window.__consistencyAudit=()=>{
  const b=CONS_TIME_BASE_AUDIT?CONS_TIME_BASE_AUDIT():{};
  return {...b,visibleStudy:extras.filter(e=>e.kind==='study'&&e.p.visible).length};
};
