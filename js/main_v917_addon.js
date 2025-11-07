// v9.1.6 full-restore addon (non-destructive)
document.addEventListener('DOMContentLoaded', () => {
  // star layer
  if (!document.querySelector('.uv-stars')) {
    const s = document.createElement('div'); s.className = 'uv-stars'; document.body.appendChild(s);
  }
  // try give halo to first three cards
  const cards = document.querySelectorAll('.card, .parrot-card, [data-card]');
  const halos = ['uv-halo-gold','uv-halo-rose','uv-halo-blue'];
  cards.forEach((c, i) => {
    c.classList.add('uv-card');
    if (halos[i]) c.classList.add(halos[i]);
  });
});