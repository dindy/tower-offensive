import Wave from './Wave'
import GridCell from './GridCell'
import Building from './Building'
import Tower from './buildings/Tower.js'

export default class Level {
    
    waves = [] 
    enemies = []
    towers = []
    bullets = []
    currentWave = null
    gridCells = []
    placingBuilding = null

    constructor(game, levelConfig) {
        this.game = game
        this.config = levelConfig
        this.loadWaves()
        this.createCellsGridLayer()
        this.createStaticLayer()
        this.createDynamicLayer()
    }
    
    startPlacingBuilding = () => {
        this.placingBuilding = new Tower(this)
    }

    highlightPlacingBuildingRange = cell => {
        this.placingBuilding.highlightRange(cell.getCenterPoint(), this.staticLayer)
        this.staticLayer.update()
    } 

    removePlacingBuilding = () => {
        
        this.placingBuilding = null
        this.staticLayer.update()
    }

    removePlacingBuildingRangeHighlight() {
        this.placingBuilding.removeRangeHighlight()
        this.staticLayer.update()
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

    createStaticLayer = () => {
        this.staticLayer = this.game.createCanvasLayer()
    }

    createDynamicLayer = () => {
        this.dynamicLayer = this.game.createCanvasLayer()
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

    // Create a background grid for reference frame
    createCellsGridLayer = () => {

        this.gridLayer = document.getElementById(this.game.DOMGridId)
        this.gridLayer.style.width = this.game.nbCells * this.game.cellSize + 'px' 
        this.gridLayer.style.height = this.game.nbCells * this.game.cellSize + 'px' 

        for (let y = 0; y < this.game.nbCells; y++) {

            for (let x = 0; x < this.game.nbCells; x++) {

                let cell = new GridCell(x, y, this)

                this.gridCells.push(cell)
                this.gridLayer.appendChild(cell.DOMElement)
            }
        }

        this.renderGrid()
    }

    renderGrid = () => {
        this.gridCells.forEach(cell => cell.render(this.gridLayer))
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

        for (let i = 0; i < this.towers.length; i++) {
            const tower = this.towers[i];
            tower.renderBullets(this.dynamicLayer)
        }
        
        this.enemies = this.enemies.filter(enemy => !enemy.isDeleted) 

        this.dynamicLayer.update()
    }

}