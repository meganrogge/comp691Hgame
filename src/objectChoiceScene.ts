import "phaser";

export class ObjectChoiceScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  noFailButton: Phaser.GameObjects.Text;
  choiceButton: Phaser.GameObjects.Text;
  cookie: Phaser.Physics.Arcade.Sprite;
  sports: Phaser.Physics.Arcade.Sprite;
  frame: Phaser.GameObjects.Text;

  constructor() {
    super({
      key: "ObjectChoiceScene"
    });
  }
  preload(): void {
    this.load.image("sports", "assets/sports.png");
    this.load.image("desserts", "assets/desserts.png");
  }
  create(): void {
    var style = {
      font: "120px Arial Bold",
      fill: "#FFFF33",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      backgroundColor: "#FFFF33"
    };
    this.cookie = this.physics.add.sprite(300, 200, "desserts");
    this.frame = this.add.text(this.cookie.x-50, this.cookie.y-50, "fdf", style);
    this.frame.setVisible(true);
    this.frame.setAlpha(.3);
    this.cookie.setVisible(true);
    
    this.cookie.setVisible(true);
    this.sports = this.physics.add.sprite(600, 200, "sports");
   

    var hintText: string = "Press space to select your target object or press enter to choose gameplay type";
    this.hint = this.add.text(150, 0, hintText, {
      font: "24px Arial Bold",
      fill: "#fff"
    });
    let index = 0;
    this.input.keyboard.on(
      "keyup_SPACE",
      function(/*pointer*/) {
        if(index % 2 == 0){
          this.frame.destroy();
          this.frame = this.add.text(this.sports.x-50, this.sports.y-50, "fdf", style).setAlpha(.3);
        } else {
          this.frame.destroy();
          this.frame = this.add.text(this.cookie.x-50, this.cookie.y-50, "fdf", style).setAlpha(.3);
        }
        index++;
      },
      this
    );
//eventually will do index % choice list size
    this.input.keyboard.on(
      "keyup_ENTER",
      function(/*pointer*/) {
        if(index % 2 == 0){
          // sports selected
          this.scene.start("GameplayChoiceScene", "desserts");
        } else {
          // cookie selected
          this.scene.start("GameplayChoiceScene", "sports");
        }
      },
      this
    );
  }
}
