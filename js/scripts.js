
function go(href){ location.href = href; }
function playAmbient(){
  const a = document.getElementById('ambient');
  if(!a) return;
  // autoplay policy: start muted, unmute on first click
  a.muted = true;
  a.play().catch(()=>{});
  window.addEventListener('click', ()=>{ a.muted=false; }, {once:true});
}
document.addEventListener('DOMContentLoaded', playAmbient);
