// === 背景星場：獨立不動 shared.js ===
(function initStarfield() {
  const canvas = document.getElementById("soulStarfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, stars = [], meteors = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    const density = 160;
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * Math.PI * 2,
        s: Math.random() * 0.004 + 0.0012
      });
    }
  }
  resize();
  window.addEventListener("resize", resize);

  function spawnMeteor() {
    const side = Math.random() < 0.5 ? "left" : "right";
    const x = side === "left" ? -40 : W + 40;
    const y = Math.random() * H * 0.6;
    const vx = side === "left" ? (1.4 + Math.random() * 1.8) : -(1.4 + Math.random() * 1.8);
    const vy = 1 + Math.random() * 1.2;
    const life = 240 + Math.random() * 200;
    meteors.push({ x, y, vx, vy, life });
    setTimeout(spawnMeteor, 2600 + Math.random() * 3600);
  }
  setTimeout(spawnMeteor, 2200);

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      s.a += s.s;
      const tw = 0.45 + 0.35 * Math.sin(s.a);
      ctx.fillStyle = `rgba(220,235,255,${0.25 + tw * 0.45})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * tw, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.lineWidth = 1.4;
    ctx.strokeStyle = "rgba(170,210,255,0.85)";
    for (const m of meteors) {
      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(m.x - m.vx * 18, m.y - m.vy * 18);
      ctx.stroke();
      m.x += m.vx;
      m.y += m.vy;
      m.life -= 1;
    }
    meteors = meteors.filter(m => m.life > 0);

    requestAnimationFrame(tick);
  }
  tick();
})();

// === 題庫：25 題深度問題 ===
const topics = [
  "你最近一次忍住沒有講出口的情緒是什麼？",
  "什麼事情最讓你覺得不被理解？",
  "你的界線被踩過最痛的一次是什麼？",
  "你最怕哪一種失望？",
  "你有時候覺得自己只是在假裝不在意嗎？",
  "你覺得自己最難被看見的部分是什麼？",
  "什麼事情會讓你突然覺得很自由？",
  "你心裡覺得安全，是因為什麼？",
  "你最常逃避的畫面是什麼？",
  "最近讓你覺得快爆炸的是什麼？",
  "什麼畫面會讓你瞬間覺得安心？",
  "你習慣怎麼處理心裡的委屈？",
  "你希望有誰真正理解哪一件事？",
  "你最怕別人誤會你什麼？",
  "你覺得自己放不下的是什麼？",
  "什麼事情最容易刺痛你的自尊？",
  "最近一次想消失，是因為什麼？",
  "你對關係最大的渴望是什麼？",
  "什麼會讓你覺得自己很弱？",
  "你心裡其實很想改掉的是什麼？",
  "什麼讓你覺得自己不被尊重？",
  "你打從心裡羨慕的是什麼樣的人生？",
  "你希望五年後的自己，跟現在最不一樣的是什麼？",
  "你最不想被人看到的那一面，是什麼樣子？",
  "你最想修補的一段關係是什麼？"
];

// === 狀態 ===
const answers = new Array(topics.length).fill("");
let activeIndex = null;

// DOM 快速取
const S = {};
const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  S.vector = $("vectorCards");
  S.activeCard = $("activeCard");
  S.questionText = $("questionText");
  S.answerBox = $("answerBox");
  S.lockBtn = $("lockAnswer");
  S.submit = $("submitScan");
  S.analysis = $("analysisOutput");
  S.ajin = $("ajinLine");
  S.migou = $("migouLine");
  S.gungun = $("gungunLine");

  buildNavLabels();
  buildCards();
  bindEvents();
});

// 建立工具列 label（hover 才看到英文）
function buildNavLabels() {
  const nodes = document.querySelectorAll(".nav-node");
  nodes.forEach((node) => {
    const label = node.getAttribute("data-label");
    if (!label) return;
    const span = document.createElement("span");
    span.className = "nav-node-label";
    span.textContent = label;
    node.appendChild(span);

    node.addEventListener("mouseenter", () => {
      span.style.color = "rgba(219,232,255,0.9)";
      span.style.transform = "translateY(-50%) translateX(4px)";
    });
    node.addEventListener("mouseleave", () => {
      span.style.color = "rgba(219,232,255,0.0)";
      span.style.transform = "translateY(-50%) translateX(0)";
    });
  });
}

// 建立 25 張卡片（只顯示編號）
function buildCards() {
  if (!S.vector) return;
  S.vector.innerHTML = "";
  topics.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vector-card";
    btn.dataset.index = String(idx);
    const span = document.createElement("span");
    span.textContent = String(idx + 1).padStart(2, "0");
    btn.appendChild(span);
    S.vector.appendChild(btn);
  });
}

function bindEvents() {
  if (!S.vector) return;

  // 點小卡 → 中央卡片翻轉 + 題目更新
  S.vector.addEventListener("click", (e) => {
    const card = e.target.closest(".vector-card");
    if (!card) return;
    const idx = Number(card.dataset.index);
    focusCard(idx);
  });

  // lock 答案
  S.lockBtn.addEventListener("click", () => {
    if (activeIndex == null) return;
    const text = (S.answerBox.value || "").trim();
    answers[activeIndex] = text;
    updateCardState();
    updateSubmitState();
  });

  // 發射鍵：先用本地解析版本（之後要接 API 再開開關）
  S.submit.addEventListener("click", () => {
    if (S.submit.disabled) return;
    runLocalAnalysis();
  });
}

// 聚焦某一張卡片
function focusCard(idx) {
  activeIndex = idx;

  const cards = S.vector.querySelectorAll(".vector-card");
  cards.forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.index) === idx);
  });

  S.questionText.textContent = topics[idx];
  S.answerBox.value = answers[idx] || "";
  const idxEl = S.activeCard.querySelector(".card-index");
  if (idxEl) idxEl.textContent = String(idx + 1).padStart(2, "0");

  const inner = S.activeCard.querySelector(".active-inner");
  if (!inner) return;
  inner.classList.remove("show-back");
  requestAnimationFrame(() => {
    setTimeout(() => inner.classList.add("show-back"), 80);
  });
}

// 填完答案的小卡樣式
function updateCardState() {
  const cards = S.vector.querySelectorAll(".vector-card");
  cards.forEach((card) => {
    const idx = Number(card.dataset.index);
    const filled = (answers[idx] || "").trim().length > 0;
    card.classList.toggle("answered", filled);
  });
}

// 至少填滿幾題才開啟發射鍵
function updateSubmitState() {
  const filledCount = answers.filter((a) => a.trim().length > 0).length;
  S.submit.disabled = filledCount < 5;
}

// === 本地解析版本（不講官方話，只給你 vibe） ===
function runLocalAnalysis() {
  const pairs = topics
    .map((q, i) => ({ q, a: (answers[i] || "").trim() }))
    .filter((p) => p.a.length > 0);

  if (!pairs.length) return;

  S.submit.disabled = true;

  // 把所有回答串起來做一個簡單 keyword feeling（不官腔）
  const textAll = pairs.map((p) => p.a).join(" ");
  const lengthScore = textAll.length;
  const anger = countKeywords(textAll, ["生氣", "火", "受不了", "氣死"]);
  const hurt = countKeywords(textAll, ["委屈", "難過", "心碎", "受傷"]);
  const tired = countKeywords(textAll, ["累", "好累", "疲累", "想睡"]);
  const alone = countKeywords(textAll, ["孤單", "一個人", "沒人", "被丟下"]);

  let main;
  if (anger >= hurt && anger > 0) {
    main = "你不是太兇，你只是太久沒有人站在你這邊。";
  } else if (hurt >= anger && hurt > 0) {
    main = "你很習慣把受傷藏好，連自己都快忘記那邊在痛。";
  } else if (alone > 0) {
    main = "你不是不需要人，只是太懂得一個人把自己撐住。";
  } else if (tired > 0) {
    main = "你不是懶，你只是長期在超出自己容量的速度運轉。";
  } else if (lengthScore > 300) {
    main = "你其實很清楚自己在發生什麼，只是還沒遇到一個敢跟你講實話的人。";
  } else {
    main = "你其實很敏銳，只是習慣先讓別人安全，再來處理自己。";
  }

  // 三鳥一句話（照個性）
  const ajinLine = "AJIN：你可以更囂張一點，世界不會因為你自我保護就塌掉。";
  const migouLine = "MIGOU：請你把自己當高價值在用，真的不需要再打折給任何人看。";
  const gungunLine = "GUNGUN：你值得被好好聽完，而不是被快速修正。";

  if (S.analysis) {
    S.analysis.textContent = main;
  }
  if (S.ajin) S.ajin.textContent = ajinLine;
  if (S.migou) S.migou.textContent = migouLine;
  if (S.gungun) S.gungun.textContent = gungunLine;

  setTimeout(() => {
    S.submit.disabled = false;
  }, 600);
}

// 簡單算關鍵字次數
function countKeywords(text, list) {
  let c = 0;
  list.forEach((w) => {
    const re = new RegExp(w, "g");
    const m = text.match(re);
    if (m) c += m.length;
  });
  return c;
}
