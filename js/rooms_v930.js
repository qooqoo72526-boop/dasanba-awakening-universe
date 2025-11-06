document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.room-video').forEach(v=>{
    v.setAttribute('playsinline',''); v.setAttribute('muted',''); v.setAttribute('autoplay',''); v.setAttribute('loop','');
    // shrink a touch via CSS, ensure not oversized
    v.style.maxWidth = 'min(720px,76vw)';
  });
});