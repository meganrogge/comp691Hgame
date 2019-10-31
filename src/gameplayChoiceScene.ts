import "phaser";

export class GameplayChoiceScene extends Phaser.Scene {
  title: Phaser.GameObjects.Text;
  hint: Phaser.GameObjects.Text;
  noFailButton: Phaser.GameObjects.Text;
  choiceButton: Phaser.GameObjects.Text;
  index: number;
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
    this.index = 0;

    document.addEventListener("keydown", e => {
      if (e.key == " "  || e.key == "Enter" || e.key == "ArrowLeft" || e.key == "ArrowRight") {
        if(e.key == "Enter" || e.key == "ArrowRight"){
          this.onEnter(data);
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
      .addEventListener("click", e => this.onEnter(data));
  }

  onEnter(data){
    if(this.index % 2 == 0){
      // no fail game selected
      if(!this.scene.isActive("GameNoFailScene")){
        this.scene.start("GameNoFailScene", data);
      }
      this.scene.stop("GameplayChoiceScene");
      this.scene.stop("ObjectChoiceScene");
      console.log(this.scene.manager.getScenes(true));
    } else {
      // choice game selected
      if(!this.scene.isActive("GameScene")){
       this.scene.start("GameScene", data); 
      }
      this.scene.stop("GameplayChoiceScene");
      this.scene.stop("ObjectChoiceScene");
      console.log(this.scene.manager.getScenes(true));  
  }
  }
  
  onSpace(){
    console.log(this.index % 3);
    if(this.index % 2 == 0){
      this.noFailButton.setBackgroundColor("#fff");
      this.choiceButton.setBackgroundColor("#FFFF33");
    } else {
      this.choiceButton.setBackgroundColor("#fff");
      this.noFailButton.setBackgroundColor("#FFFF33");
    }
    this.index++;
  }
}
