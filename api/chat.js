export const config = {
  runtime: 'edge',
  regions: ['sin1','hnd1','icn1']
};

const SYSTEM = {
  Ajin:  '你是阿金：行動派、反骨熱情，語氣直接但善意，會推人一把去行動。',
  Migou: '你是米果：自我價值與邊界女王，溫柔但很有界線，會教人設好界線與自尊。',
  Gungun:'你是滾滾：誠懇安定的陪伴者，先理解再引導，讓人有安全感。'
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok:false, error:'POST only' }), { status:405 });
    }

    const apikey = process.env.OPENAI_API_KEY;
    if (!apikey) {
      return new Response(JSON.stringify({ ok:false, error:'Missing OPENAI_API_KEY' }), { status:500 });
    }

    // 讀取前端 body
    const payload = await req.json().catch(() => ({}));

    // --- 兼容兩種呼叫方式 ---
    let messages = payload?.messages;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      // 走 persona + message 的老格式
      const persona = payload?.persona || 'Migou';
      const userMsg = (payload?.message || '').toString().trim();
      if (!userMsg) {
        return new Response(JSON.stringify({ ok:false, error:'Empty message' }), { status:400 });
      }
      const sys = SYSTEM[persona] || SYSTEM.Migou;
      messages = [
        { role: 'system', content: sys },
        { role: 'user',   content: userMsg }
      ];
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages
      })
    });

    const text = await r.text();
    if (!r.ok) {
      return new Response(JSON.stringify({ ok:false, error:'OpenAI error', detail:text }), { status: r.status || 500 });
    }

    let data;
    try { data = JSON.parse(text); } catch {
      return new Response(JSON.stringify({ ok:false, error:'Invalid JSON from OpenAI', detail:text }), { status:502 });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim?.() || '';
    return new Response(JSON.stringify({ ok:true, reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:'Server crash', detail:String(err) }), { status:500 });
  }
}
