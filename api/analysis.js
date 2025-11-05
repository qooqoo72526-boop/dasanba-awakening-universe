export const config = { runtime: 'edge' };

export default async function handler(req){
  try{
    if(req.method !== 'POST') return new Response(JSON.stringify({ error:'POST only'}), {status:405});
    const { payload={} } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if(!apiKey){
      // offline summary
      return new Response(JSON.stringify({ ok:true, summary:"（本地範例）你的覺醒能量正在聚焦於：界線、被理解與真話。"}), {status:200});
    }
    const prompt = "請扮演覺醒教練，根據回答生成：1) 三鳥比例（阿金/米果/滾滾，合計100%）2) 300字深度解析 3) 三句金句（各一）。回答格式簡潔。資料："+JSON.stringify(payload);
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method:"POST",
      headers:{ "Content-Type":"application/json", "Authorization":`Bearer ${apiKey}` },
      body: JSON.stringify({ model:"gpt-4o-mini", messages:[{role:"user", content: prompt}], temperature:0.7 })
    });
    const j = await r.json();
    const text = j.choices?.[0]?.message?.content ?? "（分析完成）";
    return new Response(JSON.stringify({ ok:true, summary:text }), {status:200});
  }catch(e){
    return new Response(JSON.stringify({ error:e.message }), {status:500});
  }
}
