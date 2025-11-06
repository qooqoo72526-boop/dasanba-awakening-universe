// v9.2.4 CPS minimal chat persona demo + bubble click
(function(){
  const input = document.querySelector('.input input');
  const list = document.querySelector('.chat');
  const audio = document.getElementById('sfx-bubble');
  function say(text, who){
    const p = document.createElement('div'); p.className='msg'; p.textContent = `${who}：${text}`;
    list.appendChild(p); list.scrollTop = list.scrollHeight; if(audio) audio.play().catch(()=>{});
  }
  if(input && list){
    input.addEventListener('keydown', e=>{
      if(e.key==='Enter' && input.value.trim()){
        const t = input.value.trim(); input.value=''; say(t, '你');
        setTimeout(()=> say('我不等天空放晴，我自己撕開雲。', '阿金'), 250);
        setTimeout(()=> say('我很值錢，我讓自己更貴。', '米果'), 450);
        setTimeout(()=> say('我不追求安全，我成為安全。', '滾滾'), 700);
      }
    });
  }
})();