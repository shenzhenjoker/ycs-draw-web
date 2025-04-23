
const channel = new BroadcastChannel("draw-channel");
let entries = [];

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
  const displayText = `🎯 ${winner[0]} | ${winner[1]} | ${winner[2]}`;
  document.getElementById("current").textContent = "当前抽中：" + displayText;
  channel.postMessage(displayText);
}

channel.onmessage = (event) => {
  if (document.getElementById("winner")) {
    document.getElementById("winner").textContent = event.data;
  }
};
