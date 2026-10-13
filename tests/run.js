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
const suite=[
  ['continuous-clock.js'],['navigation.js'],['consistency.js'],
  ['play2.js','teacher','0'],['play2.js','yun','1'],['play2.js','boss','2'],
  ['play3.js','teacher+yun+boss','1'],['resume.js'],['extras.js'],
  ['play2.js','teacher','1',{DAY:'2'}],['play2.js','yun','2',{DAY:'2'}],['play2.js','boss','0',{DAY:'2'}],
  ['play2.js','care','0'],['play2.js','care','2'],['play2.js','jh','0'],['play2.js','jh','1'],
  ['play2.js','care','1',{DAY:'2'}],['play2.js','jh','2',{DAY:'2'}]
];
for(const entry of suite){
  const args=[...entry],env=typeof args[args.length-1]==='object'?args.pop():{};
  run(process.execPath,[path.join('tests',args.shift()),...args],env);
}
console.log('\nComplete Playwright suite passed.');
