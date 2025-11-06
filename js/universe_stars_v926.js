
// === v9.2.6 | Silver-Blue Starfield + Meteors (extend only) ===
(function(global){
  function $(s){return (typeof s==='string')?document.querySelector(s):s;}
  function Starfield(canvas, opts){
    this.c = $(canvas); this.ctx = this.c.getContext('2d');
    this.dpr = Math.max(1, Math.min(2, global.devicePixelRatio||1));
    this.opts = Object.assign({ density:1.0, twinkle:true, hueShift:0 }, opts||{});
    this.stars=[]; this.meteors=[]; this.t=0;
    const resize=()=>{ const w=global.innerWidth, h=global.innerHeight;
      this.c.width=Math.floor(w*this.dpr); this.c.height=Math.floor(h*this.dpr);
      this.c.style.width=w+'px'; this.c.style.height=h+'px';
      this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0); this.build(); };
    global.addEventListener('resize', resize); resize(); this.loop();
  }
  Starfield.prototype.build=function(){
    const w=this.c.width/this.dpr, h=this.c.height/this.dpr;
    const base=Math.ceil((w*h)/15000); const count=Math.floor(base*(0.75+this.opts.density*0.75));
    this.stars.length=0;
    for(let i=0;i<count;i++){ this.stars.push({ x:Math.random()*w, y:Math.random()*h,
      r:Math.random()*1.15+0.15, b:Math.random()*0.6+0.4, p:Math.random()*Math.PI*2 }); }
  };
  Starfield.prototype.addMeteor=function(){
    const w=this.c.width/this.dpr, h=this.c.height/this.dpr;
    const fromTop=Math.random()<0.5; const x=Math.random()*w*0.8 + w*0.1; const y=fromTop?-40:h+40;
    const angle= fromTop ? (Math.PI*0.55+Math.random()*0.2) : (Math.PI*1.05+Math.random()*0.2);
    this.meteors.push({ x,y, vx:Math.cos(angle)*9, vy:Math.sin(angle)*9, life:0, max:75+Math.random()*40,
                        thick:1.3+Math.random()*0.7, alpha:0.85 });
  };
  Starfield.prototype.loop=function(){
    this.t += 1/60; const ctx=this.ctx; const w=this.c.width/this.dpr, h=this.c.height/this.dpr;
    ctx.clearRect(0,0,w,h);
    for(const s of this.stars){
      const tw = this.opts.twinkle ? (0.55 + 0.45*Math.sin(this.t*1.6 + s.p)) : 1;
      ctx.globalAlpha = (s.b * tw);
      ctx.fillStyle = `hsl(${215+this.opts.hueShift} 90% 88%)`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = (s.b*tw)*0.25;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r*2.2, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for(let i=this.meteors.length-1;i>=0;i--){
      const m=this.meteors[i]; m.life++; m.x+=m.vx; m.y+=m.vy;
      const trail=22; const grad=ctx.createLinearGradient(m.x-m.vx*trail, m.y-m.vy*trail, m.x, m.y);
      grad.addColorStop(0, `hsla(${210+this.opts.hueShift},100%,85%,0)`);
      grad.addColorStop(1, `hsla(${210+this.opts.hueShift},100%,88%,${m.alpha})`);
      ctx.strokeStyle=grad; ctx.lineWidth=m.thick; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(m.x-m.vx*trail, m.y-m.vy*trail); ctx.lineTo(m.x, m.y); ctx.stroke();
      if(m.life>m.max) this.meteors.splice(i,1);
    }
    requestAnimationFrame(this.loop.bind(this));
  };
  let instance=null;
  function initUniverse(opts){
    if(instance) return instance;
    instance = new Starfield(opts.canvas||'#stars', opts||{});
    return instance;
  }
  function spawnMeteor(){
    if(!instance) return; instance.addMeteor();
    if(Math.random()<0.25){ setTimeout(()=>instance.addMeteor(), 400+Math.random()*800); }
  }
  global.initUniverse=initUniverse; global.spawnMeteor=spawnMeteor;
})(window);
