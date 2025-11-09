// Gallery Auto Slide (3s)
(function(){
  const track = document.querySelector('.track');
  if(!track) return;
  const slides = track.querySelectorAll('img');
  let i = 0;
  function go(){
    i = (i + 1) % slides.length;
    track.style.transform = `translateX(-${i*100}%)`;
  }
  setInterval(go, 3000);
})();