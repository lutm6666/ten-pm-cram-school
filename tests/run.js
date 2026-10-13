// The same complete suite runs on Windows locally and Linux in GitHub Actions.
const {spawnSync}=require('child_process'),path=require('path');
const root=path.resolve(__dirname,'..');
function run(command,args,env={}){
  console.log(`\n> ${command} ${args.join(' ')}`);
  const result=spawnSync(command,args,{cwd:root,env:{...process.env,...env},stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
run(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['build.py','stub.js','tests/test.html']);
const P2=JSON.stringify;
const suite=[
  ['timeline.js'],['consistency.js'],['navigation.js'],['continuous-clock.js'],['resume.js'],['extras.js'],
  // 第一天：五條線
  ['play2.js','care','0'],['play2.js','jh','1'],['play2.js','teacher','0'],['play2.js','yun','1'],['play2.js','boss','2'],
  // 第二天：帶著第一天的旗標
  ['play2.js','care','1',{DAY:'2',PREV:P2({noCopy:1,toldXiangma:1,ananNote:1,leftMi:1})}],
  ['play2.js','jh','0',{DAY:'2',PREV:P2({notesAll:1,paidFor:1,readNote:1,letCai:1,pinyuSleep:1,askedXiang:1,zheTalk:1,speech:1,askHelp:1,bossKnowsZhe:1})}],
  ['play2.js','teacher','1',{DAY:'2',PREV:P2({shamedZhe:1,winter4:1})}],
  ['play2.js','yun','0',{DAY:'2',PREV:P2({linAppt:1,retry:1,discount:1,paid:0,boNotice:1})}],
  ['play2.js','boss','1',{DAY:'2',PREV:P2({lied:1,bossPickup:1,photo:1,baseClass:1,bossDesk:1,yunStay:1,hongHall:1})}],
  // 同一個瀏覽器連玩三條線，解鎖「一個月後」
  ['play3.js','care+jh+yun','1']
];
for(const entry of suite){
  const args=[...entry],env=typeof args[args.length-1]==='object'?args.pop():{};
  run(process.execPath,[path.join('tests',args.shift()),...args],env);
}
console.log('\nComplete Playwright suite passed.');
