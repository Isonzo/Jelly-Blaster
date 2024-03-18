import Phaser from 'phaser'
import { BULLET_LIFETIME, BULLET_SPEED } from './Constants';

class Bullet extends Phaser.Physics.Arcade.Image {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, right: boolean) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.world.enable(this)
        this.body!.velocity.x = right ? BULLET_SPEED : -BULLET_SPEED

        scene.time.delayedCall(BULLET_LIFETIME, () => {
            this.destroy()
        })
    }


}
export default Bullet
