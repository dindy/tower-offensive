import * as createjs from 'createjs-module'

export default class Enemy {
    
    constructor() {
        this.hasBeenRendered = false
    }
    
    initRender = layer => {
        this.shape = new createjs.Shape()
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 50, 50)
        
        layer.addChild(this.shape)
        this.hasBeenRendered = true
    }
    
    updatePosition = () => {
 
    }

    render = (layer) => {

        if (!this.hasBeenRendered) this.initRender(layer)

        this.shape.x = this.x
        this.shape.y = this.y
    }

}