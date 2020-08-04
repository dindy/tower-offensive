import Tower from "./Tower"
import Sprite from "../Sprite"
import SpriteNew from "../SpriteNew"

export default class Sniper extends Tower {

    constructor(level) {
        
        super(level, 250, 1500, 5, 1)
        
        this.currentEnemyPosition = null

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)

        this.nbFrames = 5
        this.interval = 150
        this.sprite = new SpriteNew(50, 100, 50, this.nbFrames, this.interval)

        this.explosionFrames = 6
        this.explosionInterval = 64
        this.explosionSprite = new Sprite(250, 50, 50, this.explosionFrames, this.explosionInterval)


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

        layer.drawImage(this.spriteSheet, ...this.sprite.getCurrent())

        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        // if (Math.floor(Math.random() * 10) + 1 == 5) return false 
        const enemyPosition = enemy.getCoords()
        this.explosionPosition = { x: enemyPosition.x, y: enemyPosition.y}
        enemy.hit(this.dammage)  
    }

    renderBullets(layer) {

        if (this.currentTarget === null) return

        const enemyPosition = this.currentTarget.getCoords() // { x: this.currentTarget.x, y: this.currentTarget.y }
        const towerPosition = this.getMiddleCoords()

        layer.beginPath()
        layer.moveTo(towerPosition.x, towerPosition.y)
        layer.lineTo(enemyPosition.x, enemyPosition.y)
        const opacity = this.getOpacity()
        layer.strokeStyle = `rgba(255, 255, 255, ${ opacity }`
        layer.stroke()
        
        // Render explosion
        if (this.timeSinceLastShot < this.explosionFrames * this.explosionInterval) {
            this.explosionSprite.setTimer(this.timeSinceLastShot, 25)
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