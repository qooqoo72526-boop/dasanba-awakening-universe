// api/analysis.js
// 靈魂照妖鏡後端：接收 pairs，丟給 OpenAI，回傳深度解析＋三鳥一句話

export const config = {
  runtime: "edge",
  regions: ["sin1", "hnd1", "icn1"], // 你固定要的三區
};

const SYSTEM_PROMPT = `
你是「大三巴覺醒宇宙」的情緒覺醒引導 AI。

口氣設定：
- 不官方、不心靈雞湯、不勸人冷靜。
- 敢講實話，但不羞辱當事人。
- 可以有一點壞、嘴巴有點毒，但本質是站在當事人這邊。
- 像一個看透人性的朋友：會挺你，也會拆穿你自欺的地方。

任務：
使用者會給你多組 {q, a}：
- q：題目（中文）
- a：使用者對自己的誠實描述（中文）

你要輸出兩個層次：

1) 深度解析（analysis）——約 600 字中文：
   - 給出「現在的情緒模式」與「長期習慣」的觀察。
   - 指出他哪裡在硬撐、哪裡在委屈自己。
   - 幫他拆解：他真正想守護的是什麼（自尊、安全感、愛、自由…）。
   - 最後給一段「如果你真的想對自己好一點，可以從哪一小步開始」。
   - 不要出現「以下是解析」、「結論如下」、「建議你」等官腔字眼。

2) 三隻鳥的一句話（ajin / migou / gungun）：
   - AJIN：直球、反骨、行動派，可以有點兇，但站在他這邊。
   - MIGOU：幫他守價值、幫他拉邊界，像在說「你很值錢，不要糟蹋自己」。
   - GUNGUN：理解與安撫，講的是安全感與被理解，而不是要他乖乖改變。

輸出格式：
請只輸出 JSON，不要多解釋：

{
  "analysis": "...",
  "ajin": "...",
  "migou": "...",
  "gungun": "..."
}
`;

async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ ok: false, error: "Missing OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const pairs = Array.isArray(body.pairs) ? body.pairs : [];

    const compact = pairs
      .map((p, idx) => {
        const q = (p.q || "").trim();
        const a = (p.a || "").trim();
        if (!q && !a) return "";
        return `#${idx + 1}\nQ: ${q}\nA: ${a}`;
      })
      .filter(Boolean)
      .join("\n\n");

    const userPrompt = compact || "使用者沒有提供明確文字，只是丟給你現在的狀態，請你直覺解讀。";

    const payload = {
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    };

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return new Response(JSON.stringify({ ok: false, error: "upstream_error", detail: text }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || "";

    // 嘗試把 model 回傳的 JSON 抽出
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // 如果他沒照 JSON 給，就包成整段 analysis，三鳥留白
      parsed = {
        analysis: content,
        ajin: "",
        migou: "",
        gungun: "",
      };
    }

    return new Response(
      JSON.stringify({
        ok: true,
        analysis: parsed.analysis || "",
        ajin: parsed.ajin || "",
        migou: parsed.migou || "",
        gungun: parsed.gungun || "",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "exception", detail: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default handler;
