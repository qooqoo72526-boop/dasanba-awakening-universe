/* v9.2.3 — stars + meteors + home behaviors */
(function(){
  const c = document.getElementById('stars') || (function(){
    const el=document.createElement('canvas'); el.id='stars'; document.body.appendChild(el); return el;
  })();
  const ctx = c.getContext('2d'); let w,h,stars=[];
  function resize(){w=c.width=innerWidth;h=c.height=innerHeight; gen()}
  function gen(){ stars = Array.from({length:140},()=>({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.1+0.2,a:Math.random()})) }
  function draw(){
    ctx.clearRect(0,0,w,h);
    stars.forEach(s=>{
      s.a += (Math.random()-.5)*0.08;
      const al = .5 + .5*Math.sin(s.a);
      ctx.fillStyle = `rgba(200,220,255,${.25+al*.45})`;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    // meteor
    if(Math.random()<.012){
      const mx = Math.random()*w*0.8+ w*0.1, my= -20, len=120+Math.random()*80;
      let t=0; const id=setInterval(()=>{
        t+=14; ctx.strokeStyle='rgba(190,220,255,.55)';
        ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(mx+t*.4, my+t*.28);
        ctx.lineTo(mx+t*.4-len, my+t*.28-len*.35); ctx.stroke();
        if(t>260) clearInterval(id);
      },16);
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',resize); resize(); draw();
})();

// card click
document.querySelectorAll('.card-vert[data-href]')?.forEach(el=>{
  el.addEventListener('click',()=>location.href = el.getAttribute('data-href'));
});

// 3.5s gallery auto-scroll
(function(){
  const sc = document.querySelector('.scroller');
  if(!sc) return;
  let i=0;
  setInterval(()=>{
    i = (i+1) % sc.children.length;
    sc.scrollTo({left: sc.clientWidth * i, behavior:'smooth'});
  }, 3500);
})();