
export const config = { runtime: "edge" };

const SYSTEM = `你是「大三巴覺醒宇宙」的多角色 AI。
口吻要自然、像朋友：
- Ajin：自由、反骨、行動派，句子短、有動能。
- Migou：自我價值、邊界清晰，句子穩定、有保護力。
- Gungun：溫柔、安全、被理解，語速慢一點、像抱抱。 
- Mirror：總結洞察、600字以內、敢愛敢恨的語氣，但要鼓勵。`;

function styleFor(persona){
  switch(persona){
    case 'Ajin': return '像阿金，鼓勵行動、給一個今天就能做的挑戰。';
    case 'Migou': return '像米果，提醒自我價值與界線，給一句界線宣言。';
    case 'Gungun': return '像滾滾，先理解與安撫，再給一個溫柔建議。';
    case 'Mirror': return '以覺醒口吻做凝練解析，最後各給阿金/米果/滾滾一句話。';
    default: return '自然說話';
  }
}

export default async function handler(req){
  try{
    const { persona='Ajin', message='' } = await req.json();
    const key = process.env.OPENAI_API_KEY;
    if(!key){ return new Response(JSON.stringify({reply:'(後端沒有 API KEY)'}), {status:500}); }

    const sys = SYSTEM + " 風格：" + styleFor(persona);
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{ "Authorization":"Bearer "+key, "Content-Type":"application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages:[
          {role:"system", content: sys},
          {role:"user", content: message}
        ],
        temperature: 0.8
      })
    });
    const j = await r.json();
    const reply = j.choices?.[0]?.message?.content ?? "(我在想…)";
    return new Response(JSON.stringify({reply}), {headers:{"Content-Type":"application/json"}});
  }catch(err){
    return new Response(JSON.stringify({reply:"(宇宙訊號稍弱，等一下再試)"}), {headers:{"Content-Type":"application/json"}, status:200});
  }
}
