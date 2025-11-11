/* -------- homepage only helpers -------- */
function q(sel, root=document){ return root.querySelector(sel); }
function qa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

/* 星星：隨機放＋閃爍 */
function makeStars(layer, count = 140){
  if(!layer) return;
  const frag = document.createDocumentFragment();
  for(let i=0;i<count;i++){
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random()*100 + '%';
    s.style.top  = Math.random()*100 + '%';
    s.style.opacity = (0.35 + Math.random()*0.55).toFixed(2);
    s.classList.add(['star-twinkle','star-drift','star-pulse'][Math.floor(Math.random()*3)]);
    frag.appendChild(s);
  }
  layer.appendChild(frag);
}

/* 流星：不規則進入、偶爾彗星（加亮） */
function spawnMeteor(layer){
  if(!layer) return;
  const m = document.createElement('div');
  m.className = 'meteor';
  // 起點在右側外、落點偏左下
  const y = 10 + Math.random()*60;
  m.style.top = y + '%';
  m.style.right = '-8%';
  if(Math.random() < 0.12) m.classList.add('meteor-comet'); // 偶爾彗星加亮
  layer.appendChild(m);
  // 自動清掉
  setTimeout(()=> m.remove(), 2200);
}
function scheduleMeteors(layer){
  const next = 1600 + Math.random()*2400;
  setTimeout(()=>{
    spawnMeteor(layer);
    scheduleMeteors(layer);
  }, next);
}

/* 畫廊：只輪播 trio.webp ~ trio10.webp，每 3 秒 */
const galleryList = [
  'trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp',
  'trio6.webp','trio7.webp','trio8.webp','trio9.webp','trio10.webp'
];
function runGallery(){
  const imgs = qa('#gallery .gimg');
  if(!imgs.length) return;
  let idx = 0;
  setInterval(()=>{
    imgs.forEach(el=>el.classList.remove('active'));
    idx = (idx + 1) % galleryList.length;
    const next = q(`#gallery .gimg[src*="${galleryList[idx]}"]`);
    if(next) next.classList.add('active');
  }, 3000);
}

/* 卡片：被點擊時仙女棒式光暈（class .sparkle） */
function bindCardSparkle(){
  qa('.cards .card').forEach(card=>{
    card.addEventListener('click', ()=>{
      card.classList.remove('sparkle');
      void card.offsetWidth;               // 允許連點重播動畫
      card.classList.add('sparkle');
    });
  });
}

/* -------- init (只在首頁執行) -------- */
function initHome(){
  const isHome = document.body.dataset.page === 'home';
  if(!isHome) return;

  // 星星/流星層（index.html 裡有 <div class="starry" aria-hidden="true"></div>）
  const starLayer = q('.starry');
  makeStars(starLayer, 140);
  scheduleMeteors(starLayer);

  runGallery();
  bindCardSparkle();
}

document.addEventListener('DOMContentLoaded', initHome);
