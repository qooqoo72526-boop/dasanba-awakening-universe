// js/soul.js

const QUESTIONS = [
  "最近一次讓你覺得「受傷但懶得講」的事件是什麼？",
  "當你很想求助時，第一個想到的人是誰？為什麼？",
  "你最常對自己說的苛刻台詞是什麼？它從什麼時候開始？",
  "如果把現在的你切成三個聲音：理智、情緒、防衛，它們各自在說什麼？",
  "你最怕被誤解成什麼樣的人？為什麼那麼怕？",
  "什麼樣的場景會讓你瞬間變得很乖、很安靜？",
  "你做過最讓自己驚訝的反擊或拒絕是什麼？事後覺得怎麼樣？",
  "最近一次，你為了不讓別人失望而犧牲了什麼？",
  "你對「脆弱」這個詞的第一個直覺是什麼？舒服還是刺耳？",
  "如果現在可以對某個人說一句實話，不用負責任，你會對誰說什麼？",
  "你最常裝沒事的時候，心裡其實在吶喊什麼？",
  "你有沒有一個很難說出口的願望？說出來會覺得自己很貪心的那種。",
  "你習慣用什麼方式證明自己值得被愛？",
  "在你心裡，什麼狀態才叫「真的被看見」？",
  "如果把今天的你當成一個系統，你覺得哪一塊最常過熱？",
  "你最容易對哪一種人心軟？",
  "有沒有一段你早就該離開、卻拖到最後一刻的關係？",
  "你現在最想對過去哪一個版本的自己道歉？為了什麼？",
  "你曾經因為害怕失去，而做過最違反自己心意的決定是什麼？",
  "當你覺得不被理解時，你通常會怎麼保護自己？",
  "你覺得自己最被低估的地方是什麼？",
  "你最不想被別人看到的情緒是哪一種？",
  "如果可以暫停所有角色，只當自己 24 小時，你會怎麼過？",
  "你現在最想切斷的是哪一種期待？",
  "你覺得自己目前最大的情緒勒索對象，是別人還是你自己？"
];

const s = {};
const state = {
  currentIndex: null,
  answers: {},
  sending: false
};

function $(id) {
  return document.getElementById(id);
}

function initDOM() {
  s.qList = $("qList");
  s.currentQ = $("currentQuestion");
  s.answer = $("answerArea");
  s.pushBtn = $("pushBtn");
  s.submit = $("submitScan");
  s.output = $("analysisOutput");
  s.ajin = $("ajinLine");
  s.migou = $("migouLine");
  s.gungun = $("gungunLine");
}

function renderQuestions() {
  s.qList.innerHTML = "";
  QUESTIONS.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "soul-q-pill";
    btn.dataset.index = i;
    btn.innerHTML = `<span>${text}</span>`;
    btn.addEventListener("click", () => selectQuestion(i));
    s.qList.appendChild(btn);
  });
}

function selectQuestion(index) {
  // 存現在這題的答案
  saveCurrentAnswer();

  state.currentIndex = index;

  const items = s.qList.querySelectorAll(".soul-q-pill");
  items.forEach((el) => el.classList.remove("soul-q-pill-active"));
  const active = s.qList.querySelector(`.soul-q-pill[data-index="${index}"]`);
  if (active) active.classList.add("soul-q-pill-active");

  s.currentQ.textContent = QUESTIONS[index];

  const saved = state.answers[index] || "";
  s.answer.value = saved;
  s.answer.disabled = false;

  s.pushBtn.disabled = false;
}

function saveCurrentAnswer() {
  if (state.currentIndex == null) return;
  if (!s.answer) return;
  state.answers[state.currentIndex] = s.answer.value || "";
  updateSubmitState();
}

function handlePush() {
  // 這裡可以加一些特效用的 class，純視覺
  const scanner = document.querySelector(".soul-scanner");
  scanner?.classList.add("soul-scanner-pulse");
  setTimeout(() => scanner?.classList.remove("soul-scanner-pulse"), 260);
}

function updateSubmitState() {
  const answeredCount = Object.values(state.answers).filter(
    (v) => v && v.trim().length > 0
  ).length;

  const allDone = answeredCount >= QUESTIONS.length;
  if (allDone && !state.sending) {
    s.submit.disabled = false;
    s.submit.classList.add("soul-submit-ready");
  } else {
    s.submit.disabled = true;
    s.submit.classList.remove("soul-submit-ready");
  }
}

async function handleSubmit() {
  saveCurrentAnswer();

  const answeredCount = Object.values(state.answers).filter(
    (v) => v && v.trim().length > 0
  ).length;
  if (answeredCount < QUESTIONS.length) return;

  if (state.sending) return;
  state.sending = true;
  s.submit.disabled = true;
  s.submit.classList.remove("soul-submit-ready");

  // 清空畫面，只留空白＋轉圈感（用 CSS 動畫撐場）
  s.output.textContent = "";
  s.ajin.textContent = "";
  s.migou.textContent = "";
  s.gungun.textContent = "";

  const pairs = QUESTIONS.map((q, i) => ({
    q,
    a: state.answers[i] || ""
  }));

  try {
    const res = await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairs })
    });

    if (!res.ok) throw new Error("network");

    const data = await res.json();
    if (!data || !data.ok) throw new Error("bad");

    s.output.textContent = data.analysis || "";
    s.ajin.textContent = data.ajin || "";
    s.migou.textContent = data.migou || "";
    s.gungun.textContent = data.gungun || "";
  } catch (e) {
    // 真的出錯才講一句人話
    s.output.textContent = "連線暫時有問題，可以稍後再試一次。";
  } finally {
    state.sending = false;
    updateSubmitState();
  }
}

function initEvents() {
  s.answer.addEventListener("input", () => {
    if (state.currentIndex == null) return;
    state.answers[state.currentIndex] = s.answer.value;
    updateSubmitState();
  });

  s.pushBtn.addEventListener("click", () => {
    if (s.pushBtn.disabled) return;
    handlePush();
  });

  s.submit.addEventListener("click", () => {
    if (s.submit.disabled) return;
    handleSubmit();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initDOM();
  renderQuestions();
  initEvents();
});
