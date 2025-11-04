
// v8.9 gallery auto-scroll + minor fx
(function(){
  const g = document.querySelector('.gallery');
  if(!g) return;
  let x = 0;
  setInterval(()=>{ x += 2; g.scrollTo({ left: x, behavior:'smooth'}); if(x > g.scrollWidth) x = 0; }, 50);
})();
