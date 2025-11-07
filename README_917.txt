大三巴覺醒宇宙｜EMOTIONAL VALUE A.I.
v9.1.7 Final Extended Build（前端延伸包；不動 /api/chat.js 與 vercel.json）

■ 這包做了什麼
- 主頁 index（僅「微調」）：
  1) 三角色卡改「直立漂浮＋專屬光暈」（阿金金色／米果粉金／滾滾藍銀）
  2) 星空背景恢復「閃爍＋隨機流星」
  3) 觀星畫廊：trio.webp～trio10.webp 每 3 秒自動左滑；object-fit:contain 不裁邊不卡頭
  4) 頁尾英文下移，與畫廊間距加大
  5) 導覽列（透明漸層＋光線掃描）可選擇性啟用（snippet）

- 宇宙郵局 cosmic-post-station.html：
  1) 頂部標題置中（中英對齊，字寬略放大，細字體）
  2) 對話 UI：LINE 風格氣泡＋頭貼（你：icon_you.png；三鳥：avatar_*.png）
  3) 三鳥可「同時回覆」（自然口吻），保留既有 /api/chat 路由
  4) 三種音效：阿金 gold click（gold_click.mp3）、米果 rose ping（rose_ping.mp3）、滾滾 blue ring（blue_ring.mp3）
  5) 背景：藍銀星空帶紫調（有細星閃爍＋流星滑過）

- 靈魂照妖鏡 soulmirror.html：
  1) 進場 3.5s：銀白柔光字逐漸淡入淡出 → 星環緩旋 → 魔法鏡浮現
  2) 鏡面舞台：玻璃感＋半透明反射，指尖/游標接近時出現微波紋
  3) 題區：一次顯示 25 題（雲光卡式浮動），四欄星卡排版，選完送出
  4) 結果頁：AI 600 字分析＋三鳥自然語（無官方語氣）；背景有輕微波紋＋銀白能量圈
  5) BGM 預留（bgm_space.mp3），僅在使用者互動後播放

■ 使用方式（保持「微調」，不更動大結構）
1) 覆蓋：將本包的 css/style.css 覆蓋你的專案同名檔。
2) 延伸：
   - 將 js/main_v917_addon.js 複製到你的 /js/ 目錄；在 index.html、cosmic-post-station.html、soulmirror.html 的末端
     於既有 main.js 後方新增一行：
       <script src="/js/main_v917_addon.js"></script>
   - 如果你要啟用全站導覽列，將 snippets/index_header_snippet.html 中的 <header class="uv-nav">…</header>
     放進各頁 <body> 起始處（保留原架構）。

3) 新增頁：將兩個頁面覆蓋/替換你的現有頁：
   - cosmic-post-station.html（覆蓋）
   - soulmirror.html（覆蓋）
   本兩頁均沿用 /api/chat，Edge Regions 與 vercel.json 無需變動。

4) 資產：請把你的實際音效與頭像素材放進 /assets/（本包內附空白占位檔名）。
   - gold_click.mp3 / rose_ping.mp3 / blue_ring.mp3
   - bgm_space.mp3
   - icon_you.png / icon_ajin.png / icon_migou.png / icon_gungun.png

■ 注意
- 不要修改 /api/chat.js 與 vercel.json（保持 v921 穩定 + regions ['sin1','hnd1','icn1']）
- 這份是「延伸包」，所有變更皆可一鍵還原；如需還原，移除 main_v917_addon.js，還原 style.css 即可。
