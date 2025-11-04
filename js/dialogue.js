window.addEventListener('DOMContentLoaded', () => {
  const form  = document.getElementById('chatform');
  const input = document.getElementById('msg');
  const panel = document.querySelector('.bubbles.panel');
  const personaEls = document.querySelectorAll('input[name="persona"]');

  function currentPersona() {
    const el = [...personaEls].find(e => e.checked);
    return el ? el.value : 'Migou';
  }

  function addBubble(text, who) {
    const div = document.createElement('div');
    div.className = 'bubble ' + (who || 'you');
    div.textContent = text;
    panel.appendChild(div);
    panel.scrollTop = panel.scrollHeight;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    addBubble(message, 'you');
    input.value = '';

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: currentPersona(), message })
      });
      const data = await r.json();
      addBubble(data.reply || '…', 'ai');
    } catch (err) {
      addBubble('（系統忙碌，請稍後再試）', 'ai');
    }
  });
});
