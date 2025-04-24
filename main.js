const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize(); window.onresize = resize;

const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2 + 1,
  dx: (Math.random() - 0.5) * 0.5,
  dy: (Math.random() - 0.5) * 0.5,
}));
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  particles.forEach(p => {
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI); ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  requestAnimationFrame(draw);
}
draw();

const flags = { "中国": "🇨🇳", "马来西亚": "🇲🇾", "日本": "🇯🇵", "美国": "🇺🇸" };
function flagify(text) {
  for (let key in flags) if (text.includes(key)) return flags[key] + " " + text;
  return text;
}
const ch = new BroadcastChannel("draw-channel");
ch.onmessage = e => {
  const d = e.data;
  document.getElementById("prize").textContent = "🎁 " + d.prize;
  const parts = (d.text || "").split("｜");
  if (parts.length >= 3) {
    document.getElementById("winner").textContent = `🎯 ${parts[0]}｜${parts[1]}｜${flagify(parts[2])}`;
  }
  document.getElementById("prizeImg").src = d.img || "";
  document.getElementById("prizeImg").style.display = d.img ? "block" : "none";
  document.getElementById("prizeMeta").textContent = `💰 ${d.price || ""} ｜ 🎁 数量：${d.qty || ""}`;
};