export default class GridCell {

    static cellsCount = 0

    coords = {}

    constructor(column, row, level) {

        this.level = level
        this.column = column
        this.row = row
        this.cellSize = level.game.cellSize
        this.setCoords()

        this.DOMElement = document.createElement('div')
        this.DOMElement.classList.add(level.game.DOMConfig.gridCell.class)
        this.DOMElement.style.width = this.cellSize + 'px'
        this.DOMElement.style.height = this.cellSize + 'px'

        this.DOMElement.addEventListener('mouseup', this.handleClick)
        this.DOMElement.addEventListener('mouseover', this.handleMouseover)
        this.DOMElement.addEventListener('dragenter', this.handleDragenter)
        this.DOMElement.addEventListener('dragover', this.handleDragover)
        this.DOMElement.addEventListener('dragleave', this.handleDragleave)
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

    // Mouse Event Handlers
    handleDragenter = event => {
        event.target.style.opacity = .5
    }
    
    handleDragleave = event => {
        event.target.style.opacity = 0
    }

    handleDragover = event => {
        event.preventDefault()
        
    }

    handleDrop = event => {
        event.target.style.opacity = 0
        this.level.addBuilding(this)

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

    //Render the cell from the data
    render = (layer) => {
        
    }

}