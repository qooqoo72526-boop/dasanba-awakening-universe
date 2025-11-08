
// Starfield + meteors (3–5s irregular) + gallery crossfade
(()=>{
  const cvs = document.getElementById('starfield');
  if(!cvs) return;
  const ctx = cvs.getContext('2d',{alpha:true});
  let W=0,H=0,stars=[],meteors=[];
  const resize=()=>{ W=cvs.width=innerWidth; H=cvs.height=innerHeight; };
  addEventListener('resize', resize); resize();
  const seed=(nmul=1.4)=>{
    const n = Math.min(420, Math.floor((W*H/8000)*nmul)); // bright mode
    stars = Array.from({length:n},()=>({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2+0.2, t:Math.random()*Math.PI*2, s:Math.random()*0.8+0.4 }));
  };
  seed();
  const spawnMeteor=()=>{
    const delay = 3000 + Math.random()*2000; // 3–5s
    setTimeout(()=>{
      const y = Math.random()*H*0.85 + 10;
      meteors.push({ x: -120, y, vx: Math.random()*6+5, life: 0, max: 100 });
      spawnMeteor();
    }, delay);
  };
  spawnMeteor();
  const loop=()=>{
    ctx.clearRect(0,0,W,H);
    for(const p of stars){
      p.t += 0.02*p.s;
      const o = 0.45 + Math.sin(p.t)*0.35;
      ctx.fillStyle = `rgba(255,255,255,${0.35+o*0.5})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    for(const m of meteors){
      m.life++; m.x += m.vx;
      const len = 160;
      const grad = ctx.createLinearGradient(m.x-len,m.y,m.x,m.y);
      grad.addColorStop(0,'rgba(255,255,255,0)');
      grad.addColorStop(1,'rgba(210,235,255,.95)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.moveTo(m.x-len,m.y); ctx.lineTo(m.x,m.y); ctx.stroke();
    }
    meteors = meteors.filter(m => m.life < m.max && m.x < W+200);
    requestAnimationFrame(loop);
  };
  loop();
})();

// Gallery crossfade (trio.webp ~ trio10.webp)
(()=>{
  const g = document.querySelector('.gallery-viewport');
  if(!g) return;
  const imgs = Array.from(g.querySelectorAll('img'));
  let i=0; if(imgs[0]) imgs[0].classList.add('active');
  setInterval(()=>{
    const prev = imgs[i]; i=(i+1)%imgs.length; const next = imgs[i];
    if(prev) prev.classList.remove('active');
    if(next) next.classList.add('active');
  }, 3000);
})();
