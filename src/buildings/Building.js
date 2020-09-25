export default class Building {
    
    static price = 0
    
    spriteBuilding = null
    
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
        this.isDeleted = false
    }

    renderBuilding(layer) {

        const coords = this.getMiddleCoords()

        if (this.spriteBuilding === null) {
            layer.beginPath()
            layer.rect(coords.x, coords.y, 50, 50)
            layer.fillStyle = "blue"
            layer.fill()
        } else {
            this.spriteBuilding.setTimerDiff(1)
            layer.translate(coords.x, coords.y)
            layer.drawImage(this.spriteSheet, ...this.spriteBuilding.getCurrent())
            layer.setTransform(1, 0, 0, 1, 0, 0)
        }
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
        return this.cell.getTopLeftCoords()
    }

    /**
     * Retourne les coordonnées du centre du rectangle
     */
    getMiddleCoords() {
        return this.cell.getMiddlePosition()
    }

    /**
     * Update les datas a chaque refresh
     */
    update() {

    }
}