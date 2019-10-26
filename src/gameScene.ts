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
  chosenObjects: null,
  otherObjects: null,
  map: {"desserts": ["cookie", "cupcake", "icecream", "pie", "cake"], "sports": ["soccer", "tennis", "baseball", "basketball", "football"], "cheerleading": ["pompom1",  "pompom2",  "pompom3", "pompom4", "pompom5", "pompom6"]},
  objects: ["cookie", "cupcake", "icecream", "pie", "cake", "soccer", "tennis", "baseball", "basketball", "football", "pompom1",  "pompom2",  "pompom3", "pompom4", "pompom5", "pompom6"]
};

type Platform = Phaser.Physics.Arcade.Sprite;

export class GameScene extends Phaser.Scene {
  platformGroup: Phaser.GameObjects.Group;
  platformPool: Phaser.GameObjects.Group;
  chosenObjectGroup: Phaser.GameObjects.Group;
  chosenObjectPool: Phaser.GameObjects.Group;
  otherObjectGroup: Phaser.GameObjects.Group;
  otherObjectPool: Phaser.GameObjects.Group;
  player: Phaser.Physics.Arcade.Sprite;
  jumpButton: Phaser.GameObjects.Text;
  runButton: Phaser.GameObjects.Text;
  scoreBoard: Phaser.GameObjects.Text;
  playerJumps = 0;
  nextPlatformDistance = 0;
  index: number;
  score: number;
  constructor() {
    super({
      key: "GameScene"
    });
  }

  // init(/*params: any*/): void { }

  preload(): void {
    this.load.image("platform", "assets/platform.png");
    this.load.image("player", "assets/player.png");
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
    

    switch(data){
      case "desserts":
          gameOptions.chosenObjects = gameOptions.map.desserts;
          gameOptions.otherObjects = gameOptions.objects.filter(o => gameOptions.chosenObjects.indexOf(o) == -1);
          break;
      case "sports":
          gameOptions.chosenObjects = gameOptions.map.sports;
          gameOptions.otherObjects = gameOptions.objects.filter(o => gameOptions.chosenObjects.indexOf(o) == -1);
          break;
      case "cheerleading":
          gameOptions.chosenObjects = gameOptions.map.cheerleading;
          gameOptions.otherObjects = gameOptions.objects.filter(o => gameOptions.chosenObjects.indexOf(o) == -1);
          break;
    }

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
    this.otherObjectGroup = this.add.group({
      removeCallback: otherObject => this.otherObjectGroup.add(otherObject)
    });
    this.otherObjectPool = this.add.group({
      removeCallback: otherObject => this.otherObjectGroup.add(otherObject)
    });
    // adding a platform to the game, the arguments are platform width and x position
    this.addPlatform(+this.game.config.width, +this.game.config.width / 2);

    // adding a chosenObject or otherObject to the game at random
    Math.random() > .5 ? this.addOtherObject(100, (+this.game.config.width * 2) / 3) : this.addChosenObject(100, (+this.game.config.width * 2) / 3);

    // adding the player;
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      +this.game.config.height / 2,
      "player"
    );
    this.player.setGravityY(gameOptions.playerGravity);

    // adding a chosenObject collider so chosenObject disappears upon collision with player
    this.physics.add.collider(this.player, this.chosenObjectGroup, (player, chosenObject) => {
      chosenObject.destroy();
      this.score++;
      this.updateScore();
    });

    this.physics.add.collider(this.player, this.otherObjectGroup,  (player, otherObject) => {
      otherObject.destroy();
    });

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    document.addEventListener("keydown", e => {
      if (e.keyCode == 32  || e.key == "Enter") {
        this.dealWithInput(e.key)
      }
    });
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
    if (this.scene.isPaused("GameScene")) {
      if (key == "Enter") {
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
    this.scene.resume("GameScene");
    this.jump();
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  resumeGameAndRun() {
    this.scene.resume("GameScene");
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  playerNearObject(object: Phaser.Physics.Arcade.Sprite) {
    return object.x - 200 > 0 && object.x - 200 < 2;
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
        this.getRandomElement(gameOptions.chosenObjects)
      );
      chosenObject.setImmovable(true);
      chosenObject.setVelocityX(gameOptions.platformStartSpeed * -0.5);
      this.chosenObjectGroup.add(chosenObject);
    }
    chosenObject.displayWidth = chosenObjectSize;
    chosenObject.displayHeight = chosenObjectSize;
  }


  addOtherObject(otherObjectSize: number, posX: number) {
    let otherObject: Phaser.Physics.Arcade.Sprite;
    if (this.otherObjectPool.getLength()) {
      otherObject = this.otherObjectPool.getFirst();
      otherObject.x = posX;
      otherObject.active = true;
      otherObject.visible = true;
      this.otherObjectPool.remove(otherObject);
    } else {
      otherObject = this.physics.add.sprite(
        posX,
        +this.game.config.height / 2,
        this.getRandomElement(gameOptions.otherObjects)
      );
      otherObject.setImmovable(true);
      otherObject.setVelocityX(gameOptions.platformStartSpeed * -0.5);
      this.otherObjectGroup.add(otherObject);
    }
    otherObject.displayWidth = otherObjectSize;
    otherObject.displayHeight = otherObjectSize;
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

        if (this.playerNearObject(chosenObject)) {
          this.jumpButton.setVisible(true);
          this.runButton.setVisible(true);
          this.scene.pause("GameScene");
        }
      }, this);

    this.otherObjectGroup
      .getChildren()
      .forEach(function (otherObject: Phaser.Physics.Arcade.Sprite) {
        let otherObjectDistance =
          +this.game.config.width - otherObject.x - otherObject.displayWidth / 2;
        minDistance = Math.min(minDistance, otherObjectDistance);

        if (this.playerNearObject(otherObject)) {
          console.log(otherObject);
          this.jumpButton.setVisible(true);
          this.runButton.setVisible(true);
          this.scene.pause("GameScene");
        }
      }, this);

    let chosen = Math.random() > .5;

    if (chosen) {
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
    } else {
      //adding new otherObjects
      if (minDistance > this.nextPlatformDistance) {
        var nextOtherObjectWidth = Phaser.Math.Between(
          gameOptions.platformSizeRange[0],
          gameOptions.platformSizeRange[1]
        );
        this.addOtherObject(
          +nextOtherObjectWidth,
          +this.game.config.width + +this.game.config.width / 2
        );
      }
    }


    //adding a platform
    this.addPlatform(
      +this.game.config.width,
      +this.game.config.width + +this.game.config.width / 2
    );
  }
}