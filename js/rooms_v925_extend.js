
// v9.2.5_extend — subtle per-room effects
(function(){
  document.body.classList.add('cosmic');
  const u = document.body.getAttribute('data-universe')||'';

  // common twinkles
  const stars = document.getElementById('stars');
  if(stars){
    const n = 60;
    for(let i=0;i<n;i++){
      const s = document.createElement('div');
      s.className = 'twinkle';
      s.style.left = (Math.random()*100)+'vw';
      s.style.top = (Math.random()*100)+'vh';
      s.style.animationDelay = (Math.random()*3)+'s';
      stars.appendChild(s);
    }
  }

  // themed overlay
  const meteors = document.getElementById('meteors');
  setInterval(()=>{
    const m = document.createElement('div');
    m.className = 'meteor';
    m.style.left = (-10 + Math.random()*20) + 'vw';
    m.style.top = (-10 + Math.random()*20) + 'vh';
    meteors.appendChild(m);
    setTimeout(()=>m.remove(), 1800);
  }, 6500);

  // micro specials
  if(u==='ajin'){
    // lightning-like glints on panel
    const panel = document.querySelector('.room-panel');
    if(panel){
      setInterval(()=>{
        panel.style.boxShadow = '0 0 0 1px rgba(255,211,107,.35) inset, 0 0 40px rgba(255,211,107,.25)';
        setTimeout(()=> panel.style.boxShadow='', 220);
      }, 3800);
    }
  }else if(u==='migou'){
    // floating crystals shimmer
    const panel = document.querySelector('.room-panel');
    if(panel){
      let i=0;
      setInterval(()=>{
        panel.style.filter = i%2 ? 'drop-shadow(0 8px 24px rgba(255,150,180,.35))' : 'none';
        i++;
      }, 1600);
    }
  }else if(u==='gungun'){
    // gentle ripple glow
    const video = document.querySelector('.room-video');
    if(video){
      setInterval(()=>{
        video.style.boxShadow = '0 0 0 1px rgba(139,198,255,.32) inset, 0 0 50px rgba(139,198,255,.35)';
        setTimeout(()=> video.style.boxShadow='', 520);
      }, 4200);
    }
  }
})();
