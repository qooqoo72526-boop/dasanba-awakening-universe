// ===============================
// 題庫（深度題）
// ===============================
const EVA_BANK = [
  "你多久會告訴自己「沒事啦」，但其實一點都不想原諒？",
  "最近一次想要消失，是哪一個瞬間？",
  "你最怕哪一種安靜：沒人回訊息，還是有人回得很敷衍？",
  "當你說「我習慣了」的時候，心裡其實在放棄什麼？",
  "你曾為了不被丟下，做過最違背自己的一件事是什麼？",
  "你最怕哪種愛：說很多但做很少，還是什麼都不說但你永遠搞不懂？",
  "有哪個人，只要提到名字，你情緒就會瞬間變得很吵？",
  "如果可以對某個人講一句最難聽的真心話，你會講什麼？",
  "在關係裡，你最常裝沒看到的紅旗是什麼？",
  "你有沒有那種「只要一想起來就會瞬間硬起來」的委屈？",
  "你希望別人怎麼安撫你，但幾乎沒有人做到過？",
  "你演給別人看的那個版本，最怕哪一個人看穿？",
  "你現在生活中，有哪個地方一直在透支你，但你遲遲不離開？",
  "你對「被需要」這件事，到底舒服還是疲憊？",
  "你最常在什麼時候，覺得自己只是備用零件？",
  "你有沒有哪一次，很想要理所當然地被偏心，卻沒有？",
  "你害怕衝突，是因為不想傷人，還是更怕被討厭？",
  "你最近一次真正想哭卻憋住，是因為什麼？",
  "你有沒有哪個習慣，其實只是為了讓自己看起來還過得去？",
  "如果可以暫停一段關係三個月，你最想暫停哪一段？",
  "你最常對自己說的謊是什麼？",
  "哪一個選擇，是你嘴上說不後悔，但心裡一直在重演的？",
  "你其實在等誰先道歉？",
  "你害怕哪一種孤單：身邊沒人，還是身邊一堆人卻沒有人懂你？",
  "如果今天可以不用再撐，你最想放掉的是什麼？"
];

// DOM
const qListEl    = document.getElementById("evaQList");
const floatQEl   = document.getElementById("evaFloatQ");
const inputEl    = document.getElementById("evaInput");
const resultEl   = document.getElementById("evaResult");
const progressEl = document.getElementById("evaProgressText");
const sendBtn    = document.getElementById("evaSendBtn");

// 狀態
let QUESTION_SET = [];
let ANSWERS = {};
let currentIndex = null;

// 取 25 題
function pick25() {
  const arr = [...EVA_BANK];
  arr.sort(() => Math.random() - 0.5);
  return arr.slice(0, 25);
}

// 渲染左側題目
function renderQuestions() {
  QUESTION_SET = pick25();
  qListEl.innerHTML = "";
  ANSWERS = {};
  currentIndex = null;
  inputEl.value = "";
  updateProgress();
  updateSendButton();

  QUESTION_SET.forEach((q, i) => {
    const item = document.createElement("div");
    item.className = "eva-q-item";
    item.textContent = q;
    item.addEventListener("click", () => onSelectQuestion(i));
    qListEl.appendChild(item);
  });
}

// 點題目 → 中央浮現
function onSelectQuestion(i) {
  currentIndex = i;

  const all = qListEl.querySelectorAll(".eva-q-item");
  all.forEach(el => el.classList.remove("is-active"));
  const active = qListEl.children[i];
  if (active) active.classList.add("is-active");

  const text = QUESTION_SET[i] || "";
  floatQEl.innerHTML =
    `<div class="eva-floating-question-text">${text}</div>`;
  floatQEl.classList.remove("eva-pop");
  void floatQEl.offsetWidth;
  floatQEl.classList.add("eva-pop");

  inputEl.value = ANSWERS[i] || "";
}

// 更新進度
function updateProgress() {
  const answeredCount = Object.values(ANSWERS)
    .filter(v => v && v.trim().length > 0).length;
  progressEl.textContent = `已紀錄 ${answeredCount} / 25`;
}

// 控制箭頭啟用
function updateSendButton() {
  const answeredCount = Object.values(ANSWERS)
    .filter(v => v && v.trim().length > 0).length;
  sendBtn.disabled = answeredCount < 8;  // 至少寫 8 題才亮
}

// 輸入同步儲存
inputEl.addEventListener("input", () => {
  if (currentIndex === null) return;
  ANSWERS[currentIndex] = inputEl.value;
  updateProgress();
  updateSendButton();
});

// 送出 → /api/chat
sendBtn.addEventListener("click", async () => {
  const answeredCount = Object.values(ANSWERS)
    .filter(v => v && v.trim().length > 0).length;
  if (answeredCount < 8) return;

  const originalBtn = sendBtn.innerHTML;
  sendBtn.disabled = true;
  sendBtn.innerHTML = `<span class="eva-send-arrow">➤</span>`;

  resultEl.innerHTML = `
    <p class="eva-result-hint">
      訊號已送出。<br>
      等它把你的字排成一面鏡子。
    </p>
  `;

  const qaLines = QUESTION_SET.map((q, i) => {
    const a = ANSWERS[i] || "（這題沒有寫）";
    return `題目：${q}\n回答：${a}`;
  }).join("\n\n");

  const prompt = `
你是一個很誠實、敢講的情緒教練，不走雞湯，不講官腔。

下面是使用者在「靈魂照妖鏡」裡回答的題目與內容：

${qaLines}

請用中文完成這個結構：

1. 先用 2～3 句話，直接點出這個人目前情緒與人生狀態的核心問題，可以有點狠，但語氣像站在他這邊的朋友，不是老師。
2. 接著寫一段約 400～500 字的深度拆解，說明：
   - 他/她一直在重複的情緒模式與自我欺騙
   - 在關係、工作或自我價值上，最容易卡住的地方
   - 如果要對自己誠實，接下來三個月可以開始練習的一個小行動
3. 最後用三行收尾，分別是三隻鳥的語氣，每行開頭請加上角色名：
   - 阿金：行動派、反骨、敢講狠話
   - 米果：高價值、自尊、主權、會提醒界線
   - 滾滾：理解、溫柔但直接，不討好也不貶低

整體語氣要：直接、真心、敢講，但不要侮辱人，也不要太「心靈雞湯」。
請不要出現「解析如下」「總結」「分析」這種官方用語。
  `.trim();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    const text = data.reply || data.message || JSON.stringify(data);

    resultEl.innerHTML = `<p>${text.replace(/\n/g, "<br>")}</p>`;
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = `
      <p class="eva-result-hint">
        剛剛訊號卡了一下。<br>
        字都還在，等等再按一次箭頭就好。
      </p>
    `;
  } finally {
    sendBtn.disabled = false;
    sendBtn.innerHTML = originalBtn;
  }
});

// 初始化
renderQuestions();
