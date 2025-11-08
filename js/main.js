
const starC=document.createElement('canvas');starC.id='starfield';
const metC=document.createElement('canvas');metC.id='meteors';
document.body.append(starC,metC);
const sctx=starC.getContext('2d'), mctx=metC.getContext('2d');
function fit(){starC.width=metC.width=innerWidth; starC.height=metC.height=innerHeight}
addEventListener('resize',fit); fit();
// stars
let stars=[];
function initStars(){
  stars=[];
  const count=Math.floor((innerWidth*innerHeight)/18000);
  for(let i=0;i<count;i++){
    stars.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+0.2,t:Math.random()*6.28,s:Math.random()*1.5+0.5});
  }
} initStars();
function drawStars(){
  sctx.clearRect(0,0,starC.width, starC.height);
  for(const st of stars){
    st.t+=0.005*st.s; const tw=0.4+0.6*(0.5+0.5*Math.sin(st.t));
    sctx.fillStyle=`rgba(230,238,255,${0.2+0.8*tw})`;
    sctx.beginPath(); sctx.arc(st.x,st.y,st.r,0,6.28); sctx.fill();
  }
  requestAnimationFrame(drawStars);
} requestAnimationFrame(drawStars);
// meteors
let meteors=[], lastMeteor=0;
function spawnMeteor(){
  const side=Math.random()<0.5?'left':'right';
  const x=side==='left'?-60:innerWidth+60;
  const y=Math.random()*innerHeight*0.6+20;
  const vx=side==='left'?(2+Math.random()*3):-(2+Math.random()*3);
  const vy=1+Math.random()*2;
  meteors.push({x,y,vx,vy,life:0});
}
function drawMeteors(ts){
  mctx.clearRect(0,0,metC.width,metC.height);
  if(ts-lastMeteor>2500+Math.random()*2000){ if(Math.random()<0.9) spawnMeteor(); lastMeteor=ts; }
  meteors.forEach(mt=>{ mt.x+=mt.vx; mt.y+=mt.vy; mt.life+=1;
    mctx.strokeStyle=`rgba(200,220,255,${1-mt.life/120})`; mctx.lineWidth=2;
    mctx.beginPath(); mctx.moveTo(mt.x,mt.y); mctx.lineTo(mt.x-mt.vx*10, mt.y-mt.vy*10); mctx.stroke();
  });
  meteors=meteors.filter(mt=>mt.life<120);
  requestAnimationFrame(drawMeteors);
} requestAnimationFrame(drawMeteors);

// gallery
(function(){
  const wrap=document.querySelector('.gallery'); if(!wrap) return;
  const imgs=[]; const add=(src)=>{const im=new Image();im.src=src;im.loading='lazy';wrap.appendChild(im);imgs.push(im);};
  const names=["trio.webp","trio2.webp","trio3.webp","trio4.webp","trio5.webp","trio6.webp","trio7.webp","trio8.webp","trio9.webp","trio10.webp"];
  names.forEach(n=>add(`/assets/${n}`));
  let idx=0; function show(i){ imgs.forEach((im,j)=>im.classList.toggle('active',i===j)); }
  setTimeout(()=>{ if(imgs.length){ show(0); setInterval(()=>{idx=(idx+1)%imgs.length; show(idx);},3000);} }, 200);
})();
// card clicks
document.querySelectorAll('[data-link]').forEach(el=>el.addEventListener('click',()=>{location.href=el.getAttribute('data-link')}));
