(() => {
  const canvas = document.getElementById('starfield'); if(!canvas) return;
  const ctx = canvas.getContext('2d'); let W,H,stars=[],meteors=[];
  const STAR_COUNT = Math.floor((window.innerWidth*window.innerHeight)/6000);
  function resize(){ W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  function makeStar(){ return {x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.2,tw:Math.random()*Math.PI,sp:Math.random()*0.02+0.01}; }
  function makeMeteor(dir=1){ const y=Math.random()*H*0.8; return {x:dir>0?-40:W+40,y, vx:(Math.random()*3+4)*dir, vy:Math.random()*0.6-0.3}; }
  for(let i=0;i<STAR_COUNT;i++) stars.push(makeStar());
  let t=0; function tick(){ t++; ctx.clearRect(0,0,W,H);
    const g=ctx.createRadialGradient(W*0.5,H*0.1,0,W*0.5,H*0.1,Math.max(W,H)); g.addColorStop(0,'rgba(180,205,255,0.06)'); g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    for(const s of stars){ s.tw+=s.sp; const a=0.6+Math.sin(s.tw)*0.35; ctx.globalAlpha=a; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='#EAF3FF'; ctx.fill(); }
    ctx.globalAlpha=1;
    if(t%90===0) meteors.push(makeMeteor(1));
    if(t%150===0) meteors.push(makeMeteor(-1));
    for(let i=meteors.length-1;i>=0;i--){ const m=meteors[i]; m.x+=m.vx; m.y+=m.vy;
      const trail=ctx.createLinearGradient(m.x-60*m.vx,m.y-60*m.vy,m.x,m.y); trail.addColorStop(0,'rgba(255,255,255,0)'); trail.addColorStop(1,'rgba(210,230,255,0.85)');
      ctx.strokeStyle=trail; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(m.x-80*m.vx,m.y-80*m.vy); ctx.lineTo(m.x,m.y); ctx.stroke();
      if(m.x<-120||m.x>W+120) meteors.splice(i,1);
    }
    requestAnimationFrame(tick);
  } tick();
})();