DaSanBa — Homepage Restore v9.1.6 (safe, non-destructive)
--------------------------------------------------------------------------------
What this contains
- index.html               (homepage only)
- css/universe_restore_v916.css
- css/style_title_restore_v916.css
- js/universe_stars_restore_v916.js

Safe to upload:
• Does NOT touch /api/chat.js, vercel.json, or your existing CSS/JS.
• Uses new *_restore_v916.* files to avoid conflicts.
• Keeps trio.mp4 size and layout. Cards float with soft glow.
• Starfield and meteors are pinned to the viewport (no vertical shift).

How to deploy
1) Upload all files to the root of your project (keep folders).
2) Replace your index.html with this index.html (or copy its header+title block).
3) Ensure assets/
   - trio.mp4
   - ajin.webp / migou.webp / gungun.webp
   are present (filenames unchanged).

Rollback
• To revert, just restore your prior index.html and remove the *_restore_v916 files.
