
document.addEventListener('DOMContentLoaded', ()=>{
  const list=document.querySelector('.cps-list');
  const input=document.querySelector('.cps-input input');
  const btn=document.querySelector('.cps-input button');
  const snd=new Audio('assets/sound/bubble_soft.wav'); snd.volume=.18;
  const personas=[
    {id:'AJIN',tag:'（阿金）',style:'font-weight:700'},
    {id:'MIGOU',tag:'（米果）',style:'opacity:.95'},
    {id:'GUNGUN',tag:'（滾滾）',style:'opacity:.95'}
  ]; let turn=0;
  function pushBubble(text,who){
    const b=document.createElement('div'); b.className='cps-bubble';
    b.innerHTML=`<span style="${personas[who].style}">${personas[who].tag}</span> ${text}`;
    list.appendChild(b); list.scrollTop=list.scrollHeight; snd.currentTime=0; snd.play().catch(()=>{});
  }
  async function send(){
    const msg=(input.value||'').trim(); if(!msg) return; input.value='';
    const who=turn%3; turn++;
    pushBubble(msg, who);
    setTimeout(()=>pushBubble('收到，星訊已同步。', who), 450);
  }
  btn.addEventListener('click',send);
  input.addEventListener('keydown',e=>{ if(e.key==='Enter') send();});
});
