import Tower from "./Tower"
import Missile from "../Missile"
import Sprite from "../Sprite"

export default class Seeker extends Tower {

    static price = 14

    constructor(level) {
        
        super(level, 500, 2500, 20, 0.2)

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerSeeker)

        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 200, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 200, nbFrames: 3, interval: 80 }
        })

        this.bulletSpeed = 0.2 
    }
    
    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.drawImage(this.spriteSheet, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }

    shoot(enemy) {

        super.shoot(enemy)
        //console.log("bullets")
        this.bullets.push(new Missile(this, enemy, this.dammage, this.bulletSpeed))        
    }
}