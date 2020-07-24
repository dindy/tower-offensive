export default class GridCell {

    static cellsCount = 0

    static dragCount = 0

    coords = {}

    constructor(column, row, game) {

        this.level = game.currentLevel
        this.column = column
        this.row = row
        this.cellSize = this.level.game.cellSize
        this.isPath = false
        this.hasBuilding = false

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

    //Calculate real coordonates of cell on the screen and save it as props
    setCoords = () => {
        this.coords = {
            xMin: this.column * this.cellSize,
            xMax: this.column * this.cellSize + this.cellSize,
            yMin: this.row * this.cellSize,
            yMax: this.row * this.cellSize + this.cellSize
        }
    }

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
    // Mouse Event Handlers
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
    

    handleDragover = event => {
        if (this.isBuildable()) {
            event.preventDefault()
        }
    }

    handleDrop = event => {
        GridCell.dragCount = 0
        this.hasBuilding = true
        this.level.placeBuilding(this)
        const defaultClass = this.level.game.DOMConfig.gridCell.class
        const acceptModifier = this.level.game.DOMConfig.gridCell.modifiers.accept
        const refuseModifier = this.level.game.DOMConfig.gridCell.modifiers.refuse

        this.DOMElement.classList.remove(defaultClass + acceptModifier)
        this.DOMElement.classList.remove(defaultClass + refuseModifier)        
    }

    handleMouseover = (e) => {
    }

    handleClick = (e) => {
        console.log('Click on cell : ', { id: this.id, column: this.column, row: this.row, coords: this.coords })
    }

    // Position and direction method

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

    getSide = (previousCell) => {
        return this.getDirection(previousCell)
    }


    getCenterPoint = () => ({
        x: this.coords.xMin + (this.cellSize / 2),
        y: this.coords.yMin + (this.cellSize / 2)
    })

    isBuildable() {
        return !this.isPath && !this.hasBuilding
    }

    //Render the cell from the data
    render = (layer) => {
        
    }

}