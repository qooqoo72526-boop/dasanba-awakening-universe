
// v9.2.5_extend — homepage: splash, twinkle stars, gallery snap, meteors
(function(){
  const body = document.body;

  // ensure cosmic class
  body.classList.add('cosmic');

  // splash
  const splash = document.querySelector('.splash');
  if(splash){
    setTimeout(()=>{ splash.style.display = 'none'; }, 3600);
  }

  // twinkles
  const stars = document.getElementById('stars');
  if(stars){
    const n = 80;
    for(let i=0;i<n;i++){
      const s = document.createElement('div');
      s.className = 'twinkle';
      s.style.left = (Math.random()*100)+'vw';
      s.style.top = (Math.random()*100)+'vh';
      s.style.animationDelay = (Math.random()*3)+'s';
      stars.appendChild(s);
    }
  }

  // meteors occasionally
  const meteors = document.getElementById('meteors');
  if(meteors){
    setInterval(()=>{
      const m = document.createElement('div');
      m.className = 'meteor';
      m.style.left = (-10 + Math.random()*20) + 'vw';
      m.style.top = (-10 + Math.random()*20) + 'vh';
      meteors.appendChild(m);
      setTimeout(()=>m.remove(), 1800);
      const audio = document.getElementById('sfx-meteor');
      if(audio) { audio.currentTime=0; audio.play().catch(()=>{}); }
    }, 5200);
  }

  // gallery — snap per 3.5s, full frame
  const scroller = document.querySelector('.scroller');
  if(scroller){
    let i=0;
    const imgs = scroller.querySelectorAll('img');
    function go(){
      i = (i+1)%imgs.length;
      scroller.scrollTo({ left: scroller.clientWidth*i, behavior: 'smooth' });
    }
    setInterval(go, 3500);
    // ensure each image fits exactly 100%
    window.addEventListener('resize',()=> scroller.scrollTo({left:scroller.clientWidth*i}));
  }
})();
