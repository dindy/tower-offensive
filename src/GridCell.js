export default class GridCell {

    coords = {}

    constructor(column, row, cellSize, layer){
        this.layer = layer,
        this.column = column,
        this.row = row
        this.cellSize = cellSize
        this.setCoords()
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

    //Render the cell from the data
    render = () => {
        let cell = new Konva.Rect({
            x: this.coords.xMin,
            y: this.coords.yMin,
            width: this.cellSize,
            height: this.cellSize,
            fill: 'grey',
            stroke: 'black',
            strokeWidth: 1,
          });

          this.layer.add(cell);
    }

}