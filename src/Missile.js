import Sprite from './Sprite.js'
import { getDistance, getPositionOnLine, rectangleIntersectsRectangle } from './utilities'

export default class Missile {
    
    constructor(tower, enemy, dammage, speed) {
        
        this.level = tower.level
        this.enemy = enemy

        this.coords = tower.getMiddleCoords()

        this.targetPoint = this.enemy.getCoords()
        
        this.originPoint = tower.getMiddleCoords()

        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 

        // Rapport entre les coordonnées de depart et destination et la range de le tower
        this.coef = this.distance / tower.range

        // Temps ecoulé depuis le debut de l'animation , ajouter timestamp a chaque update
        this.timeSpent = 0 

        this.speed = speed

        this.totalTime = tower.range / this.speed 

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

    updateInAir(diffTimestamp) {
        this.originPoint = this.coords
        this.targetPoint = this.enemy.getCoords()
        
        // Distance entre les coordonnées de départ et de destination en px
        this.distance = getDistance(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y) 
        
        let totalTime = this.distance / this.speed // t = 1

        let t = diffTimestamp / totalTime

        this.coords = getPositionOnLine(this.originPoint.x, this.originPoint.y, this.targetPoint.x, this.targetPoint.y, t)

  }

    update(diffTimestamp) {
      if (this.isInAir) {

        this.updateInAir(diffTimestamp)
        
        this.detectCollisions()    
        
      } else {
        //FIX CHELOU A CHANGER
        this.timeSinceExplosion += diffTimestamp
        if (this.timeSinceExplosion >= this.explosionFrames * this.explosionInterval - diffTimestamp) this.isDeleted = true
      }
    }

    render(layer, diffTimestamp) {

        if (this.isInAir) {
          this.missileSprite.setNextState("idle")
          this.missileSprite.setTimerDiff(diffTimestamp)
          layer.translate(this.coords.x, this.coords.y)
          layer.drawImage(this.spriteSheet, ...this.missileSprite.getCurrent())
          layer.setTransform(1, 0, 0, 1, 0, 0);
        } else {
          if(this.missileSprite.getCurrentStateName() === 'idle') this.missileSprite.setState("exploding")
          
          this.missileSprite.setTimerDiff(diffTimestamp)
          layer.translate(this.coords.x, this.coords.y)
          layer.drawImage(this.spriteSheet, ...this.missileSprite.getCurrent())
          layer.setTransform(1, 0, 0, 1, 0, 0);
          console.log(this.missileSprite.currentFrame, this.isDeleted)
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