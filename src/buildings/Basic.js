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

        this.cannonSpeed = 0.3 // degree / ms
    }
    
    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.drawImage(this.spriteSheet, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }
    
    renderCannon(layer) {

        const coords = this.getMiddleCoords()
        layer.translate(coords.x, coords.y)
        layer.rotate(this.cannonAngle * Math.PI / 180)
        layer.drawImage(this.spriteSheet, ...this.spriteCannon.getCurrent())
         
        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        this.bullets.push(new Bullet(this, enemy, this.dammage, this.speed))        
    }
}