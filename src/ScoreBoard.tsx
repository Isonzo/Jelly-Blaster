import Phaser from 'phaser';

export default class ScoreBoard extends Phaser.GameObjects.Image {
    public score: number = 0
    public scoreText!: Phaser.GameObjects.Text;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'button');

        scene.add.existing(this);

        this.setDisplaySize(200, 40);

        this.setOrigin(0, 0);

        this.scoreText = scene.add.text(x + 15, y, 'Score: 0', { fontFamily: 'Pixeled', color: '#000' })
        this.scoreText.setOrigin(0, 0);
    }
}
