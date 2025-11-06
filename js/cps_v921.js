(()=>{
  const sounds = {
    click: new Audio('assets/sound/click_star.wav'),
    send: new Audio('assets/sound/send_cosmic.wav'),
    ajin: new Audio('assets/sound/reply_ajin.wav'),
    migou: new Audio('assets/sound/reply_migou.wav'),
    gungun: new Audio('assets/sound/reply_gungun.wav')
  };
  Object.values(sounds).forEach(a=>{ a.volume = .55; });

  const aj = document.getElementById('aj');
  const mi = document.getElementById('mi');
  const gu = document.getElementById('gu');
  const msg = document.getElementById('msg');

  function setBubble(el, text){ el.textContent = text; el.style.animation = 'pop .3s ease'; setTimeout(()=>el.style.animation='',300); }
  document.addEventListener('click', ()=>sounds.click.play().catch(()=>{}));

  setBubble(aj,'早安！今天準備好挑戰你的小目標了嗎？🚀 我們一起加熱！');
  setBubble(mi,'早安！希望你今天能認真對齊自己的價值與邊界；每個時刻都值得被尊重。');
  setBubble(gu,'早安！也許一點微光或許會帶來新的安穩能量。需要我就叫我～');

  msg?.addEventListener('keydown', async (e)=>{
    if(e.key!=='Enter') return;
    const content = msg.value.trim(); if(!content) return;
    sounds.send.play().catch(()=>{});
    msg.value='';
    try{
      const r = await fetch('/api/chat',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: content })
      });
      const j = await r.json().catch(()=>({}));
      const text = j.reply || j.content || j.text || '收到～我在。';
      setBubble(aj,text); sounds.ajin.play().catch(()=>{});
      setBubble(mi,text); sounds.migou.play().catch(()=>{});
      setBubble(gu,text); sounds.gungun.play().catch(()=>{});
    }catch(err){
      setBubble(aj,'（星際訊號暫時失真，稍後再試）');
      setBubble(mi,'（星際訊號暫時失真，稍後再試）');
      setBubble(gu,'（星際訊號暫時失真，稍後再試）');
    }
  });
})();