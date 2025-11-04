// /js/scripts.js
(function(){
  // Splash 僅首次
  const onceKey = 'dasanba_splash_seen';
  const splash = document.getElementById('splash');
  if (splash){
    if (localStorage.getItem(onceKey)) {
      splash.style.display='none';
    } else {
      localStorage.setItem(onceKey,'1');
      setTimeout(()=> splash.style.display='none', 3500);
    }
  }

  // 若需要可在此加入更多通用特效
})();
