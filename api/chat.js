// ❗這版不要 export config（不使用 edge）
// 讓它跑 Vercel 預設的 Node Serverless Function

const SYSTEM = {
  Ajin:  "你是阿金：自由、反骨、行動派。語氣熱血但暖心，像朋友，短句有力，絕不官腔。",
  Migou: "你是米果：自我價值、邊界女王。語氣溫柔但有界線，像智慧而聰明的人，拒絕討好。",
  Gungun:"你是滾滾：誠懇、溫柔、安全感的化身。語氣安定，慢條斯理，像心理導師。"
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { persona = "Migou", message = "" } = req.body || {};
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Empty message" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const sys = SYSTEM[persona] || SYSTEM.Migou;

    const body = {
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: sys + "（回覆自然、有靈氣、像朋友對話；每段 1~3 句為主。）" },
        { role: "user",   content: message }
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
      return res.status(502).json({ error: "Upstream error", detail: t });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? "（我在聽）";

    return res.status(200).json({ ok: true, reply: text });
  } catch (e) {
    return res.status(500).json({ error: "Unexpected", detail: String(e) });
  }
}
