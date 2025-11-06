(()=>{
  const cvs = document.getElementById('stars'); if(!cvs) return;
  const ctx = cvs.getContext('2d'); const DPR = Math.min(devicePixelRatio||1,2);
  let W,H,stars=[],meteors=[];
  function resize(){ W = cvs.width = innerWidth*DPR; H = cvs.height = innerHeight*DPR; cvs.style.width=innerWidth+'px'; cvs.style.height=innerHeight+'px';
    const n = Math.floor((innerWidth+innerHeight)/8); stars = Array.from({length:n},()=>({ x:Math.random()*W, y:Math.random()*H, r:(Math.random()*1.6+.2)*DPR, a:Math.random()*.8+.2 })); meteors=[]; }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      ctx.globalAlpha = s.a*(0.8+Math.sin((s.a+performance.now()/900)*.6)*.2);
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    if(Math.random()<0.01) meteors.push({x:Math.random()*W, y: -10*DPR, vx: 6*DPR, vy: 18*DPR, life:1});
    meteors = meteors.filter(m=>m.life>0);
    for(const m of meteors){
      m.x += m.vx; m.y += m.vy; m.life -= 0.01;
      const g = ctx.createLinearGradient(m.x-120,m.y-40,m.x,m.y);
      g.addColorStop(0,'rgba(255,255,255,.0)'); g.addColorStop(1,'rgba(255,255,255,.9)');
      ctx.strokeStyle=g; ctx.lineWidth=1.6*DPR; ctx.beginPath(); ctx.moveTo(m.x-120,m.y-40); ctx.lineTo(m.x,m.y); ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',resize); resize(); draw();
  setTimeout(()=>{ const s=document.getElementById('splash'); s&&(s.style.display='none'); },3500);
  document.querySelectorAll('.card[data-href]').forEach(el=>{
    el.addEventListener('click',()=>{ location.href = el.getAttribute('data-href'); });
  });
  const scroller=document.querySelector('.scroller.one-by-one');
  if(scroller){
    const imgs=[...scroller.querySelectorAll('img')];
    let i=0; const show=k=>imgs.forEach((im,idx)=>im.classList.toggle('is-active', idx===k));
    show(0); setInterval(()=>{ i=(i+1)%imgs.length; show(i); },3000);
  }
})();