import * as createjs from 'createjs-module'

export default class Building {
    
    constructor()  {
        this.shape = null
        this.hasBeenRendered = false
        this.isPlaced = false
        this.cell = null
    }

    initRender = layer => {
        
        const coords = this.getTopLeftCoords() 
        
        // Create new shape
        this.shape = new createjs.Shape()
        
        this.shape.graphics
            .beginFill('blue')
            .drawRect(coords.x, coords.y, 50, 50)

        layer.addChild(this.shape)

        this.hasBeenRendered = true
        
    }
    
    place(cell) {
        this.cell = cell
        this.isPlaced = true
    }

    render = (layer) => {
        if (!this.hasBeenRendered && this.isPlaced) this.initRender(layer)        
    }

    getTopLeftCoords() {
        return {
            x : this.cell.coords.xMin,
            y : this.cell.coords.yMin
        }
    }

    getMiddleCoords() {
        const offset = this.cell.cellSize / 2
        return {
            x : this.cell.coords.xMin + offset,
            y : this.cell.coords.yMin + offset
        }
    }
}