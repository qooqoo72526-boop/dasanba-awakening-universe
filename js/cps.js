(()=>{
  const nebula = document.createElement('div'); nebula.id='nebula'; document.body.appendChild(nebula);
  const par = document.createElement('div'); par.id='par'; document.body.appendChild(par);
  addEventListener('pointermove', (e)=>{
    const x = (e.clientX / innerWidth - .5) * 2;
    const y = (e.clientY / innerHeight - .5) * 2;
    par.style.transform = `translate(${x*8}px, ${y*6}px)`;
    nebula.style.transform = `translate(${x*4}px, ${y*3}px)`;
  }, {passive:true});

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let actx;
  const bgmEl = document.getElementById('bgm');
  function ensureAudio(){ if(!actx) actx = new AudioCtx(); }
  function sfx(type){
    ensureAudio();
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.connect(g).connect(actx.destination);
    const now = actx.currentTime;
    if(type==='send'){ o.type='triangle'; o.frequency.setValueAtTime(520, now); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.22, now+.02); g.gain.exponentialRampToValueAtTime(0.0001, now+.16); }
    if(type==='recv'){ o.type='sine'; o.frequency.setValueAtTime(740, now); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.25, now+.01); g.gain.exponentialRampToValueAtTime(0.0001, now+.22); }
    if(type==='type'){ o.type='square'; o.frequency.setValueAtTime(240, now); g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.12, now+.005); g.gain.exponentialRampToValueAtTime(0.0001, now+.06); }
    o.start(); o.stop(now+.25);
  }
  function startBGM(){
    ensureAudio();
    if(bgmEl){
      bgmEl.volume = 0.35; bgmEl.loop = true;
      bgmEl.play().catch(()=>{});
    }else{
      const n = actx.createBufferSource();
      const len = actx.sampleRate * 2;
      const buf = actx.createBuffer(1, len, actx.sampleRate);
      const ch = buf.getChannelData(0);
      for(let i=0;i<len;i++){ ch[i] = (Math.random()*2-1) * 0.02; }
      n.buffer = buf; n.loop = true;
      const flt = actx.createBiquadFilter(); flt.type='lowpass'; flt.frequency.value=800;
      const g = actx.createGain(); g.gain.value = 0.2;
      n.connect(flt).connect(g).connect(actx.destination);
      n.start();
    }
  }
  document.body.addEventListener('pointerdown', ()=>{ startBGM(); }, {once:true});

  const ip  = document.getElementById('cps-input');
  const box = document.getElementById('cps-chat');
  const personas = [
    { key:'ajin',   name:'💛阿金',   cls:'msg ajin'  },
    { key:'migou',  name:'🩷米果',   cls:'msg migou' },
    { key:'gungun', name:'🩵滾滾',   cls:'msg gungun'}
  ];
  let turn = 0;

  function bubble(who, text){
    const div = document.createElement('div');
    div.className = who.cls;
    div.innerHTML = `<span>${who.name}</span><span>${text}</span>`;
    box.appendChild(div);
    box.scrollTo({top:box.scrollHeight, behavior:'smooth'});
    sfx('recv');
  }
  function mybubble(text){
    const div = document.createElement('div');
    div.className = 'msg me';
    div.textContent = text;
    box.appendChild(div);
    box.scrollTo({top:box.scrollHeight, behavior:'smooth'});
  }

  async function askOne(who, q){
    try{
      sfx('type');
      const res  = await fetch('/api/chat.js', {
        method:'POST',
        headers:{'content-type':'application/json'},
        body:JSON.stringify({ persona: who.key, q })
      });
      const data = await res.json();
      bubble(who, (data.reply||''));
    }catch{
      bubble(who, '（宇宙風暴干擾，稍後再連線）');
    }
  }

  ip.addEventListener('keydown', async e=>{
    if(e.key!=='Enter') return;
    const q = ip.value.trim(); if(!q) return;
    ip.value='';
    mybubble(q);
    sfx('send');

    const first = turn;
    for(let i=0;i<personas.length;i++){
      const who = personas[(first+i)%personas.length];
      await askOne(who, q);
      await new Promise(r=>setTimeout(r, 240));
    }
    turn = (turn+1)%personas.length;
  });
})();
