
// v9.2.2_fix cosmic post station front-end
(async () => {
  const sendBtn = document.getElementById('send'); const input = document.getElementById('msg');
  const boxA = document.getElementById('m-ajin'); const boxM = document.getElementById('m-migou'); const boxG = document.getElementById('m-gungun');

  function line(box, who, text){
    const el = document.createElement('div'); el.className='msg';
    el.innerHTML = `<div class="who">${who}</div><div class="txt">${text}</div>`;
    box.appendChild(el); box.scrollTop = box.scrollHeight;
  }

  function sfx(id){ const el = document.getElementById(id); if(!el) return; try{ el.currentTime=0; el.play(); }catch{} }

  // warm greetings
  line(boxA, '💛 阿金 AJIN', '早安！準備好迎接挑戰了嗎？讓我們一起加熱吧！');
  line(boxM, '□ 米果 MIGOU', '早安！希望你今天能找到屬於自己的價值和邊界，我們會一起陪你把每天走好。');
  line(boxG, '□ 滾滾 GUNGUN', '早安，我在這。讓我們慢慢來，今天想聊哪個瞬間？');

  async function talk(){
    const t = (input.value||'').trim(); if(!t) return;
    sfx('sfx-send');
    input.value='';
    const personaMsg = t;
    try{
      const r = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message: personaMsg })
      });
      if(!r.ok){ ['m-ajin','m-migou','m-gungun'].forEach(id => line(document.getElementById(id), '⚠️ 星際訊號', '暫時失真，稍後再試。')); return; }
      const data = await r.json();
      const reply = (data && data.reply) ? String(data.reply) : '...';
      // split reply into 3 natural tones (simple heuristic)
      const parts = reply.split(/\n+/).filter(Boolean);
      line(boxA, '💛 阿金 AJIN', (parts[0]||reply));
      sfx('sfx-ajin');
      line(boxM, '□ 米果 MIGOU', (parts[1]||reply));
      sfx('sfx-migou');
      line(boxG, '□ 滾滾 GUNGUN', (parts[2]||reply));
      sfx('sfx-gungun');
    }catch(e){
      ['m-ajin','m-migou','m-gungun'].forEach(id => line(document.getElementById(id), '⚠️ 星際訊號', '暫時失真，稍後再試。'));
    }
  }
  sendBtn?.addEventListener('click', talk);
  input?.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); talk(); } });

})();
