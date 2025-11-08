// ===== Dynamic Starfield with Twinkle + Meteors (3–7s, occasional pause brighter) =====
(function(){
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(window.innerWidth * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    initStars();
  }
  window.addEventListener('resize', resize);

  const cfg = {
    starCount: window.innerWidth > 900 ? 110 : 70,
    starSize: [0.7, 1.6],
    twinkle: [2.6, 4.2],
    meteorEvery: [3000, 7000],
    meteorPauseChance: 0.25
  };

  let stars = [];
  function rand(a,b){ return a + Math.random()*(b-a); }
  function initStars(){
    stars = [];
    for(let i=0;i<cfg.starCount;i++){
      stars.push({
        x: Math.random()*w,
        y: Math.random()*h,
        r: rand(cfg.starSize[0], cfg.starSize[1]) * dpr,
        t: Math.random()*Math.PI*2,
        sp: rand(cfg.twinkle[0], cfg.twinkle[1]),
        base: rand(0.35,0.8)
      });
    }
  }

  // Meteors
  const meteors = [];
  function spawnMeteor(){
    const side = Math.random()<0.5 ? 'left' : 'right';
    const x = side==='left' ? -50*dpr : w + 50*dpr;
    const y = rand(h*0.1, h*0.6);
    const vx = side==='left' ? rand(3,5)*dpr : rand(-5,-3)*dpr;
    const vy = rand(1,2)*dpr;
    const life = rand(700, 1200);
    meteors.push({x,y,vx,vy,life,age:0,hold: Math.random()<cfg.meteorPauseChance});
  }

  let meteorTimer = 0;
  function loop(ts){
    ctx.clearRect(0,0,w,h);

    // Stars
    for(const s of stars){
      s.t += 0.016 * (2/ s.sp);
      const a = s.base + Math.sin(s.t)*0.25;
      ctx.globalAlpha = a;
      ctx.fillStyle = '#eaf2ff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Meteors
    meteorTimer -= 16;
    if(meteorTimer<=0){
      spawnMeteor();
      meteorTimer = rand(cfg.meteorEvery[0], cfg.meteorEvery[1]);
    }
    for(let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.age += 16;
      // occasional pause brighter
      if(m.hold && m.age < 260){
        // glow without move
      }else{
        m.x += m.vx;
        m.y += m.vy;
      }
      const p = 1 - (m.age / m.life);
      if(p<=0){ meteors.splice(i,1); continue; }
      const len = 120 * dpr * p;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*len*0.4, m.y - m.vy*len*0.4);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(200,220,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx*len, m.y - m.vy*len);
      ctx.stroke();
      // head glow
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath(); ctx.arc(m.x, m.y, 2.2*dpr, 0, Math.PI*2); ctx.fill();
    }

    requestAnimationFrame(loop);
  }

  resize();
  requestAnimationFrame(loop);
})();

// ===== Gallery auto-snap every 3s, pause on user scroll =====
(function(){
  const wrap = document.querySelector('.gallery');
  if(!wrap) return;
  const items = [...wrap.querySelectorAll('.item')];
  let i = 0;
  const go = () => {
    i = (i+1) % items.length;
    items[i].scrollIntoView({behavior:'smooth', inline:'center', block:'nearest'});
  };
  let timer = setInterval(go, 3000);
  let pause;
  wrap.addEventListener('scroll', ()=>{
    clearInterval(timer); clearTimeout(pause);
    pause = setTimeout(()=> timer = setInterval(go,3000), 6000);
  }, {passive:true});
})();