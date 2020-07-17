import Wave from './Wave'
import GridCell from './GridCell'
import Building from './Building'

export default class Level {
    
    waves = [] 
    enemies = []
    buildings = []
    currentWave = null
    gridCells = []

    constructor(game, levelConfig) {
        this.game = game
        this.config = levelConfig
        this.loadWaves()
        this.createCellsGridLayer()
        this.createStaticLayer()
        this.createDynamicLayer()
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

        for(let y = 0; y < this.game.nbCells; y++){
            for(let x = 0; x < this.game.nbCells; x++){
                let cell = new GridCell(x, y, this)

                this.gridCells.push(cell)
                this.gridLayer.appendChild(cell.DOMElement)
            }
        }

        this.renderGrid()
    }

    addBuilding = (targetGridCell) => {
        
        const coords = targetGridCell.coords
        const building = new Building(coords.xMin, coords.yMin)
        this.buildings.push(building)
        this.buildings.forEach(building => {
            building.render(this.staticLayer)
        })
        this.staticLayer.update()
        
    }

    renderGrid = () => {

        this.gridCells.forEach(cell => {
            cell.render(this.gridLayer)
        })
    }

    //Update the data
    update = (diffTimestamp) => {

        // Add new enemies to enemies
        this.currentWave.getSpawningEnemies(diffTimestamp).forEach(enemy => {

            // Récupérer les coordonnées de la 1ère cell du path
            const firstCell = this.gridCells[this.config.map.path[0]]
            const secondCell = this.gridCells[this.config.map.path[1]]

            // Déterminer une position aléatoire de départ
            enemy.offset = (Math.random() * (this.game.cellSize - 20)) + 10
            
            if(firstCell.column === secondCell.column) {
                enemy.x = Math.floor(enemy.offset) + firstCell.coords.xMin
                enemy.y = firstCell.coords.yMin === 0 ? firstCell.coords.yMin : firstCell.coords.yMax
            } else if (firstCell.row === secondCell.row) {
                enemy.y = Math.floor(enemy.offset) + firstCell.coords.yMin
                enemy.x = firstCell.coords.yMin === 0 ? firstCell.coords.xMin : firstCell.coords.xMax
            }
            this.enemies.push(enemy)
        })

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(diffTimestamp)
        }
    }
    
    render = () => {

        for (let i = 0; i < this.enemies.length; i++) {
            
            const enemy = this.enemies[i];
            enemy.render(this.dynamicLayer)
        }
        this.enemies = this.enemies.filter(enemy => !enemy.isDeleted) 
        this.dynamicLayer.update()
    }

}