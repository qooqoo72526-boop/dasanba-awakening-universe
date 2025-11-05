export const config = { runtime: 'nodejs' };

// 三鳥系統提示
const SYSTEM = {
  Ajin:  "你是阿金：反骨又熱情…（此處可放你的長系統詞）",
  Migou: "你是米果：自我價值與界線…",
  Gungun:"你是滾滾：被理解的安全感…"
};

export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok:false, error: 'POST only' }), { status:405 });
    }

    const { persona = 'Migou', message = '' } = await req.json();
    if (!message.trim()) {
      return new Response(JSON.stringify({ ok:false, error: 'Empty message' }), { status:400 });
    }

    const apikey = process.env.OPENAI_API_KEY;   // 注意名稱
    if (!apikey) {
      return new Response(JSON.stringify({ ok:false, error: 'Missing OPENAI_API_KEY' }), { status:500 });
    }

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
        'Authorization': `Bearer ${apikey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    // 把 OpenAI 的錯誤完整帶回來，方便判斷 403/其他
    if (!r.ok) {
      const detail = await r.text().catch(()=> '(no text)');
      return new Response(JSON.stringify({ ok:false, error:'OpenAI error', status:r.status, detail }), { status: r.status });
    }

    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || '…';
    return new Response(JSON.stringify({ ok:true, reply }), { status:200 });

  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:'Server crash', detail: String(err) }), { status:500 });
  }
}
