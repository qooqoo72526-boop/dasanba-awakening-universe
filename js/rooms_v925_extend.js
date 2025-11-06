
// rooms_v925_extend.js — 每間房的色調與小動畫（縮小25%）
(function(){
  const theme=document.body.dataset.theme||'ajin';
  const tw=document.querySelector('.twinkle'), met=document.querySelector('.meteors');
  const presets={ajin:{t:'rgba(255,180,90,.18)',tw:70,meteor:2},migou:{t:'rgba(255,160,210,.14)',tw:70,meteor:1},gungun:{t:'rgba(120,170,255,.16)',tw:70,meteor:1}};
  const p=presets[theme];
  const ov=document.createElement('div');ov.style.position='absolute';ov.style.inset='0';ov.style.background=`radial-gradient(600px 400px at 50% 0%, ${p.t}, transparent)`;ov.style.pointerEvents='none';document.querySelector('.cosmic')?.appendChild(ov);
  if(tw){for(let i=0;i<p.tw;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'vw';s.style.top=Math.random()*100+'vh';s.style.animationDelay=(Math.random()*3)+'s';tw.appendChild(s);}}
  if(met){for(let i=0;i<p.meteor;i++){const m=document.createElement('i');m.style.left=(35+Math.random()*40)+'vw';m.style.top=(-3+Math.random()*8)+'vh';m.style.animationDuration=(2.2+Math.random()*1.5)+'s';met.appendChild(m);}}
})();