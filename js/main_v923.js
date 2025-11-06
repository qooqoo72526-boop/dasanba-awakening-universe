// v9.2.3 — splash + stars + gallery + shooting stars
(function(){
  // Splash (3.5s)
  const SPLASH_MS = 3500;
  const has = sessionStorage.getItem('dsb_splash_v923_done');
  if(!has){
    const s = document.createElement('div');
    s.className = 'splash-923';
    s.innerHTML = '<div class="wrap">'
      + '<div class="l1">EMOTIONAL VALUE A.I.</div>'
      + '<div class="l2">Awakening Universe</div>'
      + '<div class="l3">覺醒不是修復，而是重生。</div>'
      + '</div>';
    document.body.appendChild(s);
    setTimeout(()=>{
      s.style.transition = 'opacity .6s ease';
      s.style.opacity = '0';
      setTimeout(()=>s.remove(), 800);
      sessionStorage.setItem('dsb_splash_v923_done','1');
    }, SPLASH_MS);
  }

  // Canvas stars + shooting stars
  const canvas = document.getElementById('stars') || (function(){
    const c = document.createElement('canvas'); c.id='stars'; document.body.appendChild(c); return c;
  })();
  const ctx = canvas.getContext('2d');
  let W,H,stars=[],shooting=[];
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  for(let i=0;i<120;i++){
    stars.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+0.3,a:Math.random()*1});
  }
  function spawnShoot(){
    if(shooting.length>3) return;
    const y = Math.random()*H*0.6 + 20;
    shooting.push({x:-80,y, vx:6+Math.random()*4, vy:1.5+Math.random()*1.5, life:0});
  }
  setInterval(()=>Math.random()<0.5 && spawnShoot(), 2500);

  function tick(){
    ctx.clearRect(0,0,W,H);
    // tiny stars
    for(const s of stars){
      s.a += (Math.random()*0.08 - 0.04);
      if(s.a<0.2) s.a=0.2; if(s.a>1) s.a=1;
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    // shooting
    ctx.strokeStyle='rgba(210,230,255,.85)';
    ctx.lineWidth=2;
    shooting = shooting.filter(sh=> sh.x < W+120 && sh.y < H+80);
    for(const sh of shooting){
      sh.x += sh.vx; sh.y += sh.vy; sh.life++;
      ctx.beginPath(); ctx.moveTo(sh.x-60, sh.y-20);
      ctx.lineTo(sh.x, sh.y);
      ctx.stroke();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // gallery auto scroll (3.5s)
  const sc = document.querySelector('.scroller[data-autoplay]');
  if(sc){
    let dir=1;
    setInterval(()=>{
      const max = sc.scrollWidth - sc.clientWidth;
      if(sc.scrollLeft>=max-2) dir=-1;
      else if(sc.scrollLeft<=2) dir=1;
      sc.scrollBy({left: dir* (sc.clientWidth*0.8), behavior:'smooth'});
    }, 3500);
  }

  // card click shortcut (data-href)
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('[data-href]');
    if(a){ location.href = a.getAttribute('data-href'); }
  });
})();