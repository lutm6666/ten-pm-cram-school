/* ================= 補習班格局（國小安親＋國小美語＋國中部，三層樓） =================
   三層樓放在同一個平面上，以 X 方向偏移：1F x∈[0,36]、2F x∈[48,84]、3F x∈[96,132]。
   每層 36×18 公尺。上半排房間 z∈[0,7]，走廊 z∈[7,9.5]，下半排房間 z∈[9.5,18]。
   右上角 x∈[30,36] 是電梯與樓梯。
   這份資料是場景、碰撞、尋路、劇情地點的唯一來源；美術層依同一份資料裝飾。 */
const FLOOR_W=36,FLOOR_GAP=48,FLOOR_N=3,W=FLOOR_GAP*(FLOOR_N-1)+FLOOR_W,H=18;
const FLOOR_NAMES=["1F","2F","3F"];
const floorOf=x=>Math.max(0,Math.min(FLOOR_N-1,Math.floor(x/FLOOR_GAP)));
const FLX=(f,x)=>f*FLOOR_GAP+x;

/* 房間：rect 為樓層內座標；door 為面向走廊那一面的開口 [x0,x1]（下半排的門在 z=9.5、上半排在 z=7）。
   open:true 表示整面對走廊開放（大廳、電梯廳）。 */
const ROOMS=[
 // ---- 1F ----
 {f:0,id:"office",name:"主任室",rect:[0,0,8,7],door:[6,7.4],floor:0xc6cec4,desc:"主任的辦公桌、續班名單、總部的週報。門通常開著。"},
 {f:0,id:"copyroom",name:"教材室",rect:[8,0,14,7],door:[9,10.4],floor:0xcdd2d6,desc:"影印機、各班的講義和考卷。每天下午最搶的地方。"},
 {f:0,id:"consult",name:"諮詢室",rect:[14,0,20,7],door:[15,16.4],floor:0xd3cbbd,desc:"一張小圓桌、兩把椅子和招生簡章。新生家長在這裡談。"},
 {f:0,id:"staff",name:"員工茶水間",rect:[20,0,30,7],door:[21,22.4],floor:0xd3cbbd,desc:"冰箱、微波爐、熱水壺。所有老師的便當都在這裡。"},
 {f:0,id:"core1",name:"電梯廳",rect:[30,0,36,7],open:true,floor:0xcdd2d6,desc:"一部電梯、一座樓梯。放學時電梯永遠在別層。"},
 {f:0,id:"lobby",name:"大廳",rect:[0,9.5,16,18],open:true,floor:0xd9d2c3,desc:"進門就是櫃台和刷卡機。接送時間，家長都在這裡等。"},
 {f:0,id:"english",name:"國小美語教室",rect:[16,9.5,28,18],door:[17,18.4],floor:0xdcd5c6,desc:"國小美語班。牆上貼滿了字母和單字卡。"},
 {f:0,id:"store",name:"倉庫",rect:[28,9.5,36,18],door:[29,30.4],floor:0xc9c2b2,desc:"影印紙、點心、備用的掃具。"},
 // ---- 2F：國小安親 ----
 {f:1,id:"g1",name:"一年級安親教室",rect:[0,0,10,7],door:[8.2,9.6],floor:0xe3dccb,desc:"一年級。桌子比較矮，牆上貼著注音符號。"},
 {f:1,id:"g2",name:"二年級安親教室",rect:[10,0,20,7],door:[18.2,19.6],floor:0xe3dccb,desc:"二年級。白板上寫著今天的作業。"},
 {f:1,id:"g34",name:"中年級安親教室",rect:[20,0,30,7],door:[28.2,29.6],floor:0xe3dccb,desc:"三、四年級。評量疊得比一年級高兩倍。"},
 {f:1,id:"core2",name:"電梯廳",rect:[30,0,36,7],open:true,floor:0xcdd2d6,desc:"樓梯口貼著「小朋友不要在樓梯跑」。"},
 {f:1,id:"careoffice",name:"安親辦公區",rect:[0,9.5,8,18],door:[1,2.4],floor:0xd3cbbd,desc:"安親老師的辦公桌、聯絡簿、急救箱。"},
 {f:1,id:"wash",name:"洗手台",rect:[8,9.5,12,18],door:[9,10.4],floor:0xcfd6cf,desc:"一排矮矮的洗手台。午餐後大家在這裡刷牙。"},
 {f:1,id:"reading",name:"閱讀角",rect:[12,9.5,22,18],door:[13,14.4],floor:0xe6dcc6,desc:"地墊、書櫃、幾個懶骨頭。寫完作業才能來。"},
 {f:1,id:"snack",name:"點心區",rect:[22,9.5,30,18],door:[23,24.4],floor:0xe3dccb,desc:"長桌和小椅子。點心時間最吵的地方。"},
 {f:1,id:"cubby",name:"書包櫃",rect:[30,9.5,36,18],door:[31,32.4],floor:0xc9c2b2,desc:"每個小朋友一格，貼著名字。"},
 // ---- 3F：國中部 ----
 {f:2,id:"c7",name:"七年級教室",rect:[0,0,10,7],door:[8.2,9.6],floor:0xdcd5c6,desc:"七年級。還在學怎麼當國中生。"},
 {f:2,id:"c8",name:"八年級教室",rect:[10,0,20,7],door:[18.2,19.6],floor:0xdcd5c6,desc:"八年級。最吵的一班，也最好笑的一班。"},
 {f:2,id:"c9",name:"九年級教室",rect:[20,0,30,7],door:[28.2,29.6],floor:0xdcd5c6,desc:"九年級會考班。後面黑板寫著會考倒數。"},
 {f:2,id:"core3",name:"電梯廳",rect:[30,0,36,7],open:true,floor:0xcdd2d6,desc:"國中生下課最愛擠在這裡等電梯。"},
 {f:2,id:"jhlounge",name:"國中老師休息室",rect:[0,9.5,8,18],door:[1,2.4],floor:0xd3cbbd,desc:"跑堂老師放包包、喝水、改考卷的地方。"},
 {f:2,id:"tutor",name:"課輔室",rect:[8,9.5,20,18],door:[9,10.4],floor:0xcfd6cf,desc:"兩張長桌。課輔老師在這裡解題，下課時排隊排到門口。"},
 {f:2,id:"lockers",name:"國中置物區",rect:[20,9.5,28,18],door:[21,22.4],floor:0xd8d2c8,desc:"書包櫃和收手機的籃子。"},
 {f:2,id:"jhoffice",name:"國中辦公室",rect:[28,9.5,36,18],door:[29,30.4],floor:0xd3cbbd,desc:"國中班導的辦公桌、成績登記本、聯絡本。"}
];

