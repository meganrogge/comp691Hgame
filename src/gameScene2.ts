import "phaser";
/** @typedef {import('phaser')} Phaser */
import { SwitchBase } from "./base";
import { Sound } from "phaser";

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
  map: { "desserts": ["cookie", "cupcake", "icecream", "pie", "cake"], "sports": ["soccer", "tennis", "baseball", "basketball", "football"], "cheerleading": ["pompom1", "pompom2", "pompom3", "pompom4", "pompom5", "pompom6"] },
  objects: ["cookie", "cupcake", "icecream", "pie", "cake", "soccer", "tennis", "baseball", "basketball", "football", "pompom1", "pompom2", "pompom3", "pompom4", "pompom5", "pompom6"]
};

type Platform = Phaser.Physics.Arcade.Sprite;

export class GameScene2 extends SwitchBase {
  platformGroup: Phaser.GameObjects.Group;
  targetObject: Phaser.Physics.Arcade.Sprite;
  platformPool: Phaser.GameObjects.Group;
  chosenObjectGroup: Phaser.GameObjects.Group;
  chosenObjectPool: Phaser.GameObjects.Group;
  otherObjectGroup: Phaser.GameObjects.Group;
  otherObjectPool: Phaser.GameObjects.Group;
  player: Phaser.Physics.Arcade.Sprite;
  jumpButton: Phaser.GameObjects.Text;
  runButton: Phaser.GameObjects.Text;
  scoreBoard: Phaser.GameObjects.Text;
  playerAnim: Phaser.Animations.Animation;
  playerJumps = 0;
  sound: Phaser.Sound.WebAudioSoundManager;
  nextPlatformDistance = 0;
  index: number;
  score: number;
  chosen: boolean;
 
  constructor() {
    super({
      key: "GameScene2"
    });
  }

  preload(): void {
    this.load.image("platform", "assets/platform.png");
    this.load.spritesheet("woman", 'assets/sprite_sheets/woman-spritesheet.png', {
      frameWidth: 69,
      frameHeight: 90,
      startFrame: 0,
      endFrame: 11
    });
    this.load.spritesheet("man", 'assets/sprite_sheets/alien-spritesheet.png', {
      frameWidth: 62,
      frameHeight: 63,
      startFrame: 0,
      endFrame: 15
    });
    this.load.spritesheet("girl", 'assets/sprite_sheets/girl-spritesheet.png', {
      frameWidth: 65,
      frameHeight: 65,
      startFrame: 0,
      endFrame: 3
    });
    this.load.spritesheet("mario", 'assets/sprite_sheets/mario-spritesheet.png', {
      frameWidth: 36,
      frameHeight: 46,
      startFrame: 0,
      endFrame: 7
    });
    this.load.spritesheet("soldier", 'assets/sprite_sheets/soldier-spritesheet.png', {
      frameWidth: 250,
      frameHeight: 301,
      startFrame: 0,
      endFrame: 8
    });

    this.load.image("cookie", "assets/sprites/cookie.png");
    this.load.image("cupcake", "assets/sprites/cupcake.png");
    this.load.image("pie", "assets/sprites/pie.png");
    this.load.image("cake", "assets/sprites/cake.png");
    this.load.image("icecream", "assets/sprites/icecream.png");
    this.load.image("soccer", "assets/sprites/soccer.png");
    this.load.image("tennis", "assets/sprites/tennis.png");
    this.load.image("baseball", "assets/sprites/baseball.png");
    this.load.image("basketball", "assets/sprites/basketball.png");
    this.load.image("football", "assets/sprites/football.png");
    this.load.image("pompom1", "assets/sprites/pompom1.png");
    this.load.image("pompom2", "assets/sprites/pompom2.png");
    this.load.image("pompom3", "assets/sprites/pompom3.png");
    this.load.image("pompom4", "assets/sprites/pompom4.png");
    this.load.image("pompom5", "assets/sprites/pompom5.png");
    this.load.image("pompom6", "assets/sprites/pompom6.png");

    this.load.audio('bounce', 'assets/audio/bounce.mp3');
  }

