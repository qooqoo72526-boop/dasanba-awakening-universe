const canvas = document.getElementById('starfield');
if (canvas) {
  const ctx = canvas.getContext('2d',{alpha:true});
  let W,H,stars=[],meteors=[];

  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    stars = Array.from({length: Math.floor(W*H/15000)}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*0.9 + 0.2, a: Math.random()*0.5 + 0.5
    }));
  }
  addEventListener('resize', resize);
  resize();

  function spawnMeteor(){
    const y = Math.random()*H*0.7;
    const len = 140 + Math.random()*160;
    const angle = (Math.random()*0.25 + 0.65) * Math.PI; // ↘
    const speed = 0.7 + Math.random()*0.8;
    meteors.push({x:-100,y,len,angle,speed});
    setTimeout(spawnMeteor, 3000 + Math.random()*2500); // 3–5.5s
  }
  setTimeout(spawnMeteor, 1200);

  function tick(t){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      const flicker = 0.5 + 0.5*Math.sin((t/900) + s.x*0.01 + s.y*0.01);
      ctx.globalAlpha = s.a * flicker;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,6.28); ctx.fill();
    }
    ctx.globalAlpha = 1;

    for(const m of meteors){
      m.x += Math.cos(m.angle)*m.speed*4;
      m.y += Math.sin(m.angle)*m.speed*4;
      const grad = ctx.createLinearGradient(m.x, m.y, m.x - Math.cos(m.angle)*m.len, m.y - Math.sin(m.angle)*m.len);
      grad.addColorStop(0,'rgba(255,255,255,.9)');
      grad.addColorStop(1,'rgba(160,200,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x,m.y);
      ctx.lineTo(m.x - Math.cos(m.angle)*m.len, m.y - Math.sin(m.angle)*m.len);
      ctx.stroke();
    }
    meteors = meteors.filter(m => m.x < W+200 && m.y < H+200);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* 卡片點擊→房間 */
document.querySelectorAll('[data-room]').forEach(el=>{
  el.addEventListener('click',()=>location.href=`./rooms/${el.dataset.room}.html`);
});
