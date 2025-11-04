
// subtle twinkle
function twinkle(){
  document.documentElement.style.setProperty('--tw', Math.random());
  requestAnimationFrame(twinkle);
}
twinkle();
