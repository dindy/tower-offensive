import Thing from './Thing'
import Vector from './Vector'

/**
 * Une chose qui possède une position dans l'espace
 */
export default class Object extends Thing {

    /**
     * Vecteur représentant la position de l'objet
     */
    position = null

    /**
     * @constructor Initialise un Object avec des coordonnées
     * @param {Numeric} x 
     * @param {Numeric} y 
     */
    constructor(x, y) {

        super()

        this.position = new Vector(x,y)
    }

    /**
     * Ajoute les composants d'un vecteur à la position actuelle
     * @param {Vector} vector 
     */
    addToPosition(vector) {

        this.position = Vector.add(this.position, vector)
    }    
}