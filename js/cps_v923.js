// v9.2.3 — Cosmic Post Station refinements
(function(){
  // nicer bubble sound
  const bubble = new Audio('assets/sound/click_star.wav');
  bubble.preload = 'auto';
  function play(){ try{ bubble.currentTime = 0; bubble.play(); }catch(e){} }

  // style input placeholder if exist
  const input = document.querySelector('.cps-input') || document.querySelector('input[type="text"]');
  if(input){
    input.placeholder = input.placeholder || '在星際隧道投遞一句話，按 Enter 傳訊…';
    input.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        play();
      }
    });
  }

  // persona hint labels (non-invasive; shows small tip)
  const blocks = document.querySelectorAll('[data-persona]');
  blocks.forEach(b=>{
    const who = b.getAttribute('data-persona');
    const hint = {
      AJIN: '速度感｜行動派｜不繞彎',
      MIGOU:'自我價值｜界線｜直白',
      GUNGUN:'溫柔｜共鳴｜被理解'
    }[who] || '';
    if(hint){
      const tag = document.createElement('div');
      tag.textContent = hint;
      tag.style.fontSize = '.85rem';
      tag.style.opacity = .75;
      tag.style.margin = '4px 0 0 8px';
      b.appendChild(tag);
    }
  });
})();