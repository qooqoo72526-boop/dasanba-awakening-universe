
// v9.2.2_fix main script — starfield + gallery + open room + sfx hooks
(() => {
  const cvs = document.createElement('canvas'); cvs.className = 'starfield'; document.body.appendChild(cvs);
  const ctx = cvs.getContext('2d'); const DPR = Math.max(1, Math.min(2, devicePixelRatio||1));
  let W=0,H=0,stars=[],meteors=[];
  function resize(){ W = cvs.width = innerWidth*DPR; H = cvs.height = innerHeight*DPR; cvs.style.width=innerWidth+'px'; cvs.style.height=innerHeight+'px';
    stars = Array.from({length: Math.floor((W+H)/18)}, () => ({
      x: Math.random()*W, y: Math.random()*H, r: (Math.random()*1.5+0.2)*DPR, a: Math.random()
    })); meteors = [];
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.globalCompositeOperation = 'lighter';
    for(const s of stars){ ctx.globalAlpha = s.a*0.8; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fillStyle = '#cfe8ff'; ctx.fill(); }
    if(Math.random()<0.015){ meteors.push({x:Math.random()*W, y:-20*DPR, vx: (Math.random()*3+2)*DPR, vy:(Math.random()*2+3)*DPR, life: 1}); }
    meteors = meteors.filter(m => (m.life>0));
    for(const m of meteors){
      m.x+=m.vx; m.y+=m.vy; m.life-=0.01;
      const grd = ctx.createLinearGradient(m.x,m.y,m.x-120*DPR,m.y-30*DPR);
      grd.addColorStop(0,'rgba(200,230,255,.95)'); grd.addColorStop(1,'rgba(200,230,255,0)');
      ctx.strokeStyle = grd; ctx.lineWidth = 2*DPR; ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-120*DPR,m.y-30*DPR); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize); resize(); draw();

  // open room by data-href
  document.querySelectorAll('.card[data-href]').forEach(c => c.addEventListener('click', () => {
    const click = document.getElementById('sfx-click'); if(click){ try{ click.currentTime=0; click.play(); }catch{} }
    location.href = c.dataset.href;
  }));

  // single-image gallery auto rotate
  const viewer = document.querySelector('.viewer'); if (viewer){
    const imgs = Array.from(document.querySelectorAll('.viewer img'));
    let i=0; imgs.forEach((im,k)=>im.style.opacity = k?0:1);
    function tick(){ imgs[i].style.opacity=0; i=(i+1)%imgs.length; imgs[i].style.opacity=1; setTimeout(tick, 4000); }
    if(imgs.length>1) setTimeout(tick, 4000);
  }

  // remove splash after 3.5s
  const splash = document.getElementById('splash'); if(splash){ setTimeout(()=> splash.remove(), 3500); }
})();
