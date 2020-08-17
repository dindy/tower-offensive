import Level from './Level'
import BuildMenu_UI from './ui/BuildMenu'
import ContextualMenu_UI from './ui/ContextualMenu'
import LevelData_UI from './ui/LevelData'
import Scene from './Scene'

export default class Game {
    
    lastTimestamp = null
    
    levels = []

    currentLevel = null

    isPaused = false

    /**
     * Constructor
     * @param {JSON} config 
     * @param {Object} DOMConfig 
     */
    constructor(config, DOMConfig) 
    {        
        this.config = config
        this.DOMConfig = DOMConfig

        this.loadLevels()    
        this.scene = new Scene(this) 

        this.buildMenu_UI = new BuildMenu_UI(this)        
        this.levelData_UI = new LevelData_UI(this)
        this.contextualMenu_UI = new ContextualMenu_UI(this)

        document.addEventListener("wheel", this.scene.zoomHandler.bind(this.scene), false)
        document.addEventListener('mousedown', this.scene.touchstartHandler.bind(this.scene), false)
        document.addEventListener('mousemove', this.scene.touchmoveHandler.bind(this.scene), false)
        document.addEventListener('mouseup', this.scene.touchendHandler.bind(this.scene), false)
        document.addEventListener("dragstart", this.dragStartHandler.bind(this))
    }

    hasCurrentLevel() {
        return this.currentLevel !== null
    }

    isValidDragEventSource(event) {
        
        return event.target.classList.contains(this.DOMConfig.buildMenuItem.class)        
    }

    dragStartHandler(event) {

        if (!this.isValidDragEventSource(event)) {
            event.preventDefault()
            return false
        } else {
            this.buildMenu_UI.dragStartHandler(event)
        }
    }

    handleSceneClick(cell) {
        
        this.currentLevel.unselectBuilding()

        if (cell.hasBuilding()) {
            this.currentLevel.selectBuilding(cell.building)
            this.contextualMenu_UI.show(cell.building)
            this.buildMenu_UI.hide()
        } else {
            this.contextualMenu_UI.hide()
            this.buildMenu_UI.show()
        }        
        
        this.render(0)
    }

    /**
     * Pause le game
     */
    pause() {
        this.isPaused = true
    }

    /**
     * Reprend le game
     */
    resume() {
        this.isPaused = false
        this.lastTimestamp = null
        this.start()
    }

    /**
     * Pause / reprend le game
     */
    togglePause() {
        if (this.isPaused) this.resume() 
        else this.pause()
    }

    /**
     * Créer un nouveau level en fonction de la config
     */
    loadLevels() {

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
    start() {
        requestAnimationFrame(this.step.bind(this))
    }


    /**
     * Gère le rafraichissement avec un appel recursif via requestAnimationFrame
     * @param {Float} timestamp 
     */
    step(timestamp) {

        // First iteration
        if (this.lastTimestamp === null) this.lastTimestamp = timestamp
        
        // Update timestamp
        const diffTimestamp = timestamp - this.lastTimestamp
        this.lastTimestamp = timestamp

        // Update
        this.update(diffTimestamp)

        // Render all the game
        this.render(diffTimestamp)

        // Handle pause rendering
        if (this.isPaused) return

        requestAnimationFrame(this.step.bind(this))
    }

    /**
     * Upate les data 
     * @param {Float} diffTimestamp 
     */
    update(diffTimestamp) {
        this.scene.update(diffTimestamp)
    }
    
    /**
     * Rendu graphique
     */
    render(diffTimestamp) {
        this.levelData_UI.render()
        this.buildMenu_UI.render()
        this.scene.render(diffTimestamp)
    }

}