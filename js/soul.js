// ==============================
// Soul Mirror 3D 卡片互動邏輯
// ==============================

const topics = [
  "你最近一次忍住沒有講出口的情緒，是什麼？",
  "什麼事情最讓你覺得不被理解？",
  "你的界線被踩過最痛的一次，是什麼畫面？",
  "你最怕哪一種失望？",
  "有哪個你愛的人，讓你覺得自己是「多餘」的？",
  "當你假裝沒事時，心裡通常在想什麼？",
  "你對自己的苛刻，最常出現在哪個場景？",
  "如果可以，你最想跟誰說一句「其實我很累」？",
  "你最常對自己說的那句話，是鼓勵還是責備？",
  "你最近一次真的感覺到「被照顧」，是什麼時候？",
  "在關係裡，你最怕自己「失控」的樣子是什麼？",
  "當別人不回訊息時，你的腦袋會自動編出哪種故事？",
  "如果用一個顏色形容你最近的狀態，你會選哪一個？為什麼？",
  "你最想被哪一種眼神理解？",
  "你曾經為了「維持和平」而放棄過什麼？",
  "你最怕哪一種沉默？",
  "有哪件事，你明明受傷卻還是在替別人找理由？",
  "什麼樣的陪伴，會讓你真的放鬆地卸下防備？",
  "最近一次讓你覺得「好像沒有人真的站在我這邊」，是什麼？",
  "你有沒有哪種情緒，是從來不敢拿出來給別人看的？",
  "如果你可以重新教會自己一件事，你最想改什麼模式？",
  "在情緒崩潰之前，你的身體會先發出哪種訊號？",
  "你對關係的最大渴望，現在被滿足了幾成？",
  "什麼瞬間，會讓你突然覺得自己其實很孤單？",
  "如果今天的你只是先暫停，而不是失敗，你會允許自己怎麼休息？"
];

// 統一選項文案（要有深度一點）
const choiceTemplates = [
  "這幾乎就是我現在的狀態，命中核心。",
  "有一些像，但還有其他層次我說不太出口。",
  "偶爾會這樣，但比較像背景噪音，不是主旋律。",
  "幾乎不像我，或者我已經走過這個階段了。"
];

const state = {
  index: 0,
  answers: []
};

const els = {
  stageIntro: document.getElementById("stage-intro"),
  stageQuestions: document.getElementById("stage-questions"),
  stageResult: document.getElementById("stage-result"),

  enterBtn: document.getElementById("enterBtn"),
  qCard: document.getElementById("qCard"),
  qIndex: document.getElementById("qIndex"),
  qText: document.getElementById("qText"),
  options: document.getElementById("options"),
  freeText: document.getElementById("freeText"),
  nextBtn: document.getElementById("nextBtn"),

  resultAnalysis: document.getElementById("resultAnalysis"),
  ajinLine: document.getElementById("ajinLine"),
  migouLine: document.getElementById("migouLine"),
  gungunLine: document.getElementById("gungunLine"),
  restartBtn: document.getElementById("restartBtn")
};

// ---------- 工具函式 ----------

function typeText(text, el, speed = 18) {
  el.textContent = "";
  let i = 0;
  return new Promise((resolve) => {
    function step() {
      if (i >= text.length) return resolve();
      el.textContent += text[i++];
      setTimeout(step, speed);
    }
    step();
  });
}

function resetCardAnimation() {
  els.qCard.classList.remove("exit");
  void els.qCard.offsetWidth; // reflow
  els.qCard.classList.add("enter");
}

function playCardExit() {
  return new Promise((resolve) => {
    els.qCard.classList.remove("enter");
    els.qCard.classList.add("exit");
    const onEnd = () => {
      els.qCard.removeEventListener("animationend", onEnd);
      resolve();
    };
    els.qCard.addEventListener("animationend", onEnd);
  });
}

function setNextButtonEnabled(enabled) {
  if (enabled) {
    els.nextBtn.classList.remove("disabled");
  } else {
    els.nextBtn.classList.add("disabled");
  }
}

// ---------- 題目 flow ----------

async function showQuestion(idx) {
  const total = topics.length;
  const n = idx + 1;

  els.qIndex.textContent = `Q${String(n).padStart(2, "0")}`;
  els.freeText.value = "";
  setNextButtonEnabled(false);

  // 建立選項
  els.options.innerHTML = "";
  choiceTemplates.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "option-btn";
    btn.dataset.key = String.fromCharCode(65 + i);

    btn.innerHTML = `
      <span class="option-key">${btn.dataset.key}</span>
      <span class="option-text">${text}</span>
    `;

    btn.addEventListener("click", () => {
      // 切換樣式
      Array.from(els.options.querySelectorAll(".option-btn")).forEach((b) =>
        b.classList.remove("selected")
      );
      btn.classList.add("selected");
      setNextButtonEnabled(true);

      // 把選擇暫存到 state 中（文字）
      const answerText = `[${btn.dataset.key}] ${text}`;
      state.answers[idx] = {
        choice: answerText,
        extra: els.freeText.value.trim()
      };
    });

    els.options.appendChild(btn);
  });

  // 問題逐字出現
  resetCardAnimation();
  await typeText(topics[idx], els.qText, 20);
}

async function goNext() {
  if (els.nextBtn.classList.contains("disabled")) return;

  const idx = state.index;
  // 更新補充文字
  const extra = els.freeText.value.trim();
  if (state.answers[idx]) {
    state.answers[idx].extra = extra;
  } else {
    state.answers[idx] = {
      choice: "",
      extra
    };
  }

  // 最後一題 → 送出 API
  if (idx >= topics.length - 1) {
    await playCardExit();
    await sendToAPI();
    return;
  }

  // 還有下一題
  await playCardExit();
  state.index += 1;
  showQuestion(state.index);
}

async function sendToAPI() {
  // 切換到結果 Stage
  els.stageQuestions.classList.add("hidden");
  els.stageResult.classList.remove("hidden");

  els.resultAnalysis.textContent = "正在繪製你的情緒向量圖…";

  // 組 pairs 給 /api/analysis.js
  const pairs = topics.map((q, i) => {
    const ans = state.answers[i] || { choice: "", extra: "" };
    const combined =
      ans.extra && ans.choice
        ? ${ans.choice}\n補充：${ans.extra}
        : ans.extra || ans.choice || "（沒有作答）`;
    return { q, a: combined };
  });

  try {
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairs })
    });

    if (!res.ok) throw new Error("network");

    const data = await res.json();
    if (!data || !data.ok) throw new Error("bad");

    els.resultAnalysis.textContent = data.analysis || "AI 有點安靜，等等再重試看看。";
    els.ajinLine.textContent = data.ajin || "";
    els.migouLine.textContent = data.migou || "";
    els.gungunLine.textContent = data.gungun || "";
  } catch (err) {
    console.error(err);
    els.resultAnalysis.textContent =
      "目前向量伺服器有點塞車，等等再點進來試一次就好。";
  }
}

// ---------- 事件綁定 ----------

function init() {
  if (els.enterBtn) {
    els.enterBtn.addEventListener("click", () => {
      els.stageIntro.classList.add("hidden");
      els.stageQuestions.classList.remove("hidden");
      state.index = 0;
      state.answers = [];
      showQuestion(0);
    });
  }

  if (els.nextBtn) {
    els.nextBtn.addEventListener("click", goNext);
  }

  if (els.restartBtn) {
    els.restartBtn.addEventListener("click", () => {
      state.index = 0;
      state.answers = [];
      els.stageResult.classList.add("hidden");
      els.stageIntro.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
