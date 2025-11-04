
// Simple persona chat
const out = document.querySelector('.bubbles');
const form = document.querySelector('#chatForm');
const input = document.querySelector('#msg');
const personaRadios = document.querySelectorAll('input[name="persona"]');

function bubble(text, me=false){
  const d = document.createElement('div');
  d.className = 'msg' + (me ? ' me' : '');
  d.textContent = text;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const persona = [...personaRadios].find(r=>r.checked)?.value || 'Migou';
  const message = input.value.trim();
  if(!message) return;
  bubble(message, true);
  input.value='';
  try{
    const r = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ persona, message })});
    const data = await r.json();
    bubble(data.reply || '[…]');
  }catch(err){
    bubble('（連線過載，等等再試）');
  }
});
