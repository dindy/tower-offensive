import Rectangle from "./abstract/Rectangle"

export default class GridCell extends Rectangle{

    static cellsCount = 0

    static dragCount = 0

    // coords = {}

    /**
     * Constructor
     * @param {Number} column 
     * @param {Number} row 
     * @param {Object} scene 
     */
    constructor(column, row, scene) {

        const cellSize = scene.cellSize
        const xLeft = column * cellSize
        const yTop = row * cellSize
        super(xLeft, yTop, cellSize)

        this.scene = scene
        this.column = column
        this.row = row
        this.cellSize = cellSize
        this.isPath = false
        this.building = null
        // this.coords = null

        // this.setCoords()

        this.DOMElement = document.createElement('div')
        this.DOMElement.classList.add(scene.game.DOMConfig.gridCell.class)
        this.DOMElement.style.width = this.cellSize + 'px'
        this.DOMElement.style.height = this.cellSize + 'px'

        this.DOMElement.addEventListener('mouseup', this.handleClick.bind(this))
        this.DOMElement.addEventListener('mouseover', this.handleMouseover.bind(this))
        this.DOMElement.addEventListener('dragleave', this.handleDragleave.bind(this))
        this.DOMElement.addEventListener('dragenter', this.handleDragenter.bind(this))
        this.DOMElement.addEventListener('dragover', this.handleDragover.bind(this))
        this.DOMElement.addEventListener('drop', this.handleDrop.bind(this))

        this.id = GridCell.generateId() 
    }

    static generateId() {
        return GridCell.cellsCount++
    }

    /**
     * Calcul les coordonnées réelles sur l'écran et les sauvegarde dans les propriétés
     */
    // setCoords() {
    //     this.coords = {
    //         xMin: this.column * this.cellSize,
    //         xMax: this.column * this.cellSize + this.cellSize,
    //         yMin: this.row * this.cellSize,
    //         yMax: this.row * this.cellSize + this.cellSize
    //     }
    // }

    /**
     * Quand le drag sorts de la cell
     * @param {Event} event 
     */
    handleDragleave(event) {
        GridCell.dragCount--

        const defaultClass = this.scene.game.DOMConfig.gridCell.class
        const acceptModifier = this.scene.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.scene.game.DOMConfig.gridCell.modifiers.refuse

        this.DOMElement.classList.remove(defaultClass + acceptModifier)
        this.DOMElement.classList.remove(defaultClass + refuseModifier)

        if (GridCell.dragCount < 1) {
            this.scene.game.currentLevel.removePlacingBuildingRangeHighlight()
        }
    }
    
    /**
     * Quand le drag rentre dans la cell
     * @param {Event} event 
     */
    handleDragenter(event) {

        GridCell.dragCount++

        const defaultClass = this.scene.game.DOMConfig.gridCell.class
        const acceptModifier = this.scene.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.scene.game.DOMConfig.gridCell.modifiers.refuse
        
        if (this.isBuildable()) {
            this.DOMElement.classList.add(defaultClass + acceptModifier)
            this.scene.game.currentLevel.highlightPlacingBuildingRange(this)
        } else {
            this.DOMElement.classList.add(defaultClass + refuseModifier)
            this.scene.game.currentLevel.removePlacingBuildingRangeHighlight(this)
        }
    }
    

    /**
     * Quand le drag se finit sans un drop sur une cible valide
     * @param {Event} event 
     */
    handleDragover(event) {
        if (this.isBuildable()) {
            event.preventDefault()
        }
    }

    /**
     * Quand le drag se finit sur une cible valide
     * @param {Event} event 
     */
    handleDrop(event) {
        event.preventDefault() // Prevent opening image in window
        GridCell.dragCount = 0
        this.building = this.scene.game.currentLevel.placeBuilding(this)
        const defaultClass = this.scene.game.DOMConfig.gridCell.class
        const acceptModifier = this.scene.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.scene.game.DOMConfig.gridCell.modifiers.refuse

        this.DOMElement.classList.remove(defaultClass + acceptModifier)
        this.DOMElement.classList.remove(defaultClass + refuseModifier)        
    }

    /**
     * Mouse over
     * @param {Event} e 
     */
    handleMouseover(e) {
    }

    /**
     * Affiche les infos de la cell au click pour le debug
     * @param {Event} e 
     */
    handleClick(e) {
        const coords = this.getBoundingBox()
        console.log('Click on cell : ', { id: this.id, column: this.column, row: this.row, coords, building: this.building })
        this.scene.game.handleSceneClick(this)
    }

   /**
    * Retourne la direction de la prochaine cell sur le chemin
    * @param {Object} nextCell 
    */
    getDirection(nextCell) {
        if(this.column > nextCell.column){
            return "left"
        } else if (this.column < nextCell.column){
            return "right"
        } else if (this.row > nextCell.row){
            return "up"
        } else {
            return "down"
        }
    }

    /**
     * Retourne le côté sur lequel se trouve l'enemy en fonction de la direction
     * @param {Object} previousCell 
     */
    getSide(previousCell) {
        return this.getDirection(previousCell)
    }

    /**
     * Retourne les coordonnées du centre de la cell
     */
    // getCenterPoint() {
    //     return super.getMiddlePosition()
    //     // return {
    //     //     x: this.coords.xMin + (this.cellSize / 2),
    //     //     y: this.coords.yMin + (this.cellSize / 2)
    //     // }
    // }

    /**
     * Check si un batiment est présent sur la tour
     */
    hasBuilding() {
        return this.building !== null
    }

    /**
     * Check si la cell est une zone constructible' pour le placement de batiments
     */
    isBuildable() {
        return !this.isPath && !this.hasBuilding()
    }

    /**
     * Rendu graphique
     * @param {DOMElement} layer 
     */
    render(layer) {
        
    }

}