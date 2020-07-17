import * as createjs from 'createjs-module'

export default class Building {
    
    constructor(x, y)  {
        this.x = x
        this.y = y
        this.shape = null
        this.hasBeenRendered = false
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
    
    render = (layer) => {
        if (!this.hasBeenRendered) this.initRender(layer)        
    }
}