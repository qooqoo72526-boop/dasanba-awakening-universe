DaSanBa Awakening Universe v9.2.3 (Extend Patch)
------------------------------------------------
這包「只新增、不覆蓋」：保留你的 /api/chat.js、vercel.json、assets/*，
僅新增 v923 的 CSS / JS 與房間樣板。

# 套用方法（任一頁）
<head> 內新增：
<link rel="stylesheet" href="css/universe_v923.css">
<link rel="stylesheet" href="css/style_v923.css">

</body> 前新增：
<script src="js/main_v923.js"></script>

# 宇宙郵局頁面另外加：
<script src="js/cps_v923.js"></script>

# 房間頁 body：
<body class="cosmic" data-universe="ajin|migou|gungun">

— 特效：藍銀輕薄漸層＋微星點＋真流星（JS canvas）
— 首頁：卡片置中、標題置中、畫廊 3.5s 自動橫移（不會斷層卡住）
— 開場：3.5 秒置中偏紫英文字（淡出後進首頁）
— 宇宙郵局：玻璃面板、泡泡音、輸入框膠囊化
— 房間：黑金離子（AJIN）／粉銀星砂（MIGOU）／天藍冰霧（GUNGUN）