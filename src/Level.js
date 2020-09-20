import Wave from './Wave'
import { getAvailableBuildingInstanceByName } from './buildings/availableBuildings'
import { getDistance } from './utilities'

export default class Level {
    
    enemies = []
    towers = []
    explosions = []
    currentWave = null
    placingBuilding = null
    selectedBuilding = null
    waveCounter = 0
    value = 2500
    growthFactor = 20
    buildingPoints = 10000
    isNewWave = false
    report = 0
    
    /**
     * Constructor
     * @param {Object} game 
     * @param {JSON} levelConfig 
     */
    constructor(game, levelConfig) {
        
        this.game = game
        this.config = levelConfig
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
        
        this.placingBuilding = getAvailableBuildingInstanceByName(name, this)
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

        this.buildingPoints -= building.constructor.price
        this.placingBuilding = null 
        building.place(targetGridCell)
        this.towers.push(building)
        // this.renderStaticLayer()
        return building
    }
    
    stealValue(value) {
        this.value -= value
    }

    takeBackValue(value) {
        this.value += value
    }

    renderStaticLayer() {
    }

    gameOver() { 
        console.log(" GAME OVER :'( ")
    }

    /**
     * Créer la vague en fonction de la config
     */
    updateWave(diffTimestamp) {
        this.isNewWave = false
        if (this.currentWave === null || this.currentWave.isFinished() && this.enemies.length === 0) {
            // if (this.value < 0) return this.gameOver()
            this.waveCounter ++ 
            this.currentWave = new Wave(this, this.waveCounter)
            this.isNewWave = true
        }
    } 
    
    getCloserEnemyInRange(range, coords) {
        let enemy = this.getCloserEnemy(coords)
        if(enemy === null) return null
        let distance = getDistance(coords.x, coords.y, enemy.x, enemy.y)
        return (distance <= range) ? enemy : null
    }

    getCloserEnemyFromEnemy(enemies) {

        const originEnemy = enemies[enemies.length - 1]

        const enemiesIds = enemies.map(enemy => enemy.id)
        
        let closerDistance = null, closerEnemy = null
        
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            
            if (enemiesIds.includes(enemy.id)) continue

            const distance = getDistance(originEnemy.x, originEnemy.y, enemy.x, enemy.y)
            
            if (closerDistance === null || distance < closerDistance) {
                closerDistance = distance  
                closerEnemy = enemy
            } 
        }
        
        return closerEnemy
    }


    

    getCloserEnemy(coords) {
        
        let closerDistance = null, closerEnemy = null
        
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            const distance = getDistance(coords.x, coords.y, enemy.x, enemy.y)
            
            if (closerDistance === null || distance < closerDistance) {
                closerDistance = distance  
                closerEnemy = enemy
            } 
        }
        
        return closerEnemy
    }

    removeBuilding(building) {
        building.isDeleted = true
        building.cell.building = null
        this.game.buildMenu_UI.show()
        this.towers = this.towers.filter(building => building.isDeleted === false ) 
    }

    /**
     * Call all updates
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {

        diffTimestamp += this.report
        
        const treshold = 25 // ms
        const steps = Math.floor(diffTimestamp / treshold)
        const left = diffTimestamp % treshold

        for (let i = 1; i <= steps; i++) {
            
            this.updateWave(treshold)
    
            this.updateScore()
    
            this.updateEnemies(treshold)
    
            this.updateTowers(treshold)

            this.updateExplosions(treshold)
        }
        
        this.report = left

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

    updateValue(diffTimestamp) {
        this.value += this.growthFactor
    }


    updateBuildingPoints() {
        this.buildingPoints += Math.floor(this.value / 180)
    }

    updateScore() {
        if (this.isNewWave) {
            this.updateBuildingPoints()
            if (this.waveCounter > 1) this.updateValue()
        }
    }

    updateExplosions(diffTimestamp) {
        
        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].update(diffTimestamp)
        }      

        this.explosions = this.explosions.filter(explosion => !explosion.isDeleted)
         
    } 

    /**
     * Main render
     */
    render(diffTimestamp) {

        this.renderTowersRanges()

        this.renderPlacingBuilding()
        
        this.renderEnemies(diffTimestamp)

        this.renderTowers(diffTimestamp)

        this.renderTowersCannon(diffTimestamp)
        
        this.renderTowersAttack(diffTimestamp)

        this.renderExplosions(diffTimestamp)
    }

    renderTowersCannon(diffTimestamp) {
        
        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i] 
            if (typeof tower.renderCannon === 'function')
                tower.renderCannon(this.game.scene.dynamicLayer, diffTimestamp)
        }
    }

    renderExplosions(diffTimestamp) {
        for (let i = 0; i < this.explosions.length; i++) {
            const explosion = this.explosions[i];
            explosion.render(this.game.scene.dynamicLayer, diffTimestamp)
        }        
    }

    renderEnemies(diffTimestamp) {
        
        const enemies = this.enemies.sort((a, b) => a.y > b.y)

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
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
    
    renderTowersAttack(diffTimestamp) {
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].renderAttack(this.game.scene.dynamicLayer, diffTimestamp)
        }
    }

    renderTowersRanges() {
        for (let i = 0; i < this.towers.length; i++) {
            this.towers[i].renderRangeHighlight(this.game.scene.dynamicLayer)
        }
    }

    addExplosion(explosion) {
        this.explosions.push(explosion)
    }
}