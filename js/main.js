
// Auto start BGM after first interaction
const bgm = document.getElementById('bgm');
if(bgm){
  const kick = ()=>{ bgm.play().catch(()=>{}); window.removeEventListener('click', kick); };
  window.addEventListener('click', kick);
}
// Auto-scroll gallery slowly in loop
const gal = document.getElementById('gallery');
if(gal){
  let dir = 1;
  setInterval(()=>{
    gal.scrollBy({left: 2*dir, behavior:'smooth'});
    if(gal.scrollLeft + gal.clientWidth >= gal.scrollWidth){ dir = -1; }
    if(gal.scrollLeft <= 0){ dir = 1; }
  }, 50);
}
