import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private buttons: Phaser.GameObjects.Image[] = [];
    private selectedButtonIndex: number = 0;

    private buttonSelector!: Phaser.GameObjects.Image;

    constructor() {
        super('MainMenu');
    }

    init() {
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    preload() {
        this.load.image('button', 'assets/button.png');
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('background', 'assets/bg.png');
    }

    create() {
        const { width, height } = this.scale;

        // Title
        this.add.text(width * 0.5, height * 0.2, 'Octopus', { fontFamily: 'Pixeled', color: '#000', fontSize: 64 }).setOrigin(0.5);

        this.add.image(width * 0.5, height * 0.5, 'background').setDisplaySize(width, height);

        // Play button
        const playButton = this.add.image(width * 0.5, height * 0.6, 'button').setDisplaySize(200, 100);
        this.add.text(playButton.x, playButton.y, 'Play', { fontFamily: 'Pixeled', color: '#000'}).setOrigin(0.5);
        this.buttons.push(playButton);

        // Test Button
        const testButton = this.add.image(width * 0.5, height * 0.8, 'button').setDisplaySize(160, 80);
        this.add.text(testButton.x, testButton.y, 'Credits', { fontFamily: 'Pixeled', color: '#000'}).setOrigin(0.5);
        this.buttons.push(testButton);

        this.buttonSelector = this.add.image(0, 0, 'bubble').setScale(2);

        this.selectButton(0);

        // Listen for button presses
        playButton.on('selected', () => {
            this.scene.start('Play');
        });

        testButton.on('selected', () => {
            this.scene.start('Credits');
        })
        playButton.setInteractive();
        testButton.setInteractive();

        this.buttons.forEach((button, index) => {
            button.on('pointerdown', () => {
                this.confirmSelection();
            })
            button.on('pointerover', () => {
                this.selectButton(index);})
        })
    }

    selectButton(index: number) {
        const button = this.buttons[index];

        this.buttonSelector.x = button.x * 0.7;
        this.buttonSelector.y = button.y;

        this.selectedButtonIndex = index;
    }

    selectNextButton(change = 1) {
        let index = this.selectedButtonIndex + change;

        if (index < 0) {
            index = this.buttons.length - 1;
        }
        else if (index >= this.buttons.length) {
            index = 0;
        }

        this.selectButton(index);
    }

    confirmSelection() {
        const button = this.buttons[this.selectedButtonIndex];

        button.emit('selected');
    }

    update() {
        const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
        const DownPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
        const SpacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

        const inputMessage = document.querySelector('input[type="text"]');

        if (upPressed) {
            if (document.activeElement !== inputMessage) {
            this.selectNextButton(-1);
            }
        }

        if (DownPressed) {
            if (document.activeElement !== inputMessage) {
            this.selectNextButton(1);
            }
        }

        if (SpacePressed) {
            if (document.activeElement !== inputMessage) {
            this.confirmSelection();
            }
        }
        
    }
}
