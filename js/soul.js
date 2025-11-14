// === 粒子能量圈 ===
const canvas = document.getElementById("particleRing");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
const R = 180;      // 能量圈半徑
const DEPTH = 360;  // 粒子數

function initParticles() {
  particles = [];
  for (let i = 0; i < DEPTH; i++) {
    const angle = (i / DEPTH) * Math.PI * 2;
    const x = Math.cos(angle) * R;
    const y = Math.sin(angle) * R;

    particles.push({
      x,
      y,
      z: Math.random() * 140 - 70,
      size: Math.random() * 2.1 + 0.6
    });
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.z += 0.22;
    if (p.z > 70) p.z = -70;

    const scale = 260 / (260 + p.z);
    const px = canvas.width / 2 + p.x * scale;
    const py = canvas.height / 2 + p.y * scale;

    ctx.beginPath();
    ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.32 * scale})`;
    ctx.fill();
  });

  requestAnimationFrame(render);
}

initParticles();
render();

// === 題目卡片進場 ===
const entryScreen = document.getElementById("entryScreen");
const startBtn = document.getElementById("startBtn");
const qCard = document.querySelector(".q-card");

startBtn.addEventListener("click", () => {
  // 切換到「題目模式」
  entryScreen.classList.add("mode-question");

  // 重新觸發卡片進場動畫
  qCard.classList.remove("q-card-enter");
  // 強制 reflow 讓動畫能重播
  void qCard.offsetWidth;
  qCard.classList.add("q-card-enter");
});
