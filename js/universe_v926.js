
(()=> {
  const cvs = document.getElementById('starfield');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W,H,stars=[],meteors=[];
  const STAR_N = 260; // denser
  const METEOR_INTERVAL = 3600;
  function resize(){W=innerWidth;H=innerHeight;cvs.width=W;cvs.height=H;}
  addEventListener('resize',resize); resize();
  function spawnStar(){return {x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.1+.2,a:Math.random()*Math.PI*2,s:.006+Math.random()*.009};}
  for(let i=0;i<STAR_N;i++) stars.push(spawnStar());
  function spawnMeteor(){
    const x=Math.random()*W*0.7+W*0.15,y=-40;
    const vx=-2.2-Math.random()*1.2,vy=2+Math.random()*1.8;
    return {x,y,vx,vy,len:120+Math.random()*80,life:0,max:120};
  }
  setInterval(()=>meteors.push(spawnMeteor()),METEOR_INTERVAL);
  function draw(){
    ctx.clearRect(0,0,W,H);
    stars.forEach(s=>{s.a+=s.s;const tw=(Math.sin(s.a)*.5+.5)*.7+.3;
      ctx.fillStyle=`rgba(220,235,255,${tw})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();
    });
    meteors=meteors.filter(m=>m.life<m.max);
    meteors.forEach(m=>{m.x+=m.vx;m.y+=m.vy;m.life++;
      const g=ctx.createLinearGradient(m.x,m.y,m.x-m.len,m.y-m.len);
      g.addColorStop(0,'rgba(200,220,255,.9)');g.addColorStop(1,'rgba(200,220,255,0)');
      ctx.strokeStyle=g;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(m.x,m.y);ctx.lineTo(m.x-m.len,m.y-m.len);ctx.stroke();
      ctx.beginPath();ctx.arc(m.x,m.y,1.2,0,Math.PI*2);ctx.fillStyle='rgba(230,240,255,.95)';ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
