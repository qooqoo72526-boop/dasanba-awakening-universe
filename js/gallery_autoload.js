
const galleryList = [];
const baseNames = ['trio.webp'];
for(let i=2;i<=10;i++){ baseNames.push(`trio${i}.webp`); }

let loaded = 0;
const stage = document.getElementById('galleryImage');

function tryLoad(src){
  const img = new Image();
  img.onload = ()=>{
    galleryList.push(src);
    if(loaded===0){ stage.src = `assets/${src}`; }
    loaded++;
  };
  img.onerror = ()=>{};
  img.src = `assets/${src}`;
}
baseNames.forEach(tryLoad);

let idx = 0;
setInterval(()=>{
  if(galleryList.length===0) return;
  idx = (idx+1) % galleryList.length;
  const next = galleryList[idx];
  stage.style.opacity = 0;
  setTimeout(()=>{
    stage.src = `assets/${next}`;
    stage.style.opacity = 1;
  }, 200);
}, 3000);
