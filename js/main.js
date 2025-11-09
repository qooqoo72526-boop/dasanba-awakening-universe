// 星星生成
(function stars(){
  const field = document.getElementById('starfield');
  if(!field) return;
  const count = 160; // 適中亮度
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = (Math.random()*100)+'%';
    s.style.top = (Math.random()*100)+'%';
    s.style.animationDelay = (Math.random()*4)+'s';
    s.style.opacity = (0.25 + Math.random()*0.75).toFixed(2);
    field.appendChild(s);
  }
})();

// 自然流星（3–5 秒隨機，偶爾更亮）
(function meteors(){
  const layer = document.getElementById('meteors');
  if(!layer) return;
  function spawn(){
    const m = document.createElement('div');
    m.className = 'meteor';
    // 隨機方向：左上→右下 / 右上→左下 / 上→右下
    const dir = Math.floor(Math.random()*3);
    let sx, sy, ex, ey;
    if(dir===0){ sx='-10%'; sy='-10%'; ex='110%'; ey='110%'; }
    else if(dir===1){ sx='110%'; sy='-8%'; ex='-10%'; ey='95%'; }
    else { sx=(Math.random()*80+10)+'%'; sy='-10%'; ex=(Math.random()*80+10)+'%'; ey='110%'; }
    m.style.setProperty('--sx', sx);
    m.style.setProperty('--sy', sy);
    m.style.setProperty('--ex', ex);
    m.style.setProperty('--ey', ey);
    const dur = (Math.random()*1.8 + 2.6).toFixed(2)+'s';
    m.style.setProperty('--dur', dur);
    layer.appendChild(m);
    setTimeout(()=>layer.removeChild(m), 3500);
  }
  function loop(){
    spawn();
    const gap = Math.random()*2000 + 1800; // 1.8s–3.8s 更活躍
    setTimeout(loop, gap);
  }
  loop();
})();

// 觀星畫廊：trio.webp ~ trio10.webp（沒有 1、沒有 gelly），3 秒自動換，禁止手動
(function gallery(){
  const img = document.getElementById('gallery-image');
  if(!img) return;
  const files = ['trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp','trio6.webp','trio7.webp','trio8.webp','trio9.webp','trio10.webp'];
  let i = 0;
  setInterval(()=>{
    i = (i+1) % files.length;
    img.src = 'assets/' + files[i];
  }, 3000);
})();
