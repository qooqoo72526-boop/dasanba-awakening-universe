\
// v9.1.7 extend addon —— 不改動既有 main.js，僅附加功能

// 觀星畫廊：每 3 秒滑一張；到尾端回到起點
(function galleryAutoSlide(){
  const g = document.getElementById('gallery');
  if(!g) return;
  const step = () => {
    const child = [...g.children];
    if(child.length === 0) return;
    const gap = parseFloat(getComputedStyle(g).gap || 12);
    const w = child[0].getBoundingClientRect().width + gap;
    g.scrollBy({ left: w, behavior: 'smooth' });
    if (g.scrollLeft + g.clientWidth + w >= g.scrollWidth){
      setTimeout(()=> g.scrollTo({ left: 0, behavior: 'smooth' }), 300);
    }
  };
  setInterval(step, 3000);
})();

// 隨機流星（背景）
(function shootingStars(){
  const layer = document.querySelector('.shooting-layer');
  if(!layer) return;
  function spawn(){
    const star = document.createElement('div');
    star.className = 'shooting';
    const top = Math.random() * window.innerHeight * .6;
    const startLeft = -100 - Math.random()*200;
    const endLeft = window.innerWidth + 200;
    star.style.cssText = `position:absolute;width:2px;height:2px;background:white;
      border-radius:50%;box-shadow:0 0 8px 3px rgba(255,255,255,.7);filter:drop-shadow(0 0 6px rgba(180,200,255,.85));
      top:${top}px;left:${startLeft}px`;
    layer.appendChild(star);
    const dur = 1500 + Math.random()*1200;
    const angle = 10 + Math.random()*20;
    star.animate([
      { transform:`translate(0,0) rotate(${angle}deg)`, opacity: 0.0 },
      { transform:`translate(${endLeft - startLeft}px, ${100 + Math.random()*120}px) rotate(${angle}deg)`, opacity: 1 }
    ], { duration: dur, easing: 'linear' }).onfinish = ()=> star.remove();
  }
  const loop = ()=>{ spawn(); setTimeout(loop, 2500 + Math.random()*3500); };
  loop();
})();

// 三鳥音效 loader（如有檔案即自動使用）
const SFX = {
  AJIN: new Audio('/assets/gold_click.mp3'),
  MIGOU: new Audio('/assets/rose_ping.mp3'),
  GUNGUN: new Audio('/assets/blue_ring.mp3')
};


// Cosmic Post Station：發送邏輯（群組「依序回覆」模式）
async function cpsSend(message){
  const box = document.querySelector('#cps-feed');
  if(!box || !message) return;

  // 你（我方）
  box.appendChild(chatBubble('ME', message));
  box.scrollTop = box.scrollHeight;

  // 依序回覆：AJIN -> MIGOU -> GUNGUN（群組感受）
  const personas = ['AJIN','MIGOU','GUNGUN'];
  for (const p of personas){
    // 顯示正在輸入中（小點點）
    const typing = typingBubble(p);
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;

    try{
      const res = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ persona: p, message })
      });
      const json = await res.json();
      const text = (json && (json.reply || json.text || json.message)) || '[no response]';
      typing.remove();
      box.appendChild(chatBubble(p, text));
      try{ SFX[p] && SFX[p].play().catch(()=>{}); }catch(e){}
      box.scrollTop = box.scrollHeight;
    }catch(e){
      typing.remove();
      box.appendChild(chatBubble(p, '(連線暫時無法)'));
    }

    // 兩則訊息之間加一點間隔，營造群組感
    await new Promise(r=> setTimeout(r, 450 + Math.random()*650));
  }
}

// 打字中氣泡
function typingBubble(role){
  const wrap = document.createElement('div');
  wrap.className = 'chat ' + (role==='ME'?'me':'you');
  const img = document.createElement('img');
  img.className = 'avatar';
  if(role==='AJIN'){ img.src='/assets/icon_ajin.png' }
  else if(role==='MIGOU'){ img.src='/assets/icon_migou.png' }
  else if(role==='GUNGUN'){ img.src='/assets/icon_gungun.png' }
  else { img.src='/assets/icon_you.png' }
  const b = document.createElement('div'); b.className='bubble';
  b.innerHTML = '<span class="typing-dot">•</span><span class="typing-dot">•</span><span class="typing-dot">•</span>';
  wrap.appendChild(img); wrap.appendChild(b);
  return wrap;
}


function chatBubble(role, text){
  const wrap = document.createElement('div');
  wrap.className = 'chat ' + (role==='ME'?'me':'you');
  const img = document.createElement('img');
  img.className = 'avatar';
  if(role==='ME'){ img.src='/assets/icon_you.png' }
  else if(role==='AJIN'){ img.src='/assets/icon_ajin.png' }
  else if(role==='MIGOU'){ img.src='/assets/icon_migou.png' }
  else { img.src='/assets/icon_gungun.png' }
  const b = document.createElement('div'); b.className='bubble'; b.textContent = text;
  wrap.appendChild(img); wrap.appendChild(b);
  return wrap;
}

// Soul Mirror：題庫 25 題示例（實務請替換為你的 600 題 pool 隨機抽取）
const SM_QUESTIONS = Array.from({length:25}, (_,i)=>`Q${i+1}. 問題占位：這裡放你的靈魂題目`);

function smInit(){
  const qHost = document.getElementById('sm-questions');
  if(!qHost) return;
  qHost.innerHTML = '';
  SM_QUESTIONS.forEach((q, idx)=>{
    const el = document.createElement('label');
    el.className = 'sm-q';
    el.innerHTML = `<input type="checkbox" value="${idx}" style="margin-right:8px"> ${q}`;
    qHost.appendChild(el);
  });
}

async function smSubmit(){
  const picked = [...document.querySelectorAll('.sm-q input:checked')].map(i=>i.value);
  const text = '已勾選題目索引：' + picked.join(', ');
  const res = await fetch('/api/chat', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ persona:'ANALYST', message:`靈魂照妖鏡：根據以下題目編號，請輸出 600 字的深度分析，並附上 Ajin/Migou/Gungun 各一句自然語結尾：${text}` })
  });
  const json = await res.json();
  const out = (json && (json.reply || json.text || json.message)) || '（分析生成中）';
  const box = document.getElementById('sm-result');
  if(box){ box.textContent = out; }
}

// 自動啟用（若存在）
document.addEventListener('DOMContentLoaded', ()=>{
  smInit();
});
