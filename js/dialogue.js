
(()=>{
  const rings = [
    '0 0 0 3px rgba(255,230,120,.45), 0 0 16px rgba(255,230,120,.55)',
    '0 0 0 3px rgba(255,150,180,.45), 0 0 16px rgba(255,150,180,.55)',
    '0 0 0 3px rgba(120,200,255,.45), 0 0 16px rgba(120,200,255,.55)'
  ];
  const voices = [
    (t)=>'收到，先動起來—一步一步，我陪你。',
    (t)=>'聽到了，你的邊界很重要，先照顧自己。',
    (t)=>'我在，慢慢來，讓被理解成為你的安全感。'
  ];
  let turn=0;
  const chat = document.getElementById('chat');
  const inp  = document.getElementById('inp');
  const sendBtn = document.getElementById('send');
  function addMsg(txt, me=false){
    const wrap = document.createElement('div');
    wrap.className = 'msg'+(me?' me':'');
    if(!me){
      const av = document.createElement('div');
      av.className='avatar';
      av.style.boxShadow = rings[turn%3];
      wrap.appendChild(av);
    }
    const b = document.createElement('div');
    b.className='bubble'; b.textContent = txt;
    wrap.appendChild(b);
    chat.insertBefore(wrap, chat.querySelector('.input'));
    chat.scrollTop = chat.scrollHeight;
  }
  function send(){
    const val = inp.value.trim(); if(!val) return;
    addMsg(val,true); inp.value='';
    setTimeout(()=>{ addMsg(voices[turn%3](val), false); turn++; }, 600);
  }
  if(sendBtn) sendBtn.onclick = send;
  if(inp) inp.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
})();
