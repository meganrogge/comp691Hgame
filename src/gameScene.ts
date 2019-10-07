import "phaser";
import { Input } from "phaser";

// global game options
let gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2
};

type Platform = Phaser.Physics.Arcade.Sprite;

export class GameScene extends Phaser.Scene {
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  cookieGroup: Phaser.GameObjects.Group;
  cookiePool: Phaser.GameObjects.Group;
  player: Phaser.Physics.Arcade.Sprite;
  playerJumps = 0;
  nextPlatformDistance = 0;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(/*params: any*/): void {}

  preload(): void {
    this.load.image("platform", "assets/platform.png");
    this.load.image("player", "assets/player.png");
    this.load.image("cookie", "assets/cookie.png");
  }

  createButtons(): void {
    var style = { font: "bold 32x Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle", backgroundColor: "#99badd" };
    this.add.text(300, 350, "Jump?", style);
  }

  create(): void {
    this.platformGroup = this.add.group({
      removeCallback: platform => this.platformPool.add(platform)
    });
    this.platformPool = this.add.group({
      removeCallback: platform => this.platformGroup.add(platform)
    });
    this.cookieGroup = this.add.group({
      removeCallback: cookie => this.cookieGroup.add(cookie)
    });
    this.cookiePool = this.add.group({
      removeCallback: cookie => this.cookieGroup.add(cookie)
    });
    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(+this.game.config.width, +this.game.config.width / 2);

    this.addCookie(100, +this.game.config.width*2/3);
    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      +this.game.config.height / 2,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity);

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    // checking for input
    this.input.keyboard.on("keyup_UP", this.jump, this);
  }
  // the core of the script: platform are added from the pool or created on the fly
  addPlatform(platformWidth: number, posX: number) {
    let platform: Platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
    } else {
      platform = this.physics.add.sprite(
        posX,
        +this.game.config.height * 0.8,
        "platform"
      );
      platform.setImmovable(true);
      platform.setVelocityX(gameOptions.platformStartSpeed * -1);
      this.platformGroup.add(platform);
    }
    platform.displayWidth = platformWidth;
    this.nextPlatformDistance = Phaser.Math.Between(
      gameOptions.spawnRange[0],
      gameOptions.spawnRange[1]
    );
  }
  addCookie(cookieSize: number, posX: number) {
    let cookie: Phaser.Physics.Arcade.Sprite;
    if (this.cookiePool.getLength()) {
      cookie = this.cookiePool.getFirst();
      cookie.x = posX;
      cookie.active = true;
      cookie.visible = true;
      this.cookiePool.remove(cookie);
    } else {
      cookie = this.physics.add.sprite(
        posX,
        +this.game.config.height/2,
        "cookie"
      );
      cookie.setImmovable(true);
      cookie.setVelocityX(gameOptions.platformStartSpeed * -.5);
      this.cookieGroup.add(cookie);
    }
    cookie.displayWidth = cookieSize;
    cookie.displayHeight = cookieSize;
  }
  // // the player jumps when on the ground, or once in the air as long as there are jumps left and the first jump was on the ground
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 2;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }
  }
  update() {
    // game over
    // if (this.player.y > this.game.config.height) {
    //   this.scene.start("ScoreScene", { score: this.playerJumps });
    // }
    this.player.x = gameOptions.playerStartPosition;

    // recycling cookies
    let minDistance = +this.game.config.width;
    this.cookieGroup.getChildren().forEach(function(cookie: Phaser.Physics.Arcade.Sprite) {
      let cookieDistance =
        +this.game.config.width - cookie.x - cookie.displayWidth / 2;
      minDistance = Math.min(minDistance, cookieDistance);
      if(cookie.x < 0){
        this.cookieGroup.remove(cookie);
      }
      if(cookie.x == 200){
        console.log(cookie.x);
        this.game.scene.pause;
      }
    }, this);
    
   // adding new cookies
    if (minDistance > this.nextPlatformDistance) {
      var nextCookieWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addCookie(
        +nextCookieWidth,
        +this.game.config.width + +this.game.config.width / 2
      );
      
 }
 this.addPlatform(
  +this.game.config.width,
  +this.game.config.width + +this.game.config.width / 2
);
}
}
