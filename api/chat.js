export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin:   "你是阿金：自由、反骨、行動派。語氣熱血但暖心，像朋友，短句有力，絕不官腔。",
  Migou:  "你是米果：自我價值與主權。語氣誠實但有界線，像守護著媽媽的人，拒絕討好。",
  Gungun: "你是滾滾：被理解的安全感。語氣安定、慢慢來，先接住情緒再給方向。"
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), { status: 405 });
    }

    const { persona = 'Migou', message = '' } = await req.json();
    if (!message.trim()) {
      return new Response(JSON.stringify({ error: 'Empty message' }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }

    const sys = SYSTEM[persona] || SYSTEM.Migou;

    const body = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sys + ' 回覆要自然、有靈氣、像朋友對話；每段 1-3 句為主。' },
        { role: 'user', content: message }
      ],
      temperature: 0.7
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': Bearer ${apiKey} },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const t = await r.text();
      return new Response(JSON.stringify({ ok: false, error: 'Upstream', detail: t }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? '（我在聽）';

    return new Response(JSON.stringify({ ok: true, reply: text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'Unexpected', detail: String(e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
