/* ================= 人物的共用站位（所有職業線都用） ================= */
const SEAT=(room,id)=>{const s=seatsOf(room)[NAMED_SEATS[room][id]];return [s[0],s[1],s[2]];};
const kidIn=s=>[s[0],s[1],s[2],DOOR];
const PC={lin:AT("g5podium",0,0,0),wu:AT("g6podium",0,0,0),yunDesk:AT("counterIn",0,0,0),bossDesk:AT("bossdesk",0,-2.3,0),hrDesk:AT("hrdesk",0,-1.9,0),
  zhangLobby:AT("sofa",-1.2,0),zhangConsult:AT("consult",0,-2.3,0),amaLobby:AT("counter",.8,.6),xiangmaLobby:AT("counter",-1.4,.9),mimaLobby:AT("lobby",-.6,.6)};
const PJ={hrDesk:AT("hrdesk",0,-1.9,0),back:AT("c9back",0,0,Math.PI),teacherPodium:AT("c9podium",0,0,0),xiangHall:AT("c9door",-.6,.4,Math.PI),qingHall:AT("c9door",.8,.5,Math.PI),zheHall:AT("c9door",-1.6,.5,Math.PI)};
const C9=id=>[...SEAT("c9",id),DOOR];
