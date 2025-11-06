/* --- patch_v925.js --- */
(function(){
  const s=document.getElementById('splash');
  if(s){s.setAttribute('aria-hidden','false');setTimeout(()=>s.setAttribute('aria-hidden','true'),3500);}
})();
(function(){
  if(window.Universe&&typeof Universe.start==='function'){
    try{Universe.start({twinkle:true,meteor:true});}catch(e){}
  }
})();
(function(){
  const scope=document.body&&document.body.classList.contains('cosmic');
  if(!scope)return;
  const input=document.querySelector('#cosmic-input');
  const send=document.querySelector('#cosmic-send');
  const rows=Array.from(document.querySelectorAll('.reply-row'));
  const bubble=()=>{try{new Audio('assets/sound/click_star.wav').play();}catch(e){}};
  async function talk(){
    if(!input)return;
    const text=(input.value||'').trim();
    if(!text){rows.forEach(r=>{const m=r.querySelector('.msg');if(m)m.textContent='';});return;}
    bubble();
    const personas=Array.from(document.querySelectorAll('.persona-toggle:checked')).map(n=>n.value);
    try{
      const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,personas})});
      const data=await res.json();
      rows.forEach((r,i)=>{const m=r.querySelector('.msg');if(m)m.textContent=(data&&data.replies&&data.replies[i])?String(data.replies[i]).trim():'…';});
      input.value='';
    }catch(e){rows.forEach(r=>{const m=r.querySelector('.msg');if(m)m.textContent='（連線暫時失敗，稍後再試）';});}
  }
  if(send)send.addEventListener('click',talk);
  if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')talk();});
})();
