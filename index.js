// 取得canvas元素並設定其2D繪圖上下文
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// 設定重力常數
const gravity = 0.7;

// 動態設置 canvas 的寬度和高度
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  c.fillRect(0, 0, canvas.width, canvas.height);
}

// 初始化畫布大小
resizeCanvas();

// 添加視窗調整大小事件監聽器
window.addEventListener("resize", () => {
  resizeCanvas();
});

// 填充整個canvas為黑色背景
c.fillRect(0, 0, canvas.width, canvas.height);

// 創建背景精靈
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  scale: canvas.width / 1024, // 比例缩放
});

// 創建商店精靈
const shop = new Sprite({
  position: {
    x: 940,
    y: 322,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

// 創建玩家角色
const player = new Fighter({
  position: {
    x: 100,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

// 創建敵人角色
const enemy = new Fighter({
  position: {
    x: 1200,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
});

// 定義按鍵狀態
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

// 啟動計時器
decreaseTimer();

// 動畫循環函數
function animate() {
  window.requestAnimationFrame(animate); // 設置動畫循環
  c.fillStyle = "black"; // 設定背景色
  c.fillRect(0, 0, canvas.width, canvas.height); // 填充背景

  background.update(); // 更新背景
  shop.update(); // 更新商店

  // 添加半透明白色覆蓋層
  c.fillStyle = "rgba(255,255,255,0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update(); // 更新玩家位置
  enemy.update(); // 更新敵人位置

  player.velocity.x = 0; // 重置玩家的水平速度
  enemy.velocity.x = 0; // 重置敵人的水平速度

  // 根據按鍵狀態設置玩家的水平速度
  if (keys.a.pressed && player.lastkey === "a") {
    player.velocity.x = -5; // 向左移動
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastkey === "d") {
    player.velocity.x = 5; // 向右移動
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // 根據玩家的垂直速度設置動畫
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  // 根據按鍵狀態設置敵人的水平速度
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5; // 向左移動
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5; // 向右移動
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // 根據敵人的垂直速度設置動畫
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // 檢測玩家攻擊敵人
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    // 更新敵人的健康條
    gsap.to("#enemyHealth", {
      width: enemy.health + "%",
    });
  }

  // 重置玩家攻擊狀態
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // 檢測敵人攻擊玩家
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    // 更新玩家的健康條
    gsap.to("#playerHealth", {
      width: player.health + "%",
    });
  }

  // 重置敵人攻擊狀態
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // 根據角色健康狀態決定比賽勝負
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

// 啟動動畫
animate();

// 監聽按鍵按下事件
window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true; // 設置向右移動狀態
        player.lastkey = "d";
        break;
      case "a":
        keys.a.pressed = true; // 設置向左移動狀態
        player.lastkey = "a";
        break;
      case "w":
        player.velocity.y = -20; // 設置向上跳躍
        break;
      case " ":
        player.attack(); // 玩家攻擊
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true; // 設置向右移動狀態
        enemy.lastkey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true; // 設置向左移動狀態
        enemy.lastkey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20; // 設置向上跳躍
        break;
      case "ArrowDown":
        enemy.attack(); // 敵人攻擊
        break;
    }
  }
});

// 監聽按鍵釋放事件
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false; // 取消向右移動狀態
      break;
    case "a":
      keys.a.pressed = false; // 取消向左移動狀態
      break;
    case "w":
      keys.w.pressed = false; // 取消跳躍狀態
      break;
  }

  // 敵人的按鍵釋放事件
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false; // 取消向右移動狀態
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false; // 取消向左移動狀態
      break;
  }
});
