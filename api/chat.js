// /api/chat.js  — Vercel Edge + Regions ['sin1','hnd1','icn1']
// 用法：前端 POST /api/chat ，body: { mode: 'post' | 'mirror' | 'room', text, history }
// - mode='post'  ：宇宙郵局（朋友語氣、逐字輸出）
// - mode='mirror'：靈魂照妖鏡（抽題/回覆 → 600字深度解析）
// - mode='room'  ：進入單一角色房間時的對話（延續該角色語氣）
// 其他欄位可帶：persona: 'ajin'|'migou'|'gungun'（room 模式時）
//
// 必要環境變數：OPENAI_API_KEY
// 注意：請在 vercel.json 設定 regions 與路由（已示範）

export const config = {
  runtime: 'edge',
  regions: ['sin1','hnd1','icn1'],
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ---- 三鳥人設（朋友語氣、自然口吻） ----
const PARROTS = {
  ajin: {
    name: '阿金',
    heart: '💛',
    style: '直球、熱血、行動派、反骨，但像朋友一樣講話',
    rule:  '語氣自然，避免官腔；多用短句；允許表情符號；標點只用逗號、句號、驚嘆號',
  },
  migou: {
    name: '米果',
    heart: '🧡',
    style: '高傲可愛、主權邊界、講話真心直接，不討好',
    rule:  '語氣自然，避免官腔；多用短句；允許表情符號；標點只用逗號、句號、驚嘆號',
  },
  gungun: {
    name: '滾滾',
    heart: '💙',
    style: '溫柔誠懇、共鳴與理解、慢慢回應，像在安撫',
    rule:  '語氣自然，避免官腔；多用短句；允許表情符號；標點只用逗號、句號、驚嘆號',
  }
};

// ---- 共用系統規則 ----
const BASE_SYSTEM = `你是三隻靈魂鳥的「朋友語氣」文字導演。
禁用官方口吻、禁用說教、禁用模板化結尾。
可用表情符號，但不要太多。
只用逗號、句號、驚嘆號，不要頓號、引號、括號、破折號等。
每則輸出要自然、口語、接地氣。`;

// ---- 鏡子模式系統規則 ----
const MIRROR_SYSTEM = `你是「靈魂照妖鏡🪞」分析者。口吻：敢愛敢恨、坦白直說、但不羞辱。
請輸出約 600 字的深度解析，分成 3-5 段，包含：
1) 使用者當下的核心張力與盲點
2) 可立即採取的一個行動
3) 三隻鳥各自給一句「不官腔」的提醒（阿金、米果、滾滾）
只用逗號、句號、驚嘆號。避免官腔與模板。`;

// ---- 小工具：流式轉發 OpenAI ----
async function streamOpenAI(messages, { model = 'gpt-4o-mini', temperature = 0.8 } = {}) {
  if (!OPENAI_API_KEY) {
    return new Response('Missing OPENAI_API_KEY', { status: 500 });
  }
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature,
      stream: true,
      messages
    })
  });

  if (!resp.ok || !resp.body) {
    const t = await resp.text().catch(()=> '');
    return new Response(`OpenAI error: ${resp.status} ${t}`, { status: 500 });
  }

  // 轉發 SSE → 乾淨文字流
  const encoder = new TextEncoder();
  const reader = resp.body.getReader();

  return new Response(
    new ReadableStream({
      async start(controller) {
        let buffer = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += new TextDecoder().decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const json = trimmed.slice(5).trim();
            if (json === '[DONE]') continue;
            try {
              const evt = JSON.parse(json);
              const delta = evt.choices?.[0]?.delta?.content || '';
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {}
          }
        }
        controller.close();
      }
    }),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    }
  );
}

// ---- 產生郵局提示：三鳥輪流，一次只回一位（朋友語氣）----
function buildPostMessages(userText, history = []) {
  // 簡單做「誰先回」的輪替：以歷史長度取模
  const order = ['ajin','migou','gungun'];
  const who = order[history.length % order.length];
  const p = PARROTS[who];

  const sys = `${BASE_SYSTEM}
你現在只扮演「${p.name}${p.heart}」。
風格：${p.style}。規則：${p.rule}。
請以 1~3 句完成，字數精簡，但要有情緒能量與畫面感。`;

  return [
    { role: 'system', content: sys },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userText || '打個招呼吧' }
  ];
}

// ---- 產生房間提示：只用單一角色 ----
function buildRoomMessages(userText, history = [], persona='ajin') {
  const p = PARROTS[persona] || PARROTS.ajin;
  const sys = `${BASE_SYSTEM}
你只扮演「${p.name}${p.heart}」。
風格：${p.style}。規則：${p.rule}。
回覆 1~4 句，專注當下訊息。`;

  return [
    { role: 'system', content: sys },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: userText || '哈囉' }
  ];
}

// ---- 鏡子模式訊息 ----
function buildMirrorMessages(payload) {
  // payload 可帶：answers, notes 等
  const sys = MIRROR_SYSTEM;
  const user = `以下是使用者在「靈魂照妖鏡🪞」的回覆與線索（可含 25 題的選擇摘要）：
${JSON.stringify(payload || {}, null, 2)}
請輸出約 600 字的深度分析，以段落呈現。`;
  return [
    { role: 'system', content: sys },
    { role: 'user', content: user }
  ];
}

// ---- 主處理 ----
export default async function handler(req) {
  try {
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const { mode = 'post', text = '', history = [], persona = 'ajin', mirror = {} } = await req.json().catch(()=> ({}));

    if (mode === 'mirror') {
      // 解析 600 字（不需要逐字打字，直接輸出）
      const messages = buildMirrorMessages(mirror);
      // 這裡直接用非串流，回傳一次
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.85,
          stream: false,
          messages
        })
      });
      if (!resp.ok) {
        const t = await resp.text().catch(()=> '');
        return new Response(`OpenAI error: ${resp.status} ${t}`, { status: 500 });
      }
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content || '';
      return new Response(JSON.stringify({ analysis: content }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (mode === 'room') {
      const messages = buildRoomMessages(text, history, persona);
      return await streamOpenAI(messages, { temperature: 0.8 });
    }

    // 預設：宇宙郵局（輪流一人一句）
    const messages = buildPostMessages(text, history);
    return await streamOpenAI(messages, { temperature: 0.85 });

  } catch (err) {
    return new Response(`Server error: ${err?.message || err}`, { status: 500 });
  }
}
