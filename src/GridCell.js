export default class GridCell {

    static cellsCount = 0

    coords = {}

    constructor(column, row, cellSize){
        this.column = column
        this.row = row
        this.cellSize = cellSize
        this.setCoords()
        this.fillColor = 'grey'
        this.strokeColor = 'black'
        this.strokeWidth = 1
        this.id = GridCell.generateId() 
    }

    static generateId = () => {
        return GridCell.cellsCount++
    }

    //Set data for real coordonates of cell on the screen
    setCoords = () => {
        this.coords = {
            xMin: this.column * this.cellSize,
            xMax: this.column * this.cellSize + this.cellSize,
            yMin: this.row * this.cellSize,
            yMax: this.row * this.cellSize + this.cellSize
        }
    }

    handleMouseover = (e) => {
        this.fillColor = 'lightgrey'
        var cell = e.target
        this.partialRender(cell)
    }

    handleMouseout = (e) => {
        this.fillColor = 'grey'
        var cell = e.target
        this.partialRender(cell)        
    }

    handleClick = (e) => {
        console.log('Click on cell : ', { id: this.id, column: this.column, row: this.row, coords: this.coords })
    }

    //Render the cell from the data
    render = (layer) => {
        
        let cell = new Konva.Rect({
            x: this.coords.xMin,
            y: this.coords.yMin,
            width: this.cellSize,
            height: this.cellSize,
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth,
        })

        cell.on('mouseover', this.handleMouseover)
        cell.on('mouseout', this.handleMouseout)
        cell.on('click', this.handleClick)
        layer.add(cell)
    }

    partialRender = cell => {
        cell.fill(this.fillColor)
        cell.draw()
    }

}