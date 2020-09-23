import Object from './Object'
import Vector from './Vector'
import BoundingBox from './BoundingBox'

export default class Rectangle extends Object {

    /**
     * Largeur du rectangle
     */
    width = null
    
    /**
     * Hauteur du rectangle
     */
    height = null

    /**
     * @constructor
     * @param {Numeric} x Top-left x
     * @param {Numeric} y Top-left y
     * @param {Numeric} width 
     * @param {Numeric} [height=width] 
     */
    constructor(x, y, width, height = null) {
        
        super(x, y)

        this.width = width

        this.height = height === null ? width : height
    }

    /**
     * @return {BoundingBox}
     */
    getBoundingBox() {

        return new BoundingBox(this.position, this.width, this.height)    
    }

    /**
     * @return {Vector} Coordonnées centrales du rectangle
     */
    getMiddlePosition() {

        const offset = new Vector(this.width / 2, this.height / 2)

        return Vector.add(this.position, offset)
    }

    /**
     * @return {Vector} Coordonnées top-left du rectangle 
     */
    getTopLeftPosition() {

        return this.position
    }
}