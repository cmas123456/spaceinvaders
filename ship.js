export default class Ship {
    constructor(gameWidth, gameHeight) {
      this.gameWidth = gameWidth;
      this.gameHeight = gameHeight;
      this.width = 15;
      this.height = 40;
      this.position = {
        x: gameWidth / 2 - this.width / 2,
        y: gameHeight - this.height - 20
      };
      this.maxSpeed = 7;
      this.horizontalSpeed = 0;
      this.verticalSpeed = 0;
    }
  
    MoveUp() {
      this.verticalSpeed = -this.maxSpeed;
    }
  
    MoveLeft() {
      this.horizontalSpeed = -this.maxSpeed;
    }
  
    MoveDown() {
      this.verticalSpeed = this.maxSpeed;
    }
  
    MoveRight() {
      this.horizontalSpeed = this.maxSpeed;
    }
  
    StopVertical() {
      this.verticalSpeed = 0;
    }
  
    StopHorizontal() {
      this.horizontalSpeed = 0;
    }
  
    Fire() {
      console.log("FIRE!");
    }
  
    Draw(ctx) {
      ctx.fillStyle = "#d75a0e";
      ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
  
    Update(deltaTime) {
      if (!deltaTime) return;
  
      this.position.x += this.horizontalSpeed;
      this.position.y += this.verticalSpeed;
  
      if (this.position.x < 0) this.position.x = 0;
      if (this.position.x + this.width > this.gameWidth)
        this.position.x = this.gameWidth - this.width;
      if (this.position.y < 0) this.position.y = 0;
      if (this.position.y + this.height > this.gameHeight)
        this.position.y = this.gameHeight - this.height;
    }
  }
  