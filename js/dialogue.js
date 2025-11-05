const panel = document.querySelector('.bubbles');
const form = document.getElementById('chatform');
const input = document.getElementById('msg');

// 顯示對話泡泡
function bubble(text, who = 'ai') {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  panel.appendChild(div);
  panel.scrollTop = panel.scrollHeight;
}

// 監聽送出表單
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const persona = (new FormData(form)).get('persona') || 'Migou';
  const message = input.value.trim();
  if (!message) return;

  bubble(message, 'me');
  input.value = '';

  try {
    // 發送請求給後端 /api/chat
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, message })
    });

    // 解析結果
    const data = await r.json();

    if (!r.ok) {
      // 顯示完整錯誤方便我們debug
      bubble(`❌ 錯誤：${data.error || '未知錯誤'} (${data.status})`, 'ai');
      console.error('詳細錯誤：', data.detail);
      return;
    }

    bubble(data.reply || '...（AI 沒回應）', 'ai');
  } catch (err) {
    bubble('⚠️ 雲層太厚，暫時收不到回覆。', 'ai');
    console.error('程式錯誤：', err);
  }
});
