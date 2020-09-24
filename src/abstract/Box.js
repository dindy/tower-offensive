import * as util from '../utilities'

/**
 * Représente les 4 points du rectangle encadrant un objet de coordonnées top-left {x, y} et de dimension width x height 
 */
export default class Box {

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

    /**
     * Détermine si 2 box ont des bords qui se croisent
     * @param {Box} box1 
     * @param {Box} box2 
     * @returns {Boolean}
     */
    static bordersIntersect(box1, box2) {
        
        return util.rectangleIntersectsRectangle(box1, box2)          
    }
    
    /**
     * Détermine si un point est dans une box
     * @param {Vector} v 
     * @param {Box} box 
     * @returns {Boolean}
     */
    static pointIsInside(v, box) {

        return v.x > box.xMin && v.x < box.xMax && v.y > box.yMin && v.y < box.yMax
    }
}




