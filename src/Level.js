import Wave from './Wave'
import Basic from './buildings/Basic'
import Sniper from './buildings/Sniper'

export default class Level {
    
    enemies = []
    towers = []
    bullets = []
    currentWave = null
    placingBuilding = null
    selectedBuilding = null
    waveCounter = 0
        
    /**
     * Constructor
     * @param {Object} game 
     * @param {JSON} levelConfig 
     */
    constructor(game, levelConfig) {
        this.game = game
        this.config = levelConfig
        this.updateWave()
        this.availableBuildings = {
            'Basic': Basic,
            'Sniper': Sniper,
        }
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
    startPlacingBuilding(name) {
        
        this.placingBuilding = new this.availableBuildings[name](this)
    }

    /**
     * Update le layer avec la shape représentant la range du batiment
     * @param {Object} cell 
     */
    highlightPlacingBuildingRange(cell) {
        this.placingBuilding.highlightRange(cell.getCenterPoint())
        this.placingBuilding.renderRangeHighlight(this.game.scene.dynamicLayer)
    } 

    /**
     * Set current placing building to null
     */
    removePlacingBuilding() {
        this.placingBuilding = null
    }

    /**
     * Remove la shape représentant la range
     */
    removePlacingBuildingRangeHighlight() {
        this.placingBuilding.removeRangeHighlight()
    }

    /**
     * L'évènement placing building est fini
     */
    endPlacingBuilding() {
        this.placingBuilding = null
    }

    /**
     * Place le building sur le layer
     * @param {Object} GridCell 
     */
    placeBuilding(targetGridCell) {
        const building = this.placingBuilding
        this.placingBuilding = null 
        building.place(targetGridCell)
        this.towers.push(building)
        // this.renderStaticLayer()
        return building
    }
    
    renderStaticLayer() {
    }

    /**
     * Créer la vague en fonction de la config
     */
    updateWave(diffTimestamp) {
        
        if (this.currentWave === null || this.currentWave.isFinished() && this.enemies.length === 0) {
            this.currentWave = new Wave(this, this.waveCounter)
            this.waveCounter ++ 
        }
    } 
    
    /**
     * Call all updates
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {

        this.updateWave(diffTimestamp)

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
        
        this.enemies = this.enemies.filter(enemy => !enemy.isDeleted) 
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
    render(diffTimestamp) {

        this.renderEnemies(diffTimestamp)
        
        this.renderPlacingBuilding()
        
        this.renderBullets(diffTimestamp)
        
        this.renderTowersRanges()

        this.renderTowers(diffTimestamp)
        
    }

    renderEnemies(diffTimestamp) {
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.render(this.game.scene.dynamicLayer, diffTimestamp)
        }
    }

    renderPlacingBuilding() {
        if (this.placingBuilding !== null) 
            this.placingBuilding.renderRangeHighlight(this.game.scene.dynamicLayer)
    }

    renderTowers(diffTimestamp) {
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].render(this.game.scene.dynamicLayer, diffTimestamp)
        }
    }

    renderTowersRanges() {
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].renderRangeHighlight(this.game.scene.dynamicLayer)
        }
    }

    renderBullets(diffTimestamp) {
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].renderBullets(this.game.scene.dynamicLayer, diffTimestamp)
        }
    }

}