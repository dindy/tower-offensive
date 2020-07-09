import Konva from 'konva'
import Wave from './Wave'
import GridCell from './GridCell'

export default class Level {
    
    waves = [] 
    enemies = []
    currentWave = null
    gridCells = []

    constructor(game, config) {
        this.game = game
        this.config = config
        this.loadWaves()
        this.createCellsGridLayer()
    }

    // Create waves from config
    loadWaves = () => {
        
        // Create waves
        this.config.waves.forEach(waveConfig => {
            const wave = new Wave(waveConfig)            
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
                let cell = new GridCell(x, y, this.game.cellSize)

                this.gridCells.push(cell)
                this.gridLayer.appendChild(cell.DOMElement)
            }
        }

        this.renderGrid()
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
            // Déterminer une position aléatoire d départ
            // Modifier les props de l'enemy
            this.enemies.push(enemy)
        })

    }

}