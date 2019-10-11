import "phaser";

export class GameplayChoiceScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  noFailButton: Phaser.GameObjects.Text;
  choiceButton: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "GameplayChoiceScene"
    });
  }

  create(data): void {
    var style = {
      font: "128px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#99badd",
      backgroundColor: "#FFFF33"
    };
    this.noFailButton = this.add.text(150, 70, "No Fail", style);

    var selectedStyle = {
      font: "128px Arial Bold",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      fill: "#99badd",
      backgroundColor: "#fff"
    };
    this.choiceButton = this.add.text(600, 70, "Choice", selectedStyle);

    var titleText: string = "Game";

    this.title = this.add.text(150, 200, titleText, {
      font: "128px Arial Bold",
      fill: "#fff"
    });

    var hintText: string = "Press enter to start or space to select a gameplay type";
    this.hint = this.add.text(300, 350, hintText, {
      font: "24px Arial Bold",
      fill: "#fff"
    });
    let index = 0;
    this.input.keyboard.on(
      "keyup_SPACE",
      function(/*pointer*/) {
        if(index % 2 == 0){
          this.noFailButton.setBackgroundColor("#fff");
          this.choiceButton.setBackgroundColor("#FFFF33");
        } else {
          this.choiceButton.setBackgroundColor("#fff");
          this.noFailButton.setBackgroundColor("#FFFF33");
        }
        index++;
      },
      this
    );

    this.input.keyboard.on(
      "keyup_ENTER",
      function(/*pointer*/) {
        if(index % 2 == 0){
          // no fail game selected
          this.scene.start("GameScene", data, this.noFailButton);
        } else {
          // choice game selected
          this.scene.start("GameScene", data, this.choiceButton);
        }
      },
      this
    );
  }
}
