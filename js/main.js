// Starflow Gallery: 3s auto, single active
(function(){
  const box = document.querySelector('.gallery-viewport');
  if(!box) return;
  const imgs = Array.from(box.querySelectorAll('img'));
  let i = 0;
  imgs.forEach((im, idx)=> im.classList.toggle('active', idx===0));
  setInterval(()=>{
    imgs[i].classList.remove('active');
    i = (i+1)%imgs.length;
    imgs[i].classList.add('active');
  }, 3000);
})();

// Meteors: random 3-7s from random edge, occasional pause flash
(function(){
  const layer = document.getElementById('meteor-layer');
  if(!layer) return;
  function launch(){
    const m = document.createElement('div');
    m.className = 'meteor';
    const side = Math.random();
    let x, y, dx, dy;
    if(side < .33){ x = -120; y = Math.random()*window.innerHeight*0.6; dx = window.innerWidth+240; dy = Math.random()*window.innerHeight*0.4; }
    else if(side < .66){ x = Math.random()*window.innerWidth*0.6; y = -40; dx = Math.random()*window.innerWidth*0.4; dy = window.innerHeight+120; }
    else { x = window.innerWidth+120; y = Math.random()*window.innerHeight*0.6; dx = -window.innerWidth-240; dy = Math.random()*window.innerHeight*0.4; }
    m.style.left = x+'px'; m.style.top = y+'px'; m.style.opacity = '1';
    layer.appendChild(m);
    const t = 1200 + Math.random()*800;
    m.animate([{transform:`translate(0,0)`},{transform:`translate(${dx}px,${dy}px)`}], {duration:t, easing:'ease-out'}).onfinish = ()=>{
      m.remove();
    };
    // occasional pause flash
    if(Math.random()<0.25){
      m.style.boxShadow = '0 0 12px rgba(255,255,255,.9)';
      setTimeout(()=>{ m.style.boxShadow=''; }, 200);
    }
    setTimeout(launch, 3000 + Math.random()*4000);
  }
  setTimeout(launch, 1000);
})();