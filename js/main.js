
const starfield = document.getElementById('starfield');
if (starfield){
  const N = 120;
  for(let i=0;i<N;i++){
    const s=document.createElement('div');
    s.className='star';
    s.style.left=(Math.random()*100)+'%';
    s.style.top=(Math.random()*100)+'%';
    s.style.animationDelay=(Math.random()*3)+'s';
    s.style.opacity=(0.35+Math.random()*0.6).toFixed(2);
    starfield.appendChild(s);
  }
}
const meteorsLayer = document.getElementById('meteors');
if (meteorsLayer){
  function spawnMeteor(){
    const m=document.createElement('div'); m.className='meteor';
    const side = Math.random()<0.5 ? 'left' : 'right';
    const y = 5 + Math.random()*70;
    m.style.top = y + '%';
    m.style.left = side==='left' ? '-8%' : '108%';
    meteorsLayer.appendChild(m);
    const dx = side==='left' ? (110 + Math.random()*20) : -(110 + Math.random()*20);
    const dy = (Math.random()*25) - 12;
    m.animate([
      {opacity:0, transform:'translate(0,0)'},
      {opacity:1, offset:.1},
      {opacity:0, transform:`translate(${dx}vw, ${dy}vh)`}
    ], {duration: 1600 + Math.random()*900, easing:'ease-out'}).onfinish = ()=> m.remove();
  }
  setInterval(()=>{ if (Math.random()<0.75) spawnMeteor(); }, 3000 + Math.random()*2000);
}
const galleryImgs = ["trio.webp","trio2.webp","trio3.webp","trio4.webp","trio5.webp","trio6.webp","trio7.webp","trio8.webp","trio9.webp","trio10.webp"];
const gImg = document.getElementById('galleryImage');
if (gImg){
  let idx = 0;
  function nextImg(){
    idx = (idx+1)%galleryImgs.length;
    const next = `/assets/${galleryImgs[idx]}`;
    gImg.style.opacity = 0;
    setTimeout(()=>{ gImg.src = next; gImg.style.opacity = 1; }, 220);
  }
  gImg.src = `/assets/${galleryImgs[0]}`;
  setInterval(nextImg, 3000);
}
