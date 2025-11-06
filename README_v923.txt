DaSanBa Awakening Universe v9.2.3 (Front‑end Extend Patch)
規則：不動 /api/chat.js、vercel.json、assets/*（沿用你的素材與音效）。
本包只含前端延伸檔：css / js / rooms 以及兩個頁面 index.html、cosmic-post-station.html 的示範版本。

【使用】
1) 把 css/*.css 與 js/*.js 加到你的 repo（不覆蓋核心，只是新增版號檔）。
2) 頁面 <head> 換：
   <link rel="stylesheet" href="css/universe_v923.css">
   <link rel="stylesheet" href="css/style_v923.css">
3) </body> 前插：
   <script src="js/main_v923.js"></script>
   （宇宙郵局再加）<script src="js/cps_v923.js"></script>
4) <body> 寫成：<body class="cosmic" data-universe="home|ajin|migou|gungun|cps|mirror">

完成後強制重整（Ctrl/Cmd+Shift+R）。