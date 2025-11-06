
// cps_v923.js — 宇宙郵局：泡泡音 + 人設回覆 + 輸入框樣式
(function(){
  const panel = document.querySelector('.cps-panel');
  if(!panel) return;

  // bubble sfx
  const pop = new Audio('assets/sound/click_star.wav');
  pop.volume = 0.35;

  panel.querySelectorAll('.cps-row').forEach(row=>{
    row.classList.add('glass-923');
    row.addEventListener('click', ()=>{ try{ pop.currentTime=0; pop.play(); }catch(e){} });
  });

  const inputWrap = document.querySelector('.cps-input');
  if(inputWrap){ inputWrap.classList.add('glass-923'); }

  // inject persona prompts (frontend hint; backend仍由 /api/chat 控制)
  window.personaHints = {
    AJIN:   "語氣俐落、敢衝敢言、鼓勵突破舒適圈。",
    MIGOU:  "語氣溫柔但堅定、圍繞自我價值與邊界。",
    GUNGUN: "語氣慢與穩、重視被理解與安全感。"
  };
})();
