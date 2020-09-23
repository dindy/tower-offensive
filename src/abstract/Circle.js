import Object from './Object'
import Vector from './Vector'
import BoundingBox from './BoundingBox'

/**
 * Représente un objet en forme de cercle
 */
export default class Circle extends Object {

    /**
     * The radius of the circle
     */
    radius = null
    
    /**
     * @constructor 
     * @param {Numeric} x Middle x
     * @param {Numeric} y Middle y
     * @param {Numeric} radius Radius
     */
    constructor(x, y, radius) {
        
        super(x, y)

        this.radius = radius
    }

    /**
     * @return {BoundingBox}
     */
    getBoundingBox() {
        
        return new BoundingBox(this.getTopLeftPosition(), this.radius * 2)  
    }    

    /**
     * @return {Vector} Coordonnées centrales du cercle
     */
    getMiddlePosition() {

        return this.position               
    }    

    /**
     * @return {Vector} Coordonnées top-left du cercle 
     */
    getTopLeftPosition() {

        const radius = this.radius
        const offset = new Vector(radius, radius)
        
        return Vector.sub(this.position, offset)

    }    
}