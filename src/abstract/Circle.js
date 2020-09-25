import Body from './Body'
import Vector from './Vector'
import Box from './Box'

/**
 * Représente un objet en forme de cercle
 */
export default class Circle extends Body {

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
     * @return {Box}
     */
    getBoundingBox() {
        
        return new Box(this.getTopLeftPosition(), this.radius * 2)  
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