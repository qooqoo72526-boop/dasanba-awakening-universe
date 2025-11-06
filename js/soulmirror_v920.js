(async () => {
  const form = document.getElementById('quiz');
  const result = document.getElementById('result-panel');
  const panelQ = document.getElementById('question-panel');
  const btn = document.getElementById('submitQuiz');

  const res = await fetch('assets/questions.json'); const pool = await res.json();
  const sorted = pool.sort((a,b)=> (b.depth||0)-(a.depth||0) );
  const chosen = []; const used = new Set();
  while(chosen.length < 25 && sorted.length){
    const i = Math.floor(Math.random()*Math.min(sorted.length, 200));
    const q = sorted[i]; if(used.has(q.id)) continue; used.add(q.id); chosen.push(q);
  }

  chosen.forEach((q,idx)=>{
    const wrap = document.createElement('fieldset'); wrap.className='q glass'; const legend = document.createElement('legend'); legend.textContent = `${idx+1}. ${q.text}`; wrap.appendChild(legend);
    if(q.type === 'multi'){
      q.options.forEach((opt,i)=>{ const id=`q${q.id}_${i}`; const inp = Object.assign(document.createElement('input'), {type:'checkbox', id, name:`q${q.id}` , value:opt}); const lab = Object.assign(document.createElement('label'), {htmlFor:id, textContent:opt}); const row=document.createElement('div'); row.appendChild(inp); row.appendChild(lab); wrap.appendChild(row); });
    }else if(q.type === 'single'){
      q.options.forEach((opt,i)=>{ const id=`q${q.id}_${i}`; const inp = Object.assign(document.createElement('input'), {type:'radio', id, name:`q${q.id}` , value:opt, required:true}); const lab = Object.assign(document.createElement('label'), {htmlFor:id, textContent:opt}); const row=document.createElement('div'); row.appendChild(inp); row.appendChild(lab); wrap.appendChild(row); });
    }else{
      const ta = document.createElement('textarea'); ta.name=`q${q.id}`; ta.placeholder='自由填寫'; ta.maxLength=400; wrap.appendChild(ta);
    }
    form.appendChild(wrap);
  });

  btn.addEventListener('click', async ()=>{
    const answers = {};
    new FormData(form).forEach((v,k)=>{
      if(answers[k]){ if(Array.isArray(answers[k])) answers[k].push(v); else answers[k]=[answers[k],v]; }
      else answers[k]=v;
    });
    panelQ.classList.add('hide'); result.classList.remove('hide');

    const out = await fetch('/api/chat', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({mode:'soul-mirror', answers})}).then(r=>r.json()).catch(()=>({analysis:'伺服星雲繁忙，稍後再試。', quotes:{ajin:'',migou:'',gungun:''}}));

    document.getElementById('analysis').textContent = out.analysis || '（分析生成中，請稍後重試）';
    document.getElementById('quote-ajin').textContent   = (out.quotes && out.quotes.ajin)   || '你不是做不到，是你還沒開始做。';
    document.getElementById('quote-migou').textContent  = (out.quotes && out.quotes.migou)  || '你很值錢，不要糟蹋自己。';
    document.getElementById('quote-gungun').textContent = (out.quotes && out.quotes.gungun) || '被理解比被修正更重要。';
  });
})();