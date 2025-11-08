// stars + meteors
const stars = document.getElementById('stars');
const meteors = document.getElementById('meteors');
function resizeCanvas(c){ c.width = window.innerWidth; c.height = window.innerHeight; }
[stars, meteors].forEach(resizeCanvas);
const sctx = stars.getContext('2d');
const mctx = meteors.getContext('2d');

let starField = [];
function initStars(){
  starField = [];
  const count = Math.min(220, Math.floor(window.innerWidth/6));
  for(let i=0;i<count;i++){
    starField.push({ x: Math.random()*stars.width, y: Math.random()*stars.height, r: Math.random()*1.3+0.3, p: Math.random()*Math.PI*2, s: Math.random()*0.8+0.2 });
  }
}
function drawStars(t){
  sctx.clearRect(0,0,stars.width,stars.height);
  starField.forEach(st=>{
    const flicker = 0.6 + 0.4*Math.sin(st.p + t*st.s*0.001);
    sctx.fillStyle = `rgba(240,248,255,${flicker})`;
    sctx.beginPath(); sctx.arc(st.x, st.y, st.r, 0, Math.PI*2); sctx.fill();
  });
}
let meteor=null, lastMeteor=0;
function spawnMeteor(){
  const now = performance.now();
  if(now - lastMeteor < 2500) return;
  lastMeteor = now;
  const dir = Math.random()<0.5 ? -1 : 1;
  meteor = { x: dir<0 ? meteors.width+80 : -80, y: Math.random()*meteors.height*0.5 + 20, vx: (2.2 + Math.random()*1.5)*dir, vy: 0.8 + Math.random()*1.2 };
}
function drawMeteor(){
  mctx.clearRect(0,0,meteors.width,meteors.height);
  if(!meteor) return;
  meteor.x += meteor.vx; meteor.y += meteor.vy;
  const trail = 120;
  const g = mctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx*trail, meteor.y - meteor.vy*trail);
  g.addColorStop(0, 'rgba(200,230,255,1)'); g.addColorStop(1, 'rgba(200,230,255,0)');
  mctx.strokeStyle = g; mctx.lineWidth = 2;
  mctx.beginPath(); mctx.moveTo(meteor.x - meteor.vx*trail, meteor.y - meteor.vy*trail); mctx.lineTo(meteor.x, meteor.y); mctx.stroke();
  if(meteor.x < -200 || meteor.x > meteors.width+200 || meteor.y > meteors.height+200){ meteor=null; }
}
function tick(t){ drawStars(t); drawMeteor(); if(Math.random()<0.01) spawnMeteor(); requestAnimationFrame(tick); }
initStars(); requestAnimationFrame(tick);
window.addEventListener('resize', ()=>{ [stars, meteors].forEach(resizeCanvas); initStars(); });

// gallery auto slide
const track = document.querySelector('.gallery-track');
if(track){
  const imgs = [...track.querySelectorAll('img')];
  let idx = 0;
  function layout(){ track.style.transform = `translateX(${(-idx)*100}%)`; track.style.width = `${imgs.length*100}%`; imgs.forEach(img => img.style.width = `${100/imgs.length}%`); }
  layout();
  setInterval(()=>{ idx = (idx + 1) % imgs.length; layout(); }, 3000);
}
