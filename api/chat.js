export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin:   "你是阿金：反骨 × 行動力 × 帶頭衝。語氣直、敢講、不要官腔。",
  Migou:  "你是米果：自我價值 × 邊界。語氣高冷俐落、刀法精準，但有保護愛的人那面。",
  Gungun: "你是滾滾：誠懇 × 安全感 × 被理解。語氣溫厚誠實，先共情再給方向。"
};

export default async function handler(req) {
  // 只接受 POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok:false, error:'POST only' }), { status:405 });
  }

  // 解析 body
  let persona = 'Migou', message = '';
  try {
    const j = await req.json();
    persona = (j.persona || 'Migou').trim();
    message = (j.message || '').trim();
  } catch (_) {}

  if (!message) {
    return new Response(JSON.stringify({ ok:false, error:'Empty message' }), { status:200 });
  }

  const apikey = process.env.OPENAI_API_KEY;
  if (!apikey) {
    // 明確告知缺 key（你已經設了就會過）
    return new Response(JSON.stringify({ ok:false, error:'Missing OPENAI_API_KEY' }), { status:200 });
  }

  // 建立 Chat Completions 請求
  const body = {
    model: 'gpt-4o-mini',
    temperature: 0.7,
    messages: [
      { role:'system', content: SYSTEM[persona] || SYSTEM.Migou },
      { role:'user',   content: message }
    ]
  };

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const detail = await r.text();
      // 不回 4xx/5xx，改統一 200 + JSON，避免前端報「網路錯誤」
      return new Response(JSON.stringify({
        ok:false,
        error:'Upstream OpenAI error',
        status:r.status,
        detail
      }), { status:200 });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || '...';
    return new Response(JSON.stringify({ ok:true, reply }), { status:200 });

  } catch (err) {
    return new Response(JSON.stringify({
      ok:false,
      error:'Server exception',
      detail:String(err)
    }), { status:200 });
  }
}
