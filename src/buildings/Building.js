import Rectangle from '../abstract/Rectangle'

export default class Building extends Rectangle {
    
    static price = 0
    
    spriteBuilding = null
    
    /**
     * Constructor
     * @param {Object} level 
     */
    constructor(level)  {
        
        super(0, 0, level.game.scene.cellSize)

        this.level = level
        this.shape = null
        this.isPlaced = false
        this.isSelected = false
        this.isDeleted = false
        this.cell = null
    }

    renderBuilding(layer) {

        const coords = this.getMiddlePosition()

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
        this.setPosition(cell.getTopLeftPosition())
        this.isPlaced = true
        this.cell = cell
    }

    /**
     * Rendu
     * @param {DOMElement} layer 
     */
    render(layer) {
        this.renderBuilding(layer)
    }

    /**
     * Update les datas a chaque refresh
     */
    update() {

    }
}