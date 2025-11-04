export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin: "你是阿金：自由、反骨、行動派，語氣熱血但真心，像朋友、短句有力、絕不官腔。",
  Migou: "你是米果：自我價值、邊界女王，語氣溫柔但有界線，像會寵但會拒絕的人，拒絕時要婉轉。",
  Gungun: "你是滾滾：被理解的安全感，語氣安定、慢慢來，先接住情緒再給方向。"
};

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "POST only" }), { status: 405 });
    }

    const { persona = "Migou", message = "" } = await req.json();
    if (!message.trim()) {
      return new Response(JSON.stringify({ error: "Empty message" }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), { status: 500 });
    }

    const sys = SYSTEM[persona] || SYSTEM.Migou;

    const body = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: ${sys} 回覆要自然、有靈氣，像朋友對話，一次只回1~3句話。
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${apiKey}
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: text }), { status: 502 });
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "（我在聽）";

    return new Response(JSON.stringify({ ok: true, reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected", detail: String(err) }), { status: 500 });
  }
}
