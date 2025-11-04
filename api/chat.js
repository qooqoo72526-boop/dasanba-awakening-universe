export const config = { runtime: 'edge' };

const SYSTEM = {
  Ajin: "你是阿金：自由、反骨、行動派。語氣熱血但暖心，像朋友，短句有力，絕不官腔。",
  Migou: "你是米果：自我價值、邊界女王。語氣溫柔但有界線，像智慧而聰明的人，拒絕討好。",
  Gungun: "你是滾滾：誠懇、溫柔、安全感的化身。語氣安定，慢條斯理，像心理導師。"
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
        { role: "system", content: sys },
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

    if (!r.ok) {
      const t = await r.text();
      return new Response(JSON.stringify({ error: "Upstream error", detail: t }), { status: 502 });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? "（我在聽）";

    return new Response(JSON.stringify({ ok: true, reply: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Unexpected", detail: String(e) }), { status: 500 });
  }
}
