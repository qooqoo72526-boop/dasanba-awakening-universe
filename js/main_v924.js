// v9.2.4 main (splash removal, stars + meteor, snap gallery)
(function(){
  const splash = document.querySelector('.splash');
  if(splash){
    setTimeout(()=>{
      splash.classList.add('hide');
      setTimeout(()=> splash.remove(), 700);
    }, 3500);
  }
  const canvas = document.getElementById('stars');
  if(canvas){
    const ctx = canvas.getContext('2d');
    const W = canvas.width = innerWidth;
    const H = canvas.height = innerHeight;
    const stars = Array.from({length:220}, () => ({x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.15+0.2, p: Math.random()*Math.PI*2}));
    function draw(){
      ctx.clearRect(0,0,W,H);
      stars.forEach(s=>{ s.p += 0.02; const a = 0.5 + 0.5*Math.sin(s.p);
        ctx.fillStyle = `rgba(255,255,255,${0.25 + a*0.6})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); });
      requestAnimationFrame(draw);
    } draw();
  }
  const shooting = document.getElementById('shooting');
  if(shooting){
    const ctx = shooting.getContext('2d');
    function meteor(){
      shooting.width = innerWidth; shooting.height = innerHeight;
      const y = Math.random()*innerHeight*.6 + 40; const len = 220; let x = -80;
      function step(){
        ctx.clearRect(0,0,shooting.width,shooting.height);
        const grad = ctx.createLinearGradient(x,y,x+len,y);
        grad.addColorStop(0,'rgba(255,255,255,0)'); grad.addColorStop(1,'rgba(190,220,255,.95)');
        ctx.strokeStyle = grad; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+len,y); ctx.stroke();
        x += 12; if(x < shooting.width+100) requestAnimationFrame(step);
      } step(); setTimeout(meteor, 3200 + Math.random()*3200);
    } meteor();
  }
  const scroller = document.querySelector('.scroller');
  if(scroller){
    let idx = 0; const tiles = scroller.querySelectorAll('img').length;
    setInterval(()=>{ idx = (idx+1)%tiles; scroller.scrollTo({left: idx*(520+16), behavior:'smooth'}); }, 3600);
  }
  document.querySelectorAll('[data-href]').forEach(el=> el.addEventListener('click', ()=> location.href = el.getAttribute('data-href')));
})();