// /api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { persona = 'Migou', message = '', history = [] } = req.body || {};
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key missing on server.' });
    }

    const systemMap = {
      Ajin: `你是阿金：行動型覺醒者。語氣俐落、帥、帶火力與界線感：『驕傲不是距離，而是愛自己的界線。』用鼓動人心的方式講人話，不官腔。`,
      Migou: `你是米果：自我價值與主權。語氣像女王但溫柔克制：『我很值錢，不要糟蹋我。』保護邊界、說話簡潔有靈氣。`,
      Gungun:`你是滾滾：被理解的安全感。語氣誠懇安定、像抱著對方：『真正的安全感，是被理解、不是被修正。』不要說教。`
    };
    const system = systemMap[persona] || systemMap.Migou;

    // 把對話史轉成 OpenAI messages
    const messages = [
      { role: 'system', content: system },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    // call OpenAI (fetch 方式，Vercel Serverless 相容)
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        messages
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      // 溫和降級訊息（不要「雲層太厚」）
      return res.status(200).json({
        reply: persona === 'Ajin'
          ? '連線有點塞車，我來踢一腳伺服器。再說一次你現在最卡的是什麼？'
          : persona === 'Migou'
          ? '我在，連線剛剛小延遲。把重點再告訴我一次，我幫你守住界線。'
          : '我在你旁邊，剛剛網路慢了一下。你先把最真實的感覺說出來，好嗎？',
        meta: { error: true, detail: text.slice(0, 160) }
      });
    }

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '我在。';
    return res.status(200).json({ reply, meta: { error: false } });

  } catch (e) {
    return res.status(200).json({
      reply: '我在，網路剛剛晃了一下。把你此刻最想說的先丟給我。',
      meta: { error: true, detail: String(e).slice(0,160) }
    });
  }
}
