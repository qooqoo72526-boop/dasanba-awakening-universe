
// click-to-room + hover sfx
const click = new Audio('assets/sound/click_star.wav');
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('mouseenter', () => { click.currentTime=0; click.play().catch(()=>{}); });
    c.addEventListener('click', () => { window.location.href = c.dataset.href; });
  });
  // gallery one-by-one carousel
  const imgs = ['trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp','trio6.webp','trio7.webp','trio8.webp','trio9.webp','trio10.webp'];
  let i=0; const g = document.getElementById('gimg');
  function next(){ i=(i+1)%imgs.length; g.src='assets/'+imgs[i]; }
  setInterval(next, 3800);
});
