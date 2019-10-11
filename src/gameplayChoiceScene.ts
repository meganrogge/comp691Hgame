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

  create(): void {
    var style = {
      font: "128px Arial Bold",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      backgroundColor: "#FFB6C1"
    };
    this.noFailButton = this.add.text(170, 80, "No Fail", style);


    var selectedStyle = {
      font: "128px Arial Bold",
      fill: "#fff",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      backgroundColor: "#99badd"
    };
    this.choiceButton = this.add.text(600, 80, "Choice", selectedStyle);

    var titleText: string = "Runner";

    this.title = this.add.text(150, 200, titleText, {
      font: "128px Arial Bold",
      fill: "#FBFBAC"
    });

    var hintText: string = "Press enter to start or space to select a gameplay type";
    this.hint = this.add.text(300, 350, hintText, {
      font: "24px Arial Bold",
      fill: "#FBFBAC"
    });
    let index = 0;
    this.input.keyboard.on(
      "keyup_SPACE",
      function(/*pointer*/) {
        if(index % 2 == 0){
          this.noFailButton.setBackgroundColor("#FFB6C1");
          this.noFailButton.setFill("#fff");
          this.choiceButton.setBackgroundColor("#FFFF33");
          this.choiceButton.setFill("#99badd");
        } else {
          this.choiceButton.setBackgroundColor("#FFB6C1");
          this.choiceButton.setFill("#fff");
          this.noFailButton.setBackgroundColor("#FFFF33");
          this.noFailButton.setFill("#99badd");
        }
        index++;
      },
      this
    );

    this.input.keyboard.on(
      "keyup_ENTER",
      function(/*pointer*/) {
        this.scene.start("GameScene");
      },
      this
    );
  }
}
