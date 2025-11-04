fetch('/api/chat', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({ persona:'Migou', message:'米果，給我一句醒腦的話。' })
}).then(r=>r.json()).then(console.log)
