import Phaser from 'phaser';
import Bullet from './Bullet';
import PlayScene from './Play';
import {BULLET_SPEED} from './Constants';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    private score: number = 50
    private tex: string;
    private shootingEvent?: Phaser.Time.TimerEvent;
    private sceneref: PlayScene;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);

        this.sceneref = scene as PlayScene;

        this.tex = texture;

        if (texture === 'shooter') {
            this.score = 100;
        } else if (texture === 'crab') {
            this.score = 300;
        }

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setScale(4).refreshBody();
        this.initAnimations();

        this.startShooting();
    }

    private initAnimations() {
        this.anims.create({
            key: 'shoot',
            frames: [
                { key: this.tex, frame: 1 },
                { key: this.tex, frame: 0 }
                ],
            frameRate: 4
        })

        this.anims.create({
            key: 'idle',
            frames: [{ key: this.tex, frame: 0 }],
        })

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(this.tex, { start: 0, end: 1 }),
            frameRate: 12,
            repeat: -1
        })
    }

    private startShooting() {
        if (this.tex === 'shooter') {
            this.shootingEvent = this.scene.time.addEvent({
                delay: Phaser.Math.Between(1000, 3000),
                callback: () => {
                    const bullet = this.shoot();
                    if (bullet) {
                        this.sceneref.bullets.add(bullet);
                        bullet.setVelocityX(-BULLET_SPEED );
                    }

                    this.anims.play('shoot', true)
                },
                loop: true
            })
        }

    }

    public shoot() : Bullet | undefined {
        const bullet = new Bullet(this.scene, this.x - 80, this.y, 'bubble', false);

        return bullet
    }

    public die() {
        this.scene.events.emit('score', this.score);
        if (this.shootingEvent){
            this.shootingEvent.remove();
        }

        this.destroy();
    }
}
