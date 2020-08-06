import Tower from "./Tower"
import Bullet from "../Bullet"
import Sprite from "../Sprite"

export default class Basic extends Tower {

    constructor(level) {
        
        super(level, 100, 250, 1, 0.5)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)

        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 100, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 100, nbFrames: 3, interval: 80 }
        })

        this.bulletSpeed = 0.3 
    }
    
    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.drawImage(this.spriteSheet, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }

    shoot(enemy) {
        super.shoot(enemy)
        this.bullets.push(new Bullet(this, enemy, this.dammage, this.bulletSpeed))        
    }
}