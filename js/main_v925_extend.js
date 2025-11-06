
// main_v925_extend.js — 星點、流星（1~2/分鐘）、開場與畫廊慢滑
(function(){
  const tw=document.querySelector('.twinkle'); if(tw){for(let i=0;i<80;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'vw';s.style.top=Math.random()*100+'vh';s.style.animationDelay=(Math.random()*3)+'s';tw.appendChild(s);}}
  const met=document.querySelector('.meteors'); if(met){
    for(let i=0;i<3;i++){const m=document.createElement('i');m.style.left=(30+Math.random()*50)+'vw';m.style.top=(-5+Math.random()*10)+'vh';m.style.animationDelay=(Math.random()*6)+'s';m.style.animationDuration=(2.2+Math.random()*1.8)+'s';met.appendChild(m);}
    setInterval(()=>{const m=document.createElement('i');m.style.left=(30+Math.random()*50)+'vw';m.style.top=(-5+Math.random()*10)+'vh';m.style.animationDuration=(2.2+Math.random()*1.8)+'s';met.appendChild(m);setTimeout(()=>m.remove(),3200)},45000);
  }
  const rail=document.querySelector('.gallery .rail'); if(rail){let dir=1;setInterval(()=>{rail.scrollBy({left:dir*380,behavior:'smooth'});if(rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-10)dir=-1;else if(rail.scrollLeft<=10)dir=1;},6000)}
  const splash=document.querySelector('.splash'); if(splash){setTimeout(()=>splash.remove(),3600);}
})();