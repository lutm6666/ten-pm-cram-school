/* art_models.js 紋理 repeat 參數相容修正：
   初版材質函式呼叫保留了 canvas 寬高參數，這裡在紋理建立前把真正 repeat 值取回。 */
const FM_CANVAS_TEX_RAW=fmCanvasTex;
fmCanvasTex=function(key,w,h,draw,rx=1,ry=1,...extra){
  if(extra.length>=2){rx=extra[0];ry=extra[1];}
  return FM_CANVAS_TEX_RAW(key,w,h,draw,rx,ry);
};
