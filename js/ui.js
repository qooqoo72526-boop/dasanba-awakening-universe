
// sidebar line icons (SVG inline via CSS), card click-through, and minor helpers
document.querySelectorAll('.char-card[data-href]').forEach(el=>{
  el.style.cursor='pointer';
  el.addEventListener('click', ()=> location.href = el.getAttribute('data-href'));
});

// Inject simple icons (SVGs placed in /assets/icons)
document.querySelectorAll('.nav-btn').forEach(btn=>{
  const name = btn.getAttribute('data-icon');
  const span = btn.querySelector('.ico');
  if(span){ span.innerHTML = `<img src="assets/icons/${name}.svg" alt="${name}" width="16" height="16"/>`; }
});
