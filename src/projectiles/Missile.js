import Rectangle from '../abstract/Rectangle'
import Vector from '../abstract/Vector'
import Sprite from '../Sprite.js'
import BigExplosion from '../explosions/BigExplosion.js'
import { 
    getPositionOnLine, 
    degreesToRadians, 
    angleDifference,
    angleDirection,
    radiansToDegrees,
    normalizeDegreesAngle
} from '../utilities'

export default class Missile extends Rectangle {
    
    static width = 10
    
    static height = 10

    /**
     * @constructor 
     * @param {Object} tower La tour d'où le missile est tiré
     * @param {Object} enemy Cible initiale du missile
     * @param {Numeric} damage Dommages infligés
     * @param {Numeric} speed Vitesse (px/s)
     */    
    constructor(tower, enemy, dammage, speed) {
        
        // Position initiale du missile
        const towerPosition = tower.getMiddleCoords()
        
        // On instancie le Rectangle du Missile en passant les coordonnées top-left
        const width = Missile.width 
        const height = Missile.height 
        const x = towerPosition.x - width / 2
        const y = towerPosition.y - height / 2
        super(x, y, width, height)

        this.level = tower.level
        this.enemy = enemy
        this.speed = speed
        this.angle = tower.cannonAngle
        this.dammage = dammage
        this.aoeRadius = 10
        this.rotationSpeed = 0.1
        this.targetPoint = null // Vector 

        this.isInAir = true
        this.isDeleted = false
        this.timer = 0

        this.spriteSheet = document.getElementById(this.level.game.DOMConfig.sprites.missilePlaceHolder)
        this.missileSprite = new Sprite(100, 50, {
            idle: { sourceY: 150, nbFrames: 3, interval: 80 },
        })    
    }
    
    updatePosition(diffTimestamp) {
        
        // Returns the current speed (with initial acceleration)
        const getCurrentSpeed = (timer, fullSpeed, delayFullSpeed, minSpeedFactor) => {
            if (timer > delayFullSpeed) return fullSpeed
            const minSpeed = fullSpeed * minSpeedFactor 
            return minSpeed + ((fullSpeed - minSpeed) * timer) / delayFullSpeed 
        }

        // Update timer
        this.timer += diffTimestamp

        // Détermine la vitesse actuelle
        const delayFullSpeed = 2500
        const minSpeedFactor = 0.5
        const currentSpeed = getCurrentSpeed(this.timer, this.speed, delayFullSpeed, minSpeedFactor)
        
        // Détermine la distance parcourue en fonction de la vitesse
        const distance = currentSpeed * diffTimestamp
        
        // On calcule l'angle de la cible par rapport aux coordonnées du missile
        const radiansTargetAngle = this
            .getMiddlePosition()
            .getAngle(this.targetPoint)

        const targetAngle = radiansToDegrees(radiansTargetAngle)  
        
        // On calcule la différence d'angle entre l'angle du missile et celui nécessaire pour atteindre la cible 
        // sur une échelle de [0, 180]
        let degreesDifference = angleDifference(this.angle, targetAngle)
        
        // On calcule le sens de rotation optimum pour atteindre la cible
        const direction = angleDirection(this.angle, targetAngle)  
        
        // On tourne du maximum possible 
        const rotationMax = this.rotationSpeed * diffTimestamp
        if (degreesDifference > rotationMax) {
            this.angle = normalizeDegreesAngle(this.angle + (rotationMax * direction))
        } else {
            this.angle = targetAngle
        }

        // On déplace le missile
        this.addToPosition(Vector.addPolarCoordinates(distance, degreesToRadians(this.angle)))
    }
    
    updateDestination(diffTimestamp) {
        
        const currentMiddlePosition = this.getMiddlePosition()

        // Si pas d'ennemi en cours
        if (this.enemy === null || this.enemy.isDeleted) {
            
            const closerEnemy = this.level.getCloserEnemy(currentMiddlePosition) // {x,y}
            
            // Si il n'y a plus d'enemy sur la map, on explose
            if (closerEnemy === null) {
                
                // On continue sur la direction actuelle
                const currentPosition = currentMiddlePosition
                const newPosition = getPositionOnLine(currentPosition.x, currentPosition.y, this.targetPoint.x, this.targetPoint.y, 10)
                
                // On met à jour target point
                this.targetPoint = Vector.createFrom(newPosition)
                
                // On explose aléatoirement
                this.isInAir = Math.random() <= (1/20) ? false : true
            
            // Sinon on met à jour target point avec la position de l'enemy
            } else {

                this.targetPoint = closerEnemy.getMiddlePosition() 
            }
            
            // Update la référence à l'enemy (possiblement null)
            this.enemy = closerEnemy
        
        // Sinon on met à jour target point avec l'enemy actuel
        } else {

            this.targetPoint = this.enemy.getMiddlePosition()
        }     
        
    }
    
    update(diffTimestamp) {
        
        if (this.isInAir) {
            
            this.updateDestination(diffTimestamp)
            
            if (this.isInAir) this.updatePosition(diffTimestamp)
            
            if (this.isInAir) this.detectCollisions()                
            
        } else {
            const explosion = new BigExplosion(this.level, this.getMiddlePosition())
            
            this.level.addExplosion(explosion)
            this.isDeleted = true
        }
    }
    
    render(layer, diffTimestamp) {
        
        if (this.isInAir) {

            // Debug target point
            if (this.targetPoint !== null) {
                layer.beginPath()
                layer.arc(this.targetPoint.x, this.targetPoint.y,5,0,2*Math.PI)
                layer.strokeStyle = "blue" 
                layer.lineWidth = 1 
                layer.fillStyle = "orange" 
                layer.fill()    
                layer.stroke()    
            }

            const position = this.getMiddlePosition()
            
            this.missileSprite.setNextState("idle")
            this.missileSprite.setTimerDiff(diffTimestamp)
            
            layer.translate(position.x, position.y)
            layer.rotate(degreesToRadians(this.angle))
            layer.drawImage(this.spriteSheet, ...this.missileSprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);
        } 

        super.render(layer)
    }
    
    /**
    * Parcourt les enemies et détecte si il y a une collision, si True : appelle la methode HIT() de enemy
    */
    detectCollisions() {
        
        if (this.enemy === null) return
        
        const enemyBoundingBox = this.enemy.getBoundingBox()
        
        if (this.intersectsBox(enemyBoundingBox)) {
            this.isInAir = false
            this.enemy.hit(this.dammage)
        }
    }
}
