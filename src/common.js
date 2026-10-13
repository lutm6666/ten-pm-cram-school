/* ================= 共用資料 ================= */
const CHARS={
 // 職員
 yun:{name:"小芸",short:"櫃台",title:"櫃台老師",abbr:"櫃",color:"#1f9c86",body:0x2fb39a,hair:0x3a2a22},
 boss:{name:"何主任",short:"主任",title:"補習班主任",abbr:"主",color:"#c2457f",body:0x2f3a4a,hair:0x8a8a8a},
 teacher:{name:"許老師",short:"數學",title:"國中數學・跑堂老師",abbr:"師",color:"#b7791f",body:0xf0f0f0,hair:0x2a2421},
 hr:{name:"鄭老師",short:"班導",title:"國中九年級班導",abbr:"導",color:"#2f5d8a",body:0x5b7fa6,hair:0x2a2421},
 cai:{name:"蔡老師",short:"安親",title:"二年級安親老師",abbr:"安",color:"#e8590c",body:0xffc078,hair:0x3a2a22},
 lin:{name:"林老師",short:"安親",title:"一年級安親老師",abbr:"林",color:"#d9480f",body:0xffa8a8,hair:0x2a2421},
 wu:{name:"吳老師",short:"安親",title:"中年級安親老師",abbr:"吳",color:"#c2410c",body:0xa9e34b,hair:0x151515},
 amy:{name:"Amy 老師",short:"美語",title:"國小美語老師",abbr:"英",color:"#2b8a3e",body:0x8ce99a,hair:0x3b2b20},
 hong:{name:"阿宏",short:"課輔",title:"國中課輔老師・大三",abbr:"輔",color:"#2f7d4f",body:0x5c9d6a,hair:0x222222},
 // 國中生
 pinyu:{name:"品妤",short:"九年級",title:"九年級・班上前三名",abbr:"妤",color:"#3d6fd8",body:0x7a9cc6,hair:0x1f1b18},
 zhe:{name:"阿哲",short:"九年級",title:"九年級・最後一排",abbr:"哲",color:"#5c6370",body:0x3d3d3d,hair:0x1a1a1a},
 xiang:{name:"阿翔",short:"九年級",title:"九年級・小宇的哥哥",abbr:"翔",color:"#1971c2",body:0x339af0,hair:0x151515},
 qing:{name:"子晴",short:"九年級",title:"九年級・英文小老師",abbr:"晴",color:"#c2255c",body:0xf06595,hair:0x2a2421},
 bo:{name:"小柏",short:"八年級",title:"八年級",abbr:"柏",color:"#2e86ab",body:0x4aa3c7,hair:0x1a1a1a},
 trial:{name:"試聽生",short:"九年級",title:"來試聽的九年級生",abbr:"試",color:"#5c7d78",body:0x6f8f8a,hair:0x2a2421},
 // 國小生
 yu:{name:"小宇",short:"二年級",title:"二年級・阿翔的弟弟",abbr:"宇",color:"#e8590c",body:0xf08c3a,hair:0x2a2421,kid:1},
 anan:{name:"安安",short:"二年級",title:"二年級",abbr:"安",color:"#7048e8",body:0x9775fa,hair:0x1a1a1a,kid:1},
 mi:{name:"小米",short:"二年級",title:"二年級",abbr:"米",color:"#d6336c",body:0xf783ac,hair:0x3a2a22,kid:1},
 // 家長
 parent:{name:"王媽媽",short:"試聽家長",title:"試聽生的媽媽",abbr:"家",color:"#8b5cc7",body:0xa77fd6,hair:0x4a3a2e},
 mom:{name:"林媽媽",short:"家長",title:"阿哲的媽媽・電話中",abbr:"☎",color:"#c06a2b"},
 xiangma:{name:"阿翔媽媽",short:"家長",title:"阿翔和小宇的媽媽",abbr:"家",color:"#a0522d",body:0xc08457,hair:0x2a2421},
 chenba:{name:"陳爸爸",short:"家長",title:"小柏的爸爸",abbr:"家",color:"#6b7f3a",body:0x7d8f4a,hair:0x333333},
 ama:{name:"李阿嬤",short:"家長",title:"安安的阿嬤",abbr:"嬤",color:"#868e96",body:0xadb5bd,hair:0xdddddd},
 zhangma:{name:"張媽媽",short:"詢問",title:"來詢問安親的家長",abbr:"家",color:"#1c7ed6",body:0x4dabf7,hair:0x3a2a22},
 mima:{name:"小米媽媽",short:"家長",title:"小米的媽媽",abbr:"家",color:"#b5487d",body:0xe599f7,hair:0x2a2421},
 deliv:{name:"外送員",short:"外送",title:"外送平台",abbr:"送",color:"#d9480f",body:0xe8590c,hair:0x222222}
};

