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
        this.isLightning = false

        this.lightningDuration = 250
        this.coolingDuration = 100

        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerTesla)
        
        
    }
    
    place(cell) {
        super.place(cell)
        this.lightning = new Lightning(this.level, this.getMiddleCoords())
    }

    updateTargets() {
        
        if (!this.isLightning) {
            this.currentTargets = []
            return
        } else if(this.currentTargets.length > 0) {
            return
        }
        
        for (let i = 0; i < this.nbTargetsMax; i++) {
            
            const enemy = (i === 0) ? 
                this.level.getCloserEnemyInRange(this.range, this.getMiddleCoords())
                : this.level.getCloserEnemyFromEnemy(this.currentTargets)
            
            if (enemy === null) return

            const targetCoords = enemy.getCoords()
            const originCoords = this.getMiddleCoords()

            if(getDistance(originCoords.x, originCoords.y, targetCoords.x, targetCoords.y) > this.range) continue            
            
            // enemy.slow(.2)
            this.currentTargets.push(enemy)
            
        }
        // this.currentTargets = currentTargets
    }

    render(layer, diffTimestamp) {
        super.render(layer, diffTimestamp)
        this.lightning.render(layer, diffTimestamp)
    }

    update(diffTimestamp) {
        super.update(diffTimestamp)
        
        this.updateTimer(diffTimestamp)
        this.updateTargets()
        const targetsCoords = this.currentTargets.map(target => ({ coords: target.getCoords(), id: target.id }))
        this.lightning.update(targetsCoords, diffTimestamp)
    }

    updateTimer(diffTimestamp) {
        
        if (this.isLightning) {
            this.lightningTimer += diffTimestamp
            this.coolingTimer = 0
        } else {
            this.coolingTimer += diffTimestamp
            this.lightningTimer = 0
        }

        if (this.isLightning && this.lightningTimer >= this.lightningDuration) {
            this.isLightning = false
        } else if (!this.isLightning && this.coolingTimer >= this.coolingDuration) {
            this.isLightning = true
        }

    }
}