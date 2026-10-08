import sys,os
ARTIFACT='--artifact' in sys.argv
sys.argv=[a for a in sys.argv if a!='--artifact']
src=lambda f:open('src/'+f,encoding='utf8').read()
order=['common.js','world.js','life.js','atmos.js','minis.js','events.js','ach.js','line_teacher.js']+[f for f in sorted(os.listdir('src')) if f.startswith('line_') and f!='line_teacher.js']+[f for f in ['items.js','sides.js'] if os.path.exists('src/'+f)]+['engine.js','boot.js']
three=sys.argv[1] if len(sys.argv)>1 else 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
head='' if ARTIFACT else '''<!doctype html>
<html lang="zh-Hant">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#101826">
'''
out=head+f'''<title>晚上十點下課 3D</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@400;700&family=Noto+Sans+TC:wght@400;500;700;900&family=JetBrains+Mono:wght@500;700&display=swap">
<style>
{src('style.css')}</style>
{src('shell.html')}
<script src="{three}"></script>
<script>
(function(){{
'''+"\n".join(src(f) for f in order)+("\nwindow.__dbg={get marks(){return Object.keys(itemMarks)},resumeGame,saveGame,runMini,get G(){return G},get path(){return path},get guiding(){return guiding},get keys(){return keys},findPathFrom,get mode(){return mode},findPath,blockedAt,ITEMS,SIDES,INFO,targetOf,activeSides,go:(x,z)=>{path=findPath(x,z);return !!path},pos:()=>[player.position.x,player.position.z],near:()=>near};" if len(sys.argv)>1 else "")+'''
})();
</script>
'''
open(sys.argv[2] if len(sys.argv)>2 else 'index.html','w',encoding='utf8').write(out)
print(order)
