// Centered LINE-like chat, one-by-one birds reply, no borders feel
const chat = document.getElementById('chat');
const input = document.getElementById('userInput');
const btn = document.getElementById('sendBtn');

const birds = [
  { id:'ajin',   name:'阿金', avatar:'assets/icon_ajin.png'   },
  { id:'migou',  name:'米果', avatar:'assets/icon_migou.png'  },
  { id:'gungun', name:'滾滾', avatar:'assets/icon_gungun.png' }
];
let idx = 0;

function bubble(side, avatar, text){
  const wrap = document.createElement('div');
  wrap.className = 'bubble '+ (side==='you'?'you':'they');
  wrap.innerHTML = `
    <div class="avatar"><img src="${avatar}" alt=""></div>
    <div class="msg">${text}</div>
  `;
  chat.appendChild(wrap);
  chat.scrollTo({top:chat.scrollHeight, behavior:'smooth'});
}

async function askBird(say){
  const bird = birds[idx];
  idx = (idx+1)%birds.length;
  // call your Edge /api/chat; payload kept simple
  try{
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify({
        persona: bird.id,
        message: say,
        mode: 'cosmic-post-station',
        regionHints: ['sin1','hnd1','icn1']
      })
    });
    const data = await res.json().catch(()=>({reply:'...'}));
    const reply = (data && data.reply) ? data.reply : '收到！';
    bubble('they', bird.avatar, reply);
  }catch(e){
    bubble('they', bird.avatar, '今天訊號有點雜，但我聽見了！');
  }
}

btn.onclick = () => {
  const v = (input.value || '').trim();
  if(!v) return;
  bubble('you', 'assets/icon_you.png', v);
  input.value = '';
  askBird(v);
};

input.addEventListener('keydown', e=>{
  if(e.key==='Enter'){ btn.click(); }
});