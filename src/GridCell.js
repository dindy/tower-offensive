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
        
        // Create canva object
        let cell = new Konva.Rect({
            x: this.coords.xMin,
            y: this.coords.yMin,
            width: this.cellSize,
            height: this.cellSize,
            fill: this.fillColor,
            stroke: this.strokeColor,
            strokeWidth: this.strokeWidth,
        })

        // Add event to the object
        cell.on('mouseover', this.handleMouseover)
        cell.on('mouseout', this.handleMouseout)
        cell.on('click', this.handleClick)
        
        // add Cell to the layer ( draw is controlled by levels render method)
        layer.add(cell)
    }

    // Redraw the cell in case of event
    partialRender = cell => {
        cell.fill(this.fillColor)
        cell.draw()
    }

}