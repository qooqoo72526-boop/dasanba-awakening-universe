// ========== 25 題題庫（之後要換可以自己改這裡） ==========
const topics = [
  "你最近一次忍住沒有講出口的情緒是什麼？",
  "什麼事情最讓你覺得不被理解？",
  "你印象最深的一次情緒崩潰，發生在什麼情境？",
  "你曾經害怕，如果說出真實感受，會失去誰？",
  "你覺得自己哪一部分最難被看見？",
  "什麼事情讓你覺得自己很自由？",
  "你現在覺得最安全的地方，是因為什麼變成這樣？",
  "你最近一次對自己失望，是什麼畫面？",
  "你曾經假裝沒事，只是因為怕麻煩到誰？",
  "你希望別人怎麼對待你的情緒邊界？",
  "你最習慣用什麼方式逃避不舒服的感覺？",
  "你現在最想被問的一句話是什麼？",
  "如果可以跟過去的自己說一句話，你想說什麼？",
  "你覺得自己最容易被什麼樣的人觸發？",
  "你最近一次感覺「原來我其實很孤單」是什麼情境？",
  "有什麼話你一直講不出口，但希望有人自己懂？",
  "你對關係的最大渴望是什麼？",
  "你什麼時候最覺得自己被尊重？",
  "你有哪些習慣，其實是在保護自己？",
  "你覺得自己最怕被誰失望？為什麼？",
  "如果有一個地方，可以完全不用堅強，你會怎麼待在那裡？",
  "你最近一次真正覺得「好像有人站在我這邊」是什麼時候？",
  "你最不想被人看見的那一面，是什麼樣子？",
  "你覺得自己最需要學會的溫柔，是對誰？",
  "如果現在的你，可以放掉一個長期扛著的責任，那會是什麼？"
];

// 容器節點
const cloud = document.getElementById("vectorCloud");
const activeCard = document.getElementById("activeCard");
const cardIndexEl = document.getElementById("cardIndex");
const questionTextEl = document.getElementById("questionText");

const birds = {
  ajin: document.querySelector(".bird-node.ajin"),
  migou: document.querySelector(".bird-node.migou"),
  gungun: document.querySelector(".bird-node.gungun")
};

let currentIndex = null;

// ========== 建立 25 張懸浮卡片 ==========
function buildCards() {
  const frag = document.createDocumentFragment();

  topics.forEach((q, i) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "vector-card";
    card.dataset.index = String(i + 1);

    const idSpan = document.createElement("span");
    idSpan.className = "card-index-mini";
    idSpan.textContent = (i + 1).toString().padStart(2, "0");

    const line = document.createElement("p");
    line.className = "card-line-mini";
    line.textContent = q.length > 24 ? q.slice(0, 24) + "…" : q;

    card.appendChild(idSpan);
    card.appendChild(line);

    // hover 微傾斜
    card.addEventListener("mousemove", handleCardTilt);
    card.addEventListener("mouseleave", resetCardTilt);

    // 點擊啟動
    card.addEventListener("click", () => {
      activateVector(i);
    });

    frag.appendChild(card);
  });

  cloud.appendChild(frag);
}

// ========== 卡片微傾斜效果 ==========
function handleCardTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const rotateY = ((x / rect.width) - 0.5) * 10;
  const rotateX = ((y / rect.height) - 0.5) * -10;
  card.style.transform = `translate3d(0,-3px,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetCardTilt(e) {
  const card = e.currentTarget;
  card.style.transform = "";
}

// ========== 啟動題目：卡片飛來 + 翻轉 + 能量圈點亮 ==========
function activateVector(i) {
  currentIndex = i;

  // 左側卡片 active 樣式
  document.querySelectorAll(".vector-card").forEach((c, idx) => {
    c.classList.toggle("active", idx === i);
  });

  // 更新中央卡片文字
  const displayIndex = (i + 1).toString().padStart(2, "0");
  cardIndexEl.textContent = displayIndex;
  questionTextEl.textContent = topics[i];

  // 啟動中央卡片
  if (!activeCard.classList.contains("ready")) {
    activeCard.classList.add("ready");
  }

  // 觸發一次翻轉動畫
  activeCard.classList.remove("flipped");
  // 小 delay 用來觸發 reflow
  requestAnimationFrame(() => {
    activeCard.classList.add("flipped");
  });

  // 啟動底部三鳥其中一隻（簡單輪流）
  const birdKeys = ["ajin", "migou", "gungun"];
  const birdKey = birdKeys[i % birdKeys.length];
  Object.values(birds).forEach(b => b.classList.remove("active"));
  birds[birdKey].classList.add("active");
}

// ========== 之後要接 API 的 slot（先留給你） ==========
// 你未來如果要把 25 題 + 使用者填的回答送去 /api/chat.js 或 /api/analysis，
// 可以在這裡寫一個 function，從 topics[currentIndex] 取出題目、
// 再配合 textarea 的內容丟出去。
// 這一版先專心把「選題 + 飛來翻轉 + 能量圈」做好。

// 初始化
document.addEventListener("DOMContentLoaded", () => {
  if (!cloud) return;
  buildCards();
});
