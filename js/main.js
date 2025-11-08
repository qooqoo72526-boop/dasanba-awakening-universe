/* 宇宙參數（首頁） */
const P = {stars:120, size:[0.8,1.8], twinkle:[2.4,4.2], meteors:[3000,7000]};

/* Canvas */
const starC = document.getElementById('stars');
const metC  = document.getElementById('meteors');
const sctx = starC.getContext('2d');
const mctx = metC.getContext('2d');
function fit(){ starC.width = metC.width = innerWidth; starC.height = metC.height = innerHeight }
addEventListener('resize', fit); fit();

/* 星星閃爍 */
const stars = [];
for(let i=0;i<P.stars;i++){
  stars.push({
    x: Math.random()*starC.width,
    y: Math.random()*starC.height,
    r: P.size[0] + Math.random()*(P.size[1]-P.size[0]),
    a: Math.random()*1,
    sp: (P.twinkle[0]+Math.random()*(P.twinkle[1]-P.twinkle[0])) * (Math.random()<.5?1:-1)
  });
}
function drawStars(){
  sctx.clearRect(0,0,starC.width,starC.height);
  for(const s of stars){
    s.a += 0.015/s.sp;
    const alpha = 0.6 + 0.4*Math.sin(s.a);
    sctx.fillStyle = `rgba(234,242,255,${alpha})`;
    sctx.beginPath(); sctx.arc(s.x, s.y, s.r, 0, Math.PI*2); sctx.fill();
  }
  requestAnimationFrame(drawStars);
}
requestAnimationFrame(drawStars);

/* 流星（3–7 秒不規則；偶爾更亮一點） */
function shootMeteor(){
  const len = Math.random()*180+160;
  const fromLeft = Math.random()>.5;
  const x0 = fromLeft ? -80 : starC.width+80;
  const y0 = Math.random()*starC.height*0.6 + 40;
  const dx = (fromLeft?1:-1) * (Math.random()*2+2);
  const dy = (Math.random()*1.2+0.6) * (Math.random()>.5?1:0.6);
  let life = 0;
  const trail = [];
  const id = setInterval(()=>{
    life += 1;
    const x = x0 + dx*life*3;
    const y = y0 + dy*life*3;
    trail.push([x,y]);
    if(trail.length>len/6) trail.shift();
    mctx.clearRect(0,0,metC.width,metC.height);
    for(let i=0;i<trail.length;i++){
      const k = i/trail.length;
      const glow = (i>trail.length*0.8)? 1 : k;
      mctx.strokeStyle = `rgba(235,245,255, ${glow})`;
      mctx.lineWidth = 1.1 + 2.4*k;
      mctx.beginPath();
      mctx.moveTo(trail[i][0], trail[i][1]);
      mctx.lineTo(trail[i][0]-dx*10, trail[i][1]-dy*10);
      mctx.stroke();
    }
    if(trail.length>len || x<-200 || x>metC.width+200 || y>metC.height+100){
      clearInterval(id);
    }
  }, 16);
  const next = P.meteors[0] + Math.random()*(P.meteors[1]-P.meteors[0]);
  setTimeout(shootMeteor, next);
}
setTimeout(shootMeteor, 1200);

/* 觀星畫廊：每 3 秒淡入切換，無手動控制 */
const slides = Array.from(document.querySelectorAll('.gallery-frame .slide'));
let idx=0;
function show(i){ slides.forEach((s,si)=> s.classList.toggle('active', si===i)); }
if(slides.length){
  show(0);
  setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 3000);
}
