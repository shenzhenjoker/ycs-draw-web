
const channel = new BroadcastChannel("draw-channel");
channel.onmessage = (event) => {
  const data = event.data;
  document.getElementById("winner").textContent = data.text;
  document.getElementById("prize").textContent = data.prize || "奖项";
};

// 粒子背景
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let particles = [];
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: Math.random() * 0.6 - 0.3,
    dy: Math.random() * 0.6 - 0.3
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      let q = particles[j];
      let dist = Math.hypot(p.x - q.x, p.y - q.y);
      if (dist < 80) {
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(draw);
}
draw();
