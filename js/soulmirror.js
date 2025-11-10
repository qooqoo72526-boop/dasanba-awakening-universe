
import { mountStarfield, callAPI, typeInto } from './shared.js';

// generate 500 non-repeating prompts (template-based)
function generate500(){
  const cores = [
    "你最近在哪一刻最想守住邊界？",
    "當情緒湧上時，你會先保護誰：自己、他人、還是關係？為什麼？",
    "你害怕被誤解還是害怕失去？說說哪個更刺痛。",
    "當驕傲被貼上距離時，你會怎麼回應？",
    "你最想被理解的句子是？",
    "你對『安全感』的定義是什麼？描述一個畫面。",
    "如果今天只能說一句真話，你會對誰說？內容是？",
    "你願意為了更高的自我價值放掉什麼？",
    "你保護他人的同時，有沒有遺失自己？什麼時候？",
    "你上一次大幅改變決策，是為了忠於誰？"
  ];
  const twists = [
    "用三個關鍵詞擴寫。","把這段話重寫成宣言。","試著用一個比喻表達。",
    "只用 30 個字說清楚。","用第一人稱寫成一段 2 句話的自白。",
    "加入一個行動承諾作結。","補上一句你想聽到的安慰。"
  ];
  const arr=[];
  for(let i=0;i<cores.length;i++){
    for(let j=0;j<50;j++){
      const t = twists[(i*7+j)%twists.length];
      arr.push(`${cores[i]} ${t}`);
    }
  }
  return arr.slice(0,500);
}

const BANK = generate500();

document.addEventListener('DOMContentLoaded', ()=>{
  mountStarfield('starfield', { density: 150 });

  const qBox = document.querySelector('.question-grid');
  const resBox = document.querySelector('.result-box .txt');
  const trioBox = document.querySelector('.result-box .three');

  // pick 25 random non-repeating
  const pool = [...BANK];
  const chosen = [];
  for(let i=0;i<25;i++){
    const idx = Math.floor(Math.random()*pool.length);
    chosen.push(pool.splice(idx,1)[0]);
  }

  chosen.forEach((q,k)=>{
    const opt = document.createElement('div');
    opt.className = 'option';
    opt.textContent = q;
    opt.addEventListener('click', async ()=>{
      // glow pulse
      opt.style.boxShadow = '0 0 36px rgba(200,180,255,.55)';
      setTimeout(()=>opt.style.boxShadow='', 600);

      // ask API for deep analysis
      let out = '';
      try{
        const data = await callAPI({
          mode:'soulmirror',
          question:q,
          need:'600w_deep+one_line_each_parrot',
          tone:'daring,honest,rebirth,not-official'
        });
        out = data && data.analysis || "今天你的意識有一條清楚的脈絡：敢把『需要』講成一句完整的話。把這句話寫下來，然後對著鏡子再說一次。";
      }catch(e){
        out = "當鏡子變得安靜，請把注意力放回呼吸。你正在學會讓自己成為安全。";
      }
      resBox.textContent='';
      await typeInto(resBox, out, 12);

      // three parrots one-liners (using icons)
      trioBox.innerHTML = `
        <img src="assets/icon_ajin.png" alt="Ajin"/><span>「驕傲不是距離—是界線。」</span>
        <img src="assets/icon_migou.png" alt="Migou"/><span>「我很值錢，不要糟蹋我。」</span>
        <img src="assets/icon_gungun.png" alt="Gungun"/><span>「真正的安全感，是被理解。」</span>
      `;
    });
    qBox.appendChild(opt);
  });
});
