/* ===== v9.4 Soft Nebula Patch — non-home pages only ===== */

/* 淺色暈染背景（每頁不同，但都不是深色/死白/過紫） */
body[data-page="cps"]{
  --bg1:#101929; --bg2:#1c2b45; --bg3:#0f1b30;     /* 柔藍紫，但偏暗少一點紫 */
  background: radial-gradient(900px 600px at 45% 12%, #1a2742 0%, #15233e 55%, #0e1a2f 100%);
}
body[data-page="soul"]{
  --bg1:#0e1624; --bg2:#1c2a3f; --bg3:#0e1624;
  background: radial-gradient(1000px 700px at 50% 18%, #1b2940 0%, #142235 60%, #0e1624 100%);
  /* 銀白改為柔銀藍，不死白 */
}
body[data-page="ajin"]{
  background: radial-gradient(900px 540px at 60% 16%, #1a2f4a 0%, #12233a 60%, #0c1526 100%);
}
body[data-page="migou"]{
  background: radial-gradient(900px 540px at 40% 18%, #20324a 0%, #162640 58%, #0e182b 100%);
}
body[data-page="gungun"]{
  background: radial-gradient(1000px 620px at 50% 20%, #17314d 0%, #12253e 60%, #0b1628 100%);
}

/* 星層（全站通用，但首頁已有就不重疊；JS 只在非首頁注入） */
.starry{ position:fixed; inset:0; z-index:-1; pointer-events:none; }

/* 多型態星星：一般、閃爍、漂移（顏色會用 JS 混入） */
.star{
  position:absolute; width:2px; height:2px; border-radius:50%;
  background: rgba(255,255,255,.92);
  box-shadow: 0 0 6px rgba(255,255,255,.55);
}
.star.twinkle{ animation: twinkle 2.8s ease-in-out infinite alternate; }
.star.drift  { animation: drift   7.5s ease-in-out infinite; opacity:.9; }
.star.pulse  { animation: pulse   3.6s ease-in-out infinite; }

/* 流星／彗星（淺色、柔尾跡；不會過亮） */
.meteor{
  position:absolute; width:2px; height:2px; border-radius:50%;
  background: white; box-shadow: 0 0 8px rgba(255,255,255,.8);
}
.meteor::after{
  content:""; position:absolute; right:100%; top:50%; transform:translateY(-50%);
  width:150px; height:2px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(210,230,255,.75) 90%);
  filter: blur(1.1px);
}
.meteor.comet{
  box-shadow: 0 0 10px rgba(200,230,255,.95), 0 0 18px rgba(150,200,255,.6);
}
.meteor.comet::after{
  width:220px; height:3px;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(180,220,255,.95) 70%, rgba(255,255,255,.85) 100%);
  filter: blur(1.4px);
}

/* 郵局：流星經過時輕微抖一下（0.16s），但很克制 */
body[data-page="cps"].shake-brief .page-wrap,
body[data-page="cps"].shake-brief .cps-chat{
  animation: microShake .16s ease;
}

/* Keyframes */
@keyframes twinkle{ from{opacity:.55; filter:brightness(.9)} to{opacity:1; filter:brightness(1.35)} }
@keyframes drift  { 0%{transform:translateY(0)} 50%{transform:translateY(-3px)} 100%{transform:translateY(0)} }
@keyframes pulse  { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.25)} }
@keyframes microShake{
  0%,100%{ transform:translate3d(0,0,0) }
  25%{ transform:translate3d(0.6px,0,0) }
  50%{ transform:translate3d(-0.6px,0,0) }
  75%{ transform:translate3d(0.3px,0,0) }
}
