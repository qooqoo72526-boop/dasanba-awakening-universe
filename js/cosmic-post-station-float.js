(function(){
  const form = document.getElementById('post-form');
  const note = document.getElementById('note');
  const launch = document.getElementById('launch');
  const flight = document.getElementById('flight');
  const verts = Array.from(document.querySelectorAll('.cps-stage .vert'));
  window.addEventListener('pointermove', (e)=>{
    const w = innerWidth, h = innerHeight;
    const nx = (e.clientX/w - .5), ny = (e.clientY/h - .5);
    verts.forEach((el,i)=>{
      const dx = nx * (4 + i*1.5);
      const dy = ny * (4 + (2-i));
      el.style.transform = `translate(${dx}px, calc(-50% + ${dy}px))`;
    });
  });
  function animateFlight(){ flight.classList.add('active'); setTimeout(()=>flight.classList.remove('active'), 900); }
  async function submitToUniverse(text){
    try{
      await fetch('/api/chat.js', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ task:'cosmic_post_register', body:{ text, at: Date.now() } })
      });
    }catch(e){}
  }
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = (note.value || '').trim();
    animateFlight();
    if(text) await submitToUniverse(text);
    note.value='';
  });
  note.addEventListener('keydown',(e)=>{
    if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); launch.click(); }
  });
})();