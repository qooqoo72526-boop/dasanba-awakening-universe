
const pool = Array.from({length:60}, (_,i)=>`Q${i+1}. 在最近一次覺醒裡，你想守護的是什麼？`);
function pick(n){ return pool.sort(()=>Math.random()-0.5).slice(0,n); }
function render(){
  const wrap = document.getElementById('qs'); wrap.innerHTML='';
  const qs = pick(25);
  qs.forEach((q,idx)=>{
    const card = document.createElement('div'); card.className='card flat';
    card.innerHTML = `
      <div class="small">${q}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <label><input type="radio" name="q${idx}" value="是"> 是</label>
        <label><input type="radio" name="q${idx}" value="不是"> 不是</label>
        <label><input type="radio" name="q${idx}" value="還不確定"> 還不確定</label>
        <label><input type="radio" name="q${idx}" value="不想回答"> 不想回答</label>
      </div>
      <input class="input" placeholder="寫一句真實的話…">
    `;
    wrap.appendChild(card);
  });
}
document.addEventListener('DOMContentLoaded', ()=>{ render(); document.getElementById('again').addEventListener('click', render); });
