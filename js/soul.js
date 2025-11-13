// ============================
//  Soul Mirror main script
// ============================

(() => {
  const nodeLayer = document.getElementById("soul-node-layer");
  if (!nodeLayer) return;

  const focusLayer = document.getElementById("soul-focus-layer");
  const focusQuestionText = document.getElementById("focus-question-text");
  const answerOptionsBox = document.getElementById("answer-options");
  const btnSkip = document.getElementById("btn-skip");
  const btnSave = document.getElementById("btn-save-answer");

  const resultLayer = document.getElementById("soul-result-layer");
  const resultText = document.getElementById("soul-result-text");
  const resultMeta = document.getElementById("soul-result-meta");
  const resultBirds = document.getElementById("soul-result-birds");
  const btnCloseResult = document.getElementById("btn-close-result");

  const btnGenerate = document.getElementById("btn-generate-questions");
  const btnStartAnalysis = document.getElementById("btn-start-analysis");
  const questionCountEl = document.getElementById("question-count");
  const answerStatusEl = document.getElementById("answer-status");

  const TOTAL = 25;

  // 深度答案選項（所有題目共用的 4 個層次）
  const ANSWER_LEVELS = [
    {
      level: 1,
      label: "有一點像，但多半被你壓下去。",
    },
    {
      level: 2,
      label: "蠻常中，只是你表面裝得很冷靜。",
    },
    {
      level: 3,
      label: "這基本上是你現在的日常狀態。",
    },
    {
      level: 4,
      label: "這是你最不想承認，但最真實的樣子。",
    },
  ];

  // 題庫：深題
  const QUESTION_BANK = [
    "你最害怕被看見的那一面，是什麼？為什麼？",
    "當別人不回應你時，你腦中會自動補出什麼劇本？",
    "你曾為了不被討厭，而說過違背內心的話嗎？哪一次最印象深刻？",
    "在親密關係裡，你最常扮演的角色是照顧者、調停者、還是抽離的人？",
    "如果今天所有責任都暫停 24 小時，你最想用什麼樣子存在？",
    "童年時，哪一個畫面讓你學會「不能太做自己」？",
    "你最容易為了哪一種人，委屈自己到失去界線？",
    "當你生氣時，通常是什麼情緒被踩到，而不是單純的憤怒？",
    "你是否曾經把「被需要」和「被愛」搞混？那造成了什麼？",
    "你現在最怕失去的是什麼？如果真的失去了，你覺得自己會變成怎樣？",
    "你有沒有一個一直沒說出口的遺憾，如果能重來，你會對誰說什麼？",
    "你什麼時候最像在逃避自己？是滑手機、工作過量，還是假裝沒感覺？",
    "你習慣先照顧別人的情緒，還是先誠實面對自己的需求？為什麼？",
    "你曾經在哪一段關係裡，用力到忘記自己其實也有權利被照顧？",
    "當你被誤解時，你是選擇解釋、沉默，還是直接抽離？背後的恐懼是什麼？",
    "你覺得「被愛」對你來說最具體的樣子，是什麼畫面？",
    "如果現在的你可以對十年前的自己說一句話，你會說什麼？",
    "你有沒有那種「其實早就知道該離開，卻一直不敢動」的場景？",
    "你最常用哪一種方式懲罰自己？（忽略、否定、過度要求，或是別的？）",
    "當你說「沒事啦」的時候，心裡真正的話其實是什麼？",
    "別人給過你最溫柔的一句話是什麼？你相信它嗎？",
    "你理想中的安全感，是來自金錢、關係、能力，還是被理解？",
    "你有沒有哪一個選擇，是當時看起來很理性，但現在回頭覺得那是自我背叛？",
    "你曾經在哪件事情上，感覺自己「很值得」，而不是「好不容易被選上」？",
    "如果可以把一種情緒從你的人生降低 50%，你會選哪一種？",
    "你對「失去控制」最深的恐懼是什麼？",
    "你曾因為害怕被比較，而故意不全力以赴嗎？",
    "你有沒有一個從來沒被允許的夢想？現在想起來，它還亮著嗎？",
    "你對「家」的定義是什麼？那在現實裡出現過嗎？",
    "當你累到快撐不住時，你第一個想到的人，是能照顧你，還是你仍然要照顧對方？",
    "如果你再也不用證明自己值得被留下，你覺得你會變成什麼樣子？",
    "你對「自己」最嚴厲的評語是什麼？如果換成你最心疼的人，你還會這樣說嗎？",
  ];

  let selectedQuestions = [];
  let answers = {}; // { id: { text, level, label } }
  let currentId = null;
  let currentSelectedLevel = null;

  // 洗牌
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 抽 25 題
  function pickQuestions() {
    const shuffled = shuffle(QUESTION_BANK);
    selectedQuestions = shuffled.slice(0, TOTAL).map((text, idx) => ({
      id: idx + 1,
      text,
    }));
    answers = {};
    currentId = null;
    currentSelectedLevel = null;
    btnStartAnalysis.disabled = true;
    btnStartAnalysis.textContent = "看今天的結果";
    updateStatus();
  }

  // 狀態文字
  function updateStatus() {
    const answeredCount = Object.keys(answers).length;
    questionCountEl.textContent = `${answeredCount} / ${TOTAL}`;

    if (answeredCount === 0) {
      answerStatusEl.textContent = "鏡面還沒被觸碰。";
    } else if (answeredCount < TOTAL) {
      answerStatusEl.textContent = "你正在把真話灑進鏡面。";
    } else {
      answerStatusEl.textContent = "OK，鏡面記住你了。";
    }
  }

  // 節點佈局：三圈亂星圖
  function layoutNodes() {
    nodeLayer.innerHTML = "";
    const w = nodeLayer.clientWidth || nodeLayer.offsetWidth || 800;
    const h = nodeLayer.clientHeight || nodeLayer.offsetHeight || 520;
    const cx = w / 2;
    const cy = h / 2 + 10;

    const radiusBase = Math.min(w, h) * 0.22;
    const radiusStep = Math.min(w, h) * 0.07;

    selectedQuestions.forEach((q, idx) => {
      const node = document.createElement("div");
      node.className = "soul-node";
      node.dataset.id = String(q.id);
      node.textContent = q.text;

      const ring = idx < 8 ? 0 : idx < 16 ? 1 : 2;
      const inRingIndex = ring === 0 ? idx : ring === 1 ? idx - 8 : idx - 16;
      const perRing = ring === 0 ? 8 : ring === 1 ? 8 : 9;
      const angle = ((Math.PI * 2) / perRing) * inRingIndex + (ring * Math.PI) / 6;
      const radius = radiusBase + radiusStep * ring;

      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.transform = "translate(-50%, -50%)";

      node.addEventListener("click", () => openQuestion(q.id));
      nodeLayer.appendChild(node);
    });
  }

  function dimNodes(activeId) {
    const nodes = nodeLayer.querySelectorAll(".soul-node");
    nodes.forEach((n) => {
      const id = Number(n.dataset.id);
      if (id === activeId) {
        n.classList.remove("dim");
      } else {
        n.classList.add("dim");
      }
    });
  }

  function resetDimNodes() {
    nodeLayer.querySelectorAll(".soul-node").forEach((n) => n.classList.remove("dim"));
  }

  // 顯示某題
  function openQuestion(id) {
    const q = selectedQuestions.find((x) => x.id === id);
    if (!q) return;
    currentId = id;
    focusQuestionText.textContent = q.text;

    // 清空選項
    answerOptionsBox.innerHTML = "";
    currentSelectedLevel = null;
    btnSave.disabled = true;

    // 產生四個深度選項
    ANSWER_LEVELS.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "soul-answer-pill";
      btn.dataset.level = String(opt.level);
      btn.textContent = opt.label;

      btn.addEventListener("click", () => {
        // 清除其他 active
        answerOptionsBox
          .querySelectorAll(".soul-answer-pill")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentSelectedLevel = opt.level;
        btnSave.disabled = false;
      });

      // 若有舊答案，自動帶出
      const prev = answers[id];
      if (prev && prev.level === opt.level) {
        btn.classList.add("active");
        currentSelectedLevel = opt.level;
        btnSave.disabled = false;
      }

      answerOptionsBox.appendChild(btn);
    });

    dimNodes(id);
    focusLayer.classList.add("active");
    focusLayer.setAttribute("aria-hidden", "false");
  }

  function closeQuestion() {
    focusLayer.classList.remove("active");
    focusLayer.setAttribute("aria-hidden", "true");
    resetDimNodes();
    currentId = null;
    currentSelectedLevel = null;
  }

  // 先放過這題
  btnSkip.addEventListener("click", () => {
    closeQuestion();
  });

  // 就照這樣記
  btnSave.addEventListener("click", () => {
    if (!currentId || !currentSelectedLevel) return;
    const q = selectedQuestions.find((x) => x.id === currentId);
    const opt = ANSWER_LEVELS.find((o) => o.level === currentSelectedLevel);
    if (!q || !opt) return;

    answers[currentId] = {
      text: q.text,
      level: opt.level,
      label: opt.label,
    };

    markNodeAnswered(currentId);
    updateStatus();
    closeQuestion();

    if (Object.keys(answers).length === TOTAL) {
      btnStartAnalysis.disabled = false;
      btnStartAnalysis.textContent = "打開鏡面紀錄";
    }
  });

  function markNodeAnswered(id) {
    const node = nodeLayer.querySelector(`.soul-node[data-id="${id}"]`);
    if (node) node.classList.add("answered");
  }

  // Prompt 組合，給 /api/chat
  function buildPrompt() {
    const items = Object.entries(answers)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([id, obj]) => {
        return `Q${id}：${obj.text}\n對應層級：${obj.level}\n內心註解：${obj.label}`;
      })
      .join("\n\n");

    return `
你現在是「大三巴覺醒宇宙｜靈魂照妖鏡」的深度說明 AI。

請根據下面 25 題的回答，寫出一篇約 600 字的中文長文，
像是在對當事人說實話，不需要安撫，也不需要下指令。
可以指出卡住的模式，但語氣不要兇、不要說教、也不要變成心靈雞湯。

結構建議：
1. 先說明：這個人現在的內在主軸在談什麼（例如：自我價值、界線、關係、逃避、責任感等等）。
2. 描述 TA 在情緒上的慣性：通常怎麼保護自己、怎麼消耗自己、最容易在哪裡重演舊劇本。
3. 指出一兩個「如果願意誠實看一下，會是轉折點」的地方。
4. 結尾給一句很短的提醒句，像是給當事人的備忘錄，不要太夢幻。

接著，請額外多寫三句話，分別由：
- 阿金（行動 × 反骨 × 自由）
- 米果（自我價值 × 邊界 × 主權）
- 滾滾（被理解 × 安全感 × 共鳴）

格式請用：
阿金：一句話
米果：一句話
滾滾：一句話

以下是題目與回答層級（1~4）：層級數字只是方便你閱讀，真正的重點是「內心註解」那一行。

${items}
`.trim();
  }

  async function callSoulMirrorAPI() {
    const prompt = buildPrompt();
    resultText.textContent = "等它把話整理好再說。";
    resultBirds.innerHTML = "";

    resultLayer.classList.add("active");
    resultLayer.setAttribute("aria-hidden", "false");

    try {
      const messages = [
        {
          role: "system",
          content: "你是大三巴覺醒宇宙的靈魂照妖鏡說明 AI。",
        },
        {
          role: "user",
          content: prompt,
        },
      ];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, mode: "soulmirror" }),
      });

      const data = await res.json();
      const raw =
        data.reply ||
        data.content ||
        (data.choices && data.choices[0] && data.choices[0].message.content) ||
        "";

      if (!raw) {
        resultText.textContent = "這次它沒講出來，過一會兒再問一次就好。";
        return;
      }

      const splitIndex = raw.indexOf("阿金");
      if (splitIndex > -1) {
        const main = raw.slice(0, splitIndex).trim();
        const tail = raw.slice(splitIndex).trim();
        resultText.textContent = main;

        const birdLines = tail.split(/\n/).filter((l) => l.trim());
        resultBirds.innerHTML = "";
        birdLines.forEach((line) => {
          const span = document.createElement("span");
          span.textContent = line.trim();
          resultBirds.appendChild(span);
        });
      } else {
        resultText.textContent = raw;
      }
    } catc
