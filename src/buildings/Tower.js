import Building from '../Building'
import Bullet from '../Bullet'
import { 
    angle, 
    angleDifference, 
    angleDirection, 
    pointIntersectsCircle 
} from "../utilities"

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

        // Indique si le canon de la tour est aligné avec la cible courante
        this.isAligned = false
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
     * @returns {boolean}
     */
    isInRange(enemy) {
        return pointIntersectsCircle(enemy, this.rangeShapeCoords, this.range)
    }

    /**
     * Tire sur l'enemy selectionné. Doit être implémenté par la classe enfant.
     * @param {Object} enemy 
     */
    shoot() {
        this.timeSinceLastShot = 0
        this.spriteCannon.setNextState('shooting')
    }

    /**
     * Vérifie que toutes les conditions sont remplies pour pouvoir tirer sur la cible courante
     * @returns {boolean} Wether the tower can shoot or not
     */
    canShoot() {

        // On peut tirer si...
        return (this.currentTarget != null // ...on a une cible
            && this.isAligned // ...le canon est aligné
            && this.timeSinceLastShot >= this.fireRate // ...on a assez attendu depuis le tir précédent
        ) ?
        true : false
    }

    /**
     * Trouve une cible parmi les ennemis du niveau
     */
    findTarget() {
        
        // Parcourt les ennemis du niveau
        for (let j = 0; j < this.level.enemies.length; j++) {
            
            const enemy = this.level.enemies[j]
            
            // Si l'ennemi est à portée et pas supprimé 
            if (this.isValidTarget(enemy)) {

                // On met à jour les infos de l'ennemi courant
                this.currentTarget = enemy
                this.currentTargetPosition = enemy.getCoords()
                
                // Pas besoin de parcourir les autres ennemis
                return
            }
        }

        // Aucune cible trouvée
        this.currentTarget = null
        this.currentTargetPosition = null
    }

    /**
     * Vérifie qu'un ennemi est valide
     * @param {Object} Ennemi 
     * @returns {boolean}
     */
    isValidTarget(target) {
        return target !== null // Non null
            && this.isInRange(target) // A portée
            && !target.isDeleted // Pas supprimé
    }

    /**
     * Met à jour la cible courante
     * @param {numeric} diffTimestamp 
     */
    updateTarget(diffTimestamp) {

        // Si plus d'ennemi dans le niveau, il n'y a plus d'ennemi courant
        if (this.level.enemies.length === 0) {
            this.currentTarget = null
            return // Pas besoin de continuer la recherche
        }

        // Si la cible n'est plus valide
        if (!this.isValidTarget(this.currentTarget)) {

            // On supprime la cible courante
            this.currentTarget = null
            this.currentTargetPosition = null

            // on essaye d'en trouver un autre pour le prochain tour
            this.findTarget()
        }
    }

    /**
     * Met à jour l'angle du canon
     * @param {numeric} diffTimestamp 
     */
    updateCannonAngle(diffTimestamp) {
    
        // On contrôle qu'on a une cible
        if (this.currentTarget != null) {
            
            // On récupère les coordonnées de la tour 
            const middleCoords = this.getMiddleCoords()

            // On calcule l'angle de la cible par rapport aux coordonnées de la tour
            this.targetAngle = angle(middleCoords.x, middleCoords.y, this.currentTarget.x, this.currentTarget.y)
            
            // On calcule la différence d'angle entre l'angle du cannon et celui nécessaire pour atteindre la cible 
            // sur une échelle de [0, 180]
            let diff = angleDifference(this.cannonAngle, this.targetAngle)

            // On calcule le sens de rotation optimum pour atteindre la cible
            const dir = angleDirection(this.cannonAngle, this.targetAngle)  
            
            // On peut tirer si la différence d'angle et la vitesse de rotation nous laissent 
            // le temps de nous aligner parfaitement
            if (Math.abs(diff) < this.cannonSpeed * diffTimestamp) {

                // L'angle du canon de vient celui de la cible
                this.cannonAngle = this.targetAngle
                
                // On peut essayer de tirer
                this.isAligned = true
            
            // Sinon on met à jour l'angle du canon...
            } else {

                // ...en fonction du temps écoulé et de la vitesse de rotation
                const newAngle = this.cannonAngle + (dir * this.cannonSpeed * diffTimestamp)
                this.cannonAngle = newAngle

                // On ne peut plus tirer
                this.isAligned = false
            }
        }

        this.spriteCannon.setTimerDiff(diffTimestamp)
 
        this.spriteCannon.setNextState('idle')
    }

    /**
     * Déclenche le tir si possible
     */
    updateShoot(diffTimestamp) {
        
        // On met à jour le timer depuis le dernier tir
        this.timeSinceLastShot += diffTimestamp

        // On tire dès qu'on peut
        if (this.canShoot()) this.shoot(this.currentTarget)
    }

    /**
     * Met à jour les balles tirées par la tour
     * @param {numeric} diffTimestamp 
     */
    updateBullets(diffTimestamp) {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(diffTimestamp)
        }        
    }

    /**
     * Update les data en fonction du temps passé
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {
        
        // On update le building
        super.update()

        // Met à jour la cible
        this.updateTarget(diffTimestamp)

        // Met à jour l'angle du canon
        this.updateCannonAngle(diffTimestamp)
        
        // Essaye de tirer
        this.updateShoot(diffTimestamp)

        // Met à jour les balles
        this.updateBullets(diffTimestamp)
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