
const flags = {
  "中国": "🇨🇳", "印度": "🇮🇳", "泰国": "🇹🇭", "马来西亚": "🇲🇾",
  "孟加拉国": "🇧🇩", "巴基斯坦": "🇵🇰", "印度尼西亚": "🇮🇩", "阿联酋": "🇦🇪",
  "俄罗斯": "🇷🇺", "老挝": "🇱🇦", "坦桑尼亚": "🇹🇿", "阿尔及利亚": "🇩🇿",
  "几内亚": "🇬🇳", "古巴": "🇨🇺", "巴西": "🇧🇷", "苏丹": "🇸🇩",
  "哈萨克斯坦": "🇰🇿", "乌兹别克斯坦": "🇺🇿", "希腊": "🇬🇷", "越南": "🇻🇳"
};

const channel = new BroadcastChannel("draw-channel");
let entries = [], currentPrize = "一等奖";

document.getElementById("csvFile")?.addEventListener("change", function (e) {
  Papa.parse(e.target.files[0], {
    header: false,
    complete: function(results) {
      entries = results.data.filter(row => row.length >= 3);
      alert("导入成功，共 " + entries.length + " 条！");
    }
  });
});

function startDraw() {
  if (entries.length === 0) {
    alert("请先上传 CSV 文件！");
    return;
  }
  const winner = entries.splice(Math.floor(Math.random() * entries.length), 1)[0];
  const flag = flags[winner[1]] || '';
  const displayText = `🎯 ${winner[0]} | ${flag} ${winner[1]} | ${winner[2]}`;
  document.getElementById("current")?.textContent = "当前抽中：" + displayText;
  channel.postMessage({ text: displayText, prize: currentPrize });
}

channel.onmessage = (event) => {
  const data = event.data;
  if (document.getElementById("winner")) {
    document.getElementById("winner").textContent = data.text;
    document.getElementById("prize").textContent = data.prize || "奖项";
  }
};

// 粒子背景动画
const canvas = document.getElementById("bg");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push({ x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight, r: Math.random()*2+1, dx: Math.random()-0.5, dy: Math.random()-0.5 });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = "white";
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x<0||p.x>canvas.width) p.dx*=-1;
      if (p.y<0||p.y>canvas.height) p.dy*=-1;
    }
    requestAnimationFrame(draw);
  }
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}
