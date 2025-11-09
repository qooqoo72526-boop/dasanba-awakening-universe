/* starfield + natural meteors + gallery + jump */
const starCanvas = document.getElementById('starfield');
const meteorCanvas = document.getElementById('meteors');
const sctx = starCanvas.getContext('2d');
const mctx = meteorCanvas.getContext('2d');

let stars=[], meteors=[];
function resize(){
  starCanvas.width = meteorCanvas.width = innerWidth;
  starCanvas.height = meteorCanvas.height = innerHeight;
  // stars
  const count = Math.floor((innerWidth*innerHeight)/9000); // 密度
  stars = Array.from({length:count}, () => ({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*1.3 + .2,
    b: Math.random()*0.5 + 0.4,       // base brightness
    t: Math.random()*Math.PI*2        // phase
  }));
}
addEventListener('resize', resize); resize();

/* draw stars (twinkle) */
function drawStars(t){
  sctx.clearRect(0,0,starCanvas.width,starCanvas.height);
  for(const st of stars){
    st.t += 0.015 + Math.random()*0.01;
    const tw = st.b + Math.sin(st.t)*0.25; // 閃爍
    sctx.fillStyle = `rgba(255,255,255,${Math.max(0,Math.min(1,tw))})`;
    sctx.beginPath(); sctx.arc(st.x, st.y, st.r, 0, Math.PI*2); sctx.fill();
  }
}

/* spawn meteors / comets (隨機角度/速度/偶爾停閃) */
function spawnMeteor(forceComet=false){
  const side = Math.random()<0.5 ? 'left':'right';
  const y = Math.random()*innerHeight*0.8;
  const speed = forceComet ? (6+Math.random()*4) : (2+Math.random()*2.5);
  const len = forceComet ? (280+Math.random()*200) : (120+Math.random()*120);
  const a = side==='left' ? (Math.random()*-0.35 -0.25) : (Math.random()*0.35 +0.25);
  meteors.push({x: side==='left'? -80: innerWidth+80, y, vx: Math.cos(a)*speed, vy: Math.sin(a)*speed, len, life: 1, comet: forceComet});
}
setInterval(()=>{          // 80% 機率生成，偶爾彗星
  if(Math.random()<0.8) spawnMeteor();
  if(Math.random()<0.07) spawnMeteor(true);
}, 1200);

/* draw meteors */
function drawMeteors(){
  mctx.clearRect(0,0,meteorCanvas.width, meteorCanvas.height);
  for(const m of meteors){
    // 偶爾閃一下停頓再走
    if(Math.random()<0.01){ m.vx*=0.6; m.vy*=0.6 }
    if(Math.random()<0.02){ m.vx*=1.25; m.vy*=1.25 }
    m.x += m.vx; m.y += m.vy; m.life -= 0.003;
    const grad = mctx.createLinearGradient(m.x, m.y, m.x - m.vx*m.len, m.y - m.vy*m.len);
    grad.addColorStop(0, `rgba(255,255,255,${m.comet?0.9:0.7})`);
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    mctx.strokeStyle = grad; mctx.lineWidth = m.comet? 2.2 : 1.4;
    mctx.beginPath(); mctx.moveTo(m.x, m.y); mctx.lineTo(m.x - m.vx*m.len, m.y - m.vy*m.len); mctx.stroke();
  }
  meteors = meteors.filter(m => m.life>0 && m.x>-200 && m.x<innerWidth+200 && m.y>-200 && m.y<innerHeight+200);
}

/* loop */
function loop(t){ drawStars(t); drawMeteors(); requestAnimationFrame(loop); }
loop();

/* gallery auto slide (3s / 無滑軌) */
const rail = document.querySelector('.gallery-rail');
if(rail){
  const imgs = Array.from(rail.querySelectorAll('img'));
  let i = 0;
  function step(){
    i = (i+1) % imgs.length;
    rail.style.transition = 'transform .8s ease';
    rail.style.transform = `translateX(${-i*100}%)`;
  }
  setInterval(step, 3000);
}

/* 🔭 按鈕平滑捲到畫廊 */
const jump = document.querySelector('[data-jump]');
if(jump){
  jump.addEventListener('click', e=>{
    e.preventDefault();
    document.getElementById('gallery')?.scrollIntoView({behavior:'smooth', block:'start'});
  });
}
