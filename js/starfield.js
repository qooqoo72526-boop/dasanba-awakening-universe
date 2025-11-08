
(function(){
  const canvas = document.getElementById('starfield'); if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,stars=[], tick=0;
  const page = document.body.getAttribute('data-page') || 'home';
  const CFG = {
    home:  { density: 0.0018, flicker: 0.035, mMin: 3, mMax: 7, dir: 'diag' },
    post:  { density: 0.0015, flicker: 0.040, mMin: 3, mMax: 7, dir: 'left' },
    mirror:{ density: 0.0016, flicker: 0.030, mMin: 4, mMax: 8, dir: 'right' }
  }[page];

  function resize(){
    const dpr = Math.min(2, window.devicePixelRatio||1);
    w = canvas.width = Math.floor(innerWidth*dpr);
    h = canvas.height = Math.floor(innerHeight*dpr);
    canvas.style.width = innerWidth+'px';
    canvas.style.height = innerHeight+'px';
    stars = [];
    const count = Math.floor(w*h*CFG.density/(dpr*2));
    for(let i=0;i<count;i++){
      stars.push({x:Math.random()*w, y:Math.random()*h, r:Math.random()*1.6+.2, a:Math.random()*0.8+0.2, t:Math.random()*Math.PI*2});
    }
  }
  function drawStars(){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      s.t += CFG.flicker;
      const a = s.a*(0.6+0.4*Math.sin(s.t));
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(255,255,255,${a})`; ctx.fill();
    }
  }
  function meteor(){
    const dpr = Math.min(2, window.devicePixelRatio||1);
    let x,y,vx,vy;
    if(CFG.dir==='left'){ x=w+50; y=Math.random()*h*0.6; vx=-(2.2*dpr); vy=0.6*dpr; }
    else if(CFG.dir==='right'){ x=-50; y=Math.random()*h*0.6; vx=(2.2*dpr); vy=0.6*dpr; }
    else { x=Math.random()*w*0.8; y=-50; vx=1.6*dpr; vy=2.2*dpr; }
    const trail=[]; let life=0, maxLife=Math.random()*90+70, len=Math.random()*220+120;
    function step(){
      life++; x+=vx; y+=vy; trail.push({x,y}); if(trail.length>8) trail.shift();
      for(let i=trail.length-1;i>=0;i--){
        const p=trail[i]; const alpha=(i+1)/trail.length*0.6;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(p.x-vx*len/120, p.y-vy*len/120);
        ctx.strokeStyle=`rgba(255,255,255,${alpha})`; ctx.lineWidth=(i+1)/trail.length*2; ctx.stroke();
      }
      if(life<maxLife && x>-200 && x<w+200 && y>-200 && y<h+200){ requestAnimationFrame(step); }
      else { scheduleMeteor(); } // sometimes it stops a bit longer → natural
    }
    requestAnimationFrame(step);
  }
  function scheduleMeteor(){
    const s=(Math.random()*(CFG.mMax-CFG.mMin)+CFG.mMin)*1000;
    setTimeout(meteor, s);
  }
  function loop(){ drawStars(); requestAnimationFrame(loop); }

  window.addEventListener('resize', resize);
  resize(); scheduleMeteor(); loop();
})();
