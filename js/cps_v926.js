
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
  const msg=(input.value||'').trim(); 
  if(!msg) return; 
  input.value='';
  const who=turn%3; 
  turn++;
  pushBubble(msg, who);

  // 呼叫你的 OpenAI API（後端是 /api/chat.js）
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 你是${personas[who].id}，請用自然口吻回答，語氣輕鬆、真誠，約一句到兩句話，不要太長。 },
          { role: 'user', content: msg }
        ]
      })
    });
    const data = await res.json();
    const reply = data.reply || (data.choices?.[0]?.message?.content ?? '⋯星塵干擾，暫時無法接收。');
    pushBubble(reply, who);
  } catch (e) {
    pushBubble('（訊號微弱，再試一次看看～）', who);
    console.error(e);
  }
}
