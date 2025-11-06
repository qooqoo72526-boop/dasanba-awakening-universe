
const sClick = document.getElementById('s_click');
const sSend  = document.getElementById('s_send');
const sAj = document.getElementById('s_aj');
const sMi = document.getElementById('s_mi');
const sGu = document.getElementById('s_gu');

function bubble(el, text){
  const b = document.createElement('div');
  b.className='bubble';
  b.textContent = text;
  el.appendChild(b);
  el.scrollTop = el.scrollHeight;
}

async function talk(msg){
  sSend.currentTime=0; sSend.play().catch(()=>{});
  try{
    const res = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({message: msg, personas:['ajin','migou','gungun']})});
    if(!res.ok) throw new Error('no-signal');
    const data = await res.json();
    bubble(document.getElementById('ajList'), data.ajin || '...');
    bubble(document.getElementById('miList'), data.migou || '...');
    bubble(document.getElementById('guList'), data.gungun || '...');
    sAj.play().catch(()=>{}); setTimeout(()=>sMi.play().catch(()=>{}), 120); setTimeout(()=>sGu.play().catch(()=>{}), 240);
  }catch(e){
    ['ajList','miList','guList'].forEach(id => bubble(document.getElementById(id),'（星際訊號暫時失真，稍後再試）'));
  }
}

document.getElementById('composer').addEventListener('submit', e=>{ e.preventDefault();
  const v = document.getElementById('msg').value.trim(); if(!v) return; document.getElementById('msg').value='';
  sClick.currentTime=0; sClick.play().catch(()=>{});
  talk(v);
});
