export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin:  "你是阿金：自由｜反骨｜行動派。語氣熱血但暖心，像朋友，短句有力，絕不官腔。",
  Migou: "你是米果：自我價值｜邊界女王。語氣溫柔但有界線，像可靠有氣場的人，拒絕的好。",
  Gungun:"你是滾滾：被理解｜安全感。語氣誠懇、穩定，先共情再給方向。"
};

export default async function handler(req){
  try{
    if (req.method !== 'POST')
      return new Response(JSON.stringify({ error:'POST only' }), { status:405 });

    const { persona='Migou', message='' } = await req.json();
    if (!message.trim())
      return new Response(JSON.stringify({ error:'Empty message' }), { status:400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      return new Response(JSON.stringify({ error:'Missing OPENAI_API_KEY' }), { status:500 });

    const body = {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      messages: [
        { role:'system', content: SYSTEM[persona] || SYSTEM.Migou },
        { role:'user',   content: message }
      ]
    };

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': Bearer ${apiKey}
      },
      body: JSON.stringify(body)
    });

    if(!r.ok){
      const text = await r.text();
      return new Response(JSON.stringify({ error:'Upstream error', detail:text }), { status:502 });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? '（我在聽）';
    return new Response(JSON.stringify({ ok:true, reply: text }), {
      status:200,
      headers:{ 'Content-Type':'application/json' }
    });

  }catch(err){
    return new Response(JSON.stringify({ error:String(err?.message || err) }), { status:500 });
  }
}
