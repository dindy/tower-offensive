import Level from './Level'
import BuildMenu from './BuildMenu'
import * as createjs from 'createjs-module'
import GridCell from './GridCell'

export default class Game {
    
    lastTimestamp = null
    
    levels = []

    currentLevel = null

    isStopped = false

    gridCells = []

    constructor(config, DOMConfig) 
    {
        this.DOMConfig = DOMConfig
        this.DOMCanvasContainerId = DOMConfig.canvas.id
        this.DOMGridId = DOMConfig.grid.id

        this.cellSize = config.cellSize 
        this.nbCells = config.nbCells

        this.width = this.cellSize * this.nbCells
        this.height = this.cellSize * this.nbCells

        this.config = config
        
        this.createStaticLayer()
        this.createDynamicLayer()

        this.loadLevels()    

        this.createCellsGridLayer()

        this.buildMenu = new BuildMenu(DOMConfig)
        this.buildMenu.setLevel(this.currentLevel)

    }

    createCanvasLayer = () => {

        const DOMCanvas = document.createElement('canvas')
        const DOMContainer = document.getElementById(this.DOMCanvasContainerId)

        DOMCanvas.setAttribute('width', this.width + 'px')
        DOMCanvas.setAttribute('height', this.height + 'px')
        DOMCanvas.style.border = 'none'

        DOMContainer.appendChild(DOMCanvas)

        return new createjs.Stage(DOMCanvas)
    }

    stop = () => {
        this.isStopped = true
    }

    // Create levels from config files
    loadLevels = () => {

        // Create levels
        this.config.levels.forEach(levelConfig => {
            const level = new Level(this, levelConfig, this.DOMConfig)            
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

    // Update the data of the game
    update = (diffTimestamp) => {
        this.currentLevel.update(diffTimestamp)
    }

    // Global render, call render methods of all other classes
    render = () => {
        this.currentLevel.render()
    }

    // Create a background grid for reference frame
    createCellsGridLayer = () => {

        this.gridLayer = document.getElementById(this.DOMGridId)
        this.gridLayer.style.width = this.nbCells * this.cellSize + 'px' 
        this.gridLayer.style.height = this.nbCells * this.cellSize + 'px' 

        for (let y = 0; y < this.nbCells; y++) {

            for (let x = 0; x < this.nbCells; x++) {

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

    createStaticLayer = () => {
        this.staticLayer = this.createCanvasLayer()
    }

    createDynamicLayer = () => {
        this.dynamicLayer = this.createCanvasLayer()
    }

}