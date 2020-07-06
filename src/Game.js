import Konva from 'konva'
import Level from './Level'
import GridCell from './GridCell'
export default class Game {
    
    cellSize = 50 
    
    nbCells = 10

    gridCells = []
    
    lastTimestamp = null
    
    levels = []

    currentLevel = null

    isStopped = false

    constructor(config) 
    {
        this.width = this.cellSize * this.nbCells
        this.height = this.cellSize * this.nbCells

        this.stage = new Konva.Stage({
            container: 'container',   // id of container <div>
            width :this.width,
            height: this.height
          })
        
        this.layer = new Konva.Layer()
        this.config = config
        this.loadLevels()
        console.log(this)
        
        this.gridLayer = new Konva.Layer()
        this.createGridOfCells()
    }

    stop = () => {
        this.isStopped = true
    }

    //Create levels from config files
    loadLevels = () => {

        // Create levels
        this.config.levels.forEach(levelConfig => {
            const level = new Level(levelConfig)            
            this.levels.push(level)
        })

        // Set current level
        this.currentLevel = this.levels[0] 
        
    }

    start = () => {
        requestAnimationFrame(this.step)
    }


    // Global Refresh loop
    step = (timestamp) => {

        // First iteration
        if (this.lastTimestamp === null) this.lastTimestamp = timestamp
        
        // Update timestamp
        const diffTimestamp = timestamp - this.lastTimestamp
        this.lastTimestamp = timestamp

        this.update(diffTimestamp)

        this.render()

        if (!this.isStopped) requestAnimationFrame(this.step)
    }

    createGridOfCells = () => {
        for(let y = 0; y < this.nbCells; y++){
            for(let x = 0; x < this.nbCells; x++){
                let cell = new GridCell(x, y, this.cellSize, this.gridLayer)
                this.gridCells.push(cell)
            }
        }
    }

    //Update the data of the game
    update = (diffTimestamp) => {
        this.currentLevel.update(diffTimestamp)
    }

    //Global render, call render methods of all other classes
    render = () => {
        this.gridCells.forEach(cell => {
            cell.render()
        })
        this.stage.add(this.gridLayer)
        this.gridLayer.draw()
    }
}