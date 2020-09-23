/**
 * Représente les 4 points du rectangle encadrant un objet de coordonnées top-left {x, y} et de dimension width x height 
 */
export default class BoundingBox {

    /**
     * Left x
     */
    xMin = null
    
    /**
     * Right x
     */
    xMax = null
    
    /**
     * Top y
     */
    yMin = null
    
    /**
     * Bottom y
     */
    yMax = null

    /**
     * @constructor Set the 4 properties
     * @param {Vector} position Top-left coordinates
     * @param {Numeric} width 
     * @param {Numeric} [height=width] 
     */
    constructor(position, width, height = null) {
        
        if (height === null) height = width

        this.xMin = position.x
        this.yMin = position.y
        this.xMax = position.x + width
        this.yMax = position.y + height
    }
}




