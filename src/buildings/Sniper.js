import Tower from "./Tower"

export default class Sniper extends Tower {

    constructor(level) {
        
        super(level, 250, 1500, 5, 1)
        
        this.currentEnemyPosition = null

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
        if(this.timeSinceLastShot >= 0 && this.timeSinceLastShot <= 64) {
            layer.drawImage(this.sprite, 100, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)

        } else if (this.timeSinceLastShot >= 65 && this.timeSinceLastShot <= 128){
            layer.drawImage(this.sprite, 200, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)
        }else if (this.timeSinceLastShot >= 128 && this.timeSinceLastShot <= 192){
            layer.drawImage(this.sprite, 300, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)
        }else if (this.timeSinceLastShot >= 193 && this.timeSinceLastShot <= 256){
            layer.drawImage(this.sprite, 400, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)
        }
        else {
            layer.drawImage(this.sprite, 0, 50, 100, 50, 0 - 25, 0 - 25, 100, 50)
        }
         
        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    shoot(enemy) {
        if (Math.floor(Math.random() * 10) + 1 == 5) return false 
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
    }

    getOpacity(){
        const opacity = 1 - (this.timeSinceLastShot / 100)
        return opacity < 0 ? 0 : opacity
    }
}