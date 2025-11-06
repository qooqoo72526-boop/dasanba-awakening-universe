// main_v930.js — starfield + meteors + nav sfx, no gallery

// ensure canvases exist or create them
function ensureCanvas(cls){
  let c=document.querySelector('.'+cls);
  if(!c){ c=document.createElement('canvas'); c.className=cls; document.body.appendChild(c); }
  return c;
}

// starfield (dense small stars flicker)
(function(){
  const c=ensureCanvas('starfield');
  const x=c.getContext('2d'); let stars=[];
  function resize(){
    c.width=innerWidth; c.height=innerHeight;
    const count=Math.floor((innerWidth*innerHeight)/2200);
    stars=Array.from({length:count},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.1+0.2,a:Math.random(),s:Math.random()*0.02+0.005}));
  }
  addEventListener('resize',resize); resize();
  (function draw(){
    x.clearRect(0,0,c.width,c.height);
    for(const s of stars){
      s.a+=s.s;
      const alpha=0.4+0.6*(0.5+0.5*Math.sin(s.a));
      x.fillStyle=`rgba(200,220,255,${alpha})`;
      x.beginPath(); x.arc(s.x,s.y,s.r,0,Math.PI*2); x.fill();
    }
    requestAnimationFrame(draw);
  })();
})();

// meteors (frequent)
(function(){
  const c=ensureCanvas('meteor-canvas');
  const x=c.getContext('2d');
  function resize(){ c.width=innerWidth; c.height=innerHeight; }
  addEventListener('resize',resize); resize();
  let ms=[];
  function spawn(){
    const y=Math.random()*innerHeight*0.6, len=140+Math.random()*110, sp=6+Math.random()*5;
    ms.push({x:-50,y,len,sp});
  }
  setInterval(spawn,1600);
  (function draw(){
    x.clearRect(0,0,c.width,c.height);
    ms=ms.filter(m=>m.x<innerWidth+80);
    for(const m of ms){
      m.x+=m.sp; m.y+=m.sp*0.25;
      const g=x.createLinearGradient(m.x,m.y,m.x-m.len,m.y-m.len*0.25);
      g.addColorStop(0,'rgba(220,240,255,.95)'); g.addColorStop(1,'rgba(220,240,255,0)');
      x.strokeStyle=g; x.lineWidth=2; x.beginPath(); x.moveTo(m.x,m.y); x.lineTo(m.x-m.len,m.y-m.len*0.25); x.stroke();
    }
    requestAnimationFrame(draw);
  })();
})();

// click sfx + navigation
const clickSfx = new Audio('/sfx/click.wav');
function go(href){ try{clickSfx.currentTime=0; clickSfx.play();}catch(e){} setTimeout(()=>location.href=href,120); }
