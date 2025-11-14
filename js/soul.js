/* ======= 自動生成 25 題 ======= */
const cardWrap = document.getElementById("cardWrap");

const QUESTIONS = [
  "你覺得你現在最渴望的是什麼？",
  "你最近最常出現的情緒是什麼？",
  "如果現在能逃離一件事，那會是什麼？",
  "你最害怕被誰誤解？",
  "你最想修復的關係是什麼？",
  "你覺得什麼事情正在耗損你？",
  "你覺得你對自己最苛刻的地方是什麼？",
  "你最近避開了哪個重要決定？",
  "你永遠不想失去的是什麼？",
  "你對誰有說不出口的期待？",
  "什麼東西正在制約你？",
  "你覺得你哪裡變強了？",
  "你最近為什麼感到疲倦？",
  "你最不想面對的真相是什麼？",
  "你覺得自己下一步該做什麼？",
  "你的壓力最常從哪裡開始？",
  "你最近一次感到被理解是什麼時候？",
  "此刻你最想說但不敢說的是什麼？",
  "你覺得自己哪裡被低估了？",
  "你覺得你最需要的是什麼力量？",
  "哪個情緒最容易控制你？",
  "你最近哪個瞬間有想哭的衝動？",
  "你最想擺脫的模式是什麼？",
  "你覺得你最深的埋怨是什麼？",
  "你覺得你的靈魂正在哪卡住？"
];

/* ======= 生成卡片 ======= */
function placeCards() {
    const count = 25;
    const radius = 260;

    for (let i = 0; i < count; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerText = (i + 1).toString().padStart(2, "0");

        const angle = (i - 12) * (Math.PI / 14);

        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * 50 - 40;

        card.style.left = `calc(50% + ${x}px)`;
        card.style.top = `calc(50% + ${y}px)`;

        /* 立體微旋轉 */
        card.style.transform = `rotateY(${angle * 18}deg)`;

        /* 點擊事件 */
        card.onclick = () => activateCard(card, i);

        cardWrap.appendChild(card);
    }
}

placeCards();

/* ======= 點擊卡片：飛出翻轉 ======= */
function activateCard(card, index) {
    const all = document.querySelectorAll(".card");
    all.forEach(c => (c.style.opacity = 0.1));

    card.classList.add("active");

    /* 題目顯示 */
    setTimeout(() => {
        document.getElementById("qText").innerText = QUESTIONS[index];
        document.getElementById("questionPanel").classList.add("show");
    }, 600);
}
