// === Cosmic Post Station（升級版）：星空粒子 + 發光字 + 打字音效 + 三鳥輪流插話 ===
(() => {
  // 0) 啟動/音樂
  const bgm = document.getElementById('bgm');
  const once = () => { try{ bgm.volume = 0.35; bgm.play(); }catch{} window.removeEventListener('pointerdown', once); };
  window.addEventListener('pointerdown', once);

  // 1) 粒子星空（GPU 友善的簡易版）
  const cvs = document.getElementById('stars');
  const ctx = cvs.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W=0, H=0, stars=[];
  function resize(){
    W = cvs.width = innerWidth*DPR;
    H = cvs.height = innerHeight*DPR;
    cvs.style.width = innerWidth+'px';
    cvs.style.height = innerHeight+'px';
    // 依螢幕大小調整星數
    const N = Math.floor((innerWidth*innerHeight)/8000);
    stars = new Array(N).fill().map(()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.6 + .4,
      a: Math.random()*1,
      v: Math.random()*0.35 + 0.15
    }));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      s.a += s.v*0.01;
      const tw = (Math.sin(s.a)+1)/2; // 0~1
      ctx.globalAlpha = 0.35 + tw*0.65;
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r*DPR, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw();
  addEventListener('resize', resize);

  // 2) 打字音效（WebAudio，不用音檔）
  const AC = window.AudioContext || window.webkitAudioContext;
  const audio = new AC();
  function keyClick(){
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.connect(g); g.connect(audio.destination);
    o.frequency.value = 380 + Math.random()*60;
    g.gain.setValueAtTime(0.0001, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, audio.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.07);
    o.start(); o.stop(audio.currentTime + 0.08);
  }

  // 3) 介面元素
  const input = document.getElementById('cps-input');
  const stream = document.getElementById('chat');
  const aj = document.getElementById('aj');
  const mi = document.getElementById('mi');
  const gu = document.getElementById('gu');

  // 4) 三鳥 persona 設定（仍呼叫 /api/chat.js）
  const personas = [
    { id:'aj', tag:'aj', name:'阿金 AJIN', tone:'rebellion',
      sys: '你是阿金：行動派、先做再說，語氣直、敢嗆但熱血；每句不超過35字，口頭禪包含「快一點啦」、「怕什麼？」' },
    { id:'mi', tag:'mi', name:'米果 MIGOU', tone:'worth',
      sys: '你是米果：自我價值與主權女王，溫柔但不妥協；每句不超過35字，語氣自信、邊界清晰。' },
    { id:'gu', tag:'gu', name:'滾滾 GUNGUN', tone:'safety',
      sys: '你是滾滾：安靜的傾聽者，給穩定的陪伴與洞察；每句不超過35字，語速慢、語氣穩。' }
  ];

  // 工具：插入訊息
  function pushMsg(html, klass='me'){
    const d = document.createElement('div');
    d.className = `msg ${klass}`;
    d.innerHTML = html;
    stream.appendChild(d);
    stream.scrollTo({top: stream.scrollHeight, behavior:'smooth'});
  }

  // 5) 送出訊息（Enter）
  input.addEventListener('keydown', async e=>{
    if(e.key !== 'Enter') return;
    const q = input.value.trim(); if(!q) return;
    input.value='';
    pushMsg(q, 'me');

    const use = personas.filter(p => (p.id==='aj'&&aj.checked)||(p.id==='mi'&&mi.checked)||(p.id==='gu'&&gu.checked));
    if(use.length===0) return;

    // 輪流插話
    for(const p of use){
      try{
        const res = await fetch('/api/chat.js', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body: JSON.stringify({
            messages:[
              {role:'system', content:p.sys},
              {role:'user', content:q}
            ]
          })
        });
        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim() || '…';
        pushMsg(`<div class="from">${p.name}</div><div>${text}</div>`, `ai ${p.tag}`);
      }catch{
        pushMsg(`<div class="from">${p.name}</div><div>（訊號微弱，稍後再試）</div>`, `ai ${p.tag}`);
      }
      await new Promise(r=>setTimeout(r, 180)); // 彼此錯開一點
    }
  });

  // 6) 輸入時做打字音效＆小發光
  input.addEventListener('input', ()=>{ keyClick(); });
})();
// 星空粒子
(() => {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  const DPR = Math.max(1, devicePixelRatio || 1);
  function size(){ c.width = innerWidth * DPR; c.height = innerHeight * DPR; }
  size(); addEventListener('resize', size);
  const N = 150; const stars = Array.from({length:N}, _ => ({
    x: Math.random()*c.width, y: Math.random()*c.height, r: Math.random()*1.6 + .4, s: Math.random()*0.4 + 0.05
  }));
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle = 'white';
    for(const st of stars){
      st.y += st.s; if(st.y > c.height) st.y = -10;
      ctx.globalAlpha = 0.45 + 0.55*Math.sin((st.x+st.y)/120);
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r*DPR, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// 音樂切換（第一次互動後播放）
(() => {
  const bgm = document.getElementById('bgm');
  const btn = document.getElementById('audioToggle');
  let armed = false;
  function arm(){
    if(armed) return; armed = true;
    const play = () => { bgm.volume = 0.35; bgm.play().catch(()=>{}); removeEventListener('pointerdown', play); removeEventListener('keydown', play); };
    addEventListener('pointerdown', play); addEventListener('keydown', play);
  }
  arm();
  btn.addEventListener('click', () => {
    if(bgm.paused){ bgm.play(); btn.classList.remove('muted'); }
    else{ bgm.pause(); btn.classList.add('muted'); }
  });
})();

// 簡易對話串接（保留你現有 /api/chat.js，regions 已在 server 設定）
(() => {
  const chat = document.getElementById('chat');
  const input = document.getElementById('userInput');
  const btn = document.getElementById('sendBtn');

  function bubble(text, cls='assistant'){
    const div = document.createElement('div');
    div.className = `bubble ${cls}`;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  async function send(){
    const msg = input.value.trim();
    if(!msg) return;
    input.value = '';
    bubble(msg, 'user');
    bubble('…與宇宙同步中', 'system');

    try{
      const res = await fetch('/api/chat.js', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          personas: ['AJIN','MIGOU','GUNGUN'],
          message: msg,
          page: 'cosmic-post-station'
        })
      });
      const data = await res.json();
      const text = Array.isArray(data.reply) ? data.reply.join('\n') : (data.reply || '（雲層太厚，暫時收不到訊號）');
      chat.lastChild.remove();
      bubble(text, 'assistant');
    }catch(e){
      chat.lastChild.remove();
      bubble('（雲層太厚，暫時收不到訊號）', 'system');
    }
  }
  btn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if(e.key === 'Enter') send(); });
})();
