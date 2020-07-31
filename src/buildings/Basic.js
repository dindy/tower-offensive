import Tower from "./Tower"
import Bullet from "../Bullet"
import { angle } from "../utilities" 

export default class Basic extends Tower {

    constructor(level) {
        super(level, 100, 250, 1, 0.5)
        this.sprite = document.getElementById(level.game.DOMConfig.sprites.towerBasic)
    }
    
    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.drawImage(this.sprite, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }
    
    renderCannon(layer) {

        const coords = this.getMiddleCoords()
        layer.translate(coords.x, coords.y)
        layer.rotate(this.cannonAngle * Math.PI / 180)
        if(this.timeSinceLastShot >= 0 && this.timeSinceLastShot <= 32) {
            layer.drawImage(this.sprite, 50, 100, 50, 50, 0 - 25, 0 - 25, 50, 50)

        } else {
            layer.drawImage(this.sprite, 0, 100, 50, 50, 0 - 25, 0 - 25, 50, 50)
        }
         
        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        this.bullets.push(new Bullet(this, enemy, this.dammage, this.speed))        
    }
}