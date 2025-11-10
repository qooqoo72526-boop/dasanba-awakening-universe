
import { mountStarfield, callAPI, typeInto } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  mountStarfield('starfield', { density: 150 });

  const msgs = document.querySelector('.messages');
  const input = document.querySelector('#sendInput');
  const btn = document.querySelector('#sendBtn');

  function addMsg(who, txt, cls){
    const div = document.createElement('div');
    div.className = `msg ${cls}`;
    div.innerHTML = `<div class="who"><img class="avatar ${cls}" src="assets/icon_${cls}.png" alt="${who}"/> ${who}</div><div class="txt"></div>`;
    msgs.appendChild(div);
    const p = div.querySelector('.txt');
    return typeInto(p, txt, 12);
  }

  async function replyParty(userText){
    // rotating order, sometimes Gungun first
    const orderSets = [
      [{n:'💛阿金',c:'ajin'},{n:'🧡米果',c:'migou'},{n:'💙滾滾',c:'gungun'}],
      [{n:'💙滾滾',c:'gungun'},{n:'💛阿金',c:'ajin'},{n:'🧡米果',c:'migou'}],
      [{n:'🧡米果',c:'migou'},{n:'💙滾滾',c:'gungun'},{n:'💛阿金',c:'ajin'}]
    ];
    const order = orderSets[Math.floor(Math.random()*orderSets.length)];
    for(const o of order){
      const payload = {
        persona: o.c,
        mode: 'poststation',
        text: userText,
        style: 'friend-tone,no-official,commas/periods/exclamations,emojis-ok'
      };
      let txt = '';
      try{
        const data = await callAPI(payload);
        txt = (data && data.reply) || '收到啦！我在宇宙這端。';
      }catch(e){
        txt = '連線好了再聊，我先在星雲等你～';
      }
      await addMsg(o.n, txt, o.c);
    }
    msgs.scrollTop = msgs.scrollHeight;
  }

  function send(){
    const v = (input.value||'').trim();
    if(!v) return;
    addMsg('你', v, 'you').then(()=>{
      input.value='';
      replyParty(v);
    });
  }
  btn.addEventListener('click', send);
  input.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ e.preventDefault(); send(); }
  });
});
