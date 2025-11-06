
(async function(){
  const el = id => document.getElementById(id);
  const prompt = el('prompt');
  const fields = { ajin: el('b-ajin'), migou: el('b-migou'), gungun: el('b-gungun') };
  async function talk(q){
    const payload = { prompt:q, mode:"trio" };
    try{
      const r = await fetch('/api/chat.js',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      const j = await r.json();
      fields.ajin.textContent = j.ajin || '（阿金）收到。';
      fields.migou.textContent = j.migou || '（米果）知道了。';
      fields.gungun.textContent = j.gungun || '（滾滾）我在。';
    }catch(e){
      fields.ajin.textContent = '（阿金）我在，你們還好嗎？';
      fields.migou.textContent = '（米果）知道了，你們還好嗎？';
      fields.gungun.textContent = '（滾滾）我在，你們還好嗎？';
    }
  }
  prompt.addEventListener('keydown', e=>{
    if(e.key==='Enter'&&prompt.value.trim()){
      talk(prompt.value.trim());
      prompt.value='';
    }
  });
})();