import Sprite from '../Sprite.js'
import BigExplosion from '../explosions/BigExplosion.js'
import { 
    getPositionOnLine, 
    rectangleIntersectsRectangle, 
    angle,
    degreesToRadians, 
    angleDifference,
    angleDirection,
    getProjectionPoint
} from '../utilities'

export default class Missile {
    
    constructor(tower, enemy, dammage, speed) {
        
        this.tower = tower
        this.level = tower.level
        this.enemy = enemy
        this.speed = speed
        this.angle = this.tower.cannonAngle
        this.coords = tower.getMiddleCoords()
        
        this.targetPoint = null
        
        this.dammage = dammage
        this.aoeRadius = 10
        this.rotationSpeed = 0.1
        
        this.isInAir = true
        
        this.spriteSheet = document.getElementById(this.level.game.DOMConfig.sprites.missilePlaceHolder)

        this.missileSprite = new Sprite(100, 50, {
            idle: { sourceY: 150, nbFrames: 3, interval: 80 },
        })    
        
        this.isDeleted = false
        
        this.timer = 0
        this.targetHasChanged =false
    }
    
    updatePosition(diffTimestamp) {
        
        // Set the current speed (with initial acceleration)
        const getCurrentSpeed = (timer, fullSpeed, delayFullSpeed, minSpeedFactor) => {
            if (timer > delayFullSpeed) return fullSpeed
            const minSpeed = fullSpeed * minSpeedFactor 
            return minSpeed + ((fullSpeed - minSpeed) * timer) / delayFullSpeed 
        }
        this.timer += diffTimestamp
        const delayFullSpeed = 2500
        const minSpeedFactor = 0.5
        const currentSpeed = getCurrentSpeed(this.timer, this.speed, delayFullSpeed, minSpeedFactor)
        const distance = currentSpeed * diffTimestamp
        
        const rotationMax = this.rotationSpeed * diffTimestamp
        
        // On calcule l'angle de la cible par rapport aux coordonnées du missile
        const targetAngle = angle(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y)        
        
        // On calcule la différence d'angle entre l'angle du missile et celui nécessaire pour atteindre la cible 
        // sur une échelle de [0, 180]
        let degreesDifference = angleDifference(this.angle, targetAngle)
        
        // On calcule le sens de rotation optimum pour atteindre la cible
        const direction = angleDirection(this.angle, targetAngle)  
        
        if (degreesDifference > rotationMax) {
            this.angle = this.angle + (rotationMax * direction)
            if(this.angle < 0) this.angle = 360 + (rotationMax * direction)
            if(this.angle > 360) this.angle = this.angle - 360
        }
        else {
            this.angle = targetAngle
        }
        
        const newCoords = getProjectionPoint(distance, this.angle)
        
        this.coords = {
            x: this.coords.x + newCoords.x,
            y: this.coords.y + newCoords.y,
        }
    }
    
    updateDestination(diffTimestamp) {
        
        // Si pas d'ennemi en cours
        if (this.enemy === null || this.enemy.isDeleted) {
            
            const closerEnemy = this.level.getCloserEnemy(this.coords) // {x,y}
            
            // Si il n'y a plus d'enemy sur la map, on explose
            if (closerEnemy === null) {
                
                this.targetPoint = getPositionOnLine(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y, 10)
                
                //Random Explosion
                this.isInAir = Math.random() <= (1/20) ? false : true
                
            } else {
                this.targetPoint = closerEnemy.getMiddlePosition() 
            }
            
            //Update la target du missile
            this.enemy = closerEnemy
            
        } else {
            this.targetHasChanged = false
            this.targetPoint = this.enemy.getMiddlePosition()
        }     
        
        if (this.enemy !== null) this.enemy.isHighlighted = true
    }
    
    update(diffTimestamp) {
        
        if (this.isInAir) {
            
            this.updateDestination(diffTimestamp)
            
            if (this.isInAir) this.updatePosition(diffTimestamp)
            
            if (this.isInAir) this.detectCollisions()                
            
        } else {
            const explosion = new BigExplosion(this.level, this.coords)
            
            this.level.addExplosion(explosion)
            this.isDeleted = true
        }
    }
    
    render(layer, diffTimestamp) {
        
        if (this.isInAir) {
            this.missileSprite.setNextState("idle")
            this.missileSprite.setTimerDiff(diffTimestamp)
            layer.translate(this.coords.x, this.coords.y)
            layer.rotate(degreesToRadians(this.angle))
            layer.drawImage(this.spriteSheet, ...this.missileSprite.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0);
        } 
    }
    
    getBoundingBox() {
        return {
            xMin: this.coords.x - 5,
            xMax: this.coords.x + 5,
            yMin: this.coords.y - 5,
            yMax: this.coords.y + 5,
        }
    }
    
    /**
    * Parcours les enemy et détect si il y a une collision, si True : appelle la methode HIT() de enemy
    */
    detectCollisions() {
        
        if (this.enemy === null) return
        
        if (rectangleIntersectsRectangle(this.enemy.getBoundingBox(), this.getBoundingBox())) {
            this.isInAir = false
            this.enemy.hit(this.dammage)
            return
        }
        //   for (let i = 0; i < this.level.enemies.length; i++){
        
        //       let enemy = this.level.enemies[i]
        //       const enemyBoundingBox = enemy.getBoundingBox()
        //       const bulletBoundingBox = this.getBoundingBox()
        
        //       if (rectangleIntersectsRectangle(bulletBoundingBox, enemyBoundingBox)) {
        //           this.isInAir = false
        //           enemy.hit(this.dammage)
        //           return
        //       }
        
        //   }
    }
}
