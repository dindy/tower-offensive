import Tower from "./Tower"
import Sprite from "../Sprite"

export default class Sniper extends Tower {

    constructor(level) {
        
        super(level, 250, 1500, 5, 1)
        
        this.currentTargetPosition = null

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)

        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 50, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 50, nbFrames: 6, interval: 80 }
        })

        this.explosionFrames = 6
        this.explosionInterval = 64
        this.explosionSprite = new Sprite(100, 50, {
            exploding: {sourceY: 250, nbFrames: 6, interval: 80 }
        })


        this.cannonSpeed = 0.1 // degree / ms

        this.explosionPosition = null
    }

    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.drawImage(this.spriteSheet, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }
    
    renderCannon(layer) {
        
        const coords = this.getMiddleCoords()
        layer.translate(coords.x, coords.y)
        layer.rotate(this.cannonAngle * Math.PI / 180) // takes radians

        layer.drawImage(this.spriteSheet, ...this.spriteCannon.getCurrent())

        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        super.shoot()
        const enemyPosition = enemy.getCoords()
        this.currentTargetPosition = enemyPosition
        this.explosionPosition = { x: enemyPosition.x, y: enemyPosition.y}
        enemy.hit(this.dammage)  
    }

    renderBullets(layer) {

        if (this.currentTarget === null) return

        const enemyPosition = this.currentTarget.getCoords() // { x: this.currentTarget.x, y: this.currentTarget.y }
        const towerPosition = this.getMiddleCoords()

        layer.beginPath()
        layer.moveTo(towerPosition.x, towerPosition.y)
        layer.lineTo(this.currentTargetPosition.x, this.currentTargetPosition.y)
        const opacity = this.getOpacity()
        layer.strokeStyle = `rgba(255, 255, 255, ${ opacity }`
        layer.stroke()
        
        // Render explosion
        if (this.timeSinceLastShot < this.explosionFrames * this.explosionInterval) {
            this.explosionSprite.setNextState('exploding')
            this.explosionSprite.setTimer(this.timeSinceLastShot)
            layer.translate(this.explosionPosition.x, this.explosionPosition.y)
            layer.drawImage(this.spriteSheet, ...this.explosionSprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);
        } 

    }

    getOpacity(){
        const opacity = 1 - (this.timeSinceLastShot / 100)
        return opacity < 0 ? 0 : opacity
    }
}