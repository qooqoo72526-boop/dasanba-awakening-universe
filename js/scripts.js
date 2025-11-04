
// v8.9 Cosmic Final — basic FX + language + music
// Stars
(function(){
  const c = document.getElementById('stars'); if(!c) return;
  const d = document.getElementById('dust');
  const ctx = c.getContext('2d'); const dtx = d.getContext('2d');
  function fit(){ c.width=innerWidth; c.height=innerHeight; d.width=innerWidth; d.height=innerHeight }
  fit(); addEventListener('resize', fit);
  const stars = Array.from({length: 160}).map(()=>({x:Math.random()*c.width,y:Math.random()*c.height,z:Math.random()*1.5+0.3}));
  const motes = Array.from({length: 80}).map(()=>({x:Math.random()*d.width,y:Math.random()*d.height, s:Math.random()*2+0.2, a:Math.random()*0.6+0.2}));
  function tick(){
    ctx.clearRect(0,0,c.width,c.height);
    dtx.clearRect(0,0,d.width,d.height);
    // stars
    ctx.fillStyle="#ffffff";
    for(const s of stars){
      s.x += s.z*0.4; if(s.x>c.width) s.x=0, s.y=Math.random()*c.height;
      ctx.globalAlpha=0.65*s.z; ctx.fillRect(s.x, s.y, s.z, s.z);
    }
    // motes
    for(const m of motes){
      m.y += 0.08*m.s; if(m.y>d.height) m.y=0, m.x=Math.random()*d.width;
      dtx.fillStyle=`rgba(180,190,255,${0.05*m.a})`;
      dtx.beginPath(); dtx.arc(m.x,m.y, m.s*2, 0, Math.PI*2); dtx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// Language toggle
window.AppLang = (function(){
  let lang="zh";
  function set(l){
    lang = l;
    document.querySelectorAll('[data-lang]').forEach(el=>{
      el.style.display = (el.dataset.lang===lang)? 'block' : 'none';
    });
    localStorage.setItem('lang', lang);
  }
  function init(){
    const saved = localStorage.getItem('lang'); if(saved) lang=saved;
    set(lang);
  }
  return {set, init};
})();

// Music control (auto)
window.Music = (function(){
  let el;
  function init(id){
    el = document.getElementById(id);
    if(!el) return;
    const play = ()=> el.play().catch(()=>{});
    document.addEventListener('click', play, {once:true});
    document.addEventListener('touchstart', play, {once:true});
  }
  return {init};
})();

// Random 25 Q from 500 pool (generated procedurally)
window.SoulMirror = (function(){
  function buildPool(){
    const stems = [
      "當你覺得被誤解時你會如何自我保護",
      "你如何辨識真正的邊界而不是逃避",
      "什麼時候你最像過去的自己",
      "你對被愛的條件有什麼直覺",
      "你如何面對對抗權威的衝動",
      "當安全感動搖時你第一反應是什麼",
      "你最近一次誠實說不的場景",
      "你把哪些責任默默扛起來了",
      "你對自我價值的底線是什麼",
      "你如何看待後悔與補救"
    ];
    const angles = ["關係","工作","自我照護","創作","家庭","金錢","身體","邊界","勇氣","失敗"];
    const pool = [];
    let id=1;
    for(const s of stems){
      for(const a of angles){
        pool.push(`${id:03d}. ${s}（情境：${a}）`); id++;
      }
    }
    // 10 * 10 = 100 → 複製五組語氣變奏 = 500
    const tags = ["更直接","更温柔","更具體","反向追問","時間線"];
    const big = [];
    let n=1;
    for(const p of pool){
      for(const t of tags){
        big.push(`${n:04d}. ${p} / 角度：${t}`); n+=1;
      }
    }
    return big; // 500
  }
  const POOL = buildPool();
  function pick25(){
    const idx = new Set();
    while(idx.size<25){
      idx.add(Math.floor(Math.random()*POOL.length));
    }
    return Array.from(idx).map(i=>POOL[i]);
  }
  return {pick25};
})();
