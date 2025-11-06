
document.addEventListener('DOMContentLoaded', ()=>{
  const mv = document.querySelector('.hero-video, video#trio');
  if(mv){ mv.style.width='min(1100px,92vw)'; mv.style.maxHeight='60vh'; mv.style.objectFit='cover'; mv.style.borderRadius='20px'; }
  document.querySelectorAll('.card').forEach(el=>{
    el.classList.add('floating');
    el.style.boxShadow='inset 0 0 0 1px rgba(255,255,255,.05), 0 24px 44px rgba(0,0,0,.5), 0 0 22px rgba(140,170,255,.22)';
  });
  const track=document.querySelector('.gallery-track');
  if(track){
    const slides=[...track.children]; let idx=0;
    setInterval(()=>{idx=(idx+1)%slides.length; track.style.transform=`translateX(-${idx*100}%)`;},3000);
  }
});
