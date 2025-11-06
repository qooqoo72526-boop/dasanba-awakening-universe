/* v9.2.3 — Cosmic Post Station layout + input + bubble sound */
(function(){
  const box = document.querySelector('.cps-art');
  if(box){
    box.style.display='grid';
    box.style.gap='16px';
    box.style.gridTemplateColumns='repeat(3, minmax(140px, 1fr))';
    box.querySelectorAll('img').forEach((im,i)=>{
      im.style.width='100%'; im.style.borderRadius='18px';
      im.style.display='block'; im.classList.add('glass');
      if(i===3 || i===4){ im.style.gridColumn='span 2'; }
    });
  }
  const input = document.querySelector('#cps-input');
  if(input){
    input.classList.add('glass');
    input.style.width='100%'; input.style.padding='12px 14px';
    input.style.border='1px solid rgba(255,255,255,.14)';
    input.style.borderRadius='14px'; input.style.outline='none';
    input.placeholder='在星際膠囊投遞一句話，按 Enter 傳訊…';
  }
  // bubble click
  try{
    const snd = new Audio('assets/sound/click_star.wav');
    document.addEventListener('click',()=>{ try{ snd.currentTime=0; snd.play(); }catch(e){} });
  }catch(e){}
})();