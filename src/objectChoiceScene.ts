import "phaser";

export class ObjectChoiceScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  noFailButton: Phaser.GameObjects.Text;
  choiceButton: Phaser.GameObjects.Text;
  desserts: Phaser.Physics.Arcade.Sprite;
  sports: Phaser.Physics.Arcade.Sprite;
  cheerleading: Phaser.Physics.Arcade.Sprite;
  frame: Phaser.GameObjects.Text;
  index: number;
  style: object;
  constructor() {
    super({
      key: "ObjectChoiceScene"
    });
  }
  preload(): void {
    this.load.image("sports", "assets/sports.png");
    this.load.image("desserts", "assets/desserts.png");
    this.load.image("cheerleading", "assets/cheerleading.jpg");
  }
  create(): void {
    this.index = 0;
    this.style = {
      font: "120px Arial Bold",
      fill: "#FFFF33",
      boundsAlignH: "center",
      boundsAlignV: "middle",
      backgroundColor: "#FFFF33"
    };
    this.desserts = this.physics.add.sprite(300, 200, "desserts");
    this.frame = this.add.text(this.desserts.x-50, this.desserts.y-50, "fdf", this.style);
    this.frame.setVisible(true);
    this.frame.setAlpha(.3);
    this.sports = this.physics.add.sprite(600, 200, "sports");
    this.cheerleading = this.physics.add.sprite(900, 200, "cheerleading");

    var hintText: string = "Press space to select your target object or press enter to choose gameplay type";
    this.hint = this.add.text(150, 0, hintText, {
      font: "24px Arial Bold",
      fill: "#fff"
    });
    
    document.addEventListener("keydown", e => {
      if (e.key == " "  || e.key == "Enter" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
        if(e.key == "Enter" || e.key == "ArrowRight"){
          this.onEnter();
        } else {
          this.onSpace();
        }
      }
    });

    document
      .getElementById("left")
      .addEventListener("click", e => this.onSpace());
    document
      .getElementById("right")
      .addEventListener("click", e => this.onEnter());
  }

onEnter(){
  let o = {object: null};
  if(this.desserts.x - 50 == this.frame.x){
    o.object = "desserts";
    this.scene.start("GameplayChoiceScene", o);
    this.scene.stop("ObjectChoiceScene");
  } else if(this.sports.x - 50 == this.frame.x) {
    o.object = "sports";
    this.scene.start("GameplayChoiceScene", o);
    this.scene.stop("ObjectChoiceScene");
  } else if(this.cheerleading.x - 50 == this.frame.x) {
    o.object = "cheerleading";
    this.scene.start("GameplayChoiceScene", o);
    this.scene.stop("ObjectChoiceScene");
  }
}

onSpace(){
  console.log(this.index % 3);
  this.frame.destroy();
  if(this.index % 3 == 0){
    this.frame = this.add.text(this.desserts.x-50, this.desserts.y-50, "fdf", this.style).setAlpha(.3);
    console.log("desserts");
  } else if(this.index % 3 == 1){
    this.frame = this.add.text(this.sports.x-50, this.sports.y-50, "fdf", this.style).setAlpha(.3);
    console.log("sports");
  }  else if(this.index % 3 == 2){
    this.frame = this.add.text(this.cheerleading.x-50, this.cheerleading.y-50, "fdf", this.style).setAlpha(.3);
    console.log("cheer");
  }
  this.index++;
}
}