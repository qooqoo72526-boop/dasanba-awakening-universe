
// Simple audio manager that preloads and plays short UI sounds if files exist.
export class AudioBus{
  constructor(){
    this.map = {};
    this.preload('click', '/assets/sound/click_star.wav');
    this.preload('send', '/assets/sound/send_cosmic.wav');
    this.preload('AJIN', '/assets/sound/reply_ajin.wav');
    this.preload('MIGOU', '/assets/sound/reply_migou.wav');
    this.preload('GUNGUN', '/assets/sound/reply_gungun.wav');
  }
  preload(key, url){
    const a = new Audio(); a.src = url; a.preload = 'auto'; a.volume = 0.8;
    a.onerror = ()=>{ /* silently ignore missing files */ };
    this.map[key] = a;
  }
  play(key){
    const a = this.map[key]; if(!a) return;
    try{ a.currentTime = 0; a.play().catch(()=>{}); }catch(e){}
  }
}
export const audioBus = new AudioBus();
