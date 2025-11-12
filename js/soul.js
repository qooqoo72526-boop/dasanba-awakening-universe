import { mountStarfield, callAPI, typeInto } from './shared.js';

/* ---------------------------
   1) 題庫：核心 × 變奏 → 500+
----------------------------*/

// 核心深度題（45 條；都是真問深掘）
const CORES = [
  "當最近一年，你覺得自己“失去”了什麼？",
  "你對“安全感”的定義是什麼？請描述一個場景。",
  "你最想被誰理解？為什麼是他/她？",
  "你曾在哪個關係裡“降低了自己”？發生了什麼？",
  "你捨不得放手的，是人、回憶，還是你自己想像中的樣子？",
  "如果今天只能做一個小小決定，會改變什麼？",
  "你對“價值感”的來源有何誤解？",
  "你曾經反覆出現的夢或意象是什麼？你怎麼詮釋？",
  "你嫉妒過誰？嫉妒的其實是他擁有的哪個“自由”？",
  "你做過最勇敢的“轉彎”是什麼？",
  "你最想修補的是哪一段對話？缺了哪句話？",
  "你害怕衝突，是怕失去對方，還是怕看見真相？",
  "你眼中的“成功”長什麼樣？哪些元素其實不是你的？",
  "你最想對童年的自己說什麼？現在也需要聽到嗎？",
  "你在哪些時刻會不自覺討好？代價是什麼？",
  "你對“邊界”的第一個記憶是什麼？",
  "你習慣沉默，是保護，還是迴避？",
  "你把理想的自己藏在哪裡？為什麼還沒請她出來？",
  "當你說“沒事”，其實是什麼事？",
  "你最常掛在心上、卻從未行動的一件事是？",
  "你想被怎麼愛？請具體說明“被看見”的方式。",
  "你在關係裡最容易失衡的角色是什麼？",
  "你分不清的，是憐惜還是愛？說出一個例子。",
  "你對“自由”的想像，哪部分其實讓你恐懼？",
  "你對金錢最根本的焦慮，來自哪個故事？",
  "如果你完全不怕評價，今晚你會做什麼？",
  "你最討厭自己哪個反射動作？它保護了你多久？",
  "你什麼時候假裝很堅強？說一個畫面。",
  "你覺得“自尊”與“自大”的界線在哪？",
  "你在誰面前會變得特別溫柔？為什麼？",
  "你把哪些天賦縮小了尺寸？",
  "你對“忠誠”的要求，是對人，還是對真相？",
  "哪個讚美讓你最不自在？它戳到了什麼？",
  "你最不想被誰看見脆弱？原因呢？",
  "你曾為了被愛而背叛過自己嗎？怎麼背叛的？",
  "你最想擁有哪種“不可動搖”的底氣？",
  "當你生氣時，最想被誰擁抱？",
  "你“懂事”的代價是什麼？",
  "你在哪些時刻會“過度負責”？源頭是？",
  "哪個遺憾，你準備好不再修復、只選擇重生了嗎？",
  "你覺得別人誤解你的最大點是什麼？",
  "你對“安全”與“創造”的排序？為什麼？",
  "你還欠自己哪一句真話？",
  "如果你不再想做“好人”，你會先做什麼？",
  "請說一件你做得很好的事，但總被你忽略的。"
];

// 變奏（14 條；讓同題出不同角度）
const TWISTS = [
  "換一種更誠實、更粗糙的說法。",
  "把它寫成三句短句，節奏要狠一點。",
  "加上一個具體場景（時間/地點/氣味）。",
  "把責任分清楚：哪一塊是你的，哪一塊不是。",
  "說出你真正想做的第一步（今天能完成）。",
  "如果交給過去的你來回覆，他/她會怎麼說？",
  "刪掉委婉，留下刀口。",
  "用你最喜歡的歌名/台詞，隱喻一次。",
  "把“怕失去”的對象換成“怕看見自己”。",
  "只允許 50 字，去掉裝飾。",
  "寫成要傳給自己的語音備忘錄。",
  "改寫成對未來伴侶/夥伴的一段指令。",
  "把願望換成承諾，語氣更堅決。",
  "說一句你準備從今晚開始停止的行為。"
];

// 生成 & 洗牌 & 取 500
function buildBank() {
  const box = new Set();
  for (let i = 0; i < CORES.length; i++) {
    for (let j = 0; j < TWISTS.length; j++) {
      box.add(`${CORES[i]}｜${TWISTS[j]}`);
    }
  }
  const arr = Array.from(box);
  // 洗牌
  for (let i = arr.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[k]] = [arr[k], arr[i]];
  }
  return arr.slice(0, 500);
}
const BANK = buildBank();

