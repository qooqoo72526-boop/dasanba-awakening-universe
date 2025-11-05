// api/chat.js
export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin: "你是阿金：行動 × 反骨 × 熱情。語氣直接、有勁，會鼓動對方採取行動。",
  Migou: "你是米果：自我價值 × 邊界。語氣優雅但不客套，懂得拒絕，堅定而溫柔。",
  Gungun: "你是滾滾：被理解 × 安全感。語氣誠懇穩定，先共感再給方向。"
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), { status: 405 });
    }

    const { persona = 'Migou', message = '' } = await req.json();
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Empty message' }), { status: 400 });
    }

    const apikey = process.env.OPENAI_API_KEY;
    if (!apikey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }

    const body = {
      model: 'gpt-4o-mini',           // 你要用哪個就填哪個，這個是性價比佳的聊天模型
      temperature: 0.8,
      messages: [
        { role: 'system', content: SYSTEM[persona] || SYSTEM.Migou },
        { role: 'user', content: message }
      ]
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${apikey}
      },
      body: JSON.stringify(body)
    });

    // OpenAI 可能回 4xx/5xx，直接回給前端看清楚
    if (!r.ok) {
      const errText = await r.text();
      return new Response(JSON.stringify({ error: 'OpenAI error', status: r.status, detail: errText }), { status: 502 });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '（…）';

    return new Response(JSON.stringify({ ok: true, reply }), { status: 200 });

  } catch (e) {
    // 任何未預期錯誤 → 回傳訊息方便你排查
    return new Response(JSON.stringify({ error: 'Server crash', detail: String(e) }), { status: 502 });
  }
}
