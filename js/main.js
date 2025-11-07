
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;
let stars = Array.from({length:200},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5,alpha:Math.random()}));

function drawStars(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  stars.forEach(s=>{
    s.alpha += (Math.random()-0.5)*0.02;
    if(s.alpha<0.3)s.alpha=0.3;if(s.alpha>1)s.alpha=1;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,2*Math.PI);
    ctx.fillStyle=`rgba(220,240,255,${s.alpha})`;
    ctx.fill();
  });
}
function meteor(){
  let x=Math.random()*innerWidth,y=Math.random()*innerHeight*0.5,len=300;
  let ang=Math.PI/4,speed=25;
  let i=0;
  const trail=setInterval(()=>{
    i++;
    ctx.beginPath();
    ctx.moveTo(x+i*speed*Math.cos(ang),y+i*speed*Math.sin(ang));
    ctx.lineTo(x+(i-5)*speed*Math.cos(ang),y+(i-5)*speed*Math.sin(ang));
    ctx.strokeStyle=`rgba(255,255,255,${1-i/20})`;
    ctx.lineWidth=2;ctx.stroke();
    if(i>20)clearInterval(trail);
  },30);
  setTimeout(meteor,5000+Math.random()*2000);
}
meteor();
setInterval(drawStars,50);
