DaSanBa Awakening Universe v9.1.4 | Star‑Cosmic
------------------------------------------------------
這包是「不覆蓋 API、可直接合併」的前端增量：首頁 + 三個房間 + 基礎樣式/特效。

保留與依賴：
- 你的 /api/chat.js 不會被覆蓋（此包只放 api/chat.README_DO_NOT_OVERWRITE.txt 提醒）。
- 宇宙郵局頁面建議沿用你現有版本；本包有一個占位 cosmic-post-station.html，僅供帶星空與漸層。

新檔案：
- index.html（首頁：trio.mp4 英文開場、三張不規則角色卡、畫廊 trio.webp~trio10.webp 自動左滑）
- rooms/{ajin|migou|gungun}.html（各自的漸層 + 特效風格）
- css/style.css（全站星空/玻璃擬態/漸層/卡片/畫廊/房間 FX）
- js/main.js（星空 + 流星 + 畫廊自動左滑 + 房間 FX 注入）
- vercel.json（regions ['sin1','hnd1','icn1']）

請把下列資產放到 assets/（檔名需對）：
- trio.mp4（首頁主影片）
- trio.webp ~ trio10.webp（10張畫廊）
- ajin.webp / migou.webp / gungun.webp（角色卡）
- ajin_5s.mp4 / migou_5s.mp4 / gungun_5s.mp4（各房間5秒循環）
- trio_post1.webp / trio_post2.webp + ajin_post.webp / migou_post.webp / gungun_post.webp（宇宙郵局用，如需）
