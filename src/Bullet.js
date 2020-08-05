import { getDistance, getPositionOnLine, lineIntersectsRectangle } from './utilities'
import SpriteNew from "./Sprite"

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
        
        this.speed = speed // ps/ms
        
        this.dammage = dammage

        this.shape = null
        
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

        this.spriteSheet = document.getElementById(this.level.game.DOMConfig.sprites.towerBasic)
        this.explosionFrames = 3
        this.explosionInterval = 80
        this.explosionSprite = new SpriteNew (100, 50, {
            exploding: { sourceY: 300, nbFrames: 3, interval: 120 }
        })
        this.timeSinceExplosion = 0
    }

    /**
     * Update les data
     * @param {Number} diffTimestamp 
     */
    update(diffTimestamp) {
        
        if (this.isInAir) {

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
    
            // Stock les coordonnées précédentes
            this.previousCoords = this.coords
    
            // Update les coordonnées de la balle
            this.coords = getPositionOnLine(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y, t)
            
            this.detectCollisions()
        
        } else {
        
            this.timeSinceExplosion += diffTimestamp
            if (this.timeSinceExplosion > this.explosionFrames * this.explosionInterval) this.isDeleted = true
        }
    }

    /**
     * Met a jour le rendu
     * @param {DOMElement} layer 
     */
    render(layer) {

        if (this.isInAir) {
            layer.beginPath()
            layer.arc(this.coords.x, this.coords.y, 2, 0, 2 * Math.PI)
            layer.fillStyle = "black"
            layer.fill()
        } else {
            this.explosionSprite.setNextState("exploding")
            this.explosionSprite.setTimer(this.timeSinceExplosion)
            layer.translate(this.coords.x, this.coords.y)
            layer.drawImage(this.spriteSheet, ...this.explosionSprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);
        }
    }

    /**
     * Parcours les enemy et détect si il y a une collision, si True : appelle la methode HIT() de enemy
     */
    detectCollisions() {

        for (let i = 0; i < this.level.enemies.length; i++){
            let enemy = this.level.enemies[i]
            let line = [ this.coords, this.previousCoords ]

            if (lineIntersectsRectangle(line, enemy.getBoundingBox())) {
                this.isInAir = false
                enemy.hit(this.dammage)
            }
        }
    }

}