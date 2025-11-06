
(function(){
  const el=document.getElementById('gallery-img'); if(!el) return;
  let i=1; setInterval(()=>{ i=(i%10)+1; const path=i===1?'assets/trio.webp':`assets/trio${i}.webp`; el.src=path; }, 3500);
})();