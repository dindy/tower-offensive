export default class GridCell {

    static cellsCount = 0

    static dragCount = 0

    coords = {}

    /**
     * Constructor
     * @param {Number} column 
     * @param {Number} row 
     * @param {Object} game 
     */
    constructor(column, row, game) {

        this.level = game.currentLevel
        this.column = column
        this.row = row
        this.cellSize = this.level.game.cellSize
        this.isPath = false
        this.building = null
        this.coords = null

        this.setCoords()

        this.DOMElement = document.createElement('div')
        this.DOMElement.classList.add(this.level.game.DOMConfig.gridCell.class)
        this.DOMElement.style.width = this.cellSize + 'px'
        this.DOMElement.style.height = this.cellSize + 'px'

        this.DOMElement.addEventListener('mouseup', this.handleClick)
        this.DOMElement.addEventListener('mouseover', this.handleMouseover)
        this.DOMElement.addEventListener('dragleave', this.handleDragleave)
        this.DOMElement.addEventListener('dragenter', this.handleDragenter)
        this.DOMElement.addEventListener('dragover', this.handleDragover)
        this.DOMElement.addEventListener('drop', this.handleDrop)

        this.id = GridCell.generateId() 
    }

    static generateId = () => {
        return GridCell.cellsCount++
    }

    /**
     * Calcul les coordonnées réelles sur l'écran et les sauvegarde dans les propriétés
     */
    setCoords = () => {
        this.coords = {
            xMin: this.column * this.cellSize,
            xMax: this.column * this.cellSize + this.cellSize,
            yMin: this.row * this.cellSize,
            yMax: this.row * this.cellSize + this.cellSize
        }
    }

    /**
     * Quand le drag sorts de la cell
     * @param {Event} event 
     */
    handleDragleave = event => {
        GridCell.dragCount--

        const defaultClass = this.level.game.DOMConfig.gridCell.class
        const acceptModifier = this.level.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.level.game.DOMConfig.gridCell.modifiers.refuse

        this.DOMElement.classList.remove(defaultClass + acceptModifier)
        this.DOMElement.classList.remove(defaultClass + refuseModifier)

        if (GridCell.dragCount < 1) {
            this.level.removePlacingBuildingRangeHighlight()
        }
    }
    
    /**
     * Quand le drag rentre dans la cell
     * @param {Event} event 
     */
    handleDragenter = event => {

        GridCell.dragCount++

        const defaultClass = this.level.game.DOMConfig.gridCell.class
        const acceptModifier = this.level.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.level.game.DOMConfig.gridCell.modifiers.refuse
        
        if (this.isBuildable()) {
            this.DOMElement.classList.add(defaultClass + acceptModifier)
            this.level.highlightPlacingBuildingRange(this)
        } else {
            this.DOMElement.classList.add(defaultClass + refuseModifier)
            this.level.removePlacingBuildingRangeHighlight(this)
        }
    }
    

    /**
     * Quand le drag se finit sans un drop sur une cible valide
     * @param {Event} event 
     */
    handleDragover = event => {
        if (this.isBuildable()) {
            event.preventDefault()
        }
    }

    /**
     * Quand le drag se finit sur une cible valide
     * @param {Event} event 
     */
    handleDrop = event => {
        GridCell.dragCount = 0
        this.building = this.level.placeBuilding(this)
        const defaultClass = this.level.game.DOMConfig.gridCell.class
        const acceptModifier = this.level.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.level.game.DOMConfig.gridCell.modifiers.refuse

        this.DOMElement.classList.remove(defaultClass + acceptModifier)
        this.DOMElement.classList.remove(defaultClass + refuseModifier)        
    }

    /**
     * Mouse over
     * @param {Event} e 
     */
    handleMouseover = (e) => {
    }

    /**
     * Affiche les infos de la cell au click pour le debug
     * @param {Event} e 
     */
    handleClick = (e) => {
        console.log('Click on cell : ', { id: this.id, column: this.column, row: this.row, coords: this.coords, building: this.building })
        this.level.unselectBuilding()
        if (this.hasBuilding()) {
            this.level.selectBuilding(this.building)
        }
    }

   /**
    * Retourne la direction de la prochaine cell sur le chemin
    * @param {Object} nextCell 
    */
    getDirection = (nextCell) => {
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
    getSide = (previousCell) => {
        return this.getDirection(previousCell)
    }

    /**
     * Retourne les coordonnées du centre de la cell
     */
    getCenterPoint = () => ({
        x: this.coords.xMin + (this.cellSize / 2),
        y: this.coords.yMin + (this.cellSize / 2)
    })

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
    render = (layer) => {
        
    }

}