DaSanBa Extend Astro Pack (v9.2.6 extend)
=========================================
這個包 **不覆蓋任何既有檔案**，只加上三鳥房的「宇宙背景動畫語言」：
- 阿金（左下→右上金橘能流，週期 3–4s）
- 米果（粉銀玻璃折射呼吸，週期 6s）
- 滾滾（銀藍水波與安定呼吸，週期 8s）
並包含銀藍密集星空與偶發流星。

使用方法（每個 rooms/*.html）
---------------------------
1) 確認 `<body data-universe="ajin|migou|gungun">` 已存在。
2) 在 `<head>` 末端加入對應 CSS：
   - 阿金：<link rel="stylesheet" href="css/ajin_extend.css">
   - 米果：<link rel="stylesheet" href="css/migou_extend.css">
   - 滾滾：<link rel="stylesheet" href="css/gungun_extend.css">
3) 在 `</body>` 前加入一次性的星空腳本：
   <script src="js/extend_stars.js" defer></script>

*這個星空腳本會自動依據 data-universe 調整色調，且不與現有程式衝突。*
