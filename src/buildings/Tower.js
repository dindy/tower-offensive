import Building from '../Building'
import Bullet from '../Bullet'

export default class Tower extends Building {
    
    /**
     * 
     * @param {Instance} level - L'instance en cours de la class Level
     */
    constructor(level, range, fireRate, dammage, speed) {
        
        super(level)

        this.range = range
        this.rangeShape = null
        this.rangeShapeCoords = null
        this.fireRate = fireRate // temps en ms entre chaque tir
        this.dammage = dammage
        this.speed = speed
        this.timeSinceLastShot = Infinity
        this.bullets = []
        this.highlightedRange = false
        this.sprite = level.game.DOMConfig.sprites.towerBasic
    }

    select() {
        super.select()
        this.highlightRange(this.cell.getCenterPoint())
    }
    
    unselect() {
        super.unselect()
        this.removeRangeHighlight()
    }

    /**
     * Rend visible la shape représentant la range de la tour et la center sur coords
     * @param {Object} coords Coordonnées de la cellules
     * @param {Obecjt} layer Canvas layer pour le rendu
     */
    highlightRange(coords) {
        this.rangeShapeCoords = coords
        this.highlightedRange = true        
    }

    /**
     * Cache la shape représentant la range de la tour
     */
    removeRangeHighlight() {
        this.highlightedRange = false
    }

    /**
     * Place le batiment sur la cell
     * @param {Object} cell 
     */
    place(cell) {

        super.place(cell)

        this.removeRangeHighlight()
    }

    /**
     * Check si l'enemy est dans la range de la tower
     * @param {Object} enemy 
     */
    isInRange(enemy) {
        
        const dist_points = (enemy.x - this.rangeShapeCoords.x) * (enemy.x - this.rangeShapeCoords.x) + (enemy.y - this.rangeShapeCoords.y) * (enemy.y - this.rangeShapeCoords.y);
        const r = this.range * this.range
        
        return dist_points < r
    }

    /**
     * Tire sur l'enemy selectionné
     * @param {Object} enemy 
     */
    shoot(enemy) {
        

    }

    tryToShoot(enemy) {
        if (this.timeSinceLastShot >= this.fireRate) {
            this.timeSinceLastShot = 0
            this.shoot(enemy)
        }          
    }

    /**
     * Update les data en fonction du temps passé
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {
        
        super.update()

        const level = this.level
        this.timeSinceLastShot += diffTimestamp

        for (let j = 0; j < level.enemies.length; j++) {
            const enemy = level.enemies[j]
            if (this.isInRange(enemy)) this.tryToShoot(enemy)
        }

        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(diffTimestamp)
        }        
    }

    /**
     * Rendu sur le layer de la tower
     * @param {DOMElement} layer 
     */
    render(layer) {
        super.render(layer)
        this.renderCannon(layer)
    }

    renderCannon(layer) {
        
    }

    /**
     * Rendu des balles tirées par la tower
     * @param {DOMElement} layer 
     */
    renderBullets(layer) {

        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.render(layer)
        } 

        this.bullets = this.bullets.filter(bullet => !bullet.isDeleted) 
    }

    /**
     * Rendu de la zone représenetant la range de la tower
     * @param {DOMElement} layer 
     */
    renderRangeHighlight(layer) {

        if (this.highlightedRange) {
            layer.beginPath()
            layer.arc(this.rangeShapeCoords.x, this.rangeShapeCoords.y, this.range, 0, 2 * Math.PI)
            layer.fillStyle = "rgba(200, 200, 200, 0.5)"
            layer.strokeStyle = "rgba(200, 200, 200, 0.8)"
            layer.fill()
            layer.stroke()

            // Nettoie la zone de la cellule du batiment pour donner l'impression
            // que la forme de la range est en dessous de la tower
            // @todo Dynamically determines the zone
            const coords = this.isPlaced ? 
                this.getTopLeftCoords() :
                { x: this.rangeShapeCoords.x - (50 / 2), y: this.rangeShapeCoords.y - (50 / 2) }
            
            layer.clearRect(coords.x, coords.y, 50, 50)
        }
    }
}