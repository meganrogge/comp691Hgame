import "phaser";
import { WelcomeScene } from "./welcomeScene";
import { GameScene } from "./gameScene";
import { ScoreScene } from "./scoreScene";
import { ChoiceScene } from "./choiceScene";  

const config: Phaser.Types.Core.GameConfig = {
  title: "Runner",
  type: Phaser.AUTO,
  width: 1334,
  height: 750,
  parent: "game",
  scene: [WelcomeScene, GameScene, ChoiceScene, ScoreScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#99badd" 
};


export class StarfallGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  var game = new StarfallGame(config);
};
