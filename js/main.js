(function(){
  const files=['trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp','trio6.webp','trio7.webp','trio8.webp','trio9.webp','trio10.webp'];
  const img=document.getElementById('gallery-img');
  if(!img)return;
  let i=0;
  const set=(idx)=>{
    img.style.opacity=0;
    const next=files[idx%files.length];
    const src=`assets/${next}`;
    const pre=new Image();
    pre.onload=()=>{img.src=src;requestAnimationFrame(()=>img.style.opacity=1);};
    pre.src=src;
  };
  set(i++);
  setInterval(()=>set(i++),3000);
})();