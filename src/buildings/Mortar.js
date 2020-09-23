import TowerCannon from "./TowerCannon"
import Rocket from "../projectiles/Rocket"
import Sprite from "../Sprite"
import { getDistance } from "../utilities"

export default class Mortar extends TowerCannon {

    static price = 4

    constructor(level) {
        
        super(level, 300, 5000, 10, 0.5)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)
        
        this.minRange = this.range * (3/5)

        // Sprite du canon du sniper
        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 50, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 100, nbFrames: 2, interval: 80 }
        })

        this.delayRotationAfterShot = 600 // ms
    }

    shoot(enemy) {
        super.shoot(enemy)
        this.bullets.push(new Rocket(this, enemy, this.dammage))        
    }

    isInRange(enemy) {
        const coords = this.getMiddleCoords()
        const enemyCoords = enemy.getMiddlePosition()
        return super.isInRange(enemy) && getDistance(enemyCoords.x, enemyCoords.y, coords.x, coords.y) > this.minRange
    }
}