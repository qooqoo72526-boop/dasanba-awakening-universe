
(function(){
  const scroller = document.querySelector('.gallery');
  if(!scroller) return;
  let dir = 1;
  setInterval(()=> {
    const max = scroller.scrollWidth - scroller.clientWidth;
    if (scroller.scrollLeft >= max) dir = -1;
    if (scroller.scrollLeft <= 0) dir = 1;
    scroller.scrollLeft += 2 * dir;
  }, 30);
})();
