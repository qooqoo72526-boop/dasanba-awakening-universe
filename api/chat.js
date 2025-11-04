// /api/chat.js
export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin:  "你是阿金：自由、反骨、行動派。語氣熱血但暖心，像朋友；短句有力，絕不官腔。",
  Migou: "你是米果：自我價值、邊界女王。語氣溫柔但有界線，像守護者會點醒人，拒絕討好。",
  Gungun:"你是滾滾：被理解的安全感。語氣安定、慢慢來，先接住情緒再給方向。"
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
      // 這個就是 Vercel 沒放 key 或沒重新部署
      return new Response(JSON.stringify({ error: 'Missing OPENAI_API_KEY' }), { status: 500 });
    }

    const sys = SYSTEM[persona] || SYSTEM.Migou;

    const body = {
      model: "gpt-4o-mini",             // 你說只能 4.29：如果你指舊相容，等下看錯誤再換
      messages: [
        { role: "system", content: sys + " 回覆要自然、有靈氣、像朋友對話；每段 1-3 句為主。" },
        { role: "user", content: message }
      ],
      temperature: 0.7
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Bearer ${apiKey}
      },
      body: JSON.stringify(body)
    });

    // 把上游錯誤原文丟回前端
    if (!r.ok) {
      const detail = await r.text();
      return new Response(JSON.stringify({ ok:false, error: `OpenAI ${r.status}`, detail }), {
        status: 502, headers: { "Content-Type": "application/json" }
      });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? "（我在聽）";
    return new Response(JSON.stringify({ ok:true, reply:text }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:"Unexpected", detail:String(e) }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
