export default class Building {
    
    /**
     * Constructor
     * @param {Object} level 
     */
    constructor(level)  {

        this.level = level
        this.shape = null
        this.isPlaced = false
        this.cell = null
        this.isSelected = false
    }

    renderBuilding(layer) {
        const coords = this.getTopLeftCoords()
        layer.beginPath()
        layer.rect(coords.x, coords.y, 50, 50)
        layer.fillStyle = "blue"
        layer.fill()
    }

    select() {
        this.isSelected = true
    }
    
    unselect() {
        this.isSelected = false
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
        this.renderBuilding(layer)
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