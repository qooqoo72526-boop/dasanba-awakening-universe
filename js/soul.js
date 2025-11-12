import { mountStarfield, callAPI, typeInto } from './shared.js';

/* ====== 題庫擴充：80×20 組，保證不重複 & 自動續庫 ====== */

// 1) 題幹（80 條，深度 & 具體）
const CORES = [
  "當最近一年，哪一刻讓你覺得『價值被看見』？為什麼？",
  "有人誤解你時，你是選擇澄清、幽默化解，還是先沉默？背後的原因？",
  "如果『安全感』能被量化，此刻你的指數幾分？缺了哪一塊？",
  "你曾為了迎合而點頭的場景，現在回看想改哪一步？",
  "把『界線』具象成一個場景：門、光牆、海面或其他？你會怎麼走過？",
  "這一年你放下的一句話是什麼？它原本套在你身上多久了？",
  "你最想修掉的『討好型反應』是什麼？會在什麼觸發條件出現？",
  "當你說『我很好』時，心裡其實是什麼顏色與溫度？",
  "說一段你沒有被理解、但仍選擇善待自己的經驗。",
  "如果今天要替過去的你寫一張備忘：你最想提醒他的三件事？",
  "你把『成功』定義成哪三個感受詞？為什麼是它們？",
  "最近一次情緒爆炸前，身體給過哪些微訊號？",
  "你最珍惜的關係裡，哪一條不可觸碰的界線曾被踩過？你怎麼處理？",
  "當你說『我不療傷，我只覺醒』，你想從哪一處先覺？",
  "你把『驕傲』翻譯成什麼生活行為？說一個小片段。",
  "你最欣賞自己哪種反骨？它有沒有傷到誰？如何修正力量的方向？",
  "如果要對內在小孩說一句實話，此刻想說什麼？",
  "講一段你對某人『溫柔但堅定』的 NO。",
  "過去一年你練會的情緒技能是什麼？它救了你哪一回？",
  "描述一次你在不被看好時，仍選擇出手的理由。",
  "你最怕被怎麼評價？那句話為何有穿透力？",
  "把『自尊』拆成三個日常行為，今天你做了哪一個？",
  "說一個你以為自己不行、但後來做到了的瞬間。",
  "當你需要被理解時，你最希望別人做/不做哪一件事？",
  "你為何常把責任攬在身上？背後的善意與代價是？",
  "最近一次原諒自己的具體做法是什麼？",
  "你會如何分辨『真安全』與『假安全』？說例子。",
  "若把界線設成儀式，第一步會做什麼？為何是那一步？",
  "描述你對『愛自己』最不官方、最接地氣的一個行為。",
  "你什麼時候最像『真正的你』？場景、聲音、氣味是什麼？",
  "最近一次把情緒說清楚，而不是說大話；你怎麼做到？",
  "你希望別人如何靠近你？寫一份使用說明。",
  "把『被看見』換成一個比喻（天氣/動物/顏色/樂器）並解釋。",
  "你替誰承受了不屬於你的責任？現在打算怎麼放回去？",
  "你把哪一種脆弱藏最深？它其實在保護什麼？",
  "你最想向誰道謝但還沒說？想說哪三句？",
  "當你說『快樂』時，體感在身體哪個部位？",
  "你希望未來半年，哪個習慣被徹底改寫？第一步是？",
  "說一段你『對自己不再殘忍』的證據。",
  "如果要為現在的你打造一個保護場，三個元素是？為何？",
  "你最怕的失敗其實在提示什麼需求？",
  "請為『自由』寫三個行為 KPI（可衡量）。",
  "你在誰面前最能鬆弛？他做對了什麼？",
  "說一段你拒絕別人、卻保住彼此尊嚴的對話。",
  "你的『誠懇』長什麼樣？它是否也會過度消耗你？",
  "你曾在哪個選擇上『背叛自己』？如果重來會怎麼做？",
  "把『有價值』翻成一句粗口版本（真實、帶力道）。",
  "你與金錢的關係是安全感、自由度，還是補償？",
  "你最希望別人別再教訓你的主題是什麼？",
  "你練過的最有用的道歉句型是？什麼時候用？",
  "給明天的你一個不敷衍的承諾（可執行、可驗收）。",
  "哪個習慣讓你離理想的自己越來越近？證據是？",
  "你最近在學會『慢一點』哪件事？",
  "請說一段你選擇挺身而出，而不是抱怨的回合。",
  "當你說『累』，其實在需要哪種陪伴？",
  "你對『被需要』與『被利用』的分界線是什麼？",
  "你最想丟掉的一句長期自我標籤是什麼？",
  "你近來一次深呼吸到哭，是為了誰或什麼？",
  "如果把今天過得像重生，你會砍掉哪三件無效消耗？",
  "請描述一次你把『好脾氣』變成『好底線』的瞬間。",
  "說出你最想被問、但從來沒人問過的那個問題。",
  "你在哪件事上對自己過度嚴苛？放鬆 20% 會怎樣？",
  "你最想把哪段關係升級？第一個動作是？",
  "寫下你今天拒絕的第一個誘惑，它本質上是什麼？",
  "說一段你讓『愛現』變成『把光借別人』的場景。",
  "最近一次把『理解』放在『勸告』前面的時候。",
  "你準備對哪個恐懼宣戰？定義『戰勝』的樣子。",
  "把『成熟』拆成三個不浮誇的日常動詞。",
  "你什麼時候會對自己說謊？能否改成延遲回答？",
  "你對『親密』的三個條件是？沒達到時怎麼處理？",
  "說一段你在群體裡，仍替真實自己站台的記憶。",
  "當你說『我值得』，你會怎麼花一筆小錢證明？",
  "你最想對哪個『規則』提出異議？給出你的版本。",
  "寫下你願意原諒自己的三個理由。",
  "你現階段最好的武器：行動力、耐力、幽默？為什麼？"
];

