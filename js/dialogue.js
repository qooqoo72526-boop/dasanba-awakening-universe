(function () {
  const form = document.getElementById('chatform');
  const bubbles = document.querySelector('.bubbles .panel'); // 你頁面裡的訊息容器
  const radios = document.querySelectorAll('input[name="persona"]');

  function currentPersona() {
    for (const r of radios) if (r.checked) return r.value;
    return 'Migou';
  }

  function addBubble(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'me' : 'ai');
    div.textContent = text;
    bubbles.appendChild(div);
    bubbles.scrollTop = bubbles.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // 重要：不要讓表單做預設導航（會變成 GET）
    const input = document.getElementById('msg');
    const message = (input.value || '').trim();
    if (!message) return;

    const persona = currentPersona();
    addBubble('user', message);
    input.value = '';

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, message })
      });

      const data = await r.json();
      if (!r.ok || !data.ok) {
        addBubble('ai', '（連線忙線中，等等我再回你…）');
        console.error('Chat error', data);
        return;
      }
      addBubble('ai', data.reply);
    } catch (err) {
      addBubble('ai', '（我這邊斷線了一下，再試一次）');
      console.error(err);
    }
  });
})();
