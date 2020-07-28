import Level from './Level'
import BuildMenu from './BuildMenu'
import Scene from './Scene'

export default class Game {
    
    lastTimestamp = null
    
    levels = []

    currentLevel = null

    isStopped = false

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

        this.buildMenu = new BuildMenu(DOMConfig)
        this.buildMenu.setLevel(this.currentLevel)
        
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
            this.buildMenu.dragStartHandler(event)
        }
    }

    /**
     * Stop le game
     */
    stop() {
        this.isStopped = true
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
        this.render()

        // Handle stop rendering
        if (!this.isStopped) requestAnimationFrame(this.step.bind(this))
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
    render() {
        this.scene.render()
    }

}