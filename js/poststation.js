/* js/poststation.js  v9.3.7-flat (assets folder unified) */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const chat = $('#chat');
  const input = $('#input');
  const form = $('#composer');

  // 音樂控制
  const bgm = $('#bgm');
  const btnAudio = $('.audio-toggle');
  const iconAudio = $('.audio-toggle .icon');

  // 角色設定（顏色、icon、音效、愛心）
  const BIRDS = {
    ajin:  { name: '阿金',  heart:'💛', color:'#f6d56b', glow:'rgba(246,213,107,.35)', icon:'assets/icon_ajin.png',  sfx: new Audio('assets/ajin_tap.mp3') },
    migou: { name: '米果',  heart:'🧡', color:'#ffb7a5', glow:'rgba(255,183,165,.35)', icon:'assets/icon_migou.png', sfx: new Audio('assets/migou_chime.mp3') },
    gungun:{ name: '滾滾',  heart:'💙', color:'#a9c7ff', glow:'rgba(169,199,255,.35)', icon:'assets/icon_gungun.png',sfx: new Audio('assets/gungun_bubble.mp3') }
  };
  const BIRD_KEYS = Object.keys(BIRDS);

  // ===== 背景：星粒 =====
  const canvas = $('.bg-stars');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const stars = new Array(140).fill(0).map(() => ({
      x: Math.random(), y: Math.random(), s: Math.random()*1.2 + 0.2, a: Math.random()*0.6+0.2
    }));
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
    resize(); addEventListener('resize', resize);
    const loop = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      stars.forEach(st => {
        st.y += 0.0003; if (st.y>1) st.y=0;
        const x = st.x*canvas.width, y = st.y*canvas.height;
        ctx.globalAlpha = st.a;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x, y, st.s, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ===== 音樂：自動播放 + 開關 =====
  const tryPlay = async () => {
    try { await bgm.play(); iconAudio.textContent='🔈'; } catch { iconAudio.textContent='🔇'; }
  };
  document.addEventListener('DOMContentLoaded', tryPlay, {once:true});
  ['pointerdown','keydown'].forEach(ev => addEventListener(ev, () => {
    if (bgm.paused) tryPlay();
  }, {once:true}));
  btnAudio.addEventListener('click', () => {
    if (bgm.paused) { bgm.play(); iconAudio.textContent='🔈'; }
    else { bgm.pause(); iconAudio.textContent='🔇'; }
  });

  // ===== UI helpers =====
  const scrollToBottom = () => chat.scrollTo({top: chat.scrollHeight, behavior:'smooth'});
  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html!=null) n.innerHTML = html; return n; };

  // 我方訊息（無頭像）
  const renderUser = (text) => {
    const row = el('div', 'msg me');
    const bubble = el('div', 'bubble', text);
    row.appendChild(bubble);
    chat.appendChild(row);
    scrollToBottom();
  };

  // 鳥的訊息（名稱＋愛心＋光暈，可多句）
  const renderBird = (key, text) => {
    const B = BIRDS[key];
    const row = el('div', `msg bird ${key}`);
    const meta = el('div', 'meta', `${B.heart} <b>${B.name}</b>`);
    const bubble = el('div', 'bubble', text);
    const glow = el('div', 'speaker-glow');
    glow.style.setProperty('--glow', B.glow);
    bubble.style.setProperty('--tone', B.color);
    row.append(meta, bubble, glow);
    chat.appendChild(row);
    // 音效
    if (B.sfx) { try { B.sfx.currentTime=0; B.sfx.play(); } catch(e){} }
    scrollToBottom();
  };

  // 把 API 回應拆成句子後隨機分配給鳥
  const dispatchToBirds = (apiText) => {
    const parts = apiText
      .split(/([，。！？,.!?])/)
      .reduce((arr, cur, i, src) => {
        if (!cur.trim()) return arr;
        if (/^[，。！？,.!?]$/.test(cur)) { arr[arr.length-1] += cur; }
        else arr.push(cur.trim());
        return arr;
      }, []);
    const sayers = BIRD_KEYS.filter(()=>Math.random()>0.35);
    if (sayers.length===0) sayers.push(BIRD_KEYS[Math.floor(Math.random()*BIRD_KEYS.length)]);
    let i = 0;
    parts.forEach(p => {
      const k = sayers[i % sayers.length];
      const delay = 800 + Math.random()*4200;
      setTimeout(()=>renderBird(k, p), delay);
      i++;
    });
  };

  // 串接 API
  async function talkToAPI(userText) {
    try {
      const res = await fetch('/api/chat.js', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json().catch(()=> ({}));
      if (typeof data === 'object' && (data.ajin || data.migou || data.gungun)) {
        const order = BIRD_KEYS.filter(k => data[k]).sort(()=>Math.random()-0.5);
        order.forEach((k)=>{
          const chunk = String(data[k]).trim();
          if (!chunk) return;
          const split = chunk.split(/(?<=[。！？!?])/).filter(Boolean);
          setTimeout(()=>renderBird(k, split[0]), 900 + Math.random()*2200);
          if (split[1] && Math.random()>0.5)
            setTimeout(()=>renderBird(k, split[1]), 2200 + Math.random()*2600);
        });
      } else {
        const text = String(data || '').trim() || '…';
        dispatchToBirds(text);
      }
    } catch(e) {
      dispatchToBirds('宇宙雜訊有點多，等等再說話⋯🫧');
    }
  }

  // 送出事件（➤ / Enter）
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    renderUser(v);
    input.value='';
    talkToAPI(v);
  });
})();
