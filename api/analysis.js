// api/analysis.js
// 靈魂照妖鏡專用：不碰 /api/chat.js

export const config = {
  runtime: "nodejs20.x",
  regions: ["sin1", "hnd1", "icn1"]
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.status(405).json({ ok: false, error: "Method not allowed" });
      return;
    }

    const body = req.body || {};
    const pairs = Array.isArray(body.pairs) ? body.pairs : [];

    const joined = pairs
      .map((item, idx) => {
        const q = String(item.q || "");
        const a = String(item.a || "");
        return `Q${idx + 1}: ${q}\nA${idx + 1}: ${a}`;
      })
      .join("\n\n");

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ ok: false, error: "Missing OPENAI_API_KEY" });
      return;
    }

    const systemPrompt = `
你是一個情緒模式分析師。風格要求：
- 不官腔、不心靈雞湯、不用「深度解析模式」「系統視角」這種詞。
- 可以直接講重點，但不要羞辱當事人。
- 不是叫人「正向思考」，而是說出他現在的模式、在保護什麼、可以怎麼調整。

請只輸出 JSON，格式如下：

{
  "analysis": "約 600 字，分 3~4 段，說明：1) 目前情緒與關係模式 2) 這些反應背後在守護什麼 3) 如果想對自己誠實，接下來可以怎麼做。",
  "ajin": "一句話，像阿金：行動派、反骨，但是站在他這邊的。",
  "migou": "一句話，像米果：懂得價值和界線，提醒他不要再打折自己。",
  "gungun": "一句話，像滾滾：安靜但很懂你，讓人有被理解的感覺。"
}

不要加任何多餘文字，只能輸出 JSON。
    `.trim();

    const userPrompt = `
以下是使用者在「靈魂照妖鏡」裡寫的題目與回答：

${joined}
    `.trim();

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: Bearer ${apiKey}
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });

    const json = await openaiRes.json();
    const raw = json?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { analysis: raw, ajin: "", migou: "", gungun: "" };
    }

    res.status(200).json({
      ok: true,
      analysis: parsed.analysis || raw || "",
      ajin: parsed.ajin || "",
      migou: parsed.migou || "",
      gungun: parsed.gungun || ""
    });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, error: err?.message || "unknown error" });
  }
}
