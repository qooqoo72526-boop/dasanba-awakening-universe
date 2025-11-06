// api/chat.js  — v921 stable

export const config = {
  runtime: "edge",
  regions: ["sin1", "hnd1", "icn1"], // 你固定的三區，避免 403
};

// 角色系統提示（保持你的品牌語氣）
const SYSTEM = {
  ajin: `你是阿金（AJIN）。定位：自由・反骨・能量光束。語氣：俐落、熱血、不官腔、像朋友。回答短一些、鼓動人行動，但要尊重邊界。`,
  migou: `你是米果（MIGOU）。定位：主權・高價值・邊界。語氣：柔亮又果斷、不取悅、講究自我價值。給對方溫柔但清楚的提醒。`,
  gungun: `你是滾滾（GUNGUN）。定位：共鳴・靜默力量。語氣：溫暖、被理解先於修正。多用「我懂你」的開場，讓人安心。`,
};

// 安全取值
const pick = (obj, key, fallback) =>
  (obj && typeof obj[key] !== "undefined" ? obj[key] : fallback);

// 共用呼叫：單一角色一次請求
async function askOne({ apikey, role, userMsg }) {
  const sys = SYSTEM[role] || SYSTEM.migou;
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apikey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: userMsg },
      ],
    }),
  });

  if (!r.ok) {
    const detail = await r.text().catch(() => "");
    // 失敗也回自然語句，避免前端空白
    return `（${role.toUpperCase()} 訊號微弱，稍後再試｜${detail.slice(0, 80)}）`;
  }

  const data = await r.json().catch(() => ({}));
  return (
    pick(pick(data, "choices", [])[0] || {}, "message", {}).content?.trim() ||
    "（收到你的訊息了。）"
  );
}

export default async function handler(req) {
  try {
    if (req.method !== "POST") {
      return new Response("POST only", { status: 405 });
    }

    const apikey = process.env.OPENAI_API_KEY;
    if (!apikey) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing OPENAI_API_KEY" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 兼容不同前端格式：{message, personas[]} 或 {messages: [...]}
    const payload = (await req.json().catch(() => ({}))) || {};
    let userMsg = payload.message;

    // 若前端是舊版 messages 陣列，幫你轉為單一 user 內容
    if (!userMsg && Array.isArray(payload.messages)) {
      const lastUser = payload.messages
        .slice()
        .reverse()
        .find((m) => m.role === "user");
      userMsg = lastUser?.content;
    }

    userMsg = (userMsg || "").toString().trim();
    if (!userMsg) {
      return new Response(
        JSON.stringify({ ok: false, error: "Empty message" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // personas：若沒給，就同時回三鳥
    const personas = Array.isArray(payload.personas) && payload.personas.length
      ? payload.personas
      : ["ajin", "migou", "gungun"];

    // 併發請求，提升速度
    const tasks = personas.map((p) =>
      askOne({ apikey, role: String(p).toLowerCase(), userMsg })
    );
    const answers = await Promise.all(tasks);

    // 組回應：沒有的角色就不塞
    const res = { ok: true };
    personas.forEach((p, i) => {
      const key = String(p).toLowerCase();
      if (key.includes("ajin")) res.ajin = answers[i];
      else if (key.includes("migou")) res.migou = answers[i];
      else if (key.includes("gungun")) res.gungun = answers[i];
      else res[key] = answers[i];
    });

    // 確保三鳥鍵位存在（前端好綁音效）
    res.ajin = res.ajin || "（AJIN 正在對齊你的頻道…）";
    res.migou = res.migou || "（MIGOU 正在調整你的主權邊界…）";
    res.gungun = res.gungun || "（GUNGUN 在旁溫柔陪伴…）";

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server crash", detail: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
