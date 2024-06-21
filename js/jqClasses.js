// 定義Sprite類別來表示遊戲中的角色
class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = $("<img>");
    this.image.attr("src", imageSrc);
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image[0],
      this.framesCurrent * (this.image[0].width / this.framesMax),
      0,
      this.image[0].width / this.framesMax,
      this.image[0].height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image[0].width / this.framesMax) * this.scale,
      this.image[0].height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

// 定義Fighter類別，繼承自Sprite，表示可戰鬥的角色
class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
    attack1Damage = 20,
    attack2Damage = 30,
    combinedAttackDamage = 50,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.sprites = sprites;
    this.dead = false;

    this.attack1Damage = attack1Damage;
    this.attack2Damage = attack2Damage;
    this.combinedAttackDamage = combinedAttackDamage;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = $("<img>");
      this.sprites[sprite].image.attr("src", this.sprites[sprite].imageSrc);
    }
  }

  combinedAttack() {
    this.switchSprite("attack2");
    this.isAttacking = true;
    this.currentAttack = "combinedAttack";
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }

    if (
      this.isAttacking &&
      this.framesCurrent === this.sprites.attack2.framesMax - 1
    ) {
      this.isAttacking = false;

      if (
        this.attackBox.position.x + this.attackBox.width >= enemy.position.x &&
        this.attackBox.position.x <= enemy.position.x + enemy.width &&
        this.attackBox.position.y + this.attackBox.height >= enemy.position.y &&
        this.attackBox.position.y <= enemy.position.y + enemy.height
      ) {
        if (this.currentAttack === "attack1") {
          enemy.takeHit(this.attack1Damage);
        } else if (this.currentAttack === "attack2") {
          enemy.takeHit(this.attack2Damage);
        } else if (this.currentAttack === "combinedAttack") {
          enemy.takeHit(this.combinedAttackDamage);
        }
      }
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    this.currentAttack = "attack1";
  }

  attack2() {
    this.switchSprite("attack2");
    this.isAttacking = true;
    this.currentAttack = "attack2";
  }

  takeHit(damage) {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image[0] === this.sprites.death.image[0]) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.dead = true;
      }
      return;
    }

    if (
      (this.image[0] === this.sprites.attack1.image[0] ||
        this.image[0] === this.sprites.attack2.image[0]) &&
      this.framesCurrent < this.sprites.attack2.framesMax - 1
    ) {
      return;
    }

    if (
      this.image[0] === this.sprites.takeHit.image[0] &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image[0] !== this.sprites.idle.image[0]) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "run":
        if (this.image[0] !== this.sprites.run.image[0]) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "jump":
        if (this.image[0] !== this.sprites.jump.image[0]) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "fall":
        if (this.image[0] !== this.sprites.fall.image[0]) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "attack1":
        if (this.image[0] !== this.sprites.attack1.image[0]) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "attack2":
        if (this.image[0] !== this.sprites.attack2.image[0]) {
          this.image = this.sprites.attack2.image;
          this.framesMax = this.sprites.attack2.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "takeHit":
        if (this.image[0] !== this.sprites.takeHit.image[0]) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "death":
        if (this.image[0] !== this.sprites.death.image[0]) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
