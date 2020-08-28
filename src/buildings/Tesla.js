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
        
        this.spriteSheet = document.getElementById(level.game.DOMConfig.sprites.towerTesla)
        
        
    }
    
    place(cell) {
        super.place(cell)
        
        this.lightning = new Lightning(this.level, this.getMiddleCoords())
    }

    updateTargets() {

        this.currentTargets = []
        
        for (let i = 0; i < this.nbTargetsMax; i++) {
            
            const enemy = (i === 0) ? 
                this.level.getCloserEnemyInRange(this.range, this.getMiddleCoords())
                : this.level.getCloserEnemyFromEnemy(this.currentTargets)
            
            if (enemy === null) return

            const targetCoords = enemy.getCoords()
            const originCoords = this.getMiddleCoords()

            if(getDistance(originCoords.x, originCoords.y, targetCoords.x, targetCoords.y) > this.range) continue            
            
            this.currentTargets.push(enemy)
            
        }
    }

    render(layer, diffTimestamp) {
        super.render(layer, diffTimestamp)
        this.lightning.render(layer, diffTimestamp)
    }

    update(diffTimestamp) {
        super.update(diffTimestamp)
        this.updateTargets()
        const targetsCoords = this.currentTargets.map(target => target.getCoords())
        this.lightning.update(targetsCoords, diffTimestamp)
    }
}