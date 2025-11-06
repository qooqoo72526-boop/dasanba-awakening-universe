// ===== Universe starfield restore (full viewport, no shift) =====
(function(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], meteors = [];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  const STAR_COUNT = Math.min(220, Math.floor(w*h/8000));
  for(let i=0;i<STAR_COUNT;i++){
    stars.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.2 + 0.3,
      a: Math.random()*0.6 + 0.3,
      s: Math.random()*0.012 + 0.004
    });
  }

  function spawnMeteor(){
    // a bit more frequent than "occasional", roughly every 2.5–4.5s
    const y = Math.random()*h*0.7+10;
    meteors.push({ x: -100, y, vx: 8+Math.random()*5, life: 0, max: 140 });
  }

  let lastMeteor = 0;
  function tick(t){
    ctx.clearRect(0,0,w,h);
    // stars twinkle
    for(const s of stars){
      s.a += s.s * (Math.random()>0.5?1:-1);
      if(s.a<0.2) s.a=0.2;
      if(s.a>1)   s.a=1;
      ctx.globalAlpha = s.a;
      ctx.fillStyle = "#CFE3FF";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // meteors
    if(t - lastMeteor > 2500 + Math.random()*2000){ spawnMeteor(); lastMeteor = t; }
    for(let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vx*0.35; m.life++;
      const grad = ctx.createLinearGradient(m.x-80,m.y-28,m.x,m.y);
      grad.addColorStop(0,"rgba(210,235,255,.0)");
      grad.addColorStop(1,"rgba(255,255,255,.9)");
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x-80, m.y-28); ctx.lineTo(m.x, m.y); ctx.stroke();
      if(m.life>m.max || m.x> w+120 || m.y> h+120) meteors.splice(i,1);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
