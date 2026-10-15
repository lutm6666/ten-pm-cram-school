/* ================= 成就 ================= */
const ACH=[
 {id:"jam0",name:"影印機知己",desc:"修卡紙一張都沒撕破",test:G=>G.minis.jam&&G.minis.jam.tears===0},
 {id:"quiz5",name:"全班喔～",desc:"暖身五題全部答對",test:G=>G.minis.quiz&&G.minis.quiz.right===5},
 {id:"calm",name:"林媽媽笑了",desc:"把林媽媽的怒氣降到 20 以下",test:G=>G.minis.calm&&G.minis.calm.anger<=20},
 {id:"kidroll",name:"一個都沒少",desc:"到國小門口接人，一次就點出還沒出來的小朋友",test:G=>["kidroll","kidroll2","kidroll3"].some(k=>G.minis[k]&&G.minis[k].miss===0)},
 {id:"roll",name:"一眼就看出來",desc:"點名時一次都沒點錯",test:G=>G.minis.roll&&G.minis.roll.miss===0},
 {id:"ontime",name:"準時的人",desc:"一整天沒有遲到",test:G=>G.done&&!G.lates},
 {id:"late",name:"永遠差五分鐘",desc:"一天遲到三次以上",test:G=>G.lates>=3},
 {id:"sides",name:"有求必應",desc:"一條線的支線全部完成",test:G=>G.done&&(SIDES[G.line.id]||[]).every(s=>G.sidesDone[s.id])},
 {id:"items",name:"什麼都撿",desc:"一天撿到 5 樣以上的東西",test:G=>G.items.length>=5},
 {id:"zhe",name:"阿哲留下來了",desc:"讓阿哲找到重新開始的方法",test:G=>G.done&&(G.f.zheOpen||G.f.baseClass||G.f.zheTalk||G.f.linSign||G.f.zheStay||G.f.zheSheet)},
 {id:"truth",name:"說實話",desc:"照實填總部週報，還附上說明",test:G=>G.f.explained},
 {id:"thirsty",name:"整晚沒喝到水",desc:"嗓子撐到 20 以下還是上完課",test:G=>G.done&&G.line.id==="teacher"&&G.s.voice>0&&G.s.voice<=20},
 {id:"bento",name:"誰吃了我的便當",desc:"把便當的事推給阿宏",test:G=>G.f.blamedHong},
 {id:"ot30",name:"責任制",desc:"加班超過半小時才下班",test:G=>G.done&&!G.result?.dead&&otMin()>=30},
 {id:"ot0",name:"準時下班",desc:"加班不到五分鐘就離開補習班",test:G=>G.done&&!G.result?.dead&&otMin()<5},
 {id:"chat5",name:"話匣子",desc:"一天跟 5 個人閒聊",test:G=>(G.chatWith||[]).length>=5},
 {id:"day2",name:"又是一天",desc:"玩完任一個位子的第二天",test:G=>G.done&&G.day===2},
 {id:"day2all",name:"這週還沒過完",desc:"五個位子的第二天都玩過",test:G=>G.done&&["care","jh","teacher","yun","boss"].every(i=>doneLines.has(i+"@2"))},
 {id:"change",name:"找零高手",desc:"繳費時算對金額，用最少張數找零",test:G=>G.minis.change&&G.minis.change.right&&G.minis.change.exact},
 {id:"carry",name:"十個綁成一捆",desc:"陪小宇把進位的題目都找出來",test:G=>(G.minis.kidgrade&&G.minis.kidgrade.hits===3)||(G.minis.kidgrade2&&G.minis.kidgrade2.hits===3)},
 {id:"quiz8",name:"(a + b)²",desc:"八年級暖身五題全對",test:G=>G.minis.quiz8&&G.minis.quiz8.right===5},
 {id:"heard",name:"先聽完",desc:"讓一位家長把話說完",test:G=>G.f.heardXiangma||G.f.heardBoth||G.f.toldAnma},
 {id:"all5",name:"整棟補習班",desc:"五個位子都玩過",test:G=>G.done&&["teacher","yun","boss","care","jh"].every(i=>doneLines.has(i))},
 {id:"epi",name:"一個月後",desc:"看到一個月後的補習班",test:()=>false}
];
let achSet=new Set();try{achSet=new Set(JSON.parse(localStorage.getItem("ten-pm:ach")||"[]"));}catch(e){}
function unlockAch(id){if(achSet.has(id))return;achSet.add(id);try{localStorage.setItem("ten-pm:ach",JSON.stringify([...achSet]));}catch(e){}
  const a=ACH.find(x=>x.id===id);if(a&&typeof showBanner==="function"){showBanner("成就解鎖：「"+a.name+"」",a.desc);if(typeof beep==="function")beep("ok");}}
function checkAch(){if(!G)return;ACH.forEach(a=>{try{if(!achSet.has(a.id)&&a.test(G))unlockAch(a.id);}catch(e){}});}
