
(()=>{
  const btn = document.getElementById('analyze');
  if(!btn) return;
  btn.onclick = () => {
    const out = document.getElementById('out');
    out.hidden = false;
    out.textContent =
`阿金：把自信調到 80%，先行動，邊走邊修！
米果：記得你的價值，邊界就是愛自己的方式！
滾滾：慢下來，讓被理解成為你的安全感。`;
  };
})();