  create(preferences): void {

    let bounceNoise = this.sound.add('bounce');
    bounceNoise.play();
    this.score = 0;
    this.updateScore();
    this.index = 0;
    this.cameras.main.setBackgroundColor(preferences.background);
    var config = {
      key: 'walk',
      frames: this.anims.generateFrameNumbers(preferences.player, config),
      frameRate: 10,
      loop: true,
      repeat: -1
    };
    this.anims.create(config);
    this.player = this.physics.add.sprite(
      gameOptions.playerStartPosition,
      +this.game.config.height / 2,
      preferences.player
    );
    this.player.setVelocityX(gameOptions.platformStartSpeed);
    this.player.setGravityY(gameOptions.playerGravity);
    this.player.anims.load('walk');
    this.player.anims.play('walk');

    switch (preferences.category) {
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

    // setting collisions between the player and the platform group
    this.physics.add.collider(this.player, this.platformGroup);

    document.addEventListener("keydown", e => {
      if (e.key == " " || e.key == "ArrowLeft") {
        this.dealWithInput("ArrowLeft")
      } else if (e.key == "Enter" || e.key == "ArrowRight") {
        this.dealWithInput("ArrowRight");
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
    if(this.scoreBoard != undefined){
      this.scoreBoard.destroy();
    }
    var scoreBoardStyle = {
      font: "72px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#fff"
    };
    this.scoreBoard = this.add.text(500, +this.game.config.width / 2 -25, "Score: " + this.score, scoreBoardStyle);
  }

  dealWithInput(key) {
    if (this.scene.isPaused("GameScene2")) {
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
    this.jump();
    this.scene.resume("GameScene2");
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  resumeGameAndRun() {
    this.scene.resume("GameScene2");
    this.jumpButton.setVisible(false);
    this.runButton.setVisible(false);
  }

  playerNearObject(object: Phaser.Physics.Arcade.Sprite) {
    if (object.x - 600 > 0 && object.x - 600 < 2) {
      this.targetObject = object;
      return true;
    } else {
      return false;
    }
  }

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
      let o = this.getRandomElement(gameOptions.chosenObjects);
      chosenObject = this.physics.add.sprite(
        posX,
        +this.game.config.height - 200,
        o
      );
      this.tweens.add({
        targets: chosenObject,
        props: {
          y: { value: 50, duration: 1000, ease: 'Sinusoidal', yoyo: true, repeat: -1 },
          x: { value: -100, duration: 10000, ease: 'Linear', yoyo: false }
        }
      });
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
      let o = this.getRandomElement(gameOptions.otherObjects);
      otherObject = this.physics.add.sprite(
        posX,
        +this.game.config.height - 200,
        o
      );
      this.tweens.add({
        targets: otherObject,
        props: {
          y: { value: 50, duration: 1000, ease: 'Sinusoidal', yoyo: true, repeat: -1 },
          x: { value: -100, duration: 10000, ease: 'Linear', yoyo: false }
        }
      });
      otherObject.setVelocityX(gameOptions.platformStartSpeed * -0.5);
      this.otherObjectGroup.add(otherObject);
    }
    otherObject.displayWidth = otherObjectSize;
    otherObject.displayHeight = otherObjectSize;
  }

  jump() {
    this.tweens.add({
      targets: this.player,
      props: {
        y: { value: this.targetObject.y },
        x: { value: this.targetObject.x }
      },
      onComplete: () => {
        this.targetObject.setVisible(false);
        if (gameOptions.chosenObjects.indexOf(this.targetObject.texture.key) > -1) {
          this.score++;
          this.updateScore();
        }
      },
      duration: 200
    });
  }

  update() {
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
          this.scene.pause("GameScene2");
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
          this.scene.pause("GameScene2");
        }
      }, this);

    this.chosen = Math.random() > .5;

    if (this.chosen) {
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