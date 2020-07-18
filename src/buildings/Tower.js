import * as createjs from 'createjs-module'
import Building from '../Building.js'


export default class Tower extends Building {
    
    constructor() {
        
        super()

        this.range = 150
        this.rangeShape = null
        
    }

    highlightRange = (coords, layer) => {
        
        if(this.rangeShape == null) this.initRangeShape(layer)

        this.rangeShape.alpha  = 1
        this.rangeShape.x = coords.x
        this.rangeShape.y = coords.y

    }

    removeRangeHighlight = () => {

        this.rangeShape.alpha  = 0
    }
    
    initRangeShape = (layer) => {

        const g = new createjs.Graphics()
            .setStrokeStyle(1)
            .beginStroke(createjs.Graphics.getRGB(0,0,0))
            .beginFill(createjs.Graphics.getRGB(120,120,0,.3))
            .drawCircle(0,0, this.range)

        this.rangeShape = new createjs.Shape(g)
        
        layer.addChild(this.rangeShape)
    }

    place = (cell) => {
        
        // console.log(Object.getPrototypeOf(Object.getPrototypeOf(this)));
        // Object.getPrototypeOf(Object.getPrototypeOf(this)).place.call(this,arg);
        
        
        super.place(cell)
        // console.log(Object.getPrototypeOf(this))
        this.removeRangeHighlight()
    }

}