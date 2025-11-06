// cosmic-post-station_v923.js | v9.2.3
(() => {
  const sky = document.getElementById('cosmic-sky');
  const meteors = document.getElementById('meteor-sky');
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  function resizeCanvas(c){
    c.width = innerWidth * DPR; c.height = innerHeight * DPR;
    c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
    const ctx = c.getContext('2d'); ctx.setTransform(DPR,0,0,DPR,0,0); return ctx;
  }

  // Starfield
  let stars = [], sctx = resizeCanvas(sky);
  function genStars(){
    const count = Math.floor(innerWidth * innerHeight / 12000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random()*1.2 + .2,
      a: Math.random()*0.5 + 0.3
    }));
  }
  function drawStars(t){
    sctx.clearRect(0,0,innerWidth, innerHeight);
    stars.forEach(st => {
      const tw = (Math.sin(t*0.002 + st.x*0.01)+1)/2;
      sctx.fillStyle = `rgba(200,220,255,${(st.a*0.6 + tw*0.4).toFixed(3)})`;
      sctx.beginPath(); sctx.arc(st.x, st.y, st.r + tw*0.8, 0, Math.PI*2); sctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  // Meteors
  let mctx = resizeCanvas(meteors);
  let shooting = [];
  function spawnMeteor(){
    const y = Math.random()*innerHeight*0.6 + 20;
    const x = Math.random()*innerWidth*0.6 + innerWidth*0.2;
    const len = Math.random()*200 + 160;
    const speed = Math.random()*2 + 2.4;
    shooting.push({x, y, len, life:1, speed});
    setTimeout(spawnMeteor, Math.random()*4000 + 8000);
  }
  function drawMeteors(){
    mctx.clearRect(0,0,innerWidth, innerHeight);
    shooting = shooting.filter(m => m.life > 0.02);
    shooting.forEach(m => {
      m.x -= m.speed; m.y += m.speed*0.4; m.life *= 0.985;
      const grad = mctx.createLinearGradient(m.x, m.y, m.x+m.len, m.y-m.len*0.4);
      grad.addColorStop(0, `rgba(220,235,255,${m.life})`);
      grad.addColorStop(1, `rgba(120,170,255,0)`);
      mctx.strokeStyle = grad; mctx.lineWidth = 2;
      mctx.beginPath(); mctx.moveTo(m.x, m.y); mctx.lineTo(m.x+m.len, m.y-m.len*0.4); mctx.stroke();
      mctx.fillStyle = `rgba(255,255,255,${m.life})`;
      mctx.beginPath(); mctx.arc(m.x, m.y, 2.6, 0, Math.PI*2); mctx.fill();
    });
    requestAnimationFrame(drawMeteors);
  }

  // Posters gentle float
  const posters = Array.from(document.querySelectorAll('.poster'));
  function floatPosters(t){
    posters.forEach((el, i) => {
      const dy = Math.sin(t*0.001 + i)*3;
      el.style.transform = `translateY(${dy}px)`;
    });
    requestAnimationFrame(floatPosters);
  }

  // Local echo for UI demo
  const input = document.getElementById('ask');
  input?.addEventListener('keydown', e => {
    if(e.key === 'Enter' && input.value.trim()){
      const msg = input.value.trim();
      input.value = '';
      ['ajin','migou','gungan'].forEach((bird, idx) => {
        const card = document.querySelector(`.chat-card[data-bird="${bird}"] .dots`);
        if(card){
          card.textContent = '…';
          setTimeout(()=>{ card.textContent = ['（阿金）收到：','（米果）知道了：','（滾滾）我在：'][idx] + msg; }, 400 + idx*180);
        }
      });
    }
  });

  // Init
  function onResize(){
    sctx = resizeCanvas(sky); mctx = resizeCanvas(meteors);
    genStars();
  }
  window.addEventListener('resize', onResize);
  onResize(); requestAnimationFrame(drawStars); requestAnimationFrame(drawMeteors); spawnMeteor();
  requestAnimationFrame(floatPosters);
})();