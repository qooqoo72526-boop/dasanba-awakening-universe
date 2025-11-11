
// ===== Home Cards & Gallery Hotfix v9.3.7f =====
// Scope: homepage only (no data-page attr).
// Keeps your background & titles intact.

(function(){
  const isHome = !document.body.hasAttribute('data-page');
  if(!isHome) return;

  // 1) Heart normalize (if markup differs)
  document.querySelectorAll('section.cards .card').forEach(card=>{
    // add bird class by img src keywords (safe)
    const img = card.querySelector('img');
    if(img){
      const s = (img.getAttribute('src')||'').toLowerCase();
      if(s.includes('ajin'))  card.classList.add('ajin');
      if(s.includes('migou')) card.classList.add('migou');
      if(s.includes('gungun'))card.classList.add('gungun');
    }
    const heart = card.querySelector('.heart, .like, .fav');
    if(heart){
      heart.style.position='absolute';
      heart.style.top='10px';
      heart.style.right='12px';
      heart.style.left='auto';
      heart.style.bottom='auto';
      heart.style.transform='none';
      heart.style.zIndex='4';
    }
  });

  // 2) Simple gallery rotator for trio.webp ~ trio10.webp
  const pics = Array.from(document.querySelectorAll('section.gallery .gimg'));
  if(pics.length){
    let i = 0;
    const show = (n)=>{
      pics.forEach(p=>p.classList.remove('active'));
      pics[n].classList.add('active');
    };
    show(0);
    setInterval(()=>{
      i = (i + 1) % pics.length;
      show(i);
    }, 4200);
  }
})();
