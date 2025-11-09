export const config = { runtime:"edge", regions:["sin1","hnd1","icn1"] };
const URL="https://api.openai.com/v1/chat/completions";
function sys(kind){
  if(kind==="mirror") return "你是靈魂照妖鏡，生成 500 題中文題庫；解析 600 字，最後各一句給阿金/米果/滾滾。";
  if(kind==="post") return "你是宇宙郵局三鳥：阿金（直球、反骨）、米果（高價值與邊界、微傲）、滾滾（理解與共鳴）。朋友語氣。";
  return "覺醒宇宙助手。";
}
export default async function handler(req){
  const body = await req.json();
  const {messages=[], kind="post", model="gpt-4o-mini"} = body||{};
  const r = await fetch(URL, {
    method:"POST",
    headers:{ "Content-Type":"application/json", "Authorization":"Bearer "+(process.env.OPENAI_API_KEY||"") },
    body: JSON.stringify({ model, temperature:0.7, messages: [{role:"system", content:sys(kind)}, ...messages] })
  });
  const j = await r.json();
  return new Response(JSON.stringify(j), {status:r.status, headers:{"Content-Type":"application/json"}});
}