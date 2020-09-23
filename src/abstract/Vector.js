import * as utils from '../utilities'

/**
 * Représente un vecteur en 2 dimensions
 */
export default class Vector {

    /**
     * Composante des abscisses
     */
    x = null

    /**
     * Composante des ordonnées
     */    
    y = null

    /**
     * @constructor Initialise les composantes du vecteur
     * @param {Numeric} x 
     * @param {Numeric} y 
     */
    constructor(x, y) {

        this.x = x
        this.y = y
    }

    /**
     * Additionne deux vecteurs
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */
    static add(v1, v2) {
        
        return new Vector( 
            v1.x + v2.x, 
            v1.y + v2.y 
        )
    }

    /**
     * Soustrait deux vecteurs
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Vector}
     */    
    static sub(v1, v2) {
        
        return new Vector( 
            v1.x - v2.x, 
            v1.y - v2.y 
        )
    }

    /**
     * Calcule l'angle entre deux points
     * @param {Vector} v1
     * @param {Vector} v2
     * @param {Boolean} convertToDegrees Retourne un angle en degrés si l'argument vaut `true` 
     * @returns {Numeric} Angle (en radians par défaut)
     */  
    static getAngle(v1, v2, convertToDegrees = false) {

        return utils.angle(v1.x, v1.y, v2.x, v2.y, convertToDegrees)
    }

    /**
     * Ajoute les coordonnées polaires à un vecteur
     * @param {Numeric} range Longueur à ajouter
     * @param {Numeric} angle Angle en radians à ajouter
     * @param {Vector} [v=Vector(0,0)] Par défaut les coordonnées sont ajoutées au point d'origine
     * @returns {Vector}
     */
    static addPolarCoordinates(range, angle, v = null) {
        
        if (v === null) v = new Vector(0, 0)

        const point = utils.addProjectionPoint(
            {x: v.x, y: v.y}, 
            range, 
            utils.radiansToDegrees(angle)
        )

        return new Vector(point.x, point.y)
    }

    /**
     * Calcule la distance entre deux points
     * @param {Vector} v1 
     * @param {Vector} v2 
     * @returns {Numeric} 
     */
    static getDistance(v1, v2) {
        
        return utils.getDistance(v1.x, v1.y, v2.x, v2.y)
    }

    /**
     * @see {@link Vector.getAngle}
     * @param {Vector} v
     * @param {Bool} convertToDegrees Wether to convert randians to degrees
     * @returns {Numeric} Angle in radians by default
     */
    getAngle(v, convertToDegrees = false) {
        return Vector.getAngle(this, v, convertToDegrees)
    }

    /**
     * @see {@link Vector.add}
     * @param {Vector} v
     * @returns {Vector}
     */
    add(v) {
        return Vector.add(this, v)
    }

    /**
     * @see {@link Vector.sub}
     * @param {Vector} v
     * @returns {Vector}
     */    
    sub(v) {
        return Vector.sub(this, v)
    }

    /**
     * @see {@link Vector.addPolarCoordinates}
     * @param {Numeric} range
     * @returns {Vector} 
     */    
    addPolarCoordinates(range, angle) {
        return Vector.addPolarCoordinates(range, angle, this)
    }

    /**
     * @see {@link Vector.getDistance}
     * @param {Vector} v
     * @returns {Numeric}
     */      
    getDistance(v) {
        return Vector.getDistance(this, v)
    }
}