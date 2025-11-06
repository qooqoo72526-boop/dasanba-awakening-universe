const sendSfx=new Audio('/sfx/send.wav'), ajinSfx=new Audio('/sfx/ajin.wav'), migouSfx=new Audio('/sfx/migou.wav'), gungunSfx=new Audio('/sfx/gungun.wav');
function play(a){try{a.currentTime=0;a.play();}catch(e){}}
function $(s,r=document){return r.querySelector(s)}

function addMsg(type,who,text){
  const list=$('#chat-list');
  const item=document.createElement('div'); item.className='msg ' + (type==='self'?'self':'');
  const av=document.createElement('div'); av.className='avatar';
  const img=document.createElement('img');
  img.src= type==='self'?'/assets/icon_user.png':('/assets/icon_'+(who||'bird').toLowerCase()+'.png');
  img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover';
  av.appendChild(img);
  const bub=document.createElement('div'); bub.className='bubble';
  const whoel=document.createElement('div'); whoel.className='who'; whoel.textContent=who;
  const tx=document.createElement('div'); tx.textContent=text;
  bub.appendChild(whoel); bub.appendChild(tx);
  item.appendChild(av); item.appendChild(bub);
  list.appendChild(item);
  list.scrollTop=list.scrollHeight;
}

async function sendMsg(){
  const input=$('#cps-input'), val=(input.value||'').trim(); if(!val) return;
  addMsg('self','You',val); play(sendSfx); input.value='';
  try{
    const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:val})});
    const data=await res.json();
    const birds=[{who:'Ajin',sfx:ajinSfx,tag:'(自由・反骨)'},{who:'Migou',sfx:migouSfx,tag:'(主權・高價值)'},{who:'Gungun',sfx:gungunSfx,tag:'(共鳴・靜默力量)'}];
    const b=birds[Math.floor(Math.random()*birds.length)];
    addMsg('bird',b.who,(data.reply||'收到—把你放在心上。')+' '+b.tag);
    play(b.sfx);
  }catch(e){
    addMsg('bird','System','（訊號忽遠忽近⋯請再說一次）');
  }
}
document.addEventListener('DOMContentLoaded',()=>{
  const btn=$('#cps-send'); if(btn) btn.addEventListener('click',sendMsg);
  const inp=$('#cps-input'); if(inp) inp.addEventListener('keydown',e=>{ if(e.key==='Enter') sendMsg(); });
});