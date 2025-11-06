
// hook card click sound
import { audioBus } from './audio_v916.js';
(function(){
  document.querySelectorAll('.card').forEach(c=>{
    const href=c.dataset.href;
    if(href){
      c.addEventListener('click', ()=>{ audioBus.play('click'); location.href=href; });
    }
  });
})();
