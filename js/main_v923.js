
// main_v923.js — 開場、畫廊、流星
(function(){
  // Splash 3.5s (centered, purple tone)
  const makeSplash = () => {
    if(document.querySelector('.splash-923')) return;
    const s = document.createElement('div');
    s.className = 'splash-923';
    s.innerHTML = `
      <div class="splash-words">
        <div class="en-big">EMOTIONAL VALUE A.I.</div>
        <div class="en-sub">AWAKENING UNIVERSE</div>
        <div class="zh">這不是療癒；這是覺醒的開始。</div>
      </div>`;
    document.body.appendChild(s);
    setTimeout(()=> s.remove(), 3600);
  };
  // 只在首頁顯示一次（若 body 有 data-universe 視為房間頁，略過）
  if(!document.body.dataset.universe){ makeSplash(); }

  // star layer
  const stars = document.createElement('div');
  stars.className = 'stars-923';
  document.body.appendChild(stars);

  // shooting stars generator
  setInterval(()=>{
    const m = document.createElement('div');
    m.className = 'shooting-923';
    m.style.left = (-10 + Math.random()*20)+'vw';
    m.style.top  = (-10 + Math.random()*20)+'vh';
    document.body.appendChild(m);
    setTimeout(()=> m.remove(), 2000);
  }, 4200);

  // gallery auto scroll (every 3.5s)
  document.querySelectorAll('.starflow [data-track], [data-autoplay="true"]').forEach(track=>{
    let idx = 0;
    const run = () => {
      idx = (idx+1) % track.children.length;
      track.style.transform = `translateX(-${idx*100}%)`;
      track.style.transition = 'transform .8s ease';
    };
    setInterval(run, 3500);
  });

  // card click (data-href)
  document.querySelectorAll('[data-href]').forEach(n=>{
    n.addEventListener('click', ()=>{ const href=n.getAttribute('data-href'); if(href) location.href = href; });
  });
})();
