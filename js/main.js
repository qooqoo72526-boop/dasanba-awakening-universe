(function(){
  const cvs=document.createElement('canvas'); cvs.id='twinkle'; document.body.appendChild(cvs);
  const ctx=cvs.getContext('2d'); let W,H; function rs(){W=cvs.width=innerWidth; H=cvs.height=innerHeight} addEventListener('resize',rs); rs();
  const stars=Array.from({length:140},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.2+0.3,a:Math.random()*0.6+0.25,ph:Math.random()*Math.PI*2}));
  let mets=[];
  function spawn(){ const x=Math.random()*W; const y=Math.random()<0.5?-20:Math.random()*H*0.4+20;
    const vx=(Math.random()<0.5?-1:1)*(1.2+Math.random()*1.6), vy=1.6+Math.random()*2.2, life=600+Math.random()*900; mets.push({x,y,vx,vy,life,age:0});}
  (function loopSpawn(){ setTimeout(()=>{ spawn(); loopSpawn();}, 3000+Math.random()*2500) })();
  function step(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){ s.ph+=0.02; const al=s.a*(0.55+0.45*Math.sin(s.ph)); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(200,230,255,${al})`; ctx.fill(); }
    for(const m of mets){ m.age+=16; const f=(m.age%280<70)?1.4:1.0; m.x+=m.vx*f; m.y+=m.vy*f;
      ctx.beginPath(); const g=ctx.createLinearGradient(m.x,m.y,m.x-60*m.vx,m.y-60*m.vy);
      g.addColorStop(0,"rgba(255,255,255,.95)"); g.addColorStop(1,"rgba(160,200,255,0)"); ctx.strokeStyle=g; ctx.lineWidth=2.2;
      ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-80*m.vx,m.y-80*m.vy); ctx.stroke(); if(m.age>m.life) m.dead=true; }
    mets=mets.filter(m=>!m.dead && m.x>-200 && m.x<W+200 && m.y>-200 && m.y<H+200);
    requestAnimationFrame(step);
  } requestAnimationFrame(step);
  const pics=["trio.webp","trio2.webp","trio3.webp","trio4.webp","trio5.webp","trio6.webp","trio7.webp","trio8.webp","trio9.webp","trio10.webp"];
  const gimg=document.querySelector(".gallery .frame img"); if(gimg){ let i=0; gimg.src="assets/"+pics[0]; setInterval(()=>{ i=(i+1)%pics.length; gimg.src="assets/"+pics[i];},3000); }
})();