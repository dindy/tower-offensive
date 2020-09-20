import TowerCannon from "./TowerCannon"
import Missile from "../projectiles/Missile"
import Sprite from "../Sprite"

export default class Seeker extends TowerCannon {

    static price = 14

    constructor(level) {
        
        super(level, 500, 2500, 20, 0.2)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerSeeker)

        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 50, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 100, nbFrames: 3, interval: 80 }
        })

        this.bulletSpeed = 0.2 
    }

    shoot(enemy) {

        super.shoot(enemy)
        this.bullets.push(new Missile(this, enemy, this.dammage, this.bulletSpeed))        
    }
}