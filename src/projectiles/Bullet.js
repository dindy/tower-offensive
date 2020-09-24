import { getPositionOnLine } from '../utilities'
import SmallExplosion from '../explosions/SmallExplosion'
import Circle from "../abstract/Circle"
import Vector from "../abstract/Vector"

export default class Bullet extends Circle {

    /**
     * @constructor 
     * @param {Object} tower La tour d'où la balle est tirée
     * @param {Object} enemy Cible de la tour
     * @param {Numeric} damage Dommages infligés
     * @param {Numeric} speed Vitesse (px/s)
     */
    constructor(tower, enemy, dammage, speed) {

        // Le point d'origine de la balle est le centre de la tower
        const towerPosition = tower.getMiddleCoords() 
        
        // On crée le circle
        super(towerPosition.x, towerPosition.y, 2)
    
        // On enregistre le point d'origine
        this.originPosition = this.getMiddlePosition() // Vector

        // Raccourci vers level
        this.level = tower.level

        // Coordonnées de l'enemy
        this.targetPosition = enemy.getMiddlePosition() // Vector
        
        // Vitesse de la balle
        this.speed = speed // px/ms
        
        // Dommages causés par la balle
        this.dammage = dammage
        
        // La balle est à supprimer
        this.isDeleted = false

        // La balle est dans les airs
        this.isInAir = true

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = this.originPosition.getDistance(this.targetPosition) 

        // Rapport entre les coordonnées de depart et destination et la range de le tower
        this.coef = this.distance / tower.range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        this.timeSpent = 0 

        // Temps total de l'animation
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
        const lastCoords = getPositionOnLine(this.originPosition.x, this.originPosition.y, this.targetPosition.x, this.targetPosition.y, t)
        
        this.setPosition(Vector.createFrom(lastCoords))
    }

    /**
     * Update les data
     * @param {Number} diffTimestamp 
     */
    update(diffTimestamp) {
        
        // Si la balle est toujours en l'air
        if (this.isInAir) {

            // On update sa position
            this.updateInAir(diffTimestamp)
            
            // On détecte une éventuelle détection
            this.detectCollisions()    
        
        // Sinon on doit forcément exploser (collision enemy ou fin de la range de tower)
        } else {
            
            // Sprite de l'explosion
            const explosion = new SmallExplosion(this.level, this.getMiddlePosition())
            this.level.addExplosion(explosion)

            // La balle peut être supprimée du jeu
            this.isDeleted = true
        }
    }

    /**
     * Met a jour le rendu
     * @param {DOMElement} layer 
     */
    render(layer, diffTimestamp) {

        if (this.isInAir) {
            const coords = this.getMiddlePosition()
            layer.beginPath()
            layer.arc(coords.x, coords.y, this.radius, 0, 2 * Math.PI)
            layer.fillStyle = "black"
            layer.fill()
        }

        super.render(layer, diffTimestamp)
    }

    /**
     * Parcourt les enemies et détecte si il y a une collision, si True : appelle la methode HIT() de enemy
     */
    detectCollisions() {

        for (let i = 0; i < this.level.enemies.length; i++){

            const enemy = this.level.enemies[i]
            const enemyBoundingBox = enemy.getBoundingBox()
            
            if (this.intersectsBox(enemyBoundingBox)) {
                this.isInAir = false
                enemy.hit(this.dammage)
                return                
            }
        }
    }

}