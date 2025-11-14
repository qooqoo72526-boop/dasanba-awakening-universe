const canvas = document.getElementById("particleRing");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const R = 180; // 能量圈半徑
const depth = 360; // 粒子數量

function initParticles() {
    particles = [];
    for (let i = 0; i < depth; i++) {
        let angle = (i / depth) * Math.PI * 2;
        let x = Math.cos(angle) * R;
        let y = Math.sin(angle) * R;

        particles.push({
            x, y,
            z: Math.random() * 140 - 70,
            size: Math.random() * 2.2 + 0.5
        });
    }
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p => {
        p.z += 0.2;
        if (p.z > 70) p.z = -70;

        let scale = 260 / (260 + p.z);
        let px = canvas.width/2 + p.x * scale;
        let py = canvas.height/2 + p.y * scale;

        ctx.beginPath();
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.35 * scale})`;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

initParticles();
animate();
