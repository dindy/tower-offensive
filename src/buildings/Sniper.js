import Tower from "./Tower"

export default class Sniper extends Tower {

    constructor(level) {
        
        super(level, 250, 1500, 15, 1)
        
        this.currentEnemyPosition = null
    }

    shoot(enemy) {
        if (Math.floor(Math.random() * 10) + 1 == 5) return false 
        enemy.hit(this.dammage)
        this.currentEnemyPosition = enemy.getCoords()    
    }

    renderBullets(layer) {
        const enemyPosition = this.currentEnemyPosition
        const towerPosition = this.getMiddleCoords()
        layer.beginPath()
        layer.moveTo(towerPosition.x, towerPosition.y)
        layer.lineTo(enemyPosition.x, enemyPosition.y)
        const opacity = this.getOpacity()
        layer.strokeStyle = `rgba(255, 255, 255, ${ opacity }`
        layer.stroke()
    }

    getOpacity(){
        const opacity = 1 - (this.timeSinceLastShot / 100)
        return opacity < 0 ? 0 : opacity
    }
}