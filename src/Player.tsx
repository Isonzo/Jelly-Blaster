import Phaser from 'phaser';
import Bullet from './Bullet';
import { PLAYER_SHOOT_INTERVAL, PLAYER_JUMP_POWER } from './Constants';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private lastShot: number = 0
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'jelly');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(4).refreshBody();
        this.setCollideWorldBounds(true);
        
        this.initAnimations();
    }

    private initAnimations() {
        this.anims.create({
            key: 'swim',
            frames: this.anims.generateFrameNumbers('jelly', { start: 0, end: 1 }),
            frameRate: 6
        })

        this.anims.create({
            key: 'down',
            frames: [{ key: 'jelly', frame: 1 }],
        })

        this.anims.create({
            key: 'death',
            frames: [{ key: 'jelly', frame: 2 }],
        })
    }

    public shoot() : Bullet | undefined {
        const time = this.scene.time.now;
        if (time - this.lastShot > PLAYER_SHOOT_INTERVAL) {
            const bullet = new Bullet(this.scene, this.x + 34, this.y, 'bubble', true);
            this.lastShot = time;

            return bullet;
        }
    }

    public jump() {
        this.anims.play('swim', true);
        this.setVelocityY(PLAYER_JUMP_POWER);
    }

    public die() {
        this.setVelocityY(200);
        this.scene.events.emit('gameOver');
        this.anims.play('death');
        this.setCollideWorldBounds(false);
        this.scene.time.delayedCall(5000, () => this.destroy());
    }
}
