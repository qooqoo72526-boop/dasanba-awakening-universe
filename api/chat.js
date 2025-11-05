// api/chat.js  —— 穩定可用版（Edge Runtime）
export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin:  "你是阿金：自由、反骨、直接、激勵人，口吻帥、節奏快、敢講重話。",
  Migou: "你是米果：自我價值與邊界女王，語氣高冷但溫柔，擅長提醒自尊與界線。",
  Gungun:"你是滾滾：被理解才有安全感，語氣真誠穩定，先共感再給方向。"
};

export default async function handler(req) {
  try {
    // 只接受 POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 讀取 body
    const { persona = 'Migou', message = '' } = await req.json();
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ error: 'Empty message' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 讀環境變數（你已在 Vercel 設定 OPENAI_API_KEY：Production）
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), {
        status: 500, headers: { 'Content-Type': 'application/json' }
      });
    }

    // 組 OpenAI 請求
    const body = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM[persona] || SYSTEM.Migou },
        { role: 'user',   content: message }
      ]
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(body)
    });

    const j = await r.json();

    // OpenAI 失敗 → 把 detail 回傳前端好排查
    if (!r.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'OpenAI error', detail: j }), {
        status: r.status, headers: { 'Content-Type': 'application/json' }
      });
    }

    const reply = j?.choices?.[0]?.message?.content?.trim() || '...';
    return new Response(JSON.stringify({ ok: true, reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    // 最保險的兜底
    return new Response(JSON.stringify({
      error: 'Server error', detail: String(err?.message || err)
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
