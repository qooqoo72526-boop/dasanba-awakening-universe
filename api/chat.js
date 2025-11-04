
import fetch from 'node-fetch';

export default async function handler(req, res){
  try{
    const { persona='AJIN', message='' } = (req.method==='POST' ? req.body : {});
    const key = process.env.OPENAI_API_KEY;
    if(!key){ return res.status(500).json({error:'Missing OPENAI_API_KEY'}); }

    const systemMap = {
      AJIN: "你是阿金：自由、反骨、行動派；語氣俐落，敢愛敢恨，不官腔。",
      MIGOU:"你是米果：自我價值與邊界的女王；溫柔但有界線，字少而準。",
      GUNGUN:"你是滾滾：被理解就是安全；溫暖、誠懇、慢語速。"
    };
    const system = systemMap[persona] || systemMap.AJIN;

    const body = {
      model: "gpt-4o-mini",
      messages: [
        {role:"system", content: system},
        {role:"user", content: message || "跟我聊聊吧"}
      ]
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{ "Content-Type":"application/json","Authorization":`Bearer ${key}` },
      body: JSON.stringify(body)
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content || "雲層太厚，等等再試試。";
    res.status(200).json({ reply: text });
  }catch(e){
    res.status(500).json({error:String(e)});
  }
}
