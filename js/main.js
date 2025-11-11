/* ============================================================
   DaSanBa v9.1.8 — cosmic_universe_full
   - 保留 hero.mp4 背景，不改 DOM 結構與 API
   - 畫廊：trio.webp ~ trio10.webp，3 秒淡入淡出
   - 卡片：5:6 直立比例（由 CSS 控），點擊有仙女棒擴散光暈
   - 愛心：漂浮補強
   - 星體：全站星星/流星/彗星（C 模式：3~5 秒一顆）
   - 彩色分布：阿金金、米果粉、滾滾藍；其他頁銀藍/銀紫
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const page = (document.body.getAttribute('data-page') || 'home').toLowerCase();

  // -----------------------------
  // 1) 畫廊：3 秒輪播（trio.webp ~ trio10.webp）
  // -----------------------------
  (function initGallery() {
    const imgs = Array.from(document.querySelectorAll('.gallery .gimg'));
    if (!imgs.length) return;
    let i = imgs.findIndex(el => el.classList.contains('active'));
    if (i < 0) { i = 0; imgs[0].classList.add('active'); }
    setInterval(() => {
      imgs[i].classList.remove('active');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('active');
    }, 3000);
  })();

  // -----------------------------
  // 2) 卡片：仙女棒擴散光暈 + 愛心漂浮補強
  // -----------------------------
  (function initCards() {
    const cards = Array.from(document.querySelectorAll('.cards .card, .character-card'));
    if (!cards.length) return;

    cards.forEach(card => {
      // 建立特效層（若不存在）
      let sparkle = card.querySelector('.sparkle');
      if (!sparkle) {
        sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        card.appendChild(sparkle);
      }

      // 推斷角色顏色（依圖片檔名或 data-char）
      let color = '#b9d7ff'; // default 銀藍
      try {
        const img = card.querySelector('img');
        const tag = (card.getAttribute('data-char') || (img && img.src) || '').toLowerCase();
        if (tag.includes('ajin')) color = '#ffcc55';      // 阿金金
        else if (tag.includes('migou') || tag.includes('migo')) color = '#ff9ecb'; // 米果粉
        else if (tag.includes('gungun')) color = '#8fd1ff'; // 滾滾藍
      } catch (e) {}

      // 點擊 → 仙女棒擴散光暈（依點擊位置）
      card.addEventListener('pointerdown', (e) => {
        const r = card.getBoundingClientRect();
        const sx = ((e.clientX - r.left) / r.width) * 100;
        const sy = ((e.clientY - r.top) / r.height) * 100;
        // 讓光暈偏下半部更夢幻
        const syAdj = Math.min(95, sy + 6);

        sparkle.style.background = `
          radial-gradient(140px 140px at ${sx}% ${syAdj}%,
            ${hexWithAlpha(color, 1)} 0%,
            ${hexWithAlpha(color, .55)} 28%,
            rgba(255,255,255,0) 62%)`;
        sparkle.style.display = 'block';
        card.classList.add('spark');

        // 700ms 後關閉動畫
        setTimeout(() => {
          card.classList.remove('spark');
          sparkle.style.display = 'none';
        }, 720);
      });

      // 愛心補強：若存在 .heart，確保有漂浮 class
      const heart = card.querySelector('.heart');
      if (heart && !heart.classList.contains('floating-heart')) {
        heart.classList.add('floating-heart');
      }
    });

    // 工具：HEX + alpha 轉 rgba
    function hexWithAlpha(hex, a = 1) {
      if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) return `rgba(255,255,255,${a})`;
      let c = hex.substring(1).split('');
      if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      c = '0x' + c.join('');
      const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
      return `rgba(${r},${g},${b},${a})`;
    }
  })();

  // -----------------------------
  // 3) 全站星空（星星／流星／彗星）
  // -----------------------------
  (function initCosmos() {
    // 不動 hero.mp4；只在其「上層」加星體層
    let starLayer = document.querySelector('.starry');
    if (!starLayer) {
      starLayer = document.createElement('div');
      starLayer.className = 'starry';
      // 確保不擋互動：不接事件
      starLayer.style.position = 'fixed';
      starLayer.style.inset = '0';
      starLayer.style.zIndex = '2';
      starLayer.style.pointerEvents = 'none';
      document.body.appendChild(starLayer);
    } else {
      starLayer.innerHTML = '';
    }

    // 依頁面設定星體顏色 / 數量 / 節奏
    const cfg = cosmosConfig(page);

    // 3-1) 生成星星
    makeStars(starLayer, cfg.starCount, cfg.starColor);

    // 3-2) 定時生成流星／彗星（C 模式：3~5 秒）
    const spawn = () => {
      const isComet = Math.random() < cfg.cometRate;
      createMeteor(isComet ? 'comet' : 'meteor', cfg);
      schedule();
    };
    const schedule = () => {
      const t = rand(cfg.meteorEvery[0], cfg.meteorEvery[1]); // 毫秒
      setTimeout(spawn, t);
    };
    schedule();

    // 3-3) 郵局信封粒子（隨機小機率）
    if (page === 'cps') {
      setInterval(() => {
        if (Math.random() < 0.18) createEnvelope(starLayer, cfg);
      }, 2200);
    }

    // 生成星星
    function makeStars(container, count, color) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() < 0.85 ? 2 : 3;
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = (Math.random() * 100).toFixed(3) + 'vw';
        s.style.top = (Math.random() * 100).toFixed(3) + 'vh';
        s.style.opacity = (0.35 + Math.random() * 0.65).toFixed(2);
        s.style.background = `radial-gradient(circle, ${color}, transparent 70%)`;
        s.style.animationDelay = (Math.random() * 2.5).toFixed(2) + 's';
        frag.appendChild(s);
      }
      container.appendChild(frag);
    }

    // 生成流星／彗星
    function createMeteor(kind, cfg) {
      const m = document.createElement('div');
      m.className = 'meteor';
      const y = rand(5, 85); // vh
      const fromLeft = Math.random() < 0.5;
      m.style.position = 'fixed';
      m.style.top = y + 'vh';
      m.style[fromLeft ? 'left' : 'right'] = '-60px';
      m.style.width = '2px';
      m.style.height = '2px';
      m.style.borderRadius = '50%';
      m.style.background = cfg.meteorColor;
      m.style.boxShadow = `0 0 10px ${cfg.meteorGlow}`;

      const tail = document.createElement('div');
      tail.style.position = 'absolute';
      tail.style.top = '50%';
      tail.style.transform = 'translateY(-50%)';
      tail.style[fromLeft ? 'right' : 'left'] = '100%';
      tail.style.width = kind === 'comet' ? '220px' : '150px';
      tail.style.height = kind === 'comet' ? '3px' : '2px';
      tail.style.background = `linear-gradient(${fromLeft ? 90 : 270}deg,
        rgba(255,255,255,0) 0%,
        ${cfg.tailSoft} 70%,
        ${cfg.tailStrong} 100%)`;
      tail.style.filter = 'blur(1.3px)';
      m.appendChild(tail);

      document.body.appendChild(m);

      const dx = fromLeft ? 'translateX(calc(100vw + 140px))'
                          : 'translateX(calc(-100vw - 140px))';
      const anim = m.animate(
        [{ transform: 'translateX(0)', opacity: 1 },
         { transform: dx, opacity: 0.7 }],
        { duration: rand(1800, 2600), easing: 'linear' }
      );
      anim.onfinish = () => m.remove();

      // 彗星路過，容器微抖（首頁或星艦）
      if (kind === 'comet' && /home|ajin|migou|gungun/.test(page)) {
        const shakeTarget = document.querySelector('.gallery .gframe') || document.body;
        shakeTarget.animate(
          [
            { transform: 'translate3d(0,0,0)' },
            { transform: 'translate3d(6px,0,0)' },
            { transform: 'translate3d(-6px,0,0)' },
            { transform: 'translate3d(0,0,0)' }
          ],
          { duration: 160, easing: 'ease-out' }
        );
      }
    }

    // 郵局：小信封粒子（淡入淡出漂過）
    function createEnvelope(container, cfg) {
      const e = document.createElement('div');
      e.textContent = '✉️';
      e.style.position = 'fixed';
      e.style.fontSize = rand(12, 18) + 'px';
      e.style.opacity = '0';
      e.style.left = rand(5, 95) + 'vw';
      e.style.top = rand(10, 80) + 'vh';
      e.style.filter = `drop-shadow(0 0 6px ${cfg.meteorGlow})`;
      e.style.transition = 'opacity 600ms ease, transform 2.6s ease-out';
      document.body.appendChild(e);
      requestAnimationFrame(() => {
        e.style.opacity = '0.85';
        e.style.transform = `translate(${rand(-40, 40)}px, ${rand(-30, -70)}px)`;
      });
      setTimeout(() => e.remove(), 3000);
    }

    function rand(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function cosmosConfig(page) {
      // 基礎：動感 C 模式（3~5 秒）
      const base = {
        meteorEvery: [3000, 5000],
        cometRate: 0.18,    // 18% 會是彗星
        starCount: 140,
        starColor: 'rgba(230,238,255,0.9)',
        meteorColor: '#ffffff',
        meteorGlow: 'rgba(200,230,255,0.9)',
        tailSoft: 'rgba(190,220,255,0.65)',
        tailStrong: 'rgba(255,255,255,0.95)',
      };
      switch (page) {
        case 'ajin': // 黑金暖光
          return { ...base,
            starCount: 150,
            starColor: 'rgba(255,220,160,0.92)',
            meteorColor: '#ffd27a',
            meteorGlow: 'rgba(255,180,80,0.95)',
            tailSoft: 'rgba(255,200,120,0.65)',
            tailStrong: 'rgba(255,230,170,0.95)',
          };
        case 'migou': // 粉金柔光
          return { ...base,
            starColor: 'rgba(255,205,225,0.95)',
            meteorColor: '#ffc4de',
            meteorGlow: 'rgba(255,180,220,0.9)',
            tailSoft: 'rgba(255,190,220,0.7)',
            tailStrong: 'rgba(255,240,250,0.95)',
            cometRate: 0.12
          };
        case 'gungun': // 銀藍靜謐
          return { ...base,
            starCount: 160,
            starColor: 'rgba(190,220,255,0.92)',
            meteorColor: '#bfe2ff',
            meteorGlow: 'rgba(140,200,255,0.95)',
            tailSoft: 'rgba(160,210,255,0.6)',
            tailStrong: 'rgba(230,245,255,0.95)',
          };
        case 'cps': // 郵局 深藍＋信封
          return { ...base,
            starCount: 120,
            starColor: 'rgba(200,220,255,0.75)',
            meteorColor: '#e6f0ff',
            meteorGlow: 'rgba(150,190,255,0.8)',
            cometRate: 0.08
          };
        case 'soul': // 照妖鏡 銀紫
