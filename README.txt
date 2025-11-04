
大三巴覺醒宇宙 v8.9（Clean | GitHub → Vercel）

一、你要準備的素材（放進 /assets/）
- trio.mp4（首頁影片；自動播放）
- trio.webp ~ trio6.webp（觀星畫廊 6 張）
- ajin.webp / migou.webp / gungun.webp（三張角色卡，固定非去背）
- ajin_5s.mp4 / migou_5s.mp4 / gungun_5s.mp4（各自宇宙房影片）

二、部署步驟
1) 新開 GitHub repo，上傳本專案所有檔案。
2) Vercel > Import Project > 選你的 GitHub repo。
3) Vercel > Settings > Environment Variables：加入 OPENAI_API_KEY（All Environments）。
4) Deploy 後，打開 /api/chat 應回傳 {"error":"POST only"} 代表 Serverless OK。
5) 開 /dialogue.html 測聊天。

三、常見問題
- 聊天 405：你在 GET /api/chat，請用 POST（或先看第 4 步檢查）。
- 500 Missing Key：Vercel 環境變數沒加在「Production」也要加，建議 All。
- 首頁影片沒出現：確認 /assets/trio.mp4 路徑與檔名一致（小寫）。
- 畫廊空白：確認 6 張 .webp 已放入 /assets/，檔名完全一致。

四、檔名錨點（請不要改動）
- /assets/trio.mp4
- /assets/trio.webp ~ /assets/trio6.webp
- /assets/ajin.webp /assets/migou.webp /assets/gungun.webp
- /assets/ajin_5s.mp4 /assets/migou_5s.mp4 /assets/gungun_5s.mp4
