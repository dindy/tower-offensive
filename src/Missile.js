import Sprite from './Sprite.js'
import { 
  getDistance, 
  getPositionOnLine, 
  rectangleIntersectsRectangle, 
  getBezierPoint,  
  angle,
  degreesToRadians, 
} from './utilities'

export default class Missile {
    
    constructor(tower, enemy, dammage, speed) {
        
        this.tower = tower
        this.level = tower.level
        this.enemy = enemy
        this.speed = speed
        this.angle = this.tower.cannonAngle
        this.coords = tower.getMiddleCoords()

        this.targetPoint = null
        // this.distance = null
        // this.targetPoint = this.enemy.getCoords()
        
        // this.originPoint = tower.getMiddleCoords()

        // // Distance entre les coordonnées de départ et de destination en px
        // this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 

        // Rapport entre les coordonnées de depart et destination et la range de le tower
        // this.coef = this.distance / tower.range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        // this.timeSpent = 0 


        // this.totalTime = tower.range / this.speed 

        this.dammage = dammage
        this.aoeRadius = 10
        
        this.isInAir = true
        
        this.spriteSheet = document.getElementById(this.level.game.DOMConfig.sprites.towerSeeker)
        
        this.explosionFrames = 6
        this.explosionInterval = 80
        this.timeSinceExplosion = 0

        this.missileSprite = new Sprite(100, 50, {
          idle: { sourceY: 150, nbFrames: 3, interval: 80 },
          exploding: {sourceY: 250, nbFrames: this.explosionFrames, interval: this.explosionInterval }
        })    
        
        this.isDeleted = false
    }

    updatePosition(diffTimestamp) {
        
        const trajectoryProjection = getPositionOnLine(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y, 1)

        // Distance entre les coordonnées de départ et de destination en px
        const distance = getDistance(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y) 

        const totalTime = distance / this.speed // t = 1

        const t = diffTimestamp / totalTime

        this.coords = getBezierPoint(this.coords.x, this.coords.y, trajectoryProjection.x, trajectoryProjection.y, this.targetPoint.x, this.targetPoint.y, t)

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
                console.log("pass")
                this.targetPoint = closerEnemy.getCoords() 
            }

            //Update la target du missile
            this.enemy = closerEnemy
            
        } else {
            this.targetPoint = this.enemy.getCoords()
        }     
    }
    
    update(diffTimestamp) {

        if (this.isInAir) {

            this.updateDestination(diffTimestamp)
            
            if (this.isInAir) this.updatePosition(diffTimestamp)
            
            if (this.isInAir) {
                this.updateAngle(diffTimestamp)
                this.detectCollisions()    
            }

        } else {
            this.timeSinceExplosion += diffTimestamp
            //FIX CHELOU A CHANGER - diffTimestamp pour s'assurer qu'on ne revienne pas sur la 1ere frame de l'animation
            if (this.timeSinceExplosion >= this.explosionFrames * this.explosionInterval - diffTimestamp) this.isDeleted = true
        }
    }

    updateAngle(diffTimestamp) {

          // On calcule l'angle de la cible par rapport aux coordonnées du missile
          const targetAngle = angle(this.coords.x, this.coords.y, this.targetPoint.x, this.targetPoint.y)
          
          this.angle = targetAngle
    }

    render(layer, diffTimestamp) {

        if (this.isInAir) {
          this.missileSprite.setNextState("idle")
          this.missileSprite.setTimerDiff(diffTimestamp)
          layer.translate(this.coords.x, this.coords.y)
          layer.rotate(degreesToRadians(this.angle))
          layer.drawImage(this.spriteSheet, ...this.missileSprite.getCurrent())
          layer.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          if(this.missileSprite.getCurrentStateName() === 'idle') this.missileSprite.setState("exploding")
          
          this.missileSprite.setTimerDiff(diffTimestamp)
          layer.translate(this.coords.x, this.coords.y)
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

      for (let i = 0; i < this.level.enemies.length; i++){

          let enemy = this.level.enemies[i]
          const enemyBoundingBox = enemy.getBoundingBox()
          const bulletBoundingBox = this.getBoundingBox()

          if (rectangleIntersectsRectangle(bulletBoundingBox, enemyBoundingBox)) {
              this.isInAir = false
              enemy.hit(this.dammage)
              return
          }

      }
  }
}