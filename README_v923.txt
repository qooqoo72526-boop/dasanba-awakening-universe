
DaSanBa Awakening Universe — v9.2.3 Patch (Extend, not overwrite core)
Date: 2025-11-06

WHAT'S INCLUDED (NEW VERSIONED FILES)
-------------------------------------
/css/universe_v923.css     ← Extend: 蓝銀星空底（首頁/郵局可用），微閃星點 + 真流星動畫（輕薄不斷層）
/css/style_v923.css        ← Extend: 首頁卡片置中對齊、觀星畫廊🔭、工具列質感、輸入框美化
/js/main_v923.js           ← Extend: 3.5s 開場動畫（置中、偏紫調）、畫廊 3.5s 自動橫移、流星生成
/js/cps_v923.js            ← Extend: 宇宙郵局泡泡音、輸入框玻璃效果、三鳥人格回覆模板（仍呼叫 /api/chat）
/rooms/ajin.html           ← Extend: 房間樣板（data-universe="ajin"）黑金離子光帶 + 右側文案(自由・反骨)
/rooms/migou.html          ← Extend: 房間樣板（data-universe="migou"）粉銀星砂 + 右側文案(主權・高價值)
/rooms/gungun.html         ← Extend: 房間樣板（data-universe="gungun"）天藍冰霧 + 右側文案(共鳴・靜默力量)
/README_v923.txt           ← 本文件

KEEP UNTOUCHED (DO NOT MODIFY)
------------------------------
/api/chat.js, /vercel.json, /assets/* （你既有 mp4/webp 音效等全部保留）

HOW TO ACTIVATE
---------------
1) 在 index.html <head> 內（或 cosmic-post-station.html / rooms/*.html），新增／切換：
   <link rel="stylesheet" href="css/universe_v923.css">
   <link rel="stylesheet" href="css/style_v923.css">
   （原 v916/v922 可保留；新檔在後方，僅追加樣式）

2) 在頁面底部（</body> 前）追加：
   <script src="js/main_v923.js"></script>
   （宇宙郵局頁面另加）
   <script src="js/cps_v923.js"></script>

3) 3.5s 開場動畫：保持你喜歡的字型排列（偏紫、置中、比現在大一點點）。JS 會自動插入 splash，結束後淡出。
   顯示文：
     EN 大標：Emotional Value A.I.
     EN 小標：Awakening Universe
     ZH：這不是療癒；這是覺醒的開始。

4) 首頁角色卡：名稱與標語置中；標題色：🧡米果、💙滾滾、💛阿金；子句：
   - 阿金：我不等天空放晴，我自己撕開雲。
   - 米果：我很值錢，我讓自己更貴。
   - 滾滾：我不追求安全，我成為安全。

5) 觀星畫廊：自動每 3.5 秒水平切換；英文標題後面附 🔭，整段置中，避免「下一張斷層」。
   使用 data-autoplay="true" 的現有容器即可由 JS 接管。

6) 宇宙郵局：
   - 背景採用 universe_v923 藍銀星空，真流星穿越。
   - 左側 5 張插圖改為不規則排版（直 3／橫 2），間距加大。
   - 對話框玻璃感＋泡泡聲（click/send 維持風格）；輸入框改為膠囊玻璃、提示文更有質感。
   - 人格回覆：AJIN/MIGOU/GUNGUN 會先以其人設口吻生成 system prompt 後仍送到 /api/chat。

7) 房間（rooms/*.html）：
   - body 設定 data-universe="ajin|migou|gungun" 決定各自漸層與粒子特效。
   - 左側小尺寸 5s 影片(*_5s.mp4)；右側標題＋中文大標（兩字）、中英副標與一句話，小英字。
   - 無「邊框感」，使用柔玻璃面板與內發光；字色各自不同。

ROLLBACK
--------
若需回退，只要把頁面上新增的 2 行 <link> 與 1~2 行 <script> 註解即可，既有 v9.1.6 不受影響。

Version Tag: v9.2.3 (Extend only; no overwrite of backend)
