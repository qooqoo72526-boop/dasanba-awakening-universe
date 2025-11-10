// v9.3.5_homecards_hotfix — attach per-bird classes & fix misaligned hearts
// Safe add-on: load AFTER your main.js. No homepage content changes required.
(function(){
  const root = document;
  const cards = root.querySelectorAll('.character-card');
  cards.forEach(card => {
    const img = card.querySelector('img');
    if(!img) return;
    const src = (img.getAttribute('src') || '').toLowerCase();
    if(src.includes('ajin'))   card.classList.add('ajin');
    if(src.includes('migou') || src.includes('migo')) card.classList.add('migou');
    if(src.includes('gungun')) card.classList.add('gungun');

    // Normalize any heart icon position if it was nested weirdly
    const heart = card.querySelector('.heart, .like, .fav');
    if(heart){
      heart.style.position = 'absolute';
      heart.style.top = '10px';
      heart.style.right = '12px';
      heart.style.left = 'auto';
      heart.style.bottom = 'auto';
      heart.style.transform = 'none';
      heart.style.zIndex = '3';
    }
  });
})();
