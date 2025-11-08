// v9.19r-fix2 — keep background untouched. Only interactions below.

// --- STAR SLIDER ---
const slides = Array.from(document.querySelectorAll('.slider .slide'));
let idx = 0;
function show(i){
  slides.forEach((s, k)=> s.classList.toggle('active', k===i));
}
if (slides.length){
  show(idx);
  setInterval(()=>{
    idx = (idx + 1) % slides.length;
    show(idx);
  }, 3000); // every 3s
}

// --- TWINKLE + METEORS ---
// We assume your existing starfield canvas/bg remains. Here we only add meteors layer on top
(function meteors(){
  const layer = document.createElement('div');
  layer.style.position='fixed';
  layer.style.inset='0';
  layer.style.pointerEvents='none';
  layer.style.zIndex='2';
  document.body.appendChild(layer);

  function spawnMeteor(){
    const m = document.createElement('div');
    const startSide = Math.random();
    // random direction: from left->right top, or right->left, or top->down diagonal
    let x = startSide<0.5 ? -80 : window.innerWidth+80;
    let y = Math.random()*window.innerHeight*0.45 + 20;
    if (Math.random()<0.33){ x = Math.random()*window.innerWidth*0.8; y = -40; }

    Object.assign(m.style, {
      position:'absolute',
      left: x+'px',
      top:  y+'px',
      width:'2px',
      height:'2px',
      borderRadius:'2px',
      background:'white',
      boxShadow:'0 0 10px rgba(255,255,255,.9), 0 0 24px rgba(180,220,255,.9)',
      opacity:'0.95',
      transform:'rotate(' + (startSide<0.5? -18 : 18) + 'deg)',
    });
    layer.appendChild(m);

    const dx = startSide<0.5 ? (window.innerWidth+160) : -(window.innerWidth+160);
    const dy =  startSide<0.5 ?  -window.innerHeight*0.25 :  -window.innerHeight*0.25;

    const dur = 900 + Math.random()*1200;
    m.animate([{ transform: m.style.transform, opacity: .95 }, 
               { transform: 'translate('+dx+'px,'+dy+'px) ' + m.style.transform, opacity: 0 }], 
              { duration: dur, easing: 'ease-out' }).onfinish = ()=> m.remove();
  }

  function loop(){
    // random 3~7s
    const wait = 3000 + Math.random()*4000;
    setTimeout(()=>{
      // occasionally pause a bit brighter: spawn two quick ones
      if (Math.random()<0.18){
        spawnMeteor(); setTimeout(spawnMeteor, 280);
      } else {
        spawnMeteor();
      }
      loop();
    }, wait);
  }
  loop();
})();