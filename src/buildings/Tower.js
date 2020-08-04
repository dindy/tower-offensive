import Building from '../Building'
import Bullet from '../Bullet'
import { angle } from "../utilities"
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
        this.currentTarget = null
        this.spriteSheet = level.game.DOMConfig.sprites.towerBasic
        this.cannonAngle = 0
        this.targetAngle = null
        // Overriden by each tower subclass
        this.sprite = null
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
            this.spriteCannon.setNextState('shooting')
        } else {
            
        }        
    }

    findTarget() {
        for (let j = 0; j < this.level.enemies.length; j++) {
            const enemy = this.level.enemies[j]
            if (this.isInRange(enemy)) {
                this.currentTarget = enemy
                return
            }
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

        // Si plus d'ennemi dans le niveau, il n'y a plus d'ennemi courant
        if (this.level.enemies.length === 0) this.currentTarget = null

        // Si pas d'ennmi courant on essaye d'en trouver un
        if(this.currentTarget === null) {
            this.findTarget()
        // Sinon 
        } else {
            
            // On contrôle que l'ennmi est toujours à portée
            if (this.isInRange(this.currentTarget) && !this.currentTarget.isDeleted) {
                
                /* On met à jour l'angle du canon par rapport à l'ennemi */
                
                const middleCoords = this.getMiddleCoords()
                this.targetAngle = angle(middleCoords.x, middleCoords.y, this.currentTarget.x, this.currentTarget.y)
                
                // Différence d'angle (soit en horaire soit en anti-horaire de [0, 180])
                let diff = 180 - Math.abs(Math.abs(this.cannonAngle - this.targetAngle) - 180)

                // Direction la plus courte (horaire: 1, anti-horaire: -1) 
                const dir = (((this.targetAngle - this.cannonAngle + 360) % 360 < 180)) ? 1 : -1  
                
                // Nouvel angle
                const newAngle = this.cannonAngle + (dir * this.cannonSpeed * diffTimestamp)

                // On peut tirer si la différence nous permet de nous aligner correctement
                if (Math.abs(diff) < this.cannonSpeed * diffTimestamp) {
                    // On met à jour l'angle
                    this.cannonAngle = this.targetAngle
                    // On peut essayer de tirer
                    this.tryToShoot(this.currentTarget)
                } else {
                    this.cannonAngle = newAngle
                }
            } else {
                this.currentTarget = null
            }
        }

        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(diffTimestamp)
        }        

        this.spriteCannon.setTimerDiff(diffTimestamp)
 
        this.spriteCannon.setNextState('idle')
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