
async function init(){
  const form = document.getElementById('quiz');
  const res = await fetch('assets/questions.json'); const qs = await res.json();
  qs.forEach((it,idx)=>{
    const wrap = document.createElement('div'); wrap.className='q';
    const h = document.createElement('h5'); h.textContent = (idx+1)+'. '+it.q; wrap.appendChild(h);
    if(it.type==='mc'){
      it.opts.forEach((op,i)=>{
        const id = `q${idx}_${i}`; const lab = document.createElement('label'); lab.className='opt';
        lab.innerHTML = `<input type="checkbox" name="q${idx}" value="${op}"><span>${op}</span>`;
        wrap.appendChild(lab);
      });
    }else{
      const ta = document.createElement('textarea'); ta.name='q'+idx; ta.rows=2; wrap.appendChild(ta);
    }
    form.appendChild(wrap);
  });
}
init();
document.getElementById('submit').addEventListener('click', ()=>{
  const result = document.getElementById('result');
  result.innerHTML = '<div class="ring"></div><p>分析完成：你擁有覺醒的胚芽，正在向自我主權靠近。</p><p>💛阿金：把力氣留給起步。🩷米果：你的價值，不用急著證明。🩵滾滾：讓被理解先發生，再談修正。</p>';
});