/* 電梯與樓梯：每層同一個樓層內座標。走到連結點即可換樓層。 */
const CORE={elev:[31.5,3.6],stairs:[34.5,3.6]};
const PORTALS=[];
for(let f=0;f<FLOOR_N;f++){
  if(f<FLOOR_N-1)PORTALS.push({kind:"stairs",a:[FLX(f,CORE.stairs[0]),CORE.stairs[1]],b:[FLX(f+1,CORE.stairs[0]),CORE.stairs[1]],min:.6});
  for(let g=f+1;g<FLOOR_N;g++)PORTALS.push({kind:"elev",a:[FLX(f,CORE.elev[0]),CORE.elev[1]],b:[FLX(g,CORE.elev[0]),CORE.elev[1]],min:1});
}

/* 教室座位：cols、rows 為樓層內座標；學生面向白板（上半排教室白板在 z≈0.25）。 */
const CLASS_SEATS={
 g1:{cols:[1.8,4.6,7.4],rows:[2.5,3.8,5.1],kid:1},
 g2:{cols:[11.8,14.6,17.4],rows:[2.5,3.8,5.1],kid:1},
 g34:{cols:[21.8,24.6,27.4],rows:[2.5,3.8,5.1],kid:1},
 c7:{cols:[1.4,3.6,5.8,8],rows:[2.6,3.9,5.2]},
 c8:{cols:[11.4,13.6,15.8,18],rows:[2.6,3.9,5.2]},
 c9:{cols:[21.4,23.6,25.8,28],rows:[2.6,3.9,5.2]},
 english:{cols:[19,21.5,24,26.5],rows:[15.4,13.9],face:0}
};
/* 回傳某班的座位清單（全域座標）：[x,z,rot] */
function seatsOf(room){const r=ROOMS.find(q=>q.id===room),s=CLASS_SEATS[room];if(!r||!s)return[];const out=[];
  s.rows.forEach(z=>s.cols.forEach(x=>out.push([FLX(r.f,x),s.face===0?z-.62:z+.62,s.face===0?0:Math.PI])));return out;}