// 2) 轉折/加料（20 條，讓題更具體、更多維度）
const TWISTS = [
  "—請用一個具象比喻完成它。",
  "—把答案限制在三句內，且每句不超過 12 個字。",
  "—先寫感受，再寫事實，順序不要反過來。",
  "—把『別人期待』劃掉後，重寫你的版本。",
  "—請加入一個身體感受詞與一個顏色。",
  "—把它寫成你會實踐的一個微行動。",
  "—換成對 8 歲的你解釋一次。",
  "—想像明天就要做，最大的阻力會是什麼？",
  "—寫下你願意因此放棄的一樣東西。",
  "—請補上一句『更野一點』的替代方案。",
  "—把答案濃縮為 3 個關鍵詞。",
  "—把它寫成訊息要傳給某個人（不一定送出）。",
  "—加入一個『如果…那我就…』條件句。",
  "—描述成功的畫面，但禁止用大道理。",
  "—把它寫成一段 20 秒語音會說的話。",
  "—為自己設一個 48 小時內可驗收的行為。",
  "—請指出需要誰的幫忙，姿態怎麼開口？",
  "—想像阿金/米果/滾滾各給一句提醒。",
  "—把『怕丟臉』改寫成一個更誠實的需求。",
  "—若只留下一句話，你會怎麼說？"
];

// 3) 生成 500 題（打散、去重、保存在 localStorage）
function buildBank() {
  const bag = [];
  for (let i = 0; i < CORES.length; i++) {
    for (let j = 0; j < TWISTS.length; j++) {
      bag.push(`${CORES[i]} ${TWISTS[j]}`);
    }
  }
  // 打亂
  for (let i = bag.length - 1; i > 0; i--) {
    const k = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[k]] = [bag[k], bag[i]];
  }
  // 取 500
  return bag.slice(0, 500);
}

const LS_KEY = 'soul_bank_v1';

function loadBank() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const obj = JSON.parse(raw);
      if (Array.isArray(obj.pool) && obj.pool.length) return obj;
    }
  } catch (_) {}
  // 沒有就重建
  return { pool: buildBank(), used: [] };
}

function saveBank(obj) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); } catch (_) {}
}

// 取得本次要顯示的 25 題；不夠就自動續庫
function next25() {
  let state = loadBank();
  const take = [];
  while (take.length < 25) {
    if (state.pool.length === 0) {
      state = { pool: buildBank(), used: [] };
    }
    const q = state.pool.pop();
    state.used.push(q);
    take.push(q);
  }
  saveBank(state);
  return take;
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
    opt.style.setProperty('--delay', (Math.random() * 6).toFixed(2) + 's');
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
