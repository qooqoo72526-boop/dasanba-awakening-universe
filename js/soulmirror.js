
// Draw 25 questions from 500 (placeholder pool)
const pool = Array.from({length: 500}, (_,i)=>`Q${i+1}. 在最近一次覺醒裡，你發現守護的是什麼？`);
const picked = [];
while(picked.length < 25){
  const q = pool[Math.floor(Math.random()*pool.length)];
  if(!picked.includes(q)) picked.push(q);
}
const grid = document.querySelector('#qgrid');
picked.forEach(q=>{
  const c = document.createElement('div');
  c.className = 'card';
  c.innerHTML = `<div class="tag small">${q}</div>
  <div class="small" style="margin:6px 0 10px; opacity:.9">寫一句真實的話…</div>
  <div style="display:flex; gap:10px; flex-wrap:wrap">
    <label class="badge ghost"><input type="radio" name="a${q}" /> 是</label>
    <label class="badge ghost"><input type="radio" name="a${q}" /> 不是</label>
    <label class="badge ghost"><input type="radio" name="a${q}" /> 還不確定</label>
    <label class="badge ghost"><input type="radio" name="a${q}" /> 不想回答</label>
  </div>`;
  grid.appendChild(c);
});
