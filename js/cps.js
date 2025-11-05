// === Cosmic Post Station v9.1.3 (Center dialog + stars + sfx + 3-parrot chat) ===
(() => {

  // 0) BGM 互動後自動播放
  const bgm = document.getElementById('bgm');
  const once = () => { try{ bgm.volume = 0.35; bgm.play(); }catch{} window.removeEventListener('pointerdown', once); };
  window.addEventListener('pointerdown', once);

  // 1) 星空畫布（高效 GPU 友善版）
  const cvs = document.getElementById('stars');
  const ctx = cvs.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W=0, H=0, stars=[];
  function resize(){
    W = cvs.width  = innerWidth * DPR;
    H = cvs.height = innerHeight * DPR;
    cvs.style.width  = innerWidth + 'px';
    cvs.style.height = innerHeight + 'px';
    const N = Math.floor((innerWidth+innerHeight)/8); // 量大，密一點
    stars = new Array(N).fill(0).map(()=>({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.2 + 0.2,
      a: Math.random()*1,
      w: Math.random()*0.6 + 0.25
    }));
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(const s of stars){
      s.a += s.w*0.01;
      const tw = (Math.sin(s.a)+1)/2; // 0~1
      ctx.globalAlpha = 0.35 + tw*0.65;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r*DPR, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize(); draw(); addEventListener('resize', resize);

  // 2) 輕微打字音（WebAudio，非必要）
  const AC = window.AudioContext || window.webkitAudioContext;
  const audio = new AC();
  function keyClick(){
    const o = audio.createOscillator();
    const g = audio.createGain();
    o.connect(g); g.connect(audio.destination);
    o.frequency.value = 380 + Math.random()*60;
    g.gain.setValueAtTime(0.0001, audio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, audio.currentTime + 0.01);
    o.start(); o.stop(audio.currentTime + 0.08);
  }

  // 3) 介面元素
  const input  = document.getElementById('cps-input');
  const send   = document.getElementById('send');
  const stream = document.getElementById('chat');
  const aj = document.getElementById('aj');
  const mi = document.getElementById('mi');
  const gu = document.getElementById('gu');

  // 4) 三鳥 System 設定（語氣×人設）
  const personas = [
    { id:'aj', tag:'aj', name:'阿金 AJIN',   tone:'rebellion',
      sys:`你是阿金。行動派、敢講實話、帶勁。語氣簡短狠準、每句不超過35字。關鍵字：自由、界線、點火、行動。` },
    { id:'mi', tag:'mi', name:'米果 MIGOU',  tone:'worth',
      sys:`你是米果。邊界女王、自我價值很高。語氣溫柔但不客氣、每句不超過35字。關鍵字：自重、誠實、界線、主權。` },
    { id:'gu', tag:'gu', name:'滾滾 GUNGUN', tone:'safety',
      sys:`你是滾滾。安撫的誠懇派，給被理解的陪伴與肯定；每句不超過35字。關鍵字：被理解、穩住、呼吸。` }
  ];

  // 工具：把訊息推進聊天室
  function pushMsg(html, klass='me'){
    const d = document.createElement('div');
    d.className = 'msg ' + klass;
    d.innerHTML = html;
    stream.appendChild(d);
    stream.scrollTo({top: stream.scrollHeight, behavior:'smooth'});
  }

  // 5) 發送流程
  async function doSend(){
    const q = (input.value || '').trim();
    if(!q) return;
    input.value = '';
    pushMsg(q.replaceAll('<','&lt;'), 'me');
    keyClick();

    const use = personas.filter(p =>
      (p.id==='aj'&&aj.checked)||(p.id==='mi'&&mi.checked)||(p.id==='gu'&&gu.checked)
    );
    if(use.length===0) return;

    // 觸發一次「信件→星塵」特效
    burst();

    // 逐一請三鳥回應（並行）
    await Promise.all(use.map(async (p)=>{
      try{
        const res = await fetch('/api/chat.js', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body: JSON.stringify({
            messages:[
              {role:'system', content:p.sys},
              {role:'user',   content:q}
            ]
          })
        });
        const data = await res.json();
        const text = (data?.choices?.[0]?.message?.content || '').trim() || '…';
        pushMsg(`<span class="name en">${p.name}</span>${text}`, p.tag);
      }catch{
        pushMsg(`<span class="name en">${p.name}</span>（雲層偏厚，稍後再試）`, p.tag);
      }
    }));
  }

  send.addEventListener('click', doSend);
  input.addEventListener('keydown', e => { if(e.key==='Enter') doSend(); });
  input.addEventListener('input', ()=> keyClick());

  // 6) 信封光環 + 星塵縮放（簡易特效）
  function burst(){
    const ring = document.createElement('div');
    ring.style.position='fixed';
    ring.style.left='50%'; ring.style.top='50%';
    ring.style.width='240px'; ring.style.height='240px';
    ring.style.transform='translate(-50%,-50%)';
    ring.style.borderRadius='50%';
    ring.style.pointerEvents='none';
    ring.style.boxShadow='0 0 30px rgba(255,230,180,.8), inset 0 0 40px rgba(255,180,220,.55)';
    ring.style.background='radial-gradient(closest-side, rgba(255,220,170,.45), rgba(255,160,210,.25) 60%, transparent 70%)';
    ring.style.filter='blur(4px) saturate(1.3)';
    ring.style.zIndex=4;
    document.body.appendChild(ring);
    ring.animate([
      {opacity:.0, transform:'translate(-50%,-50%) scale(.6)'},
      {opacity:.9, transform:'translate(-50%,-50%) scale(1.08)'},
      {opacity:0,  transform:'translate(-50%,-50%) scale(1.6)'}
    ], {duration:680, easing:'cubic-bezier(.18,.6,.2,1)'})
    .onfinish = () => ring.remove();
  }

  // 7) 漂浮微互動：滑過鳥時微抖閃
  function hoverPulse(sel){
    const el = document.querySelector(sel);
    if(!el) return;
    el.addEventListener('pointerenter', ()=>{
      el.animate([
        {transform:el.style.transform+' scale(1)'},
        {transform:el.style.transform+' scale(1.03)'},
        {transform:el.style.transform+' scale(1)'}
      ], {duration:420, easing:'ease-out'});
    });
  }
  hoverPulse('.v-ajin'); hoverPulse('.v-migou'); hoverPulse('.v-gungun');

})();
