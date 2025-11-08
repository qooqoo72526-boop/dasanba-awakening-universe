/* main.js (auto background bootstrap) */
/* 你的既有 JS 可以維持不變；以下是自動套背景（免加 body class） */
(function autoBg919(){
  document.addEventListener('DOMContentLoaded',()=>{
    const b = document.body;
    if(!b.classList.contains('bg-919')) b.classList.add('bg-919');
  });
})();