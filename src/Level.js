import Wave from './Wave'
import Building from './Building'
import Tower from './buildings/Tower.js'

export default class Level {
    
    waves = [] 
    enemies = []
    towers = []
    bullets = []
    currentWave = null
    placingBuilding = null

    constructor(game, levelConfig) {
        this.game = game
        this.config = levelConfig
        this.loadWaves()
        this.staticLayer = game.staticLayer
        this.dynamicLayer = game.dynamicLayer
    }
    
    startPlacingBuilding = () => {
        this.placingBuilding = new Tower(this)
    }

    highlightPlacingBuildingRange = cell => {
        this.placingBuilding.highlightRange(cell.getCenterPoint())
        this.placingBuilding.renderRangeHighlight(this.dynamicLayer)
        this.staticLayer.update()
    } 

    removePlacingBuilding = () => {
        this.placingBuilding = null
        this.dynamicLayer.update()
    }

    removePlacingBuildingRangeHighlight() {
        this.placingBuilding.removeRangeHighlight()
        this.placingBuilding.renderRangeHighlight(this.dynamicLayer)        
        this.dynamicLayer.update()
    }

    endPlacingBuilding() {
        this.placingBuilding = null
        this.staticLayer.update()
    }

    placeBuilding = (targetGridCell) => {
        
        const building = this.placingBuilding 
        building.place(targetGridCell)
        this.towers.push(building)
        this.towers.forEach(tower => {
            tower.render(this.staticLayer)
        })
        this.staticLayer.update()
        
    }
    
    // Create waves from config
    loadWaves = () => {
        
        // Create waves
        this.config.waves.forEach(waveConfig => {
            const wave = new Wave(waveConfig, this)            
            this.waves.push(wave)
        })        

        // Select the first wave
        this.currentWave = this.waves[0]
        
    } 
    
    //Update the data
    update = (diffTimestamp) => {

        // Add new enemies to enemies
        this.currentWave.getSpawningEnemies(diffTimestamp).forEach(enemy => {
            this.enemies.push(enemy)
        })

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(diffTimestamp)
        }

        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i]
            tower.update(diffTimestamp)
        }
    }
    
    render = () => {

        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.render(this.dynamicLayer)
        }

        if (this.placingBuilding !== null) this.placingBuilding.renderRangeHighlight(this.dynamicLayer)

        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i];
            tower.renderBullets(this.dynamicLayer)
        }
        
        this.enemies = this.enemies.filter(enemy => !enemy.isDeleted) 

        this.dynamicLayer.update()
    }

}