export const config = {
  runtime: "edge",
  regions: ["sin1", "hnd1", "icn1"], // ✅ 這三個是你地區白名單，避免 403
};

export default async function handler(req) {
  try {
    const { messages } = await req.json();

    // ✅ 驗證你的 API key 是否存在
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY in environment" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ 向 OpenAI 官方 API 發出請求
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ⚙️ 建議使用 4o-mini（穩定、價格低）
        temperature: 0.7,
        messages, // 直接傳入前端對話陣列
      }),
    });

    // ✅ 取回回覆並返回前端
    const data = await completion.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
