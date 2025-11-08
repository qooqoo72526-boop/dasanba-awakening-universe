const pool = [
  "最近一次你感到被理解，是什麼時候？為什麼？",
  "當界線被踩過時，你通常如何回應？事後會怎麼修復自己？",
  "你做過最讓自己自豪的小決定是什麼？它改變了什麼？",
  "你最常對自己說的話是什麼？它真的屬於你，還是來自他人眼光？",
  "當你選擇沉默時，心裡其實在吶喊什麼？",
  "有哪一段關係讓你學會『不必取悅也能被愛』？",
  "你害怕失去什麼？若失去，還剩下什麼？",
  "你最想被人看見的三個特質是什麼？你如何讓它被看見？",
  "當你說『我可以』時，其實犧牲了什麼？",
  "你渴望的安全感，來自外在條件，還是內在選擇？",
  "曾被誤解的場景裡，你想重新說的一句話是？",
  "你的自尊被點亮的一刻是什麼？",
  "你曾經把『順從』當作『善良』嗎？過程與轉變是什麼？",
  "如果把今天情緒畫成一個顏色，會是什麼？為什麼？",
  "你曾在哪個時刻選擇了自己？後來發生了什麼？",
  "什麼讓你想要『驕傲地活』？",
  "給過去的你一句話，會是什麼？",
  "你如何分辨『被需要』與『被尊重』？",
  "你承諾要守護自己的哪一條界線？",
  "你在誰面前最放鬆？他做了什麼？",
  "何時你會把『沈默』當作力量？",
  "當情緒很大時，你會怎麼安全地消化？",
  "你如何告訴自己：我夠好了？",
  "你願意為了什麼，讓自己變得更貴？",
  "今天你想要練習的一個小勇敢是什麼？"
];

const qsEl = document.getElementById('qs');
const regen = document.getElementById('regen');
const runBtn = document.getElementById('run');
const result = document.getElementById('result');

function draw(){
  qsEl.innerHTML = '';
  const picked = pool.slice(); // 25 items already
  picked.forEach((q,i)=>{
    const wrap = document.createElement('div');
    wrap.className = 'q';
    const id = 'q'+i;
    wrap.innerHTML = `<label for="${id}">${i+1}. ${q}</label><textarea id="${id}" placeholder="寫下你的真實想法…"></textarea>`;
    qsEl.appendChild(wrap);
  });
}
draw();
regen.onclick = draw;

runBtn.onclick = async ()=>{
  const answers = Array.from(document.querySelectorAll('.q textarea')).map((ta,i)=>({i:i+1, q: pool[i], a: ta.value.trim()}));
  result.style.display='block';
  result.innerHTML = '分析生成中…';
  try{
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({
        mode: 'soulmirror',
        prompt: '請根據 25 題答案寫出 600 字的深層分析，以人話、有溫度、無官腔。最後各給阿金/米果/滾滾一句話。',
        answers,
        regionHints:['sin1','hnd1','icn1']
      })
    });
    const data = await res.json().catch(()=>({reply:'...'}));
    result.innerHTML = (data && data.reply) ? data.reply : '今天的鏡面有霧，但你的答案已經很誠實。';
  }catch(e){
    result.innerHTML = '宇宙有點吵，稍後再試。';
  }
};