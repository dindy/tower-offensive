import { getDistance, getPositionOnLine, rectangleIntersectsRectangle } from '../utilities'
import SmallExplosion from '../explosions/SmallExplosion'

export default class Bullet {

    /**
     * Constructor 
     * @param {Object} tower La tour d'où les balles sont tirées
     * @param {Object} enemy Cible de la tour
     */
    constructor(tower, enemy, dammage, speed) {

        this.level = tower.level

        // Centre de La tour et point d'origine des balles
        this.originPoint = tower.getMiddleCoords()

        // Coordonnées de l'enemy
        this.targetPoint = enemy.getCoords()
        
        this.speed = speed // px/ms
        
        this.dammage = dammage
        
        this.radius = 2

        this.coords = this.originPoint

        this.previousCoords = this.originPoint

        this.isDeleted = false

        this.isInAir = true

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 

        // Rapport entre les coordonnées de depart et destination et la range de le tower
        this.coef = this.distance / tower.range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        this.timeSpent = 0 

        this.totalTime = tower.range / this.speed 
    }   

    updateInAir(diffTimestamp) {
        
        // Track le temps passé sur le chemin
        this.timeSpent += diffTimestamp
        
        // Rapport entre le temps écoulé et le temps total jusqu'au point de destination 
        // ramené à la range de la tower (donc 1 / this.coef = valeur finale de t)
        let t = (this.timeSpent / this.totalTime) / this.coef

        // Fin du cycle de vie de la balle (donc timeSpent / totalSpent = 1)
        // Donc on n'a pas touché l'ennemi
        if (t * this.coef >= 1) { 
            this.isInAir = false // suppression à la prochaine frame
            t = 1 / this.coef // On met t à sa valeur max
        } 

        // Update les coordonnées de la balle
        const lastCoords = getPositionOnLine(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y, t)
        
        this.coords = lastCoords
    }

    /**
     * Update les data
     * @param {Number} diffTimestamp 
     */
    update(diffTimestamp) {
        
        if (this.isInAir) {

            this.updateInAir(diffTimestamp)
            
            this.detectCollisions()    
            
        } else {
            
            const explosion = new SmallExplosion(this.level, this.coords)
                
            this.level.addExplosion(explosion)

            this.isDeleted = true
        }
    }

    /**
     * Met a jour le rendu
     * @param {DOMElement} layer 
     */
    render(layer, diffTimestamp) {
        if (this.isInAir) {
            layer.beginPath()
            layer.arc(this.coords.x, this.coords.y, this.radius, 0, 2 * Math.PI)
            layer.fillStyle = "black"
            layer.fill()
        }
    }

    getBoundingBox() {
        return {
            xMin: this.coords.x - this.radius,
            xMax: this.coords.x + this.radius,
            yMin: this.coords.y - this.radius,
            yMax: this.coords.y + this.radius,
        }
    }

    /**
     * Parcours les enemy et détect si il y a une collision, si True : appelle la methode HIT() de enemy
     */
    detectCollisions() {

        for (let i = 0; i < this.level.enemies.length; i++){

            let enemy = this.level.enemies[i]
            const enemyBoundingBox = enemy.getBoundingBox()
            const bulletBoundingBox = this.getBoundingBox()

            const isInside = (point, box) => {
                return point.x > box.xMin && point.x < box.xMax && point.y > box.yMin && point.y < box.yMax
            }

            if (rectangleIntersectsRectangle(bulletBoundingBox, enemyBoundingBox) || isInside(this.coords, enemyBoundingBox) ) {
                this.isInAir = false
                enemy.hit(this.dammage)
                return
            }

        }
    }

}