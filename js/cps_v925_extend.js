
// v9.2.5_extend — 3-parrot concurrent reply with persona prompts
(function(){
  document.body.classList.add('cosmic','cps');

  // twinkles
  const stars = document.getElementById('stars');
  if(stars){
    for(let i=0;i<60;i++){
      const s = document.createElement('div');
      s.className='twinkle';
      s.style.left=(Math.random()*100)+'vw';
      s.style.top=(Math.random()*100)+'vh';
      s.style.animationDelay=(Math.random()*3)+'s';
      stars.appendChild(s);
    }
  }

  const input = document.getElementById('cps-input');
  const formBtn = document.getElementById('cps-send');
  const checks = {
    ajin: document.getElementById('p-ajin'),
    migou: document.getElementById('p-migou'),
    gungun: document.getElementById('p-gungun')
  };
  const boxes = {
    ajin: document.getElementById('box-ajin'),
    migou: document.getElementById('box-migou'),
    gungun: document.getElementById('box-gungun')
  };

  async function askOne(key, system, msg){
    const target = boxes[key].querySelector('.content');
    target.textContent = '...';
    try{
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ system, user: msg })
      });
      const data = await res.json();
      const text = (data.text || data.reply || JSON.stringify(data));
      target.textContent = text.trim();
    }catch(e){
      target.textContent = '（信號微弱，再試一次）';
    }
  }

  function playBubble(){
    const a = document.getElementById('sfx-bubble');
    if(a){ a.currentTime=0; a.play().catch(()=>{}); }
  }

  formBtn?.addEventListener('click', ()=>{
    const msg = input.value.trim();
    if(!msg) return;
    playBubble();
    if(checks.ajin.checked) askOne('ajin',
      '你是阿金 AJIN：自由．反骨。口吻俐落、帶行動力。「我不等天空放晴，我自己撕開雲。」別用官腔，回覆要短而有力。', msg);
    if(checks.migou.checked) askOne('migou',
      '你是米果 MIGOU：主權．高價值。口吻優雅有界線。「我很值錢，我讓自己更貴。」別說教，回覆溫柔但清楚堅定。', msg);
    if(checks.gungun.checked) askOne('gungun',
      '你是滾滾 GUNGUN：共鳴．靜默力量。口吻安定、被理解的感覺。「我不追求安全，我成為安全。」語速慢、溫暖。', msg);
  });

  input?.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); formBtn.click(); }
  });
})();
