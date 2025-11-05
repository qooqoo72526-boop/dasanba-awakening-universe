
const qsBox = document.getElementById('qs');
const report = document.getElementById('report');
const btn = document.getElementById('analyze');

const questions = [
  {id:'q1', type:'choice', text:'當你說「我值得被尊重」時，你最怕被誰質疑？', options:['最親近的人','過去的自己','陌生群體','我不確定，但它一直在']},
  {id:'q2', type:'choice', text:'你習慣如何保護界線？', options:['保持距離','清楚說不','轉移注意力','先理解再表達']},
  {id:'q3', type:'text',   text:'最近一次你感到真正被理解，是發生了什麼？'},
  {id:'q4', type:'choice', text:'當你被誤解時，第一反應是？', options:['用力解釋','沈默退後','笑著帶過','先照顧情緒再處理']},
  {id:'q5', type:'text',   text:'如果讓你寫一封話給過去的自己，你會提醒什麼界線？'},
  {id:'q6', type:'choice', text:'你在關係裡最渴望被看見的是？', options:['努力與價值','脆弱與誠實','野心與抱負','安靜與自由']},
  {id:'q7', type:'choice', text:'當你說「不」時，你希望對方能回應？', options:['尊重我的選擇','問我需要什麼','理解而不修正','給我空間']},
  {id:'q8', type:'text',   text:'此刻你最想對自己說的一句真話是？'}
];

function render(){
  qsBox.innerHTML = '';
  for(const q of questions){
    const wrap = document.createElement('div');
    wrap.className = 'card'; wrap.style.margin='10px 0';
    const title = document.createElement('div'); title.textContent = q.text;
    title.style.margin='6px 0 10px'; wrap.appendChild(title);
    if(q.type==='choice'){
      for(const opt of q.options){
        const id = `${q.id}_${opt}`;
        const label = document.createElement('label');
        label.className = 'badge'; label.style.margin='4px 6px 0 0';
        const input = document.createElement('input'); input.type='radio'; input.name=q.id; input.value=opt;
        label.appendChild(input); label.append(' '+opt); wrap.appendChild(label);
      }
    }else{
      const ta = document.createElement('textarea');
      ta.name=q.id; ta.rows=3; ta.style.cssText='width:100%; padding:10px; border-radius:12px; border:0; background:rgba(255,255,255,.06); color:var(--text)';
      wrap.appendChild(ta);
    }
    qsBox.appendChild(wrap);
  }
}
render();

btn.addEventListener('click', async ()=>{
  const data = {};
  for(const q of questions){
    const valChoice = document.querySelector(`[name=${q.id}]:checked`);
    const valText = document.querySelector(`[name=${q.id}]${q.type==='text' ? '' : ''}`);
    data[q.id] = valChoice ? valChoice.value : (valText && valText.value || '');
  }
  report.innerHTML = '分析中…';

  try{
    const r = await fetch('/api/analysis', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ payload: data })
    });
    const j = await r.json();
    report.innerHTML = `<div class="small">能量占比</div><pre style="white-space:pre-wrap">${j.summary || '(no summary)'}</pre>`;
  }catch(e){
    report.textContent = '宇宙風暴影響，晚點再試。';
  }
});
