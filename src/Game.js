import Level from './Level'
import * as createjs from 'createjs-module'

export default class Game {
    
    lastTimestamp = null
    
    levels = []

    currentLevel = null

    isStopped = false

    constructor(config, DOMContainerId, DOMGridId) 
    {
        this.DOMContainerId = DOMContainerId
        this.DOMGridId = DOMGridId

        this.cellSize = config.cellSize 
        this.nbCells = config.nbCells

        this.width = this.cellSize * this.nbCells
        this.height = this.cellSize * this.nbCells

        this.config = config
    
        this.loadLevels()    
    }

    createCanvasLayer = () => {

        const DOMCanvas = document.createElement('canvas')
        const DOMContainer = document.getElementById(this.DOMContainerId)

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
            const level = new Level(this, levelConfig)            
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

}