import "phaser";

export class WelcomeScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "WelcomeScene"
    });
  }

  create(): void {
    var titleText: string = "Game";
    this.title = this.add.text(150, 200, titleText, {
      font: "128px Arial Bold",
      fill: "#FBFBAC"
    });

    var hintText: string = "Press enter to start customizing your game";
    this.hint = this.add.text(300, 350, hintText, {
      font: "24px Arial Bold",
      fill: "#FBFBAC"
    });

    this.input.keyboard.on(
      "keyup_ENTER",
      function(/*pointer*/) {
        this.scene.start("GameScene");
      },
      this
    );
  }
}
