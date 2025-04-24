
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
  if (document.getElementById("winner")) {
    document.getElementById("winner").textContent = data.text;
    document.getElementById("prize").textContent = data.prize || "奖项";
  }
};
