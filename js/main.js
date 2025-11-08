
(function(){
  const page = document.body.getAttribute('data-page') || 'index';

  function starCanvas(id, count=120, twinkle= true){
    const c = document.getElementById(id);
    if(!c) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = c.getContext('2d');
    function resize(){ c.width = innerWidth * dpr; c.height = innerHeight * dpr; }
    resize(); addEventListener('resize', resize);

    const stars = Array.from({length:count}, ()=> ({
      x: Math.random()*c.width,
      y: Math.random()*c.height,
      r: Math.random()*1.4 + 0.2,
      a: Math.random()*0.5 + 0.4,
      v: (Math.random()*0.012 + 0.005) * (Math.random()<0.5?-1:1)
    }));

    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      for(const s of stars){
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3);
        g.addColorStop(0, `rgba(210,225,255,${s.a})`);
        g.addColorStop(1, `rgba(160,190,255,0)`);
        ctx.fillStyle = g; ctx.fill();
        if(twinkle){ s.a += s.v; if(s.a>1 || s.a<0.25) s.v*=-1; }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  if(page==='index'){ starCanvas('stars1', 140, true); starCanvas('stars2', 70, true); }
  if(page==='cps'){   starCanvas('stars1', 180, true); starCanvas('stars2', 110, true); }
  if(page==='soulmirror'){ starCanvas('stars1', 90, true); }

  if(page==='index'){
    const c = document.getElementById('meteors');
    if(c){
      const dpr = window.devicePixelRatio || 1;
      const ctx = c.getContext('2d');
      function resize(){ c.width = innerWidth*dpr; c.height = innerHeight*dpr; }
      resize(); addEventListener('resize', resize);
      let queue=[];
      function spawn(){
        const delay = (3000 + Math.random()*4000);
        setTimeout(()=>{
          const fromTop = Math.random()<0.5;
          const x = fromTop? Math.random()*c.width : (Math.random()<0.5? 0 : c.width);
          const y = fromTop? 0 : Math.random()*c.height*0.6;
          const vx = (Math.random()*2+1) * (Math.random()<0.5?1:-1);
          const vy = (Math.random()*1.5+0.8);
          const life = 1200 + Math.random()*900;
          queue.push({x,y,vx,vy,t:0,life});
          spawn();
        }, delay);
      }
      spawn();
      function draw(){
        ctx.clearRect(0,0,c.width,c.height);
        for(const m of queue){
          m.t += 16; m.x += m.vx*6; m.y += m.vy*6;
          const alpha = Math.max(0, 1 - m.t/m.life);
          const len = 80;
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx*len, m.y - m.vy*len);
          g.addColorStop(0, `rgba(200,220,255,${0.9*alpha})`);
          g.addColorStop(1, `rgba(200,220,255,0)`);
          ctx.strokeStyle = g; ctx.lineWidth = 2*dpr; ctx.beginPath();
          ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx*len, m.y - m.vy*len); ctx.stroke();
        }
        queue = queue.filter(m=> m.t < m.life);
        requestAnimationFrame(draw);
      }
      draw();
    }
  }

  // Gallery
  (function(){
    const slides = Array.from(document.querySelectorAll('.gallery .slide'));
    if(!slides.length) return;
    let idx = 0;
    setInterval(()=>{
      slides[idx].classList.remove('active');
      idx = (idx+1)%slides.length;
      slides[idx].classList.add('active');
    }, 3000);
  })();
})();
