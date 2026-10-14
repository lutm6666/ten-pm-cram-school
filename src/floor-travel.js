/* Movement policy for layout.js PORTALS. Floor ids and positions stay unchanged. */
function floorTravelQuote(via,from,to,minute){
  if(!['stairs','elev'].includes(via)||![from,to].every(f=>Number.isInteger(f)&&f>=0&&f<FLOOR_N))return null;
  const n=Math.abs(to-from);
  if(!n)return {min:0,max:0,hp:0,peak:false};
  if(via==='stairs')return {min:.5*n,max:.5*n,hp:n,peak:false};
  const peak=(minute>=17*60+25&&minute<=18*60+5)||(minute>=21*60&&minute<21*60+30),wait=peak?1.5:0;
  return {min:.6+wait,max:1.4+wait,hp:0,peak};
}
