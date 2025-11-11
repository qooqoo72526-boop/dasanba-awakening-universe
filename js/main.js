/* v9.4 — Homepage starfield + meteors/comet + gallery rotation */
function makeStars(container,count=140){
  for(let i=0;i<count;i++){
    const s=document.createElement('div');s.className='star';
    s.style.left=(Math.random()*100)+'vw';s.style.top=(Math.random()*100)+'vh';
    s.classList.add(i%3===0?'twinkle':(i%3===1?'drift':'pulse'));
    s.style.opacity=(0.55+Math.random()*0.45).toFixed(2);
    container.appendChild(s);
  }
}
function spawnMeteor(kind='meteor'){
  const m=document.createElement('div');m.className='meteor';if(kind==='comet')m.classList.add('comet');
  const side=Math.random()<.52?'left':'right';const y=Math.random()*90+5;m.style.top=y+'vh';
  m.style[side==='left'?'left':'right']='-60px';document.body.appendChild(m);
  const dx=(side==='left')?'translateX(calc(100vw + 120px))':'translateX(calc(-100vw - 120px))';
  m.animate([{transform:'translateX(0)'},{transform:dx}],{duration:5200+Math.random()*2200,easing:'ease-out'});
  setTimeout(()=>m.remove(),7800);
}
function scheduleMeteors(){
  const next=1800+Math.random()*2200;
  setTimeout(()=>{const isComet=Math.random()<1/12;spawnMeteor(isComet?'comet':'meteor');
    if(isComet){document.body.classList.add('shake-brief');setTimeout(()=>document.body.classList.remove('shake-brief'),160);}
    scheduleMeteors();
  },next);
}
function rotateGallery(){
  const imgs=document.querySelectorAll('#gallery .gimg'); if(!imgs.length) return;
  let idx=0; imgs.forEach((im,i)=>im.classList.toggle('active',i===0));
  setInterval(()=>{imgs[idx].classList.remove('active'); idx=(idx+1)%imgs.length; imgs[idx].classList.add('active');},3500);
}
function initHome(){
  const isHome=!document.body.hasAttribute('data-page'); if(!isHome) return;
  let starLayer=document.querySelector('.starry');
  if(!starLayer){starLayer=document.createElement('div');starLayer.className='starry';document.body.prepend(starLayer);}
  makeStars(starLayer,140); scheduleMeteors(); rotateGallery();
}
document.addEventListener('DOMContentLoaded', () => {
  const imgs = [...document.querySelectorAll('#gallery .gimg')];
  if (imgs.length) {
    let i = imgs.findIndex(el => el.classList.contains('active'));
    if (i < 0) { i = 0; imgs[0].classList.add('active'); }
    setInterval(() => {
      imgs[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
    }, 4000);
  }
});