/* ---------------------------
   2) UI / 狀態
----------------------------*/
const S = {
  qGrid: null,
  resBox: null,
  resText: null,
  resThree: null,
  hintTimer: null,
};

const LS_KEY = 'soulmirror_bank_index_v1';

// 讀取當前起始索引（跨重整記憶）
function getStartIndex() {
  const v = parseInt(localStorage.getItem(LS_KEY) || '0', 10);
  return Number.isFinite(v) ? v : 0;
}
function setStartIndex(v) {
  localStorage.setItem(LS_KEY, String(v % BANK.length));
}

// 取得 25 題（不重複，走到尾會自動循環）
function take25() {
  const start = getStartIndex();
  const slice = [];
  for (let i = 0; i < 25; i++) slice.push(BANK[(start + i) % BANK.length]);
  setStartIndex(start + 25);
  return slice;
}

/* ---------------------------
   3) 魔法提示（等待 API）
----------------------------*/
const HINTS = [
  "正在調頻到你的內在星圖⋯",
  "宇宙回信中，請保持呼吸穩定⋯",
  "收束雜訊，鎖定你的獨特頻道⋯",
  "銀紫脈衝啟動，靈鏡正在校準⋯",
];

function startHints() {
  const el = document.querySelector('.magic-lines .txt');
  if (!el) return;
  let idx = 0;
  S.hintTimer = setInterval(() => {
    el.textContent = HINTS[idx++ % HINTS.length];
  }, 1600);
}
function stopHints() {
  if (S.hintTimer) clearInterval(S.hintTimer);
  S.hintTimer = null;
}

/* ---------------------------
   4) 渲染題目 / 點擊流程
----------------------------*/
function renderQuestions() {
  S.qGrid.innerHTML = '';
  const list = take25();
  list.forEach((line) => {
    const [q, twist] = line.split('｜');
    const opt = document.createElement('div');
    opt.className = 'option';
    opt.innerHTML = `<span class="q">${q}</span><span class="tw">${twist}</span>`;
    opt.addEventListener('click', () => onPick(line, opt));
    S.qGrid.appendChild(opt);
  });
}

async function onPick(line, node) {
  // 柔光脈衝
  node.classList.add('pulse');
  setTimeout(() => node.classList.remove('pulse'), 500);

  // 啟動等待提示
  startHints();

  const [q, tw] = line.split('｜');

  // 1) 呼叫你的 API（/api/chat.js）
  let data = null;
  try {
    data = await callAPI({
      mode: 'soulmirror',
      question: `${q} ｜ ${tw}`,
      need: '600w_deep + three_one_liners',
      tone: 'daring,honest,rebirth,not-official',
      regionHint: 'sin1' // 後端若有支援會採用；你已固定 sin1/hnd1/icn1
    });
  } catch (e) {
    // swallow error → 顯示溫柔 fallback
  }

  stopHints();

  // 2) 顯示 600 字解析（用打字機）
  const longText =
    (data && data.analysis)
    || "訊號較弱，但靈鏡仍捕捉到你的軌跡。先承認那份不甘與恐懼，別再用懂事包起來。今晚把想做的第一步排進行程，讓身體帶走腦內的雜音——你不是要被修復的人，你只是要把自己叫回來。";

  S.resText.textContent = '';
  await typeInto(S.resText, longText, 14); // 14ms/字，流暢不煩躁

  // 3) 三鳥一句話
  const lines = (data && data.lines) || fallbackBirdLines(q);
  S.resThree.innerHTML = `
    <div class="bird-line ajin">💛 AJIN｜${lines.ajin}</div>
    <div class="bird-line migou">🧡 MIGOU｜${lines.migou}</div>
    <div class="bird-line gungun">💙 GUNGUN｜${lines.gungun}</div>
  `;

  // 滾到結果區
  S.resBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 依問題生成前端 fallback 的三鳥語氣
function fallbackBirdLines(q) {
  return {
    ajin:
      "別再演乖了。把今天那一步做掉，姿勢帥一點，讓世界記得你的名字。",
    migou:
      "把界線寫清楚：你要什麼、不接受什麼、底線在哪。說到做到，這叫尊重自己。",
    gungun:
      "先呼吸，再把委屈說出來。你值得被好好理解，溫柔不是退讓，是力量。"
  };
}

/* ---------------------------
   5) init
----------------------------*/
function init() {
  // 背景星塵
  mountStarfield('#starfield', { density: 150, hue: 265 }); // 帶紫調

  S.qGrid   = document.querySelector('.question-grid');
  S.resBox  = document.querySelector('.result-box');
  S.resText = document.querySelector('.result-box .txt');
  S.resThree= document.querySelector('.result-box .three');

  renderQuestions();
}

document.addEventListener('DOMContentLoaded', init);
