(() => {
  const holder = document.getElementById('gallery-list');
  const img = document.getElementById('gallery-img');
  if (!holder || !img) return;
  let files = [];
  try { files = JSON.parse(holder.getAttribute('data-files')||'[]'); } catch(e){ files = []; }
  let i = 0;
  function next(){
    i = (i+1) % files.length;
    img.src = files[i];
  }
  setInterval(next, 4000);
})();