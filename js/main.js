
// Starfield + meteors (3–5s irregular) + gallery crossfade
(()=>{
  const cvs = document.getElementById('starfield');
  if(!cvs) return;
  const ctx = cvs.getContext('2d',{alpha:true});
  let W=0,H=0,stars=[],meteors=[];
  const resize=()=>{ W=cvs.width=innerWidth; H=cvs.height=innerHeight; };
  addEventListener('resize', resize); resize();
  const seed=(nmul=1.4)=>{
    const n = Math.min(420, Math.floor((W*H/8000)*nmul)); // bright mode
    stars = Array.from({length:n},()=>({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2+0.2, t:Math.random()*Math.PI*2, s:Math.random()*0.8+0.4 }));
  };
  seed();
  const spawnMeteor=()=>{
    const delay = 3000 + Math.random()*2000; // 3–5s
    setTimeout(()=>{
      const y = Math.random()*H*0.85 + 10;
      meteors.push({ x: -120, y, vx: Math.random()*6+5, life: 0, max: 100 });
      spawnMeteor();
    }, delay);
  };
  spawnMeteor();
  const loop=()=>{
    ctx.clearRect(0,0,W,H);
    for(const p of stars){
      p.t += 0.02*p.s;
      const o = 0.45 + Math.sin(p.t)*0.35;
      ctx.fillStyle = `rgba(255,255,255,${0.35+o*0.5})`;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    for(const m of meteors){
      m.life++; m.x += m.vx;
      const len = 160;
      const grad = ctx.createLinearGradient(m.x-len,m.y,m.x,m.y);
      grad.addColorStop(0,'rgba(255,255,255,0)');
      grad.addColorStop(1,'rgba(210,235,255,.95)');
      ctx.strokeStyle = grad; ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.moveTo(m.x-len,m.y); ctx.lineTo(m.x,m.y); ctx.stroke();
    }
    meteors = meteors.filter(m => m.life < m.max && m.x < W+200);
    requestAnimationFrame(loop);
  };
  loop();
})();

// Gallery crossfade (trio.webp ~ trio10.webp)
(()=>{
  const g = document.querySelector('.gallery-viewport');
  if(!g) return;
  const imgs = Array.from(g.querySelectorAll('img'));
  let i=0; if(imgs[0]) imgs[0].classList.add('active');
  setInterval(()=>{
    const prev = imgs[i]; i=(i+1)%imgs.length; const next = imgs[i];
    if(prev) prev.classList.remove('active');
    if(next) next.classList.add('active');
  }, 3000);
})();
/* === v9.1.9 COSMIC EXTENSIONS (append-only) === */
(function() {
  // 啟用主頁銀藍底
  document.body.classList.add('cosmic-silverblue');

  // 星星生成（數量可再調低/高）
  const starLayer = document.querySelector('.cosmic-stars') || (function(){
    const d=document.createElement('div'); d.className='cosmic-stars'; document.body.appendChild(d); return d;
  })();
  if (starLayer.childElementCount < 120) {
    for (let i=0;i<120;i++){
      const s=document.createElement('i'); s.className='star';
      s.style.left = Math.random()*100+'%';
      s.style.top  = Math.random()*100+'%';
      s.style.animationDelay = (Math.random()*2.4)+'s';
      s.style.opacity = (0.25 + Math.random()*0.75).toFixed(2);
      starLayer.appendChild(s);
    }
  }

  // 流星
  const shootLayer = document.querySelector('.shooting-layer') || (function(){
    const d=document.createElement('div'); d.className='shooting-layer'; document.body.appendChild(d); return d;
  })();
  function spawnMeteor(){
    const m=document.createElement('div'); m.className='shooting';
    const side = Math.random()<.5 ? 'left' : 'right';
    const y = Math.random()*80+5;
    m.style.top = y+'%';
    m.style.left = side==='left'? '-140px':'calc(100% + 140px)';
    m.style.setProperty('--deg', side==='left' ? (-20-Math.random()*20)+'deg' : (200+Math.random()*20)+'deg');
    shootLayer.appendChild(m);
    // 進場
    requestAnimationFrame(()=>{ m.style.transition='transform 1.2s linear, opacity .3s ease';
      m.style.opacity=.95;
      const dx = side==='left'? (window.innerWidth+280) : -(window.innerWidth+280);
      m.style.transform = `translate3d(${dx}px, ${60-(Math.random()*120)}px, 0) rotate(${getComputedStyle(m).getPropertyValue('--deg')})`;
    });
    // 停留亮點
    setTimeout(()=>{
      m.style.transition='opacity .5s ease';
      m.style.opacity=.0;
      setTimeout(()=> m.remove(), 700);
    }, 1200 + (Math.random()<.35?400:0)); // 偶爾停一下
  }
  // 3–7 秒不規則
  (function meteorLoop(){
    spawnMeteor();
    setTimeout(meteorLoop, 3000 + Math.random()*4000);
  })();

  // 觀星畫廊：trio.webp~trio10.webp，3秒自動
  const gallery = document.querySelector('.starflow');
  if (gallery && !gallery.dataset.bound){
    gallery.dataset.bound='1';
    const imgs = ["trio.webp","trio2.webp","trio3.webp","trio4.webp","trio5.webp","trio6.webp","trio7.webp","trio8.webp","trio9.webp","trio10.webp"];
    let idx = 0;
    const imgEl = document.createElement('img');
    imgEl.alt = "Starflow Gallery";
    gallery.innerHTML='';
    gallery.appendChild(imgEl);
    function setSrc(k){ imgEl.src = `assets/${imgs[k]}`; }
    setSrc(idx);
    setInterval(()=>{ idx = (idx+1)%imgs.length; setSrc(idx); }, 3000); // 3秒
  }

  // 角色卡圖片自動校正不切頭
  document.querySelectorAll('.card-bird img').forEach(img=>{
    img.style.objectFit = 'contain';
    img.style.objectPosition = 'center';
  });

})();
