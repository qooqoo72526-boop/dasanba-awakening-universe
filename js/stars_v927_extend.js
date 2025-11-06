
(function(){
  const c = document.getElementById('starfield'); if(!c) return;
  const ctx = c.getContext('2d'); let w,h,stars=[],meteors=[]; const STAR_CNT=240; const DPR=Math.min(2, devicePixelRatio||1);
  function resize(){ w=c.width=innerWidth*DPR; h=c.height=innerHeight*DPR; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px';
    stars=[]; for(let i=0;i<STAR_CNT;i++){ stars.push({x:Math.random()*w,y:Math.random()*h,r:(Math.random()*1.2+0.2)*DPR,a:Math.random(),s:Math.random()*0.02+0.01}); } }
  function spawnMeteor(){ const y=Math.random()*h*0.7+h*0.05; const len=Math.random()*180*DPR+120*DPR; const speed=Math.random()*8+10; const angle=-Math.PI/6;
    meteors.push({x:-100*DPR,y,len,speed,angle,life:1}); }
  function draw(){ ctx.clearRect(0,0,w,h);
    const grd=ctx.createRadialGradient(w*0.3,h*0.1,0,w*0.3,h*0.1,w*0.9); grd.addColorStop(0,'rgba(120,160,255,0.10)'); grd.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
    for(const s of stars){ s.a+=s.s; const tw=0.6+Math.sin(s.a)*0.4; ctx.beginPath(); ctx.arc(s.x,s.y,s.r*tw,0,Math.PI*2); ctx.fillStyle=`rgba(220,240,255,${0.6+0.4*tw})`; ctx.fill();
      if(Math.random()<0.003){ ctx.fillStyle='rgba(180,210,255,.7)'; ctx.fillRect(s.x-0.5*DPR,s.y-6*DPR,1*DPR,12*DPR); ctx.fillRect(s.x-6*DPR,s.y-0.5*DPR,12*DPR,1*DPR); } }
    for(const m of meteors){ m.x+=Math.cos(m.angle)*m.speed*DPR*1.6; m.y+=Math.sin(m.angle)*m.speed*DPR*1.6; m.life-=0.006;
      const grad=ctx.createLinearGradient(m.x,m.y,m.x-m.len,m.y-m.len*0.2); grad.addColorStop(0,'rgba(255,255,255,.95)'); grad.addColorStop(1,'rgba(120,180,255,0)');
      ctx.strokeStyle=grad; ctx.lineWidth=2*DPR; ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-m.len,m.y-m.len*0.2); ctx.stroke(); }
    meteors=meteors.filter(m=>m.life>0&&m.x<w+200*DPR&&m.y>-200*DPR); requestAnimationFrame(draw); }
  resize(); draw(); addEventListener('resize', resize); setInterval(spawnMeteor, 1400+Math.random()*1200);
})();