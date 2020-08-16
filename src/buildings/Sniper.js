import Tower from "./Tower"
import Sprite from "../Sprite"

export default class Sniper extends Tower {
    
    static price = 10

    constructor(level) {
        
        // Etend Building / Tower 
        super(level, 250, 1500, 5, .09)

        // Spritesheet du sniper
        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerBasic)

        // Sprite du canon du sniper
        this.spriteCannon = new Sprite(100, 50, { 
            idle: { sourceY: 50, nbFrames: 1, interval: 0 },
            shooting: { sourceY: 50, nbFrames: 6, interval: 80 }
        })

        // Explosion spécifique au sniper (pas de bullet créée)
        this.explosionFrames = 6
        this.explosionInterval = 64
        this.explosionSprite = new Sprite(100, 50, {
            exploding: {sourceY: 250, nbFrames: 6, interval: 80 }
        })
        this.explosionPosition = null

        // Garde en mémoire les positions de l'ennemi lors du tir afin d'éviter 
        // que la ligne du tir ne change de destination pendant son animation.
        this.lastShotTargetPosition = null

        // Délai entre le shoot et le début de l'animation de la ligne de la balle 
        // et l'explosion (spécifique au sniper)
        this.animationDelay = 16 // ms

        // Empeche la rotation pendant un certain temps après avoir tiré
        this.delayRotationAfterShot = 600 // ms
    }

    renderBuilding(layer) {
        
        const coords = this.getTopLeftCoords()
        
        layer.drawImage(this.spriteSheet, 0, 0, 50, 50, coords.x, coords.y, 50, 50)
    }
    
    shoot(enemy) {

        super.shoot()

        const enemyPosition = enemy.getCoords()

        this.lastShotTargetPosition = enemyPosition
        this.explosionPosition = { x: enemyPosition.x, y: enemyPosition.y }

        enemy.hit(this.dammage)  
    }

    renderBullets(layer, diffTimestamp) {

        // Si pas de cible visée, il n'y a rien à animer
        if (this.lastShotTargetPosition === null) return

        if (this.timeSinceLastShot > this.animationDelay) {

            const towerPosition = this.getMiddleCoords()
    
            // On trace une ligne entre la tour et l'ennemi visé
            layer.beginPath()
            layer.moveTo(towerPosition.x, towerPosition.y)
            layer.lineTo(this.lastShotTargetPosition.x, this.lastShotTargetPosition.y)

            // On change l'opacité de la ligne pour qu'elle disparaisse
            const opacity = this.getOpacity()
            layer.strokeStyle = `rgba(255, 255, 255, ${ opacity }`
            layer.stroke()
            
            // Render explosion
            if (this.getTimeSinceAnimationBeginning() < this.getTotalAnimationTime()) {
                this.renderExplosion(layer)
            }   
        }
    }

    getTimeSinceAnimationBeginning() {
        return this.timeSinceLastShot - this.animationDelay
    }

    getTotalAnimationTime() {
        return this.explosionFrames * this.explosionInterval
    }

    renderExplosion(layer) {
        this.explosionSprite.setNextState('exploding')
        this.explosionSprite.setTimer(this.getTimeSinceAnimationBeginning())
        layer.translate(this.explosionPosition.x, this.explosionPosition.y)
        layer.drawImage(this.spriteSheet, ...this.explosionSprite.getCurrent())
        layer.setTransform(1, 0, 0, 1, 0, 0);
    }

    getOpacity(){
        const opacity = 1 - (this.getTimeSinceAnimationBeginning() / 100)
        return opacity < 0 ? 0 : opacity
    }
}