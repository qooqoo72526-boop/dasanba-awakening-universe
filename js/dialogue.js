
async function postJSON(url, data){
  const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
  return r.json();
}
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('chatform');
  const bubbles = document.querySelector('.bubbles');
  const msg = document.getElementById('msg');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const persona = form.querySelector('input[name="persona"]:checked').value;
    const text = msg.value.trim();
    if(!text) return;
    const me = document.createElement('div'); me.className='me'; me.textContent=text; bubbles.appendChild(me);
    msg.value='';
    let res = await postJSON('/api/chat', { persona, message: text});
    const ai = document.createElement('div'); ai.className='ai'; ai.textContent = res.reply || '（我在聽）'; bubbles.appendChild(ai);
    bubbles.scrollTop = bubbles.scrollHeight;
  });
});
