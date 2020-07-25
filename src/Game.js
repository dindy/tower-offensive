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

    /**
     * Constructor
     * @param {JSON} config 
     * @param {Object} DOMConfig 
     */
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
        document.addEventListener("dragstart", this.dragStartHandler)
    }

    isValidDragEventSource(event) {
        return event.target.classList.contains(this.DOMConfig.buildMenuItem.class)        
    }

    dragStartHandler = event => {

        if (!this.isValidDragEventSource(event)) {
            event.preventDefault()
            return false
        } else {
            this.buildMenu.dragStartHandler(event)
        }
    }
    /**
     * Créer un Canvas et l'ajoute au DOM
     */
    createCanvasLayer = () => {

        const DOMCanvas = document.createElement('canvas')
        const DOMContainer = document.getElementById(this.DOMCanvasContainerId)

        DOMCanvas.setAttribute('width', this.width + 'px')
        DOMCanvas.setAttribute('height', this.height + 'px')
        DOMCanvas.style.border = 'none'

        DOMContainer.appendChild(DOMCanvas)

        return new createjs.Stage(DOMCanvas)
    }

    /**
     * Stop le game
     */
    stop = () => {
        this.isStopped = true
    }

    /**
     * Créer un nouveau level en fonction de la config
     */
    loadLevels = () => {

        // Create levels
        this.config.levels.forEach(levelConfig => {
            const level = new Level(this, levelConfig, this.DOMConfig)            
            this.levels.push(level)
        })

        // Set current level
        this.currentLevel = this.levels[0] 
        
    }

    /**
     * Demarre le jeu
     */
    start = () => {
        requestAnimationFrame(this.step)
    }


    /**
     * Gère le raffraichissement avec un appel recursif
     * @param {Float} timestamp 
     */
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

    /**
     * Upate les data 
     * @param {Float} diffTimestamp 
     */
    update = (diffTimestamp) => {
        this.currentLevel.update(diffTimestamp)
    }

    /**
     * Rendu graphique
     */
    render = () => {
        this.currentLevel.render()
    }

    /**
     * Créer la grille de réference pour le jeu
     */
    createCellsGridLayer = () => {

        this.gridLayer = document.getElementById(this.DOMGridId)
        this.gridLayer.style.width = this.nbCells * this.cellSize + 'px' 
        this.gridLayer.style.height = this.nbCells * this.cellSize + 'px' 

        for (let y = 0; y < this.nbCells; y++) {

            for (let x = 0; x < this.nbCells; x++) {

                let cell = new GridCell(x, y, this)
                cell.isPath = this.currentLevel.config.map.path.includes(cell.id)
                this.gridCells.push(cell)
                this.gridLayer.appendChild(cell.DOMElement)
            }
        }


        this.renderGrid()
    }

    /**
     * Rendu de la grille de référence
     */
    renderGrid = () => {
        this.gridCells.forEach(cell => cell.render(this.gridLayer))
    }

    /**
     * Créer un Canvas utilisé pour rendre les élements static du jeu
     */
    createStaticLayer = () => {
        this.staticLayer = this.createCanvasLayer()
    }

    /**
     * Créer un Canvas utilisé par les éléments dynamic du jeu
     */
    createDynamicLayer = () => {
        this.dynamicLayer = this.createCanvasLayer()
    }

}