
const flags = {
  "中国": "🇨🇳", "印度": "🇮🇳", "泰国": "🇹🇭", "马来西亚": "🇲🇾",
  "孟加拉国": "🇧🇩", "巴基斯坦": "🇵🇰", "印度尼西亚": "🇮🇩", "阿联酋": "🇦🇪",
  "俄罗斯": "🇷🇺", "老挝": "🇱🇦", "坦桑尼亚": "🇹🇿", "阿尔及利亚": "🇩🇿",
  "几内亚": "🇬🇳", "古巴": "🇨🇺", "巴西": "🇧🇷", "苏丹": "🇸🇩",
  "哈萨克斯坦": "🇰🇿", "乌兹别克斯坦": "🇺🇿", "希腊": "🇬🇷", "越南": "🇻🇳"
};

const channel = new BroadcastChannel("draw-channel");

channel.onmessage = (event) => {
  const data = event.data;
  document.getElementById("winner").textContent = data.text;
  document.getElementById("prize").textContent = data.prize || "奖项";
};

// 粒子背景绘制
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 1,
    dx: Math.random() - 0.5,
    dy: Math.random() - 0.5
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();
