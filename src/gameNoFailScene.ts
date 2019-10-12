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
  jumps: 2,
  chosenObject: null,
};

type Platform = Phaser.Physics.Arcade.Sprite;

export class GameNoFailScene extends Phaser.Scene {
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  chosenObjectGroup: Phaser.GameObjects.Group;
  chosenObjectPool: Phaser.GameObjects.Group;
  player: Phaser.Physics.Arcade.Sprite;
  buttons: Phaser.GameObjects.Text;
  playerJumps = 0;
  nextPlatformDistance = 0;

  constructor() {
    super({
      key: "GameNoFailScene"
    });
  }

  // init(/*params: any*/): void { }

  preload(): void {
    this.printSceneInfo();
    this.load.image("platform", "assets/platform.png");
    this.load.image("player", "assets/player.png");
    this.load.image("cookie", "assets/cookie.png");
    this.load.image("sports", "assets/sports.png");
  }

  printSceneInfo() {
    console.log("is sleeping " + this.scene.isSleeping());
    console.log("is paused " + this.scene.isPaused());
    console.log("is visible " + this.scene.isVisible());
    console.log("is active " + this.scene.isActive());
  }

  create(data): void {
    console.log(data);
    if(data == "cookie"){
      gameOptions.chosenObject = "cookie";
    } else if(data == "sports"){
      gameOptions.chosenObject = "sports";
    }
    var style = {
      font: "128px Arial Bold",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      backgroundColor: "#FFB6C1"
    };
    this.buttons = this.add.text(300, 350, "Jump?", style);
    this.buttons.setVisible(false);

    this.platformGroup = this.add.group({
      removeCallback: platform => this.platformPool.add(platform)
    });
    this.platformPool = this.add.group({
      removeCallback: platform => this.platformGroup.add(platform)
    });
    this.chosenObjectGroup = this.add.group({
      removeCallback: chosenObject => this.chosenObjectGroup.add(chosenObject)
    });
    this.chosenObjectPool = this.add.group({
      removeCallback: chosenObject => this.chosenObjectGroup.add(chosenObject)
    });
    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(+this.game.config.width, +this.game.config.width / 2);

    // adding a chosenObject to the game
    this.addchosenObject(100, (+this.game.config.width * 2) / 3);

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      +this.game.config.height / 2,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity);
    
    // adding a chosenObject collider so chosenObject disappears upon collision with player
    this.physics.add.collider(this.player, this.chosenObjectGroup, function (player, chosenObject) {
      chosenObject.destroy();
    });

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    // to do : disable input when scene isn't paused
    this.input.keyboard.on("keyup_ENTER", this.jump, this);
    document.addEventListener("keydown", e => e.keyCode == 13 ? this.resumeGameAndJump() : e.keyCode == 32 ? this.resumeGameAndRun() : this.scene.pause("GameScene"));
  }

  resumeGameAndJump() {
    this.scene.resume("GameNoFailScene");
    this.jump();
    this.buttons.setVisible(false);
  }

  resumeGameAndRun() {
    this.scene.resume("GameNoFailScene");
    this.buttons.setVisible(false);
  }

  playerNearchosenObject(chosenObject: Phaser.Physics.Arcade.Sprite) {
    return chosenObject.x - 200 > 0 && chosenObject.x - 200 < 2;
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
  addchosenObject(chosenObjectSize: number, posX: number) {
    let chosenObject: Phaser.Physics.Arcade.Sprite;
    if (this.chosenObjectPool.getLength()) {
      chosenObject = this.chosenObjectPool.getFirst();
      chosenObject.x = posX;
      chosenObject.active = true;
      chosenObject.visible = true;
      this.chosenObjectPool.remove(chosenObject);
    } else {
      chosenObject = this.physics.add.sprite(
        posX,
        +this.game.config.height / 2,
        gameOptions.chosenObject
      );
      chosenObject.setImmovable(true);
      chosenObject.setVelocityX(gameOptions.platformStartSpeed * -0.5);
      this.chosenObjectGroup.add(chosenObject);
    }
    chosenObject.displayWidth = chosenObjectSize;
    chosenObject.displayHeight = chosenObjectSize;
  }
  // // the player jumps when on the ground, or once in the air as long as there are jumps left 
  // and the first jump was on the ground
  jump() {
    if (
      this.player.body.touching.down ||
      (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps)
    ) {
      if (this.player.body.touching.down) {
        this.playerJumps = 2;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1 * 2);
      this.playerJumps++;
    }
  }
  update() {

    if(!this.scene.isPaused()){
      this.input.enabled = true;
    } else {
      this.input.enabled = false;
    }
    this.player.x = gameOptions.playerStartPosition;

    // recycling chosenObjects
    let minDistance = +this.game.config.width;
    this.chosenObjectGroup
      .getChildren()
      .forEach(function (chosenObject: Phaser.Physics.Arcade.Sprite) {
        let chosenObjectDistance =
          +this.game.config.width - chosenObject.x - chosenObject.displayWidth / 2;
        minDistance = Math.min(minDistance, chosenObjectDistance);

        if (this.playerNearchosenObject(chosenObject)) {
          this.buttons.setVisible(true);
          this.scene.pause("GameNoFailScene");
        }
      }, this);

    //adding new chosenObjects
    if (minDistance > this.nextPlatformDistance) {
      var nextchosenObjectWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addchosenObject(
        +nextchosenObjectWidth,
        +this.game.config.width + +this.game.config.width / 2
      );

    }
    //adding a platform
    this.addPlatform(
      +this.game.config.width,
      +this.game.config.width + +this.game.config.width / 2
    );
  }
}