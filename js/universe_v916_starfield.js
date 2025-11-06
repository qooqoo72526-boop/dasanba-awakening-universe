
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
let W,H,stars=[],meteors=[];

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  stars = Array.from({length: Math.floor(W*H/8000)}, ()=> ({
    x: Math.random()*W,
    y: Math.random()*H,
    r: Math.random()*1.1 + .2,
    o: Math.random(),
    s: Math.random()*.015 + .005
  }));
}
resize();
addEventListener('resize', resize);

function spawnMeteor(){
  const y = Math.random()*H*0.7 + 20;
  meteors.push({
    x: -80, y, vx: Math.random()*8+10, vy: -(Math.random()*2+1),
    life: 1, len: Math.random()*140+120
  });
}
setInterval(spawnMeteor, 1600);

function step(){
  ctx.clearRect(0,0,W,H);
  for(const s of stars){
    s.o += (Math.random()-.5)*s.s;
    if(s.o<.2) s.o=.2; if(s.o>.95) s.o=.95;
    ctx.globalAlpha = s.o;
    ctx.fillStyle = '#eaf2ff';
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for(let i=meteors.length-1;i>=0;i--){
    const m = meteors[i];
    m.x += m.vx; m.y += m.vy; m.life -= .01;
    const grad = ctx.createLinearGradient(m.x, m.y, m.x-m.len, m.y+m.len*.25);
    grad.addColorStop(0,'rgba(240,250,255,.95)');
    grad.addColorStop(1,'rgba(160,200,255,0)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x-m.len, m.y+m.len*.25); ctx.stroke();
    if(m.x>W+200 || m.life<=0) meteors.splice(i,1);
  }
  requestAnimationFrame(step);
}
step();
