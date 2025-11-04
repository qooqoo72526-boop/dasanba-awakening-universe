
export default async function handler(req, res) {
  try{
    if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
    const { answers } = req.body || {};
    const key = process.env.OPENAI_API_KEY;
    if(!key) return res.status(500).json({error:'Missing OPENAI_API_KEY'});
    const prompt = `你是一位覺醒教練。根據以下25題的作答，寫出一段約600-800字的深層解析，語氣要敢愛敢恨、直接、有邊界，不空泛；最後分別給出阿金/米果/滾滾各一句箴言，各不超過20字。\n\n作答：\n${JSON.stringify(answers, null, 2)}`;
    const resp = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization":`Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model:"gpt-4o-mini",
        messages:[{role:"system",content:"風格：黑金宇宙、誠實、不要官腔。"}, {role:"user", content: prompt}],
        temperature:0.75
      })
    });
    const data = await resp.json();
    if(data.error) return res.status(500).json({error:data.error});
    const text = data.choices?.[0]?.message?.content || "…星際連線延遲，稍後再試。";
    return res.status(200).json({analysis:text});
  }catch(e){
    return res.status(500).json({error:e?.message || 'Server error'});
  }
}
