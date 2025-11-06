(() => {
  const cvs = document.getElementById('starfield');
  if(cvs){
    const ctx = cvs.getContext('2d'); const DPR = Math.max(1, Math.min(2, devicePixelRatio||1));
    let W=0,H=0, stars=[]; function R(){W=cvs.width=innerWidth*DPR;H=cvs.height=innerHeight*DPR;cvs.style.width=innerWidth+'px';cvs.style.height=innerHeight+'px';stars=Array.from({length:Math.floor((innerWidth+innerHeight)/7)},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.5+.3)*DPR}))} R();
    addEventListener('resize',R);
    (function D(){ctx.clearRect(0,0,W,H); for(const s of stars){ctx.fillStyle='#fff';ctx.globalAlpha=.85; ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill();} requestAnimationFrame(D)})();
  }
  const prompt = document.getElementById('prompt');
  const sfxClick = document.getElementById('sfx-click');
  const sfxSend  = document.getElementById('sfx-send');
  const sfxA = document.getElementById('sfx-ajin');
  const sfxM = document.getElementById('sfx-migou');
  const sfxG = document.getElementById('sfx-gungun');

  function addMsg(pane, text){
    const div = document.createElement('div'); div.className='bubble'; div.textContent = text; pane.querySelector('.list').appendChild(div);
    pane.scrollTop = pane.scrollHeight;
  }

  async function sendChat(text){
    const body = { prompt: text, mode: 'cosmic-multi' };
    const res = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)});
    if(!res.ok){ throw new Error('Network'); }
    const data = await res.json(); // {ajin:'', migou:'', gungun:''}
    return data;
  }

  prompt.addEventListener('keydown', async (e)=>{
    if(e.key === 'Enter'){
      e.preventDefault();
      const text = prompt.value.trim(); if(!text) return;
      sfxClick && sfxClick.play().catch(()=>{});
      addMsg(document.getElementById('pane-ajin'),  '…');
      addMsg(document.getElementById('pane-migou'), '…');
      addMsg(document.getElementById('pane-gungun'),'…');

      try{
        sfxSend && sfxSend.play().catch(()=>{});
        const out = await sendChat(text);
        const pA = document.getElementById('pane-ajin');   pA.querySelector('.list').lastChild.textContent   = out.ajin   || '（阿金）收到。';
        const pM = document.getElementById('pane-migou');  pM.querySelector('.list').lastChild.textContent  = out.migou  || '（米果）在。';
        const pG = document.getElementById('pane-gungun'); pG.querySelector('.list').lastChild.textContent  = out.gungun || '（滾滾）嗯～';
        sfxA && sfxA.play().catch(()=>{}); setTimeout(()=>sfxM && sfxM.play().catch(()=>{}), 180); setTimeout(()=>sfxG && sfxG.play().catch(()=>{}), 360);
      }catch(err){
        const msg = '（星際訊號暫時失真，稍後再試）';
        document.getElementById('pane-ajin').querySelector('.list').lastChild.textContent   = msg;
        document.getElementById('pane-migou').querySelector('.list').lastChild.textContent  = msg;
        document.getElementById('pane-gungun').querySelector('.list').lastChild.textContent = msg;
      }
      prompt.value='';
    }
  });
})();