(()=>{
  const cvs = document.getElementById('stars'); if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let W,H,stars=[];

  function resize(){
    W = cvs.width  = innerWidth  * devicePixelRatio;
    H = cvs.height = innerHeight * devicePixelRatio;
    stars = Array.from({length: Math.min(320, Math.floor(W*H/45000))}, ()=>
      ({x:Math.random()*W, y:Math.random()*H, z:Math.random()*0.6+0.4, s:Math.random()*1.4+0.3, p:Math.random()*6.28})
    );
  }
  addEventListener('resize', resize,{passive:true}); resize();

  function draw(t){
    ctx.clearRect(0,0,W,H);
    for(const st of stars){
      const tw = (Math.sin((t*0.001 + st.p))*0.5+0.5);
      ctx.globalAlpha = 0.25 + tw*0.7;
      ctx.fillStyle = '#eaf2ff';
      ctx.beginPath(); ctx.arc(st.x, st.y, st.s*devicePixelRatio, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
