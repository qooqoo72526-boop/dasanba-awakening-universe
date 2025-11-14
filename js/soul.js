// js/soul.js
// 靈魂照妖鏡：高科技版。25 題深度＋自由輸入，送到 /api/analysis。

const QUESTIONS = [
  "最近一次讓你想翻白眼、但最後選擇沉默的畫面是什麼？",
  "當別人說「你想太多」時，你心裡其實在想什麼？",
  "你習慣用什麼方式，假裝自己已經不在意了？",
  "如果能對現在的自己誠實一句，最想承認什麼不完美？",
  "你最怕被誰看見自己崩潰？為什麼是那個人？",
  "最近一次，你的好脾氣是在幫誰擦屁股？",
  "有哪件事，你到現在都覺得「其實我超委屈」？",
  "當你說「沒事啦」時，心裡真正的 OS 是什麼？",
  "你哪一種情緒，最常被別人誤解成「你在生氣」？",
  "如果把今天過得很糟的原因，濃縮成一句很誠實的話，那句是？",
  "你最羨慕別人身上哪一種自由？",
  "有哪個選擇，你當下裝得很理智，但其實是在保護誰？",
  "你對自己下過最狠的一句評語是什麼？",
  "如果可以暫停所有責任 24 小時，你最想怎麼發瘋一場？",
  "你有沒有一個永遠不會講出口的標準：超過這條線，你就會走？",
  "最近什麼時候，你突然覺得「我好像沒被誰真正看見」？",
  "你在哪種關係裡，最容易變得很乖？",
  "你最常假裝不在乎、實際上超在乎的是什麼？",
  "如果讓你選：被誤解、還是被忽略，你比較怕哪一個？",
  "有沒有一個 moment 讓你覺得「原來我真的長大了」？",
  "你心裡最柔軟、但最不敢被人碰到的地方是什麼主題？",
  "你對「安穩的人生」的版本，到底長什麼樣子？",
  "如果可以重來一次，你最想改掉哪一個對自己的誤會？",
  "你什麼時候會突然很想消失，悄悄躲起來？",
  "最近一次讓你突然鼻酸的畫面，是哪一個細節？",
  "當你說「算了」的時候，心裡其實期待什麼奇蹟？",
  "你最常對自己說的鼓勵，不是加油，而是什麼？",
  "你覺得別人永遠搞不懂你哪一塊？",
  "如果情緒有一個顏色，現在的你是什麼顏？為什麼？"
];

const state = {
  selected: new Set(),
  busy: false
};

function $(sel) {
  return document.querySelector(sel);
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const pool = shuffle(QUESTIONS);
  return pool.slice(0, Math.min(25, pool.length));
}

function renderQuestions() {
  const grid = $("#soulQuestions");
  if (!grid) return;
  grid.innerHTML = "";

  const list = pickQuestions();
  list.forEach((q) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "soul-q";
    btn.textContent = q;
    btn.dataset.q = q;
    btn.addEventListener("click", () => toggleQuestion(q, btn));
    grid.appendChild(btn);
  });
}

function toggleQuestion(q, el) {
  if (state.busy) return;
  if (state.selected.has(q)) {
    state.selected.delete(q);
    el.classList.remove("active");
  } else {
    state.selected.add(q);
    el.classList.add("active");
  }
  updateReadyState();
}

function collectPairs() {
  const notes = $("#soulNotes");
  const text = (notes?.value || "").trim();
  const pairs = [];

  if (state.selected.size) {
    state.selected.forEach((q) => {
      pairs.push({
        q,
        a: text || "這題我先交給你看，你比我敢說實話。"
      });
    });
  } else if (text) {
    pairs.push({
      q: "自由輸入",
      a: text
    });
  }

  return pairs;
}

function updateReadyState() {
  const notes = $("#soulNotes");
  const submit = $("#submitScan");
  const pushChip = $("#soulPush");
  if (!submit || !pushChip) return;

  const hasText = (notes?.value || "").trim().length > 0;
  const hasQ = state.selected.size > 0;
  const ready = hasText || hasQ;

  submit.disabled = !ready;
  submit.classList.toggle("ready", !!ready);
  pushChip.classList.toggle("active", !!ready);
}

async function handleSubmit() {
  if (state.busy) return;
  const submit = $("#submitScan");
  const overlay = $("#soulScanning");
  const analysis = $("#analysisText");
  const ajin = $("#ajinLine");
  const migou = $("#migouLine");
  const gungun = $("#gungunLine");

  const pairs = collectPairs();
  if (!pairs.length) return;

  state.busy = true;
  submit.disabled = true;
  submit.classList.remove("ready");
  if (overlay) overlay.classList.remove("hidden");
  if (analysis) analysis.textContent = "";
  if (ajin) ajin.textContent = "";
  if (migou) migou.textContent = "";
  if (gungun) gungun.textContent = "";

  try {
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairs })
    });

    if (!res.ok) throw new Error("network");

    const data = await res.json();
    if (!data || !data.ok) throw new Error("bad");

    if (analysis) analysis.textContent = data.analysis || "";
    if (ajin) ajin.textContent = data.ajin || "";
    if (migou) migou.textContent = data.migou || "";
    if (gungun) gungun.textContent = data.gungun || "";
  } catch (err) {
    if (analysis) {
      analysis.textContent = "訊號有點亂，再按一次就好。";
    }
  } finally {
    state.busy = false;
    if (overlay) overlay.classList.add("hidden");
    updateReadyState();
  }
}

function initSoulMirror() {
  if (document.body.dataset.page !== "soulmirror") return;

  renderQuestions();
  updateReadyState();

  const notes = $("#soulNotes");
  if (notes) {
    notes.addEventListener("input", updateReadyState);
  }

  const submit = $("#submitScan");
  if (submit) {
    submit.addEventListener("click", handleSubmit);
  }
}

document.addEventListener("DOMContentLoaded", initSoulMirror);

document.addEventListener("DOMContentLoaded", initSoulMirror);
