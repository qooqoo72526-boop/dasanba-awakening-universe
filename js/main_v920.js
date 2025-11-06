(() => {
  const cvs = document.getElementById('starfield');
  const ctx = cvs ? cvs.getContext('2d') : null;
  const DPR = Math.max(1, Math.min(2, devicePixelRatio || 1));
  let W=0,H=0, stars=[], meteors=[];

  function resize(){
    if(!cvs) return;
    W = cvs.width  = innerWidth * DPR;
    H = cvs.height = innerHeight * DPR;
    cvs.style.width  = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
    const n = Math.floor((innerWidth+innerHeight)/6);
    stars = Array.from({length:n}, () => ({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.5+0.3)*DPR,a:Math.random()*0.8+0.2}));
    meteors = [];
  }

  function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,W,H);

    const g1 = ctx.createRadialGradient(W*0.2,H*0.15,10, W*0.2,H*0.15, W*0.6);
    g1.addColorStop(0,'rgba(177,140,255,.12)'); g1.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);

    for(const s of stars){
      ctx.globalAlpha = s.a; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      s.a += (Math.random()-.5)*0.02; s.a = Math.max(.1, Math.min(1,s.a));
    }

    if(Math.random()<0.008) meteors.push({x:Math.random()*W,y:-20*DPR,vx:6*DPR,vy:3*DPR,life:1});
    meteors = meteors.filter(m=>m.life>0);
    for(const m of meteors){
      m.x += m.vx; m.y += m.vy; m.life -= 0.008;
      const grd = ctx.createLinearGradient(m.x,m.y,m.x-120*DPR,m.y-60);
      grd.addColorStop(0,'rgba(255,255,255,.95)'); grd.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle = grd; ctx.lineWidth = 2*DPR; ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-120*DPR,m.y-60); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize); resize(); draw();

  // gallery auto scroll
  const scroller = document.getElementById('scroller');
  if(scroller){
    let x=0; const inner = scroller.innerHTML;
    scroller.innerHTML = inner + inner;
    function tick(){ x -= 0.35; scroller.style.transform = `translateX(${x}px)`; if(Math.abs(x) > scroller.scrollWidth/2){ x = 0; } requestAnimationFrame(tick); }
    tick();
  }

  // hover sfx on cards
  const hover = document.getElementById('sfx-hover');
  document.querySelectorAll('.card[data-sound]').forEach(card=>{
    card.addEventListener('pointerenter',()=>{
      const name = card.getAttribute('data-sound');
      if(!hover) return;
      hover.src = `assets/sound/${name}`; hover.currentTime=0; hover.play().catch(()=>{});
    });
  });
})();