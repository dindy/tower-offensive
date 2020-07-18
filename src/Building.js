import * as createjs from 'createjs-module'

export default class Building {
    
    constructor()  {
        this.x = null
        this.y = null
        this.shape = null
        this.hasBeenRendered = false
        this.isPlaced = false
    }

    initRender = layer => {
        
        // Create new shape
        this.shape = new createjs.Shape()
            
        this.shape.graphics
            .beginFill('red')
            .drawRect(this.x, this.y, 50, 50)

        layer.addChild(this.shape)

        this.hasBeenRendered = true
        
    }
    
    place = (cell) => {
        this.x = cell.coords.xMin
        this.y = cell.coords.yMin  
        this.isPlaced = true
    }

    render = (layer) => {
        if (!this.hasBeenRendered && this.isPlaced) this.initRender(layer)        
    }
}