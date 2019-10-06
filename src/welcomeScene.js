import "phaser";
export class WelcomeScene extends Phaser.Scene {
    constructor() {
        super({
            key: "WelcomeScene"
        });
    }
    create() {
        var titleText = "Runner";
        this.title = this.add.text(150, 200, titleText, {
            font: "128px Arial Bold",
            fill: "#FBFBAC"
        });
        var hintText = "Up arrow to start";
        this.hint = this.add.text(300, 350, hintText, {
            font: "24px Arial Bold",
            fill: "#FBFBAC"
        });
        this.input.keyboard.on("keyup_UP", function ( /*pointer*/) {
            this.scene.start("GameScene");
        }, this);
    }
}
