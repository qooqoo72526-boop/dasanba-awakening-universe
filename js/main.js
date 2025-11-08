/* ===== 銀藍星空（更亮＋更活躍），流星 3–7s 隨機 ===== */
const sky = document.getElementById('sky');
const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
const ctx = sky.getContext('2d');

function resize(){
  sky.width  = innerWidth * dpr;
  sky.height = innerHeight * dpr;
}
resize(); addEventListener('resize', resize);

const starCount = innerWidth>1024 ? 120 : 90;
const stars = Array.from({length:starCount}).map(()=>({
  x: Math.random()*sky.width,
  y: Math.random()*sky.height,
  r: (0.6 + Math.random()*1.2) * dpr,
  a: 0.4 + Math.random()*0.5,
  t: Math.random()*2*Math.PI
}));

let comets = [];
function spawnComet(){
  // 從四邊任一隨機射入
  const side = Math.floor(Math.random()*4);
  const speed = (3 + Math.random()*3) * dpr;
  let x,y,vx,vy;
  if(side===0){ x=-40; y=Math.random()*sky.height; vx=speed; vy=(Math.random()-.5)*speed; }
  if(side===1){ x=sky.width+40; y=Math.random()*sky.height; vx=-speed; vy=(Math.random()-.5)*speed; }
  if(side===2){ x=Math.random()*sky.width; y=-40; vx=(Math.random()-.5)*speed; vy=speed; }
  if(side===3){ x=Math.random()*sky.width; y=sky.height+40; vx=(Math.random()-.5)*speed; vy=-speed; }
  comets.push({x,y,vx,vy,life:0});
  setTimeout(spawnComet, 3000 + Math.random()*4000); // 3–7 秒
}
spawnComet();

function tick(t){
  ctx.clearRect(0,0,sky.width, sky.height);

  // 星星閃爍
  for(const s of stars){
    s.t += 0.02 + Math.random()*0.02;
    const alpha = s.a * (0.7 + 0.3*Math.sin(s.t));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  }

  // 流星
  comets = comets.filter(c => c.life < 220);
  for(const c of comets){
    c.x += c.vx;
    c.y += c.vy;
    c.life += 1;
    const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx*12, c.y - c.vy*12);
    grad.addColorStop(0, 'rgba(255,255,255,.95)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2*dpr;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x - c.vx*12, c.y - c.vy*12);
    ctx.stroke();
  }

  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

/* ===== 觀星畫廊：單張 3 秒自動滑，無手動滑軌 ===== */
const track = document.querySelector('.gallery .track');
if(track){
  let idx = 0;
  const imgs = [...track.children];
  function slide(){
    idx = (idx + 1) % imgs.length;
    track.style.transition = 'transform .9s ease';
    track.style.transform = `translateX(${-idx * 100}%)`;
  }
  // 建立每張寬度為 100% 的佈局
  track.style.width = `${imgs.length * 100}%`;
  imgs.forEach(el => el.style.width = `${100/imgs.length}%`);
  setInterval(slide, 3000);
}

/* ===== 卡片點擊：進房時光暈加強（小特效） ===== */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousedown', ()=>{
    const halo = card.querySelector('.halo');
    halo.animate([
      { transform:'scale(1)', opacity:.6 },
      { transform:'scale(1.25)', opacity:.85 }
    ], { duration:360, easing:'ease-out' });
  });
});
