/* extend shared stars canvas — 不改任何 HTML；掛在 <body> 下 */
(function(){
  const body = document.body;
  if(document.getElementById('extend-stars')) return;
  const c = document.createElement('canvas');
  c.id = 'extend-stars';
  c.className = 'astro-star';
  const ctx = c.getContext('2d');
  document.body.appendChild(c);

  let W,H,dpr=window.devicePixelRatio||1;
  function resize(){
    W = c.width  = Math.floor(innerWidth * dpr);
    H = c.height = Math.floor(innerHeight * dpr);
    c.style.width = innerWidth+'px';
    c.style.height= innerHeight+'px';
  }
  resize(); addEventListener('resize', resize);

  // 星點參數
  const stars = [];
  const COUNT = Math.min(180, Math.floor(innerWidth*innerHeight/9000));
  function rnd(a,b){ return a + Math.random()*(b-a); }
  const mode = (body.dataset.universe||'').toLowerCase();
  const tone = mode==='ajin' ? [180,220,255] : mode==='migou' ? [240,230,255] : [170,210,255];

  for(let i=0;i<COUNT;i++){
    stars.push({
      x:rnd(0,W), y:rnd(0,H),
      r:rnd(.4,1.6)*dpr,
      a:rnd(.3,.9),
      tw:rnd(1.5,3.5)
    });
  }

  let mete = {x:-100,y:-100,vx:0,vy:0,t:0};
  function spawnMeteor(){
    mete.x = -50*dpr; mete.y = rnd(H*0.2,H*0.7);
    mete.vx = rnd(6,9)*dpr; mete.vy = rnd(-2,-1)*dpr; mete.t = 120;
  }
  // 每 3~6 秒有一顆流星
  setInterval(()=>{ if(Math.random()<.5) spawnMeteor(); }, 3000);

  function draw(){
    ctx.clearRect(0,0,W,H);
    // 星點
    for(const s of stars){
      s.a += 0.03;
      const alpha = 0.35 + Math.sin(s.a)/3;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${tone[0]},${tone[1]},${tone[2]},${alpha})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    // 流星
    if(mete.t>0){
      ctx.beginPath();
      const grad = ctx.createLinearGradient(mete.x,mete.y, mete.x-120*dpr, mete.y+40*dpr);
      grad.addColorStop(0, `rgba(${tone[0]},${tone[1]},${tone[2]},.95)`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2*dpr;
      ctx.moveTo(mete.x, mete.y);
      ctx.lineTo(mete.x-120*dpr, mete.y+40*dpr);
      ctx.stroke();
      mete.x += mete.vx; mete.y += mete.vy; mete.t--;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
