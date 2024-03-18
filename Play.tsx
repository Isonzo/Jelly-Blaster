import Phaser from 'phaser';
import Player from './Player';
import Enemy from './Enemy';
import ScoreBoard from './ScoreBoard';
import { GRAVITY } from './Constants';
import eventsCenter from './EventsCenter';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('Play');
    }


    private player!: Player;
    private scoreBoard!: ScoreBoard;
    public bullets!: Phaser.Physics.Arcade.Group;
    private enemies!: Phaser.Physics.Arcade.Group;
    private gameOver: boolean = false;
    private nextSpawnTime: number = 0;
    private timeSinceLastScore: number = 0;
    private firstSpawnPassed: boolean = false;
    private bestScore: number = 0;

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('button', 'assets/button.png');
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('fish', 'assets/fish.png');
        this.load.spritesheet('jelly', 'assets/jelly.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('crab', 'assets/crab.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('shooter', 'assets/shooter.png', { frameWidth: 32, frameHeight: 16});
    }

    create() {
        const { width, height } = this.scale;
        this.add.image(width * 0.5, height * 0.5, 'background').setDisplaySize(width, height);

        this.scoreBoard = new ScoreBoard(this, 0, 0);
    
        this.player = new Player(this, width * 0.07, height * 0.5);

        this.initEvents();

        // Physics
        this.bullets = this.physics.add.group();
        this.enemies = this.physics.add.group();

        this.physics.add.overlap(this.bullets, this.enemies, function(bullet, enemy) {
            if (bullet instanceof Phaser.Physics.Arcade.Image && bullet.body!.velocity.x > 0) {
                (enemy as Enemy).die();
                bullet.destroy();
            }
        })

        this.physics.add.overlap(this.player, this.enemies, function(player, _) {
            (player as Player).die();
        })

        this.physics.add.overlap(this.player, this.bullets, function(player, bullet) {
            (player as Player).die();
            bullet.destroy();
        })

    }

    update( _: number, delta: number) {
        // Apply Gravity to player
        if (!this.gameOver)
            this.player.setVelocityY(this.player.body!.velocity.y + GRAVITY * (delta/1000) );
        else
            return;

        // Every second add score
        if (this.time.now - this.timeSinceLastScore > 1000) {
            this.scoreBoard.score += 1;
            this.scoreBoard.scoreText.setText('Score: ' + this.scoreBoard.score);
            this.timeSinceLastScore = this.time.now;
        }

        if (this.player.body!.velocity.y < 0 && this.player.getData('animationFinished') === 'swim') {
            this.player.anims.play('swim', true);
        } else if (this.player.body!.velocity.y > 0) {
            this.player.anims.play('down', true);
        }

        // Spawn enemies on a timer
        if (this.time.now > this.nextSpawnTime) {
            const elapsedTime = this.time.now - this.time.startTime;
            const spawnRateIncrease = elapsedTime / 6000;
            const minInterval = Math.max(1500 - (100 * spawnRateIncrease), 300);
            const maxInterval = Math.max(3000 - (100 * spawnRateIncrease), 700);
            this.spawnRandomEnemy();
            this.nextSpawnTime = this.time.now + Phaser.Math.Between(minInterval, maxInterval);
        }

    }

    spawnEnemy(spawnHeight: number, type: string) {
        const { width, height } = this.scale;
        if (type === "crab" && this.firstSpawnPassed) {
            const crabHeight = Phaser.Math.RND.pick([32, height - 32]);
            const enemy = new Enemy(this, width * 1.1, crabHeight, type);
            this.enemies.add(enemy);
            enemy.setVelocityX(-380);

            enemy.anims.play('walk', true);

            if (crabHeight === 32) // On the roof!
                enemy.setFlipY(true).refreshBody();
            else
                enemy.setFlipY(false);

            enemy.shoot(); // initial shot to discourage turtling

            if (crabHeight === 32)
                enemy.setPosition(width * 1.1, 64); // Visually, this looks nicer, but I still want the initial shot to happen at y == 32
            return;
        }
        else if (type === 'crab')
        {
            type = 'fish';
        }

        const enemy = new Enemy(this, width * 1.1, spawnHeight, type);
        this.enemies.add(enemy);

        const elapsedTime = this.time.now - this.time.startTime;
        const speedIncreaseRate = elapsedTime / 6000;
        const minSpeed = Math.max(-50 - (10 * speedIncreaseRate), -180);
        const maxSpeed = Math.max(-100 - (10 * speedIncreaseRate), -300);
        enemy.setVelocityX(Phaser.Math.Between(minSpeed, maxSpeed));
        this.firstSpawnPassed = true;
    }

    spawnRandomEnemy() {
        const height = Phaser.Math.Between(64, this.scale.height - 64);

        const type = Phaser.Math.RND.pick(
        ['fish', 'fish', 'fish',
        'shooter', 'shooter',
        'crab']);

        this.spawnEnemy(height, type);
    }

    getScore() {
        return this.scoreBoard.score;
    }

    getBestScore() {
        return this.bestScore;
    }

    // INIT FUNCTIONS
    initEvents() {
        const spacebar = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const enter = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        const inputMessage = document.querySelector('input[type="text"]');

        spacebar.on('down', () => {
            if (document.activeElement !== inputMessage) {
                this.player.jump();
            }
        })
        enter.on('down', () => {
            if (document.activeElement !== inputMessage) {
                const bullet = this.player.shoot();
                if (bullet) {
                    this.bullets.add(bullet);
                    bullet.setVelocityX(400);
                }
            }
            // Fire a bubble
        })

        // Custom Events
        this.events.on('gameOver', () => {
            this.gameOver = true;
            spacebar.enabled = false;
            enter.enabled = false;
            eventsCenter.emit('scoreUpdate', this.scoreBoard.score);

            this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'Game Over\nPress to space to restart')       })

        this.events.on('score', (score: number) => {
            this.scoreBoard.score += score;
            this.scoreBoard.scoreText.setText('Score: ' + this.scoreBoard.score);
        })


        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.gameOver)
            {
                this.scene.start('MainMenu');
                return
            };

            const width = this.scale.width;

            if (pointer.x < width / 2) {
                this.player.jump();
            }else{
                const bullet = this.player.shoot();
                if (bullet) {
                    this.bullets.add(bullet);
                    bullet.setVelocityX(400);
                }
            }

        })
    }
}
