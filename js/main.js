
(() => {
  const cvs = document.getElementById('stars'); if(!cvs) return;
  const ctx = cvs.getContext('2d'); const DPR = Math.min(devicePixelRatio||1, 2);
  let W,H,stars=[],meteors=[];
  function resize(){
    W = cvs.width = innerWidth*DPR; H = cvs.height = innerHeight*DPR;
    cvs.style.width = innerWidth+'px'; cvs.style.height = innerHeight+'px';
    const n = Math.floor((innerWidth*innerHeight)/9000);
    stars = Array.from({length:n}, () => ({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*1.2+0.2)*DPR, a:Math.random()*0.6+0.2 }));
    meteors = [];
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      const tw = (Math.sin((s.a+=0.006))+1)/2;
      ctx.globalAlpha = 0.25 + tw*0.55; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
    }
    if(Math.random() < 0.008) meteors.push({x:Math.random()*W, y:-20*DPR, vx:-6*DPR, vy:3*DPR, life:1});
    meteors = meteors.filter(m=>m.life>0);
    for(const m of meteors){
      m.x+=m.vx; m.y+=m.vy; m.life-=0.01;
      const grd = ctx.createLinearGradient(m.x,m.y,m.x-120,m.y-60);
      grd.addColorStop(0,'rgba(255,255,255,.95)'); grd.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle = grd; ctx.lineWidth = 2*DPR; ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-120,m.y-60); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize', resize); resize(); draw();

  // gallery auto scroll
  const scroller = document.querySelector('.scroller');
  if(scroller){
    let x=0;
    scroller.innerHTML += scroller.innerHTML;
    function tick(){ x -= 0.35; scroller.style.transform = `translateX(${x}px)`;
      if(Math.abs(x) > scroller.scrollWidth/2) x = 0; requestAnimationFrame(tick); }
    tick();
  }

  const u = document.body.dataset.universe;
  if(u==='ajin'){ document.body.classList.add('fx-plasma'); }
  if(u==='migou'){ document.body.classList.add('fx-sparkle'); }
  if(u==='gungun'){ document.body.classList.add('fx-icefog'); }
})();
