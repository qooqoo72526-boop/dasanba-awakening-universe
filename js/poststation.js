/* js/poststation.js  v9.3.7-flat (assets in /assets) */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const chat = $('#chat');
  const input = $('#input');
  const form = $('#composer');

  // 音樂控制
  const bgm = $('#bgm');
  const btnAudio = $('.audio-toggle');
  const iconAudio = $('.audio-toggle .icon');

  // 角色設定
  const BIRDS = {
    ajin:  { name:'阿金',  heart:'💛', color:'#f6d56b', glow:'rgba(246,213,107,.35)', icon:'assets/icon_ajin.png',  sfx:new Audio('assets/ajin_tap.mp3') },
    migou: { name:'米果',  heart:'🧡', color:'#ffb7a5', glow:'rgba(255,183,165,.35)', icon:'assets/icon_migou.png', sfx:new Audio('assets/migou_chime.mp3') },
    gungun:{ name:'滾滾',  heart:'💙', color:'#a9c7ff', glow:'rgba(169,199,255,.35)', icon:'assets/icon_gungun.png',sfx:new Audio('assets/gungun_bubble.mp3') }
  };
  const KEYS = Object.keys(BIRDS);

  // 星粒
  const cvs = $('.bg-stars');
  if (cvs && cvs.getContext) {
    const ctx = cvs.getContext('2d');
    const stars = new Array(140).fill(0).map(()=>({x:Math.random(),y:Math.random(),s:Math.random()*1.2+.2,a:Math.random()*.6+.2}));
    const resize = ()=>{ cvs.width=innerWidth; cvs.height=innerHeight; };
    resize(); addEventListener('resize', resize);
    (function loop(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      stars.forEach(st=>{ st.y+=.0003; if(st.y>1) st.y=0;
        ctx.globalAlpha=st.a; ctx.fillStyle='#fff';
        ctx.beginPath(); ctx.arc(st.x*cvs.width, st.y*cvs.height, st.s, 0, Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  // 音樂：自動播放 + 開關
  const tryPlay = async()=>{ try{ await bgm.play(); iconAudio.textContent='🔈'; }catch{ iconAudio.textContent='🔇'; } };
  document.addEventListener('DOMContentLoaded', tryPlay, {once:true});
  ['pointerdown','keydown'].forEach(ev=> addEventListener(ev, ()=>{ if(bgm.paused) tryPlay(); }, {once:true}));
  btnAudio.addEventListener('click', ()=>{ if(bgm.paused){ bgm.play(); iconAudio.textContent='🔈'; } else { bgm.pause(); iconAudio.textContent='🔇'; } });

  // UI
  const scrollToBottom = ()=> chat.scrollTo({top: chat.scrollHeight, behavior:'smooth'});
  const el = (t,c,h)=>{ const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n; };

  // 我方（無頭像）
  const renderMe = (text)=>{
    const row = el('div','msg me');
    row.appendChild(el('div','bubble',text));
    chat.appendChild(row); scrollToBottom();
  };

  // 鳥（名稱＋愛心＋光暈）
  const renderBird = (key, text)=>{
    const B = BIRDS[key];
    const row = el('div',`msg bird ${key}`);
    row.append(
      el('div','meta',`${B.heart} <b>${B.name}</b>`),
      el('div','bubble',text),
      (()=>{ const g=el('div','speaker-glow'); g.style.setProperty('--glow',B.glow); return g; })()
    );
    chat.appendChild(row);
    try{ B.sfx.currentTime=0; B.sfx.play(); }catch{}
    scrollToBottom();
  };

  // 把文字分句後隨機分配
  const dispatch = (txt)=>{
    const parts = txt.split(/([，。！？,.!?])/).reduce((a,c)=>{
      if(!c.trim()) return a; if(/^[，。！？,.!?]$/.test(c)){ a[a.length-1]+=c; } else { a.push(c.trim()); } return a;
    },[]);
    const who = KEYS.filter(()=>Math.random()>.35);
    if(!who.length) who.push(KEYS[Math.floor(Math.random()*KEYS.length)]);
    let i=0; parts.forEach(p=>{
      const k = who[i%who.length];
      setTimeout(()=>renderBird(k,p), 800+Math.random()*4200);
      i++;
    });
  };

  // API
  async function talk(txt){
    try{
      const r = await fetch('/api/chat.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:txt})});
      const data = await r.json().catch(()=> ({}));
      if (typeof data==='object' && (data.ajin||data.migou||data.gungun)){
        const order = KEYS.filter(k=>data[k]).sort(()=>Math.random()-.5);
        order.forEach(k=>{
          const chunk = String(data[k]||'').trim(); if(!chunk) return;
          const ss = chunk.split(/(?<=[。！？!?])/).filter(Boolean);
          setTimeout(()=>renderBird(k, ss[0]), 900+Math.random()*2200);
          if (ss[1] && Math.random()>.5) setTimeout(()=>renderBird(k, ss[1]), 2200+Math.random()*2600);
        });
      }else{
        dispatch(String(data||'…').trim());
      }
    }catch{
      dispatch('宇宙雜訊有點多，等等再說話⋯🫧');
    }
  }

  // 送出
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const v = input.value.trim(); if(!v) return;
    renderMe(v); input.value=''; talk(v);
  });
})();
