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

function renderRing() {
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

  requestAnimationFrame(renderRing);
}

initParticles();
renderRing();

// === 題庫骨架（先放幾題，之後可以擴到 25 題） ===
const questions = [
  {
    text: "最近的你，把情緒收得很乾淨。不是平靜，是你懶得再讓任何人失望。",
    options: [
      "我沒有在等誰懂我了，安全感是靠自己營造的。",
      "我其實很累，但比起解釋，我更想快轉人生。",
      "身邊的人只看到我乖的一面，亂的一面我都藏起來。",
      "我偶爾會幻想有人能看穿我，但通常不抱希望。"
    ]
  },
  {
    text: "當你說「沒事」的時候，有多少成分是在保護別人，而不是保護自己？",
    options: [
      "大部分是在照顧別人的情緒，免得場面尷尬。",
      "其實我怕一說實話，關係就回不去了。",
      "我連自己到底有沒有事都分不太清楚了。",
      "說沒事，是因為我不想再被教訓或被修理。"
    ]
  },
  {
    text: "如果沒有人期待你堅強，你覺得自己會變成什麼樣子？",
    options: [
      "我可能會先爛一陣子，然後慢慢學會只對自己負責。",
      "我會更誠實地任性一點，至少不再演出『乖的人』。",
      "我其實不知道自己還剩下什麼樣子。",
      "也許我會過得比較輕鬆，但還是不太敢想像。"
    ]
  },
  {
    text: "你習慣先讀空氣，再決定要不要出聲。那誰在讀你的空氣？",
    options: [
      "沒有人，我早就放棄這個期待了。",
      "有時候會遇到少數的人，但很稀有。",
      "我只求別被誤會，不奢望被理解。",
      "說真的，我也很少允許別人真的靠近我。"
    ]
  },
  {
    text: "你最常對自己說的那句內心小聲音，是什麼？",
    options: [
      "「撐一下就過了。」",
      "「別再搞砸了。」",
      "「算了，這次先這樣。」",
      "「沒關係，反正我習慣了。」"
    ]
  }
];

let currentIndex = 0;
let typingTimer = null;

// === DOM 拿元素 ===
const entryScreen = document.getElementById("entryScreen");
const startBtn = document.getElementById("startBtn");
const qCard = document.querySelector(".q-card");
const qTitleEl = document.querySelector(".q-title");
const optionButtons = document.querySelectorAll(".option-pill");

// === 題目逐字出現 ===
function typeQuestion(text) {
  if (!qTitleEl) return;
  if (typingTimer) clearTimeout(typingTimer);

  qTitleEl.textContent = "";
  let i = 0;

  function step() {
    if (i <= text.length) {
      qTitleEl.textContent = text.slice(0, i);
      i++;
      typingTimer = setTimeout(step, 28); // 打字速度
    }
  }
  step();
}

// === 把題目 & 選項塞進卡片 ===
function renderQuestion(index) {
  const q = questions[index % questions.length];
  typeQuestion(q.text);

  q.options.forEach((opt, idx) => {
    if (optionButtons[idx]) {
      optionButtons[idx].textContent = opt;
    }
  });
}

// === 卡片出場（飛來 + 漂浮） ===
function enterCard() {
  qCard.classList.remove("q-card-exit");
  // 先移除再重新加，確保動畫可以重播
  qCard.classList.remove("q-card-enter");
  void qCard.offsetWidth;
  qCard.classList.add("q-card-enter");
}

// === 卡片消散動畫 ===
function exitCardAndNext() {
  // 先加 exit 動畫 class
  qCard.classList.remove("q-card-enter");
  qCard.classList.add("q-card-exit");

  // 等動畫結束，再換下一題
  const inner = qCard.querySelector(".q-inner");
  const onAnimEnd = () => {
    inner.removeEventListener("animationend", onAnimEnd);
    currentIndex = (currentIndex + 1) % questions.length;
    renderQuestion(currentIndex);
    // 重新進場
    enterCard();
  };
  inner.addEventListener("animationend", onAnimEnd);
}

// === 綁定 ENTER 按鈕 ===
startBtn.addEventListener("click", () => {
  entryScreen.classList.add("mode-question");
  currentIndex = 0;
  renderQuestion(currentIndex);
  enterCard();
});

// === 綁定選項按鈕 ===
optionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    exitCardAndNext();
  });
});
