import Phaser from 'phaser';

export default class CreditsScene extends Phaser.Scene {
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('Credits');
    }

    init() {
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    preload(){

    }

    create() {
        const { width } = this.scale;

        this.add.text(width/2, 200, 'Credits', { fontFamily: 'Pixeled', fontSize: 64, color: '#fff' }).setOrigin(0.5, 0);
        this.add.text(width/2, 350, 'Made by: Isonzo', { fontFamily: 'Pixeled', fontSize: 32, color: '#fff' }).setOrigin(0.5, 0);
        this.add.text(width/2, 450, 'Font: Pixeled', { fontFamily: 'Pixeled', fontSize: 32, color: '#fff' }).setOrigin(0.5, 0);

        this.input.keyboard?.on('keydown-SPACE', () => {
            this.scene.start('MainMenu');
        })

        this.input.on('pointerdown', () => {
            this.scene.start('MainMenu');
        })
    }
}
