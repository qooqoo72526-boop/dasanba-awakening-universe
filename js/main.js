(function(){
  function mountStars(){
    document.querySelectorAll('.stars').forEach(container=>{
      for(let i=0;i<140;i++){
        const s=document.createElement('i');
        s.style.setProperty('--x', Math.random());
        s.style.setProperty('--y', Math.random());
        s.style.setProperty('--r', Math.random());
        container.appendChild(s);
      }
    });
  }
  mountStars();

  const gal = document.getElementById('galImg');
  if(gal){
    const files = ['trio.webp','trio2.webp','trio3.webp','trio4.webp','trio5.webp','trio6.webp','trio7.webp','trio8.webp','trio9.webp','trio10.webp'];
    let i=0;
    setInterval(()=>{
      i=(i+1)%files.length;
      gal.src = 'assets/' + files[i];
      const indi = document.getElementById('galIndi'); if(indi) indi.textContent = (i+1) + ' / ' + files.length;
    }, 3000);
  }
})();