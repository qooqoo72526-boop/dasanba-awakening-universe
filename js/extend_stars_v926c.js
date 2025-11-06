(() => {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [], meteors = [], lastT = 0;

  const DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);
    // 星星數量：密集
    const target = Math.floor((w*h)/14000);
    stars = [...Array(target)].map(() => ({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.2 + 0.4,
      tw: Math.random()*Math.PI*2,
      sp: Math.random()*0.015 + 0.005
    }));
  }
  window.addEventListener('resize', resize); resize();

  function spawnMeteor(burst=false){
    // 更頻繁流星：每 2~4 秒一顆，偶爾群聚
    const speed = Math.random()*4 + 6;
    const len = Math.random()*160 + 160;
    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -80 : w + 80;
    const startY = Math.random()*h*0.7 + h*0.05;
    const angle = fromLeft ? (Math.random()*-0.35 - 0.15) : (Math.random()*0.35 + 3.14 + 0.15);
    meteors.push({x:startX, y:startY, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, len, life: 1.0});
    if (burst && Math.random() < 0.6){
      setTimeout(() => spawnMeteor(false), 350 + Math.random()*400);
      setTimeout(() => spawnMeteor(false), 700 + Math.random()*500);
    }
  }
  // 定時器：頻率提升
  setInterval(() => spawnMeteor(Math.random()<0.4), 2200);

  function draw(t){
    const dt = (t - lastT) * 0.001; lastT = t;

    ctx.clearRect(0,0,w,h);

    // 星星閃爍
    for (const s of stars){
      s.tw += s.sp;
      const a = 0.6 + Math.sin(s.tw)*0.35;
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = '#cfe6ff';
      ctx.fill();
    }

    // 流星
    ctx.globalAlpha = 1;
    for (let i = meteors.length - 1; i >= 0; i--){
      const m = meteors[i];
      m.x += m.vx;
      m.y += m.vy;
      m.life -= dt * 0.25;

      const tx = m.x - m.vx * 12;
      const ty = m.y - m.vy * 12;

      const grad = ctx.createLinearGradient(m.x, m.y, tx, ty);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(180,210,255,0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * (m.len/20), m.y - m.vy * (m.len/20));
      ctx.stroke();

      if (m.life <= 0 || m.x < -200 || m.x > w+200 || m.y < -200 || m.y > h+200){
        meteors.splice(i,1);
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();