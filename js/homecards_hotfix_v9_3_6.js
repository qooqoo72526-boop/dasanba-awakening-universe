// v9.3.6 — Homepage cards runtime hotfix + glows + gallery spacer
(function(){
  function sty(el, obj){ if(!el) return; for(const k in obj){ el.style[k]=obj[k]; } }
  function isBird(src){
    if(!src) return false;
    const s = src.toLowerCase();
    return s.includes('ajin') || s.includes('migou') || s.includes('migo') || s.includes('gungun');
  }
  function fixCard(img){
    let card = img.closest('a, .character-card, .card, .tile, .card-item') || img.parentElement;
    if(!card) card = img.parentElement;
    sty(card, { position:'relative', borderRadius:'20px', overflow:'hidden', aspectRatio:'5 / 6', minHeight:'260px' });
    sty(img,  { width:'100%', height:'100%', objectFit:'contain', objectPosition:'50% 10%', display:'block' });
    const src = (img.getAttribute('src')||'').toLowerCase();
    let tone='';
    if (src.includes('ajin'))   { img.style.objectPosition='50% 8%';  tone='ajin'; }
    if (src.includes('migou') || src.includes('migo')) { img.style.objectPosition='50% 10%'; tone='migou'; }
    if (src.includes('gungun')) { img.style.objectPosition='50% 12%'; tone='gungun'; }
    const heart = card.querySelector('.heart, .like, .fav, .icon-heart, [data-heart], svg.heart');
    if (heart){ sty(heart, { position:'absolute', top:'10px', right:'12px', left:'auto', bottom:'auto', transform:'none', zIndex:'3' }); }
    card.classList.add('card-fx'); if (tone) card.classList.add('tone-' + tone);
  }
  function gallerySpacer(){
    const candidates = [];
    candidates.push(document.getElementById('gallery'));
    candidates.push(document.querySelector('[href="#gallery"]')?.parentElement);
    Array.from(document.querySelectorAll('h2, h3, p, a, div')).forEach(el=>{
      const t = (el.textContent||'').trim();
      if (/觀星畫廊|STARFLOW GALLERY/i.test(t)) candidates.push(el);
    });
    const target = candidates.find(Boolean);
    if(target){
      const spacer = document.createElement('div');
      spacer.setAttribute('data-spacer', 'v9_3_6');
      spacer.style.height = window.innerWidth >= 900 ? '40px' : '28px';
      target.parentElement.insertBefore(spacer, target);
    }
  }
  function run(){
    Array.from(document.images).filter(img => isBird(img.getAttribute('src'))).forEach(fixCard);
    gallerySpacer();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
