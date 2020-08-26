import Tower from "./Tower"
import Bullet from "../Bullet"
import Sprite from "../Sprite"

export default class Basic extends Tower {

    static price = 4

    constructor(level) {
        
        super(level, 100, 250, 1, 0.5)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)
        
        // Sprite du canon du sniper
        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 50, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 100, nbFrames: 5, interval: 80 }
        })

        this.bulletSpeed = 0.3 
    }

    shoot(enemy) {
        super.shoot(enemy)
        this.bullets.push(new Bullet(this, enemy, this.dammage, this.bulletSpeed))        
    }
}