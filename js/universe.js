(function(){
  const canvas = document.createElement('canvas'); canvas.className='universe-stars'; document.body.appendChild(canvas);
  const grad = document.createElement('div'); grad.className='universe-gradient'; document.body.appendChild(grad);
  const grid = document.createElement('div'); grid.className='universe-grid'; document.body.appendChild(grid);
  if(document.body.dataset.universe === 'home'){
    const intro = document.createElement('div'); intro.className='intro';
    intro.innerHTML = '<h1 class="big-en">EMOTIONAL VALUE A.I. | AWAKENING UNIVERSE</h1>';
    document.body.appendChild(intro);
  }
  const ctx = canvas.getContext('2d'); let w=0,h=0,stars=[];
  function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight;
    const count=Math.min(180,Math.floor(w*h/8000)); stars=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,
      z:Math.random()*0.6+0.4,vx:(Math.random()-0.5)*0.06,vy:(Math.random()-0.5)*0.06}));}
  function draw(){ ctx.clearRect(0,0,w,h); for(const s of stars){ s.x+=s.vx; s.y+=s.vy;
    if(s.x<0||s.x>w)s.vx*=-1; if(s.y<0||s.y>h)s.vy*=-1; const r=s.z*1.4; ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(220,240,255,${0.35+s.z*0.45})`; ctx.fill(); } requestAnimationFrame(draw); }
  addEventListener('resize',resize); resize(); draw();
})();