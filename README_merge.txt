
MERGE INSTRUCTIONS (SAFE):
- Keep your current homepage exactly as-is (background, trio.mp4, titles).
- Add these files and link them:
    css/addons.css
    js/shared.js
    js/poststation.js
    js/soulmirror.js
    cosmic-post-station.html
    soulmirror.html

- Ensure assets exist:
    assets/icon_ajin.png
    assets/icon_migou.png
    assets/icon_gungun.png
    assets/icon_you.png
    assets/trio_post1.webp, trio_post2.webp
    assets/ajin_post.webp, assets/migou_post.webp, assets/gungun_post.webp

- Add a left toolbar link in your existing pages if needed (or keep page-local toolbars).
- API: The JS first POSTs to /api/chat, falling back to /api/chat.js. Your existing Edge function stays unchanged.
- No background colors of your homepage were modified.
