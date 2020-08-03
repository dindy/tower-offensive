import Tower from "./Tower"
import Bullet from "../Bullet"
import { angle } from "../utilities" 
import Sprite from "../Sprite"

export default class Basic extends Tower {

    constructor(level) {
        super(level, 100, 250, 0, 0.5)
        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)
        this.nbFrames = 2
        this.interval = 125
        this.sprite = new Sprite(100, 50, 50, this.nbFrames, this.interval)

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
        layer.drawImage(this.spriteSheet, ...this.sprite.getCurrent())
         
        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        this.bullets.push(new Bullet(this, enemy, this.dammage, this.speed))        
    }
}