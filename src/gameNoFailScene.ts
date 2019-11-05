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
  map: {"desserts": ["cookie", "cupcake", "icecream", "pie", "cake"], "sports": ["soccer", "tennis", "baseball", "basketball", "football"], "cheerleading": ["pompom1",  "pompom2",  "pompom3", "pompom4", "pompom5", "pompom6"]}
};

type Platform = Phaser.Physics.Arcade.Sprite;

export class GameNoFailScene extends Phaser.Scene {
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  chosenObjectGroup: Phaser.GameObjects.Group;
  chosenObjectPool: Phaser.GameObjects.Group;
  player: Phaser.Physics.Arcade.Sprite;
  jumpButton: Phaser.GameObjects.Text;
  runButton: Phaser.GameObjects.Text;
  scoreBoard: Phaser.GameObjects.Text;
  playerAnim: Phaser.Animations.Animation;
  playerJumps = 0;
  nextPlatformDistance = 0;
  index: number;
  score: number;
  constructor() {
    super({
      key: "GameNoFailScene"
    });
  }

  // init(/*params: any*/): void { }

  preload(): void {
    this.load.image("platform", "assets/platform.png");
    this.load.spritesheet("woman", 'assets/sprite_sheets/girl-spritesheet.png',{
      frameWidth: 69,
      frameHeight: 90,
      startFrame: 0,
      endFrame: 11
    });
    this.load.spritesheet("man", 'assets/sprite_sheets/man-spritesheet.png', {
      frameWidth: 62,
      frameHeight: 63,
      startFrame: 0,
      endFrame: 15
    });
    this.load.image("cookie", "assets/cookie.png");
    this.load.image("cupcake", "assets/cupcake.png");
    this.load.image("pie", "assets/pie.png");
    this.load.image("cake", "assets/cake.png");
    this.load.image("icecream", "assets/icecream.png");
    this.load.image("soccer", "assets/soccer.png");
    this.load.image("tennis", "assets/tennis.png");
    this.load.image("baseball", "assets/baseball.png");
    this.load.image("basketball", "assets/basketball.png");
    this.load.image("football", "assets/football.png");
    this.load.image("pompom1", "assets/pompom1.png");
    this.load.image("pompom2", "assets/pompom2.png");
    this.load.image("pompom3", "assets/pompom3.png");
    this.load.image("pompom4", "assets/pompom4.png");
    this.load.image("pompom5", "assets/pompom5.png");
    this.load.image("pompom6", "assets/pompom6.png");
  }

  printSceneInfo() {
    console.log("is sleeping " + this.scene.isSleeping());
    console.log("is paused " + this.scene.isPaused());
    console.log("is visible " + this.scene.isVisible());
    console.log("is active " + this.scene.isActive());
  }

  create(data): void {
    this.score = 0;
    this.updateScore();
    this.index = 0;
    
    this.cameras.main.setBackgroundColor(data.background);
    console.log(data);
    switch(data.category){
      case "desserts":
          gameOptions.chosenObject = gameOptions.map.desserts;
          break;
      case "sports":
          gameOptions.chosenObject = gameOptions.map.sports;
          break;
      case "cheerleading":
          gameOptions.chosenObject = gameOptions.map.cheerleading;   
    }
    console.log(gameOptions.chosenObject);
    this.createButtons();

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
    this.addChosenObject(100, (+this.game.config.width * 2) / 3);

    // adding the player;
    var config = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers(data.player, config),
      frameRate: 10,
      yoyo: true,
      repeat: -1
  };

  this.anims.create(config);
  this.player = this.physics.add.sprite(
    gameOptions.playerStartPosition,
    +this.game.config.height / 2,
    data.player
  );
 
  this.player.setGravityY(gameOptions.playerGravity);
  this.player.anims.load('walk');
  this.player.anims.play('walk');

    // adding a chosenObject collider so chosenObject disappears upon collision with player
    this.physics.add.collider(this.player, this.chosenObjectGroup, (player, chosenObject) => {
      chosenObject.destroy();
      this.score++;
      this.updateScore();
    });

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);
    // to do : disable input when scene isn't paused

    document.addEventListener("keydown", e => {
      if (e.key == " "  || e.key == "Enter" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
        if(e.key == "Enter" || e.key == "ArrowRight"){
          this.dealWithInput("ArrowRight")
        } else {
          this.dealWithInput("ArrowLeft");
        }
      }
    });
    document
      .getElementById("left")
      .addEventListener("click", e => this.dealWithInput("ArrowLeft"));
    document
      .getElementById("right")
      .addEventListener("click", e => this.dealWithInput("ArrowRight"));
  }

  getRandomElement(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  createButtons() {
    var selectedStyle = {
      font: "128px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#99badd",
      backgroundColor: "#FFFF33"
    };
    var style = {
      font: "128px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#99badd",
      backgroundColor: "#fff"
    };
    this.jumpButton = this.add.text(300, 350, "Jump", selectedStyle);
    this.jumpButton.setVisible(false);

    this.runButton = this.add.text(700, 350, "Run", style);
    this.runButton.setVisible(false);
  }

  updateScore() {
    var scoreBoardStyle = {
      font: "128px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#99badd",
      backgroundColor: "#fff"
    };
    this.scoreBoard = this.add.text(500, 0, "Score: " + this.score, scoreBoardStyle);
  }

  dealWithInput(key) {
    this.printSceneInfo();
    console.log(this.index);
    if (this.scene.isPaused("GameNoFailScene")) {
      if (key == "ArrowRight") {
        if (this.index % 2 == 0) {
          this.resumeGameAndJump();
        } else {
          this.resumeGameAndRun();
        }
      } else {
        this.dealWithButtons();
      }
    }
  }

  dealWithButtons() {
    console.log("dealing with buttons "+this.index);
    if (this.index % 2 == 1) {
      this.jumpButton.setBackgroundColor("#FFFF33");
      this.runButton.setBackgroundColor("#fff");
    } else {
      this.runButton.setBackgroundColor("#FFFF33");
      this.jumpButton.setBackgroundColor("#fff");
    }
    this.index++;
  }

  resumeGameAndJump() {
    this.scene.resume("GameNoFailScene");
    this.jump();
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  resumeGameAndRun() {
    this.scene.resume("GameNoFailScene");
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  playerNearChosenObject(chosenObject: Phaser.Physics.Arcade.Sprite) {
    return chosenObject.x - 200 > 0 && chosenObject.x - 200 < 3;
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
  addChosenObject(chosenObjectSize: number, posX: number) {
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
        this.getRandomElement(gameOptions.chosenObject)
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
    this.player.x = gameOptions.playerStartPosition;

    // recycling chosenObjects
    let minDistance = +this.game.config.width;
    this.chosenObjectGroup
      .getChildren()
      .forEach(function (chosenObject: Phaser.Physics.Arcade.Sprite) {
        let chosenObjectDistance =
          +this.game.config.width - chosenObject.x - chosenObject.displayWidth / 2;
        minDistance = Math.min(minDistance, chosenObjectDistance);

        if (this.playerNearChosenObject(chosenObject)) {
          this.jumpButton.setVisible(true);
          this.runButton.setVisible(true);
          this.scene.pause("GameNoFailScene");
        }
      }, this);

    //adding new chosenObjects
    if (minDistance > this.nextPlatformDistance) {
      var nextChosenObjectWidth = Phaser.Math.Between(
        gameOptions.platformSizeRange[0],
        gameOptions.platformSizeRange[1]
      );
      this.addChosenObject(
        +nextChosenObjectWidth,
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