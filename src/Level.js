import Wave from './Wave'
import Tower from './buildings/Tower.js'

export default class Level {
    
    waves = [] 
    enemies = []
    towers = []
    bullets = []
    currentWave = null
    placingBuilding = null
    selectedBuilding = null

    /**
     * Constructor
     * @param {Object} game 
     * @param {JSON} levelConfig 
     */
    constructor(game, levelConfig) {
        this.game = game
        this.config = levelConfig
        this.loadWaves()
        this.staticLayer = game.staticLayer
        this.dynamicLayer = game.dynamicLayer
    }
    
    selectBuilding(building) {
        this.selectedBuilding = building
        building.select()
    }

    unselectBuilding() {
        if (this.selectedBuilding !== null) {
            this.selectedBuilding.unselect()        
            this.selectedBuilding = null
        }
    }

    /**
     * Créer une nouvelle instance de tower
     */
    startPlacingBuilding() {
        this.placingBuilding = new Tower(this)
    }

    /**
     * Update le layer avec la shape représentant la range du batiment
     * @param {Object} cell 
     */
    highlightPlacingBuildingRange(cell) {
        this.placingBuilding.highlightRange(cell.getCenterPoint())
        this.placingBuilding.renderRangeHighlight(this.dynamicLayer)
        this.staticLayer.update()
    } 

    /**
     * Reset la propriété et update le layer 
     */
    removePlacingBuilding() {
        this.placingBuilding = null
        this.dynamicLayer.update()
    }

    /**
     * Remove la shape représentant la range et update le layer
     */
    removePlacingBuildingRangeHighlight() {
        this.placingBuilding.removeRangeHighlight()
        this.placingBuilding.renderRangeHighlight(this.dynamicLayer)        
        this.dynamicLayer.update()
    }

    /**
     * L'évènement placing building est fini, met a jour le layer 
     */
    endPlacingBuilding() {
        this.placingBuilding = null
        this.staticLayer.update()
    }

    /**
     * Place le building sur le layer
     * @param {Object} GridCell 
     */
    placeBuilding(targetGridCell) {
        
        const building = this.placingBuilding 
        building.place(targetGridCell)
        this.towers.push(building)
        this.towers.forEach(tower => {
            tower.render(this.dynamicLayer, this.staticLayer)
        })
        this.staticLayer.update()
        return building
    }
    
    /**
     * Créer la vague en fonction de la config
     */
    loadWaves() {
        
        // Create waves
        this.config.waves.forEach(waveConfig => {
            const wave = new Wave(waveConfig, this)            
            this.waves.push(wave)
        })        

        // Select the first wave
        this.currentWave = this.waves[0]
        
    } 
    
    /**
     * Call all updates
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {

        this.updateEnemies(diffTimestamp)

        this.updateTowers(diffTimestamp)
    }

    /**
     * Add spawning enemies to level and then update all enemies state
     * @param {Float} diffTimestamp 
     */    
    updateEnemies(diffTimestamp) {
        
        // Add new enemies to enemies
        this.currentWave.getSpawningEnemies(diffTimestamp).forEach(enemy => {
            this.enemies.push(enemy)
        })    
        
        // Update enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(diffTimestamp)
        }        
    }

    /**
     * Update all towers state
     * @param {Float} diffTimestamp 
     */    
    updateTowers(diffTimestamp) {

        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].update(diffTimestamp)
        }        
    }    

    /**
     * Main render
     */
    render() {

        this.renderEnemies()
        
        this.renderPlacingBuilding()
        
        this.renderTowers()

        this.dynamicLayer.update()
    }

    renderEnemies() {

        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.render(this.dynamicLayer)
        }

        this.enemies = this.enemies.filter(enemy => !enemy.isDeleted) 
    }

    renderPlacingBuilding() {

        if (this.placingBuilding !== null) 
            this.placingBuilding.renderRangeHighlight(this.dynamicLayer)
    }

    renderTowers() {

        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].render(this.dynamicLayer, this.staticLayer)
        }
    }

}