/* 命名地點：劇情目標用這些名字，不寫死座標。h 是頭上標記的高度。 */
const SPOT_DEFS={
 // 1F
 door:[0,4.5,17,"門口"],cardreader:[0,6.9,16.2,"刷卡機"],counter:[0,5,11.8,"櫃台"],counterIn:[0,5,9.9,"櫃台內側"],sofa:[0,12,14,"等候沙發"],
 lobby:[0,8.5,14.2,"大廳"],shoes:[0,1.4,15.5,"鞋櫃"],rank:[0,.9,12,"榜單牆"],copier:[0,10,2.9,"影印機"],copyshelf:[0,12.6,3.6,"講義架"],
 bossdesk:[0,3.75,3.7,"主任的桌子"],consult:[0,17,4.4,"諮詢室"],lounge:[0,24.5,5,"茶水間"],fridge:[0,28.6,2.2,"冰箱"],
 engpodium:[0,22,17.2,"美語教室講台"],engdoor:[0,17.7,9.9,"美語教室門口"],store:[0,32,13,"倉庫"],
 elev1:[0,31.5,3.6,"電梯（1F）"],stairs1:[0,34.5,3.6,"樓梯（1F）"],
 // 2F
 g1door:[1,8.9,7.8,"一年級門口"],g2door:[1,18.9,7.8,"二年級門口"],g34door:[1,28.9,7.8,"中年級門口"],
 g2podium:[1,15,.9,"二年級講桌"],g1podium:[1,5,.9,"一年級講桌"],g34podium:[1,25,.9,"中年級講桌"],
 careoffice:[1,4,13.5,"安親辦公桌"],wash:[1,10,13.5,"洗手台"],reading:[1,17,14,"閱讀角"],snack:[1,26,14,"點心區"],cubby:[1,33,13.5,"書包櫃"],
 elev2:[1,31.5,3.6,"電梯（2F）"],stairs2:[1,34.5,3.6,"樓梯（2F）"],
 // 3F
 c7door:[2,8.9,7.8,"七年級門口"],c8door:[2,18.9,7.8,"八年級門口"],c9door:[2,28.9,7.8,"九年級門口"],
 c9podium:[2,25,.9,"九年級講台"],c9back:[2,24.7,6.45,"九年級教室後面"],c8podium:[2,15,.9,"八年級講台"],c7podium:[2,5,.9,"七年級講台"],
 jhlounge:[2,4,13.5,"國中老師休息室"],tutor:[2,14,13.5,"課輔室"],lockers:[2,24,13.5,"手機籃"],hrdesk:[2,32,13.5,"班導的桌子"],
 elev3:[2,31.5,3.6,"電梯（3F）"],stairs3:[2,34.5,3.6,"樓梯（3F）"]
};
const SPOTS={};for(const k in SPOT_DEFS){const [f,x,z,name,h]=SPOT_DEFS[k];SPOTS[k]={pos:[FLX(f,x),z],name,h:h||1.4,floor:f};}
/* 人物站位：spot 名稱 → [x,z,rot]；rot 預設面向 -z（看向白板或櫃台）。 */
const AT=(spot,dx=0,dz=0,rot=Math.PI)=>{const s=SPOTS[spot];return[s.pos[0]+dx,s.pos[1]+dz,rot];};

/* 區域（進入時跳出名稱與說明） */
const ZONE_RECTS=ROOMS.map(r=>[r.name,FLX(r.f,r.rect[0]),r.rect[1],FLX(r.f,r.rect[2]),r.rect[3],r.desc,r.f]);
for(let f=0;f<FLOOR_N;f++)ZONE_RECTS.push([`${FLOOR_NAMES[f]} 走廊`,FLX(f,0),7,FLX(f,30),9.5,["接送、送點心、換教室，都要經過這裡。","安親的小朋友不准在這裡跑。","下課時最擠的地方。"][f],f]);
function zoneAt(x,z){return ZONE_RECTS.find(r=>x>=r[1]&&x<r[3]&&z>=r[2]&&z<r[4]);}
/* 地板上的大字：只標大空間 */
const ZONES=[["大廳 LOBBY",FLX(0,8),16.6,0],["電梯 ELEVATOR",FLX(0,33),5.6,0],["電梯 ELEVATOR",FLX(1,33),5.6,0],["電梯 ELEVATOR",FLX(2,33),5.6,0]];

/* 牆：外牆＋走廊兩側（留門）＋房間之間的隔間。全域座標 [x0,z0,x1,z1]。 */
const WALLS=[];
(function buildWalls(){const t=.1;
  for(let f=0;f<FLOOR_N;f++){const o=f*FLOOR_GAP;
    WALLS.push([o,0,o+FLOOR_W,.2],[o,0,o+.2,H],[o+FLOOR_W-.2,0,o+FLOOR_W,H]);
    if(f===0)WALLS.push([o,17.8,o+3.3,H],[o+5.7,17.8,o+FLOOR_W,H]);else WALLS.push([o,17.8,o+FLOOR_W,H]);
    const rooms=ROOMS.filter(r=>r.f===f);
    // 走廊上側 z=7、下側 z=9.5：依房間的門切開
    [[7,r=>r.rect[3]===7],[9.5,r=>r.rect[1]===9.5]].forEach(([z,pick])=>{
      rooms.filter(pick).forEach(r=>{if(r.open)return;const [x0,,x1]=r.rect,gaps=[r.door||[x0,x0]];
        let cur=x0;gaps.sort((a,b)=>a[0]-b[0]).forEach(([g0,g1])=>{if(g0>cur)WALLS.push([o+cur,z-t,o+g0,z+t]);cur=Math.max(cur,g1);});
        if(cur<x1)WALLS.push([o+cur,z-t,o+x1,z+t]);});});
    // 房間之間的隔間（同一排相鄰）
    rooms.forEach(r=>{const [x0,z0,,z1]=r.rect;if(x0<=0)return;const left=rooms.find(q=>q.rect[2]===x0&&q.rect[1]===z0);if(!left)return;
      if(r.open&&left.open)return;WALLS.push([o+x0-t,z0,o+x0+t,z1]);});
  }})();
