
// ===== Shared utilities: starfield + meteors + typewriter + API fetch =====

export function mountStarfield(canvasId="starfield", opts={}){
  const canvas = document.getElementById(canvasId) || (function(){
    const c = document.createElement('canvas');
    c.id = canvasId; c.className = 'starfield'; document.body.appendChild(c);
    return c;
  })();
  const ctx = canvas.getContext('2d');
  let W=0,H=0, stars=[], meteors=[];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize); resize();

  const density = opts.density || 140; // modest, not too crowded
  for(let i=0;i<density;i++){
    stars.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*1.2 + 0.2,
      a: Math.random(),
      s: Math.random()*0.006 + 0.002
    });
  }

  function spawnMeteor(){
    const side = Math.random()<0.5 ? 'left':'right';
    const x = side==='left' ? -40 : W+40;
    const y = Math.random()*H*0.7;
    const vx = side==='left' ? (1.8+Math.random()*2.2) : -(1.8+Math.random()*2.2);
    const vy = (Math.random()*1.4 + 0.4);
    const pause = Math.random()<0.28; // sometimes pause brighter
    meteors.push({x,y,vx,vy,life: 0, pause });
  }

  // spawn at irregular cadence 3–7s
  setInterval(spawnMeteor, 3000 + Math.random()*4000);
  // a bit of randomness
  setTimeout(spawnMeteor, 1200);

  function tick(){
    ctx.clearRect(0,0,W,H);
    // stars gentle twinkle
    for(const s of stars){
      s.a += s.s;
      const o = 0.35 + Math.sin(s.a)*0.25;
      ctx.fillStyle = `rgba(235,245,255,${o})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    // meteors
    for(const m of meteors){
      m.life += 1;
      if(m.pause && m.life<18){
        // hold bright
      }else{
        m.x += m.vx; m.y += m.vy;
      }
      ctx.strokeStyle = 'rgba(200,230,255,0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(m.x,m.y);
      ctx.lineTo(m.x - m.vx*10, m.y - m.vy*10);
      ctx.stroke();
    }
    // gc
    meteors = meteors.filter(m => m.x>-200 && m.x<W+200 && m.y<H+200);
    requestAnimationFrame(tick);
  }
  tick();
}

export async function callAPI(payload){
  // Try /api/chat first (Edge), fallback to /api/chat.js
  try{
    const r = await fetch('/api/chat',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });
    if(r.ok) return await r.json();
  }catch(e){}
  const r2 = await fetch('/api/chat.js',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r2.ok) throw new Error('API error');
  return await r2.json();
}

export function typeInto(el, text, speed=18){
  return new Promise(res=>{
    let i=0;
    const t = setInterval(()=>{
      el.textContent += text[i++] || '';
      if(i>=text.length){ clearInterval(t); res(); }
    }, speed);
  });
}
