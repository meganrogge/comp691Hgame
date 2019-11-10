import "phaser";
import { GameScene } from "./gameScene";
import { GameScene2 } from "./gameScene2";
import { GameNoFailScene } from "./gameNoFailScene";
import { ChoiceScene } from "./choiceScene";

const config: Phaser.Types.Core.GameConfig = {
  title: "Runner",
  type: Phaser.AUTO,
  width: 1334,
  height: 750,
  parent: "game",
  scene: [ChoiceScene, GameScene, GameNoFailScene, GameScene2],
  transparent: false,
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  }
};


export class StarfallGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new StarfallGame(config);
};