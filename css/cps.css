<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cosmic Post Station</title>

  <!-- 字體：英 Orbitron / 中 Noto Sans TC -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Noto+Sans+TC:wght@300;500;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="css/cps.css">
</head>
<body data-universe="cps">

  <!-- 星空粒子 -->
  <canvas id="stars"></canvas>

  <!-- 頁首微字（英/中，細字體、會發光） -->
  <header class="cps-header" aria-live="polite">
    <div class="en"><i>Communicating with the Cosmos…</i></div>
    <div class="zh">與宇宙連線中…</div>
  </header>

  <!-- 次標：三鳥訊號（細字） -->
  <div class="cps-sub" aria-live="polite">
    <i>Receiving signals from</i> <b>Ajin</b> / <b>Migou</b> / <b>Gungun</b> ✨
  </div>

  <!-- 拼貼區：2 橫背景 + 3 透明鳥 -->
  <section class="collage">
    <!-- 橫式背景 (16:9) 兩張 -->
    <img src="assets/trio_post1.webp" alt="Trio Cosmic 1" class="h h1" loading="lazy">
    <img src="assets/trio_post2.webp" alt="Trio Cosmic 2" class="h h2" loading="lazy">

    <!-- 三隻去背透明 (9:16 任意尺寸) -->
    <img src="assets/ajin_clear_post.webp"   alt="AJIN"   class="v v-ajin"   loading="lazy">
    <img src="assets/migou_clear_post.webp"  alt="MIGOU"  class="v v-migou"  loading="lazy">
    <img src="assets/gungun_clear_post.webp" alt="GUNGUN" class="v v-gungun" loading="lazy">
  </section>

  <!-- 中央特製聊天框（玻璃發光、英中混排） -->
  <section class="cosmic-dialog" role="dialog" aria-live="polite">
    <div class="persona-toggle">
      <label><input type="checkbox" id="aj" checked> 💛阿金</label>
      <label><input type="checkbox" id="mi" checked> 🩷米果</label>
      <label><input type="checkbox" id="gu" checked> 🩵滾滾</label>
    </div>

    <div id="chat" class="chat-stream" aria-live="polite"></div>

    <div class="composer">
      <input id="cps-input" type="text" placeholder="在星際隧道投遞一句話，按 Enter 傳訊…" autocomplete="off">
      <button id="send">傳送</button>
    </div>
  </section>

  <!-- 背景音樂（互動後播放） -->
  <audio id="bgm" src="assets/bgm_universe.wav" preload="auto"></audio>

  <script src="js/cps.js"></script>
</body>
</html>
