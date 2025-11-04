
# 大三巴覺醒宇宙 v8.6 (Cosmic Minimal)
- 首頁：index.html（3.5s 英文爆開特效 → 自動淡出）
- 觀星畫廊：自動滑動，保留 6 張 trio.webp～trio6.webp
- 角色卡：ajin.webp / migou.webp / gungun.webp（固定 .webp，有背景）
- 房間：ajin.html / migou.html / gungun.html（直式 5s 影片自動循環）
- 雲間信件：dialogue.html（AI 對話；Ajin/Migou/Gungun 三人格切換）
- 靈魂照妖鏡：soulmirror.html（500 題庫隨機 25 題；生成深層解析）
- 共用樣式：/css/styles.css；共用腳本：/js/scripts.js
- 星粒特效：/js/starfield.js
- 音樂：/assets/bgm_universe.wav（內建 1s 靜音檔，請自行換成 mp3/wav）

## 部署（Vercel + GitHub）
1) 把本資料夾整包上傳至 GitHub repo 根目錄。
2) Vercel 連結該 repo → Deploy。
3) 到「Settings → Environment Variables」新增：`OPENAI_API_KEY`。
4) 重新部署（Redeploy）。

## 更換素材
把你的檔案放進 /assets，檔名需一致：
- trio.mp4（首頁背景影片）
- ajin_5s.mp4 / migou_5s.mp4 / gungun.mp4（房間 5s 影片）
- ajin.webp / migou.webp / gungun.webp（角色卡圖）
- trio.webp ～ trio6.webp（畫廊 6 張圖）
- （可選）bgm_universe.wav 或 bgm_universe.mp3（自動播放）
- （可選）mirror_reflect.mp3（鏡面特效音）

> 若沒有看到影片，請確認 mp4 實際存在於 /assets 且大小非 0 bytes。
