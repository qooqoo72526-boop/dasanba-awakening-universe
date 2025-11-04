
// Splash auto hide after 3.5s is via CSS animation
// Carousel (auto-rotate every 5s)
const imgs = ['trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp','trio6.webp'];
let ix=0;
function rot(){
  const el = document.getElementById('carousel-img');
  if(!el) return;
  ix = (ix+1)%imgs.length;
  el.src = 'assets/'+imgs[ix];
}
setInterval(rot, 5000);

// Language toggle icon only (🌍). You can implement real i18n later.
document.getElementById('lang').addEventListener('click', ()=>{
  alert('Language switch coming soon. 現在以中文為主，英文輔助。');
});

// Auto music if provided
const bg = document.getElementById('bgm');
if(bg){
  const tryPlay = ()=> bg.play().catch(()=>{});
  window.addEventListener('pointerdown', tryPlay, {once:true});
}
