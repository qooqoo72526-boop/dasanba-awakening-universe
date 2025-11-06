(()=>{
  const cvs = document.getElementById('stars'); if(!cvs) return;
  const ctx = cvs.getContext('2d'); const DPR = Math.min(devicePixelRatio||1,2);
  let W,H,stars=[],meteors=[];
  function resize(){
    W = cvs.width = innerWidth*DPR; H = cvs.height = innerHeight*DPR;
    cvs.style.width = innerWidth+'px'; cvs.style.height = innerHeight+'px';
    const n = Math.floor((innerWidth+innerHeight)/9000);
    stars = Array.from({length:n},()=>({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*1.2+0.2)*DPR, a:Math.random()*0.6+0.2 }));
    meteors = [];
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      ctx.globalAlpha = s.a*(.25 + .55*Math.sin((s.a+=0.006)+1)/2);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    if(Math.random()<.008){ meteors.push({x:Math.random()*W, y:-20*DPR, vx:-6*DPR, vy:3*DPR, life:1}); }
    meteors = meteors.filter(m=>m.life>0);
    for(const m of meteors){
      m.x+=m.vx; m.y+=m.vy; m.life-=0.01;
      const grd = ctx.createLinearGradient(m.x,m.y, m.x-120,m.y-60);
      grd.addColorStop(0,'rgba(255,255,255,.95)'); grd.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle = grd; ctx.lineWidth = 2*DPR; ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-120,m.y-60); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize); resize(); draw();

  const sfx = document.getElementById('sfx-bubble');
  document.querySelectorAll('.card-vert').forEach(card=>{
    card.addEventListener('click', ()=>{
      try{ sfx && (sfx.currentTime=0, sfx.play()); }catch(e){}
      const href = card.getAttribute('data-href'); if(href) location.href = href;
    });
  });

  const scroller = document.querySelector('.scroller[data-autoplay="true"]');
  if(scroller){
    let idx=0; const imgs = [...scroller.querySelectorAll('img')];
    imgs.forEach((im,i)=>{ if(i>0) im.style.display='none'; });
    setInterval(()=>{
      imgs[idx].style.display='none';
      idx = (idx+1)%imgs.length;
      imgs[idx].style.display='block';
    }, 3500);
  }
})();