const TERMS={
 "安親":"國小放學後到家長下班前，幫忙接送、看功課、簽聯絡簿的地方。",
 "評量":"出版社出的練習本，跟著學校進度。安親班每天會依進度寫一回、老師批改訂正。",
 "聯絡簿":"國小生每天帶回家的本子，寫著當天作業和老師的話，家長要簽名。安親老師常常是第一個看的人。",
 "聯絡本":"國中補習班的聯絡本：每天的小考成績、到班時間、老師的話，家長簽名後帶回來。",
 "接送名單":"家長事先登記可以來接孩子的人。不在名單上的人來接，要先打給家長確認。",
 "半天":"國小低年級（一、二年級）只有週二上整天，其他天中午放學；中、高年級只有週三上半天。",
 "會考":"國中教育會考。九年級下學期五月考，成績分 A++ 到 C，決定高中志願。",
 "段考":"學校的定期考試，一學期三次。補習班在段考前加課、發複習卷。",
 "跑堂":"補習班的授課老師多半同時在好幾間補習班上課，一晚趕兩三個地方，大家叫「跑堂」。",
 "班導":"補習班裡負責一個班的人：點名、印考卷、登成績、聯絡家長、顧秩序，不一定是上課的老師。",
 "刷卡":"學生進出補習班要刷卡，系統會自動傳「已到班」「已離班」給家長。",
 "試聽":"還沒報名的學生先來上一兩堂課。家長在大廳等，不進教室。",
 "續班":"學生上完這一期，繼續報下一期。補習班最在意的數字之一。",
 "續班率":"這一期的學生裡，有多少比例報了下一期。主任辦公室牆上那個數字。",
 "退費":"依縣市規定分段退：開課前退九成、上不到三分之一退一半、超過三分之一不退。",
 "課輔":"課後輔導。由課輔老師另外解題，不佔正課時間。",
 "日結":"每天關門前，把當天收的現金、收據、刷卡紀錄對一次。對不起來就不能下班。",
 "A++":"會考每科的最高等級。五科都 A++ 叫「5A++」，是榜單上最醒目的數字。"
};

/* 說明點：大家共用 */
const SP=(k,dx=0,dz=0)=>[SPOTS[k].pos[0]+dx,SPOTS[k].pos[1]+dz];
const INFO=[
 {id:"kanban",pos:SP("bossdesk",-1.2,-.6),h:2.0,zone:"主任室・主任的電腦",title:"招生報表",
  body:["主任電腦上開著的內部報表，家長看不到。每一格有一個燈號。"],
  table:G=>[["本期[[續班率]]",`${Math.round(G.h.ret??74)}%`,"目標 85%",(G.h.ret??74)>=85?"g":"r"],["九年級人數","12 / 15","段考後會再掉嗎？","y"],["安親二年級","8 位","名額 9","g"]]},
 {id:"rank",pos:SP("rank"),h:2.2,zone:"大廳・西側牆面",title:"會考榜單",
  body:["去年會考的紅紙榜單：建中 2、北一女 1、5A++ 4。","貼在家長進門第一眼會看到的地方。名字旁邊都有家長簽的同意書。"]},
 {id:"copierinfo",pos:SP("copier",1.2,0),h:1.9,zone:"教材室",title:"影印機",
  body:["用了八年的大台影印機。下午兩點到四點，安親的評量、國中的考卷、美語的學習單都在搶它。","側蓋貼著一張手寫紙條：「卡紙請順著出紙方向拉，不要硬扯！—小芸」"]},
 {id:"cardinfo",pos:SP("cardreader",.6,0),h:1.8,zone:"大廳・門口",title:"刷卡機",
  body:["學生進出要[[刷卡]]，系統自動傳訊息給家長。","忘了刷卡的人，家長會打來問：「我怎麼沒收到到班通知？」"]},
 {id:"schedule",pos:[FLX(0,10),7.3],h:2.1,zone:"1F 走廊",title:"今日課表",
  body:["走廊的白板，小芸每天下午用三種顏色重寫一次。"],
  table:()=>[["11:30–19:00","國小[[安親]]","2F・一、二、中年級","y"],["18:30–20:00","國小美語","1F・Amy 老師","g"],["18:00–21:00","國中九年級 數學","3F・許老師","y"],["18:00–21:00","國中七、八年級","3F","g"]]},
 {id:"target",pos:SP("bossdesk",.4,-2.9),h:2.2,zone:"主任室",title:"續班目標",
  body:["主任桌子對面的牆上貼著「本期續班目標 85%」。","字是主任自己寫的，寫完又用紅筆把 85 描了兩次。"]},
 {id:"firstaid",pos:SP("careoffice",3,-2.4),h:1.9,zone:"2F・安親辦公區",title:"急救箱",
  body:["OK 繃、優碘、冰敷袋、耳溫槍。","箱子內側貼著：「發燒 37.5 度以上，通知家長接回。」"]},
 {id:"cubbyinfo",pos:SP("cubby"),h:1.8,zone:"2F・書包櫃",title:"書包櫃",
  body:["每個小朋友一格，貼著名字和照片。","有一格貼著一張貼紙：「媽媽出差，阿嬤來接」。"]},
 {id:"basket",pos:SP("lockers",-1.7,3.2),h:1.6,zone:"3F・置物區",title:"手機籃",
  body:["上課前手機放進來，下課才能拿。","籃子邊貼著每個人的名字。九年級的格子最常空著。"]},
 {id:"countdown",pos:SP("c9back",0,-.2),h:2.2,zone:"3F・九年級教室",title:"會考倒數",
  body:["後面黑板上寫著「會考倒數 210 天」。","下面有人用很小的字寫：「段考倒數 6 天」。"]}
];
/* 撿到的東西（第 2 階段填內容） */
const ITEMS=[];
/* 小遊戲 */
const MINIS={};

const LINES={},LINES2={};
/* 上下課鐘：時間一到就換時段，不管劇情走到哪 */
const SCHEDULE=[["18:00","class"],["19:25","break"],["19:35","class"],["21:00","leave"]];
/* 跨線記憶：在任何一條線知道的事，其他線也記得 */
let knowSet=new Set();try{knowSet=new Set(JSON.parse(localStorage.getItem("ten-pm:know")||"[]"));}catch(e){}
const K={has:k=>knowSet.has(k)};
const ECHO="你在另一個位子上聽過";
const SIDES={};
