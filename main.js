console.log("主逻辑脚本已加载");
// 此处省略复杂功能，实战中请补充完整 JS 抽奖逻辑。
document.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains("display-bg")) {
    document.querySelector("#prize-name").textContent = "等待抽奖...";
  } else {
    document.querySelector("#status").textContent = "控制界面已加载";
  }
});