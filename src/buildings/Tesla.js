import Tower from "./Tower"
import Sprite from "../Sprite"
import Lightning from '../Lightning'
import { getDistance } from "../utilities"

export default class Tesla extends Tower {

    static price = 4


    constructor(level) {
        
        super(level, 200, 250, 1, 0.5)
        
        this.currentTargets = []
        this.nbTargetsMax = 5

        this.lightningTimer = 0
        this.coolingTimer = 0
        this.canLight = false

        this.lightningDuration = 250
        this.coolingDuration = 100

        this.slowPower = 5

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerTesla)
        
        
    }
    
    place(cell) {
        super.place(cell)
        this.lightning = new Lightning(this.level, this.getMiddlePosition())
    }

    updateTargets() {
        
        if (!this.canLight) {
            this.currentTargets = []
            return
        } else if(this.currentTargets.length > 0) {
            for (let i = 0; i < this.currentTargets.length; i++) {
                const enemy = this.currentTargets[i];
                enemy.slow(this.slowPower)
            }
            return
        }
        for (let i = 0; i < this.nbTargetsMax; i++) {
            const enemy = (i === 0) ? 
                this.level.getCloserEnemyInRange(this.range, this.getMiddlePosition())
                : this.level.getCloserEnemyFromEnemy(this.currentTargets)
            
            if (enemy === null) return
            
            const targetCoords = enemy.getMiddlePosition()
            const originCoords = this.getMiddlePosition()
            if(originCoords.getDistance(targetCoords) > this.range) continue            
            
            if (this.currentTargets.length > 0) {
                
                const lastCurrentTargetCoords = this.currentTargets[this.currentTargets.length - 1].getMiddlePosition() 
                
                if (lastCurrentTargetCoords.getDistance(targetCoords) > 100) return
            }

            enemy.slow(this.slowPower)
            this.currentTargets.push(enemy)

        }
        // this.currentTargets = currentTargets
    }

    render(layer, diffTimestamp) {
        super.render(layer, diffTimestamp)
    }

    renderAttack(layer, diffTimestamp) {
        if(this.canLight && this.currentTargets.length > 0) this.lightning.render(layer, diffTimestamp)
    }

    update(diffTimestamp) {
        super.update(diffTimestamp)
        
        this.updateTimer(diffTimestamp)
        this.updateTargets()
        const targetsCoords = this.currentTargets.map(target => ({ coords: target.getMiddlePosition(), id: target.id }))
        this.lightning.update(targetsCoords, diffTimestamp)
    }

    updateTimer(diffTimestamp) {
        
        if (this.canLight) {
            this.lightningTimer += diffTimestamp
            this.coolingTimer = 0
        } else {
            this.coolingTimer += diffTimestamp
            this.lightningTimer = 0
        }

        if (this.canLight && this.lightningTimer >= this.lightningDuration) {
            this.canLight = false
        } else if (!this.canLight && this.coolingTimer >= this.coolingDuration) {
            this.canLight = true
        }

    }
}