// /js/dialogue.js
const form = document.getElementById('chatform');
const panel = document.querySelector('.bubbles');
const input = document.getElementById('msg');
const radios = document.querySelectorAll('input[name=persona]');

function bubble(text, who){
  const div = document.createElement('div');
  div.className = 'me ' + (who==='bot' ? 're' : '');
  div.textContent = text;
  panel.appendChild(div);
  panel.scrollTop = panel.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const persona = [...radios].find(r=>r.checked)?.value || 'Migou';
  const message = input.value.trim();
  if (!message) return;

  bubble(message, 'me');
  input.value = '';

  try {
    const r = await fetch('/api/chat', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ persona, message })
    });
    const data = await r.json();

    if (data.ok) {
      bubble(data.reply || '（我在聽）', 'bot');
    } else {
      // 把真正錯誤印出來（含 OpenAI 回傳字串）
      bubble(`【錯誤】${data.error || ''} ${data.detail || ''}`, 'bot');
    }
  } catch (err) {
    bubble(`【連線錯誤】${String(err)}`, 'bot');
  }
});
