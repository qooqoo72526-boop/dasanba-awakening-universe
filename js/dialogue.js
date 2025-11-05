
const panel = document.querySelector('.bubbles');
const form = document.getElementById('chatform');
const input = document.getElementById('msg');

function bubble(text, who='ai'){
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  panel.appendChild(div);
  panel.scrollTop = panel.scrollHeight;
}

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const persona = (new FormData(form)).get('persona') || 'Migou';
  const message = input.value.trim();
  if(!message) return;
  bubble(message, 'me'); input.value='';
  try{
    const r = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ persona, message })
    });
    const data = await r.json();
    bubble(data.reply || '（……）', 'ai');
  }catch(err){
    bubble('雲層太厚，暫時收不到回訊。', 'ai');
  }
});
