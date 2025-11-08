
(function(){
  const starCanvas = document.getElementById('starfield');
  const meteorCanvas = document.getElementById('meteors');
  if(!starCanvas || !meteorCanvas) return;
  const sctx = starCanvas.getContext('2d');
  const mctx = meteorCanvas.getContext('2d');

  function fitCanvas(c){
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = innerWidth, h = innerHeight;
    c.width = Math.floor(w*dpr); c.height = Math.floor(h*dpr);
    c.style.width = w+'px'; c.style.height = h+'px';
    c.getContext('2d').setTransform(dpr,0,0,dpr,0,0);
  }

  let stars = [];
  function makeStars(){
    stars = [];
    const count = Math.floor((innerWidth*innerHeight)/14000)+80;
    for(let i=0;i<count;i++){
      stars.push({ x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.2+.3, a:Math.random()*.6+.3, tw:Math.random()*2.5+1.2 });
    }
  }
  function drawStars(t){
    sctx.clearRect(0,0,starCanvas.width,starCanvas.height);
    for(const s of stars){
      const pulse = (Math.sin(t/1000*s.tw + s.x*.01)+1)/2;
      const alpha = s.a*.7 + pulse*.3;
      sctx.fillStyle = `rgba(235,244,255,${alpha})`;
      sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI*2); sctx.fill();
    }
  }

  let meteors = [];
  function spawnMeteor(){
    const edges = ['top','left','right'];
    const edge = edges[Math.floor(Math.random()*edges.length)];
    let x,y,vx,vy;
    const speed = Math.random()*2+2.0;
    const ang = (Math.random()*.6+.2) * (Math.random()<.5?1:-1);
    if(edge==='top'){ x=Math.random()*innerWidth; y=-20; vx=Math.sin(ang)*speed; vy=speed; }
    else if(edge==='left'){ x=-20; y=Math.random()*innerHeight*.7; vx=speed; vy=Math.sin(ang)*speed; }
    else { x=innerWidth+20; y=Math.random()*innerHeight*.7; vx=-speed; vy=Math.sin(-ang)*speed; }
    meteors.push({x,y,vx,vy,life:0,maxLife:Math.random()*900+700, paused:Math.random()<.25, pauseT:Math.random()*420+260});
  }
  function drawMeteors(dt){
    mctx.clearRect(0,0,meteorCanvas.width,meteorCanvas.height);
    for(const m of meteors){
      if(m.paused && m.life < m.pauseT){
        mctx.strokeStyle='rgba(210,230,255,.85)'; mctx.lineWidth=1.2;
        mctx.beginPath(); mctx.moveTo(m.x-6,m.y-6); mctx.lineTo(m.x+6,m.y+6); mctx.stroke();
        m.life+=dt; continue;
      }
      m.x+=m.vx; m.y+=m.vy; m.life+=dt;
      mctx.strokeStyle='rgba(210,230,255,.85)'; mctx.lineWidth=1.2;
      mctx.beginPath(); mctx.moveTo(m.x, m.y); mctx.lineTo(m.x-m.vx*10, m.y-m.vy*10); mctx.stroke();
    }
    meteors = meteors.filter(m=> m.life<m.maxLife && m.x>-50 && m.x<innerWidth+50 && m.y>-50 && m.y<innerHeight+50);
  }

  function loop(t){ drawStars(t); drawMeteors(16); requestAnimationFrame(loop); }
  function schedule(){ setTimeout(()=>{ spawnMeteor(); schedule(); }, Math.random()*2000+1000); }
  function onResize(){ fitCanvas(starCanvas); fitCanvas(meteorCanvas); makeStars(); }
  onResize(); addEventListener('resize', onResize); schedule(); requestAnimationFrame(loop);
})();

/* 觀星畫廊 */
(function(){
  const slides = Array.from(document.querySelectorAll('.gallery-slide'));
  if(!slides.length) return;
  let i=0; function show(n){ slides.forEach((el,idx)=> el.classList.toggle('show', idx===n)); }
  show(0); setInterval(()=>{ i=(i+1)%slides.length; show(i); }, 3000);
})();
