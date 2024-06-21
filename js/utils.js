// 檢測兩個矩形是否發生碰撞，用於判斷攻擊是否命中
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    // 檢查rectangle1的攻擊框是否超過了rectangle2的左邊界
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    // 檢查rectangle1的攻擊框是否在rectangle2的右邊界內
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    // 檢查rectangle1的攻擊框是否超過了rectangle2的上邊界
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    // 檢查rectangle1的攻擊框是否在rectangle2的下邊界內
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

// 確定比賽的勝利者
function determineWinner({ player, enemy, timerId }) {
  // 停止計時器
  clearTimeout(timerId);
  // 顯示比賽結果的文本元素
  document.querySelector("#displayText").style.display = "flex";

  // 判斷比賽結果並顯示相應的文本
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie"; // 平局
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Wins"; // 玩家1獲勝
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Wins"; // 玩家2獲勝
  }
}

let timer = 60; // 計時器初始時間
let timerId; // 計時器ID

// 減少計時器時間並更新顯示
function decreaseTimer() {
  if (timer > 0) {
    // 每秒調用一次decreaseTimer函數
    timerId = setTimeout(decreaseTimer, 1000);
    timer--; // 減少計時器時間
    // 更新計時器顯示
    document.querySelector("#timer").innerHTML = timer;
  }
  // 當計時器時間為0時，確定比賽勝利者
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
