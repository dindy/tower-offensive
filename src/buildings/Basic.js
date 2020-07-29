import Tower from "./Tower"
import Bullet from "../Bullet"
 
export default class Basic extends Tower {

    constructor(level) {
        super(level, 100, 250, 1, 0.5)
    }

    shoot(enemy) {
        if (this.timeSinceLastShot >= this.fireRate) {
            this.timeSinceLastShot = 0
            this.bullets.push(new Bullet(this, enemy, this.dammage, this.speed))
        }        
    }
}