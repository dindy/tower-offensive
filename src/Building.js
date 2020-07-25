import * as createjs from 'createjs-module'

export default class Building {
    
    /**
     * Constructor
     * @param {Object} level 
     */
    constructor(level)  {

        this.level = level
        this.shape = null
        this.hasBeenRendered = false
        this.isPlaced = false
        this.cell = null
        this.isSelected = false
    }


    select() {
        this.isSelected = true
    }
    
    unselect() {
        this.isSelected = false
    }


    /**
     * Créer la shape et l'ajoute au layer
     * @param {DOMElement} layer 
     */
    initRender(layer) {
        
        const coords = this.getTopLeftCoords() 
        
        // Create new shape
        this.shape = new createjs.Shape()
        
        this.shape.graphics
            .beginFill('blue')
            .drawRect(coords.x, coords.y, 50, 50)

        layer.addChild(this.shape)

        this.hasBeenRendered = true
        
    }
    
    /**
     * Add la cell sur laquelle est placée la tower a ses propriétées
     * @param {Object} cell 
     */
    place(cell) {
        this.cell = cell
        this.isPlaced = true
    }

    /**
     * Rendu
     * @param {DOMElement} layer 
     */
    render(layer) {
        if (!this.hasBeenRendered && this.isPlaced) this.initRender(layer)        
    }

    /**
     * Retourne les coordonnéees du coin haut-gauche du rectangle
     */
    getTopLeftCoords() {
        return {
            x : this.cell.coords.xMin,
            y : this.cell.coords.yMin
        }
    }

    /**
     * Retourne les coordonnées du centre du rectangle
     */
    getMiddleCoords() {
        const offset = this.cell.cellSize / 2
        return {
            x : this.cell.coords.xMin + offset,
            y : this.cell.coords.yMin + offset
        }
    }

    /**
     * Update les datas a chaque refresh
     */
    update() {

    }
}