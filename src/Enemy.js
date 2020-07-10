import * as createjs from 'createjs-module'

export default class Enemy {
    
    constructor() {
        this.isRendered = false
    }
    
    initRender = layer => {
        this.shape = new createjs.Shape()
        this.shape.graphics
            .beginFill('red')
            .drawRect(0, 0, 50, 50)
        
        layer.addChild(this.shape)
        this.isRendered = true
    }
    
    updatePosition = () => {
 
    }

    render = (layer) => {

        if (!this.isRendered) this.initRender(layer)

        this.shape.x = this.x
        this.shape.y = this.y
    }

}