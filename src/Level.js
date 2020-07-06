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

    //Load the config and create data from it
    loadWaves = () => {
        
        // Create waves
        this.config.waves.forEach(waveConfig => {
            const wave = new Wave(waveConfig)            
            this.waves.push(wave)
        })        

        this.currentWave = this.waves[0]
        
    } 

    createCellsGridLayer = () => {

        this.gridLayer = new Konva.Layer()

        for(let y = 0; y < this.game.nbCells; y++){
            for(let x = 0; x < this.game.nbCells; x++){
                let cell = new GridCell(x, y, this.game.cellSize)

                this.gridCells.push(cell)
            }
        }

        this.renderGrid()
    }

    renderGrid = () => {
        
        this.game.stage.add(this.gridLayer)

        this.gridCells.forEach(cell => {
            cell.render(this.gridLayer)
        })

        
        this.gridLayer.draw()
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