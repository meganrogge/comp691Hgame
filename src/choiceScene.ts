import "phaser";
import { Tweens } from "phaser";

export class ChoiceScene extends Phaser.Scene {
    currentState: string;

    currentBackground: string;
    currentPlayer: string;
    currentCategory: string;
    currentMode: string;

    chosenBackground: string;
    chosenPlayer: string;
    chosenCategory: string;
    chosenMode: string;

    displayPlayer: Phaser.Physics.Arcade.Sprite;
    displayCategory: Phaser.Physics.Arcade.Sprite;
    displayMode: Phaser.GameObjects.Text;

    playerImage: any;
    categoryImage: any;

    backgroundIndex: number;
    playerIndex: number;
    categoryIndex: number;
    modeIndex: number;

    states: string[];

    backgrounds: string[];
    players: string[];
    categories: string[];
    gameModes: string[];

    constructor() {
        super({
            key: "ChoiceScene"
        });
    }

    preload(): void {
        this.load.image("platform", "assets/platform.png");
        this.load.spritesheet("woman", 'assets/sprite_sheets/girl-spritesheet.png', {
            frameWidth: 69,
            frameHeight: 90,
            startFrame: 0,
            endFrame: 11
        });
        this.load.spritesheet("man", 'assets/sprite_sheets/man-spritesheet.png', {
            frameWidth: 62,
            frameHeight: 63,
            startFrame: 0,
            endFrame: 15
        });
        this.load.image("sports", "assets/sports.png");
        this.load.image("desserts", "assets/desserts.png");
        this.load.image("cheerleading", "assets/cheerleading.jpg");
    }

    create(): void {
        this.states = ["ChoosingBackground", "ChoosingPlayer", "ChoosingCategory", "ChoosingMode", "Game"];
        this.backgrounds = ["#ff5733", "#ffbd33", "#dbff33", "#75ff33", "#33ff57", "#33ffbd"];
        this.players = ["woman", "man"];
        this.categories = ["sports", "desserts", "cheerleading"];
        this.gameModes = ["GameNoFailScene", "GameScene", "GameScene2"];

        this.backgroundIndex = 0;
        this.playerIndex = 1;
        this.categoryIndex = 1;
        this.modeIndex = 1;

        this.currentState = this.states[0];
        this.currentBackground = this.backgrounds[this.backgroundIndex];

        document.addEventListener("keydown", e => {
            if (e.key == " " || e.key == "ArrowLeft") {
                this.onSpace();
            } else if (e.key == "Enter" || e.key == "ArrowRight") {
                this.onEnter();
            }
        });

        document
            .getElementById("left")
            .addEventListener("click", e => this.onSpace());
        document
            .getElementById("right")
            .addEventListener("click", e => this.onEnter());
        }

    onEnter() {
        // go to next state, saving chosen value as current value
        switch (this.currentState) {
            case "ChoosingBackground":
                this.chosenBackground = this.currentBackground;
                console.log("set background");
                this.currentState = "ChoosingPlayer";
                this.playerImage = this.createTween(this.players[0], 500);
                this.currentPlayer = this.players[0];
                this.displayPlayer = this.physics.add.sprite(200, +this.game.config.height / 2, this.currentPlayer);
                break;
            case "ChoosingPlayer":
                this.playerImage.destroy();
                this.chosenPlayer = this.currentPlayer;
                this.displayPlayer.setVisible(true);
                console.log("set player");
                this.currentState = "ChoosingCategory";
                this.categoryImage = this.createTween(this.categories[0], 500);
                this.currentCategory = this.categories[0];
                this.displayCategory = this.physics.add.sprite(300, 200, this.currentCategory);
                break;
            case "ChoosingCategory":
                this.categoryImage.destroy();
                this.chosenCategory = this.currentCategory;
                this.displayCategory.setVisible(true);
                console.log("set category");
                this.currentState = "ChoosingMode";
                this.currentMode = this.gameModes[0];
                this.displayMode = this.add.text(300, 0, this.gameModes[0], {
                    fontSize: '5000px',
                    fontFamily: 'Arial',
                    color: '#fff',
                    fixedWidth: 1000,
                    fixedHeight: 5000,
                    align: 'right'
                });
                break;
            case "ChoosingMode":
                this.displayMode.setVisible(true);
                this.chosenMode = this.currentMode;
                this.currentState = "Game";
                console.log("set mode");
                this.scene.start(this.chosenMode, { background: this.chosenBackground, player: this.chosenPlayer, category: this.chosenCategory });
        }
    }

    onSpace() {
        // display next option for the given state, updating corresponding current value
        switch (this.currentState) {
            case "ChoosingBackground":
                this.currentBackground = this.getNextValue();
                console.log(this.currentBackground);
                break;
            case "ChoosingPlayer":
                this.playerImage.destroy();
                this.currentPlayer = this.getNextValue();
                console.log(this.currentPlayer);
                this.playerImage = this.createTween(this.currentPlayer, 500);
                break;
            case "ChoosingCategory":
                this.categoryImage.destroy();
                this.currentCategory = this.getNextValue();
                console.log(this.currentCategory);
                this.categoryImage = this.createTween(this.currentCategory, 500);
                break;
            case "ChoosingMode":
                this.currentMode = this.getNextValue();
                console.log(this.currentMode);
                break;
        }
    }

    update() {
        switch (this.currentState) {
            case "ChoosingBackground":
                this.cameras.main.setBackgroundColor(this.currentBackground);
            case "ChoosingPlayer":
                if (this.displayPlayer != null) {
                    this.displayPlayer.destroy(true);
                }
                this.displayPlayer = this.physics.add.sprite(200, +this.game.config.height / 2, this.currentPlayer);
                this.displayPlayer.setVisible(false);
            case "ChoosingCategory":
                if (this.displayCategory != null) {
                    this.displayCategory.destroy(true);
                }
                this.displayCategory = this.physics.add.sprite(300, 200, this.currentCategory);
                this.displayCategory.setVisible(false);
            case "ChoosingMode":
                    if (this.displayMode != null) {
                        this.displayMode.destroy(true);
                    }
                    this.displayMode = this.add.text(600, 70, this.currentMode);
        }
    }

    createTween(target, x) {
        let image = this.add.image(x, 0, target);
        let tween = this.tweens.add({
            targets: image,
            props: {
                y: { value: 500, duration: 1000, ease: 'Bounce', yoyo: false }
            }
        });
        return image;
    }

    getNextValue() {
        switch (this.currentState) {
            case "ChoosingBackground":
                return this.backgrounds[this.backgroundIndex++ % this.backgrounds.length];
            case "ChoosingPlayer":
                return this.players[this.playerIndex++ % this.players.length];
            case "ChoosingCategory":
                return this.categories[this.categoryIndex++ % this.categories.length];
            case "ChoosingMode":
                return this.gameModes[this.modeIndex++ % this.gameModes.length];
        }
    }
}