export default class GridCell {

    static cellsCount = 0

    coords = {}

    constructor(column, row, cellSize) {

        this.column = column
        this.row = row
        this.cellSize = cellSize
        this.setCoords()

        this.DOMElement = document.createElement('div')
        this.DOMElement.classList.add('grid__cell')
        this.DOMElement.style.width = this.cellSize + 'px'
        this.DOMElement.style.height = this.cellSize + 'px'

        this.DOMElement.addEventListener('mouseup', this.handleClick)
        this.DOMElement.addEventListener('mouseover', this.handleMouseover)

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
    handleMouseover = (e) => {
    }

    handleClick = (e) => {
        console.log('Click on cell : ', { id: this.id, column: this.column, row: this.row, coords: this.coords })
    }

    //Render the cell from the data
    render = (layer) => {
        
    }

}