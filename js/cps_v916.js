
// Cosmic Post Station with sounds + bubble pop
import { audioBus } from './audio_v916.js';
(async function(){
  const form=document.querySelector('#cps-form');
  const input=document.querySelector('#cps-input');
  const panels={
    AJIN: document.querySelector('#panel-ajin'),
    MIGOU: document.querySelector('#panel-migou'),
    GUNGUN: document.querySelector('#panel-gungun'),
  };
  function bubble(panel,text,you=false){
    const b=document.createElement('div'); b.className='bubble glass'+(you?' you':''); b.textContent=text;
    panel.appendChild(b); panel.scrollTop=panel.scrollHeight;
  }
  async function call(persona,text){
    try{
      const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({role:'user',content:text,persona})});
      const j=await r.json().catch(()=>({}));
      return j.reply||j.message||j.output||'（雲層散開中…）';
    }catch(e){ return '（暫時連不到星際通道，稍後再試）'; }
  }
  form.addEventListener('submit', async (e)=>{
    e.preventDefault(); const v=input.value.trim(); if(!v) return; input.value='';
    audioBus.play('send');
    bubble(panels.AJIN, v, true); bubble(panels.MIGOU, v, true); bubble(panels.GUNGUN, v, true);
    const [a,m,g]=await Promise.all([call('AJIN',v),call('MIGOU',v),call('GUNGUN',v)]);
    bubble(panels.AJIN,a); audioBus.play('AJIN');
    bubble(panels.MIGOU,m); audioBus.play('MIGOU');
    bubble(panels.GUNGUN,g); audioBus.play('GUNGUN');
  });
})();
