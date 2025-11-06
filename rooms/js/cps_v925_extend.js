
// cps_v925_extend.js — 宇宙郵局：三鳥輪流一句，玻璃氣泡＋柔泡泡聲
(function(){
  const tw=document.querySelector('.twinkle'); if(tw){for(let i=0;i<70;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'vw';s.style.top=Math.random()*100+'vh';s.style.animationDelay=(Math.random()*3)+'s';tw.appendChild(s);}}
  const met=document.querySelector('.meteors'); if(met){for(let i=0;i<2;i++){const m=document.createElement('i');m.style.left=(25+Math.random()*55)+'vw';m.style.top=(-5+Math.random()*12)+'vh';m.style.animationDelay=(Math.random()*5)+'s';met.appendChild(m);}}
  const form=document.querySelector('#cps-form'), input=document.querySelector('#cps-input');
  const lanes={ajin:document.querySelector('#lane-ajin'),migou:document.querySelector('#lane-migou'),gungun:document.querySelector('#lane-gungun')};
  const pop=new Audio('assets/sound/bubble_soft.wav'); pop.volume=.35;
  function bubble(t,who){const d=document.createElement('div');d.className='msg';d.innerHTML=`<div class="b">${t}</div>`;lanes[who].appendChild(d);lanes[who].scrollTop=lanes[who].scrollHeight;try{pop.currentTime=0;pop.play()}catch(e){}}
  function persona(w){if(w==='ajin')return '（阿金）我不等天空放晴——我自己撕開雲。';if(w==='migou')return '（米果）我很值錢，我讓自己更貴。';return '（滾滾）我不追求安全，我成為安全。'}
  async function callAPI(content){try{const r=await fetch('/api/chat.js',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:[{role:'user',content}],mode:'cosmic-post-station'})});const data=await r.json();return data?.reply||content}catch(e){return content}}
  form&&form.addEventListener('submit',async e=>{e.preventDefault();const v=(input.value||'').trim();if(!v)return;input.value='';for(const who of ['ajin','migou','gungun']){bubble(v,who);const bot=await callAPI(`${persona(who)} 回覆：${v}`);bubble(bot,who);await new Promise(r=>setTimeout(r,350));}});
})();