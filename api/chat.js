
export default async function handler(req, res) {
  try{
    if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
    const { message, persona } = req.body || {};
    const key = process.env.OPENAI_API_KEY;
    if(!key) return res.status(500).json({error:'Missing OPENAI_API_KEY'});
    const personaMap = {
      ajin: "阿金｜自由×反骨：直球、敢講、會踢你出舒適圈，但不羞辱。",
      migou:"米果｜自我主權×邊界：甜但有界線，保護自我價值，不討好。",
      gungun:"滾滾｜被理解×安全感：溫柔誠懇，慢慢說，讓人放鬆。"
    };
    const sys = `你是大三巴覺醒宇宙中的AI鸚鵡分身。請以${personaMap[persona]||'中立視角'}的語氣回覆，句子短、誠實、敢愛敢恨，不講官話，不過度安慰。`;

    const resp = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          {role:"system", content: sys},
          {role:"user", content: message||"請用一句話提醒我今天的邊界。"}
        ],
        temperature:0.8
      })
    });
    const data = await resp.json();
    if(data.error) return res.status(500).json({error:data.error});
    const text = data.choices?.[0]?.message?.content || "…雲層太厚，等我穿越。";
    return res.status(200).json({reply:text});
  }catch(e){
    return res.status(500).json({error:e?.message || 'Server error'});
  }
}
