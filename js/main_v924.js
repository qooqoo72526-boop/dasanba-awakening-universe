/* v9.2.4 首頁互動：角色卡點擊、畫廊自動橫向、星點與流星 */
(function(){
  // 角色卡點擊
  document.querySelectorAll('.card-vert[data-href]').forEach(card=>{
    card.addEventListener('click', ()=>{
      const url = card.getAttribute('data-href');
      const sfx = document.getElementById('sfx-bubble');
      if(sfx){ try{ sfx.currentTime = 0; sfx.play(); }catch(e){} }
      location.href = url;
    });
  });

  // 觀星畫廊自動捲動（每 3.5s 換一張）
  const scroller = document.querySelector('.scroller');
  if(scroller){
    let idx = 0;
    const imgs = Array.from(scroller.querySelectorAll('img'));
    setInterval(()=>{
      idx = (idx + 1) % imgs.length;
      const target = imgs[idx];
      scroller.scrollTo({ left: target.offsetLeft - scroller.offsetLeft, behavior: 'smooth' });
    }, 3500);
  }

  // 星空與偶發流星（輕量版）
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  let w, h, stars=[];
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    stars = Array.from({length: Math.floor(w*h/18000)}, ()=> ({
      x: Math.random()*w,
      y: Math.random()*h,
      a: Math.random()*0.5+0.3
    }));
  }
  resize(); window.addEventListener('resize', resize);
  let meteor = null, t=0;
  function draw(){
    ctx.clearRect(0,0,w,h);
    // stars
    ctx.fillStyle = 'white';
    stars.forEach((s,i)=>{
      const pulse = 0.5 + 0.5*Math.sin((t*0.02+i)*0.6);
      ctx.globalAlpha = s.a*pulse;
      ctx.fillRect(s.x, s.y, 1, 1);
    });
    ctx.globalAlpha = 1;
    // meteor
    if(!meteor && Math.random()<0.004){
      meteor = { x: -50, y: Math.random()*h*0.6+20, vx: 6, vy: 1.8, life: 180 };
    }
    if(meteor){
      const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x-120, meteor.y-40);
      grad.addColorStop(0,'rgba(200,230,255,.9)');
      grad.addColorStop(1,'rgba(200,230,255,0)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(meteor.x, meteor.y); ctx.lineTo(meteor.x-120, meteor.y-40); ctx.stroke();
      meteor.x += meteor.vx; meteor.y += meteor.vy; meteor.life--;
      if(meteor.life<=0 || meteor.x> w+80) meteor=null;
    }
    t++;
    requestAnimationFrame(draw);
  }
  draw();
})();