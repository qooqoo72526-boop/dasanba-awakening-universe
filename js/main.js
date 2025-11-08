// v9.1.9 layout hotfix — 只修排版，不動妳的 autoBg919 設定
// 1) 畫廊：3 秒自動水平滑動一張
(function(){
  const rail = document.getElementById('rail');
  if(!rail) return;
  const step = () => {
    const w = rail.firstElementChild?.getBoundingClientRect().width || 0;
    rail.scrollBy({left: w + 12, behavior: 'smooth'});
    // 如果滑到底，回到開頭
    if(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4){
      setTimeout(()=> rail.scrollTo({left:0, behavior:'smooth'}), 3000);
    }
  };
  setInterval(step, 3000);
})();
