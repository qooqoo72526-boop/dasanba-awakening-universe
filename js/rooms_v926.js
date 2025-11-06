
document.addEventListener('DOMContentLoaded', ()=>{
  const who = document.body.dataset.universe || 'ajin';
  const audioPath = (location.pathname.includes('/rooms/')) ? '../assets/sound/bubble_soft.wav' : 'assets/sound/bubble_soft.wav';
  const snd = new Audio(audioPath); snd.volume = (who==='ajin')?0.16:(who==='migou'?0.14:0.12);
  const v=document.querySelector('.room-loop');
  if(v){
    v.addEventListener('loadedmetadata',()=>{ v.currentTime=0; v.playbackRate=1.0; });
    const play=()=>v.play().catch(()=>{}); play(); addEventListener('click',play,{once:true});
    v.addEventListener('play',()=> setTimeout(()=>snd.play().catch(()=>{}), 600));
  }
});
