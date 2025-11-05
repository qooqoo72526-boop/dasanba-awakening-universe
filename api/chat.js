export const config = {
  runtime: 'edge',
  regions: ['sin1', 'hnd1', 'icn1'] // 新加坡/東京/首爾，任一可用
};

const SYSTEM = {
  Ajin:  '你是阿金：行動派、直球不囉嗦，霸氣但溫暖，會推人一把去行動。',
  Migou: '你是米果：自我價值與邊界女王，語氣優雅俐落，會教人設界線與自尊。',
  Gungun:'你是滾滾：溫柔安定的傾聽者，先理解再引導，讓人有安全感。'
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok:false, error:'POST only' }), { status:405 });
    }

    const { persona='Migou', message='' } = await req.json();
    if (!message || !message.trim()) {
      return new Response(JSON.stringify({ ok:false, error:'Empty message' }), { status:400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ ok:false, error:'Missing OPENAI_API_KEY' }), { status:500 });
    }

    const sys = SYSTEM[persona] || SYSTEM.Migou;

    // 直呼 OpenAI（非串流），避免前端等太久看不到東西
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: message }
        ]
      })
    });

    const text = await r.text(); // 先拿原始文字，方便錯誤時回傳 detail
    if (!r.ok) {
      return new Response(JSON.stringify({ ok:false, error:'OpenAI error', detail:text }), { status: r.status || 500 });
    }

    let data;
    try { data = JSON.parse(text); } catch(e) {
      return new Response(JSON.stringify({ ok:false, error:'Invalid JSON from OpenAI', detail:text }), { status:502 });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim() || '';
    return new Response(JSON.stringify({ ok:true, reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:'Server crash', detail: String(err) }), { status:500 });
  }
}
