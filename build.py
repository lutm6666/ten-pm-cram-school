import sys,os
ARTIFACT='--artifact' in sys.argv
DBG='--dbg' in sys.argv
sys.argv=[a for a in sys.argv if a not in('--artifact','--dbg')]
src=lambda f:open('src/'+f,encoding='utf8').read()
order=['common.js','world.js','life.js','atmos.js','minis.js','events.js','overtime.js','chats.js','ach.js','line_teacher.js']+[f for f in sorted(os.listdir('src')) if f.startswith('line_') and f!='line_teacher.js']+['day2.js','links.js']+[f for f in ['items.js','sides.js'] if os.path.exists('src/'+f)]+['engine.js','settings.js','share.js','boot.js']
three=sys.argv[1] if len(sys.argv)>1 else 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
DBG=DBG or not three.startswith('http')
head='' if ARTIFACT else '''<!doctype html>
<html lang="zh-Hant" prefix="og: https://ogp.me/ns#">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#101826">
<meta name="description" content="補習班打工人的一個晚上。3D 網頁小遊戲：當數學老師、櫃台班導或補習班主任，從 17:20 撐到晚上十點。">
<meta property="og:type" content="website">
<meta property="og:title" content="晚上十點下課">
<meta property="og:description" content="補習班打工人的一個晚上。三個位子、同一個晚上，直接在瀏覽器玩。">
<meta property="og:url" content="https://lutm6666.github.io/ten-pm-cram-school/">
<meta property="og:site_name" content="晚上十點下課">
<meta property="og:image" content="https://lutm6666.github.io/ten-pm-cram-school/assets/og.png">
<meta property="og:image:secure_url" content="https://lutm6666.github.io/ten-pm-cram-school/assets/og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="晚上十點下課：補習班打工人的一個晚上">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="zh_TW">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="晚上十點下課">
<meta name="twitter:image" content="https://lutm6666.github.io/ten-pm-cram-school/assets/og.png">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="assets/icon-192.png">
<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="十點下課">
'''
out=head+f'''<title>晚上十點下課 3D</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
{src('style.css')}</style>
{'' if ARTIFACT else '</head><body>'}
{src('shell.html')}
<script src="{three}"></script>
<script>
(function(){{
'''+"\n".join(src(f) for f in order)+("\nwindow.__dbg={get marks(){return Object.keys(itemMarks)},resumeGame,saveGame,runMini,get G(){return G},get path(){return path},get guiding(){return guiding},get keys(){return keys},findPathFrom,get mode(){return mode},findPath,blockedAt,ITEMS,SIDES,INFO,targetOf,activeSides,chatTargets,get chatUsed(){return G&&G.chatUsed},go:(x,z)=>{path=findPath(x,z);return !!path},pos:()=>[player.position.x,player.position.z],near:()=>near,jump:id=>{G.idx=G.steps.findIndex(s=>s.id===id);G.steps.slice(0,G.idx).forEach(s=>{if(s.npc)for(const k in s.npc)setNPC(k,val(s.npc[k],G),true);if(s.after)for(const k in s.after)setNPC(k,val(s.after[k],G),true);});enterStep();},card:()=>drawResultCard().toDataURL(),CAM,tp:(x,z,ry)=>{player.position.set(x,0,z);if(ry!=null)CAM.yaw=ry;path=null;}};" if DBG else "")+'''
})();
</script>
'''
open(sys.argv[2] if len(sys.argv)>2 else 'index.html','w',encoding='utf8').write(out)
print(order)
